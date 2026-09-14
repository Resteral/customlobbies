local QBX = exports.qbx_core
local PlayerInventories = {}
local PlayerStats = {}
local InventoryLocks = {}
local GroundDrops = {}
local dropCounter = 0

-- Ensure MySQL Table Exists on Server Start
MySQL.ready(function()
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `player_pockets` (
            `citizenid` VARCHAR(50) NOT NULL PRIMARY KEY,
            `slots` LONGTEXT DEFAULT '{}',
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])
end)

-- Helper: Get Player CitizenID from Qbox
local function GetPlayerCitizenId(src)
    local player = QBX:GetPlayer(src)
    if player and player.PlayerData and player.PlayerData.citizenid then
        return player.PlayerData.citizenid
    end
    for _, id in ipairs(GetPlayerIdentifiers(src)) do
        if string.sub(id, 1, 8) == "license:" then
            return id
        end
    end
    return "guest_" .. src
end

-- Helper: Get or Init Player Stats from Qbox Metadata
local function GetPlayerStats(src)
    local player = QBX:GetPlayer(src)
    if player and player.PlayerData and player.PlayerData.metadata then
        local meta = player.PlayerData.metadata
        return {
            strength = meta.strength or 60,
            stamina = meta.stamina or 70
        }
    end
    if not PlayerStats[src] then
        PlayerStats[src] = { strength = 60, stamina = 70 }
    end
    return PlayerStats[src]
end

-- Helper: Calculate Dynamic Max Pocket Weight
local function CalculateMaxWeight(src, hasBackpack)
    local stats = GetPlayerStats(src)
    local strBonus = stats.strength * Config.Stats.StrengthWeightMultiplier
    local baseCap = Config.BasePocketWeight + strBonus
    if hasBackpack then
        baseCap = baseCap + Config.MaxBackpackWeight
    end
    return math.floor(baseCap * 10) / 10
end

-- Helper: Check if Inventory Contains Backpack
local function CheckHasBackpack(slots)
    for _, item in pairs(slots) do
        if item and item.name then
            local def = Config.Items[item.name]
            if def and def.isBackpack then
                return true
            end
        end
    end
    return false
end

-- Helper: Calculate Total Weight
local function CalculateTotalWeight(slots)
    local total = 0.0
    for _, itemData in pairs(slots) do
        if itemData and itemData.name then
            local def = Config.Items[itemData.name]
            if def then
                total = total + (def.weight * (itemData.amount or 1))
            end
        end
    end
    return math.floor(total * 100) / 100
end

-- Load Inventory from MySQL Database or Fallback
local function LoadPlayerInventory(src)
    local citizenid = GetPlayerCitizenId(src)
    local result = MySQL.query.await('SELECT slots FROM player_pockets WHERE citizenid = ?', { citizenid })

    if result and result[1] and result[1].slots then
        local decoded = json.decode(result[1].slots)
        PlayerInventories[src] = {
            owner = citizenid,
            slots = decoded or {}
        }
    else
        -- Default starter inventory
        PlayerInventories[src] = {
            owner = citizenid,
            slots = {
                [201] = { name = "weapon_pistol", amount = 1, metadata = { durability = 100, serial = "WST-9021" } },
                [202] = { name = "weapon_combatpistol", amount = 1, metadata = { durability = 95, serial = "WST-9022" } },
                [301] = { name = "phone", amount = 1, metadata = {} },
                [302] = { name = "wallet", amount = 1, metadata = {} },
                [101] = { name = "item_tactical_hat", amount = 1, metadata = {} },
                [102] = { name = "item_sunglasses", amount = 1, metadata = {} },
                [104] = { name = "item_leather_jacket", amount = 1, metadata = {} },
                [105] = { name = "item_black_tshirt", amount = 1, metadata = {} },
                [106] = { name = "item_armor_vest", amount = 1, metadata = {} },
                [107] = { name = "item_cargo_pants", amount = 1, metadata = {} },
                [108] = { name = "item_combat_boots", amount = 1, metadata = {} },
                [1] = { name = "lockpick", amount = 2, metadata = {} },
                [3] = { name = "bandage", amount = 3, metadata = {} },
                [5] = { name = "backpack", amount = 1, metadata = {} },
                [9] = { name = "ammo_9mm", amount = 4, metadata = {} }
            }
        }
        MySQL.insert('INSERT INTO player_pockets (citizenid, slots) VALUES (?, ?) ON DUPLICATE KEY UPDATE slots = ?', {
            citizenid,
            json.encode(PlayerInventories[src].slots),
            json.encode(PlayerInventories[src].slots)
        })
    end
    return PlayerInventories[src]
