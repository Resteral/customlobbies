Config = {}

-- Framework Settings: 'auto' (detects qbx_core, qb-core, or es_extended), 'qbox', 'qbcore', 'esx', or 'standalone'
Config.Framework = 'auto'

-- Inventory System: 'ox_inventory', 'qb-inventory', 'esx', or 'auto'
Config.Inventory = 'ox_inventory'

-- Target Interaction System: 'ox_target', 'qb-target', or '3dtext'
Config.Target = 'ox_target'

-- Police Dispatch Integration: 'ps-dispatch', 'cd_dispatch', 'qbx_dispatch', 'qb-dispatch', or 'default'
Config.Dispatch = 'ps-dispatch'

-- Vehicle Models for the Weed & Ice Cream Truck
Config.TruckModel = 'weedtruck' -- Dedicated drug van with custom livery (also supports 'mrtasty', 'boxville4', etc.)
Config.TruckModels = { 'weedtruck', 'mrtasty', 'boxville', 'boxville2', 'boxville3', 'boxville4', 'taco', 'speedo', 'burrito' }

-- Dedicated Single Livery Enforcement (Locks car to ONLY this livery)
Config.ForceSingleLiveryOnly = true
Config.LockedLiveryIndex = 0
Config.EnableAllExtras = true
Config.AutoCleanOnSpawn = true
Config.VehicleColors = { primary = 111, secondary = 111 } -- Clean gloss cream / pearl white to showcase custom livery graphics

-- Minimum online police required to start selling weed from truck (0 = no requirement)
Config.MinCops = 0

-- Police Alert Chance (%) per NPC Weed Sale (0% for regular ice cream sales)
Config.CopAlertChance = 15

-- Interval in milliseconds between NPC buyers approaching the truck when selling mode is active
Config.NPCSellInterval = 10000

-- Maximum stock capacity per item in the truck freezer
Config.MaxStockPerItem = 100

-- Audio Jingle Settings
Config.JingleType = 'native'
Config.CustomSoundFile = 'jingle.ogg'
Config.JingleVolume = 0.6
Config.JingleRadius = 40.0

