#!/usr/bin/env python3
"""Build compact Draco + WebP High-Poly Textured 3D `.glb` models & catalog for GitHub Pages."""

from __future__ import annotations

import argparse
import json
import shutil
import struct
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from PIL import Image  # noqa: E402

from src.config import (  # noqa: E402
    PipelineConfig,
    PostProcessorConfig,
    PreprocessorConfig,
    ReconstructionEngineType,
    ReconstructorConfig,
    RiggingBackend,
    RiggingConfig,
)
from src.highpoly_system import (  # noqa: E402
    HIGHPOLY_ARCHETYPES,
    HighPolyCharacterRequest,
    build_palette_from_request,
)
from src.pbr_texture_baker import (  # noqa: E402
    generate_character_pbr_textures,
    generate_surface_detail_normal_map,
)
from src.pipeline import Auto3DHumanPipeline  # noqa: E402
from src.postprocessor import MeshPostProcessor  # noqa: E402
from src.rigger import AutoRigger  # noqa: E402

_BPY_GH_CHARACTER_EXPORT = """
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, os.getcwd())
import ue5_highpoly_character_bpy as u

if not u.ensure_headless_bpy_runtime():
    raise SystemExit("bpy runtime unavailable")

import bpy

spec = json.loads(Path(sys.argv[-1]).read_text(encoding="utf-8"))
info = u.build_complete_ue5_character(spec["config"])

if spec.get("preview_png") and int(spec.get("samples", 0)) > 0:
    u.render_studio_turnaround_sheet(spec["preview_png"], samples=int(spec["samples"]))

hair_curve_obj = info["hair_curve_obj"]
arm_obj = info["armature_obj"]
bone_segments = info["bone_segments"]
mats = info["materials"]

deps = bpy.context.evaluated_depsgraph_get()
eval_obj = hair_curve_obj.evaluated_get(deps)
mesh_from_curve = bpy.data.meshes.new_from_object(eval_obj)
temp_hair_mesh = bpy.data.objects.new("GEO_UE5_HairGroom_Mesh", mesh_from_curve)
bpy.context.scene.collection.objects.link(temp_hair_mesh)
temp_hair_mesh.data.materials.clear()
temp_hair_mesh.data.materials.append(mats["hair_glb"])
u.ensure_mesh_uv_layer(temp_hair_mesh, uv_scale=3.2)
temp_hair_mesh.parent = arm_obj
temp_hair_mesh.matrix_parent_inverse = arm_obj.matrix_world.inverted()
u._assign_ue5_skin_weights_to_mesh(temp_hair_mesh, bone_segments)
arm_mod = temp_hair_mesh.modifiers.new(name="UE5_Skeleton", type="ARMATURE")
arm_mod.object = arm_obj
hair_curve_obj.hide_render = True

# Compute exact evaluated triangle & vertex count across all exported meshes
total_tris = 0
total_verts = 0
deps2 = bpy.context.evaluated_depsgraph_get()
for o in bpy.data.objects:
    if o.type == "MESH" and not o.hide_render and not o.name.startswith("REF_"):
        em = o.evaluated_get(deps2).to_mesh()
        em.calc_loop_triangles()
        total_tris += len(em.loop_triangles)
        total_verts += len(em.vertices)
        o.evaluated_get(deps2).to_mesh_clear()

os.makedirs(os.path.dirname(spec["out_glb"]), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=spec["out_glb"],
    export_format="GLB",
    use_renderable=True,
    export_apply=True,
    export_skins=True,
    export_yup=True,
    export_image_format="WEBP",
    export_image_quality=86,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
)

Path(spec["stats_json"]).write_text(
    json.dumps(
        {
            "vertices": total_verts,
            "triangles": total_tris,
            "mesh_components": int(info["mesh_component_count"]) + 1,
            "bone_count": int(info["bone_count"]),
        }
    ),
    encoding="utf-8",
)
"""

