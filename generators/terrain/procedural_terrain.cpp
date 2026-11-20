#include "generators/terrain/procedural_terrain.hpp"

#include "core/geometry/primitives.hpp"

#include <cmath>

namespace forge3d::generators {

namespace {

float hash2d(int x, int z, uint32_t seed) {
    uint32_t h = static_cast<uint32_t>(x * 374761393 + z * 668265263) ^ (seed * 1442695041u);
    h = (h ^ (h >> 13)) * 1274126177u;
    h = h ^ (h >> 16);
    return static_cast<float>(h & 0xFFFFu) / 65535.0f;
}

float value_noise(float x, float z, uint32_t seed) {
    int ix = static_cast<int>(std::floor(x));
    int iz = static_cast<int>(std::floor(z));
    float fx = x - static_cast<float>(ix);
    float fz = z - static_cast<float>(iz);

    float ux = fx * fx * (3.0f - 2.0f * fx);
    float uz = fz * fz * (3.0f - 2.0f * fz);

    float a = hash2d(ix, iz, seed);
    float b = hash2d(ix + 1, iz, seed);
    float c = hash2d(ix, iz + 1, seed);
    float d = hash2d(ix + 1, iz + 1, seed);

    return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
}

float fbm(float x, float z, uint32_t octaves, float freq, uint32_t seed) {
    float sum = 0.0f;
    float amp = 0.5f;
    float f = freq;
    for (uint32_t i = 0; i < octaves; ++i) {
        sum += amp * value_noise(x * f, z * f, seed + i * 101u);
        f *= 2.0f;
        amp *= 0.5f;
    }
    return sum;
}

} // namespace

GeneratedAsset generate_procedural_terrain(const TerrainParams& params) {
    GeneratedAsset asset;
    asset.mesh = primitives::make_plane(params.width, params.depth, params.segments_x, params.segments_z);
    asset.mesh.set_name("ProceduralTerrain");
    asset.mesh.create_component("TerrainSurface", 0);

    PBRMaterial grass_rock;
    grass_rock.id = 0;
    grass_rock.name = "TerrainGrassRock";
    grass_rock.base_color = {0.28f, 0.42f, 0.22f, 1.0f};
    grass_rock.metallic = 0.0f;
    grass_rock.roughness = 0.90f;
    asset.materials = {grass_rock};

    for (auto& v : asset.mesh.vertices_mut()) {
        float h = fbm(v.position.x, v.position.z, params.octaves, params.frequency, params.seed);
        // Carve a subtle river valley along x = 0
        float valley = std::min(1.0f, std::abs(v.position.x) / (params.width * 0.25f));
        v.position.y = h * params.max_height * (0.25f + 0.75f * valley);
    }

    asset.mesh.compute_vertex_normals();
    asset.mesh.compute_tangents();
    return asset;
}

} // namespace forge3d::generators
