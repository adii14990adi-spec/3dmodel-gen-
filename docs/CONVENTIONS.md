# Forge3D Canonical Conventions (v1.0.0)

- **Linear Units**: `1.0 unit = 1.0 meter` (matches Unity 6 default scale).
- **Coordinate System / Axes**: Right-handed, `Y-up`, `+Z` forward, `+X` right (or explicit conversion documented per exporter).
- **Quaternion Order**: `[x, y, z, w]` (`xyzw`).
- **Process Separation**: Blender `bpy` runs as a separate headless OS process (`blender --background --factory-startup --disable-autoexec --python ... -- ...`). Process separation provides isolation from C++ memory/crashes, **not** a full OS security sandbox.
- **Supported OS for Job Manager**: Linux (`POSIX fork/execvp/killpg`).
