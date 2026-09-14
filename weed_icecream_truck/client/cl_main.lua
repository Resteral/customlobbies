local QBCore = nil
local activeJingles = {}
local drugHighTime = 0
local isUIOpen = false
local currentTruckNetId = nil
local currentBuyerPed = nil

-- Framework Auto-Detection & Initialization
CreateThread(function()
    if GetResourceState('qbx_core') == 'started' then
        Config.Framework = 'qbox'
    elseif GetResourceState('qb-core') == 'started' then
        QBCore = exports['qb-core']:GetCoreObject()
        Config.Framework = 'qbcore'
    elseif GetResourceState('es_extended') == 'started' then
        Config.Framework = 'esx'
    else
        Config.Framework = 'standalone'
    end

    SetupTruckInteractions()
    StartStandaloneInteractionLoop()
end)

-- Notification Helper & Listener
function ShowNotify(msg, type)
    type = type or 'inform'
    if lib and lib.notify then
        lib.notify({ title = 'Ice Cream Truck', description = msg, type = type })
    elseif Config.Framework == 'qbcore' and QBCore then
        QBCore.Functions.Notify(msg, type)
    else
        SetNotificationTextEntry('STRING')
        AddTextComponentString(msg)
        DrawNotification(false, true)
    end
end

RegisterNetEvent('weed_icecream:client:notify', function(msg, type)
    ShowNotify(msg, type)
end)

-- 3D World Floating Text Helper
function DrawText3D(x, y, z, text)
    local onScreen, _x, _y = World3dToScreen2d(x, y, z)
    if onScreen then
        SetTextScale(0.35, 0.35)
        SetTextFont(4)
        SetTextProportional(1)
        SetTextColour(255, 255, 255, 215)
        SetTextEntry("STRING")
        SetTextCentre(1)
        AddTextComponentString(text)
        DrawText(_x, _y)
        local factor = (string.len(text)) / 370
        DrawRect(_x, _y + 0.0125, 0.015 + factor, 0.03, 10, 15, 25, 160)
    end
end

-- Standalone Interaction Loop (Fallback if ox_target / qb-target not active, or in-cab shortcut)
function StartStandaloneInteractionLoop()
    CreateThread(function()
        local models = Config.TruckModels or { 'mrtasty', 'boxville', 'boxville2', 'boxville3', 'boxville4', 'taco', 'speedo', 'burrito' }
        local hashLookup = {}
        for _, m in ipairs(models) do
            hashLookup[GetHashKey(m)] = true
        end

        while true do
            local sleep = 1000
            local ped = PlayerPedId()
            local pCoords = GetEntityCoords(ped)
            local inVeh = GetVehiclePedIsIn(ped, false)

            if inVeh ~= 0 and hashLookup[GetEntityModel(inVeh)] then
                -- Inside the Ice Cream Truck as Driver or Passenger
                sleep = 5
                if not isUIOpen then
                    -- Show prompt in bottom-left or 3D
                    SetTextComponentFormat("STRING")
                    AddTextComponentString("Press ~INPUT_CONTEXT~ (E) to Open Truck Management Dashboard")
                    DisplayHelpTextFromStringLabel(0, 0, 1, -1)

                    if IsControlJustPressed(0, 38) or IsControlJustPressed(0, 47) then -- E or G
                        OpenTruckUI(inVeh)
                    end
                end
            else
                -- On Foot near an Ice Cream Truck
                local veh = GetClosestVehicle(pCoords.x, pCoords.y, pCoords.z, 5.0, 0, 71)
                if DoesEntityExist(veh) and hashLookup[GetEntityModel(veh)] then
                    sleep = 5
                    local windowPos = GetOffsetFromEntityInWorldCoords(veh, 1.3, 0.2, 0.2)
                    local dist = #(pCoords - windowPos)

                    if dist <= 3.5 and not isUIOpen then
                        DrawText3D(windowPos.x, windowPos.y, windowPos.z + 0.3, "~g~[E]~w~ Munchies Truck Menu")
                        if IsControlJustPressed(0, 38) then -- E Key
                            OpenTruckUI(veh)
                        end
                    end
                end
            end

            Wait(sleep)
        end
    end)
end

