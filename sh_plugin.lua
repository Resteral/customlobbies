local PLUGIN = PLUGIN or {}
PLUGIN.name = "Helix PERP x FiveM Gamemode Experience"
PLUGIN.author = "HelixGame"
PLUGIN.description = "Ultimate hybrid of Garry's Mod PERP roleplay progression (skills, crafting workbenches, botany, property burglary) and FiveM immersive systems (target eye interaction, glassmorphic HUD, quick radial wheel, vehicle engine & trunk inventory, and police MDT / CAD dispatch)."

-- Include Core Shared Modules
ix.util.Include("sh_perp_skills.lua")
ix.util.Include("sh_perp_crafting.lua")
ix.util.Include("sh_perp_mdt.lua")
ix.util.Include("sh_perp_custom_systems.lua")

-- Include Server Modules
ix.util.Include("sv_plugin.lua")
ix.util.Include("sv_perp_skills.lua")
ix.util.Include("sv_perp_crafting.lua")
ix.util.Include("sv_perp_mdt.lua")
ix.util.Include("sv_fivem_vehicles.lua")
ix.util.Include("sv_perp_custom_systems.lua")

-- Include Client Modules & Derma UIs
ix.util.Include("cl_plugin.lua")
ix.util.Include("cl_fivem_hud.lua")
ix.util.Include("cl_fivem_target.lua")
ix.util.Include("cl_fivem_vehicles.lua")
ix.util.Include("cl_perp_mdt.lua")
ix.util.Include("cl_perp_custom_systems.lua")
ix.util.Include("derma/cl_skills_ui.lua")
ix.util.Include("derma/cl_crafting_ui.lua")
ix.util.Include("derma/cl_fivem_radial.lua")
ix.util.Include("derma/cl_lockpick_minigame.lua")
ix.util.Include("derma/cl_police_mdt.lua")
ix.util.Include("derma/cl_station_ui.lua")
ix.util.Include("derma/cl_system_editor.lua")

-- Plugin Configurations
ix.config.Add("enableFiveMHUD", true, "Enable the modern FiveM glassmorphic HUD and compass.", nil, {
    category = "FiveM x PERP System"
})

ix.config.Add("enableFiveMTarget", true, "Enable the FiveM ox_target style eye interaction system.", nil, {
    category = "FiveM x PERP System"
})

ix.config.Add("enableFiveMRadial", true, "Enable the FiveM contextual radial wheel menu (Key: C).", nil, {
    category = "FiveM x PERP System"
})

ix.config.Add("minPoliceForHeist", 2, "Minimum online police required to initiate major heists.", nil, {
    data = {min = 0, max = 20},
    category = "Helix Crime System"
})

ix.config.Add("heistCooldown", 600, "Global cooldown (seconds) between vault heists.", nil, {
    data = {min = 30, max = 3600},
    category = "Helix Crime System"
})

ix.config.Add("weedGrowthMultiplier", 1.0, "Multiplier for weed plant growth speed.", nil, {
    data = {min = 0.1, max = 5.0, decimals = 1},
    category = "Helix Crime System"
})

ix.config.Add("policeFactionName", "Civil Protection", "Name of the police faction for heist and 911 dispatch alerts.", nil, {
    category = "Helix Crime System"
})

-- Dynamic Drug Market Base Prices
PLUGIN.marketPrices = PLUGIN.marketPrices or {
    ["weed_bag"] = { base = 150, current = 150, min = 80, max = 300 },
    ["meth_bag"] = { base = 350, current = 350, min = 200, max = 700 },
    ["cocaine_brick"] = { base = 600, current = 600, min = 350, max = 1200 }
}

-- Meshy AI Custom Model Path Definitions with Fallback Support
PLUGIN.models = {
    ["weed_pot"] = "models/helixgame/meshy_weed_pot.mdl",
    ["weed_box"] = "models/helixgame/meshy_weed_box.mdl",
    ["crypto_farm"] = "models/helixgame/meshy_crypto_farm.mdl",
    ["crypto_usb"] = "models/helixgame/meshy_crypto_usb.mdl",
    ["meth_lab"] = "models/helixgame/meshy_meth_lab.mdl",
    ["bank_vault"] = "models/helixgame/meshy_bank_vault.mdl",
    ["drillable_safe"] = "models/helixgame/meshy_drillable_safe.mdl",
    ["thermal_drill"] = "models/helixgame/meshy_thermal_drill.mdl",
    ["hack_terminal"] = "models/helixgame/meshy_hack_terminal.mdl",
    ["blackmarket_npc"] = "models/helixgame/meshy_blackmarket_dealer.mdl",
    ["loot_bag"] = "models/helixgame/meshy_loot_bag.mdl"
}

function PLUGIN:GetAssetModel(key, defaultModel)
    local customPath = PLUGIN.models[key]
    if customPath and util.IsValidModel(customPath) then
        return customPath
    end
    return defaultModel
end

-- Network strings initialization helper
if SERVER then
    util.AddNetworkString("ixHeistStartMinigame")
    util.AddNetworkString("ixHeistMinigameResult")
    util.AddNetworkString("ixPoliceAlert")
    util.AddNetworkString("ixOpenBlackMarketUI")
    util.AddNetworkString("ixBlackMarketTransaction")
    util.AddNetworkString("ixDrugLabInteract")
    util.AddNetworkString("ixDrugLabCookAction")
    util.AddNetworkString("ixVaultKeypadOpen")
    util.AddNetworkString("ixVaultKeypadSubmit")
end
