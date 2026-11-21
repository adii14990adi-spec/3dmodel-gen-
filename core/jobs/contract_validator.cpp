#include "core/jobs/contract_validator.hpp"

#include <fstream>
#include <nlohmann/json-schema.hpp>
#include <regex>

namespace forge3d::jobs {

bool is_safe_job_id(const std::string& job_id) {
    static const std::regex kPattern("^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$");
    return std::regex_match(job_id, kPattern);
}

ValidationStatus validate_contained_path(const std::filesystem::path& base_dir,
                                         const std::string& rel_path,
                                         std::filesystem::path* resolved_out) {
    if (rel_path.empty()) {
        return {false, "Path must not be empty."};
    }
    std::filesystem::path p(rel_path);
    if (p.is_absolute()) {
        return {false, "Absolute paths are not allowed: " + rel_path};
    }
    for (const auto& part : p) {
        if (part == "..") {
            return {false, "Path traversal ('..') is not allowed: " + rel_path};
        }
    }

    std::error_code ec;
    std::filesystem::path base_canon = std::filesystem::weakly_canonical(base_dir, ec);
    if (ec) {
        return {false, "Failed to resolve base directory: " + ec.message()};
    }

    std::filesystem::path candidate = base_canon / p;
    // Reject symlinks on any existing component
    if (std::filesystem::is_symlink(candidate, ec)) {
        return {false, "Symlinks are not allowed: " + rel_path};
    }

    std::filesystem::path resolved = std::filesystem::weakly_canonical(candidate, ec);
    if (ec) {
        return {false, "Failed to resolve path: " + ec.message()};
    }

    // Ensure resolved starts with base_canon
    auto base_str = base_canon.string();
    auto res_str = resolved.string();
    if (res_str != base_str &&
        (res_str.size() <= base_str.size() ||
         res_str.compare(0, base_str.size(), base_str) != 0 ||
         res_str[base_str.size()] != std::filesystem::path::preferred_separator)) {
        return {false, "Path escapes workspace containment: " + rel_path};
    }

    if (resolved_out) {
        *resolved_out = resolved;
    }
    return {true, ""};
}

ValidationStatus validate_json_with_schema_file(const nlohmann::json& doc,
                                                const std::filesystem::path& schema_path) {
    std::ifstream in(schema_path);
    if (!in) {
        return {false, "Cannot open schema file: " + schema_path.string()};
    }

    nlohmann::json schema_json;
    try {
        in >> schema_json;
    } catch (const std::exception& e) {
        return {false, std::string("Invalid schema JSON: ") + e.what()};
    }

    try {
        nlohmann::json_schema::json_validator validator;
        validator.set_root_schema(schema_json);
        validator.validate(doc);
    } catch (const std::exception& e) {
        return {false, std::string("Schema validation failed: ") + e.what()};
    }

    return {true, ""};
}

ValidationStatus validate_job_spec(const nlohmann::json& doc,
                                   const std::filesystem::path& schema_dir,
                                   const std::filesystem::path& workspace_root) {
    auto schema_res = validate_json_with_schema_file(doc, schema_dir / "job_spec.schema.json");
    if (!schema_res.ok) return schema_res;

    std::string job_id = doc.at("job_id").get<std::string>();
    if (!is_safe_job_id(job_id)) {
        return {false, "Unsafe job_id: " + job_id};
    }

    std::string out_dir = doc.at("output_dir").get<std::string>();
    auto out_res = validate_contained_path(workspace_root, out_dir);
    if (!out_res.ok) return out_res;

    for (const auto& ref : doc.at("input_refs")) {
        auto ref_res = validate_contained_path(workspace_root, ref.get<std::string>());
        if (!ref_res.ok) return ref_res;
    }

    return {true, ""};
}

ValidationStatus validate_job_result(const nlohmann::json& doc,
                                     const std::filesystem::path& schema_dir) {
    return validate_json_with_schema_file(doc, schema_dir / "job_result.schema.json");
}

} // namespace forge3d::jobs
