#include <gtest/gtest.h>

#include "core/geometry/mesh.hpp"
#include "core/geometry/primitives.hpp"
#include "core/geometry/vec.hpp"

using namespace forge3d;

TEST(Vec3Test, BasicOperations) {
    Vec3 a{1.0f, 0.0f, 0.0f};
    Vec3 b{0.0f, 1.0f, 0.0f};
    EXPECT_FLOAT_EQ(a.dot(b), 0.0f);

    Vec3 c = a.cross(b);
    EXPECT_FLOAT_EQ(c.x, 0.0f);
    EXPECT_FLOAT_EQ(c.y, 0.0f);
    EXPECT_FLOAT_EQ(c.z, 1.0f);

    Vec3 d{3.0f, 4.0f, 0.0f};
    EXPECT_FLOAT_EQ(d.length(), 5.0f);
    Vec3 n = d.normalized();
    EXPECT_NEAR(n.length(), 1.0f, 1e-6f);
}

TEST(MeshTest, BoxIsValidAndWatertight) {
    Mesh box = primitives::make_box(2.0f, 4.0f, 6.0f);
    EXPECT_EQ(box.vertex_count(), 8u);
    EXPECT_EQ(box.face_count(), 6u);
    EXPECT_EQ(box.triangle_count(), 12u);

    ValidationReport report = box.validate();
    EXPECT_TRUE(report.is_valid()) << report.summary();
    EXPECT_TRUE(report.is_watertight()) << report.summary();
    EXPECT_EQ(report.boundary_edges, 0u);
    EXPECT_EQ(report.non_manifold_edges, 0u);

    AABB bounds = box.compute_bounds();
    EXPECT_TRUE(bounds.is_valid());
    EXPECT_FLOAT_EQ(bounds.min.x, -1.0f);
    EXPECT_FLOAT_EQ(bounds.max.x,  1.0f);
    EXPECT_FLOAT_EQ(bounds.min.y, -2.0f);
    EXPECT_FLOAT_EQ(bounds.max.y,  2.0f);
    EXPECT_FLOAT_EQ(bounds.min.z, -3.0f);
    EXPECT_FLOAT_EQ(bounds.max.z,  3.0f);
}

TEST(MeshTest, TriangulateConvertsQuadsToTriangles) {
    Mesh box = primitives::make_box(1.0f, 1.0f, 1.0f);
    EXPECT_EQ(box.face_count(), 6u);
    box.triangulate();
    EXPECT_EQ(box.face_count(), 12u);
    EXPECT_TRUE(box.validate().is_watertight());
}

TEST(MeshTest, SphereAndCylinderAreWatertight) {
    Mesh sphere = primitives::make_uv_sphere(1.0f, 12, 24);
    ValidationReport sr = sphere.validate();
    EXPECT_TRUE(sr.is_valid()) << sr.summary();
    EXPECT_TRUE(sr.is_watertight()) << sr.summary();

    Mesh cyl = primitives::make_cylinder(0.5f, 2.0f, 16, true);
    ValidationReport cr = cyl.validate();
    EXPECT_TRUE(cr.is_valid()) << cr.summary();
    EXPECT_TRUE(cr.is_watertight()) << cr.summary();
}

TEST(MeshTest, PlaneHasBoundaryEdges) {
    Mesh plane = primitives::make_plane(4.0f, 4.0f, 2, 2);
    ValidationReport report = plane.validate();
    EXPECT_TRUE(report.is_valid());
    EXPECT_FALSE(report.is_watertight());
    EXPECT_GT(report.boundary_edges, 0u);
}

TEST(MeshTest, DetectsNonManifoldEdge) {
    Mesh m("NonManifold");
    uint32_t v0 = m.add_vertex({0.0f, 0.0f, 0.0f});
    uint32_t v1 = m.add_vertex({1.0f, 0.0f, 0.0f});
    uint32_t v2 = m.add_vertex({0.5f, 1.0f, 0.0f});
    uint32_t v3 = m.add_vertex({0.5f, -1.0f, 0.0f});
    uint32_t v4 = m.add_vertex({0.5f, 0.0f, 1.0f});

    // Edge (v0, v1) shared by 3 triangles -> non-manifold
    EXPECT_TRUE(m.add_triangle(v0, v1, v2));
    EXPECT_TRUE(m.add_triangle(v0, v1, v3));
    EXPECT_TRUE(m.add_triangle(v0, v1, v4));

    ValidationReport report = m.validate();
    EXPECT_FALSE(report.is_valid());
    EXPECT_EQ(report.non_manifold_edges, 1u);
}

TEST(MeshTest, DetectsDegenerateFace) {
    Mesh m("Degenerate");
    uint32_t v0 = m.add_vertex({0.0f, 0.0f, 0.0f});
    uint32_t v1 = m.add_vertex({1.0f, 0.0f, 0.0f});
    uint32_t v2 = m.add_vertex({2.0f, 0.0f, 0.0f}); // collinear

    EXPECT_TRUE(m.add_triangle(v0, v1, v2));
    ValidationReport report = m.validate();
    EXPECT_FALSE(report.is_valid());
    EXPECT_EQ(report.degenerate_faces, 1u);
}

TEST(MeshTest, ComponentManagement) {
    Mesh m("MultiComponent");
    uint32_t c0 = m.create_component("Body", 0);
    uint32_t c1 = m.create_component("Barrel", 1);
    EXPECT_EQ(c0, 0u);
    EXPECT_EQ(c1, 1u);
    ASSERT_EQ(m.components().size(), 2u);
    EXPECT_EQ(m.components()[0].name, "Body");
    EXPECT_EQ(m.components()[1].name, "Barrel");
}
