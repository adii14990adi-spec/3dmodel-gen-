#!/usr/bin/env python3
"""Command-line interface for Auto3D-Human (Dual-View Image-to-3D T-Pose Pipeline)."""

from __future__ import annotations

import argparse
import json
import logging
import shutil
import sys
from collections.abc import Sequence
from pathlib import Path
from typing import Literal

from src.config import (
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


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="auto3d-human",
        description=(
            "Auto3D-Human: Automated Dual-View T-Pose Character Image-to-3D Pipeline. "
            "Converts aligned Front/Back character sheets into watertight, PBR-textured, "
            "humanoid-rigged .glb / .obj meshes."
        ),
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "-i",
        "--input",
        type=Path,
        default=None,
        help="Path to dual-view character reference image (Front | Back T-pose).",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=Path("outputs/cli"),
        help="Output mesh path (.glb / .obj) or output directory.",
    )
    parser.add_argument(
        "--list-engines",
        action="store_true",
        help="List all registered 3D reconstruction engines and exit.",
    )
    parser.add_argument(
        "--preprocess-only",
        action="store_true",
        help="Run dual-view splitting, segmentation, and alignment without 3D mesh synthesis.",
    )

    # Preprocessor & Side Synthesis options
    pre_group = parser.add_argument_group("Preprocessing & Side-View Synthesis")
    pre_group.add_argument(
        "--split-mode",
        type=str,
        choices=[m.value for m in SplitMode],
        default=SplitMode.AUTO.value,
        help="View splitting orientation.",
    )
    pre_group.add_argument(
        "--seg-backend",
        type=str,
        choices=[b.value for b in SegmentationBackend],
        default=SegmentationBackend.AUTO.value,
        help="Human foreground segmentation backend (rembg uses u2net_human_seg).",
    )
    pre_group.add_argument(
        "--image-size",
        type=int,
        default=512,
        help="Normalized square view resolution in pixels.",
    )
    pre_group.add_argument(
        "--swap-views",
        action="store_true",
        help="Swap Front and Back views when Back appears on the left / top.",
    )
    pre_group.add_argument(
        "--allow-downloads",
        action="store_true",
        help="Allow rembg to download u2net_human_seg ONNX weights if not cached.",
    )
    pre_group.add_argument(
        "--side-backend",
        type=str,
        choices=[b.value for b in SideSynthesisBackend],
        default=SideSynthesisBackend.AUTO.value,
        help="±90° lateral profile synthesis backend ('auto', 'anatomical', 'zero123plus', 'sv3d', 'none').",
    )
    pre_group.add_argument(
        "--no-side-synth",
        action="store_true",
        help="Disable ±90° lateral profile synthesis.",
    )

    # Reconstructor options
    rec_group = parser.add_argument_group("3D Reconstruction")
    rec_group.add_argument(
        "-e",
        "--engine",
        type=str,
        choices=[e.value for e in ReconstructionEngineType],
        default=ReconstructionEngineType.AUTO.value,
        help="Primary engine or clothed-body modular connector.",
    )
    rec_group.add_argument(
        "--device",
        type=str,
        default="auto",
        help="Compute device ('auto', 'cuda', 'cpu').",
    )
    rec_group.add_argument(
        "--mc-resolution",
        type=int,
        default=160,
        help="Marching Cubes grid resolution along longest axis.",
    )
    rec_group.add_argument(
        "--depth-scale",
        type=float,
        default=0.55,
        help="Anatomical torso depth-to-width ratio cap.",
    )
    rec_group.add_argument(
        "--relief-strength",
        type=float,
        default=0.08,
        help="Surface luminance/normal detail sculpting amplitude.",
    )
    rec_group.add_argument(
        "--strict-engine",
        action="store_true",
        help="Fail instead of falling back to volumetric_sdf if neural weights are missing.",
    )
    rec_group.add_argument(
        "--ue5-subsurf",
        type=int,
        choices=[1, 2, 3],
        default=2,
        help="Catmull-Clark Subdivision level for `ue5_highpoly_bpy` engine (default: 2).",
    )
    rec_group.add_argument(
        "--ue5-samples",
        type=int,
        default=24,
        help="Cycles raytraced studio turnaround samples for `ue5_highpoly_bpy` (0 skips Cycles).",
    )
    rec_group.add_argument(
        "--ue5-adapt-reference",
        action="store_true",
        help="Adapt UE5 PBR material colors & proportions from the uploaded turnaround sheet.",
    )

    # Postprocessor & Auto-Rigging options
    post_group = parser.add_argument_group("Mesh Post-Processing, Export & Auto-Rigging")
    post_group.add_argument(
        "--target-faces",
        type=int,
        default=20000,
        help="Quadric mesh decimation target triangle count (0 to disable).",
    )
    post_group.add_argument(
        "--smoothing",
        type=int,
        default=12,
        help="Taubin volume-preserving smoothing iterations.",
    )
    post_group.add_argument(
        "--texture-mode",
        type=str,
        choices=[t.value for t in TextureMode],
        default=TextureMode.UV_ATLAS.value,
        help="Texture baking mode ('uv_atlas' PBR PNG or 'vertex_color').",
    )
    post_group.add_argument(
        "--texture-resolution",
        type=int,
        default=1024,
        help="Resolution of baked UV texture atlas.",
    )
    post_group.add_argument(
        "--height",
        type=float,
        default=1.80,
        help="Target normalized character height in meters (feet grounded at Y=0).",
    )
    post_group.add_argument(
        "--formats",
        nargs="+",
        choices=["glb", "obj"],
        default=["glb", "obj"],
        help="Mesh formats to export.",
    )
    post_group.add_argument(
        "--rigging-backend",
        type=str,
        choices=[r.value for r in RiggingBackend],
        default=RiggingBackend.AUTO.value,
        help=(
            "Humanoid skeleton & LBS skinning backend "
            "('auto', 'builtin_humanoid', 'smplx', 'blender', 'none')."
        ),
    )
    post_group.add_argument(
        "--no-rig",
        action="store_true",
        help="Disable humanoid armature & skinning weight injection into .glb.",
    )

    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit structured JSON summary to stdout.",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Enable debug logging.",
    )
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.WARNING,
        format="%(levelname)s [%(name)s] %(message)s",
    )
    settings = get_settings()

    if args.list_engines:
        rec = MultiViewReconstructor(settings.reconstructor)
        engines = rec.list_engines()
        if args.json:
            print(
                json.dumps(
                    [
                        {
                            "name": e.name,
                            "category": e.category,
                            "available": e.available,
                            "requires_gpu": e.requires_gpu,
                            "reason": e.reason,
                            "description": e.description,
                        }
                        for e in engines
                    ],
                    indent=2,
                )
            )
        else:
            print("Registered Auto3D-Human Reconstruction Engines:")
            print("-" * 78)
            for e in engines:
                status = "READY" if e.available else "UNAVAILABLE"
                gpu_tag = "GPU" if e.requires_gpu else "CPU/GPU"
                print(f"  {e.name:<16} [{status:<11}] ({e.category}, {gpu_tag}) - {e.reason}")
        return 0

    if args.input is None:
        parser.error("the following arguments are required: -i/--input (unless --list-engines is set)")
    if not args.input.is_file():
        print(f"Error: Input file not found: {args.input}", file=sys.stderr)
        return 2

    out_arg: Path = args.output
    explicit_file: Path | None = None
    export_formats: list[Literal["glb", "obj"]] = list(args.formats)
    selected_engine = ReconstructionEngineType(args.engine)
    if out_arg.suffix.lower() in (".glb", ".obj", ".fbx"):
        explicit_file = out_arg
        out_dir = out_arg.parent if str(out_arg.parent) != "" else Path(".")
        stem = out_arg.stem
        if out_arg.suffix.lower() == ".fbx" and selected_engine == ReconstructionEngineType.AUTO:
            selected_engine = ReconstructionEngineType.UE5_HIGHPOLY_BPY
        elif out_arg.suffix.lower() in (".glb", ".obj"):
            req_fmt: Literal["glb", "obj"] = "glb" if out_arg.suffix.lower() == ".glb" else "obj"
            if req_fmt not in export_formats:
                export_formats.insert(0, req_fmt)
    else:
        out_dir = out_arg
        stem = args.input.stem or "character"

    pre_cfg = PreprocessorConfig(
        image_size=args.image_size,
        split_mode=SplitMode(args.split_mode),
        segmentation_backend=SegmentationBackend(args.seg_backend),
        swap_views=args.swap_views,
        allow_downloads=args.allow_downloads or settings.allow_downloads,
    )

    if args.preprocess_only:
        out_dir.mkdir(parents=True, exist_ok=True)
        pair = DualViewPreprocessor(pre_cfg).process(args.input)
        f_out = out_dir / f"{stem}_front_rgba.png"
        b_out = out_dir / f"{stem}_back_rgba.png"
        p_out = out_dir / f"{stem}_preprocessed_preview.png"
        pair.front_rgba.save(f_out)
        pair.back_rgba.save(b_out)
        pair.preview_image.save(p_out)
        payload = {
            "stage": "preprocess_only",
            "metadata": pair.metadata,
            "files": {"front_rgba": str(f_out), "back_rgba": str(b_out), "preview": str(p_out)},
        }
        if args.json:
            print(json.dumps(payload, indent=2))
        else:
            print(f"Preprocessed Front/Back views saved to: {out_dir}")
            print(f"  Silhouette Alignment IoU : {pair.metadata['silhouette_iou']:.4f}")
            print(f"  Segmentation Backend     : {pair.metadata['segmentation_backend_used']}")
            print(f"  Alignment Preview        : {p_out}")
        return 0

    side_backend = SideSynthesisBackend(args.side_backend)
    side_cfg = SideSynthesizerConfig(
        enabled=(not args.no_side_synth) and (side_backend != SideSynthesisBackend.NONE),
        backend=side_backend,
    )

    rec_cfg = settings.reconstructor.model_copy(
        update={
            "engine": selected_engine,
            "device": args.device,
            "mc_resolution": args.mc_resolution,
            "depth_scale": args.depth_scale,
            "relief_strength": args.relief_strength,
            "allow_fallback": not args.strict_engine,
            "ue5_subsurf_level": args.ue5_subsurf,
            "ue5_cycles_samples": args.ue5_samples,
            "ue5_adapt_reference": args.ue5_adapt_reference,
        }
    )
    post_cfg = PostProcessorConfig(
        target_faces=args.target_faces,
        smoothing_iterations=args.smoothing,
        texture_mode=TextureMode(args.texture_mode),
        texture_resolution=args.texture_resolution,
        target_height=args.height,
        export_formats=export_formats,
    )
    rig_backend = RiggingBackend(args.rigging_backend)
    rig_cfg = RiggingConfig(
        enabled=(not args.no_rig) and (rig_backend != RiggingBackend.NONE),
        backend=rig_backend,
    )

    pipeline = Auto3DHumanPipeline(
        PipelineConfig(
            preprocessor=pre_cfg,
            side_synthesizer=side_cfg,
            reconstructor=rec_cfg,
            postprocessor=post_cfg,
            rigging=rig_cfg,
        )
    )
    result = pipeline.run(source=args.input, output_dir=out_dir, stem=stem, save_intermediate=True)

    if explicit_file is not None:
        ext_key = explicit_file.suffix.lower().lstrip(".")
        generated = result.postprocessed.exported_files.get(ext_key)
        if generated and generated.resolve() != explicit_file.resolve():
            shutil.copy2(generated, explicit_file)

    summary = result.summary_dict()
    if args.json:
        print(json.dumps(summary, indent=2))
    else:
        m = result.postprocessed.metrics
        rig_s = summary["rigging"]
        side_s = summary["side_synthesis"]
        rig_txt = (
            f"{rig_s['joint_count']} joints ({rig_s['backend_used']})" if rig_s.get("enabled") else "Disabled"
        )
        side_txt = side_s.get("backend_used", "Disabled") if side_s.get("enabled") else "Disabled"
        print("=" * 68)
        print("Auto3D-Human Reconstruction Complete")
        print("=" * 68)
        print(f"  Engine Used        : {result.raw_reconstruction.engine_used}")
        print(f"  Segmentation       : {result.preprocessed.metadata['segmentation_backend_used']}")
        print(f"  Front/Back IoU     : {result.preprocessed.metadata['silhouette_iou']:.4f}")
        print(f"  ±90° Side Synth    : {side_txt}")
        print(f"  Watertight Mesh    : {m['is_watertight']} (Euler={m['euler_number']})")
        print(f"  Geometry           : {m['geometry_vertices']:,} vertices / {m['faces']:,} triangles")
        print(f"  Humanoid Armature  : {rig_txt}")
        print(f"  Dimensions (X,Y,Z) : {m['dimensions_xyz_m']} m (feet grounded at Y=0)")
        print(f"  Total Elapsed      : {result.elapsed_seconds:.2f} s")
        print("-" * 68)
        for k, path in result.postprocessed.exported_files.items():
            print(f"  [{k:<20}] {path}")
        print("=" * 68)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
