Bridge = Bridge or {}

-- Standalone in-memory fallback for money and inventory
local standalonePlayerData = {}

local function GetOrCreateStandalonePlayer(src)
    local identifier = GetPlayerIdentifierByType(src, 'license') or ('player_' .. src)
    if not standalonePlayerData[identifier] then
        standalonePlayerData[identifier] = {
            money = { cash = 10000, bank = 50000 },
            inventory = {}
        }
    end
    return identifier, standalonePlayerData[identifier]
end

-- ============================================================================
-- GET IDENTIFIER & NAME
-- ============================================================================
function Bridge.GetPlayerIdentifier(src)
    if GetResourceState('qbx_core') == 'started' and exports.qbx_core then
        local Player = exports.qbx_core:GetPlayer(src)
        if Player and Player.PlayerData then return Player.PlayerData.citizenid end
    elseif GetResourceState('qb-core') == 'started' and exports['qb-core'] then
        local QBCore = exports['qb-core']:GetCoreObject()
        local Player = QBCore.Functions.GetPlayer(src)
        if Player and Player.PlayerData then return Player.PlayerData.citizenid end
    elseif Bridge.FrameworkName == 'esx' and exports['es_extended'] then
        local ESX = exports['es_extended']:getSharedObject()
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then return xPlayer.identifier end
    end
    return GetPlayerIdentifierByType(src, 'license') or ('player_' .. src)
end

function Bridge.GetPlayerName(src)
    if GetResourceState('qbx_core') == 'started' and exports.qbx_core then
        local Player = exports.qbx_core:GetPlayer(src)
        if Player and Player.PlayerData and Player.PlayerData.charinfo then
            return Player.PlayerData.charinfo.firstname .. ' ' .. Player.PlayerData.charinfo.lastname
        end
    elseif GetResourceState('qb-core') == 'started' and exports['qb-core'] then
        local QBCore = exports['qb-core']:GetCoreObject()
        local Player = QBCore.Functions.GetPlayer(src)
        if Player and Player.PlayerData and Player.PlayerData.charinfo then
            return Player.PlayerData.charinfo.firstname .. ' ' .. Player.PlayerData.charinfo.lastname
        end
    elseif Bridge.FrameworkName == 'esx' and exports['es_extended'] then
        local ESX = exports['es_extended']:getSharedObject()
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then return xPlayer.getName() end
    end
    return GetPlayerName(src) or ('Patron #' .. src)
end

-- ============================================================================
-- MONEY TRANSACTIONS (CASH & BANK)
-- ============================================================================
function Bridge.GetMoney(src, mType)
    mType = mType or 'cash'

    -- OX_INVENTORY Cash Check
    if mType == 'cash' and GetResourceState('ox_inventory') == 'started' and exports.ox_inventory then
        return exports.ox_inventory:GetItemCount(src, 'money') or 0
    end

    -- QBX / QBOX CORE
    if GetResourceState('qbx_core') == 'started' and exports.qbx_core then
        local Player = exports.qbx_core:GetPlayer(src)
        if Player and Player.PlayerData and Player.PlayerData.money then
            return Player.PlayerData.money[mType] or 0
        end
    end

    -- QB-CORE
    if GetResourceState('qb-core') == 'started' and exports['qb-core'] then
        local QBCore = exports['qb-core']:GetCoreObject()
        local Player = QBCore.Functions.GetPlayer(src)
        if Player then return Player.Functions.GetMoney(mType) or 0 end
    end

    -- ESX
    if Bridge.FrameworkName == 'esx' and exports['es_extended'] then
        local ESX = exports['es_extended']:getSharedObject()
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then
            if mType == 'bank' then return xPlayer.getAccount('bank').money else return xPlayer.getMoney() end
        end
    end

    -- STANDALONE
    local _, data = GetOrCreateStandalonePlayer(src)
    return data.money[mType] or 0
end

function Bridge.AddMoney(src, mType, amount, reason)
    amount = tonumber(amount) or 0
    if amount <= 0 then return false end
    mType = mType or 'cash'

    -- OX_INVENTORY Cash Add
    if mType == 'cash' and GetResourceState('ox_inventory') == 'started' and exports.ox_inventory then
        exports.ox_inventory:AddItem(src, 'money', amount)
        return true
    end

    -- QBX_CORE
    if GetResourceState('qbx_core') == 'started' and exports.qbx_core then
        local Player = exports.qbx_core:GetPlayer(src)
        if Player then
            Player.Functions.AddMoney(mType, amount, reason or 'Hospitality Revenue')
            return true
        end
    end

    -- QB-CORE
    if GetResourceState('qb-core') == 'started' and exports['qb-core'] then
        local QBCore = exports['qb-core']:GetCoreObject()
        local Player = QBCore.Functions.GetPlayer(src)
        if Player then
            Player.Functions.AddMoney(mType, amount, reason or 'Hospitality Revenue')
            return true
        end
    end

    -- ESX
    if Bridge.FrameworkName == 'esx' and exports['es_extended'] then
        local ESX = exports['es_extended']:getSharedObject()
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then
            if mType == 'bank' then xPlayer.addAccountMoney('bank', amount) else xPlayer.addMoney(amount) end
            return true
        end
    end

    -- STANDALONE
    local _, data = GetOrCreateStandalonePlayer(src)
    data.money[mType] = (data.money[mType] or 0) + amount
    return true
