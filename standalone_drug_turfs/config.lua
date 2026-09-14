Config = {}

-- Framework Settings: 'auto' (detects qbx_core, qb-core, esx, or standalone), 'qbox', 'qbcore', 'esx', 'standalone'
Config.Framework = 'auto'

-- Inventory System: 'ox_inventory', 'qb-inventory', 'esx', or 'standalone'
Config.Inventory = 'auto'

-- Police Dispatch Integration: 'ps-dispatch', 'cd_dispatch', 'qbx_dispatch', 'qb-dispatch', or 'default'
Config.Dispatch = 'ps-dispatch'

-- ==============================================================================
-- 1. TURF CAPTURE & DEFENSE SETTINGS
-- ==============================================================================
-- Default time in seconds a player/crew must stand inside the zone to capture it
Config.DefaultCaptureTime = 45

-- Radius in meters of the turf capture ring
Config.ZoneRadius = 16.0

-- How often (in seconds) the controlling crew receives passive business payouts while holding turf
Config.PassiveRewardInterval = 60

-- Time in seconds required standing on premise to gain 1 point of Protection Rep (300s = 5 minutes for 1 point!)
Config.RepGainIntervalSeconds = 300

-- Time in seconds for rivals standing on premise to drain 1 point of owner's Protection Rep
Config.RepDrainIntervalSeconds = 180

-- Multiplier bonus on drug selling prices when selling inside your crew's protected turf (e.g. 1.35 = +35% profit!)
Config.TurfBonusMultiplier = 1.35

-- Require weapon in hand to capture/protect turf?
Config.RequireArmedToCap = false

-- ==============================================================================
-- 2. BUSINESS PURCHASE & DEED ACQUISITION SETTINGS
-- ==============================================================================
-- Must have 100% Full Protection Rep to purchase the official business deed
Config.RequireFullRepToBuy = true

-- Default price to officially purchase a business deed if not specified
Config.DefaultBuyPrice = 25000

-- Max revenue multiplier when business deed is officially purchased (2.5x = +150% profit!)
Config.PurchasedRevenueMultiplier = 2.5

-- ==============================================================================
-- 3. BANK MONEY RUN & CONNECTION SETTINGS
-- ==============================================================================
-- Must deliver business revenue physically to a bank to establish an official Bank Connection
Config.RequireBankDeliveryForConnection = true

-- How long (in seconds) a bank connection remains active before needing a renewal money run (e.g. 1200s = 20 mins)
Config.BankConnectionDuration = 1200

-- Bonus payout percentage when depositing through an official bank run (+20% bonus!)
Config.BankRunBonusPercent = 20

-- Protection Rep awarded when successfully completing a bank run delivery (+15% Rep)
Config.BankRunRepAward = 15

-- Configured City Bank Dropoff & Money Laundering Vault Points
Config.BankDropoffLocations = {
    ['maze_legion'] = {
        label = "Maze Bank Branch (Legion Square)",
        coords = vec3(149.95, -1040.59, 29.37),
        blip = { sprite = 108, color = 2, label = "Bank Dropoff: Legion Maze" }
    },
    ['pacific_standard'] = {
        label = "Pacific Standard Central Vault",
        coords = vec3(253.53, 221.46, 106.28),
        blip = { sprite = 108, color = 2, label = "Bank Dropoff: Pacific Standard" }
    },
    ['sandy_fleeca'] = {
        label = "Sandy Shores Fleeca Bank",
        coords = vec3(1175.76, 2706.81, 38.09),
        blip = { sprite = 108, color = 2, label = "Bank Dropoff: Sandy Fleeca" }
    },
    ['paleto_fleeca'] = {
        label = "Paleto Bay Fleeca Vault",
        coords = vec3(-112.18, 6469.91, 31.62),
        blip = { sprite = 108, color = 2, label = "Bank Dropoff: Paleto Fleeca" }
    },
    ['hawick_bank'] = {
        label = "Hawick Commercial Bank",
        coords = vec3(314.19, -278.89, 54.17),
        blip = { sprite = 108, color = 2, label = "Bank Dropoff: Hawick Bank" }
    }
}

-- ==============================================================================
-- 4. SUPPLY CHAIN & MULTI-RUN MISSIONS
-- ==============================================================================
Config.DefaultSupplies = 100
Config.SupplyDecayPerPayout = 4 -- Each payout minute consumes 4% supplies
Config.ZeroSupplyPenaltyMultiplier = 0.4 -- If supplies empty, revenue drops by 60%
Config.FullSupplyBonusMultiplier = 1.35 -- If supplies >= 80%, revenue gets +35% boost!

-- Vehicles for Cargo Supply Runs
Config.RestockVehicles = { 'mule', 'burrito3', 'speedo' }