end

-- Save Player Inventory to DB
local function SavePlayerInventory(src)
    if PlayerInventories[src] then
        local citizenid = PlayerInventories[src].owner
        MySQL.query('UPDATE player_pockets SET slots = ? WHERE citizenid = ?', {
            json.encode(PlayerInventories[src].slots),
            citizenid
        })
    end
end

-- Qbox Player Load & Drop Handlers
AddEventHandler('QBCore:Server:OnPlayerLoaded', function()
    local src = source
    LoadPlayerInventory(src)
end)

AddEventHandler('qbx_core:server:playerLoaded', function(playerData)
    local src = playerData.source
    LoadPlayerInventory(src)
end)

AddEventHandler('playerDropped', function()
    local src = source
    SavePlayerInventory(src)
    PlayerInventories[src] = nil
    InventoryLocks[src] = nil
end)

-- Fetch / Initialize Inventory Cache
local function GetOrCreateInventory(src)
    if not PlayerInventories[src] then
        return LoadPlayerInventory(src)
    end
    return PlayerInventories[src]
end

-- Request Pocket Data Handler
RegisterNetEvent('pocket:sv:requestPocketData', function()
    local src = source
    local inv = GetOrCreateInventory(src)
    local stats = GetPlayerStats(src)
    local hasBackpack = CheckHasBackpack(inv.slots)
    local weight = CalculateTotalWeight(inv.slots)
    
    TriggerClientEvent('pocket:cl:receivePocketData', src, {
        slots = inv.slots,
        stats = stats,
        hasBackpack = hasBackpack,
        totalWeight = weight
    })
    TriggerClientEvent('pocket:cl:syncGroundDrops', src, GroundDrops)
end)

