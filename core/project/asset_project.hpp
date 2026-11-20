#pragma once

#include "core/geometry/mesh.hpp"
#include "materials/pbr/material.hpp"

#include <map>
#include <string>
#include <vector>

namespace forge3d {

struct AssetProject {
    std::string asset_name;
    std::string category;
    std::string version = "1.0.0";
    std::string target_engine = "Unity 6";
    std::map<std::string, std::string> parameters;
    std::vector<MeshComponent> components;
    std::vector<PBRMaterial> materials;
    ValidationReport validation;
    std::string fbx_path;
    std::string glb_path;
};

bool save_asset_project(const AssetProject& proj, const std::string& output_path);

} // namespace forge3d
