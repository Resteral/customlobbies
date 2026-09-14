local currentZoneId = nil
local isInsideZone = false
local isCornerSelling = false
local activeBuyerPed = nil
local activeZones = {}
local activeBlips = {}

-- Request Active Zones on Spawn
CreateThread(function()
    Wait(1500)
    TriggerServerEvent('standalone_turfs:sv:requestZones')
end)

-- Receive Synced Zones from Server
RegisterNetEvent('standalone_turfs:cl:syncAllZones', function(zones)
    activeZones = zones

    -- Re-create map blips
    for _, blip in pairs(activeBlips) do
        if DoesBlipExist(blip) then RemoveBlip(blip) end
    end
    activeBlips = {}

    for zoneId, zone in pairs(activeZones) do
        if zone.blip and zone.coords then
            local blip = AddBlipForCoord(zone.coords.x, zone.coords.y, zone.coords.z)
            SetBlipSprite(blip, zone.blip.sprite or 378)
            SetBlipDisplay(blip, 4)
            SetBlipScale(blip, zone.blip.scale or 0.8)
            SetBlipColour(blip, zone.blip.color or 2)
            SetBlipAsShortRange(blip, true)
            BeginTextCommandSetBlipName("STRING")
            AddTextComponentSubstringPlayerName(zone.blip.label or ("Business: " .. (zone.label or zoneId)))
            EndTextCommandSetBlipName(blip)
            activeBlips[zoneId] = blip
        end
    end
end)

-- (3D World Ground Markers removed for realistic immersive gameplay - UI HUD indicates territory presence and points accumulation)

-- Robust Zone Occupancy State & Closest-Zone Decision Thread (Prevents Network Overflows with Adjacent/Overlapping Businesses)
CreateThread(function()
    while true do
        Wait(350)
        local ped = PlayerPedId()
        local pCoords = GetEntityCoords(ped)

        local bestZoneId = nil
        local bestDist = 999999.0

        -- Find the single closest valid zone among all active zones
        for zoneId, zone in pairs(activeZones) do
            if zone.coords then
                local dist = #(pCoords - vec3(zone.coords.x, zone.coords.y, zone.coords.z))
                local radius = zone.radius or 16.0

                if dist <= radius and dist < bestDist then
                    bestDist = dist
                    bestZoneId = zoneId
                end
            end
        end

        -- Handle state transition cleanly
        if bestZoneId ~= currentZoneId then
            -- Leave previous zone if any
            if currentZoneId then
                TriggerServerEvent('standalone_turfs:sv:leaveZone', currentZoneId)
            end

            currentZoneId = bestZoneId

            if bestZoneId then
                isInsideZone = true
                PlaySoundFrontend(-1, "CHECKPOINT_NORMAL", "HUD_MINI_GAME_SOUNDSET", true)
                TriggerServerEvent('standalone_turfs:sv:enterZone', bestZoneId)
                local zCfg = activeZones[bestZoneId]
                if zCfg and zCfg.label then
                    ShowNotify("📍 Entered " .. zCfg.label .. " • In Zone", "inform")
                end
            else
                isInsideZone = false
                SendNUIMessage({ action = "hideTurfHUD" })
            end
        end
    end
end)

local latestHudData = nil
local isCursorActive = false

-- Turf HUD Sync from Server (Includes Protection Rep, Revenue Boost, and Seizure Status)
RegisterNetEvent('standalone_turfs:cl:syncTurfHUD', function(data)
    latestHudData = data
    SendNUIMessage({
        action = "updateTurfHUD",
        zoneId = data.zoneId,
        label = data.label,
        owner = data.owner,
        protectionRep = data.protectionRep,
        repMultiplier = data.repMultiplier,
        projectedPayout = data.projectedPayout,
        progress = data.progress,
        isCapturing = data.isCapturing,
        isContested = data.isContested,
        captureTime = data.captureTime,
        turfBonus = Config.TurfBonusMultiplier,
        isPurchased = data.isPurchased,
        canBuy = data.canBuy,
        buyPrice = data.buyPrice,
        isRobbing = data.isRobbing,
        robSeconds = data.robSeconds,
        robTotal = data.robTotal,
        cooldownRemaining = data.cooldownRemaining,
        isRobber = data.isRobber,
        vaultCash = data.vaultCash,
        bankConnected = data.bankConnected,
        bankSecondsRemaining = data.bankSecondsRemaining,
        canBankRun = data.canBankRun,
        isOwner = data.isOwner,
        supplies = data.supplies,
        guardLevel = data.guardLevel,
        isEarningRep = data.isEarningRep,
        repGainRemaining = data.repGainRemaining,
        repGainTotal = data.repGainTotal,
        ownerCrewTag = data.ownerCrewTag,
        protectorCrewTag = data.protectorCrewTag,
        activeJobs = data.activeJobs,
        maxJobs = data.maxJobs,
        contrabandRisk = data.contrabandRisk,
        graffitiTags = data.graffitiTags,
        isHacked = data.isHacked,
        importsCount = data.importsCount or 0,
        exportsCount = data.exportsCount or 0,
        tradeVolume = data.tradeVolume or 0,
        materials = data.materials or { iron = 15, copper = 10, plastic = 15, steel = 8, gunpowder = 6, rubber = 5, aluminum = 4, electronic_kit = 2 },
        streetName = (function()
            local pCoords = GetEntityCoords(PlayerPedId())
            local sHash, _ = GetStreetNameAtCoord(pCoords.x, pCoords.y, pCoords.z)
            return GetStreetNameFromHashKey(sHash)
        end)()
    })
end)

-- Direct Hotkey & Cursor Mode Interaction Loop (While in Zone)
CreateThread(function()
    while true do
        local sleep = 500
        if isInsideZone and latestHudData then
            sleep = 0

            -- [E] Quick Hotkey: Acquire Title Deed
            if IsControlJustPressed(0, 38) and latestHudData.canBuy then
                TriggerServerEvent('standalone_turfs:sv:buyBusiness', latestHudData.zoneId)
                Wait(500)
            end

            -- [B] Quick Hotkey: Start Bank Run Delivery
            if IsControlJustPressed(0, 29) and latestHudData.canBankRun then
                TriggerServerEvent('standalone_turfs:sv:startBankRun', latestHudData.zoneId)
                Wait(500)
            end

            -- [G] Quick Hotkey: Rob Business Safe (For Rivals)
            if IsControlJustPressed(0, 47) and not latestHudData.isOwner and not latestHudData.isRobbing then
                TriggerServerEvent('standalone_turfs:sv:startRobbery', latestHudData.zoneId)
                Wait(500)
            end
        end
        Wait(sleep)
    end
end)

-- Cursor Mode Toggle (Press Z or H to unlock mouse cursor and click buttons directly!)
RegisterCommand('turfcursor', function()
    if isInsideZone then
        isCursorActive = not isCursorActive
        SetNuiFocus(isCursorActive, isCursorActive)
        SendNUIMessage({ action = "setCursorState", active = isCursorActive })
    end
end, false)

