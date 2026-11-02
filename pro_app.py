"""Standalone server launcher for **3DModel Pro — High-Poly Character & UE5 Asset Studio**."""

from __future__ import annotations

import logging
import os
import shutil
import subprocess
from pathlib import Path

import uvicorn

from src.config import PROJECT_ROOT, get_settings
from src.pro_server import create_pro_app

logger = logging.getLogger(__name__)


def ensure_frontend_bundle(web_dir: Path) -> None:
    """Build `web_3dmodel_pro/static_bundle` automatically if missing and `npm` is installed."""
    bundle_index = web_dir / "static_bundle" / "index.html"
    if bundle_index.is_file():
        return
    npm_bin = shutil.which("npm")
    if npm_bin is None or not (web_dir / "package.json").is_file():
        return
    logger.info("Building 3DModel Pro frontend bundle in %s ...", web_dir)
    if not (web_dir / "node_modules").is_dir():
        subprocess.run([npm_bin, "install", "--no-audit", "--no-fund"], cwd=str(web_dir), check=True)
    subprocess.run([npm_bin, "run", "build"], cwd=str(web_dir), check=True)


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s [%(name)s] %(message)s")
    settings = get_settings()
    port = int(os.environ.get("PRO_PORT", "8080"))
    seed_on_boot = os.environ.get("PRO_SEED_FLAGSHIP", "1").lower() not in ("0", "false", "no")

    web_dir = PROJECT_ROOT / "web_3dmodel_pro"
    ensure_frontend_bundle(web_dir)

    app = create_pro_app(
        settings=settings,
        static_dir=web_dir / "static_bundle",
        seed_flagship_on_boot=seed_on_boot,
    )
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)


if __name__ == "__main__":
    main()
