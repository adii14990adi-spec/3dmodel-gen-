"""FastAPI backend & SPA host for **3DModel Pro — High-Poly Character & UE5 Asset System**."""

from __future__ import annotations

import logging
import time
from pathlib import Path
from typing import Annotated, Any

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from src import __version__
from src.config import PROJECT_ROOT, AppSettings, RiggingBackend, get_settings
from src.highpoly_system import (
    HIGHPOLY_ARCHETYPES,
    MICRO_DETAIL_PROFILES,
    HighPolyCharacterRequest,
    HighPolyModelSystem,
    HighPolyUpresRequest,
)
from src.ue5_bpy_generator import has_bpy_runtime

logger = logging.getLogger(__name__)

_PRO_MIME_TYPES: dict[str, str] = {
    ".glb": "model/gltf-binary",
    ".fbx": "application/octet-stream",
    ".obj": "text/plain; charset=utf-8",
    ".mtl": "text/plain; charset=utf-8",
    ".py": "text/x-python; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".zip": "application/zip",
    ".json": "application/json",
}


def _read_optional_upload(upload: UploadFile | None, max_mb: int) -> bytes | None:
    if upload is None or not upload.filename:
        return None
    limit = max_mb * 1024 * 1024
    data = upload.file.read(limit + 1)
    if not data:
        return None
    if len(data) > limit:
        raise HTTPException(
            status_code=413,
            detail=f"Uploaded file exceeds maximum allowed size ({max_mb} MB).",
        )
    return data


