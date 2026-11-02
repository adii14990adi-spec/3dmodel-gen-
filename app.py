"""Gradio Web UI + mounted FastAPI service for Auto3D-Human."""

from __future__ import annotations

import json
import logging
import os
import uuid
from typing import Any

import gradio as gr
from PIL import Image

from src.config import (
    PROJECT_ROOT,
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
from src.preprocessor import DualViewPreprocessor
from src.reconstructor import MultiViewReconstructor
from src.server import create_app

logger = logging.getLogger(__name__)

CUSTOM_CSS = """
.hero-banner {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2942 100%);
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 18px 24px;
    margin-bottom: 12px;
    color: #f8fafc;
}
.hero-banner h1 {
    margin: 0 0 6px 0;
    font-size: 1.55rem;
    font-weight: 700;
    color: #f8fafc !important;
}
.hero-banner p {
    margin: 0;
    color: #cbd5e1 !important;
    font-size: 0.95rem;
}
.hero-links {
    margin-top: 10px;
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    font-size: 0.85rem;
}
.hero-links a {
    color: #38bdf8 !important;
    text-decoration: none;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 4px 10px;
    border-radius: 6px;
}
.hero-links a:hover {
    background: rgba(56, 189, 248, 0.22);
}
"""


def _format_metrics_markdown(summary: dict[str, Any]) -> str:
    m = summary["mesh_metrics"]
    pre = summary["preprocessing"]
    rig = summary.get("rigging", {})
    side = summary.get("side_synthesis", {})
    dims = m["dimensions_xyz_m"]
    wt_badge = "YES (Closed 2-Manifold)" if m["is_watertight"] else "Repaired"
    dim_str = f"{dims[0]:.2f}m × {dims[1]:.2f}m × {dims[2]:.2f}m"
    rig_badge = (
        f"YES ({rig.get('joint_count', 25)}-Joint `{rig.get('backend_used')}`)"
        if rig.get("enabled")
        else "Disabled"
    )
    side_badge = f"YES (`{side.get('backend_used')}`)" if side.get("enabled") else "Disabled"
    return (
        f"### Reconstruction & Rigging Quality Summary\n"
        f"| Metric | Value |\n"
        f"| :--- | :--- |\n"
        f"| **Active 3D Engine** | `{summary['engine_used']}` |\n"
        f"| **±90° Side-Profile Synthesis** | {side_badge} |\n"
        f"| **Segmentation** | `{pre.get('segmentation_backend_used', 'auto')}` |\n"
        f"| **Front/Back Silhouette IoU** | `{pre.get('silhouette_iou', 0.0):.4f}` |\n"
        f"| **Watertight Manifold** | **{wt_badge}** (Euler `{m['euler_number']}`) |\n"
        f"| **Humanoid Armature (.glb)** | **{rig_badge}** |\n"
        f"| **Mesh Complexity** | `{m['geometry_vertices']:,}` vertices / `{m['faces']:,}` triangles |\n"
        f"| **Character Dimensions (W × H × D)** | `{dim_str}` (Grounded at `Y=0`) |\n"
        f"| **Volume / Surface Area** | `{m['volume_m3']:.4f} m³` / `{m['surface_area_m2']:.3f} m²` |\n"
        f"| **Total Pipeline Latency** | `{summary['elapsed_seconds']:.2f} s` |"
    )


def _format_engines_markdown(settings: AppSettings) -> str:
    rec = MultiViewReconstructor(settings.reconstructor)
    rows = [
        "| Engine | Category | Compute | Status | Notes |",
        "| :--- | :--- | :--- | :--- | :--- |",
    ]
    for info in rec.list_engines():
        badge = "Ready" if info.available else "Weights Optional"
        comp = "CUDA GPU" if info.requires_gpu else "CPU / GPU"
        rows.append(f"| `{info.name}` | `{info.category}` | {comp} | **{badge}** | {info.reason} |")
    return "\n".join(rows)


def _ensure_initial_demo_artifacts(settings: AppSettings) -> dict[str, Any]:
    """Pre-compute sample character artifacts in `.cache/auto3d_demo` for instant initial 3D preview."""
    demo_dir = PROJECT_ROOT / ".cache" / "auto3d_demo"
    glb_path = demo_dir / "character.glb"
    meta_path = demo_dir / "metadata.json"
    rig_prev_path = demo_dir / "rig_preview.png"
    side_prev_path = demo_dir / "side_quad_preview.png"

    if not settings.sample_image_path.is_file():
        return {}

    if not (
        glb_path.is_file() and meta_path.is_file() and rig_prev_path.is_file() and side_prev_path.is_file()
    ):
        try:
            demo_dir.mkdir(parents=True, exist_ok=True)
            cfg = settings.to_pipeline_config()
            result = Auto3DHumanPipeline(cfg).run(
                source=settings.sample_image_path,
                output_dir=demo_dir,
                stem="character",
                save_intermediate=True,
            )
            summary = result.summary_dict()
        except Exception as exc:
            logger.warning("Skipping initial demo pre-computation: %s", exc)
            return {}
    else:
        summary = json.loads(meta_path.read_text(encoding="utf-8"))

    def _p(name: str) -> str | None:
        f = demo_dir / name
        return str(f) if f.is_file() else None

    return {
        "glb": _p("character.glb"),
        "obj_zip": _p("character_obj_bundle.zip"),
        "preview": _p("preprocessed_preview.png"),
        "turnaround": _p("mesh_turnaround.png"),
        "rig_preview": _p("rig_preview.png"),
        "side_quad": _p("side_quad_preview.png"),
        "atlas": _p("texture_atlas.png"),
        "markdown": _format_metrics_markdown(summary),
        "json": summary,
    }


def build_gradio_blocks(
    settings: AppSettings | None = None,
    warm_start: bool = True,
) -> gr.Blocks:
    """Construct the interactive Gradio Blocks Studio UI."""
    cfg = settings or get_settings()
    ui_jobs_root = PROJECT_ROOT / ".cache" / "ui_jobs"
    ui_jobs_root.mkdir(parents=True, exist_ok=True)

    initial = _ensure_initial_demo_artifacts(cfg) if warm_start else {}
    sample_str = str(cfg.sample_image_path) if cfg.sample_image_path.is_file() else None

    def run_full_pipeline(
        image: Image.Image | None,
        engine_name: str,
        seg_backend: str,
        split_mode: str,
        swap_views: bool,
        side_backend: str,
        rigging_backend: str,
        mc_resolution: int,
        target_faces: int,
        smoothing_iters: int,
        depth_scale: float,
        relief_strength: float,
        texture_mode: str,
    ) -> tuple[
        str | None,
        Image.Image | None,
        Image.Image | None,
        Image.Image | None,
        Image.Image | None,
        Image.Image | None,
        str,
        dict[str, Any],
        str | None,
        str | None,
    ]:
        if image is None:
            raise gr.Error("Please upload or select a dual-view T-pose character reference image.")

        run_dir = ui_jobs_root / uuid.uuid4().hex[:10]
        run_dir.mkdir(parents=True, exist_ok=True)

        sb = SideSynthesisBackend(side_backend)
        rb = RiggingBackend(rigging_backend)
        pipe_cfg = PipelineConfig(
            preprocessor=PreprocessorConfig(
                image_size=512,
                split_mode=SplitMode(split_mode),
                segmentation_backend=SegmentationBackend(seg_backend),
                swap_views=bool(swap_views),
                allow_downloads=cfg.allow_downloads,
            ),
            side_synthesizer=SideSynthesizerConfig(
                enabled=sb != SideSynthesisBackend.NONE,
                backend=sb,
            ),
            reconstructor=cfg.reconstructor.model_copy(
                update={
                    "engine": ReconstructionEngineType(engine_name),
                    "mc_resolution": int(mc_resolution),
                    "depth_scale": float(depth_scale),
                    "relief_strength": float(relief_strength),
                    "allow_fallback": True,
                }
            ),
            postprocessor=PostProcessorConfig(
                target_faces=int(target_faces),
                smoothing_iterations=int(smoothing_iters),
                texture_mode=TextureMode(texture_mode),
                texture_resolution=1024,
                export_formats=["glb", "obj"],
            ),
            rigging=RiggingConfig(
                enabled=rb != RiggingBackend.NONE,
                backend=rb,
            ),
        )

        try:
            res = Auto3DHumanPipeline(pipe_cfg).run(
                source=image,
                output_dir=run_dir,
                stem="character",
                save_intermediate=True,
            )
        except Exception as exc:
            raise gr.Error(f"3D Reconstruction failed: {exc}") from exc

        summary = res.summary_dict()
        glb_file = res.postprocessed.exported_files.get("glb")
        zip_file = res.postprocessed.exported_files.get("obj_bundle")
        rig_img = res.rigging.preview_image if res.rigging is not None else None
        side_img = res.side_views.preview_quad_image if res.side_views is not None else None

        return (
            str(glb_file) if glb_file else None,
            res.postprocessed.turnaround_preview,
            rig_img,
            side_img,
            res.preprocessed.preview_image,
            res.postprocessed.texture_atlas,
            _format_metrics_markdown(summary),
            summary,
            str(glb_file) if glb_file else None,
            str(zip_file) if zip_file else None,
        )

    def run_preprocess_preview(
        image: Image.Image | None,
        seg_backend: str,
        split_mode: str,
        swap_views: bool,
    ) -> tuple[Image.Image, dict[str, Any]]:
        if image is None:
            raise gr.Error("Please upload or select a dual-view T-pose character reference image.")
        pre_cfg = PreprocessorConfig(
            image_size=512,
            split_mode=SplitMode(split_mode),
            segmentation_backend=SegmentationBackend(seg_backend),
            swap_views=bool(swap_views),
            allow_downloads=cfg.allow_downloads,
        )
        pair = DualViewPreprocessor(pre_cfg).process(image)
        return pair.preview_image, pair.metadata

    with gr.Blocks(
        analytics_enabled=False,
        title="Auto3D-Human | Dual-View T-Pose Image-to-3D Pipeline",
        fill_width=True,
    ) as demo:
        gr.HTML(
            """
            <div class="hero-banner">
              <h1>Auto3D-Human — Rig-Ready Dual-View T-Pose Character Pipeline</h1>
              <p>
                Automated splitting, foreground human segmentation, ±90° side-profile synthesis,
                multi-view volumetric 3D reconstruction, watertight PBR
                <code>.glb</code> / <code>.obj</code> export, and 25-joint humanoid armature + LBS skinning.
              </p>
              <div class="hero-links">
                <a href="/docs" target="_blank">FastAPI Swagger Docs (/docs)</a>
                <a href="/api/v1/queue/stats" target="_blank">Worker Queue Stats (/api/v1/queue/stats)</a>
                <a href="/api/v1/engines" target="_blank">Registered Engines (/api/v1/engines)</a>
                <a href="/health" target="_blank">Health Status (/health)</a>
              </div>
            </div>
            """
        )

        with gr.Row(equal_height=False):
            with gr.Column(scale=5):
                input_img = gr.Image(
                    value=sample_str,
                    type="pil",
                    label="Dual-View Reference Sheet (Aligned Front | Back T-Pose)",
                    height=290,
                )

                with gr.Row():
                    run_btn = gr.Button("Reconstruct & Rig 3D Character", variant="primary", scale=2)
                    preview_btn = gr.Button("Preview Alignment Only", variant="secondary", scale=1)

                with gr.Accordion("Pipeline, Lateral Synthesis & Rigging Parameters", open=True):
                    with gr.Row():
                        engine_dd = gr.Dropdown(
                            choices=[e.value for e in ReconstructionEngineType],
                            value=ReconstructionEngineType.AUTO.value,
                            label="3D Reconstruction Engine",
                        )
                        seg_dd = gr.Dropdown(
                            choices=[b.value for b in SegmentationBackend],
                            value=SegmentationBackend.AUTO.value,
                            label="Segmentation Backend",
                        )
                    with gr.Row():
                        side_dd = gr.Dropdown(
                            choices=[s.value for s in SideSynthesisBackend],
                            value=SideSynthesisBackend.AUTO.value,
                            label="±90° Side-View Synthesis",
                        )
                        rig_dd = gr.Dropdown(
                            choices=[r.value for r in RiggingBackend],
                            value=RiggingBackend.AUTO.value,
                            label="Humanoid Auto-Rigging (.glb)",
                        )
                    with gr.Row():
                        split_dd = gr.Dropdown(
                            choices=[m.value for m in SplitMode],
                            value=SplitMode.AUTO.value,
                            label="Dual-View Split Axis",
                        )
                        tex_dd = gr.Dropdown(
                            choices=[t.value for t in TextureMode],
                            value=TextureMode.UV_ATLAS.value,
                            label="Texture Baking Mode",
                        )
                    swap_chk = gr.Checkbox(
                        value=False,
                        label="Swap Front & Back Views (enable if Back is on left)",
                    )
                    mc_slider = gr.Slider(
                        minimum=64,
                        maximum=256,
                        step=16,
                        value=160,
                        label="Marching Cubes Voxel Resolution",
                    )
                    faces_slider = gr.Slider(
                        minimum=2000,
                        maximum=60000,
                        step=1000,
                        value=20000,
                        label="Target Decimated Triangle Count",
                    )
                    with gr.Row():
                        smooth_slider = gr.Slider(
                            minimum=0,
                            maximum=30,
                            step=2,
                            value=12,
                            label="Taubin Smoothing Iterations",
                        )
                        depth_slider = gr.Slider(
                            minimum=0.30,
                            maximum=0.85,
                            step=0.05,
                            value=0.55,
                            label="Anatomical Depth Scale",
                        )
                    relief_slider = gr.Slider(
                        minimum=0.00,
                        maximum=0.20,
                        step=0.02,
                        value=0.08,
                        label="Garment & Facial Surface Relief",
                    )

                if sample_str:
                    gr.Examples(
                        examples=[[sample_str]],
                        inputs=[input_img],
                        label="Sample T-Pose Reference Asset",
                    )

            with gr.Column(scale=7):
                with gr.Tabs():
                    with gr.TabItem("Interactive 3D Mesh (.glb)"):
                        model_3d = gr.Model3D(
                            value=initial.get("glb"),
                            label="Watertight Rigged 3D Character (Orbit / Zoom / Pan)",
                            clear_color=(0.10, 0.12, 0.16, 1.0),
                            height=450,
                        )
                        turnaround_out = gr.Image(
                            value=initial.get("turnaround"),
                            type="pil",
                            label="Multi-Angle Shaded 3D Mesh Turnaround (0° / 45° / 90° / 180°)",
                            height=220,
                        )

                    with gr.TabItem("Humanoid Rig & ±90° Side Profiles"):
                        rig_out = gr.Image(
                            value=initial.get("rig_preview"),
                            type="pil",
                            label="Injected 25-Joint Standard Humanoid Armature (0° Front & 90° Sagittal)",
                            height=330,
                        )
                        side_out = gr.Image(
                            value=initial.get("side_quad"),
                            type="pil",
                            label=(
                                "Orthogonal Quad-View Synthesis "
                                "(0° Front | +90° Left | 180° Back | -90° Right)"
                            ),
                            height=240,
                        )

                    with gr.TabItem("Alignment & Segmentation"):
                        align_out = gr.Image(
                            value=initial.get("preview"),
                            type="pil",
                            label="Canonical Spine & Height Alignment Diagnostics",
                            height=420,
                        )

                    with gr.TabItem("Texture Atlas & Metrics"):
                        atlas_out = gr.Image(
                            value=initial.get("atlas"),
                            type="pil",
                            label="Baked 2-Tile Front|Back PBR UV Texture Atlas",
                            height=300,
                        )
                        json_out = gr.JSON(
                            value=initial.get("json", {}),
                            label="Pipeline Telemetry, Skeleton Metadata & Mesh Topology JSON",
                        )

                    with gr.TabItem("Engine Registry"):
                        gr.Markdown(_format_engines_markdown(cfg))

                metrics_md = gr.Markdown(
                    value=initial.get(
                        "markdown",
                        "Upload a dual-view T-pose image and click **Reconstruct & Rig 3D Character**.",
                    )
                )

                with gr.Row():
                    glb_dl = gr.File(
                        value=initial.get("glb"),
                        label="Download Skinned .GLB (glTF 2.0 PBR + 25-Bone Rig)",
                    )
                    obj_dl = gr.File(
                        value=initial.get("obj_zip"),
                        label="Download .OBJ + .MTL + Texture (.ZIP)",
                    )

        run_btn.click(
            fn=run_full_pipeline,
            inputs=[
                input_img,
                engine_dd,
                seg_dd,
                split_dd,
                swap_chk,
                side_dd,
                rig_dd,
                mc_slider,
                faces_slider,
                smooth_slider,
                depth_slider,
                relief_slider,
                tex_dd,
            ],
            outputs=[
                model_3d,
                turnaround_out,
                rig_out,
                side_out,
                align_out,
                atlas_out,
                metrics_md,
                json_out,
                glb_dl,
                obj_dl,
            ],
        )

        preview_btn.click(
            fn=run_preprocess_preview,
            inputs=[input_img, seg_dd, split_dd, swap_chk],
            outputs=[align_out, json_out],
        )

    return demo


def create_combined_service(
    settings: AppSettings | None = None,
    warm_start: bool = True,
) -> Any:
    """Mount the Gradio Web UI onto the FastAPI REST server so `/` serves UI and `/api/v1/*` serves REST."""
    cfg = settings or get_settings()
    fastapi_app = create_app(cfg)
    demo = build_gradio_blocks(cfg, warm_start=warm_start)

    allowed = [
        str(PROJECT_ROOT / "assets"),
        str(PROJECT_ROOT / ".cache"),
        str(cfg.output_dir),
        "/tmp",
    ]
    combined = gr.mount_gradio_app(
        app=fastapi_app,
        blocks=demo,
        path="/",
        server_name="0.0.0.0",
        server_port=cfg.gradio_port,
        allowed_paths=allowed,
        ssr_mode=False,
        css=CUSTOM_CSS,
    )
    return combined


if __name__ == "__main__":
    import uvicorn

    settings = get_settings()
    port = int(os.environ.get("PORT", settings.gradio_port))
    service = create_combined_service(settings, warm_start=True)
    uvicorn.run(service, host="0.0.0.0", port=port, reload=False)
