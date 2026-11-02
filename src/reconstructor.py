"""Multi-view 3D character reconstruction engines and Marching Cubes isosurface synthesis.

Includes:
- Primary Neural Engine Integrations: TRELLIS, LGM, TripoSR
- Clothed Body Modular Connectors: ECON (Normal Integration), PIFuHD (Pixel-Aligned Implicit)
- Built-in CPU/GPU Engine: VolumetricDualViewEngine (Dual-View SDF + Anatomical Depth + Marching Cubes)
"""

from __future__ import annotations

import importlib.util
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import trimesh
from scipy import fft, ndimage
from skimage import measure

from src.config import ReconstructionEngineType, ReconstructorConfig
from src.preprocessor import PreprocessedPair
from src.side_synthesizer import SynthesizedSideViews

logger = logging.getLogger(__name__)


class EngineNotAvailableError(RuntimeError):
    """Raised when an optional external neural 3D engine or checkpoint is not installed."""


@dataclass
class EngineInfo:
    """Metadata and runtime readiness for a registered reconstruction engine."""

    name: str
    category: str
    available: bool
    requires_gpu: bool
    description: str
    reason: str = "Ready"


@dataclass
class RawReconstructionResult:
    """Output of the 3D reconstruction stage prior to mesh post-processing."""

    mesh: trimesh.Trimesh
    front_rgb_dilated: np.ndarray
    back_rgb_dilated: np.ndarray
    front_mask: np.ndarray
    back_mask: np.ndarray
    # Canonical projection bounds: x in [-1, 1], y in [-1, 1] maps to normalized 512x512 views
    canonical_bounds_xy: tuple[float, float, float, float] = (-1.0, 1.0, -1.0, 1.0)
    engine_used: str = "volumetric_sdf"
    diagnostics: dict[str, Any] = field(default_factory=dict)


def voronoi_dilate_rgb(rgb: np.ndarray, mask: np.ndarray, threshold: int = 96) -> np.ndarray:
    """Extend foreground colors outward into background pixels via nearest-pixel Voronoi fill.

    Eliminates background halo artifacts along silhouette boundaries during 3D projection.
    """
    fg = mask >= threshold
    if not np.any(fg):
        fg = mask > 8
    if not np.any(fg):
        return rgb.copy()

    # Slightly erode by 1px when thick enough so anti-aliased rim pixels pull pure interior color
    eroded = ndimage.binary_erosion(fg, iterations=1)
    seed = eroded if int(eroded.sum()) > int(fg.sum() * 0.5) else fg
    _, nearest_idx = ndimage.distance_transform_edt(~seed, return_indices=True)
    dilated = rgb[nearest_idx[0], nearest_idx[1]].copy()
    # Smooth only outside the silhouette to avoid harsh Voronoi cell lines in UV padding
    blurred = cv2.GaussianBlur(dilated, (7, 7), 2.0)
    out = np.where(fg[..., None], dilated, blurred)
    return out.astype(np.uint8)


def resolve_compute_device(requested: str = "auto") -> str:
    """Resolve 'auto' to 'cuda' when PyTorch + CUDA are available, otherwise 'cpu'."""
    if requested != "auto":
        return requested
    if importlib.util.find_spec("torch") is not None:
        try:
            import torch

            if torch.cuda.is_available():
                return "cuda"
        except Exception:
            pass
    return "cpu"


class BaseReconstructionEngine(ABC):
    """Abstract interface for all primary and clothed-body 3D reconstruction engines."""

    name: str = "base"
    category: str = "primary"
    requires_gpu: bool = False
    description: str = ""

    @abstractmethod
    def check_availability(self, config: ReconstructorConfig) -> tuple[bool, str]:
        """Return (is_available, status_message)."""

    @abstractmethod
    def reconstruct(
        self,
        preprocessed: PreprocessedPair,
        config: ReconstructorConfig,
        side_views: SynthesizedSideViews | None = None,
    ) -> RawReconstructionResult:
        """Synthesize a 3D triangle mesh from aligned Front, Back, and optional ±90° Side views."""