-- Target Setup
function SetupTruckInteractions()
    local models = Config.TruckModels or { Config.TruckModel or 'mrtasty' }
    local hashList = {}
    for _, m in ipairs(models) do
        table.insert(hashList, GetHashKey(m))
    end

    if GetResourceState('ox_target') == 'started' then
        exports.ox_target:addModel(hashList, {
            {
                name = 'weed_icecream_truck',
                icon = 'fa-solid fa-ice-cream',
                label = 'Open Ice Cream Truck Window',
                distance = 3.5,
                onSelect = function(data)
                    OpenTruckUI(data.entity)
                end
            }
        })
    elseif GetResourceState('qb-target') == 'started' then
        exports['qb-target']:AddTargetModel(hashList, {
            options = {
                {
                    type = "client",
                    action = function(entity)
                        OpenTruckUI(entity)
                    end,
                    icon = "fas fa-ice-cream",
                    label = "Open Ice Cream Truck Window",
                }
            },
            distance = 3.5
        })
    end
end

-- Open Truck UI
function OpenTruckUI(veh)
    if not DoesEntityExist(veh) then return end

    local netId = NetworkGetNetworkIdFromEntity(veh)
    local ped = PlayerPedId()
    local isDriver = (GetPedInVehicleSeat(veh, -1) == ped) or (GetDistanceBetweenCoords(GetEntityCoords(ped), GetEntityCoords(veh), true) < 3.5)

    currentTruckNetId = netId

    -- Fetch latest truck state from server
    TriggerServerEvent('weed_icecream:server:requestTruckData', netId, isDriver)
end

-- Net Event: Open UI with data
RegisterNetEvent('weed_icecream:client:openUI', function(netId, truckData, isDriver)
    currentTruckNetId = netId
    isUIOpen = true
    SetNuiFocus(true, true)

    SendNUIMessage({
        action = 'open',
        netId = netId,
        isDriver = isDriver,
        items = Config.Items,
        wholesale = Config.WholesaleBuyback,
        stock = truckData.stock,
        prices = truckData.prices,
        jingleActive = truckData.jingleActive,
        sellingActive = truckData.sellingActive,
        totalSales = truckData.totalSales
    })
end)

-- Net Event: Update Truck Data Realtime
RegisterNetEvent('weed_icecream:client:updateTruckData', function(netId, truckData)
    if isUIOpen and currentTruckNetId == netId then
        SendNUIMessage({
            action = 'updateTruck',
            stock = truckData.stock,
            prices = truckData.prices,
            jingleActive = truckData.jingleActive,
            sellingActive = truckData.sellingActive,
            totalSales = truckData.totalSales
        })
    end
end)

-- NUI Callbacks
RegisterNUICallback('close', function(data, cb)
    isUIOpen = false
    SetNuiFocus(false, false)
    currentTruckNetId = nil
    cb('ok')
end)

RegisterNUICallback('buyItem', function(data, cb)
    TriggerServerEvent('weed_icecream:server:buyItem', data.netId, data.itemKey, data.count or 1)
    cb('ok')
end)

RegisterNUICallback('sellWholesale', function(data, cb)
    TriggerServerEvent('weed_icecream:server:sellWholesale', data.netId, data.itemKey, data.count)
    cb('ok')
end)

RegisterNUICallback('depositStock', function(data, cb)
    TriggerServerEvent('weed_icecream:server:depositStock', data.netId, data.itemId, data.count)
    cb('ok')
end)

RegisterNUICallback('toggleJingle', function(data, cb)
    TriggerServerEvent('weed_icecream:server:toggleJingle', data.netId, data.state)
    cb('ok')
end)

RegisterNUICallback('toggleSelling', function(data, cb)
    TriggerServerEvent('weed_icecream:server:toggleSelling', data.netId, data.state)
    cb('ok')
end)

RegisterNUICallback('craftIceCream', function(data, cb)
    TriggerServerEvent('weed_icecream:server:craftIceCream', data)
    cb('ok')
end)

RegisterNUICallback('setTruckLivery', function(data, cb)
    local veh = NetworkGetEntityFromNetworkId(data.netId)
    if DoesEntityExist(veh) then
        ApplyTruckLivery(veh, data.livery or 0)
    end
    cb('ok')
end)

