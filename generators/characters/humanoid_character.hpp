#pragma once

#include "generators/weapons/assault_rifle.hpp"

namespace forge3d::generators {

struct CharacterParams {
    float height = 1.78f;
    float shoulder_width = 0.44f;
    bool female_proportions = false;
    bool include_armor_vest = true;
};

GeneratedAsset generate_humanoid_character(const CharacterParams& params = {});

} // namespace forge3d::generators
