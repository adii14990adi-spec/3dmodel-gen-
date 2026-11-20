# Forge3D — Independent C++ 3D Asset Generation & Modelling System

Forge3D is a standalone, code-driven C++20 3D asset generation and procedural modelling engine. It generates editable, game-ready 3D assets mathematically without depending on Blender, `bpy`, Maya, 3ds Max, or any external 3D modelling application.

## Current Status: Phase 1 Complete

- **Phase 1: Core C++ Geometry Engine** — Implemented & tested (`8/8` GoogleTest cases passing).
  - CMake + Ninja C++20 build system (`CMakeLists.txt`).
  - Math primitives (`core/geometry/vec.hpp`): `Vec2`, `Vec3`, `Vec4`, `AABB`.
  - Core `Mesh` representation (`core/geometry/mesh.hpp`, `core/geometry/mesh.cpp`): vertices, n-gon/quad/triangle faces, independently editable `MeshComponent`s, fan triangulation, Newell face normals, smooth vertex normals, UV-derivative tangents, and `ValidationReport` (invalid indices, degenerate faces, non-manifold edges, boundary/hole edges, isolated vertices, non-finite coordinates).
  - Parametric primitives (`core/geometry/primitives.hpp`, `core/geometry/primitives.cpp`): watertight `make_box`, `make_uv_sphere`, `make_cylinder`, and `make_plane`.

## Build & Test

```bash
cmake -B build -G Ninja
cmake --build build
ctest --test-dir build --output-on-failure
```

## Planned Architecture

- `core/` — `geometry/`, `topology/`, `mesh_operations/`, `boolean/`, `subdivision/`, `deformation/`
- `generators/` — `characters/`, `weapons/`, `vehicles/`, `buildings/`, `terrain/`, `vegetation/`, `props/`
- `materials/` — `pbr/`, `textures/`, `uv/`
- `animation/` — `skeleton/`, `skinning/`, `retargeting/`
- `optimization/` — `lod/`, `decimation/`, `collision/`, `instancing/`
- `exporters/` — `gltf/`, `glb/`, `fbx/`, `obj/`, `stl/`
- `editor/` — TypeScript + Three.js interactive 3D editor
- `tests/` — GoogleTest unit & integration suites
