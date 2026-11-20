#pragma once

#include "core/geometry/vec.hpp"

#include <cstdint>
#include <string>
#include <vector>

namespace forge3d {

struct Vertex {
    Vec3 position;
    Vec3 normal{0.0f, 1.0f, 0.0f};
    Vec4 tangent{1.0f, 0.0f, 0.0f, 1.0f};
    Vec2 uv{0.0f, 0.0f};
    Vec4 color{1.0f, 1.0f, 1.0f, 1.0f};
};

struct Face {
    std::vector<uint32_t> indices;
    uint32_t material_id = 0;
    uint32_t component_id = 0;
    Vec3 normal{0.0f, 1.0f, 0.0f};
};

struct MeshComponent {
    uint32_t id = 0;
    std::string name;
    uint32_t material_id = 0;
};

struct ValidationReport {
    uint32_t vertex_count = 0;
    uint32_t face_count = 0;
    uint32_t invalid_index_faces = 0;
    uint32_t degenerate_faces = 0;
    uint32_t non_manifold_edges = 0;
    uint32_t boundary_edges = 0;
    uint32_t isolated_vertices = 0;
    uint32_t non_finite_vertices = 0;

    bool is_valid() const {
        return invalid_index_faces == 0 &&
               degenerate_faces == 0 &&
               non_manifold_edges == 0 &&
               non_finite_vertices == 0;
    }

    bool is_watertight() const {
        return is_valid() && boundary_edges == 0;
    }

    std::string summary() const;
};

class Mesh {
public:
    Mesh() = default;
    explicit Mesh(std::string name) : name_(std::move(name)) {}

    const std::string& name() const { return name_; }
    void set_name(std::string name) { name_ = std::move(name); }

    // Component management
    uint32_t create_component(const std::string& name, uint32_t material_id = 0);
    const std::vector<MeshComponent>& components() const { return components_; }

    // Vertex operations
    uint32_t add_vertex(const Vec3& pos,
                        const Vec2& uv = {0.0f, 0.0f},
                        const Vec3& normal = {0.0f, 1.0f, 0.0f});
    bool set_vertex_position(uint32_t index, const Vec3& pos);
    size_t vertex_count() const { return vertices_.size(); }
    const std::vector<Vertex>& vertices() const { return vertices_; }
    std::vector<Vertex>& vertices_mut() { return vertices_; }

    // Face operations
    bool add_face(const std::vector<uint32_t>& indices,
                  uint32_t material_id = 0,
                  uint32_t component_id = 0);
    bool add_triangle(uint32_t a, uint32_t b, uint32_t c,
                      uint32_t material_id = 0,
                      uint32_t component_id = 0);
    bool add_quad(uint32_t a, uint32_t b, uint32_t c, uint32_t d,
                  uint32_t material_id = 0,
                  uint32_t component_id = 0);

    size_t face_count() const { return faces_.size(); }
    size_t triangle_count() const;
    const std::vector<Face>& faces() const { return faces_; }
    std::vector<Face>& faces_mut() { return faces_; }

    // Geometry processing
    void triangulate();
    void compute_face_normals();
    void compute_vertex_normals();
    void compute_tangents();
    AABB compute_bounds() const;

    // Validation
    ValidationReport validate() const;

    void clear();

private:
    std::string name_ = "Mesh";
    std::vector<Vertex> vertices_;
    std::vector<Face> faces_;
    std::vector<MeshComponent> components_;
};

} // namespace forge3d