RegisterCommand('bizinteract', function()
    ExecuteCommand('turfcursor')
end, false)

RegisterCommand('bizmgmt', function()
    ExecuteCommand('turfcursor')
end, false)

RegisterKeyMapping('turfcursor', 'Toggle Business HUD Mouse Cursor', 'keyboard', 'Z')
RegisterKeyMapping('bizmgmt', 'Open Business Management Menu', 'keyboard', 'M')

RegisterNUICallback('closeCursorMode', function(data, cb)
    isCursorActive = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "setCursorState", active = false })
    cb('ok')
end)

RegisterNUICallback('buyBusinessDeed', function(data, cb)
    TriggerServerEvent('standalone_turfs:sv:buyBusiness', data.zoneId)
    cb('ok')
end)

RegisterNUICallback('startRobbery', function(data, cb)
    TriggerServerEvent('standalone_turfs:sv:startRobbery', data.zoneId)
    cb('ok')
end)

RegisterNUICallback('startBankRun', function(data, cb)
    TriggerServerEvent('standalone_turfs:sv:startBankRun', data.zoneId)
    cb('ok')
end)

RegisterNUICallback('startRestockRun', function(data, cb)
    TriggerServerEvent('standalone_turfs:sv:startRestockRun', data.zoneId, data.depotKey)
    cb('ok')
end)

RegisterNUICallback('startVIPRun', function(data, cb)
    TriggerServerEvent('standalone_turfs:sv:startVIPRun', data.zoneId, data.vipKey)
    cb('ok')
end)

RegisterNUICallback('upgradeSecurity', function(data, cb)
    TriggerServerEvent('standalone_turfs:sv:upgradeSecurity', data.zoneId, data.level)
    cb('ok')
end)

-- Bank Run Client Tracking & Delivery Loop
local currentBankRun = nil
local bankDropoffBlip = nil

RegisterNetEvent('standalone_turfs:cl:startBankRun', function(data)
    currentBankRun = data

    if DoesBlipExist(bankDropoffBlip) then RemoveBlip(bankDropoffBlip) end

    local coords = data.dropoff.coords
    bankDropoffBlip = AddBlipForCoord(coords.x, coords.y, coords.z)
    SetBlipSprite(bankDropoffBlip, 500) -- Safe / Bank briefcase
    SetBlipDisplay(bankDropoffBlip, 4)
    SetBlipScale(bankDropoffBlip, 1.0)
    SetBlipColour(bankDropoffBlip, 2) -- Green
    SetBlipRoute(bankDropoffBlip, true)
    SetBlipRouteColour(bankDropoffBlip, 2)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName("Bank Dropoff: " .. data.dropoff.label)
    EndTextCommandSetBlipName(bankDropoffBlip)

    StartBankRunDeliveryLoop()
end)

RegisterNetEvent('standalone_turfs:cl:finishBankRun', function()
    if DoesBlipExist(bankDropoffBlip) then
        RemoveBlip(bankDropoffBlip)
        bankDropoffBlip = nil
    end
    currentBankRun = nil
end)

function StartBankRunDeliveryLoop()
    CreateThread(function()
        while currentBankRun do
            local sleep = 1000
            local ped = PlayerPedId()
            local pCoords = GetEntityCoords(ped)
            local dropCoords = currentBankRun.dropoff.coords
            local dist = #(pCoords - vec3(dropCoords.x, dropCoords.y, dropCoords.z))

            if dist < 45.0 then
                sleep = 0
                -- Draw 3D Bank Deposit Marker
                DrawMarker(1, dropCoords.x, dropCoords.y, dropCoords.z - 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 3.0, 1.0, 46, 196, 182, 180, false, false, 2, false, nil, nil, false)
                DrawMarker(29, dropCoords.x, dropCoords.y, dropCoords.z + 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 255, 209, 102, 220, false, false, 2, true, nil, nil, false)

                if dist < 2.5 then
                    SetTextComponentFormat("STRING")
                    AddTextComponentString("Press ~INPUT_CONTEXT~ to Deposit Business Cash & Establish Bank Connection")
                    DisplayHelpTextFromStringLabel(0, 0, 1, -1)

                    if IsControlJustPressed(0, 38) then -- E key
                        -- Play cash deposit animation
                        local dict = "mp_common"
                        RequestAnimDict(dict)
                        while not HasAnimDictLoaded(dict) do Wait(10) end
                        TaskPlayAnim(ped, dict, "givetake2_a", 8.0, -8.0, 2500, 49, 0, false, false, false)

                        TriggerServerEvent('standalone_turfs:sv:completeBankDropoff', currentBankRun.zoneId, currentBankRun.dropoffKey)
                        Wait(1000)
                    end
                end
            end

            Wait(sleep)
        end
    end)
end

-- ==============================================================================
-- RESTOCK SUPPLY RUN CLIENT TRACKING & CARGO DELIVERY LOOP
-- ==============================================================================
local currentRestockRun = nil
local restockBlip = nil
local isHoldingCargo = false

RegisterNetEvent('standalone_turfs:cl:startRestockRun', function(data)
    currentRestockRun = data
    isHoldingCargo = false

    if DoesBlipExist(restockBlip) then RemoveBlip(restockBlip) end

    local coords = data.depot.coords
    restockBlip = AddBlipForCoord(coords.x, coords.y, coords.z)
    SetBlipSprite(restockBlip, 478) -- Crate / cargo depot
    SetBlipDisplay(restockBlip, 4)
    SetBlipScale(restockBlip, 1.0)
    SetBlipColour(restockBlip, 5) -- Yellow
    SetBlipRoute(restockBlip, true)
    SetBlipRouteColour(restockBlip, 5)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName("Supply Depot: " .. data.depot.label)
    EndTextCommandSetBlipName(restockBlip)

    StartRestockDeliveryLoop()
end)

RegisterNetEvent('standalone_turfs:cl:finishRestockRun', function()
    if DoesBlipExist(restockBlip) then
        RemoveBlip(restockBlip)
        restockBlip = nil
    end
    currentRestockRun = nil
    isHoldingCargo = false
end)

