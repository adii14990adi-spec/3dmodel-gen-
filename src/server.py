"""FastAPI REST service for Auto3D-Human image-to-3D character reconstruction."""

from __future__ import annotations

import json
import logging
import re
import shutil
import time
import uuid
from pathlib import Path
from typing import Annotated, Any

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from src import __version__
from src.config import (
    AppSettings,
    PipelineConfig,
    PostProcessorConfig,
    PreprocessorConfig,
    ReconstructionEngineType,
    RiggingBackend,
    RiggingConfig,
    SegmentationBackend,
    SideSynthesisBackend,
    SideSynthesizerConfig,
    SplitMode,
    TextureMode,
    get_settings,
)
from src.pipeline import Auto3DHumanPipeline
from src.postprocessor import HAS_OPEN3D
from src.preprocessor import DualViewPreprocessor
from src.reconstructor import MultiViewReconstructor, resolve_compute_device
from src.ue5_bpy_generator import has_bpy_runtime
from src.worker import JobQueueManager

logger = logging.getLogger(__name__)

_SAFE_ID_RE = re.compile(r"^[a-zA-Z0-9_-]{4,64}$")

_MIME_TYPES: dict[str, str] = {
    ".glb": "model/gltf-binary",
    ".fbx": "application/octet-stream",
    ".obj": "text/plain; charset=utf-8",
    ".mtl": "text/plain; charset=utf-8",
    ".py": "text/x-python; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".zip": "application/zip",
    ".json": "application/json",
}


class HealthResponse(BaseModel):
    """Service liveness and capability diagnostics."""

    status: str = "ok"
    service: str
    version: str
    device: str
    queue_backend: str
    uptime_seconds: float
    open3d_available: bool
    bpy_available: bool
    sample_asset_ready: bool


class EngineStatusItem(BaseModel):
    """Information on a single registered 3D reconstruction engine."""

    name: str
    category: str
    available: bool
    requires_gpu: bool
    description: str
    reason: str


class EnginesResponse(BaseModel):
    """All registered primary and clothed-body reconstruction backends."""

    default_engine: str
    engines: list[EngineStatusItem]


class PreprocessResponse(BaseModel):
    """Result returned by the dual-view preprocessing endpoint."""

    job_id: str
    status: str = "completed"
    elapsed_seconds: float
    metadata: dict[str, Any]
    files: dict[str, str]


class ReconstructionResponse(BaseModel):
    """Result returned by the synchronous end-to-end 3D character reconstruction endpoint."""

    job_id: str
    status: str = "completed"
    elapsed_seconds: float
    timings_seconds: dict[str, float]
    engine_used: str
    preprocessing: dict[str, Any]
    side_synthesis: dict[str, Any]
    mesh_metrics: dict[str, Any]
    rigging: dict[str, Any]
    files: dict[str, str] = Field(
        description="Relative download URLs for generated .glb, .obj, .zip, rig JSON, and preview PNGs."
    )


class QueuedJobResponse(BaseModel):
    """Immediate 202 response when offloading a reconstruction job to the background worker queue."""

    job_id: str
    status: str
    queue_backend: str
    poll_url: str


class BatchSubmitResponse(BaseModel):
    """Immediate 202 response when enqueuing a multi-character batch."""

    batch_id: str
    total_jobs: int
    job_ids: list[str]
    queue_backend: str
    poll_url: str


def _prune_old_jobs(jobs_root: Path, max_keep: int) -> None:
    if not jobs_root.is_dir() or max_keep <= 0:
        return
    dirs = [d for d in jobs_root.iterdir() if d.is_dir()]
    if len(dirs) <= max_keep:
        return
    dirs.sort(key=lambda d: d.stat().st_mtime, reverse=True)
    for stale in dirs[max_keep:]:
        shutil.rmtree(stale, ignore_errors=True)


def _read_upload_bytes(upload: UploadFile, max_mb: int) -> bytes:
    limit_bytes = max_mb * 1024 * 1024
    data = upload.file.read(limit_bytes + 1)
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty.")
    if len(data) > limit_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"Uploaded file exceeds maximum allowed size of {max_mb} MB.",
        )
    return data


