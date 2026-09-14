local FILE = 'data/players.json'
local Players = {}

local AIState = {
    currentStopIndex = 1,
    status = 'driving', -- 'driving' | 'stopped'
    stopTimeRemaining = 0,
    truckNetId = nil,
    driverNetId = nil
}

local function loadData()
    local raw = LoadResourceFile(GetCurrentResourceName(), FILE)
    if raw and raw ~= '' then
        local d = json.decode(raw)
        if type(d) == 'table' then
            Players = d
        end
    end
end

local function saveData()
    SaveResourceFile(GetCurrentResourceName(), FILE, json.encode(Players), -1)
end

local function identifier(src)
    for _, v in ipairs(GetPlayerIdentifiers(src)) do
        if v:sub(1, 8) == 'license:' then return v end
    end
    return GetPlayerIdentifiers(src)[1] or ('source:' .. src)
end

local function getPlayer(src)
    local id = identifier(src)
    if not Players[id] then
        Players[id] = { cash = Config.StartingCash, inventory = {} }
        saveData()
    end
    Players[id].inventory = Players[id].inventory or {}
    return Players[id]
end

local function findItem(id)
    for _, items in pairs(Config.Menu) do
        for _, item in ipairs(items) do
            if item.id == id then return item end
        end
    end
end

RegisterNetEvent('munchies:server:requestState', function()
    local src = source
    local p = getPlayer(src)
    TriggerClientEvent('munchies:client:state', src, p)
end)

RegisterNetEvent('munchies:server:requestAIState', function()
    local src = source
    TriggerClientEvent('munchies:client:syncAIState', src, AIState)
end)

RegisterNetEvent('munchies:server:order', function(itemId, qty)
    local src = source
    qty = math.floor(tonumber(qty) or 0)
    if qty < 1 or qty > 20 then return end
    local item = findItem(itemId)
    if not item then return end

    local p = getPlayer(src)
    local total = item.price * qty
    if p.cash < total then
        TriggerClientEvent('munchies:client:notify', src, 'Not enough Munchies cash.', 'error')
        return
    end

    p.cash = p.cash - total
    p.inventory[item.id] = (tonumber(p.inventory[item.id]) or 0) + qty
    saveData()

    TriggerClientEvent('munchies:client:purchaseComplete', src, {
        cash = p.cash,
        inventory = p.inventory,
        item = item.name,
        quantity = qty,
        total = total
    })
end)

RegisterNetEvent('munchies:server:useItem', function(itemId)
    local src = source
    local item = findItem(itemId)
    if not item then return end

    local p = getPlayer(src)
    local count = tonumber(p.inventory[item.id]) or 0
    if count < 1 then return end

    p.inventory[item.id] = count - 1
    if p.inventory[item.id] <= 0 then
        p.inventory[item.id] = nil
    end
    saveData()

    TriggerClientEvent('munchies:client:consume', src, {
        name = item.name,
        health = item.health or 0,
        inventory = p.inventory
    })
end)

-- AI Route Progression Events
RegisterNetEvent('munchies:server:reportStopArrived', function(stopIndex)
    if AIState.status == 'stopped' and AIState.currentStopIndex == stopIndex then return end

    AIState.currentStopIndex = stopIndex
    AIState.status = 'stopped'
    AIState.stopTimeRemaining = Config.AITruck.stopDuration or 120

    local stopInfo = Config.AITruck.Stops[stopIndex]
    local stopName = stopInfo and stopInfo.name or (Stop # .. stopIndex)

    if Config.AITruck.broadcastArrival then
        TriggerClientEvent('munchies:client:broadcastArrival', -1, stopName, AIState.stopTimeRemaining)
    end

    TriggerClientEvent('munchies:client:syncAIState', -1, AIState)
end)

RegisterNetEvent('munchies:server:registerAITruckNetId', function(truckNet, driverNet)
    AIState.truckNetId = truckNet
    AIState.driverNetId = driverNet
    TriggerClientEvent('munchies:client:syncAIState', -1, AIState)
end)

-- Background Stop Duration Timer
CreateThread(function()
    while true do
        Wait(1000)
        if Config.AITruck and Config.AITruck.enabled then
            if AIState.status == 'stopped' then
                if AIState.stopTimeRemaining > 0 then
                    AIState.stopTimeRemaining = AIState.stopTimeRemaining - 1
                else
                    -- Time expired: move to next stop
                    local totalStops = #Config.AITruck.Stops
                    AIState.currentStopIndex = (AIState.currentStopIndex % totalStops) + 1
                    AIState.status = 'driving'
                    AIState.stopTimeRemaining = 0

                    local nextStop = Config.AITruck.Stops[AIState.currentStopIndex]
                    local nextName = nextStop and nextStop.name or Next Stop

                    TriggerClientEvent('munchies:client:notify', -1, '🚚 Munchies Truck is departing for ' .. nextName .. '!', 'inform')
                    TriggerClientEvent('munchies:client:syncAIState', -1, AIState)
                    TriggerClientEvent('munchies:client:instructAIDrive', -1, AIState.currentStopIndex)
                end
            end
        end
    end
end)

-- Commands
RegisterCommand('munchiesbalance', function(src)
    if src == 0 then return end
    local p = getPlayer(src)
    TriggerClientEvent('munchies:client:notify', src, ('Munchies balance: $%s'):format(p.cash), 'success')
end, false)

RegisterCommand('munchiesstatus', function(src)
    local curStop = Config.AITruck.Stops[AIState.currentStopIndex]
    local stopName = curStop and curStop.name or Unknown
    local msg = "
 if AIState.status == 'stopped' then
 msg = ('Munchies Truck is OPEN at %s (Leaving in %ss)'):format(stopName, AIState.stopTimeRemaining)
 else
 msg = ('Munchies Truck is EN ROUTE to %s'):format(stopName)
 end
 if src == 0 then
 print(msg)
 else
 TriggerClientEvent('munchies:client:notify', src, msg, 'inform')
 end
end, false)

RegisterCommand('munchiesnextstop', function(src, args)
 if src ~= 0 and not IsPlayerAceAllowed(src, Config.AdminAce) then return end
 local totalStops = #Config.AITruck.Stops
 AIState.currentStopIndex = (AIState.currentStopIndex % totalStops) + 1
 AIState.status = 'driving'
 AIState.stopTimeRemaining = 0
 TriggerClientEvent('munchies:client:syncAIState', -1, AIState)
 TriggerClientEvent('munchies:client:instructAIDrive', -1, AIState.currentStopIndex)
 local nextStop = Config.AITruck.Stops[AIState.currentStopIndex]
 print('[MUNCHIES] Admin skipped to next stop: ' .. (nextStop and nextStop.name or ''))
end, false)

RegisterCommand('munchiesgivecash', function(src, args)
 if src ~= 0 and not IsPlayerAceAllowed(src, Config.AdminAce) then return end
 local target = tonumber(args[1])
 local amount = math.floor(tonumber(args[2]) or 0)
 if not target or amount <= 0 or not GetPlayerName(target) then return end
 local p = getPlayer(target)
 p.cash = p.cash + amount
 saveData()
 TriggerClientEvent('munchies:client:state', target, p)
end, false)

AddEventHandler('playerDropped', saveData)
AddEventHandler('onResourceStop', function(r)
 if r == GetCurrentResourceName() then saveData() end
end)

loadData()
print('[MUNCHIES] Standalone AI Roaming Food Truck loaded.')
