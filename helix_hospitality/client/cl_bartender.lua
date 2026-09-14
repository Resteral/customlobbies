local isCrafting = false
local currentCraftingProps = {}
local cachedRecipes = nil
local venueSignatureDrinks = {}

-- Load default recipes from JSON
local function GetDefaultRecipes()
    if cachedRecipes then return cachedRecipes end
    local content = LoadResourceFile(GetCurrentResourceName(), 'data/recipes.json')
    if content and content ~= '' then
        local decoded = json.decode(content)
        if decoded and decoded.recipes then
            cachedRecipes = decoded.recipes
            return cachedRecipes
        end
    end
    return {}
end

-- ============================================================================
-- OPEN MIXOLOGY STATION NUI
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:openMixologyStation', function(venueId, barId)
    if isCrafting then return end

    local allRecipes = GetDefaultRecipes()
    local sigs = venueSignatureDrinks[venueId] or {}

    -- Merge venue signature drinks
    local combinedList = {}
    for _, r in ipairs(allRecipes) do table.insert(combinedList, r) end
    for _, s in ipairs(sigs) do table.insert(combinedList, s) end

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open_mixology',
        venueId = venueId,
        barId = barId,
        recipes = combinedList,
        wholesale = Config.WholesaleSupply
    })
end)

-- Update signature drinks cache
RegisterNetEvent('helix_hospitality:client:updateVenueSignatureDrinks', function(venueId, drinks)
    venueSignatureDrinks[venueId] = drinks
end)

-- ============================================================================
-- BARTENDING ANIMATION SEQUENCES (WITH TIMEOUT GUARDS)
-- ============================================================================
local function CleanUpProps()
    for _, prop in ipairs(currentCraftingProps) do
        if DoesEntityExist(prop) then
            DeleteEntity(prop)
        end
    end
    currentCraftingProps = {}
end

local function PlayBartenderSequence(recipeData, isShaken, cb)
    local plyPed = PlayerPedId()
    isCrafting = true

    RequestAnimDict('mini@repair')
    RequestAnimDict('amb@world_human_drinking@coffee@male@idle_a')

    local animTimeout = 0
    while not HasAnimDictLoaded('mini@repair') and not HasAnimDictLoaded('amb@world_human_drinking@coffee@male@idle_a') and animTimeout < 50 do
        Wait(20)
        animTimeout = animTimeout + 1
    end

    if isShaken then
        local shakerModel = `prop_bar_cockshaker`
        RequestModel(shakerModel)
        local modelTimeout = 0
        while not HasModelLoaded(shakerModel) and modelTimeout < 40 do
            Wait(20)
            modelTimeout = modelTimeout + 1
        end

        if HasModelLoaded(shakerModel) then
            local pCoords = GetEntityCoords(plyPed)
            local shakerProp = CreateObject(shakerModel, pCoords.x, pCoords.y, pCoords.z, true, true, false)
            AttachEntityToEntity(shakerProp, plyPed, GetPedBoneIndex(plyPed, 28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, true, 1, true)
            table.insert(currentCraftingProps, shakerProp)
        end

        TaskPlayAnim(plyPed, 'amb@world_human_drinking@coffee@male@idle_a', 'idle_c', 8.0, -8.0, 2000, 49, 0, false, false, false)
        Wait(2000)
    else
        local bottleModel = `prop_cs_bottle_shot`
        RequestModel(bottleModel)
        local modelTimeout = 0
        while not HasModelLoaded(bottleModel) and modelTimeout < 40 do
            Wait(20)
            modelTimeout = modelTimeout + 1
        end

        if HasModelLoaded(bottleModel) then
            local pCoords = GetEntityCoords(plyPed)
            local bottleProp = CreateObject(bottleModel, pCoords.x, pCoords.y, pCoords.z, true, true, false)
            AttachEntityToEntity(bottleProp, plyPed, GetPedBoneIndex(plyPed, 28422), 0.0, 0.0, -0.1, -90.0, 0.0, 0.0, true, true, false, true, 1, true)
            table.insert(currentCraftingProps, bottleProp)
        end

        TaskPlayAnim(plyPed, 'mini@repair', 'fixing_a_ped', 8.0, -8.0, 1800, 49, 0, false, false, false)
        Wait(1800)
    end

    ClearPedTasks(plyPed)
    CleanUpProps()
    isCrafting = false
    if cb then cb() end
end

-- ============================================================================
-- CRAFTING RESULT HANDLER
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:craftResult', function(success, message, drinkMetadata)
    if success then
        Bridge.Notify(message, 'success', 6000)
    else
        Bridge.Notify(message, 'error', 6000)
    end
end)

-- NUI Callback: Start Drink Sequence
RegisterNUICallback('start_crafting_drink', function(data, cb)
    local venueId = data.venueId
    local recipeId = data.recipeId
    local qualityScore = data.qualityScore or 80
    local isShaken = data.shaken or false
    local customDrink = data.customDrink

    SetNuiFocus(false, false)

    PlayBartenderSequence(data, isShaken, function()
        TriggerServerEvent('helix_hospitality:server:craftDrink', venueId, recipeId, qualityScore, customDrink)
    end)

    cb({ status = 'ok' })
end)

-- Clean up on resource stop
AddEventHandler('onResourceStop', function(res)
    if res ~= GetCurrentResourceName() then return end
    CleanUpProps()
    ClearPedTasks(PlayerPedId())
end)
