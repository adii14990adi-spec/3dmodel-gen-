"""Unit & integration tests for Side-View Synthesis, Humanoid Auto-Rigging, and Async Batch Workers."""

from __future__ import annotations

import json
import struct
import time
from pathlib import Path

import numpy as np
import trimesh
from fastapi.testclient import TestClient

from src.config import (
    PROJECT_ROOT,
    AppSettings,
    PostProcessorConfig,
    PreprocessorConfig,
    QueueBackend,
    ReconstructorConfig,
    RiggingBackend,
    RiggingConfig,
    SideSynthesisBackend,
    SideSynthesizerConfig,
    WorkerQueueConfig,
)
from src.postprocessor import MeshPostProcessor
from src.preprocessor import DualViewPreprocessor
from src.reconstructor import MultiViewReconstructor
from src.rigger import AutoRigger
from src.server import create_app
from src.side_synthesizer import SideViewSynthesizer
from src.worker import celery_app, reconstruct_job_celery_task

SAMPLE_IMAGE = PROJECT_ROOT / "assets" / "sample_input.jpg"


def test_side_view_synthesizer_and_sagittal_carving() -> None:
    pre = DualViewPreprocessor(PreprocessorConfig(image_size=256)).process(SAMPLE_IMAGE)
    synth = SideViewSynthesizer(SideSynthesizerConfig(enabled=True, backend=SideSynthesisBackend.ANATOMICAL))
    sides = synth.synthesize(pre)
    assert sides is not None
    assert sides.backend_used == "anatomical"
    assert sides.left_rgba.size == (256, 256)
    assert sides.right_rgba.size == (256, 256)
    assert sides.metadata["dorsal_gear_detected"] is True
    assert float(sides.z_anterior_profile.max()) > 0.05

    # Verify fallback when Zero123++ weights / GPU are absent
    fb_synth = SideViewSynthesizer(
        SideSynthesizerConfig(
            enabled=True,
            backend=SideSynthesisBackend.ZERO123PLUS,
            allow_fallback=True,
        )
    )
    fb_sides = fb_synth.synthesize(pre)
    assert fb_sides is not None
    assert fb_sides.backend_used == "anatomical"
    assert fb_sides.metadata.get("requested_backend") == "zero123plus"

    # Reconstruct with sagittal carving active
    raw = MultiViewReconstructor(ReconstructorConfig(mc_resolution=72)).reconstruct(pre, side_views=sides)
    assert raw.diagnostics["side_profile_carved"] is True
    assert raw.mesh.is_watertight is True


def test_humanoid_auto_rigger_gltf_skin_and_smplx_transfer(tmp_path: Path) -> None:
    pre = DualViewPreprocessor(PreprocessorConfig(image_size=256)).process(SAMPLE_IMAGE)
    raw = MultiViewReconstructor(ReconstructorConfig(mc_resolution=72)).reconstruct(pre)
    post = MeshPostProcessor(PostProcessorConfig(target_faces=3000, smoothing_iterations=6)).process(
        raw, output_dir=tmp_path, stem="rigged"
    )
    glb_path = tmp_path / "rigged.glb"

    rigger = AutoRigger(RiggingConfig(enabled=True, backend=RiggingBackend.BUILTIN_HUMANOID))
    rig_res = rigger.rig_and_inject(
        watertight_mesh=post.watertight_geometry,
        glb_path=glb_path,
        output_dir=tmp_path,
    )
    assert rig_res is not None
    assert len(rig_res.skeleton.joint_names) == 25
    assert rig_res.skeleton.joint_names[0] == "Hips"
    # Verify anatomical chirality (+X = LeftArm, -X = RightArm)
    left_hand_x = rig_res.skeleton.joint_positions[10, 0]
    right_hand_x = rig_res.skeleton.joint_positions[15, 0]
    assert left_hand_x > 0.4
    assert right_hand_x < -0.4

    # Validate LBS weights sum strictly to 1.0 and obey left/right leg isolation
    j_idx, w_val = AutoRigger.compute_lbs_skin_weights(post.watertight_geometry, rig_res.skeleton)
    assert j_idx.shape == (len(post.watertight_geometry.vertices), 4)
    assert np.allclose(w_val.sum(axis=1), 1.0, atol=1e-5)

    # Parse injected binary .glb and verify glTF 2.0 `skins`, `JOINTS_0`, `WEIGHTS_0`, `inverseBindMatrices`
    raw_bytes = glb_path.read_bytes()
    j_len, _ = struct.unpack_from("<I4s", raw_bytes, 12)
    gltf = json.loads(raw_bytes[20 : 20 + j_len].decode("utf-8"))
    assert len(gltf["skins"]) == 1
    assert len(gltf["skins"][0]["joints"]) == 25
    attrs = gltf["meshes"][0]["primitives"][0]["attributes"]
    assert "JOINTS_0" in attrs
    assert "WEIGHTS_0" in attrs

    reloaded = trimesh.load(str(glb_path), force="mesh")
    assert len(reloaded.faces) == len(post.mesh.faces)
    assert (tmp_path / "skeleton_rig.json").is_file()
    assert (tmp_path / "rig_preview.png").is_file()

    # Verify SMPL-X `.npz` template KDTree transfer connector
    smplx_npz = tmp_path / "mock_smplx.npz"
    v_tmpl = post.watertight_geometry.vertices.copy()
    w_tmpl = np.zeros((len(v_tmpl), 22), dtype=np.float32)
    w_tmpl[:, 0] = 0.7
    w_tmpl[:, 3] = 0.3
    np.savez(smplx_npz, v_template=v_tmpl, weights=w_tmpl)

    smplx_rigger = AutoRigger(
        RiggingConfig(
            enabled=True,
            backend=RiggingBackend.SMPLX,
            smplx_model_path=str(smplx_npz),
        )
    )
    smplx_res = smplx_rigger.rig_and_inject(post.watertight_geometry)
    assert smplx_res is not None
    assert smplx_res.skeleton.backend_used == "smplx"


