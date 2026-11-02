"""3DModel Pro — High-Poly Textured 3D Character & Multi-LOD Asset System."""

from __future__ import annotations

import json
import logging
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal

import fast_simplification
import numpy as np
import trimesh
from PIL import Image
from pydantic import BaseModel, Field

from src.config import (
    PROJECT_ROOT,
    PipelineConfig,
    PostProcessorConfig,
    PreprocessorConfig,
    ReconstructionEngineType,
    ReconstructorConfig,
    RiggingBackend,
    RiggingConfig,
)
from src.pbr_texture_baker import (
    generate_character_pbr_textures,
    generate_surface_detail_normal_map,
)
from src.pipeline import Auto3DHumanPipeline
from src.postprocessor import MeshPostProcessor
from src.preprocessor import DualViewPreprocessor
from src.rigger import AutoRigger, RiggedSkeleton
from src.ue5_bpy_generator import (
    UE5_BONE_REGIONS,
    extract_reference_palette_and_scales,
    has_bpy_runtime,
)

logger = logging.getLogger(__name__)

_HEX_COLOR_RE = re.compile(r"^#?[0-9a-fA-F]{6}$")


def hex_to_linear_rgb(hex_str: str) -> tuple[float, float, float]:
    """Convert an sRGB `#RRGGBB` string into Blender linear RGB `[0..1]`."""
    clean = hex_str.strip().lstrip("#")
    if len(clean) != 6 or not _HEX_COLOR_RE.match(clean):
        raise ValueError(f"Invalid hex color '{hex_str}'. Expected #RRGGBB.")
    r = int(clean[0:2], 16) / 255.0
    g = int(clean[2:4], 16) / 255.0
    b = int(clean[4:6], 16) / 255.0
    lin = tuple(
        round(float(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4), 4) for c in (r, g, b)
    )
    return (lin[0], lin[1], lin[2])


HIGHPOLY_ARCHETYPES: dict[str, dict[str, Any]] = {
    "ue5_realistic_female": {
        "id": "ue5_realistic_female",
        "name": "SK_UE5_RealisticFemale",
        "title": "Signature Studio Female (Textured Denim & Rib-Knit)",
        "badge": "301K TRIS · 21 PBR MAPS",
        "description": (
            "1.70m high-poly Catmull-Clark Subdivision female character with 21 embedded PBR textures "
            "(epidermal pore SSS, 45° stonewashed indigo twill denim + normal, rib-knit camisole, "
            "anisotropic espresso hair groom, pebbled leather belt, tumbled sneakers) & 23-bone Manny rig."
        ),
        "swatches": {
            "skin_hex": "#E3B8A3",
            "hair_hex": "#1E1613",
            "top_hex": "#16161B",
            "denim_hex": "#5B82B0",
            "belt_hex": "#1F1F25",
            "metal_hex": "#DCE0E6",
            "shoes_hex": "#F2F0EC",
        },
        "hair_melanin": 0.92,
        "proportions": {"shoulder_scale": 1.0, "waist_scale": 1.0, "hip_scale": 1.0},
    },
    "ue5_cyber_techwear": {
        "id": "ue5_cyber_techwear",
        "name": "SK_UE5_CyberTechwear",
        "title": "Cyber Techwear Operative (Carbon Ripstop & Platinum)",
        "badge": "301K TRIS · SCI-FI PBR",
        "description": (
            "Tactical dark-ops high-poly character with platinum-silver strand hair textures, ballistic "
            "carbon rib-weave bodice, charcoal twill cargo denim + normal maps, and gunmetal hardware."
        ),
        "swatches": {
            "skin_hex": "#EAD2C4",
            "hair_hex": "#AEB8C8",
            "top_hex": "#151A24",
            "denim_hex": "#2F3746",
            "belt_hex": "#12151C",
            "metal_hex": "#8FA2B8",
            "shoes_hex": "#DCE3EC",
        },
        "hair_melanin": 0.20,
        "proportions": {"shoulder_scale": 1.05, "waist_scale": 0.95, "hip_scale": 1.02},
    },
    "ue5_editorial_couture": {
        "id": "ue5_editorial_couture",
        "name": "SK_UE5_EditorialCouture",
        "title": "Editorial Runway Bronze (Oxblood Velvet & Selvedge)",
        "badge": "301K TRIS · COUTURE PBR",
        "description": (
            "Warm golden-bronze epidermal skin maps paired with oxblood-burgundy rib-velvet camisole, "
            "raw dark-indigo selvedge twill denim, brushed 18k champagne-gold hardware, and espresso groom."
        ),
        "swatches": {
            "skin_hex": "#BD8567",
            "hair_hex": "#2A1B14",
            "top_hex": "#4E1420",
            "denim_hex": "#283D5E",
            "belt_hex": "#2B1B15",
            "metal_hex": "#E3C588",
            "shoes_hex": "#F5EFE4",
        },
        "hair_melanin": 0.84,
        "proportions": {"shoulder_scale": 0.99, "waist_scale": 0.93, "hip_scale": 1.04},
    },
    "ue5_zbrush_clay": {
        "id": "ue5_zbrush_clay",
        "name": "SK_UE5_ZBrushClay",
        "title": "Sculptor Micro-Grain Clay Edition",
        "badge": "301K TRIS · SCULPT PBR",
        "description": (
            "Textured ZBrush grey-stoneware lookdev edition preserving full pore, rib-knit, and twill "
            "normal-map relief over neutral sculptor clay albedo maps."
        ),
        "swatches": {
            "skin_hex": "#A8A39D",
            "hair_hex": "#8F8A84",
            "top_hex": "#96928C",
            "denim_hex": "#9E9993",
            "belt_hex": "#7D7974",
            "metal_hex": "#C2BDB7",
            "shoes_hex": "#ABA6A0",
        },
        "hair_melanin": 0.45,
        "proportions": {"shoulder_scale": 1.0, "waist_scale": 1.0, "hip_scale": 1.0},
    },
}


