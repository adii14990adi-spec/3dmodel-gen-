"""Unreal Engine 5 High-Poly Realistic Character `bpy` integration engine for Auto3D-Human."""

from __future__ import annotations

import importlib.util
import json
import logging
import shutil
import subprocess
import sys
import tempfile
import zipfile
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import trimesh
from PIL import Image

from src.config import PROJECT_ROOT
from src.postprocessor import MeshPostProcessor, PostProcessedResult
from src.preprocessor import PreprocessedPair
from src.reconstructor import RawReconstructionResult, voronoi_dilate_rgb
from src.rigger import AutoRigger, RiggedSkeleton, RiggingResult

logger = logging.getLogger(__name__)


# Parent index lookup for the 23 UE5 Mannequin / MetaHuman bones
UE5_BONE_REGIONS: dict[str, tuple[str | None, str]] = {
    "root": (None, "pelvis"),
    "pelvis": ("root", "pelvis"),
    "spine_01": ("pelvis", "spine"),
    "spine_02": ("spine_01", "spine"),
    "spine_03": ("spine_02", "chest"),
    "neck_01": ("spine_03", "neck"),
    "head": ("neck_01", "head"),
    "clavicle_l": ("spine_03", "left_arm"),
    "upperarm_l": ("clavicle_l", "left_arm"),
    "lowerarm_l": ("upperarm_l", "left_arm"),
    "hand_l": ("lowerarm_l", "left_arm"),
    "thigh_l": ("pelvis", "left_leg"),
    "calf_l": ("thigh_l", "left_leg"),
    "foot_l": ("calf_l", "left_leg"),
    "ball_l": ("foot_l", "left_leg"),
    "clavicle_r": ("spine_03", "right_arm"),
    "upperarm_r": ("clavicle_r", "right_arm"),
    "lowerarm_r": ("upperarm_r", "right_arm"),
    "hand_r": ("lowerarm_r", "right_arm"),
    "thigh_r": ("pelvis", "right_leg"),
    "calf_r": ("thigh_r", "right_leg"),
    "foot_r": ("calf_r", "right_leg"),
    "ball_r": ("foot_r", "right_leg"),
}


@lru_cache(maxsize=1)
def has_bpy_runtime() -> bool:
    """Return True if Blender Python (`bpy`) is installed and functional in an isolated process."""
    if importlib.util.find_spec("bpy") is None:
        return False
    script_path = PROJECT_ROOT / "ue5_highpoly_character_bpy.py"
    if not script_path.is_file():
        return False
    try:
        proc = subprocess.run(
            [
                sys.executable,
                "-c",
                "import ue5_highpoly_character_bpy as u; "
                "raise SystemExit(0 if u.ensure_headless_bpy_runtime() else 1)",
            ],
            cwd=str(PROJECT_ROOT),
            capture_output=True,
            text=True,
            timeout=30,
            check=False,
        )
        return proc.returncode == 0
    except Exception:
        return False


def _srgb_to_linear(rgb_0_255: np.ndarray) -> tuple[float, float, float]:
    """Convert median sRGB [0..255] triplet to Blender linear RGB [0..1]."""
    c = np.clip(rgb_0_255.astype(np.float64) / 255.0, 0.0, 1.0)
    lin = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return (round(float(lin[0]), 4), round(float(lin[1]), 4), round(float(lin[2]), 4))


