-- Client Usable Item Logic & Animations

local function GetClosestPlayerInFront(maxDistance)
    local plyPed = PlayerPedId()
    local plyCoords = GetEntityCoords(plyPed)
    local plyForward = GetEntityForwardVector(plyPed)
    local closestPlayer = -1
    local closestDist = maxDistance or 2.5

    for _, playerId in ipairs(GetActivePlayers()) do
        if playerId ~= PlayerId() then
            local targetPed = GetPlayerPed(playerId)
            local targetCoords = GetEntityCoords(targetPed)
            local dist = #(plyCoords - targetCoords)

            if dist <= closestDist then
                -- Check if player is roughly in front
                local dirToTarget = #(targetCoords - plyCoords) > 0 and (targetCoords - plyCoords) / #(targetCoords - plyCoords) or plyForward
                local dot = plyForward.x * dirToTarget.x + plyForward.y * dirToTarget.y + plyForward.z * dirToTarget.z

                if dot > 0.4 then
                    closestDist = dist
                    closestPlayer = playerId
                end
            end
        end
    end

    return closestPlayer
end

-- ============================================================================
-- USE BREATHALYZER DEVICE
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:useBreathalyzer', function()
    local targetPlayer = GetClosestPlayerInFront(2.5)

    if targetPlayer == -1 then
        Bridge.Notify('No patron in front of you to test.', 'error')
        return
    end

    local targetServerId = GetPlayerServerId(targetPlayer)
    local plyPed = PlayerPedId()

    -- Load animation & Prop
    RequestAnimDict('weapons@first_person@aim_idle@generic@submachine_gun@submachine')
    RequestAnimDict('cellphone@')
    while not HasAnimDictLoaded('cellphone@') do Wait(10) end

    local propModel = `prop_npc_phone_02`
    RequestModel(propModel)
    while not HasModelLoaded(propModel) do Wait(10) end

    local coords = GetEntityCoords(plyPed)
    local propObj = CreateObject(propModel, coords.x, coords.y, coords.z, true, true, false)
    AttachEntityToEntity(propObj, plyPed, GetPedBoneIndex(plyPed, 28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, true, 1, true)

    TaskPlayAnim(plyPed, 'cellphone@', 'cellphone_text_read_base', 8.0, -8.0, 3500, 49, 0, false, false, false)
    Bridge.Notify('Administering breathalyzer test...', 'info', 3000)

    Wait(3500)

    ClearPedTasks(plyPed)
    if DoesEntityExist(propObj) then DeleteEntity(propObj) end

    TriggerServerEvent('helix_hospitality:server:requestBreathalyzerTest', targetServerId)
end)
