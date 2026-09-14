-- FiveM MLO Interior Runtime Controller & Entity Set Manager
local interiorCoords = Config.Location
local currentInteriorId = 0

CreateThread(function()
    RequestIpl("mlo_luxury_penthouse_bath_instance")
    
    -- Cache interior ID
    currentInteriorId = GetInteriorAtCoords(interiorCoords.x, interiorCoords.y, interiorCoords.z)
    
    if currentInteriorId ~= 0 and IsValidInterior(currentInteriorId) then
        PinInteriorInMemory(currentInteriorId)
        
        -- Activate Default Entity Sets
        for setName, data in pairs(Config.EntitySets) do
            if data.defaultActive then
                ActivateInteriorEntitySet(currentInteriorId, setName)
            end
        end
        
        RefreshInterior(currentInteriorId)
        print(("[^2MLO^7] Successfully loaded interior: %s (ID: %d)"):format(Config.InteriorName, currentInteriorId))
    end
end)

-- Command to toggle Entity Sets dynamically
RegisterCommand("mlo_toggle", function(source, args)
    local setName = args[1]
    if not setName then
        print("^3Usage: /mlo_toggle [entitySetName]^7")
        return
    end

    if currentInteriorId ~= 0 and IsValidInterior(currentInteriorId) then
        if IsInteriorEntitySetActive(currentInteriorId, setName) then
            DeactivateInteriorEntitySet(currentInteriorId, setName)
            print(("[^1MLO^7] Deactivated Entity Set: %s"):format(setName))
        else
            ActivateInteriorEntitySet(currentInteriorId, setName)
            print(("[^2MLO^7] Activated Entity Set: %s"):format(setName))
        end
        RefreshInterior(currentInteriorId)
    end
end, false)

-- Teleport Helper Command
RegisterCommand("tp_" .. "mlo_luxury_penthouse_bath", function()
    local ped = PlayerPedId()
    SetEntityCoords(ped, interiorCoords.x, interiorCoords.y, interiorCoords.z + 0.5, false, false, false, true)
end, false)

-- ==========================================
-- INTERACTIVE WINDOW CURTAINS & BLINDS (ox_target / qb-target / E-Interact)
-- ==========================================

local windowCurtains = {
    [1] = {
        name = "Luxury Velvet Curtains (Open)",
        coords = vec3(0.00, 8.08, 0.70),
        isOpen = true,
        modelOpen = `prop_curtain_open_01`,
        modelClosed = `prop_curtain_closed_01`
    }
}

-- Register Target Interaction for each Curtain / Blind
CreateThread(function()
    for id, curtain in pairs(windowCurtains) do
        -- ox_target support
        if exports.ox_target then
            exports.ox_target:addSphereZone({
                coords = curtain.coords,
                radius = 1.2,
                debug = false,
                options = {
                    {
                        name = 'toggle_curtain_' .. id,
                        icon = 'fa-solid fa-person-shelter',
                        label = 'Toggle Curtains / Blinds',
                        onSelect = function()
                            ToggleCurtain(id)
                        end
                    }
                }
            })
        end
    end
end)

function ToggleCurtain(id)
    local c = windowCurtains[id]
    if not c then return end

    c.isOpen = not c.isOpen
    
    -- Play cloth / blind rustle sound
    PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)

    -- Toggle interior entity set or replace object
    if currentInteriorId and currentInteriorId ~= 0 then
        if c.isOpen then
            ActivateInteriorEntitySet(currentInteriorId, "curtains_open")
            DeactivateInteriorEntitySet(currentInteriorId, "curtains_closed")
            print(("[^2MLO^7] Curtains Opened: %s"):format(c.name))
        else
            ActivateInteriorEntitySet(currentInteriorId, "curtains_closed")
            DeactivateInteriorEntitySet(currentInteriorId, "curtains_open")
            print(("[^1MLO^7] Curtains Closed: %s"):format(c.name))
        end
        RefreshInterior(currentInteriorId)
    end
end

-- Slash Command fallback: /togglecurtains
RegisterCommand("togglecurtains", function()
    local ped = PlayerPedId()
    local pCoords = GetEntityCoords(ped)
    for id, c in pairs(windowCurtains) do
        if #(pCoords - c.coords) < 3.0 then
            ToggleCurtain(id)
            return
        end
    end
    print("^3No window curtains nearby to toggle!^7")
end, false)

