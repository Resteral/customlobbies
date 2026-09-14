-- ==============================================================================
-- Server Handler: tripo_rosin_press
-- ==============================================================================

RegisterNetEvent('tripo_rosin_press:server:completeAction', function()
    local src = source

    -- Ox Inventory Handler
    if exports['ox_inventory'] then
        local hasItem = exports.ox_inventory:GetItem(src, 'weed_baggy', nil, true)
        if hasItem and hasItem >= 1 then
            exports.ox_inventory:RemoveItem(src, 'weed_baggy', 1)
            exports.ox_inventory:AddItem(src, 'rosin_dabs', 1)
            TriggerClientEvent('ox_lib:notify', src, {
                title = 'Success!',
                description = 'Successfully crafted ' .. 'rosin_dabs' .. '!',
                type = 'success'
            })
        else
            TriggerClientEvent('ox_lib:notify', src, {
                title = 'Missing Ingredients',
                description = 'You need 1x ' .. 'weed_baggy' .. ' to craft this!',
                type = 'error'
            })
        end
    else
        -- QB-Core / Fallback
        TriggerClientEvent('ox_lib:notify', src, { title = 'Action Completed!', type = 'success' })
    end
end)