end

function Bridge.RemoveMoney(src, mType, amount, reason)
    amount = tonumber(amount) or 0
    if amount <= 0 then return false end
    mType = mType or 'cash'

    -- OX_INVENTORY Cash Remove
    if mType == 'cash' and GetResourceState('ox_inventory') == 'started' and exports.ox_inventory then
        local currentCash = exports.ox_inventory:GetItemCount(src, 'money') or 0
        if currentCash >= amount then
            return exports.ox_inventory:RemoveItem(src, 'money', amount)
        end
    end

    -- QBX_CORE
    if GetResourceState('qbx_core') == 'started' and exports.qbx_core then
        local Player = exports.qbx_core:GetPlayer(src)
        if Player then
            if (Player.PlayerData.money[mType] or 0) >= amount then
                return Player.Functions.RemoveMoney(mType, amount, reason or 'Hospitality Purchase')
            end
        end
    end

    -- QB-CORE
    if GetResourceState('qb-core') == 'started' and exports['qb-core'] then
        local QBCore = exports['qb-core']:GetCoreObject()
        local Player = QBCore.Functions.GetPlayer(src)
        if Player and Player.Functions.GetMoney(mType) >= amount then
            return Player.Functions.RemoveMoney(mType, amount, reason or 'Hospitality Purchase')
        end
    end

    -- ESX
    if Bridge.FrameworkName == 'esx' and exports['es_extended'] then
        local ESX = exports['es_extended']:getSharedObject()
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then
            if mType == 'bank' and xPlayer.getAccount('bank').money >= amount then
                xPlayer.removeAccountMoney('bank', amount)
                return true
            elseif mType == 'cash' and xPlayer.getMoney() >= amount then
                xPlayer.removeMoney(amount)
                return true
            end
        end
    end

    -- STANDALONE
    local _, data = GetOrCreateStandalonePlayer(src)
    if (data.money[mType] or 0) >= amount then
        data.money[mType] = data.money[mType] - amount
        return true
    end

    return false
end

-- ============================================================================
-- INVENTORY ITEMS
-- ============================================================================
function Bridge.HasItem(src, itemName, count)
    count = count or 1
    if GetResourceState('ox_inventory') == 'started' and exports.ox_inventory then
        local itemCount = exports.ox_inventory:GetItemCount(src, itemName) or 0
        return itemCount >= count
    elseif (Bridge.InventoryName == 'qb-inventory' or Bridge.InventoryName == 'ps-inventory') and exports['qb-inventory'] then
        return exports['qb-inventory']:HasItem(src, itemName, count)
    elseif Bridge.FrameworkName == 'esx' and exports['es_extended'] then
        local ESX = exports['es_extended']:getSharedObject()
        local xPlayer = ESX.GetPlayerFromId(src)
        local item = xPlayer and xPlayer.getInventoryItem(itemName)
        return item and item.count >= count
    else
        local _, data = GetOrCreateStandalonePlayer(src)
        return (data.inventory[itemName] or 0) >= count
    end
end

function Bridge.AddItem(src, itemName, count, metadata)
    count = count or 1
    if GetResourceState('ox_inventory') == 'started' and exports.ox_inventory then
        return exports.ox_inventory:AddItem(src, itemName, count, metadata)
    elseif GetResourceState('qb-inventory') == 'started' and exports['qb-inventory'] then
        local QBCore = exports['qb-core']:GetCoreObject()
        local Player = QBCore.Functions.GetPlayer(src)
        if Player then return Player.Functions.AddItem(itemName, count, nil, metadata) end
    elseif Bridge.FrameworkName == 'esx' and exports['es_extended'] then
        local ESX = exports['es_extended']:getSharedObject()
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then
            xPlayer.addInventoryItem(itemName, count)
            return true
        end
    else
        local _, data = GetOrCreateStandalonePlayer(src)
        data.inventory[itemName] = (data.inventory[itemName] or 0) + count
        return true
    end
    return false
end

function Bridge.RemoveItem(src, itemName, count)
    count = count or 1
    if GetResourceState('ox_inventory') == 'started' and exports.ox_inventory then
        return exports.ox_inventory:RemoveItem(src, itemName, count)
    elseif GetResourceState('qb-inventory') == 'started' and exports['qb-inventory'] then
        local QBCore = exports['qb-core']:GetCoreObject()
        local Player = QBCore.Functions.GetPlayer(src)
        if Player then return Player.Functions.RemoveItem(itemName, count) end
    elseif Bridge.FrameworkName == 'esx' and exports['es_extended'] then
        local ESX = exports['es_extended']:getSharedObject()
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then
            xPlayer.removeInventoryItem(itemName, count)
            return true
        end
    else
        local _, data = GetOrCreateStandalonePlayer(src)
        if (data.inventory[itemName] or 0) >= count then
            data.inventory[itemName] = data.inventory[itemName] - count
            return true
        end
    end
    return false
end