-- ==============================================================================
-- CATALOG OF PRODUCTS & DRUG DOSSIER METADATA
-- ==============================================================================
Config.Items = {
    -- ==========================================
    -- 1. REAL CLASSIC ICE CREAM PARLOR
    -- ==========================================
    ['vanilla_cone'] = {
        label = "Vanilla Soft Serve",
        category = "icecream",
        type = "Soft-Serve Cone",
        description = "Creamy, classic Madagascar vanilla soft serve in a crisp waffle cone.",
        price = 6,
        defaultStock = 40,
        potency = "100% Organic Cream",
        potencyPct = 15,
        strain = "Classic Creamery",
        effects = { "Hunger +25", "Thirst +25", "Health +5" },
        buff = "refresh",
        icon = "🍦",
        color = "#fef08a",
        prop = "prop_ice_cream"
    },
    ['chocolate_gelato'] = {
        label = "Double Chocolate Gelato",
        category = "icecream",
        type = "Italian Gelato",
        description = "Rich dark chocolate Italian gelato topped with chocolate fudge chips.",
        price = 8,
        defaultStock = 30,
        potency = "High Sugar Rush",
        potencyPct = 35,
        strain = "Dark Cocoa 85%",
        effects = { "Sprint Stamina Surge", "Hunger +30", "Health +10" },
        buff = "sugar_rush",
        icon = "🍨",
        color = "#78350f",
        prop = "prop_ice_cream"
    },
    ['strawberry_sundae'] = {
        label = "Strawberry Sundae",
        category = "icecream",
        type = "Layered Sundae",
        description = "Chilled strawberry gelato layered with whipped cream, syrup, and a cherry.",
        price = 9,
        defaultStock = 25,
        potency = "Vitamin C Rich",
        potencyPct = 20,
        strain = "California Berry",
        effects = { "Hunger +35", "Thirst +30", "Health +12" },
        buff = "refresh",
        icon = "🍧",
        color = "#f43f5e",
        prop = "prop_ice_cream"
    },
    ['rocket_pop'] = {
        label = "Rocket Ice Pop",
        category = "icecream",
        type = "Tri-Flavor Pop",
        description = "Cherry, lime, and blue raspberry tri-flavored rocket pop.",
        price = 5,
        defaultStock = 50,
        potency = "Brain Freeze Risk",
        potencyPct = 40,
        strain = "Tri-Citrus Blast",
        effects = { "Thirst +45", "Instant Cool Down", "Screen Freeze Shake" },
        buff = "brain_freeze",
        icon = "🚀",
        color = "#38bdf8",
        prop = "prop_ice_cream"
    },
    ['rainbow_sorbet'] = {
        label = "Rainbow Sorbet",
        category = "icecream",
        type = "Dairy-Free Sorbet",
        description = "Refreshing tropical citrus sorbet delivering instant stamina restoration.",
        price = 7,
        defaultStock = 35,
        potency = "Electrolyte Boost",
        potencyPct = 25,
        strain = "Tropical Zest",
        effects = { "Hunger +20", "Thirst +40", "Health +8" },
        buff = "refresh",
        icon = "🌈",
        color = "#a855f7",
        prop = "prop_ice_cream"
    },

    -- ==========================================
    -- 2. UNDERGROUND CANNABIS & INFUSED EDIBLES
    -- ==========================================
    ['weed_baggy'] = {
        label = "OG Kush Baggie (1g)",
        category = "weed",
        type = "Dried Flower",
        description = "Hand-trimmed, sticky indoor cannabis colas cured with dense trichomes.",
        price = 110,
        defaultStock = 25,
        potency = "THC: 28.5% • Grade: A+",
        potencyPct = 80,
        strain = "OG Kush (Indica Dominant)",
        effects = { "Stress Relief -50%", "Euphoric Body High", "Munchies Appetite" },
        highDuration = 60,
        isWeed = true,
        icon = "🌿",
        color = "#7cff4d",
        prop = "bkr_prop_weed_bag_01a"
    },
    ['weed_joint'] = {
        label = "King-Size Pre-Roll",
        category = "weed",
        type = "Pre-Rolled Cone",
        description = "Tightly rolled king-size raw unbleached cone packed with top-shelf ground flower.",
        price = 45,
        defaultStock = 30,
        potency = "THC: 24.0% • Clean Burn",
        potencyPct = 70,
        strain = "Gelato #33 (Hybrid)",
        effects = { "Smooth Smoke", "Stress Relief -30%", "Health +10" },
        highDuration = 45,
        isWeed = true,
        icon = "🚬",
        color = "#84cc16",
        prop = "p_amb_joint_01"
    },
    ['weed_brownie'] = {
        label = "Pot Fudge Brownie",
        category = "weed",
        type = "Infused Edible",
        description = "Dark chocolate fudge brownie baked with full-spectrum cannabis rosin butter.",
        price = 85,
        defaultStock = 20,
        potency = "150mg Live Rosin THC",
        potencyPct = 90,
        strain = "Granddaddy Purple Butter",
        effects = { "Heavy Body Couchlock", "Health Regen +30", "Long 90s Duration" },
        highDuration = 90,
        isWeed = true,
        icon = "🍫",
        color = "#8e44ad",
        prop = "prop_choc_ego"
    },
    ['weed_gummies'] = {
        label = "THC Sour Gummy Bears",
        category = "weed",
        type = "Nano-Infused Gummies",
        description = "Fast-acting sour fruit gummy bears packed with 100mg nano-emulsified THC.",
        price = 60,
        defaultStock = 25,
        potency = "100mg Nano-THC",
        potencyPct = 75,
        strain = "Blueberry Sour Diesel",
        effects = { "Fast 5s Onset", "Visual Vibrancy", "Health +15" },
        highDuration = 55,
        isWeed = true,
        icon = "🍬",
        color = "#ec4899",
        prop = "prop_candy_p"
    },
    ['weed_icecream'] = {
        label = "Mint Cannabis Cone",
        category = "weed",
        type = "Infused Frozen Treat",
        description = "Chilled mint ice cream churned with liquid THC distillate and chocolate chips.",
        price = 70,
        defaultStock = 20,
        potency = "120mg Distillate",
        potencyPct = 85,
        strain = "Thin Mint GSC",
        effects = { "Brain Refresh & High", "Hunger +10", "Health +20" },
        highDuration = 60,
        isWeed = true,
        icon = "🍦",
        color = "#10b981",
        prop = "prop_ice_cream"
    },

    -- ==========================================
    -- 3. HARD ILLICIT STREET PRODUCTS (TODAY'S MENU)
    -- ==========================================
    ['coke_brick'] = {
        label = "Pure Cocaine Brick (500g)",
        category = "hard_drugs",
        type = "Compressed Block",
        description = "High-purity stamped fishscale cocaine brick direct from South American shipments.",
        price = 1400,
        defaultStock = 5,
        potency = "Purity: 94% Fishscale Flake",
        potencyPct = 95,
        strain = "Bolivian Uncut",
        effects = { "Infinite Sprint Stamina", "Armor Shield +50", "Extreme Hyperfocus" },
        highDuration = 80,
        isHardDrug = true,
        icon = "📦",
        color = "#e2e8f0",
        prop = "bkr_prop_coke_cutblock_01"
    },
    ['coke_baggy'] = {
        label = "Cocaine Gram Baggy",
        category = "hard_drugs",
        type = "Street Snort Cut",
        description = "Single gram baggie of finely crushed powder cocaine for quick street consumption.",
        price = 140,
        defaultStock = 20,
        potency = "Purity: 85% Street Grade",
        potencyPct = 85,
        strain = "Peruvian White",
        effects = { "Adrenaline Rush", "Stamina Boost +100%", "Armor +20" },
        highDuration = 45,
        isHardDrug = true,
        icon = "💎",
        color = "#f8fafc",
        prop = "bkr_prop_coke_cutblock_01"
    },
    ['meth_baggy'] = {
        label = "Crystal Meth Shards",
        category = "hard_drugs",
        type = "Crystalline Glass",
        description = "Smokable high-potency translucent blue glass crystal shards synthesized in RV labs.",
        price = 135,
        defaultStock = 18,
        potency = "Purity: 98% Chem Grade",
        potencyPct = 98,
        strain = "Blue Sky Glass",
        effects = { "Total Fatigue Immunity", "Heartrate Surge", "Speed +40%" },
        highDuration = 70,
        isHardDrug = true,
        icon = "🧊",
        color = "#38bdf8",
        prop = "bkr_prop_meth_bag01a"
    },
    ['perc_pill'] = {
        label = "Pharma Percocet (30mg)",
        category = "hard_drugs",
        type = "Prescription Opiate",
        description = "Sealed pharmacy grade blue M30 oxycodone tablets with rapid pain suppression.",
        price = 50,
        defaultStock = 30,
        potency = "Oxycodone 30mg / APAP",
        potencyPct = 85,
        strain = "Pharma Grade Press",
        effects = { "Instant Health +40", "Pain Resistance 50%", "Sedative Wave" },
        highDuration = 50,
        isHardDrug = true,
        icon = "💊",
        color = "#60a5fa",
        prop = "prop_candy_p"
    },
    ['magic_shrooms'] = {
        label = "Golden Teacher Shrooms",
        category = "hard_drugs",
        type = "Psilocybin Fungi",
        description = "Dried organic psilocybin mushroom caps inducing vivid geometric hallucinations.",
        price = 75,
        defaultStock = 15,
        potency = "Psilocin: 3.5g Dose",
        potencyPct = 90,
        strain = "Psilocybe Cubensis",
        effects = { "Psychedelic Color Shift", "Sound Resonance", "Spirit Awakening" },
        highDuration = 90,
        isHardDrug = true,
        icon = "🍄",
        color = "#d97706",
        prop = "prop_candy_p"
    }
}

-- ==========================================
-- 4. WHOLESALE DRUG BUYBACK (SELL TO WEED MAN)
-- ==========================================
Config.WholesaleBuyback = {
    ['raw_weed'] = {
        label = "Raw Uncured Weed",
        type = "Fresh Harvest",
        payout = 45,
        icon = "🌿",
        color = "#84cc16",
        description = "Freshly harvested sticky raw cannabis colas."
    },
    ['weed_skunk'] = {
        label = "Cured Skunk Buds",
        type = "Cured Flower",
        payout = 70,
        icon = "🍃",
        color = "#7cff4d",
        description = "Cured top-grade aromatic skunk buds."
    },
    ['weed_baggy'] = {
        label = "OG Kush Baggie",
        type = "Packaged 1g",
        payout = 85,
        icon = "📦",
        color = "#22c55e",
        description = "Standard 1g dried weed baggie."
    },
    ['weed_joint'] = {
        label = "Pre-Rolled Joint",
        type = "Rolled Cone",
        payout = 30,
        icon = "🚬",
        color = "#a3e635",
        description = "King-size rolled joint."
    },
    ['weed_brownie'] = {
        label = "Pot Fudge Brownie",
        type = "Baked Rosin Edible",
        payout = 65,
        icon = "🍫",
        color = "#8e44ad",
        description = "Cannabis butter baked brownie."
    },
    ['weed_gummies'] = {
        label = "THC Gummy Bears",
        type = "Nano Gummy Pack",
        payout = 45,
        icon = "🍬",
        color = "#ec4899",
        description = "100mg nano THC gummy pack."
    },
    ['coke_brick'] = {
        label = "Cocaine Brick (500g)",
        type = "Compressed Kilogram",
        payout = 1150,
        icon = "📦",
        color = "#e2e8f0",
        description = "Pure uncut fishscale cocaine brick."
    },
    ['coke_baggy'] = {
        label = "Cocaine Gram Baggy",
        type = "Street Bag",
        payout = 95,
        icon = "💎",
        color = "#cbd5e1",
        description = "Crushed powder cocaine gram baggie."
    },
    ['meth_baggy'] = {
        label = "Crystal Meth Shards",
        type = "Glass Crystals",
        payout = 90,
        icon = "🧊",
        color = "#38bdf8",
        description = "High purity synthesized blue meth baggie."
    },
    ['magic_shrooms'] = {
        label = "Psilocybin Shrooms (3.5g)",
        type = "Dried Caps",
        payout = 55,
        icon = "🍄",
        color = "#d97706",
        description = "Bagged Golden Teacher mushroom caps."
    }
}
