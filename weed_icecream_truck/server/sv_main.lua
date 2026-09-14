local trucksData = {}
local standaloneCash = {}
local standaloneInventory = {}

-- Framework Detection & Setup
local ESX = nil
if GetResourceState('es_extended') == 'started' then
    pcall(function()
        ESX = exports['es_extended']:getSharedObject()
    end)
    if not ESX then
        TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    end
end

-- Helper: Get Player Inventory Item Count
local function GetItemCount(src, item)
    if exports.ox_inventory then
        return exports.ox_inventory:GetItemCount(src, item) or 0
    elseif exports['qb-core'] then
        local Player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if not Player then return 0 end
        local itm = Player.Functions.GetItemByName(item)
        return itm and itm.amount or 0
    elseif ESX then
        local xPlayer = ESX.GetPlayerFromId(src)
        if not xPlayer then return 0 end
        local itm = xPlayer.getInventoryItem(item)
        return itm and itm.count or 0
    else
        -- Standalone In-Memory Inventory
        if not standaloneInventory[src] then
            standaloneInventory[src] = {
                ['weed_baggy'] = 5,
                ['weed_joint'] = 5,
                ['weed_brownie'] = 3,
                ['coke_baggy'] = 2,
                ['meth_baggy'] = 2,
                ['raw_weed'] = 10
            }
        end
        return standaloneInventory[src][item] or 0
    end
end

-- Helper: Remove Item
local function RemoveItem(src, item, count)
    count = count or 1
    if exports.ox_inventory then
        return exports.ox_inventory:RemoveItem(src, item, count)
    elseif exports['qb-core'] then
        local Player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if not Player then return false end
        return Player.Functions.RemoveItem(item, count)
    elseif ESX then
        local xPlayer = ESX.GetPlayerFromId(src)
        if not xPlayer then return false end
        local itm = xPlayer.getInventoryItem(item)
        if itm and itm.count >= count then
            xPlayer.removeInventoryItem(item, count)
            return true
        end
        return false
    else
        -- Standalone
        if not standaloneInventory[src] then standaloneInventory[src] = {} end
        local current = standaloneInventory[src][item] or 0
        if current >= count then
            standaloneInventory[src][item] = current - count
            return true
        end
        return false
    end
end

-- Helper: Add Item
local function AddItem(src, item, count)
    count = count or 1
    if exports.ox_inventory then
        return exports.ox_inventory:AddItem(src, item, count)
    elseif exports['qb-core'] then
        local Player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if not Player then return false end
        return Player.Functions.AddItem(item, count)
    elseif ESX then
        local xPlayer = ESX.GetPlayerFromId(src)
        if not xPlayer then return false end
        xPlayer.addInventoryItem(item, count)
        return true
    else
        -- Standalone
        if not standaloneInventory[src] then standaloneInventory[src] = {} end
        standaloneInventory[src][item] = (standaloneInventory[src][item] or 0) + count
        return true
    end
end

-- Helper: Add Money
local function AddMoney(src, amount)
    if exports.ox_inventory then
        return exports.ox_inventory:AddItem(src, 'money', amount)
    elseif exports['qb-core'] then
        local Player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if Player then Player.Functions.AddMoney('cash', amount) end
    elseif ESX then
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then xPlayer.addMoney(amount) end
    else
        -- Standalone
        if not standaloneCash[src] then standaloneCash[src] = 5000 end
        standaloneCash[src] = standaloneCash[src] + amount
    end
end

-- Helper: Remove Money
local function RemoveMoney(src, amount)
    if exports.ox_inventory then
        return exports.ox_inventory:RemoveItem(src, 'money', amount)
    elseif exports['qb-core'] then
        local Player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if Player then return Player.Functions.RemoveMoney('cash', amount) end
    elseif ESX then
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer and xPlayer.getMoney() >= amount then
            xPlayer.removeMoney(amount)
            return true
        end
        return false
    else
        -- Standalone
        if not standaloneCash[src] then standaloneCash[src] = 5000 end
        if standaloneCash[src] >= amount then
            standaloneCash[src] = standaloneCash[src] - amount
            return true
        end
        return false
    end