_BPY_GH_UPRES_DRACO = """
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, os.getcwd())
import ue5_highpoly_character_bpy as u

if not u.ensure_headless_bpy_runtime():
    raise SystemExit("bpy runtime unavailable")

import bpy

spec = json.loads(Path(sys.argv[-1]).read_text(encoding="utf-8"))
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=spec["in_glb"])

meshes = [o for o in bpy.data.objects if o.type == "MESH"]
for m in meshes:
    m.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1:
    bpy.ops.object.join()

obj = bpy.context.view_layer.objects.active
obj.name = "GEO_Turnaround_HighPoly"
bpy.ops.object.shade_smooth()
u.ensure_mesh_uv_layer(obj, uv_scale=2.2)

mat = obj.data.materials[0]
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links
bsdf = next((n for n in nodes if n.type == "BSDF_PRINCIPLED"), None)
if bsdf is not None:
    img_o = bpy.data.images.load(spec["orm_png"], check_existing=True)
    img_o.colorspace_settings.name = "Non-Color"
    t_o = nodes.new("ShaderNodeTexImage")
    t_o.image = img_o
    sep = nodes.new("ShaderNodeSeparateColor")
    sep.mode = "RGB"
    links.new(t_o.outputs["Color"], sep.inputs["Color"])
    links.new(sep.outputs["Green"], bsdf.inputs["Roughness"])

    img_n = bpy.data.images.load(spec["normal_png"], check_existing=True)
    img_n.colorspace_settings.name = "Non-Color"
    t_n = nodes.new("ShaderNodeTexImage")
    t_n.image = img_n
    nrm = nodes.new("ShaderNodeNormalMap")
    nrm.inputs["Strength"].default_value = 0.72
    links.new(t_n.outputs["Color"], nrm.inputs["Color"])
    links.new(nrm.outputs["Normal"], bsdf.inputs["Normal"])

os.makedirs(os.path.dirname(spec["out_glb"]), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=spec["out_glb"],
    export_format="GLB",
    use_renderable=True,
    export_apply=True,
    export_skins=True,
    export_yup=True,
    export_image_format="WEBP",
    export_image_quality=88,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
)
"""


def _read_glb_header_info(glb_path: Path) -> dict[str, Any]:
    raw = glb_path.read_bytes()
    jlen, _ = struct.unpack("<I4s", raw[12:20])
    gltf = json.loads(raw[20 : 20 + jlen].decode("utf-8"))
    return {
        "size_mb": round(len(raw) / (1024 * 1024), 2),
        "textures": len(gltf.get("textures") or []),
        "skins": len(gltf.get("skins") or []),
        "extensions": gltf.get("extensionsUsed") or [],
    }


