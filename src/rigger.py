"""Auto-rigging & standard humanoid armature injection into exported .glb assets.

Supports:
- `builtin_humanoid`: Fits a 25-joint Mixamo/Unity-compatible humanoid skeleton to the
  watertight T-pose mesh, computes Laplacian heat-diffused Linear Blend Skinning (LBS)
  weights, and injects glTF 2.0 `skins`, `JOINTS_0`, `WEIGHTS_0`, and `inverseBindMatrices`
  directly into the binary `.glb`.
- `smplx`: Modular connector transferring skinning weights & joint hierarchy from an SMPL-X
  parametric body model template (`.npz` / `.pkl`).
- `blender`: Modular connector invoking headless `blender --background --python` automatic
  bone-heat weighting (`ARMATURE_AUTO`).
"""

from __future__ import annotations

import json
import logging
import shutil
import struct
import subprocess
import tempfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import trimesh
from PIL import Image, ImageDraw
from scipy import sparse
from scipy.spatial import cKDTree

from src.config import RiggingBackend, RiggingConfig

logger = logging.getLogger(__name__)


# Standard 25-Joint Humanoid Definition: (name, parent_index, anatomical_region)
# Coordinate convention: +Y up, +Z forward, +X character's LEFT, -X character's RIGHT
HUMANOID_BONE_SPECS: list[tuple[str, int, str]] = [
    ("Hips", -1, "pelvis"),  # 0 (root)
    ("Spine", 0, "spine"),  # 1
    ("Spine1", 1, "spine"),  # 2
    ("Spine2", 2, "chest"),  # 3
    ("Neck", 3, "neck"),  # 4
    ("Head", 4, "head"),  # 5
    ("HeadTop_End", 5, "head"),  # 6
    ("LeftShoulder", 3, "left_arm"),  # 7  (+X clavicle)
    ("LeftArm", 7, "left_arm"),  # 8  (+X shoulder)
    ("LeftForeArm", 8, "left_arm"),  # 9  (+X elbow)
    ("LeftHand", 9, "left_arm"),  # 10 (+X wrist)
    ("LeftHandMiddle1", 10, "left_arm"),  # 11 (+X hand tip)
    ("RightShoulder", 3, "right_arm"),  # 12 (-X clavicle)
    ("RightArm", 12, "right_arm"),  # 13 (-X shoulder)
    ("RightForeArm", 13, "right_arm"),  # 14 (-X elbow)
    ("RightHand", 14, "right_arm"),  # 15 (-X wrist)
    ("RightHandMiddle1", 15, "right_arm"),  # 16 (-X hand tip)
    ("LeftUpLeg", 0, "left_leg"),  # 17 (+X hip)
    ("LeftLeg", 17, "left_leg"),  # 18 (+X knee)
    ("LeftFoot", 18, "left_leg"),  # 19 (+X ankle)
    ("LeftToeBase", 19, "left_leg"),  # 20 (+X forefoot)
    ("RightUpLeg", 0, "right_leg"),  # 21 (-X hip)
    ("RightLeg", 21, "right_leg"),  # 22 (-X knee)
    ("RightFoot", 22, "right_leg"),  # 23 (-X ankle)
    ("RightToeBase", 23, "right_leg"),  # 24 (-X forefoot)
]


@dataclass
class RiggedSkeleton:
    """Fitted 3D joint positions, hierarchy, and skinning metadata."""

    joint_names: list[str]
    parent_indices: list[int]
    joint_positions: np.ndarray  # (J, 3) float64 world bind positions in meters
    regions: list[str]
    backend_used: str = "builtin_humanoid"
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        bones = []
        for idx, (name, parent, reg) in enumerate(
            zip(self.joint_names, self.parent_indices, self.regions, strict=True)
        ):
            pos = [round(float(v), 5) for v in self.joint_positions[idx]]
            bones.append(
                {
                    "index": idx,
                    "name": name,
                    "parent": parent,
                    "region": reg,
                    "world_position_m": pos,
                }
            )
        return {
            "armature_name": "Auto3DHumanoidArmature",
            "backend_used": self.backend_used,
            "joint_count": len(self.joint_names),
            "bones": bones,
            "metadata": self.metadata,
        }


@dataclass
class RiggingResult:
    """Artifacts and telemetry produced by the humanoid auto-rigging stage."""

    skeleton: RiggedSkeleton
    preview_image: Image.Image
    rigged_glb_path: Path | None = None
    skeleton_json_path: Path | None = None