end

-- Helper: Send Notification to Player
local function NotifyPlayer(src, msg, type)
    TriggerClientEvent('weed_icecream:client:notify', src, msg, type)
end

-- Register Usable Items
CreateThread(function()
    for itemKey, itemData in pairs(Config.Items) do
        if exports['qb-core'] then
            exports['qb-core']:GetCoreObject().Functions.CreateUseableItem(itemKey, function(source, item)
                local src = source
                if RemoveItem(src, itemKey, 1) then
                    TriggerClientEvent('weed_icecream:client:consumeTreat', src, itemData)
                end
            end)
        elseif exports.qbx_core then
            exports.qbx_core:CreateUseableItem(itemKey, function(source, item)
                local src = source
                if RemoveItem(src, itemKey, 1) then
                    TriggerClientEvent('weed_icecream:client:consumeTreat', src, itemData)
                end
            end)
        elseif ESX then
            ESX.RegisterUsableItem(itemKey, function(source)
                local src = source
                if RemoveItem(src, itemKey, 1) then
                    TriggerClientEvent('weed_icecream:client:consumeTreat', src, itemData)
                end
            end)
        end
    end
end)

-- Helper: Initialize Truck Data
function GetOrCreateTruckData(netId)
    if not trucksData[netId] then
        local defaultStock = {}
        local defaultPrices = {}

        for k, v in pairs(Config.Items) do
            defaultStock[k] = v.defaultStock or 20
            defaultPrices[k] = v.price or 10
        end

        trucksData[netId] = {
            totalSales = 0,
            jingleActive = false,
            sellingActive = false,
            stock = defaultStock,
            prices = defaultPrices,
            pendingNPC = nil,
            npcLoopRunning = false
        }
    end
    return trucksData[netId]
end

-- Request Truck Data
RegisterNetEvent('weed_icecream:server:requestTruckData', function(netId, isDriver)
    local src = source
    local data = GetOrCreateTruckData(netId)
    TriggerClientEvent('weed_icecream:client:openUI', src, netId, data, isDriver)
end)

-- Player Buy Item from Truck Window / Quick Buy HUD
RegisterNetEvent('weed_icecream:server:buyItem', function(netId, itemKey, count)
    local src = source
    local data = GetOrCreateTruckData(netId)
    local itemCfg = Config.Items[itemKey]
    count = math.max(1, tonumber(count) or 1)

    if not itemCfg then return end

    local unitPrice = data.prices[itemKey] or itemCfg.price or 10
    local totalPrice = unitPrice * count
    local stock = data.stock[itemKey] or 0

    if stock < count then
        NotifyPlayer(src, string.format('Only %d in stock (requested %d).', stock, count), 'error')
        return
    end

    if RemoveMoney(src, totalPrice) then
        data.stock[itemKey] = stock - count
        data.totalSales = data.totalSales + totalPrice
        AddItem(src, itemKey, count)

        NotifyPlayer(src, string.format('Purchased %dx %s for $%d!', count, itemCfg.label, totalPrice), 'success')
        TriggerClientEvent('weed_icecream:client:updateTruckData', -1, netId, data)
    else
        NotifyPlayer(src, string.format('You need $%d cash to purchase %dx %s!', totalPrice, count, itemCfg.label), 'error')
    end
end)

-- Player Sell Drugs Wholesale to the Weed Man
RegisterNetEvent('weed_icecream:server:sellWholesale', function(netId, itemKey, count)
    local src = source
    local wholesaleCfg = Config.WholesaleBuyback and Config.WholesaleBuyback[itemKey]
    if not wholesaleCfg then return end

    local countToSell = count or 1
    local currentCount = GetItemCount(src, itemKey)

    if currentCount >= countToSell then
        local totalPayout = wholesaleCfg.payout * countToSell
        if RemoveItem(src, itemKey, countToSell) then
            AddMoney(src, totalPayout)
            NotifyPlayer(src, string.format('Sold %dx %s to the Weed Man for $%d cash!', countToSell, wholesaleCfg.label, totalPayout), 'success')
        end
    else
        NotifyPlayer(src, string.format('You do not have any %s in your pockets to sell!', wholesaleCfg.label), 'error')
    end
end)

