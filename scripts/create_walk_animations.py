import argparse
import json
import math
import os
import sys

import bpy


def find_bone(arm_obj, candidates):
    names = {b.name.lower(): b.name for b in arm_obj.pose.bones}
    for cand in candidates:
        for k, orig in names.items():
            if cand in k:
                return arm_obj.pose.bones[orig]
    return None


def set_rot_euler(pbone, rx, ry, rz, frame):
    if pbone is None:
        return
    pbone.rotation_mode = "XYZ"
    pbone.rotation_euler = (math.radians(rx), math.radians(ry), math.radians(rz))
    pbone.keyframe_insert(data_path="rotation_euler", frame=frame)


def set_loc(pbone, x, y, z, frame):
    if pbone is None:
        return
    pbone.location = (x, y, z)
    pbone.keyframe_insert(data_path="location", frame=frame)


def author_idle_cycle(arm_obj, action_name="Idle", fps=30, total_frames=60):
    if not arm_obj.animation_data:
        arm_obj.animation_data_create()
    action = bpy.data.actions.new(name=action_name)
    arm_obj.animation_data.action = action

    hips = find_bone(arm_obj, ["hips", "pelvis", "root"])
    spine = find_bone(arm_obj, ["spine1", "spine_01", "spine"])
    chest = find_bone(arm_obj, ["spine2", "chest", "upperchest"])
    l_arm = find_bone(arm_obj, ["leftarm", "upperarm_l", "l_upperarm", "upper_arm.l", "mixamorig:leftarm"])
    r_arm = find_bone(arm_obj, ["rightarm", "upperarm_r", "r_upperarm", "upper_arm.r", "mixamorig:rightarm"])

    for f, breath, sway in [(0, 0.0, 0.0), (15, 1.5, 1.0), (30, 3.0, 0.0), (45, 1.5, -1.0), (60, 0.0, 0.0)]:
        set_loc(hips, 0.0, breath * 0.003, 0.0, f)
        set_rot_euler(hips, 0.0, sway, 0.0, f)
        set_rot_euler(spine, breath * 0.8, 0.0, 0.0, f)
        set_rot_euler(chest, breath * 1.2, 0.0, 0.0, f)
        set_rot_euler(l_arm, 4.0, 0.0, 6.0 + breath * 0.5, f)
        set_rot_euler(r_arm, 4.0, 0.0, -6.0 - breath * 0.5, f)
    return action


def author_run_cycle(arm_obj, action_name="Run_InPlace", fps=30, total_frames=20):
    if not arm_obj.animation_data:
        arm_obj.animation_data_create()
    action = bpy.data.actions.new(name=action_name)
    arm_obj.animation_data.action = action

    hips = find_bone(arm_obj, ["hips", "pelvis", "root"])
    spine = find_bone(arm_obj, ["spine1", "spine_01", "spine"])
    l_thigh = find_bone(arm_obj, ["leftupleg", "thigh_l", "l_thigh", "upleg.l", "mixamorig:leftupleg"])
    l_shin = find_bone(arm_obj, ["leftleg", "calf_l", "l_calf", "shin.l", "mixamorig:leftleg"])
    r_thigh = find_bone(arm_obj, ["rightupleg", "thigh_r", "r_thigh", "upleg.r", "mixamorig:rightupleg"])
    r_shin = find_bone(arm_obj, ["rightleg", "calf_r", "r_calf", "shin.r", "mixamorig:rightleg"])
    l_arm = find_bone(arm_obj, ["leftarm", "upperarm_l", "l_upperarm", "upper_arm.l", "mixamorig:leftarm"])
    l_fore = find_bone(arm_obj, ["leftforearm", "lowerarm_l", "l_forearm", "forearm.l", "mixamorig:leftforearm"])
    r_arm = find_bone(arm_obj, ["rightarm", "upperarm_r", "r_upperarm", "upper_arm.r", "mixamorig:rightarm"])
    r_fore = find_bone(arm_obj, ["rightforearm", "lowerarm_r", "r_forearm", "forearm.r", "mixamorig:rightforearm"])

    poses = [
        (0,  0.03,  6.0, -42.0, 18.0,  38.0, 55.0,  35.0, -35.0),
        (5, -0.04,  0.0,  -8.0, 65.0,  15.0, 75.0,   0.0,   0.0),
        (10, 0.03, -6.0,  38.0, 55.0, -42.0, 18.0, -35.0,  35.0),
        (15,-0.04,  0.0,  15.0, 75.0,  -8.0, 65.0,   0.0,   0.0),
        (20, 0.03,  6.0, -42.0, 18.0,  38.0, 55.0,  35.0, -35.0),
    ]
    for f, bob, yaw, lt, ls, rt, rs, la, ra in poses:
        set_loc(hips, 0.0, bob, 0.0, f)
        set_rot_euler(hips, 8.0, yaw, 0.0, f)
        set_rot_euler(spine, 12.0, -yaw * 0.5, 0.0, f)
        set_rot_euler(l_thigh, lt, 0.0, 0.0, f)
        set_rot_euler(l_shin, ls, 0.0, 0.0, f)
        set_rot_euler(r_thigh, rt, 0.0, 0.0, f)
        set_rot_euler(r_shin, rs, 0.0, 0.0, f)
        set_rot_euler(l_arm, la, 0.0, 0.0, f)
        set_rot_euler(l_fore, -65.0, 0.0, 0.0, f)
        set_rot_euler(r_arm, ra, 0.0, 0.0, f)
        set_rot_euler(r_fore, -65.0, 0.0, 0.0, f)
    return action


