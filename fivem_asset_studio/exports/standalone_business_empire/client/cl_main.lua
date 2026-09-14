-- ==============================================================================
-- Client: Commercial Business Empire (standalone_business_empire)
-- 100% Standalone Architecture with Universal Bridge
-- ==============================================================================

local currentZone = nil

CreateThread(function()
    while true do
        local sleep = 1000
        local ped = PlayerPedId()
        local pCoords = GetEntityCoords(ped)

        for id, zone in pairs(Config.Zones or {}) do
            local dist = #(pCoords - zone.coords)
            if dist < 45.0 then
                sleep = 0
                DrawMarker(1, zone.coords.x, zone.coords.y, zone.coords.z - 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, zone.radius * 2.0, zone.radius * 2.0, 1.2, 46, 196, 182, 120, false, false, 2, false, nil, nil, false)
                
                if dist < zone.radius and not currentZone then
                    currentZone = id
                    TriggerServerEvent('standalone_business_empire:server:enterZone', id)
                    if lib and lib.notify then
                        lib.notify({ title = Config.SystemLabel, description = 'Entered ' .. zone.label, type = 'inform' })
                    end
                elseif dist >= zone.radius and currentZone == id then
                    currentZone = nil
                    TriggerServerEvent('standalone_business_empire:server:leaveZone', id)
                end
            end
        end
        Wait(sleep)
    end
end)


-- Custom Livery & Vehicle Extras Handler
RegisterCommand('setwrap', function(source, args)
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    if veh and veh > 0 then
        local liveryIndex = tonumber(args[1]) or 0
        SetVehicleLivery(veh, liveryIndex)
        SetVehicleMod(veh, 48, liveryIndex, false)
        if lib and lib.notify then lib.notify({ title = 'Livery Updated', description = 'Applied wrap #' .. liveryIndex, type = 'success' }) end
    end
end, false)



-- NPC Street Selling Mode Toggle
local isSelling = false
RegisterCommand('streetsell', function()
    isSelling = not isSelling
    if lib and lib.notify then
        lib.notify({ title = 'Street Selling', description = isSelling and 'Street sales activated! Buyers will approach.' or 'Street sales stopped.', type = isSelling and 'success' or 'inform' })
    end
end, false)

