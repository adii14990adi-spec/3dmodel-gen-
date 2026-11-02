"""Configuration schemas and environment settings for Auto3D-Human."""

from __future__ import annotations

from enum import Enum
from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class SplitMode(str, Enum):
    """Dual-view reference image splitting strategy."""

    AUTO = "auto"
    HORIZONTAL = "horizontal"  # Left = Front, Right = Back
    VERTICAL = "vertical"  # Top = Front, Bottom = Back


class SegmentationBackend(str, Enum):
    """Foreground human segmentation backend."""

    AUTO = "auto"
    REMBG = "rembg"  # u2net_human_seg via rembg + onnxruntime
    GRABCUT = "grabcut"  # Border-seeded CIE Lab + GrabCut refinement
    ALPHA = "alpha"  # Existing RGBA alpha channel


class SideSynthesisBackend(str, Enum):
    """Lateral (±90°) profile synthesis & side-view inpainting backend."""

    NONE = "none"
    AUTO = "auto"
    ANATOMICAL = "anatomical"  # Built-in sagittal S-curve & lateral horizon inpainting
    ZERO123PLUS = "zero123plus"  # Multi-view diffusion connector (sudo-ai/zero123plus-v1.2)
    SV3D = "sv3d"  # Orbital video diffusion connector (stabilityai/sv3d)


class ReconstructionEngineType(str, Enum):
    """Supported 3D reconstruction backends and modular connectors."""

    AUTO = "auto"
    VOLUMETRIC_SDF = "volumetric_sdf"  # Built-in Multi-View SDF + Marching Cubes
    TRELLIS = "trellis"  # Primary: Microsoft TRELLIS multi-image 3D
    LGM = "lgm"  # Primary: Large Multi-View Gaussian Model
    TRIPOSR = "triposr"  # Primary: StabilityAI TripoSR dual-view fusion
    ECON = "econ"  # Clothed Body Connector: Normal integration (ECON)
    PIFUHD = "pifuhd"  # Clothed Body Connector: Pixel-Aligned Implicit (PIFuHD)


class TextureMode(str, Enum):
    """Mesh texture baking representation."""

    UV_ATLAS = "uv_atlas"  # Crisp Front/Back UV texture atlas + PBR material
    VERTEX_COLOR = "vertex_color"  # Welded per-vertex RGBA colors


class RiggingBackend(str, Enum):
    """Humanoid armature & Linear Blend Skinning (LBS) injection backend."""

    NONE = "none"
    AUTO = "auto"
    BUILTIN_HUMANOID = "builtin_humanoid"  # 25-joint glTF 2.0 `skins` + heat-diffused LBS weights
    SMPLX = "smplx"  # SMPL-X template KDTree skinning transfer connector
    BLENDER = "blender"  # Headless blender-python ARMATURE_AUTO connector


class QueueBackend(str, Enum):
    """Asynchronous background worker queue backend."""

    AUTO = "auto"
    INPROCESS = "inprocess"  # Non-blocking ThreadPoolExecutor worker queue
    CELERY = "celery"  # Distributed Celery + Redis worker queue


class PreprocessorConfig(BaseModel):
    """Configuration for dual-view splitting, background removal, and centering."""

    image_size: int = Field(
        default=512,
        ge=128,
        le=2048,
        description="Target square canvas resolution per view (pixels).",
    )
    foreground_ratio: float = Field(
        default=0.86,
        ge=0.50,
        le=0.96,
        description="Fraction of canvas height occupied by the normalized T-pose figure.",
    )
    split_mode: SplitMode = Field(
        default=SplitMode.AUTO,
        description="How to split the dual-view reference sheet into Front and Back.",
    )
    segmentation_backend: SegmentationBackend = Field(
        default=SegmentationBackend.AUTO,
        description="Foreground human segmentation method.",
    )
    rembg_model: str = Field(
        default="u2net_human_seg",
        description="Rembg ONNX model name for human segmentation.",
    )
    alpha_matting: bool = Field(
        default=False,
        description="Enable alpha matting refinement in rembg when available.",
    )
    mask_threshold: int = Field(
        default=127,
        ge=1,
        le=254,
        description="Binary mask threshold used for bounding-box extraction.",
    )
    align_heights: bool = Field(
        default=True,
        description="Normalize Front and Back figures to identical vertical spans.",
    )
    swap_views: bool = Field(
        default=False,
        description="Swap Front and Back views if input has Back on left / top.",
    )
    allow_downloads: bool = Field(
        default=False,
        description="Allow rembg to download ONNX weights from internet if not cached.",
    )


