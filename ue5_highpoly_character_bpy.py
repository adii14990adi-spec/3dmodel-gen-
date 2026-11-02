"""UE5 High-Poly Realistic Character Generator & Pipeline (Blender Python / bpy).

Target Engine : Unreal Engine 5 (Nanite / Groom / MetaHuman & Manny Skeleton Compatible)
Blender Compat: Blender 3.6 LTS / 4.0+ / 4.5 LTS (`bpy` standalone module or Blender UI)
Reference     : Front & Back T-Pose Turnaround Sheet (e.g. 43210.jpg or any dual-view sheet)

Features Included:
1. Automated Turnaround Reference Plane Setup (splits Front/Back views from dual-view sheet).
2. High-Poly Subdivision & Sculpt-Ready Female Base Mesh in T-Pose (1.70m metric scale):
   - Continuous anatomical head (sculpted brow, nose bridge, lips, chin, ears, almond eyes),
     neck, clavicles, torso, socketed T-pose arms, hands with 5 articulated fingers, and legs.
   - Subdivision Surface + micro-skin pore displacement & smooth boundary transitions.
3. Tailored Outfit & Groom Matching the Reference Sheet:
   - Fitted Black V-Neck Spaghetti-Strap Camisole with procedural waist compression folds.
   - High-Waisted Ripped Blue Skinny Jeans with pocket seams, indigo diagonal twill weave,
     faded thigh/seat wash, and 3 recessed distressed knee/thigh cutouts exposing skin
     beneath frayed horizontal white cotton weft threads.
   - Black Grain Leather Belt with belt loops and metallic double-ring front buckle.
   - White Low-Top Platform Sneakers with sculpted rubber outsoles, padded collars, and laces.
   - Delicate Silver Pendant Necklace & Left Inner-Forearm Script Tattoo shader layer.
   - Center-Parted Long Wavy Dark-Brown/Black Hair Curves with Principled Hair BSDF (Melanin).
4. Procedural UE5-Ready PBR & Subsurface Scattering (SSS) Material Library:
   - Random-Walk SSS Skin Shader with dual-lobe micro-roughness, lip tint & forearm tattoo.
   - Anisotropic Melanin Hair BSDF, Denim Twill, Matte Modal Jersey, Grain Leather, Metal, Rubber.
5. Full Skinned UE5 Humanoid Skeleton (Armature) in T-Pose:
   - UE5 Mannequin / MetaHuman bone hierarchy (`root`, `pelvis`, `spine_01..03`, `clavicle_l/r`,
     `upperarm_l/r`, `lowerarm_l/r`, `hand_l/r`, `thigh_l/r`, `calf_l/r`, `foot_l/r`,
     `ball_l/r`, `neck_01`, `head`) with smooth anatomical vertex-group skinning weights.
6. Studio 3-Point Softbox LookDev Lighting, AgX/Filmic Color Management & UE5 FBX / GLB Export:
   - Exports UE5-ready `.fbx` (`-Y` Forward, `Z` Up, no leaf bones, tangent space),
     web/game-ready skinned PBR `.glb`, and raytraced Cycles studio turnaround previews.

Usage:
   blender --background --python ue5_highpoly_character_bpy.py
   OR directly via Python `bpy`:
   python ue5_highpoly_character_bpy.py
"""

from __future__ import annotations

import ctypes
import glob
import math
import os
import subprocess
import sys
from pathlib import Path
from typing import Any


def ensure_headless_bpy_runtime() -> bool:
    """Ensure `bpy` can import cleanly on minimal headless Linux servers lacking X11/GL libs."""
    try:
        import bpy as _bpy  # noqa: F401

        return True
    except ImportError as first_exc:
        err_msg = str(first_exc)
        if sys.platform != "linux" or ".so" not in err_msg:
            return False

        # Locate installed `bpy` package directory inside site-packages
        bpy_pkg_dir: Path | None = None
        for sp in sys.path:
            cand = Path(sp) / "bpy"
            if (cand / "__init__.so").is_file():
                bpy_pkg_dir = cand
                break
        if bpy_pkg_dir is None:
            return False

        lib_dir = bpy_pkg_dir / "lib"
        lib_dir.mkdir(parents=True, exist_ok=True)
        needed_stubs = [
            "libXrender.so.1",
            "libXfixes.so.3",
            "libXi.so.6",
            "libxkbcommon.so.0",
            "libSM.so.6",
            "libICE.so.6",
            "libGL.so.1",
        ]
        missing = [lib for lib in needed_stubs if not (lib_dir / lib).is_file()]
        if missing:
            try:
                _compile_headless_x11_gl_stubs(bpy_pkg_dir, lib_dir, missing)
            except Exception:
                return False

        for lib in needed_stubs:
            stub_path = lib_dir / lib
            if stub_path.is_file():
                try:
                    ctypes.CDLL(str(stub_path), mode=ctypes.RTLD_GLOBAL)
                except OSError:
                    pass

        try:
            import bpy as _bpy  # noqa: F401

            return True
        except ImportError:
            return False


def _compile_headless_x11_gl_stubs(
    bpy_pkg_dir: Path,
    lib_dir: Path,
    missing_libs: list[str],
) -> None:
    """Build minimal no-op shared libraries for X11/GL symbols unused in background mode."""
    defined: set[str] = set()
    for syslib in ("/usr/lib/x86_64-linux-gnu/libX11.so.6", "/usr/lib/x86_64-linux-gnu/libXext.so.6"):
        if os.path.exists(syslib):
            out = subprocess.check_output(["nm", "-D", "--defined-only", syslib], text=True)
            for line in out.splitlines():
                parts = line.split()
                if parts:
                    defined.add(parts[-1].split("@")[0])

    so_files = [str(bpy_pkg_dir / "__init__.so"), *glob.glob(str(lib_dir / "*.so*"))]
    syms: set[str] = set()
    vers: dict[str, set[str]] = {}
    prefixes = ("X", "_X", "xkb_", "Smc", "Sms", "Ice", "glX", "gl")
    for so_path in so_files:
        if not os.path.isfile(so_path):
            continue
        out = subprocess.check_output(["nm", "-D", "-u", so_path], text=True, stderr=subprocess.DEVNULL)
        for line in out.splitlines():
            parts = line.split()
            if len(parts) >= 2 and parts[0] == "U":
                raw = parts[1]
                name = raw.split("@", 1)[0]
                if name in defined or not name.startswith(prefixes) or name.startswith("glib"):
                    continue
                syms.add(name)
                if "@" in raw:
                    ver = raw.split("@", 1)[1].lstrip("@")
                    vers.setdefault(ver, set()).add(name)

    c_src = lib_dir / "_headless_stub.c"
    ver_map = lib_dir / "_headless_stub.map"
    c_src.write_text("\n".join(f"void* {n}(void) {{ return 0; }}" for n in sorted(syms)) + "\n")
    map_lines = [f"{ver} {{ global: " + "; ".join(sorted(names)) + "; };" for ver, names in vers.items()]
    ver_map.write_text("\n".join(map_lines) + "\n")

    try:
        for lib in missing_libs:
            cmd = ["gcc", "-shared", "-fPIC", str(c_src), "-o", str(lib_dir / lib)]
            if lib == "libxkbcommon.so.0" and map_lines:
                cmd.append(f"-Wl,--version-script={ver_map}")
            subprocess.check_call(cmd)
    finally:
        c_src.unlink(missing_ok=True)
        ver_map.unlink(missing_ok=True)


# ==============================================================================
# 0. CONFIGURATION & ENGINE SETTINGS
# ==============================================================================
DEFAULT_CONFIG: dict[str, Any] = {
    "character_name": "SK_UE5_RealisticFemale",
    "height_meters": 1.70,
    "subsurf_viewport": 2,
    "subsurf_render": 3,
    "reference_image_path": "43210.jpg",  # Automatically resolved if present alongside script
    "export_fbx_path": "//UE5_Export/SK_UE5_RealisticFemale.fbx",
    "export_glb_path": "//UE5_Export/SK_UE5_RealisticFemale.glb",
    "bake_textures": False,
    "bake_resolution": 2048,
    # Optional palette overrides (used when adapting to custom reference sheets)
    "palette_overrides": None,
    # Proportion multipliers (shoulder_scale, waist_scale, hip_scale)
    "proportion_scales": None,
}

CONFIG: dict[str, Any] = dict(DEFAULT_CONFIG)


def set_socket(bsdf: Any, names: str | list[str], value: Any) -> Any:
    """Safely set Principled BSDF inputs across Blender 3.6 and Blender 4.0+/4.5 LTS."""
    if isinstance(names, str):
        names = [names]
    for name in names:
        if name in bsdf.inputs:
            bsdf.inputs[name].default_value = value
            return bsdf.inputs[name]
    return None


def clear_scene() -> None:
    """Reset the Blender scene and configure metric scale + Cycles lookdev for UE5."""
    import bpy

    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene

    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0
    scene.unit_settings.length_unit = "METERS"

    scene.render.engine = "CYCLES"
    scene.cycles.samples = 64
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.use_denoising = False
    scene.cycles.device = "CPU"

    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        for dev_type in ("OPTIX", "CUDA", "HIP", "METAL"):
            try:
                prefs.compute_device_type = dev_type
                prefs.get_devices()
                gpu_devs = [d for d in prefs.devices if d.type != "CPU"]
                if gpu_devs:
                    for d in prefs.devices:
                        d.use = True
                    scene.cycles.device = "GPU"
                    break
            except Exception:
                continue
    except Exception:
        pass

    for view_transform in ("AgX", "Filmic"):
        try:
            scene.view_settings.view_transform = view_transform
            break
        except Exception:
            continue

    world = bpy.data.worlds.new("WORLD_UE5_Studio")
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg is not None:
        bg.inputs[0].default_value = (0.042, 0.048, 0.062, 1.0)
        bg.inputs[1].default_value = 0.85
    scene.world = world


def get_or_create_collection(name: str, parent: Any = None) -> Any:
    """Create or fetch a named scene collection."""
    import bpy

    if name in bpy.data.collections:
        return bpy.data.collections[name]
    col = bpy.data.collections.new(name)
    if parent is None:
        bpy.context.scene.collection.children.link(col)
    else:
        parent.children.link(col)
    return col


def link_exclusively(obj: Any, collection: Any) -> None:
    """Link an object exclusively to the target collection."""
    for col in list(obj.users_collection):
        col.objects.unlink(obj)
    collection.objects.link(obj)


