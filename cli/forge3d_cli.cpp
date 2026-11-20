#include "core/project/asset_project.hpp"
#include "exporters/fbx/fbx_exporter.hpp"
#include "exporters/glb/glb_exporter.hpp"
#include "generators/buildings/modular_building.hpp"
#include "generators/characters/humanoid_character.hpp"
#include "generators/terrain/procedural_terrain.hpp"
#include "generators/vehicles/armored_vehicle.hpp"
#include "generators/weapons/assault_rifle.hpp"

#include <filesystem>
#include <iostream>
#include <string>

using namespace forge3d;

namespace {

bool process_and_export(const std::string& name,
                        const std::string& category,
                        const std::string& unity_folder,
                        const generators::GeneratedAsset& asset,
                        const std::map<std::string, std::string>& params) {
    ValidationReport rep = asset.mesh.validate();
    std::cout << "[" << category << "] " << name << " -> " << rep.summary() << "\n";
    if (!rep.is_valid()) {
        std::cerr << "ERROR: Validation failed for " << name << "\n";
        return false;
    }

    std::string fbx_path = "Unity_Export/" + unity_folder + "/" + name + ".fbx";
    std::string glb_path = "Unity_Export/" + unity_folder + "/" + name + ".glb";
    std::string proj_path = "Unity_Export/Reports/" + name + ".assetproj";

    auto fbx_res = exporters::export_fbx(asset.mesh, asset.materials, fbx_path);
    if (!fbx_res.success || !exporters::validate_fbx_file(fbx_path)) {
        std::cerr << "ERROR: FBX export/validation failed for " << name << ": " << fbx_res.error << "\n";
        return false;
    }

    auto glb_res = exporters::export_glb(asset.mesh, asset.materials, glb_path);
    if (!glb_res.success || !exporters::validate_glb_file(glb_path)) {
        std::cerr << "ERROR: GLB export/validation failed for " << name << ": " << glb_res.error << "\n";
        return false;
    }

    AssetProject proj;
    proj.asset_name = name;
    proj.category = category;
    proj.parameters = params;
    proj.components = asset.mesh.components();
    proj.materials = asset.materials;
    proj.validation = rep;
    proj.fbx_path = fbx_path;
    proj.glb_path = glb_path;

    if (!save_asset_project(proj, proj_path)) {
        std::cerr << "ERROR: Failed to save .assetproj for " << name << "\n";
        return false;
    }

    std::cout << "  Exported FBX (" << fbx_res.file_size_bytes << " B), GLB ("
              << glb_res.file_size_bytes << " B), Project (" << proj_path << ")\n";
    return true;
}

} // namespace

int main() {
    // Create Unity_Export directory structure
    const char* dirs[] = {
        "Unity_Export/Characters", "Unity_Export/Weapons", "Unity_Export/Vehicles",
        "Unity_Export/Buildings", "Unity_Export/Environments", "Unity_Export/Props",
        "Unity_Export/Textures", "Unity_Export/Materials", "Unity_Export/Animations",
        "Unity_Export/Collisions", "Unity_Export/LOD", "Unity_Export/Reports"
    };
    for (const char* d : dirs) {
        std::filesystem::create_directories(d);
    }

    bool ok = true;
    ok &= process_and_export(
        "assault_rifle", "Weapon", "Weapons",
        generators::generate_assault_rifle(),
        {{"receiver_length", "0.32"}, {"barrel_length", "0.38"}, {"include_optic", "true"}});

    ok &= process_and_export(
        "modular_building", "Building", "Buildings",
        generators::generate_modular_building(),
        {{"width", "8.0"}, {"depth", "6.0"}, {"floor_count", "3"}, {"include_balcony", "true"}});

    ok &= process_and_export(
        "armored_vehicle", "Vehicle", "Vehicles",
        generators::generate_armored_vehicle(),
        {{"length", "4.6"}, {"width", "2.1"}, {"include_roof_turret", "true"}});

    ok &= process_and_export(
        "procedural_terrain", "Environment", "Environments",
        generators::generate_procedural_terrain(),
        {{"width", "64.0"}, {"depth", "64.0"}, {"max_height", "8.0"}, {"octaves", "4"}});

    ok &= process_and_export(
        "humanoid_character", "Character", "Characters",
        generators::generate_humanoid_character(),
        {{"height", "1.78"}, {"include_armor_vest", "true"}});

    if (!ok) {
        std::cerr << "Forge3D CLI finished with errors.\n";
        return 1;
    }
    std::cout << "All 5 Unity 6 demonstration assets generated and validated successfully.\n";
    return 0;
}