MICRO_DETAIL_PROFILES: list[dict[str, str]] = [
    {
        "id": "skin_pores",
        "label": "Organic Skin Micro-Pores + Normal Map",
        "description": "Isotropic cellular Voronoi micro-relief & tangent-space normal map.",
    },
    {
        "id": "woven_fabric",
        "label": "Diagonal Twill & Cloth Weave + Normal Map",
        "description": "High-frequency textile weave relief & tangent-space normal map.",
    },
    {
        "id": "hard_surface_grain",
        "label": "Tactical Matte Micro-Grain + Normal Map",
        "description": "Subtle anisotropic bead-blasted surface finish & ORM map.",
    },
    {
        "id": "none",
        "label": "Smooth Subdivision + Baked Albedo Only",
        "description": "Pure Catmull-Clark surface continuity preserving UV albedo textures.",
    },
]


class HighPolyCharacterRequest(BaseModel):
    """Parameters for generating a parametric High-Poly Textured UE5 character."""

    title: str = Field(default="SK_UE5_RealisticFemale", min_length=2, max_length=80)
    archetype: str = Field(default="ue5_realistic_female")
    subsurf_level: int = Field(default=2, ge=1, le=3)
    texture_resolution: int = Field(default=1024, ge=512, le=2048)
    cycles_samples: int = Field(default=20, ge=0, le=128)
    generate_lods: bool = Field(default=True)
    adapt_to_reference: bool = Field(default=False)
    shoulder_scale: float = Field(default=1.0, ge=0.82, le=1.22)
    waist_scale: float = Field(default=1.0, ge=0.82, le=1.22)
    hip_scale: float = Field(default=1.0, ge=0.85, le=1.22)
    skin_hex: str | None = None
    hair_hex: str | None = None
    top_hex: str | None = None
    denim_hex: str | None = None
    belt_hex: str | None = None
    metal_hex: str | None = None
    shoes_hex: str | None = None


class HighPolyUpresRequest(BaseModel):
    """Parameters for upgrading any 3D mesh or turnaround image into a Textured High-Poly Multi-LOD asset."""

    title: str = Field(default="HighPoly_Textured_Asset", min_length=2, max_length=80)
    subsurf_level: int = Field(default=2, ge=1, le=3)
    micro_detail: Literal["none", "skin_pores", "woven_fabric", "hard_surface_grain"] = "skin_pores"
    detail_strength: float = Field(default=0.0016, ge=0.0, le=0.01)
    rigging_backend: RiggingBackend = Field(default=RiggingBackend.UE5_MANNY)
    generate_lods: bool = Field(default=True)


_BPY_MESH_UPRES_WORKER = """
import json
import math
import os
import sys
from pathlib import Path
sys.path.insert(0, os.getcwd())
import ue5_highpoly_character_bpy as ue5_boot

if not ue5_boot.ensure_headless_bpy_runtime():
    raise SystemExit("bpy runtime unavailable")

import bpy

spec = json.loads(Path(sys.argv[-1]).read_text(encoding="utf-8"))
bpy.ops.wm.read_factory_settings(use_empty=True)

in_path = spec["input_mesh"]
ext = Path(in_path).suffix.lower()
if ext in (".glb", ".gltf"):
    bpy.ops.import_scene.gltf(filepath=in_path)
elif ext == ".obj":
    bpy.ops.wm.obj_import(filepath=in_path)
elif ext == ".ply":
    bpy.ops.wm.ply_import(filepath=in_path)
elif ext == ".stl":
    bpy.ops.wm.stl_import(filepath=in_path)
else:
    raise RuntimeError(f"Unsupported mesh extension: {ext}")

meshes = [o for o in bpy.data.objects if o.type == "MESH"]
if not meshes:
    raise RuntimeError("No mesh geometry found in uploaded file.")

bpy.ops.object.select_all(action="DESELECT")
for m in meshes:
    m.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1:
    bpy.ops.object.join()

obj = bpy.context.view_layer.objects.active
obj.name = spec.get("object_name", "SM_HighPoly_Asset")
bpy.ops.object.shade_smooth()
ue5_boot.ensure_mesh_uv_layer(obj, uv_scale=2.2)

# Ensure material exists & bind tangent-space micro-normal + ORM maps while keeping BaseColor atlas
if len(obj.data.materials) == 0 or obj.data.materials[0] is None:
    mat = bpy.data.materials.new("MI_HighPoly_Textured")
    mat.use_nodes = True
    if len(obj.data.materials) == 0:
        obj.data.materials.append(mat)
    else:
        obj.data.materials[0] = mat
else:
    mat = obj.data.materials[0]
    mat.use_nodes = True

nodes = mat.node_tree.nodes
links = mat.node_tree.links
bsdf = next((n for n in nodes if n.type == "BSDF_PRINCIPLED"), None)
if bsdf is not None:
    # If mesh lacked an Albedo image texture, attach fallback woven/skin Albedo PNG if provided
    base_sock = bsdf.inputs.get("Base Color")
    has_alb = base_sock is not None and any(lnk.from_node.type == "TEX_IMAGE" for lnk in base_sock.links)
    if not has_alb and spec.get("fallback_albedo") and os.path.isfile(spec["fallback_albedo"]):
        img_a = bpy.data.images.load(spec["fallback_albedo"], check_existing=True)
        img_a.colorspace_settings.name = "sRGB"
        t_a = nodes.new("ShaderNodeTexImage")
        t_a.image = img_a
        links.new(t_a.outputs["Color"], base_sock)

    if spec.get("orm_png") and os.path.isfile(spec["orm_png"]):
        img_o = bpy.data.images.load(spec["orm_png"], check_existing=True)
        img_o.colorspace_settings.name = "Non-Color"
        t_o = nodes.new("ShaderNodeTexImage")
        t_o.image = img_o
        sep = nodes.new("ShaderNodeSeparateColor")
        sep.mode = "RGB"
        links.new(t_o.outputs["Color"], sep.inputs["Color"])
        if "Roughness" in bsdf.inputs:
            for l in list(bsdf.inputs["Roughness"].links):
                links.remove(l)
            links.new(sep.outputs["Green"], bsdf.inputs["Roughness"])

    if spec.get("normal_png") and os.path.isfile(spec["normal_png"]):
        img_n = bpy.data.images.load(spec["normal_png"], check_existing=True)
        img_n.colorspace_settings.name = "Non-Color"
        t_n = nodes.new("ShaderNodeTexImage")
        t_n.image = img_n
        nrm = nodes.new("ShaderNodeNormalMap")
        nrm.inputs["Strength"].default_value = 0.75
        links.new(t_n.outputs["Color"], nrm.inputs["Color"])
        if "Normal" in bsdf.inputs:
            for l in list(bsdf.inputs["Normal"].links):
                links.remove(l)
            links.new(nrm.outputs["Normal"], bsdf.inputs["Normal"])

sub_levels = int(spec.get("subsurf_level", 2))
sub = obj.modifiers.new(name="HighPoly_Subsurf", type="SUBSURF")
sub.subdivision_type = "CATMULL_CLARK"
sub.levels = sub_levels
sub.render_levels = sub_levels
sub.uv_smooth = "PRESERVE_BOUNDARIES"

detail_mode = spec.get("micro_detail", "none")
strength = float(spec.get("detail_strength", 0.0016))
if detail_mode != "none" and strength > 0.0:
    tex_type = "VORONOI" if detail_mode == "skin_pores" else "CLOUDS"
    tex = bpy.data.textures.new("TEX_HighPolyMicroDetail", type=tex_type)
    if hasattr(tex, "noise_scale"):
        tex.noise_scale = 0.012 if detail_mode == "skin_pores" else 0.020
    disp = obj.modifiers.new(name="HighPoly_MicroDisplacement", type="DISPLACE")
    disp.texture = tex
    disp.strength = strength
    disp.mid_level = 0.5

os.makedirs(os.path.dirname(spec["out_glb"]), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=spec["out_glb"],
    export_format="GLB",
    use_renderable=True,
    export_apply=True,
    export_yup=True,
)
bpy.ops.export_scene.fbx(
    filepath=spec["out_fbx"],
    use_selection=False,
    object_types={"ARMATURE", "MESH"},
    use_mesh_modifiers=True,
    mesh_smooth_type="FACE",
    use_tspace=True,
    add_leaf_bones=False,
    axis_forward="-Y",
    axis_up="Z",
    path_mode="COPY",
    embed_textures=True,
)

for lod_spec in spec.get("export_lods", []):
    sub.levels = int(lod_spec["subsurf"])
    sub.render_levels = int(lod_spec["subsurf"])
    dmod = None
    if float(lod_spec.get("decimate", 1.0)) < 0.99:
        dmod = obj.modifiers.new(name="Temp_LOD_Dec", type="DECIMATE")
        dmod.ratio = float(lod_spec["decimate"])
    bpy.context.view_layer.update()
    bpy.ops.export_scene.gltf(
        filepath=lod_spec["glb_path"],
        export_format="GLB",
        use_renderable=True,
        export_apply=True,
        export_yup=True,
    )
    if dmod is not None:
        obj.modifiers.remove(dmod)
"""