function StartRestockDeliveryLoop()
    CreateThread(function()
        while currentRestockRun do
            local sleep = 1000
            local ped = PlayerPedId()
            local pCoords = GetEntityCoords(ped)

            if not isHoldingCargo then
                -- Phase 1: Go to Depot and Pick Up Cargo Crate
                local depotCoords = currentRestockRun.depot.coords
                local dist = #(pCoords - vec3(depotCoords.x, depotCoords.y, depotCoords.z))

                if dist < 45.0 then
                    sleep = 0
                    DrawMarker(1, depotCoords.x, depotCoords.y, depotCoords.z - 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 3.5, 1.2, 255, 209, 102, 180, false, false, 2, false, nil, nil, false)
                    DrawMarker(478, depotCoords.x, depotCoords.y, depotCoords.z + 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.2, 1.2, 1.2, 255, 209, 102, 220, false, false, 2, true, nil, nil, false)

                    if dist < 2.8 then
                        SetTextComponentFormat("STRING")
                        AddTextComponentString("Press ~INPUT_CONTEXT~ to Load Raw Supply Cargo Crates")
                        DisplayHelpTextFromStringLabel(0, 0, 1, -1)

                        if IsControlJustPressed(0, 38) then -- E key
                            isHoldingCargo = true
                            ShowNotify("Cargo Loaded! Deliver the supplies back to your business warehouse!", "success")

                            -- Update GPS route to return to business
                            if DoesBlipExist(restockBlip) then RemoveBlip(restockBlip) end
                            local bCoords = currentRestockRun.businessCoords
                            restockBlip = AddBlipForCoord(bCoords.x, bCoords.y, bCoords.z)
                            SetBlipSprite(restockBlip, 478)
                            SetBlipScale(restockBlip, 1.1)
                            SetBlipColour(restockBlip, 2) -- Green
                            SetBlipRoute(restockBlip, true)
                            SetBlipRouteColour(restockBlip, 2)
                            BeginTextCommandSetBlipName("STRING")
                            AddTextComponentSubstringPlayerName("Deliver Supplies to Business")
                            EndTextCommandSetBlipName(restockBlip)

                            Wait(1000)
                        end
                    end
                end
            else
                -- Phase 2: Return to Business and Deliver Cargo
                local bCoords = currentRestockRun.businessCoords
                local dist = #(pCoords - vec3(bCoords.x, bCoords.y, bCoords.z))

                if dist < 45.0 then
                    sleep = 0
                    DrawMarker(1, bCoords.x, bCoords.y, bCoords.z - 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.0, 4.0, 1.2, 124, 255, 77, 180, false, false, 2, false, nil, nil, false)

                    if dist < 3.5 then
                        SetTextComponentFormat("STRING")
                        AddTextComponentString("Press ~INPUT_CONTEXT~ to Stock Warehouse & Complete Restock Run")
                        DisplayHelpTextFromStringLabel(0, 0, 1, -1)

                        if IsControlJustPressed(0, 38) then
                            local dict = "anim@heists@box_carry@"
                            RequestAnimDict(dict)
                            while not HasAnimDictLoaded(dict) do Wait(10) end
                            TaskPlayAnim(ped, dict, "idle", 8.0, -8.0, 2000, 49, 0, false, false, false)

                            TriggerServerEvent('standalone_turfs:sv:completeRestockRun', currentRestockRun.zoneId, currentRestockRun.depotKey)
                            Wait(1000)
                        end
                    end
                end
            end

            Wait(sleep)
        end
    end)
end

-- ==============================================================================
-- VIP CONTRABAND SMUGGLE DELIVERY CLIENT TRACKING LOOP
-- ==============================================================================
local currentVIPRun = nil
local vipBlip = nil

RegisterNetEvent('standalone_turfs:cl:startVIPRun', function(data)
    currentVIPRun = data

    if DoesBlipExist(vipBlip) then RemoveBlip(vipBlip) end

    local coords = data.vipData.coords
    vipBlip = AddBlipForCoord(coords.x, coords.y, coords.z)
    SetBlipSprite(vipBlip, 501) -- Briefcase / VIP Deal
    SetBlipDisplay(vipBlip, 4)
    SetBlipScale(vipBlip, 1.1)
    SetBlipColour(vipBlip, 1) -- Red
    SetBlipRoute(vipBlip, true)
    SetBlipRouteColour(vipBlip, 1)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName("VIP Smuggle Buyer: " .. data.vipData.label)
    EndTextCommandSetBlipName(vipBlip)

    StartVIPDeliveryLoop()
end)

RegisterNetEvent('standalone_turfs:cl:finishVIPRun', function()
    if DoesBlipExist(vipBlip) then
        RemoveBlip(vipBlip)
        vipBlip = nil
    end
    currentVIPRun = nil
end)

function StartVIPDeliveryLoop()
    CreateThread(function()
        while currentVIPRun do
            local sleep = 1000
            local ped = PlayerPedId()
            local pCoords = GetEntityCoords(ped)
            local dropCoords = currentVIPRun.vipData.coords
            local dist = #(pCoords - vec3(dropCoords.x, dropCoords.y, dropCoords.z))

            if dist < 45.0 then
                sleep = 0
                DrawMarker(1, dropCoords.x, dropCoords.y, dropCoords.z - 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 3.5, 1.2, 230, 57, 70, 180, false, false, 2, false, nil, nil, false)
                DrawMarker(501, dropCoords.x, dropCoords.y, dropCoords.z + 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.2, 1.2, 1.2, 230, 57, 70, 220, false, false, 2, true, nil, nil, false)

                if dist < 2.8 then
                    SetTextComponentFormat("STRING")
                    AddTextComponentString("Press ~INPUT_CONTEXT~ to Hand Off Contraband to VIP Buyer")
                    DisplayHelpTextFromStringLabel(0, 0, 1, -1)

                    if IsControlJustPressed(0, 38) then
                        local dict = "mp_common"
                        RequestAnimDict(dict)
                        while not HasAnimDictLoaded(dict) do Wait(10) end
                        TaskPlayAnim(ped, dict, "givetake2_a", 8.0, -8.0, 2500, 49, 0, false, false, false)

                        TriggerServerEvent('standalone_turfs:sv:completeVIPRun', currentVIPRun.zoneId, currentVIPRun.vipKey)
                        Wait(1000)
                    end
                end
            end

            Wait(sleep)
        end
    end)
end

-- Rob Business Command
RegisterCommand('robbusiness', function()
    if currentZoneId then
        TriggerServerEvent('standalone_turfs:sv:startRobbery', currentZoneId)
    else
        ShowNotify("You are not standing in any commercial business zone to rob!", "error")
    end
end, false)

RegisterCommand('heist', function()
    ExecuteCommand('robbusiness')
end, false)

RegisterCommand('bankrun', function()
    if currentZoneId then
        TriggerServerEvent('standalone_turfs:sv:startBankRun', currentZoneId)
    else
        ShowNotify("You must be standing inside your business zone to start a bank run!", "error")
    end
end, false)

local isMasterAdminOpen = false

function OpenMasterAdminMenu()
    isMasterAdminOpen = true
    local ped = PlayerPedId()
    local pCoords = GetEntityCoords(ped)

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "openAdminCreator",
        coords = { x = pCoords.x, y = pCoords.y, z = pCoords.z },
        existing = activeZones
    })
end

function CloseMasterAdminMenu()
    isMasterAdminOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "closeAdminModal" })
end

-- Admin Business Creator Modal Handler
RegisterNetEvent('standalone_turfs:cl:openAdminCreator', function(data)
    OpenMasterAdminMenu()
end)