-- Item Move Event (Validation for Gun Holsters, Phone, Wallet, Equipment, Backpack)
RegisterNetEvent('pocket:sv:moveItem', function(data)
    local src = source
    local fromSlot = tonumber(data.fromSlot)
    local toSlot = tonumber(data.toSlot)
    local amount = tonumber(data.amount) or 1

    if fromSlot == nil or toSlot == nil or fromSlot == toSlot then return end

    if InventoryLocks[src] then
        TriggerClientEvent('pocket:cl:notify', src, 'Inventory busy, please wait!', 'error')
        return
    end
    InventoryLocks[src] = true

    local inv = GetOrCreateInventory(src)
    local stats = GetPlayerStats(src)
    local sourceItem = inv.slots[fromSlot]

    if not sourceItem or sourceItem.amount < amount then
        InventoryLocks[src] = nil
        TriggerClientEvent('pocket:cl:notify', src, 'Invalid source item!', 'error')
        return
    end

    local sourceDef = Config.Items[sourceItem.name]

    -- Validation 1: Gun Holsters (201 & 202)
    if toSlot == Config.GunSlot1 or toSlot == Config.GunSlot2 then
        if not sourceDef or not sourceDef.isWeapon then
            InventoryLocks[src] = nil
            TriggerClientEvent('pocket:cl:notify', src, 'Only sidearms can be placed in gun holsters!', 'error')
            return
        end
    end

    -- Validation 2: Phone Pocket (301)
    if toSlot == Config.PhoneSlot then
        if not sourceDef or not sourceDef.isPhone then
            InventoryLocks[src] = nil
            TriggerClientEvent('pocket:cl:notify', src, 'Only smartphones fit in the phone pocket!', 'error')
            return
        end
    end

    -- Validation 3: Wallet Pocket (302)
    if toSlot == Config.WalletSlot then
        if not sourceDef or not sourceDef.isWallet then
            InventoryLocks[src] = nil
            TriggerClientEvent('pocket:cl:notify', src, 'Only wallets fit in the wallet pocket!', 'error')
            return
        end
    end

    -- Validation 4: Equipment Slots (101 - 108)
    if toSlot >= 101 and toSlot <= 108 then
        if not sourceDef or sourceDef.equipSlot ~= toSlot then
            InventoryLocks[src] = nil
            TriggerClientEvent('pocket:cl:notify', src, 'Invalid clothing item for this slot!', 'error')
            return
        end
    end

    -- Validation 5: Backpack Slots (9 - 24)
    local hasBackpack = CheckHasBackpack(inv.slots)
    if toSlot >= 9 and toSlot <= 24 then
        if not hasBackpack then
            InventoryLocks[src] = nil
            TriggerClientEvent('pocket:cl:notify', src, 'Requires a Backpack to store items here!', 'error')
            return
        end
    end

    local targetItem = inv.slots[toSlot]

    -- Move / Swap / Stack Logic
    if not targetItem then
        if amount >= sourceItem.amount then
            inv.slots[toSlot] = sourceItem
            inv.slots[fromSlot] = nil
        else
            inv.slots[toSlot] = {
                name = sourceItem.name,
                amount = amount,
                metadata = sourceItem.metadata
            }
            sourceItem.amount = sourceItem.amount - amount
        end
    elseif targetItem.name == sourceItem.name then
        local maxStack = sourceDef and sourceDef.maxStack or 1
        local spaceLeft = maxStack - targetItem.amount
        if spaceLeft > 0 then
            local transferAmount = math.min(amount, spaceLeft)
            targetItem.amount = targetItem.amount + transferAmount
            sourceItem.amount = sourceItem.amount - transferAmount
            if sourceItem.amount <= 0 then
                inv.slots[fromSlot] = nil
            end
        else
            inv.slots[fromSlot], inv.slots[toSlot] = targetItem, sourceItem
        end
    else
        inv.slots[fromSlot], inv.slots[toSlot] = targetItem, sourceItem
    end

    local updatedHasBackpack = CheckHasBackpack(inv.slots)
    local newWeight = CalculateTotalWeight(inv.slots)
    local maxWeight = CalculateMaxWeight(src, updatedHasBackpack)

    if newWeight > maxWeight then
        TriggerClientEvent('pocket:cl:notify', src, 'Warning: Overencumbered! (Max ' .. maxWeight .. ' KG)', 'warning')
    end

    SavePlayerInventory(src)
    InventoryLocks[src] = nil

    TriggerClientEvent('pocket:cl:syncPockets', src, {
        slots = inv.slots,
        stats = stats,
        hasBackpack = updatedHasBackpack,
        totalWeight = newWeight
    })
end)

-- Quick Draw Event
RegisterNetEvent('pocket:sv:quickDrawGun', function(slotNum)
    local src = source
    local inv = GetOrCreateInventory(src)
    local holsterItem = inv.slots[slotNum]

    if not holsterItem then
        TriggerClientEvent('pocket:cl:notify', src, 'No weapon holstered in this slot!', 'warning')
        return
    end

    local def = Config.Items[holsterItem.name]
    if not def or not def.weaponHash then return end

    local ped = GetPlayerPed(src)
    local currentWeapon = GetSelectedPedWeapon(ped)

    if currentWeapon == def.weaponHash then
        RemoveWeaponFromPed(ped, def.weaponHash)
        TriggerClientEvent('pocket:cl:notify', src, 'Holstered weapon', 'info')
    else
        GiveWeaponToPed(ped, def.weaponHash, 250, false, true)
        TriggerClientEvent('pocket:cl:notify', src, 'Drawn weapon from holster', 'success')
    end
end)

