Config = {}

-- Slot Structure Configuration
Config.GunSlot1 = 201           -- Primary Sidearm Holster Slot
Config.GunSlot2 = 202           -- Secondary Concealed Holster Slot
Config.PhoneSlot = 301          -- Dedicated Phone Pocket
Config.WalletSlot = 302         -- Dedicated Wallet Pocket

Config.BasePocketSlots = 8      -- Slots 1 through 8 (4 Pockets x 2 slots)
Config.BackpackSlots = 16       -- Slots 9 through 24 (Backpack Container)

Config.BasePocketWeight = 12.0  -- Base pocket weight capacity without stats (KG)
Config.MaxBackpackWeight = 25.0    -- Backpack container weight capacity (KG)

-- Character RPG Stats Configuration
Config.Stats = {
    MaxLevel = 100,
    StrengthWeightMultiplier = 0.15,
    StaminaDrainMultiplier = 0.5
}

-- Keybindings
Config.OpenKey = 'TAB'           -- Open/close pocket UI
Config.QuickDrawGun1 = 'H'       -- Quick draw Primary Holster
Config.QuickDrawGun2 = 'J'       -- Quick draw Secondary Holster

-- Clothing & Equipment Paperdoll Slots (around Character Silhouette)
Config.EquipmentSlots = {
    [101] = { name = "hat", label = "Headgear / Hat", icon = "🧢" },
    [102] = { name = "glasses", label = "Eyewear / Glasses", icon = "🕶️" },
    [103] = { name = "neck", label = "Necklace / Chain", icon = "📿" },
    [104] = { name = "jacket", label = "Outer Jacket / Coat", icon = "🧥" },
    [105] = { name = "undershirt", label = "Shirt / Undershirt", icon = "👔" },
    [106] = { name = "vest", label = "Body Armor / Vest", icon = "🦺" },
    [107] = { name = "pants", label = "Trousers / Pants", icon = "👖" },
    [108] = { name = "shoes", label = "Boots / Footwear", icon = "👟" }
}

-- 4 Physical Pocket Definitions (Slots 1 - 8)
Config.Pockets = {
    ["top_left"] = { label = "Top Left Pocket (Jacket L)", icon = "🧥", slots = { 1, 2 } },
    ["top_right"] = { label = "Top Right Pocket (Jacket R)", icon = "🧥", slots = { 3, 4 } },
    ["bottom_left"] = { label = "Bottom Left Pocket (Pants L)", icon = "👖", slots = { 5, 6 } },
    ["bottom_right"] = { label = "Bottom Right Pocket (Pants R)", icon = "👖", slots = { 7, 8 } }
}

-- Item Registry Definition
Config.Items = {
    -- Weapons
    ["weapon_pistol"] = {
        name = "weapon_pistol", label = "9mm Pistol", weight = 1.5, maxStack = 1, usable = true, isWeapon = true, weaponType = "sidearm", weaponHash = `WEAPON_PISTOL`, description = "Standard 9mm semi-automatic pistol. Fits in Holster 1 or Holster 2."
    },
    ["weapon_combatpistol"] = {
        name = "weapon_combatpistol", label = "Combat Pistol", weight = 1.6, maxStack = 1, usable = true, isWeapon = true, weaponType = "sidearm", weaponHash = `WEAPON_COMBATPISTOL`, description = "High-precision combat pistol."
    },
    -- Phone & Wallet
    ["phone"] = {
        name = "phone", label = "Encrypted Smartphone", weight = 0.2, maxStack = 1, usable = true, isPhone = true, description = "Smartphone with encrypted satellite apps. Fits in Phone Pocket."
    },
    ["wallet"] = {
        name = "wallet", label = "Leather Wallet", weight = 0.2, maxStack = 1, usable = true, isWallet = true, description = "Leather wallet containing ID and credit cards. Fits in Wallet Pocket."
    },
    -- Clothing Items
    ["item_tactical_hat"] = {
        name = "item_tactical_hat", label = "Tactical Cap", weight = 0.3, maxStack = 1, equipSlot = 101, description = "Black tactical cap."
    },
    ["item_sunglasses"] = {
        name = "item_sunglasses", label = "Aviator Sunglasses", weight = 0.1, maxStack = 1, equipSlot = 102, description = "Dark aviator shades."
    },
    ["item_gold_chain"] = {
        name = "item_gold_chain", label = "Heavy Gold Chain", weight = 0.4, maxStack = 1, equipSlot = 103, description = "Solid 24k gold chain."
    },
    ["item_leather_jacket"] = {
        name = "item_leather_jacket", label = "Biker Leather Jacket", weight = 2.0, maxStack = 1, equipSlot = 104, description = "Heavy duty leather jacket."
    },
    ["item_black_tshirt"] = {
        name = "item_black_tshirt", label = "Cotton Undershirt", weight = 0.2, maxStack = 1, equipSlot = 105, description = "Comfortable black cotton shirt."
    },
    ["item_armor_vest"] = {
        name = "item_armor_vest", label = "Kevlar Armor Vest", weight = 4.0, maxStack = 1, equipSlot = 106, description = "Heavy duty ballistic kevlar vest."
    },
    ["item_cargo_pants"] = {
        name = "item_cargo_pants", label = "Tactical Cargo Pants", weight = 1.2, maxStack = 1, equipSlot = 107, description = "Reinforced cargo pants."
    },
    ["item_combat_boots"] = {
        name = "item_combat_boots", label = "Leather Combat Boots", weight = 1.5, maxStack = 1, equipSlot = 108, description = "Steel-toe leather boots."
    },
    -- Gear & Backpack
    ["backpack"] = {
        name = "backpack", label = "Tactical Backpack", weight = 1.0, maxStack = 1, usable = false, isBackpack = true, description = "Heavy duty backpack (+16 Storage slots)."
    },
    ["protein_shake"] = {
        name = "protein_shake", label = "Strength Protein Shake", weight = 0.5, maxStack = 5, usable = true, statBoost = { stat = "strength", amount = 2 }, description = "Consumable drink boosting Strength (+2 Levels)."
    },
    ["energy_drink"] = {
        name = "energy_drink", label = "Stamina Energy Drink", weight = 0.3, maxStack = 5, usable = true, statBoost = { stat = "stamina", amount = 3 }, description = "Consumable drink boosting Stamina (+3 Levels)."
    },
    ["water_bottle"] = {
        name = "water_bottle", label = "Water Bottle", weight = 0.5, maxStack = 10, usable = true, description = "Fresh water bottle."
    },
    ["bandage"] = {
        name = "bandage", label = "Sterile Bandage", weight = 0.1, maxStack = 20, usable = true, description = "Emergency medical bandage."
    },
    ["lockpick"] = {
        name = "lockpick", label = "Advanced Lockpick", weight = 0.4, maxStack = 5, usable = true, description = "Lockpick tool for vehicles."
    },
    ["ammo_9mm"] = {
        name = "ammo_9mm", label = "9mm Ammo Box", weight = 0.6, maxStack = 5, usable = true, description = "Box of 30 rounds 9mm."
    }
}