-- Master Admin Suite & Storefront Boss / Robbery Handlers
function OpenStorefrontBossHUD()
    if not isInsideZone or not currentZoneId then
        PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
        TriggerEvent('standalone_turfs:cl:showUIPopup', {
            title = "🔒 STOREFRONT REQUIRED",
            description = "You must be standing at your business storefront/property to access the Boss Terminal!",
            type = "error",
            badge = "LOCKED",
            icon = "fa-lock"
        })
        return
    end

    if not latestHudData or not latestHudData.isOwner then
        PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
        TriggerEvent('standalone_turfs:cl:showUIPopup', {
            title = "🔒 ACCESS DENIED",
            description = "Only the Business Boss / Owner can open the Management Terminal.",
            type = "error",
            badge = "UNAUTHORIZED",
            icon = "fa-user-shield"
        })
        return
    end

    isCursorActive = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "openBossHUD",
        isOwner = true
    })
    PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
end

function OpenStorefrontRobberyHUD()
    if not isInsideZone or not currentZoneId then
        PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
        TriggerEvent('standalone_turfs:cl:showUIPopup', {
            title = "📍 STOREFRONT REQUIRED",
            description = "You must be standing at the business storefront to inspect or rob it!",
            type = "error",
            badge = "PROXIMITY",
            icon = "fa-location-dot"
        })
        return
    end

    isCursorActive = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "openBossHUD",
        isOwner = (latestHudData and latestHudData.isOwner) or false,
        allowRob = true
    })
    PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
end

function OpenStorefrontBossMenu()
    if not isInsideZone or not currentZoneId then
        PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
        TriggerEvent('standalone_turfs:cl:showUIPopup', {
            title = "🔒 STOREFRONT REQUIRED",
            description = "You must be standing at your business storefront/property to access the Boss Terminal!",
            type = "error",
            badge = "LOCKED",
            icon = "fa-lock"
        })
        return
    end

    if latestHudData and not latestHudData.isOwner then
        PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
        TriggerEvent('standalone_turfs:cl:showUIPopup', {
            title = "🔒 ACCESS DENIED",
            description = "You do not hold executive ownership permissions for this commercial premise.",
            type = "error",
            badge = "UNAUTHORIZED",
            icon = "fa-user-shield"
        })
        return
    end

    OpenMasterAdminMenu()
    TriggerEvent('standalone_turfs:cl:showUIPopup', {
        title = "🏢 STOREFRONT TERMINAL CONNECTED",
        description = "Executive operations terminal online for " .. (latestHudData and latestHudData.label or "Premise"),
        type = "success",
        badge = "ONLINE",
        icon = "fa-building"
    })
end

function OpenCraftingWorkbenchHUD()
    if not isInsideZone or not currentZoneId then
        PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
        TriggerEvent('standalone_turfs:cl:showUIPopup', {
            title = "🛠️ WORKBENCH REQUIRED",
            description = "You must be standing at a business premise/workbench to craft firearms and gear!",
            type = "error",
            badge = "PROXIMITY",
            icon = "fa-hammer"
        })
        return
    end

    isCursorActive = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "openCraftingWorkbench",
        isOwner = (latestHudData and latestHudData.isOwner) or false,
        recipes = Config.CraftingRecipes
    })
    PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
end

-- ==============================================================================
-- THIRD EYE (OX_TARGET / QB-TARGET) STOREFRONT BOSS & ROBBERY INTEGRATION
-- ==============================================================================
CreateThread(function()
    Wait(2000)
    for zoneId, zone in pairs(activeZones) do
        if zone.coords then
            local zPos = vec3(zone.coords.x, zone.coords.y, zone.coords.z)

            -- ox_target integration
            if GetResourceState('ox_target') == 'started' then
                exports.ox_target:addSphereZone({
                    coords = zPos,
                    radius = 3.5,
                    debug = false,
                    options = {
                        -- 1. Boss Options (For Owners)
                        {
                            name = 'biz_boss_hud_' .. zoneId,
                            icon = 'fa-solid fa-crown',
                            label = '👑 Boss Management Terminal',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and latestHudData.isOwner
                            end,
                            onSelect = function()
                                OpenStorefrontBossHUD()
                            end
                        },
                        {
                            name = 'biz_boss_menu_' .. zoneId,
                            icon = 'fa-solid fa-briefcase',
                            label = '💼 Storefront Operations Suite',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and latestHudData.isOwner
                            end,
                            onSelect = function()
                                OpenStorefrontBossMenu()
                            end
                        },
                        -- 2. Arms & Item Crafting Workbench (For Everyone / Bosses)
                        {
                            name = 'biz_craft_' .. zoneId,
                            icon = 'fa-solid fa-screwdriver-wrench',
                            label = '🛠️ Arms & Item Crafting Workbench',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId
                            end,
                            onSelect = function()
                                OpenCraftingWorkbenchHUD()
                            end
                        },
                        -- 2. Rival / Robbery Options (For Non-Owners & Robbers)
                        {
                            name = 'biz_rob_' .. zoneId,
                            icon = 'fa-solid fa-gun',
                            label = '🔫 Rob Business Safe & Vault',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and not latestHudData.isOwner and not latestHudData.isRobbing
                            end,
                            onSelect = function()
                                TriggerServerEvent('standalone_turfs:sv:startRobbery', zoneId)
                            end
                        },
                        {
                            name = 'biz_inspect_' .. zoneId,
                            icon = 'fa-solid fa-eye',
                            label = '👁️ Inspect Safe & Robbery Status',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and not latestHudData.isOwner
                            end,
                            onSelect = function()
                                OpenStorefrontRobberyHUD()
                            end
                        },
                        {
                            name = 'biz_tag_' .. zoneId,
                            icon = 'fa-solid fa-spray-can',
                            label = '🎨 Spray Gang Graffiti Tag',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and not latestHudData.isOwner
                            end,
                            onSelect = function()
                                TriggerServerEvent('standalone_turfs:sv:tagGraffiti', zoneId)
                            end
                        },
                        {
                            name = 'biz_hack_' .. zoneId,
                            icon = 'fa-solid fa-laptop-code',
                            label = '💻 Hack Data Terminal ($3,500 Bounty)',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and not latestHudData.isOwner
                            end,
                            onSelect = function()
                                TriggerServerEvent('standalone_turfs:sv:hackDataTerminal', zoneId)
                            end
                        },
                        {
                            name = 'biz_clean_' .. zoneId,
                            icon = 'fa-solid fa-broom',
                            label = '🧹 Scrub Graffiti (+$800 Reward)',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and (latestHudData.graffitiTags or 0) > 0
                            end,
                            onSelect = function()
                                TriggerServerEvent('standalone_turfs:sv:cleanGraffiti', zoneId)
                            end
                        }
                    }
                })
            -- qb-target integration
            elseif GetResourceState('qb-target') == 'started' then
                exports['qb-target']:AddCircleZone('biz_boss_' .. zoneId, zPos, 3.5, {
                    name = 'biz_boss_' .. zoneId,
                    useZ = true,
                }, {
                    options = {
                        {
                            icon = 'fa-solid fa-crown',
                            label = '👑 Boss Management Terminal',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and latestHudData.isOwner
                            end,
                            action = function()
                                OpenStorefrontBossHUD()
                            end
                        },
                        {
                            icon = 'fa-solid fa-briefcase',
                            label = '💼 Storefront Operations Suite',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and latestHudData.isOwner
                            end,
                            action = function()
                                OpenStorefrontBossMenu()
                            end
                        },
                        {
                            icon = 'fa-solid fa-screwdriver-wrench',
                            label = '🛠️ Arms & Item Crafting Workbench',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId
                            end,
                            action = function()
                                OpenCraftingWorkbenchHUD()
                            end
                        },
                        {
                            icon = 'fa-solid fa-gun',
                            label = '🔫 Rob Business Safe & Vault',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and not latestHudData.isOwner and not latestHudData.isRobbing
                            end,
                            action = function()
                                TriggerServerEvent('standalone_turfs:sv:startRobbery', zoneId)
                            end
                        },
                        {
                            icon = 'fa-solid fa-eye',
                            label = '👁️ Inspect Safe & Robbery Status',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and not latestHudData.isOwner
                            end,
                            action = function()
                                OpenStorefrontRobberyHUD()
                            end
                        },
                        {
                            icon = 'fa-solid fa-spray-can',
                            label = '🎨 Spray Gang Graffiti Tag',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and not latestHudData.isOwner
                            end,
                            action = function()
                                TriggerServerEvent('standalone_turfs:sv:tagGraffiti', zoneId)
                            end
                        },
                        {
                            icon = 'fa-solid fa-laptop-code',
                            label = '💻 Hack Data Terminal ($3,500 Bounty)',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and not latestHudData.isOwner
                            end,
                            action = function()
                                TriggerServerEvent('standalone_turfs:sv:hackDataTerminal', zoneId)
                            end
                        },
                        {
                            icon = 'fa-solid fa-broom',
                            label = '🧹 Scrub Graffiti (+$800 Reward)',
                            canInteract = function()
                                return latestHudData and latestHudData.zoneId == zoneId and (latestHudData.graffitiTags or 0) > 0
                            end,
                            action = function()
                                TriggerServerEvent('standalone_turfs:sv:cleanGraffiti', zoneId)
                            end
                        }
                    },
                    distance = 3.5
                })
            end
        end
    end
end)

