#pragma once

#include "generators/weapons/assault_rifle.hpp"

#include <cstdint>

namespace forge3d::generators {

struct TerrainParams {
    float width = 64.0f;
    float depth = 64.0f;
    uint32_t segments_x = 48;
    uint32_t segments_z = 48;
    float max_height = 8.0f;
    float frequency = 0.08f;
    uint32_t octaves = 4;
    uint32_t seed = 42;
};

GeneratedAsset generate_procedural_terrain(const TerrainParams& params = {});

} // namespace forge3d::generators
