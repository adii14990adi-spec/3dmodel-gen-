#pragma once

#include "core/geometry/mesh.hpp"
#include "materials/pbr/material.hpp"

#include <string>
#include <vector>

namespace forge3d::exporters {

struct FbxExportResult {
    bool success = false;
    std::string error;
    size_t file_size_bytes = 0;
    size_t vertex_count = 0;
    size_t polygon_count = 0;
    size_t material_count = 0;
};

// Exports a Mesh + PBRMaterials to ASCII FBX 7.4 (1 unit = 1 meter, Unity 6 compatible).
FbxExportResult export_fbx(const Mesh& mesh,
                           const std::vector<PBRMaterial>& materials,
                           const std::string& output_path);

bool validate_fbx_file(const std::string& path, std::string* error_out = nullptr);

} // namespace forge3d::exporters