def build_palette_from_request(req: HighPolyCharacterRequest) -> tuple[dict[str, Any], dict[str, str]]:
    """Resolve linear RGB shader overrides and display hex swatches for a character build."""
    arch = HIGHPOLY_ARCHETYPES.get(req.archetype, HIGHPOLY_ARCHETYPES["ue5_realistic_female"])
    swatches = dict(arch["swatches"])
    for key in ("skin_hex", "hair_hex", "top_hex", "denim_hex", "belt_hex", "metal_hex", "shoes_hex"):
        val = getattr(req, key)
        if val and _HEX_COLOR_RE.match(val.strip()):
            swatches[key] = "#" + val.strip().lstrip("#").upper()

    skin_lin = hex_to_linear_rgb(swatches["skin_hex"])
    hair_lin = hex_to_linear_rgb(swatches["hair_hex"])
    top_lin = hex_to_linear_rgb(swatches["top_hex"])
    denim_lin = hex_to_linear_rgb(swatches["denim_hex"])
    belt_lin = hex_to_linear_rgb(swatches["belt_hex"])
    metal_lin = hex_to_linear_rgb(swatches["metal_hex"])
    shoes_lin = hex_to_linear_rgb(swatches["shoes_hex"])

    hair_lum = (0.2126 * hair_lin[0] + 0.7152 * hair_lin[1] + 0.0722 * hair_lin[2]) ** (1.0 / 2.2)
    melanin = float(np.clip(1.0 - hair_lum * 1.12, 0.08, 0.96))

    palette: dict[str, Any] = {
        "skin": skin_lin,
        "hair_rgb": hair_lin,
        "hair_melanin": (round(melanin, 3), 0.24, 0.0),
        "top": top_lin,
        "denim_dark": tuple(round(max(0.008, c * 0.56), 4) for c in denim_lin),
        "denim_light": tuple(round(min(1.0, c * 1.24), 4) for c in denim_lin),
        "belt": belt_lin,
        "metal": metal_lin,
        "shoes": shoes_lin,
    }
    return palette, swatches


def generate_lod_chain_from_mesh(
    highpoly_mesh: trimesh.Trimesh,
    asset_dir: Path,
    lod0_glb_path: Path,
    ratios: tuple[tuple[str, str, float], ...] = (
        ("LOD1", "Hero Cinematic", 0.24),
        ("LOD2", "Real-Time Gameplay", 0.09),
        ("LOD3", "Crowd / Mobile", 0.035),
    ),
) -> list[dict[str, Any]]:
    """Fallback pure-Python LOD0..LOD3 `.glb` generator when Blender LOD files were not pre-exported."""
    lods: list[dict[str, Any]] = [
        {
            "lod": "LOD0",
            "label": "High-Poly Textured / Nanite",
            "vertices": int(len(highpoly_mesh.vertices)),
            "triangles": int(len(highpoly_mesh.faces)),
            "ratio": 1.0,
            "filename": lod0_glb_path.name,
            "size_mb": round(lod0_glb_path.stat().st_size / (1024 * 1024), 2),
        }
    ]

    v_src = np.ascontiguousarray(highpoly_mesh.vertices, dtype=np.float32)
    f_src = np.ascontiguousarray(highpoly_mesh.faces, dtype=np.int32)
    n_orig = len(f_src)
    if n_orig < 2500:
        return lods

    for lod_id, label, frac in ratios:
        target_tris = max(1200, int(n_orig * frac))
        if target_tris >= n_orig:
            continue
        target_reduction = float(np.clip(1.0 - (target_tris / float(n_orig)), 0.05, 0.985))
        try:
            v_dec, f_dec = fast_simplification.simplify(v_src, f_src, target_reduction=target_reduction)
            dec_mesh = trimesh.Trimesh(vertices=v_dec, faces=f_dec, process=False)
            lod_file = asset_dir / f"{lod_id.lower()}.glb"
            dec_mesh.export(str(lod_file))
            lods.append(
                {
                    "lod": lod_id,
                    "label": label,
                    "vertices": int(len(dec_mesh.vertices)),
                    "triangles": int(len(dec_mesh.faces)),
                    "ratio": round(len(dec_mesh.faces) / float(n_orig), 4),
                    "filename": lod_file.name,
                    "size_mb": round(lod_file.stat().st_size / (1024 * 1024), 2),
                }
            )
        except Exception as exc:
            logger.warning("Skipping %s generation: %s", lod_id, exc)

    return lods


