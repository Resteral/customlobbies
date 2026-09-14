local activeVenuesState = {}

RegisterNetEvent('helix_hospitality:client:syncVenues', function(venues)
    activeVenuesState = venues or {}
end)

-- ============================================================================
-- POS CASH REGISTER INTERACTION
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:openPOSRegister', function(venueId, registerId)
    local nearbyPlayers = {}
    local plyPed = PlayerPedId()
    local plyCoords = GetEntityCoords(plyPed)

    for _, playerId in ipairs(GetActivePlayers()) do
        local targetPed = GetPlayerPed(playerId)
        local targetCoords = GetEntityCoords(targetPed)
        if #(plyCoords - targetCoords) <= 15.0 then
            local serverId = GetPlayerServerId(playerId)
            local name = GetPlayerName(playerId)
            if playerId == PlayerId() then
                name = name .. ' (You)'
            end
            table.insert(nearbyPlayers, {
                id = serverId,
                name = name
            })
        end
    end

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open_pos',
        venueId = venueId,
        registerId = registerId,
        nearbyPlayers = nearbyPlayers
    })
end)

-- ============================================================================
-- BUSINESS SAFE
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:openVenueSafe', function(venueId)
    local venue = activeVenuesState[venueId]
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open_safe_modal',
        venueId = venueId,
        venueName = Config.Venues[venueId] and Config.Venues[venueId].name or venueId,
        balance = venue and venue.safe_balance or 0
    })
end)

-- ============================================================================
-- VENUE MANAGEMENT TABLET
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:openVenueTablet', function(venueId)
    TriggerServerEvent('helix_hospitality:server:getVenueDashboard', venueId)
end)

RegisterNetEvent('helix_hospitality:client:receiveVenueDashboard', function(data)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open_tablet',
        data = data
    })
end)

-- ============================================================================
-- DJ BOOTH SYSTEM
-- ============================================================================
RegisterNetEvent('helix_hospitality:client:openDJBooth', function(venueId)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open_dj_modal',
        venueId = venueId
    })
end)

RegisterNetEvent('helix_hospitality:client:syncDJTrack', function(venueId, audioUrl, volume)
    if CurrentVenue == venueId then
        SendNUIMessage({
            action = 'play_dj_audio',
            url = audioUrl,
            volume = volume or 0.8
        })
    end
end)

RegisterNetEvent('helix_hospitality:client:stopDJTrack', function(venueId)
    if CurrentVenue == venueId then
        SendNUIMessage({
            action = 'stop_dj_audio'
        })
    end
end)
