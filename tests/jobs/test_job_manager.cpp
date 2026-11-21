#include <gtest/gtest.h>

#include "core/jobs/contract_validator.hpp"
#include "core/jobs/job_manager.hpp"

#include <atomic>
#include <chrono>
#include <filesystem>
#include <fstream>
#include <thread>

using namespace forge3d::jobs;

namespace {

std::filesystem::path make_temp_workspace(const std::string& name) {
    auto p = std::filesystem::temp_directory_path() / ("forge3d_test_" + name);
    std::filesystem::remove_all(p);
    std::filesystem::create_directories(p);
    return p;
}

nlohmann::json valid_health_spec(const std::string& job_id, int timeout_sec = 10) {
    return {
        {"schema_version", "1.0.0"},
        {"job_id", job_id},
        {"job_type", "health_check"},
        {"input_refs", nlohmann::json::array()},
        {"output_dir", "output"},
        {"timeout_sec", timeout_sec}
    };
}

} // namespace

TEST(ContractValidatorTest, AcceptsValidJobSpec) {
    auto ws = make_temp_workspace("valid_spec");
    auto res = validate_job_spec(valid_health_spec("job-01"), "contracts/schemas", ws);
    EXPECT_TRUE(res.ok) << res.error;
    std::filesystem::remove_all(ws);
}

TEST(ContractValidatorTest, RejectsUnsupportedSchemaVersion) {
    auto ws = make_temp_workspace("bad_ver");
    auto spec = valid_health_spec("job-02");
    spec["schema_version"] = "2.0.0";
    auto res = validate_job_spec(spec, "contracts/schemas", ws);
    EXPECT_FALSE(res.ok);
    std::filesystem::remove_all(ws);
}

TEST(ContractValidatorTest, RejectsUnsafeJobIdAndTraversal) {
    auto ws = make_temp_workspace("unsafe");
    EXPECT_FALSE(is_safe_job_id("../evil"));
    EXPECT_FALSE(is_safe_job_id("bad/id"));

    auto spec = valid_health_spec("job-03");
    spec["output_dir"] = "../escape";
    auto res = validate_job_spec(spec, "contracts/schemas", ws);
    EXPECT_FALSE(res.ok);
    std::filesystem::remove_all(ws);
}

TEST(JobManagerTest, MissingBlenderExecutableFailsCleanly) {
    auto ws = make_temp_workspace("missing_blender");
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "nonexistent_blender_binary_xyz";
    JobManager mgr(cfg);

    std::string err;
    EXPECT_FALSE(mgr.check_worker(nullptr, &err));
    EXPECT_FALSE(err.empty());

    auto outcome = mgr.submit_and_run(valid_health_spec("missing-bin-01"));
    EXPECT_EQ(outcome.state, JobState::FAILED);
    EXPECT_EQ(outcome.error_code, "WORKER_NOT_FOUND");
    std::filesystem::remove_all(ws);
}

TEST(JobManagerTest, DuplicateJobIdIsRejected) {
    auto ws = make_temp_workspace("dup_job");
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "nonexistent_blender_binary_xyz";
    JobManager mgr(cfg);

    auto first = mgr.submit_and_run(valid_health_spec("dup-01"));
    EXPECT_EQ(first.state, JobState::FAILED);

    auto second = mgr.submit_and_run(valid_health_spec("dup-01"));
    EXPECT_EQ(second.state, JobState::FAILED);
    EXPECT_EQ(second.error_code, "DUPLICATE_JOB_ID");
    std::filesystem::remove_all(ws);
}

// Controlled fake-worker tests (using python3, NOT real Blender)
TEST(JobManagerFakeWorkerTest, NonzeroExitFails) {
    auto ws = make_temp_workspace("fake_nonzero");
    auto script = ws / "fake_worker.py";
    {
        std::ofstream out(script);
        out << "import sys\nsys.exit(2)\n";
    }
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "python3";
    cfg.worker_script = script;
    cfg.direct_script_mode = true;
    JobManager mgr(cfg);

    auto outcome = mgr.submit_and_run(valid_health_spec("fake-nz-01"));
    EXPECT_EQ(outcome.state, JobState::FAILED);
    EXPECT_EQ(outcome.error_code, "MISSING_RESULT");
    std::filesystem::remove_all(ws);
}

