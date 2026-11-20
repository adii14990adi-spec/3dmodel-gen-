#include "generators/weapons/assault_rifle.hpp"

#include "core/geometry/primitives.hpp"
#include "core/mesh_operations/modelling_ops.hpp"

namespace forge3d::generators {

GeneratedAsset generate_assault_rifle(const AssaultRifleParams& params) {
    GeneratedAsset asset;
    asset.mesh = Mesh("AssaultRifle");

    // Materials: 0 = Gunmetal Steel, 1 = Polymer Matte, 2 = Optic Glass
    PBRMaterial steel;
    steel.id = 0;
    steel.name = "GunmetalSteel";
    steel.base_color = {0.18f, 0.19f, 0.21f, 1.0f};
    steel.metallic = 0.88f;
    steel.roughness = 0.32f;

    PBRMaterial polymer;
    polymer.id = 1;
    polymer.name = "TacticalPolymer";
    polymer.base_color = {0.09f, 0.095f, 0.10f, 1.0f};
    polymer.metallic = 0.05f;
    polymer.roughness = 0.72f;

    PBRMaterial optic_glass;
    optic_glass.id = 2;
    optic_glass.name = "OpticLens";
    optic_glass.base_color = {0.10f, 0.35f, 0.55f, 1.0f};
    optic_glass.metallic = 0.1f;
    optic_glass.roughness = 0.08f;

    asset.materials = {steel, polymer, optic_glass};

    // 1. Upper & Lower Receiver (beveled)
    uint32_t c_rec = asset.mesh.create_component("Receiver", 0);
    Mesh receiver = primitives::make_box(params.receiver_length, 0.075f, 0.048f);
    ops::bevel_face(receiver, 4, 0.12f, 0.012f); // top bevel
    ops::append_mesh(asset.mesh, receiver, {0.0f, 0.0f, 0.0f}, 0, c_rec);

    // 2. Handguard
    uint32_t c_hg = asset.mesh.create_component("Handguard", 1);
    Mesh handguard = primitives::make_box(params.barrel_length * 0.65f, 0.062f, 0.046f);
    ops::bevel_face(handguard, 4, 0.15f, 0.006f);
    float hg_x = params.receiver_length * 0.5f + params.barrel_length * 0.325f;
    ops::append_mesh(asset.mesh, handguard, {hg_x, 0.005f, 0.0f}, 1, c_hg);

    // 3. Barrel (rotated along X via vertex swap) & Muzzle Brake
    uint32_t c_bar = asset.mesh.create_component("Barrel", 0);
    Mesh barrel = primitives::make_cylinder(0.012f, params.barrel_length, 16, true);
    for (auto& v : barrel.vertices_mut()) {
        std::swap(v.position.x, v.position.y);
    }
    barrel.compute_vertex_normals();
    float bar_x = params.receiver_length * 0.5f + params.barrel_length * 0.5f;
    ops::append_mesh(asset.mesh, barrel, {bar_x, 0.012f, 0.0f}, 0, c_bar);

    // Muzzle brake
    Mesh muzzle = primitives::make_cylinder(0.016f, 0.045f, 16, true);
    for (auto& v : muzzle.vertices_mut()) {
        std::swap(v.position.x, v.position.y);
    }
    muzzle.compute_vertex_normals();
    ops::append_mesh(asset.mesh, muzzle, {bar_x + params.barrel_length * 0.5f + 0.02f, 0.012f, 0.0f}, 0, c_bar);

    // 4. Stock
    uint32_t c_stock = asset.mesh.create_component("Stock", 1);
    Mesh stock = primitives::make_box(params.stock_length, 0.095f, 0.040f);
    ops::bevel_face(stock, 5, 0.15f, 0.01f);
    float stock_x = -params.receiver_length * 0.5f - params.stock_length * 0.5f;
    ops::append_mesh(asset.mesh, stock, {stock_x, -0.01f, 0.0f}, 1, c_stock);

    // 5. Pistol Grip
    uint32_t c_grip = asset.mesh.create_component("PistolGrip", 1);
    Mesh grip = primitives::make_box(0.042f, 0.11f, 0.036f);
    ops::append_mesh(asset.mesh, grip, {-params.receiver_length * 0.25f, -0.085f, 0.0f}, 1, c_grip);

    // 6. Magazine
    uint32_t c_mag = asset.mesh.create_component("Magazine", 1);
    Mesh mag = primitives::make_box(0.058f, params.magazine_length, 0.028f);
    ops::append_mesh(asset.mesh, mag, {params.receiver_length * 0.15f, -0.035f - params.magazine_length * 0.5f, 0.0f}, 1, c_mag);

    // 7. Top Picatinny Rail & Optic
    if (params.include_rail) {
        uint32_t c_rail = asset.mesh.create_component("TopRail", 0);
        Mesh rail = primitives::make_box(params.receiver_length * 0.9f, 0.012f, 0.024f);
        ops::append_mesh(asset.mesh, rail, {0.0f, 0.052f, 0.0f}, 0, c_rail);
    }

    if (params.include_optic) {
        uint32_t c_opt = asset.mesh.create_component("OpticScope", 0);
        Mesh scope_body = primitives::make_cylinder(0.022f, 0.13f, 16, true);
        for (auto& v : scope_body.vertices_mut()) {
            std::swap(v.position.x, v.position.y);
        }
        scope_body.compute_vertex_normals();
        ops::append_mesh(asset.mesh, scope_body, {0.02f, 0.082f, 0.0f}, 0, c_opt);

        Mesh lens = primitives::make_cylinder(0.019f, 0.008f, 16, true);
        for (auto& v : lens.vertices_mut()) {
            std::swap(v.position.x, v.position.y);
        }
        lens.compute_vertex_normals();
        ops::append_mesh(asset.mesh, lens, {0.088f, 0.082f, 0.0f}, 2, c_opt);
    }

    asset.mesh.compute_vertex_normals();
    asset.mesh.compute_tangents();
    return asset;
}

} // namespace forge3d::generators
