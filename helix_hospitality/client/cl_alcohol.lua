local currentBAC = 0.0
local activeBuff = nil
local activeBuffTimer = 0
local isDrunkShaking = false
local currentWalkStyle = nil

-- ============================================================================
-- ALCOHOL CONSUMPTION & ANIMATION
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:drinkAlcohol', function(itemData)
    local plyPed = PlayerPedId()

    RequestAnimDict('mp_player_intdrink')
    while not HasAnimDictLoaded('mp_player_intdrink') do Wait(10) end

    local glassModel = `prop_cocktail_glass`
    if itemData.glassType == 'rocks' then glassModel = `prop_drink_whisky`
    elseif itemData.glassType == 'mug' then glassModel = `prop_mug_02`
    end

    RequestModel(glassModel)
    while not HasModelLoaded(glassModel) do Wait(10) end

    local coords = GetEntityCoords(plyPed)
    local glassObj = CreateObject(glassModel, coords.x, coords.y, coords.z, true, true, false)
    AttachEntityToEntity(glassObj, plyPed, GetPedBoneIndex(plyPed, 18905), 0.12, -0.02, 0.03, -100.0, 0.0, -10.0, true, true, false, true, 1, true)

    TaskPlayAnim(plyPed, 'mp_player_intdrink', 'loop_bottle', 8.0, -8.0, 3500, 49, 0, false, false, false)
    Wait(3500)

    ClearPedTasks(plyPed)
    if DoesEntityExist(glassObj) then DeleteEntity(glassObj) end

    TriggerServerEvent('helix_hospitality:server:consumeDrink', itemData)
end)

-- Usable Sober Items (Water, Coffee, Hangover Pill)
RegisterNetEvent('helix_hospitality:client:useSoberItem', function(itemName)
    local cfg = Config.Alcohol.SoberItems[itemName]
    if not cfg then return end

    local plyPed = PlayerPedId()
    RequestAnimDict('mp_player_intdrink')
    while not HasAnimDictLoaded('mp_player_intdrink') do Wait(10) end

    TaskPlayAnim(plyPed, 'mp_player_intdrink', 'loop_bottle', 8.0, -8.0, 3000, 49, 0, false, false, false)
    Wait(3000)
    ClearPedTasks(plyPed)

    TriggerServerEvent('helix_hospitality:server:soberUp', cfg.bacReduction)
    Bridge.Notify('You consumed ' .. itemName .. ' and feel clearer.', 'info')
end)

-- ============================================================================
-- BAC UPDATE & BUFF TIMERS
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:updateBAC', function(newBAC, buffType, buffDuration)
    currentBAC = tonumber(newBAC) or 0.0

    if buffType and buffDuration and buffDuration > 0 then
        activeBuff = buffType
        activeBuffTimer = GetGameTimer() + (buffDuration * 1000)
        Bridge.Notify('Active Buff: +' .. string.upper(buffType) .. ' (' .. buffDuration .. 's)', 'success')
    end
end)

