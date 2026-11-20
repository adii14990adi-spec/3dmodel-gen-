#include "core/geometry/mesh.hpp"

#include <algorithm>
#include <cmath>
#include <sstream>
#include <unordered_map>

namespace forge3d {

namespace {

uint64_t make_edge_key(uint32_t a, uint32_t b) {
    uint32_t lo = std::min(a, b);
    uint32_t hi = std::max(a, b);
    return (static_cast<uint64_t>(lo) << 32) | static_cast<uint64_t>(hi);
}

} // namespace

std::string ValidationReport::summary() const {
    std::ostringstream oss;
    oss << "ValidationReport{vertices=" << vertex_count
        << ", faces=" << face_count
        << ", invalid_index_faces=" << invalid_index_faces
        << ", degenerate_faces=" << degenerate_faces
        << ", non_manifold_edges=" << non_manifold_edges
        << ", boundary_edges=" << boundary_edges
        << ", isolated_vertices=" << isolated_vertices
        << ", non_finite_vertices=" << non_finite_vertices
        << ", valid=" << (is_valid() ? "true" : "false")
        << ", watertight=" << (is_watertight() ? "true" : "false")
        << "}";
    return oss.str();
}

uint32_t Mesh::create_component(const std::string& name, uint32_t material_id) {
    uint32_t id = static_cast<uint32_t>(components_.size());
    components_.push_back(MeshComponent{id, name, material_id});
    return id;
}

uint32_t Mesh::add_vertex(const Vec3& pos, const Vec2& uv, const Vec3& normal) {
    Vertex v;
    v.position = pos;
    v.uv = uv;
    v.normal = normal;
    vertices_.push_back(v);
    return static_cast<uint32_t>(vertices_.size() - 1);
}

bool Mesh::set_vertex_position(uint32_t index, const Vec3& pos) {
    if (index >= vertices_.size()) return false;
    vertices_[index].position = pos;
    return true;
}

bool Mesh::add_face(const std::vector<uint32_t>& indices,
                    uint32_t material_id,
                    uint32_t component_id) {
    if (indices.size() < 3) return false;
    for (uint32_t idx : indices) {
        if (idx >= vertices_.size()) return false;
    }
    Face f;
    f.indices = indices;
    f.material_id = material_id;
    f.component_id = component_id;
    faces_.push_back(std::move(f));
    return true;
}

bool Mesh::add_triangle(uint32_t a, uint32_t b, uint32_t c,
                        uint32_t material_id,
                        uint32_t component_id) {
    return add_face({a, b, c}, material_id, component_id);
}

bool Mesh::add_quad(uint32_t a, uint32_t b, uint32_t c, uint32_t d,
                    uint32_t material_id,
                    uint32_t component_id) {
    return add_face({a, b, c, d}, material_id, component_id);
}

size_t Mesh::triangle_count() const {
    size_t count = 0;
    for (const auto& f : faces_) {
        if (f.indices.size() >= 3) {
            count += f.indices.size() - 2;
        }
    }
    return count;
}

void Mesh::triangulate() {
    std::vector<Face> tri_faces;
    tri_faces.reserve(triangle_count());
    for (const auto& f : faces_) {
        if (f.indices.size() < 3) continue;
        if (f.indices.size() == 3) {
            tri_faces.push_back(f);
            continue;
        }
        // Fan triangulation from vertex 0
        for (size_t i = 1; i + 1 < f.indices.size(); ++i) {
            Face tri;
            tri.indices = {f.indices[0], f.indices[i], f.indices[i + 1]};
            tri.material_id = f.material_id;
            tri.component_id = f.component_id;
            tri.normal = f.normal;
            tri_faces.push_back(std::move(tri));
        }
    }
    faces_ = std::move(tri_faces);
}

void Mesh::compute_face_normals() {
    for (auto& f : faces_) {
        if (f.indices.size() < 3) continue;
        Vec3 accum{0.0f, 0.0f, 0.0f};
        const size_t n = f.indices.size();
        for (size_t i = 0; i < n; ++i) {
            uint32_t i0 = f.indices[i];
            uint32_t i1 = f.indices[(i + 1) % n];
            if (i0 >= vertices_.size() || i1 >= vertices_.size()) continue;
            const Vec3& p0 = vertices_[i0].position;
            const Vec3& p1 = vertices_[i1].position;
            // Newell's method
            accum.x += (p0.y - p1.y) * (p0.z + p1.z);
            accum.y += (p0.z - p1.z) * (p0.x + p1.x);
            accum.z += (p0.x - p1.x) * (p0.y + p1.y);
        }
        f.normal = accum.normalized();
    }
}

void Mesh::compute_vertex_normals() {
    compute_face_normals();
    for (auto& v : vertices_) {
        v.normal = {0.0f, 0.0f, 0.0f};
    }
    for (const auto& f : faces_) {
        for (uint32_t idx : f.indices) {
            if (idx < vertices_.size()) {
                vertices_[idx].normal += f.normal;
            }
        }
    }
    for (auto& v : vertices_) {
        Vec3 n = v.normal.normalized();
        if (n.length_sq() < 1e-8f) {
            n = {0.0f, 1.0f, 0.0f};
        }
        v.normal = n;
    }
}

void Mesh::compute_tangents() {
    std::vector<Vec3> tan1(vertices_.size(), Vec3{0.0f, 0.0f, 0.0f});
    std::vector<Vec3> tan2(vertices_.size(), Vec3{0.0f, 0.0f, 0.0f});

    for (const auto& f : faces_) {
        if (f.indices.size() < 3) continue;
        for (size_t i = 1; i + 1 < f.indices.size(); ++i) {
            uint32_t i0 = f.indices[0];
            uint32_t i1 = f.indices[i];
            uint32_t i2 = f.indices[i + 1];
            if (i0 >= vertices_.size() || i1 >= vertices_.size() || i2 >= vertices_.size()) {
                continue;
            }
            const Vec3& p0 = vertices_[i0].position;
            const Vec3& p1 = vertices_[i1].position;
            const Vec3& p2 = vertices_[i2].position;

            const Vec2& w0 = vertices_[i0].uv;
            const Vec2& w1 = vertices_[i1].uv;
            const Vec2& w2 = vertices_[i2].uv;

            Vec3 e1 = p1 - p0;
            Vec3 e2 = p2 - p0;
            float x1 = w1.x - w0.x;
            float x2 = w2.x - w0.x;
            float y1 = w1.y - w0.y;
            float y2 = w2.y - w0.y;

            float denom = x1 * y2 - x2 * y1;
            if (std::abs(denom) < 1e-10f) continue;
            float r = 1.0f / denom;

            Vec3 sdir = (e1 * y2 - e2 * y1) * r;
            Vec3 tdir = (e2 * x1 - e1 * x2) * r;

            tan1[i0] += sdir;
            tan1[i1] += sdir;
            tan1[i2] += sdir;

            tan2[i0] += tdir;
            tan2[i1] += tdir;
            tan2[i2] += tdir;
        }
    }

    for (size_t i = 0; i < vertices_.size(); ++i) {
        const Vec3& n = vertices_[i].normal;
        const Vec3& t = tan1[i];
        Vec3 ortho = (t - n * n.dot(t)).normalized();
        if (ortho.length_sq() < 1e-8f) {
            vertices_[i].tangent = {1.0f, 0.0f, 0.0f, 1.0f};
        } else {
            float w = (n.cross(t).dot(tan2[i]) < 0.0f) ? -1.0f : 1.0f;
            vertices_[i].tangent = {ortho.x, ortho.y, ortho.z, w};
        }
    }
}

AABB Mesh::compute_bounds() const {
    AABB box;
    for (const auto& v : vertices_) {
        box.expand(v.position);
    }
    return box;
}

ValidationReport Mesh::validate() const {
    ValidationReport report;
    report.vertex_count = static_cast<uint32_t>(vertices_.size());
    report.face_count = static_cast<uint32_t>(faces_.size());

    std::vector<bool> vertex_used(vertices_.size(), false);
    for (const auto& v : vertices_) {
        if (!v.position.is_finite() || !v.normal.is_finite()) {
            report.non_finite_vertices++;
        }
    }

    std::unordered_map<uint64_t, uint32_t> edge_counts;
    edge_counts.reserve(faces_.size() * 3);

    for (const auto& f : faces_) {
        if (f.indices.size() < 3) {
            report.degenerate_faces++;
            continue;
        }
        bool valid_indices = true;
        for (uint32_t idx : f.indices) {
            if (idx >= vertices_.size()) {
                valid_indices = false;
                break;
            }
            vertex_used[idx] = true;
        }
        if (!valid_indices) {
            report.invalid_index_faces++;
            continue;
        }

        // Check for duplicate indices or zero-area face
        bool has_dup = false;
        const size_t n = f.indices.size();
        for (size_t i = 0; i < n; ++i) {
            uint32_t a = f.indices[i];
            uint32_t b = f.indices[(i + 1) % n];
            if (a == b) {
                has_dup = true;
                break;
            }
            edge_counts[make_edge_key(a, b)]++;
        }
        if (has_dup) {
            report.degenerate_faces++;
            continue;
        }

        Vec3 e1 = vertices_[f.indices[1]].position - vertices_[f.indices[0]].position;
        Vec3 e2 = vertices_[f.indices[2]].position - vertices_[f.indices[0]].position;
        if (e1.cross(e2).length_sq() < 1e-12f) {
            report.degenerate_faces++;
        }
    }

    for (const auto& [key, count] : edge_counts) {
        (void)key;
        if (count == 1) {
            report.boundary_edges++;
        } else if (count > 2) {
            report.non_manifold_edges++;
        }
    }

    for (bool used : vertex_used) {
        if (!used) {
            report.isolated_vertices++;
        }
    }

    return report;
}

void Mesh::clear() {
    vertices_.clear();
    faces_.clear();
    components_.clear();
}

} // namespace forge3d