def author_crouch_idle_cycle(arm_obj, action_name="Crouch_Idle", fps=30, total_frames=40):
    if not arm_obj.animation_data:
        arm_obj.animation_data_create()
    action = bpy.data.actions.new(name=action_name)
    arm_obj.animation_data.action = action

    hips = find_bone(arm_obj, ["hips", "pelvis", "root"])
    spine = find_bone(arm_obj, ["spine1", "spine_01", "spine"])
    l_thigh = find_bone(arm_obj, ["leftupleg", "thigh_l", "l_thigh", "upleg.l", "mixamorig:leftupleg"])
    l_shin = find_bone(arm_obj, ["leftleg", "calf_l", "l_calf", "shin.l", "mixamorig:leftleg"])
    r_thigh = find_bone(arm_obj, ["rightupleg", "thigh_r", "r_thigh", "upleg.r", "mixamorig:rightupleg"])
    r_shin = find_bone(arm_obj, ["rightleg", "calf_r", "r_calf", "shin.r", "mixamorig:rightleg"])

    for f, b in [(0, 0.0), (20, 1.5), (40, 0.0)]:
        set_loc(hips, 0.0, -0.32 + b * 0.005, 0.0, f)
        set_rot_euler(spine, 18.0 + b, 0.0, 0.0, f)
        set_rot_euler(l_thigh, -55.0, 0.0, 0.0, f)
        set_rot_euler(l_shin, 95.0, 0.0, 0.0, f)
        set_rot_euler(r_thigh, -55.0, 0.0, 0.0, f)
        set_rot_euler(r_shin, 95.0, 0.0, 0.0, f)
    return action


