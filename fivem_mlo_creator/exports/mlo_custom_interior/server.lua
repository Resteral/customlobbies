-- =========================================================================
-- FiveM In-Game MLO Studio - Server Event Handler & Auto-Persistence
-- Resource: mlo_custom_interior
-- =========================================================================

local savedHiddenBuildings = {}

RegisterNetEvent('mlo_maker:saveProject', function(entitiesList)
    local src = source
    local resourcePath = GetResourcePath(GetCurrentResourceName())

    if not entitiesList then return end

    print(("[^2MLO Studio^7] Player %d saved %d interior entities to server!"):format(src, #entitiesList))

    -- Save JSON backup
    local jsonPath = ('%s/mlo_custom_interior.mlo.json'):format(resourcePath)
    local file = io.open(jsonPath, 'w+')
    if file then
        file:write(json.encode({
            name = 'mlo_custom_interior',
            updatedAt = os.time(),
            entities = entitiesList,
            hiddenBuildings = savedHiddenBuildings
        }, { indent = true }))
        file:close()
    end

    TriggerClientEvent('chat:addMessage', src, {
        color = { 34, 197, 94 },
        multiline = true,
        args = { "MLO Studio", ("^2Saved %d placed props & walls to server disk successfully!^7"):format(#entitiesList) }
    })
end)

RegisterNetEvent('mlo_maker:saveHiddenBuildings', function(hiddenList)
    local src = source
    if not hiddenList then return end

    savedHiddenBuildings = hiddenList
    print(("[^2MLO Studio^7] Player %d updated hidden world buildings count: %d"):format(src, #hiddenList))

    -- Broadcast to all players so the building vanishes for everyone online
    TriggerClientEvent('mlo_maker:syncHiddenBuildings', -1, hiddenList)
end)
