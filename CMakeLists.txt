cmake_minimum_required(VERSION 3.20)
project(Forge3D VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

option(FORGE3D_BUILD_TESTS "Build Forge3D unit and integration tests" ON)

if(MSVC)
    add_compile_options(/W4 /WX-)
else()
    add_compile_options(-Wall -Wextra -Wpedantic)
endif()

include(FetchContent)

FetchContent_Declare(
    nlohmann_json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG        v3.11.3
)
FetchContent_MakeAvailable(nlohmann_json)

FetchContent_Declare(
    json_schema_validator
    GIT_REPOSITORY https://github.com/pboettch/json-schema-validator.git
    GIT_TAG        2.3.0
)
set(JSON_VALIDATOR_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(JSON_VALIDATOR_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(json_schema_validator)

# Core Geometry Engine + Exporters + Generators
add_library(forge3d_core STATIC
    core/geometry/mesh.cpp
    core/geometry/primitives.cpp
    core/mesh_operations/modelling_ops.cpp
    core/project/asset_project.cpp
    core/jobs/contract_validator.cpp
    core/jobs/job_manager.cpp
    exporters/fbx/fbx_exporter.cpp
    exporters/glb/glb_exporter.cpp
    generators/weapons/assault_rifle.cpp
    generators/buildings/modular_building.cpp
    generators/vehicles/armored_vehicle.cpp
    generators/terrain/procedural_terrain.cpp
    generators/characters/humanoid_character.cpp
)

add_executable(forge3d_cli
    cli/forge3d_cli.cpp
)
target_link_libraries(forge3d_cli PRIVATE forge3d_core)

target_include_directories(forge3d_core PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)

target_link_libraries(forge3d_core PUBLIC
    nlohmann_json::nlohmann_json
    nlohmann_json_schema_validator
)

add_executable(forge3d_job_cli
    cli/forge3d_job_cli.cpp
)
target_link_libraries(forge3d_job_cli PRIVATE forge3d_core)

if(FORGE3D_BUILD_TESTS)
    include(FetchContent)
    FetchContent_Declare(
        googletest
        GIT_REPOSITORY https://github.com/google/googletest.git
        GIT_TAG        v1.15.2
    )
    set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
    FetchContent_MakeAvailable(googletest)

    enable_testing()

    add_executable(forge3d_tests
        tests/geometry/test_core_geometry.cpp
        tests/geometry/test_modelling_ops.cpp
        tests/exporters/test_glb_exporter.cpp
        tests/jobs/test_job_manager.cpp
    )
    target_link_libraries(forge3d_tests PRIVATE
        forge3d_core
        GTest::gtest_main
    )

    include(GoogleTest)
    gtest_discover_tests(forge3d_tests
        WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    )
endif()
