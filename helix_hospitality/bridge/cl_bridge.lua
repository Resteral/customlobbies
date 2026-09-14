Bridge = Bridge or {}

-- ============================================================================
-- CLIENT NOTIFICATIONS
-- ============================================================================
function Bridge.Notify(msg, nType, duration)
    nType = nType or 'info'
    duration = duration or 5000

    if Bridge.FrameworkName == 'qbcore' or Bridge.FrameworkName == 'qbox' then
        local QBCore = exports['qb-core']:GetCoreObject()
        QBCore.Functions.Notify(msg, nType, duration)
    elseif Bridge.FrameworkName == 'esx' then
        local ESX = exports['es_extended']:getSharedObject()
        ESX.ShowNotification(msg)
    elseif GetResourceState('ox_lib') == 'started' then
        lib.notify({
            description = msg,
            type = nType,
            duration = duration
        })
    else
        -- Native GTA 5 Banner Notification
        SetNotificationTextEntry('STRING')
        AddTextComponentSubstringPlayerName(msg)
        DrawNotification(false, false)
    end
end

-- ============================================================================
-- INTERACTION / TARGET WRAPPER
-- ============================================================================
local activeZones = {}

function Bridge.AddInteractionZone(name, coords, radius, options)
    if Bridge.TargetName == 'ox_target' and exports.ox_target then
        local oxOptions = {}
        for _, opt in ipairs(options) do
            table.insert(oxOptions, {
                name = name .. '_' .. opt.action,
                icon = opt.icon or 'fas fa-cocktail',
                label = opt.label,
                onSelect = function()
                    opt.onSelect()
                end,
                distance = radius or 2.0
            })
        end
        local zoneId = exports.ox_target:addSphereZone({
            coords = coords,
            radius = radius or 1.5,
            debug = Config.Debug,
            options = oxOptions
        })
        activeZones[name] = { type = 'ox_target', id = zoneId }
        return zoneId

    elseif (Bridge.TargetName == 'qb-target' or Bridge.TargetName == 'qtarget') and exports['qb-target'] then
        local qbOptions = {}
        for _, opt in ipairs(options) do
            table.insert(qbOptions, {
                icon = opt.icon or 'fas fa-cocktail',
                label = opt.label,
                action = function()
                    opt.onSelect()
                end
            })
        end
        exports['qb-target']:AddCircleZone(name, coords, radius or 1.5, {
            name = name,
            debugPoly = Config.Debug,
            useZ = true
        }, {
            options = qbOptions,
            distance = radius or 2.0
        })
        activeZones[name] = { type = 'qb-target', id = name }
        return name

    else
        -- Fallback: Native 3D Point & Floating Prompt [E]
        activeZones[name] = {
            type = 'native',
            coords = coords,
            radius = radius or 1.8,
            options = options
        }
        return name
    end
end

function Bridge.RemoveInteractionZone(name)
    local zone = activeZones[name]
    if not zone then return end

    if zone.type == 'ox_target' and exports.ox_target then
        exports.ox_target:removeZone(zone.id)
    elseif (zone.type == 'qb-target' or zone.type == 'qtarget') and exports['qb-target'] then
        exports['qb-target']:RemoveZone(zone.id)
    end
    activeZones[name] = nil
end

-- Fallback tick loop for native prompt rendering when target scripts are absent
CreateThread(function()
    while true do
        local sleep = 1000
        if Bridge.TargetName == 'none' then
            local plyPed = PlayerPedId()
            local plyCoords = GetEntityCoords(plyPed)

            for name, zone in pairs(activeZones) do
                if zone.type == 'native' then
                    local dist = #(plyCoords - zone.coords)
                    if dist <= (zone.radius + 1.0) then
                        sleep = 0
                        -- Draw subtle ground ring
                        DrawMarker(1, zone.coords.x, zone.coords.y, zone.coords.z - 1.0,
                            0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                            zone.radius * 0.8, zone.radius * 0.8, 0.3,
                            0, 200, 255, 120, false, false, 2, false, nil, nil, false)

                        if dist <= zone.radius then
                            local promptText = "~g~[E]~s~ " .. (zone.options[1] and zone.options[1].label or "Interact")
                            BeginTextCommandDisplayHelp('STRING')
                            AddTextComponentSubstringPlayerName(promptText)
                            EndTextCommandDisplayHelp(0, false, true, -1)

                            if IsControlJustReleased(0, 38) then -- [E]
                                if zone.options[1] and zone.options[1].onSelect then
                                    zone.options[1].onSelect()
                                end
                            end
                        end
                    end
                end
            end
        end
        Wait(sleep)
    end
end)