def _build_file_urls(job_id: str, job_dir: Path) -> dict[str, str]:
    urls: dict[str, str] = {}
    if not job_dir.is_dir():
        return urls
    for p in sorted(job_dir.iterdir()):
        if p.is_file() and not p.name.endswith(".tmp"):
            urls[p.name] = f"/api/v1/jobs/{job_id}/files/{p.name}"
    return urls


def _build_pipeline_config(
    cfg: AppSettings,
    *,
    engine: ReconstructionEngineType,
    split_mode: SplitMode,
    segmentation_backend: SegmentationBackend,
    swap_views: bool,
    image_size: int,
    enable_side_synthesis: bool,
    side_backend: SideSynthesisBackend,
    mc_resolution: int,
    depth_scale: float,
    relief_strength: float,
    target_faces: int,
    smoothing_iterations: int,
    texture_mode: TextureMode,
    target_height: float,
    enable_rigging: bool,
    rigging_backend: RiggingBackend,
    ue5_subsurf_level: int = 2,
    ue5_cycles_samples: int = 24,
    ue5_adapt_reference: bool = False,
) -> PipelineConfig:
    return PipelineConfig(
        preprocessor=PreprocessorConfig(
            image_size=image_size,
            split_mode=split_mode,
            segmentation_backend=segmentation_backend,
            swap_views=swap_views,
            allow_downloads=cfg.allow_downloads,
        ),
        side_synthesizer=SideSynthesizerConfig(
            enabled=enable_side_synthesis and side_backend != SideSynthesisBackend.NONE,
            backend=side_backend,
        ),
        reconstructor=cfg.reconstructor.model_copy(
            update={
                "engine": engine,
                "mc_resolution": mc_resolution,
                "depth_scale": depth_scale,
                "relief_strength": relief_strength,
                "ue5_subsurf_level": ue5_subsurf_level,
                "ue5_cycles_samples": ue5_cycles_samples,
                "ue5_adapt_reference": ue5_adapt_reference,
            }
        ),
        postprocessor=PostProcessorConfig(
            target_faces=target_faces,
            smoothing_iterations=smoothing_iterations,
            texture_mode=texture_mode,
            target_height=target_height,
            export_formats=["glb", "obj"],
        ),
        rigging=RiggingConfig(
            enabled=enable_rigging and rigging_backend != RiggingBackend.NONE,
            backend=rigging_backend,
        ),
    )