-- Storefront Boss Menu Commands
RegisterCommand('bossmenu', function()
    if isMasterAdminOpen then
        CloseMasterAdminMenu()
    else
        OpenStorefrontBossHUD()
    end
end, false)

RegisterCommand('bizmenu', function()
    ExecuteCommand('bossmenu')
end, false)

RegisterCommand('storefront', function()
    ExecuteCommand('bossmenu')
end, false)

-- Server Admin Master Menu (Can open anywhere for admins, opens at storefront for players)
RegisterCommand('mastermenu', function()
    if isMasterAdminOpen then
        CloseMasterAdminMenu()
    else
        if isInsideZone and currentZoneId then
            OpenMasterAdminMenu()
        else
            -- If not in a zone, verify admin or prompt storefront
            OpenMasterAdminMenu()
        end
    end
end, false)

RegisterCommand('bizadmin', function()
    ExecuteCommand('mastermenu')
end, false)

RegisterCommand('turfadmin', function()
    ExecuteCommand('mastermenu')
end, false)

RegisterCommand('munchiesadmin', function()
    ExecuteCommand('mastermenu')
end, false)

RegisterCommand('adminmenu', function()
    ExecuteCommand('mastermenu')
end, false)

RegisterKeyMapping('mastermenu', 'Open Storefront Boss Menu / Master Menu', 'keyboard', 'F9')

RegisterCommand('addbuilding', function()
    ExecuteCommand('mastermenu')
end, false)

RegisterCommand('createbuilding', function()
    ExecuteCommand('mastermenu')
end, false)

RegisterKeyMapping('addbuilding', 'Open Add Building & Property Menu', 'keyboard', 'F6')

-- Real-Time UI Pop-up Event Listener
RegisterNetEvent('standalone_turfs:cl:showUIPopup', function(data)
    PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
    SendNUIMessage({
        action = "showUIPopup",
        title = data.title or "SYSTEM UPDATE",
        description = data.description or "",
        type = data.type or "inform",
        badge = data.badge or "UPDATE",
        icon = data.icon or "fa-bell"
    })
end)

RegisterNUICallback('deployBusiness', function(data, cb)
    CloseMasterAdminMenu()
    TriggerServerEvent('standalone_turfs:sv:deployBusiness', data)
    cb('ok')
end)

RegisterNUICallback('deleteBusiness', function(data, cb)
    TriggerServerEvent('standalone_turfs:sv:deleteBusiness', data.zoneId)
    cb('ok')
end)

RegisterNUICallback('closeAdminCreator', function(data, cb)
    isMasterAdminOpen = false
    SetNuiFocus(false, false)
    cb('ok')
end)

RegisterNUICallback('adminTeleport', function(data, cb)
    local zone = activeZones[data.zoneId]
    if zone and zone.coords then
        local ped = PlayerPedId()
        SetEntityCoords(ped, zone.coords.x, zone.coords.y, zone.coords.z + 0.5, false, false, false, true)
        ShowNotify("Teleported to " .. (zone.label or data.zoneId) .. "!", "success")
    end
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "closeAdminModal" })
    cb('ok')
end)

RegisterNUICallback('adminSpawnTruck', function(data, cb)
    ExecuteCommand('spawntruck')
    cb('ok')
end)

RegisterNUICallback('adminSetLivery', function(data, cb)
    ExecuteCommand('trucklivery ' .. (data.livery or 0))
    cb('ok')
end)

RegisterNUICallback('adminToggleJingle', function(data, cb)
    if currentZoneId then
        TriggerServerEvent('weed_icecream:server:toggleJingle', currentZoneId, true)
    else
        ShowNotify("Toggled Jingle Chime!", "inform")
    end
    cb('ok')
end)

RegisterNUICallback('adminToggleSelling', function(data, cb)
    ToggleCornerSelling()
    cb('ok')
end)

RegisterNUICallback('adminQuickCheat', function(data, cb)
    TriggerServerEvent('standalone_turfs:sv:adminCheat', data.zoneId or currentZoneId, data.cheatType)
    cb('ok')
end)

-- Corner Drug Selling Toggle
RegisterCommand('cornersell', function()
    ToggleCornerSelling()
end, false)

RegisterKeyMapping('cornersell', 'Toggle Corner Drug Selling', 'keyboard', 'F7')

function ToggleCornerSelling()
    local ped = PlayerPedId()
    if IsPedInAnyVehicle(ped, false) or IsPedDeadOrDying(ped, true) then
        ShowNotify("You cannot sell drugs right now.", "error")
        return
    end

    isCornerSelling = not isCornerSelling

    if isCornerSelling then
        ShowNotify("Corner Selling Started! Stay on the block while buyers approach.", "success")
        SendNUIMessage({ action = "showSellingBadge", active = true })
        StartCornerSellingLoop()
    else
        ShowNotify("Corner Selling Stopped.", "inform")
        SendNUIMessage({ action = "showSellingBadge", active = false })
    end