def create_pro_app(
    settings: AppSettings | None = None,
    library_root: Path | None = None,
    static_dir: Path | None = None,
    seed_flagship_on_boot: bool = False,
) -> FastAPI:
    """Create the standalone `3DModel Pro` FastAPI application & SPA server."""
    cfg = settings or get_settings()
    boot_t = time.monotonic()
    lib_dir = library_root or (cfg.output_dir / "pro_library")
    hp_system = HighPolyModelSystem(library_root=lib_dir)

    if seed_flagship_on_boot and has_bpy_runtime():
        try:
            hp_system.ensure_flagship_model(cycles_samples=24)
        except Exception as exc:
            logger.warning("Flagship High-Poly seed skipped during startup: %s", exc)

    app = FastAPI(
        title="3DModel Pro — High-Poly Character & UE5 Asset API",
        version=__version__,
        docs_url="/api/pro/v1/docs",
        openapi_url="/api/pro/v1/openapi.json",
        description=(
            "Dedicated High-Poly 3D Character Forge, Catmull-Clark Subdivision Up-Res Engine, "
            "Multi-LOD (LOD0–LOD3) Generator, and 23-Bone Unreal Engine 5 Mannequin Asset Studio."
        ),
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.state.highpoly_system = hp_system

    @app.get("/api/pro/v1/health", tags=["System"])
    def pro_health() -> dict[str, Any]:
        models = hp_system.list_models()
        return {
            "status": "ok",
            "product": "3DModel Pro Studio",
            "version": __version__,
            "bpy_available": has_bpy_runtime(),
            "uptime_seconds": round(time.monotonic() - boot_t, 2),
            "library_count": len(models),
            "flagship_ready": any(m.get("is_flagship") for m in models),
        }

    @app.get("/api/pro/v1/catalog", tags=["Catalog"])
    def get_catalog() -> dict[str, Any]:
        return {
            "product_name": "3DModel Pro",
            "tagline": "High-Poly Textured 3D Models · UE5 Character & Multi-LOD Studio",
            "bpy_available": has_bpy_runtime(),
            "archetypes": list(HIGHPOLY_ARCHETYPES.values()),
            "micro_detail_profiles": MICRO_DETAIL_PROFILES,
            "subsurf_tiers": [
                {
                    "level": 1,
                    "label": "Subsurf L1 · Cinematic Base",
                    "approx_tris": "~81,000 tris",
                    "target": "Real-Time Cutscenes & Hero NPCs",
                },
                {
                    "level": 2,
                    "label": "Subsurf L2 · UE5 High-Poly Standard",
                    "approx_tris": "~301,400 tris",
                    "target": "UE5 Skeletal LookDev & Digital Doubles",
                },
                {
                    "level": 3,
                    "label": "Subsurf L3 · Ultra Sculpt / Nanite",
                    "approx_tris": "~1,120,000 tris",
                    "target": "ZBrush / Film VFX / Nanite Source",
                },
            ],
        }

    @app.get("/api/pro/v1/models", tags=["Asset Library"])
    def list_models() -> dict[str, Any]:
        items = hp_system.list_models()
        return {"total": len(items), "models": items}

    @app.post("/api/pro/v1/models/seed-flagship", tags=["Asset Library"])
    def seed_flagship(cycles_samples: int = 20) -> dict[str, Any]:
        if not has_bpy_runtime():
            raise HTTPException(
                status_code=503,
                detail="Blender Python (`bpy`) runtime is unavailable in this environment.",
            )
        return hp_system.ensure_flagship_model(cycles_samples=max(0, min(64, cycles_samples)))

    @app.get("/api/pro/v1/models/{model_id}", tags=["Asset Library"])
    def get_model_detail(model_id: str) -> dict[str, Any]:
        rec = hp_system.get_model(model_id)
        if rec is None:
            raise HTTPException(status_code=404, detail=f"High-Poly model '{model_id}' not found.")
        return rec

    @app.delete("/api/pro/v1/models/{model_id}", tags=["Asset Library"])
    def delete_model_endpoint(model_id: str) -> dict[str, Any]:
        try:
            deleted = hp_system.delete_model(model_id)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        if not deleted:
            raise HTTPException(status_code=404, detail=f"High-Poly model '{model_id}' not found.")
        return {"deleted": True, "model_id": model_id}

    @app.post("/api/pro/v1/generate/character", tags=["High-Poly Generation"])
    def generate_highpoly_character(
        title: Annotated[str, Form()] = "SK_UE5_CustomCharacter",
        archetype: Annotated[str, Form()] = "ue5_realistic_female",
        subsurf_level: Annotated[int, Form(ge=1, le=3)] = 2,
        texture_resolution: Annotated[int, Form(ge=512, le=2048)] = 1024,
        cycles_samples: Annotated[int, Form(ge=0, le=128)] = 16,
        generate_lods: Annotated[bool, Form()] = True,
        adapt_to_reference: Annotated[bool, Form()] = False,
        shoulder_scale: Annotated[float, Form(ge=0.82, le=1.22)] = 1.0,
        waist_scale: Annotated[float, Form(ge=0.82, le=1.22)] = 1.0,
        hip_scale: Annotated[float, Form(ge=0.85, le=1.22)] = 1.0,
        skin_hex: Annotated[str | None, Form()] = None,
        hair_hex: Annotated[str | None, Form()] = None,
        top_hex: Annotated[str | None, Form()] = None,
        denim_hex: Annotated[str | None, Form()] = None,
        belt_hex: Annotated[str | None, Form()] = None,
        metal_hex: Annotated[str | None, Form()] = None,
        shoes_hex: Annotated[str | None, Form()] = None,
        reference_file: Annotated[UploadFile | None, File()] = None,
    ) -> dict[str, Any]:
        if not has_bpy_runtime():
            raise HTTPException(
                status_code=503,
                detail="Blender Python (`bpy`) runtime is required for UE5 Character Forge.",
            )
        ref_bytes = _read_optional_upload(reference_file, cfg.max_upload_mb)
        req = HighPolyCharacterRequest(
            title=title,
            archetype=archetype,
            subsurf_level=subsurf_level,
            texture_resolution=texture_resolution,
            cycles_samples=cycles_samples,
            generate_lods=generate_lods,
            adapt_to_reference=adapt_to_reference,
            shoulder_scale=shoulder_scale,
            waist_scale=waist_scale,
            hip_scale=hip_scale,
            skin_hex=skin_hex,
            hair_hex=hair_hex,
            top_hex=top_hex,
            denim_hex=denim_hex,
            belt_hex=belt_hex,
            metal_hex=metal_hex,
            shoes_hex=shoes_hex,
        )
        try:
            return hp_system.generate_character(req=req, reference_bytes=ref_bytes)
        except (ValueError, RuntimeError) as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

    @app.post("/api/pro/v1/upres", tags=["High-Poly Up-Res & LOD Lab"])
    def upres_mesh_or_sheet(
        title: Annotated[str, Form()] = "HighPoly_Subdiv_Character",
        subsurf_level: Annotated[int, Form(ge=1, le=3)] = 2,
        micro_detail: Annotated[str, Form()] = "skin_pores",
        detail_strength: Annotated[float, Form(ge=0.0, le=0.01)] = 0.0016,
        rigging_backend: Annotated[RiggingBackend, Form()] = RiggingBackend.UE5_MANNY,
        generate_lods: Annotated[bool, Form()] = True,
        use_sample_sheet: Annotated[bool, Form()] = False,
        file: Annotated[UploadFile | None, File()] = None,
    ) -> dict[str, Any]:
        raw_bytes = _read_optional_upload(file, cfg.max_upload_mb)
        fname = file.filename if (file is not None and file.filename) else "sample_input.jpg"
        if raw_bytes is None:
            if use_sample_sheet and cfg.sample_image_path.is_file():
                raw_bytes = cfg.sample_image_path.read_bytes()
                fname = cfg.sample_image_path.name
            else:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Upload a 3D mesh (.glb/.obj) or Dual-View turnaround sheet, "
                        "or set use_sample_sheet=true."
                    ),
                )

        if micro_detail not in ("none", "skin_pores", "woven_fabric", "hard_surface_grain"):
            micro_detail = "none"

        req = HighPolyUpresRequest(
            title=title,
            subsurf_level=subsurf_level,
            micro_detail=micro_detail,  # type: ignore[arg-type]
            detail_strength=detail_strength,
            rigging_backend=rigging_backend,
            generate_lods=generate_lods,
        )
        try:
            return hp_system.upres_to_highpoly(req=req, upload_bytes=raw_bytes, filename=fname)
        except (ValueError, RuntimeError) as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

    @app.get("/api/pro/v1/models/{model_id}/files/{filepath:path}", tags=["Asset Library"])
    def download_pro_asset(model_id: str, filepath: str) -> FileResponse:
        target = hp_system.resolve_asset_file(model_id, filepath)
        if target is None:
            raise HTTPException(status_code=404, detail=f"File '{filepath}' not found for '{model_id}'.")
        mime = _PRO_MIME_TYPES.get(target.suffix.lower(), "application/octet-stream")
        if target.suffix.lower() in (".png", ".jpg", ".jpeg", ".glb", ".json"):
            return FileResponse(path=target, media_type=mime)
        return FileResponse(path=target, media_type=mime, filename=target.name)

    # Mount built `3DModel Pro` frontend SPA bundle when available
    bundle_dir = static_dir or (PROJECT_ROOT / "web_3dmodel_pro" / "static_bundle")
    assets_sub = bundle_dir / "assets"
    if assets_sub.is_dir():
        app.mount("/assets", StaticFiles(directory=str(assets_sub)), name="pro_spa_assets")

    @app.get("/", response_model=None, include_in_schema=False)
    def serve_spa_index() -> FileResponse | HTMLResponse:
        index_html = bundle_dir / "index.html"
        if index_html.is_file():
            return FileResponse(index_html, media_type="text/html; charset=utf-8")
        return HTMLResponse(
            content=(
                "<!doctype html><html><head><title>3DModel Pro</title></head>"
                "<body style='background:#090b10;color:#e2e8f0;font-family:sans-serif;padding:40px'>"
                "<h1>3DModel Pro — API Active</h1>"
                "<p>Frontend bundle not built yet. Run <code>npm run build</code> in "
                "<code>web_3dmodel_pro/</code> or visit <a style='color:#38bdf8' "
                "href='/api/pro/v1/docs'>/api/pro/v1/docs</a>.</p></body></html>"
            )
        )

    return app