-- Item Use Event
RegisterNetEvent('pocket:sv:useItem', function(slotNum)
    local src = source
    local inv = GetOrCreateInventory(src)
    local stats = GetPlayerStats(src)
    local item = inv.slots[slotNum]

    if not item then return end
    local def = Config.Items[item.name]

    if not def or not def.usable then
        TriggerClientEvent('pocket:cl:notify', src, 'This item cannot be used!', 'error')
        return
    end

    if def.statBoost then
        local statType = def.statBoost.stat
        local boostAmt = def.statBoost.amount
        if statType and stats[statType] then
            stats[statType] = math.min(stats[statType] + boostAmt, Config.Stats.MaxLevel)
            
            -- Sync to Qbox Metadata
            local player = QBX:GetPlayer(src)
            if player and player.Functions then
                player.Functions.SetMetaData(statType, stats[statType])
            end

            TriggerClientEvent('pocket:cl:notify', src, 'Boosted ' .. statType:upper() .. ' to Level ' .. stats[statType] .. '!', 'success')
        end
    else
        TriggerClientEvent('pocket:cl:notify', src, 'Used ' .. def.label, 'success')
    end

    item.amount = item.amount - 1
    if item.amount <= 0 then
        inv.slots[slotNum] = nil
    end

    SavePlayerInventory(src)

    TriggerClientEvent('pocket:cl:syncPockets', src, {
        slots = inv.slots,
        stats = stats,
        hasBackpack = CheckHasBackpack(inv.slots),
        totalWeight = CalculateTotalWeight(inv.slots)
    })
end)

-- Item Drop Event
RegisterNetEvent('pocket:sv:dropItem', function(data)
    local src = source
    local inv = GetOrCreateInventory(src)
    local stats = GetPlayerStats(src)
    local slotNum = tonumber(data.slot)
    local item = inv.slots[slotNum]

    if not item then return end

    local def = Config.Items[item.name]
    dropCounter = dropCounter + 1
    local dropId = "drop_" .. dropCounter

    GroundDrops[dropId] = {
        item = {
            name = item.name,
            amount = item.amount,
            metadata = item.metadata
        },
        coords = data.coords
    }

    inv.slots[slotNum] = nil
    SavePlayerInventory(src)

    TriggerClientEvent('pocket:cl:notify', src, 'Dropped ' .. (def and def.label or item.name), 'info')
    TriggerClientEvent('pocket:cl:syncPockets', src, {
        slots = inv.slots,
        stats = stats,
        hasBackpack = CheckHasBackpack(inv.slots),
        totalWeight = CalculateTotalWeight(inv.slots)
    })
    TriggerClientEvent('pocket:cl:syncGroundDrops', -1, GroundDrops)
end)

-- Item Pickup Event
RegisterNetEvent('pocket:sv:pickupItem', function(dropId)
    local src = source
    local dropData = GroundDrops[dropId]
    if not dropData then return end

    local inv = GetOrCreateInventory(src)
    local stats = GetPlayerStats(src)
    local hasBackpack = CheckHasBackpack(inv.slots)
    local freeSlot = nil

    for i = 1, Config.BasePocketSlots do
        if not inv.slots[i] then freeSlot = i break end
    end

    if not freeSlot and hasBackpack then
        for i = 9, 24 do
            if not inv.slots[i] then freeSlot = i break end
        end
    end

    if not freeSlot then
        TriggerClientEvent('pocket:cl:notify', src, 'No free pockets/storage slots!', 'error')
        return
    end

    inv.slots[freeSlot] = dropData.item
    GroundDrops[dropId] = nil
    SavePlayerInventory(src)

    local itemDef = Config.Items[dropData.item.name]
    TriggerClientEvent('pocket:cl:notify', src, 'Picked up ' .. (itemDef and itemDef.label or dropData.item.name), 'success')
    TriggerClientEvent('pocket:cl:syncPockets', src, {
        slots = inv.slots,
        stats = stats,
        hasBackpack = CheckHasBackpack(inv.slots),
        totalWeight = CalculateTotalWeight(inv.slots)
    })
    TriggerClientEvent('pocket:cl:syncGroundDrops', -1, GroundDrops)
end)
