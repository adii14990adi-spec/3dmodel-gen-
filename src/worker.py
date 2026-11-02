"""Asynchronous & distributed batch worker queue (Celery + Redis with ThreadPool fallback).

Offloads heavy 3D reconstruction jobs from the FastAPI web tier so port 7860 remains
responsive under concurrent multi-user and batch character generation workloads.
"""

from __future__ import annotations

import json
import logging
import os
import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Any

from celery import Celery

from src.config import AppSettings, PipelineConfig, QueueBackend, get_settings
from src.pipeline import Auto3DHumanPipeline

logger = logging.getLogger(__name__)

_DEFAULT_REDIS_URL = os.environ.get("AUTO3D_WORKER_QUEUE__REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "auto3d_human",
    broker=_DEFAULT_REDIS_URL,
    backend=_DEFAULT_REDIS_URL,
)
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_track_started=True,
)


def _write_json_atomic(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(f".{uuid.uuid4().hex[:6]}.tmp")
    tmp.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    tmp.replace(path)


def _read_json(path: Path) -> dict[str, Any] | None:
    if not path.is_file():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def execute_queued_job(
    job_id: str,
    input_image_path: str,
    job_dir_str: str,
    pipeline_config_dict: dict[str, Any],
) -> dict[str, Any]:
    """Worker entrypoint executed either by a Celery worker process or ThreadPool worker."""
    job_dir = Path(job_dir_str)
    state_file = job_dir / "job_state.json"
    now = time.time()

    state = _read_json(state_file) or {"job_id": job_id, "created_at": now}
    state.update(
        {
            "status": "processing",
            "stage": "initializing",
            "progress_pct": 5,
            "started_at": now,
        }
    )
    _write_json_atomic(state_file, state)

    def _on_progress(stage: str, pct: int) -> None:
        cur = _read_json(state_file) or {"job_id": job_id}
        cur.update({"status": "processing", "stage": stage, "progress_pct": pct})
        _write_json_atomic(state_file, cur)

    try:
        pipe_cfg = PipelineConfig.model_validate(pipeline_config_dict)
        pipeline = Auto3DHumanPipeline(pipe_cfg)
        result = pipeline.run(
            source=Path(input_image_path),
            output_dir=job_dir,
            stem="character",
            save_intermediate=True,
            progress_callback=_on_progress,
        )
        summary = result.summary_dict()
        completed_state = {
            **state,
            "status": "completed",
            "stage": "completed",
            "progress_pct": 100,
            "completed_at": time.time(),
            "result": summary,
        }
        _write_json_atomic(state_file, completed_state)
        return completed_state
    except Exception as exc:
        logger.exception("Queued reconstruction job %s failed", job_id)
        failed_state = {
            **state,
            "status": "failed",
            "stage": "error",
            "error": str(exc),
            "completed_at": time.time(),
        }
        _write_json_atomic(state_file, failed_state)
        return failed_state


@celery_app.task(name="auto3d.reconstruct_job")
def reconstruct_job_celery_task(
    job_id: str,
    input_image_path: str,
    job_dir_str: str,
    pipeline_config_dict: dict[str, Any],
) -> dict[str, Any]:
    """Distributed Celery task wrapper around `execute_queued_job`."""
    return execute_queued_job(job_id, input_image_path, job_dir_str, pipeline_config_dict)


class JobQueueManager:
    """Manages async single & batch 3D reconstruction jobs across Celery/Redis or ThreadPool."""

    def __init__(self, settings: AppSettings | None = None) -> None:
        self.settings = settings or get_settings()
        self.jobs_root = self.settings.output_dir / "jobs"
        self.batches_root = self.settings.output_dir / "batches"
        self.jobs_root.mkdir(parents=True, exist_ok=True)
        self.batches_root.mkdir(parents=True, exist_ok=True)

        self._lock = threading.Lock()
        self._executor = ThreadPoolExecutor(
            max_workers=self.settings.worker_queue.max_workers,
            thread_name_prefix="auto3d-worker",
        )
        self._submitted_count = 0

    def resolve_active_backend(self) -> str:
        """Determine whether Celery+Redis is active or built-in ThreadPool queue is used."""
        cfg_backend = self.settings.worker_queue.backend
        if cfg_backend == QueueBackend.INPROCESS:
            return "inprocess"
        if cfg_backend == QueueBackend.CELERY:
            return "celery"

        # AUTO: probe Redis broker reachability with a fast 250ms socket timeout
        try:
            import redis

            client = redis.Redis.from_url(
                self.settings.worker_queue.redis_url,
                socket_connect_timeout=0.25,
                socket_timeout=0.25,
            )
            if client.ping():
                return "celery"
        except Exception:
            pass
        return "inprocess"

    def submit_job(
        self,
        image_bytes: bytes,
        filename: str,
        pipe_cfg: PipelineConfig,
        batch_id: str | None = None,
    ) -> dict[str, Any]:
        """Persist input upload and enqueue an asynchronous reconstruction job."""
        job_id = uuid.uuid4().hex[:12]
        job_dir = self.jobs_root / job_id
        job_dir.mkdir(parents=True, exist_ok=True)

        ext = Path(filename or "input.png").suffix.lower()
        if ext not in (".png", ".jpg", ".jpeg", ".webp", ".bmp"):
            ext = ".png"
        input_path = job_dir / f"source_input{ext}"
        input_path.write_bytes(image_bytes)

        active_backend = self.resolve_active_backend()
        now = time.time()
        initial_state: dict[str, Any] = {
            "job_id": job_id,
            "batch_id": batch_id,
            "source_filename": filename,
            "queue_backend": active_backend,
            "status": "queued",
            "stage": "queued",
            "progress_pct": 0,
            "created_at": now,
        }
        state_file = job_dir / "job_state.json"
        _write_json_atomic(state_file, initial_state)

        cfg_dict = pipe_cfg.model_dump(mode="json")

        with self._lock:
            self._submitted_count += 1

        if active_backend == "celery":
            celery_app.conf.broker_url = self.settings.worker_queue.redis_url
            celery_app.conf.result_backend = self.settings.worker_queue.redis_url
            reconstruct_job_celery_task.delay(
                job_id,
                str(input_path),
                str(job_dir),
                cfg_dict,
            )
        else:
            self._executor.submit(
                execute_queued_job,
                job_id,
                str(input_path),
                str(job_dir),
                cfg_dict,
            )

        return initial_state

    def submit_batch(
        self,
        items: list[tuple[bytes, str]],
        pipe_cfg: PipelineConfig,
    ) -> dict[str, Any]:
        """Enqueue a batch of character sheets concurrently and return batch tracking record."""
        batch_id = uuid.uuid4().hex[:12]
        job_ids: list[str] = []
        for img_bytes, fname in items:
            st = self.submit_job(img_bytes, fname, pipe_cfg, batch_id=batch_id)
            job_ids.append(st["job_id"])

        batch_record = {
            "batch_id": batch_id,
            "created_at": time.time(),
            "total_jobs": len(job_ids),
            "job_ids": job_ids,
        }
        _write_json_atomic(self.batches_root / f"{batch_id}.json", batch_record)
        return batch_record

    def get_job_state(self, job_id: str) -> dict[str, Any] | None:
        """Retrieve current status, stage progress, and artifact metadata for `job_id`."""
        job_dir = self.jobs_root / job_id
        state = _read_json(job_dir / "job_state.json")
        if state is not None:
            return state
        # Fallback for synchronous jobs that wrote `metadata.json` directly
        meta = _read_json(job_dir / "metadata.json")
        if meta is not None:
            return {
                "job_id": job_id,
                "status": "completed",
                "stage": "completed",
                "progress_pct": 100,
                "result": meta,
            }
        return None

    def get_batch_state(self, batch_id: str) -> dict[str, Any] | None:
        """Aggregate real-time progress across all jobs belonging to `batch_id`."""
        record = _read_json(self.batches_root / f"{batch_id}.json")
        if record is None:
            return None

        jobs_summary: list[dict[str, Any]] = []
        counts = {"queued": 0, "processing": 0, "completed": 0, "failed": 0}
        for jid in record.get("job_ids", []):
            st = self.get_job_state(jid) or {"job_id": jid, "status": "unknown", "progress_pct": 0}
            status = st.get("status", "queued")
            if status in counts:
                counts[status] += 1
            jobs_summary.append(
                {
                    "job_id": jid,
                    "source_filename": st.get("source_filename"),
                    "status": status,
                    "stage": st.get("stage"),
                    "progress_pct": st.get("progress_pct", 0),
                    "poll_url": f"/api/v1/jobs/{jid}",
                }
            )

        total = max(len(jobs_summary), 1)
        if counts["completed"] + counts["failed"] == len(jobs_summary):
            overall = "completed" if counts["failed"] == 0 else "completed_with_errors"
        elif counts["processing"] > 0 or counts["completed"] > 0:
            overall = "processing"
        else:
            overall = "queued"

        avg_pct = int(round(sum(j["progress_pct"] for j in jobs_summary) / float(total)))
        return {
            **record,
            "status": overall,
            "progress_pct": avg_pct,
            "counts": counts,
            "jobs": jobs_summary,
        }

    def queue_stats(self) -> dict[str, Any]:
        """Inspect active queue backend and counts of tracked jobs on disk."""
        counts = {"queued": 0, "processing": 0, "completed": 0, "failed": 0}
        if self.jobs_root.is_dir():
            for d in self.jobs_root.iterdir():
                if not d.is_dir():
                    continue
                st = _read_json(d / "job_state.json")
                if st and st.get("status") in counts:
                    counts[st["status"]] += 1
                elif (d / "metadata.json").is_file():
                    counts["completed"] += 1

        return {
            "active_backend": self.resolve_active_backend(),
            "configured_backend": self.settings.worker_queue.backend.value,
            "max_workers": self.settings.worker_queue.max_workers,
            "submitted_this_process": self._submitted_count,
            "job_counts": counts,
        }

    def shutdown(self, wait: bool = False) -> None:
        self._executor.shutdown(wait=wait)
