#!/usr/bin/env python3
"""Local static preview server mirroring GitHub Pages (`docs/` + `/3dmodel-gen-/` subpath)."""

from __future__ import annotations

import argparse
import mimetypes
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
DOCS_DIR = PROJECT_ROOT / "docs"

mimetypes.add_type("model/gltf-binary", ".glb")
mimetypes.add_type("model/gltf+json", ".gltf")
mimetypes.add_type("application/wasm", ".wasm")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")


class GitHubPagesHandler(SimpleHTTPRequestHandler):
    """Static HTTP handler mimicking GitHub Pages root `/` and project subpath `/3dmodel-gen-/`."""

    repo_prefix = "/3dmodel-gen-"

    def translate_path(self, path: str) -> str:
        clean = path.split("?", 1)[0].split("#", 1)[0]
        if clean == self.repo_prefix or clean.startswith(self.repo_prefix + "/"):
            clean = clean[len(self.repo_prefix) :] or "/"
        return super().translate_path(clean)

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def create_gh_pages_server(
    host: str = "0.0.0.0",
    port: int = 8090,
    docs_dir: Path = DOCS_DIR,
) -> ThreadingHTTPServer:
    handler_cls = partial(GitHubPagesHandler, directory=str(docs_dir))
    return ThreadingHTTPServer((host, port), handler_cls)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Preview the static GitHub Pages 3DModel View site (`docs/`)."
    )
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8090)
    args = parser.parse_args()

    if not (DOCS_DIR / "index.html").is_file():
        raise SystemExit(
            f"Missing {DOCS_DIR / 'index.html'}. Run `cd web_model_viewer && npm run build` first."
        )

    server = create_gh_pages_server(host=args.host, port=args.port, docs_dir=DOCS_DIR)
    print(f"[3DModel View · GitHub Pages Preview] Serving {DOCS_DIR} at http://{args.host}:{args.port}/")
    print(f"[Subpath Mirror] Also available at http://{args.host}:{args.port}/3dmodel-gen-/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
