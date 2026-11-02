# Auto3D-Human: Image-to-3D T-Pose Character Pipeline

**Auto3D-Human** is an automated Python pipeline that transforms a single **dual-view T-pose character reference sheet** (containing aligned **Front** and **Back** views) into a **watertight, rigging-ready, 25-bone humanoid-skinned, PBR-textured 3D mesh (`.glb` / `.obj`)**, exposed via a **CLI tool**, an async-scalable **FastAPI REST backend**, and an interactive **Gradio Web UI**.

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
│   ├── pipeline.py               # End-to-end Auto3DHumanPipeline orchestrator
│   ├── preprocessor.py           # Dual-view splitting, spine centering, rembg / GrabCut
│   ├── side_synthesizer.py       # ±90° lateral profile synthesis (Anatomical / Zero123++ / SV3D)
│   ├── reconstructor.py          # Multi-view 3D synthesis & Marching Cubes engines
│   ├── postprocessor.py          # Taubin smoothing, quadric decimation, normals, GLB/OBJ export
│   ├── rigger.py                 # 25-bone glTF 2.0 humanoid armature & LBS skinning injector
│   ├── server.py                 # FastAPI synchronous & async queue REST endpoints
│   └── worker.py                 # Celery + Redis & ThreadPool async batch worker queue
├── tests/                        # Comprehensive unit & integration test suite
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

List registered 3D engines or run clothed-body Screened Poisson normal integration (`econ`):

```bash
python cli.py --list-engines
python cli.py -i assets/sample_input.jpg -o outputs/econ_run --engine econ --json
```

---

### 3. Gradio Web UI + Mounted FastAPI Server (`app.py`)

Launch the combined Web Studio and REST API (binds to `0.0.0.0:7860`):

```bash
python app.py
```

- **Gradio Web Studio**: `http://localhost:7860/`
- **Swagger / OpenAPI Docs**: `http://localhost:7860/docs`
- **Queue Telemetry**: `http://localhost:7860/api/v1/queue/stats`
- **Health Endpoint**: `http://localhost:7860/health`

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
