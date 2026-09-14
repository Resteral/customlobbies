local isMinigameActive = false
local currentCallback = nil
local currentRecipeKey = nil

--- Helper to load animation dict
local function LoadAnimDict(dict)
    if not HasAnimDictLoaded(dict) then
        RequestAnimDict(dict)
        while not HasAnimDictLoaded(dict) do
            Wait(10)
        end
    end
end

--- Cleanup minigame state
local function StopMinigameState(recipeConfig)
    isMinigameActive = false
    SetNuiFocus(false, false)
    
    local ped = PlayerPedId()
    ClearPedTasks(ped)

    if recipeConfig and recipeConfig.screenEffect then
        AnimpostfxStop(recipeConfig.screenEffect)
    end

    if Config.ScreenBlur then
        SetTransitionTimecycleModifier("default", 0.5)
    end
end

--- Main function to start crafting minigame
--- @param recipeKey string|table Recipe key from Config.Recipes or custom table
--- @param cb function|nil Callback function (success, purity, grade, yieldMultiplier)
local function StartCrafting(recipeKey, cb)
    if isMinigameActive then
        if cb then cb(false, 0, "F", 0.0) end
        return
    end

    local recipeConfig = nil
    if type(recipeKey) == "string" then
        recipeConfig = Config.Recipes[recipeKey]
        currentRecipeKey = recipeKey
    elseif type(recipeKey) == "table" then
        recipeConfig = recipeKey
        currentRecipeKey = "custom"
    end

    if not recipeConfig then
        print("^1[drug_crafting_minigame] Invalid recipe specified: " .. tostring(recipeKey) .. "^7")
        if cb then cb(false, 0, "F", 0.0) end
        return
    end

    isMinigameActive = true
    currentCallback = cb

    -- Player Animation
    local ped = PlayerPedId()
    if recipeConfig.animDict and recipeConfig.animName then
        LoadAnimDict(recipeConfig.animDict)
        TaskPlayAnim(ped, recipeConfig.animDict, recipeConfig.animName, 8.0, -8.0, -1, 49, 0, false, false, false)
    end

    -- Screen FX
    if recipeConfig.screenEffect then
        AnimpostfxPlay(recipeConfig.screenEffect, 0, true)
    end

    -- Open NUI Focus
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "startMinigame",
        config = recipeConfig,
        soundEnabled = Config.SoundEnabled
    })
end

-- Export declaration
exports('StartCrafting', StartCrafting)

-- Net Events
RegisterNetEvent('drug_crafting_minigame:startCrafting', function(recipeKey, cb)
    StartCrafting(recipeKey, cb)
end)

-------------------------------------------------------------------------------
-- NUI Callbacks
-------------------------------------------------------------------------------

RegisterNUICallback('minigameComplete', function(data, cb)
    cb('ok')
    
    local recipeConfig = Config.Recipes[currentRecipeKey]
    StopMinigameState(recipeConfig)

    local success = data.success or false
    local purity = math.floor(data.purity or 0)
    local grade = data.grade or "F"
    local yieldMultiplier = data.yieldMultiplier or 0.0

    -- Handle explosion on catastrophic failure
    if not success and data.reason == "OVERPRESSURE" and recipeConfig and recipeConfig.explosionOnFail then
        local ped = PlayerPedId()
        local coords = GetEntityCoords(ped)
        AddExplosion(coords.x, coords.y, coords.z, 2, 0.5, true, false, 1.0)
        ApplyDamageToPed(ped, recipeConfig.explosionDamage or 40, false)
    end

    -- Send finish event to server for QBox / ox_inventory item rewards
    TriggerServerEvent('drug_crafting_minigame:server:finishCrafting', currentRecipeKey, success, purity, grade, yieldMultiplier)

    if currentCallback then
        local callbackToRun = currentCallback
        currentCallback = nil
        callbackToRun(success, purity, grade, yieldMultiplier)
    end
end)

RegisterNUICallback('minigameClose', function(data, cb)
    cb('ok')
    if not isMinigameActive then return end

    local recipeConfig = Config.Recipes[currentRecipeKey]
    StopMinigameState(recipeConfig)

    TriggerServerEvent('drug_crafting_minigame:server:finishCrafting', currentRecipeKey, false, 0, "F", 0.0)

    if currentCallback then
        local callbackToRun = currentCallback
        currentCallback = nil
        callbackToRun(false, 0, "F", 0.0)
    end
end)

-------------------------------------------------------------------------------
-- Disable Control Actions while Minigame Active
-------------------------------------------------------------------------------
CreateThread(function()
    while true do
        if isMinigameActive then
            DisableControlAction(0, 1, true)   -- LookLeftRight
            DisableControlAction(0, 2, true)   -- LookUpDown
            DisableControlAction(0, 24, true)  -- Attack
            DisableControlAction(0, 257, true) -- Attack 2
            DisableControlAction(0, 25, true)  -- Aim
            DisableControlAction(0, 263, true) -- Melee Attack 1
            DisableControlAction(0, 32, true)  -- Move W
            DisableControlAction(0, 34, true)  -- Move A
            DisableControlAction(0, 31, true)  -- Move S
            DisableControlAction(0, 30, true)  -- Move D
            DisableControlAction(0, 22, true)  -- Jump
            DisableControlAction(0, 44, true)  -- Cover
            DisableControlAction(0, 140, true) -- Melee Light
            DisableControlAction(0, 141, true) -- Melee Heavy
            DisableControlAction(0, 142, true) -- Melee Alternate
            Wait(0)
        else
            Wait(500)
        end
    end
end)
