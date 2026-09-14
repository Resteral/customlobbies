Config = {}

-- Framework Choice: 'qbox', 'qbcore', 'esx', or 'standalone'
Config.Framework = 'qbox' 

-- General Settings
Config.SoundEnabled = true
Config.ScreenBlur = true
Config.AllowEscapeCancel = true

-- Preset Recipes configured with QBox / ox_inventory items
Config.Recipes = {
    ["meth"] = {
        label = "Crystal Meth Synthesis",
        subtitle = "Maintain precise reactor temperature & vent pressure while dosing precursor chemicals.",
        duration = 30, -- Duration in seconds
        
        -- QBox Item Requirements (Checked & Removed on Start if Config.Framework == 'qbox')
        requiredItems = {
            { item = "pseudoephedrine", amount = 2, label = "Pseudoephedrine Liquid" },
            { item = "red_phosphorus",  amount = 1, label = "Red Phosphorus Powder" },
            { item = "acetone",         amount = 1, label = "Anhydrous Acetone" }
        },

        -- QBox Rewards (Given based on grade & purity yield multiplier)
        rewardItem = "meth_baggy",
        baseRewardAmount = 5,
        failRewardItem = "meth_sludge", -- Received on low grade / failed synthesis
        
        -- Temperature Mechanics (°C)
        startTemp = 90,
        targetTemp = 180,
        tempTolerance = 20,
        heatRate = 3.5,
        coolRate = 2.8,
        tempDrift = 0.5,
        
        -- Pressure Mechanics (PSI)
        startPressure = 15,
        targetPressure = 40,
        pressureTolerance = 15,
        pressureBuildRate = 3.2,
        maxPressure = 100,
        ventPower = 18.0,
        
        -- Reagents Dosing Checklist during NUI Minigame
        reagents = {
            { id = "pseudo", label = "Pseudoephedrine Liquid", timeTrigger = 5, required = true },
            { id = "phos",   label = "Red Phosphorus Powder",  timeTrigger = 14, required = true },
            { id = "solv",   label = "Anhydrous Solvent",      timeTrigger = 22, required = true }
        },
        
        -- Failure Consequences
        explosionOnFail = true,
        explosionDamage = 45,
        
        -- Animation & FX
        animDict = "anim@amb@business@meth@meth_smash_react@",
        animName = "press_button",
        screenEffect = "FocusIn"
    },

    ["cocaine"] = {
        label = "Cocaine Hydrochloride Washing",
        subtitle = "Balance chemical solvent extraction with base neutralizers.",
        duration = 25,
        
        requiredItems = {
            { item = "coca_leaf",   amount = 10, label = "Raw Coca Leaves" },
            { item = "gasoline",    amount = 1,  label = "Gasoline Can" },
            { item = "hydro_acid",  amount = 1,  label = "Hydrochloric Acid" }
        },

        rewardItem = "coke_brick",
        baseRewardAmount = 1,
        failRewardItem = "coke_waste",
        
        startTemp = 40,
        targetTemp = 110,
        tempTolerance = 15,
        heatRate = 4.0,
        coolRate = 3.5,
        tempDrift = -0.3,
        
        startPressure = 10,
        targetPressure = 35,
        pressureTolerance = 12,
        pressureBuildRate = 2.5,
        maxPressure = 90,
        ventPower = 20.0,
        
        reagents = {
            { id = "ether", label = "Diethylether Washing Solution", timeTrigger = 6, required = true },
            { id = "acid",  label = "Hydrochloric Acid Catalyst",   timeTrigger = 17, required = true }
        },
        
        explosionOnFail = false,
        animDict = "mini@repair",
        animName = "fixing_a_ped",
        screenEffect = "FocusIn"
    },

    ["weed_curing"] = {
        label = "Hydroponic Weed Curing & Refining",
        subtitle = "Regulate humidity, heat, and CO2 levels to yield 99% pure resin buds.",
        duration = 20,
        
        requiredItems = {
            { item = "raw_weed", amount = 5, label = "Uncured Cannabis Buds" }
        },

        rewardItem = "weed_skunk",
        baseRewardAmount = 5,
        failRewardItem = null,
        
        startTemp = 25,
        targetTemp = 65,
        tempTolerance = 10,
        heatRate = 3.0,
        coolRate = 2.5,
        tempDrift = 0.2,
        
        startPressure = 5,
        targetPressure = 25,
        pressureTolerance = 10,
        pressureBuildRate = 1.8,
        maxPressure = 80,
        ventPower = 15.0,
        
        reagents = {
            { id = "co2",      label = "CO2 Flush Injector",    timeTrigger = 8, required = true },
            { id = "nutrient", label = "Terpene Booster Spray", timeTrigger = 15, required = true }
        },
        
        explosionOnFail = false,
        animDict = "anim@amb@clubhouse@tutorial@bkr_tut_ig3@",
        animName = "machinic_loop_meather",
        screenEffect = "FocusIn"
    },

    ["weed_edibles"] = {
        label = "Cannabis Butter & Edibles Infusion",
        subtitle = "Decarboxylate cannabis extract at low heat and blend with organic cream & sugars.",
        duration = 25,
        
        requiredItems = {
            { item = "weed_skunk", amount = 3, label = "Cured Weed Buds" },
            { item = "butter",     amount = 1, label = "Organic Butter" },
            { item = "sugar",      amount = 2, label = "Refined Sugar" }
        },

        rewardItem = "weed_brownie",
        baseRewardAmount = 4,
        failRewardItem = nil,
        
        startTemp = 30,
        targetTemp = 105,
        tempTolerance = 12,
        heatRate = 3.2,
        coolRate = 2.4,
        tempDrift = 0.1,
        
        startPressure = 5,
        targetPressure = 20,
        pressureTolerance = 10,
        pressureBuildRate = 1.5,
        maxPressure = 70,
        ventPower = 16.0,
        
        reagents = {
            { id = "lecithin", label = "Lecithin Emulsifier",  timeTrigger = 7, required = true },
            { id = "vanilla",  label = "Pure Vanilla Extract", timeTrigger = 16, required = true }
        },
        
        explosionOnFail = false,
        animDict = "mini@repair",
        animName = "fixing_a_ped",
        screenEffect = "FocusIn"
    },

    ["cannabis_icecream"] = {
        label = "Mint THC Ice Cream Batching",
        subtitle = "Infuse churned heavy cream with THC distillate and flash-freeze into cones.",
        duration = 22,
        
        requiredItems = {
            { item = "weed_skunk", amount = 2, label = "Cured Weed Buds" },
            { item = "milk",       amount = 2, label = "Whole Milk" },
            { item = "sugar",      amount = 1, label = "Refined Sugar" }
        },

        rewardItem = "weed_icecream",
        baseRewardAmount = 4,
        failRewardItem = nil,
        
        startTemp = 20,
        targetTemp = 50,
        tempTolerance = 8,
        heatRate = 2.8,
        coolRate = 3.0,
        tempDrift = -0.2,
        
        startPressure = 5,
        targetPressure = 15,
        pressureTolerance = 8,
        pressureBuildRate = 1.2,
        maxPressure = 60,
        ventPower = 18.0,
        
        reagents = {
            { id = "mint",  label = "Organic Mint Extract",  timeTrigger = 6, required = true },
            { id = "syrup", label = "Agave Sweetener Syrup", timeTrigger = 14, required = true }
        },
        
        explosionOnFail = false,
        animDict = "mini@repair",
        animName = "fixing_a_ped",
        screenEffect = "FocusIn"
    }
}

-- Grade thresholds based on Purity Percentage (0 - 100%)
Config.GradeThresholds = {
    { minPurity = 95, grade = "S+", label = "Masterpiece Pure Batch", yieldMultiplier = 1.5 },
    { minPurity = 85, grade = "A",  label = "High Grade Batch",      yieldMultiplier = 1.2 },
    { minPurity = 70, grade = "B",  label = "Standard Street Grade", yieldMultiplier = 1.0 },
    { minPurity = 50, grade = "C",  label = "Impure Cut Product",    yieldMultiplier = 0.7 },
    { minPurity = 0,  grade = "F",  label = "Ruined Batch / Failed", yieldMultiplier = 0.0 }
}
