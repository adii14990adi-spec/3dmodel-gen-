#pragma once

#include "core/geometry/vec.hpp"

#include <cstdint>
#include <string>

namespace forge3d {

struct PBRMaterial {
    uint32_t id = 0;
    std::string name = "DefaultMaterial";
    Vec4 base_color{0.8f, 0.8f, 0.8f, 1.0f};
    float metallic = 0.0f;
    float roughness = 0.5f;
    Vec3 emissive{0.0f, 0.0f, 0.0f};
    bool double_sided = false;
};

} // namespace forge3d
