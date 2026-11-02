"""Dual-view T-pose image preprocessing: splitting, human segmentation, and centering."""

from __future__ import annotations

import io
import logging
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageOps
from scipy import ndimage

from src.config import PreprocessorConfig, SegmentationBackend, SplitMode

logger = logging.getLogger(__name__)


@dataclass
class PreprocessedPair:
    """Aligned, background-removed Front and Back T-pose views."""

    front_rgba: Image.Image
    back_rgba: Image.Image
    front_rgb: np.ndarray
    back_rgb: np.ndarray
    front_mask: np.ndarray
    back_mask: np.ndarray
    preview_image: Image.Image
    metadata: dict[str, Any] = field(default_factory=dict)


class DualViewPreprocessor:
    """Processes a dual-view T-pose character sheet into canonical aligned Front/Back RGBA pairs."""

    def __init__(self, config: PreprocessorConfig | None = None) -> None:
        self.config = config or PreprocessorConfig()
        self._rembg_session: Any | None = None

    def process(
        self,
        source: str | Path | bytes | np.ndarray | Image.Image,
    ) -> PreprocessedPair:
        """Run full preprocessing: load -> split -> segment -> align & center -> diagnostic preview."""
        image = self.load_image(source)
        front_raw, back_raw, split_meta = self.split_dual_view(image)

        front_seg, seg_used_f = self.remove_background(front_raw)
        back_seg, seg_used_b = self.remove_background(back_raw)

        front_rgba, back_rgba, align_meta = self.align_and_center(front_seg, back_seg)

        front_arr = np.asarray(front_rgba, dtype=np.uint8)
        back_arr = np.asarray(back_rgba, dtype=np.uint8)
        front_rgb = front_arr[:, :, :3].copy()
        back_rgb = back_arr[:, :, :3].copy()
        front_mask = front_arr[:, :, 3].copy()
        back_mask = back_arr[:, :, 3].copy()

        seg_label = seg_used_f if seg_used_f == seg_used_b else f"{seg_used_f}/{seg_used_b}"
        metadata: dict[str, Any] = {
            "input_size": [image.width, image.height],
            "output_size": [self.config.image_size, self.config.image_size],
            "segmentation_backend_used": seg_label,
            **split_meta,
            **align_meta,
        }

        preview = self._render_alignment_preview(front_rgba, back_rgba, metadata)

        return PreprocessedPair(
            front_rgba=front_rgba,
            back_rgba=back_rgba,
            front_rgb=front_rgb,
            back_rgb=back_rgb,
            front_mask=front_mask,
            back_mask=back_mask,
            preview_image=preview,
            metadata=metadata,
        )

    @staticmethod
    def load_image(source: str | Path | bytes | np.ndarray | Image.Image) -> Image.Image:
        """Load image from path, bytes, numpy array, or PIL Image and normalize EXIF orientation."""
        if isinstance(source, Image.Image):
            img = source.copy()
        elif isinstance(source, (str, Path)):
            path = Path(source)
            if not path.is_file():
                raise FileNotFoundError(f"Input image not found: {path}")
            img = Image.open(path)
            img.load()
        elif isinstance(source, (bytes, bytearray)):
            img = Image.open(io.BytesIO(source))
            img.load()
        elif isinstance(source, np.ndarray):
            if source.ndim == 2:
                img = Image.fromarray(source, mode="L").convert("RGB")
            elif source.ndim == 3 and source.shape[2] == 3:
                img = Image.fromarray(source.astype(np.uint8), mode="RGB")
            elif source.ndim == 3 and source.shape[2] == 4:
                img = Image.fromarray(source.astype(np.uint8), mode="RGBA")
            else:
                raise ValueError(f"Unsupported numpy image shape: {source.shape}")
        else:
            raise TypeError(f"Unsupported image source type: {type(source)!r}")

        img = ImageOps.exif_transpose(img)
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
        if img.width < 32 or img.height < 32:
            raise ValueError(f"Input image is too small ({img.width}x{img.height}); minimum is 32x32.")
        return img

    def split_dual_view(
        self,
        image: Image.Image,
    ) -> tuple[Image.Image, Image.Image, dict[str, Any]]:
        """Split a dual-view sheet into raw Front and Back sub-images along the optimal valley."""
        w, h = image.size
        mode = self.config.split_mode
        if mode == SplitMode.AUTO:
            # Standard turnaround sheets are wider than tall (horizontal Front | Back).
            # Stacked vertical sheets have height substantially exceeding width.
            mode = SplitMode.VERTICAL if h > int(1.38 * w) else SplitMode.HORIZONTAL

        rgb = np.asarray(image.convert("RGB"), dtype=np.float32)

        if mode == SplitMode.HORIZONTAL:
            split_x, trim_pad = self._find_split_coordinate(rgb, axis=1)
            left_box = (0, 0, max(16, split_x - trim_pad), h)
            right_box = (min(w - 16, split_x + trim_pad), 0, w, h)
            first_view = image.crop(left_box)
            second_view = image.crop(right_box)
            meta = {
                "split_axis": "horizontal",
                "split_index": int(split_x),
                "divider_trim_px": int(trim_pad),
            }
        else:
            split_y, trim_pad = self._find_split_coordinate(rgb, axis=0)
            top_box = (0, 0, w, max(16, split_y - trim_pad))
            bot_box = (0, min(h - 16, split_y + trim_pad), w, h)
            first_view = image.crop(top_box)
            second_view = image.crop(bot_box)
            meta = {
                "split_axis": "vertical",
                "split_index": int(split_y),
                "divider_trim_px": int(trim_pad),
            }

        if self.config.swap_views:
            first_view, second_view = second_view, first_view
            meta["views_swapped"] = True
        else:
            meta["views_swapped"] = False

        return first_view, second_view, meta

    @staticmethod
    def _find_split_coordinate(rgb: np.ndarray, axis: int) -> tuple[int, int]:
        """Locate the cleanest background gap (or thin divider line) near the image midline."""
        h, w, _ = rgb.shape
        length = w if axis == 1 else h
        mid = length // 2
        lo = int(length * 0.42)
        hi = int(length * 0.58)
        if hi - lo < 6:
            return mid, 0

        # Estimate background color from the 4 outer corners
        c_sz = max(4, min(h, w) // 25)
        corners = np.concatenate(
            [
                rgb[:c_sz, :c_sz].reshape(-1, 3),
                rgb[:c_sz, -c_sz:].reshape(-1, 3),
                rgb[-c_sz:, :c_sz].reshape(-1, 3),
                rgb[-c_sz:, -c_sz:].reshape(-1, 3),
            ],
            axis=0,
        )
        bg_color = np.median(corners, axis=0)

        diff = np.linalg.norm(rgb - bg_color[None, None, :], axis=-1)
        # Project foreground energy onto candidate split axis
        profile = diff.mean(axis=0 if axis == 1 else 1)
        window = profile[lo:hi]

        # Check for a sharp 1-4 px vertical/horizontal divider line right near center
        local_med = float(np.median(window))
        local_max_idx = int(np.argmax(window))
        near_mid = abs((lo + local_max_idx) - mid) <= int(length * 0.03)
        if window[local_max_idx] > local_med * 3.0 + 18.0 and near_mid:
            return lo + local_max_idx, 3

        # Smooth slightly and bias gently toward exact center when flat background valley exists
        smooth_prof = ndimage.gaussian_filter1d(window, sigma=2.0)
        dist_penalty = np.abs(np.arange(lo, hi) - mid) / float(length) * 4.0
        best_idx = lo + int(np.argmin(smooth_prof + dist_penalty))
        return best_idx, 0

    def remove_background(self, view: Image.Image) -> tuple[Image.Image, str]:
        """Segment the foreground human T-pose figure and return an RGBA image."""
        backend = self.config.segmentation_backend

        # 1. Use pre-existing clean alpha channel when available
        if view.mode == "RGBA" and backend in (SegmentationBackend.AUTO, SegmentationBackend.ALPHA):
            alpha = np.asarray(view.getchannel("A"), dtype=np.uint8)
            fg_frac = float(np.mean(alpha > self.config.mask_threshold))
            if int(alpha.min()) < 16 and 0.03 <= fg_frac <= 0.88:
                cleaned = self._clean_foreground_rgba(np.asarray(view, dtype=np.uint8))
                return Image.fromarray(cleaned, mode="RGBA"), "alpha"
            if backend == SegmentationBackend.ALPHA:
                return view.copy(), "alpha"

        # 2. Try rembg (u2net_human_seg) when requested or when weights are cached / allowed
        if backend == SegmentationBackend.REMBG or (
            backend == SegmentationBackend.AUTO
            and (self._is_rembg_model_cached() or self.config.allow_downloads)
        ):
            try:
                rgba = self._segment_with_rembg(view)
                cleaned = self._clean_foreground_rgba(np.asarray(rgba, dtype=np.uint8))
                return Image.fromarray(cleaned, mode="RGBA"), f"rembg:{self.config.rembg_model}"
            except Exception as exc:
                if backend == SegmentationBackend.REMBG:
                    raise RuntimeError(
                        f"rembg ({self.config.rembg_model}) segmentation failed: {exc}"
                    ) from exc
                logger.warning(
                    "rembg (%s) unavailable (%s); falling back to GrabCut human segmentation.",
                    self.config.rembg_model,
                    exc,
                )

        # 3. High-precision border-modeled CIE Lab + GrabCut human segmentation
        rgb = np.asarray(view.convert("RGB"), dtype=np.uint8)
        rgba_arr = self._segment_opencv_human(rgb)
        return Image.fromarray(rgba_arr, mode="RGBA"), "opencv_grabcut"

    def _is_rembg_model_cached(self) -> bool:
        u2net_home = Path(os.environ.get("U2NET_HOME", Path.home() / ".u2net"))
        model_file = u2net_home / f"{self.config.rembg_model}.onnx"
        return model_file.is_file() and model_file.stat().st_size > 1024

    def _get_rembg_session(self) -> Any:
        if self._rembg_session is None:
            from rembg import new_session

            self._rembg_session = new_session(self.config.rembg_model)
        return self._rembg_session

    def _segment_with_rembg(self, view: Image.Image) -> Image.Image:
        from rembg import remove

        session = self._get_rembg_session()
        out = remove(
            view.convert("RGB"),
            session=session,
            alpha_matting=self.config.alpha_matting,
            post_process_mask=True,
        )
        if not isinstance(out, Image.Image):
            out = Image.open(io.BytesIO(out))
        return out.convert("RGBA")

    def _segment_opencv_human(self, rgb: np.ndarray) -> np.ndarray:
        """Segment human silhouette against flat or gradient studio backdrops using Lab + GrabCut."""
        h, w, _ = rgb.shape
        lab = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB).astype(np.float32)

        # Estimate row-wise background Lab profile from outer border strips & corners
        strip = max(4, min(h, w) // 28)
        corners_lab = np.concatenate(
            [
                lab[: strip * 2, : strip * 2].reshape(-1, 3),
                lab[: strip * 2, -strip * 2 :].reshape(-1, 3),
                lab[-strip * 2 :, : strip * 2].reshape(-1, 3),
                lab[-strip * 2 :, -strip * 2 :].reshape(-1, 3),
            ],
            axis=0,
        )
        global_bg_med = np.median(corners_lab, axis=0)
        global_bg_mad = np.maximum(np.median(np.abs(corners_lab - global_bg_med), axis=0), 2.5)

        # Row-wise background estimate (handles vertical studio lighting gradients seamlessly)
        left_strip = np.median(lab[:, :strip, :], axis=1)  # (H, 3)
        right_strip = np.median(lab[:, -strip:, :], axis=1)  # (H, 3)
        row_bg = np.zeros((h, 3), dtype=np.float32)
        for r in range(h):
            dl = float(np.linalg.norm(left_strip[r] - global_bg_med))
            dr = float(np.linalg.norm(right_strip[r] - global_bg_med))
            if dl < 22.0 and dr < 22.0:
                row_bg[r] = 0.5 * (left_strip[r] + right_strip[r])
            elif dl < dr and dl < 28.0:
                row_bg[r] = left_strip[r]
            elif dr < 28.0:
                row_bg[r] = right_strip[r]
            else:
                row_bg[r] = global_bg_med
        row_bg = ndimage.gaussian_filter1d(row_bg, sigma=max(3.0, h / 40.0), axis=0)

        # Normalized Mahalanobis-like Lab distance from row-wise studio background
        scale = np.array(
            [global_bg_mad[0] * 1.4, global_bg_mad[1] * 1.15, global_bg_mad[2] * 1.15],
            dtype=np.float32,
        )
        scale = np.clip(scale, 3.0, 18.0)
        diff_norm = np.linalg.norm((lab - row_bg[:, None, :]) / scale[None, None, :], axis=-1)

        # Edge magnitude helps preserve crisp garment contours matching background luminance
        gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
        gx = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)
        gy = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)
        grad_mag = np.sqrt(gx * gx + gy * gy) / 255.0

        # Candidate background pixels: close to background color and low gradient
        bg_candidate = (diff_norm < 3.1) & (grad_mag < 0.14)

        # Exterior-connected floodfill: only pixels connected to image borders can be background!
        # This preserves interior white eyes, shirts, or highlights enclosed by the silhouette.
        labeled_bg, _ = ndimage.label(bg_candidate)
        border_labels = np.unique(
            np.concatenate(
                [
                    labeled_bg[0, :],
                    labeled_bg[-1, :],
                    labeled_bg[:, 0],
                    labeled_bg[:, -1],
                ]
            )
        )
        border_labels = border_labels[border_labels > 0]
        exterior_bg = np.isin(labeled_bg, border_labels)
        init_fg = ~exterior_bg

        # Refine silhouette with OpenCV GrabCut when foreground/background balance is valid
        fg_ratio = float(init_fg.mean())
        refined_fg = init_fg.copy()
        if 0.02 < fg_ratio < 0.90:
            gc_mask = np.full((h, w), cv2.GC_PR_BGD, dtype=np.uint8)
            sure_bg = ndimage.binary_dilation(~init_fg, iterations=2) & (diff_norm < 1.8)
            sure_bg[0, :] = True
            sure_bg[-1, :] = True
            sure_bg[:, 0] = True
            sure_bg[:, -1] = True

            sure_fg = ndimage.binary_erosion(init_fg, iterations=max(2, min(h, w) // 90)) & (diff_norm > 4.0)
            gc_mask[init_fg] = cv2.GC_PR_FGD
            gc_mask[sure_bg] = cv2.GC_BGD
            if np.any(sure_fg):
                gc_mask[sure_fg] = cv2.GC_FGD
                bgd_model = np.zeros((1, 65), np.float64)
                fgd_model = np.zeros((1, 65), np.float64)
                try:
                    # Downsample slightly if very large to keep GrabCut under ~150ms
                    max_gc = 560
                    if max(h, w) > max_gc:
                        s_gc = max_gc / float(max(h, w))
                        sm_w, sm_h = max(32, int(w * s_gc)), max(32, int(h * s_gc))
                        rgb_sm = cv2.resize(rgb, (sm_w, sm_h), interpolation=cv2.INTER_AREA)
                        mask_sm = cv2.resize(gc_mask, (sm_w, sm_h), interpolation=cv2.INTER_NEAREST)
                        cv2.grabCut(rgb_sm, mask_sm, None, bgd_model, fgd_model, 2, cv2.GC_INIT_WITH_MASK)
                        gc_out = np.isin(mask_sm, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8) * 255
                        gc_up = cv2.resize(gc_out, (w, h), interpolation=cv2.INTER_LINEAR) > 127
                        # Combine GrabCut core with high-resolution silhouette border
                        dil_fg = ndimage.binary_dilation(init_fg, iterations=3)
                        ero_fg = ndimage.binary_erosion(init_fg, iterations=3)
                        boundary_band = dil_fg ^ ero_fg
                        refined_fg = np.where(boundary_band, init_fg & (diff_norm > 2.3), gc_up & init_fg)
                    else:
                        cv2.grabCut(rgb, gc_mask, None, bgd_model, fgd_model, 2, cv2.GC_INIT_WITH_MASK)
                        refined_fg = np.isin(gc_mask, (cv2.GC_FGD, cv2.GC_PR_FGD)) & (
                            init_fg | (diff_norm > 3.6)
                        )
                except cv2.error:
                    refined_fg = init_fg

        # Close 1px micro-gaps without bridging legs/fingers, then fill enclosed interior holes
        kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        mask_u8 = cv2.morphologyEx(refined_fg.astype(np.uint8) * 255, cv2.MORPH_CLOSE, kernel_close)
        # Fill small interior holes (e.g. eye highlights) while preserving space between legs!
        inv = mask_u8 == 0
        lbl_inv, num_inv = ndimage.label(inv)
        if num_inv > 0:
            ext_lbls = np.unique(
                np.concatenate([lbl_inv[0, :], lbl_inv[-1, :], lbl_inv[:, 0], lbl_inv[:, -1]])
            )
            for lid in range(1, num_inv + 1):
                if lid not in ext_lbls:
                    hole_area = int(np.sum(lbl_inv == lid))
                    if hole_area < int(h * w * 0.008):
                        mask_u8[lbl_inv == lid] = 255

        # Smooth sub-pixel alpha ramp along contour
        alpha_f = cv2.GaussianBlur(mask_u8.astype(np.float32), (3, 3), 0.65)
        alpha_u8 = np.clip((alpha_f - 32.0) * (255.0 / (255.0 - 32.0)), 0.0, 255.0).astype(np.uint8)

        # Decontaminate semi-transparent rim pixels from studio background color bleed
        bg_rgb = cv2.cvtColor(
            np.repeat(row_bg[:, None, :], w, axis=1).astype(np.uint8), cv2.COLOR_LAB2RGB
        ).astype(np.float32)
        a_norm = (alpha_u8.astype(np.float32) / 255.0)[..., None]
        rim = (alpha_u8 > 8) & (alpha_u8 < 245)
        unmixed = rgb.astype(np.float32).copy()
        if np.any(rim):
            safe_a = np.maximum(a_norm, 0.25)
            est_fg = (unmixed - (1.0 - safe_a) * bg_rgb) / safe_a
            unmixed[rim] = np.clip(est_fg[rim], 0.0, 255.0)

        rgba = np.dstack([unmixed.astype(np.uint8), alpha_u8])
        return self._clean_foreground_rgba(rgba)

    def _clean_foreground_rgba(self, rgba: np.ndarray) -> np.ndarray:
        """Retain the central character component(s) and discard stray corner labels or noise."""
        h, w, _ = rgba.shape
        alpha = rgba[:, :, 3]
        fg = alpha >= max(24, self.config.mask_threshold // 2)
        labeled, num = ndimage.label(fg)
        if num <= 1:
            return rgba

        # Score each component by area weighted toward image center
        cy_img, cx_img = h * 0.5, w * 0.5
        best_label = 1
        best_score = -1.0
        comp_boxes: dict[int, tuple[int, int, int, int, int]] = {}
        slices = ndimage.find_objects(labeled)
        for idx, slc in enumerate(slices, start=1):
            if slc is None:
                continue
            ys, xs = slc
            comp_mask = labeled[ys, xs] == idx
            area = int(comp_mask.sum())
            if area < 12:
                continue
            cy = 0.5 * (ys.start + ys.stop)
            cx = 0.5 * (xs.start + xs.stop)
            dist = np.hypot((cx - cx_img) / w, (cy - cy_img) / h)
            score = area * float(np.exp(-2.2 * dist))
            comp_boxes[idx] = (xs.start, ys.start, xs.stop, ys.stop, area)
            if score > best_score:
                best_score = score
                best_label = idx

        if best_label not in comp_boxes:
            return rgba

        bx0, by0, bx1, by1, main_area = comp_boxes[best_label]
        pad_x = max(8, int(w * 0.04))
        pad_y = max(8, int(h * 0.04))
        keep_labels = {best_label}
        for lid, (x0, y0, x1, y1, area) in comp_boxes.items():
            if lid == best_label:
                continue
            # Keep nearby attached parts (e.g. hair tip / accessory) if close to main body bbox
            overlaps_expanded = not (
                x1 < bx0 - pad_x or x0 > bx1 + pad_x or y1 < by0 - pad_y or y0 > by1 + pad_y
            )
            if overlaps_expanded and area >= max(16, int(main_area * 0.0015)):
                keep_labels.add(lid)

        keep_mask = np.isin(labeled, list(keep_labels))
        keep_dilated = ndimage.binary_dilation(keep_mask, iterations=2)
        out = rgba.copy()
        out[~keep_dilated, 3] = 0
        return out

    def align_and_center(
        self,
        front_rgba: Image.Image,
        back_rgba: Image.Image,
    ) -> tuple[Image.Image, Image.Image, dict[str, Any]]:
        """Scale, height-normalize, and spine-center Front & Back figures onto canonical canvases."""
        size = self.config.image_size
        thr = self.config.mask_threshold

        f_arr = np.asarray(front_rgba, dtype=np.uint8)
        b_arr = np.asarray(back_rgba, dtype=np.uint8)

        f_box = self._extract_bbox(f_arr[:, :, 3], thr)
        b_box = self._extract_bbox(b_arr[:, :, 3], thr)

        f_crop = f_arr[f_box[1] : f_box[3], f_box[0] : f_box[2]]
        b_crop = b_arr[b_box[1] : b_box[3], b_box[0] : b_box[2]]

        fh, fw = f_crop.shape[:2]
        bh, bw = b_crop.shape[:2]

        target_h = int(round(size * self.config.foreground_ratio))
        max_w = int(round(size * 0.94))

        if self.config.align_heights:
            # Normalize Back vertical height to match Front height, while respecting max canvas width
            scale_f = target_h / float(max(fh, 1))
            scale_b = target_h / float(max(bh, 1))
            proj_fw = fw * scale_f
            proj_bw = bw * scale_b
            max_proj_w = max(proj_fw, proj_bw, 1.0)
            if max_proj_w > max_w:
                shrink = max_w / max_proj_w
                scale_f *= shrink
                scale_b *= shrink
        else:
            common_scale = min(
                target_h / float(max(fh, bh, 1)),
                max_w / float(max(fw, bw, 1)),
            )
            scale_f = common_scale
            scale_b = common_scale

        new_fw = max(4, int(round(fw * scale_f)))
        new_fh = max(4, int(round(fh * scale_f)))
        new_bw = max(4, int(round(bw * scale_b)))
        new_bh = max(4, int(round(bh * scale_b)))

        f_resized = Image.fromarray(f_crop, mode="RGBA").resize((new_fw, new_fh), Image.Resampling.LANCZOS)
        b_resized = Image.fromarray(b_crop, mode="RGBA").resize((new_bw, new_bh), Image.Resampling.LANCZOS)

        f_res_arr = np.asarray(f_resized, dtype=np.uint8)
        b_res_arr = np.asarray(b_resized, dtype=np.uint8)

        # Estimate horizontal torso symmetry spine on each resized figure so spines align at size // 2
        f_spine = self._estimate_spine_x(f_res_arr[:, :, 3], thr)
        b_spine = self._estimate_spine_x(b_res_arr[:, :, 3], thr)

        # Place both figures so their feet align at the exact same baseline y_bottom
        y_bottom = size - max(8, (size - max(new_fh, new_bh)) // 2)
        fy0 = max(0, y_bottom - new_fh)
        by0 = max(0, y_bottom - new_bh)

        fx0 = int(round(size * 0.5 - f_spine))
        bx0 = int(round(size * 0.5 - b_spine))
        fx0 = int(np.clip(fx0, 0, max(0, size - new_fw)))
        bx0 = int(np.clip(bx0, 0, max(0, size - new_bw)))

        f_canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        b_canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        f_canvas.paste(f_resized, (fx0, fy0))
        b_canvas.paste(b_resized, (bx0, by0))

        # Compute Front vs Mirrored-Back silhouette Intersection-over-Union (IoU)
        fm = np.asarray(f_canvas.getchannel("A"), dtype=np.uint8) >= thr
        bm_flip = (np.asarray(b_canvas.getchannel("A"), dtype=np.uint8) >= thr)[:, ::-1]
        inter = int(np.logical_and(fm, bm_flip).sum())
        union = int(np.logical_or(fm, bm_flip).sum())
        iou = float(inter / max(union, 1))

        align_meta = {
            "front_raw_bbox": list(f_box),
            "back_raw_bbox": list(b_box),
            "normalized_front_size": [new_fw, new_fh],
            "normalized_back_size": [new_bw, new_bh],
            "canonical_y_span": [int(min(fy0, by0)), int(y_bottom)],
            "silhouette_iou": round(iou, 4),
        }
        return f_canvas, b_canvas, align_meta

    @staticmethod
    def _extract_bbox(alpha: np.ndarray, threshold: int) -> tuple[int, int, int, int]:
        ys, xs = np.where(alpha >= threshold)
        if len(xs) == 0:
            ys, xs = np.where(alpha > 8)
        if len(xs) == 0:
            raise ValueError("Foreground segmentation mask is empty; could not detect T-pose figure.")
        return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1

    @staticmethod
    def _estimate_spine_x(alpha: np.ndarray, threshold: int) -> float:
        """Estimate horizontal body symmetry axis using torso/head rows rather than asymmetric hand tips."""
        h, w = alpha.shape
        mask = alpha >= threshold
        if not np.any(mask):
            return w * 0.5
        # Focus on head + torso + hips band (top 5% to 75% of figure height) excluding far arm tips
        y0, y1 = int(h * 0.05), int(h * 0.85)
        band = mask[y0:y1, :]
        # Core columns near middle 50% if non-empty
        c0, c1 = int(w * 0.25), int(w * 0.75)
        core = band[:, c0:c1]
        if np.any(core):
            _, xs_core = np.where(core)
            spine_core = float(np.median(xs_core)) + c0
            _, xs_all = np.where(mask)
            bbox_mid = 0.5 * (float(xs_all.min()) + float(xs_all.max()))
            return 0.70 * spine_core + 0.30 * bbox_mid
        _, xs = np.where(mask)
        return float(np.median(xs))

    @staticmethod
    def _render_alignment_preview(
        front_rgba: Image.Image,
        back_rgba: Image.Image,
        metadata: dict[str, Any],
    ) -> Image.Image:
        """Render a diagnostic side-by-side sheet with subtle studio grid and alignment guides."""
        s = front_rgba.width
        canvas_w = s * 2 + 24
        canvas_h = s + 48
        bg = Image.new("RGBA", (canvas_w, canvas_h), (24, 28, 36, 255))
        draw = ImageDraw.Draw(bg)

        # Subtle checkerboard / grid inside the two viewports
        for panel_x in (8, s + 16):
            draw.rectangle([panel_x, 38, panel_x + s - 1, 38 + s - 1], fill=(34, 39, 50, 255))
            step = max(16, s // 16)
            for gx in range(panel_x, panel_x + s, step):
                draw.line([(gx, 38), (gx, 38 + s - 1)], fill=(42, 48, 62, 255), width=1)
            for gy in range(38, 38 + s, step):
                draw.line([(panel_x, gy), (panel_x + s - 1, gy)], fill=(42, 48, 62, 255), width=1)
            # Spine vertical centerline
            cx = panel_x + s // 2
            draw.line([(cx, 38), (cx, 38 + s - 1)], fill=(70, 140, 210, 140), width=1)

        # Horizontal head & foot alignment laser lines across BOTH panels
        y_top, y_bot = metadata.get("canonical_y_span", [int(s * 0.07), int(s * 0.93)])
        for ly, col in ((38 + y_top, (72, 215, 168, 190)), (38 + y_bot, (72, 215, 168, 190))):
            draw.line([(8, ly), (canvas_w - 9, ly)], fill=col, width=1)

        bg.alpha_composite(front_rgba, dest=(8, 38))
        bg.alpha_composite(back_rgba, dest=(s + 16, 38))

        iou = metadata.get("silhouette_iou", 0.0)
        seg = metadata.get("segmentation_backend_used", "auto")
        draw.text((14, 11), "FRONT (Aligned +Z)", fill=(225, 232, 245, 255))
        draw.text((s + 22, 11), "BACK (Aligned -Z)", fill=(225, 232, 245, 255))
        badge = f"IoU: {iou:.3f} | Seg: {seg}"
        draw.text((canvas_w - len(badge) * 6 - 20, 11), badge, fill=(110, 230, 185, 255))

        return bg.convert("RGB")