class AutoRigger:
    """Fits a standard humanoid armature to a T-pose character and injects glTF 2.0 skinning."""

    def __init__(self, config: RiggingConfig | None = None) -> None:
        self.config = config or RiggingConfig()

    def rig_and_inject(
        self,
        watertight_mesh: trimesh.Trimesh,
        glb_path: Path | None = None,
        output_dir: Path | None = None,
    ) -> RiggingResult | None:
        """Fit humanoid skeleton, inject LBS skinning into `.glb`, and render rig preview."""
        if not self.config.enabled or self.config.backend == RiggingBackend.NONE:
            return None
        if len(watertight_mesh.vertices) < 16 or len(watertight_mesh.faces) < 16:
            return None

        backend = self.config.backend
        if backend == RiggingBackend.SMPLX:
            if self.config.smplx_model_path and Path(self.config.smplx_model_path).is_file():
                skeleton, joints_idx, weights_val = self._rig_with_smplx(watertight_mesh)
            elif self.config.allow_fallback:
                logger.warning("SMPL-X model not found; falling back to 'builtin_humanoid' rigger.")
                skeleton, joints_idx, weights_val = self._rig_builtin_humanoid(watertight_mesh)
            else:
                raise FileNotFoundError(f"SMPL-X model file not found: {self.config.smplx_model_path}")
        elif backend == RiggingBackend.BLENDER:
            blender_bin = shutil.which(self.config.blender_executable)
            if blender_bin is not None and glb_path is not None and glb_path.is_file():
                skeleton, joints_idx, weights_val = self._rig_builtin_humanoid(watertight_mesh)
                self._run_blender_auto_rig(Path(blender_bin), glb_path, skeleton)
                skeleton.backend_used = "blender"
                preview = self.render_skeleton_preview(watertight_mesh, skeleton)
                json_p = self._save_rig_artifacts(skeleton, preview, output_dir)
                return RiggingResult(
                    skeleton=skeleton,
                    preview_image=preview,
                    rigged_glb_path=glb_path,
                    skeleton_json_path=json_p,
                )
            if self.config.allow_fallback:
                logger.warning("Blender executable not found; falling back to 'builtin_humanoid' rigger.")
                skeleton, joints_idx, weights_val = self._rig_builtin_humanoid(watertight_mesh)
            else:
                raise RuntimeError(
                    f"Blender executable '{self.config.blender_executable}' not found in PATH."
                )
        else:
            skeleton, joints_idx, weights_val = self._rig_builtin_humanoid(watertight_mesh)

        rigged_path: Path | None = None
        if glb_path is not None and glb_path.is_file():
            self.inject_gltf_skin_into_glb(
                glb_path=glb_path,
                source_vertices=np.asarray(watertight_mesh.vertices, dtype=np.float64),
                source_joints=joints_idx,
                source_weights=weights_val,
                skeleton=skeleton,
            )
            rigged_path = glb_path

        preview = self.render_skeleton_preview(watertight_mesh, skeleton)
        json_path = self._save_rig_artifacts(skeleton, preview, output_dir)

        return RiggingResult(
            skeleton=skeleton,
            preview_image=preview,
            rigged_glb_path=rigged_path,
            skeleton_json_path=json_path,
        )

    @staticmethod
    def _save_rig_artifacts(
        skeleton: RiggedSkeleton,
        preview: Image.Image,
        output_dir: Path | None,
    ) -> Path | None:
        if output_dir is None:
            return None
        output_dir.mkdir(parents=True, exist_ok=True)
        preview.save(output_dir / "rig_preview.png", format="PNG")
        json_path = output_dir / "skeleton_rig.json"
        json_path.write_text(json.dumps(skeleton.to_dict(), indent=2), encoding="utf-8")
        return json_path

    def _rig_builtin_humanoid(
        self,
        mesh: trimesh.Trimesh,
    ) -> tuple[RiggedSkeleton, np.ndarray, np.ndarray]:
        """Estimate 25 anatomical T-pose joints and compute heat-diffused LBS weights."""
        skeleton = self.fit_humanoid_skeleton(mesh)
        joints_idx, weights_val = self.compute_lbs_skin_weights(
            mesh=mesh,
            skeleton=skeleton,
            smooth_iterations=self.config.weight_smooth_iterations,
        )
        return skeleton, joints_idx, weights_val

    def _rig_with_smplx(
        self,
        mesh: trimesh.Trimesh,
    ) -> tuple[RiggedSkeleton, np.ndarray, np.ndarray]:
        """Transfer skinning weights from an SMPL-X `.npz` template onto the reconstructed T-pose mesh."""
        assert self.config.smplx_model_path is not None
        data = np.load(self.config.smplx_model_path, allow_pickle=True)
        v_tmpl = np.asarray(data["v_template"], dtype=np.float64)
        weights_tmpl = np.asarray(data["weights"], dtype=np.float32)[:, :22]

        # Normalize SMPL-X template height & ground plane to match mesh bounds
        m_min, m_max = mesh.vertices.min(axis=0), mesh.vertices.max(axis=0)
        t_min, t_max = v_tmpl.min(axis=0), v_tmpl.max(axis=0)
        scale = float((m_max[1] - m_min[1]) / max(t_max[1] - t_min[1], 1e-6))
        t_origin = np.array([0.5 * (t_min[0] + t_max[0]), t_min[1], 0.5 * (t_min[2] + t_max[2])])
        v_aligned = (v_tmpl - t_origin) * scale

        tree = cKDTree(v_aligned)
        _, idx = tree.query(mesh.vertices, k=1)
        transferred = weights_tmpl[idx]

        # Pad to 25 bones or map top-4 influences
        top4 = np.argsort(transferred, axis=1)[:, -4:][:, ::-1]
        w4 = np.take_along_axis(transferred, top4, axis=1)
        w4 /= np.maximum(w4.sum(axis=1, keepdims=True), 1e-6)

        skeleton = self.fit_humanoid_skeleton(mesh)
        skeleton.backend_used = "smplx"
        return skeleton, top4.astype(np.uint16), w4.astype(np.float32)

    @staticmethod
    def _run_blender_auto_rig(blender_bin: Path, glb_path: Path, skeleton: RiggedSkeleton) -> None:
        """Invoke headless blender-python to build armature and apply bone-heat automatic weights."""
        rig_json = json.dumps(skeleton.to_dict())
        script = f"""
import bpy, json
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath={str(glb_path)!r})
mesh_objs = [o for o in bpy.data.objects if o.type == 'MESH']
rig_data = json.loads({rig_json!r})
arm_data = bpy.data.armatures.new('Auto3DHumanoidArmature')
arm_obj = bpy.data.objects.new('Armature', arm_data)
bpy.context.collection.objects.link(arm_obj)
bpy.context.view_layer.objects.active = arm_obj
bpy.ops.object.mode_set(mode='EDIT')
ebones = []
for b in rig_data['bones']:
    eb = arm_data.edit_bones.new(b['name'])
    x, y, z = b['world_position_m']
    eb.head = (x, -z, y)
    eb.tail = (x, -z, y + 0.06)
    if b['parent'] >= 0:
        eb.parent = ebones[b['parent']]
    ebones.append(eb)
bpy.ops.object.mode_set(mode='OBJECT')
for m in mesh_objs:
    m.select_set(True)
arm_obj.select_set(True)
bpy.context.view_layer.objects.active = arm_obj
bpy.ops.object.parent_set(type='ARMATURE_AUTO')
bpy.ops.export_scene.gltf(filepath={str(glb_path)!r}, export_format='GLB')
"""
        with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as tf:
            tf.write(script)
            script_path = tf.name
        try:
            subprocess.run(
                [str(blender_bin), "--background", "--python", script_path],
                check=True,
                capture_output=True,
                timeout=90,
            )
        finally:
            Path(script_path).unlink(missing_ok=True)

    @staticmethod
    def fit_humanoid_skeleton(mesh: trimesh.Trimesh) -> RiggedSkeleton:
        """Fit a 25-bone standard humanoid skeleton inside the normalized T-pose mesh volume."""
        verts = np.asarray(mesh.vertices, dtype=np.float64)
        vmin = verts.min(axis=0)
        vmax = verts.max(axis=0)
        y0 = float(vmin[1])
        h = max(float(vmax[1] - vmin[1]), 0.1)

        # Helper to estimate interior Z midpoint between anterior & posterior walls at height y
        def _z_at(
            y_val: float,
            x_lo: float,
            x_hi: float,
            dy: float = 0.032,
            spine_bias: float = 0.0,
        ) -> float:
            band = (np.abs(verts[:, 1] - y_val) <= dy * h) & (verts[:, 0] >= x_lo) & (verts[:, 0] <= x_hi)
            zs = verts[band, 2]
            if len(zs) < 4:
                band_y = np.abs(verts[:, 1] - y_val) <= dy * h * 2.0
                zs = verts[band_y, 2]
            if len(zs) == 0:
                return 0.0
            z_lo, z_hi = float(np.percentile(zs, 6)), float(np.percentile(zs, 94))
            return 0.5 * (z_lo + z_hi) + spine_bias * (z_hi - z_lo)

        # 1. Detect outstretched T-pose arm axis & fingertip spans
        max_abs_x = max(float(np.max(np.abs(verts[:, 0]))), 0.15 * h)
        outer_arms = (np.abs(verts[:, 0]) > 0.38 * max_abs_x) & (verts[:, 1] > y0 + 0.58 * h)
        if np.any(outer_arms):
            y_arm = float(np.median(verts[outer_arms, 1]))
            z_arm = float(np.median(verts[outer_arms, 2]))
            left_arm_v = verts[outer_arms & (verts[:, 0] > 0)]
            right_arm_v = verts[outer_arms & (verts[:, 0] < 0)]
            x_left_tip = float(np.percentile(left_arm_v[:, 0], 97)) if len(left_arm_v) > 0 else max_abs_x
            x_right_tip = float(np.percentile(right_arm_v[:, 0], 3)) if len(right_arm_v) > 0 else -max_abs_x
        else:
            y_arm = y0 + 0.78 * h
            z_arm = 0.0
            x_left_tip = max_abs_x * 0.95
            x_right_tip = -max_abs_x * 0.95

        # 2. Detect left (+X) and right (-X) leg column centers
        mid_legs = (verts[:, 1] >= y0 + 0.15 * h) & (verts[:, 1] <= y0 + 0.42 * h)
        left_leg_v = verts[mid_legs & (verts[:, 0] > 0.005 * h)]
        right_leg_v = verts[mid_legs & (verts[:, 0] < -0.005 * h)]
        x_leg_l = float(np.median(left_leg_v[:, 0])) if len(left_leg_v) > 0 else 0.065 * h
        x_leg_r = float(np.median(right_leg_v[:, 0])) if len(right_leg_v) > 0 else -0.065 * h

        # Shoulder X span at torso/deltoid junction
        chest_band = (np.abs(verts[:, 1] - (y_arm - 0.06 * h)) < 0.04 * h) & (
            np.abs(verts[:, 0]) < 0.30 * max_abs_x
        )
        torso_hw = float(np.percentile(np.abs(verts[chest_band, 0]), 92)) if np.any(chest_band) else 0.11 * h
        x_clav_l = min(0.45 * torso_hw, 0.25 * x_left_tip)
        x_shld_l = min(1.02 * torso_hw, 0.34 * x_left_tip)
        x_clav_r = -x_clav_l
        x_shld_r = -x_shld_l

        # Spine & Head heights
        y_hips = y0 + 0.52 * h
        y_spine = y0 + 0.59 * h
        y_spine1 = y0 + 0.665 * h
        y_spine2 = min(y_arm - 0.02 * h, y0 + 0.745 * h)
        y_neck = max(y_arm + 0.03 * h, y0 + 0.825 * h)
        y_head = y0 + 0.885 * h
        y_head_top = y0 + 0.985 * h

        # Leg heights & toe forward projection
        y_upleg = y0 + 0.495 * h
        y_knee = y0 + 0.275 * h
        y_ankle = y0 + 0.055 * h
        y_toe = y0 + 0.018 * h

        foot_l = (verts[:, 1] <= y0 + 0.05 * h) & (verts[:, 0] > 0)
        foot_r = (verts[:, 1] <= y0 + 0.05 * h) & (verts[:, 0] < 0)
        z_toe_l = float(np.percentile(verts[foot_l, 2], 82)) if np.any(foot_l) else 0.06 * h
        z_toe_r = float(np.percentile(verts[foot_r, 2], 82)) if np.any(foot_r) else 0.06 * h

        # Arm joint X coordinates along outstretched T-pose
        x_elbow_l = x_shld_l + 0.44 * (x_left_tip - x_shld_l)
        x_wrist_l = x_shld_l + 0.82 * (x_left_tip - x_shld_l)
        x_hand_l = x_shld_l + 0.95 * (x_left_tip - x_shld_l)

        x_elbow_r = x_shld_r + 0.44 * (x_right_tip - x_shld_r)
        x_wrist_r = x_shld_r + 0.82 * (x_right_tip - x_shld_r)
        x_hand_r = x_shld_r + 0.95 * (x_right_tip - x_shld_r)

        coords: list[tuple[float, float, float]] = [
            (0.0, y_hips, _z_at(y_hips, -0.06 * h, 0.06 * h, spine_bias=-0.04)),  # 0 Hips
            (0.0, y_spine, _z_at(y_spine, -0.06 * h, 0.06 * h, spine_bias=-0.06)),  # 1 Spine
            (0.0, y_spine1, _z_at(y_spine1, -0.06 * h, 0.06 * h, spine_bias=-0.08)),  # 2 Spine1
            (0.0, y_spine2, _z_at(y_spine2, -0.06 * h, 0.06 * h, spine_bias=-0.06)),  # 3 Spine2
            (0.0, y_neck, _z_at(y_neck, -0.05 * h, 0.05 * h, spine_bias=-0.03)),  # 4 Neck
            (0.0, y_head, _z_at(y_head, -0.06 * h, 0.06 * h, spine_bias=-0.02)),  # 5 Head
            (0.0, y_head_top, _z_at(y_head_top, -0.05 * h, 0.05 * h)),  # 6 HeadTop_End
            (x_clav_l, y_arm, z_arm),  # 7 LeftShoulder
            (x_shld_l, y_arm, z_arm),  # 8 LeftArm
            (x_elbow_l, y_arm, z_arm),  # 9 LeftForeArm
            (x_wrist_l, y_arm, z_arm),  # 10 LeftHand
            (x_hand_l, y_arm, z_arm),  # 11 LeftHandMiddle1
            (x_clav_r, y_arm, z_arm),  # 12 RightShoulder
            (x_shld_r, y_arm, z_arm),  # 13 RightArm
            (x_elbow_r, y_arm, z_arm),  # 14 RightForeArm
            (x_wrist_r, y_arm, z_arm),  # 15 RightHand
            (x_hand_r, y_arm, z_arm),  # 16 RightHandMiddle1
            (x_leg_l * 0.90, y_upleg, _z_at(y_upleg, 0.0, 0.25 * h)),  # 17 LeftUpLeg
            (x_leg_l, y_knee, _z_at(y_knee, 0.0, 0.25 * h)),  # 18 LeftLeg
            (x_leg_l, y_ankle, _z_at(y_ankle, 0.0, 0.25 * h)),  # 19 LeftFoot
            (x_leg_l, y_toe, z_toe_l),  # 20 LeftToeBase
            (x_leg_r * 0.90, y_upleg, _z_at(y_upleg, -0.25 * h, 0.0)),  # 21 RightUpLeg
            (x_leg_r, y_knee, _z_at(y_knee, -0.25 * h, 0.0)),  # 22 RightLeg
            (x_leg_r, y_ankle, _z_at(y_ankle, -0.25 * h, 0.0)),  # 23 RightFoot
            (x_leg_r, y_toe, z_toe_r),  # 24 RightToeBase
        ]

        return RiggedSkeleton(
            joint_names=[s[0] for s in HUMANOID_BONE_SPECS],
            parent_indices=[s[1] for s in HUMANOID_BONE_SPECS],
            joint_positions=np.array(coords, dtype=np.float64),
            regions=[s[2] for s in HUMANOID_BONE_SPECS],
            backend_used="builtin_humanoid",
            metadata={
                "height_m": round(h, 4),
                "arm_y_m": round(y_arm, 4),
                "arm_span_m": round(float(x_left_tip - x_right_tip), 4),
            },
        )

    @staticmethod
    def compute_lbs_skin_weights(
        mesh: trimesh.Trimesh,
        skeleton: RiggedSkeleton,
        smooth_iterations: int = 6,
    ) -> tuple[np.ndarray, np.ndarray]:
        """Compute normalized top-4 `(JOINTS_0, WEIGHTS_0)` via capsule distance + Laplacian diffusion."""
        verts = np.asarray(mesh.vertices, dtype=np.float64)
        n_verts = len(verts)
        j_pos = skeleton.joint_positions
        n_joints = len(j_pos)
        h = max(float(verts[:, 1].max() - verts[:, 1].min()), 0.1)
        y0 = float(verts[:, 1].min())

        # Build bone segment endpoints: each joint controls the segment toward its primary child
        children_map: dict[int, list[int]] = {i: [] for i in range(n_joints)}
        for idx, p in enumerate(skeleton.parent_indices):
            if p >= 0:
                children_map[p].append(idx)

        seg_a = j_pos.copy()
        seg_b = j_pos.copy()
        for j in range(n_joints):
            kids = children_map[j]
            if len(kids) == 1:
                seg_b[j] = j_pos[kids[0]]
            elif j == 3:  # Spine2 -> Neck
                seg_b[j] = j_pos[4]
            elif j == 0:  # Hips -> Spine
                seg_b[j] = j_pos[1]

        # Point-to-segment distance matrix (N_verts, N_joints)
        weights = np.zeros((n_verts, n_joints), dtype=np.float64)
        for j in range(n_joints):
            a = seg_a[j]
            b = seg_b[j]
            ab = b - a
            ab_len2 = float(np.dot(ab, ab))
            if ab_len2 > 1e-8:
                t = np.clip(((verts - a[None, :]) @ ab) / ab_len2, 0.0, 1.0)
                proj = a[None, :] + t[:, None] * ab[None, :]
            else:
                proj = a[None, :]
            dist = np.linalg.norm(verts - proj, axis=1)

            # Anatomical chirality & region gating prevents cross-leg or hand-to-pelvis bleed
            reg = skeleton.regions[j]
            penalty = np.zeros(n_verts, dtype=np.float64)
            if reg == "left_leg":
                penalty += np.where(verts[:, 0] < -0.008 * h, 0.50 * h, 0.0)
                penalty += np.where(verts[:, 1] > y0 + 0.56 * h, 0.45 * h, 0.0)
            elif reg == "right_leg":
                penalty += np.where(verts[:, 0] > 0.008 * h, 0.50 * h, 0.0)
                penalty += np.where(verts[:, 1] > y0 + 0.56 * h, 0.45 * h, 0.0)
            elif reg == "left_arm":
                penalty += np.where(verts[:, 0] < 0.0, 0.50 * h, 0.0)
                penalty += np.where(verts[:, 1] < y0 + 0.62 * h, 0.40 * h, 0.0)
            elif reg == "right_arm":
                penalty += np.where(verts[:, 0] > 0.0, 0.50 * h, 0.0)
                penalty += np.where(verts[:, 1] < y0 + 0.62 * h, 0.40 * h, 0.0)
            elif reg == "head":
                penalty += np.where(verts[:, 1] < y0 + 0.79 * h, 0.50 * h, 0.0)

            eff_d = dist + penalty
            sigma = 0.055 * h if "arm" in reg or "head" in reg else 0.072 * h
            weights[:, j] = np.exp(-((eff_d / sigma) ** 2)) + 1e-5 / (eff_d * eff_d + 1e-3)

        # Normalize before Laplacian heat smoothing
        weights /= np.maximum(weights.sum(axis=1, keepdims=True), 1e-12)

        if smooth_iterations > 0 and len(mesh.faces) > 0:
            edges = mesh.edges_unique
            r_idx = np.concatenate([edges[:, 0], edges[:, 1]])
            c_idx = np.concatenate([edges[:, 1], edges[:, 0]])
            adj = sparse.csr_matrix(
                (np.ones(len(r_idx), dtype=np.float64), (r_idx, c_idx)),
                shape=(n_verts, n_verts),
            )
            deg = np.maximum(np.asarray(adj.sum(axis=1)).ravel(), 1.0)
            inv_deg = sparse.diags(1.0 / deg)
            smooth_op = inv_deg @ adj
            alpha = 0.45
            for _ in range(smooth_iterations):
                weights = (1.0 - alpha) * weights + alpha * (smooth_op @ weights)

        # Keep top-4 bone influences per vertex and strictly renormalize to sum == 1.0
        top4_idx = np.argsort(weights, axis=1)[:, -4:][:, ::-1]
        top4_w = np.take_along_axis(weights, top4_idx, axis=1).astype(np.float32)
        row_sums = np.maximum(top4_w.sum(axis=1, keepdims=True), 1e-8)
        top4_w = top4_w / row_sums
        # Enforce exact float32 unit sum on largest weight channel
        residual = 1.0 - top4_w[:, 1:].sum(axis=1)
        top4_w[:, 0] = np.clip(residual, 0.0, 1.0)

        return top4_idx.astype(np.uint16), top4_w

    @staticmethod
    def inject_gltf_skin_into_glb(
        glb_path: Path,
        source_vertices: np.ndarray,
        source_joints: np.ndarray,
        source_weights: np.ndarray,
        skeleton: RiggedSkeleton,
    ) -> None:
        """Inject glTF 2.0 `skins`, joint `nodes`, `JOINTS_0`, `WEIGHTS_0`, and `inverseBindMatrices`."""
        raw = glb_path.read_bytes()
        if len(raw) < 28 or raw[:4] != b"glTF":
            raise ValueError(f"File is not a valid glTF 2.0 binary (.glb): {glb_path}")

        _, version, _ = struct.unpack_from("<4sII", raw, 0)
        if version != 2:
            raise ValueError(f"Unsupported glTF version {version}; expected 2.")

        json_len, json_type = struct.unpack_from("<I4s", raw, 12)
        if json_type != b"JSON":
            raise ValueError("Malformed GLB: missing JSON chunk.")
        json_end = 20 + json_len
        gltf: dict[str, Any] = json.loads(raw[20:json_end].decode("utf-8"))

        bin_len, bin_type = struct.unpack_from("<I4s", raw, json_end)
        if bin_type != b"BIN\x00":
            raise ValueError("Malformed GLB: missing BIN chunk.")
        bin_buf = bytearray(raw[json_end + 8 : json_end + 8 + bin_len])

        def _align4(buf: bytearray) -> None:
            rem = len(buf) % 4
            if rem:
                buf.extend(b"\x00" * (4 - rem))

        tree = cKDTree(source_vertices)
        accessors: list[dict[str, Any]] = gltf.setdefault("accessors", [])
        buffer_views: list[dict[str, Any]] = gltf.setdefault("bufferViews", [])

        # Attach JOINTS_0 and WEIGHTS_0 to every mesh primitive in the GLB
        for mesh_entry in gltf.get("meshes", []):
            for prim in mesh_entry.get("primitives", []):
                attrs = prim.get("attributes", {})
                if "POSITION" not in attrs:
                    continue
                pos_acc = accessors[attrs["POSITION"]]
                pos_bv = buffer_views[pos_acc["bufferView"]]
                v_count = int(pos_acc["count"])
                base_off = int(pos_bv.get("byteOffset", 0)) + int(pos_acc.get("byteOffset", 0))
                stride = int(pos_bv.get("byteStride", 12))

                glb_positions = np.zeros((v_count, 3), dtype=np.float32)
                for vi in range(v_count):
                    off = base_off + vi * stride
                    glb_positions[vi] = struct.unpack_from("<3f", bin_buf, off)

                # Transfer weights via exact nearest 3D position (seam vertices get identical weights!)
                _, nearest_src = tree.query(glb_positions.astype(np.float64), k=1)
                j_arr = np.ascontiguousarray(source_joints[nearest_src], dtype="<u2")
                w_arr = np.ascontiguousarray(source_weights[nearest_src], dtype="<f4")

                # Append JOINTS_0 (VEC4 UNSIGNED_SHORT = 5123)
                _align4(bin_buf)
                j_offset = len(bin_buf)
                j_bytes = j_arr.tobytes()
                bin_buf.extend(j_bytes)
                j_bv_idx = len(buffer_views)
                buffer_views.append(
                    {
                        "buffer": 0,
                        "byteOffset": j_offset,
                        "byteLength": len(j_bytes),
                        "target": 34962,
                    }
                )
                j_acc_idx = len(accessors)
                accessors.append(
                    {
                        "bufferView": j_bv_idx,
                        "byteOffset": 0,
                        "componentType": 5123,
                        "count": v_count,
                        "type": "VEC4",
                    }
                )

                # Append WEIGHTS_0 (VEC4 FLOAT = 5126)
                _align4(bin_buf)
                w_offset = len(bin_buf)
                w_bytes = w_arr.tobytes()
                bin_buf.extend(w_bytes)
                w_bv_idx = len(buffer_views)
                buffer_views.append(
                    {
                        "buffer": 0,
                        "byteOffset": w_offset,
                        "byteLength": len(w_bytes),
                        "target": 34962,
                    }
                )
                w_acc_idx = len(accessors)
                accessors.append(
                    {
                        "bufferView": w_bv_idx,
                        "byteOffset": 0,
                        "componentType": 5126,
                        "count": v_count,
                        "type": "VEC4",
                    }
                )

                attrs["JOINTS_0"] = j_acc_idx
                attrs["WEIGHTS_0"] = w_acc_idx

        # Build column-major 4x4 inverseBindMatrices for all 25 joints
        n_joints = len(skeleton.joint_names)
        ibm = np.zeros((n_joints, 4, 4), dtype="<f4")
        for j in range(n_joints):
            ibm[j] = np.eye(4, dtype="<f4")
            # Column-major translation in glTF places (-wx, -wy, -wz, 1) in the last 4 floats
            ibm[j, 3, :3] = -skeleton.joint_positions[j].astype("<f4")

        _align4(bin_buf)
        ibm_offset = len(bin_buf)
        ibm_bytes = ibm.tobytes()
        bin_buf.extend(ibm_bytes)
        ibm_bv_idx = len(buffer_views)
        buffer_views.append(
            {
                "buffer": 0,
                "byteOffset": ibm_offset,
                "byteLength": len(ibm_bytes),
            }
        )
        ibm_acc_idx = len(accessors)
        accessors.append(
            {
                "bufferView": ibm_bv_idx,
                "byteOffset": 0,
                "componentType": 5126,
                "count": n_joints,
                "type": "MAT4",
            }
        )

        # Append hierarchical joint nodes + Armature container node
        nodes: list[dict[str, Any]] = gltf.setdefault("nodes", [])
        base_joint_node = len(nodes)
        joint_node_indices = [base_joint_node + j for j in range(n_joints)]

        children_per_joint: list[list[int]] = [[] for _ in range(n_joints)]
        for j, p in enumerate(skeleton.parent_indices):
            if p >= 0:
                children_per_joint[p].append(joint_node_indices[j])

        for j in range(n_joints):
            p = skeleton.parent_indices[j]
            if p < 0:
                rel_t = skeleton.joint_positions[j]
            else:
                rel_t = skeleton.joint_positions[j] - skeleton.joint_positions[p]
            j_node: dict[str, Any] = {
                "name": skeleton.joint_names[j],
                "translation": [float(rel_t[0]), float(rel_t[1]), float(rel_t[2])],
            }
            if children_per_joint[j]:
                j_node["children"] = children_per_joint[j]
            nodes.append(j_node)

        armature_node_idx = len(nodes)
        nodes.append(
            {
                "name": "Auto3DHumanoidArmature",
                "children": [joint_node_indices[0]],
            }
        )

        # Register skin & link to mesh node(s) and scene root
        skin_idx = len(gltf.setdefault("skins", []))
        gltf["skins"].append(
            {
                "name": "Auto3DHumanoidSkin",
                "inverseBindMatrices": ibm_acc_idx,
                "skeleton": joint_node_indices[0],
                "joints": joint_node_indices,
            }
        )

        for node in nodes[:base_joint_node]:
            if "mesh" in node:
                node["skin"] = skin_idx
                # glTF 2.0 spec: skinned mesh node local transform should be identity
                node.pop("matrix", None)
                node.pop("translation", None)
                node.pop("rotation", None)
                node.pop("scale", None)

        scenes = gltf.setdefault("scenes", [{"nodes": []}])
        scene0_nodes: list[int] = scenes[0].setdefault("nodes", [])
        if armature_node_idx not in scene0_nodes:
            scene0_nodes.append(armature_node_idx)

        _align4(bin_buf)
        gltf["buffers"][0]["byteLength"] = len(bin_buf)

        json_bytes = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
        json_pad = (4 - (len(json_bytes) % 4)) % 4
        json_bytes_aligned = json_bytes + (b" " * json_pad)

        total_length = 12 + 8 + len(json_bytes_aligned) + 8 + len(bin_buf)
        out = bytearray()
        out.extend(struct.pack("<4sII", b"glTF", 2, total_length))
        out.extend(struct.pack("<I4s", len(json_bytes_aligned), b"JSON"))
        out.extend(json_bytes_aligned)
        out.extend(struct.pack("<I4s", len(bin_buf), b"BIN\x00"))
        out.extend(bin_buf)

        glb_path.write_bytes(bytes(out))

    @staticmethod
    def render_skeleton_preview(
        mesh: trimesh.Trimesh,
        skeleton: RiggedSkeleton,
        panel_size: int = 380,
    ) -> Image.Image:
        """Render Front (0°) and Profile (90°) diagnostic views overlaying the 25-joint armature."""
        verts = np.asarray(mesh.vertices, dtype=np.float32)
        faces = np.asarray(mesh.faces, dtype=np.int32)
        vmin, vmax = verts.min(axis=0), verts.max(axis=0)
        center = 0.5 * (vmin + vmax)
        span = max(float(vmax[1] - vmin[1]), float(vmax[0] - vmin[0]), 0.1)
        scale = (panel_size * 0.84) / span

        region_colors: dict[str, tuple[int, int, int]] = {
            "pelvis": (250, 204, 21),
            "spine": (56, 189, 248),
            "chest": (56, 189, 248),
            "neck": (167, 139, 250),
            "head": (192, 132, 252),
            "left_arm": (52, 211, 153),
            "right_arm": (251, 113, 133),
            "left_leg": (74, 222, 128),
            "right_leg": (248, 113, 113),
        }

        panels: list[np.ndarray] = []
        for deg, title in ((0.0, "0° Front Armature (25 Joints)"), (90.0, "90° Sagittal Spine & Rig")):
            rad = np.deg2rad(deg)
            c, s = float(np.cos(rad)), float(np.sin(rad))
            rot = np.array([[c, 0.0, s], [0.0, 1.0, 0.0], [-s, 0.0, c]], dtype=np.float32)

            v_rot = (verts - center[None, :]) @ rot.T
            j_rot = (skeleton.joint_positions.astype(np.float32) - center[None, :]) @ rot.T

            canvas = np.full((panel_size, panel_size, 3), (24, 29, 39), dtype=np.uint8)
            floor_y = int(round(panel_size * 0.5 - (vmin[1] - center[1]) * scale))
            cv2.line(canvas, (18, floor_y), (panel_size - 18, floor_y), (52, 62, 82), 1, cv2.LINE_AA)

            # Translucent ghost silhouette of the watertight mesh
            sx = (v_rot[:, 0] * scale + panel_size * 0.5).astype(np.int32)
            sy = (panel_size * 0.5 - v_rot[:, 1] * scale).astype(np.int32)
            pts_2d = np.column_stack([sx, sy])
            sil_layer = canvas.copy()
            for f in faces:
                cv2.fillConvexPoly(sil_layer, pts_2d[f], (64, 78, 102))
            canvas = cv2.addWeighted(sil_layer, 0.62, canvas, 0.38, 0.0)

            # Project joints & draw bone hierarchy links
            jx = (j_rot[:, 0] * scale + panel_size * 0.5).astype(np.int32)
            jy = (panel_size * 0.5 - j_rot[:, 1] * scale).astype(np.int32)

            for idx, p_idx in enumerate(skeleton.parent_indices):
                if p_idx >= 0:
                    col = region_colors.get(skeleton.regions[idx], (220, 230, 245))
                    cv2.line(canvas, (jx[p_idx], jy[p_idx]), (jx[idx], jy[idx]), col, 2, cv2.LINE_AA)

            for idx in range(len(jx)):
                col = region_colors.get(skeleton.regions[idx], (255, 255, 255))
                cv2.circle(canvas, (jx[idx], jy[idx]), 4, (15, 20, 28), -1, cv2.LINE_AA)
                cv2.circle(canvas, (jx[idx], jy[idx]), 3, col, -1, cv2.LINE_AA)

            pil_p = Image.fromarray(canvas)
            draw = ImageDraw.Draw(pil_p)
            draw.text((12, 10), title, fill=(226, 234, 248))
            panels.append(np.asarray(pil_p))

        sep = np.full((panel_size, 2, 3), (50, 58, 74), dtype=np.uint8)
        return Image.fromarray(np.concatenate([panels[0], sep, panels[1]], axis=1))