-- Dedicated Single Livery Enforcer & Extras Applier
function ApplyTruckLivery(veh, liveryIndex)
    if not DoesEntityExist(veh) then return end
    
    if Config.ForceSingleLiveryOnly then
        liveryIndex = Config.LockedLiveryIndex or 0
    else
        liveryIndex = tonumber(liveryIndex) or Config.LockedLiveryIndex or 0
    end

    SetVehicleModKit(veh, 0)

    -- Method 1: Native Vehicle Livery
    SetVehicleLivery(veh, liveryIndex)

    -- Method 2: Livery Mod (Mod 48)
    SetVehicleMod(veh, 48, liveryIndex, false)

    -- Method 3: Roof / Mod 24
    SetVehicleMod(veh, 24, liveryIndex, false)

    -- Enable all truck body extras (giant soft-serve roof cone, service hatch, rear dispensers)
    if Config.EnableAllExtras then
        for extraId = 1, 14 do
            if DoesExtraExist(veh, extraId) then
                SetVehicleExtra(veh, extraId, 0)
            end
        end
    end

    -- Clean pearl white / cream paint coat to pop custom livery graphics
    if Config.VehicleColors then
        SetVehicleColours(veh, Config.VehicleColors.primary or 111, Config.VehicleColors.secondary or 111)
    else
        SetVehicleColours(veh, 111, 111)
    end

    if Config.AutoCleanOnSpawn then
        SetVehicleDirtLevel(veh, 0.0)
    end
end

-- Continuous Guard Thread: Ensures the car ONLY ever has that custom livery
CreateThread(function()
    if not Config.ForceSingleLiveryOnly then return end

    local models = Config.TruckModels or { 'weedtruck', 'mrtasty', 'boxville', 'boxville2', 'boxville3', 'boxville4', 'taco', 'speedo', 'burrito' }
    local hashLookup = {}
    for _, m in ipairs(models) do
        hashLookup[GetHashKey(m)] = true
    end

    while true do
        local ped = PlayerPedId()
        local veh = GetVehiclePedIsIn(ped, false)

        if veh ~= 0 and hashLookup[GetEntityModel(veh)] then
            local currentLivery = GetVehicleLivery(veh)
            local expected = Config.LockedLiveryIndex or 0
            if currentLivery ~= expected then
                ApplyTruckLivery(veh, expected)
            end
        end

        Wait(2500)
    end
end)

-- Command: /trucklivery [number]
RegisterCommand('trucklivery', function(source, args)
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)

    if not DoesEntityExist(veh) then
        local pCoords = GetEntityCoords(ped)
        veh = GetClosestVehicle(pCoords.x, pCoords.y, pCoords.z, 4.0, 0, 71)
    end

    if DoesEntityExist(veh) then
        if Config.ForceSingleLiveryOnly then
            ApplyTruckLivery(veh, Config.LockedLiveryIndex or 0)
            ShowNotify(string.format("This dedicated drug van is locked to Custom Livery #%d only!", Config.LockedLiveryIndex or 0), "inform")
        else
            local livery = tonumber(args[1]) or 0
            ApplyTruckLivery(veh, livery)
            ShowNotify(string.format("Applied Truck Livery #%d & Enabled All Roof Extras!", livery), "success")
        end
    else
        ShowNotify("You must be inside or standing near an ice cream truck!", "error")
    end
end, false)

RegisterCommand('setlivery', function(source, args)
    ExecuteCommand('trucklivery ' .. (args[1] or '0'))
end, false)

-- Helper to Spawn the Dedicated Weed Ice Cream Truck
local function SpawnDedicatedTruck()
    local ped = PlayerPedId()
    local pCoords = GetEntityCoords(ped)
    local heading = GetEntityHeading(ped)
    local modelCandidates = { Config.TruckModel or 'weedtruck', 'taco', 'mrtasty', 'boxville4', 'boxville', 'speedo' }
    local chosenHash = nil

    for _, modelName in ipairs(modelCandidates) do
        local mHash = GetHashKey(modelName)
        RequestModel(mHash)
        local waitTimeout = 50
        while not HasModelLoaded(mHash) and waitTimeout > 0 do
            Wait(20)
            waitTimeout = waitTimeout - 1
        end
        if HasModelLoaded(mHash) then
            chosenHash = mHash
            break
        end
    end

    if not chosenHash then
        ShowNotify("Could not load vehicle model.", "error")
        return
    end

    local veh = CreateVehicle(chosenHash, pCoords.x, pCoords.y, pCoords.z, heading, true, false)
    SetPedIntoVehicle(ped, veh, -1)
    SetEntityAsMissionEntity(veh, true, true)
    SetVehicleOnGroundProperly(veh)
    SetVehicleEngineOn(veh, true, true, false)
    SetVehicleDoorsLocked(veh, 1)

    local plate = GetVehicleNumberPlateText(veh)
    TriggerEvent('vehiclekeys:client:SetOwner', plate)
    TriggerEvent('qb-vehiclekeys:client:AddKeys', plate)
    if exports['qbx_vehiclekeys'] then
        pcall(function() exports['qbx_vehiclekeys']:GiveKeys(veh) end)
    end
    
    -- Strictly apply ONLY the custom livery & extras
    ApplyTruckLivery(veh, Config.LockedLiveryIndex or 0)
    SetModelAsNoLongerNeeded(chosenHash)

    ShowNotify("Spawned dedicated Weed Ice Cream Van with Custom Livery!", "success")
