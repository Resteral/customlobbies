local open = false
local aiTruckVeh = nil
local aiDriverPed = nil
local aiBlip = nil
local state = { cash = 0, inventory = {} }
local isHost = false

local AIState = {
    currentStopIndex = 1,
    status = 'driving',
    stopTimeRemaining = 0,
    truckNetId = nil,
    driverNetId = nil
}

local function notify(msg, kind)
    if lib and lib.notify then
        lib.notify({
            title = 'Munchies Delivery',
            description = msg,
            type = (kind == 'error' and 'error' or (kind == 'inform' and 'inform' or 'success'))
        })
    else
        BeginTextCommandThefeedPost('STRING')
        AddTextComponentSubstringPlayerName((kind == 'error' and '~r~[MUNCHIES]~s~ ' or '~g~[MUNCHIES]~s~ ') .. msg)
        EndTextCommandThefeedPostTicker(false, false)
    end
end

local function loadModel(name)
    local hash = type(name) == 'number' and name or GetHashKey(name)
    RequestModel(hash)
    local timeout = 0
    while not HasModelLoaded(hash) and timeout < 200 do
        Wait(10)
        timeout = timeout + 1
    end
    return hash
end

local function drawText3D(coords, text)
    local onScreen, x, y = World3dToScreen2d(coords.x, coords.y, coords.z)
    if not onScreen then return end
    SetTextScale(0.35, 0.35)
    SetTextFont(4)
    SetTextProportional(1)
    SetTextColour(255, 255, 255, 220)
    SetTextCentre(true)
    BeginTextCommandDisplayText('STRING')
    AddTextComponentSubstringPlayerName(text)
    EndTextCommandDisplayText(x, y)
    local factor = string.len(text) / 350
    DrawRect(x, y + 0.0125, 0.015 + factor, 0.03, 0, 0, 0, 160)
end

local function ApplyMunchiesVisuals(veh)
    if not DoesEntityExist(veh) then return end
    SetVehicleModKit(veh, 0)
    SetVehicleDirtLevel(veh, 0.0)

    -- Custom Munchies Midnight Onyx & Neon Lime theme
    SetVehicleCustomPrimaryColour(veh, 14, 18, 16)
    SetVehicleCustomSecondaryColour(veh, 124, 255, 77)
    SetVehicleExtraColours(veh, 55, 55)

    -- Enable all custom Munchies food truck extras (rooftop Munchies billboard, counter, vents, steps)
    for extraId = 1, 10 do
        if DoesExtraExist(veh, extraId) then
            SetVehicleExtra(veh, extraId, 0)
        end
    end

    -- Neon Lime Underglow
    SetVehicleNeonLightEnabled(veh, 0, true)
    SetVehicleNeonLightEnabled(veh, 1, true)
    SetVehicleNeonLightEnabled(veh, 2, true)
    SetVehicleNeonLightEnabled(veh, 3, true)
    SetVehicleNeonLightsColour(veh, 124, 255, 77)

    -- Xenon Headlights
    ToggleVehicleMod(veh, 22, true)
    SetVehicleXenonLightsColour(veh, 4)

    -- Dark Window Tint
    SetVehicleWindowTint(veh, 1)

    -- Livery
    SetVehicleLivery(veh, 0)
    SetVehicleMod(veh, 48, 0, false)
end

local function setupTruckBlip(veh)
    if not Config.AITruck.blip or not Config.AITruck.blip.enabled then return end
    if aiBlip and DoesBlipExist(aiBlip) then RemoveBlip(aiBlip) end

    aiBlip = AddBlipForEntity(veh)
    SetBlipSprite(aiBlip, Config.AITruck.blip.sprite or 106)
    SetBlipDisplay(aiBlip, 4)
    SetBlipScale(aiBlip, Config.AITruck.blip.scale or 0.85)
    SetBlipColour(aiBlip, Config.AITruck.blip.color or 2)
    SetBlipAsShortRange(aiBlip, false)
    BeginTextCommandSetBlipName('STRING')
    AddTextComponentString(Config.AITruck.blip.name or 'Munchies Food Truck')
    EndTextCommandSetBlipName(aiBlip)
end

