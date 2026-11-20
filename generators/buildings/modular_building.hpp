#pragma once

#include "generators/weapons/assault_rifle.hpp"

#include <cstdint>

namespace forge3d::generators {

struct BuildingParams {
    float width = 8.0f;
    float depth = 6.0f;
    uint32_t floor_count = 3;
    float floor_height = 3.0f;
    uint32_t windows_per_side = 3;
    bool include_balcony = true;
};

GeneratedAsset generate_modular_building(const BuildingParams& params = {});

} // namespace forge3d::generators
