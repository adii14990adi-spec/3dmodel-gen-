"""Procedural High-Resolution PBR Texture Generator (Albedo, Tangent Normal, Roughness/ORM).

Generates seamless studio-grade PBR texture sets embedded into High-Poly `.glb` and UE5 `.fbx` models:
- Epidermal Micro-Pore Human Skin (Albedo + Cellular Pore Normal + Specular/Roughness)
- 45-Degree Indigo/Tactical Twill Distressed Denim (Albedo + Twill Weave Normal + Roughness)
- Rib-Knit Modal/Velvet Bodice Cloth (Albedo + Rib Weave Normal + Roughness)
- Longitudinal Anisotropic Hair Strand Fibers (Albedo + Strand Normal + Roughness)
- Pebbled Full-Grain Calfskin Leather & Tumbled Sneaker Leather (Albedo + Grain Normal)
- Anisotropic Brushed Metal & Photorealistic Radial Eye Iris Maps
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter


def _hex_to_srgb_float(hex_str: str) -> np.ndarray:
    h = hex_str.strip().lstrip("#")
    if len(h) != 6:
        return np.array([0.75, 0.75, 0.75], dtype=np.float32)
    return np.array(
        [int(h[0:2], 16) / 255.0, int(h[2:4], 16) / 255.0, int(h[4:6], 16) / 255.0],
        dtype=np.float32,
    )


def _height_to_normal_png(height_01: np.ndarray, strength: float, out_path: Path) -> None:
    """Convert a seamless [0..1] heightfield into an OpenGL/glTF tangent-space normal map PNG."""
    # Wrap-around central differences so tiled UVs have zero seam discontinuity
    dy = (np.roll(height_01, -1, axis=0) - np.roll(height_01, 1, axis=0)) * strength
    dx = (np.roll(height_01, -1, axis=1) - np.roll(height_01, 1, axis=1)) * strength
    nx = -dx
    ny = -dy
    nz = np.ones_like(height_01, dtype=np.float32)
    norm = np.sqrt(nx * nx + ny * ny + nz * nz + 1e-8)
    rgb = np.stack([(nx / norm) * 0.5 + 0.5, (ny / norm) * 0.5 + 0.5, (nz / norm) * 0.5 + 0.5], axis=-1)
    arr = np.clip(rgb * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(arr, mode="RGB").save(out_path, format="PNG", compress_level=4)


def _save_rgb(rgb_01: np.ndarray, out_path: Path) -> None:
    arr = np.clip(rgb_01 * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(arr, mode="RGB").save(out_path, format="PNG", compress_level=4)


def _save_orm(occlusion: np.ndarray, roughness: np.ndarray, metallic: np.ndarray, out_path: Path) -> None:
    """Save glTF 2.0 standard ORM packed map (R=Occlusion, G=Roughness, B=Metallic)."""
    orm = np.stack([occlusion, roughness, metallic], axis=-1)
    arr = np.clip(orm * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(arr, mode="RGB").save(out_path, format="PNG", compress_level=4)


def _tileable_fbm(res: int, rng: np.random.Generator, sigmas: tuple[float, ...]) -> np.ndarray:
    """Fast multi-octave wrap-filtered tileable noise in [0..1]."""
    acc = np.zeros((res, res), dtype=np.float32)
    weight_sum = 0.0
    for idx, sig in enumerate(sigmas):
        w = 0.5**idx
        base = rng.random((res, res), dtype=np.float32)
        blurred = gaussian_filter(base, sigma=sig, mode="wrap")
        b_min, b_max = float(blurred.min()), float(blurred.max())
        normed = (blurred - b_min) / max(b_max - b_min, 1e-6)
        acc += w * normed
        weight_sum += w
    out = acc / max(weight_sum, 1e-6)
    return out


def generate_character_pbr_textures(
    tex_dir: Path,
    swatches: dict[str, str],
    resolution: int = 1024,
    seed: int = 42,
) -> dict[str, dict[str, str]]:
    """Synthesize a complete multi-material PBR texture set (Albedo + Normal + ORM) on disk."""
    tex_dir.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(seed)
    res = int(resolution)

    yy, xx = np.meshgrid(
        np.linspace(0.0, 1.0, res, endpoint=False, dtype=np.float32),
        np.linspace(0.0, 1.0, res, endpoint=False, dtype=np.float32),
        indexing="ij",
    )

    manifest: dict[str, dict[str, str]] = {}

    # 1. HUMAN SKIN PBR SET (Subsurface Vascular Mottling + Epidermal Micro-Pores)
    skin_base = _hex_to_srgb_float(swatches.get("skin_hex", "#E3B8A3"))
    vascular = _tileable_fbm(res, rng, (18.0, 7.0, 2.5))
    pores_raw = rng.random((res, res), dtype=np.float32)
    pores_fine = gaussian_filter(pores_raw, sigma=1.05, mode="wrap")
    pores_fine = (pores_fine - pores_fine.min()) / max(float(pores_fine.ptp()), 1e-6)
    pore_pits = np.clip((pores_fine - 0.35) / 0.65, 0.0, 1.0) ** 1.6

    warm_tint = np.array([1.04, 0.93, 0.90], dtype=np.float32)
    cool_tint = np.array([0.97, 1.01, 1.03], dtype=np.float32)
    skin_albedo = (
        skin_base[None, None, :]
        * (
            warm_tint[None, None, :] * vascular[:, :, None]
            + cool_tint[None, None, :] * (1.0 - vascular[:, :, None])
        )
        * (0.94 + 0.08 * pore_pits[:, :, None])
    )
    skin_alb_p = tex_dir / "T_Skin_Albedo.png"
    skin_nrm_p = tex_dir / "T_Skin_Normal.png"
    skin_orm_p = tex_dir / "T_Skin_ORM.png"
    _save_rgb(skin_albedo, skin_alb_p)
    _height_to_normal_png(pore_pits, strength=2.6, out_path=skin_nrm_p)
    _save_orm(
        occlusion=0.88 + 0.12 * pore_pits,
        roughness=0.33 + 0.14 * (1.0 - pore_pits),
        metallic=np.zeros((res, res), dtype=np.float32),
        out_path=skin_orm_p,
    )
    manifest["skin"] = {
        "albedo": str(skin_alb_p),
        "normal": str(skin_nrm_p),
        "orm": str(skin_orm_p),
        "label": "Human Epidermal SSS + Pore Normal",
    }

    # 2. DISTRESSED TWILL DENIM PBR SET (45° Diagonal Indigo/Cotton Twill + Stonewash Fade)
    denim_base = _hex_to_srgb_float(swatches.get("denim_hex", "#5B82B0"))
    diag_twill = 0.5 + 0.5 * np.sin(2.0 * np.pi * (xx * 140.0 + yy * 140.0))
    warp_threads = 0.5 + 0.5 * np.sin(2.0 * np.pi * xx * 210.0)
    weft_threads = 0.5 + 0.5 * np.sin(2.0 * np.pi * yy * 195.0)
    weave_h = 0.55 * diag_twill + 0.25 * warp_threads + 0.20 * weft_threads

    stonewash = _tileable_fbm(res, rng, (28.0, 9.0, 3.0))
    # Authentic thigh/center fade (brighter center-vertical whiskering + whiskering creases)
    thigh_fade = np.exp(-(((xx - 0.5) / 0.28) ** 2)) * np.exp(-(((yy - 0.48) / 0.34) ** 2))
    whiskers = np.sin(2.0 * np.pi * (yy * 26.0 + 0.08 * np.sin(2.0 * np.pi * xx * 3.0))) ** 6
    whisker_mask = whiskers * np.exp(-(((yy - 0.72) / 0.14) ** 2))

    fade_factor = np.clip(0.68 + 0.42 * stonewash + 0.34 * thigh_fade + 0.18 * whisker_mask, 0.55, 1.48)
    weft_white = np.array([0.86, 0.87, 0.89], dtype=np.float32)
    denim_albedo = denim_base[None, None, :] * fade_factor[:, :, None]
    # Expose subtle white cotton slub crests in the twill weave
    slub = (weave_h > 0.78).astype(np.float32) * 0.22
    denim_albedo = denim_albedo * (1.0 - slub[:, :, None]) + weft_white[None, None, :] * slub[:, :, None]

    denim_alb_p = tex_dir / "T_Denim_Albedo.png"
    denim_nrm_p = tex_dir / "T_Denim_Normal.png"
    denim_orm_p = tex_dir / "T_Denim_ORM.png"
    _save_rgb(denim_albedo, denim_alb_p)
    _height_to_normal_png(0.75 * weave_h + 0.25 * stonewash, strength=4.2, out_path=denim_nrm_p)
    _save_orm(
        occlusion=0.78 + 0.22 * weave_h,
        roughness=0.76 + 0.16 * (1.0 - weave_h),
        metallic=np.zeros((res, res), dtype=np.float32),
        out_path=denim_orm_p,
    )
    manifest["jeans"] = {
        "albedo": str(denim_alb_p),
        "normal": str(denim_nrm_p),
        "orm": str(denim_orm_p),
        "label": "Stonewashed 45° Twill Denim + Weave Normal",
    }

    # 3. RIB-KNIT CAMISOLE CLOTH PBR SET (Fine Vertical Rib Jersey + Drape Micro-Folds)
    top_base = _hex_to_srgb_float(swatches.get("top_hex", "#16161B"))
    rib_v = 0.5 + 0.5 * np.sin(2.0 * np.pi * xx * 180.0)
    knit_u = 0.5 + 0.5 * np.sin(2.0 * np.pi * yy * 240.0)
    drape_folds = 0.5 + 0.5 * np.sin(2.0 * np.pi * (yy * 9.0 + 0.06 * _tileable_fbm(res, rng, (14.0, 5.0))))
    rib_h = 0.60 * rib_v + 0.22 * knit_u + 0.18 * drape_folds
    top_albedo = np.clip(
        top_base[None, None, :] * (0.86 + 0.30 * rib_h[:, :, None]) + 0.015 * rib_v[:, :, None], 0.01, 1.0
    )

    top_alb_p = tex_dir / "T_Camisole_Albedo.png"
    top_nrm_p = tex_dir / "T_Camisole_Normal.png"
    top_orm_p = tex_dir / "T_Camisole_ORM.png"
    _save_rgb(top_albedo, top_alb_p)
    _height_to_normal_png(rib_h, strength=3.6, out_path=top_nrm_p)
    _save_orm(
        occlusion=0.82 + 0.18 * rib_h,
        roughness=0.68 + 0.18 * (1.0 - rib_v),
        metallic=np.zeros((res, res), dtype=np.float32),
        out_path=top_orm_p,
    )
    manifest["camisole"] = {
        "albedo": str(top_alb_p),
        "normal": str(top_nrm_p),
        "orm": str(top_orm_p),
        "label": "Modal Rib-Knit Jersey + Weave Normal",
    }

    # 4. ANISOTROPIC HAIR STRAND FIBERS PBR SET
    hair_base = _hex_to_srgb_float(swatches.get("hair_hex", "#1E1613"))
    # High-frequency longitudinal fiber streaks along V/U
    streak_1d = rng.random((1, res), dtype=np.float32)
    streaks = gaussian_filter(np.repeat(streak_1d, res, axis=0), sigma=(22.0, 0.8), mode="wrap")
    streaks = (streaks - streaks.min()) / max(float(streaks.ptp()), 1e-6)
    fine_strands = 0.5 + 0.5 * np.sin(2.0 * np.pi * xx * 320.0)
    hair_h = 0.65 * streaks + 0.35 * fine_strands
    sheen_band = np.exp(-(((yy - 0.36) / 0.11) ** 2)) + 0.55 * np.exp(-(((yy - 0.72) / 0.13) ** 2))
    hair_albedo = np.clip(
        hair_base[None, None, :] * (0.72 + 0.65 * streaks[:, :, None])
        + np.array([0.09, 0.07, 0.06], dtype=np.float32)[None, None, :] * (sheen_band * streaks)[:, :, None],
        0.01,
        1.0,
    )

    hair_alb_p = tex_dir / "T_Hair_Albedo.png"
    hair_nrm_p = tex_dir / "T_Hair_Normal.png"
    hair_orm_p = tex_dir / "T_Hair_ORM.png"
    _save_rgb(hair_albedo, hair_alb_p)
    _height_to_normal_png(hair_h, strength=3.4, out_path=hair_nrm_p)
    _save_orm(
        occlusion=0.76 + 0.24 * streaks,
        roughness=0.28 + 0.18 * (1.0 - streaks),
        metallic=np.zeros((res, res), dtype=np.float32),
        out_path=hair_orm_p,
    )
    manifest["hair_glb"] = {
        "albedo": str(hair_alb_p),
        "normal": str(hair_nrm_p),
        "orm": str(hair_orm_p),
        "label": "Anisotropic Hair Strand Fibers + Normal",
    }

    # 5. PEBBLED GRAIN LEATHER BELT & TUMBLED SNEAKER LEATHER (512x512 crisp)
    sub_res = max(512, res // 2)
    pebble = _tileable_fbm(sub_res, rng, (5.5, 2.2, 1.0))
    pebble_cells = np.sin(np.pi * pebble) ** 1.4
    belt_base = _hex_to_srgb_float(swatches.get("belt_hex", "#1F1F25"))
    belt_alb_p = tex_dir / "T_LeatherBelt_Albedo.png"
    belt_nrm_p = tex_dir / "T_LeatherBelt_Normal.png"
    belt_orm_p = tex_dir / "T_LeatherBelt_ORM.png"
    _save_rgb(
        np.clip(belt_base[None, None, :] * (0.85 + 0.32 * pebble_cells[:, :, None]), 0.01, 1.0), belt_alb_p
    )
    _height_to_normal_png(pebble_cells, strength=3.2, out_path=belt_nrm_p)
    _save_orm(
        occlusion=0.84 + 0.16 * pebble_cells,
        roughness=0.26 + 0.16 * (1.0 - pebble_cells),
        metallic=np.zeros((sub_res, sub_res), dtype=np.float32),
        out_path=belt_orm_p,
    )
    manifest["belt"] = {
        "albedo": str(belt_alb_p),
        "normal": str(belt_nrm_p),
        "orm": str(belt_orm_p),
        "label": "Pebbled Calfskin Leather + Grain Normal",
    }

    shoe_base = _hex_to_srgb_float(swatches.get("shoes_hex", "#F2F0EC"))
    sy, sx = np.meshgrid(
        np.linspace(0.0, 1.0, sub_res, endpoint=False, dtype=np.float32),
        np.linspace(0.0, 1.0, sub_res, endpoint=False, dtype=np.float32),
        indexing="ij",
    )
    perf_grid = ((np.sin(2.0 * np.pi * sx * 48.0) > 0.88) & (np.sin(2.0 * np.pi * sy * 48.0) > 0.88)).astype(
        np.float32
    )
    shoe_h = 0.75 * pebble_cells - 0.35 * perf_grid
    shoe_alb = shoe_base[None, None, :] * (
        0.93 + 0.08 * pebble_cells[:, :, None] - 0.12 * perf_grid[:, :, None]
    )
    shoe_alb_p = tex_dir / "T_Sneakers_Albedo.png"
    shoe_nrm_p = tex_dir / "T_Sneakers_Normal.png"
    shoe_orm_p = tex_dir / "T_Sneakers_ORM.png"
    _save_rgb(shoe_alb, shoe_alb_p)
    _height_to_normal_png(shoe_h, strength=2.8, out_path=shoe_nrm_p)
    _save_orm(
        occlusion=0.88 + 0.12 * pebble_cells - 0.15 * perf_grid,
        roughness=0.40 + 0.14 * (1.0 - pebble_cells),
        metallic=np.zeros((sub_res, sub_res), dtype=np.float32),
        out_path=shoe_orm_p,
    )
    manifest["sneakers"] = {
        "albedo": str(shoe_alb_p),
        "normal": str(shoe_nrm_p),
        "orm": str(shoe_orm_p),
        "label": "Tumbled Sneaker Leather & Perforation Normal",
    }

    # 6. BRUSHED METALLIC HARDWARE & PHOTOREALISTIC RADIAL IRIS
    metal_base = _hex_to_srgb_float(swatches.get("metal_hex", "#DCE0E6"))
    brush_1d = rng.random((sub_res, 1), dtype=np.float32)
    brush = gaussian_filter(np.repeat(brush_1d, sub_res, axis=1), sigma=(0.7, 18.0), mode="wrap")
    brush = (brush - brush.min()) / max(float(brush.ptp()), 1e-6)
    metal_alb_p = tex_dir / "T_Metal_Albedo.png"
    metal_orm_p = tex_dir / "T_Metal_ORM.png"
    _save_rgb(metal_base[None, None, :] * (0.90 + 0.14 * brush[:, :, None]), metal_alb_p)
    _save_orm(
        occlusion=np.full((sub_res, sub_res), 0.96, dtype=np.float32),
        roughness=0.14 + 0.12 * (1.0 - brush),
        metallic=np.full((sub_res, sub_res), 0.96, dtype=np.float32),
        out_path=metal_orm_p,
    )
    manifest["metal"] = {
        "albedo": str(metal_alb_p),
        "orm": str(metal_orm_p),
        "label": "Anisotropic Brushed Metal Hardware",
    }

    # Radial Eye Iris Texture
    iris_img = Image.new("RGB", (512, 512), (238, 234, 232))
    draw = ImageDraw.Draw(iris_img)
    cx, cy = 256, 256
    for r in range(138, 42, -1):
        t = (138 - r) / 96.0
        col = (
            int(38 + 95 * np.sin(np.pi * t)),
            int(22 + 54 * np.sin(np.pi * t)),
            int(14 + 28 * np.sin(np.pi * t)),
        )
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    for deg in range(0, 360, 4):
        rad = np.deg2rad(deg)
        x1 = int(cx + 46 * np.cos(rad))
        y1 = int(cy + 46 * np.sin(rad))
        x2 = int(cx + 128 * np.cos(rad))
        y2 = int(cy + 128 * np.sin(rad))
        draw.line((x1, y1, x2, y2), fill=(112, 66, 36), width=1)
    draw.ellipse((cx - 44, cy - 44, cx + 44, cy + 44), fill=(10, 10, 12))
    draw.ellipse((cx - 72, cy - 86, cx - 44, cy - 58), fill=(250, 252, 255))
    iris_p = tex_dir / "T_EyeIris_Albedo.png"
    iris_img.save(iris_p, format="PNG")
    manifest["eyes"] = {"albedo": str(iris_p), "label": "Radial Limbal & Iris Crypt Map"}

    return manifest


def generate_surface_detail_normal_map(
    tex_dir: Path,
    detail_mode: str = "skin_pores",
    resolution: int = 1024,
) -> dict[str, str]:
    """Generate a high-frequency PBR normal + ORM map for Universal High-Poly Up-Res models."""
    tex_dir.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(108)
    res = int(resolution)
    yy, xx = np.meshgrid(
        np.linspace(0.0, 1.0, res, endpoint=False, dtype=np.float32),
        np.linspace(0.0, 1.0, res, endpoint=False, dtype=np.float32),
        indexing="ij",
    )
    if detail_mode == "woven_fabric":
        h = (
            0.5
            + 0.25 * np.sin(2.0 * np.pi * (xx * 150.0 + yy * 150.0))
            + 0.25 * np.sin(2.0 * np.pi * xx * 200.0)
        )
        rough = 0.72 + 0.14 * (1.0 - h)
    elif detail_mode == "hard_surface_grain":
        h = _tileable_fbm(res, rng, (2.2, 1.0))
        rough = 0.35 + 0.18 * (1.0 - h)
    else:
        raw = gaussian_filter(rng.random((res, res), dtype=np.float32), sigma=1.1, mode="wrap")
        h = ((raw - raw.min()) / max(float(raw.ptp()), 1e-6)) ** 1.5
        rough = 0.42 + 0.15 * (1.0 - h)

    nrm_p = tex_dir / "T_Upres_MicroNormal.png"
    orm_p = tex_dir / "T_Upres_ORM.png"
    _height_to_normal_png(h, strength=3.0, out_path=nrm_p)
    _save_orm(
        occlusion=0.86 + 0.14 * h,
        roughness=rough,
        metallic=np.zeros((res, res), dtype=np.float32),
        out_path=orm_p,
    )
    return {"normal": str(nrm_p), "orm": str(orm_p)}
