import argparse
import json
import os
import sys
import time


def write_atomic_json(path: str, data: dict) -> None:
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    tmp_path = f"{path}.tmp.{os.getpid()}"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        f.write("\n")
    os.replace(tmp_path, path)


def main() -> int:
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = argv[1:]

    parser = argparse.ArgumentParser(description="Forge3D Headless Blender Worker")
    parser.add_argument("--job", required=True, help="Path to job_spec.json")
    parser.add_argument("--result", required=True, help="Path to job_result.json")
    args = parser.parse_args(argv)

    start_ms = int(time.monotonic() * 1000)

    try:
        with open(args.job, "r", encoding="utf-8") as f:
            job_spec = json.load(f)
    except Exception as exc:
        write_atomic_json(args.result, {
            "schema_version": "1.0.0",
            "job_id": "unknown",
            "state": "FAILED",
            "error_code": "INVALID_JOB_FILE",
            "error_message": str(exc),
            "duration_ms": max(0, int(time.monotonic() * 1000) - start_ms),
            "worker_version": "1.0.0",
            "artifacts": [],
        })
        return 1

    job_id = job_spec.get("job_id", "unknown")
    job_type = job_spec.get("job_type", "")

    try:
        import bpy  # type: ignore
        bpy_available = True
        blender_version = bpy.app.version_string
    except Exception as exc:
        write_atomic_json(args.result, {
            "schema_version": "1.0.0",
            "job_id": job_id,
            "state": "FAILED",
            "error_code": "BPY_UNAVAILABLE",
            "error_message": f"Failed to import bpy: {exc}",
            "duration_ms": max(0, int(time.monotonic() * 1000) - start_ms),
            "worker_version": "1.0.0",
            "health_check": {"bpy_available": False, "blender_version": ""},
            "artifacts": [],
        })
        return 1

    if job_type == "health_check":
        write_atomic_json(args.result, {
            "schema_version": "1.0.0",
            "job_id": job_id,
            "state": "COMPLETED",
            "error_code": "",
            "error_message": "",
            "duration_ms": max(0, int(time.monotonic() * 1000) - start_ms),
            "worker_version": f"blender-{blender_version}",
            "health_check": {
                "bpy_available": bpy_available,
                "blender_version": blender_version,
            },
            "artifacts": [],
        })
        return 0

    write_atomic_json(args.result, {
        "schema_version": "1.0.0",
        "job_id": job_id,
        "state": "FAILED",
        "error_code": "UNSUPPORTED_JOB",
        "error_message": f"Job type '{job_type}' is not implemented in Part 1.",
        "duration_ms": max(0, int(time.monotonic() * 1000) - start_ms),
        "worker_version": f"blender-{blender_version}",
        "artifacts": [],
    })
    return 1


if __name__ == "__main__":
    sys.exit(main())