def create_app(settings: AppSettings | None = None) -> FastAPI:
    """Create and configure the FastAPI REST application."""
    cfg = settings or get_settings()
    boot_time = time.monotonic()

    api = FastAPI(
        title=f"{cfg.app_name} API",
        version=__version__,
        description=(
            "Automated Dual-View T-Pose Character Image-to-3D Pipeline. "
            "Includes ±90° side-profile synthesis, multi-view 3D reconstruction, "
            "watertight PBR .glb/.obj export, 25-joint humanoid auto-rigging, and "
            "Celery/Redis + ThreadPool async batch worker queues."
        ),
    )

    api.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    jobs_root = cfg.output_dir / "jobs"
    jobs_root.mkdir(parents=True, exist_ok=True)
    queue_mgr = JobQueueManager(cfg)
    api.state.queue_manager = queue_mgr

    @api.get("/health", response_model=HealthResponse, tags=["System"])
    def health_check() -> HealthResponse:
        return HealthResponse(
            status="ok",
            service=cfg.app_name,
            version=__version__,
            device=resolve_compute_device(cfg.reconstructor.device),
            queue_backend=queue_mgr.resolve_active_backend(),
            uptime_seconds=round(time.monotonic() - boot_time, 2),
            open3d_available=HAS_OPEN3D,
            bpy_available=has_bpy_runtime(),
            sample_asset_ready=cfg.sample_image_path.is_file(),
        )

    @api.get("/api/v1/engines", response_model=EnginesResponse, tags=["System"])
    def list_engines() -> EnginesResponse:
        rec = MultiViewReconstructor(cfg.reconstructor)
        items = [
            EngineStatusItem(
                name=e.name,
                category=e.category,
                available=e.available,
                requires_gpu=e.requires_gpu,
                description=e.description,
                reason=e.reason,
            )
            for e in rec.list_engines()
        ]
        return EnginesResponse(default_engine=cfg.reconstructor.engine.value, engines=items)

    @api.get("/api/v1/queue/stats", tags=["Worker Queue"])
    def get_queue_stats() -> dict[str, Any]:
        return queue_mgr.queue_stats()

    @api.post("/api/v1/preprocess", response_model=PreprocessResponse, tags=["Pipeline"])
    def preprocess_endpoint(
        file: Annotated[UploadFile, File(description="Dual-view T-pose character image (Front | Back)")],
        image_size: Annotated[int, Form(ge=128, le=2048)] = 512,
        split_mode: Annotated[SplitMode, Form()] = SplitMode.AUTO,
        segmentation_backend: Annotated[SegmentationBackend, Form()] = SegmentationBackend.AUTO,
        swap_views: Annotated[bool, Form()] = False,
    ) -> PreprocessResponse:
        raw_bytes = _read_upload_bytes(file, cfg.max_upload_mb)
        job_id = uuid.uuid4().hex[:12]
        job_dir = jobs_root / job_id
        job_dir.mkdir(parents=True, exist_ok=True)

        pre_cfg = PreprocessorConfig(
            image_size=image_size,
            split_mode=split_mode,
            segmentation_backend=segmentation_backend,
            swap_views=swap_views,
            allow_downloads=cfg.allow_downloads,
        )
        t0 = time.perf_counter()
        try:
            pair = DualViewPreprocessor(pre_cfg).process(raw_bytes)
        except (ValueError, RuntimeError) as exc:
            shutil.rmtree(job_dir, ignore_errors=True)
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        elapsed = time.perf_counter() - t0

        pair.front_rgba.save(job_dir / "front_rgba.png", format="PNG")
        pair.back_rgba.save(job_dir / "back_rgba.png", format="PNG")
        pair.preview_image.save(job_dir / "preprocessed_preview.png", format="PNG")
        meta_payload = {
            "job_id": job_id,
            "stage": "preprocess",
            "elapsed_seconds": round(elapsed, 3),
            "preprocessing": pair.metadata,
        }
        (job_dir / "metadata.json").write_text(json.dumps(meta_payload, indent=2), encoding="utf-8")
        _prune_old_jobs(jobs_root, cfg.job_retention_count)

        return PreprocessResponse(
            job_id=job_id,
            elapsed_seconds=round(elapsed, 3),
            metadata=pair.metadata,
            files=_build_file_urls(job_id, job_dir),
        )

    @api.post("/api/v1/reconstruct", response_model=ReconstructionResponse, tags=["Pipeline"])
    def reconstruct_endpoint(
        file: Annotated[UploadFile, File(description="Dual-view T-pose character image (Front | Back)")],
        engine: Annotated[ReconstructionEngineType, Form()] = ReconstructionEngineType.AUTO,
        split_mode: Annotated[SplitMode, Form()] = SplitMode.AUTO,
        segmentation_backend: Annotated[SegmentationBackend, Form()] = SegmentationBackend.AUTO,
        swap_views: Annotated[bool, Form()] = False,
        image_size: Annotated[int, Form(ge=128, le=2048)] = 512,
        enable_side_synthesis: Annotated[bool, Form()] = True,
        side_backend: Annotated[SideSynthesisBackend, Form()] = SideSynthesisBackend.AUTO,
        mc_resolution: Annotated[int, Form(ge=48, le=384)] = 160,
        depth_scale: Annotated[float, Form(ge=0.20, le=1.00)] = 0.55,
        relief_strength: Annotated[float, Form(ge=0.00, le=0.30)] = 0.08,
        target_faces: Annotated[int, Form(ge=0, le=500000)] = 20000,
        smoothing_iterations: Annotated[int, Form(ge=0, le=100)] = 12,
        texture_mode: Annotated[TextureMode, Form()] = TextureMode.UV_ATLAS,
        target_height: Annotated[float, Form(gt=0.10, le=10.0)] = 1.80,
        enable_rigging: Annotated[bool, Form()] = True,
        rigging_backend: Annotated[RiggingBackend, Form()] = RiggingBackend.AUTO,
    ) -> ReconstructionResponse:
        raw_bytes = _read_upload_bytes(file, cfg.max_upload_mb)
        pipe_cfg = _build_pipeline_config(
            cfg,
            engine=engine,
            split_mode=split_mode,
            segmentation_backend=segmentation_backend,
            swap_views=swap_views,
            image_size=image_size,
            enable_side_synthesis=enable_side_synthesis,
            side_backend=side_backend,
            mc_resolution=mc_resolution,
            depth_scale=depth_scale,
            relief_strength=relief_strength,
            target_faces=target_faces,
            smoothing_iterations=smoothing_iterations,
            texture_mode=texture_mode,
            target_height=target_height,
            enable_rigging=enable_rigging,
            rigging_backend=rigging_backend,
        )
        return _execute_reconstruction_job(raw_bytes, pipe_cfg, jobs_root, cfg.job_retention_count)

    @api.post(
        "/api/v1/jobs/submit",
        response_model=QueuedJobResponse,
        status_code=202,
        tags=["Worker Queue"],
    )
    def submit_async_job(
        file: Annotated[UploadFile, File(description="Dual-view T-pose character image")],
        engine: Annotated[ReconstructionEngineType, Form()] = ReconstructionEngineType.AUTO,
        split_mode: Annotated[SplitMode, Form()] = SplitMode.AUTO,
        segmentation_backend: Annotated[SegmentationBackend, Form()] = SegmentationBackend.AUTO,
        swap_views: Annotated[bool, Form()] = False,
        image_size: Annotated[int, Form(ge=128, le=2048)] = 512,
        enable_side_synthesis: Annotated[bool, Form()] = True,
        side_backend: Annotated[SideSynthesisBackend, Form()] = SideSynthesisBackend.AUTO,
        mc_resolution: Annotated[int, Form(ge=48, le=384)] = 160,
        depth_scale: Annotated[float, Form(ge=0.20, le=1.00)] = 0.55,
        relief_strength: Annotated[float, Form(ge=0.00, le=0.30)] = 0.08,
        target_faces: Annotated[int, Form(ge=0, le=500000)] = 20000,
        smoothing_iterations: Annotated[int, Form(ge=0, le=100)] = 12,
        texture_mode: Annotated[TextureMode, Form()] = TextureMode.UV_ATLAS,
        target_height: Annotated[float, Form(gt=0.10, le=10.0)] = 1.80,
        enable_rigging: Annotated[bool, Form()] = True,
        rigging_backend: Annotated[RiggingBackend, Form()] = RiggingBackend.AUTO,
    ) -> QueuedJobResponse:
        raw_bytes = _read_upload_bytes(file, cfg.max_upload_mb)
        pipe_cfg = _build_pipeline_config(
            cfg,
            engine=engine,
            split_mode=split_mode,
            segmentation_backend=segmentation_backend,
            swap_views=swap_views,
            image_size=image_size,
            enable_side_synthesis=enable_side_synthesis,
            side_backend=side_backend,
            mc_resolution=mc_resolution,
            depth_scale=depth_scale,
            relief_strength=relief_strength,
            target_faces=target_faces,
            smoothing_iterations=smoothing_iterations,
            texture_mode=texture_mode,
            target_height=target_height,
            enable_rigging=enable_rigging,
            rigging_backend=rigging_backend,
        )
        state = queue_mgr.submit_job(raw_bytes, file.filename or "input.png", pipe_cfg)
        _prune_old_jobs(jobs_root, cfg.job_retention_count)
        jid = state["job_id"]
        return QueuedJobResponse(
            job_id=jid,
            status=state["status"],
            queue_backend=state["queue_backend"],
            poll_url=f"/api/v1/jobs/{jid}",
        )

    @api.post(
        "/api/v1/jobs/batch",
        response_model=BatchSubmitResponse,
        status_code=202,
        tags=["Worker Queue"],
    )
    def submit_batch_jobs(
        files: Annotated[list[UploadFile], File(description="Multiple dual-view character sheets")],
        engine: Annotated[ReconstructionEngineType, Form()] = ReconstructionEngineType.AUTO,
        mc_resolution: Annotated[int, Form(ge=48, le=384)] = 160,
        target_faces: Annotated[int, Form(ge=0, le=500000)] = 20000,
        enable_side_synthesis: Annotated[bool, Form()] = True,
        enable_rigging: Annotated[bool, Form()] = True,
    ) -> BatchSubmitResponse:
        if not files:
            raise HTTPException(status_code=400, detail="At least one image file must be provided.")
        max_b = cfg.worker_queue.max_batch_size
        if len(files) > max_b:
            raise HTTPException(
                status_code=400,
                detail=f"Batch size {len(files)} exceeds maximum allowed ({max_b}).",
            )

        items: list[tuple[bytes, str]] = []
        for idx, uf in enumerate(files):
            b = _read_upload_bytes(uf, cfg.max_upload_mb)
            items.append((b, uf.filename or f"batch_item_{idx}.png"))

        pipe_cfg = cfg.to_pipeline_config()
        pipe_cfg.reconstructor.engine = engine
        pipe_cfg.reconstructor.mc_resolution = mc_resolution
        pipe_cfg.postprocessor.target_faces = target_faces
        pipe_cfg.side_synthesizer.enabled = enable_side_synthesis
        pipe_cfg.rigging.enabled = enable_rigging

        batch_rec = queue_mgr.submit_batch(items, pipe_cfg)
        bid = batch_rec["batch_id"]
        return BatchSubmitResponse(
            batch_id=bid,
            total_jobs=batch_rec["total_jobs"],
            job_ids=batch_rec["job_ids"],
            queue_backend=queue_mgr.resolve_active_backend(),
            poll_url=f"/api/v1/batches/{bid}",
        )

    @api.get("/api/v1/batches/{batch_id}", tags=["Worker Queue"])
    def get_batch_status(batch_id: str) -> dict[str, Any]:
        if not _SAFE_ID_RE.match(batch_id):
            raise HTTPException(status_code=400, detail="Invalid batch_id format.")
        state = queue_mgr.get_batch_state(batch_id)
        if state is None:
            raise HTTPException(status_code=404, detail=f"Batch '{batch_id}' not found.")
        return state

    @api.post("/api/v1/reconstruct/sample", response_model=ReconstructionResponse, tags=["Pipeline"])
    def reconstruct_sample_endpoint(
        engine: ReconstructionEngineType = ReconstructionEngineType.AUTO,
        mc_resolution: int = 160,
        target_faces: int = 20000,
        texture_mode: TextureMode = TextureMode.UV_ATLAS,
        enable_side_synthesis: bool = True,
        enable_rigging: bool = True,
    ) -> ReconstructionResponse:
        if not cfg.sample_image_path.is_file():
            raise HTTPException(
                status_code=404,
                detail=f"Sample input asset not found at {cfg.sample_image_path}",
            )
        pipe_cfg = cfg.to_pipeline_config()
        pipe_cfg.reconstructor.engine = engine
        pipe_cfg.reconstructor.mc_resolution = mc_resolution
        pipe_cfg.postprocessor.target_faces = target_faces
        pipe_cfg.postprocessor.texture_mode = texture_mode
        pipe_cfg.side_synthesizer.enabled = enable_side_synthesis
        pipe_cfg.rigging.enabled = enable_rigging
        return _execute_reconstruction_job(
            cfg.sample_image_path, pipe_cfg, jobs_root, cfg.job_retention_count
        )

    @api.post("/api/v1/ue5/generate", response_model=ReconstructionResponse, tags=["UE5 High-Poly BPY"])
    def generate_ue5_character_endpoint(
        file: Annotated[
            UploadFile | None,
            File(description="Optional dual-view turnaround sheet (uses sample sheet if omitted)"),
        ] = None,
        subsurf_level: Annotated[int, Form(ge=1, le=3)] = 2,
        cycles_samples: Annotated[int, Form(ge=0, le=256)] = 24,
        adapt_to_reference: Annotated[bool, Form()] = False,
    ) -> ReconstructionResponse:
        if not has_bpy_runtime():
            raise HTTPException(
                status_code=503,
                detail="Blender Python (`bpy`) runtime is not installed in this environment.",
            )
        source_data: bytes | Path
        if file is not None and file.filename:
            source_data = _read_upload_bytes(file, cfg.max_upload_mb)
        elif cfg.sample_image_path.is_file():
            source_data = cfg.sample_image_path
        else:
            raise HTTPException(status_code=400, detail="No turnaround sheet provided.")

        pipe_cfg = cfg.to_pipeline_config()
        pipe_cfg.reconstructor.engine = ReconstructionEngineType.UE5_HIGHPOLY_BPY
        pipe_cfg.reconstructor.allow_fallback = False
        pipe_cfg.reconstructor.ue5_subsurf_level = subsurf_level
        pipe_cfg.reconstructor.ue5_cycles_samples = cycles_samples
        pipe_cfg.reconstructor.ue5_adapt_reference = adapt_to_reference
        pipe_cfg.rigging.enabled = True
        return _execute_reconstruction_job(source_data, pipe_cfg, jobs_root, cfg.job_retention_count)

    @api.get("/api/v1/jobs/{job_id}", tags=["Jobs"])
    def get_job_metadata(job_id: str) -> dict[str, Any]:
        job_dir = _resolve_safe_job_dir(jobs_root, job_id)
        state = queue_mgr.get_job_state(job_id)
        meta_file = job_dir / "metadata.json"

        payload: dict[str, Any] = {}
        if meta_file.is_file():
            payload.update(json.loads(meta_file.read_text(encoding="utf-8")))
        if state is not None:
            payload["job_id"] = job_id
            payload["status"] = state.get("status", "completed")
            payload["stage"] = state.get("stage", "completed")
            payload["progress_pct"] = state.get("progress_pct", 100)
            if "error" in state:
                payload["error"] = state["error"]
            if "result" in state and "mesh_metrics" not in payload:
                payload.update(state["result"])

        if not payload:
            raise HTTPException(status_code=404, detail=f"Metadata not found for job '{job_id}'.")

        payload["files"] = _build_file_urls(job_id, job_dir)
        return payload

    @api.get("/api/v1/jobs/{job_id}/files/{filename}", tags=["Jobs"])
    def download_job_file(job_id: str, filename: str) -> FileResponse:
        job_dir = _resolve_safe_job_dir(jobs_root, job_id)
        if Path(filename).name != filename or ".." in filename:
            raise HTTPException(status_code=400, detail="Invalid filename.")
        target = (job_dir / filename).resolve()
        if not target.is_relative_to(job_dir.resolve()) or not target.is_file():
            raise HTTPException(status_code=404, detail=f"Artifact '{filename}' not found.")

        media_type = _MIME_TYPES.get(target.suffix.lower(), "application/octet-stream")
        return FileResponse(path=target, media_type=media_type, filename=target.name)

    return api