class SideSynthesizerConfig(BaseModel):
    """Configuration for automated ±90° lateral profile synthesis and side-view inpainting."""

    enabled: bool = Field(
        default=True,
        description="Synthesize orthogonal ±90° side profiles to sharpen lateral 3D fidelity.",
    )
    backend: SideSynthesisBackend = Field(
        default=SideSynthesisBackend.AUTO,
        description="Side-view synthesis backend ('auto', 'anatomical', 'zero123plus', 'sv3d', 'none').",
    )
    carve_strength: float = Field(
        default=0.82,
        ge=0.0,
        le=1.0,
        description="Blend weight of synthesized sagittal profile during 3D SDF construction.",
    )
    zero123_model_id: str = Field(default="sudo-ai/zero123plus-v1.2")
    sv3d_model_id: str = Field(default="stabilityai/sv3d")
    allow_fallback: bool = Field(default=True)


class ReconstructorConfig(BaseModel):
    """Configuration for multi-view 3D synthesis and marching cubes extraction."""

    engine: ReconstructionEngineType = Field(
        default=ReconstructionEngineType.AUTO,
        description="3D reconstruction engine or modular clothed-body connector.",
    )
    device: str = Field(
        default="auto",
        description="Compute device ('auto', 'cuda', 'cpu').",
    )
    mc_resolution: int = Field(
        default=160,
        ge=48,
        le=384,
        description="Voxel grid resolution along the longest axis for Marching Cubes.",
    )
    depth_scale: float = Field(
        default=0.55,
        ge=0.20,
        le=1.00,
        description="Anatomical torso depth-to-width ratio cap.",
    )
    relief_strength: float = Field(
        default=0.08,
        ge=0.00,
        le=0.30,
        description="Strength of normal/luminance clothing & facial surface relief.",
    )
    sdf_smooth_sigma: float = Field(
        default=1.0,
        ge=0.0,
        le=3.5,
        description="Gaussian smoothing sigma applied to the 3D SDF prior to Marching Cubes.",
    )
    allow_fallback: bool = Field(
        default=True,
        description="Fall back to volumetric_sdf if requested neural checkpoint is unavailable.",
    )
    triposr_model_id: str = Field(default="stabilityai/TripoSR")
    trellis_model_id: str = Field(default="microsoft/TRELLIS-image-large")
    lgm_checkpoint_path: str | None = Field(default=None)
    econ_root_dir: str | None = Field(default=None)
    pifuhd_checkpoint_path: str | None = Field(default=None)


class PostProcessorConfig(BaseModel):
    """Configuration for mesh decimation, normal cleaning, UV texturing, and export."""

    target_faces: int = Field(
        default=20000,
        ge=0,
        le=500000,
        description="Target triangle count after quadric decimation (0 disables decimation).",
    )
    smoothing_iterations: int = Field(
        default=12,
        ge=0,
        le=100,
        description="Taubin volume-preserving mesh smoothing iterations.",
    )
    smoothing_pass_band: float = Field(
        default=0.10,
        gt=0.001,
        le=1.0,
        description="Pass-band parameter for Taubin smoothing.",
    )
    fill_holes: bool = Field(
        default=True,
        description="Repair boundary holes to guarantee watertight manifold geometry.",
    )
    keep_largest_component: bool = Field(
        default=True,
        description="Discard stray disconnected voxel fragments.",
    )
    clean_normals: bool = Field(
        default=True,
        description="Enforce consistent outward-facing triangle winding and vertex normals.",
    )
    normalize_scale: bool = Field(
        default=True,
        description="Scale character to canonical humanoid height with feet grounded at Y=0.",
    )
    target_height: float = Field(
        default=1.80,
        gt=0.10,
        le=10.0,
        description="Target character height in meters (glTF standard units).",
    )
    texture_mode: TextureMode = Field(
        default=TextureMode.UV_ATLAS,
        description="Texture representation ('uv_atlas' or 'vertex_color').",
    )
    texture_resolution: int = Field(
        default=1024,
        ge=256,
        le=4096,
        description="Resolution of baked UV texture atlas in pixels.",
    )
    export_formats: list[Literal["glb", "obj"]] = Field(
        default_factory=lambda: ["glb", "obj"],
        description="Mesh file formats to export.",
    )

    @field_validator("export_formats")
    @classmethod
    def _validate_formats(cls, v: list[Literal["glb", "obj"]]) -> list[Literal["glb", "obj"]]:
        if not v:
            return ["glb"]
        deduped: list[Literal["glb", "obj"]] = []
        for fmt in v:
            if fmt not in deduped:
                deduped.append(fmt)
        return deduped


