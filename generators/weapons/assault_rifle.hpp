#pragma once

#include "core/geometry/mesh.hpp"
#include "materials/pbr/material.hpp"

#include <vector>

namespace forge3d::generators {

struct AssaultRifleParams {
    float receiver_length = 0.32f;
    float barrel_length = 0.38f;
    float stock_length = 0.24f;
    float magazine_length = 0.18f;
    bool include_optic = true;
    bool include_rail = true;
};

struct GeneratedAsset {
    Mesh mesh;
    std::vector<PBRMaterial> materials;
};

GeneratedAsset generate_assault_rifle(const AssaultRifleParams& params = {});

} // namespace forge3d::generators
