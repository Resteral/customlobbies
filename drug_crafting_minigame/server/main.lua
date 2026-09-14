local function NotifyPlayer(src, message, typeStr)
    if Config.Framework == 'qbox' or GetResourceState('ox_lib') == 'started' then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Drug Laboratory',
            description = message,
            type = typeStr or 'inform'
        })
    else
        TriggerClientEvent('chat:addMessage', src, {
            args = { "DRUG LAB", message }
        })
    end
end

--- Check if player has required items for a recipe in QBox / ox_inventory
--- @param src number Player source
--- @param recipeConfig table Recipe table from Config.Recipes
--- @return boolean hasItems, string missingItemLabel
local function HasRequiredItems(src, recipeConfig)
    if not recipeConfig.requiredItems or #recipeConfig.requiredItems == 0 then
        return true, nil
    end

    if GetResourceState('ox_inventory') == 'started' then
        for _, req in ipairs(recipeConfig.requiredItems) do
            local count = exports.ox_inventory:GetItemCount(src, req.item)
            if not count or count < req.amount then
                return false, req.label or req.item
            end
        end
        return true, nil
    elseif GetResourceState('qbx_core') == 'started' then
        local player = exports.qbx_core:GetPlayer(src)
        if not player then return false, "Player not found" end

        for _, req in ipairs(recipeConfig.requiredItems) do
            local item = player.Functions.GetItemByName(req.item)
            if not item or item.amount < req.amount then
                return false, req.label or req.item
            end
        end
        return true, nil
    end

    -- Standalone default: assume player has items
    return true, nil
end

--- Remove required items from player inventory
--- @param src number Player source
--- @param recipeConfig table
local function RemoveRequiredItems(src, recipeConfig)
    if not recipeConfig.requiredItems then return end

    if GetResourceState('ox_inventory') == 'started' then
        for _, req in ipairs(recipeConfig.requiredItems) do
            exports.ox_inventory:RemoveItem(src, req.item, req.amount)
        end
    elseif GetResourceState('qbx_core') == 'started' then
        local player = exports.qbx_core:GetPlayer(src)
        if player then
            for _, req in ipairs(recipeConfig.requiredItems) do
                player.Functions.RemoveItem(req.item, req.amount)
            end
        end
    end
end

--- Award recipe rewards to player upon minigame completion
--- @param src number Player source
--- @param recipeConfig table
--- @param success boolean
--- @param purity number
--- @param yieldMultiplier number
local function AwardRecipeRewards(src, recipeConfig, success, purity, yieldMultiplier)
    if not success or yieldMultiplier <= 0 then
        if recipeConfig.failRewardItem then
            if GetResourceState('ox_inventory') == 'started' then
                exports.ox_inventory:AddItem(src, recipeConfig.failRewardItem, 1)
            elseif GetResourceState('qbx_core') == 'started' then
                local player = exports.qbx_core:GetPlayer(src)
                if player then player.Functions.AddItem(recipeConfig.failRewardItem, 1) end
            end
            NotifyPlayer(src, "Synthesis failed! You salvaged some chemical waste.", "error")
        else
            NotifyPlayer(src, "Synthesis failed! All materials were destroyed in the reaction.", "error")
        end
        return
    end

    local finalAmount = math.max(1, math.floor((recipeConfig.baseRewardAmount or 1) * yieldMultiplier))
    
    if GetResourceState('ox_inventory') == 'started' then
        exports.ox_inventory:AddItem(src, recipeConfig.rewardItem, finalAmount, { purity = purity })
    elseif GetResourceState('qbx_core') == 'started' then
        local player = exports.qbx_core:GetPlayer(src)
        if player then
            player.Functions.AddItem(recipeConfig.rewardItem, finalAmount, false, { purity = purity })
        end
    end

    NotifyPlayer(src, string.format("Synthesis Successful! Purity: %d%%. Received x%d %s", purity, finalAmount, recipeConfig.rewardItem or "Items"), "success")
end

-------------------------------------------------------------------------------
-- Server Events & Triggers
-------------------------------------------------------------------------------

-- Network event for client requesting to start crafting with item check
RegisterNetEvent('drug_crafting_minigame:server:requestCrafting', function(recipeKey)
    local src = source
    local recipeConfig = Config.Recipes[recipeKey]

    if not recipeConfig then
        NotifyPlayer(src, "Invalid crafting recipe selected.", "error")
        return
    end

    -- Check required materials
    local hasItems, missingItem = HasRequiredItems(src, recipeConfig)
    if not hasItems then
        NotifyPlayer(src, string.format("Missing required material: %s", missingItem), "error")
        return
    end

    -- Remove materials and start minigame on client
    RemoveRequiredItems(src, recipeConfig)
    TriggerClientEvent('drug_crafting_minigame:startCrafting', src, recipeKey)
end)

-- Network event when client completes crafting minigame
RegisterNetEvent('drug_crafting_minigame:server:finishCrafting', function(recipeKey, success, purity, grade, yieldMultiplier)
    local src = source
    local recipeConfig = Config.Recipes[recipeKey]
    if not recipeConfig then return end

    AwardRecipeRewards(src, recipeConfig, success, purity, yieldMultiplier)
end)

-------------------------------------------------------------------------------
-- Command & Exports
-------------------------------------------------------------------------------

RegisterCommand("testdrugminigame", function(source, args, rawCommand)
    local src = source
    local recipeKey = args[1] or "meth"

    if not Config.Recipes[recipeKey] then
        print(string.format("^3[drug_crafting_minigame] Invalid recipe '%s'. Available: meth, cocaine, weed_curing^7", recipeKey))
        return
    end

    if src > 0 then
        TriggerClientEvent('drug_crafting_minigame:startCrafting', src, recipeKey)
    else
        print("^1[drug_crafting_minigame] Command must be run in-game.^7")
    end
end, false)

-- QBox / Server Export
exports('StartCraftingForPlayer', function(playerId, recipeKey)
    local recipeConfig = Config.Recipes[recipeKey]
    if not recipeConfig then return false end
    
    local hasItems, missingItem = HasRequiredItems(playerId, recipeConfig)
    if not hasItems then return false, missingItem end

    RemoveRequiredItems(playerId, recipeConfig)
    TriggerClientEvent('drug_crafting_minigame:startCrafting', playerId, recipeKey)
    return true
end)