end

-- Commands to spawn the dedicated car with ONLY that custom livery
RegisterCommand('weedtruck', function() SpawnDedicatedTruck() end, false)
RegisterCommand('weedvan', function() SpawnDedicatedTruck() end, false)
RegisterCommand('icetruck', function() SpawnDedicatedTruck() end, false)

-- Jingle Sound Loop Handler
RegisterNetEvent('weed_icecream:client:syncJingle', function(netId, state)
    local veh = NetworkGetEntityFromNetworkId(netId)
    if not DoesEntityExist(veh) then return end

    if state then
        activeJingles[netId] = true
        CreateThread(function()
            while activeJingles[netId] and DoesEntityExist(veh) do
                SoundVehicleHornThisFrame(veh)
                Wait(500)
            end
        end)
    else
        activeJingles[netId] = false
    end
end)

-- Consume Treat & Realistic Animations / Screen Shaders
RegisterNetEvent('weed_icecream:client:consumeTreat', function(itemData)
    local ped = PlayerPedId()

    -- Attach Prop
    local propModel = GetHashKey(itemData.prop or "prop_ice_cream")
    RequestModel(propModel)
    while not HasModelLoaded(propModel) do Wait(10) end

    local boneIndex = GetPedBoneIndex(ped, 18905) -- Right Hand
    local prop = CreateObject(propModel, 0.0, 0.0, 0.0, true, true, false)
    AttachEntityToEntity(prop, ped, boneIndex, 0.12, 0.02, 0.05, -70.0, 50.0, 0.0, true, true, false, true, 1, true)

    -- Animation
    local animDict = "mp_player_inteat@burger"
    RequestAnimDict(animDict)
    while not HasAnimDictLoaded(animDict) do Wait(10) end

    TaskPlayAnim(ped, animDict, "mp_player_int_eat_burger", 8.0, -8.0, 4000, 49, 0, false, false, false)

    if lib and lib.progressBar then
        lib.progressBar({
            duration = 4000,
            label = 'Enjoying ' .. (itemData.label or 'treat') .. '...',
            useWhileDead = false,
            canCancel = false,
            disable = { move = false, combat = true }
        })
    else
        Wait(4000)
    end

    -- Cleanup prop & animation
    DeleteObject(prop)
    ClearPedTasks(ped)

    -- Real Ice Cream Status Buffs
    if itemData.category == "icecream" then
        if itemData.heal and itemData.heal > 0 then
            local hp = GetEntityHealth(ped)
            SetEntityHealth(ped, math.min(200, hp + itemData.heal))
        end

        if itemData.buff == "sugar_rush" then
            ShowNotify("Sugar Rush! Increased sprint stamina.", "success")
            RestorePlayerStamina(PlayerId(), 1.0)
            SetRunSprintMultiplierForPlayer(PlayerId(), 1.15)
            SetTimeout(15000, function()
                SetRunSprintMultiplierForPlayer(PlayerId(), 1.0)
            end)
        elseif itemData.buff == "brain_freeze" then
            ShowNotify("Brain freeze!", "inform")
            StartScreenEffect("DrugsMichaelAliensFightIn", 3000, false)
            ShakeGameplayCam("SMALL_EXPLOSION_SHAKE", 0.15)
        end
    end

    -- Weed High Shader & Effects
    if itemData.isWeed then
        ShowNotify("You feel a smooth, euphoric high taking over...", "success")
        drugHighTime = (itemData.highDuration or 60)

        CreateThread(function()
            StartScreenEffect("DrugsTrevorClownsFight", 0, true)
            SetTimecycleModifier("spectator5")
            SetPedMotionBlur(ped, true)

            while drugHighTime > 0 do
                Wait(1000)
                drugHighTime = drugHighTime - 1
                RestorePlayerStamina(PlayerId(), 0.5)
            end

            StopScreenEffect("DrugsTrevorClownsFight")
            ClearTimecycleModifier()
            SetPedMotionBlur(ped, false)
            ShowNotify("The weed high has worn off.", "inform")
        end)
    end
end)