def _resolve_safe_job_dir(jobs_root: Path, job_id: str) -> Path:
    if not _SAFE_ID_RE.match(job_id):
        raise HTTPException(status_code=400, detail="Invalid job_id format.")
    job_dir = (jobs_root / job_id).resolve()
    if not job_dir.is_relative_to(jobs_root.resolve()) or not job_dir.is_dir():
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found.")
    return job_dir


def _execute_reconstruction_job(
    source: bytes | Path,
    pipe_cfg: PipelineConfig,
    jobs_root: Path,
    retention_count: int,
) -> ReconstructionResponse:
    job_id = uuid.uuid4().hex[:12]
    job_dir = jobs_root / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    try:
        pipeline = Auto3DHumanPipeline(pipe_cfg)
        result = pipeline.run(source=source, output_dir=job_dir, stem="character", save_intermediate=True)
    except (ValueError, RuntimeError) as exc:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        shutil.rmtree(job_dir, ignore_errors=True)
        logger.exception("Unexpected error during reconstruction job %s", job_id)
        raise HTTPException(status_code=500, detail=f"Reconstruction failed: {exc}") from exc

    _prune_old_jobs(jobs_root, retention_count)
    summary = result.summary_dict()
    return ReconstructionResponse(
        job_id=job_id,
        elapsed_seconds=summary["elapsed_seconds"],
        timings_seconds=summary["timings_seconds"],
        engine_used=summary["engine_used"],
        preprocessing=summary["preprocessing"],
        side_synthesis=summary["side_synthesis"],
        mesh_metrics=summary["mesh_metrics"],
        rigging=summary["rigging"],
        files=_build_file_urls(job_id, job_dir),
    )


app = create_app()


if __name__ == "__main__":
    import uvicorn

    settings = get_settings()
    uvicorn.run("src.server:app", host=settings.api_host, port=settings.api_port, reload=False)