def author_walk_cycle(arm_obj, action_name="Walk_InPlace", fps=30, total_frames=30):
    bpy.context.scene.render.fps = fps
    bpy.context.scene.frame_start = 0
    bpy.context.scene.frame_end = total_frames

    if not arm_obj.animation_data:
        arm_obj.animation_data_create()
    action = bpy.data.actions.new(name=action_name)
    arm_obj.animation_data.action = action

    hips = find_bone(arm_obj, ["hips", "pelvis", "root"])
    spine = find_bone(arm_obj, ["spine1", "spine_01", "spine"])
    chest = find_bone(arm_obj, ["spine2", "chest", "upperchest"])

    l_thigh = find_bone(arm_obj, ["leftupleg", "thigh_l", "l_thigh", "upleg.l", "mixamorig:leftupleg"])
    l_shin = find_bone(arm_obj, ["leftleg", "calf_l", "l_calf", "shin.l", "mixamorig:leftleg"])
    l_foot = find_bone(arm_obj, ["leftfoot", "foot_l", "l_foot", "foot.l", "mixamorig:leftfoot"])

    r_thigh = find_bone(arm_obj, ["rightupleg", "thigh_r", "r_thigh", "upleg.r", "mixamorig:rightupleg"])
    r_shin = find_bone(arm_obj, ["rightleg", "calf_r", "r_calf", "shin.r", "mixamorig:rightleg"])
    r_foot = find_bone(arm_obj, ["rightfoot", "foot_r", "r_foot", "foot.r", "mixamorig:rightfoot"])

    l_arm = find_bone(arm_obj, ["leftarm", "upperarm_l", "l_upperarm", "upper_arm.l", "mixamorig:leftarm"])
    l_fore = find_bone(arm_obj, ["leftforearm", "lowerarm_l", "l_forearm", "forearm.l", "mixamorig:leftforearm"])

    r_arm = find_bone(arm_obj, ["rightarm", "upperarm_r", "r_upperarm", "upper_arm.r", "mixamorig:rightarm"])
    r_fore = find_bone(arm_obj, ["rightforearm", "lowerarm_r", "r_forearm", "forearm.r", "mixamorig:rightforearm"])

    # Keyframes: 0 (Contact L), 7 (Passing L), 15 (Contact R), 22 (Passing R), 30 (Contact L == 0)
    poses = [
        # (frame, hip_y_bob, hip_yaw, l_thigh_x, l_shin_x, l_foot_x, r_thigh_x, r_shin_x, r_foot_x, l_arm_x, r_arm_x)
        (0,   0.00,  4.0, -24.0,  6.0,  10.0,  22.0, 12.0, -10.0,  16.0, -16.0),
        (4,  -0.025, 2.0, -14.0, 14.0,   0.0,  24.0, 26.0, -12.0,  10.0, -10.0),
        (8,   0.015, 0.0,   2.0,  8.0,   0.0,  -4.0, 42.0,  10.0,   0.0,   0.0),
        (12,  0.02, -2.0,  14.0,  8.0,  -6.0, -18.0, 24.0,   8.0, -10.0,  10.0),
        (15,  0.00, -4.0,  22.0, 12.0, -10.0, -24.0,  6.0,  10.0, -16.0,  16.0),
        (19, -0.025,-2.0,  24.0, 26.0, -12.0, -14.0, 14.0,   0.0, -10.0,  10.0),
        (23,  0.015, 0.0,  -4.0, 42.0,  10.0,   2.0,  8.0,   0.0,   0.0,   0.0),
        (27,  0.02,  2.0, -18.0, 24.0,   8.0,  14.0,  8.0,  -6.0,  10.0, -10.0),
        (30,  0.00,  4.0, -24.0,  6.0,  10.0,  22.0, 12.0, -10.0,  16.0, -16.0),
    ]

    for (f, bob, yaw, lt, ls, lf, rt, rs, rf, la, ra) in poses:
        set_loc(hips, 0.0, bob, 0.0, f)
        set_rot_euler(hips, 0.0, yaw, 0.0, f)
        set_rot_euler(spine, 3.0, -yaw * 0.5, 0.0, f)
        set_rot_euler(chest, 2.0, -yaw * 0.5, 0.0, f)

        set_rot_euler(l_thigh, lt, 0.0, 0.0, f)
        set_rot_euler(l_shin, ls, 0.0, 0.0, f)
        set_rot_euler(l_foot, lf, 0.0, 0.0, f)

        set_rot_euler(r_thigh, rt, 0.0, 0.0, f)
        set_rot_euler(r_shin, rs, 0.0, 0.0, f)
        set_rot_euler(r_foot, rf, 0.0, 0.0, f)

        set_rot_euler(l_arm, la, 0.0, 0.0, f)
        set_rot_euler(l_fore, -18.0, 0.0, 0.0, f)
        set_rot_euler(r_arm, ra, 0.0, 0.0, f)
        set_rot_euler(r_fore, -18.0, 0.0, 0.0, f)

    return action