end

-- NPC Corner Selling Loop
function StartCornerSellingLoop()
    CreateThread(function()
        while isCornerSelling do
            Wait(Config.SellInterval or 7500)
            if not isCornerSelling then break end

            local ped = PlayerPedId()
            if IsPedDeadOrDying(ped, true) or IsPedInAnyVehicle(ped, false) then
                isCornerSelling = false
                SendNUIMessage({ action = "showSellingBadge", active = false })
                break
            end

            TriggerServerEvent('standalone_turfs:sv:findBuyer', currentZoneId)
        end
    end)
end

-- Spawn NPC Buyer
RegisterNetEvent('standalone_turfs:cl:spawnBuyer', function(drugKey, price, isTurfBonus)
    local playerPed = PlayerPedId()
    local pCoords = GetEntityCoords(playerPed)

    local models = { "a_m_y_beach_01", "a_m_y_skater_01", "a_m_y_hipster_01", "a_m_m_og_boss_01", "a_f_y_hippie_01" }
    local modelHash = GetHashKey(models[math.random(#models)])

    RequestModel(modelHash)
    while not HasModelLoaded(modelHash) do Wait(10) end

    local spawnOffset = GetOffsetFromEntityInWorldCoords(playerPed, math.random(-15, 15) + 0.0, math.random(15, 25) + 0.0, 0.0)
    local buyer = CreatePed(4, modelHash, spawnOffset.x, spawnOffset.y, spawnOffset.z, 0.0, true, true)
    activeBuyerPed = buyer

    SetBlockingOfNonTemporaryEvents(buyer, true)
    SetPedCanRagdollFromPlayerImpact(buyer, false)
    TaskGoToEntity(buyer, playerPed, -1, 1.2, 1.2, 1073741824, 0)

    CreateThread(function()
        local timeout = 25
        while timeout > 0 and DoesEntityExist(buyer) and isCornerSelling do
            Wait(1000)
            timeout = timeout - 1
            local dist = #(GetEntityCoords(buyer) - GetEntityCoords(playerPed))
            if dist < 2.0 then break end
        end

        if DoesEntityExist(buyer) and isCornerSelling and #(GetEntityCoords(buyer) - GetEntityCoords(playerPed)) < 2.5 then
            TaskTurnPedToFaceEntity(buyer, playerPed, 1000)
            TaskTurnPedToFaceEntity(playerPed, buyer, 1000)
            Wait(1000)

            local dict = "mp_common"
            RequestAnimDict(dict)
            while not HasAnimDictLoaded(dict) do Wait(10) end

            TaskPlayAnim(buyer, dict, "givetake2_a", 8.0, -8.0, 2000, 49, 0, false, false, false)
            TaskPlayAnim(playerPed, dict, "givetake2_a", 8.0, -8.0, 2000, 49, 0, false, false, false)

            TriggerServerEvent('standalone_turfs:sv:completeSale', drugKey, price, isTurfBonus)

            Wait(2500)
            local leavePos = GetOffsetFromEntityInWorldCoords(buyer, math.random(-20, 20) + 0.0, math.random(-20, -35) + 0.0, 0.0)
            TaskGoStraightToCoord(buyer, leavePos.x, leavePos.y, leavePos.z, 1.0, -1, 0.0, 0.0)
            SetTimeout(8000, function()
                if DoesEntityExist(buyer) then DeletePed(buyer) end
            end)
        else
            if DoesEntityExist(buyer) then DeletePed(buyer) end
        end
    end)
end)

-- Notification Helper
function ShowNotify(msg, type)
    if lib and lib.notify then
        lib.notify({ title = 'Business System', description = msg, type = type or 'inform' })
    else
        SetNotificationTextEntry('STRING')
        AddTextComponentString(msg)
        DrawNotification(false, true)
    end
end

-- ==============================================================================
-- SYNDICATE EMPIRE CLIENT NUI CALLBACKS & ANIMATIONS
-- ==============================================================================
-- ==============================================================================
-- IMMERSIVE GRAFFITI SPRAY CAN SYSTEM (PROP, SOUND, PTFX & REP DEGRADATION)
-- ==============================================================================
local isSprayingGraffiti = false

function StartGraffitiSpraySequence(targetZoneId)
    if isSprayingGraffiti then return end
    isSprayingGraffiti = true

    local ped = PlayerPedId()
    local pCoords = GetEntityCoords(ped)

    -- Determine target business if not supplied
    local zoneId = targetZoneId or currentZoneId
    if not zoneId then
        for zId, zCfg in pairs(activeZones) do
            if zCfg.coords and #(pCoords - vec3(zCfg.coords.x, zCfg.coords.y, zCfg.coords.z)) <= (zCfg.radius or 18.0) + 6.0 then
                zoneId = zId
                break
            end
        end
    end

    if not zoneId then
        ShowNotify("You must be near a business wall or territory to spray rival graffiti!", "error")
        isSprayingGraffiti = false
        return
    end

    -- 1. Load Animation Dictionary & Spray Can Prop
    local animDict = "anim@amb@business@weed@weed_inspecting_high_eq@"
    local animName = "weed_spraybottle_crouch_spraying_02_inspector"
    local propModel = GetHashKey("prop_cs_spray_can")

    RequestAnimDict(animDict)
    while not HasAnimDictLoaded(animDict) do Wait(10) end

    RequestModel(propModel)
    while not HasModelLoaded(propModel) do Wait(10) end

    -- 2. Attach Spray Can Prop to Hand (Bone 57005 = SKEL_R_Hand)
    local sprayProp = CreateObject(propModel, pCoords.x, pCoords.y, pCoords.z, true, true, false)
    AttachEntityToEntity(sprayProp, ped, GetPedBoneIndex(ped, 57005), 0.12, 0.04, -0.05, -80.0, 0.0, 0.0, true, true, false, true, 1, true)

    -- 3. Play Spray Animation & Particle Mist
    TaskPlayAnim(ped, animDict, animName, 8.0, -8.0, 5500, 49, 0, false, false, false)
    ShowNotify("🎨 Shaking spray can & spraying rival gang graffiti on wall...", "inform")

    -- PTFX Particle Mist
    RequestNamedPtfxAsset("core")
    while not HasNamedPtfxAssetLoaded("core") do Wait(10) end
    UseParticleFxAssetNextCall("core")
    local ptfx = StartParticleFxLoopedOnEntity("ent_sht_petrol", sprayProp, 0.0, 0.0, 0.15, 0.0, 90.0, 0.0, 0.4, false, false, false)

    -- Audio Shaking & Hissing Chimes
    PlaySoundFrontend(-1, "SPRAY", "CAR_MOD_SHOP_SOUND_SET", true)

    Wait(4500)

    -- 4. Cleanup Animation & Prop
    StopParticleFxLooped(ptfx, 0)
    DeleteObject(sprayProp)
    ClearPedTasks(ped)
    isSprayingGraffiti = false

    -- 5. Trigger Server Rep Degradation Event
    TriggerServerEvent('standalone_turfs:sv:tagGraffiti', zoneId)
end

RegisterNetEvent('standalone_turfs:cl:useSprayCan', function()
    StartGraffitiSpraySequence()
end)

RegisterCommand('spraycan', function()
    StartGraffitiSpraySequence()
end, false)

RegisterCommand('spray', function()
    StartGraffitiSpraySequence()
end, false)

RegisterCommand('spraytag', function()
    StartGraffitiSpraySequence()
end, false)

RegisterKeyMapping('spraytag', 'Spray Graffiti on Rival Business Wall', 'keyboard', '')

-- 1. Graffiti Tagging Animation
RegisterNUICallback('tagGraffiti', function(data, cb)
    StartGraffitiSpraySequence()
    cb('ok')
end)

-- 2. Graffiti Cleaning Animation
RegisterNUICallback('cleanGraffiti', function(data, cb)
    if currentZoneId then
        local ped = PlayerPedId()
        TaskStartScenarioInPlace(ped, "WORLD_HUMAN_MAID_CLEAN", 0, true)
        ShowNotify("🧹 Scrubbing vandalism tag off premise...", "inform")
        Wait(3500)
        ClearPedTasks(ped)
        TriggerServerEvent('standalone_turfs:sv:cleanGraffiti', currentZoneId)
    end
    cb('ok')
end)

-- 3. Data Terminal Hacking
RegisterNUICallback('hackTerminal', function(data, cb)
    if currentZoneId then
        local ped = PlayerPedId()
        TaskStartScenarioInPlace(ped, "WORLD_HUMAN_STAND_MOBILE", 0, true)
        ShowNotify("💻 Injecting cryptographic bypass exploit...", "inform")
        Wait(5000)
        ClearPedTasks(ped)
        TriggerServerEvent('standalone_turfs:sv:hackDataTerminal', currentZoneId)
    end
    cb('ok')
end)

-- 4. Firewall Reboot
RegisterNUICallback('rebootTerminal', function(data, cb)
    if currentZoneId then
        local ped = PlayerPedId()
        TaskStartScenarioInPlace(ped, "WORLD_HUMAN_STAND_MOBILE", 0, true)
        ShowNotify("🛡️ Rebooting corporate cybersecurity firewalls...", "inform")
        Wait(3000)
        ClearPedTasks(ped)
        TriggerServerEvent('standalone_turfs:sv:rebootTerminal', currentZoneId)
    end
    cb('ok')
end)

-- 5. Contraband Vault Toggle & Raids
RegisterNUICallback('toggleContraband', function(data, cb)
    if currentZoneId then
        TriggerServerEvent('standalone_turfs:sv:toggleContrabandStash', currentZoneId, data.hasContraband)
    end
    cb('ok')
end)

RegisterNUICallback('raidBusiness', function(data, cb)
    if currentZoneId then
        local ped = PlayerPedId()
        TaskStartScenarioInPlace(ped, "CODE_HUMAN_POLICE_INVESTIGATE", 0, true)
        ShowNotify("🚨 Executing Contraband Seizure Warrant...", "error")
        Wait(5000)
        ClearPedTasks(ped)
        TriggerServerEvent('standalone_turfs:sv:raidContrabandBusiness', currentZoneId)
    end
    cb('ok')
end)

-- 6. Corporate Fleet Purchase & Spawner
RegisterNUICallback('buyCompanyFleet', function(data, cb)
    if currentZoneId and data.vehicleKey then
        TriggerServerEvent('standalone_turfs:sv:buyCompanyFleet', currentZoneId, data.vehicleKey)
    end
    cb('ok')
end)

RegisterNUICallback('spawnCompanyFleet', function(data, cb)
    local model = data.model or "speedo"
    local modelHash = GetHashKey(model)
    RequestModel(modelHash)
    while not HasModelLoaded(modelHash) do Wait(10) end

    local pPed = PlayerPedId()
    local pCoords = GetEntityCoords(pPed)
    local fwd = GetEntityForwardVector(pPed)
    local spawnPos = pCoords + (fwd * 3.5)

    local veh = CreateVehicle(modelHash, spawnPos.x, spawnPos.y, spawnPos.z, GetEntityHeading(pPed), true, false)
    SetVehicleNumberPlateText(veh, data.plate or "CORP999")
    SetVehicleEngineOn(veh, true, true, false)
    TaskWarpPedIntoVehicle(pPed, veh, -1)

    ShowNotify("🚗 Dispatched Company Fleet: " .. model .. " (Plate: " .. (data.plate or "CORP999") .. ")", "success")
    cb('ok')
end)

-- 7. District Real Estate Investment
RegisterNUICallback('investDistrict', function(data, cb)
    if currentZoneId and data.targetZone and data.amount then
        TriggerServerEvent('standalone_turfs:sv:investInDistrict', currentZoneId, data.targetZone, data.amount)
    end
    cb('ok')
end)

-- 8. Hiring Job Board
RegisterNUICallback('postJobQuest', function(data, cb)
    if currentZoneId then
        TriggerServerEvent('standalone_turfs:sv:postJobQuest', currentZoneId, data.jobType, data.title, data.bounty)
    end
    cb('ok')
end)

RegisterNUICallback('claimJobQuest', function(data, cb)
    if data.jobId then
        TriggerServerEvent('standalone_turfs:sv:claimJobQuest', data.jobId)
    end
    cb('ok')
end)

RegisterNUICallback('completeJobQuest', function(data, cb)
    if data.jobId then
        TriggerServerEvent('standalone_turfs:sv:completeJobQuest', data.jobId)
    end
    cb('ok')
end)

RegisterNUICallback('getJobBoard', function(data, cb)
    TriggerServerEvent('standalone_turfs:sv:getJobBoard')
    cb('ok')
end)

-- Sync Job Board to NUI
RegisterNetEvent('standalone_turfs:cl:syncJobBoard', function(jobs)
    SendNUIMessage({
        action = "syncJobBoard",
        jobs = jobs
    })
end)

-- ==============================================================================
-- 9. DIRTY GUN RUNS & B2B IMPORT/EXPORT CLIENT HANDLERS
-- ==============================================================================
local activeGunBlip = nil
local activeB2BBlip = nil

RegisterNUICallback('startGunRun', function(data, cb)
    if currentZoneId then
        TriggerServerEvent('standalone_turfs:sv:startGunRun', currentZoneId, data.gunKey or 'lsia_airfield')
    end
    cb('ok')
end)

RegisterNetEvent('standalone_turfs:cl:startGunRun', function(data)
    local drop = data.drop
    if not drop then return end

    if activeGunBlip then RemoveBlip(activeGunBlip) end
    activeGunBlip = AddBlipForCoord(drop.coords.x, drop.coords.y, drop.coords.z)
    SetBlipSprite(activeGunBlip, drop.blip.sprite or 110)
    SetBlipColour(activeGunBlip, drop.blip.color or 1)
    SetBlipScale(activeGunBlip, 1.0)
    SetBlipRoute(activeGunBlip, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString(drop.blip.label or "Arms Crate Pickup")
    EndTextCommandSetBlipName(activeGunBlip)

    CreateThread(function()
        local isWaiting = true
        while isWaiting and activeGunBlip do
            Wait(1000)
            local pCoords = GetEntityCoords(PlayerPedId())
            local dist = #(pCoords - drop.coords)
            if dist < 15.0 then
                isWaiting = false
                TriggerServerEvent('standalone_turfs:sv:completeGunRun', data.zoneId, data.gunKey)
                if activeGunBlip then RemoveBlip(activeGunBlip); activeGunBlip = nil end
            end
        end
    end)
end)

RegisterNetEvent('standalone_turfs:cl:finishGunRun', function()
    if activeGunBlip then RemoveBlip(activeGunBlip); activeGunBlip = nil end
end)

RegisterNUICallback('startB2BDeal', function(data, cb)
    if data.tradeKey then
        TriggerServerEvent('standalone_turfs:sv:startB2BDeal', data.tradeKey)
    end
    cb('ok')
end)

RegisterNetEvent('standalone_turfs:cl:startB2BDeal', function(data)
    local targetCoords = data.targetCoords
    if not targetCoords then return end

    if activeB2BBlip then RemoveBlip(activeB2BBlip) end
    activeB2BBlip = AddBlipForCoord(targetCoords.x, targetCoords.y, targetCoords.z)
    SetBlipSprite(activeB2BBlip, 478)
    SetBlipColour(activeB2BBlip, 2)
    SetBlipScale(activeB2BBlip, 1.0)
    SetBlipRoute(activeB2BBlip, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString("B2B Cargo Trade Delivery")
    EndTextCommandSetBlipName(activeB2BBlip)

    CreateThread(function()
        local isWaiting = true
        while isWaiting and activeB2BBlip do
            Wait(1000)
            local pCoords = GetEntityCoords(PlayerPedId())
            local dist = #(pCoords - targetCoords)
            if dist < 18.0 then
                isWaiting = false
                TriggerServerEvent('standalone_turfs:sv:completeB2BDeal', data.tradeKey)
                if activeB2BBlip then RemoveBlip(activeB2BBlip); activeB2BBlip = nil end
            end
        end
    end)
end)

RegisterNetEvent('standalone_turfs:cl:finishB2BDeal', function()
    if activeB2BBlip then RemoveBlip(activeB2BBlip); activeB2BBlip = nil end
end)

-- ==============================================================================
-- 13. MUNCHIES MOBILE WEED TRUCK STREET TRAVEL & TAKEOVER DISPATCH (CLIENT)
-- ==============================================================================
local activeTruckRouteBlip = nil

RegisterNetEvent('standalone_turfs:cl:dispatchTruckToStreet', function(data)
    local targetCoords = data.coords
    if not targetCoords then return end

    if activeTruckRouteBlip then RemoveBlip(activeTruckRouteBlip) end

    activeTruckRouteBlip = AddBlipForCoord(targetCoords.x, targetCoords.y, targetCoords.z)
    SetBlipSprite(activeTruckRouteBlip, 67) -- Van / Truck
    SetBlipColour(activeTruckRouteBlip, 2) -- Green
    SetBlipScale(activeTruckRouteBlip, 1.2)
    SetBlipRoute(activeTruckRouteBlip, true)
    SetBlipRouteColour(activeTruckRouteBlip, 2)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString("🍦 Munchies Weed Truck: " .. (data.label or "Street Delivery"))
    EndTextCommandSetBlipName(activeTruckRouteBlip)

    ShowNotify("🍦 Munchies Weed Selling Truck is traveling to " .. (data.label or "this street") .. "! Drive to destination to initiate street sales.", "success")

    CreateThread(function()
        local isTracking = true
        while isTracking and activeTruckRouteBlip do
            Wait(1000)
            local pCoords = GetEntityCoords(PlayerPedId())
            local dist = #(pCoords - vec3(targetCoords.x, targetCoords.y, targetCoords.z))

            if dist < 22.0 then
                isTracking = false
                if activeTruckRouteBlip then
                    RemoveBlip(activeTruckRouteBlip)
                    activeTruckRouteBlip = nil
                end

                TriggerServerEvent('standalone_turfs:sv:truckArrivedAtStreet', data.zoneId)
                -- Auto-enable jingle & corner selling mode
                TriggerEvent('standalone_turfs:cl:toggleSelling', true)
                PlaySoundFrontend(-1, "BASE_JUMP_PASSED", "HUD_AWARDS", true)
            end
        end
    end)
end)

-- Quick 1-Click Takeover Business Front Builder Command
RegisterCommand('buildbiz', function(source, args)
    local label = args[1] or "New Street Business"
    if args[2] then
        for i = 2, #args do
            if not tonumber(args[i]) then
                label = label .. " " .. args[i]
            end
        end
    end
    local payout = tonumber(args[#args]) or 250

    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local autoId = label:lower():gsub("%s+", "_"):gsub("[^%w_]", "") .. "_" .. math.random(100, 999)

    TriggerServerEvent('standalone_turfs:sv:deployBusiness', {
        id = autoId,
        label = label,
        payout = payout,
        captureTime = 45,
        radius = 18.0,
        owner = "Unclaimed",
        coords = { x = coords.x, y = coords.y, z = coords.z }
    })
end, false)

-- Boss Request Weed Truck to Current Business Street
RegisterCommand('requesttruck', function()
    if isInsideZone and currentZoneId then
        TriggerServerEvent('standalone_turfs:sv:requestTruckToStreet', currentZoneId)
    else
        ShowNotify("You must be standing at your business to request the weed truck!", "error")
    end
end, false)

RegisterNUICallback('requestTruckToStreet', function(data, cb)
    if currentZoneId then
        TriggerServerEvent('standalone_turfs:sv:requestTruckToStreet', currentZoneId)
    end
    cb('ok')
end)

-- ==============================================================================
-- 15. ARMS & ITEMS WORKBENCH NUI CALLBACKS & COMMANDS
-- ==============================================================================
RegisterCommand('crafting', OpenCraftingWorkbenchHUD, false)
RegisterCommand('workbench', OpenCraftingWorkbenchHUD, false)

RegisterNUICallback('craftItem', function(data, cb)
    if currentZoneId and data.recipeKey then
        local ped = PlayerPedId()
        TaskStartScenarioInPlace(ped, "WORLD_HUMAN_HAMMERING", 0, true)
        ShowNotify("🛠️ Manufacturing item at crafting workbench...", "inform")
        Wait(3500)
        ClearPedTasks(ped)
        TriggerServerEvent('standalone_turfs:sv:craftItem', currentZoneId, data.recipeKey)
    else
        ShowNotify("No active business workbench detected!", "error")
    end
    cb('ok')
end)

RegisterNUICallback('depositMaterial', function(data, cb)
    if currentZoneId and data.material and data.amount then
        TriggerServerEvent('standalone_turfs:sv:depositMaterial', currentZoneId, data.material, data.amount)
    end
    cb('ok')
end)




