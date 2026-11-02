"""Unit tests for DualViewPreprocessor (splitting, segmentation, rembg hook, alignment)."""

from __future__ import annotations

from unittest.mock import patch

import numpy as np
import pytest
from PIL import Image

from src.config import PROJECT_ROOT, PreprocessorConfig, SegmentationBackend, SplitMode
from src.preprocessor import DualViewPreprocessor

SAMPLE_IMAGE = PROJECT_ROOT / "assets" / "sample_input.jpg"


def test_sample_turnaround_horizontal_preprocess() -> None:
    cfg = PreprocessorConfig(image_size=256, foreground_ratio=0.86)
    pre = DualViewPreprocessor(cfg)
    result = pre.process(SAMPLE_IMAGE)

    assert result.front_rgba.size == (256, 256)
    assert result.back_rgba.size == (256, 256)
    assert result.front_rgb.shape == (256, 256, 3)
    assert result.front_mask.shape == (256, 256)
    assert result.metadata["split_axis"] == "horizontal"
    assert result.metadata["silhouette_iou"] > 0.90
    # Verify interior eyes on front view were not punched out by background removal
    fg_front = int((result.front_mask > 127).sum())
    fg_back = int((result.back_mask > 127).sum())
    assert abs(fg_front - fg_back) < fg_front * 0.05


def test_vertical_split_auto_detection() -> None:
    horiz = Image.open(SAMPLE_IMAGE).convert("RGB")
    w, h = horiz.size
    left = horiz.crop((0, 0, w // 2, h))
    right = horiz.crop((w // 2, 0, w, h))
    stacked = Image.new("RGB", (w // 2, h * 2))
    stacked.paste(left, (0, 0))
    stacked.paste(right, (0, h))

    pre = DualViewPreprocessor(PreprocessorConfig(image_size=256, split_mode=SplitMode.AUTO))
    result = pre.process(stacked)
    assert result.metadata["split_axis"] == "vertical"
    assert result.metadata["silhouette_iou"] > 0.90


def test_swap_views_option() -> None:
    normal = DualViewPreprocessor(PreprocessorConfig(image_size=256, swap_views=False)).process(SAMPLE_IMAGE)
    swapped = DualViewPreprocessor(PreprocessorConfig(image_size=256, swap_views=True)).process(SAMPLE_IMAGE)

    assert swapped.metadata["views_swapped"] is True
    assert np.array_equal(normal.front_rgb, swapped.back_rgb)
    assert np.array_equal(normal.back_rgb, swapped.front_rgb)


def test_alpha_channel_passthrough_and_corner_noise_cleanup() -> None:
    canvas = np.zeros((300, 600, 4), dtype=np.uint8)
    # Draw synthetic T-pose silhouettes on Front (left) and Back (right)
    for x_off, color in ((150, (210, 70, 60, 255)), (450, (50, 120, 210, 255))):
        canvas[50:250, x_off - 22 : x_off + 22] = color  # Torso + Head + Legs
        canvas[95:118, x_off - 85 : x_off + 85] = color  # T-pose arms
    # Add detached corner noise label that should be stripped automatically
    canvas[8:20, 8:28] = (255, 255, 255, 255)

    pre_cfg = PreprocessorConfig(image_size=256, segmentation_backend=SegmentationBackend.AUTO)
    pre = DualViewPreprocessor(pre_cfg)
    res = pre.process(canvas)
    assert res.metadata["segmentation_backend_used"] == "alpha"
    assert res.metadata["silhouette_iou"] > 0.95
    # Corner speck was removed before bbox cropping
    assert int(res.front_mask[:8, :8].max()) == 0


def test_rembg_u2net_human_seg_integration_mocked() -> None:
    """Verify rembg (`u2net_human_seg`) session creation and invocation without network calls."""
    fake_rgba = Image.new("RGBA", (200, 240), (0, 0, 0, 0))
    arr = np.asarray(fake_rgba).copy()
    arr[30:210, 80:120] = [180, 100, 90, 255]
    arr[70:90, 30:170] = [180, 100, 90, 255]
    segmented_pil = Image.fromarray(arr, mode="RGBA")

    with (
        patch("rembg.new_session", return_value="mock_u2net_session") as mock_session,
        patch("rembg.remove", return_value=segmented_pil) as mock_remove,
    ):
        cfg = PreprocessorConfig(
            image_size=256,
            segmentation_backend=SegmentationBackend.REMBG,
            rembg_model="u2net_human_seg",
        )
        pre = DualViewPreprocessor(cfg)
        res = pre.process(SAMPLE_IMAGE)

        mock_session.assert_called_once_with("u2net_human_seg")
        assert mock_remove.call_count == 2
        assert res.metadata["segmentation_backend_used"] == "rembg:u2net_human_seg"


def test_reject_tiny_image() -> None:
    tiny = Image.new("RGB", (16, 16), (255, 255, 255))
    with pytest.raises(ValueError, match="too small"):
        DualViewPreprocessor().process(tiny)