-- Restocking Cargo Pickup Depots
Config.RestockPickupLocations = {
    ['ls_docks'] = {
        label = "Port of LS Terminal Docks (Crate Depot)",
        coords = vec3(1199.85, -3105.74, 6.02),
        blip = { sprite = 478, color = 5, label = "Supply Depot: LS Docks" },
        rewardCash = 3000,
        rewardRep = 10
    },
    ['el_burro'] = {
        label = "El Burro Industrial Freight Yard",
        coords = vec3(1279.41, -1998.92, 42.75),
        blip = { sprite = 478, color = 5, label = "Supply Depot: El Burro" },
        rewardCash = 2800,
        rewardRep = 10
    },
    ['cypress_factory'] = {
        label = "Cypress Flats Chemical Wholesaler",
        coords = vec3(897.47, -2120.31, 30.56),
        blip = { sprite = 478, color = 5, label = "Supply Depot: Cypress Chemical" },
        rewardCash = 3200,
        rewardRep = 12
    }
}

-- VIP Contraband Smuggle Delivery Dropoffs
Config.VIPSmuggleLocations = {
    ['pacific_bluffs'] = {
        label = "Pacific Bluffs Syndicate Villa",
        coords = vec3(-1818.15, 439.46, 128.51),
        blip = { sprite = 501, color = 1, label = "VIP Buyer: Pacific Bluffs" },
        rewardCash = 11500,
        rewardRep = 25,
        timeLimit = 300 -- 5 minutes
    },
    ['observatory_helipad'] = {
        label = "Galileo Observatory Smuggler Meet",
        coords = vec3(-438.41, 1121.72, 325.86),
        blip = { sprite = 501, color = 1, label = "VIP Buyer: Galileo Helipad" },
        rewardCash = 13500,
        rewardRep = 30,
        timeLimit = 270 -- 4.5 minutes
    },
    ['vinewood_estate'] = {
        label = "Vinewood Hills Cartel Mansion",
        coords = vec3(-176.84, 883.92, 233.15),
        blip = { sprite = 501, color = 1, label = "VIP Buyer: Vinewood Hills" },
        rewardCash = 10500,
        rewardRep = 20,
        timeLimit = 300
    }
}

-- Security Defense Upgrades
Config.GuardUpgrades = {
    [1] = { name = "Street Lookout Guard", cost = 5000, desc = "1 Armed lookout standing guard at entrance" },
    [2] = { name = "Syndicate Enforcers", cost = 12000, desc = "2 Heavily armed guards with body armor" },
    [3] = { name = "Elite Black-Ops Mercenaries", cost = 25000, desc = "3 Tactical elite guards with assault rifles" }
}

-- ==============================================================================
-- 4. BUSINESS HEIST & ROBBERY SETTINGS
-- ==============================================================================
Config.EnableRobberies = true

-- Time in seconds the robber must stay inside the zone to crack the business safe
Config.RobberyDuration = 35

-- Cooldown in seconds before a business can be robbed again (default 10 mins)
Config.RobberyCooldown = 600

-- Minimum online police required to initiate a robbery (0 = no requirement)
Config.RobberyMinCops = 0

-- Require firearm/melee in hand to rob?
Config.RequireArmedToRob = true

-- Minimum and maximum cash stolen from the business safe
Config.RobberyMinCash = 3000
Config.RobberyMaxCash = 8500

-- Protection Rep penalty dealt to the owner upon successful robbery
Config.RobberyRepDamage = 40

-- Contraband bonus loot pool stolen from business safe (chance to drop)
Config.RobberyBonusLoot = { "weed_baggy", "coke_brick", "meth_baggy" }

-- ==============================================================================
-- 4. CORNER DRUG SELLING SETTINGS
-- ==============================================================================
-- Interval in milliseconds between NPC buyers approaching when corner selling is active
Config.SellInterval = 7500

-- Minimum online police required to start corner selling (0 = no requirement)
Config.MinCops = 0

-- Police Alert Chance (%) per NPC corner sale
Config.CopAlertChance = 18

-- Drug catalog with configurable min/max street prices
Config.Drugs = {
    ['weed_baggy'] = {
        label = "OG Kush Baggie",
        minPrice = 85,
        maxPrice = 135,
        icon = "🌿",
        prop = "bkr_prop_weed_bag_01a"
    },
    ['weed_joint'] = {
        label = "Pre-Rolled Joint",
        minPrice = 35,
        maxPrice = 55,
        icon = "🚬",
        prop = "p_amb_joint_01"
    },
    ['weed_brownie'] = {
        label = "Pot Brownie",
        minPrice = 70,
        maxPrice = 110,
        icon = "🍫",
        prop = "prop_choc_ego"
    },
    ['weed_gummies'] = {
        label = "THC Gummy Bears",
        minPrice = 50,
        maxPrice = 80,
        icon = "🍬",
        prop = "prop_candy_p"
    },
    ['coke_brick'] = {
        label = "Cocaine Brick",
        minPrice = 1200,
        maxPrice = 1600,
        icon = "📦",
        prop = "bkr_prop_coke_cutblock_01"
    },
    ['meth_baggy'] = {
        label = "Crystal Meth Baggy",
        minPrice = 120,
        maxPrice = 180,
        icon = "💎",
        prop = "bkr_prop_meth_bag01a"
    }
}

-- ==============================================================================
-- 6. ANTI-VANDALISM (GRAFFITI) & DATA HACKING DEFENSE
-- ==============================================================================
Config.EnableGraffitiDefense = true
Config.GraffitiTagDuration = 12       -- Seconds for rivals to spray paint/tag a property
Config.GraffitiCleanDuration = 8      -- Seconds for defenders to scrub and clean graffiti
Config.GraffitiRepDamage = 15         -- Protection Rep lost per active graffiti tag
Config.GraffitiCleanRewardRep = 10    -- Protection Rep restored upon scrubbing graffiti

