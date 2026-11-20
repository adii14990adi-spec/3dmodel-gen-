#include "generators/buildings/modular_building.hpp"

#include "core/geometry/primitives.hpp"
#include "core/mesh_operations/modelling_ops.hpp"

namespace forge3d::generators {

GeneratedAsset generate_modular_building(const BuildingParams& params) {
    GeneratedAsset asset;
    asset.mesh = Mesh("ModularBuilding");

    PBRMaterial concrete;
    concrete.id = 0;
    concrete.name = "ConcreteFacade";
    concrete.base_color = {0.72f, 0.70f, 0.66f, 1.0f};
    concrete.metallic = 0.0f;
    concrete.roughness = 0.85f;

    PBRMaterial glass;
    glass.id = 1;
    glass.name = "WindowGlass";
    glass.base_color = {0.22f, 0.42f, 0.56f, 1.0f};
    glass.metallic = 0.1f;
    glass.roughness = 0.08f;

    PBRMaterial dark_metal;
    dark_metal.id = 2;
    dark_metal.name = "TrimMetal";
    dark_metal.base_color = {0.15f, 0.16f, 0.18f, 1.0f};
    dark_metal.metallic = 0.8f;
    dark_metal.roughness = 0.35f;

    PBRMaterial wood_door;
    wood_door.id = 3;
    wood_door.name = "DoorWood";
    wood_door.base_color = {0.36f, 0.22f, 0.12f, 1.0f};
    wood_door.metallic = 0.0f;
    wood_door.roughness = 0.65f;

    asset.materials = {concrete, glass, dark_metal, wood_door};

    // Foundation
    uint32_t c_found = asset.mesh.create_component("Foundation", 0);
    Mesh foundation = primitives::make_box(params.width + 0.4f, 0.4f, params.depth + 0.4f);
    ops::append_mesh(asset.mesh, foundation, {0.0f, 0.2f, 0.0f}, 0, c_found);

    uint32_t c_walls = asset.mesh.create_component("Walls", 0);
    uint32_t c_win = asset.mesh.create_component("Windows", 1);
    uint32_t c_trim = asset.mesh.create_component("Trim", 2);

    float base_y = 0.4f;
    for (uint32_t f = 0; f < params.floor_count; ++f) {
        float floor_y = base_y + (static_cast<float>(f) + 0.5f) * params.floor_height;

        // Main floor block
        Mesh floor_box = primitives::make_box(params.width, params.floor_height - 0.15f, params.depth);
        ops::append_mesh(asset.mesh, floor_box, {0.0f, floor_y, 0.0f}, 0, c_walls);

        // Floor slab trim
        Mesh slab = primitives::make_box(params.width + 0.2f, 0.15f, params.depth + 0.2f);
        ops::append_mesh(asset.mesh, slab, {0.0f, base_y + static_cast<float>(f + 1) * params.floor_height - 0.075f, 0.0f}, 2, c_trim);

        // Front & back windows
        float win_w = params.width / static_cast<float>(params.windows_per_side * 2 + 1);
        float win_h = params.floor_height * 0.48f;
        for (uint32_t w = 0; w < params.windows_per_side; ++w) {
            if (f == 0 && w == params.windows_per_side / 2) {
                // Ground floor entrance door
                uint32_t c_door = asset.mesh.create_component("EntranceDoor", 3);
                Mesh door = primitives::make_box(1.2f, 2.2f, 0.12f);
                ops::append_mesh(asset.mesh, door, {0.0f, base_y + 1.1f, params.depth * 0.5f + 0.02f}, 3, c_door);
                continue;
            }
            float t = (static_cast<float>(w) + 0.5f) / static_cast<float>(params.windows_per_side) - 0.5f;
            float wx = t * (params.width * 0.8f);
            Mesh win = primitives::make_box(win_w, win_h, 0.08f);
            ops::append_mesh(asset.mesh, win, {wx, floor_y + 0.1f, params.depth * 0.5f + 0.02f}, 1, c_win);
            ops::append_mesh(asset.mesh, win, {wx, floor_y + 0.1f, -params.depth * 0.5f - 0.02f}, 1, c_win);
        }

        // Optional balcony on upper floors
        if (params.include_balcony && f > 0) {
            Mesh balc_floor = primitives::make_box(params.width * 0.4f, 0.12f, 1.0f);
            float by = base_y + static_cast<float>(f) * params.floor_height + 0.06f;
            ops::append_mesh(asset.mesh, balc_floor, {0.0f, by, params.depth * 0.5f + 0.5f}, 2, c_trim);

            Mesh rail = primitives::make_box(params.width * 0.4f, 0.9f, 0.06f);
            ops::append_mesh(asset.mesh, rail, {0.0f, by + 0.5f, params.depth * 0.5f + 0.97f}, 2, c_trim);
        }
    }

    // Roof parapet
    uint32_t c_roof = asset.mesh.create_component("Roof", 2);
    float roof_y = base_y + static_cast<float>(params.floor_count) * params.floor_height + 0.2f;
    Mesh roof = primitives::make_box(params.width + 0.3f, 0.4f, params.depth + 0.3f);
    ops::bevel_face(roof, 4, 0.08f, 0.15f);
    ops::append_mesh(asset.mesh, roof, {0.0f, roof_y, 0.0f}, 2, c_roof);

    asset.mesh.compute_vertex_normals();
    asset.mesh.compute_tangents();
    return asset;
}

} // namespace forge3d::generators
