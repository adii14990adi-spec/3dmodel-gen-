#include "generators/characters/humanoid_character.hpp"

#include "core/geometry/primitives.hpp"
#include "core/mesh_operations/modelling_ops.hpp"

namespace forge3d::generators {

GeneratedAsset generate_humanoid_character(const CharacterParams& params) {
    GeneratedAsset asset;
    asset.mesh = Mesh("HumanoidCharacter");

    PBRMaterial skin;
    skin.id = 0;
    skin.name = "CharacterSkin";
    skin.base_color = {0.82f, 0.65f, 0.54f, 1.0f};
    skin.metallic = 0.0f;
    skin.roughness = 0.55f;

    PBRMaterial suit;
    suit.id = 1;
    suit.name = "TacticalSuit";
    suit.base_color = {0.16f, 0.18f, 0.22f, 1.0f};
    suit.metallic = 0.1f;
    suit.roughness = 0.68f;

    PBRMaterial armor;
    armor.id = 2;
    armor.name = "ChestArmor";
    armor.base_color = {0.24f, 0.27f, 0.30f, 1.0f};
    armor.metallic = 0.75f;
    armor.roughness = 0.35f;

    asset.materials = {skin, suit, armor};

    float s = params.height / 1.78f;
    float torso_w = params.female_proportions ? params.shoulder_width * 0.85f : params.shoulder_width;

    // 1. Pelvis & Torso
    uint32_t c_torso = asset.mesh.create_component("Torso", 1);
    Mesh torso = primitives::make_box(torso_w * 0.72f, 0.52f * s, 0.24f * s);
    ops::bevel_face(torso, 4, 0.12f, 0.04f * s);
    ops::append_mesh(asset.mesh, torso, {0.0f, 1.15f * s, 0.0f}, 1, c_torso);

    // 2. Head & Neck
    uint32_t c_head = asset.mesh.create_component("Head", 0);
    Mesh neck = primitives::make_cylinder(0.055f * s, 0.10f * s, 12, true);
    ops::append_mesh(asset.mesh, neck, {0.0f, 1.48f * s, 0.0f}, 0, c_head);

    Mesh head = primitives::make_uv_sphere(0.115f * s, 12, 18);
    ops::append_mesh(asset.mesh, head, {0.0f, 1.63f * s, 0.0f}, 0, c_head);

    // 3. Arms & Hands
    uint32_t c_arms = asset.mesh.create_component("Arms", 1);
    float arm_x = torso_w * 0.5f + 0.04f * s;
    for (int side : {-1, 1}) {
        Mesh upper_arm = primitives::make_cylinder(0.052f * s, 0.28f * s, 12, true);
        ops::append_mesh(asset.mesh, upper_arm, {side * arm_x, 1.25f * s, 0.0f}, 1, c_arms);

        Mesh forearm = primitives::make_cylinder(0.044f * s, 0.26f * s, 12, true);
        ops::append_mesh(asset.mesh, forearm, {side * arm_x, 0.96f * s, 0.0f}, 0, c_arms);

        Mesh hand = primitives::make_box(0.045f * s, 0.10f * s, 0.07f * s);
        ops::append_mesh(asset.mesh, hand, {side * arm_x, 0.78f * s, 0.0f}, 0, c_arms);
    }

    // 4. Legs & Boots
    uint32_t c_legs = asset.mesh.create_component("Legs", 1);
    float leg_x = 0.105f * s;
    for (int side : {-1, 1}) {
        Mesh thigh = primitives::make_cylinder(0.078f * s, 0.42f * s, 14, true);
        ops::append_mesh(asset.mesh, thigh, {side * leg_x, 0.68f * s, 0.0f}, 1, c_legs);

        Mesh shin = primitives::make_cylinder(0.058f * s, 0.40f * s, 14, true);
        ops::append_mesh(asset.mesh, shin, {side * leg_x, 0.28f * s, 0.0f}, 1, c_legs);

        Mesh boot = primitives::make_box(0.095f * s, 0.09f * s, 0.22f * s);
        ops::append_mesh(asset.mesh, boot, {side * leg_x, 0.045f * s, 0.04f * s}, 2, c_legs);
    }

    // 5. Optional Armor Vest
    if (params.include_armor_vest) {
        uint32_t c_vest = asset.mesh.create_component("ArmorVest", 2);
        Mesh vest = primitives::make_box(torso_w * 0.78f, 0.36f * s, 0.28f * s);
        ops::bevel_face(vest, 0, 0.15f, 0.02f * s);
        ops::append_mesh(asset.mesh, vest, {0.0f, 1.22f * s, 0.0f}, 2, c_vest);
    }

    asset.mesh.compute_vertex_normals();
    asset.mesh.compute_tangents();
    return asset;
}

} // namespace forge3d::generators