-- Player Crafted Soft-Serve Cone / Edible
RegisterNetEvent('weed_icecream:server:craftIceCream', function(data)
    local src = source
    local flavor = data.flavor or 'vanilla'
    local isThc = (flavor == 'mint' or (data.syrups and table.concat(data.syrups):find('thc')))
    local payout = isThc and 75 or 45

    AddMoney(src, payout)
    
    local name = isThc and "Mint THC Cannabis Soft-Serve Cone" or "Artisanal Soft-Serve Cone"
    NotifyPlayer(src, string.format('Freshly packed %s with toppings! Earned +$%d cash.', name, payout), 'success')
end)

-- Deposit Stock into Truck Freezer
RegisterNetEvent('weed_icecream:server:depositStock', function(netId, itemId, count)
    local src = source
    count = count or 1
    local userCount = GetItemCount(src, itemId)

    if userCount >= count then
        if RemoveItem(src, itemId, count) then
            local data = GetOrCreateTruckData(netId)
            data.stock[itemId] = (data.stock[itemId] or 0) + count
            TriggerClientEvent('weed_icecream:client:updateTruckData', -1, netId, data)
            NotifyPlayer(src, 'Deposited ' .. count .. 'x into the truck freezer.', 'success')
        end
    else
        NotifyPlayer(src, "You do not have enough of this item in your inventory.", 'error')
    end
end)

-- Toggle Jingle
RegisterNetEvent('weed_icecream:server:toggleJingle', function(netId, state)
    local data = GetOrCreateTruckData(netId)
    data.jingleActive = state
    TriggerClientEvent('weed_icecream:client:syncJingle', -1, netId, state)
    TriggerClientEvent('weed_icecream:client:updateTruckData', -1, netId, data)
end)

-- Toggle Selling Mode & NPC Walk-Up Loop
RegisterNetEvent('weed_icecream:server:toggleSelling', function(netId, state)
    local src = source
    local data = GetOrCreateTruckData(netId)
    data.sellingActive = state

    if state and not data.npcLoopRunning then
        data.npcLoopRunning = true
        CreateThread(function()
            while data.sellingActive do
                Wait(Config.NPCSellInterval or 10000)
                if not data.sellingActive then break end

                -- Pick an in-stock item
                local available = {}
                for k, count in pairs(data.stock) do
                    if count > 0 then table.insert(available, k) end
                end

                if #available > 0 and not data.pendingNPC then
                    local chosenKey = available[math.random(#available)]
                    local itemConf = Config.Items[chosenKey]
                    data.pendingNPC = {
                        itemKey = chosenKey,
                        price = data.prices[chosenKey] or itemConf.price or 10,
                        isWeed = itemConf.isWeed or false
                    }

                    TriggerClientEvent('weed_icecream:client:spawnNPCBuyer', src, netId, chosenKey)
                end
            end
            data.npcLoopRunning = false
        end)
    end

    TriggerClientEvent('weed_icecream:client:updateTruckData', -1, netId, data)
end)

-- Serve NPC Customer
RegisterNetEvent('weed_icecream:server:serveNPC', function(netId)
    local src = source
    local data = GetOrCreateTruckData(netId)

    if data.pendingNPC then
        local npc = data.pendingNPC
        local itemKey = npc.itemKey
        local price = npc.price

        if (data.stock[itemKey] or 0) > 0 then
            data.stock[itemKey] = data.stock[itemKey] - 1
            data.totalSales = data.totalSales + price
            AddMoney(src, price)

            -- Dispatch alert if weed sale
            if npc.isWeed and math.random(1, 100) <= (Config.CopAlertChance or 15) then
                TriggerClientEvent('weed_icecream:client:policeAlert', src)
            end

            data.pendingNPC = nil
            TriggerClientEvent('weed_icecream:client:updateTruckData', -1, netId, data)
            NotifyPlayer(src, 'Sold ' .. itemKey .. ' to pedestrian for $' .. price, 'success')
        end
    end
end)