TEST(JobManagerFakeWorkerTest, MismatchedJobIdIsRejected) {
    auto ws = make_temp_workspace("fake_mismatch");
    auto script = ws / "fake_worker.py";
    {
        std::ofstream out(script);
        out << "import argparse, json\n"
            << "p = argparse.ArgumentParser()\n"
            << "p.add_argument('--job'); p.add_argument('--result')\n"
            << "a = p.parse_args()\n"
            << "with open(a.result, 'w') as f:\n"
            << "  json.dump({'schema_version':'1.0.0','job_id':'wrong-id','state':'COMPLETED',"
            << "'error_code':'','error_message':'','duration_ms':1,'worker_version':'fake','artifacts':[]}, f)\n";
    }
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "python3";
    cfg.worker_script = script;
    cfg.direct_script_mode = true;
    JobManager mgr(cfg);

    auto outcome = mgr.submit_and_run(valid_health_spec("fake-mm-01"));
    EXPECT_EQ(outcome.state, JobState::FAILED);
    EXPECT_EQ(outcome.error_code, "MISMATCHED_JOB_ID");
    std::filesystem::remove_all(ws);
}

TEST(JobManagerFakeWorkerTest, TimeoutKillsWorker) {
    auto ws = make_temp_workspace("fake_timeout");
    auto script = ws / "fake_sleep.py";
    {
        std::ofstream out(script);
        out << "import time\ntime.sleep(30)\n";
    }
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "python3";
    cfg.worker_script = script;
    cfg.direct_script_mode = true;
    JobManager mgr(cfg);

    auto outcome = mgr.submit_and_run(valid_health_spec("fake-to-01", 1));
    EXPECT_EQ(outcome.state, JobState::TIMEOUT);
    EXPECT_EQ(outcome.error_code, "JOB_TIMEOUT");
    std::filesystem::remove_all(ws);
}

TEST(JobManagerFakeWorkerTest, CancellationKillsWorker) {
    auto ws = make_temp_workspace("fake_cancel");
    auto script = ws / "fake_sleep.py";
    {
        std::ofstream out(script);
        out << "import time\ntime.sleep(30)\n";
    }
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "python3";
    cfg.worker_script = script;
    cfg.direct_script_mode = true;
    JobManager mgr(cfg);

    std::atomic<bool> cancel{false};
    std::thread killer([&]() {
        std::this_thread::sleep_for(std::chrono::milliseconds(150));
        cancel.store(true);
    });

    auto outcome = mgr.submit_and_run(valid_health_spec("fake-cancel-01", 10), &cancel);
    killer.join();
    EXPECT_EQ(outcome.state, JobState::CANCELLED);
    EXPECT_EQ(outcome.error_code, "JOB_CANCELLED");
    std::filesystem::remove_all(ws);
}

TEST(ContractValidatorTest, RejectsSymlinkEscape) {
    auto ws = make_temp_workspace("symlink_escape");
    auto outside = make_temp_workspace("outside_target");
    std::error_code ec;
    std::filesystem::create_directory_symlink(outside, ws / "escape_link", ec);
    if (!ec) {
        auto res = validate_contained_path(ws, "escape_link");
        EXPECT_FALSE(res.ok);
    }
    std::filesystem::remove_all(ws);
    std::filesystem::remove_all(outside);
}

TEST(JobManagerFakeWorkerTest, MalformedResultIsRejected) {
    auto ws = make_temp_workspace("fake_malformed");
    auto script = ws / "fake_malformed.py";
    {
        std::ofstream out(script);
        out << "import argparse\n"
            << "p = argparse.ArgumentParser()\n"
            << "p.add_argument('--job'); p.add_argument('--result')\n"
            << "a = p.parse_args()\n"
            << "with open(a.result, 'w') as f: f.write('{bad json')\n";
    }
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "python3";
    cfg.worker_script = script;
    cfg.direct_script_mode = true;
    JobManager mgr(cfg);

    auto outcome = mgr.submit_and_run(valid_health_spec("fake-mal-01"));
    EXPECT_EQ(outcome.state, JobState::FAILED);
    EXPECT_EQ(outcome.error_code, "MALFORMED_RESULT");
    std::filesystem::remove_all(ws);
}

