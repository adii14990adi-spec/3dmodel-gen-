#include "core/geometry/primitives.hpp"

#include <cmath>

namespace forge3d::primitives {

namespace {
constexpr float kPi = 3.14159265358979323846f;
} // namespace

Mesh make_box(float width, float height, float depth) {
    Mesh m("Box");
    float hx = width * 0.5f;
    float hy = height * 0.5f;
    float hz = depth * 0.5f;

    // 8 shared vertices -> watertight closed manifold
    uint32_t v0 = m.add_vertex({-hx, -hy, -hz}, {0.0f, 0.0f});
    uint32_t v1 = m.add_vertex({ hx, -hy, -hz}, {1.0f, 0.0f});
    uint32_t v2 = m.add_vertex({ hx,  hy, -hz}, {1.0f, 1.0f});
    uint32_t v3 = m.add_vertex({-hx,  hy, -hz}, {0.0f, 1.0f});
    uint32_t v4 = m.add_vertex({-hx, -hy,  hz}, {0.0f, 0.0f});
    uint32_t v5 = m.add_vertex({ hx, -hy,  hz}, {1.0f, 0.0f});
    uint32_t v6 = m.add_vertex({ hx,  hy,  hz}, {1.0f, 1.0f});
    uint32_t v7 = m.add_vertex({-hx,  hy,  hz}, {0.0f, 1.0f});

    m.add_quad(v4, v5, v6, v7); // +Z front
    m.add_quad(v1, v0, v3, v2); // -Z back
    m.add_quad(v5, v1, v2, v6); // +X right
    m.add_quad(v0, v4, v7, v3); // -X left
    m.add_quad(v7, v6, v2, v3); // +Y top
    m.add_quad(v0, v1, v5, v4); // -Y bottom

    m.compute_vertex_normals();
    m.compute_tangents();
    return m;
}

Mesh make_plane(float width, float depth, uint32_t seg_x, uint32_t seg_z) {
    Mesh m("Plane");
    if (seg_x < 1) seg_x = 1;
    if (seg_z < 1) seg_z = 1;

    float hx = width * 0.5f;
    float hz = depth * 0.5f;

    for (uint32_t z = 0; z <= seg_z; ++z) {
        float vz = static_cast<float>(z) / static_cast<float>(seg_z);
        float pz = -hz + vz * depth;
        for (uint32_t x = 0; x <= seg_x; ++x) {
            float vx = static_cast<float>(x) / static_cast<float>(seg_x);
            float px = -hx + vx * width;
            m.add_vertex({px, 0.0f, pz}, {vx, vz}, {0.0f, 1.0f, 0.0f});
        }
    }

    uint32_t stride = seg_x + 1;
    for (uint32_t z = 0; z < seg_z; ++z) {
        for (uint32_t x = 0; x < seg_x; ++x) {
            uint32_t i0 = z * stride + x;
            uint32_t i1 = i0 + 1;
            uint32_t i2 = i0 + stride + 1;
            uint32_t i3 = i0 + stride;
            m.add_quad(i0, i3, i2, i1);
        }
    }

    m.compute_vertex_normals();
    m.compute_tangents();
    return m;
}

Mesh make_uv_sphere(float radius, uint32_t rings, uint32_t sectors) {
    Mesh m("UVSphere");
    if (rings < 3) rings = 3;
    if (sectors < 3) sectors = 3;

    uint32_t top = m.add_vertex({0.0f, radius, 0.0f}, {0.5f, 1.0f}, {0.0f, 1.0f, 0.0f});
    for (uint32_t r = 1; r < rings; ++r) {
        float v = static_cast<float>(r) / static_cast<float>(rings);
        float phi = v * kPi;
        float y = radius * std::cos(phi);
        float ring_r = radius * std::sin(phi);
        for (uint32_t s = 0; s < sectors; ++s) {
            float u = static_cast<float>(s) / static_cast<float>(sectors);
            float theta = u * 2.0f * kPi;
            float x = ring_r * std::cos(theta);
            float z = ring_r * std::sin(theta);
            Vec3 pos{x, y, z};
            m.add_vertex(pos, {u, 1.0f - v}, pos.normalized());
        }
    }
    uint32_t bottom = m.add_vertex({0.0f, -radius, 0.0f}, {0.5f, 0.0f}, {0.0f, -1.0f, 0.0f});

    // Top cap
    for (uint32_t s = 0; s < sectors; ++s) {
        uint32_t next = (s + 1) % sectors;
        m.add_triangle(top, 1 + next, 1 + s);
    }

    // Middle rings
    for (uint32_t r = 0; r + 2 < rings; ++r) {
        uint32_t row0 = 1 + r * sectors;
        uint32_t row1 = 1 + (r + 1) * sectors;
        for (uint32_t s = 0; s < sectors; ++s) {
            uint32_t next = (s + 1) % sectors;
            m.add_quad(row0 + s, row0 + next, row1 + next, row1 + s);
        }
    }

    // Bottom cap
    uint32_t last_row = 1 + (rings - 2) * sectors;
    for (uint32_t s = 0; s < sectors; ++s) {
        uint32_t next = (s + 1) % sectors;
        m.add_triangle(bottom, last_row + s, last_row + next);
    }

    m.compute_vertex_normals();
    m.compute_tangents();
    return m;
}

Mesh make_cylinder(float radius, float height, uint32_t sectors, bool capped) {
    Mesh m("Cylinder");
    if (sectors < 3) sectors = 3;
    float hy = height * 0.5f;

    uint32_t bottom_ring_start = 0;
    for (uint32_t s = 0; s < sectors; ++s) {
        float u = static_cast<float>(s) / static_cast<float>(sectors);
        float theta = u * 2.0f * kPi;
        m.add_vertex({radius * std::cos(theta), -hy, radius * std::sin(theta)}, {u, 0.0f});
    }

    uint32_t top_ring_start = static_cast<uint32_t>(m.vertex_count());
    for (uint32_t s = 0; s < sectors; ++s) {
        float u = static_cast<float>(s) / static_cast<float>(sectors);
        float theta = u * 2.0f * kPi;
        m.add_vertex({radius * std::cos(theta), hy, radius * std::sin(theta)}, {u, 1.0f});
    }

    for (uint32_t s = 0; s < sectors; ++s) {
        uint32_t next = (s + 1) % sectors;
        m.add_quad(bottom_ring_start + s,
                   top_ring_start + s,
                   top_ring_start + next,
                   bottom_ring_start + next);
    }

    if (capped) {
        uint32_t bottom_center = m.add_vertex({0.0f, -hy, 0.0f}, {0.5f, 0.5f});
        uint32_t top_center = m.add_vertex({0.0f, hy, 0.0f}, {0.5f, 0.5f});
        for (uint32_t s = 0; s < sectors; ++s) {
            uint32_t next = (s + 1) % sectors;
            m.add_triangle(bottom_center, bottom_ring_start + s, bottom_ring_start + next);
            m.add_triangle(top_center, top_ring_start + next, top_ring_start + s);
        }
    }

    m.compute_vertex_normals();
    m.compute_tangents();
    return m;
}

} // namespace forge3d::primitives