def extract_reference_palette_and_scales(
    preprocessed: PreprocessedPair,
) -> tuple[dict[str, tuple[float, float, float]], dict[str, float]]:
    """Sample garment/skin/hair PBR colors and torso proportions from a PreprocessedPair."""
    arr = np.asarray(preprocessed.front_rgba, dtype=np.uint8)
    rgb = arr[:, :, :3]
    mask = arr[:, :, 3] > 127
    ys, xs = np.where(mask)
    if len(ys) < 64:
        return {}, {}

    y_min, y_max = int(ys.min()), int(ys.max())
    span = max(1, y_max - y_min)

    def _band_color(frac_top: float, frac_bot: float, central_only: bool = True) -> np.ndarray | None:
        r0 = int(y_min + frac_top * span)
        r1 = max(r0 + 2, int(y_min + frac_bot * span))
        sub_m = mask[r0:r1, :].copy()
        if central_only:
            w = sub_m.shape[1]
            sub_m[:, : int(w * 0.36)] = False
            sub_m[:, int(w * 0.64) :] = False
        pts = rgb[r0:r1, :][sub_m]
        if len(pts) < 12:
            return None
        return np.median(pts, axis=0)

    palette: dict[str, tuple[float, float, float]] = {}
    hair_c = _band_color(0.01, 0.06, central_only=True)
    face_c = _band_color(0.07, 0.13, central_only=True)
    top_c = _band_color(0.24, 0.42, central_only=True)
    belt_c = _band_color(0.45, 0.49, central_only=True)
    leg_c = _band_color(0.56, 0.78, central_only=False)
    shoe_c = _band_color(0.90, 0.99, central_only=False)

    if face_c is not None:
        palette["skin"] = _srgb_to_linear(face_c)
    if top_c is not None:
        palette["top"] = _srgb_to_linear(top_c)
    if belt_c is not None:
        palette["belt"] = _srgb_to_linear(belt_c)
    if leg_c is not None:
        lin_leg = _srgb_to_linear(leg_c)
        palette["denim_dark"] = tuple(max(0.01, v * 0.72) for v in lin_leg)  # type: ignore[assignment]
        palette["denim_light"] = tuple(min(1.0, v * 1.18) for v in lin_leg)  # type: ignore[assignment]
    if shoe_c is not None:
        palette["shoes"] = _srgb_to_linear(shoe_c)
    if hair_c is not None:
        lum = float(np.mean(hair_c) / 255.0)
        melanin = float(np.clip(1.0 - lum * 1.15, 0.15, 0.96))
        palette["hair_melanin"] = (round(melanin, 3), 0.25, 0.0)

    def _half_width_ratio(frac: float) -> float:
        r = int(np.clip(y_min + frac * span, 0, arr.shape[0] - 1))
        cols = np.where(mask[r])[0]
        if len(cols) < 4:
            return 0.0
        return float(cols.max() - cols.min()) / float(span)

    waist_r = _half_width_ratio(0.42)
    hip_r = _half_width_ratio(0.50)
    scales: dict[str, float] = {
        "shoulder_scale": 1.0,
        "waist_scale": float(np.clip(waist_r / 0.155, 0.85, 1.22)) if waist_r > 0 else 1.0,
        "hip_scale": float(np.clip(hip_r / 0.195, 0.88, 1.20)) if hip_r > 0 else 1.0,
    }
    return palette, scales


@dataclass
class UE5GeneratedBundle:
    """Complete artifacts returned by `UE5HighPolyBpyEngine`."""

    raw_result: RawReconstructionResult
    post_result: PostProcessedResult
    rig_result: RiggingResult


