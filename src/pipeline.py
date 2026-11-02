"""End-to-end Auto3D-Human orchestration pipeline."""

from __future__ import annotations

import json
import time
from collections.abc import Callable
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from PIL import Image

from src.config import PipelineConfig
from src.postprocessor import MeshPostProcessor, PostProcessedResult
from src.preprocessor import DualViewPreprocessor, PreprocessedPair
from src.reconstructor import MultiViewReconstructor, RawReconstructionResult
from src.rigger import AutoRigger, RiggingResult
from src.side_synthesizer import SideViewSynthesizer, SynthesizedSideViews


@dataclass
class PipelineResult:
    """Aggregated artifacts, timings, and quality metrics from an end-to-end run."""

    preprocessed: PreprocessedPair
    side_views: SynthesizedSideViews | None
    raw_reconstruction: RawReconstructionResult
    postprocessed: PostProcessedResult
    rigging: RiggingResult | None
    elapsed_seconds: float
    timings: dict[str, float] = field(default_factory=dict)
    output_dir: Path | None = None

    def summary_dict(self) -> dict[str, Any]:
        """Return a JSON-serializable summary of metrics, timings, rigging, and exported paths."""
        rig_meta: dict[str, Any] = {"enabled": False}
        if self.rigging is not None:
            rig_meta = {
                "enabled": True,
                "backend_used": self.rigging.skeleton.backend_used,
                "joint_count": len(self.rigging.skeleton.joint_names),
                "armature_name": "Auto3DHumanoidArmature",
                **self.rigging.skeleton.metadata,
            }

        side_meta: dict[str, Any] = {"enabled": False}
        if self.side_views is not None:
            side_meta = {
                "enabled": True,
                "backend_used": self.side_views.backend_used,
                **self.side_views.metadata,
            }

        return {
            "elapsed_seconds": round(self.elapsed_seconds, 3),
            "timings_seconds": {k: round(v, 3) for k, v in self.timings.items()},
            "engine_used": self.raw_reconstruction.engine_used,
            "preprocessing": self.preprocessed.metadata,
            "side_synthesis": side_meta,
            "reconstruction": self.raw_reconstruction.diagnostics,
            "mesh_metrics": self.postprocessed.metrics,
            "rigging": rig_meta,
            "exported_files": {k: str(v) for k, v in self.postprocessed.exported_files.items()},
        }


class Auto3DHumanPipeline:
    """High-level automated pipeline: Preprocess -> Side Synth -> Reconstruct -> PostProcess -> AutoRig."""

    def __init__(self, config: PipelineConfig | None = None) -> None:
        self.config = config or PipelineConfig()
        self.preprocessor = DualViewPreprocessor(self.config.preprocessor)
        self.side_synthesizer = SideViewSynthesizer(self.config.side_synthesizer)
        self.reconstructor = MultiViewReconstructor(self.config.reconstructor)
        self.postprocessor = MeshPostProcessor(self.config.postprocessor)
        self.rigger = AutoRigger(self.config.rigging)

    def run(
        self,
        source: str | Path | bytes | Image.Image,
        output_dir: str | Path | None = None,
        stem: str = "character",
        save_intermediate: bool = True,
        progress_callback: Callable[[str, int], None] | None = None,
    ) -> PipelineResult:
        """Execute full image-to-3D character pipeline and save requested artifacts."""
        t_start = time.perf_counter()

        def _notify(stage: str, pct: int) -> None:
            if progress_callback is not None:
                progress_callback(stage, pct)

        _notify("preprocessing", 10)
        t0 = time.perf_counter()
        preprocessed = self.preprocessor.process(source)
        t_pre = time.perf_counter() - t0

        _notify("side_synthesis", 28)
        t_s0 = time.perf_counter()
        side_views = self.side_synthesizer.synthesize(preprocessed)
        t_side = time.perf_counter() - t_s0

        _notify("reconstructing", 48)
        t1 = time.perf_counter()
        raw = self.reconstructor.reconstruct(preprocessed, side_views=side_views)
        t_rec = time.perf_counter() - t1

        out_path = Path(output_dir) if output_dir is not None else None
        _notify("postprocessing", 75)
        t2 = time.perf_counter()
        post = self.postprocessor.process(raw, output_dir=out_path, stem=stem)
        t_post = time.perf_counter() - t2

        _notify("rigging", 90)
        t3 = time.perf_counter()
        glb_exported = post.exported_files.get("glb")
        rigging_res = self.rigger.rig_and_inject(
            watertight_mesh=post.watertight_geometry,
            glb_path=glb_exported,
            output_dir=out_path,
        )
        t_rig = time.perf_counter() - t3

        total_elapsed = time.perf_counter() - t_start
        timings = {
            "preprocess": t_pre,
            "side_synthesis": t_side,
            "reconstruct": t_rec,
            "postprocess": t_post,
            "rigging": t_rig,
        }

        if out_path is not None and save_intermediate:
            out_path.mkdir(parents=True, exist_ok=True)
            f_path = out_path / "front_rgba.png"
            b_path = out_path / "back_rgba.png"
            prev_path = out_path / "preprocessed_preview.png"
            preprocessed.front_rgba.save(f_path, format="PNG")
            preprocessed.back_rgba.save(b_path, format="PNG")
            preprocessed.preview_image.save(prev_path, format="PNG")
            post.exported_files["front_rgba"] = f_path
            post.exported_files["back_rgba"] = b_path
            post.exported_files["preprocessed_preview"] = prev_path

            if side_views is not None:
                l_path = out_path / "left_rgba.png"
                r_path = out_path / "right_rgba.png"
                q_path = out_path / "side_quad_preview.png"
                side_views.left_rgba.save(l_path, format="PNG")
                side_views.right_rgba.save(r_path, format="PNG")
                side_views.preview_quad_image.save(q_path, format="PNG")
                post.exported_files["left_rgba"] = l_path
                post.exported_files["right_rgba"] = r_path
                post.exported_files["side_quad_preview"] = q_path

            if rigging_res is not None:
                if (out_path / "rig_preview.png").is_file():
                    post.exported_files["rig_preview"] = out_path / "rig_preview.png"
                if rigging_res.skeleton_json_path is not None:
                    post.exported_files["skeleton_rig"] = rigging_res.skeleton_json_path

        res = PipelineResult(
            preprocessed=preprocessed,
            side_views=side_views,
            raw_reconstruction=raw,
            postprocessed=post,
            rigging=rigging_res,
            elapsed_seconds=total_elapsed,
            timings=timings,
            output_dir=out_path,
        )

        if out_path is not None and save_intermediate:
            meta_path = out_path / "metadata.json"
            meta_path.write_text(json.dumps(res.summary_dict(), indent=2), encoding="utf-8")
            post.exported_files["metadata"] = meta_path

        _notify("completed", 100)
        return res
