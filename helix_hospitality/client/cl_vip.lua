local activeBottleServiceProps = {}
local activeParticles = {}

-- ============================================================================
-- VIP BOTTLE SERVICE CEREMONY
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:playBottleServiceCeremony', function(serverId, venueId, packageId, targetTableId)
    local targetPed = GetPlayerPed(GetPlayerFromServerId(serverId))
    if not DoesEntityExist(targetPed) then return end

    local pkg = Config.BottleService.Packages[packageId]
    if not pkg then return end

    -- Load particle asset
    RequestNamedPtfxAsset('core')
    while not HasNamedPtfxAssetLoaded('core') do Wait(10) end

    -- Load Tray model
    local trayModel = Config.BottleService.TrayProp
    RequestModel(trayModel)
    while not HasModelLoaded(trayModel) do Wait(10) end

    -- Load Bottle model
    local bottleModel = pkg.bottleProp or `prop_champ_01a`
    RequestModel(bottleModel)
    while not HasModelLoaded(bottleModel) do Wait(10) end

    -- Load carry animation
    RequestAnimDict('anim@heists@box_carry@')
    while not HasAnimDictLoaded('anim@heists@box_carry@') do Wait(10) end

    local pedCoords = GetEntityCoords(targetPed)
    local trayObj = CreateObject(trayModel, pedCoords.x, pedCoords.y, pedCoords.z, false, false, false)
    AttachEntityToEntity(trayObj, targetPed, GetPedBoneIndex(targetPed, 28422), 0.0, -0.1, -0.05, 0.0, 0.0, 0.0, true, true, false, true, 1, true)

    local bottleObj = CreateObject(bottleModel, pedCoords.x, pedCoords.y, pedCoords.z, false, false, false)
    AttachEntityToEntity(bottleObj, trayObj, 0, 0.0, 0.0, 0.15, 0.0, 0.0, 0.0, true, true, false, true, 1, true)

    table.insert(activeBottleServiceProps, trayObj)
    table.insert(activeBottleServiceProps, bottleObj)

    -- Play carrying animation
    TaskPlayAnim(targetPed, 'anim@heists@box_carry@', 'idle', 8.0, -8.0, 15000, 49, 0, false, false, false)

    -- Start Golden Sparkler Particle Effect
    UseParticleFxAssetNextCall('core')
    local ptfx = StartParticleFxLoopedOnEntity('exp_grd_flare', bottleObj, 0.0, 0.0, 0.25, 0.0, 0.0, 0.0, 0.8, false, false, false)

    if pkg.sparklerColor then
        SetParticleFxLoopedColour(ptfx, pkg.sparklerColor.r, pkg.sparklerColor.g, pkg.sparklerColor.b, false)
    end
    table.insert(activeParticles, ptfx)

    -- Sparkler duration (15 seconds)
    SetTimeout(15000, function()
        if DoesEntityExist(targetPed) then
            ClearPedTasks(targetPed)
        end
        for _, p in ipairs(activeParticles) do
            StopParticleFxLooped(p, false)
        end
        for _, obj in ipairs(activeBottleServiceProps) do
            if DoesEntityExist(obj) then DeleteEntity(obj) end
        end
        activeParticles = {}
        activeBottleServiceProps = {}
    end)
end)

-- Open VIP Order Menu NUI
RegisterNetEvent('helix_hospitality:client:openVIPMenu', function(venueId, tableId)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open_vip_menu',
        venueId = venueId,
        tableId = tableId,
        packages = Config.BottleService.Packages
    })
end)

RegisterNUICallback('order_bottle_service', function(data, cb)
    SetNuiFocus(false, false)
    TriggerServerEvent('helix_hospitality:server:orderBottleService', data.venueId, data.packageId, data.tableId)
    cb({ status = 'ok' })
end)

-- Cleanup on stop
AddEventHandler('onResourceStop', function(res)
    if res ~= GetCurrentResourceName() then return end
    for _, p in ipairs(activeParticles) do StopParticleFxLooped(p, false) end
    for _, obj in ipairs(activeBottleServiceProps) do if DoesEntityExist(obj) then DeleteEntity(obj) end end
end)
