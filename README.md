# Auto3D-Human & 3DModel View Studio

[![Deploy 3DModel View to GitHub Pages](https://github.com/adii14990adi-spec/3dmodel-gen-/actions/workflows/pages.yml/badge.svg)](https://github.com/adii14990adi-spec/3dmodel-gen-/actions/workflows/pages.yml)

- **Live 3DModel View Web (GitHub Pages)**: **https://adii14990adi-spec.github.io/3dmodel-gen-/**

**Auto3D-Human** is an automated Python pipeline that transforms a single **dual-view T-pose character reference sheet** (containing aligned **Front** and **Back** views) into a **watertight, rigging-ready, 25-bone humanoid-skinned, PBR-textured 3D mesh (`.glb` / `.obj`)**, exposed via a **CLI tool**, an async-scalable **FastAPI REST backend**, an interactive **Gradio Web UI**, **`3DModel Pro Studio`**, and a static **GitHub Pages 3D Model Viewer (`3DModel View`)**.

---

## Key Features

- **Intelligent Dual-View Preprocessing (`src/preprocessor.py`)**
  - Auto-detects horizontal (`Front | Back`) or vertical (`Front / Back`) turnaround layouts and splits along the optimal background valley while trimming divider lines.
  - Supports **`rembg` (`u2net_human_seg`)** ONNX human segmentation with automatic fallback to border-modeled **CIE Lab + OpenCV GrabCut** matting (preserving interior white regions such as eyes or light garments while stripping stray corner annotations).
  - Performs spine symmetry centering and head-to-sole vertical span normalization, reporting a quantitative **Front/Back Silhouette IoU** alignment score.

- **Automated ±90° Side-View Synthesis (`src/side_synthesizer.py`)**
  - Sharpens lateral 3D fidelity (nose bridge, jaw/chin tuck, anterior chest, inward lumbar lordosis, gluteal curve, gastrocnemius calf contour, dorsal backpack/gear detection, and forward boot projection) when only Front and Back views are supplied.
  - Includes a deterministic **`anatomical`** sagittal synthesizer + lateral horizon inpainter alongside modular **`zero123plus`** (`sudo-ai/zero123plus-v1.2`) and **`sv3d`** (`stabilityai/sv3d`) diffusion connectors.

- **Modular Multi-View 3D Reconstruction Core (`src/reconstructor.py`)**
  - **Built-in Engine (`volumetric_sdf`)**: Zero-external-weight CPU/GPU engine fusing aligned Front (`+Z`), mirrored Back (`-Z`), and synthesized ±90° sagittal profiles with medial-axis elliptical cross-sections ($\sqrt{2t - t^2}$) and shading relief into an isotropic 3D Signed Distance Field extracted via **Marching Cubes**.
  - **Primary Neural Engines**: Plug-and-play integrations for **Microsoft TRELLIS** (`trellis`), **LGM** (`lgm`), and **StabilityAI TripoSR** (`triposr`).
  - **Clothed Body Modular Connectors**: Dedicated **ECON** (`econ`, featuring built-in 2D DCT Screened Poisson normal integration + external `econ_root_dir` hook) and **PIFuHD** (`pifuhd`, pixel-aligned implicit occupancy query) connectors.

- **Watertight Mesh Post-Processing & PBR Baking (`src/postprocessor.py`)**
  - Powered by **PyVista**, **Trimesh**, **fast-simplification**, and **Open3D**.
  - Connected-component island filtering, volume-preserving **Taubin smoothing**, topology-preserving **Garland–Heckbert quadric decimation**, hole filling, and outward normal winding verification (`mesh.is_watertight == True`, `Euler == 2`).
  - Canonical glTF/Mixamo humanoid grounding (`+Y` up, `+Z` forward, feet grounded at `Y = 0.0`, scaled to `1.80m`).
  - **Seamless 2-Tile UV Texture Atlas** (`.glb` with embedded `PBRMaterial` + `.obj`/`.mtl`/`.png` bundle) with Voronoi foreground color dilation and lateral rim harmonization.

- **25-Joint Humanoid Auto-Rigging & Armature Injection (`src/rigger.py`)**
  - Fits a standard **25-bone Mixamo / Unity Humanoid armature** (`Hips`, `Spine`–`Spine2`, `Neck`, `Head`, `Left/RightShoulder`–`Hand`, `Left/RightUpLeg`–`ToeBase`) directly inside the watertight T-pose mesh.
  - Computes anatomically gated capsule distances + **Laplacian heat-diffused Linear Blend Skinning (LBS)** weights (`WEIGHTS_0.sum() == 1.0`, identical across UV seams so joints deform cleanly without seam cracking) and injects glTF 2.0 `skins`, `JOINTS_0`, `WEIGHTS_0`, and column-major `inverseBindMatrices` directly into `.glb`.
  - Includes modular **`smplx`** (`.npz` template KDTree weight transfer) and **`blender`** (`blender --background --python` `ARMATURE_AUTO`) connectors.

- **Unreal Engine 5 High-Poly `bpy` Character Generator (`ue5_highpoly_character_bpy.py`, `src/ue5_bpy_generator.py`)**
  - Builds a **1.70m sculpt- and Nanite-ready high-poly Subdivision female character (`SK_UE5_RealisticFemale`)** directly via headless **Blender Python (`bpy` 4.5 LTS)** or standalone Blender (`blender --background --python ue5_highpoly_character_bpy.py`).
  - Includes continuous quad-lofted head/torso/limb anatomy, 5-finger articulated T-pose hands, center-parted 162-strand NURBS wavy hair groom + scalp cap (`Principled Hair BSDF` Melanin), fitted V-neck spaghetti-strap camisole, distressed high-waisted skinny jeans with recessed cutout skin & frayed white cotton weft threads, grain leather belt + metallic double-ring buckle, silver pendant necklace, forearm tattoo shader, and platform sneakers.
  - Rigged to the **23-bone Unreal Engine 5 Mannequin / MetaHuman hierarchy** (`root`, `pelvis`, `spine_01..03`, `clavicle_l/r`, `upperarm_l/r`, `lowerarm_l/r`, `hand_l/r`, `thigh_l/r`, `calf_l/r`, `foot_l/r`, `ball_l/r`, `neck_01`, `head`) and exports UE5-ready **`.fbx` (`-Y` Forward, `Z` Up, tangent space)**, skinned PBR **`.glb`**, and **Cycles raytraced 3-panel lookdev turnaround sheets**.

- **Async Batch Worker Queue + FastAPI + Gradio Studio (`src/worker.py`, `src/server.py`, `app.py`)**
  - Offloads single (`/api/v1/jobs/submit`) and multi-character batch (`/api/v1/jobs/batch`) workloads onto **Celery + Redis** (when `redis` is configured, see `docker-compose.yml`) or a zero-config non-blocking **`ThreadPoolExecutor`** worker pool so port `7860` remains responsive under concurrent multi-user traffic.

---

## Repository Structure

```text
auto3d-human/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # Ruff lint/format, Pytest matrix (3.10/3.11), CUDA Docker build
├── assets/
│   └── sample_input.jpg          # Sample aligned Front | Back T-pose character sheet
├── src/
│   ├── __init__.py
│   ├── config.py                 # Pydantic v2 & environment settings (AUTO3D_*)
│   ├── highpoly_system.py        # 3DModel Pro High-Poly Textured 3D & Multi-LOD orchestrator
│   ├── pbr_texture_baker.py      # Procedural 1K/2K Albedo, Tangent-Normal & ORM PNG texture baker
│   ├── pipeline.py               # End-to-end Auto3DHumanPipeline orchestrator
│   ├── pro_server.py             # Standalone 3DModel Pro FastAPI + React/Three.js SPA server (:8080)
│   ├── preprocessor.py           # Dual-view splitting, spine centering, rembg / GrabCut
│   ├── side_synthesizer.py       # ±90° lateral profile synthesis (Anatomical / Zero123++ / SV3D)
│   ├── reconstructor.py          # Multi-view 3D synthesis & Marching Cubes engines
│   ├── postprocessor.py          # Taubin smoothing, quadric decimation, normals, GLB/OBJ export
│   ├── rigger.py                 # 25-bone glTF & 23-bone UE5 Manny armature + LBS skinning
│   ├── ue5_bpy_generator.py      # Unreal Engine 5 High-Poly Blender `bpy` engine & exporters
│   ├── server.py                 # FastAPI synchronous, UE5 BPY & async queue REST endpoints
│   └── worker.py                 # Celery + Redis & ThreadPool async batch worker queue
├── tests/                        # Comprehensive unit & integration test suite
├── ue5_highpoly_character_bpy.py # Standalone & library UE5 High-Poly Realistic Character `bpy` script
├── app.py                        # Gradio Web UI + mounted FastAPI service
├── cli.py                        # Command-line interface
├── Dockerfile                    # NVIDIA CUDA 12.1 runtime container
├── docker-compose.yml            # Multi-container Web + CUDA Celery Worker + Redis stack
├── pyproject.toml                # Ruff & Pytest configuration
├── requirements.txt              # Python 3.10+ dependencies
└── README.md
```

---

## Quickstart

### 1. Installation

Requires **Python 3.10+**.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

---

### 2. Command-Line Interface (`cli.py`)

Reconstruct a watertight, PBR-textured, 25-bone humanoid-rigged `.glb` and `.obj` character:

```bash
python cli.py \
  --input assets/sample_input.jpg \
  --output outputs/hero/character.glb \
  --engine auto \
  --side-backend anatomical \
  --rigging-backend builtin_humanoid \
  --mc-resolution 160 \
  --target-faces 20000
```

List registered 3D engines, run clothed-body Screened Poisson normal integration (`econ`), or build the **Unreal Engine 5 High-Poly `bpy` Character (`.fbx` + `.glb`)**:

```bash
python cli.py --list-engines
python cli.py -i assets/sample_input.jpg -o outputs/econ_run --engine econ --json

# Build UE5 High-Poly Character via Pipeline CLI (exports character_ue5.fbx + character.glb + Cycles lookdev)
python cli.py -i assets/sample_input.jpg -o outputs/ue5_char --engine ue5_highpoly_bpy --ue5-subsurf 2 --ue5-samples 24

# Or run the standalone Blender Python (`bpy`) generator directly:
python ue5_highpoly_character_bpy.py --reference assets/sample_input.jpg --export-fbx outputs/SK_UE5_RealisticFemale.fbx --export-glb outputs/SK_UE5_RealisticFemale.glb --render-preview outputs/ue5_lookdev.png
```

---

### 3. Gradio Web UI + Mounted FastAPI Server (`app.py`)

Launch the combined Web Studio and REST API (binds to `0.0.0.0:7860`):

```bash
python app.py
```

- **Gradio Web Studio (`app.py`)**: `http://localhost:7860/`
- **Swagger / OpenAPI Docs**: `http://localhost:7860/docs`
- **Queue Telemetry**: `http://localhost:7860/api/v1/queue/stats`
- **Health Endpoint**: `http://localhost:7860/health`

---

### 3B. Separate High-Poly Web Platform — **3DModel Pro Studio** (`pro_app.py` + `web_3dmodel_pro/`)

Launch the dedicated **3DModel Pro — High-Poly Character Forge & UE5 Multi-LOD Asset System** (React + TypeScript + Three.js WebGL PBR Viewport + FastAPI `/api/pro/v1/*` on `0.0.0.0:8080`):

```bash
python pro_app.py
```

- **3DModel Pro Web Studio**: `http://localhost:8080/`
  - **Pre-Loaded High-Poly Textured 3D Showcase**: Ships with 4 UV-unwrapped (`TEXCOORD_0`) High-Poly Textured 3D models (`SK_UE5_RealisticFemale`, `SK_UE5_CyberTechwear`, `SK_UE5_EditorialCouture`, and `CH_Turnaround_HighPoly`) carrying embedded PBR textures (`BaseColor/Albedo`, `Tangent-Space Normal`, and packed `ORM` maps) across `LOD0–LOD3` `.glb` and UE5 `.fbx`.
  - **UE5 Character Forge**: Bake 512px / 1K / 2K seamless PBR texture sets (epidermal pore SSS, 45° stonewashed twill denim, rib-knit cloth, anisotropic hair fibers, pebbled leather, tumbled sneakers, radial iris), adjust Catmull-Clark Subdivision levels (`L1 ~81K`, `L2 ~301K`, `L3 ~1.12M` tris), proportions, and reference turnaround adaptation.
  - **High-Poly Up-Res & Texture Lab**: Upload any `.glb`/`.obj`/`.ply` 3D mesh or Dual-View turnaround sheet to run headless Blender `bpy` Catmull-Clark subdivision, UV unwrapping + baked diffuse/micro-normal/ORM maps, 23-bone UE5 Manny rigging, and textured **`LOD0–LOD3` chain** generation.
  - **Real-Time Three.js 16× Anisotropic PBR Viewport & Texture Inspector**: Instant `Textured PBR` / `Albedo Map` / `Textured + Wire` / `Normals` / `Untextured Clay` shading modes, zoomable **PBR Texture Map Inspector** (`All` | `Albedo` | `Normal` | `ORM`), live **3D 23-Bone X-Ray Skeleton Overlay**, and hot-swappable `LOD0`–`LOD3` switcher.
- **3DModel Pro OpenAPI Docs**: `http://localhost:8080/api/pro/v1/docs`

---

### 3C. Static GitHub Pages 3D Model Viewer — **3DModel View** (`web_model_viewer/` -> `docs/`)

A 100% client-side, zero-backend **GitHub Pages 3D Model View Studio** built with React 18 + TypeScript + Three.js WebGL2, pre-bundled with **4 Draco + WebP High-Poly Textured 3D Showcase Models** (`~6.7 MB` total in `docs/models/`) and local Draco WASM decoding (`docs/draco/`):

- **GitHub Pages Deployment (Zero-Server Hosting)**:
  - **Automatic GitHub Actions Workflow**: `.github/workflows/pages.yml` builds `web_model_viewer` and deploys `docs/` via `actions/deploy-pages@v4` whenever pushed to `main` (enable under **Repository Settings -> Pages -> Source: GitHub Actions**).
  - **Branch `/docs` Mode Ready**: Because `docs/` is pre-compiled with strictly relative `./` paths, `docs/.nojekyll`, and `docs/404.html`, **Settings -> Pages -> Deploy from a branch (`main` / `/docs`)** also works out-of-the-box at `https://adii14990adi-spec.github.io/3dmodel-gen-/`.
- **Viewer Capabilities**:
  - **Pre-Loaded High-Poly Textured Showcase**: `SK_UE5_RealisticFemale` (`301,420` tris · `21` PBR maps · `2.05 MB`), `SK_UE5_CyberTechwear` (`301,420` tris · `21` PBR maps), `SK_UE5_EditorialCouture` (`301,420` tris · `21` PBR maps), and `CH_Turnaround_HighPoly` (`34,772` tris · Dual-View UV Atlas + Weave Normal).
  - **Universal Browser Drag-and-Drop & `?model=` Deep Links**: Drop any local `.glb`, `.gltf`, `.fbx`, `.obj`, `.stl`, or `.ply` (+ companion textures) directly into the viewport with zero server upload, or share `?model=<id-or-url>` links.
  - **7 Shading Modes, Live Rig Pose Sliders & GPU Texture Extractor**: Switch between `Textured PBR`, `Albedo`, `Tex + Wire`, `Wireframe`, `Normals`, `Clay`, and `Chrome`; sweep 360° studio lighting; test 23-bone UE5 Manny skinning live (`T-Pose <-> Relaxed A-Pose`, `Head Yaw`); and inspect embedded WebP/PNG PBR textures.
- **Local GitHub Pages Mirror Preview**:
  ```bash
  python gh_pages_app.py --host 0.0.0.0 --port 8090
  ```

---

### 4. FastAPI REST & Async Queue Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service liveness, compute device, active queue backend, and runtime flags |
| `GET` | `/api/v1/engines` | List registered 3D engines (`volumetric_sdf`, `trellis`, `lgm`, `triposr`, `econ`, `pifuhd`) |
| `GET` | `/api/v1/queue/stats` | Inspect worker queue backend (`inprocess` or `celery`) and job counts |
| `POST` | `/api/v1/preprocess` | Upload dual-view image; returns Front/Back RGBA PNGs and alignment IoU |
| `POST` | `/api/v1/reconstruct` | Synchronous end-to-end 3D synthesis + rigging returning `.glb`, `.obj`, `.zip` |
| `POST` | `/api/v1/jobs/submit` | **Async (`202 Accepted`)**: enqueue single character reconstruction onto worker pool |
| `POST` | `/api/v1/jobs/batch` | **Async (`202 Accepted`)**: enqueue multiple character sheets as a concurrent batch |
| `GET` | `/api/v1/batches/{batch_id}` | Poll aggregated progress & per-item statuses for a submitted batch |
| `GET` | `/api/v1/jobs/{job_id}` | Fetch live progress (`0%–100%`) or completed telemetry & artifact URLs |
| `GET` | `/api/v1/jobs/{job_id}/files/{filename}` | Download rigged `.glb`, `.obj` bundle `.zip`, `skeleton_rig.json`, or preview `.png` |

---

## Distributed Deployment (`Dockerfile` + `docker-compose.yml`)

Launch the full **Web + Redis + Celery Worker** stack:

```bash
docker compose up --build -d
```

Or build the standalone **NVIDIA CUDA 12.1** image with PyTorch `cu121` + `onnxruntime-gpu`:

```bash
docker build --build-arg INSTALL_TORCH_CUDA=true -t auto3d-human:cuda121 .
docker run --rm --gpus all -p 7860:7860 auto3d-human:cuda121
```

---

## Development, Linting & Testing

```bash
ruff check .
ruff format --check .
pytest -v
```
