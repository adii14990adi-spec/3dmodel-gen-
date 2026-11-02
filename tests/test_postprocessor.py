"""Unit tests for MeshPostProcessor: decimation, hole repair, normals, UV/vertex baking, GLB/OBJ export."""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pytest
import trimesh

from src.config import (
    PROJECT_ROOT,
    PostProcessorConfig,
    PreprocessorConfig,
    ReconstructionEngineType,
    ReconstructorConfig,
    TextureMode,
)
from src.postprocessor import MeshPostProcessor, is_topologically_watertight
from src.preprocessor import DualViewPreprocessor
from src.reconstructor import MultiViewReconstructor, RawReconstructionResult

SAMPLE_IMAGE = PROJECT_ROOT / "assets" / "sample_input.jpg"


@pytest.fixture(scope="module")
def sample_raw_reconstruction() -> RawReconstructionResult:
    pre = DualViewPreprocessor(PreprocessorConfig(image_size=256)).process(SAMPLE_IMAGE)
    rec_cfg = ReconstructorConfig(engine=ReconstructionEngineType.VOLUMETRIC_SDF, mc_resolution=88)
    return MultiViewReconstructor(rec_cfg).reconstruct(pre)


def test_postprocessor_uv_atlas_and_exports(
    sample_raw_reconstruction: RawReconstructionResult,
    tmp_path: Path,
) -> None:
    cfg = PostProcessorConfig(
        target_faces=4000,
        smoothing_iterations=8,
        target_height=1.80,
        texture_mode=TextureMode.UV_ATLAS,
        texture_resolution=512,
        export_formats=["glb", "obj"],
    )
    post = MeshPostProcessor(cfg).process(sample_raw_reconstruction, output_dir=tmp_path, stem="avatar")

    assert post.metrics["is_watertight"] is True
    assert post.metrics["is_winding_consistent"] is True
    assert post.metrics["faces"] <= 4050
    # Verify grounded at Y=0 and scaled to 1.80m
    bounds = post.metrics["bounds_m"]
    assert abs(bounds[0][1] - 0.0) < 1e-3
    assert abs(bounds[1][1] - 1.80) < 1e-2

    assert (tmp_path / "avatar.glb").is_file()
    assert (tmp_path / "avatar.obj").is_file()
    assert (tmp_path / "avatar_obj_bundle.zip").is_file()
    assert (tmp_path / "texture_atlas.png").is_file()
    assert (tmp_path / "mesh_turnaround.png").is_file()

    reloaded = trimesh.load(str(tmp_path / "avatar.glb"), force="mesh")
    assert is_topologically_watertight(reloaded) is True


def test_postprocessor_vertex_color_mode_direct_watertight(
    sample_raw_reconstruction: RawReconstructionResult,
    tmp_path: Path,
) -> None:
    cfg = PostProcessorConfig(
        target_faces=3500,
        smoothing_iterations=6,
        texture_mode=TextureMode.VERTEX_COLOR,
        export_formats=["glb"],
    )
    post = MeshPostProcessor(cfg).process(sample_raw_reconstruction, output_dir=tmp_path, stem="vcol")
    reloaded = trimesh.load(str(tmp_path / "vcol.glb"), force="mesh")
    assert reloaded.is_watertight is True
    assert isinstance(reloaded.visual, trimesh.visual.ColorVisuals)
    assert post.texture_atlas is None


def test_hole_repair_and_inverted_normal_fixing(
    sample_raw_reconstruction: RawReconstructionResult,
) -> None:
    sphere = trimesh.creation.icosphere(subdivisions=2, radius=0.4)
    # Remove one triangle to create an open hole and invert winding
    broken_faces = sphere.faces[1:, ::-1].copy()
    # Add a tiny stray disconnected triangle far away that should be filtered out
    stray_verts = np.array([[5.0, 5.0, 5.0], [5.02, 5.0, 5.0], [5.0, 5.02, 5.0]])
    all_verts = np.vstack([sphere.vertices, stray_verts])
    stray_face = np.array([[len(sphere.vertices), len(sphere.vertices) + 1, len(sphere.vertices) + 2]])
    all_faces = np.vstack([broken_faces, stray_face])

    damaged_mesh = trimesh.Trimesh(vertices=all_verts, faces=all_faces, process=False)
    assert damaged_mesh.is_watertight is False

    raw = RawReconstructionResult(
        mesh=damaged_mesh,
        front_rgb_dilated=sample_raw_reconstruction.front_rgb_dilated,
        back_rgb_dilated=sample_raw_reconstruction.back_rgb_dilated,
        front_mask=sample_raw_reconstruction.front_mask,
        back_mask=sample_raw_reconstruction.back_mask,
        engine_used="volumetric_sdf",
    )
    post = MeshPostProcessor(PostProcessorConfig(target_faces=0, smoothing_iterations=2)).process(raw)
    assert post.watertight_geometry.is_watertight is True
    assert post.watertight_geometry.volume > 0.0
