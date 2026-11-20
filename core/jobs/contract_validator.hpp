#pragma once

#include <filesystem>
#include <nlohmann/json.hpp>
#include <string>

namespace forge3d::jobs {

struct ValidationStatus {
    bool ok = false;
    std::string error;
};

// Validates job_id against ^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$
bool is_safe_job_id(const std::string& job_id);

// Validates that `rel_path` is relative, contains no `..`, is not a symlink,
// and resolves strictly inside `base_dir`.
ValidationStatus validate_contained_path(const std::filesystem::path& base_dir,
                                         const std::string& rel_path,
                                         std::filesystem::path* resolved_out = nullptr);

// Validates JSON against a Draft-07 schema file.
ValidationStatus validate_json_with_schema_file(const nlohmann::json& doc,
                                                const std::filesystem::path& schema_path);

// Full contract + runtime security validation for job_spec.
ValidationStatus validate_job_spec(const nlohmann::json& doc,
                                   const std::filesystem::path& schema_dir,
                                   const std::filesystem::path& workspace_root);

// Full contract validation for job_result.
ValidationStatus validate_job_result(const nlohmann::json& doc,
                                     const std::filesystem::path& schema_dir);

} // namespace forge3d::jobs
