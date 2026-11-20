#include "generators/vehicles/armored_vehicle.hpp"

#include "core/geometry/primitives.hpp"
#include "core/mesh_operations/modelling_ops.hpp"

namespace forge3d::generators {

GeneratedAsset generate_armored_vehicle(const VehicleParams& params) {
    GeneratedAsset asset;
    asset.mesh = Mesh("ArmoredVehicle");

    PBRMaterial armor;
    armor.id = 0;
    armor.name = "OliveArmor";
    armor.base_color = {0.26f, 0.30f, 0.22f, 1.0f};
    armor.metallic = 0.65f;
    armor.roughness = 0.45f;

    PBRMaterial rubber;
    rubber.id = 1;
    rubber.name = "TireRubber";
    rubber.base_color = {0.07f, 0.07f, 0.08f, 1.0f};
    rubber.metallic = 0.0f;
    rubber.roughness = 0.88f;

    PBRMaterial glass;
    glass.id = 2;
    glass.name = "ArmoredGlass";
    glass.base_color = {0.15f, 0.25f, 0.32f, 1.0f};
    glass.metallic = 0.1f;
    glass.roughness = 0.10f;

    asset.materials = {armor, rubber, glass};

    float chassis_y = params.wheel_radius + params.height * 0.25f;

    // 1. Lower Hull
    uint32_t c_hull = asset.mesh.create_component("Hull", 0);
    Mesh hull = primitives::make_box(params.width, params.height * 0.45f, params.length);
    ops::bevel_face(hull, 4, 0.1f, 0.08f);
    ops::append_mesh(asset.mesh, hull, {0.0f, chassis_y, 0.0f}, 0, c_hull);

    // 2. Upper Cabin
    uint32_t c_cab = asset.mesh.create_component("Cabin", 0);
    Mesh cabin = primitives::make_box(params.width * 0.85f, params.height * 0.4f, params.length * 0.55f);
    ops::bevel_face(cabin, 4, 0.15f, 0.06f);
    float cab_y = chassis_y + params.height * 0.42f;
    ops::append_mesh(asset.mesh, cabin, {0.0f, cab_y, -params.length * 0.05f}, 0, c_cab);

    // 3. Windshield
    uint32_t c_win = asset.mesh.create_component("Windshield", 2);
    Mesh windshield = primitives::make_box(params.width * 0.72f, params.height * 0.22f, 0.06f);
    ops::append_mesh(asset.mesh, windshield, {0.0f, cab_y + 0.02f, params.length * 0.225f}, 2, c_win);

    // 4. 4 Wheels
    uint32_t c_wheels = asset.mesh.create_component("Wheels", 1);
    float wx = params.width * 0.5f + params.wheel_width * 0.35f;
    float wz = params.length * 0.32f;
    Vec3 wheel_positions[4] = {
        {-wx, params.wheel_radius,  wz},
        { wx, params.wheel_radius,  wz},
        {-wx, params.wheel_radius, -wz},
        { wx, params.wheel_radius, -wz}
    };
    for (const auto& wp : wheel_positions) {
        Mesh wheel = primitives::make_cylinder(params.wheel_radius, params.wheel_width, 20, true);
        // Rotate cylinder so axis is along X
        for (auto& v : wheel.vertices_mut()) {
            std::swap(v.position.x, v.position.y);
        }
        wheel.compute_vertex_normals();
        ops::append_mesh(asset.mesh, wheel, wp, 1, c_wheels);
    }

    // 5. Optional Roof Turret
    if (params.include_roof_turret) {
        uint32_t c_turret = asset.mesh.create_component("Turret", 0);
        Mesh turret_base = primitives::make_cylinder(0.45f, 0.22f, 16, true);
        float ty = cab_y + params.height * 0.25f + 0.11f;
        ops::append_mesh(asset.mesh, turret_base, {0.0f, ty, -params.length * 0.05f}, 0, c_turret);

        Mesh barrel = primitives::make_cylinder(0.045f, 1.1f, 12, true);
        for (auto& v : barrel.vertices_mut()) {
            std::swap(v.position.y, v.position.z);
        }
        barrel.compute_vertex_normals();
        ops::append_mesh(asset.mesh, barrel, {0.0f, ty + 0.04f, -params.length * 0.05f + 0.7f}, 0, c_turret);
    }

    asset.mesh.compute_vertex_normals();
    asset.mesh.compute_tangents();
    return asset;
}

} // namespace forge3d::generators