-- Drunkenness Simulation Loop
CreateThread(function()
    while true do
        local sleep = 1000
        local plyPed = PlayerPedId()

        if currentBAC >= 0.02 then
            sleep = 100

            -- Tier 1: Mild Buzz (0.02 - 0.05)
            if currentBAC >= 0.02 and currentBAC < 0.05 then
                SetTimecycleModifier('drunk_mild')
                SetTimecycleModifierStrength(0.5)

            -- Tier 2: Tipsy (0.05 - 0.12)
            elseif currentBAC >= 0.05 and currentBAC < 0.12 then
                SetTimecycleModifier('drunk')
                SetTimecycleModifierStrength(0.4)

                if currentWalkStyle ~= 'move_m@drunk@slightlydrunk' then
                    RequestAnimSet('move_m@drunk@slightlydrunk')
                    while not HasAnimSetLoaded('move_m@drunk@slightlydrunk') do Wait(10) end
                    SetPedMovementClipset(plyPed, 'move_m@drunk@slightlydrunk', 1.0)
                    currentWalkStyle = 'move_m@drunk@slightlydrunk'
                end

            -- Tier 3: Drunk (0.12 - 0.20)
            elseif currentBAC >= 0.12 and currentBAC < 0.20 then
                SetTimecycleModifier('spectator5')
                SetTimecycleModifierStrength(0.7)

                if not isDrunkShaking then
                    ShakeGameplayCam('DRUNK_SHAKE', 1.2)
                    isDrunkShaking = true
                end

                if currentWalkStyle ~= 'move_m@drunk@moderatedrunk' then
                    RequestAnimSet('move_m@drunk@moderatedrunk')
                    while not HasAnimSetLoaded('move_m@drunk@moderatedrunk') do Wait(10) end
                    SetPedMovementClipset(plyPed, 'move_m@drunk@moderatedrunk', 1.0)
                    currentWalkStyle = 'move_m@drunk@moderatedrunk'
                end

                -- Stumble probability when sprinting
                if IsPedSprinting(plyPed) and math.random(1, 100) <= 25 then
                    SetPedToRagdoll(plyPed, 1800, 1800, 0, false, false, false)
                    Wait(2000)
                end

            -- Tier 4: Wasted / Stumbling (0.20 - 0.30)
            elseif currentBAC >= 0.20 and currentBAC < 0.30 then
                SetTimecycleModifier('drug_drive_blend01')
                SetTimecycleModifierStrength(0.9)

                if not isDrunkShaking then
                    ShakeGameplayCam('DRUNK_SHAKE', 2.0)
                    isDrunkShaking = true
                end

                if currentWalkStyle ~= 'move_m@drunk@verydrunk' then
                    RequestAnimSet('move_m@drunk@verydrunk')
                    while not HasAnimSetLoaded('move_m@drunk@verydrunk') do Wait(10) end
                    SetPedMovementClipset(plyPed, 'move_m@drunk@verydrunk', 1.0)
                    currentWalkStyle = 'move_m@drunk@verydrunk'
                end

                if IsPedRunning(plyPed) or IsPedSprinting(plyPed) then
                    SetPedToRagdoll(plyPed, 2500, 2500, 0, false, false, false)
                    Wait(2600)
                end

            -- Tier 5: Blackout (0.30+)
            elseif currentBAC >= 0.30 then
                DoScreenFadeOut(1000)
                Wait(1000)
                SetPedToRagdoll(plyPed, 15000, 15000, 0, false, false, false)
                Wait(15000)
                currentBAC = 0.15
                DoScreenFadeIn(2000)
            end
        else
            -- Sober reset
            if currentWalkStyle ~= nil then
                ResetPedMovementClipset(plyPed, 0.0)
                currentWalkStyle = nil
            end
            if isDrunkShaking then
                StopGameplayCamShaking(true)
                isDrunkShaking = false
            end
            ClearTimecycleModifier()
        end

        -- Active Buff Ticks
        if activeBuff and GetGameTimer() < activeBuffTimer then
            if activeBuff == 'stamina' then
                RestorePlayerStamina(PlayerId(), 1.0)
            elseif activeBuff == 'speed' then
                SetPedMoveRateOverride(plyPed, 1.15)
            end
        else
            activeBuff = nil
        end

        Wait(sleep)
    end
end)

-- ============================================================================
-- POLICE BREATHALYZER HUD
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:showBreathalyzerResult', function(targetName, testedBAC)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'show_breathalyzer',
        targetName = targetName,
        bac = testedBAC,
        legalLimit = Config.Alcohol.LegalDrivingLimit
    })
end)

-- Close Breathalyzer
RegisterNUICallback('close_breathalyzer', function(data, cb)
    SetNuiFocus(false, false)
    cb({ status = 'ok' })
end)

-- Cleanup on stop
AddEventHandler('onResourceStop', function(res)
    if res ~= GetCurrentResourceName() then return end
    ClearTimecycleModifier()
    StopGameplayCamShaking(true)
    ResetPedMovementClipset(PlayerPedId(), 0.0)
end)