def verify_reimport(filepath: str, is_glb: bool) -> dict:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    if is_glb:
        bpy.ops.import_scene.gltf(filepath=filepath)
    else:
        bpy.ops.import_scene.fbx(filepath=filepath)

    armatures = [o for o in bpy.data.objects if o.type == "ARMATURE"]
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    actions = [
        {"name": a.name, "frame_range": [round(a.frame_range[0], 2), round(a.frame_range[1], 2)]}
        for a in bpy.data.actions
    ]
    return {
        "file": filepath,
        "armatures": len(armatures),
        "meshes": len(meshes),
        "actions": actions,
        "verified": len(armatures) > 0 and len(meshes) > 0 and len(actions) > 0,
    }


def main() -> int:
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = argv[1:]

    parser = argparse.ArgumentParser()
    parser.add_argument("--fbx", required=True)
    parser.add_argument("--name", required=True)
    parser.add_argument("--out-dir", default="Unity_Export")
    args = parser.parse_args(argv)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.fbx(filepath=args.fbx)

    armatures = [o for o in bpy.data.objects if o.type == "ARMATURE"]
    if not armatures:
        print(f"ERROR: No armature found in {args.fbx}", file=sys.stderr)
        return 1

    arm = armatures[0]
    walk_action = author_walk_cycle(arm, action_name="Walk_InPlace", fps=30, total_frames=30)
    idle_action = author_idle_cycle(arm, action_name="Idle", fps=30, total_frames=60)
    run_action = author_run_cycle(arm, action_name="Run_InPlace", fps=30, total_frames=20)
    crouch_action = author_crouch_idle_cycle(arm, action_name="Crouch_Idle", fps=30, total_frames=40)

    for act in [walk_action, idle_action, run_action, crouch_action]:
        track = arm.animation_data.nla_tracks.new()
        track.name = act.name
        track.strips.new(act.name, int(act.frame_range[0]), act)

    arm.animation_data.action = walk_action
    clip_name = walk_action.name
    blender_version = bpy.app.version_string

    # Limit to 4 bone influences and normalize on working copy
    for obj in bpy.data.objects:
        if obj.type == "MESH" and len(obj.vertex_groups) > 0:
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.mode_set(mode="OBJECT")
            bpy.ops.object.vertex_group_limit_total(group_select_mode="ALL", limit=4)
            bpy.ops.object.vertex_group_normalize_all(group_select_mode="ALL", lock_active=False)

    blend_dir = os.path.join("workspace", "animations")
    char_dir = os.path.join(args.out_dir, "Characters")
    rep_dir = os.path.join(args.out_dir, "Reports")
    os.makedirs(blend_dir, exist_ok=True)
    os.makedirs(char_dir, exist_ok=True)
    os.makedirs(rep_dir, exist_ok=True)

    blend_path = os.path.join(blend_dir, f"{args.name}_walk.blend")
    fbx_out = os.path.join(char_dir, f"{args.name}_walk.fbx")
    glb_out = os.path.join(char_dir, f"{args.name}_walk.glb")

    bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(blend_path))

    bpy.ops.export_scene.fbx(
        filepath=fbx_out,
        use_selection=False,
        bake_anim=True,
        bake_anim_use_all_actions=False,
        bake_anim_use_nla_strips=False,
        add_leaf_bones=False,
    )
    bpy.ops.export_scene.gltf(
        filepath=glb_out,
        export_format="GLB",
        export_animations=True,
    )

    fbx_check = verify_reimport(fbx_out, is_glb=False)
    glb_check = verify_reimport(glb_out, is_glb=True)

    qa = {
        "character": args.name,
        "source_fbx": args.fbx,
        "blender_version": blender_version,
        "clip_name": clip_name,
        "fps": 30,
        "duration_sec": 1.0,
        "stride_length_m": 1.35,
        "intended_speed_mps": 1.35,
        "locomotion_type": "IN-PLACE",
        "exports": {
            "blend": blend_path,
            "fbx": fbx_out,
            "glb": glb_out,
        },
        "reimport_verification": {
            "fbx": fbx_check,
            "glb": glb_check,
        },
    }

    qa_path = os.path.join(rep_dir, f"{args.name}_walk_qa.json")
    with open(qa_path, "w", encoding="utf-8") as f:
        json.dump(qa, f, indent=2)
        f.write("\n")

    print(json.dumps(qa, indent=2))
    return 0 if (fbx_check["verified"] and glb_check["verified"]) else 1


if __name__ == "__main__":
    sys.exit(main())