Config.EnableDataHacking = true
Config.DataHackDuration = 25          -- Seconds for rivals to hack corporate data terminal
Config.DataHackRepDamage = 25         -- Rep damage from successful data breach
Config.DataTerminalRebootDuration = 12 -- Seconds to reboot and restore data terminal

-- ==============================================================================
-- 7. CONTRABAND STASH RISK & TITLE FORFEITURE (THE ONLY WAY TO LOSE DEED)
-- ==============================================================================
-- If an owner stores illicit contraband in their legitimate business stash,
-- rivals or authorities can initiate a Contraband Seizure Raid!
Config.ContrabandItems = {
    "weed_baggy", "weed_joint", "weed_brownie", "weed_gummies",
    "coke_brick", "meth_baggy", "dirty_money"
}
Config.RaidDurationSeconds = 45       -- Time required for rival/police to execute contraband raid
Config.RaidCooldownSeconds = 1800     -- 30 min cooldown between raids

-- ==============================================================================
-- 8. CORPORATE GROUP FLEET & ASSETS
-- ==============================================================================
-- Available company vehicles owners can purchase under the Business Entity
Config.CompanyFleetPresets = {
    ['speedo'] = { label = "Vapid Speedo Delivery Van", price = 12000, model = "speedo" },
    ['burrito3'] = { label = "Declasse Burrito Heavy Cargo", price = 18000, model = "burrito3" },
    ['mule'] = { label = "Maibatsu Mule Commercial Freight", price = 28000, model = "mule" },
    ['sultan'] = { label = "Karin Sultan Executive Courier", price = 35000, model = "sultan" },
    ['baller'] = { label = "Gallivanter Baller VIP Armored", price = 55000, model = "baller" }
}

-- Employee Permission Roles
Config.EmployeeRoles = {
    ['partner'] = { label = "Partner / Co-Owner", canSpendVault = true, canDispatchJobs = true, canDriveFleet = true, canHire = true },
    ['manager'] = { label = "Logistics Manager", canSpendVault = false, canDispatchJobs = true, canDriveFleet = true, canHire = false },
    ['courier'] = { label = "Delivery Courier", canSpendVault = false, canDispatchJobs = false, canDriveFleet = true, canHire = false },
    ['security'] = { label = "Premise Security", canSpendVault = false, canDispatchJobs = false, canDriveFleet = true, canHire = false }
}

-- ==============================================================================
-- 9. DISTRICT REAL ESTATE INVESTMENT & PASSIVE DIVIDEND ENGINE
-- ==============================================================================
Config.MinInvestment = 5000
Config.MaxInvestment = 200000
Config.DividendRatePercent = 8       -- 8% passive return per payout cycle on secure properties!
Config.HackedPenaltyDividend = 0     -- If the business you invested in is hacked or tagged, dividends pause!

-- ==============================================================================
-- 10. HIRING JOB BOARD, B2B IMPORT/EXPORT & DIRTY GUN RUNS
-- ==============================================================================
Config.MaxConcurrentJobsPerBusiness = 2 -- Max 2 active jobs / runs per business at a time

Config.JobTypes = {
    ['restock'] = { label = "Cargo Supply Escort", defaultPayout = 2500, icon = "📦" },
    ['patrol'] = { label = "Premise Guard Detail (5 Mins)", defaultPayout = 3000, icon = "🛡️" },
    ['clean_tag'] = { label = "Graffiti Scrubbing & Maintenance", defaultPayout = 1200, icon = "🧹" },
    ['bank_escort'] = { label = "Vault Cash Bank Deposit Escort", defaultPayout = 3500, icon = "🏦" }
}

-- High-Risk Dirty Gun Runs (Black Market Arms Shipments)
Config.DirtyGunRuns = {
    ['lsia_airfield'] = {
        label = "LSIA Freight Hangar Gun Crate Drop",
        coords = vec3(-978.12, -2998.45, 13.94),
        blip = { sprite = 110, color = 1, label = "Gun Smuggle: LSIA Hangar" },
        rewardCash = 8500,
        rewardWeapon = "WEAPON_PISTOL50",
        rewardWeaponLabel = ".50 Cal Pistol Crate",
        rewardRep = 20,
        policeAlertChance = 45
    },
    ['terminal_depot'] = {
        label = "Terminal Island Military Arms Depot",
        coords = vec3(1048.23, -3102.56, 5.90),
        blip = { sprite = 110, color = 1, label = "Gun Smuggle: Terminal Depot" },
        rewardCash = 12500,
        rewardWeapon = "WEAPON_MICROSMG",
        rewardWeaponLabel = "Micro SMG Tactical Crate",
        rewardRep = 25,
        policeAlertChance = 55
    },
    ['chumash_cove'] = {
        label = "Chumash Smuggler Cove Heavy Drop",
        coords = vec3(-3156.45, 1124.12, 20.85),
        blip = { sprite = 110, color = 1, label = "Gun Smuggle: Chumash Cove" },
        rewardCash = 16000,
        rewardWeapon = "WEAPON_COMBATPDW",
        rewardWeaponLabel = "Combat PDW Military Crate",
        rewardRep = 30,
        policeAlertChance = 70
    }
}