TEST(JobManagerFakeWorkerTest, ContradictoryResultIsRejected) {
    auto ws = make_temp_workspace("fake_contradict");
    auto script = ws / "fake_contradict.py";
    {
        std::ofstream out(script);
        out << "import argparse, json, sys\n"
            << "p = argparse.ArgumentParser()\n"
            << "p.add_argument('--job'); p.add_argument('--result')\n"
            << "a = p.parse_args()\n"
            << "with open(a.result, 'w') as f:\n"
            << "  json.dump({'schema_version':'1.0.0','job_id':'fake-con-01','state':'COMPLETED',"
            << "'error_code':'','error_message':'','duration_ms':1,'worker_version':'fake',"
            << "'health_check':{'bpy_available':True,'blender_version':'4.0'},'artifacts':[]}, f)\n"
            << "sys.exit(1)\n";
    }
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "python3";
    cfg.worker_script = script;
    cfg.direct_script_mode = true;
    JobManager mgr(cfg);

    auto outcome = mgr.submit_and_run(valid_health_spec("fake-con-01"));
    EXPECT_EQ(outcome.state, JobState::FAILED);
    std::filesystem::remove_all(ws);
}

TEST(JobManagerFakeWorkerTest, ExternalCancelJobCleansUpWorker) {
    auto ws = make_temp_workspace("fake_ext_cancel");
    auto script = ws / "fake_sleep.py";
    {
        std::ofstream out(script);
        out << "import time\ntime.sleep(30)\n";
    }
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "python3";
    cfg.worker_script = script;
    cfg.direct_script_mode = true;
    JobManager mgr(cfg);

    std::thread killer([&]() {
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
        std::string msg;
        EXPECT_TRUE(mgr.cancel_job("fake-ext-01", &msg)) << msg;
    });

    auto outcome = mgr.submit_and_run(valid_health_spec("fake-ext-01", 10));
    killer.join();
    EXPECT_EQ(outcome.state, JobState::CANCELLED);
    EXPECT_EQ(mgr.get_status("fake-ext-01").value("state", ""), "CANCELLED");
    std::filesystem::remove_all(ws);
}

TEST(JobManagerFakeWorkerTest, ChildProcessCleanupOnCancelAndTimeout) {
    auto ws = make_temp_workspace("fake_descendant");
    auto pids_file = ws / "pids.txt";
    auto script = ws / "spawn_child.py";
    {
        std::ofstream out(script);
        out << "import os, subprocess, time\n"
            << "child = subprocess.Popen(['sleep', '30'])\n"
            << "with open(r'" << pids_file.string() << "', 'w') as f:\n"
            << "  f.write(f'{os.getpid()}\\n{child.pid}\\n')\n"
            << "time.sleep(30)\n";
    }
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "python3";
    cfg.worker_script = script;
    cfg.direct_script_mode = true;
    JobManager mgr(cfg);

    auto outcome = mgr.submit_and_run(valid_health_spec("fake-desc-01", 1));
    EXPECT_EQ(outcome.state, JobState::TIMEOUT);

    ASSERT_TRUE(std::filesystem::exists(pids_file));
    std::ifstream pin(pids_file);
    int worker_pid = 0, child_pid = 0;
    pin >> worker_pid >> child_pid;
    EXPECT_GT(worker_pid, 1);
    EXPECT_GT(child_pid, 1);
    // Neither worker nor spawned descendant should be alive
    EXPECT_NE(kill(worker_pid, 0), 0);
    EXPECT_NE(kill(child_pid, 0), 0);

    std::filesystem::remove_all(ws);
}

TEST(JobManagerFakeWorkerTest, CancelAfterCompletionDoesNotChangeTerminalState) {
    auto ws = make_temp_workspace("fake_cancel_after");
    auto script = ws / "fake_ok.py";
    {
        std::ofstream out(script);
        out << "import argparse, json\n"
            << "p = argparse.ArgumentParser()\n"
            << "p.add_argument('--job'); p.add_argument('--result')\n"
            << "a = p.parse_args()\n"
            << "with open(a.result, 'w') as f:\n"
            << "  json.dump({'schema_version':'1.0.0','job_id':'fake-done-01','state':'COMPLETED',"
            << "'error_code':'','error_message':'','duration_ms':1,'worker_version':'fake',"
            << "'health_check':{'bpy_available':True,'blender_version':'4.0'},'artifacts':[]}, f)\n";
    }
    JobManagerConfig cfg;
    cfg.workspace_root = ws;
    cfg.blender_executable = "python3";
    cfg.worker_script = script;
    cfg.direct_script_mode = true;
    JobManager mgr(cfg);

    auto outcome = mgr.submit_and_run(valid_health_spec("fake-done-01"));
    EXPECT_EQ(outcome.state, JobState::COMPLETED);

    std::string msg;
    EXPECT_FALSE(mgr.cancel_job("fake-done-01", &msg));
    EXPECT_EQ(mgr.get_status("fake-done-01").value("state", ""), "COMPLETED");
    std::filesystem::remove_all(ws);
}
