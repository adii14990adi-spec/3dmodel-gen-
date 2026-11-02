"""Integration tests for FastAPI REST endpoints, CLI interface, and Gradio UI builder."""

from __future__ import annotations

import json
from pathlib import Path

from fastapi.testclient import TestClient

import cli
from app import build_gradio_blocks
from src.config import PROJECT_ROOT, AppSettings
from src.server import create_app

SAMPLE_IMAGE = PROJECT_ROOT / "assets" / "sample_input.jpg"


def test_fastapi_health_and_engines(tmp_path: Path) -> None:
    settings = AppSettings(output_dir=tmp_path / "outputs")
    client = TestClient(create_app(settings))

    r_health = client.get("/health")
    assert r_health.status_code == 200
    body = r_health.json()
    assert body["status"] == "ok"
    assert body["sample_asset_ready"] is True

    r_eng = client.get("/api/v1/engines")
    assert r_eng.status_code == 200
    eng_names = {e["name"] for e in r_eng.json()["engines"]}
    assert "volumetric_sdf" in eng_names
    assert "econ" in eng_names


def test_fastapi_preprocess_and_reconstruct_workflow(tmp_path: Path) -> None:
    settings = AppSettings(output_dir=tmp_path / "outputs")
    client = TestClient(create_app(settings))

    img_bytes = SAMPLE_IMAGE.read_bytes()

    # 1. Preprocess endpoint
    r_pre = client.post(
        "/api/v1/preprocess",
        files={"file": ("sample_input.jpg", img_bytes, "image/jpeg")},
        data={"image_size": "256"},
    )
    assert r_pre.status_code == 200
    pre_json = r_pre.json()
    assert pre_json["metadata"]["silhouette_iou"] > 0.90
    assert "front_rgba.png" in pre_json["files"]

    # 2. Full Reconstruct endpoint
    r_rec = client.post(
        "/api/v1/reconstruct",
        files={"file": ("sample_input.jpg", img_bytes, "image/jpeg")},
        data={
            "engine": "volumetric_sdf",
            "image_size": "256",
            "mc_resolution": "72",
            "target_faces": "3000",
            "smoothing_iterations": "6",
            "texture_mode": "uv_atlas",
        },
    )
    assert r_rec.status_code == 200
    rec_json = r_rec.json()
    job_id = rec_json["job_id"]
    assert rec_json["mesh_metrics"]["is_watertight"] is True
    assert "character.glb" in rec_json["files"]

    # Ensure relative URLs (no hardcoded localhost)
    glb_url = rec_json["files"]["character.glb"]
    assert glb_url.startswith("/api/v1/jobs/")

    # 3. Download generated .glb & query job metadata
    r_glb = client.get(glb_url)
    assert r_glb.status_code == 200
    assert r_glb.headers["content-type"] == "model/gltf-binary"
    assert r_glb.content[:4] == b"glTF"

    r_job = client.get(f"/api/v1/jobs/{job_id}")
    assert r_job.status_code == 200
    assert r_job.json()["mesh_metrics"]["is_watertight"] is True

    # 4. Path traversal protection
    r_bad = client.get(f"/api/v1/jobs/{job_id}/files/..%2Fmetadata.json")
    assert r_bad.status_code in (400, 404)


def test_cli_list_engines_and_reconstruct(tmp_path: Path, capsys: object) -> None:
    rc_list = cli.main(["--list-engines", "--json"])
    assert rc_list == 0
    captured = capsys.readouterr()  # type: ignore[attr-defined]
    engines = json.loads(captured.out)
    assert any(e["name"] == "volumetric_sdf" for e in engines)

    out_glb = tmp_path / "cli_out" / "hero.glb"
    rc_run = cli.main(
        [
            "-i",
            str(SAMPLE_IMAGE),
            "-o",
            str(out_glb),
            "--image-size",
            "256",
            "--mc-resolution",
            "72",
            "--target-faces",
            "3000",
            "--json",
        ]
    )
    assert rc_run == 0
    captured_run = capsys.readouterr()  # type: ignore[attr-defined]
    summary = json.loads(captured_run.out)
    assert summary["mesh_metrics"]["is_watertight"] is True
    assert out_glb.is_file()


def test_gradio_blocks_builds_cleanly(tmp_path: Path) -> None:
    settings = AppSettings(output_dir=tmp_path / "outputs")
    blocks = build_gradio_blocks(settings=settings, warm_start=False)
    assert blocks is not None