local function sendAIDriverToStop(stopIndex)
    if not Config.AITruck or not Config.AITruck.Stops then return end
    local stop = Config.AITruck.Stops[stopIndex]
    if not stop then return end

    if DoesEntityExist(aiDriverPed) and DoesEntityExist(aiTruckVeh) then
        SetVehicleHandbrake(aiTruckVeh, false)
        ClearPedTasks(aiDriverPed)

        if Config.AITruck.honkOnDeparture then
            StartVehicleHorn(aiTruckVeh, 400, 0, false)
            Wait(400)
            StartVehicleHorn(aiTruckVeh, 400, 0, false)
        end

        local speed = Config.AITruck.drivingSpeed or 14.0
        local style = Config.AITruck.drivingStyle or 786603

        SetDriverAbility(aiDriverPed, 1.0)
        SetDriverAggressiveness(aiDriverPed, 0.0)
        SetPedCombatAttributes(aiDriverPed, 1, false)
        SetPedFleeAttributes(aiDriverPed, 0, false)
        SetBlockingOfNonTemporaryEvents(aiDriverPed, true)
        SetPedKeepTask(aiDriverPed, true)

        TaskVehicleDriveToCoordLongRange(
            aiDriverPed,
            aiTruckVeh,
            stop.coords.x,
            stop.coords.y,
            stop.coords.z,
            speed,
            style,
            6.0
        )
    end
end

local function spawnAITruckNetworked()
    local firstStop = Config.AITruck.Stops[1]
    local spawnCoords = firstStop and firstStop.coords or vector4(215.11, -810.05, 30.73, 160.0)

    local vehHash = loadModel(Config.AITruck.truckModel or 'taco')
    local pedHash = loadModel(Config.AITruck.driverModel or 's_m_m_linecook')

    if not HasModelLoaded(vehHash) or not HasModelLoaded(pedHash) then return end

    aiTruckVeh = CreateVehicle(vehHash, spawnCoords.x, spawnCoords.y, spawnCoords.z, spawnCoords.w, true, false)
    SetEntityAsMissionEntity(aiTruckVeh, true, true)
    SetVehicleOnGroundProperly(aiTruckVeh)
    SetVehicleDoorsLocked(aiTruckVeh, 2)
    SetVehicleEngineOn(aiTruckVeh, true, true, false)
    SetVehicleHasBeenOwnedByPlayer(aiTruckVeh, false)
    SetVehicleCanBeUsedByFleeingPeds(aiTruckVeh, false)

    aiDriverPed = CreatePedInsideVehicle(aiTruckVeh, 26, pedHash, -1, true, false)
    SetEntityAsMissionEntity(aiDriverPed, true, true)
    SetBlockingOfNonTemporaryEvents(aiDriverPed, true)
    SetPedCanBeKnockedOffVehicle(aiDriverPed, 1)
    SetPedCanRagdollFromPlayerImpact(aiDriverPed, false)
    SetDriverAbility(aiDriverPed, 1.0)
    SetDriverAggressiveness(aiDriverPed, 0.0)

    ApplyMunchiesVisuals(aiTruckVeh)

    SetModelAsNoLongerNeeded(vehHash)
    SetModelAsNoLongerNeeded(pedHash)

    setupTruckBlip(aiTruckVeh)

    local truckNet = VehToNet(aiTruckVeh)
    local driverNet = PedToNet(aiDriverPed)
    TriggerServerEvent('munchies:server:registerAITruckNetId', truckNet, driverNet)

    TriggerServerEvent('munchies:server:reportStopArrived', 1)
end

local function openMenu(view)
    open = true
    SetNuiFocus(true, true)
    TriggerServerEvent('munchies:server:requestState')
    SendNUIMessage({
        action = 'open',
        menu = Config.Menu,
        state = state,
        view = view or 'shop'
    })
end

local function closeMenu()
    open = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'close' })
end

RegisterCommand('munchies', function()
    openMenu('shop')
end, false)

RegisterCommand('munchiesbag', function()
    openMenu('bag')
end, false)

RegisterCommand('spawntruck', function(source, args)
    local modelChoice = (args and args[1]) or Config.AITruck.truckModel or 'taco'
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local heading = GetEntityHeading(ped)
    local forward = GetEntityForwardVector(ped)
    local spawnCoords = coords + forward * 3.5

    local vehHash = loadModel(modelChoice)
    if HasModelLoaded(vehHash) then
        local veh = CreateVehicle(vehHash, spawnCoords.x, spawnCoords.y, spawnCoords.z, heading, true, false)
        SetVehicleOnGroundProperly(veh)
        SetEntityAsMissionEntity(veh, true, true)
        SetVehicleNeedsToBeHotwired(veh, false)
        SetVehicleEngineOn(veh, true, true, false)
        SetVehicleDoorsLocked(veh, 1)
        ApplyMunchiesVisuals(veh)
        TaskWarpPedIntoVehicle(ped, veh, -1)
        SetModelAsNoLongerNeeded(vehHash)

        local plate = GetVehicleNumberPlateText(veh)
        TriggerEvent('vehiclekeys:client:SetOwner', plate)
        TriggerEvent('qb-vehiclekeys:client:AddKeys', plate)
        if exports['qbx_vehiclekeys'] then
            pcall(function() exports['qbx_vehiclekeys']:GiveKeys(veh) end)
        end

        notify(('Spawned custom %s truck with Munchies styling & keys!'):format(modelChoice), 'success')
    else
        notify('Failed to load truck model: ' .. tostring(modelChoice), 'error')
    end
end, false)

