#pragma once

#include "core/geometry/mesh.hpp"

namespace forge3d::primitives {

Mesh make_box(float width = 1.0f, float height = 1.0f, float depth = 1.0f);
Mesh make_plane(float width = 1.0f, float depth = 1.0f, uint32_t seg_x = 1, uint32_t seg_z = 1);
Mesh make_uv_sphere(float radius = 0.5f, uint32_t rings = 16, uint32_t sectors = 32);
Mesh make_cylinder(float radius = 0.5f, float height = 1.0f, uint32_t sectors = 24, bool capped = true);

} // namespace forge3d::primitives