-- B2B Import & Export Contracts (Trade Deals Between Street Businesses)
Config.B2BTradeDeals = {
    ['dispensary_chemical'] = {
        fromZone = "forum_drive",
        toZone = "cypress_warehouse",
        label = "Cannabis Extract & Fertilizer Trade",
        payout = 4500,
        suppliesAward = 35
    },
    ['chop_salvage_auto'] = {
        fromZone = "strawberry_chop",
        toZone = "la_mesa_auto",
        label = "High-End Stolen Parts Export",
        payout = 5200,
        suppliesAward = 40
    },
    ['nightclub_liquor'] = {
        fromZone = "san_andreas_club",
        toZone = "davis_mega_mall",
        label = "Bulk Premium Spirits Wholesale",
        payout = 4800,
        suppliesAward = 30
    }
}

-- ==============================================================================
-- 11. GROUP LEVELING & SYNDICATE PERKS
-- ==============================================================================
-- As your group captures and officially buys businesses, your syndicate unlocks perks:
Config.GroupPerks = {
    [1] = { label = "Street Crew (1 Biz)", maxMembers = 6, fleetLimit = 2, wholesaleDiscount = 0 },
    [2] = { label = "Organized Syndicate (2 Biz)", maxMembers = 10, fleetLimit = 4, wholesaleDiscount = 10 },
    [3] = { label = "Commercial Cartel (3 Biz)", maxMembers = 15, fleetLimit = 6, wholesaleDiscount = 20 },
    [4] = { label = "District Empire (5+ Biz)", maxMembers = 25, fleetLimit = 10, wholesaleDiscount = 35 }
}

-- ==============================================================================
-- 12. ARMS & ITEMS CRAFTING SYSTEM & WORKBENCH RECIPES
-- ==============================================================================
Config.CraftingMaterials = {
    ['wood'] = { label = "Treated Hardwood / Lumber", icon = "fa-tree", defaultPrice = 30 },
    ['iron'] = { label = "Iron Scrap / Ingot", icon = "fa-cubes-stacked", defaultPrice = 50 },
    ['copper'] = { label = "Copper Wiring / Plate", icon = "fa-bolt", defaultPrice = 65 },
    ['plastic'] = { label = "Industrial Polymer", icon = "fa-bottle-water", defaultPrice = 40 },
    ['steel'] = { label = "Reinforced Steel", icon = "fa-shield-halved", defaultPrice = 85 },
    ['gunpowder'] = { label = "Gunpowder Compound", icon = "fa-fire-flame-curved", defaultPrice = 75 },
    ['rubber'] = { label = "Synthetic Rubber", icon = "fa-ring", defaultPrice = 35 },
    ['aluminum'] = { label = "Aircraft Aluminum", icon = "fa-layer-group", defaultPrice = 90 },
    ['electronic_kit'] = { label = "Micro-Circuitry Kit", icon = "fa-microchip", defaultPrice = 150 }
}

