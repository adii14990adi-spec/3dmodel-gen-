"""3D mesh post-processing: smoothing, quadric decimation, normal repair, UV baking, and GLB/OBJ export."""

from __future__ import annotations

import logging
import zipfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import cv2
import fast_simplification
import numpy as np
import pyvista as pv
import trimesh
from PIL import Image, ImageDraw
from scipy import ndimage

from src.config import PostProcessorConfig, TextureMode
from src.reconstructor import RawReconstructionResult

logger = logging.getLogger(__name__)

# Optional Open3D runtime probe (gracefully degrades on headless machines lacking libEGL.so.1)
try:
    import open3d as o3d  # type: ignore[import-untyped]

    HAS_OPEN3D = True
except Exception:
    o3d = None
    HAS_OPEN3D = False


@dataclass
class PostProcessedResult:
    """Final watertight geometry, textured export mesh, saved artifact paths, and quality metrics."""

    mesh: trimesh.Trimesh
    watertight_geometry: trimesh.Trimesh
    texture_atlas: Image.Image | None
    turnaround_preview: Image.Image
    exported_files: dict[str, Path] = field(default_factory=dict)
    metrics: dict[str, Any] = field(default_factory=dict)


def is_topologically_watertight(mesh: trimesh.Trimesh) -> bool:
    """Verify manifold watertightness, merging UV-seam duplicate vertices if present."""
    if mesh.is_watertight:
        return True
    geom = mesh.copy()
    geom.merge_vertices(merge_tex=True, merge_norm=True)
    geom.update_faces(geom.nondegenerate_faces())
    geom.update_faces(geom.unique_faces())
    geom.remove_unreferenced_vertices()
    return bool(geom.is_watertight)


