local activeDJTracks = {}
local activeVIPReservations = {}

-- ============================================================================
-- VIP BOTTLE SERVICE CEREMONY
-- ============================================================================
RegisterNetEvent('helix_hospitality:server:orderBottleService', function(venueId, packageId, targetTableId)
    local src = source
    local pkg = Config.BottleService.Packages[packageId]
    if not pkg then
        TriggerClientEvent('helix_hospitality:client:notify', src, 'Invalid bottle service selection.', 'error')
        return
    end

    if not Bridge.RemoveMoney(src, 'bank', pkg.price, 'VIP Bottle Service - ' .. pkg.label) then
        if not Bridge.RemoveMoney(src, 'cash', pkg.price, 'VIP Bottle Service - ' .. pkg.label) then
            TriggerClientEvent('helix_hospitality:client:notify', src, 'Insufficient funds for VIP bottle service ($' .. pkg.price .. ').', 'error')
            return
        end
    end

    -- Add cut to venue safe
    if venueId then
        local venueCut = math.floor(pkg.price * 0.70)
        Storage.UpdateVenueSafe(venueId, venueCut)
        Storage.AddLedgerEntry(venueId, 'BOTTLE_SERVICE', venueCut, 'VIP Bottle Service: ' .. pkg.label)
    end

    -- Broadcast bottle service sequence to nearby players (starts sparklers, tray anims)
    local serverId = src
    TriggerClientEvent('helix_hospitality:client:playBottleServiceCeremony', -1, serverId, venueId, packageId, targetTableId)
    TriggerClientEvent('helix_hospitality:client:notify', src, 'VIP Bottle Service Ceremony for ' .. pkg.label .. ' initiated!', 'success')
end)

-- ============================================================================
-- DJ BOOTH & AUDIO SYNC
-- ============================================================================
RegisterNetEvent('helix_hospitality:server:playDJTrack', function(venueId, audioUrl, volume)
    local src = source
    volume = volume or 0.8
    activeDJTracks[venueId] = {
        url = audioUrl,
        volume = volume,
        startedAt = os.time()
    }

    TriggerClientEvent('helix_hospitality:client:syncDJTrack', -1, venueId, audioUrl, volume)
end)

RegisterNetEvent('helix_hospitality:server:stopDJTrack', function(venueId)
    local src = source
    activeDJTracks[venueId] = nil
    TriggerClientEvent('helix_hospitality:client:stopDJTrack', -1, venueId)
end)
