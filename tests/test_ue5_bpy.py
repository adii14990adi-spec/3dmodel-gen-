"""Tests for Unreal Engine 5 High-Poly `bpy` Character Generator & Manny Rigging."""

from __future__ import annotations

import subprocess
import sys
import zipfile
from pathlib import Path

import numpy as np
import pytest
import trimesh
from fastapi.testclient import TestClient

from src.config import (
    PROJECT_ROOT,
    AppSettings,
    PipelineConfig,
    PreprocessorConfig,
    ReconstructionEngineType,
    ReconstructorConfig,
    RiggingBackend,
    RiggingConfig,
)
from src.pipeline import Auto3DHumanPipeline
from src.preprocessor import DualViewPreprocessor
from src.reconstructor import MultiViewReconstructor
from src.rigger import AutoRigger
from src.server import create_app
from src.ue5_bpy_generator import extract_reference_palette_and_scales, has_bpy_runtime

SAMPLE_IMG = PROJECT_ROOT / "assets" / "sample_input.jpg"


def test_ue5_manny_rigger_23_bones_and_zero_root_skinning(tmp_path: Path) -> None:
    """`RiggingBackend.UE5_MANNY` fits 23 UE5 Mannequin bones and keeps `root` weight at 0."""
    cfg = PipelineConfig(
        preprocessor=PreprocessorConfig(image_size=256),
        reconstructor=ReconstructorConfig(mc_resolution=64),
        rigging=RiggingConfig(enabled=True, backend=RiggingBackend.UE5_MANNY),
    )
    res = Auto3DHumanPipeline(cfg).run(source=SAMPLE_IMG, output_dir=tmp_path, stem="manny")
    assert res.rigging is not None
    skel = res.rigging.skeleton
    assert skel.backend_used == "ue5_manny"
    assert len(skel.joint_names) == 23
    assert skel.joint_names[0] == "root"
    assert skel.joint_names[1] == "pelvis"
    assert "clavicle_l" in skel.joint_names
    assert "ball_r" in skel.joint_names

    # Verify `root` bone (index 0) never steals skin weights from the feet/ankles
    joints_idx, weights_val = AutoRigger.compute_lbs_skin_weights(
        res.postprocessed.watertight_geometry,
        skel,
        smooth_iterations=4,
    )
    root_mask = joints_idx == 0
    assert float(weights_val[root_mask].sum()) == 0.0
    np.testing.assert_allclose(weights_val.sum(axis=1), 1.0, atol=1e-4)


def test_extract_reference_palette_and_scales() -> None:
    """Reference turnaround palette & proportion extractor produces valid linear RGB tuples."""
    pair = DualViewPreprocessor(PreprocessorConfig(image_size=256)).process(SAMPLE_IMG)
    palette, scales = extract_reference_palette_and_scales(pair)
    assert "top" in palette
    assert len(palette["top"]) == 3
    assert all(0.0 <= c <= 1.0 for c in palette["top"])
    assert 0.80 <= scales.get("waist_scale", 1.0) <= 1.25


def test_ue5_engine_registered_in_registry() -> None:
    """`ue5_highpoly_bpy` is listed in `MultiViewReconstructor.list_engines()`."""
    engines = {e.name: e for e in MultiViewReconstructor().list_engines()}
    assert "ue5_highpoly_bpy" in engines
    assert engines["ue5_highpoly_bpy"].category == "ue5_production"
    assert engines["ue5_highpoly_bpy"].available == has_bpy_runtime()


@pytest.mark.skipif(not has_bpy_runtime(), reason="Blender Python (`bpy`) requires Linux x86_64 Python 3.11")
def test_ue5_highpoly_bpy_pipeline_and_standalone_cli(tmp_path: Path) -> None:
    """Full `ue5_highpoly_bpy` pipeline exports UE5 `.fbx`, skinned `.glb`, `.zip`, and 23-bone rig."""
    out_dir = tmp_path / "ue5_pipe"
    cfg = PipelineConfig(
        preprocessor=PreprocessorConfig(image_size=256),
        reconstructor=ReconstructorConfig(
            engine=ReconstructionEngineType.UE5_HIGHPOLY_BPY,
            ue5_subsurf_level=1,
            ue5_cycles_samples=0,
            ue5_adapt_reference=False,
            allow_fallback=False,
        ),
        rigging=RiggingConfig(enabled=True, backend=RiggingBackend.UE5_MANNY),
    )
    res = Auto3DHumanPipeline(cfg).run(source=SAMPLE_IMG, output_dir=out_dir, stem="hero")

    fbx_path = out_dir / "hero_ue5.fbx"
    glb_path = out_dir / "hero.glb"
    zip_path = out_dir / "hero_obj_bundle.zip"
    rig_png = out_dir / "rig_preview.png"

    assert fbx_path.is_file() and fbx_path.stat().st_size > 1_000_000
    assert glb_path.is_file() and glb_path.stat().st_size > 1_000_000
    assert zip_path.is_file()
    assert rig_png.is_file()

    with zipfile.ZipFile(zip_path) as zf:
        names = set(zf.namelist())
        assert "hero_ue5.fbx" in names
        assert "ue5_highpoly_character_bpy.py" in names
        assert "skeleton_rig.json" in names

    loaded = trimesh.load(str(glb_path), force="mesh")
    assert len(loaded.faces) > 60_000
    bounds = loaded.bounds
    assert abs(float(bounds[0, 1])) < 0.02
    assert 1.66 <= float(bounds[1, 1] - bounds[0, 1]) <= 1.76

    summary = res.summary_dict()
    assert summary["engine_used"] == "ue5_highpoly_bpy"
    assert summary["rigging"]["joint_count"] == 23
    assert summary["rigging"]["armature_name"] == "ARM_UE5_MannequinSkeleton"

    # Also test standalone CLI entrypoint in clean child process
    cli_fbx = tmp_path / "cli_char.fbx"
    proc = subprocess.run(
        [
            sys.executable,
            str(PROJECT_ROOT / "ue5_highpoly_character_bpy.py"),
            "--reference",
            str(SAMPLE_IMG),
            "--subsurf",
            "1",
            "--export-fbx",
            str(cli_fbx),
        ],
        cwd=str(PROJECT_ROOT),
        capture_output=True,
        text=True,
        timeout=120,
        check=False,
    )
    assert proc.returncode == 0
    assert cli_fbx.is_file() and cli_fbx.stat().st_size > 1_000_000


@pytest.mark.skipif(not has_bpy_runtime(), reason="Blender Python (`bpy`) requires Linux x86_64 Python 3.11")
def test_fastapi_ue5_generate_endpoint(tmp_path: Path) -> None:
    """`POST /api/v1/ue5/generate` builds UE5 `.fbx` and `.glb` safely from FastAPI worker threads."""
    settings = AppSettings(output_dir=tmp_path / "api_out")
    client = TestClient(create_app(settings))

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["bpy_available"] is True

    resp = client.post(
        "/api/v1/ue5/generate",
        data={"subsurf_level": "1", "cycles_samples": "0", "adapt_to_reference": "false"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["engine_used"] == "ue5_highpoly_bpy"
    assert "character_ue5.fbx" in body["files"]
    assert "character.glb" in body["files"]

    fbx_dl = client.get(body["files"]["character_ue5.fbx"])
    assert fbx_dl.status_code == 200
    assert len(fbx_dl.content) > 1_000_000
