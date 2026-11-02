"""Tests for **3DModel Pro** High-Poly Character Forge, Subdivision Up-Res & Multi-LOD API."""

from __future__ import annotations

import json
import struct
from pathlib import Path

import pytest
import trimesh
from fastapi.testclient import TestClient

from src.config import PROJECT_ROOT, AppSettings
from src.highpoly_system import (
    HIGHPOLY_ARCHETYPES,
    HighPolyCharacterRequest,
    build_palette_from_request,
    generate_lod_chain_from_mesh,
    hex_to_linear_rgb,
)
from src.pro_server import create_pro_app
from src.ue5_bpy_generator import has_bpy_runtime


def test_hex_to_linear_rgb_and_archetype_palettes() -> None:
    """Hex color conversion & all 4 High-Poly archetypes build valid linear RGB shader dictionaries."""
    lin_white = hex_to_linear_rgb("#FFFFFF")
    assert lin_white == (1.0, 1.0, 1.0)
    lin_black = hex_to_linear_rgb("#000000")
    assert lin_black == (0.0, 0.0, 0.0)

    for arch_id in HIGHPOLY_ARCHETYPES:
        req = HighPolyCharacterRequest(archetype=arch_id, top_hex="#223344")
        pal, swatches = build_palette_from_request(req)
        assert swatches["top_hex"] == "#223344"
        assert "skin" in pal and "denim_dark" in pal and "hair_rgb" in pal
        assert all(0.0 <= c <= 1.0 for c in pal["skin"])


def test_generate_lod_chain_monotonic_reduction(tmp_path: Path) -> None:
    """`generate_lod_chain_from_mesh` produces LOD0..LOD3 `.glb` tiers with monotonically fewer faces."""
    sphere = trimesh.creation.icosphere(subdivisions=5, radius=0.85)  # 20,480 faces
    lod0_path = tmp_path / "lod0.glb"
    sphere.export(str(lod0_path))

    chain = generate_lod_chain_from_mesh(sphere, tmp_path, lod0_path)
    assert len(chain) >= 3
    assert chain[0]["lod"] == "LOD0"
    tris = [entry["triangles"] for entry in chain]
    assert tris == sorted(tris, reverse=True)
    for entry in chain:
        assert (tmp_path / entry["filename"]).is_file()


def test_pro_spa_and_catalog_endpoints(tmp_path: Path) -> None:
    """`create_pro_app` serves the `3DModel Pro` SPA at `/` and catalog at `/api/pro/v1/catalog`."""
    settings = AppSettings(output_dir=tmp_path / "out")
    app = create_pro_app(
        settings=settings,
        library_root=tmp_path / "pro_lib",
        static_dir=PROJECT_ROOT / "web_3dmodel_pro" / "static_bundle",
        seed_flagship_on_boot=False,
    )
    client = TestClient(app)

    root = client.get("/")
    assert root.status_code == 200
    assert "3DModel Pro" in root.text

    health = client.get("/api/pro/v1/health")
    assert health.status_code == 200
    assert health.json()["product"] == "3DModel Pro Studio"

    cat = client.get("/api/pro/v1/catalog")
    assert cat.status_code == 200
    body = cat.json()
    assert body["product_name"] == "3DModel Pro"
    assert len(body["archetypes"]) == 4
    assert len(body["subsurf_tiers"]) == 3


@pytest.mark.skipif(not has_bpy_runtime(), reason="Blender Python (`bpy`) requires Linux x86_64 Python 3.11")
def test_pro_character_forge_and_upres_pipeline(tmp_path: Path) -> None:
    """`POST /api/pro/v1/generate/character` & `/api/pro/v1/upres` build High-Poly + Multi-LOD assets."""
    settings = AppSettings(output_dir=tmp_path / "out")
    app = create_pro_app(
        settings=settings,
        library_root=tmp_path / "pro_lib",
        seed_flagship_on_boot=False,
    )
    client = TestClient(app)

    # 1. Generate a Cyber Techwear High-Poly Textured Character with Multi-LOD chain
    char_resp = client.post(
        "/api/pro/v1/generate/character",
        data={
            "title": "SK_UE5_CyberTest",
            "archetype": "ue5_cyber_techwear",
            "subsurf_level": "1",
            "texture_resolution": "512",
            "cycles_samples": "0",
            "generate_lods": "true",
            "shoulder_scale": "1.04",
        },
    )
    assert char_resp.status_code == 200
    char_data = char_resp.json()
    char_id = char_data["model_id"]
    assert char_data["triangles"] > 60_000
    assert char_data["bone_count"] == 23
    assert char_data["embedded_texture_count"] >= 18
    assert len(char_data["texture_maps"]) >= 18
    assert len(char_data["lod_chain"]) >= 3
    assert char_data["fbx_url"] is not None

    # Fetch detail & verify 3D skeleton bone positions + PBR texture URLs
    detail = client.get(f"/api/pro/v1/models/{char_id}").json()
    assert "skeleton" in detail
    assert len(detail["skeleton"]["bones"]) == 23
    tex_resp = client.get(detail["texture_maps"][0]["url"])
    assert tex_resp.status_code == 200
    assert tex_resp.headers["content-type"] == "image/png"

    # Download LOD0 GLB & inspect glTF JSON chunk for embedded PBR textures + 100% UV coverage
    glb_resp = client.get(char_data["primary_glb_url"])
    assert glb_resp.status_code == 200 and len(glb_resp.content) > 2_000_000
    jlen, _ = struct.unpack("<I4s", glb_resp.content[12:20])
    gltf = json.loads(glb_resp.content[20 : 20 + jlen].decode("utf-8"))
    assert len(gltf.get("textures", [])) >= 18
    assert all("TEXCOORD_0" in m["primitives"][0]["attributes"] for m in gltf["meshes"])

    zip_resp = client.get(char_data["pack_zip_url"])
    assert zip_resp.status_code == 200 and len(zip_resp.content) > 1_000_000

    # 2. Test Universal High-Poly Up-Res endpoint on an uploaded `.glb` mesh
    base_capsule = trimesh.creation.capsule(height=1.2, radius=0.22, count=[16, 16])
    base_capsule.apply_translation([0.0, 0.85, 0.0])
    raw_glb_path = tmp_path / "lowpoly.glb"
    base_capsule.export(str(raw_glb_path))

    with raw_glb_path.open("rb") as fh:
        up_resp = client.post(
            "/api/pro/v1/upres",
            data={
                "title": "UpRes_Capsule_Test",
                "subsurf_level": "2",
                "micro_detail": "skin_pores",
                "detail_strength": "0.0012",
                "rigging_backend": "ue5_manny",
                "generate_lods": "true",
            },
            files={"file": ("lowpoly.glb", fh, "model/gltf-binary")},
        )
    assert up_resp.status_code == 200
    up_data = up_resp.json()
    assert up_data["triangles"] > len(base_capsule.faces) * 8
    assert up_data["bone_count"] == 23
    assert up_data["embedded_texture_count"] >= 2
    assert len(up_data["texture_maps"]) >= 2

    # Verify library listing & deletion
    listing = client.get("/api/pro/v1/models").json()
    assert listing["total"] == 2

    del_resp = client.delete(f"/api/pro/v1/models/{char_id}")
    assert del_resp.status_code == 200
    assert client.get("/api/pro/v1/models").json()["total"] == 1
