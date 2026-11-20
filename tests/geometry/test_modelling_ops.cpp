#include <gtest/gtest.h>

#include "core/geometry/mesh.hpp"
#include "core/geometry/primitives.hpp"
#include "core/mesh_operations/modelling_ops.hpp"

using namespace forge3d;

TEST(ModellingOpsTest, ExtrudeFacePreservesWatertightness) {
    Mesh box = primitives::make_box(1.0f, 1.0f, 1.0f);
    EXPECT_TRUE(ops::extrude_face(box, 0, 1.5f));
    EXPECT_EQ(box.vertex_count(), 12u);
    EXPECT_EQ(box.face_count(), 10u);

    ValidationReport report = box.validate();
    EXPECT_TRUE(report.is_valid()) << report.summary();
    EXPECT_TRUE(report.is_watertight()) << report.summary();

    AABB bounds = box.compute_bounds();
    EXPECT_NEAR(bounds.max.z, 2.0f, 1e-4f);
}

TEST(ModellingOpsTest, InsetFacePreservesWatertightness) {
    Mesh box = primitives::make_box(2.0f, 2.0f, 2.0f);
    EXPECT_TRUE(ops::inset_face(box, 4, 0.25f));
    EXPECT_EQ(box.vertex_count(), 12u);
    EXPECT_EQ(box.face_count(), 10u);

    ValidationReport report = box.validate();
    EXPECT_TRUE(report.is_valid()) << report.summary();
    EXPECT_TRUE(report.is_watertight()) << report.summary();
}

TEST(ModellingOpsTest, BevelFacePreservesWatertightness) {
    Mesh box = primitives::make_box(2.0f, 2.0f, 2.0f);
    EXPECT_TRUE(ops::bevel_face(box, 4, 0.2f, 0.3f));

    ValidationReport report = box.validate();
    EXPECT_TRUE(report.is_valid()) << report.summary();
    EXPECT_TRUE(report.is_watertight()) << report.summary();
}

TEST(ModellingOpsTest, LaplacianSmoothShrinksBox) {
    Mesh box = primitives::make_box(2.0f, 2.0f, 2.0f);
    AABB before = box.compute_bounds();
    ops::laplacian_smooth(box, 2, 0.5f);
    AABB after = box.compute_bounds();

    EXPECT_LT(after.max.x, before.max.x);
    EXPECT_TRUE(box.validate().is_watertight());
}

TEST(ModellingOpsTest, CatmullClarkSubdivisionPreservesWatertightness) {
    Mesh box = primitives::make_box(2.0f, 2.0f, 2.0f);
    ops::subdivide_catmull_clark(box, 2);

    // 1 level: 6*4 = 24 faces; 2 levels: 24*4 = 96 faces
    EXPECT_EQ(box.face_count(), 96u);
    ValidationReport report = box.validate();
    EXPECT_TRUE(report.is_valid()) << report.summary();
    EXPECT_TRUE(report.is_watertight()) << report.summary();
}