RegisterCommand('settruckmodel', function(source, args)
    local newModel = args and args[1]
    if not newModel then
        notify('Usage: /settruckmodel [taco | mrtasty | boxville4 | speedo]', 'inform')
        return
    end
    Config.AITruck.truckModel = newModel
    if DoesEntityExist(aiTruckVeh) then DeleteVehicle(aiTruckVeh) end
    if DoesEntityExist(aiDriverPed) then DeletePed(aiDriverPed) end
    if aiBlip and DoesBlipExist(aiBlip) then RemoveBlip(aiBlip) end
    spawnAITruckNetworked()
    notify(('Set AI truck model to %s and respawned!'):format(newModel), 'success')
end, false)

RegisterCommand('respawntruck', function()
    if DoesEntityExist(aiTruckVeh) then DeleteVehicle(aiTruckVeh) end
    if DoesEntityExist(aiDriverPed) then DeletePed(aiDriverPed) end
    if aiBlip and DoesBlipExist(aiBlip) then RemoveBlip(aiBlip) end
    spawnAITruckNetworked()
    notify('Munchies AI truck respawned at Stop #1', 'success')
end, false)

RegisterCommand('munchiestp', function()
    if DoesEntityExist(aiTruckVeh) then
        local coords = GetEntityCoords(aiTruckVeh)
        SetEntityCoords(PlayerPedId(), coords.x, coords.y + 2.0, coords.z + 1.0, false, false, false, true)
        notify('Teleported to Munchies Food Truck', 'success')
    elseif AIState.truckNetId and NetworkDoesNetworkIdExist(AIState.truckNetId) then
        local veh = NetToVeh(AIState.truckNetId)
        if DoesEntityExist(veh) then
            local coords = GetEntityCoords(veh)
            SetEntityCoords(PlayerPedId(), coords.x, coords.y + 2.0, coords.z + 1.0, false, false, false, true)
            notify('Teleported to Munchies Food Truck', 'success')
        end
    else
        notify('Munchies truck is not currently found', 'error')
    end
end, false)

RegisterNUICallback('close', function(_, cb)
    closeMenu()
    cb('ok')
end)

RegisterNUICallback('order', function(d, cb)
    TriggerServerEvent('munchies:server:order', d.itemId, d.quantity)
    cb('ok')
end)

RegisterNUICallback('useItem', function(d, cb)
    TriggerServerEvent('munchies:server:useItem', d.itemId)
    cb('ok')
end)

RegisterNetEvent('munchies:client:state', function(s)
    state = s
    SendNUIMessage({ action = 'state', state = state })
end)

RegisterNetEvent('munchies:client:syncAIState', function(syncedState)
    AIState = syncedState
    if AIState.truckNetId and NetworkDoesNetworkIdExist(AIState.truckNetId) then
        local veh = NetToVeh(AIState.truckNetId)
        if DoesEntityExist(veh) then
            aiTruckVeh = veh
            if not aiBlip or not DoesBlipExist(aiBlip) then
                setupTruckBlip(aiTruckVeh)
            end
        end
    end
    if AIState.driverNetId and NetworkDoesNetworkIdExist(AIState.driverNetId) then
        local ped = NetToPed(AIState.driverNetId)
        if DoesEntityExist(ped) then
            aiDriverPed = ped
        end
    end
end)

RegisterNetEvent('munchies:client:instructAIDrive', function(targetStopIndex)
    if NetworkGetEntityOwner(aiTruckVeh) == PlayerId() or isHost then
        sendAIDriverToStop(targetStopIndex)
    end
end)

RegisterNetEvent('munchies:client:broadcastArrival', function(stopName, durationSeconds)
    notify(('🚚 Munchies Truck is now OPEN at %s for the next %s seconds!'):format(stopName, durationSeconds), 'success')
end)

