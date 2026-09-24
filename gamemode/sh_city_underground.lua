--[[
    City Underground - Master Gamemode Loader
    Multiplayer Open-World Roleplay Experience for HELIX Studio
    Architecture: Shared / Server / Client Modular Systems
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Version = "1.4.0"
CityUnderground.District = "New Harbor Metro"
CityUnderground.Config = CityUnderground.Config or {}

local isServer = SERVER or (ix and SERVER) or (net and net.Receive and true)
local isClient = CLIENT or (ix and CLIENT)

-- Utility Include Helper
local function SafeInclude(filepath)
    if ix and ix.util and ix.util.Include then
        ix.util.Include(filepath)
    else
        include(filepath)
    end
end

-- Core Systems Loading Order
local sharedSystems = {
    "gamemode/systems/sh_persistence_system.lua",
    "gamemode/systems/sh_character_system.lua",
    "gamemode/systems/sh_economy_system.lua",
    "gamemode/systems/sh_inventory_system.lua",
    "gamemode/systems/sh_interaction_system.lua",
    "gamemode/systems/sh_job_system.lua",
    "gamemode/systems/sh_crime_system.lua",
    "gamemode/systems/sh_skills_system.lua",
    "gamemode/systems/sh_botany_system.lua",
    "gamemode/systems/sh_map_spawner.lua",
    "gamemode/systems/sh_base_builder_system.lua",
    "gamemode/systems/sh_cctv_system.lua",
    "gamemode/systems/sh_lock_system.lua",
    "gamemode/systems/sh_police_system.lua",
    "gamemode/systems/sh_vehicle_system.lua",
    "gamemode/systems/sh_property_system.lua",
    "gamemode/systems/sh_communication_system.lua",
    "gamemode/systems/sh_admin_system.lua"
}

local serverSystems = {
    "gamemode/systems/sv_persistence_system.lua",
    "gamemode/systems/sv_character_system.lua",
    "gamemode/systems/sv_economy_system.lua",
    "gamemode/systems/sv_inventory_system.lua",
    "gamemode/systems/sv_job_system.lua",
    "gamemode/systems/sv_crime_system.lua",
    "gamemode/systems/sv_skills_system.lua",
    "gamemode/systems/sv_botany_system.lua",
    "gamemode/systems/sv_map_spawner.lua",
    "gamemode/systems/sv_base_builder_system.lua",
    "gamemode/systems/sv_cctv_system.lua",
    "gamemode/systems/sv_lock_system.lua",
    "gamemode/systems/sv_police_system.lua",
    "gamemode/systems/sv_vehicle_system.lua",
    "gamemode/systems/sv_property_system.lua",
    "gamemode/systems/sv_communication_system.lua",
    "gamemode/systems/sv_admin_system.lua"
}

local clientSystems = {
    "gamemode/systems/cl_character_system.lua",
    "gamemode/systems/cl_economy_system.lua",
    "gamemode/systems/cl_inventory_system.lua",
    "gamemode/systems/cl_interaction_system.lua",
    "gamemode/systems/cl_job_system.lua",
    "gamemode/systems/cl_crime_system.lua",
    "gamemode/systems/cl_skills_system.lua",
    "gamemode/systems/cl_botany_system.lua",
    "gamemode/systems/cl_map_spawner.lua",
    "gamemode/systems/cl_base_builder_system.lua",
    "gamemode/systems/cl_cctv_system.lua",
    "gamemode/systems/cl_lock_system.lua",
    "gamemode/systems/cl_police_system.lua",
    "gamemode/systems/cl_vehicle_system.lua",
    "gamemode/systems/cl_property_system.lua",
    "gamemode/systems/cl_communication_system.lua",
    "gamemode/systems/cl_admin_system.lua"
}

-- Load Shared Modules
for _, file in ipairs(sharedSystems) do
    if file_exists or file then
        pcall(SafeInclude, file)
    end
end

-- Load Server Modules
if isServer then
    for _, file in ipairs(serverSystems) do
        pcall(SafeInclude, file)
    end
end

-- Load Client Modules
if isClient then
    for _, file in ipairs(clientSystems) do
        pcall(SafeInclude, file)
    end
end

print("[CityUnderground] Gamemode loaded successfully (v" .. CityUnderground.Version .. ") for district " .. CityUnderground.District)