class RiggingConfig(BaseModel):
    """Configuration for auto-rigging and humanoid armature injection into .glb."""

    enabled: bool = Field(
        default=True,
        description="Inject a 25-bone standard humanoid armature and LBS skinning weights into .glb.",
    )
    backend: RiggingBackend = Field(
        default=RiggingBackend.AUTO,
        description="Auto-rigging backend ('auto', 'builtin_humanoid', 'smplx', 'blender', 'none').",
    )
    weight_smooth_iterations: int = Field(
        default=6,
        ge=0,
        le=30,
        description="Laplacian skinning weight heat-diffusion smoothing passes.",
    )
    smplx_model_path: str | None = Field(default=None)
    blender_executable: str = Field(default="blender")
    allow_fallback: bool = Field(default=True)


class WorkerQueueConfig(BaseModel):
    """Configuration for async background worker offloading (Celery/Redis or ThreadPool)."""

    backend: QueueBackend = Field(
        default=QueueBackend.AUTO,
        description="Worker queue backend ('auto', 'celery', 'inprocess').",
    )
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        description="Redis broker & result backend URL for Celery worker mode.",
    )
    max_workers: int = Field(
        default=2,
        ge=1,
        le=32,
        description="Concurrent worker threads when using the built-in in-process queue.",
    )
    max_batch_size: int = Field(
        default=16,
        ge=1,
        le=128,
        description="Maximum number of images accepted per /api/v1/jobs/batch call.",
    )


class PipelineConfig(BaseModel):
    """Composite configuration for an end-to-end Auto3D-Human run."""

    preprocessor: PreprocessorConfig = Field(default_factory=PreprocessorConfig)
    side_synthesizer: SideSynthesizerConfig = Field(default_factory=SideSynthesizerConfig)
    reconstructor: ReconstructorConfig = Field(default_factory=ReconstructorConfig)
    postprocessor: PostProcessorConfig = Field(default_factory=PostProcessorConfig)
    rigging: RiggingConfig = Field(default_factory=RiggingConfig)


class AppSettings(BaseSettings):
    """Application-level settings populated from environment variables."""

    model_config = SettingsConfigDict(
        env_prefix="AUTO3D_",
        env_nested_delimiter="__",
        extra="ignore",
    )

    app_name: str = "Auto3D-Human"
    version: str = "1.1.0"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    gradio_port: int = 7860
    output_dir: Path = PROJECT_ROOT / "outputs"
    assets_dir: Path = PROJECT_ROOT / "assets"
    sample_image_path: Path = PROJECT_ROOT / "assets" / "sample_input.jpg"
    max_upload_mb: int = 32
    job_retention_count: int = 40
    allow_downloads: bool = False

    preprocessor: PreprocessorConfig = Field(default_factory=PreprocessorConfig)
    side_synthesizer: SideSynthesizerConfig = Field(default_factory=SideSynthesizerConfig)
    reconstructor: ReconstructorConfig = Field(default_factory=ReconstructorConfig)
    postprocessor: PostProcessorConfig = Field(default_factory=PostProcessorConfig)
    rigging: RiggingConfig = Field(default_factory=RiggingConfig)
    worker_queue: WorkerQueueConfig = Field(default_factory=WorkerQueueConfig)

    def to_pipeline_config(self) -> PipelineConfig:
        pre = self.preprocessor.model_copy(
            update={"allow_downloads": self.allow_downloads or self.preprocessor.allow_downloads}
        )
        return PipelineConfig(
            preprocessor=pre,
            side_synthesizer=self.side_synthesizer.model_copy(),
            reconstructor=self.reconstructor.model_copy(),
            postprocessor=self.postprocessor.model_copy(),
            rigging=self.rigging.model_copy(),
        )


@lru_cache(maxsize=1)
def get_settings() -> AppSettings:
    """Return cached application settings."""
    return AppSettings()
