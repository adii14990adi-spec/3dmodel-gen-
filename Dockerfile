# syntax=docker/dockerfile:1
FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04

LABEL org.opencontainers.image.title="Auto3D-Human" \
      org.opencontainers.image.description="Automated Dual-View T-Pose Character Image-to-3D Pipeline (CUDA 12.1)" \
      org.opencontainers.image.version="1.0.0"

ARG DEBIAN_FRONTEND=noninteractive
ARG INSTALL_TORCH_CUDA=false

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    NVIDIA_VISIBLE_DEVICES=all \
    NVIDIA_DRIVER_CAPABILITIES=compute,utility,graphics \
    AUTO3D_API_HOST=0.0.0.0 \
    AUTO3D_API_PORT=8000 \
    AUTO3D_GRADIO_PORT=7860

# System dependencies for Python 3.10+, OpenCV, VTK/PyVista, Open3D (EGL/GL), and Git
RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        python3-venv \
        python3-dev \
        build-essential \
        git \
        curl \
        ca-certificates \
        libgl1 \
        libegl1 \
        libglib2.0-0 \
        libgomp1 \
        libsm6 \
        libxext6 \
        libxrender1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root runtime user
RUN useradd --create-home --uid 1000 --shell /bin/bash auto3d \
    && mkdir -p /app/outputs /app/.cache \
    && chown -R auto3d:auto3d /app

COPY --chown=auto3d:auto3d requirements.txt /app/requirements.txt

RUN python3 -m pip install --upgrade pip setuptools wheel \
    && python3 -m pip install -r /app/requirements.txt \
    && if [ "${INSTALL_TORCH_CUDA}" = "true" ]; then \
         python3 -m pip install --index-url https://download.pytorch.org/whl/cu121 \
             torch torchvision \
         && python3 -m pip install onnxruntime-gpu safetensors; \
       fi

COPY --chown=auto3d:auto3d assets/ /app/assets/
COPY --chown=auto3d:auto3d src/ /app/src/
COPY --chown=auto3d:auto3d app.py cli.py pyproject.toml README.md /app/

USER auto3d

EXPOSE 7860 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=25s --retries=3 \
    CMD curl -fsS http://127.0.0.1:7860/health || exit 1

CMD ["python3", "app.py"]
