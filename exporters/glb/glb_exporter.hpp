#pragma once

#include "core/geometry/mesh.hpp"
#include "materials/pbr/material.hpp"

#include <string>
#include <vector>

namespace forge3d::exporters {

struct GlbExportResult {
    bool success = false;
    std::string error;
    size_t file_size_bytes = 0;
    size_t triangle_count = 0;
    size_t material_count = 0;
};

GlbExportResult export_glb(const Mesh& mesh,
                           const std::vector<PBRMaterial>& materials,
                           const std::string& output_path);

bool validate_glb_file(const std::string& path, std::string* error_out = nullptr);

} // namespace forge3d::exporters