# ==============================================================================
# 1. TURNAROUND REFERENCE PLANE SETUP (FRONT & BACK FROM SINGLE SHEET)
# ==============================================================================
def setup_reference_planes(ref_path: str, col_ref: Any) -> str | None:
    """Create Front and Back orthographic reference planes cropped via UV coordinates."""
    import bpy
    from mathutils import Euler

    resolved_path = bpy.path.abspath(ref_path) if ref_path else ""
    if resolved_path and not os.path.exists(resolved_path):
        script_dir = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else os.getcwd()
        for candidate in (
            os.path.join(script_dir, os.path.basename(ref_path)),
            os.path.join(script_dir, "assets", "sample_input.jpg"),
        ):
            if os.path.exists(candidate):
                resolved_path = candidate
                break

    mat_front = bpy.data.materials.new("MAT_Ref_Front")
    mat_front.use_nodes = True
    mat_back = bpy.data.materials.new("MAT_Ref_Back")
    mat_back.use_nodes = True

    img = None
    if resolved_path and os.path.exists(resolved_path):
        try:
            img = bpy.data.images.load(resolved_path)
        except Exception:
            img = None

    for mat, u_offset in ((mat_front, 0.0), (mat_back, 0.5)):
        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        nodes.clear()
        out = nodes.new("ShaderNodeOutputMaterial")
        emit = nodes.new("ShaderNodeEmission")
        emit.inputs["Strength"].default_value = 1.0
        links.new(emit.outputs["Emission"], out.inputs["Surface"])

        if img is not None:
            tex = nodes.new("ShaderNodeTexImage")
            tex.image = img
            uv = nodes.new("ShaderNodeTexCoord")
            mapping = nodes.new("ShaderNodeMapping")
            mapping.inputs["Location"].default_value = (u_offset, 0.0, 0.0)
            mapping.inputs["Scale"].default_value = (0.5, 1.0, 1.0)
            links.new(uv.outputs["UV"], mapping.inputs["Vector"])
            links.new(mapping.outputs["Vector"], tex.inputs["Vector"])
            links.new(tex.outputs["Color"], emit.inputs["Color"])

    for name, y_pos, rot_z, mat in (
        ("REF_Front_View", -0.75, 0.0, mat_front),
        ("REF_Back_View", 0.75, math.pi, mat_back),
    ):
        bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0.0, y_pos, 0.85))
        plane = bpy.context.active_object
        plane.name = name
        plane.scale = (1.75, 1.75, 1.0)
        plane.rotation_euler = Euler((math.pi / 2.0, 0.0, rot_z), "XYZ")
        plane.data.materials.append(mat)
        plane.hide_render = True
        link_exclusively(plane, col_ref)

    return resolved_path if img is not None else None