Config.CraftingRecipes = {
    -- === TIER 1: TOOLS & HANDGUNS ===
    ['weapon_bat'] = {
        label = "Reinforced Hardwood Baseball Bat",
        item = "WEAPON_BAT",
        type = "weapon",
        craftTime = 3,
        repRequired = 0,
        icon = "fa-baseball-bat-ball",
        category = "melee",
        materials = {
            { item = "wood", label = "Hardwood Lumber", amount = 8 },
            { item = "iron", label = "Iron Scrap", amount = 4 }
        }
    },
    ['weapon_machete'] = {
        label = "Hardwood Handle Tactical Machete",
        item = "WEAPON_MACHETE",
        type = "weapon",
        craftTime = 4,
        repRequired = 10,
        icon = "fa-hand-back-fist",
        category = "melee",
        materials = {
            { item = "wood", label = "Hardwood Lumber", amount = 6 },
            { item = "steel", label = "Reinforced Steel", amount = 8 }
        }
    },
    ['weapon_pumpshotgun'] = {
        label = "Pump Shotgun (Hardwood Stock)",
        item = "WEAPON_PUMPSHOTGUN",
        type = "weapon",
        ammo = 60,
        craftTime = 10,
        repRequired = 35,
        icon = "fa-gun",
        category = "weapons",
        materials = {
            { item = "wood", label = "Hardwood Lumber", amount = 12 },
            { item = "steel", label = "Reinforced Steel", amount = 16 },
            { item = "iron", label = "Iron Scrap", amount = 8 },
            { item = "gunpowder", label = "Gunpowder", amount = 6 }
        }
    },
    ['ammo_shotgun'] = {
        label = "12-Gauge Shotgun Shells (60 Rnds)",
        item = "ammo-shotgun",
        type = "ammo",
        amount = 60,
        craftTime = 4,
        repRequired = 20,
        icon = "fa-box-archive",
        category = "ammo",
        materials = {
            { item = "wood", label = "Hardwood Lumber", amount = 4 },
            { item = "copper", label = "Copper Wiring", amount = 8 },
            { item = "gunpowder", label = "Gunpowder", amount = 10 },
            { item = "iron", label = "Iron Scrap", amount = 4 }
        }
    },
    ['lockpick'] = {
        label = "Advanced Lockpick",
        item = "lockpick",
        type = "item",
        craftTime = 4,
        repRequired = 0,
        icon = "fa-wrench",
        category = "tools",
        materials = {
            { item = "iron", label = "Iron Scrap", amount = 5 },
            { item = "plastic", label = "Industrial Polymer", amount = 3 }
        }
    },
    ['body_armor'] = {
        label = "Heavy Tactical Kevlar Vest",
        item = "armor",
        type = "item",
        craftTime = 6,
        repRequired = 15,
        icon = "fa-shield",
        category = "gear",
        materials = {
            { item = "steel", label = "Reinforced Steel", amount = 8 },
            { item = "plastic", label = "Industrial Polymer", amount = 6 },
            { item = "rubber", label = "Synthetic Rubber", amount = 4 }
        }
    },
    ['weapon_pistol'] = {
        label = "Combat Pistol 9mm",
        item = "WEAPON_COMBATPISTOL",
        type = "weapon",
        ammo = 100,
        craftTime = 8,
        repRequired = 25,
        icon = "fa-gun",
        category = "weapons",
        materials = {
            { item = "iron", label = "Iron Scrap", amount = 14 },
            { item = "copper", label = "Copper Wiring", amount = 8 },
            { item = "plastic", label = "Industrial Polymer", amount = 10 },
            { item = "steel", label = "Reinforced Steel", amount = 6 }
        }
    },
    ['ammo_9mm'] = {
        label = "9mm Ammo Crate (100 Rnds)",
        item = "ammo-9",
        type = "ammo",
        amount = 100,
        craftTime = 4,
        repRequired = 10,
        icon = "fa-box-archive",
        category = "ammo",
        materials = {
            { item = "copper", label = "Copper Wiring", amount = 6 },
            { item = "gunpowder", label = "Gunpowder", amount = 8 },
            { item = "iron", label = "Iron Scrap", amount = 4 }
        }
    },

    -- === TIER 2: AUTOMATIC SMGS & CARBINES ===
    ['weapon_microsmg'] = {
        label = "Micro SMG Tactical Machine Gun",
        item = "WEAPON_MICROSMG",
        type = "weapon",
        ammo = 150,
        craftTime = 12,
        repRequired = 45,
        icon = "fa-gun",
        category = "weapons",
        materials = {
            { item = "iron", label = "Iron Scrap", amount = 20 },
            { item = "steel", label = "Reinforced Steel", amount = 12 },
            { item = "copper", label = "Copper Wiring", amount = 14 },
            { item = "plastic", label = "Industrial Polymer", amount = 15 },
            { item = "electronic_kit", label = "Micro-Circuitry", amount = 1 }
        }
    },
    ['weapon_combatpdw'] = {
        label = "Combat PDW Military Grade",
        item = "WEAPON_COMBATPDW",
        type = "weapon",
        ammo = 150,
        craftTime = 15,
        repRequired = 60,
        icon = "fa-gun",
        category = "weapons",
        materials = {
            { item = "steel", label = "Reinforced Steel", amount = 24 },
            { item = "aluminum", label = "Aircraft Aluminum", amount = 16 },
            { item = "copper", label = "Copper Wiring", amount = 18 },
            { item = "plastic", label = "Industrial Polymer", amount = 18 },
            { item = "electronic_kit", label = "Micro-Circuitry", amount = 2 }
        }
    },
    ['ammo_smg'] = {
        label = "SMG Ammo Box (150 Rnds)",
        item = "ammo-smg",
        type = "ammo",
        amount = 150,
        craftTime = 5,
        repRequired = 30,
        icon = "fa-box-archive",
        category = "ammo",
        materials = {
            { item = "copper", label = "Copper Wiring", amount = 10 },
            { item = "gunpowder", label = "Gunpowder", amount = 12 },
            { item = "iron", label = "Iron Scrap", amount = 6 }
        }
    },

    -- === TIER 3: HEAVY ARMS & ASSAULT RIFLES (HIGH REP / PURCHASED DEED) ===
    ['weapon_assaultrifle'] = {
        label = "AK-47 Assault Rifle (Syndicate Custom)",
        item = "WEAPON_ASSAULTRIFLE",
        type = "weapon",
        ammo = 200,
        craftTime = 20,
        repRequired = 80,
        icon = "fa-gun",
        category = "weapons",
        materials = {
            { item = "steel", label = "Reinforced Steel", amount = 32 },
            { item = "aluminum", label = "Aircraft Aluminum", amount = 22 },
            { item = "copper", label = "Copper Wiring", amount = 20 },
            { item = "plastic", label = "Industrial Polymer", amount = 20 },
            { item = "electronic_kit", label = "Micro-Circuitry", amount = 3 }
        }
    },
    ['ammo_rifle'] = {
        label = "Rifle High-Velocity Ammo (200 Rnds)",
        item = "ammo-rifle",
        type = "ammo",
        amount = 200,
        craftTime = 6,
        repRequired = 50,
        icon = "fa-box-archive",
        category = "ammo",
        materials = {
            { item = "copper", label = "Copper Wiring", amount = 15 },
            { item = "gunpowder", label = "Gunpowder", amount = 18 },
            { item = "steel", label = "Reinforced Steel", amount = 8 }
        }
    },
    ['weapon_pipebomb'] = {
        label = "Tactical Pipe Bomb Explosive",
        item = "WEAPON_PIPEBOMB",
        type = "weapon",
        craftTime = 10,
        repRequired = 70,
        icon = "fa-bomb",
        category = "explosives",
        materials = {
            { item = "steel", label = "Reinforced Steel", amount = 12 },
            { item = "gunpowder", label = "Gunpowder", amount = 20 },
            { item = "electronic_kit", label = "Micro-Circuitry", amount = 1 }
        }
    }
}

