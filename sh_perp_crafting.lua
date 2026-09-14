-- PERP Crafting Recipes Registry for Helix
local PLUGIN = PLUGIN

PLUGIN.CraftingRecipes = PLUGIN.CraftingRecipes or {}

PLUGIN.CraftingRecipes = {
    -- Tools & Burglary
    ["lockpick"] = {
        name = "Bobby Pin Lockpick",
        desc = "A hardened steel lockpick set used for bypassing doors and vehicle ignitions.",
        category = "Tools & Burglary",
        result = "lockpick",
        amount = 1,
        craftTime = 4,
        reqSkills = { crafting = 1 },
        ingredients = {
            ["scrap_metal"] = 2
        },
        xp = { skill = "crafting", amount = 25 }
    },
    ["hacking_device"] = {
        name = "Cyber Bypass Deck",
        desc = "Portable hacking device with terminal interface for hacking security consoles.",
        category = "Tools & Burglary",
        result = "hacking_device",
        amount = 1,
        craftTime = 8,
        reqSkills = { crafting = 4 },
        ingredients = {
            ["crypto_usb"] = 1,
            ["scrap_metal"] = 3
        },
        xp = { skill = "crafting", amount = 60 }
    },
    ["thermal_drill"] = {
        name = "Industrial Thermal Drill",
        desc = "Heavy-duty thermal safe drill capable of melting bank vaults and steel safes.",
        category = "Tools & Burglary",
        result = "thermal_drill",
        amount = 1,
        craftTime = 12,
        reqSkills = { crafting = 6 },
        ingredients = {
            ["scrap_metal"] = 6,
            ["meth_chemicals"] = 2
        },
        xp = { skill = "crafting", amount = 100 }
    },
    ["thermite"] = {
        name = "Military Thermite Charge",
        desc = "High-heat pyrotechnic mixture for burning through vault hinges and locks.",
        category = "Tools & Burglary",
        result = "thermite",
        amount = 1,
        craftTime = 6,
        reqSkills = { chemistry = 4, crafting = 2 },
        ingredients = {
            ["meth_chemicals"] = 3
        },
        xp = { skill = "chemistry", amount = 50 }
    },

    -- Vehicle & Maintenance
    ["repair_kit"] = {
        name = "Advanced Vehicle Repair Kit",
        desc = "Complete toolkit with wrenches, spark plugs, and sealants to repair vehicle engines.",
        category = "Vehicle & Mechanics",
        result = "repair_kit",
        amount = 1,
        craftTime = 5,
        reqSkills = { crafting = 2, driving = 1 },
        ingredients = {
            ["scrap_metal"] = 4
        },
        xp = { skill = "crafting", amount = 35 }
    },
    ["jerry_can"] = {
        name = "Fuel Jerry Can (Full)",
        desc = "20L metal jerry can filled with premium gasoline for vehicle refueling.",
        category = "Vehicle & Mechanics",
        result = "jerry_can",
        amount = 1,
        craftTime = 4,
        reqSkills = { crafting = 1 },
        ingredients = {
            ["scrap_metal"] = 2,
            ["meth_chemicals"] = 1
        },
        xp = { skill = "crafting", amount = 25 }
    },
    ["car_keyfob"] = {
        name = "Vehicle Remote Key Fob",
        desc = "Encrypted digital key fob for remote locking, unlocking, and alarm toggle.",
        category = "Vehicle & Mechanics",
        result = "car_keyfob",
        amount = 1,
        craftTime = 6,
        reqSkills = { crafting = 3 },
        ingredients = {
            ["crypto_usb"] = 1,
            ["scrap_metal"] = 2
        },
        xp = { skill = "crafting", amount = 45 }
    },

    -- Botany & Agriculture
    ["fertilizer"] = {
        name = "Bio-Nutrient Fertilizer",
        desc = "High-potency organic fertilizer that accelerates plant growth by 50% and boosts quality.",
        category = "Botany & Agriculture",
        result = "fertilizer",
        amount = 2,
        craftTime = 4,
        reqSkills = { chemistry = 2 },
        ingredients = {
            ["meth_chemicals"] = 1
        },
        xp = { skill = "chemistry", amount = 30 }
    },
    ["grow_lamp"] = {
        name = "UV Hydroponic Grow Lamp",
        desc = "High-output ultraviolet growth lamp that optimizes photosynthesis for indoor weed pots.",
        category = "Botany & Agriculture",
        result = "grow_lamp",
        amount = 1,
        craftTime = 6,
        reqSkills = { crafting = 3 },
        ingredients = {
            ["scrap_metal"] = 3
        },
        xp = { skill = "crafting", amount = 40 }
    },

    -- Construction & Barricades
    ["brick_wall"] = {
        name = "Reinforced Brick Wall",
        desc = "Solid defensive brick wall for fortifying properties and blocking entryways.",
        category = "Construction",
        result = "brick_wall",
        amount = 1,
        craftTime = 5,
        reqSkills = { crafting = 1 },
        ingredients = {
            ["scrap_metal"] = 2
        },
        xp = { skill = "crafting", amount = 20 }
    },
    ["brick_counter"] = {
        name = "Modular Shop Counter",
        desc = "Commercial countertop partition for shopkeepers and dispensary desks.",
        category = "Construction",
        result = "brick_counter",
        amount = 1,
        craftTime = 5,
        reqSkills = { crafting = 1 },
        ingredients = {
            ["scrap_metal"] = 2
        },
        xp = { skill = "crafting", amount = 20 }
    },
    ["security_grate"] = {
        name = "Steel Security Grate",
        desc = "Heavy-duty steel window barrier offering high ballistic and explosion resistance.",
        category = "Construction",
        result = "security_grate",
        amount = 1,
        craftTime = 6,
        reqSkills = { crafting = 3 },
        ingredients = {
            ["scrap_metal"] = 4
        },
        xp = { skill = "crafting", amount = 35 }
    }
}
