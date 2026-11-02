"""Automated ±90° lateral profile synthesis and side-view inpainting.

Sharpens lateral 3D fidelity (nose bridge, jaw, anterior chest, lumbar lordosis, glutes,
calves, and forward boot projection) when only Front and Back views are supplied.
Supports Zero123++ and SV3D diffusion connectors with a deterministic anatomical fallback.
"""

from __future__ import annotations

import importlib.util
import logging
from dataclasses import dataclass, field
from typing import Any

import cv2
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

from src.config import SideSynthesisBackend, SideSynthesizerConfig
from src.preprocessor import PreprocessedPair

logger = logging.getLogger(__name__)


@dataclass
class SynthesizedSideViews:
    """Orthogonal ±90° lateral RGBA views and canonical sagittal depth envelopes."""

    left_rgba: Image.Image  # +90° view (+X side, anterior +Z pointing right)
    right_rgba: Image.Image  # -90° view (-X side, anterior +Z pointing left)
    left_mask: np.ndarray
    right_mask: np.ndarray
    # Per-row sagittal anterior (+Z) and posterior (-Z) depth envelopes in canonical [-1, 1] units
    z_anterior_profile: np.ndarray
    z_posterior_profile: np.ndarray
    torso_half_width: float
    preview_quad_image: Image.Image
    backend_used: str = "anatomical"
    metadata: dict[str, Any] = field(default_factory=dict)