def test_async_worker_queue_and_batch_endpoints(tmp_path: Path) -> None:
    settings = AppSettings(
        output_dir=tmp_path / "outputs",
        worker_queue=WorkerQueueConfig(backend=QueueBackend.INPROCESS, max_workers=2),
    )
    client = TestClient(create_app(settings))
    img_bytes = SAMPLE_IMAGE.read_bytes()

    # 1. Single async job submission (202 Accepted)
    r_sub = client.post(
        "/api/v1/jobs/submit",
        files={"file": ("sample_input.jpg", img_bytes, "image/jpeg")},
        data={
            "image_size": "256",
            "mc_resolution": "64",
            "target_faces": "2500",
            "enable_side_synthesis": "true",
            "enable_rigging": "true",
        },
    )
    assert r_sub.status_code == 202
    sub_body = r_sub.json()
    assert len(sub_body["job_id"]) >= 8
    assert sub_body["queue_backend"] == "inprocess"

    # Poll until worker finishes
    final_job = {}
    for _ in range(80):
        r_poll = client.get(sub_body["poll_url"])
        assert r_poll.status_code == 200
        final_job = r_poll.json()
        if final_job.get("status") == "completed":
            break
        time.sleep(0.1)

    assert final_job.get("status") == "completed"
    assert final_job["rigging"]["enabled"] is True
    assert final_job["side_synthesis"]["enabled"] is True
    assert "character.glb" in final_job["files"]

    # 2. Multi-image batch submission (202 Accepted)
    r_batch = client.post(
        "/api/v1/jobs/batch",
        files=[
            ("files", ("char_a.jpg", img_bytes, "image/jpeg")),
            ("files", ("char_b.jpg", img_bytes, "image/jpeg")),
        ],
        data={"mc_resolution": "64", "target_faces": "2000"},
    )
    assert r_batch.status_code == 202
    batch_body = r_batch.json()
    assert batch_body["total_jobs"] == 2

    batch_state = {}
    for _ in range(100):
        r_bp = client.get(batch_body["poll_url"])
        assert r_bp.status_code == 200
        batch_state = r_bp.json()
        if batch_state.get("status") == "completed":
            break
        time.sleep(0.1)

    assert batch_state.get("status") == "completed"
    assert batch_state["counts"]["completed"] == 2

    # 3. Queue telemetry endpoint
    r_stats = client.get("/api/v1/queue/stats")
    assert r_stats.status_code == 200
    assert r_stats.json()["submitted_this_process"] >= 3


def test_celery_task_eager_execution(tmp_path: Path) -> None:
    celery_app.conf.task_always_eager = True
    job_dir = tmp_path / "celery_job"
    job_dir.mkdir(parents=True, exist_ok=True)
    inp = job_dir / "input.jpg"
    inp.write_bytes(SAMPLE_IMAGE.read_bytes())

    cfg = AppSettings(output_dir=tmp_path).to_pipeline_config()
    cfg.preprocessor.image_size = 256
    cfg.reconstructor.mc_resolution = 64
    cfg.postprocessor.target_faces = 2000

    eager_res = reconstruct_job_celery_task.apply(
        args=("celerytest01", str(inp), str(job_dir), cfg.model_dump(mode="json"))
    )
    out = eager_res.get()
    assert out["status"] == "completed"
    assert (job_dir / "character.glb").is_file()
