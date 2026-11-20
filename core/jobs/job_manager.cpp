#include "core/jobs/job_manager.hpp"
#include "core/jobs/contract_validator.hpp"

#include <chrono>
#include <cstring>
#include <fcntl.h>
#include <fstream>
#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <thread>
#include <unistd.h>
#include <vector>

namespace forge3d::jobs {

std::string to_string(JobState state) {
    switch (state) {
        case JobState::CREATED:   return "CREATED";
        case JobState::QUEUED:    return "QUEUED";
        case JobState::RUNNING:   return "RUNNING";
        case JobState::COMPLETED: return "COMPLETED";
        case JobState::FAILED:    return "FAILED";
        case JobState::CANCELLED: return "CANCELLED";
        case JobState::TIMEOUT:   return "TIMEOUT";
    }
    return "FAILED";
}

JobManager::JobManager(JobManagerConfig config) : config_(std::move(config)) {}

void JobManager::write_status(const std::filesystem::path& job_dir,
                              const std::string& job_id,
                              JobState state,
                              const std::string& message) const {
    nlohmann::json st = {
        {"job_id", job_id},
        {"state", to_string(state)},
        {"message", message}
    };
    std::filesystem::path final_path = job_dir / "status.json";
    std::filesystem::path tmp_path = job_dir / "status.json.tmp";
    {
        std::ofstream out(tmp_path);
        if (out) {
            out << st.dump(2) << "\n";
        }
    }
    std::error_code ec;
    std::filesystem::rename(tmp_path, final_path, ec);
}

bool JobManager::check_worker(std::string* version_out, std::string* error_out) const {
    int pipefd[2];
    if (pipe(pipefd) != 0) {
        if (error_out) *error_out = "Failed to create pipe.";
        return false;
    }

    pid_t pid = fork();
    if (pid < 0) {
        close(pipefd[0]);
        close(pipefd[1]);
        if (error_out) *error_out = "fork() failed.";
        return false;
    }

    if (pid == 0) {
        close(pipefd[0]);
        dup2(pipefd[1], STDOUT_FILENO);
        dup2(pipefd[1], STDERR_FILENO);
        close(pipefd[1]);

        std::vector<char*> args;
        std::string exe = config_.blender_executable;
        std::string flag = "--version";
        args.push_back(exe.data());
        args.push_back(flag.data());
        args.push_back(nullptr);

        execvp(exe.c_str(), args.data());
        _exit(127);
    }

    close(pipefd[1]);
    std::string output;
    char buf[256];
    ssize_t n = 0;
    while ((n = read(pipefd[0], buf, sizeof(buf))) > 0) {
        output.append(buf, static_cast<size_t>(n));
    }
    close(pipefd[0]);

    int status = 0;
    waitpid(pid, &status, 0);
    if (!WIFEXITED(status) || WEXITSTATUS(status) != 0) {
        if (error_out) {
            *error_out = "Blender executable '" + config_.blender_executable +
                         "' not found or failed (--version).";
        }
        return false;
    }

    if (version_out) {
        auto nl = output.find('\n');
        *version_out = (nl == std::string::npos) ? output : output.substr(0, nl);
    }
    return true;
}

JobRunOutcome JobManager::submit_and_run(const nlohmann::json& job_spec,
                                         std::atomic<bool>* cancel_requested) {
    JobRunOutcome outcome;

    // 1. Validate job_spec against schema + security rules
    auto val = validate_job_spec(job_spec, config_.schema_dir, config_.workspace_root);
    if (!val.ok) {
        outcome.state = JobState::FAILED;
        outcome.error_code = "INVALID_JOB_SPEC";
        outcome.error_message = val.error;
        return outcome;
    }

    std::string job_id = job_spec.at("job_id").get<std::string>();
    int timeout_sec = job_spec.at("timeout_sec").get<int>();

    // 2. Create per-job directory (refuse duplicate)
    std::filesystem::path jobs_root = config_.workspace_root / "jobs";
    std::filesystem::create_directories(jobs_root);
    std::filesystem::path job_dir = jobs_root / job_id;
    if (std::filesystem::exists(job_dir)) {
        outcome.state = JobState::FAILED;
        outcome.error_code = "DUPLICATE_JOB_ID";
        outcome.error_message = "Job directory already exists: " + job_dir.string();
        return outcome;
    }

    std::filesystem::create_directories(job_dir / "input");
    std::filesystem::create_directories(job_dir / "working");
    std::filesystem::create_directories(job_dir / "output");
    std::filesystem::create_directories(job_dir / "logs");
    std::filesystem::create_directories(job_dir / "results");

    outcome.job_dir = job_dir;
    outcome.log_path = job_dir / "logs" / "worker.log";
    outcome.result_path = job_dir / "results" / "job_result.json";

    write_status(job_dir, job_id, JobState::CREATED, "Job created.");

    std::filesystem::path spec_path = job_dir / "input" / "job_spec.json";
    {
        std::ofstream spec_out(spec_path);
        spec_out << job_spec.dump(2) << "\n";
    }

    write_status(job_dir, job_id, JobState::QUEUED, "Job queued.");

    // 3. Build argument array (never shell concatenation)
    std::vector<std::string> arg_storage;
    if (config_.direct_script_mode) {
        arg_storage = {
            config_.blender_executable,
            config_.worker_script.string(),
            "--job", spec_path.string(),
            "--result", outcome.result_path.string()
        };
    } else {
        arg_storage = {
            config_.blender_executable,
            "--background",
            "--factory-startup",
            "--disable-autoexec",
            "--python", config_.worker_script.string(),
            "--",
            "--job", spec_path.string(),
            "--result", outcome.result_path.string()
        };
    }

    // 4. Fork & execvp
    pid_t pid = fork();
    if (pid < 0) {
        outcome.state = JobState::FAILED;
        outcome.error_code = "FORK_FAILED";
        outcome.error_message = "Failed to fork worker process.";
        write_status(job_dir, job_id, JobState::FAILED, outcome.error_message);
        return outcome;
    }

    if (pid == 0) {
        setpgid(0, 0);
        int log_fd = open(outcome.log_path.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0644);
        if (log_fd >= 0) {
            dup2(log_fd, STDOUT_FILENO);
            dup2(log_fd, STDERR_FILENO);
            close(log_fd);
        }

        std::vector<char*> c_args;
        c_args.reserve(arg_storage.size() + 1);
        for (auto& s : arg_storage) {
            c_args.push_back(s.data());
        }
        c_args.push_back(nullptr);

        execvp(arg_storage[0].c_str(), c_args.data());
        _exit(127);
    }

    setpgid(pid, pid);
    {
        std::ofstream pid_out(job_dir / "worker.pid");
        if (pid_out) pid_out << pid << "\n";
    }
    write_status(job_dir, job_id, JobState::RUNNING, "Worker running.");

    // 5. Monitor child process for completion, timeout, or cancellation
    auto start_time = std::chrono::steady_clock::now();
    int raw_status = 0;
    bool finished = false;
    bool timed_out = false;
    bool cancelled = false;

    std::filesystem::path cancel_req_path = job_dir / "cancel.req";
    auto reap_child = [&](pid_t p, int* st) {
        while (waitpid(p, st, 0) < 0 && errno == EINTR) {}
    };

    while (!finished) {
        pid_t w = waitpid(pid, &raw_status, WNOHANG);
        if (w == pid) {
            finished = true;
            break;
        }
        if (w < 0 && errno == EINTR) {
            continue;
        }
        if ((cancel_requested && cancel_requested->load()) ||
            std::filesystem::exists(cancel_req_path)) {
            cancelled = true;
            kill(-pid, SIGTERM);
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            kill(-pid, SIGKILL);
            reap_child(pid, &raw_status);
            break;
        }
        auto elapsed = std::chrono::duration_cast<std::chrono::seconds>(
            std::chrono::steady_clock::now() - start_time).count();
        if (elapsed >= timeout_sec) {
            timed_out = true;
            kill(-pid, SIGTERM);
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            kill(-pid, SIGKILL);
            reap_child(pid, &raw_status);
            break;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(20));
    }

    std::error_code rm_ec;
    std::filesystem::remove(job_dir / "worker.pid", rm_ec);

    if (cancelled) {
        outcome.state = JobState::CANCELLED;
        outcome.error_code = "JOB_CANCELLED";
        outcome.error_message = "Job cancelled by caller; worker process group terminated.";
        write_status(job_dir, job_id, JobState::CANCELLED, outcome.error_message);
        return outcome;
    }

    if (timed_out) {
        outcome.state = JobState::TIMEOUT;
        outcome.error_code = "JOB_TIMEOUT";
        outcome.error_message = "Worker exceeded timeout_sec=" + std::to_string(timeout_sec);
        write_status(job_dir, job_id, JobState::TIMEOUT, outcome.error_message);
        return outcome;
    }

    if (WIFEXITED(raw_status)) {
        outcome.exit_code = WEXITSTATUS(raw_status);
    } else {
        outcome.exit_code = -1;
    }

    if (outcome.exit_code == 127) {
        outcome.state = JobState::FAILED;
        outcome.error_code = "WORKER_NOT_FOUND";
        outcome.error_message = "Failed to execute worker: " + config_.blender_executable;
        write_status(job_dir, job_id, JobState::FAILED, outcome.error_message);
        return outcome;
    }

    // 6. Parent-side verification of job_result.json
    if (!std::filesystem::exists(outcome.result_path)) {
        outcome.state = JobState::FAILED;
        outcome.error_code = "MISSING_RESULT";
        outcome.error_message = "Worker exited without writing job_result.json.";
        write_status(job_dir, job_id, JobState::FAILED, outcome.error_message);
        return outcome;
    }

    nlohmann::json res_json;
    try {
        std::ifstream rin(outcome.result_path);
        rin >> res_json;
    } catch (const std::exception& e) {
        outcome.state = JobState::FAILED;
        outcome.error_code = "MALFORMED_RESULT";
        outcome.error_message = std::string("Malformed job_result.json: ") + e.what();
        write_status(job_dir, job_id, JobState::FAILED, outcome.error_message);
        return outcome;
    }

    auto res_val = validate_job_result(res_json, config_.schema_dir);
    if (!res_val.ok) {
        outcome.state = JobState::FAILED;
        outcome.error_code = "INVALID_RESULT_SCHEMA";
        outcome.error_message = res_val.error;
        write_status(job_dir, job_id, JobState::FAILED, outcome.error_message);
        return outcome;
    }

    if (res_json.at("job_id").get<std::string>() != job_id) {
        outcome.state = JobState::FAILED;
        outcome.error_code = "MISMATCHED_JOB_ID";
        outcome.error_message = "Result job_id does not match submitted job_id.";
        write_status(job_dir, job_id, JobState::FAILED, outcome.error_message);
        return outcome;
    }

    if (outcome.exit_code != 0 || res_json.at("state").get<std::string>() != "COMPLETED") {
        outcome.state = JobState::FAILED;
        outcome.error_code = res_json.at("error_code").get<std::string>();
        outcome.error_message = res_json.at("error_message").get<std::string>();
        outcome.verified_result = res_json;
        write_status(job_dir, job_id, JobState::FAILED, outcome.error_message);
        return outcome;
    }

    // Verify health_check evidence for health_check jobs
    if (job_spec.at("job_type").get<std::string>() == "health_check") {
        if (!res_json.contains("health_check") ||
            !res_json["health_check"].value("bpy_available", false)) {
            outcome.state = JobState::FAILED;
            outcome.error_code = "MISSING_HEALTH_EVIDENCE";
            outcome.error_message = "health_check job did not report bpy_available=true.";
            write_status(job_dir, job_id, JobState::FAILED, outcome.error_message);
            return outcome;
        }
    }

    outcome.state = JobState::COMPLETED;
    outcome.verified_result = res_json;
    write_status(job_dir, job_id, JobState::COMPLETED, "Job completed and verified.");
    return outcome;
}

nlohmann::json JobManager::get_status(const std::string& job_id) const {
    if (!is_safe_job_id(job_id)) {
        return {{"error", "Invalid job_id"}};
    }
    std::filesystem::path p = config_.workspace_root / "jobs" / job_id / "status.json";
    if (!std::filesystem::exists(p)) {
        return {{"error", "Job not found"}};
    }
    std::ifstream in(p);
    nlohmann::json j;
    in >> j;
    return j;
}

std::string JobManager::get_logs(const std::string& job_id) const {
    if (!is_safe_job_id(job_id)) {
        return "Invalid job_id";
    }
    std::filesystem::path p = config_.workspace_root / "jobs" / job_id / "logs" / "worker.log";
    if (!std::filesystem::exists(p)) {
        return "Log file not found";
    }
    std::ifstream in(p);
    return std::string((std::istreambuf_iterator<char>(in)), std::istreambuf_iterator<char>());
}

bool JobManager::cancel_job(const std::string& job_id, std::string* message_out) {
    if (!is_safe_job_id(job_id)) {
        if (message_out) *message_out = "Invalid job_id.";
        return false;
    }
    std::filesystem::path job_dir = config_.workspace_root / "jobs" / job_id;
    nlohmann::json st = get_status(job_id);
    std::string state = st.value("state", "");
    if (state != "CREATED" && state != "QUEUED" && state != "RUNNING") {
        if (message_out) *message_out = "Job is already in terminal or unknown state: " + state;
        return false;
    }

    std::filesystem::path tmp_req = job_dir / "cancel.req.tmp";
    std::filesystem::path final_req = job_dir / "cancel.req";
    {
        std::ofstream out(tmp_req);
        if (!out) {
            if (message_out) *message_out = "Failed to write cancellation request.";
            return false;
        }
        out << "cancel\n";
    }
    std::error_code ec;
    std::filesystem::rename(tmp_req, final_req, ec);
    if (ec) {
        if (message_out) *message_out = "Failed to publish cancellation request: " + ec.message();
        return false;
    }
    if (message_out) *message_out = "Cancellation requested for job " + job_id + ".";
    return true;
}

} // namespace forge3d::jobs
