#include <gtest/gtest.h>

#include "core/geometry/primitives.hpp"
#include "exporters/glb/glb_exporter.hpp"

#include <filesystem>

using namespace forge3d;

TEST(GlbExporterTest, ExportsAndValidatesBox) {
    Mesh box = primitives::make_box(1.0f, 2.0f, 3.0f);
    PBRMaterial mat;
    mat.name = "Metal";
    mat.base_color = {0.7f, 0.72f, 0.75f, 1.0f};
    mat.metallic = 0.9f;
    mat.roughness = 0.25f;

    std::string out_path = "/tmp/forge3d_test_box.glb";
    auto res = exporters::export_glb(box, {mat}, out_path);
    EXPECT_TRUE(res.success) << res.error;
    EXPECT_EQ(res.triangle_count, 12u);
    EXPECT_GT(res.file_size_bytes, 100u);

    std::string err;
    EXPECT_TRUE(exporters::validate_glb_file(out_path, &err)) << err;
    std::filesystem::remove(out_path);
}
