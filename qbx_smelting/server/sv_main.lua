local Furnaces = {}

-- Initialize Server Furnace Instances
for id, data in pairs(Config.Furnaces) do
    Furnaces[id] = {
        temp = Config.AmbientTemp,
        fuel = 0,               -- Fuel seconds remaining
        activeFuel = nil,
        lastUpdated = os.time()
    }
end

-- Furnace Background Simulation Loop (Fuel Consumption & Heat Dissipation)
CreateThread(function()
    while true do
        Wait(1000)
        for id, state in pairs(Furnaces) do
            local cfg = Config.Furnaces[id]
            if not cfg then goto continue end

            if state.fuel > 0 then
                -- Burning fuel: Heat up
                state.fuel = state.fuel - 1
                local heatRate = (Config.HeatUpRate or 18) * (cfg.fuelEfficiency or 1.0)
                state.temp = math.min(cfg.maxTemperature, state.temp + heatRate)

                if state.fuel <= 0 then
                    state.activeFuel = nil
                end
            else
                -- No fuel: Cool down towards ambient temperature
                if state.temp > Config.AmbientTemp then
                    state.temp = math.max(Config.AmbientTemp, state.temp - (Config.CoolingRate or 12))
                end
            end

            ::continue::
        end
    end
end)

-- Helper: Get Player Item Count (ox_inventory first, fallback to qb-core)
local function GetItemCount(source, item)
    if exports.ox_inventory then
        return exports.ox_inventory:GetItemCount(source, item) or 0
    elseif exports['qb-core'] then
        local Player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(source)
        if not Player then return 0 end
        local itm = Player.Functions.GetItemByName(item)
        return itm and itm.amount or 0
    end
    return 0
end

-- Helper: Remove Item
local function RemoveItem(source, item, count)
    if exports.ox_inventory then
        return exports.ox_inventory:RemoveItem(source, item, count)
    elseif exports['qb-core'] then
        local Player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(source)
        if not Player then return false end
        return Player.Functions.RemoveItem(item, count)
    end
    return false
end

-- Helper: Add Item
local function AddItem(source, item, count, metadata)
    if exports.ox_inventory then
        return exports.ox_inventory:AddItem(source, item, count, metadata)
    elseif exports['qb-core'] then
        local Player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(source)
        if not Player then return false end
        return Player.Functions.AddItem(item, count, false, metadata)
    end
    return false
end

-- Helper: Fetch Player Inventory Summary
local function GetPlayerSmeltingInventory(source)
    local invSummary = {}
    
    -- Check all recipe inputs and fuels
    for _, recipe in pairs(Config.Recipes) do
        for _, inp in ipairs(recipe.inputs) do
            if not invSummary[inp.item] then
                invSummary[inp.item] = GetItemCount(source, inp.item)
            end
        end
    end

    for fuelKey, _ in pairs(Config.Fuels) do
        if not invSummary[fuelKey] then
            invSummary[fuelKey] = GetItemCount(source, fuelKey)
        end
    end

    return invSummary
end

-- Callback: Get Furnace State
lib.callback.register('qbx_smelting:sv:getFurnaceState', function(source, furnaceId)
    local state = Furnaces[furnaceId]
    if not state then return nil end

    local playerInv = GetPlayerSmeltingInventory(source)
    return state, playerInv
end)

-- Callback: Add Fuel
lib.callback.register('qbx_smelting:sv:addFuel', function(source, furnaceId, fuelKey)
    local state = Furnaces[furnaceId]
    local fuelCfg = Config.Fuels[fuelKey]
    if not state or not fuelCfg then return false end

    local count = GetItemCount(source, fuelKey)
    if count < 1 then return false end

    if RemoveItem(source, fuelKey, 1) then
        state.fuel = state.fuel + fuelCfg.burnTime
        state.activeFuel = fuelCfg.label
        state.temp = math.min(Config.Furnaces[furnaceId].maxTemperature, state.temp + fuelCfg.heatAdded)

        TriggerClientEvent('qbx_smelting:cl:syncFurnace', -1, furnaceId, state)
        return true, state
    end

    return false
end)

-- Complete Smelting Event
RegisterNetEvent('qbx_smelting:sv:completeSmelt', function(furnaceId, recipeKey)
    local src = source
    local state = Furnaces[furnaceId]
    local furnace = Config.Furnaces[furnaceId]
    local recipe = Config.Recipes[recipeKey]

    if not state or not furnace or not recipe then return end

    -- Verify Temperature
    if state.temp < recipe.minTemp then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Furnace Under Temp',
            description = string.format('The furnace is only %d°C. Required: %d°C. Add more fuel!', math.floor(state.temp), recipe.minTemp),
            type = 'error'
        })
        return
    end

    -- Verify Inputs
    for _, input in ipairs(recipe.inputs) do
        local userCount = GetItemCount(src, input.item)
        if userCount < input.count then
            TriggerClientEvent('ox_lib:notify', src, {
                title = 'Missing Materials',
                description = string.format('You need %dx %s to smelt this recipe.', input.count, input.label or input.item),
                type = 'error'
            })
            return
        end
    end

    -- Deduct Inputs
    for _, input in ipairs(recipe.inputs) do
        RemoveItem(src, input.item, input.count)
    end

    -- Deliver Primary Outputs
    for _, output in ipairs(recipe.outputs) do
        AddItem(src, output.item, output.count)
    end

    -- Slag or Byproduct chance
    if recipe.slagOutput and math.random(1, 100) <= (recipe.slagOutput.chance or 0) then
        AddItem(src, recipe.slagOutput.item, recipe.slagOutput.count or 1)
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Impurity Extracted',
            description = 'Molten slag waste accumulated during the pour.',
            type = 'inform'
        })
    end

    TriggerClientEvent('ox_lib:notify', src, {
        title = 'Smelting Complete',
        description = string.format('Successfully refined %s.', recipe.label),
        type = 'success'
    })
end)