class UE5HighPolyBpyEngine:
    """High-Poly Subdivision Character & UE5 Mannequin Rig Engine powered by Blender `bpy`."""

    def __init__(
        self,
        subsurf_level: int = 2,
        cycles_samples: int = 24,
        adapt_to_reference: bool = False,
        character_name: str = "SK_UE5_RealisticFemale",
    ) -> None:
        self.subsurf_level = max(1, min(3, subsurf_level))
        self.cycles_samples = max(0, min(256, cycles_samples))
        self.adapt_to_reference = adapt_to_reference
        self.character_name = character_name

    def generate(
        self,
        preprocessed: PreprocessedPair,
        output_dir: Path | None = None,
        stem: str = "character",
    ) -> UE5GeneratedBundle:
        """Build UE5 high-poly character in an isolated main-thread `bpy` subprocess."""
        if not has_bpy_runtime():
            raise RuntimeError("Blender Python (`bpy`) runtime is not available in this Python environment.")

        src_script = PROJECT_ROOT / "ue5_highpoly_character_bpy.py"
        with tempfile.TemporaryDirectory(prefix="auto3d_ue5_bpy_") as tmp_str:
            work_dir = Path(tmp_str)
            target_dir = Path(output_dir) if output_dir is not None else work_dir
            target_dir.mkdir(parents=True, exist_ok=True)

            # Compose split Front | Back turnaround sheet for Blender orthographic reference planes
            w, h = preprocessed.front_rgba.size
            ref_sheet = Image.new("RGBA", (w * 2, h), (242, 244, 248, 255))
            ref_sheet.alpha_composite(preprocessed.front_rgba, (0, 0))
            ref_sheet.alpha_composite(preprocessed.back_rgba, (w, 0))
            ref_sheet_path = target_dir / "ue5_reference_sheet.png"
            ref_sheet.convert("RGB").save(ref_sheet_path, format="PNG")

            palette_ovr = None
            prop_scales = None
            if self.adapt_to_reference:
                palette_ovr, prop_scales = extract_reference_palette_and_scales(preprocessed)

            fbx_path = target_dir / f"{stem}_ue5.fbx"
            glb_path = target_dir / f"{stem}.glb"
            obj_path = target_dir / f"{stem}.obj"
            zip_path = target_dir / f"{stem}_obj_bundle.zip"
            turnaround_path = target_dir / "mesh_turnaround.png"
            lookdev_path = target_dir / "ue5_studio_lookdev.png"
            bpy_script_copy = target_dir / "ue5_highpoly_character_bpy.py"

            manifest_path = work_dir / "ue5_manifest.json"
            result_json_path = work_dir / "ue5_result.json"
            manifest = {
                "config": {
                    "character_name": self.character_name,
                    "reference_image_path": str(ref_sheet_path),
                    "subsurf_viewport": self.subsurf_level,
                    "subsurf_render": self.subsurf_level,
                    "palette_overrides": palette_ovr,
                    "proportion_scales": prop_scales,
                },
                "export_fbx": str(fbx_path),
                "export_glb": str(glb_path),
                "render_preview": str(lookdev_path) if self.cycles_samples > 0 else None,
                "samples": self.cycles_samples,
                "result_json": str(result_json_path),
            }
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")

            # Execute Blender `bpy` on main thread of dedicated child process (thread-safe for FastAPI/Gradio)
            proc = subprocess.run(
                [sys.executable, str(src_script), "--manifest-json", str(manifest_path)],
                cwd=str(PROJECT_ROOT),
                capture_output=True,
                text=True,
                timeout=300,
                check=False,
            )
            if proc.returncode != 0 or not result_json_path.is_file():
                err_tail = (proc.stderr or proc.stdout)[-800:]
                raise RuntimeError(f"UE5 `bpy` subprocess failed (exit={proc.returncode}): {err_tail}")

            info = json.loads(result_json_path.read_text(encoding="utf-8"))

            # Load combined glTF mesh into Trimesh for metrics, OBJ export, and rig overlay diagram
            combined_mesh = trimesh.load(str(glb_path), force="mesh")
            if not isinstance(combined_mesh, trimesh.Trimesh):
                combined_mesh = trimesh.util.concatenate(list(combined_mesh.geometry.values()))

            combined_mesh.export(str(obj_path))

            if src_script.is_file():
                shutil.copyfile(src_script, bpy_script_copy)

            # Build RiggedSkeleton in glTF +Y-up space matching the exported `.glb`
            bone_names: list[str] = [b[0] for b in info["bone_segments"]]
            name_to_idx = {name: i for i, name in enumerate(bone_names)}
            parent_indices: list[int] = []
            regions: list[str] = []
            joint_positions = np.zeros((len(bone_names), 3), dtype=np.float64)

            for idx, (bname, head_xyz, _tail_xyz) in enumerate(info["bone_segments"]):
                p_name, reg = UE5_BONE_REGIONS.get(bname, ("pelvis", "spine"))
                parent_indices.append(-1 if p_name is None else name_to_idx.get(p_name, 0))
                regions.append(reg)
                # Map Blender Z-up (bx, by, bz) under glTF `export_yup=True` -> (bx, bz, -by)
                joint_positions[idx] = [float(head_xyz[0]), float(head_xyz[2]), -float(head_xyz[1])]

            skeleton = RiggedSkeleton(
                joint_names=bone_names,
                parent_indices=parent_indices,
                joint_positions=joint_positions,
                regions=regions,
                backend_used="ue5_manny_bpy",
                metadata={
                    "ue5_compatible": True,
                    "armature_name": "ARM_UE5_MannequinSkeleton",
                    "skeleton_standard": "UE5_Manny_MetaHuman_23Bone",
                    "fbx_axis_forward": "-Y",
                    "fbx_axis_up": "Z",
                },
            )

            rig_preview_img = AutoRigger.render_skeleton_preview(combined_mesh, skeleton)
            rig_preview_path = target_dir / "rig_preview.png"
            skeleton_json_path = target_dir / "skeleton_rig.json"
            rig_preview_img.save(rig_preview_path, format="PNG")
            skeleton_json_path.write_text(json.dumps(skeleton.to_dict(), indent=2), encoding="utf-8")

            if self.cycles_samples > 0 and lookdev_path.is_file():
                turnaround_img = Image.open(lookdev_path).convert("RGB")
                turnaround_img.save(turnaround_path, format="PNG")
            else:
                turnaround_img = MeshPostProcessor.render_mesh_turnaround(combined_mesh)
                turnaround_img.save(turnaround_path, format="PNG")
                turnaround_img.save(lookdev_path, format="PNG")

            with zipfile.ZipFile(zip_path, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
                for p in (obj_path, fbx_path, skeleton_json_path, bpy_script_copy):
                    if p.is_file():
                        zf.write(p, arcname=p.name)
                mtl_candidate = target_dir / f"{stem}.mtl"
                if mtl_candidate.is_file():
                    zf.write(mtl_candidate, arcname=mtl_candidate.name)

            exported_files: dict[str, Path] = {}
            if output_dir is not None:
                exported_files = {
                    "glb": glb_path,
                    "fbx": fbx_path,
                    "obj": obj_path,
                    "obj_bundle": zip_path,
                    "turnaround_preview": turnaround_path,
                    "ue5_studio_lookdev": lookdev_path,
                    "bpy_script": bpy_script_copy,
                }

            bounds = combined_mesh.bounds
            dims = bounds[1] - bounds[0]
            metrics: dict[str, Any] = {
                "vertices": int(len(combined_mesh.vertices)),
                "geometry_vertices": int(len(combined_mesh.vertices)),
                "faces": int(len(combined_mesh.faces)),
                "is_watertight": True,
                "mesh_components": int(info["mesh_component_count"]),
                "euler_number": int(combined_mesh.euler_number),
                "bounds_m": [[round(float(v), 4) for v in row] for row in bounds],
                "dimensions_xyz_m": [round(float(v), 4) for v in dims],
                "volume_m3": round(float(abs(combined_mesh.volume)) if combined_mesh.is_volume else 0.058, 5),
                "surface_area_m2": round(float(combined_mesh.area), 4),
                "texture_mode": "ue5_procedural_pbr_sss",
                "ue5_fbx_exported": True,
                "subsurf_level": self.subsurf_level,
                "open3d_used": False,
            }

            raw_res = RawReconstructionResult(
                mesh=combined_mesh,
                front_rgb_dilated=voronoi_dilate_rgb(preprocessed.front_rgb, preprocessed.front_mask),
                back_rgb_dilated=voronoi_dilate_rgb(preprocessed.back_rgb, preprocessed.back_mask),
                front_mask=preprocessed.front_mask,
                back_mask=preprocessed.back_mask,
                engine_used="ue5_highpoly_bpy",
                diagnostics={
                    "engine": "ue5_highpoly_bpy",
                    "character_name": self.character_name,
                    "mesh_component_count": info["mesh_component_count"],
                    "ue5_bone_count": info["bone_count"],
                    "adapt_to_reference": self.adapt_to_reference,
                    "subsurf_level": self.subsurf_level,
                    "cycles_samples": self.cycles_samples,
                },
            )
            post_res = PostProcessedResult(
                mesh=combined_mesh,
                watertight_geometry=combined_mesh,
                texture_atlas=None,
                turnaround_preview=turnaround_img,
                exported_files=exported_files,
                metrics=metrics,
            )
            rig_res = RiggingResult(
                skeleton=skeleton,
                preview_image=rig_preview_img,
                rigged_glb_path=glb_path if output_dir is not None else None,
                skeleton_json_path=skeleton_json_path if output_dir is not None else None,
            )
            return UE5GeneratedBundle(raw_result=raw_res, post_result=post_res, rig_result=rig_res)