def _inspect_glb_lod_metrics(
    asset_dir: Path,
    lod_specs: list[tuple[str, str, Path]],
) -> list[dict[str, Any]]:
    """Measure exact vertex/triangle counts & file sizes across Blender-exported textured LOD GLBs."""
    out: list[dict[str, Any]] = []
    base_tris = 1
    for idx, (lod_id, label, glb_file) in enumerate(lod_specs):
        if not glb_file.is_file():
            continue
        m = trimesh.load(str(glb_file), force="mesh")
        if not isinstance(m, trimesh.Trimesh):
            m = trimesh.util.concatenate(list(m.geometry.values()))
        tris = int(len(m.faces))
        verts = int(len(m.vertices))
        if idx == 0:
            base_tris = max(1, tris)
        out.append(
            {
                "lod": lod_id,
                "label": label,
                "vertices": verts,
                "triangles": tris,
                "ratio": round(tris / float(base_tris), 4),
                "filename": glb_file.name,
                "size_mb": round(glb_file.stat().st_size / (1024 * 1024), 2),
            }
        )
    return out


def _count_glb_embedded_textures(glb_path: Path) -> int:
    """Read glTF 2.0 JSON chunk header to verify exact count of embedded PBR texture maps."""
    import struct

    try:
        with glb_path.open("rb") as fh:
            hdr = fh.read(20)
            if len(hdr) < 20 or hdr[:4] != b"glTF":
                return 0
            jlen, _ = struct.unpack("<I4s", hdr[12:20])
            gltf = json.loads(fh.read(jlen).decode("utf-8"))
            return len(gltf.get("textures") or [])
    except Exception:
        return 0