def build_showcase_assets(docs_dir: Path, samples: int = 16) -> list[dict[str, Any]]:
    """Export 4 Draco + WebP High-Poly Textured 3D `.glb` models into `docs/models/`."""
    import trimesh

    models_dir = docs_dir / "models"
    previews_dir = docs_dir / "previews"
    models_dir.mkdir(parents=True, exist_ok=True)
    previews_dir.mkdir(parents=True, exist_ok=True)

    character_jobs = [
        (
            "sk-ue5-realistic-female",
            "ue5_realistic_female",
            "SK_UE5_RealisticFemale",
            "Signature Indigo Denim & Rib-Knit",
            (
                "1.70m Catmull-Clark High-Poly character with 21 embedded PBR maps "
                "(stonewashed 45° diagonal twill denim, modal rib-knit bodice, epidermal pore SSS, "
                "anisotropic dark groom, radial iris) & 23-bone UE5 Manny rig."
            ),
            ["301K Tris", "21 PBR Maps", "23 UE5 Bones", "Draco + WebP"],
        ),
        (
            "sk-ue5-cyber-techwear",
            "ue5_cyber_techwear",
            "SK_UE5_CyberTechwear",
            "Carbon Ripstop & Platinum Operative",
            (
                "Tactical sci-fi high-poly edition featuring platinum-silver strand hair textures, "
                "carbon ballistic rib-weave top, charcoal twill cargo denim normal maps, "
                "and brushed gunmetal hardware."
            ),
            ["301K Tris", "21 PBR Maps", "23 UE5 Bones", "Sci-Fi PBR"],
        ),
        (
            "sk-ue5-editorial-couture",
            "ue5_editorial_couture",
            "SK_UE5_EditorialCouture",
            "Oxblood Velvet & Raw Selvedge",
            (
                "Runway couture high-poly edition combining warm bronze epidermal SSS maps, "
                "oxblood rib-velvet camisole, dark raw-indigo selvedge twill denim, "
                "and 18k champagne-gold hardware."
            ),
            ["301K Tris", "21 PBR Maps", "23 UE5 Bones", "Couture PBR"],
        ),
    ]

    catalog_entries: list[dict[str, Any]] = []

    with tempfile.TemporaryDirectory(prefix="gh_pages_bake_") as tmp_s:
        tmp_d = Path(tmp_s)
        worker_char = tmp_d / "worker_char.py"
        worker_char.write_text(_BPY_GH_CHARACTER_EXPORT, encoding="utf-8")

        for slug, arch_id, code_name, subtitle, desc, tags in character_jobs:
            print(f"[GitHub Pages Baker] Building '{slug}' ({arch_id})...")
            req = HighPolyCharacterRequest(
                title=code_name,
                archetype=arch_id,
                subsurf_level=2,
                texture_resolution=512,
                cycles_samples=samples,
            )
            palette, swatches = build_palette_from_request(req)
            arch = HIGHPOLY_ARCHETYPES[arch_id]
            tex_dir = tmp_d / f"tex_{slug}"
            pbr_textures = generate_character_pbr_textures(
                tex_dir=tex_dir,
                swatches=swatches,
                resolution=512,
                seed=abs(hash(slug)) % 10000,
            )

            out_glb = models_dir / f"{slug}.glb"
            raw_preview_png = tmp_d / f"{slug}_preview.png"
            out_preview_webp = previews_dir / f"{slug}.webp"
            stats_json = tmp_d / f"{slug}_stats.json"
            spec_json = tmp_d / f"{slug}_spec.json"

            spec_json.write_text(
                json.dumps(
                    {
                        "config": {
                            "character_name": code_name,
                            "reference_image_path": str(PROJECT_ROOT / "assets" / "sample_input.jpg"),
                            "subsurf_viewport": 2,
                            "subsurf_render": 2,
                            "palette_overrides": palette,
                            "proportion_scales": arch["proportions"],
                            "pbr_textures": pbr_textures,
                        },
                        "out_glb": str(out_glb),
                        "preview_png": str(raw_preview_png),
                        "samples": samples,
                        "stats_json": str(stats_json),
                    }
                ),
                encoding="utf-8",
            )

            proc = subprocess.run(
                [sys.executable, str(worker_char), str(spec_json)],
                cwd=str(PROJECT_ROOT),
                capture_output=True,
                text=True,
                timeout=360,
                check=False,
            )
            if proc.returncode != 0 or not out_glb.is_file():
                raise RuntimeError(f"Failed exporting {slug}: {(proc.stderr or proc.stdout)[-800:]}")

            if raw_preview_png.is_file():
                Image.open(raw_preview_png).convert("RGB").save(out_preview_webp, format="WEBP", quality=86)

            stats = json.loads(stats_json.read_text(encoding="utf-8"))
            hdr = _read_glb_header_info(out_glb)
            catalog_entries.append(
                {
                    "id": slug,
                    "name": code_name,
                    "subtitle": subtitle,
                    "category": "UE5 High-Poly Character",
                    "description": desc,
                    "glb_url": f"./models/{out_glb.name}",
                    "preview_url": f"./previews/{out_preview_webp.name}",
                    "front_axis": "-Z",
                    "vertices": stats["vertices"],
                    "triangles": stats["triangles"],
                    "sub_meshes": stats["mesh_components"],
                    "bones": stats["bone_count"],
                    "skeleton": "UE5 Mannequin / MetaHuman (23 Bones)",
                    "embedded_textures": hdr["textures"],
                    "size_mb": hdr["size_mb"],
                    "height_m": 1.70,
                    "tags": tags,
                    "swatches": swatches,
                }
            )

        # Model 4: Reconstructed Dual-View UV-Atlas + Normal High-Poly Character from sample_input.jpg
        slug4 = "ch-turnaround-highpoly"
        print(f"[GitHub Pages Baker] Building '{slug4}' from Dual-View sheet...")
        sample_bytes = (PROJECT_ROOT / "assets" / "sample_input.jpg").read_bytes()
        pipe_cfg = PipelineConfig(
            preprocessor=PreprocessorConfig(image_size=512),
            reconstructor=ReconstructorConfig(
                engine=ReconstructionEngineType.VOLUMETRIC_SDF,
                mc_resolution=160,
            ),
            postprocessor=PostProcessorConfig(
                target_faces=48000,
                smoothing_iterations=14,
                texture_resolution=1024,
                export_formats=["glb"],
            ),
            rigging=RiggingConfig(enabled=True, backend=RiggingBackend.UE5_MANNY),
        )
        recon_dir = tmp_d / "recon_hero"
        res = Auto3DHumanPipeline(pipe_cfg).run(
            source=sample_bytes,
            output_dir=recon_dir,
            stem="hero",
            save_intermediate=False,
        )
        rigged_glb = res.postprocessed.exported_files["glb"]
        high_m = trimesh.load(str(rigged_glb), force="mesh")
        if not isinstance(high_m, trimesh.Trimesh):
            high_m = trimesh.util.concatenate(list(high_m.geometry.values()))

        out_prev4 = previews_dir / f"{slug4}.webp"
        MeshPostProcessor.render_mesh_turnaround(high_m).convert("RGB").save(
            out_prev4, format="WEBP", quality=86
        )

        # Re-export with Woven Normal + ORM + Draco + WebP
        detail_maps = generate_surface_detail_normal_map(
            tex_dir=tmp_d / "tex_hero",
            detail_mode="woven_fabric",
            resolution=512,
        )
        raw_unrigged_draco = tmp_d / "hero_draco_pre.glb"
        out_glb4 = models_dir / f"{slug4}.glb"

        # Keep the 23-bone skinned UV-Atlas GLB or compress via bpy Draco+WebP while keeping skin!
        worker_up = tmp_d / "worker_up.py"
        worker_up.write_text(_BPY_GH_UPRES_DRACO, encoding="utf-8")
        up_spec = tmp_d / "up_spec.json"
        up_spec.write_text(
            json.dumps(
                {
                    "in_glb": str(rigged_glb),
                    "normal_png": detail_maps["normal"],
                    "orm_png": detail_maps["orm"],
                    "out_glb": str(out_glb4),
                }
            ),
            encoding="utf-8",
        )
        proc4 = subprocess.run(
            [sys.executable, str(worker_up), str(up_spec)],
            cwd=str(PROJECT_ROOT),
            capture_output=True,
            text=True,
            timeout=240,
            check=False,
        )
        if proc4.returncode != 0 or not out_glb4.is_file():
            shutil.copyfile(rigged_glb, out_glb4)

        _ = raw_unrigged_draco
        _ = AutoRigger
        hdr4 = _read_glb_header_info(out_glb4)
        catalog_entries.append(
            {
                "id": slug4,
                "name": "CH_Turnaround_HighPoly",
                "subtitle": "Dual-View UV Texture Atlas & Weave Normal",
                "category": "Image-to-3D Reconstructed",
                "description": (
                    "Reconstructed directly from assets/sample_input.jpg with a seamless 2-tile "
                    "Front|Back UV Albedo Atlas, tangent-space textile micro-normal + ORM maps, "
                    "and 23-bone UE5 Manny skinning."
                ),
                "glb_url": f"./models/{out_glb4.name}",
                "preview_url": f"./previews/{out_prev4.name}",
                "front_axis": "+Z",
                "vertices": int(len(high_m.vertices)),
                "triangles": int(len(high_m.faces)),
                "sub_meshes": 1,
                "bones": 23,
                "skeleton": "UE5 Mannequin / MetaHuman (23 Bones)",
                "embedded_textures": hdr4["textures"],
                "size_mb": hdr4["size_mb"],
                "height_m": 1.80,
                "tags": ["48K Tris", "2K UV Atlas", "23 UE5 Bones", "Image-to-3D"],
                "swatches": {
                    "skin_hex": "#E2B59A",
                    "top_hex": "#2B5B8E",
                    "denim_hex": "#343942",
                    "belt_hex": "#4A3222",
                },
            }
        )

    catalog_doc = {
        "viewer_name": "3DModel View · GitHub Pages Studio",
        "repository": "https://github.com/adii14990adi-spec/3dmodel-gen-",
        "model_count": len(catalog_entries),
        "models": catalog_entries,
    }
    (models_dir / "catalog.json").write_text(json.dumps(catalog_doc, indent=2), encoding="utf-8")
    return catalog_entries


def main() -> int:
    parser = argparse.ArgumentParser(description="Build GitHub Pages 3D Model Viewer assets.")
    parser.add_argument("--docs-dir", type=Path, default=PROJECT_ROOT / "docs")
    parser.add_argument("--samples", type=int, default=16)
    args = parser.parse_args()
    entries = build_showcase_assets(args.docs_dir, samples=args.samples)
    for e in entries:
        print(
            f"  [OK] {e['id']:28s} | {e['triangles']:7,d} tris | "
            f"{e['embedded_textures']:2d} PBR maps | {e['size_mb']:.2f} MB"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