RegisterNetEvent('munchies:client:purchaseComplete', function(p)
    state.cash = p.cash
    state.inventory = p.inventory
    notify(('Bought %sx %s for $%s.'):format(p.quantity, p.item, p.total), 'success')
    SendNUIMessage({ action = 'purchaseComplete', state = state })
end)

RegisterNetEvent('munchies:client:notify', function(m, k)
    notify(m, k)
    SendNUIMessage({ action = 'toast', message = m, kind = k })
end)

RegisterNetEvent('munchies:client:consume', function(p)
    state.inventory = p.inventory
    local ped = PlayerPedId()
    SetEntityHealth(ped, math.min(GetEntityMaxHealth(ped), GetEntityHealth(ped) + (p.health or 0)))
    notify('Consumed ' .. p.name, 'success')
    SendNUIMessage({ action = 'state', state = state })
end)

-- Main AI Driving & Interaction Thread
CreateThread(function()
    Wait(2000)
    TriggerServerEvent('munchies:server:requestAIState')
    Wait(500)

    if Config.AITruck and Config.AITruck.enabled then
        -- Check if vehicle exists in network, if not spawn as host
        if not AIState.truckNetId or not NetworkDoesNetworkIdExist(AIState.truckNetId) then
            isHost = true
            spawnAITruckNetworked()
        end
    end

    while true do
        local wait = 800
        local ped = PlayerPedId()
        local pCoords = GetEntityCoords(ped)

        local truckEntity = aiTruckVeh
        if not DoesEntityExist(truckEntity) and AIState.truckNetId and NetworkDoesNetworkIdExist(AIState.truckNetId) then
            truckEntity = NetToVeh(AIState.truckNetId)
            aiTruckVeh = truckEntity
        end

        if DoesEntityExist(truckEntity) then
            local tCoords = GetEntityCoords(truckEntity)
            local dist = #(pCoords - tCoords)

            -- Check arrival or unstuck if driving and network owner
            if AIState.status == 'driving' and (NetworkGetEntityOwner(truckEntity) == PlayerId() or isHost) then
                local currentTargetStop = Config.AITruck.Stops[AIState.currentStopIndex]
                if currentTargetStop then
                    local targetPos = vector3(currentTargetStop.coords.x, currentTargetStop.coords.y, currentTargetStop.coords.z)
                    local distToStop = #(tCoords - targetPos)

                    if distToStop <= 7.0 then
                        SetVehicleHandbrake(truckEntity, true)
                        BringVehicleToHalt(truckEntity, 2.0, 1, false)

                        if Config.AITruck.honkOnArrival then
                            StartVehicleHorn(truckEntity, 1200, 0, false)
                        end

                        TriggerServerEvent('munchies:server:reportStopArrived', AIState.currentStopIndex)
                    else
                        local curSpeed = GetEntitySpeed(truckEntity)
                        if curSpeed < 0.2 and distToStop > 12.0 then
                            if not stuckCounter then stuckCounter = 0 end
                            stuckCounter = stuckCounter + 1
                            if stuckCounter >= 8 then
                                stuckCounter = 0
                                sendAIDriverToStop(AIState.currentStopIndex)
                            end
                        else
                            stuckCounter = 0
                        end
                    end
                end
            end

            -- Interaction Proximity
            if dist < (Config.AITruck.drawDistance or 25.0) then
                wait = 0
                local currentStopInfo = Config.AITruck.Stops[AIState.currentStopIndex]
                local stopName = currentStopInfo and currentStopInfo.name or 'Stop'

                if dist < (Config.AITruck.interactionDistance or 4.0) and not open then
                    if AIState.status == 'stopped' then
                        drawText3D(tCoords + vector3(0, 0, 1.25), ('~g~[E]~w~ Order Munchies (~y~%s~w~ - %ss left)'):format(stopName, AIState.stopTimeRemaining))
                        if IsControlJustReleased(0, 38) then
                            openMenu('shop')
                        end
                    else
                        drawText3D(tCoords + vector3(0, 0, 1.25), ('~y~Munchies Truck Driving to %s'):format(stopName))
                    end
                end
            end
        end

        Wait(wait)
    end
end)

AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() ~= resourceName then return end
    if isHost then
        if DoesEntityExist(aiTruckVeh) then DeleteVehicle(aiTruckVeh) end
        if DoesEntityExist(aiDriverPed) then DeletePed(aiDriverPed) end
    end
    if aiBlip and DoesBlipExist(aiBlip) then RemoveBlip(aiBlip) end
end)
