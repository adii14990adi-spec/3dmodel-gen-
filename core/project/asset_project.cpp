#include "core/project/asset_project.hpp"

#include <filesystem>
#include <fstream>

namespace forge3d {

bool save_asset_project(const AssetProject& proj, const std::string& output_path) {
    std::filesystem::path p(output_path);
    if (p.has_parent_path()) {
        std::filesystem::create_directories(p.parent_path());
    }
    std::ofstream out(output_path);
    if (!out) return false;

    out << "{\n";
    out << "  \"asset_name\": \"" << proj.asset_name << "\",\n";
    out << "  \"category\": \"" << proj.category << "\",\n";
    out << "  \"version\": \"" << proj.version << "\",\n";
    out << "  \"target_engine\": \"" << proj.target_engine << "\",\n";
    out << "  \"exports\": {\n";
    out << "    \"fbx\": \"" << proj.fbx_path << "\",\n";
    out << "    \"glb\": \"" << proj.glb_path << "\"\n";
    out << "  },\n";

    out << "  \"parameters\": {\n";
    size_t pi = 0;
    for (const auto& [k, v] : proj.parameters) {
        out << "    \"" << k << "\": \"" << v << "\"";
        if (++pi < proj.parameters.size()) out << ",";
        out << "\n";
    }
    out << "  },\n";

    out << "  \"components\": [\n";
    for (size_t i = 0; i < proj.components.size(); ++i) {
        const auto& c = proj.components[i];
        out << "    {\"id\": " << c.id << ", \"name\": \"" << c.name << "\", \"material_id\": " << c.material_id << "}";
        if (i + 1 < proj.components.size()) out << ",";
        out << "\n";
    }
    out << "  ],\n";

    out << "  \"materials\": [\n";
    for (size_t i = 0; i < proj.materials.size(); ++i) {
        const auto& m = proj.materials[i];
        out << "    {\"id\": " << m.id << ", \"name\": \"" << m.name
            << "\", \"metallic\": " << m.metallic
            << ", \"roughness\": " << m.roughness << "}";
        if (i + 1 < proj.materials.size()) out << ",";
        out << "\n";
    }
    out << "  ],\n";

    out << "  \"validation\": {\n";
    out << "    \"vertex_count\": " << proj.validation.vertex_count << ",\n";
    out << "    \"face_count\": " << proj.validation.face_count << ",\n";
    out << "    \"valid\": " << (proj.validation.is_valid() ? "true" : "false") << ",\n";
    out << "    \"watertight\": " << (proj.validation.is_watertight() ? "true" : "false") << ",\n";
    out << "    \"non_manifold_edges\": " << proj.validation.non_manifold_edges << ",\n";
    out << "    \"degenerate_faces\": " << proj.validation.degenerate_faces << "\n";
    out << "  }\n";
    out << "}\n";

    return true;
}

} // namespace forge3d
