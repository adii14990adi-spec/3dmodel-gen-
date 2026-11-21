#pragma once

#include <atomic>
#include <filesystem>
#include <nlohmann/json.hpp>
#include <string>

namespace forge3d::jobs {

enum class JobState {
    CREATED,
    QUEUED,
    RUNNING,
    COMPLETED,
    FAILED,
    CANCELLED,
    TIMEOUT
};

std::string to_string(JobState state);

struct JobManagerConfig {
    std::filesystem::path workspace_root = "workspace";
    std::filesystem::path schema_dir = "contracts/schemas";
    std::string blender_executable = "blender";
    std::filesystem::path worker_script = "blender_worker/worker.py";
    // When true, invokes `blender_executable` directly with `worker_script`
    // (used only for controlled fake-worker unit tests).
    bool direct_script_mode = false;
};

struct JobRunOutcome {
    JobState state = JobState::FAILED;
    int exit_code = -1;
    std::string error_code;
    std::string error_message;
    std::filesystem::path job_dir;
    std::filesystem::path result_path;
    std::filesystem::path log_path;
    nlohmann::json verified_result;
};

class JobManager {
public:
    explicit JobManager(JobManagerConfig config);

    // Checks if the configured Blender executable is available and runnable.
    bool check_worker(std::string* version_out = nullptr, std::string* error_out = nullptr) const;

    // Validates, creates per-job directories, runs worker, and verifies result.
    JobRunOutcome submit_and_run(const nlohmann::json& job_spec,
                                 std::atomic<bool>* cancel_requested = nullptr);

    // Reads durable status.json for a job_id.
    nlohmann::json get_status(const std::string& job_id) const;

    // Reads worker.log for a job_id.
    std::string get_logs(const std::string& job_id) const;

    // Cancels a running job by signalling its recorded process group.
    bool cancel_job(const std::string& job_id, std::string* message_out = nullptr);

private:
    JobManagerConfig config_;

    void write_status(const std::filesystem::path& job_dir,
                      const std::string& job_id,
                      JobState state,
                      const std::string& message) const;
};

} // namespace forge3d::jobs
