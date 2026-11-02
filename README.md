# Repository Specification: Auto3D-Human (Image-to-3D T-Pose Character Pipeline)

## Objective
Build a complete, automated Python-based pipeline that takes a dual-view character reference image (containing aligned Front and Back T-pose figures), processes it, reconstructs a watertight textured 3D mesh (.glb / .obj), and exposes the service via both a CLI tool and a FastAPI backend with Gradio web UI.

---

## Technical Stack & Architecture
- **Language**: Python 3.10+
- **Image Processing**: OpenCV, Pillow, Rembg (`u2net_human_seg`)
- **3D Reconstruction Core**:
  - Primary Engine: TRELLIS / LGM (Large Multi-View Gaussian Model) or TripoSR integration
  - Clothed Body Alternative: Modular connector for ECON / PIFuHD
  - Mesh Utilities: PyVista, Trimesh, Open3D
- **API & UI**: FastAPI, Pydantic, Gradio
- **CI/CD & Deployment**: GitHub Actions (linting, tests, Docker build), Dockerfile with CUDA 12.1 runtime support.

---

## Directory Structure to Generate
```text
auto3d-human/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── assets/
│   └── sample_input.jpg
├── src/
│   ├── __init__.py
│   ├── config.py
│   ├── preprocessor.py       # Splitting front/back, auto-centering, rembg
│   ├── reconstructor.py      # Multi-view 3D synthesis & marching cubes export
│   ├── postprocessor.py      # Mesh decimation, normal cleaning, GLB export
│   └── server.py             # FastAPI REST endpoints
├── app.py                    # Gradio Web UI
├── cli.py                    # Command-line interface
├── Dockerfile
├── requirements.txt
└── README.md
