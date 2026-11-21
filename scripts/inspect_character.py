import argparse
import json
import os
import sys

import bpy


def inspect_fbx(fbx_path: str) -> dict:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.fbx(filepath=fbx_path)

    meshes = [obj for obj in bpy.data.objects if obj.type == "MESH"]
    armatures = [obj for obj in bpy.data.objects if obj.type == "ARMATURE"]

    mesh_reports = []
    for m in meshes:
        v_count = len(m.data.vertices)
        f_count = len(m.data.polygons)
        unweighted = 0
        max_influences = 0
        over_4_influences = 0
        for v in m.data.vertices:
            n_groups = len([g for g in v.groups if g.weight > 1e-6])
            if n_groups == 0:
                unweighted += 1
            if n_groups > max_influences:
                max_influences = n_groups
            if n_groups > 4:
                over_4_influences += 1

        arm_mods = [mod.object.name for mod in m.modifiers if mod.type == "ARMATURE" and mod.object]
        mesh_reports.append({
            "name": m.name,
            "vertices": v_count,
            "faces": f_count,
            "dimensions_m": [round(d, 4) for d in m.dimensions],
            "armature_modifiers": arm_mods,
            "unweighted_vertices": unweighted,
            "max_bone_influences": max_influences,
            "vertices_over_4_influences": over_4_influences,
            "materials": [mat.name if mat else None for mat in m.data.materials],
        })

    armature_reports = []
    for arm in armatures:
        bones = arm.data.bones
        roots = [b.name for b in bones if b.parent is None]
        armature_reports.append({
            "name": arm.name,
            "bone_count": len(bones),
            "root_bones": roots,
            "sample_bones": [b.name for b in list(bones)[:20]],
        })

    actions = [
        {
            "name": act.name,
            "frame_range": [round(act.frame_range[0], 2), round(act.frame_range[1], 2)],
        }
        for act in bpy.data.actions
    ]

    return {
        "file": fbx_path,
        "blender_version": bpy.app.version_string,
        "unit_system": bpy.context.scene.unit_settings.system,
        "scale_length": bpy.context.scene.unit_settings.scale_length,
        "fps": bpy.context.scene.render.fps,
        "meshes": mesh_reports,
        "armatures": armature_reports,
        "actions": actions,
    }


def main() -> int:
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = argv[1:]

    parser = argparse.ArgumentParser()
    parser.add_argument("--fbx", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args(argv)

    report = inspect_fbx(args.fbx)
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
        f.write("\n")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
