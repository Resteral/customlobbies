-- FiveM MLO Interior Runtime Controller & Entity Set Manager
local interiorCoords = Config.Location
local currentInteriorId = 0

CreateThread(function()
    RequestIpl("mlo_underground_bunker_instance")
    
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
RegisterCommand("tp_" .. "mlo_underground_bunker", function()
    local ped = PlayerPedId()
    SetEntityCoords(ped, interiorCoords.x, interiorCoords.y, interiorCoords.z + 0.5, false, false, false, true)
end, false)
