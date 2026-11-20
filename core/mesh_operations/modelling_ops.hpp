#pragma once

#include "core/geometry/mesh.hpp"

#include <cstdint>

namespace forge3d::ops {

// Extrudes a single face along its normal by `distance`.
// Creates side quads and moves the extruded cap, preserving watertightness.
bool extrude_face(Mesh& mesh, uint32_t face_idx, float distance);

// Insets a single face toward its centroid by `factor` in (0, 1).
// Creates surrounding quad faces and shrinks the inner face, preserving watertightness.
bool inset_face(Mesh& mesh, uint32_t face_idx, float factor);

// Bevels a face by insetting and extruding.
bool bevel_face(Mesh& mesh, uint32_t face_idx, float inset_factor, float height);

// Applies uniform Laplacian smoothing to all vertices.
void laplacian_smooth(Mesh& mesh, uint32_t iterations = 1, float lambda = 0.5f);

// Applies Catmull-Clark subdivision surface to the mesh `levels` times.
void subdivide_catmull_clark(Mesh& mesh, uint32_t levels = 1);

// Appends `src` into `dst` translated by `offset`, assigning `material_id` and `component_id`.
void append_mesh(Mesh& dst,
                 const Mesh& src,
                 const Vec3& offset = {0.0f, 0.0f, 0.0f},
                 uint32_t material_id = 0,
                 uint32_t component_id = 0);

} // namespace forge3d::ops
