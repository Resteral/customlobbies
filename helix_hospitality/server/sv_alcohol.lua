local playerBAC = {}

-- ============================================================================
-- CONSUME DRINKS & BAC MANAGEMENT
-- ============================================================================
RegisterNetEvent('helix_hospitality:server:consumeDrink', function(itemData)
    local src = source
    local ident = Bridge.GetPlayerIdentifier(src)
    local strength = itemData.alcoholStrength or 1.0

    -- Standard unit calculation: 0.025 BAC per standard cocktail unit
    local addedBAC = 0.025 * strength
    playerBAC[src] = math.min(Config.Alcohol.MaxBAC, (playerBAC[src] or 0.0) + addedBAC)

    TriggerClientEvent('helix_hospitality:client:updateBAC', src, playerBAC[src], itemData.buffType, itemData.buffDuration)
end)

RegisterNetEvent('helix_hospitality:server:soberUp', function(reductionAmount)
    local src = source
    if playerBAC[src] then
        playerBAC[src] = math.max(0.0, playerBAC[src] - (reductionAmount or 0.04))
        TriggerClientEvent('helix_hospitality:client:updateBAC', src, playerBAC[src], nil, nil)
    end
end)

-- Natural BAC decay tick
CreateThread(function()
    while true do
        Wait(60000) -- 1 minute tick
        for src, bac in pairs(playerBAC) do
            if GetPlayerPing(src) > 0 then
                playerBAC[src] = math.max(0.0, bac - Config.Alcohol.DecayRatePerMinute)
                TriggerClientEvent('helix_hospitality:client:updateBAC', src, playerBAC[src], nil, nil)
            else
                playerBAC[src] = nil
            end
        end
    end
end)

AddEventHandler('playerDropped', function()
    local src = source
    playerBAC[src] = nil
end)

-- ============================================================================
-- POLICE BREATHALYZER TEST
-- ============================================================================
RegisterNetEvent('helix_hospitality:server:requestBreathalyzerTest', function(targetServerId)
    local src = source
    local targetPed = GetPlayerPed(targetServerId)

    if not targetPed or targetPed == 0 then
        TriggerClientEvent('helix_hospitality:client:notify', src, 'Target patron is not within range.', 'error')
        return
    end

    local currentBAC = playerBAC[targetServerId] or 0.0
    local targetName = Bridge.GetPlayerName(targetServerId)

    TriggerClientEvent('helix_hospitality:client:showBreathalyzerResult', src, targetName, currentBAC)
    TriggerClientEvent('helix_hospitality:client:notify', targetServerId, 'An officer is administering a breathalyzer test on you.', 'info')
end)