-- ==============================================================================
-- 3. CONFIGURED TURF BLOCKS & STREET BUSINESS NETWORK (EVERY MAJOR STREET)
-- ==============================================================================
Config.Zones = {
    -- === SOUTH CENTRAL & STRAWBERRY / DAVIS / GANTON ===
    ['forum_drive'] = {
        label = "Forum Drive Dispensary Front",
        coords = vec3(-119.82, -1607.41, 31.78),
        radius = 18.0,
        captureTime = 40,
        passiveReward = { item = "money", amount = 350 },
        color = { r = 46, g = 196, b = 182, a = 120 },
        blip = { sprite = 378, color = 2, scale = 0.8, label = "Business: Forum Drive" }
    },
    ['grove_culdesac'] = {
        label = "Grove Street Family Front",
        coords = vec3(85.45, -1959.12, 20.81),
        radius = 20.0,
        captureTime = 50,
        passiveReward = { item = "money", amount = 420 },
        color = { r = 56, g = 176, b = 0, a = 120 },
        blip = { sprite = 378, color = 25, scale = 0.8, label = "Business: Grove Street" }
    },
    ['rancho_block'] = {
        label = "Rancho Projects Pawn & Hardware",
        coords = vec3(336.56, -2048.21, 21.22),
        radius = 18.0,
        captureTime = 45,
        passiveReward = { item = "money", amount = 320 },
        color = { r = 255, g = 107, b = 34, a = 120 },
        blip = { sprite = 378, color = 1, scale = 0.8, label = "Business: Rancho Projects" }
    },
    ['carson_ave'] = {
        label = "Carson Avenue 24/7 Supermarket",
        coords = vec3(373.87, -1535.42, 29.29),
        radius = 16.0,
        captureTime = 35,
        passiveReward = { item = "money", amount = 300 },
        color = { r = 255, g = 209, b = 102, a = 120 },
        blip = { sprite = 378, color = 46, scale = 0.8, label = "Business: Carson Ave 24/7" }
    },
    ['strawberry_chop'] = {
        label = "Strawberry Chop & Auto Salvage",
        coords = vec3(484.28, -1316.54, 29.21),
        radius = 18.0,
        captureTime = 45,
        passiveReward = { item = "money", amount = 450 },
        color = { r = 157, g = 78, b = 221, a = 120 },
        blip = { sprite = 378, color = 27, scale = 0.8, label = "Business: Strawberry Chop" }
    },
    ['davis_mega_mall'] = {
        label = "Davis Mega Mall Discount Liquors",
        coords = vec3(112.56, -1711.23, 29.35),
        radius = 18.0,
        captureTime = 40,
        passiveReward = { item = "money", amount = 380 },
        color = { r = 247, g = 37, b = 133, a = 120 },
        blip = { sprite = 378, color = 48, scale = 0.8, label = "Business: Davis Mega Mall" }
    },
    ['chamberlain_pawn'] = {
        label = "Chamberlain Hills Pawn & Loan",
        coords = vec3(-182.72, -1486.29, 31.42),
        radius = 16.0,
        captureTime = 35,
        passiveReward = { item = "money", amount = 310 },
        color = { r = 6, g = 214, b = 160, a = 120 },
        blip = { sprite = 378, color = 2, scale = 0.8, label = "Business: Chamberlain Pawn" }
    },
    ['brouge_smoke'] = {
        label = "Brouge Avenue Smoke Lounge",
        coords = vec3(412.35, -1910.12, 24.85),
        radius = 16.0,
        captureTime = 35,
        passiveReward = { item = "money", amount = 290 },
        color = { r = 114, g = 9, b = 183, a = 120 },
        blip = { sprite = 378, color = 7, scale = 0.8, label = "Business: Brouge Smoke" }
    },

    -- === DOWNTOWN, PILLBOX & FINANCIAL DISTRICT ===
    ['legion_square_front'] = {
        label = "Legion Square Coffee & News",
        coords = vec3(149.95, -1040.59, 29.37),
        radius = 20.0,
        captureTime = 50,
        passiveReward = { item = "money", amount = 480 },
        color = { r = 46, g = 196, b = 182, a = 120 },
        blip = { sprite = 378, color = 2, scale = 0.8, label = "Business: Legion Square" }
    },
    ['pillbox_medical'] = {
        label = "Pillbox Hill Pharmacy Front",
        coords = vec3(343.82, -584.23, 28.79),
        radius = 16.0,
        captureTime = 40,
        passiveReward = { item = "money", amount = 460 },
        color = { r = 230, g = 57, b = 70, a = 120 },
        blip = { sprite = 378, color = 1, scale = 0.8, label = "Business: Pillbox Medical" }
    },
    ['san_andreas_club'] = {
        label = "San Andreas Avenue Nightclub",
        coords = vec3(-44.52, -1098.45, 26.42),
        radius = 22.0,
        captureTime = 60,
        passiveReward = { item = "money", amount = 580 },
        color = { r = 157, g = 78, b = 221, a = 120 },
        blip = { sprite = 378, color = 27, scale = 0.8, label = "Business: San Andreas Club" }
    },
    ['vespucci_blvd_lounge'] = {
        label = "Vespucci Boulevard Executive Lounge",
        coords = vec3(198.45, -1340.12, 29.45),
        radius = 18.0,
        captureTime = 45,
        passiveReward = { item = "money", amount = 430 },
        color = { r = 255, g = 209, b = 102, a = 120 },
        blip = { sprite = 378, color = 46, scale = 0.8, label = "Business: Vespucci Lounge" }
    },
    ['alta_street_247'] = {
        label = "Alta Street 24/7 Supermarket",
        coords = vec3(-707.56, -914.23, 19.21),
        radius = 16.0,
        captureTime = 35,
        passiveReward = { item = "money", amount = 320 },
        color = { r = 46, g = 196, b = 182, a = 120 },
        blip = { sprite = 378, color = 2, scale = 0.8, label = "Business: Alta Street Market" }
    },
    ['sinners_passage'] = {
        label = "Sinner's Passage Syndicate Corner",
        coords = vec3(432.12, -980.45, 30.71),
        radius = 16.0,
        captureTime = 40,
        passiveReward = { item = "money", amount = 360 },
        color = { r = 247, g = 37, b = 133, a = 120 },
        blip = { sprite = 378, color = 48, scale = 0.8, label = "Business: Sinner's Passage" }
    },

    -- === VINEWOOD, HAWICK & WEST HILLS ===
    ['vanilla_unicorn'] = {
        label = "Vanilla Unicorn VIP Club",
        coords = vec3(129.25, -1299.12, 29.23),
        radius = 20.0,
        captureTime = 55,
        passiveReward = { item = "money", amount = 600 },
        color = { r = 247, g = 37, b = 133, a = 120 },
        blip = { sprite = 378, color = 48, scale = 0.8, label = "Business: Vanilla Unicorn" }
    },
    ['vinewood_cockatoos'] = {
        label = "Vinewood Blvd Cockatoos VIP",
        coords = vec3(378.45, 234.12, 103.25),
        radius = 18.0,
        captureTime = 45,
        passiveReward = { item = "money", amount = 520 },
        color = { r = 255, g = 209, b = 102, a = 120 },
        blip = { sprite = 378, color = 46, scale = 0.8, label = "Business: Vinewood Cockatoos" }
    },
    ['eclipse_boutique'] = {
        label = "Eclipse Blvd Luxury Boutique",
        coords = vec3(-564.12, 278.45, 82.95),
        radius = 18.0,
        captureTime = 45,
        passiveReward = { item = "money", amount = 540 },
        color = { r = 157, g = 78, b = 221, a = 120 },
        blip = { sprite = 378, color = 27, scale = 0.8, label = "Business: Eclipse Boutique" }
    },
    ['hawick_smoke'] = {
        label = "Hawick Commercial Smoke Shop",
        coords = vec3(314.19, -278.89, 54.17),
        radius = 16.0,
        captureTime = 40,
        passiveReward = { item = "money", amount = 410 },
        color = { r = 56, g = 176, b = 0, a = 120 },
        blip = { sprite = 378, color = 25, scale = 0.8, label = "Business: Hawick Smoke" }
    },
    ['spanish_ave_garage'] = {
        label = "Spanish Avenue Custom Garage",
        coords = vec3(-1152.45, -2012.34, 13.18),
        radius = 18.0,
        captureTime = 45,
        passiveReward = { item = "money", amount = 470 },
        color = { r = 46, g = 196, b = 182, a = 120 },
        blip = { sprite = 378, color = 2, scale = 0.8, label = "Business: Spanish Ave Garage" }
    },

    -- === VESPUCCI BEACH, MORNINGWOOD & DEL PERRO ===
    ['vespucci_beach_dispensary'] = {
        label = "Vespucci Beachfront Smoke Shop",
        coords = vec3(-1172.45, -1571.23, 4.38),
        radius = 20.0,
        captureTime = 50,
        passiveReward = { item = "money", amount = 510 },
        color = { r = 56, g = 176, b = 0, a = 120 },
        blip = { sprite = 378, color = 25, scale = 0.8, label = "Business: Vespucci Beachfront" }
    },
    ['del_perro_arcade'] = {
        label = "Del Perro Pier Boardwalk Arcade",
        coords = vec3(-1662.12, -1050.45, 13.15),
        radius = 22.0,
        captureTime = 55,
        passiveReward = { item = "money", amount = 560 },
        color = { r = 247, g = 37, b = 133, a = 120 },
        blip = { sprite = 378, color = 48, scale = 0.8, label = "Business: Del Perro Pier" }
    },
    ['magellan_liquor'] = {
        label = "Magellan Avenue Beachside Liquor",
        coords = vec3(-1224.56, -906.12, 12.32),
        radius = 16.0,
        captureTime = 35,
        passiveReward = { item = "money", amount = 340 },
        color = { r = 255, g = 209, b = 102, a = 120 },
        blip = { sprite = 378, color = 46, scale = 0.8, label = "Business: Magellan Liquor" }
    },

    -- === EAST LOS SANTOS, CYPRESS & INDUSTRIAL DOCKS ===
    ['cypress_warehouse'] = {
        label = "Cypress Flats Chemical Works",
        coords = vec3(932.14, -2178.65, 30.55),
        radius = 22.0,
        captureTime = 60,
        passiveReward = { item = "money", amount = 590 },
        color = { r = 114, g = 9, b = 183, a = 120 },
        blip = { sprite = 378, color = 27, scale = 0.8, label = "Business: Cypress Chemical" }
    },
    ['ls_port_depot'] = {
        label = "Port of LS Cargo Depot & Shipping",
        coords = vec3(1182.45, -3112.56, 6.02),
        radius = 25.0,
        captureTime = 65,
        passiveReward = { item = "money", amount = 680 },
        color = { r = 46, g = 196, b = 182, a = 120 },
        blip = { sprite = 378, color = 2, scale = 0.8, label = "Business: Port Cargo Depot" }
    },
    ['el_burro_freight'] = {
        label = "El Burro Heights Scrap & Freight",
        coords = vec3(1698.12, -2150.34, 76.54),
        radius = 22.0,
        captureTime = 55,
        passiveReward = { item = "money", amount = 530 },
        color = { r = 255, g = 107, b = 34, a = 120 },
        blip = { sprite = 378, color = 1, scale = 0.8, label = "Business: El Burro Scrap" }
    },
    ['la_mesa_auto'] = {
        label = "La Mesa Industrial Salvage",
        coords = vec3(715.45, -1064.23, 22.34),
        radius = 20.0,
        captureTime = 50,
        passiveReward = { item = "money", amount = 490 },
        color = { r = 157, g = 78, b = 221, a = 120 },
        blip = { sprite = 378, color = 27, scale = 0.8, label = "Business: La Mesa Salvage" }
    },
    ['murrieta_oil'] = {
        label = "Murrieta Oil Field Pump Base",
        coords = vec3(1542.12, -1890.34, 88.12),
        radius = 24.0,
        captureTime = 60,
        passiveReward = { item = "money", amount = 620 },
        color = { r = 255, g = 209, b = 102, a = 120 },
        blip = { sprite = 378, color = 46, scale = 0.8, label = "Business: Murrieta Oil" }
    },

    -- === BLAINE COUNTY, SANDY SHORES & PALETO BAY ===
    ['sandy_trailer'] = {
        label = "Sandy Shores Meth Trailer Lab",
        coords = vec3(1572.33, 3591.24, 35.42),
        radius = 18.0,
        captureTime = 40,
        passiveReward = { item = "money", amount = 440 },
        color = { r = 255, g = 183, b = 3, a = 120 },
        blip = { sprite = 378, color = 46, scale = 0.8, label = "Business: Sandy Trailer" }
    },
    ['sandy_liquor_ace'] = {
        label = "Sandy Shores Liquor Ace Store",
        coords = vec3(1982.45, 3052.12, 47.21),
        radius = 18.0,
        captureTime = 45,
        passiveReward = { item = "money", amount = 390 },
        color = { r = 255, g = 107, b = 34, a = 120 },
        blip = { sprite = 378, color = 1, scale = 0.8, label = "Business: Sandy Liquor Ace" }
    },
    ['grapeseed_feed'] = {
        label = "Grapeseed Farm & Grain Depot",
        coords = vec3(1685.23, 4924.12, 42.08),
        radius = 22.0,
        captureTime = 50,
        passiveReward = { item = "money", amount = 480 },
        color = { r = 56, g = 176, b = 0, a = 120 },
        blip = { sprite = 378, color = 25, scale = 0.8, label = "Business: Grapeseed Farm" }
    },
    ['paleto_hen_house'] = {
        label = "Paleto Bay Hen House Saloon",
        coords = vec3(-368.12, 6072.45, 31.45),
        radius = 20.0,
        captureTime = 45,
        passiveReward = { item = "money", amount = 430 },
        color = { r = 247, g = 37, b = 133, a = 120 },
        blip = { sprite = 378, color = 48, scale = 0.8, label = "Business: Paleto Hen House" }
    },
    ['paleto_sawmill'] = {
        label = "Paleto Forest Lumber & Sawmill",
        coords = vec3(-584.12, 5282.34, 70.25),
        radius = 24.0,
        captureTime = 60,
        passiveReward = { item = "money", amount = 570 },
        color = { r = 114, g = 9, b = 183, a = 120 },
        blip = { sprite = 378, color = 27, scale = 0.8, label = "Business: Paleto Sawmill" }
    }
}

