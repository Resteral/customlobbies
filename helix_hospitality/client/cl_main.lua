CurrentVenue = nil
local venueBlips = {}

-- ============================================================================
-- EMERGENCY UNLOCK / CLOSE UI COMMANDS
-- ============================================================================
RegisterCommand('closeui', function()
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'force_close' })
    Bridge.Notify('UI Closed & Focus Reset', 'info', 3000)
end, false)

RegisterCommand('barfix', function()
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'force_close' })
    Bridge.Notify('UI Closed & Focus Reset', 'info', 3000)
end, false)

-- ============================================================================
-- INITIALIZE BLIPS & VENUES
-- ============================================================================
CreateThread(function()
    for venueId, venue in pairs(Config.Venues) do
        if venue.blip then
            local blip = AddBlipForCoord(venue.blip.coords.x, venue.blip.coords.y, venue.blip.coords.z)
            SetBlipSprite(blip, venue.blip.sprite or 93)
            SetBlipDisplay(blip, 4)
            SetBlipScale(blip, venue.blip.scale or 0.8)
            SetBlipColour(blip, venue.blip.color or 48)
            SetBlipAsShortRange(blip, true)
            BeginTextCommandSetBlipName('STRING')
            AddTextComponentSubstringPlayerName(venue.name)
            EndTextCommandSetBlipName(blip)
            venueBlips[venueId] = blip
        end

        if venue.bars then
            for _, bar in ipairs(venue.bars) do
                local zoneName = 'helix_bar_' .. venueId .. '_' .. bar.id
                Bridge.AddInteractionZone(zoneName, bar.coords, 1.6, {
                    {
                        label = 'Open Mixology Station (' .. bar.label .. ')',
                        icon = 'fas fa-cocktail',
                        action = 'open_bar',
                        onSelect = function()
                            TriggerEvent('helix_hospitality:client:openMixologyStation', venueId, bar.id)
                        end
                    }
                })
            end
        end

        if venue.registers then
            for _, reg in ipairs(venue.registers) do
                local zoneName = 'helix_register_' .. venueId .. '_' .. reg.id
                Bridge.AddInteractionZone(zoneName, reg.coords, 1.4, {
                    {
                        label = 'Access Cash Register (' .. reg.label .. ')',
                        icon = 'fas fa-cash-register',
                        action = 'open_register',
                        onSelect = function()
                            TriggerEvent('helix_hospitality:client:openPOSRegister', venueId, reg.id)
                        end
                    }
                })
            end
        end

        if venue.safe then
            local zoneName = 'helix_safe_' .. venueId
            Bridge.AddInteractionZone(zoneName, venue.safe.coords, 1.2, {
                {
                    label = 'Open Business Safe',
                    icon = 'fas fa-vault',
                    action = 'open_safe',
                    onSelect = function()
                        TriggerEvent('helix_hospitality:client:openVenueSafe', venueId)
                    end
                }
            })
        end

        if venue.managementTablet then
            local zoneName = 'helix_tablet_' .. venueId
            Bridge.AddInteractionZone(zoneName, venue.managementTablet.coords, 1.4, {
                {
                    label = 'Access Venue Management Terminal',
                    icon = 'fas fa-tablet-screen-button',
                    action = 'open_tablet',
                    onSelect = function()
                        TriggerEvent('helix_hospitality:client:openVenueTablet', venueId)
                    end
                }
            })
        end

        if venue.djBooth then
            local zoneName = 'helix_dj_' .. venueId
            Bridge.AddInteractionZone(zoneName, venue.djBooth.coords, 1.8, {
                {
                    label = 'Access DJ Sound System',
                    icon = 'fas fa-compact-disc',
                    action = 'open_dj',
                    onSelect = function()
                        TriggerEvent('helix_hospitality:client:openDJBooth', venueId)
                    end
                }
            })
        end
    end

    TriggerServerEvent('helix_hospitality:server:getInitialState')
end)

CreateThread(function()
    while true do
        local sleep = 1500
        local plyPed = PlayerPedId()
        local plyCoords = GetEntityCoords(plyPed)
        local detectedVenue = nil

        for venueId, venue in pairs(Config.Venues) do
            if venue.door and #(plyCoords - venue.door.coords) < (venue.door.radius or 35.0) then
                detectedVenue = venueId
                sleep = 500
                break
            end
        end

        CurrentVenue = detectedVenue
        Wait(sleep)
    end
end)

RegisterNetEvent('helix_hospitality:client:notify', function(msg, nType)
    Bridge.Notify(msg, nType)
end)