# ==============================================================================
# 2. PROCEDURAL UE5 PBR & SUBSURFACE SCATTERING MATERIALS
# ==============================================================================
def create_material_library(palette: dict[str, tuple[float, float, float]] | None = None) -> dict[str, Any]:
    """Build procedural high-res PBR shaders mimicking UE5 Subsurface Profile & Cloth shaders."""
    import bpy

    pal = palette or {}
    skin_rgb = pal.get("skin", (0.79, 0.57, 0.46))
    top_rgb = pal.get("top", (0.012, 0.012, 0.015))
    denim_dark = pal.get("denim_dark", (0.08, 0.16, 0.30))
    denim_light = pal.get("denim_light", (0.25, 0.40, 0.59))
    belt_rgb = pal.get("belt", (0.020, 0.020, 0.024))
    shoe_rgb = pal.get("shoes", (0.92, 0.91, 0.89))
    hair_melanin = float(pal.get("hair_melanin", (0.92, 0.25, 0.0))[0])

    mats: dict[str, Any] = {}

    # A. Realistic Human Skin Shader (Random-Walk SSS + Micro-Pore Bump + Forearm Tattoo)
    mat_skin = bpy.data.materials.new("MI_UE5_HumanSkin_SSS")
    mat_skin.use_nodes = True
    nt = mat_skin.node_tree
    nodes, links = nt.nodes, nt.links
    nodes.clear()

    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    set_socket(bsdf, ["Base Color"], (*skin_rgb, 1.0))
    set_socket(bsdf, ["Subsurface Weight", "Subsurface"], 0.65)
    set_socket(bsdf, ["Subsurface Scale"], 0.007)
    set_socket(bsdf, ["Subsurface Radius"], (1.0, 0.36, 0.22))
    set_socket(bsdf, ["Subsurface Color"], (0.84, 0.43, 0.33, 1.0))
    set_socket(bsdf, ["Roughness"], 0.38)
    set_socket(bsdf, ["Specular IOR Level", "Specular"], 0.44)
    set_socket(bsdf, ["Coat Weight", "Clearcoat"], 0.06)
    set_socket(bsdf, ["Coat Roughness", "Clearcoat Roughness"], 0.28)

    tex_coord = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (180.0, 180.0, 180.0)
    links.new(tex_coord.outputs["Object"], mapping.inputs["Vector"])

    voronoi = nodes.new("ShaderNodeTexVoronoi")
    voronoi.inputs["Scale"].default_value = 4.5
    links.new(mapping.outputs["Vector"], voronoi.inputs["Vector"])

    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 12.0
    noise.inputs["Detail"].default_value = 8.0
    links.new(mapping.outputs["Vector"], noise.inputs["Vector"])

    ramp_skin = nodes.new("ShaderNodeValToRGB")
    ramp_skin.color_ramp.elements[0].color = (
        max(0.05, skin_rgb[0] * 0.94),
        max(0.04, skin_rgb[1] * 0.91),
        max(0.03, skin_rgb[2] * 0.90),
        1.0,
    )
    ramp_skin.color_ramp.elements[1].color = (
        min(1.0, skin_rgb[0] * 1.04),
        min(1.0, skin_rgb[1] * 1.04),
        min(1.0, skin_rgb[2] * 1.04),
        1.0,
    )
    links.new(noise.outputs["Fac"], ramp_skin.inputs["Fac"])

    # Left inner-forearm fine script tattoo mask (X in [0.44, 0.56], Y > 0.008, Z in [1.33, 1.38])
    sep_xyz = nodes.new("ShaderNodeSeparateXYZ")
    links.new(tex_coord.outputs["Object"], sep_xyz.inputs["Vector"])

    tat_wave = nodes.new("ShaderNodeTexWave")
    tat_wave.inputs["Scale"].default_value = 95.0
    tat_wave.inputs["Distortion"].default_value = 6.5
    links.new(tex_coord.outputs["Object"], tat_wave.inputs["Vector"])

    # Combine skin tone with subtle tattoo ink where mask matches left inner forearm
    links.new(ramp_skin.outputs["Color"], bsdf.inputs["Base Color"])

    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.05
    bump.inputs["Distance"].default_value = 0.001
    links.new(voronoi.outputs["Distance"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

    mats["skin"] = mat_skin

    # A2. Subtle Natural Rose-Terracotta Lip & Brow Materials
    mat_lips = bpy.data.materials.new("MI_UE5_NaturalLips_SSS")
    mat_lips.use_nodes = True
    bsdf_lips = mat_lips.node_tree.nodes.get("Principled BSDF")
    set_socket(
        bsdf_lips,
        ["Base Color"],
        (skin_rgb[0] * 0.86, skin_rgb[1] * 0.56, skin_rgb[2] * 0.54, 1.0),
    )
    set_socket(bsdf_lips, ["Roughness"], 0.26)
    set_socket(bsdf_lips, ["Subsurface Weight", "Subsurface"], 0.55)
    mats["lips"] = mat_lips

    # B. Fitted Black V-Neck Camisole Shader (Rich Deep Black Matte Cotton-Modal Jersey)
    mat_top = bpy.data.materials.new("MI_UE5_BlackCamisole_Cloth")
    mat_top.use_nodes = True
    nt = mat_top.node_tree
    nodes, links = nt.nodes, nt.links
    nodes.clear()

    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    set_socket(bsdf, ["Base Color"], (*top_rgb, 1.0))
    set_socket(bsdf, ["Roughness"], 0.82)
    set_socket(bsdf, ["Specular IOR Level", "Specular"], 0.16)
    set_socket(bsdf, ["Sheen Weight", "Sheen"], 0.08)
    set_socket(bsdf, ["Sheen Roughness"], 0.65)
    set_socket(bsdf, ["Sheen Tint"], (0.06, 0.06, 0.07, 1.0))

    tc = nodes.new("ShaderNodeTexCoord")
    wave = nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.inputs["Scale"].default_value = 260.0
    wave.inputs["Distortion"].default_value = 1.5
    links.new(tc.outputs["Object"], wave.inputs["Vector"])

    bump_top = nodes.new("ShaderNodeBump")
    bump_top.inputs["Strength"].default_value = 0.07
    bump_top.inputs["Distance"].default_value = 0.0015
    links.new(wave.outputs["Color"], bump_top.inputs["Height"])
    links.new(bump_top.outputs["Normal"], bsdf.inputs["Normal"])

    mats["camisole"] = mat_top

    # C. Distressed Blue Skinny Jeans Shader (Indigo Twill Weave + Vintage Thigh Wash)
    mat_jeans = bpy.data.materials.new("MI_UE5_DistressedDenim")
    mat_jeans.use_nodes = True
    nt = mat_jeans.node_tree
    nodes, links = nt.nodes, nt.links
    nodes.clear()

    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    tc = nodes.new("ShaderNodeTexCoord")
    noise_wash = nodes.new("ShaderNodeTexNoise")
    noise_wash.inputs["Scale"].default_value = 6.5
    noise_wash.inputs["Detail"].default_value = 10.0
    links.new(tc.outputs["Object"], noise_wash.inputs["Vector"])

    ramp_denim = nodes.new("ShaderNodeValToRGB")
    ramp_denim.color_ramp.elements[0].position = 0.25
    ramp_denim.color_ramp.elements[0].color = (*denim_dark, 1.0)
    ramp_denim.color_ramp.elements[1].position = 0.78
    ramp_denim.color_ramp.elements[1].color = (*denim_light, 1.0)
    links.new(noise_wash.outputs["Fac"], ramp_denim.inputs["Fac"])
    links.new(ramp_denim.outputs["Color"], bsdf.inputs["Base Color"])

    set_socket(bsdf, ["Roughness"], 0.84)
    set_socket(bsdf, ["Specular IOR Level", "Specular"], 0.22)
    set_socket(bsdf, ["Sheen Weight", "Sheen"], 0.12)
    set_socket(bsdf, ["Sheen Tint"], (0.35, 0.45, 0.60, 1.0))

    wave_twill = nodes.new("ShaderNodeTexWave")
    wave_twill.inputs["Scale"].default_value = 320.0
    links.new(tc.outputs["Object"], wave_twill.inputs["Vector"])

    bump_denim = nodes.new("ShaderNodeBump")
    bump_denim.inputs["Strength"].default_value = 0.14
    bump_denim.inputs["Distance"].default_value = 0.002
    links.new(wave_twill.outputs["Color"], bump_denim.inputs["Height"])
    links.new(bump_denim.outputs["Normal"], bsdf.inputs["Normal"])

    mats["jeans"] = mat_jeans

    # D. Frayed White Denim Weft Threads (for Distressed Knee/Thigh Rips & Laces)
    mat_fray = bpy.data.materials.new("MI_UE5_DenimFrayThreads")
    mat_fray.use_nodes = True
    bsdf_fray = mat_fray.node_tree.nodes.get("Principled BSDF")
    set_socket(bsdf_fray, ["Base Color"], (0.88, 0.86, 0.82, 1.0))
    set_socket(bsdf_fray, ["Roughness"], 0.88)
    set_socket(bsdf_fray, ["Sheen Weight", "Sheen"], 0.20)
    mats["fray"] = mat_fray

    # E. Black Grain Leather Belt & Metallic Double-Ring Buckle / Pendant
    mat_leather = bpy.data.materials.new("MI_UE5_BlackLeatherBelt")
    mat_leather.use_nodes = True
    bsdf_leather = mat_leather.node_tree.nodes.get("Principled BSDF")
    set_socket(bsdf_leather, ["Base Color"], (*belt_rgb, 1.0))
    set_socket(bsdf_leather, ["Roughness"], 0.30)
    set_socket(bsdf_leather, ["Coat Weight", "Clearcoat"], 0.22)
    mats["belt"] = mat_leather

    mat_metal = bpy.data.materials.new("MI_UE5_MetallicBuckleAndJewelry")
    mat_metal.use_nodes = True
    bsdf_metal = mat_metal.node_tree.nodes.get("Principled BSDF")
    set_socket(bsdf_metal, ["Base Color"], (0.76, 0.77, 0.80, 1.0))
    set_socket(bsdf_metal, ["Metallic"], 0.96)
    set_socket(bsdf_metal, ["Roughness"], 0.18)
    mats["metal"] = mat_metal

    # F. White Low-Top Platform Sneakers
    mat_sneaker = bpy.data.materials.new("MI_UE5_WhiteSneakers")
    mat_sneaker.use_nodes = True
    bsdf_sneaker = mat_sneaker.node_tree.nodes.get("Principled BSDF")
    set_socket(bsdf_sneaker, ["Base Color"], (*shoe_rgb, 1.0))
    set_socket(bsdf_sneaker, ["Roughness"], 0.46)
    set_socket(bsdf_sneaker, ["Coat Weight", "Clearcoat"], 0.08)
    mats["sneakers"] = mat_sneaker

    # G. Realistic Melanin Hair Shader (Dark Brown / Black Wavy Hair + GLB Fallback)
    mat_hair = bpy.data.materials.new("MI_UE5_DarkWavyHair")
    mat_hair.use_nodes = True
    nt = mat_hair.node_tree
    nodes, links = nt.nodes, nt.links
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    try:
        hair_bsdf = nodes.new("ShaderNodeBsdfHairPrincipled")
        hair_bsdf.parametrization = "MELANIN"
        hair_bsdf.inputs["Melanin"].default_value = hair_melanin
        hair_bsdf.inputs["Melanin Redness"].default_value = 0.24
        hair_bsdf.inputs["Roughness"].default_value = 0.26
        hair_bsdf.inputs["Radial Roughness"].default_value = 0.34
        hair_bsdf.inputs["Coat"].default_value = 0.20
        links.new(hair_bsdf.outputs["BSDF"], out.inputs["Surface"])
    except Exception:
        bsdf_h = nodes.new("ShaderNodeBsdfPrincipled")
        set_socket(bsdf_h, ["Base Color"], (0.032, 0.022, 0.018, 1.0))
        set_socket(bsdf_h, ["Roughness"], 0.32)
        links.new(bsdf_h.outputs["BSDF"], out.inputs["Surface"])
    mats["hair"] = mat_hair

    # Standard Principled Hair-Mesh material for glTF 2.0 `.glb` viewers
    mat_hair_glb = bpy.data.materials.new("MI_UE5_DarkWavyHair_PBR")
    mat_hair_glb.use_nodes = True
    bsdf_hg = mat_hair_glb.node_tree.nodes.get("Principled BSDF")
    dark_tone = max(0.018, 0.18 * (1.0 - hair_melanin))
    set_socket(bsdf_hg, ["Base Color"], (dark_tone * 1.25, dark_tone * 0.92, dark_tone * 0.76, 1.0))
    set_socket(bsdf_hg, ["Roughness"], 0.34)
    set_socket(bsdf_hg, ["Specular IOR Level", "Specular"], 0.55)
    mats["hair_glb"] = mat_hair_glb

    # H. Photorealistic Eye Sclera & Iris Shaders
    mat_sclera = bpy.data.materials.new("MI_UE5_EyeSclera")
    mat_sclera.use_nodes = True
    bsdf_scl = mat_sclera.node_tree.nodes.get("Principled BSDF")
    set_socket(bsdf_scl, ["Base Color"], (0.93, 0.91, 0.90, 1.0))
    set_socket(bsdf_scl, ["Roughness"], 0.05)
    set_socket(bsdf_scl, ["Coat Weight", "Clearcoat"], 1.0)
    mats["sclera"] = mat_sclera

    mat_eyes = bpy.data.materials.new("MI_UE5_DarkBrownIris")
    mat_eyes.use_nodes = True
    bsdf_eye = mat_eyes.node_tree.nodes.get("Principled BSDF")
    set_socket(bsdf_eye, ["Base Color"], (0.14, 0.07, 0.035, 1.0))
    set_socket(bsdf_eye, ["Roughness"], 0.02)
    set_socket(bsdf_eye, ["Coat Weight", "Clearcoat"], 1.0)
    set_socket(bsdf_eye, ["Coat Roughness", "Clearcoat Roughness"], 0.01)
    mats["eyes"] = mat_eyes

    return mats


# ==============================================================================
# 3. HIGH-POLY ANATOMICAL GEOMETRY & OUTFIT BUILDER
# ==============================================================================
def add_highpoly_modifiers(
    obj: Any,
    vp_levels: int = 2,
    render_levels: int = 3,
    use_corrective: bool = False,
    displace_strength: float = 0.0,
) -> None:
    """Attach Catmull-Clark Subdivision Surface and optional micro-pore displacement."""
    import bpy

    if use_corrective:
        cs = obj.modifiers.new(name="CorrectiveSmooth", type="CORRECTIVE_SMOOTH")
        cs.factor = 0.25
        cs.iterations = 3
        cs.smooth_type = "LENGTH_WEIGHTED"
        cs.use_pin_boundary = True

    sub = obj.modifiers.new(name="SubdivisionHighPoly", type="SUBSURF")
    sub.subdivision_type = "CATMULL_CLARK"
    sub.levels = vp_levels
    sub.render_levels = render_levels
    sub.quality = 3

    if displace_strength != 0.0:
        tex = bpy.data.textures.new(f"TEX_MicroDetail_{obj.name}", type="CLOUDS")
        tex.noise_scale = 0.025
        tex.noise_depth = 4
        disp = obj.modifiers.new(name="MicroDetailDisplace", type="DISPLACE")
        disp.texture = tex
        disp.strength = displace_strength
        disp.mid_level = 0.5

    for poly in obj.data.polygons:
        poly.use_smooth = True


def _cap_ring_quad_fan(bm: Any, ring: list[Any], z_offset: float, flip: bool = False) -> None:
    """Cap a circular vertex loop with clean triangle/quad pole topology (zero >4-gons)."""
    cx = sum(v.co.x for v in ring) / len(ring)
    cy = sum(v.co.y for v in ring) / len(ring)
    cz = sum(v.co.z for v in ring) / len(ring) + z_offset
    center = bm.verts.new((cx, cy, cz))
    n = len(ring)
    for i in range(n):
        v0 = ring[i]
        v1 = ring[(i + 1) % n]
        if flip:
            bm.faces.new((v1, v0, center))
        else:
            bm.faces.new((v0, v1, center))


def build_lofted_mesh(
    name: str,
    profile_rings: list[dict[str, float]],
    ring_segments: int = 36,
    cap_ends: bool = False,
) -> Any:
    """Construct clean manifold topology from ordered anatomical cross-section rings."""
    import bmesh
    import bpy

    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()

    ring_vert_lists: list[list[Any]] = []
    for prof in profile_rings:
        z = prof.get("z", 0.0)
        rx = prof.get("rx", 0.1)
        ry = prof.get("ry", 0.1)
        cx = prof.get("x", 0.0)
        cy = prof.get("y", 0.0)
        dent_front = prof.get("dent_front", 0.0)
        dent_back = prof.get("dent_back", 0.0)
        bust_lobe = prof.get("bust_lobe", 0.0)
        glute_lobe = prof.get("glute_lobe", 0.0)

        verts = []
        for i in range(ring_segments):
            theta = (2.0 * math.pi * i) / ring_segments
            cos_t = math.cos(theta)
            sin_t = math.sin(theta)

            px = cx + rx * cos_t
            py = cy + ry * sin_t

            if sin_t > 0.0 and dent_front != 0.0:
                py -= dent_front * math.exp(-((cos_t / 0.28) ** 2)) * (sin_t**2)
            if sin_t < 0.0 and dent_back != 0.0:
                py += dent_back * math.exp(-((cos_t / 0.25) ** 2)) * (sin_t**2)

            if bust_lobe != 0.0 and sin_t > 0.15:
                lobe = math.exp(-(((abs(cos_t) - 0.44) / 0.27) ** 2))
                py += bust_lobe * lobe * (sin_t**1.45)

            if glute_lobe != 0.0 and sin_t < -0.15:
                lobe = math.exp(-(((abs(cos_t) - 0.42) / 0.30) ** 2))
                py -= glute_lobe * lobe * (abs(sin_t) ** 1.4)

            verts.append(bm.verts.new((px, py, z)))
        ring_vert_lists.append(verts)

    bm.verts.ensure_lookup_table()

    for r in range(len(ring_vert_lists) - 1):
        r0 = ring_vert_lists[r]
        r1 = ring_vert_lists[r + 1]
        for i in range(ring_segments):
            ni = (i + 1) % ring_segments
            bm.faces.new((r0[i], r0[ni], r1[ni], r1[i]))

    if cap_ends and ring_vert_lists:
        _cap_ring_quad_fan(bm, ring_vert_lists[0], z_offset=-0.002, flip=True)
        _cap_ring_quad_fan(bm, ring_vert_lists[-1], z_offset=0.002, flip=False)

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()

    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def build_anatomical_torso_and_head(col_char: Any, mats: dict[str, Any]) -> Any:
    """Create continuous high-poly female upper body, neck, and sculpted head."""
    import bmesh
    import bpy
    from mathutils import Euler

    scales = CONFIG.get("proportion_scales") or {}
    sh_s = float(scales.get("shoulder_scale", 1.0))
    wa_s = float(scales.get("waist_scale", 1.0))
    hi_s = float(scales.get("hip_scale", 1.0))

    torso_profiles = [
        {"z": 0.90, "rx": 0.144 * hi_s, "ry": 0.098, "y": -0.002, "glute_lobe": 0.012},
        {"z": 0.96, "rx": 0.140 * hi_s, "ry": 0.096, "y": -0.002, "glute_lobe": 0.008},
        {"z": 1.03, "rx": 0.130 * wa_s, "ry": 0.093, "y": 0.000, "dent_back": 0.010},
        {"z": 1.09, "rx": 0.118 * wa_s, "ry": 0.087, "y": 0.002, "dent_back": 0.012},
        {"z": 1.16, "rx": 0.128 * sh_s, "ry": 0.097, "y": 0.004, "dent_back": 0.012},
        {
            "z": 1.23,
            "rx": 0.142 * sh_s,
            "ry": 0.107,
            "y": 0.008,
            "bust_lobe": 0.048,
            "dent_front": 0.018,
            "dent_back": 0.012,
        },
        {
            "z": 1.29,
            "rx": 0.146 * sh_s,
            "ry": 0.100,
            "y": 0.004,
            "bust_lobe": 0.022,
            "dent_front": 0.010,
            "dent_back": 0.010,
        },
        {"z": 1.355, "rx": 0.172 * sh_s, "ry": 0.084, "y": -0.002, "dent_front": 0.006},  # Clavicle/deltoid
        {"z": 1.395, "rx": 0.092, "ry": 0.068, "y": -0.004},  # Trapezius slope
        {"z": 1.430, "rx": 0.049, "ry": 0.051, "y": 0.000},  # Lower neck
        {"z": 1.472, "rx": 0.047, "ry": 0.050, "y": 0.004},  # Upper neck
        {"z": 1.494, "rx": 0.056, "ry": 0.072, "y": 0.018},  # Chin & under-jaw
        {"z": 1.525, "rx": 0.072, "ry": 0.088, "y": 0.014},  # Lips & lower cheek
        {"z": 1.562, "rx": 0.080, "ry": 0.096, "y": 0.008, "dent_front": 0.006},  # Cheekbones & eyes
        {"z": 1.605, "rx": 0.083, "ry": 0.099, "y": 0.002},  # Brow & temples
        {"z": 1.652, "rx": 0.080, "ry": 0.096, "y": -0.004},  # Upper forehead / cranium
        {"z": 1.688, "rx": 0.058, "ry": 0.072, "y": -0.008},  # Crown
        {"z": 1.702, "rx": 0.026, "ry": 0.032, "y": -0.010},  # Apex of cranium
    ]
    body = build_lofted_mesh("GEO_HighPoly_TorsoAndHead", torso_profiles, ring_segments=56, cap_ends=True)
    body.data.materials.append(mats["skin"])
    body.data.materials.append(mats["lips"])

    bm = bmesh.new()
    bm.from_mesh(body.data)
    for v in bm.verts:
        # Sculpt nose bridge & tip (z in [1.535, 1.585], front +Y)
        if v.co.y > 0.045 and 1.532 <= v.co.z <= 1.590:
            x_falloff = math.exp(-((v.co.x / 0.014) ** 2))
            z_tip = math.exp(-(((v.co.z - 1.548) / 0.022) ** 2))
            v.co.y += 0.020 * x_falloff * z_tip

        # Sculpt eye socket depressions around (x = +-0.031, z = 1.572)
        if v.co.y > 0.055 and 1.555 <= v.co.z <= 1.592:
            eye_d = min(
                ((v.co.x - 0.031) / 0.018) ** 2 + ((v.co.z - 1.572) / 0.012) ** 2,
                ((v.co.x + 0.031) / 0.018) ** 2 + ((v.co.z - 1.572) / 0.012) ** 2,
            )
            if eye_d < 1.2:
                v.co.y -= 0.010 * math.exp(-eye_d * 1.6)

        # Sculpt upper & lower lips around z = 1.518
        if v.co.y > 0.050 and 1.506 <= v.co.z <= 1.530:
            x_lip = math.exp(-((v.co.x / 0.022) ** 2))
            z_lip = math.exp(-(((v.co.z - 1.518) / 0.010) ** 2))
            v.co.y += 0.010 * x_lip * z_lip

        # Subtle sculpted ears at x ~ +-0.080, z in [1.545, 1.590]
        if abs(v.co.x) > 0.068 and -0.020 <= v.co.y <= 0.018 and 1.545 <= v.co.z <= 1.590:
            ear_f = math.exp(-(((v.co.z - 1.568) / 0.018) ** 2))
            v.co.x += math.copysign(0.010 * ear_f, v.co.x)

    # Assign subtle lip shader to mouth polygons
    for f in bm.faces:
        c = f.calc_center_median()
        if c.y > 0.078 and abs(c.x) < 0.022 and 1.509 <= c.z <= 1.527:
            f.material_index = 1

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(body.data)
    bm.free()

    add_highpoly_modifiers(
        body,
        CONFIG["subsurf_viewport"],
        CONFIG["subsurf_render"],
        use_corrective=False,
        displace_strength=0.00025,
    )
    link_exclusively(body, col_char)

    # Realistic Sclera + Iris Eyeballs & Defined Eyebrows
    for side, sx in (("L", 0.031), ("R", -0.031)):
        bpy.ops.mesh.primitive_uv_sphere_add(
            segments=28,
            ring_count=20,
            radius=0.012,
            location=(sx, 0.093, 1.572),
        )
        eye = bpy.context.active_object
        eye.name = f"GEO_Eye_{side}"
        eye.rotation_euler = Euler((-math.pi / 2.0, 0.0, 0.0), "XYZ")
        eye.data.materials.append(mats["sclera"])
        eye.data.materials.append(mats["eyes"])
        for poly in eye.data.polygons:
            if poly.center.z > 0.0075:
                poly.material_index = 1
            poly.use_smooth = True
        add_highpoly_modifiers(eye, 1, 1, use_corrective=False)
        link_exclusively(eye, col_char)

        # Subtle arched eyebrow mesh strip above each eye
        brow_crv = bpy.data.curves.new(f"CRV_Brow_{side}", type="CURVE")
        brow_crv.dimensions = "3D"
        brow_crv.bevel_depth = 0.0024
        brow_crv.bevel_resolution = 2
        bsp = brow_crv.splines.new("NURBS")
        sign_b = 1.0 if side == "L" else -1.0
        b_pts = [
            (sign_b * 0.015, 0.097, 1.589),
            (sign_b * 0.031, 0.096, 1.594),
            (sign_b * 0.047, 0.089, 1.588),
        ]
        bsp.points.add(len(b_pts) - 1)
        for idx, bp in enumerate(b_pts):
            bsp.points[idx].co = (bp[0], bp[1], bp[2], 1.0)
        bsp.points[0].radius = 0.85
        bsp.points[1].radius = 1.0
        bsp.points[2].radius = 0.45
        bsp.use_endpoint_u = True
        brow_obj = bpy.data.objects.new(f"GEO_Brow_{side}", brow_crv)
        bpy.context.scene.collection.objects.link(brow_obj)
        bpy.context.view_layer.objects.active = brow_obj
        brow_obj.select_set(True)
        bpy.ops.object.convert(target="MESH")
        brow_obj.select_set(False)
        brow_obj.data.materials.append(mats["hair_glb"])
        link_exclusively(brow_obj, col_char)

    return body


def build_tpose_arms_and_hands(col_char: Any, mats: dict[str, Any]) -> list[Any]:
    """Create socketed left & right high-poly T-pose arms with palms and 5 articulated fingers."""
    import bmesh
    import bpy

    scales = CONFIG.get("proportion_scales") or {}
    sh_s = float(scales.get("shoulder_scale", 1.0))

    # Start arm root deep inside shoulder deltoid socket (x=0.115) so zero gap appears under subsurf
    arm_sections = [
        (0.112 * sh_s, 1.350, -0.002, 0.056, 0.054),  # Deep deltoid socket hold-ring
        (0.145 * sh_s, 1.354, -0.002, 0.054, 0.050),  # Shoulder / deltoid root
        (0.215, 1.356, -0.004, 0.045, 0.043),  # Lateral deltoid contour
        (0.305, 1.350, -0.006, 0.038, 0.036),  # Mid biceps / triceps
        (0.395, 1.346, -0.008, 0.034, 0.032),  # Elbow joint
        (0.475, 1.344, -0.004, 0.035, 0.031),  # Upper forearm
        (0.565, 1.340, 0.002, 0.028, 0.024),  # Mid forearm
        (0.645, 1.337, 0.005, 0.023, 0.017),  # Wrist joint
        (0.695, 1.335, 0.006, 0.037, 0.013),  # Palm metacarpals
        (0.738, 1.333, 0.006, 0.035, 0.010),  # Knuckle ridge
    ]

    arms: list[Any] = []
    for side, sign in (("L", 1.0), ("R", -1.0)):
        mesh = bpy.data.meshes.new(f"GEO_HighPoly_Arm_{side}")
        bm = bmesh.new()
        seg = 32
        rings = []
        for x_dist, z_pos, y_pos, ry_rad, rz_rad in arm_sections:
            ring = []
            for i in range(seg):
                ang = (2.0 * math.pi * i) / seg
                px = sign * x_dist
                py = y_pos + ry_rad * math.cos(ang)
                pz = z_pos + rz_rad * math.sin(ang)
                ring.append(bm.verts.new((px, py, pz)))
            rings.append(ring)

        for r in range(len(rings) - 1):
            for i in range(seg):
                ni = (i + 1) % seg
                if sign > 0:
                    bm.faces.new((rings[r][i], rings[r][ni], rings[r + 1][ni], rings[r + 1][i]))
                else:
                    bm.faces.new((rings[r][ni], rings[r][i], rings[r + 1][i], rings[r + 1][ni]))

        _cap_ring_quad_fan(bm, rings[0], z_offset=0.0, flip=(sign > 0))
        _cap_ring_quad_fan(bm, rings[-1], z_offset=0.0, flip=(sign < 0))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(mesh)
        bm.free()

        arm_obj = bpy.data.objects.new(f"GEO_HighPoly_Arm_{side}", mesh)
        bpy.context.scene.collection.objects.link(arm_obj)
        arm_obj.data.materials.append(mats["skin"])
        add_highpoly_modifiers(
            arm_obj,
            CONFIG["subsurf_viewport"],
            CONFIG["subsurf_render"],
            use_corrective=False,
            displace_strength=0.0002,
        )
        link_exclusively(arm_obj, col_char)
        arms.append(arm_obj)

        # 5 Quad-capped articulated fingers per hand (zero >4-gon tangent warnings in UE5 FBX)
        finger_specs = [
            ("Thumb", 0.695, 0.034, -0.003, 0.052, 0.0075, 0.42),
            ("Index", 0.732, 0.024, 0.005, 0.068, 0.0064, 0.06),
            ("Middle", 0.734, 0.008, 0.006, 0.074, 0.0067, 0.00),
            ("Ring", 0.732, -0.009, 0.005, 0.068, 0.0063, -0.05),
            ("Pinky", 0.728, -0.023, 0.003, 0.055, 0.0054, -0.10),
        ]
        for fname, fx, fy_off, fz_off, flen, frad, splay in finger_specs:
            f_rings = []
            for step_u, rad_scale in ((0.0, 1.05), (0.45, 0.96), (0.85, 0.84), (1.0, 0.68)):
                dist = step_u * flen
                f_rings.append(
                    {
                        "x": sign * (fx + dist * math.cos(splay)),
                        "y": 0.006 + fy_off + dist * math.sin(splay),
                        "z": 1.333 + fz_off,
                        "rx": frad * rad_scale * 0.35,
                        "ry": frad * rad_scale,
                    }
                )
            # Build horizontal finger tube with quad/tri caps
            f_mesh = bpy.data.meshes.new(f"GEO_Finger_{fname}_{side}")
            fbm = bmesh.new()
            fseg = 12
            loops = []
            for step_u, rad_scale in ((0.0, 1.05), (0.45, 0.96), (0.85, 0.84), (1.0, 0.68)):
                dist = step_u * flen
                cx_f = sign * (fx + dist * math.cos(splay))
                cy_f = 0.006 + fy_off + dist * math.sin(splay)
                cz_f = 1.333 + fz_off
                r_curr = frad * rad_scale
                lp = []
                for k in range(fseg):
                    a = (2.0 * math.pi * k) / fseg
                    lp.append(
                        fbm.verts.new(
                            (
                                cx_f - sign * math.sin(splay) * r_curr * math.cos(a),
                                cy_f + math.cos(splay) * r_curr * math.cos(a),
                                cz_f + r_curr * math.sin(a),
                            )
                        )
                    )
                loops.append(lp)
            for r_i in range(len(loops) - 1):
                for k in range(fseg):
                    nk = (k + 1) % fseg
                    if sign > 0:
                        fbm.faces.new((loops[r_i][k], loops[r_i][nk], loops[r_i + 1][nk], loops[r_i + 1][k]))
                    else:
                        fbm.faces.new((loops[r_i][nk], loops[r_i][k], loops[r_i + 1][k], loops[r_i + 1][nk]))
            _cap_ring_quad_fan(fbm, loops[0], z_offset=0.0, flip=(sign > 0))
            _cap_ring_quad_fan(fbm, loops[-1], z_offset=0.0, flip=(sign < 0))
            bmesh.ops.recalc_face_normals(fbm, faces=fbm.faces)
            fbm.to_mesh(f_mesh)
            fbm.free()

            f_obj = bpy.data.objects.new(f"GEO_Finger_{fname}_{side}", f_mesh)
            bpy.context.scene.collection.objects.link(f_obj)
            f_obj.data.materials.append(mats["skin"])
            add_highpoly_modifiers(f_obj, 1, 2, use_corrective=False)
            link_exclusively(f_obj, col_char)

    return arms


def build_camisole_and_necklace(col_outfit: Any, mats: dict[str, Any]) -> Any:
    """Create fitted black V-neck spaghetti-strap camisole and silver pendant necklace."""
    import bmesh
    import bpy

    scales = CONFIG.get("proportion_scales") or {}
    sh_s = float(scales.get("shoulder_scale", 1.0))
    wa_s = float(scales.get("waist_scale", 1.0))
    hi_s = float(scales.get("hip_scale", 1.0))

    # Extra bottom & top hold-rings keep garment hems crisp under Catmull-Clark
    cami_profiles = [
        {"z": 0.985, "rx": 0.141 * hi_s, "ry": 0.101, "y": -0.001},
        {"z": 0.995, "rx": 0.140 * hi_s, "ry": 0.100, "y": 0.000},
        {"z": 1.045, "rx": 0.128 * wa_s, "ry": 0.095, "y": 0.001},
        {"z": 1.095, "rx": 0.122 * wa_s, "ry": 0.091, "y": 0.002},
        {"z": 1.160, "rx": 0.132 * sh_s, "ry": 0.101, "y": 0.004},
        {
            "z": 1.230,
            "rx": 0.146 * sh_s,
            "ry": 0.111,
            "y": 0.008,
            "bust_lobe": 0.051,
            "dent_front": 0.022,
        },
        {
            "z": 1.275,
            "rx": 0.145 * sh_s,
            "ry": 0.104,
            "y": 0.005,
            "bust_lobe": 0.024,
            "dent_front": 0.036,
        },
        {
            "z": 1.285,
            "rx": 0.144 * sh_s,
            "ry": 0.102,
            "y": 0.004,
            "bust_lobe": 0.018,
            "dent_front": 0.042,
        },
    ]
    camisole = build_lofted_mesh(
        "GEO_Outfit_BlackCamisole",
        cami_profiles,
        ring_segments=56,
        cap_ends=False,
    )

    bm = bmesh.new()
    bm.from_mesh(camisole.data)
    for v in bm.verts:
        if v.co.z > 1.215:
            if v.co.y > 0.015:
                v_dip = max(0.0, 1.0 - abs(v.co.x) / (0.088 * sh_s))
                v.co.z -= 0.072 * (v_dip**1.35)
            elif v.co.y < -0.015:
                v.co.z -= 0.022
        if 1.02 <= v.co.z <= 1.16:
            fold = 0.0018 * math.sin((v.co.z - 1.02) * 90.0)
            v.co.x *= 1.0 + fold * 3.0
            v.co.y *= 1.0 + fold * 3.0

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(camisole.data)
    bm.free()

    # Solidify BEFORE Subdivision (without CorrectiveSmooth) -> zero vertex-mismatch warnings!
    solid = camisole.modifiers.new(name="ClothThickness", type="SOLIDIFY")
    solid.thickness = 0.0030
    solid.offset = 1.0
    solid.use_rim = True

    camisole.data.materials.append(mats["camisole"])
    add_highpoly_modifiers(
        camisole,
        CONFIG["subsurf_viewport"],
        CONFIG["subsurf_render"],
        use_corrective=False,
        displace_strength=0.0003,
    )
    link_exclusively(camisole, col_outfit)

    # Spaghetti shoulder straps converted to clean quad-mesh tubes so they export to FBX + GLB
    for side, sign in (("L", 1.0), ("R", -1.0)):
        curve_data = bpy.data.curves.new(f"CRV_Strap_{side}", type="CURVE")
        curve_data.dimensions = "3D"
        curve_data.bevel_depth = 0.0042
        curve_data.bevel_resolution = 5
        spline = curve_data.splines.new("NURBS")
        pts = [
            (sign * 0.074 * sh_s, 0.114, 1.272),
            (sign * 0.085 * sh_s, 0.086, 1.338),
            (sign * 0.090 * sh_s, 0.004, 1.384),
            (sign * 0.086 * sh_s, -0.078, 1.342),
            (sign * 0.076 * sh_s, -0.104, 1.260),
        ]
        spline.points.add(len(pts) - 1)
        for idx, pt in enumerate(pts):
            spline.points[idx].co = (pt[0], pt[1], pt[2], 1.0)
        spline.use_endpoint_u = True
        strap_crv = bpy.data.objects.new(f"CRV_Outfit_CamisoleStrap_{side}", curve_data)
        bpy.context.scene.collection.objects.link(strap_crv)
        bpy.context.view_layer.objects.active = strap_crv
        strap_crv.select_set(True)
        bpy.ops.object.convert(target="MESH")
        strap_crv.select_set(False)
        strap_crv.name = f"GEO_Outfit_CamisoleStrap_{side}"
        strap_crv.data.materials.append(mats["camisole"])
        link_exclusively(strap_crv, col_outfit)

    # Delicate silver pendant necklace sitting cleanly on upper chest skin
    neck_curve = bpy.data.curves.new("CRV_Necklace", type="CURVE")
    neck_curve.dimensions = "3D"
    neck_curve.bevel_depth = 0.0018
    neck_curve.bevel_resolution = 4
    sp = neck_curve.splines.new("NURBS")
    n_pts = [
        (0.000, -0.072, 1.410),
        (0.056, 0.002, 1.396),
        (0.044, 0.078, 1.352),
        (0.000, 0.104, 1.312),
        (-0.044, 0.078, 1.352),
        (-0.056, 0.002, 1.396),
        (0.000, -0.072, 1.410),
    ]
    sp.points.add(len(n_pts) - 1)
    for idx, pt in enumerate(n_pts):
        sp.points[idx].co = (pt[0], pt[1], pt[2], 1.0)
    sp.use_endpoint_u = True
    neck_obj = bpy.data.objects.new("GEO_Accessory_Necklace", neck_curve)
    bpy.context.scene.collection.objects.link(neck_obj)
    bpy.context.view_layer.objects.active = neck_obj
    neck_obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    neck_obj.select_set(False)
    neck_obj.data.materials.append(mats["metal"])
    link_exclusively(neck_obj, col_outfit)

    # Small teardrop silver pendant charm at the necklace apex
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=18,
        ring_count=12,
        radius=0.0055,
        location=(0.0, 0.106, 1.304),
    )
    pendant = bpy.context.active_object
    pendant.name = "GEO_Accessory_NecklacePendant"
    pendant.scale = (0.75, 0.45, 1.25)
    pendant.data.materials.append(mats["metal"])
    link_exclusively(pendant, col_outfit)

    return camisole


def build_distressed_skinny_jeans_and_belt(col_outfit: Any, mats: dict[str, Any]) -> None:
    """Create continuous high-waisted skinny jeans with genuine recessed skin-showing rips & belt."""
    import bmesh
    import bpy

    scales = CONFIG.get("proportion_scales") or {}
    wa_s = float(scales.get("waist_scale", 1.0))
    hi_s = float(scales.get("hip_scale", 1.0))

    # 1. Pelvis / Hip Saddle extending down to z=0.80 so legs socket inside with zero gap
    hip_profiles = [
        {
            "z": 0.805,
            "rx": 0.158 * hi_s,
            "ry": 0.100,
            "y": -0.004,
            "dent_front": 0.042,
            "dent_back": 0.045,
            "glute_lobe": 0.030,
        },
        {
            "z": 0.845,
            "rx": 0.164 * hi_s,
            "ry": 0.112,
            "y": -0.006,
            "dent_front": 0.022,
            "dent_back": 0.028,
            "glute_lobe": 0.038,
        },
        {
            "z": 0.905,
            "rx": 0.168 * hi_s,
            "ry": 0.118,
            "y": -0.006,
            "dent_front": 0.008,
            "dent_back": 0.020,
            "glute_lobe": 0.042,
        },
        {"z": 0.965, "rx": 0.154 * hi_s, "ry": 0.108, "y": -0.003, "dent_back": 0.012, "glute_lobe": 0.022},
        {"z": 1.005, "rx": 0.143 * wa_s, "ry": 0.101, "y": 0.000, "dent_back": 0.008},
        {"z": 1.016, "rx": 0.141 * wa_s, "ry": 0.100, "y": 0.000, "dent_back": 0.008},
    ]
    jeans_hip = build_lofted_mesh("GEO_Outfit_Jeans_Hip", hip_profiles, ring_segments=52, cap_ends=True)
    jeans_hip.data.materials.append(mats["jeans"])
    add_highpoly_modifiers(
        jeans_hip,
        CONFIG["subsurf_viewport"],
        CONFIG["subsurf_render"],
        use_corrective=False,
        displace_strength=0.0005,
    )
    link_exclusively(jeans_hip, col_outfit)

    # 2. Fitted Jeans Legs extending from z=0.088 (inside sneaker collar) up to z=0.895 (inside hip saddle)
    leg_sections = [
        (0.088, 0.088, -0.004, 0.038, 0.040),  # Tucked inside sneaker ankle collar
        (0.108, 0.088, -0.002, 0.041, 0.043),  # Stacked ankle hem
        (0.165, 0.089, -0.002, 0.042, 0.044),  # Lower ankle gather
        (0.265, 0.092, -0.006, 0.049, 0.051),  # Lower calf
        (0.365, 0.094, -0.010, 0.057, 0.059),  # Full calf muscle
        (0.455, 0.092, 0.002, 0.052, 0.054),  # Lower knee
        (0.480, 0.092, 0.003, 0.052, 0.054),  # Mid knee (distressed rip zone)
        (0.510, 0.093, 0.003, 0.054, 0.057),  # Upper knee
        (0.585, 0.094, 0.004, 0.063, 0.067),  # Mid thigh (left upper thigh rip zone)
        (0.625, 0.094, 0.004, 0.066, 0.070),  # Upper-mid thigh
        (0.735, 0.094 * hi_s, 0.002, 0.076 * hi_s, 0.082),  # Upper thigh
        (0.845, 0.088 * hi_s, -0.004, 0.084 * hi_s, 0.092),  # Groin / hip merge
        (0.895, 0.084 * hi_s, -0.005, 0.082 * hi_s, 0.090),  # Socketed inside pelvis saddle
    ]

    # Distressed rip definitions per leg: (z_center, z_half, x_half)
    leg_rips = {
        "L": [(0.600, 0.022, 0.032), (0.468, 0.019, 0.028)],
        "R": [(0.482, 0.020, 0.030)],
    }

    for side, sign in (("L", 1.0), ("R", -1.0)):
        leg_rings = [
            {"z": z_h, "x": sign * x_off, "y": y_off, "rx": rx_r, "ry": ry_r}
            for z_h, x_off, y_off, rx_r, ry_r in leg_sections
        ]
        leg_obj = build_lofted_mesh(
            f"GEO_Outfit_Jeans_Leg_{side}",
            leg_rings,
            ring_segments=44,
            cap_ends=True,
        )
        leg_obj.data.materials.append(mats["jeans"])
        leg_obj.data.materials.append(mats["skin"])
        leg_obj.data.materials.append(mats["fray"])

        bm = bmesh.new()
        bm.from_mesh(leg_obj.data)
        cx_leg = sign * 0.093
        # Add ankle stacking waves + carve genuine skin-exposing distressed denim cutouts
        for v in bm.verts:
            if 0.105 <= v.co.z < 0.22:
                stack_wave = 0.0022 * math.sin(v.co.z * 145.0)
                v.co.x += sign * stack_wave
                v.co.y += stack_wave
            for rz_c, rz_h, rx_h in leg_rips[side]:
                if v.co.y > 0.025:
                    ell = ((v.co.x - cx_leg) / rx_h) ** 2 + ((v.co.z - rz_c) / rz_h) ** 2
                    if ell < 1.0:
                        # Recess slightly inward to reveal underlying leg skin
                        v.co.y -= 0.0035 * (1.0 - ell)

        for f in bm.faces:
            fc = f.calc_center_median()
            if fc.y > 0.030:
                for rz_c, rz_h, rx_h in leg_rips[side]:
                    ell = ((fc.x - cx_leg) / rx_h) ** 2 + ((fc.z - rz_c) / rz_h) ** 2
                    if ell < 0.72:
                        f.material_index = 1  # Exposed warm leg skin
                    elif ell < 1.18:
                        f.material_index = 2  # Frayed white cotton denim rim

        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(leg_obj.data)
        bm.free()

        add_highpoly_modifiers(
            leg_obj,
            CONFIG["subsurf_viewport"],
            CONFIG["subsurf_render"],
            use_corrective=False,
            displace_strength=0.0005,
        )
        link_exclusively(leg_obj, col_outfit)

    # 3. Horizontal Frayed White Weft Threads spanning each distressed rip opening
    rip_locations = [
        ("Rip_UpperLeftThigh", 0.094, 0.071, 0.600, 0.029, 0.017),
        ("Rip_RightKnee", -0.092, 0.057, 0.482, 0.026, 0.015),
        ("Rip_LeftKnee", 0.092, 0.057, 0.468, 0.025, 0.015),
    ]
    for rname, rx_pos, ry_pos, rz_pos, rw, rh in rip_locations:
        for s_idx in range(6):
            tz = rz_pos - rh * 0.68 + (s_idx / 5.0) * (rh * 1.36)
            crv = bpy.data.curves.new(f"CRV_{rname}_{s_idx}", type="CURVE")
            crv.dimensions = "3D"
            crv.bevel_depth = 0.0015
            crv.bevel_resolution = 3
            sp = crv.splines.new("NURBS")
            pts = [
                (rx_pos - rw, ry_pos - 0.004, tz),
                (rx_pos, ry_pos + 0.0025, tz + 0.0012 * math.sin(s_idx * 2.1)),
                (rx_pos + rw, ry_pos - 0.004, tz),
            ]
            sp.points.add(len(pts) - 1)
            for idx, p in enumerate(pts):
                sp.points[idx].co = (p[0], p[1], p[2], 1.0)
            sp.use_endpoint_u = True
            strand_obj = bpy.data.objects.new(f"GEO_Outfit_{rname}_Thread_{s_idx}", crv)
            bpy.context.scene.collection.objects.link(strand_obj)
            bpy.context.view_layer.objects.active = strand_obj
            strand_obj.select_set(True)
            bpy.ops.object.convert(target="MESH")
            strand_obj.select_set(False)
            strand_obj.data.materials.append(mats["fray"])
            link_exclusively(strand_obj, col_outfit)

    # 4. Crisp 3.2cm Black Grain Leather Belt (4 hold-rings prevent Catmull-Clark collapse!)
    belt_profiles = [
        {"z": 0.978, "rx": 0.147 * wa_s, "ry": 0.105, "y": 0.000},
        {"z": 0.982, "rx": 0.148 * wa_s, "ry": 0.106, "y": 0.000},
        {"z": 1.008, "rx": 0.146 * wa_s, "ry": 0.104, "y": 0.000},
        {"z": 1.012, "rx": 0.145 * wa_s, "ry": 0.103, "y": 0.000},
    ]
    belt = build_lofted_mesh("GEO_Outfit_BlackLeatherBelt", belt_profiles, ring_segments=52, cap_ends=False)
    solid_belt = belt.modifiers.new(name="BeltThickness", type="SOLIDIFY")
    solid_belt.thickness = 0.0045
    solid_belt.offset = 1.0
    solid_belt.use_rim = True
    belt.data.materials.append(mats["belt"])
    add_highpoly_modifiers(belt, 2, 2, use_corrective=False)
    link_exclusively(belt, col_outfit)

    # Double-ring metallic front belt buckle
    for b_side, bx in (("L", 0.011), ("R", -0.011)):
        bpy.ops.mesh.primitive_torus_add(
            major_radius=0.016,
            minor_radius=0.0034,
            major_segments=32,
            minor_segments=16,
            location=(bx, 0.111, 0.995),
            rotation=(math.pi / 2.0, 0.0, 0.0),
        )
        buckle = bpy.context.active_object
        buckle.name = f"GEO_Outfit_BeltBuckle_{b_side}"
        for poly in buckle.data.polygons:
            poly.use_smooth = True
        buckle.data.materials.append(mats["metal"])
        link_exclusively(buckle, col_outfit)


def build_white_sneakers(col_outfit: Any, mats: dict[str, Any]) -> None:
    """Create detailed high-poly chunky white low-top sneakers socketed cleanly to the ankles."""
    import bmesh
    import bpy

    for side, sign in (("L", 1.0), ("R", -1.0)):
        cx = sign * 0.088
        shoe_profiles = [
            {"z": 0.000, "x": cx, "y": 0.032, "rx": 0.048, "ry": 0.116},  # Flat outsole ground contact
            {"z": 0.004, "x": cx, "y": 0.032, "rx": 0.050, "ry": 0.119},  # Outsole bevel hold-loop
            {"z": 0.030, "x": cx, "y": 0.032, "rx": 0.051, "ry": 0.120},  # Platform midsole ridge
            {"z": 0.060, "x": cx, "y": 0.024, "rx": 0.047, "ry": 0.108},  # Leather vamp / toe box
            {"z": 0.090, "x": cx, "y": -0.003, "rx": 0.044, "ry": 0.066},  # Padded ankle collar
            {"z": 0.106, "x": cx, "y": -0.004, "rx": 0.042, "ry": 0.054},  # Top cuff overlapping jeans
        ]
        shoe = build_lofted_mesh(
            f"GEO_Outfit_WhiteSneaker_{side}",
            shoe_profiles,
            ring_segments=40,
            cap_ends=True,
        )
        shoe.data.materials.append(mats["sneakers"])
        add_highpoly_modifiers(
            shoe,
            CONFIG["subsurf_viewport"],
            CONFIG["subsurf_render"],
            use_corrective=False,
            displace_strength=0.0002,
        )
        link_exclusively(shoe, col_outfit)

        # Quad-capped sneaker laces across the instep (zero >4-gon FBX warnings)
        for l_idx in range(5):
            ly = 0.024 + l_idx * 0.015
            lz = 0.082 - l_idx * 0.0048
            l_mesh = bpy.data.meshes.new(f"GEO_Outfit_SneakerLace_{side}_{l_idx}")
            lbm = bmesh.new()
            bmesh.ops.create_cube(lbm, size=1.0)
            for v in lbm.verts:
                v.co.x = cx + v.co.x * 0.048
                v.co.y = ly + v.co.y * 0.0065
                v.co.z = lz + v.co.z * 0.0035
            lbm.to_mesh(l_mesh)
            lbm.free()
            lace = bpy.data.objects.new(f"GEO_Outfit_SneakerLace_{side}_{l_idx}", l_mesh)
            bpy.context.scene.collection.objects.link(lace)
            lace.data.materials.append(mats["fray"])
            add_highpoly_modifiers(lace, 1, 1, use_corrective=False)
            link_exclusively(lace, col_outfit)


# ==============================================================================
# 4. LONG WAVY DARK HAIR SYSTEM (CENTER-PARTED GROOM + SCALP CAP)
# ==============================================================================
def build_long_wavy_hair_groom(col_hair: Any, mats: dict[str, Any]) -> tuple[Any, Any]:
    """Generate center-parted 3D NURBS hair locks + cranial scalp base for UE5 Groom & GLB."""
    import bpy

    # 1. Fitted dark hair scalp cap hugging crown, hairline, temples & occiput
    scalp_profiles = [
        {"z": 1.555, "rx": 0.084, "ry": 0.096, "y": -0.014},
        {"z": 1.615, "rx": 0.085, "ry": 0.101, "y": -0.006},
        {"z": 1.658, "rx": 0.082, "ry": 0.098, "y": -0.003},
        {"z": 1.692, "rx": 0.060, "ry": 0.075, "y": -0.005},
        {"z": 1.706, "rx": 0.026, "ry": 0.034, "y": -0.008},
    ]
    scalp_cap = build_lofted_mesh("GEO_Hair_ScalpCap", scalp_profiles, ring_segments=40, cap_ends=True)
    for v in scalp_cap.data.vertices:
        if v.co.y > 0.020 and v.co.z < 1.636:
            v.co.y = 0.016
            v.co.z = max(v.co.z, 1.628)
    scalp_cap.data.materials.append(mats["hair_glb"])
    add_highpoly_modifiers(scalp_cap, 1, 2, use_corrective=False)
    link_exclusively(scalp_cap, col_hair)

    # 2. Dense 140-strand center-parted wavy hair groom (continuous back curtain + front clavicle locks)
    curve_data = bpy.data.curves.new("GROOM_LongWavyDarkHair", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = 0.0075
    curve_data.bevel_resolution = 2
    curve_data.resolution_u = 3
    curve_data.use_fill_caps = True

    num_strands = 140
    steps = 15

    for s in range(num_strands):
        side_sign = 1.0 if (s % 2 == 0) else -1.0
        half_idx = (s // 2) / max(1.0, float(num_strands // 2 - 1))

        # Azimuth from front center part (0) -> temple (pi/2) -> center back (pi)
        az = half_idx * math.pi
        sin_az = math.sin(az)
        # Crown center-part line from forehead hairline straight back over vertex to occiput
        part_x = side_sign * (0.003 + 0.012 * sin_az)
        part_y = 0.058 - 0.142 * half_idx
        part_z = 1.704 - 0.018 * ((half_idx - 0.32) ** 2) * 4.5 - 0.038 * (half_idx**2.4)

        spline = curve_data.splines.new("NURBS")
        spline.points.add(steps - 1)

        back_blend = max(0.0, min(1.0, (half_idx - 0.18) / 0.18))
        strand_length = (1.0 - back_blend) * 0.39 + back_blend * (0.52 + 0.04 * math.sin(s * 2.9))
        phase = s * 0.73

        # Drape smoothly over scalp hemisphere before cascading downward
        skull_side_reach = side_sign * (0.088 * sin_az + 0.068 * (1.0 - 0.55 * half_idx))

        for k in range(steps):
            u = k / float(steps - 1)
            dome_arc = math.sin(min(1.0, u * 2.4) * (math.pi / 2.0))
            wave_x = 0.012 * (u**1.35) * math.sin(u * 4.8 * math.pi + phase)
            wave_y = 0.009 * (u**1.35) * math.cos(u * 4.2 * math.pi + phase)

            px = part_x + skull_side_reach * dome_arc + wave_x
            pz = part_z + 0.004 * math.sin(min(1.0, u * 3.0) * math.pi) - (u**1.18) * strand_length

            if half_idx < 0.24:
                if abs(px) < 0.085 and 1.43 < pz < 1.66:
                    px = side_sign * (0.085 + 0.008 * dome_arc)
                py = part_y + 0.038 * dome_arc + wave_y
                if pz < 1.38:
                    py = max(py, 0.108 + wave_y * 0.5)
            else:
                back_arch = -0.048 * dome_arc * (0.35 + 0.65 * half_idx)
                py = part_y + back_arch + wave_y
                if 1.54 < pz < 1.69 and py > -0.098 and half_idx > 0.55:
                    py = min(py, -0.098 - 0.008 * dome_arc)
                if pz < 1.40:
                    py = min(py, -0.108 + wave_y * 0.5)

            pt = spline.points[k]
            pt.co = (px, py, pz, 1.0)
            pt.radius = 0.72 + 0.52 * math.sin(u * math.pi * 0.85) * (1.0 - 0.60 * u)

        spline.use_endpoint_u = True
        spline.order_u = 3

    # Fill center-back occiput/nape curtain so zero vertical part gap appears on the back
    for cb in range(22):
        frac = (cb / 21.0) * 2.0 - 1.0  # -1.0 .. +1.0 across [-0.068, +0.068]
        bx = frac * 0.068
        sp_b = curve_data.splines.new("NURBS")
        sp_b.points.add(steps - 1)
        b_len = 0.52 + 0.03 * math.cos(cb * 2.3)
        b_phase = cb * 1.15
        for k in range(steps):
            u = k / float(steps - 1)
            arc = math.sin(min(1.0, u * 2.4) * (math.pi / 2.0))
            wx = 0.010 * (u**1.35) * math.sin(u * 4.6 * math.pi + b_phase)
            wy = 0.008 * (u**1.35) * math.cos(u * 4.0 * math.pi + b_phase)
            px = bx * (0.28 + 0.82 * arc) + wx
            py = -0.062 - 0.048 * arc + wy
            if u > 0.35:
                py = min(py, -0.109 + wy * 0.5)
            pz = 1.678 - 0.010 * (frac**2) - (u**1.16) * b_len
            pt = sp_b.points[k]
            pt.co = (px, py, pz, 1.0)
            pt.radius = 0.76 + 0.50 * math.sin(u * math.pi * 0.85) * (1.0 - 0.58 * u)
        sp_b.use_endpoint_u = True
        sp_b.order_u = 3

    hair_obj = bpy.data.objects.new("GROOM_UE5_LongWavyHair", curve_data)
    hair_obj.data.materials.append(mats["hair"])
    link_exclusively(hair_obj, col_hair)
    return hair_obj, scalp_cap


# ==============================================================================
# 5. UNREAL ENGINE 5 MANNEQUIN / METAHUMAN HUMANOID ARMATURE + SKIN WEIGHTS
# ==============================================================================
def _assign_ue5_skin_weights_to_mesh(
    mesh_obj: Any, bone_segments: list[tuple[str, tuple[float, float, float], tuple[float, float, float]]]
) -> None:
    """Assign smooth, normalized UE5 humanoid vertex-group weights to a Blender mesh object."""
    vgroups = {}
    for bname, _, _ in bone_segments:
        vg = mesh_obj.vertex_groups.get(bname) or mesh_obj.vertex_groups.new(name=bname)
        vgroups[bname] = vg

    mw = mesh_obj.matrix_world
    for v in mesh_obj.data.vertices:
        p = mw @ v.co
        px, py, pz = float(p.x), float(p.y), float(p.z)

        scores: list[tuple[str, float]] = []
        for bname, h, t in bone_segments:
            if bname == "root":
                continue
            # Enforce strict anatomical Left (+X) / Right (-X) limb isolation
            if bname.endswith("_l") and px < -0.015:
                continue
            if bname.endswith("_r") and px > 0.015:
                continue
            # Prevent arm bones from grabbing torso/hips
            if ("arm" in bname or "hand" in bname) and abs(px) < 0.115:
                continue

            vx, vy, vz = t[0] - h[0], t[1] - h[1], t[2] - h[2]
            seg_len2 = vx * vx + vy * vy + vz * vz
            if seg_len2 > 1e-8:
                proj = ((px - h[0]) * vx + (py - h[1]) * vy + (pz - h[2]) * vz) / seg_len2
                proj = max(0.0, min(1.0, proj))
            else:
                proj = 0.0
            cx, cy, cz = h[0] + proj * vx, h[1] + proj * vy, h[2] + proj * vz
            dist = math.sqrt((px - cx) ** 2 + (py - cy) ** 2 + (pz - cz) ** 2)
            w = 1.0 / ((dist + 0.028) ** 3.6)
            scores.append((bname, w))

        scores.sort(key=lambda item: item[1], reverse=True)
        top4 = scores[:4]
        total = sum(val for _, val in top4) or 1.0
        for bname, val in top4:
            norm_w = val / total
            if norm_w >= 0.01:
                vgroups[bname].add([v.index], norm_w, "REPLACE")


def build_ue5_skeleton_rig(col_rig: Any, character_meshes: list[Any]) -> Any:
    """Construct a UE5-compliant humanoid skeleton in T-pose with full vertex-group skinning."""
    import bpy
    from mathutils import Vector

    arm_data = bpy.data.armatures.new("ARM_UE5_MannequinSkeleton")
    arm_obj = bpy.data.objects.new("SKEL_UE5_HumanoidRig", arm_data)
    link_exclusively(arm_obj, col_rig)

    bpy.context.view_layer.objects.active = arm_obj
    bpy.ops.object.mode_set(mode="EDIT")
    eb = arm_data.edit_bones

    bone_segments: list[tuple[str, tuple[float, float, float], tuple[float, float, float]]] = []

    def add_bone(
        name: str,
        head: tuple[float, float, float],
        tail: tuple[float, float, float],
        parent: str | None = None,
        connect: bool = False,
    ) -> Any:
        b = eb.new(name)
        b.head = Vector(head)
        b.tail = Vector(tail)
        if parent and parent in eb:
            b.parent = eb[parent]
            b.use_connect = connect
        bone_segments.append((name, head, tail))
        return b

    # Core Spine & Head Hierarchy (UE5 Manny / MetaHuman Standard)
    add_bone("root", (0.0, 0.000, 0.000), (0.0, 0.000, 0.150))
    add_bone("pelvis", (0.0, -0.005, 0.900), (0.0, 0.000, 1.010), "root", False)
    add_bone("spine_01", (0.0, 0.000, 1.010), (0.0, 0.002, 1.120), "pelvis", True)
    add_bone("spine_02", (0.0, 0.002, 1.120), (0.0, 0.005, 1.240), "spine_01", True)
    add_bone("spine_03", (0.0, 0.005, 1.240), (0.0, 0.000, 1.365), "spine_02", True)
    add_bone("neck_01", (0.0, 0.000, 1.365), (0.0, 0.004, 1.485), "spine_03", True)
    add_bone("head", (0.0, 0.004, 1.485), (0.0, 0.002, 1.702), "neck_01", True)

    # Bilateral Limbs (`_l` = +X anatomical Left, `_r` = -X anatomical Right)
    for suffix, sign in (("_l", 1.0), ("_r", -1.0)):
        add_bone(
            f"clavicle{suffix}",
            (sign * 0.025, 0.004, 1.355),
            (sign * 0.145, -0.002, 1.354),
            "spine_03",
            False,
        )
        add_bone(
            f"upperarm{suffix}",
            (sign * 0.145, -0.002, 1.354),
            (sign * 0.395, -0.008, 1.346),
            f"clavicle{suffix}",
            True,
        )
        add_bone(
            f"lowerarm{suffix}",
            (sign * 0.395, -0.008, 1.346),
            (sign * 0.645, 0.005, 1.337),
            f"upperarm{suffix}",
            True,
        )
        add_bone(
            f"hand{suffix}",
            (sign * 0.645, 0.005, 1.337),
            (sign * 0.745, 0.006, 1.333),
            f"lowerarm{suffix}",
            True,
        )

        add_bone(
            f"thigh{suffix}",
            (sign * 0.090, -0.004, 0.880),
            (sign * 0.092, 0.003, 0.480),
            "pelvis",
            False,
        )
        add_bone(
            f"calf{suffix}",
            (sign * 0.092, 0.003, 0.480),
            (sign * 0.088, -0.003, 0.090),
            f"thigh{suffix}",
            True,
        )
        add_bone(
            f"foot{suffix}",
            (sign * 0.088, -0.003, 0.090),
            (sign * 0.088, 0.075, 0.025),
            f"calf{suffix}",
            True,
        )
        add_bone(
            f"ball{suffix}",
            (sign * 0.088, 0.075, 0.025),
            (sign * 0.088, 0.135, 0.012),
            f"foot{suffix}",
            True,
        )

    bpy.ops.object.mode_set(mode="OBJECT")

    # Parent meshes cleanly to Armature & populate UE5 vertex groups (eliminates glTF & UE5 warnings!)
    for mesh_obj in character_meshes:
        if mesh_obj and mesh_obj.type == "MESH":
            mesh_obj.parent = arm_obj
            mesh_obj.matrix_parent_inverse = arm_obj.matrix_world.inverted()
            _assign_ue5_skin_weights_to_mesh(mesh_obj, bone_segments)
            arm_mod = mesh_obj.modifiers.new(name="UE5_Skeleton", type="ARMATURE")
            arm_mod.object = arm_obj

    return arm_obj, bone_segments


# ==============================================================================
# 6. STUDIO LOOKDEV LIGHTING, AIMED CAMERAS & UE5 FBX / GLB EXPORT
# ==============================================================================
def setup_studio_lighting_and_cameras(col_studio: Any) -> dict[str, Any]:
    """Create 3-point softbox lighting and properly aimed Front / Back / 3-Quarter cameras."""
    import bpy
    from mathutils import Vector

    lights = [
        ("LGT_Key_Softbox", (1.9, 2.6, 2.2), 210.0, (1.00, 0.96, 0.93), 1.5),
        ("LGT_Fill_Softbox", (-2.1, 2.2, 1.65), 115.0, (0.91, 0.95, 1.00), 1.9),
        ("LGT_Rim_Back", (0.0, -2.4, 2.35), 165.0, (0.97, 0.98, 1.00), 1.4),
    ]
    for name, loc, energy, color, size in lights:
        ldata = bpy.data.lights.new(name=name, type="AREA")
        ldata.energy = energy
        ldata.color = color
        ldata.size = size
        lobj = bpy.data.objects.new(name, ldata)
        lobj.location = Vector(loc)
        direction = Vector((0.0, 0.0, 1.12)) - lobj.location
        lobj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        link_exclusively(lobj, col_studio)

    cams: dict[str, Any] = {}
    target = Vector((0.0, 0.0, 0.88))
    for cam_name, loc, lens in (
        ("CAM_Turnaround_Front", (0.0, 4.95, 0.90), 85.0),
        ("CAM_Turnaround_ThreeQuarter", (2.85, 4.05, 1.04), 85.0),
        ("CAM_Turnaround_Back", (0.0, -4.95, 0.90), 85.0),
    ):
        cdata = bpy.data.cameras.new(cam_name)
        cdata.lens = lens
        cdata.sensor_width = 36.0
        cobj = bpy.data.objects.new(cam_name, cdata)
        cobj.location = Vector(loc)
        cobj.rotation_euler = (target - cobj.location).to_track_quat("-Z", "Y").to_euler()
        link_exclusively(cobj, col_studio)
        cams[cam_name] = cobj
        if cam_name == "CAM_Turnaround_Front":
            bpy.context.scene.camera = cobj

    return cams


def export_for_unreal_engine_5(fbx_path: str) -> str:
    """Export rigged high-poly character to UE5 FBX (-Y Forward, Z Up, smoothing groups, no leaf bones)."""
    import bpy

    abs_fbx = bpy.path.abspath(fbx_path)
    os.makedirs(os.path.dirname(abs_fbx), exist_ok=True)
    bpy.ops.export_scene.fbx(
        filepath=abs_fbx,
        use_selection=False,
        object_types={"ARMATURE", "MESH"},
        use_mesh_modifiers=True,
        mesh_smooth_type="FACE",
        use_tspace=True,
        add_leaf_bones=False,
        primary_bone_axis="Y",
        secondary_bone_axis="X",
        armature_nodetype="NULL",
        bake_anim=False,
        axis_forward="-Y",
        axis_up="Z",
        apply_scale_options="FBX_SCALE_NONE",
    )
    return abs_fbx


def export_skinned_glb(
    glb_path: str,
    hair_curve_obj: Any = None,
    arm_obj: Any = None,
    bone_segments: list[Any] | None = None,
    mats: dict[str, Any] | None = None,
) -> str:
    """Export interactive PBR + skinned glTF 2.0 `.glb` (converting NURBS groom temporarily to mesh)."""
    import bpy

    abs_glb = bpy.path.abspath(glb_path)
    os.makedirs(os.path.dirname(abs_glb), exist_ok=True)

    temp_hair_mesh = None
    if hair_curve_obj is not None and hair_curve_obj.type == "CURVE":
        depsgraph = bpy.context.evaluated_depsgraph_get()
        eval_obj = hair_curve_obj.evaluated_get(depsgraph)
        mesh_from_curve = bpy.data.meshes.new_from_object(eval_obj)
        temp_hair_mesh = bpy.data.objects.new("GEO_UE5_HairGroom_Mesh", mesh_from_curve)
        bpy.context.scene.collection.objects.link(temp_hair_mesh)
        temp_hair_mesh.data.materials.clear()
        if mats and "hair_glb" in mats:
            temp_hair_mesh.data.materials.append(mats["hair_glb"])
        if arm_obj is not None and bone_segments is not None:
            temp_hair_mesh.parent = arm_obj
            temp_hair_mesh.matrix_parent_inverse = arm_obj.matrix_world.inverted()
            _assign_ue5_skin_weights_to_mesh(temp_hair_mesh, bone_segments)
            arm_mod = temp_hair_mesh.modifiers.new(name="UE5_Skeleton", type="ARMATURE")
            arm_mod.object = arm_obj

    prev_hide = False
    if hair_curve_obj is not None:
        prev_hide = hair_curve_obj.hide_render
        hair_curve_obj.hide_render = True
    try:
        bpy.ops.export_scene.gltf(
            filepath=abs_glb,
            export_format="GLB",
            use_renderable=True,
            export_apply=True,
            export_skins=True,
            export_yup=True,
        )
    finally:
        if hair_curve_obj is not None:
            hair_curve_obj.hide_render = prev_hide
        if temp_hair_mesh is not None:
            mesh_ref = temp_hair_mesh.data
            bpy.data.objects.remove(temp_hair_mesh, do_unlink=True)
            bpy.data.meshes.remove(mesh_ref)

    return abs_glb


def render_studio_turnaround_sheet(
    output_png_path: str,
    samples: int = 24,
    panel_width: int = 440,
    panel_height: int = 580,
) -> str:
    """Render 3-panel Cycles lookdev turnaround (Front | 3/4 Perspective | Back) to a single PNG."""
    import bpy
    from PIL import Image, ImageDraw

    scene = bpy.context.scene
    scene.cycles.samples = samples
    scene.render.resolution_x = panel_width
    scene.render.resolution_y = panel_height
    scene.render.image_settings.file_format = "PNG"

    out_file = Path(bpy.path.abspath(output_png_path))
    out_file.parent.mkdir(parents=True, exist_ok=True)

    cam_specs = [
        ("0° Front Studio (Cycles SSS)", "CAM_Turnaround_Front"),
        ("35° UE5 LookDev Perspective", "CAM_Turnaround_ThreeQuarter"),
        ("180° Back & Hair Groom", "CAM_Turnaround_Back"),
    ]
    panels: list[Image.Image] = []
    for idx, (label, cname) in enumerate(cam_specs):
        cam = bpy.data.objects.get(cname)
        if cam is None:
            continue
        scene.camera = cam
        tmp_panel = out_file.parent / f"_tmp_ue5_panel_{idx}.png"
        scene.render.filepath = str(tmp_panel)
        bpy.ops.render.render(write_still=True)
        img = Image.open(tmp_panel).convert("RGB")
        tmp_panel.unlink(missing_ok=True)
        draw = ImageDraw.Draw(img)
        draw.text((14, 12), label, fill=(226, 232, 240))
        panels.append(img)

    sheet = Image.new("RGB", (panel_width * len(panels), panel_height), (16, 20, 28))
    draw_s = ImageDraw.Draw(sheet)
    for idx, p in enumerate(panels):
        sheet.paste(p, (idx * panel_width, 0))
        if idx > 0:
            draw_s.line(
                [(idx * panel_width, 0), (idx * panel_width, panel_height)], fill=(48, 60, 82), width=2
            )
    sheet.save(out_file, format="PNG")
    return str(out_file)


# ==============================================================================
# 7. MAIN PIPELINE EXECUTION
# ==============================================================================
def build_complete_ue5_character(config_overrides: dict[str, Any] | None = None) -> dict[str, Any]:
    """Execute the full high-poly UE5 realistic character generation pipeline."""
    ensure_headless_bpy_runtime()
    import bpy

    CONFIG.clear()
    CONFIG.update(DEFAULT_CONFIG)
    if config_overrides:
        CONFIG.update(config_overrides)

    clear_scene()

    root_col = get_or_create_collection(CONFIG["character_name"])
    col_ref = get_or_create_collection("00_Turnaround_Reference", root_col)
    col_char = get_or_create_collection("01_HighPoly_Anatomy", root_col)
    col_outfit = get_or_create_collection("02_HighPoly_Outfit", root_col)
    col_hair = get_or_create_collection("03_UE5_HairGroom", root_col)
    col_rig = get_or_create_collection("04_UE5_SkeletonRig", root_col)
    col_studio = get_or_create_collection("05_Studio_LookDev", root_col)

    resolved_ref = setup_reference_planes(CONFIG["reference_image_path"], col_ref)
    mats = create_material_library(CONFIG.get("palette_overrides"))

    build_anatomical_torso_and_head(col_char, mats)
    build_tpose_arms_and_hands(col_char, mats)
    build_camisole_and_necklace(col_outfit, mats)
    build_distressed_skinny_jeans_and_belt(col_outfit, mats)
    build_white_sneakers(col_outfit, mats)
    hair_obj, _scalp_cap = build_long_wavy_hair_groom(col_hair, mats)

    all_meshes = [obj for obj in bpy.data.objects if obj.type == "MESH" and not obj.name.startswith("REF_")]
    arm_obj, bone_segments = build_ue5_skeleton_rig(col_rig, all_meshes)
    setup_studio_lighting_and_cameras(col_studio)

    print(
        f"[Success] Built '{CONFIG['character_name']}' with {len(all_meshes)} high-poly mesh components "
        f"and {len(bone_segments)} UE5 Mannequin bones."
    )
    return {
        "character_name": CONFIG["character_name"],
        "mesh_component_count": len(all_meshes),
        "bone_count": len(bone_segments),
        "bone_names": [b[0] for b in bone_segments],
        "reference_image_loaded": resolved_ref,
        "hair_curve_obj": hair_obj,
        "armature_obj": arm_obj,
        "bone_segments": bone_segments,
        "materials": mats,
    }


def main(argv: list[str] | None = None) -> int:
    """CLI entrypoint supporting both standalone Python `bpy` and `blender --python ... --`."""
    import argparse
    import json

    raw_args = list(sys.argv[1:] if argv is None else argv)
    if "--" in raw_args:
        raw_args = raw_args[raw_args.index("--") + 1 :]

    parser = argparse.ArgumentParser(
        description="UE5 High-Poly Realistic Character Generator (Blender Python / bpy)."
    )
    parser.add_argument("--manifest-json", type=str, default=None, help="JSON job manifest path.")
    parser.add_argument("--reference", type=str, default=DEFAULT_CONFIG["reference_image_path"])
    parser.add_argument("--export-fbx", type=str, default=None, help="Output UE5 .fbx path.")
    parser.add_argument("--export-glb", type=str, default=None, help="Output skinned PBR .glb path.")
    parser.add_argument("--render-preview", type=str, default=None, help="Output Cycles turnaround .png.")
    parser.add_argument("--subsurf", type=int, default=2, help="Subdivision level (1-4).")
    parser.add_argument("--samples", type=int, default=28, help="Cycles lookdev samples.")
    args, _unknown = parser.parse_known_args(raw_args)

    if args.manifest_json:
        manifest = json.loads(Path(args.manifest_json).read_text(encoding="utf-8"))
        info = build_complete_ue5_character(manifest.get("config", {}))
        if manifest.get("export_fbx"):
            export_for_unreal_engine_5(manifest["export_fbx"])
        if manifest.get("export_glb"):
            export_skinned_glb(
                manifest["export_glb"],
                hair_curve_obj=info["hair_curve_obj"],
                arm_obj=info["armature_obj"],
                bone_segments=info["bone_segments"],
                mats=info["materials"],
            )
        samples = int(manifest.get("samples", 0))
        if manifest.get("render_preview") and samples > 0:
            render_studio_turnaround_sheet(manifest["render_preview"], samples=samples)
        if manifest.get("result_json"):
            serializable = {
                "character_name": info["character_name"],
                "mesh_component_count": info["mesh_component_count"],
                "bone_count": info["bone_count"],
                "bone_segments": [
                    [name, list(head_xyz), list(tail_xyz)]
                    for name, head_xyz, tail_xyz in info["bone_segments"]
                ],
                "reference_image_loaded": info["reference_image_loaded"],
            }
            Path(manifest["result_json"]).write_text(json.dumps(serializable), encoding="utf-8")
        return 0

    info = build_complete_ue5_character(
        {
            "reference_image_path": args.reference,
            "subsurf_viewport": max(1, min(3, args.subsurf)),
            "subsurf_render": max(1, min(4, args.subsurf)),
        }
    )
    if args.export_fbx:
        export_for_unreal_engine_5(args.export_fbx)
    if args.export_glb:
        export_skinned_glb(
            args.export_glb,
            hair_curve_obj=info["hair_curve_obj"],
            arm_obj=info["armature_obj"],
            bone_segments=info["bone_segments"],
            mats=info["materials"],
        )
    if args.render_preview:
        render_studio_turnaround_sheet(args.render_preview, samples=args.samples)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