class SideViewSynthesizer:
    """Synthesizes orthogonal Left (+90°) and Right (-90°) T-pose profile views."""

    def __init__(self, config: SideSynthesizerConfig | None = None) -> None:
        self.config = config or SideSynthesizerConfig()

    def synthesize(self, preprocessed: PreprocessedPair) -> SynthesizedSideViews | None:
        """Generate ±90° side views and sagittal depth profiles if enabled."""
        if not self.config.enabled or self.config.backend == SideSynthesisBackend.NONE:
            return None

        backend = self.config.backend
        if backend == SideSynthesisBackend.AUTO:
            for candidate in (SideSynthesisBackend.ZERO123PLUS, SideSynthesisBackend.SV3D):
                if self._check_diffusion_available(candidate):
                    try:
                        return self._synthesize_with_diffusion(preprocessed, candidate)
                    except Exception as exc:
                        logger.warning(
                            "Diffusion side backend '%s' failed (%s); falling back.",
                            candidate,
                            exc,
                        )
            return self._synthesize_anatomical(preprocessed)

        if backend in (SideSynthesisBackend.ZERO123PLUS, SideSynthesisBackend.SV3D):
            if self._check_diffusion_available(backend):
                return self._synthesize_with_diffusion(preprocessed, backend)
            if self.config.allow_fallback:
                logger.warning(
                    "Side backend '%s' requires torch + diffusers; falling back to 'anatomical'.",
                    backend.value,
                )
                res = self._synthesize_anatomical(preprocessed)
                res.metadata["requested_backend"] = backend.value
                return res
            raise RuntimeError(
                f"Side-view backend '{backend.value}' unavailable: install 'torch' and 'diffusers'."
            )

        return self._synthesize_anatomical(preprocessed)

    @staticmethod
    def _check_diffusion_available(backend: SideSynthesisBackend) -> bool:
        if importlib.util.find_spec("torch") is None or importlib.util.find_spec("diffusers") is None:
            return False
        try:
            import torch

            return bool(torch.cuda.is_available())
        except Exception:
            return False

    def _synthesize_with_diffusion(
        self,
        preprocessed: PreprocessedPair,
        backend: SideSynthesisBackend,
    ) -> SynthesizedSideViews:
        """Run Zero123++ or SV3D orbital diffusion to synthesize ±90° lateral RGBA views."""
        import torch
        from diffusers import DiffusionPipeline

        s = preprocessed.front_rgba.width
        if backend == SideSynthesisBackend.ZERO123PLUS:
            pipe = DiffusionPipeline.from_pretrained(
                self.config.zero123_model_id,
                torch_dtype=torch.float16,
            ).to("cuda")
            grid_img = pipe(preprocessed.front_rgba, num_inference_steps=36).images[0]
            gw, gh = grid_img.size
            # Zero123++ 2x3 grid: extract near-orthogonal azimuth tiles and resize to canonical canvas
            right_raw = grid_img.crop((0, gh // 3, gw // 2, 2 * gh // 3)).resize((s, s))
            left_raw = grid_img.crop((gw // 2, 2 * gh // 3, gw, gh)).resize((s, s))
        else:
            pipe = DiffusionPipeline.from_pretrained(
                self.config.sv3d_model_id,
                torch_dtype=torch.float16,
            ).to("cuda")
            frames = pipe(preprocessed.front_rgba.convert("RGB"), num_frames=21).frames[0]
            right_raw = frames[5].resize((s, s))
            left_raw = frames[16].resize((s, s))

        # Anchor vertical spans against anatomical profile to maintain pixel-exact alignment
        anat = self._synthesize_anatomical(preprocessed)
        left_rgba = left_raw.convert("RGBA")
        right_rgba = right_raw.convert("RGBA")
        left_rgba.putalpha(Image.fromarray(anat.left_mask))
        right_rgba.putalpha(Image.fromarray(anat.right_mask))

        quad = self._render_quad_preview(
            preprocessed.front_rgba, left_rgba, preprocessed.back_rgba, right_rgba, backend.value
        )
        return SynthesizedSideViews(
            left_rgba=left_rgba,
            right_rgba=right_rgba,
            left_mask=anat.left_mask,
            right_mask=anat.right_mask,
            z_anterior_profile=anat.z_anterior_profile,
            z_posterior_profile=anat.z_posterior_profile,
            torso_half_width=anat.torso_half_width,
            preview_quad_image=quad,
            backend_used=backend.value,
            metadata={**anat.metadata, "diffusion_model": backend.value},
        )

    def _synthesize_anatomical(self, preprocessed: PreprocessedPair) -> SynthesizedSideViews:
        """Synthesize sagittal S-curve silhouettes and horizon-inpainted ±90° side RGBA views."""
        s = preprocessed.front_mask.shape[0]
        px_unit = 2.0 / float(s - 1)

        mf = preprocessed.front_mask > 110
        mb_world = preprocessed.back_mask[:, ::-1] > 110
        sil = mf | mb_world
        ys, xs = np.where(sil)
        if len(xs) == 0:
            raise ValueError("Cannot synthesize side views from empty foreground silhouette.")

        r_top, r_bot = int(ys.min()), int(ys.max())
        fig_h = max(r_bot - r_top, 1)
        rows = np.arange(s, dtype=np.float32)
        h_norm = np.clip((r_bot - rows) / float(fig_h), 0.0, 1.0)
        inside_y = (rows >= r_top) & (rows <= r_bot)

        # Measure torso half-width at chest/ribcage band
        torso_half_w = self._measure_torso_half_width(sil, h_norm, px_unit)

        # Detect dorsal backpack / cape / gear salience from central Back vs Front contrast
        dorsal_bonus = self._estimate_dorsal_gear_protrusion(
            preprocessed.front_rgb, preprocessed.back_rgb, sil, h_norm, torso_half_w
        )

        # Parametric sagittal anterior (+Z) and posterior (-Z) anatomical curves
        z_ant = np.zeros(s, dtype=np.float32)
        z_post = np.zeros(s, dtype=np.float32)

        w = torso_half_w
        for r in range(r_top, r_bot + 1):
            h = float(h_norm[r])
            if h >= 0.84:
                # Cranium, brow, nose bridge/tip, lips, chin, occipital curve
                u = (h - 0.920) / 0.080
                dome_h = float(np.sqrt(max(0.0, 1.0 - min(u * u, 1.0))))
                nose = 0.145 * float(np.exp(-(((h - 0.906) / 0.016) ** 2)))
                lips_chin = 0.055 * float(np.exp(-(((h - 0.868) / 0.015) ** 2)))
                brow = 0.035 * float(np.exp(-(((h - 0.942) / 0.014) ** 2)))
                z_ant[r] = w * (0.58 * dome_h + nose + lips_chin + brow)
                z_post[r] = w * (0.68 * dome_h)
            elif h >= 0.80:
                # Neck transition with recessed submental anterior tuck
                t_neck = (h - 0.80) / 0.04
                z_ant[r] = w * (0.35 - 0.03 * np.sin(np.pi * t_neck))
                z_post[r] = w * 0.37
            elif h >= 0.46:
                # Thorax, sternum/pectoralis, lumbar lordosis (inward waist curve), and glutes
                chest_ant = 0.17 * float(np.exp(-(((h - 0.695) / 0.075) ** 2)))
                abdomen_tuck = -0.045 * float(np.exp(-(((h - 0.565) / 0.055) ** 2)))
                pelvis_ant = 0.04 * float(np.exp(-(((h - 0.49) / 0.045) ** 2)))

                upper_back = 0.14 * float(np.exp(-(((h - 0.715) / 0.075) ** 2)))
                lumbar_inward = -0.11 * float(np.exp(-(((h - 0.575) / 0.055) ** 2)))
                glute_curve = 0.15 * float(np.exp(-(((h - 0.480) / 0.050) ** 2)))

                z_ant[r] = w * (0.48 + chest_ant + abdomen_tuck + pelvis_ant)
                z_post[r] = w * (0.48 + upper_back + lumbar_inward + glute_curve + dorsal_bonus[r])
            elif h >= 0.065:
                # Thighs (anterior quad), patella/kneepad, posterior calf (gastrocnemius), ankle taper
                t_leg = (h - 0.065) / (0.46 - 0.065)  # 0 at ankle, 1 at hip
                quad_curve = 0.07 * float(np.exp(-(((h - 0.36) / 0.07) ** 2)))
                kneepad = 0.035 * float(np.exp(-(((h - 0.255) / 0.03) ** 2)))
                calf_post = 0.10 * float(np.exp(-(((h - 0.185) / 0.055) ** 2)))

                base_leg = 0.27 + 0.14 * t_leg
                z_ant[r] = w * (base_leg + quad_curve + kneepad)
                z_post[r] = w * (base_leg + calf_post)
            else:
                # Forward-projecting boot toe-box (+Z) & sculpted heel (-Z)
                t_foot = (0.065 - h) / 0.065  # 0 at ankle, 1 at sole
                sole_round = float(np.sqrt(max(0.0, 1.0 - max(0.0, (t_foot - 0.78) / 0.22) ** 2)))
                toe_ext = 0.46 * float(np.sin(min(1.0, t_foot * 1.25) * (np.pi * 0.5))) * sole_round
                heel_ext = 0.07 * float(np.sin(min(1.0, t_foot * 1.2) * (np.pi * 0.5)))
                z_ant[r] = w * (0.28 + toe_ext)
                z_post[r] = w * (0.30 + heel_ext)

        z_ant = ndimage.gaussian_filter1d(z_ant, sigma=max(1.2, s * 0.004)) * inside_y
        z_post = ndimage.gaussian_filter1d(z_post, sigma=max(1.2, s * 0.004)) * inside_y

        # Render Left (+90°, +Z right) and Right (-90°, +Z left) RGBA images via horizon inpainting
        left_rgba_arr, left_mask = self._render_lateral_view(
            preprocessed=preprocessed,
            z_ant=z_ant,
            z_post=z_post,
            h_norm=h_norm,
            torso_half_w=w,
            side_sign=+1,
        )
        right_rgba_arr, right_mask = self._render_lateral_view(
            preprocessed=preprocessed,
            z_ant=z_ant,
            z_post=z_post,
            h_norm=h_norm,
            torso_half_w=w,
            side_sign=-1,
        )

        left_pil = Image.fromarray(left_rgba_arr, mode="RGBA")
        right_pil = Image.fromarray(right_rgba_arr, mode="RGBA")
        quad = self._render_quad_preview(
            preprocessed.front_rgba, left_pil, preprocessed.back_rgba, right_pil, "anatomical"
        )

        meta = {
            "backend": "anatomical",
            "torso_half_width_canonical": round(float(w), 4),
            "max_anterior_z": round(float(z_ant.max()), 4),
            "max_posterior_z": round(float(z_post.max()), 4),
            "dorsal_gear_detected": bool(dorsal_bonus.max() > 0.02),
        }
        return SynthesizedSideViews(
            left_rgba=left_pil,
            right_rgba=right_pil,
            left_mask=left_mask,
            right_mask=right_mask,
            z_anterior_profile=z_ant,
            z_posterior_profile=z_post,
            torso_half_width=float(w),
            preview_quad_image=quad,
            backend_used="anatomical",
            metadata=meta,
        )

    @staticmethod
    def _measure_torso_half_width(sil: np.ndarray, h_norm: np.ndarray, px_unit: float) -> float:
        s = sil.shape[0]
        chest_rows = np.where((h_norm >= 0.52) & (h_norm <= 0.74))[0]
        center_c = s // 2
        spans: list[float] = []
        for r in chest_rows:
            row_mask = sil[r]
            rg = np.where(~row_mask[center_c:])[0]
            lg = np.where(~row_mask[:center_c][::-1])[0]
            rw = int(rg[0]) if len(rg) > 0 else s // 6
            lw = int(lg[0]) if len(lg) > 0 else s // 6
            if rw > 4 and lw > 4:
                spans.append(0.5 * (rw + lw) * px_unit)
        val = float(np.median(spans)) if spans else 0.16
        return float(np.clip(val, 0.09, 0.34))

    @staticmethod
    def _estimate_dorsal_gear_protrusion(
        front_rgb: np.ndarray,
        back_rgb: np.ndarray,
        sil: np.ndarray,
        h_norm: np.ndarray,
        torso_half_w: float,
    ) -> np.ndarray:
        """Detect dorsal backpack/hood bulge on the upper back to preserve gear thickness in profile."""
        s = front_rgb.shape[0]
        bonus = np.zeros(s, dtype=np.float32)
        c_mid = s // 2
        half_px = max(6, int(torso_half_w * 0.45 * (s * 0.5)))
        back_gray = cv2.cvtColor(back_rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0

        upper_rows = np.where((h_norm >= 0.56) & (h_norm <= 0.77))[0]
        if len(upper_rows) < 6:
            return bonus

        gx = np.abs(cv2.Sobel(back_gray, cv2.CV_32F, 1, 0, ksize=3))
        for r in upper_rows:
            patch_edge = float(gx[r, max(0, c_mid - half_px) : min(s, c_mid + half_px)].mean())
            if patch_edge > 0.08:
                bonus[r] = min(0.12, patch_edge * 0.45)
        return ndimage.gaussian_filter1d(bonus, sigma=4.0)

    @staticmethod
    def _render_lateral_view(
        preprocessed: PreprocessedPair,
        z_ant: np.ndarray,
        z_post: np.ndarray,
        h_norm: np.ndarray,
        torso_half_w: float,
        side_sign: int,
    ) -> tuple[np.ndarray, np.ndarray]:
        """Inpaint an orthogonal ±90° RGBA side view from lateral boundary colors & sagittal contours."""
        s = preprocessed.front_rgb.shape[0]
        rgba = np.zeros((s, s, 4), dtype=np.uint8)

        f_rgb = preprocessed.front_rgb.astype(np.float32)
        b_rgb = preprocessed.back_rgb.astype(np.float32)
        fm = preprocessed.front_mask > 96
        bm = preprocessed.back_mask > 96

        # Extract lateral rim colors from the corresponding side of Front & Back images
        # side_sign == +1 -> character's LEFT (+X): right edge of Front image, left edge of Back image
        front_rim_col = np.zeros((s, 3), dtype=np.float32)
        back_rim_col = np.zeros((s, 3), dtype=np.float32)

        center_c = s // 2
        max_torso_px = int(torso_half_w * 1.15 * (s * 0.5))

        for r in range(s):
            # Restrict rim sampling to torso/head/leg column band (ignoring far arm tips except at shoulder)
            c_lo = max(0, center_c - max_torso_px)
            c_hi = min(s, center_c + max_torso_px)
            f_xs = np.where(fm[r, c_lo:c_hi])[0] + c_lo
            b_xs = np.where(bm[r, c_lo:c_hi])[0] + c_lo
            if len(f_xs) == 0:
                f_xs = np.where(fm[r])[0]
            if len(b_xs) == 0:
                b_xs = np.where(bm[r])[0]

            if len(f_xs) > 0:
                fc = int(f_xs[-1] if side_sign > 0 else f_xs[0])
                fc_in = int(np.clip(fc - side_sign * 4, 0, s - 1))
                front_rim_col[r] = f_rgb[r, fc_in]
            if len(b_xs) > 0:
                bc = int(b_xs[0] if side_sign > 0 else b_xs[-1])
                bc_in = int(np.clip(bc + side_sign * 4, 0, s - 1))
                back_rim_col[r] = b_rgb[r, bc_in]

        # Canonical Z coordinate across horizontal image columns:
        # Left view (+90°): +Z (anterior) points RIGHT (+col). Right view (-90°): +Z points LEFT (-col).
        z_cols = ((np.arange(s, dtype=np.float32) / float(s - 1)) * 2.0 - 1.0) * float(side_sign)

        for r in range(s):
            za = float(z_ant[r])
            zp = float(z_post[r])
            if za + zp < 1e-4:
                continue
            inside = (z_cols >= -zp) & (z_cols <= za)
            if not np.any(inside):
                continue

            # Normalized anterior-posterior blend t_ap in [0 (back -zp), 1 (front +za)]
            t_ap = np.clip((z_cols[inside] + zp) / max(za + zp, 1e-5), 0.0, 1.0)
            # Smooth S-curve color transition across lateral horizon
            w_front = t_ap * t_ap * (3.0 - 2.0 * t_ap)
            base_col = front_rim_col[r][None, :] * w_front[:, None] + back_rim_col[r][None, :] * (
                1.0 - w_front[:, None]
            )

            # Cylindrical lateral Lambertian shading
            u_centered = 2.0 * t_ap - 1.0
            nx_lat = np.sqrt(np.clip(1.0 - u_centered * u_centered, 0.05, 1.0))
            shade = 0.52 + 0.48 * nx_lat[:, None]
            rgba[r, inside, :3] = np.clip(base_col * shade, 0.0, 255.0).astype(np.uint8)
            rgba[r, inside, 3] = 255

        # Overlay foreshortened T-pose hand/cuff disk seen end-on at shoulder height
        arm_cols = np.where(fm.sum(axis=0) > 0)[0]
        if len(arm_cols) > 0:
            tip_c = int(arm_cols[-1] if side_sign > 0 else arm_cols[0])
            arm_ys = np.where(fm[:, tip_c])[0]
            if len(arm_ys) > 0:
                cy_arm = int(np.median(arm_ys))
                r_arm_px = max(6, int(0.052 * (s * 0.5)))
                hand_col = tuple(int(v) for v in f_rgb[cy_arm, tip_c])
                cv2.circle(rgba, (s // 2, cy_arm), r_arm_px, (*hand_col, 255), -1, cv2.LINE_AA)

        alpha_smooth = cv2.GaussianBlur(rgba[:, :, 3].astype(np.float32), (3, 3), 0.65)
        rgba[:, :, 3] = np.clip(alpha_smooth, 0.0, 255.0).astype(np.uint8)
        return rgba, rgba[:, :, 3].copy()

    @staticmethod
    def _render_quad_preview(
        front_rgba: Image.Image,
        left_rgba: Image.Image,
        back_rgba: Image.Image,
        right_rgba: Image.Image,
        backend_label: str,
    ) -> Image.Image:
        """Compose a 4-panel orthogonal turnaround preview (0° | +90° | 180° | -90°)."""
        tile = 256
        panels = [
            ("0° Front", front_rgba.resize((tile, tile), Image.Resampling.LANCZOS)),
            ("+90° Left (Synth)", left_rgba.resize((tile, tile), Image.Resampling.LANCZOS)),
            ("180° Back", back_rgba.resize((tile, tile), Image.Resampling.LANCZOS)),
            ("-90° Right (Synth)", right_rgba.resize((tile, tile), Image.Resampling.LANCZOS)),
        ]
        w_tot = tile * 4 + 30
        h_tot = tile + 42
        canvas = Image.new("RGBA", (w_tot, h_tot), (22, 26, 34, 255))
        draw = ImageDraw.Draw(canvas)

        for idx, (title, img) in enumerate(panels):
            px = 6 + idx * (tile + 6)
            draw.rectangle([px, 34, px + tile - 1, 34 + tile - 1], fill=(32, 38, 49, 255))
            draw.line([(px + tile // 2, 34), (px + tile // 2, 34 + tile - 1)], fill=(58, 72, 96, 180))
            canvas.alpha_composite(img, dest=(px, 34))
            draw.text((px + 8, 10), f"{title}", fill=(220, 230, 244, 255))

        tag = f"Side Mode: {backend_label}"
        draw.text((w_tot - len(tag) * 6 - 14, 10), tag, fill=(105, 224, 185, 255))
        return canvas.convert("RGB")
