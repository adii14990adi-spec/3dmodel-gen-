"""Unit tests for MultiViewReconstructor and modular 3D engine connectors."""

from __future__ import annotations

import pytest

from src.config import (
    PROJECT_ROOT,
    PreprocessorConfig,
    ReconstructionEngineType,
    ReconstructorConfig,
)
from src.preprocessor import DualViewPreprocessor, PreprocessedPair
from src.reconstructor import (
    BaseReconstructionEngine,
    EngineNotAvailableError,
    EngineRegistry,
    MultiViewReconstructor,
    RawReconstructionResult,
)

SAMPLE_IMAGE = PROJECT_ROOT / "assets" / "sample_input.jpg"


@pytest.fixture(scope="module")
def sample_preprocessed() -> PreprocessedPair:
    return DualViewPreprocessor(PreprocessorConfig(image_size=256)).process(SAMPLE_IMAGE)


def test_volumetric_sdf_engine_watertight_marching_cubes(sample_preprocessed: PreprocessedPair) -> None:
    cfg = ReconstructorConfig(engine=ReconstructionEngineType.VOLUMETRIC_SDF, mc_resolution=80)
    rec = MultiViewReconstructor(cfg)
    raw = rec.reconstruct(sample_preprocessed)

    assert raw.engine_used == "volumetric_sdf"
    assert len(raw.mesh.vertices) > 500
    assert len(raw.mesh.faces) > 1000
    assert raw.mesh.is_watertight is True
    assert raw.mesh.volume > 0.0


def test_econ_clothed_body_connector_screened_poisson(sample_preprocessed: PreprocessedPair) -> None:
    cfg = ReconstructorConfig(engine=ReconstructionEngineType.ECON, mc_resolution=80)
    rec = MultiViewReconstructor(cfg)
    raw = rec.reconstruct(sample_preprocessed)

    assert raw.engine_used == "econ"
    assert raw.diagnostics.get("normal_integration") == "screened_poisson_dct"
    assert raw.mesh.is_watertight is True
    assert raw.mesh.volume > 0.0


def test_neural_engine_strict_vs_fallback(sample_preprocessed: PreprocessedPair) -> None:
    strict_cfg = ReconstructorConfig(
        engine=ReconstructionEngineType.PIFUHD,
        mc_resolution=64,
        allow_fallback=False,
        pifuhd_checkpoint_path=None,
    )
    with pytest.raises(EngineNotAvailableError):
        MultiViewReconstructor(strict_cfg).reconstruct(sample_preprocessed)

    fallback_cfg = strict_cfg.model_copy(update={"allow_fallback": True})
    res = MultiViewReconstructor(fallback_cfg).reconstruct(sample_preprocessed)
    assert res.engine_used == "volumetric_sdf"
    assert res.diagnostics.get("requested_engine") == "pifuhd"


def test_engine_registry_listing_and_custom_plugin(sample_preprocessed: PreprocessedPair) -> None:
    registry = EngineRegistry()
    infos = registry.list_info(ReconstructorConfig())
    names = {i.name for i in infos}
    assert {"volumetric_sdf", "trellis", "lgm", "triposr", "econ", "pifuhd"}.issubset(names)

    class CustomDummyEngine(BaseReconstructionEngine):
        name = "custom_dummy"
        category = "custom"
        requires_gpu = False
        description = "Dummy test connector"

        def check_availability(self, config: ReconstructorConfig) -> tuple[bool, str]:
            return True, "Ready"

        def reconstruct(
            self, preprocessed: PreprocessedPair, config: ReconstructorConfig
        ) -> RawReconstructionResult:
            import trimesh

            sphere = trimesh.creation.icosphere(subdivisions=2, radius=0.4)
            return RawReconstructionResult(
                mesh=sphere,
                front_rgb_dilated=preprocessed.front_rgb,
                back_rgb_dilated=preprocessed.back_rgb,
                front_mask=preprocessed.front_mask,
                back_mask=preprocessed.back_mask,
                engine_used=self.name,
            )

    registry.register(CustomDummyEngine())
    fetched = registry.get("custom_dummy")
    out = fetched.reconstruct(sample_preprocessed, ReconstructorConfig())
    assert out.engine_used == "custom_dummy"
    assert out.mesh.is_watertight is True
