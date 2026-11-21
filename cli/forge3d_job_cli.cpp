#include "core/jobs/job_manager.hpp"

#include <fstream>
#include <iostream>
#include <string>

using namespace forge3d::jobs;

int main(int argc, char** argv) {
    if (argc < 2) {
        std::cerr << "Usage: forge3d_job_cli <worker-check|submit-run|status|logs|cancel> [arg]\n";
        return 1;
    }

    JobManagerConfig cfg;
    if (const char* env_blender = std::getenv("FORGE3D_BLENDER_BIN")) {
        cfg.blender_executable = env_blender;
    }

    JobManager mgr(cfg);
    std::string cmd = argv[1];

    if (cmd == "worker-check") {
        std::string ver, err;
        if (mgr.check_worker(&ver, &err)) {
            std::cout << "OK: " << ver << "\n";
            return 0;
        }
        std::cerr << "ERROR: " << err << "\n";
        return 1;
    }

    if (cmd == "submit-run" && argc >= 3) {
        std::ifstream in(argv[2]);
        if (!in) {
            std::cerr << "ERROR: Cannot open job spec: " << argv[2] << "\n";
            return 1;
        }
        nlohmann::json spec;
        try {
            in >> spec;
        } catch (const std::exception& e) {
            std::cerr << "ERROR: Invalid JSON: " << e.what() << "\n";
            return 1;
        }
        auto outcome = mgr.submit_and_run(spec);
        std::cout << "State: " << to_string(outcome.state) << "\n";
        if (!outcome.error_code.empty()) {
            std::cout << "Error: " << outcome.error_code << " - " << outcome.error_message << "\n";
        }
        if (!outcome.verified_result.is_null()) {
            std::cout << outcome.verified_result.dump(2) << "\n";
        }
        return outcome.state == JobState::COMPLETED ? 0 : 1;
    }

    if (cmd == "status" && argc >= 3) {
        std::cout << mgr.get_status(argv[2]).dump(2) << "\n";
        return 0;
    }

    if (cmd == "logs" && argc >= 3) {
        std::cout << mgr.get_logs(argv[2]) << "\n";
        return 0;
    }

    if (cmd == "cancel" && argc >= 3) {
        std::string msg;
        bool ok = mgr.cancel_job(argv[2], &msg);
        std::cout << msg << "\n";
        return ok ? 0 : 1;
    }

    std::cerr << "Unknown command or missing argument.\n";
    return 1;
}