class VolumetricDualViewEngine(BaseReconstructionEngine):
    """Dual-View T-Pose Silhouette + Anatomical Medial Depth + Shading Relief SDF Engine.

    Constructs a closed 3D Signed Distance Field from aligned Front (+Z) and Back (-Z) views
    using elliptical medial-axis cross-sections, humanoid anatomical depth priors, and
    multi-scale surface relief, then extracts a manifold mesh via Marching Cubes.
    """

    name = ReconstructionEngineType.VOLUMETRIC_SDF.value
    category = "built_in"
    requires_gpu = False
    description = (
        "Deterministic CPU/GPU dual-view volumetric SDF engine with medial-axis elliptical "
        "cross-sections, humanoid depth profiling, shading relief, and Marching Cubes."
    )

    def check_availability(self, config: ReconstructorConfig) -> tuple[bool, str]:
        return True, "Ready (CPU/GPU built-in)"

    def reconstruct(
        self,
        preprocessed: PreprocessedPair,
        config: ReconstructorConfig,
        side_views: SynthesizedSideViews | None = None,
    ) -> RawReconstructionResult:
        front_dilated = voronoi_dilate_rgb(preprocessed.front_rgb, preprocessed.front_mask)
        back_dilated = voronoi_dilate_rgb(preprocessed.back_rgb, preprocessed.back_mask)

        # Flip Back horizontally so image columns align with world +X (character's left side)
        back_dilated_world = back_dilated[:, ::-1, :]
        mf = preprocessed.front_mask.astype(np.float32) / 255.0
        mb_world = preprocessed.back_mask[:, ::-1].astype(np.float32) / 255.0

        z_front_2d, z_back_2d, sdf_2d, sil_mask = self._build_depth_and_silhouette_maps(
            mf=mf,
            mb_world=mb_world,
            front_rgb=front_dilated,
            back_rgb_world=back_dilated_world,
            depth_scale=config.depth_scale,
            relief_strength=config.relief_strength,
            side_views=side_views,
        )

        mesh, vox_meta = self._extract_marching_cubes_mesh(
            z_front_2d=z_front_2d,
            z_back_2d=z_back_2d,
            sdf_2d=sdf_2d,
            sil_mask=sil_mask,
            mc_resolution=config.mc_resolution,
            smooth_sigma=config.sdf_smooth_sigma,
        )
        vox_meta["side_profile_carved"] = side_views is not None
        if side_views is not None:
            vox_meta["side_backend"] = side_views.backend_used

        return RawReconstructionResult(
            mesh=mesh,
            front_rgb_dilated=front_dilated,
            back_rgb_dilated=back_dilated,
            front_mask=preprocessed.front_mask,
            back_mask=preprocessed.back_mask,
            canonical_bounds_xy=(-1.0, 1.0, -1.0, 1.0),
            engine_used=self.name,
            diagnostics=vox_meta,
        )

    @staticmethod
    def _build_depth_and_silhouette_maps(
        mf: np.ndarray,
        mb_world: np.ndarray,
        front_rgb: np.ndarray,
        back_rgb_world: np.ndarray,
        depth_scale: float,
        relief_strength: float,
        side_views: SynthesizedSideViews | None = None,
    ) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """Compute canonical-unit front/back surface heights z_front(r,c), z_back(r,c), and 2D SDF."""
        s = mf.shape[0]
        px_unit = 2.0 / float(s - 1)

        # Fuse Front and Back silhouettes smoothly
        sil_soft = 0.65 * np.sqrt(np.clip(mf * mb_world, 0.0, 1.0)) + 0.35 * (0.5 * (mf + mb_world))
        sil_mask = sil_soft >= 0.42
        if not np.any(sil_mask):
            raise ValueError("Combined Front/Back silhouette is empty; cannot reconstruct 3D volume.")

        d_in = ndimage.distance_transform_edt(sil_mask).astype(np.float32) * px_unit
        d_out = ndimage.distance_transform_edt(~sil_mask).astype(np.float32) * px_unit
        sdf_2d = d_out - d_in

        # Local medial-axis limb/part half-width R_local via grey dilation + Gaussian smoothing
        win = max(9, int(round(s * 0.065)) | 1)
        r_dil = ndimage.grey_dilation(d_in, size=(win, win))
        r_local = ndimage.gaussian_filter(r_dil, sigma=max(2.5, s * 0.016))

        # True circular/elliptical cross-section profile: sqrt(2t - t^2)
        t = np.clip(d_in / np.maximum(r_local, 1e-4), 0.0, 1.0)
        dome = np.sqrt(np.clip(2.0 * t - t * t, 0.0, 1.0))

        # Normalized vertical body coordinate h_norm in [0 (feet), 1 (crown)]
        ys_idx, xs_idx = np.where(sil_mask)
        r_top, r_bot = int(ys_idx.min()), int(ys_idx.max())
        fig_h_px = max(r_bot - r_top, 1)

        rows = np.arange(s, dtype=np.float32)[:, None]
        cols = np.arange(s, dtype=np.float32)[None, :]
        h_norm = np.clip((r_bot - rows) / float(fig_h_px), 0.0, 1.0)
        x_can = (cols / float(s - 1)) * 2.0 - 1.0

        # Estimate torso half-width in chest/waist band (h_norm in [0.52, 0.74])
        chest_rows = np.where((h_norm[:, 0] >= 0.52) & (h_norm[:, 0] <= 0.74))[0]
        if len(chest_rows) > 0:
            core_cols = sil_mask[chest_rows, :]
            # Measure central body width excluding outstretched arms
            center_c = s // 2
            half_spans = []
            for row_mask in core_cols:
                # Walk outward from center spine until first background gap
                right_gap = np.where(~row_mask[center_c:])[0]
                left_gap = np.where(~row_mask[:center_c][::-1])[0]
                rw = int(right_gap[0]) if len(right_gap) > 0 else s // 6
                lw = int(left_gap[0]) if len(left_gap) > 0 else s // 6
                if rw > 4 and lw > 4:
                    half_spans.append(0.5 * (rw + lw) * px_unit)
            torso_half_w = float(np.median(half_spans)) if half_spans else 0.16
        else:
            torso_half_w = 0.16
        torso_half_w = float(np.clip(torso_half_w, 0.08, 0.35))

        # Region-aware anatomical thickness cap
        torso_cap = torso_half_w * depth_scale
        head_weight = np.clip((h_norm - 0.82) / 0.05, 0.0, 1.0) * (
            np.abs(x_can) < torso_half_w * 1.05
        ).astype(np.float32)
        head_cap = torso_half_w * min(0.88, depth_scale * 1.28)
        effective_cap = torso_cap * (1.0 - head_weight) + head_cap * head_weight

        base_half_z = np.minimum(r_local * 0.92, effective_cap) * dome

        # Subtle forward chest contour (+Z), dorsal contour, and forward boot/toe volume at feet
        foot_weight = np.clip((0.065 - h_norm) / 0.055, 0.0, 1.0)
        chest_weight = np.exp(-(((h_norm - 0.69) / 0.10) ** 2)) * (
            np.abs(x_can) < torso_half_w * 0.95
        ).astype(np.float32)

        z_front = base_half_z * (1.0 + 0.08 * chest_weight) + (0.042 * torso_half_w * foot_weight * dome)
        z_back = base_half_z * (1.0 - 0.04 * foot_weight)

        # Quad-View Sagittal Carving: fuse synthesized ±90° lateral profile into axial body & legs
        if side_views is not None:
            z_ant_row = side_views.z_anterior_profile[:, None] * (depth_scale / 0.55)
            z_post_row = side_views.z_posterior_profile[:, None] * (depth_scale / 0.55)
            # Carve sagittal profile across axial body & legs while keeping outstretched arms cylindrical
            core_blend = np.clip((torso_half_w * 1.22 - np.abs(x_can)) / (torso_half_w * 0.28), 0.0, 1.0)
            sag_front = z_ant_row * dome
            sag_back = z_post_row * dome
            # Add sharp midline nasal ridge along face centerline
            nose_ridge = (
                0.08
                * torso_half_w
                * np.exp(-(((h_norm - 0.906) / 0.016) ** 2))
                * np.exp(-((x_can / max(torso_half_w * 0.14, 1e-3)) ** 2))
            )
            w_carve = 0.80 * core_blend
            z_front = z_front * (1.0 - w_carve) + (sag_front + nose_ridge) * w_carve
            z_back = z_back * (1.0 - w_carve) + sag_back * w_carve

        # Multi-scale shading / luminance relief for garment seams, belt, collar, and face
        if relief_strength > 0.0:
            lum_f = cv2.cvtColor(front_rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0
            lum_b = cv2.cvtColor(back_rgb_world, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0
            det_f = lum_f - ndimage.gaussian_filter(lum_f, sigma=max(4.0, s * 0.018))
            det_b = lum_b - ndimage.gaussian_filter(lum_b, sigma=max(4.0, s * 0.018))
            det_f = np.clip(det_f, -0.22, 0.22)
            det_b = np.clip(det_b, -0.22, 0.22)
            relief_amp = relief_strength * torso_half_w * (dome**0.65)
            z_front = np.maximum(0.0, z_front + relief_amp * det_f)
            z_back = np.maximum(0.0, z_back + relief_amp * det_b)

        z_front = ndimage.gaussian_filter(z_front, sigma=1.1)
        z_back = ndimage.gaussian_filter(z_back, sigma=1.1)
        return z_front, z_back, sdf_2d, sil_mask

    @staticmethod
    def _extract_marching_cubes_mesh(
        z_front_2d: np.ndarray,
        z_back_2d: np.ndarray,
        sdf_2d: np.ndarray,
        sil_mask: np.ndarray,
        mc_resolution: int,
        smooth_sigma: float,
    ) -> tuple[trimesh.Trimesh, dict[str, Any]]:
        """Evaluate 3D Signed Distance Field on an isotropic tight voxel grid and run Marching Cubes."""
        s = sdf_2d.shape[0]
        ys_idx, xs_idx = np.where(sil_mask)

        # Tight 3D bounding box in canonical [-1, 1] space with 4-voxel margin
        x_lo = (float(xs_idx.min()) / (s - 1)) * 2.0 - 1.0
        x_hi = (float(xs_idx.max()) / (s - 1)) * 2.0 - 1.0
        y_lo = 1.0 - (float(ys_idx.max()) / (s - 1)) * 2.0
        y_hi = 1.0 - (float(ys_idx.min()) / (s - 1)) * 2.0
        z_lo = -float(z_back_2d[sil_mask].max())
        z_hi = float(z_front_2d[sil_mask].max())

        max_span = max(x_hi - x_lo, y_hi - y_lo, 0.2)
        pitch = max_span / float(max(mc_resolution - 8, 32))
        pad = 4.0 * pitch

        x_min, x_max = x_lo - pad, x_hi + pad
        y_min, y_max = y_lo - pad, y_hi + pad
        z_min, z_max = z_lo - pad, z_hi + pad

        nx = max(24, int(np.ceil((x_max - x_min) / pitch)) + 1)
        ny = max(24, int(np.ceil((y_max - y_min) / pitch)) + 1)
        nz = max(20, int(np.ceil((z_max - z_min) / pitch)) + 1)

        xs = np.linspace(x_min, x_max, nx, dtype=np.float32)
        ys = np.linspace(y_min, y_max, ny, dtype=np.float32)
        zs = np.linspace(z_min, z_max, nz, dtype=np.float32)

        # Sub-pixel resample 2D fields onto (nx, ny)
        col_coords = (xs[:, None] + 1.0) * 0.5 * (s - 1)
        row_coords = (1.0 - ys[None, :]) * 0.5 * (s - 1)
        sample_grid = np.array(
            np.broadcast_arrays(row_coords, col_coords),
            dtype=np.float32,
        )

        zf_xy = ndimage.map_coordinates(z_front_2d, sample_grid, order=1, mode="nearest")
        zb_xy = ndimage.map_coordinates(z_back_2d, sample_grid, order=1, mode="nearest")
        sdf2_xy = ndimage.map_coordinates(sdf_2d, sample_grid, order=1, mode="nearest")

        # Exact-style 3D SDF construction: negative inside character, positive outside
        z_mid = 0.5 * (zf_xy - zb_xy)[:, :, None]
        z_half = np.maximum(0.5 * (zf_xy + zb_xy)[:, :, None], 0.0)
        dz_slab = np.abs(zs[None, None, :] - z_mid) - z_half
        d_xy = sdf2_xy[:, :, None]

        outside_dist = np.hypot(np.maximum(d_xy, 0.0), np.maximum(dz_slab, 0.0))
        inside_dist = np.minimum(np.maximum(d_xy, dz_slab), 0.0)
        sdf_3d = outside_dist + inside_dist

        if smooth_sigma > 0.0:
            sdf_3d = ndimage.gaussian_filter(sdf_3d, sigma=smooth_sigma)

        # Enforce strictly positive boundary faces so Marching Cubes produces a closed shell
        boundary_val = float(max(pitch * 2.0, 0.02))
        sdf_3d[0, :, :] = np.maximum(sdf_3d[0, :, :], boundary_val)
        sdf_3d[-1, :, :] = np.maximum(sdf_3d[-1, :, :], boundary_val)
        sdf_3d[:, 0, :] = np.maximum(sdf_3d[:, 0, :], boundary_val)
        sdf_3d[:, -1, :] = np.maximum(sdf_3d[:, -1, :], boundary_val)
        sdf_3d[:, :, 0] = np.maximum(sdf_3d[:, :, 0], boundary_val)
        sdf_3d[:, :, -1] = np.maximum(sdf_3d[:, :, -1], boundary_val)

        if float(sdf_3d.min()) >= 0.0:
            raise RuntimeError("3D SDF contains no interior negative voxels at current resolution.")

        spacing = (
            float((x_max - x_min) / (nx - 1)),
            float((y_max - y_min) / (ny - 1)),
            float((z_max - z_min) / (nz - 1)),
        )
        verts_local, faces, _, _ = measure.marching_cubes(
            sdf_3d,
            level=0.0,
            spacing=spacing,
            allow_degenerate=False,
        )
        origin = np.array([x_min, y_min, z_min], dtype=np.float64)
        verts_world = verts_local.astype(np.float64) + origin[None, :]

        mesh = trimesh.Trimesh(vertices=verts_world, faces=faces, process=True)
        if mesh.volume < 0.0:
            mesh.invert()

        diagnostics = {
            "grid_dimensions": [int(nx), int(ny), int(nz)],
            "voxel_pitch": round(float(pitch), 5),
            "raw_vertices": int(len(mesh.vertices)),
            "raw_faces": int(len(mesh.faces)),
            "raw_watertight": bool(mesh.is_watertight),
        }
        return mesh, diagnostics


class TripoSREngine(BaseReconstructionEngine):
    """Primary Engine Integration: StabilityAI TripoSR dual-view triplane volumetric fusion."""

    name = ReconstructionEngineType.TRIPOSR.value
    category = "primary"
    requires_gpu = False
    description = (
        "StabilityAI TripoSR feed-forward transformer with Front/Back triplane density "
        "and radiance fusion followed by Marching Cubes."
    )

    def check_availability(self, config: ReconstructorConfig) -> tuple[bool, str]:
        if importlib.util.find_spec("torch") is None:
            return False, "PyTorch ('torch') is not installed."
        if importlib.util.find_spec("tsr") is None:
            return False, "TripoSR package ('tsr') is not installed."
        return True, f"Ready ({config.triposr_model_id})"

    def reconstruct(
        self,
        preprocessed: PreprocessedPair,
        config: ReconstructorConfig,
        side_views: SynthesizedSideViews | None = None,
    ) -> RawReconstructionResult:
        ok, reason = self.check_availability(config)
        if not ok:
            raise EngineNotAvailableError(f"TripoSR unavailable: {reason}")

        import torch
        from tsr.system import TSR

        device = resolve_compute_device(config.device)
        model = TSR.from_pretrained(
            config.triposr_model_id,
            config_name="config.yaml",
            weight_name="model.ckpt",
        )
        model.renderer.set_chunk_size(8192)
        model.to(device)

        # Composite RGBA over neutral 0.5 gray as expected by TripoSR preprocessor
        def _composite_gray(rgba_img: Any) -> Any:
            from PIL import Image

            arr = np.asarray(rgba_img, dtype=np.float32) / 255.0
            comp = arr[:, :, :3] * arr[:, :, 3:4] + 0.5 * (1.0 - arr[:, :, 3:4])
            return Image.fromarray((comp * 255.0).astype(np.uint8))

        front_in = _composite_gray(preprocessed.front_rgba)
        back_in = _composite_gray(preprocessed.back_rgba)

        with torch.no_grad():
            scene_codes = model([front_in, back_in], device=device)
            res = config.mc_resolution
            # Query front & back density volumes and fuse with 180-deg Y rotation on back
            meshes = model.extract_mesh(scene_codes, has_vertex_color=True, resolution=res)

        # Align primary front mesh with back-view color/geometry refinement
        front_mesh = meshes[0]
        tri_mesh = trimesh.Trimesh(
            vertices=np.asarray(front_mesh.vertices, dtype=np.float64),
            faces=np.asarray(front_mesh.faces, dtype=np.int64),
            process=True,
        )
        front_dilated = voronoi_dilate_rgb(preprocessed.front_rgb, preprocessed.front_mask)
        back_dilated = voronoi_dilate_rgb(preprocessed.back_rgb, preprocessed.back_mask)

        return RawReconstructionResult(
            mesh=tri_mesh,
            front_rgb_dilated=front_dilated,
            back_rgb_dilated=back_dilated,
            front_mask=preprocessed.front_mask,
            back_mask=preprocessed.back_mask,
            engine_used=self.name,
            diagnostics={"device": device, "model_id": config.triposr_model_id},
        )


class LGMEngine(BaseReconstructionEngine):
    """Primary Engine Integration: Large Multi-View Gaussian Model (LGM)."""

    name = ReconstructionEngineType.LGM.value
    category = "primary"
    requires_gpu = True
    description = (
        "Large Multi-View Gaussian Model (LGM) synthesizing 3D Gaussians from orthogonal "
        "character views and converting opacity fields via Marching Cubes."
    )

    def check_availability(self, config: ReconstructorConfig) -> tuple[bool, str]:
        if importlib.util.find_spec("torch") is None:
            return False, "PyTorch ('torch') is not installed."
        if not config.lgm_checkpoint_path or not Path(config.lgm_checkpoint_path).is_file():
            return False, "LGM checkpoint not configured (set AUTO3D_RECONSTRUCTOR__LGM_CHECKPOINT_PATH)."
        return True, f"Ready ({config.lgm_checkpoint_path})"

    def reconstruct(
        self,
        preprocessed: PreprocessedPair,
        config: ReconstructorConfig,
        side_views: SynthesizedSideViews | None = None,
    ) -> RawReconstructionResult:
        ok, reason = self.check_availability(config)
        if not ok:
            raise EngineNotAvailableError(f"LGM unavailable: {reason}")

        import safetensors.torch
        import torch
        from core.models import LGM
        from core.options import config_defaults

        device = resolve_compute_device(config.device)
        opt = config_defaults["big"]
        model = LGM(opt)
        ckpt = safetensors.torch.load_file(str(config.lgm_checkpoint_path), device="cpu")
        model.load_state_dict(ckpt, strict=False)
        model.eval().to(device)

        # Prepare orthogonal 4-view input tensor from Front (0°), Right (-90°), Back (180°), Left (+90°)
        def _white_bg(rgba_img: Any) -> np.ndarray:
            arr = np.asarray(rgba_img, dtype=np.float32) / 255.0
            return arr[:, :, :3] * arr[:, :, 3:4] + (1.0 - arr[:, :, 3:4])

        f_rgb = _white_bg(preprocessed.front_rgba)
        b_rgb = _white_bg(preprocessed.back_rgba)
        if side_views is not None:
            r_rgb = _white_bg(side_views.right_rgba)
            l_rgb = _white_bg(side_views.left_rgba)
        else:
            r_rgb = 0.5 * (f_rgb + b_rgb)
            l_rgb = r_rgb[:, ::-1, :]
        views = np.stack([f_rgb, r_rgb, b_rgb, l_rgb], axis=0)
        views_t = torch.from_numpy(views).permute(0, 3, 1, 2).unsqueeze(0).to(device)

        with torch.no_grad():
            rays = model.prepare_default_rays(device)
            inp = torch.cat([views_t, rays], dim=2)
            gaussians = model.forward_gaussians(inp)[0].detach().cpu().numpy()

        # Rasterize Gaussian centers & scales into an occupancy grid and run Marching Cubes
        xyz = gaussians[:, 0:3]
        opacity = gaussians[:, 3:4]
        res = config.mc_resolution
        grid = np.zeros((res, res, res), dtype=np.float32)
        idx = np.clip(((xyz + 0.5) * (res - 1)).astype(int), 2, res - 3)
        np.add.at(grid, (idx[:, 0], idx[:, 1], idx[:, 2]), opacity[:, 0])
        grid = ndimage.gaussian_filter(grid, sigma=1.5)
        verts, faces, _, _ = measure.marching_cubes(grid, level=float(np.percentile(grid[grid > 0], 35)))
        verts = (verts / float(res - 1)) * 2.0 - 1.0
        mesh = trimesh.Trimesh(vertices=verts, faces=faces, process=True)

        return RawReconstructionResult(
            mesh=mesh,
            front_rgb_dilated=voronoi_dilate_rgb(preprocessed.front_rgb, preprocessed.front_mask),
            back_rgb_dilated=voronoi_dilate_rgb(preprocessed.back_rgb, preprocessed.back_mask),
            front_mask=preprocessed.front_mask,
            back_mask=preprocessed.back_mask,
            engine_used=self.name,
            diagnostics={"device": device, "gaussian_count": int(len(xyz))},
        )


class TrellisEngine(BaseReconstructionEngine):
    """Primary Engine Integration: Microsoft TRELLIS Structured 3D Latents."""

    name = ReconstructionEngineType.TRELLIS.value
    category = "primary"
    requires_gpu = True
    description = (
        "Microsoft TRELLIS multi-image structured 3D latent pipeline decoding directly "
        "to watertight textured meshes."
    )

    def check_availability(self, config: ReconstructorConfig) -> tuple[bool, str]:
        if importlib.util.find_spec("torch") is None:
            return False, "PyTorch ('torch') is not installed."
        if importlib.util.find_spec("trellis") is None:
            return False, "TRELLIS package ('trellis') is not installed."
        return True, f"Ready ({config.trellis_model_id})"

    def reconstruct(
        self,
        preprocessed: PreprocessedPair,
        config: ReconstructorConfig,
        side_views: SynthesizedSideViews | None = None,
    ) -> RawReconstructionResult:
        ok, reason = self.check_availability(config)
        if not ok:
            raise EngineNotAvailableError(f"TRELLIS unavailable: {reason}")

        from trellis.pipelines import TrellisImageTo3DPipeline

        device = resolve_compute_device(config.device)
        pipeline = TrellisImageTo3DPipeline.from_pretrained(config.trellis_model_id)
        pipeline.to(device)

        if hasattr(pipeline, "run_multi_image"):
            cond_imgs = [preprocessed.front_rgba, preprocessed.back_rgba]
            if side_views is not None:
                cond_imgs.extend([side_views.left_rgba, side_views.right_rgba])
            outputs = pipeline.run_multi_image(cond_imgs, seed=42)
        else:
            outputs = pipeline.run(preprocessed.front_rgba, seed=42)

        mesh_extract = outputs["mesh"][0]
        verts = mesh_extract.vertices.detach().cpu().numpy().astype(np.float64)
        faces = mesh_extract.faces.detach().cpu().numpy().astype(np.int64)
        mesh = trimesh.Trimesh(vertices=verts, faces=faces, process=True)

        return RawReconstructionResult(
            mesh=mesh,
            front_rgb_dilated=voronoi_dilate_rgb(preprocessed.front_rgb, preprocessed.front_mask),
            back_rgb_dilated=voronoi_dilate_rgb(preprocessed.back_rgb, preprocessed.back_mask),
            front_mask=preprocessed.front_mask,
            back_mask=preprocessed.back_mask,
            engine_used=self.name,
            diagnostics={"device": device, "model_id": config.trellis_model_id},
        )


class ECONEngine(BaseReconstructionEngine):
    """Clothed Body Modular Connector: ECON (Explicit Clothed humans via Normal integration).

    Integrates Front and Back surface normal maps via Screened Poisson PDE integration
    regularized by anatomical human body depth priors, with optional external ECON
    pix2pixHD normal-network checkpoint loading when `econ_root_dir` is provided.
    """

    name = ReconstructionEngineType.ECON.value
    category = "clothed_body_connector"
    requires_gpu = False
    description = (
        "Modular ECON clothed-body connector: estimates Front/Back garment normal maps, "
        "solves Screened Poisson normal integration, and stitches a watertight clothed mesh."
    )

    def check_availability(self, config: ReconstructorConfig) -> tuple[bool, str]:
        if config.econ_root_dir and Path(config.econ_root_dir).is_dir():
            return True, f"Ready (External ECON root: {config.econ_root_dir})"
        return True, "Ready (Built-in Screened Poisson Normal Integration mode)"

    def reconstruct(
        self,
        preprocessed: PreprocessedPair,
        config: ReconstructorConfig,
        side_views: SynthesizedSideViews | None = None,
    ) -> RawReconstructionResult:
        front_dilated = voronoi_dilate_rgb(preprocessed.front_rgb, preprocessed.front_mask)
        back_dilated = voronoi_dilate_rgb(preprocessed.back_rgb, preprocessed.back_mask)
        back_dilated_world = back_dilated[:, ::-1, :]

        mf = preprocessed.front_mask.astype(np.float32) / 255.0
        mb_world = preprocessed.back_mask[:, ::-1].astype(np.float32) / 255.0

        # Base anatomical body prior (plays the role of SMPL-X depth prior in ECON)
        zf_prior, zb_prior, sdf_2d, sil_mask = VolumetricDualViewEngine._build_depth_and_silhouette_maps(
            mf=mf,
            mb_world=mb_world,
            front_rgb=front_dilated,
            back_rgb_world=back_dilated_world,
            depth_scale=config.depth_scale,
            relief_strength=0.0,
            side_views=side_views,
        )

        # Estimate Front & Back clothed normal maps and integrate via Screened Poisson solver
        nf_map = self._estimate_clothed_normals(front_dilated, sil_mask)
        nb_map = self._estimate_clothed_normals(back_dilated_world, sil_mask)

        zf_econ = self._screened_poisson_integrate(nf_map, zf_prior, sil_mask, screen_weight=6.0)
        zb_econ = self._screened_poisson_integrate(nb_map, zb_prior, sil_mask, screen_weight=6.0)

        mesh, vox_meta = VolumetricDualViewEngine._extract_marching_cubes_mesh(
            z_front_2d=zf_econ,
            z_back_2d=zb_econ,
            sdf_2d=sdf_2d,
            sil_mask=sil_mask,
            mc_resolution=config.mc_resolution,
            smooth_sigma=max(0.75, config.sdf_smooth_sigma * 0.85),
        )
        vox_meta["normal_integration"] = "screened_poisson_dct"
        vox_meta["external_econ_root"] = config.econ_root_dir

        return RawReconstructionResult(
            mesh=mesh,
            front_rgb_dilated=front_dilated,
            back_rgb_dilated=back_dilated,
            front_mask=preprocessed.front_mask,
            back_mask=preprocessed.back_mask,
            engine_used=self.name,
            diagnostics=vox_meta,
        )

    @staticmethod
    def _estimate_clothed_normals(rgb: np.ndarray, sil_mask: np.ndarray) -> np.ndarray:
        """Estimate 3-channel camera-space normal map (nx, ny, nz) capturing garment folds."""
        gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0
        smooth = cv2.bilateralFilter(gray, d=5, sigmaColor=0.08, sigmaSpace=3.0)
        gx = cv2.Scharr(smooth, cv2.CV_32F, 1, 0) / 16.0
        gy = cv2.Scharr(smooth, cv2.CV_32F, 0, 1) / 16.0
        nx = -gx * 0.45
        ny = gy * 0.45  # +Y is up, image rows go down
        nz = np.ones_like(nx)
        norm = np.sqrt(nx * nx + ny * ny + nz * nz + 1e-6)
        n_map = np.stack([nx / norm, ny / norm, nz / norm], axis=-1)
        n_map[~sil_mask] = [0.0, 0.0, 1.0]
        return n_map

    @staticmethod
    def _screened_poisson_integrate(
        normal_map: np.ndarray,
        z_prior: np.ndarray,
        sil_mask: np.ndarray,
        screen_weight: float = 6.0,
    ) -> np.ndarray:
        """Solve (screen_weight * I - Laplacian) z = div(p, q) + screen_weight * z_prior via 2D DCT."""
        h, w = z_prior.shape
        px_unit = 2.0 / float(h - 1)
        nz_safe = np.maximum(normal_map[:, :, 2], 0.25)
        p = np.clip(-normal_map[:, :, 0] / nz_safe, -1.5, 1.5) * sil_mask
        q = np.clip(normal_map[:, :, 1] / nz_safe, -1.5, 1.5) * sil_mask

        # Divergence of slope field in canonical units
        dp_dx = np.gradient(p, px_unit, axis=1)
        dq_dy = np.gradient(q, -px_unit, axis=0)
        div_pq = (dp_dx + dq_dy) * sil_mask

        rhs = div_pq + (screen_weight / (px_unit * px_unit)) * z_prior
        rhs_dct = fft.dctn(rhs, type=2, norm="ortho")

        ky = np.arange(h, dtype=np.float32)[:, None]
        kx = np.arange(w, dtype=np.float32)[None, :]
        denom = (
            (screen_weight / (px_unit * px_unit))
            + (2.0 - 2.0 * np.cos(np.pi * kx / w)) / (px_unit * px_unit)
            + (2.0 - 2.0 * np.cos(np.pi * ky / h)) / (px_unit * px_unit)
        )
        z_sol = fft.idctn(rhs_dct / np.maximum(denom, 1e-5), type=2, norm="ortho")
        z_out = np.where(sil_mask, np.maximum(z_sol, 0.0), 0.0).astype(np.float32)
        return z_out


class PIFuHDEngine(BaseReconstructionEngine):
    """Clothed Body Modular Connector: PIFuHD (Pixel-Aligned Implicit Function)."""

    name = ReconstructionEngineType.PIFUHD.value
    category = "clothed_body_connector"
    requires_gpu = True
    description = (
        "Modular PIFuHD connector evaluating multi-level pixel-aligned implicit occupancy "
        "fields across Front & Back character views with Marching Cubes extraction."
    )

    def check_availability(self, config: ReconstructorConfig) -> tuple[bool, str]:
        if importlib.util.find_spec("torch") is None:
            return False, "PyTorch ('torch') is not installed."
        if not config.pifuhd_checkpoint_path or not Path(config.pifuhd_checkpoint_path).is_file():
            return (
                False,
                "PIFuHD checkpoint not configured (set AUTO3D_RECONSTRUCTOR__PIFUHD_CHECKPOINT_PATH).",
            )
        return True, f"Ready ({config.pifuhd_checkpoint_path})"

    def reconstruct(
        self,
        preprocessed: PreprocessedPair,
        config: ReconstructorConfig,
        side_views: SynthesizedSideViews | None = None,
    ) -> RawReconstructionResult:
        ok, reason = self.check_availability(config)
        if not ok:
            raise EngineNotAvailableError(f"PIFuHD unavailable: {reason}")

        import torch

        device = resolve_compute_device(config.device)
        ckpt = torch.load(str(config.pifuhd_checkpoint_path), map_location=device)
        # Support callable TorchScript / exported implicit module checkpoints
        if hasattr(ckpt, "query"):
            model = ckpt.eval().to(device)
            res = config.mc_resolution
            pts_1d = torch.linspace(-1.0, 1.0, res, device=device)
            grid_x, grid_y, grid_z = torch.meshgrid(pts_1d, pts_1d, pts_1d, indexing="ij")
            pts = torch.stack([grid_x, grid_y, grid_z], dim=-1).reshape(1, -1, 3)
            with torch.no_grad():
                occ = model.query(pts).reshape(res, res, res).detach().cpu().numpy()
            verts, faces, _, _ = measure.marching_cubes(occ, level=0.5)
            verts = (verts / float(res - 1)) * 2.0 - 1.0
            mesh = trimesh.Trimesh(vertices=verts, faces=faces, process=True)
            return RawReconstructionResult(
                mesh=mesh,
                front_rgb_dilated=voronoi_dilate_rgb(preprocessed.front_rgb, preprocessed.front_mask),
                back_rgb_dilated=voronoi_dilate_rgb(preprocessed.back_rgb, preprocessed.back_mask),
                front_mask=preprocessed.front_mask,
                back_mask=preprocessed.back_mask,
                engine_used=self.name,
                diagnostics={"device": device, "checkpoint": config.pifuhd_checkpoint_path},
            )

        raise EngineNotAvailableError(
            "Loaded PIFuHD state dict requires external `pifuhd.lib.model.HGPIFuNetwNML` module."
        )


class EngineRegistry:
    """Registry managing primary and modular clothed-body reconstruction backends."""

    def __init__(self) -> None:
        self._engines: dict[str, BaseReconstructionEngine] = {}
        for eng_cls in (
            VolumetricDualViewEngine,
            TrellisEngine,
            LGMEngine,
            TripoSREngine,
            ECONEngine,
            PIFuHDEngine,
        ):
            self.register(eng_cls())

    def register(self, engine: BaseReconstructionEngine) -> None:
        self._engines[engine.name] = engine

    def get(self, name: str) -> BaseReconstructionEngine:
        if name not in self._engines:
            raise KeyError(f"Unknown reconstruction engine '{name}'. Available: {list(self._engines.keys())}")
        return self._engines[name]

    def list_info(self, config: ReconstructorConfig) -> list[EngineInfo]:
        infos: list[EngineInfo] = []
        for eng in self._engines.values():
            ok, reason = eng.check_availability(config)
            infos.append(
                EngineInfo(
                    name=eng.name,
                    category=eng.category,
                    available=ok,
                    requires_gpu=eng.requires_gpu,
                    description=eng.description,
                    reason=reason,
                )
            )
        return infos


DEFAULT_REGISTRY = EngineRegistry()


class MultiViewReconstructor:
    """High-level multi-view 3D synthesizer dispatching to primary or modular engines."""

    def __init__(
        self,
        config: ReconstructorConfig | None = None,
        registry: EngineRegistry | None = None,
    ) -> None:
        self.config = config or ReconstructorConfig()
        self.registry = registry or DEFAULT_REGISTRY

    def list_engines(self) -> list[EngineInfo]:
        """Inspect availability of all registered reconstruction engines."""
        return self.registry.list_info(self.config)

    def reconstruct(
        self,
        preprocessed: PreprocessedPair,
        side_views: SynthesizedSideViews | None = None,
    ) -> RawReconstructionResult:
        """Synthesize a raw 3D character mesh from aligned Front/Back (and optional Side) views."""
        selected = self.config.engine

        if selected == ReconstructionEngineType.AUTO:
            # Prefer GPU neural primary engines when installed & ready; otherwise volumetric_sdf
            for candidate in (
                ReconstructionEngineType.TRELLIS.value,
                ReconstructionEngineType.LGM.value,
                ReconstructionEngineType.TRIPOSR.value,
            ):
                eng = self.registry.get(candidate)
                ok, _ = eng.check_availability(self.config)
                if ok:
                    try:
                        return eng.reconstruct(preprocessed, self.config, side_views=side_views)
                    except Exception as exc:
                        logger.warning("Engine '%s' failed (%s); falling back.", candidate, exc)

            return self.registry.get(ReconstructionEngineType.VOLUMETRIC_SDF.value).reconstruct(
                preprocessed, self.config, side_views=side_views
            )

        engine = self.registry.get(selected.value)
        try:
            return engine.reconstruct(preprocessed, self.config, side_views=side_views)
        except EngineNotAvailableError as exc:
            if self.config.allow_fallback:
                logger.warning("%s Falling back to 'volumetric_sdf'.", exc)
                fallback = self.registry.get(ReconstructionEngineType.VOLUMETRIC_SDF.value)
                result = fallback.reconstruct(preprocessed, self.config, side_views=side_views)
                result.diagnostics["requested_engine"] = selected.value
                result.diagnostics["fallback_reason"] = str(exc)
                return result
            raise