class HighPolyModelSystem:
    """Persistent studio orchestrator for High-Poly Textured 3D characters & Multi-LOD assets."""

    def __init__(self, library_root: Path | None = None) -> None:
        self.library_root = Path(library_root or (PROJECT_ROOT / "outputs" / "pro_library"))
        self.library_root.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()

    def list_models(self) -> list[dict[str, Any]]:
        """Return all High-Poly Textured 3D models sorted with flagship/showcase items pinned first."""
        items: list[dict[str, Any]] = []
        if not self.library_root.is_dir():
            return items
        for d in self.library_root.iterdir():
            manifest_file = d / "pro_asset.json"
            if d.is_dir() and manifest_file.is_file():
                try:
                    data = json.loads(manifest_file.read_text(encoding="utf-8"))
                    items.append(self._attach_urls(d.name, d, data))
                except Exception as exc:
                    logger.warning("Skipping corrupt asset manifest %s: %s", manifest_file, exc)

        items.sort(
            key=lambda m: (
                int(m.get("showcase_order", 99)),
                -float(m.get("created_ts", 0.0)),
            )
        )
        return items

    def get_model(self, model_id: str) -> dict[str, Any] | None:
        asset_dir = self._resolve_dir(model_id)
        if asset_dir is None:
            return None
        manifest_file = asset_dir / "pro_asset.json"
        if not manifest_file.is_file():
            return None
        data = json.loads(manifest_file.read_text(encoding="utf-8"))
        enriched = self._attach_urls(model_id, asset_dir, data)
        skel_file = asset_dir / "skeleton_rig.json"
        if skel_file.is_file():
            enriched["skeleton"] = json.loads(skel_file.read_text(encoding="utf-8"))
        return enriched

    def delete_model(self, model_id: str) -> bool:
        asset_dir = self._resolve_dir(model_id)
        if asset_dir is None or not asset_dir.is_dir():
            return False
        manifest_file = asset_dir / "pro_asset.json"
        if manifest_file.is_file():
            data = json.loads(manifest_file.read_text(encoding="utf-8"))
            if data.get("is_flagship"):
                raise ValueError("Showcase High-Poly models are protected from deletion.")
        shutil.rmtree(asset_dir, ignore_errors=True)
        return True

    def resolve_asset_file(self, model_id: str, filename: str) -> Path | None:
        asset_dir = self._resolve_dir(model_id)
        if asset_dir is None or not asset_dir.is_dir() or ".." in filename:
            return None
        candidate = (asset_dir / filename).resolve()
        if not candidate.is_relative_to(asset_dir.resolve()):
            return None
        if filename == "production_pack.zip" and not candidate.is_file():
            self._build_production_zip(asset_dir, candidate)
        if not candidate.is_file():
            return None
        return candidate

    def ensure_flagship_model(self, cycles_samples: int = 20) -> dict[str, Any]:
        """Ensure the complete High-Poly Textured 3D Showcase Collection is built and textured."""
        showcase_specs = [
            (
                "flagship-ue5-female",
                1,
                HighPolyCharacterRequest(
                    title="SK_UE5_RealisticFemale · Indigo Denim & Rib-Knit",
                    archetype="ue5_realistic_female",
                    subsurf_level=2,
                    texture_resolution=512,
                    cycles_samples=cycles_samples,
                    generate_lods=True,
                ),
            ),
            (
                "showcase-cyber-techwear",
                2,
                HighPolyCharacterRequest(
                    title="SK_UE5_CyberTechwear · Carbon Ripstop & Platinum",
                    archetype="ue5_cyber_techwear",
                    subsurf_level=2,
                    texture_resolution=512,
                    cycles_samples=max(14, cycles_samples - 4),
                    generate_lods=True,
                ),
            ),
            (
                "showcase-editorial-couture",
                3,
                HighPolyCharacterRequest(
                    title="SK_UE5_EditorialCouture · Oxblood Velvet & Selvedge",
                    archetype="ue5_editorial_couture",
                    subsurf_level=2,
                    texture_resolution=512,
                    cycles_samples=max(14, cycles_samples - 4),
                    generate_lods=True,
                ),
            ),
        ]

        with self._lock:
            for mid, order, req in showcase_specs:
                lod0 = self.library_root / mid / "lod0.glb"
                if not lod0.is_file() or _count_glb_embedded_textures(lod0) == 0:
                    logger.info("Building High-Poly Textured Showcase Model '%s'...", mid)
                    self.generate_character(
                        req=req,
                        reference_bytes=None,
                        forced_id=mid,
                        is_flagship=True,
                        showcase_order=order,
                    )

            # Model 4: Dual-View Image-to-HighPoly UV-Atlas Textured Character from sample_input.jpg
            hero_id = "showcase-turnaround-hero"
            hero_glb = self.library_root / hero_id / "lod0.glb"
            sample_jpg = PROJECT_ROOT / "assets" / "sample_input.jpg"
            if sample_jpg.is_file() and (
                not hero_glb.is_file() or _count_glb_embedded_textures(hero_glb) == 0
            ):
                logger.info("Building Dual-View High-Poly UV-Textured Turnaround Hero '%s'...", hero_id)
                self.upres_to_highpoly(
                    req=HighPolyUpresRequest(
                        title="CH_Turnaround_HighPoly · UV Atlas & Weave Normal",
                        subsurf_level=1,
                        micro_detail="woven_fabric",
                        detail_strength=0.0014,
                        rigging_backend=RiggingBackend.UE5_MANNY,
                        generate_lods=True,
                    ),
                    upload_bytes=sample_jpg.read_bytes(),
                    filename=sample_jpg.name,
                    forced_id=hero_id,
                    is_flagship=True,
                    showcase_order=4,
                )

        return self.get_model("flagship-ue5-female") or self.list_models()[0]

    def generate_character(
        self,
        req: HighPolyCharacterRequest,
        reference_bytes: bytes | None = None,
        forced_id: str | None = None,
        is_flagship: bool = False,
        showcase_order: int = 50,
    ) -> dict[str, Any]:
        """Generate a High-Poly Textured 3D UE5 character (`bpy` Subsurf + 21 PBR Textures + Manny Rig)."""
        if not has_bpy_runtime():
            raise RuntimeError("Blender Python (`bpy`) 4.5 LTS runtime is required for UE5 Character Forge.")

        t0 = time.perf_counter()
        model_id = forced_id or f"char-{uuid.uuid4().hex[:10]}"
        asset_dir = self.library_root / model_id
        if asset_dir.exists():
            shutil.rmtree(asset_dir, ignore_errors=True)
        asset_dir.mkdir(parents=True, exist_ok=True)
        tex_dir = asset_dir / "textures"

        arch = HIGHPOLY_ARCHETYPES.get(req.archetype, HIGHPOLY_ARCHETYPES["ue5_realistic_female"])
        palette, swatches = build_palette_from_request(req)
        scales = {
            "shoulder_scale": round(req.shoulder_scale * arch["proportions"]["shoulder_scale"], 4),
            "waist_scale": round(req.waist_scale * arch["proportions"]["waist_scale"], 4),
            "hip_scale": round(req.hip_scale * arch["proportions"]["hip_scale"], 4),
        }

        ref_path = PROJECT_ROOT / "assets" / "sample_input.jpg"
        if reference_bytes is not None:
            pair = DualViewPreprocessor(PreprocessorConfig(image_size=512)).process(reference_bytes)
            w, h = pair.front_rgba.size
            sheet = Image.new("RGBA", (w * 2, h), (240, 243, 248, 255))
            sheet.alpha_composite(pair.front_rgba, (0, 0))
            sheet.alpha_composite(pair.back_rgba, (w, 0))
            custom_ref = asset_dir / "reference_turnaround.png"
            sheet.convert("RGB").save(custom_ref, format="PNG")
            ref_path = custom_ref
            if req.adapt_to_reference:
                extracted_pal, extracted_scales = extract_reference_palette_and_scales(pair)
                palette.update(extracted_pal)
                scales.update(extracted_scales)

        # Synthesize 21 seamless 1K/2K PBR Texture Maps (Albedo + Tangent Normal + ORM)
        pbr_textures = generate_character_pbr_textures(
            tex_dir=tex_dir,
            swatches=swatches,
            resolution=req.texture_resolution,
            seed=abs(hash(model_id)) % 10000,
        )

        fbx_path = asset_dir / "character_ue5.fbx"
        lod0_glb = asset_dir / "lod0.glb"
        lod1_glb = asset_dir / "lod1.glb"
        lod2_glb = asset_dir / "lod2.glb"
        lod3_glb = asset_dir / "lod3.glb"
        lookdev_png = asset_dir / "lookdev.png"
        rig_png = asset_dir / "rig_preview.png"
        skel_json = asset_dir / "skeleton_rig.json"
        bpy_copy = asset_dir / "ue5_highpoly_character_bpy.py"

        bpy_lod_exports = (
            [
                {"subsurf": max(0, req.subsurf_level - 1), "decimate": 1.0, "glb_path": str(lod1_glb)},
                {"subsurf": 0, "decimate": 1.0, "glb_path": str(lod2_glb)},
                {"subsurf": 0, "decimate": 0.45, "glb_path": str(lod3_glb)},
            ]
            if req.generate_lods
            else []
        )

        src_script = PROJECT_ROOT / "ue5_highpoly_character_bpy.py"
        with tempfile.TemporaryDirectory(prefix="pro_char_") as tmp_s:
            tmp_d = Path(tmp_s)
            manifest_path = tmp_d / "manifest.json"
            result_path = tmp_d / "result.json"
            manifest = {
                "config": {
                    "character_name": arch["name"],
                    "reference_image_path": str(ref_path),
                    "subsurf_viewport": req.subsurf_level,
                    "subsurf_render": req.subsurf_level,
                    "palette_overrides": palette,
                    "proportion_scales": scales,
                    "pbr_textures": pbr_textures,
                },
                "export_fbx": str(fbx_path),
                "export_glb": str(lod0_glb),
                "export_lods": bpy_lod_exports,
                "render_preview": str(lookdev_png) if req.cycles_samples > 0 else None,
                "samples": req.cycles_samples,
                "result_json": str(result_path),
            }
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")

            proc = subprocess.run(
                [sys.executable, str(src_script), "--manifest-json", str(manifest_path)],
                cwd=str(PROJECT_ROOT),
                capture_output=True,
                text=True,
                timeout=420,
                check=False,
            )
            if proc.returncode != 0 or not result_path.is_file():
                shutil.rmtree(asset_dir, ignore_errors=True)
                err = (proc.stderr or proc.stdout)[-800:]
                raise RuntimeError(f"UE5 High-Poly `bpy` build failed: {err}")

            info = json.loads(result_path.read_text(encoding="utf-8"))

        combined_mesh = trimesh.load(str(lod0_glb), force="mesh")
        if not isinstance(combined_mesh, trimesh.Trimesh):
            combined_mesh = trimesh.util.concatenate(list(combined_mesh.geometry.values()))

        if src_script.is_file():
            shutil.copyfile(src_script, bpy_copy)

        bone_names = [b[0] for b in info["bone_segments"]]
        name_to_idx = {n: i for i, n in enumerate(bone_names)}
        parent_indices: list[int] = []
        regions: list[str] = []
        joint_positions = np.zeros((len(bone_names), 3), dtype=np.float64)
        for idx, (bname, head_xyz, _tail_xyz) in enumerate(info["bone_segments"]):
            p_name, reg = UE5_BONE_REGIONS.get(bname, ("pelvis", "spine"))
            parent_indices.append(-1 if p_name is None else name_to_idx.get(p_name, 0))
            regions.append(reg)
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
        AutoRigger.render_skeleton_preview(combined_mesh, skeleton).save(rig_png, format="PNG")
        skel_json.write_text(json.dumps(skeleton.to_dict(), indent=2), encoding="utf-8")

        if not lookdev_png.is_file():
            MeshPostProcessor.render_mesh_turnaround(combined_mesh).save(lookdev_png, format="PNG")

        lod_specs = [
            ("LOD0", "High-Poly Textured / Nanite", lod0_glb),
            ("LOD1", "Hero Cinematic (Textured)", lod1_glb),
            ("LOD2", "Real-Time Gameplay (Textured)", lod2_glb),
            ("LOD3", "Crowd / Mobile (Textured)", lod3_glb),
        ]
        lods = _inspect_glb_lod_metrics(asset_dir, lod_specs)
        embedded_tex_cnt = _count_glb_embedded_textures(lod0_glb)

        texture_cards = self._collect_texture_cards(tex_dir, pbr_textures)
        bounds = combined_mesh.bounds
        dims = bounds[1] - bounds[0]
        elapsed = round(time.perf_counter() - t0, 2)

        materials_list = [
            {
                "slot": "MI_UE5_HumanSkin_SSS",
                "type": "Albedo + Pore Normal + ORM",
                "hex": swatches["skin_hex"],
            },
            {
                "slot": "MI_UE5_DarkWavyHair_PBR",
                "type": "Strand Albedo + Fiber Normal",
                "hex": swatches["hair_hex"],
            },
            {
                "slot": "MI_UE5_BlackCamisole_Cloth",
                "type": "Rib-Knit Albedo + Weave Normal",
                "hex": swatches["top_hex"],
            },
            {
                "slot": "MI_UE5_DistressedDenim",
                "type": "45° Twill Albedo + Normal + ORM",
                "hex": swatches["denim_hex"],
            },
            {
                "slot": "MI_UE5_BlackLeatherBelt",
                "type": "Pebbled Leather Albedo + Normal",
                "hex": swatches["belt_hex"],
            },
            {
                "slot": "MI_UE5_MetallicBuckleAndJewelry",
                "type": "Brushed Metal Albedo + ORM",
                "hex": swatches["metal_hex"],
            },
            {
                "slot": "MI_UE5_WhiteSneakers",
                "type": "Tumbled Leather + Perf Normal",
                "hex": swatches["shoes_hex"],
            },
            {"slot": "MI_UE5_DarkBrownIris", "type": "Radial Limbal & Iris Crypt Map", "hex": "#5C361E"},
        ]

        asset_record: dict[str, Any] = {
            "model_id": model_id,
            "title": req.title,
            "workflow": "ue5_character_forge",
            "archetype": req.archetype,
            "archetype_title": arch["title"],
            "is_flagship": is_flagship,
            "showcase_order": showcase_order,
            "front_axis": "-Z",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "created_ts": time.time(),
            "elapsed_seconds": elapsed,
            "subsurf_level": req.subsurf_level,
            "texture_resolution": req.texture_resolution,
            "embedded_texture_count": embedded_tex_cnt,
            "cycles_samples": req.cycles_samples,
            "mesh_components": int(info["mesh_component_count"]),
            "vertices": int(len(combined_mesh.vertices)),
            "triangles": int(len(combined_mesh.faces)),
            "surface_area_m2": round(float(combined_mesh.area), 4),
            "dimensions_m": [round(float(x), 4) for x in dims],
            "height_m": round(float(dims[1]), 4),
            "skeleton_standard": "UE5 Mannequin / MetaHuman (23 Bones)",
            "armature_name": "ARM_UE5_MannequinSkeleton",
            "bone_count": len(bone_names),
            "ue5_ready": True,
            "swatches": swatches,
            "proportions": scales,
            "materials": materials_list,
            "texture_maps": texture_cards,
            "lod_chain": lods,
        }
        (asset_dir / "pro_asset.json").write_text(json.dumps(asset_record, indent=2), encoding="utf-8")
        return self.get_model(model_id) or asset_record

    def upres_to_highpoly(
        self,
        req: HighPolyUpresRequest,
        upload_bytes: bytes,
        filename: str,
        forced_id: str | None = None,
        is_flagship: bool = False,
        showcase_order: int = 50,
    ) -> dict[str, Any]:
        """Upgrade an uploaded 3D mesh or Dual-View image into a Textured High-Poly Multi-LOD asset."""
        t0 = time.perf_counter()
        model_id = forced_id or f"upres-{uuid.uuid4().hex[:10]}"
        asset_dir = self.library_root / model_id
        if asset_dir.exists():
            shutil.rmtree(asset_dir, ignore_errors=True)
        asset_dir.mkdir(parents=True, exist_ok=True)
        tex_dir = asset_dir / "textures"
        tex_dir.mkdir(parents=True, exist_ok=True)

        ext = Path(filename).suffix.lower()
        mesh_exts = {".glb", ".gltf", ".obj", ".ply", ".stl"}
        img_exts = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}

        detail_maps = generate_surface_detail_normal_map(
            tex_dir=tex_dir,
            detail_mode=req.micro_detail,
            resolution=512,
        )
        fallback_alb = tex_dir / "T_Base_Albedo.png"

        with tempfile.TemporaryDirectory(prefix="pro_upres_") as tmp_s:
            tmp_d = Path(tmp_s)
            if ext in img_exts or ext not in mesh_exts:
                base_target = 16000 if req.subsurf_level <= 1 else (9000 if req.subsurf_level == 2 else 4000)
                pipe_cfg = PipelineConfig(
                    preprocessor=PreprocessorConfig(image_size=512),
                    reconstructor=ReconstructorConfig(
                        engine=ReconstructionEngineType.VOLUMETRIC_SDF,
                        mc_resolution=160,
                    ),
                    postprocessor=PostProcessorConfig(
                        target_faces=base_target,
                        smoothing_iterations=14,
                        texture_resolution=1024,
                        export_formats=["glb"],
                    ),
                    rigging=RiggingConfig(enabled=False, backend=RiggingBackend.NONE),
                )
                base_res = Auto3DHumanPipeline(pipe_cfg).run(
                    source=upload_bytes,
                    output_dir=tmp_d / "base_recon",
                    stem="base",
                    save_intermediate=True,
                )
                input_mesh_path = base_res.postprocessed.exported_files["glb"]
                if base_res.postprocessed.texture_atlas is not None:
                    base_res.postprocessed.texture_atlas.save(fallback_alb, format="PNG")
                source_kind = "Dual-View UV Texture Atlas + Catmull-Clark Subdiv + Normal Map"
            else:
                input_mesh_path = tmp_d / f"uploaded{ext}"
                input_mesh_path.write_bytes(upload_bytes)
                # Create a clean ceramic/stoneware Albedo map in case uploaded mesh had no diffuse texture
                Image.new("RGB", (512, 512), (186, 198, 214)).save(fallback_alb, format="PNG")
                source_kind = f"Uploaded {ext.upper()} Mesh + Catmull-Clark Subdiv + Normal Map"

            lod0_glb = asset_dir / "lod0.glb"
            lod1_glb = asset_dir / "lod1.glb"
            lod2_glb = asset_dir / "lod2.glb"
            lod3_glb = asset_dir / "lod3.glb"
            fbx_path = asset_dir / "character_ue5.fbx"
            lookdev_png = asset_dir / "lookdev.png"
            rig_png = asset_dir / "rig_preview.png"
            skel_json = asset_dir / "skeleton_rig.json"

            lod_export_list = (
                [
                    {"subsurf": max(0, req.subsurf_level - 1), "decimate": 1.0, "glb_path": str(lod1_glb)},
                    {"subsurf": 0, "decimate": 0.90, "glb_path": str(lod2_glb)},
                    {"subsurf": 0, "decimate": 0.40, "glb_path": str(lod3_glb)},
                ]
                if req.generate_lods
                else []
            )

            if has_bpy_runtime():
                worker_py = tmp_d / "run_upres_bpy.py"
                spec_json = tmp_d / "upres_spec.json"
                worker_py.write_text(_BPY_MESH_UPRES_WORKER, encoding="utf-8")
                spec_json.write_text(
                    json.dumps(
                        {
                            "input_mesh": str(input_mesh_path),
                            "object_name": re.sub(r"[^a-zA-Z0-9_]", "_", req.title)[:48],
                            "subsurf_level": req.subsurf_level,
                            "micro_detail": req.micro_detail,
                            "detail_strength": req.detail_strength,
                            "fallback_albedo": str(fallback_alb) if fallback_alb.is_file() else None,
                            "normal_png": detail_maps["normal"],
                            "orm_png": detail_maps["orm"],
                            "out_glb": str(lod0_glb),
                            "out_fbx": str(fbx_path),
                            "export_lods": lod_export_list,
                        }
                    ),
                    encoding="utf-8",
                )
                proc = subprocess.run(
                    [sys.executable, str(worker_py), str(spec_json)],
                    cwd=str(PROJECT_ROOT),
                    capture_output=True,
                    text=True,
                    timeout=300,
                    check=False,
                )
                if proc.returncode != 0 or not lod0_glb.is_file():
                    shutil.rmtree(asset_dir, ignore_errors=True)
                    err = (proc.stderr or proc.stdout)[-800:]
                    raise RuntimeError(f"High-Poly Subdivision `bpy` worker failed: {err}")
            else:
                import pyvista as pv

                raw_m = trimesh.load(str(input_mesh_path), force="mesh")
                faces_pv = np.hstack([np.full((len(raw_m.faces), 1), 3), raw_m.faces]).ravel()
                poly = pv.PolyData(raw_m.vertices, faces_pv).subdivide(req.subsurf_level, subfilter="loop")
                f_arr = poly.faces.reshape(-1, 4)[:, 1:4]
                up_m = trimesh.Trimesh(vertices=np.asarray(poly.points), faces=f_arr, process=True)
                up_m.export(str(lod0_glb))

        high_mesh = trimesh.load(str(lod0_glb), force="mesh")
        if not isinstance(high_mesh, trimesh.Trimesh):
            high_mesh = trimesh.util.concatenate(list(high_mesh.geometry.values()))

        rig_backend = (
            req.rigging_backend if req.rigging_backend != RiggingBackend.AUTO else RiggingBackend.UE5_MANNY
        )
        rigger = AutoRigger(RiggingConfig(enabled=rig_backend != RiggingBackend.NONE, backend=rig_backend))
        rig_res = rigger.rig_and_inject(
            watertight_mesh=high_mesh,
            glb_path=lod0_glb,
            output_dir=asset_dir,
        )

        MeshPostProcessor.render_mesh_turnaround(high_mesh).save(lookdev_png, format="PNG")
        if lod1_glb.is_file():
            lods = _inspect_glb_lod_metrics(
                asset_dir,
                [
                    ("LOD0", "High-Poly Textured / Nanite", lod0_glb),
                    ("LOD1", "Hero Cinematic (Textured)", lod1_glb),
                    ("LOD2", "Real-Time Gameplay (Textured)", lod2_glb),
                    ("LOD3", "Crowd / Mobile (Textured)", lod3_glb),
                ],
            )
        else:
            lods = generate_lod_chain_from_mesh(high_mesh, asset_dir, lod0_glb)

        embedded_tex_cnt = _count_glb_embedded_textures(lod0_glb)
        texture_cards = self._collect_texture_cards(
            tex_dir,
            {
                "surface": {
                    "albedo": str(fallback_alb) if fallback_alb.is_file() else "",
                    "normal": detail_maps["normal"],
                    "orm": detail_maps["orm"],
                    "label": "Baked UV Albedo Atlas + Micro-Normal + ORM",
                }
            },
        )

        bounds = high_mesh.bounds
        dims = bounds[1] - bounds[0]
        elapsed = round(time.perf_counter() - t0, 2)
        bone_cnt = len(rig_res.skeleton.joint_names) if rig_res is not None else 0
        skel_std = (
            "UE5 Mannequin / MetaHuman (23 Bones)"
            if rig_backend == RiggingBackend.UE5_MANNY
            else f"Standard Humanoid ({bone_cnt} Bones)"
        )

        asset_record = {
            "model_id": model_id,
            "title": req.title,
            "workflow": "highpoly_upres_lab",
            "archetype": "custom_upres",
            "archetype_title": source_kind,
            "is_flagship": is_flagship,
            "showcase_order": showcase_order,
            "front_axis": "+Z",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "created_ts": time.time(),
            "elapsed_seconds": elapsed,
            "subsurf_level": req.subsurf_level,
            "texture_resolution": 1024,
            "embedded_texture_count": embedded_tex_cnt,
            "micro_detail": req.micro_detail,
            "mesh_components": 1,
            "vertices": int(len(high_mesh.vertices)),
            "triangles": int(len(high_mesh.faces)),
            "surface_area_m2": round(float(high_mesh.area), 4),
            "dimensions_m": [round(float(x), 4) for x in dims],
            "height_m": round(float(dims[1]), 4),
            "skeleton_standard": skel_std if bone_cnt > 0 else "Unrigged Static High-Poly",
            "armature_name": (
                "ARM_UE5_MannequinSkeleton"
                if rig_backend == RiggingBackend.UE5_MANNY
                else "Auto3DHumanoidArmature"
            ),
            "bone_count": bone_cnt,
            "ue5_ready": fbx_path.is_file(),
            "swatches": {},
            "materials": [
                {
                    "slot": "MI_HighPoly_Textured",
                    "type": f"UV Albedo Atlas + {req.micro_detail} Normal + ORM",
                    "hex": "#5B82B0",
                }
            ],
            "texture_maps": texture_cards,
            "lod_chain": lods,
        }
        (asset_dir / "pro_asset.json").write_text(json.dumps(asset_record, indent=2), encoding="utf-8")
        if rig_res is None and not rig_png.is_file():
            shutil.copyfile(lookdev_png, rig_png)
        if rig_res is None and not skel_json.is_file():
            skel_json.write_text(json.dumps({"joint_names": [], "bones": []}), encoding="utf-8")

        return self.get_model(model_id) or asset_record

    def _resolve_dir(self, model_id: str) -> Path | None:
        if not re.match(r"^[a-zA-Z0-9_-]{3,64}$", model_id):
            return None
        d = (self.library_root / model_id).resolve()
        if not d.is_relative_to(self.library_root.resolve()):
            return None
        return d

    @staticmethod
    def _collect_texture_cards(
        tex_dir: Path,
        pbr_map: dict[str, dict[str, str]],
    ) -> list[dict[str, str]]:
        cards: list[dict[str, str]] = []
        channel_titles = {
            "albedo": "BaseColor / Albedo (sRGB)",
            "normal": "Tangent-Space Normal",
            "orm": "Occlusion · Roughness · Metallic",
        }
        for slot_key, entry in pbr_map.items():
            label = entry.get("label", slot_key)
            for ch in ("albedo", "normal", "orm"):
                p_str = entry.get(ch, "")
                if p_str and Path(p_str).is_file():
                    fname = Path(p_str).name
                    cards.append(
                        {
                            "slot": slot_key,
                            "label": label,
                            "channel": ch,
                            "channel_title": channel_titles[ch],
                            "filename": f"textures/{fname}",
                        }
                    )
        return cards

    @staticmethod
    def _build_production_zip(asset_dir: Path, zip_path: Path) -> None:
        with zipfile.ZipFile(zip_path, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
            for item in sorted(asset_dir.rglob("*")):
                if item.is_file() and item.resolve() != zip_path.resolve():
                    rel = item.relative_to(asset_dir).as_posix()
                    zf.write(item, arcname=rel)

    @staticmethod
    def _attach_urls(model_id: str, asset_dir: Path, record: dict[str, Any]) -> dict[str, Any]:
        out = dict(record)
        base = f"/api/pro/v1/models/{model_id}/files"
        files: dict[str, str] = {}
        for p in sorted(asset_dir.iterdir()):
            if p.is_file():
                files[p.name] = f"{base}/{p.name}"
        tex_dir = asset_dir / "textures"
        if tex_dir.is_dir():
            for tp in sorted(tex_dir.iterdir()):
                if tp.is_file():
                    files[f"textures/{tp.name}"] = f"{base}/textures/{tp.name}"

        out["files"] = files
        out["files"]["production_pack.zip"] = f"{base}/production_pack.zip"
        out["primary_glb_url"] = files.get("lod0.glb")
        out["fbx_url"] = files.get("character_ue5.fbx")
        out["pack_zip_url"] = f"{base}/production_pack.zip"
        out["lookdev_url"] = files.get("lookdev.png")
        out["rig_preview_url"] = files.get("rig_preview.png")

        enriched_tex: list[dict[str, str]] = []
        for card in out.get("texture_maps", []):
            c = dict(card)
            fn = c.get("filename", "")
            if fn in files:
                c["url"] = files[fn]
                enriched_tex.append(c)
        out["texture_maps"] = enriched_tex

        for lod_entry in out.get("lod_chain", []):
            fname = lod_entry.get("filename")
            if fname in files:
                lod_entry["url"] = files[fname]
        return out
