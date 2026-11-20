#include "core/mesh_operations/modelling_ops.hpp"

#include <algorithm>
#include <unordered_map>
#include <unordered_set>

namespace forge3d::ops {

namespace {

uint64_t make_edge_key(uint32_t a, uint32_t b) {
    uint32_t lo = std::min(a, b);
    uint32_t hi = std::max(a, b);
    return (static_cast<uint64_t>(lo) << 32) | static_cast<uint64_t>(hi);
}

} // namespace

bool extrude_face(Mesh& mesh, uint32_t face_idx, float distance) {
    if (face_idx >= mesh.face_count()) return false;
    mesh.compute_face_normals();

    Face orig = mesh.faces()[face_idx];
    if (orig.indices.size() < 3) return false;

    Vec3 offset = orig.normal * distance;
    const size_t n = orig.indices.size();

    std::vector<uint32_t> new_indices(n);
    for (size_t i = 0; i < n; ++i) {
        const Vertex& v = mesh.vertices()[orig.indices[i]];
        new_indices[i] = mesh.add_vertex(v.position + offset, v.uv, orig.normal);
    }

    // Replace original face with extruded cap
    mesh.faces_mut()[face_idx].indices = new_indices;

    // Add side quads connecting original ring to extruded ring
    for (size_t i = 0; i < n; ++i) {
        uint32_t a = orig.indices[i];
        uint32_t b = orig.indices[(i + 1) % n];
        uint32_t c = new_indices[(i + 1) % n];
        uint32_t d = new_indices[i];
        mesh.add_quad(a, b, c, d, orig.material_id, orig.component_id);
    }

    mesh.compute_vertex_normals();
    mesh.compute_tangents();
    return true;
}

bool inset_face(Mesh& mesh, uint32_t face_idx, float factor) {
    if (face_idx >= mesh.face_count()) return false;
    if (factor <= 0.0f || factor >= 1.0f) return false;

    mesh.compute_face_normals();
    Face orig = mesh.faces()[face_idx];
    const size_t n = orig.indices.size();
    if (n < 3) return false;

    Vec3 centroid{0.0f, 0.0f, 0.0f};
    Vec2 uv_centroid{0.0f, 0.0f};
    for (uint32_t idx : orig.indices) {
        centroid += mesh.vertices()[idx].position;
        uv_centroid = uv_centroid + mesh.vertices()[idx].uv;
    }
    centroid = centroid / static_cast<float>(n);
    uv_centroid = uv_centroid / static_cast<float>(n);

    std::vector<uint32_t> inner_indices(n);
    for (size_t i = 0; i < n; ++i) {
        const Vertex& v = mesh.vertices()[orig.indices[i]];
        Vec3 pos = v.position + (centroid - v.position) * factor;
        Vec2 uv = v.uv + (uv_centroid - v.uv) * factor;
        inner_indices[i] = mesh.add_vertex(pos, uv, orig.normal);
    }

    // Replace original face with inner face
    mesh.faces_mut()[face_idx].indices = inner_indices;

    // Add surrounding quads
    for (size_t i = 0; i < n; ++i) {
        uint32_t a = orig.indices[i];
        uint32_t b = orig.indices[(i + 1) % n];
        uint32_t c = inner_indices[(i + 1) % n];
        uint32_t d = inner_indices[i];
        mesh.add_quad(a, b, c, d, orig.material_id, orig.component_id);
    }

    mesh.compute_vertex_normals();
    mesh.compute_tangents();
    return true;
}

bool bevel_face(Mesh& mesh, uint32_t face_idx, float inset_factor, float height) {
    if (!inset_face(mesh, face_idx, inset_factor)) return false;
    if (std::abs(height) > 1e-6f) {
        return extrude_face(mesh, face_idx, height);
    }
    return true;
}

void laplacian_smooth(Mesh& mesh, uint32_t iterations, float lambda) {
    const size_t vcount = mesh.vertex_count();
    if (vcount == 0 || iterations == 0) return;

    std::vector<std::unordered_set<uint32_t>> neighbors(vcount);
    for (const auto& f : mesh.faces()) {
        const size_t n = f.indices.size();
        for (size_t i = 0; i < n; ++i) {
            uint32_t a = f.indices[i];
            uint32_t b = f.indices[(i + 1) % n];
            if (a < vcount && b < vcount && a != b) {
                neighbors[a].insert(b);
                neighbors[b].insert(a);
            }
        }
    }

    std::vector<Vec3> next_pos(vcount);
    for (uint32_t iter = 0; iter < iterations; ++iter) {
        for (size_t i = 0; i < vcount; ++i) {
            const Vec3& p = mesh.vertices()[i].position;
            if (neighbors[i].empty()) {
                next_pos[i] = p;
                continue;
            }
            Vec3 avg{0.0f, 0.0f, 0.0f};
            for (uint32_t nb : neighbors[i]) {
                avg += mesh.vertices()[nb].position;
            }
            avg = avg / static_cast<float>(neighbors[i].size());
            next_pos[i] = p + (avg - p) * lambda;
        }
        for (size_t i = 0; i < vcount; ++i) {
            mesh.set_vertex_position(static_cast<uint32_t>(i), next_pos[i]);
        }
    }

    mesh.compute_vertex_normals();
    mesh.compute_tangents();
}

void subdivide_catmull_clark(Mesh& mesh, uint32_t levels) {
    for (uint32_t lvl = 0; lvl < levels; ++lvl) {
        const auto& old_verts = mesh.vertices();
        const auto& old_faces = mesh.faces();
        const size_t vcount = old_verts.size();
        const size_t fcount = old_faces.size();
        if (vcount == 0 || fcount == 0) return;

        Mesh next(mesh.name());
        for (const auto& comp : mesh.components()) {
            next.create_component(comp.name, comp.material_id);
        }

        // 1. Face points
        std::vector<uint32_t> face_point_idx(fcount);
        std::vector<Vec3> face_points(fcount);
        for (size_t fi = 0; fi < fcount; ++fi) {
            const auto& f = old_faces[fi];
            Vec3 fp{0.0f, 0.0f, 0.0f};
            Vec2 fuv{0.0f, 0.0f};
            for (uint32_t vi : f.indices) {
                fp += old_verts[vi].position;
                fuv = fuv + old_verts[vi].uv;
            }
            float inv = 1.0f / static_cast<float>(f.indices.size());
            fp = fp * inv;
            fuv = fuv * inv;
            face_points[fi] = fp;
            face_point_idx[fi] = next.add_vertex(fp, fuv);
        }

        // 2. Edge adjacency
        struct EdgeInfo {
            uint32_t a = 0;
            uint32_t b = 0;
            std::vector<size_t> adj_faces;
            uint32_t edge_point_idx = 0;
            Vec3 midpoint{0.0f, 0.0f, 0.0f};
        };
        std::unordered_map<uint64_t, EdgeInfo> edges;
        std::vector<std::vector<size_t>> vert_faces(vcount);
        std::vector<std::unordered_set<uint64_t>> vert_edges(vcount);

        for (size_t fi = 0; fi < fcount; ++fi) {
            const auto& f = old_faces[fi];
            const size_t n = f.indices.size();
            for (size_t i = 0; i < n; ++i) {
                uint32_t a = f.indices[i];
                uint32_t b = f.indices[(i + 1) % n];
                vert_faces[a].push_back(fi);
                uint64_t key = make_edge_key(a, b);
                auto& e = edges[key];
                if (e.adj_faces.empty()) {
                    e.a = std::min(a, b);
                    e.b = std::max(a, b);
                    e.midpoint = (old_verts[a].position + old_verts[b].position) * 0.5f;
                }
                e.adj_faces.push_back(fi);
                vert_edges[a].insert(key);
                vert_edges[b].insert(key);
            }
        }

        // 3. Edge points
        for (auto& [key, e] : edges) {
            Vec3 ep = old_verts[e.a].position + old_verts[e.b].position;
            float denom = 2.0f;
            if (e.adj_faces.size() == 2) {
                ep += face_points[e.adj_faces[0]] + face_points[e.adj_faces[1]];
                denom = 4.0f;
            }
            ep = ep / denom;
            Vec2 euv = (old_verts[e.a].uv + old_verts[e.b].uv) * 0.5f;
            e.edge_point_idx = next.add_vertex(ep, euv);
        }

        // 4. Updated original vertices
        std::vector<uint32_t> vert_idx(vcount);
        for (size_t vi = 0; vi < vcount; ++vi) {
            const Vec3& P = old_verts[vi].position;
            size_t n = vert_faces[vi].size();
            size_t m = vert_edges[vi].size();
            if (n == 0 || m == 0 || n != m) {
                // Boundary or isolated vertex: keep position
                vert_idx[vi] = next.add_vertex(P, old_verts[vi].uv);
                continue;
            }
            Vec3 F{0.0f, 0.0f, 0.0f};
            for (size_t fi : vert_faces[vi]) {
                F += face_points[fi];
            }
            F = F / static_cast<float>(n);

            Vec3 R{0.0f, 0.0f, 0.0f};
            for (uint64_t key : vert_edges[vi]) {
                R += edges[key].midpoint;
            }
            R = R / static_cast<float>(m);

            float nf = static_cast<float>(n);
            Vec3 new_p = (F + 2.0f * R + (nf - 3.0f) * P) / nf;
            vert_idx[vi] = next.add_vertex(new_p, old_verts[vi].uv);
        }

        // 5. Build subdivided quads
        for (size_t fi = 0; fi < fcount; ++fi) {
            const auto& f = old_faces[fi];
            const size_t n = f.indices.size();
            uint32_t fp = face_point_idx[fi];
            for (size_t i = 0; i < n; ++i) {
                uint32_t v_curr = f.indices[i];
                uint32_t v_next = f.indices[(i + 1) % n];
                uint32_t v_prev = f.indices[(i + n - 1) % n];

                uint32_t e_next = edges[make_edge_key(v_curr, v_next)].edge_point_idx;
                uint32_t e_prev = edges[make_edge_key(v_prev, v_curr)].edge_point_idx;

                next.add_quad(vert_idx[v_curr], e_next, fp, e_prev, f.material_id, f.component_id);
            }
        }

        next.compute_vertex_normals();
        next.compute_tangents();
        mesh = std::move(next);
    }
}

void append_mesh(Mesh& dst,
                 const Mesh& src,
                 const Vec3& offset,
                 uint32_t material_id,
                 uint32_t component_id) {
    uint32_t base_v = static_cast<uint32_t>(dst.vertex_count());
    for (const auto& v : src.vertices()) {
        dst.add_vertex(v.position + offset, v.uv, v.normal);
    }
    for (const auto& f : src.faces()) {
        std::vector<uint32_t> remapped;
        remapped.reserve(f.indices.size());
        for (uint32_t idx : f.indices) {
            remapped.push_back(base_v + idx);
        }
        dst.add_face(remapped, material_id, component_id);
    }
}

} // namespace forge3d::ops
