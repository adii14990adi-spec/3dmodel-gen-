#pragma once

#include "generators/weapons/assault_rifle.hpp"

namespace forge3d::generators {

struct VehicleParams {
    float length = 4.6f;
    float width = 2.1f;
    float height = 1.6f;
    float wheel_radius = 0.42f;
    float wheel_width = 0.28f;
    bool include_roof_turret = true;
};

GeneratedAsset generate_armored_vehicle(const VehicleParams& params = {});

} // namespace forge3d::generators