class MeshPostProcessor:
    """Cleans, smooths, decimates, grounds, textures, and exports reconstructed 3D human meshes."""

    def __init__(self, config: PostProcessorConfig | None = None) -> None:
        self.config = config or PostProcessorConfig()

    def process(
        self,
        raw: RawReconstructionResult,
        output_dir: str | Path | None = None,
        stem: str = "character",
    ) -> PostProcessedResult:
        """Execute post-processing pipeline and optionally export .glb / .obj artifacts."""
        geom = raw.mesh.copy()

        # 1. Remove degenerate/duplicate primitives & stray islands
        geom = self._clean_topology(geom)

        # 2. Volume-preserving Taubin smoothing via PyVista
        if self.config.smoothing_iterations > 0 and len(geom.faces) >= 12:
            geom = self._smooth_taubin(geom)

        # 3. Quadric mesh decimation to target triangle budget
        if self.config.target_faces > 0 and len(geom.faces) > self.config.target_faces:
            geom = self._decimate_mesh(geom, self.config.target_faces)

        # 4. Watertight hole repair & consistent outward normal orientation
        geom = self._repair_watertight_and_normals(geom)

        # Align non-canonical external neural meshes to foreground silhouette span before UV projection
        verts_canonical = self._get_canonical_projection_coords(geom.vertices, raw)

        # 5. Ground feet at Y=0, center X/Z at 0, scale height to target_height (e.g. 1.80m)
        if self.config.normalize_scale:
            geom = self._normalize_humanoid_transform(geom, self.config.target_height)

        watertight_ok = bool(geom.is_watertight)
        winding_ok = bool(geom.is_winding_consistent)
        volume_m3 = float(abs(geom.volume)) if watertight_ok else 0.0
        area_m2 = float(geom.area)

        # 6. Bake crisp Front/Back texture (UV Atlas PBR or welded Vertex Colors)
        if self.config.texture_mode == TextureMode.UV_ATLAS:
            textured_mesh, atlas_img = self._apply_uv_atlas_texture(geom, verts_canonical, raw)
        else:
            textured_mesh = self._apply_vertex_colors(geom, verts_canonical, raw)
            atlas_img = None

        # 7. Render 4-view shaded turnaround sheet for visual QA & UI display
        turnaround = self.render_mesh_turnaround(textured_mesh)

        bounds = geom.bounds.tolist() if len(geom.vertices) > 0 else [[0, 0, 0], [0, 0, 0]]
        extents = geom.extents.tolist() if len(geom.vertices) > 0 else [0.0, 0.0, 0.0]

        metrics: dict[str, Any] = {
            "geometry_vertices": int(len(geom.vertices)),
            "render_vertices": int(len(textured_mesh.vertices)),
            "faces": int(len(textured_mesh.faces)),
            "is_watertight": watertight_ok,
            "is_winding_consistent": winding_ok,
            "euler_number": int(geom.euler_number),
            "volume_m3": round(volume_m3, 5),
            "surface_area_m2": round(area_m2, 5),
            "bounds_m": [[round(v, 4) for v in row] for row in bounds],
            "dimensions_xyz_m": [round(v, 4) for v in extents],
            "texture_mode": self.config.texture_mode.value,
            "open3d_available": HAS_OPEN3D,
        }

        exported: dict[str, Path] = {}
        if output_dir is not None:
            exported = self.export_mesh(
                mesh=textured_mesh,
                atlas_img=atlas_img,
                turnaround_img=turnaround,
                output_dir=Path(output_dir),
                stem=stem,
            )

        return PostProcessedResult(
            mesh=textured_mesh,
            watertight_geometry=geom,
            texture_atlas=atlas_img,
            turnaround_preview=turnaround,
            exported_files=exported,
            metrics=metrics,
        )

    def _clean_topology(self, mesh: trimesh.Trimesh) -> trimesh.Trimesh:
        mesh.merge_vertices()
        mesh.update_faces(mesh.nondegenerate_faces())
        mesh.update_faces(mesh.unique_faces())
        mesh.remove_unreferenced_vertices()

        if self.config.keep_largest_component and len(mesh.faces) > 0:
            parts = mesh.split(only_watertight=False)
            if len(parts) > 1:
                parts_sorted = sorted(parts, key=lambda p: len(p.faces), reverse=True)
                main_faces = len(parts_sorted[0].faces)
                # Retain primary body + any substantial clothing component (>= 2% of main faces)
                kept = [p for p in parts_sorted if len(p.faces) >= max(32, int(main_faces * 0.02))]
                mesh = trimesh.util.concatenate(kept) if len(kept) > 1 else parts_sorted[0]
                mesh.merge_vertices()
        return mesh

    def _smooth_taubin(self, mesh: trimesh.Trimesh) -> trimesh.Trimesh:
        faces_pv = np.hstack(
            [np.full((len(mesh.faces), 1), 3, dtype=np.int64), mesh.faces.astype(np.int64)]
        ).ravel()
        poly = pv.PolyData(mesh.vertices.astype(np.float64), faces_pv)
        smoothed = poly.smooth_taubin(
            n_iter=self.config.smoothing_iterations,
            pass_band=self.config.smoothing_pass_band,
            normalize_coordinates=True,
            boundary_smoothing=False,
            non_manifold_smoothing=False,
        )
        return trimesh.Trimesh(
            vertices=np.asarray(smoothed.points, dtype=np.float64),
            faces=mesh.faces.copy(),
            process=True,
        )

    def _decimate_mesh(self, mesh: trimesh.Trimesh, target_faces: int) -> trimesh.Trimesh:
        current_faces = len(mesh.faces)
        if current_faces <= target_faces:
            return mesh

        # Primary fast Garland-Heckbert quadric simplification (preserves manifold topology cleanly)
        try:
            v_out, f_out = fast_simplification.simplify(
                mesh.vertices.astype(np.float64),
                mesh.faces.astype(np.int64),
                target_count=int(target_faces),
            )
            dec = trimesh.Trimesh(vertices=v_out, faces=f_out, process=True)
            if len(dec.faces) > 0:
                return dec
        except Exception as exc:
            logger.warning("fast_simplification failed (%s); trying Open3D / PyVista fallback.", exc)

        if HAS_OPEN3D and o3d is not None:
            o3d_mesh = o3d.geometry.TriangleMesh(
                o3d.utility.Vector3dVector(mesh.vertices),
                o3d.utility.Vector3iVector(mesh.faces),
            )
            o3d_dec = o3d_mesh.simplify_quadric_decimation(target_number_of_triangles=int(target_faces))
            o3d_dec.remove_degenerate_triangles()
            o3d_dec.remove_duplicated_triangles()
            o3d_dec.remove_duplicated_vertices()
            o3d_dec.remove_unreferenced_vertices()
            return trimesh.Trimesh(
                vertices=np.asarray(o3d_dec.vertices, dtype=np.float64),
                faces=np.asarray(o3d_dec.triangles, dtype=np.int64),
                process=True,
            )

        reduction = float(np.clip(1.0 - (target_faces / float(current_faces)), 0.01, 0.95))
        faces_pv = np.hstack(
            [np.full((len(mesh.faces), 1), 3, dtype=np.int64), mesh.faces.astype(np.int64)]
        ).ravel()
        poly = pv.PolyData(mesh.vertices.astype(np.float64), faces_pv)
        dec_pv = poly.decimate_pro(reduction, preserve_topology=True).triangulate().clean()
        f_pv = dec_pv.faces.reshape(-1, 4)[:, 1:]
        return trimesh.Trimesh(vertices=np.asarray(dec_pv.points, dtype=np.float64), faces=f_pv, process=True)

    def _repair_watertight_and_normals(self, mesh: trimesh.Trimesh) -> trimesh.Trimesh:
        mesh.merge_vertices()
        mesh.update_faces(mesh.nondegenerate_faces())
        mesh.update_faces(mesh.unique_faces())
        mesh.remove_unreferenced_vertices()

        if self.config.fill_holes and not mesh.is_watertight:
            trimesh.repair.fill_holes(mesh)
            if not mesh.is_watertight:
                faces_pv = np.hstack(
                    [np.full((len(mesh.faces), 1), 3, dtype=np.int64), mesh.faces.astype(np.int64)]
                ).ravel()
                poly = pv.PolyData(mesh.vertices.astype(np.float64), faces_pv).fill_holes(hole_size=100.0)
                poly = poly.triangulate().clean()
                if poly.n_cells > 0:
                    f_pv = poly.faces.reshape(-1, 4)[:, 1:]
                    mesh = trimesh.Trimesh(
                        vertices=np.asarray(poly.points, dtype=np.float64),
                        faces=f_pv,
                        process=True,
                    )

        if self.config.clean_normals and len(mesh.faces) > 0:
            trimesh.repair.fix_winding(mesh)
            trimesh.repair.fix_inversion(mesh)
            trimesh.repair.fix_normals(mesh)
            if mesh.is_watertight and mesh.volume < 0.0:
                mesh.invert()

        return mesh

    @staticmethod
    def _get_canonical_projection_coords(
        vertices: np.ndarray,
        raw: RawReconstructionResult,
    ) -> np.ndarray:
        """Return vertex coordinates mapped into the [-1, 1]^2 canonical Front/Back image space."""
        if raw.engine_used in ("volumetric_sdf", "econ") or len(vertices) == 0:
            return vertices.copy()

        # Fit external neural mesh XY bounds onto foreground mask canonical XY span
        s = raw.front_mask.shape[0]
        ys, xs = np.where(raw.front_mask > 96)
        if len(xs) == 0:
            return vertices.copy()

        target_x0 = (float(xs.min()) / (s - 1)) * 2.0 - 1.0
        target_x1 = (float(xs.max()) / (s - 1)) * 2.0 - 1.0
        target_y0 = 1.0 - (float(ys.max()) / (s - 1)) * 2.0
        target_y1 = 1.0 - (float(ys.min()) / (s - 1)) * 2.0

        vmin = vertices.min(axis=0)
        vmax = vertices.max(axis=0)
        span = np.maximum(vmax - vmin, 1e-6)
        out = vertices.copy()
        out[:, 0] = target_x0 + ((vertices[:, 0] - vmin[0]) / span[0]) * (target_x1 - target_x0)
        out[:, 1] = target_y0 + ((vertices[:, 1] - vmin[1]) / span[1]) * (target_y1 - target_y0)
        out[:, 2] = vertices[:, 2] - 0.5 * (vmin[2] + vmax[2])
        return out

    @staticmethod
    def _normalize_humanoid_transform(mesh: trimesh.Trimesh, target_height: float) -> trimesh.Trimesh:
        """Place feet at Y=0, center X and Z at 0, and scale Y height to target_height meters."""
        if len(mesh.vertices) == 0:
            return mesh
        vmin = mesh.vertices.min(axis=0)
        vmax = mesh.vertices.max(axis=0)
        cur_height = max(float(vmax[1] - vmin[1]), 1e-6)
        scale = target_height / cur_height

        cx = 0.5 * float(vmin[0] + vmax[0])
        cz = 0.5 * float(vmin[2] + vmax[2])
        y_floor = float(vmin[1])

        verts = mesh.vertices.copy()
        verts[:, 0] = (verts[:, 0] - cx) * scale
        verts[:, 1] = (verts[:, 1] - y_floor) * scale
        verts[:, 2] = (verts[:, 2] - cz) * scale

        out = trimesh.Trimesh(vertices=verts, faces=mesh.faces.copy(), process=False)
        if out.is_watertight and out.volume < 0.0:
            out.invert()
        return out

    def _apply_uv_atlas_texture(
        self,
        geom: trimesh.Trimesh,
        verts_canonical: np.ndarray,
        raw: RawReconstructionResult,
    ) -> tuple[trimesh.Trimesh, Image.Image]:
        """Bake a seamless Front|Back 2-tile PBR UV Texture Atlas and assign face-corner UVs."""
        tile_res = max(256, self.config.texture_resolution // 2)

        # Harmonize silhouette rim colors between Front and Back so the side UV seam is invisible
        f_img = cv2.resize(raw.front_rgb_dilated, (tile_res, tile_res), interpolation=cv2.INTER_LANCZOS4)
        b_img = cv2.resize(raw.back_rgb_dilated, (tile_res, tile_res), interpolation=cv2.INTER_LANCZOS4)
        f_msk = cv2.resize(raw.front_mask, (tile_res, tile_res), interpolation=cv2.INTER_LINEAR) > 110
        b_msk = cv2.resize(raw.back_mask, (tile_res, tile_res), interpolation=cv2.INTER_LINEAR) > 110

        b_img_world = b_img[:, ::-1, :].astype(np.float32)
        f_img_f = f_img.astype(np.float32)
        rim_avg_world = 0.5 * (f_img_f + b_img_world)

        # Blend toward rim_avg within 5px of silhouette boundary and everywhere outside silhouette
        df_in = ndimage.distance_transform_edt(f_msk).astype(np.float32)
        wf_interior = np.clip((df_in - 1.0) / 5.0, 0.0, 1.0)[..., None]
        front_tile = (f_img_f * wf_interior + rim_avg_world * (1.0 - wf_interior)).astype(np.uint8)

        db_in = ndimage.distance_transform_edt(b_msk).astype(np.float32)
        wb_interior = np.clip((db_in - 1.0) / 5.0, 0.0, 1.0)[..., None]
        rim_avg_back_cam = rim_avg_world[:, ::-1, :]
        back_tile = (b_img.astype(np.float32) * wb_interior + rim_avg_back_cam * (1.0 - wb_interior)).astype(
            np.uint8
        )

        atlas_arr = np.concatenate([front_tile, back_tile], axis=1)
        atlas_pil = Image.fromarray(atlas_arr, mode="RGB")

        # Assign each triangle strictly to Front tile [0, 0.5] or Back tile [0.5, 1.0]
        faces = geom.faces
        face_normals = geom.face_normals
        face_z_cent = verts_canonical[faces, 2].mean(axis=1)
        # Prefer normal orientation, breaking ties near nz == 0 with z centroid
        is_front_face = (face_normals[:, 2] + 0.15 * np.sign(face_z_cent)) >= 0.0

        tri_verts_world = geom.vertices[faces.reshape(-1)]
        tri_verts_can = verts_canonical[faces.reshape(-1)]
        is_front_corner = np.repeat(is_front_face, 3)

        u_local_f = np.clip((tri_verts_can[:, 0] + 1.0) * 0.5, 0.004, 0.996)
        u_local_b = np.clip((1.0 - tri_verts_can[:, 0]) * 0.5, 0.004, 0.996)
        v_local = np.clip((tri_verts_can[:, 1] + 1.0) * 0.5, 0.004, 0.996)

        u_atlas = np.where(is_front_corner, 0.5 * u_local_f, 0.5 + 0.5 * u_local_b)
        uv_corners = np.column_stack([u_atlas, v_local]).astype(np.float64)

        # Deduplicate (vertex_id, is_front_hemisphere) pairs so interior vertices remain shared
        corner_vids = faces.reshape(-1)
        keys = corner_vids.astype(np.int64) * 2 + is_front_corner.astype(np.int64)
        _, unique_first, inv_indices = np.unique(keys, return_index=True, return_inverse=True)

        unique_verts = tri_verts_world[unique_first]
        unique_uvs = uv_corners[unique_first]
        new_faces = inv_indices.reshape(-1, 3)

        material = trimesh.visual.material.PBRMaterial(
            name="Auto3DHumanMaterial",
            baseColorTexture=atlas_pil,
            metallicFactor=0.04,
            roughnessFactor=0.84,
            doubleSided=False,
        )
        visual = trimesh.visual.TextureVisuals(uv=unique_uvs, image=atlas_pil, material=material)
        textured = trimesh.Trimesh(
            vertices=unique_verts,
            faces=new_faces,
            visual=visual,
            process=False,
        )
        return textured, atlas_pil

    @staticmethod
    def _apply_vertex_colors(
        geom: trimesh.Trimesh,
        verts_canonical: np.ndarray,
        raw: RawReconstructionResult,
    ) -> trimesh.Trimesh:
        """Bake normal-blended RGBA vertex colors directly onto welded watertight geometry."""
        s = raw.front_rgb_dilated.shape[0]
        cols_f = np.clip((verts_canonical[:, 0] + 1.0) * 0.5 * (s - 1), 0.0, s - 1.0)
        cols_b = np.clip((1.0 - verts_canonical[:, 0]) * 0.5 * (s - 1), 0.0, s - 1.0)
        rows = np.clip((1.0 - verts_canonical[:, 1]) * 0.5 * (s - 1), 0.0, s - 1.0)

        front_samples = np.stack(
            [
                ndimage.map_coordinates(raw.front_rgb_dilated[:, :, ch], [rows, cols_f], order=1)
                for ch in range(3)
            ],
            axis=-1,
        )
        back_samples = np.stack(
            [
                ndimage.map_coordinates(raw.back_rgb_dilated[:, :, ch], [rows, cols_b], order=1)
                for ch in range(3)
            ],
            axis=-1,
        )

        nz = geom.vertex_normals[:, 2]
        w_front = np.clip(0.5 + (nz / 0.30) * 0.5, 0.0, 1.0)[:, None]
        rgb = np.clip(front_samples * w_front + back_samples * (1.0 - w_front), 0.0, 255.0).astype(np.uint8)
        rgba = np.hstack([rgb, np.full((len(rgb), 1), 255, dtype=np.uint8)])

        colored = geom.copy()
        colored.visual = trimesh.visual.ColorVisuals(mesh=colored, vertex_colors=rgba)
        return colored

    def export_mesh(
        self,
        mesh: trimesh.Trimesh,
        atlas_img: Image.Image | None,
        turnaround_img: Image.Image | None,
        output_dir: Path,
        stem: str = "character",
    ) -> dict[str, Path]:
        """Export textured 3D mesh to .glb, .obj (+ .mtl + texture + .zip), and diagnostic PNGs."""
        output_dir.mkdir(parents=True, exist_ok=True)
        saved: dict[str, Path] = {}

        if "glb" in self.config.export_formats:
            glb_path = output_dir / f"{stem}.glb"
            mesh.export(str(glb_path), file_type="glb")
            saved["glb"] = glb_path

        if "obj" in self.config.export_formats:
            obj_dir = output_dir / f"{stem}_obj"
            obj_dir.mkdir(parents=True, exist_ok=True)
            obj_inner = obj_dir / f"{stem}.obj"
            mesh.export(str(obj_inner), file_type="obj")

            # Also write top-level .obj (and copy companion .mtl/.png) for direct CLI usage
            top_obj = output_dir / f"{stem}.obj"
            mesh.export(str(top_obj), file_type="obj")
            saved["obj"] = top_obj

            # Package self-contained OBJ + MTL + texture PNG bundle for easy web download
            zip_path = output_dir / f"{stem}_obj_bundle.zip"
            with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
                for item in sorted(obj_dir.iterdir()):
                    if item.is_file():
                        zf.write(item, arcname=item.name)
            saved["obj_bundle"] = zip_path

        if atlas_img is not None:
            atlas_path = output_dir / "texture_atlas.png"
            atlas_img.save(atlas_path, format="PNG")
            saved["texture_atlas"] = atlas_path

        if turnaround_img is not None:
            turn_path = output_dir / "mesh_turnaround.png"
            turnaround_img.save(turn_path, format="PNG")
            saved["turnaround_preview"] = turn_path

        return saved

    @staticmethod
    def render_mesh_turnaround(
        mesh: trimesh.Trimesh,
        panel_size: int = 340,
        angles_deg: tuple[float, ...] = (0.0, 45.0, 90.0, 180.0),
    ) -> Image.Image:
        """Software z-buffer rasterizer rendering multi-angle shaded views of the final 3D mesh."""
        if len(mesh.vertices) == 0 or len(mesh.faces) == 0:
            return Image.new("RGB", (panel_size * len(angles_deg), panel_size), (28, 32, 40))

        # Extract per-vertex RGB colors (sampling from TextureVisuals if UV-mapped)
        try:
            color_vis = mesh.visual.to_color()
            v_colors = np.asarray(color_vis.vertex_colors[:, :3], dtype=np.float32) / 255.0
        except Exception:
            v_colors = np.full((len(mesh.vertices), 3), 0.72, dtype=np.float32)

        verts = np.asarray(mesh.vertices, dtype=np.float32)
        faces = np.asarray(mesh.faces, dtype=np.int32)
        v_normals = np.asarray(mesh.vertex_normals, dtype=np.float32)

        vmin = verts.min(axis=0)
        vmax = verts.max(axis=0)
        center = 0.5 * (vmin + vmax)
        max_extent = float(max(vmax[1] - vmin[1], vmax[0] - vmin[0], 1e-4))
        scale = (panel_size * 0.84) / max_extent

        light_dir = np.array([0.30, 0.42, 0.86], dtype=np.float32)
        light_dir /= np.linalg.norm(light_dir)

        panels: list[np.ndarray] = []
        labels = {0.0: "0° Front", 45.0: "45° Quarter", 90.0: "90° Profile", 180.0: "180° Back"}

        for deg in angles_deg:
            rad = np.deg2rad(deg)
            c, s = float(np.cos(rad)), float(np.sin(rad))
            rot = np.array([[c, 0.0, s], [0.0, 1.0, 0.0], [-s, 0.0, c]], dtype=np.float32)

            v_centered = verts - center[None, :]
            v_rot = v_centered @ rot.T
            n_rot = v_normals @ rot.T

            # Back-face culling & depth sorting (painter's algorithm + OpenCV anti-aliased triangles)
            tri_v = v_rot[faces]
            tri_fn = np.cross(tri_v[:, 1] - tri_v[:, 0], tri_v[:, 2] - tri_v[:, 0])
            front_facing = tri_fn[:, 2] > -1e-7
            vis_faces = faces[front_facing]

            canvas = np.full((panel_size, panel_size, 3), (30, 35, 46), dtype=np.uint8)
            # Subtle floor line
            floor_y = int(round(panel_size * 0.5 - (vmin[1] - center[1]) * scale))
            cv2.line(canvas, (20, floor_y), (panel_size - 20, floor_y), (52, 60, 78), 1, cv2.LINE_AA)

            if len(vis_faces) > 0:
                tri_z = v_rot[vis_faces, 2].mean(axis=1)
                order = np.argsort(tri_z)  # Back-to-front
                vis_faces = vis_faces[order]

                ndotl = np.clip(n_rot @ light_dir, 0.0, 1.0)
                shade = 0.42 + 0.58 * ndotl[:, None]
                lit_vcol = np.clip(v_colors * shade * 255.0, 0.0, 255.0)

                sx = (v_rot[:, 0] * scale + panel_size * 0.5).astype(np.int32)
                sy = (panel_size * 0.5 - v_rot[:, 1] * scale).astype(np.int32)
                pts_2d = np.column_stack([sx, sy])

                tri_pts = pts_2d[vis_faces]
                tri_cols = lit_vcol[vis_faces].mean(axis=1).astype(np.uint8)
                for pts, col in zip(tri_pts, tri_cols, strict=False):
                    cv2.fillConvexPoly(canvas, pts, (int(col[0]), int(col[1]), int(col[2])))

            pil_p = Image.fromarray(canvas)
            draw = ImageDraw.Draw(pil_p)
            lbl = labels.get(deg, f"{int(deg)}°")
            draw.text((12, 10), lbl, fill=(210, 220, 238))
            panels.append(np.asarray(pil_p))

        sep = np.full((panel_size, 2, 3), (50, 58, 74), dtype=np.uint8)
        interleaved: list[np.ndarray] = []
        for idx, p in enumerate(panels):
            if idx > 0:
                interleaved.append(sep)
            interleaved.append(p)
        return Image.fromarray(np.concatenate(interleaved, axis=1))