-- NPC Buyer Walking to Truck & Ordering
RegisterNetEvent('weed_icecream:client:spawnNPCBuyer', function(netId, itemKey)
    local veh = NetworkGetEntityFromNetworkId(netId)
    if not DoesEntityExist(veh) then return end

    local vehCoords = GetEntityCoords(veh)
    local models = { "a_m_y_hipster_01", "a_f_y_beach_01", "a_m_m_skater_01", "a_f_y_tourist_01", "a_m_y_skater_01" }
    local modelName = models[math.random(#models)]
    local modelHash = GetHashKey(modelName)

    RequestModel(modelHash)
    while not HasModelLoaded(modelHash) do Wait(10) end

    local spawnOffset = GetOffsetFromEntityInWorldCoords(veh, math.random(-8, 8) + 0.0, math.random(6, 12) + 0.0, 0.0)
    local ped = CreatePed(4, modelHash, spawnOffset.x, spawnOffset.y, spawnOffset.z, 0.0, true, true)
    currentBuyerPed = ped

    SetBlockingOfNonTemporaryEvents(ped, true)
    SetPedCanRagdollFromPlayerImpact(ped, false)

    -- Walk to the passenger side window of the ice cream truck
    local windowPos = GetOffsetFromEntityInWorldCoords(veh, 1.6, 0.5, 0.0)
    TaskGoStraightToCoord(ped, windowPos.x, windowPos.y, windowPos.z, 1.2, -1, 0.0, 0.0)

    -- Wait until NPC arrives at window
    CreateThread(function()
        local timeout = 20
        while timeout > 0 and DoesEntityExist(ped) do
            Wait(1000)
            timeout = timeout - 1
            local dist = #(GetEntityCoords(ped) - windowPos)
            if dist < 2.0 then
                break
            end
        end

        if DoesEntityExist(ped) then
            TaskTurnPedToFaceEntity(ped, veh, 1000)
            Wait(1200)

            -- Play greeting / ordering anim
            local dict = "mp_common"
            RequestAnimDict(dict)
            while not HasAnimDictLoaded(dict) do Wait(10) end
            TaskPlayAnim(ped, dict, "givetake2_a", 8.0, -8.0, 2000, 49, 0, false, false, false)

            -- Trigger server completion for the sale
            TriggerServerEvent('weed_icecream:server:serveNPC', netId)

            Wait(2500)
            -- NPC leaves happily
            local leavePos = GetOffsetFromEntityInWorldCoords(veh, math.random(-15, 15) + 0.0, math.random(-15, -25) + 0.0, 0.0)
            TaskGoStraightToCoord(ped, leavePos.x, leavePos.y, leavePos.z, 1.0, -1, 0.0, 0.0)
            SetTimeout(8000, function()
                if DoesEntityExist(ped) then
                    DeletePed(ped)
                end
            end)
        end
    end)
end)

-- Police Dispatch Alerts
RegisterNetEvent('weed_icecream:client:policeAlert', function()
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)

    if Config.Dispatch == 'ps-dispatch' and exports['ps-dispatch'] then
        exports['ps-dispatch']:SuspiciousActivity()
    elseif Config.Dispatch == 'cd_dispatch' and exports['cd_dispatch'] then
        local data = exports['cd_dispatch']:GetPlayerInfo()
        TriggerServerEvent('cd_dispatch:AddNotification', {
            job_table = {'police', 'sheriff'},
            coords = coords,
            title = '10-31: Suspicious Ice Cream Drug Sale',
            message = 'A pedestrian reported suspicious drug dealing activity from an ice cream van at ' .. data.street,
            flash = 0,
            unique_id = data.unique_id,
            sound = 1,
            blip = {
                sprite = 514,
                scale = 1.0,
                colour = 1,
                flashes = true,
                text = '10-31 Suspicious Ice Cream Van',
                time = 5,
                radius = 0,
            }
        })
    else
        ShowNotify("⚠️ A suspicious passerby noticed the drug transaction and may call 911!", "error")
    end
end)

-- Command: /truckmenu
RegisterCommand('truckmenu', function()
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    if not DoesEntityExist(veh) then
        local pCoords = GetEntityCoords(ped)
        veh = GetClosestVehicle(pCoords.x, pCoords.y, pCoords.z, 5.0, 0, 71)
    end

    if DoesEntityExist(veh) then
        OpenTruckUI(veh)
    else
        ShowNotify("No ice cream truck found nearby.", "error")
    end
end, false)
