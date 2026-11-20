#include "exporters/glb/glb_exporter.hpp"

#include <algorithm>
#include <cstring>
#include <filesystem>
#include <fstream>
#include <map>
#include <sstream>

namespace forge3d::exporters {

namespace {

constexpr uint32_t kGlbMagic = 0x46546C67; // "glTF"
constexpr uint32_t kGlbVersion = 2;
constexpr uint32_t kChunkJson = 0x4E4F534A; // "JSON"
constexpr uint32_t kChunkBin = 0x004E4942;  // "BIN\0"

void append_bytes(std::vector<uint8_t>& buf, const void* data, size_t size) {
    const auto* ptr = static_cast<const uint8_t*>(data);
    buf.insert(buf.end(), ptr, ptr + size);
}

void pad_to_4(std::vector<uint8_t>& buf, uint8_t pad_byte) {
    while (buf.size() % 4 != 0) {
        buf.push_back(pad_byte);
    }
}

std::string escape_json(const std::string& s) {
    std::string out;
    out.reserve(s.size());
    for (char c : s) {
        if (c == '"') out += "\\\"";
        else if (c == '\\') out += "\\\\";
        else out += c;
    }
    return out;
}

} // namespace

GlbExportResult export_glb(const Mesh& mesh,
                           const std::vector<PBRMaterial>& materials,
                           const std::string& output_path) {
    GlbExportResult result;

    if (mesh.vertex_count() == 0 || mesh.face_count() == 0) {
        result.error = "Mesh has no vertices or faces.";
        return result;
    }

    Mesh tri_mesh = mesh;
    tri_mesh.triangulate();
    const auto& verts = tri_mesh.vertices();
    const auto& faces = tri_mesh.faces();

    // Group triangle indices by material_id
    std::map<uint32_t, std::vector<uint32_t>> mat_indices;
    size_t total_tris = 0;
    for (const auto& f : faces) {
        if (f.indices.size() != 3) continue;
        auto& idx_list = mat_indices[f.material_id];
        idx_list.push_back(f.indices[0]);
        idx_list.push_back(f.indices[1]);
        idx_list.push_back(f.indices[2]);
        total_tris++;
    }

    if (total_tris == 0) {
        result.error = "No valid triangles to export.";
        return result;
    }

    // Build BIN buffer
    std::vector<uint8_t> bin;

    // 1. Positions
    AABB bounds = tri_mesh.compute_bounds();
    size_t pos_offset = bin.size();
    for (const auto& v : verts) {
        float p[3] = {v.position.x, v.position.y, v.position.z};
        append_bytes(bin, p, sizeof(p));
    }
    size_t pos_length = bin.size() - pos_offset;

    // 2. Normals
    size_t norm_offset = bin.size();
    for (const auto& v : verts) {
        float n[3] = {v.normal.x, v.normal.y, v.normal.z};
        append_bytes(bin, n, sizeof(n));
    }
    size_t norm_length = bin.size() - norm_offset;

    // 3. UVs
    size_t uv_offset = bin.size();
    for (const auto& v : verts) {
        float uv[2] = {v.uv.x, v.uv.y};
        append_bytes(bin, uv, sizeof(uv));
    }
    size_t uv_length = bin.size() - uv_offset;

    // 4. Tangents
    size_t tan_offset = bin.size();
    for (const auto& v : verts) {
        float t[4] = {v.tangent.x, v.tangent.y, v.tangent.z, v.tangent.w};
        append_bytes(bin, t, sizeof(t));
    }
    size_t tan_length = bin.size() - tan_offset;

    // 5. Index buffers per material
    struct PrimBufferInfo {
        uint32_t material_id;
        size_t offset;
        size_t length;
        size_t count;
    };
    std::vector<PrimBufferInfo> prim_infos;
    for (const auto& [mat_id, indices] : mat_indices) {
        pad_to_4(bin, 0);
        size_t off = bin.size();
        append_bytes(bin, indices.data(), indices.size() * sizeof(uint32_t));
        prim_infos.push_back({mat_id, off, indices.size() * sizeof(uint32_t), indices.size()});
    }
    pad_to_4(bin, 0);

    // Build JSON
    std::ostringstream js;
    js << "{";
    js << "\"asset\":{\"version\":\"2.0\",\"generator\":\"Forge3D C++ Engine\"},";
    js << "\"scene\":0,\"scenes\":[{\"nodes\":[0]}],";
    js << "\"nodes\":[{\"mesh\":0,\"name\":\"" << escape_json(tri_mesh.name()) << "\"}],";

    // Materials
    std::vector<PBRMaterial> export_mats = materials;
    if (export_mats.empty()) {
        export_mats.push_back(PBRMaterial{});
    }
    js << "\"materials\":[";
    for (size_t i = 0; i < export_mats.size(); ++i) {
        const auto& m = export_mats[i];
        if (i > 0) js << ",";
        js << "{\"name\":\"" << escape_json(m.name) << "\","
           << "\"pbrMetallicRoughness\":{"
           << "\"baseColorFactor\":[" << m.base_color.x << "," << m.base_color.y << "," << m.base_color.z << "," << m.base_color.w << "],"
           << "\"metallicFactor\":" << m.metallic << ","
           << "\"roughnessFactor\":" << m.roughness
           << "}";
        if (m.emissive.length_sq() > 1e-6f) {
            js << ",\"emissiveFactor\":[" << m.emissive.x << "," << m.emissive.y << "," << m.emissive.z << "]";
        }
        if (m.double_sided) {
            js << ",\"doubleSided\":true";
        }
        js << "}";
    }
    js << "],";

    // Mesh primitives
    js << "\"meshes\":[{\"name\":\"" << escape_json(tri_mesh.name()) << "\",\"primitives\":[";
    for (size_t i = 0; i < prim_infos.size(); ++i) {
        if (i > 0) js << ",";
        uint32_t mat_idx = prim_infos[i].material_id < export_mats.size() ? prim_infos[i].material_id : 0;
        uint32_t idx_accessor = static_cast<uint32_t>(4 + i);
        js << "{\"attributes\":{\"POSITION\":0,\"NORMAL\":1,\"TEXCOORD_0\":2,\"TANGENT\":3},"
           << "\"indices\":" << idx_accessor << ","
           << "\"material\":" << mat_idx << "}";
    }
    js << "]}],";

    // Buffers
    js << "\"buffers\":[{\"byteLength\":" << bin.size() << "}],";

    // BufferViews
    js << "\"bufferViews\":[";
    js << "{\"buffer\":0,\"byteOffset\":" << pos_offset << ",\"byteLength\":" << pos_length << ",\"target\":34962},";
    js << "{\"buffer\":0,\"byteOffset\":" << norm_offset << ",\"byteLength\":" << norm_length << ",\"target\":34962},";
    js << "{\"buffer\":0,\"byteOffset\":" << uv_offset << ",\"byteLength\":" << uv_length << ",\"target\":34962},";
    js << "{\"buffer\":0,\"byteOffset\":" << tan_offset << ",\"byteLength\":" << tan_length << ",\"target\":34962}";
    for (const auto& pi : prim_infos) {
        js << ",{\"buffer\":0,\"byteOffset\":" << pi.offset << ",\"byteLength\":" << pi.length << ",\"target\":34963}";
    }
    js << "],";

    // Accessors
    size_t vcount = verts.size();
    js << "\"accessors\":[";
    js << "{\"bufferView\":0,\"componentType\":5126,\"count\":" << vcount << ",\"type\":\"VEC3\","
       << "\"min\":[" << bounds.min.x << "," << bounds.min.y << "," << bounds.min.z << "],"
       << "\"max\":[" << bounds.max.x << "," << bounds.max.y << "," << bounds.max.z << "]},";
    js << "{\"bufferView\":1,\"componentType\":5126,\"count\":" << vcount << ",\"type\":\"VEC3\"},";
    js << "{\"bufferView\":2,\"componentType\":5126,\"count\":" << vcount << ",\"type\":\"VEC2\"},";
    js << "{\"bufferView\":3,\"componentType\":5126,\"count\":" << vcount << ",\"type\":\"VEC4\"}";
    for (size_t i = 0; i < prim_infos.size(); ++i) {
        js << ",{\"bufferView\":" << (4 + i) << ",\"componentType\":5125,\"count\":" << prim_infos[i].count << ",\"type\":\"SCALAR\"}";
    }
    js << "]";
    js << "}";

    std::string json_str = js.str();
    std::vector<uint8_t> json_bytes(json_str.begin(), json_str.end());
    pad_to_4(json_bytes, 0x20);

    // Ensure parent directory exists
    std::filesystem::path out_p(output_path);
    if (out_p.has_parent_path()) {
        std::filesystem::create_directories(out_p.parent_path());
    }

    std::ofstream out(output_path, std::ios::binary);
    if (!out) {
        result.error = "Failed to open output file: " + output_path;
        return result;
    }

    uint32_t total_length = static_cast<uint32_t>(12 + 8 + json_bytes.size() + 8 + bin.size());
    uint32_t json_len = static_cast<uint32_t>(json_bytes.size());
    uint32_t bin_len = static_cast<uint32_t>(bin.size());

    out.write(reinterpret_cast<const char*>(&kGlbMagic), 4);
    out.write(reinterpret_cast<const char*>(&kGlbVersion), 4);
    out.write(reinterpret_cast<const char*>(&total_length), 4);

    out.write(reinterpret_cast<const char*>(&json_len), 4);
    out.write(reinterpret_cast<const char*>(&kChunkJson), 4);
    out.write(reinterpret_cast<const char*>(json_bytes.data()), json_bytes.size());

    out.write(reinterpret_cast<const char*>(&bin_len), 4);
    out.write(reinterpret_cast<const char*>(&kChunkBin), 4);
    out.write(reinterpret_cast<const char*>(bin.data()), bin.size());

    out.close();

    result.success = true;
    result.file_size_bytes = total_length;
    result.triangle_count = total_tris;
    result.material_count = export_mats.size();
    return result;
}

bool validate_glb_file(const std::string& path, std::string* error_out) {
    std::ifstream in(path, std::ios::binary | std::ios::ate);
    if (!in) {
        if (error_out) *error_out = "Cannot open file: " + path;
        return false;
    }
    std::streamsize size = in.tellg();
    if (size < 20) {
        if (error_out) *error_out = "File too small to be a valid GLB.";
        return false;
    }
    in.seekg(0, std::ios::beg);

    uint32_t magic = 0, version = 0, total_len = 0;
    in.read(reinterpret_cast<char*>(&magic), 4);
    in.read(reinterpret_cast<char*>(&version), 4);
    in.read(reinterpret_cast<char*>(&total_len), 4);

    if (magic != kGlbMagic) {
        if (error_out) *error_out = "Invalid GLB magic.";
        return false;
    }
    if (version != kGlbVersion) {
        if (error_out) *error_out = "Unsupported GLB version.";
        return false;
    }
    if (static_cast<std::streamsize>(total_len) != size) {
        if (error_out) *error_out = "GLB total length mismatch.";
        return false;
    }

    uint32_t json_len = 0, json_type = 0;
    in.read(reinterpret_cast<char*>(&json_len), 4);
    in.read(reinterpret_cast<char*>(&json_type), 4);
    if (json_type != kChunkJson || json_len % 4 != 0) {
        if (error_out) *error_out = "Invalid JSON chunk header.";
        return false;
    }

    return true;
}

} // namespace forge3d::exporters
