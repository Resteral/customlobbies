Config = {}

-- Debug mode for console prints and zone debug polys
Config.Debug = false

-- Smelting Foundries & Furnaces around San Andreas
Config.Furnaces = {
    ['ls_industrial'] = {
        label = "Los Santos Industrial Smelter",
        coords = vec3(1088.35, -2002.12, 31.42),
        heading = 320.0,
        radius = 2.0,
        blip = {
            sprite = 643,
            color = 47,
            scale = 0.8,
            label = "Industrial Foundry"
        },
        type = 'industrial', -- 'industrial', 'forge', 'illegal'
        maxTemperature = 1800, -- Maximum heat in Celsius
        fuelEfficiency = 1.2,  -- 20% slower fuel consumption
        allowedCategories = { 'ores', 'alloys', 'scrap', 'jewelry' }
    },
    ['sandy_scrapyard'] = {
        label = "Sandy Shores Scrap Forge",
        coords = vec3(2341.22, 3127.84, 48.21),
        heading = 270.0,
        radius = 2.0,
        blip = {
            sprite = 643,
            color = 17,
            scale = 0.8,
            label = "Scrap Metal Forge"
        },
        type = 'forge',
        maxTemperature = 1400,
        fuelEfficiency = 1.0,
        allowedCategories = { 'ores', 'scrap', 'alloys' }
    },
    ['paleto_mine_smelter'] = {
        label = "Mount Chiliad Mine Foundry",
        coords = vec3(-596.11, 2090.87, 131.41),
        heading = 15.0,
        radius = 2.0,
        blip = {
            sprite = 643,
            color = 5,
            scale = 0.8,
            label = "Mining Smelting Plant"
        },
        type = 'industrial',
        maxTemperature = 1600,
        fuelEfficiency = 1.1,
        allowedCategories = { 'ores', 'alloys' }
    },
    ['illegal_backalley_crucible'] = {
        label = "Underground Crucible",
        coords = vec3(484.22, -1310.89, 29.2),
        heading = 120.0,
        radius = 1.5,
        blip = nil, -- Hidden black market smelter (no public map blip)
        type = 'illegal',
        maxTemperature = 1500,
        fuelEfficiency = 0.9,
        allowedCategories = { 'jewelry', 'scrap', 'alloys' }
    }
}

-- Fuel sources recognized by furnaces
Config.Fuels = {
    ['coal'] = {
        label = "Lump Coal",
        heatAdded = 350,       -- degrees C added per unit
        burnTime = 60,         -- seconds of continuous burn
        icon = "fas fa-cube"
    },
    ['charcoal'] = {
        label = "Hardwood Charcoal",
        heatAdded = 250,
        burnTime = 45,
        icon = "fas fa-fire-burner"
    },
    ['wood_plank'] = {
        label = "Scrap Wood",
        heatAdded = 150,
        burnTime = 25,
        icon = "fas fa-tree"
    },
    ['propane_canister'] = {
        label = "Propane Gas Canister",
        heatAdded = 600,
        burnTime = 90,
        icon = "fas fa-gas-pump"
    }
}

-- Temperature physics
Config.AmbientTemp = 25       -- Ambient room temperature in Celsius
Config.CoolingRate = 12       -- Degrees C cooled per second when no active fuel
Config.HeatUpRate = 18        -- Degrees C heated per second when burning fuel

-- Minigame Settings (Optional ox_lib skillcheck during precision smelting)
Config.UseMinigame = true
Config.MinigameDifficulty = { 'easy', 'medium' } -- Sequence of ox_lib skill checks

-- Visuals & Particles
Config.Particles = {
    dict = "core",
    smoke = "exp_grd_grenade_smoke",
    flame = "fire_wrecked_plane_cockpit",
    moltenSparks = "sparks_drill"
}

-- Animation Settings
Config.SmeltAnim = {
    dict = "anim@amb@machinery@gear_lever@",
    anim = "base",
    flag = 49
}
