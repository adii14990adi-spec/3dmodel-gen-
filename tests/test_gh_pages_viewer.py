"""Tests for the static GitHub Pages 3DModel View web application (`docs/`, `gh_pages_app.py`)."""

from __future__ import annotations

import json
import struct
import threading
import urllib.request

from gh_pages_app import create_gh_pages_server
from src.config import PROJECT_ROOT

DOCS_DIR = PROJECT_ROOT / "docs"


def test_gh_pages_static_bundle_and_relative_paths() -> None:
    """`docs/` contains index.html, 404.html, .nojekyll, local Draco WASM, and relative asset URLs."""
    index_html = DOCS_DIR / "index.html"
    not_found_html = DOCS_DIR / "404.html"
    nojekyll = DOCS_DIR / ".nojekyll"
    draco_wasm = DOCS_DIR / "draco" / "draco_decoder.wasm"
    draco_js = DOCS_DIR / "draco" / "draco_decoder.js"

    assert index_html.is_file()
    assert not_found_html.is_file()
    assert nojekyll.is_file()
    assert draco_wasm.is_file() and draco_wasm.stat().st_size > 100_000
    assert draco_js.is_file() and draco_js.stat().st_size > 100_000

    html = index_html.read_text(encoding="utf-8")
    assert "3DModel View" in html
    assert 'src="./assets/' in html
    assert 'href="./assets/' in html
    # Root-absolute `/assets/` breaks GitHub Pages project subpaths (`https://<user>.github.io/<repo>/`)
    assert 'src="/assets/' not in html
    assert 'href="/assets/' not in html


def test_gh_pages_showcase_catalog_and_draco_glb_binaries() -> None:
    """All 4 GitHub Pages showcase `.glb` models carry Draco compression, WebP PBR textures & UVs."""
    catalog_path = DOCS_DIR / "models" / "catalog.json"
    assert catalog_path.is_file()
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    assert catalog["model_count"] >= 4
    assert len(catalog["models"]) >= 4

    for item in catalog["models"]:
        assert item["glb_url"].startswith("./models/")
        glb_file = DOCS_DIR / item["glb_url"].lstrip("./")
        assert glb_file.is_file()

        raw = glb_file.read_bytes()
        assert raw[:4] == b"glTF"
        version, total_len = struct.unpack("<II", raw[4:12])
        assert version == 2 and total_len == len(raw)

        jlen, chunk_type = struct.unpack("<I4s", raw[12:20])
        assert chunk_type == b"JSON"
        gltf = json.loads(raw[20 : 20 + jlen].decode("utf-8"))

        exts = set(gltf.get("extensionsUsed") or [])
        assert "KHR_draco_mesh_compression" in exts
        assert "EXT_texture_webp" in exts
        assert len(gltf.get("textures") or []) >= 3
        assert len(gltf.get("skins") or []) >= 1
        assert all("TEXCOORD_0" in m["primitives"][0]["attributes"] for m in gltf["meshes"])

        if item.get("preview_url"):
            prev_file = DOCS_DIR / item["preview_url"].lstrip("./")
            assert prev_file.is_file() and prev_file.stat().st_size > 5_000


def test_gh_pages_workflow_manifest_valid() -> None:
    """`.github/workflows/pages.yml` configures official GitHub Pages Actions deployment."""
    wf_path = PROJECT_ROOT / ".github" / "workflows" / "pages.yml"
    assert wf_path.is_file()
    text = wf_path.read_text(encoding="utf-8")
    assert "actions/configure-pages@v5" in text
    assert "actions/upload-pages-artifact@v3" in text
    assert "actions/deploy-pages@v4" in text
    assert "pages: write" in text
    assert "id-token: write" in text


def test_gh_pages_preview_server_root_and_project_subpath() -> None:
    """`gh_pages_app.py` serves `/` and `/3dmodel-gen-/` with proper WASM and GLB MIME headers."""
    server = create_gh_pages_server(host="127.0.0.1", port=0, docs_dir=DOCS_DIR)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        for prefix in ("", "/3dmodel-gen-"):
            with urllib.request.urlopen(f"http://127.0.0.1:{port}{prefix}/") as r_html:
                assert r_html.status == 200
                assert b"3DModel View" in r_html.read()

            with urllib.request.urlopen(f"http://127.0.0.1:{port}{prefix}/models/catalog.json") as r_cat:
                assert r_cat.status == 200
                data = json.loads(r_cat.read().decode("utf-8"))
                first_glb = data["models"][0]["glb_url"].lstrip("./")

            with urllib.request.urlopen(
                f"http://127.0.0.1:{port}{prefix}/draco/draco_decoder.wasm"
            ) as r_wasm:
                assert r_wasm.status == 200
                assert "application/wasm" in (r_wasm.headers.get("Content-Type") or "")

            with urllib.request.urlopen(f"http://127.0.0.1:{port}{prefix}/{first_glb}") as r_glb:
                assert r_glb.status == 200
                assert "model/gltf-binary" in (r_glb.headers.get("Content-Type") or "")
                assert r_glb.read(4) == b"glTF"
    finally:
        server.shutdown()
        server.server_close()
