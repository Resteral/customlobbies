-- Mixology Server Logic
local defaultRecipes = {}

-- Load default recipes from data/recipes.json
local function LoadRecipes()
    local content = LoadResourceFile(GetCurrentResourceName(), 'data/recipes.json')
    if content and content ~= '' then
        local decoded = json.decode(content)
        if decoded and decoded.recipes then
            for _, r in ipairs(decoded.recipes) do
                defaultRecipes[r.id] = r
            end
        end
    end
end
LoadRecipes()

-- ============================================================================
-- CRAFTING & SERVING COCKTAILS
-- ============================================================================
RegisterNetEvent('helix_hospitality:server:craftDrink', function(venueId, recipeId, qualityScore, customDrinkData)
    local src = source
    local playerIdent = Bridge.GetPlayerIdentifier(src)
    local playerName = Bridge.GetPlayerName(src)

    local recipe = defaultRecipes[recipeId] or customDrinkData
    if not recipe then
        TriggerClientEvent('helix_hospitality:client:craftResult', src, false, 'Invalid drink recipe.')
        return
    end

    -- Verify player has required ingredients if Config.RequireIngredients is true
    if Config.RequireIngredients and recipe.ingredients then
        for _, ing in ipairs(recipe.ingredients) do
            if not Bridge.HasItem(src, ing.item, 1) then
                TriggerClientEvent('helix_hospitality:client:craftResult', src, false, 'Missing ingredient: ' .. (ing.label or ing.item))
                return
            end
        end

        -- Consume ingredients
        for _, ing in ipairs(recipe.ingredients) do
            Bridge.RemoveItem(src, ing.item, 1)
        end

        if recipe.garnish and recipe.garnish ~= '' then
            if Bridge.HasItem(src, recipe.garnish, 1) then
                Bridge.RemoveItem(src, recipe.garnish, 1)
            end
        end
    end

    -- Calculate Star Rating (1 to 5)
    qualityScore = math.max(0, math.min(100, tonumber(qualityScore) or 80))
    local stars = 1
    if qualityScore >= 95 then stars = 5
    elseif qualityScore >= 80 then stars = 4
    elseif qualityScore >= 65 then stars = 3
    elseif qualityScore >= 45 then stars = 2
    else stars = 1 end

    local starConfig = Config.Mixology.QualityStars[stars] or Config.Mixology.QualityStars[3]
    local drinkItemName = 'crafted_cocktail'
    local drinkMetadata = {
        label = recipe.label .. ' (' .. string.rep('★', stars) .. ')',
        recipeId = recipe.id,
        stars = stars,
        bartender = playerName,
        alcoholStrength = (recipe.alcoholStrength or 1.0) * starConfig.drunkMultiplier,
        buffType = recipe.buffType or 'stamina',
        buffDuration = math.floor((recipe.buffDuration or 120) * starConfig.buffMultiplier),
        color = recipe.color or 'rgba(255, 120, 100, 0.8)',
        glassType = recipe.glassType or 'rocks',
        description = recipe.description or 'A freshly hand-crafted cocktail.'
    }

    Bridge.AddItem(src, drinkItemName, 1, drinkMetadata)

    -- Boost venue hype
    if venueId and Config.Venues[venueId] then
        Storage.AddLedgerEntry(venueId, 'DRINK_CRAFT', recipe.basePrice or 35, 'Crafted ' .. recipe.label .. ' by ' .. playerName)
    end

    TriggerClientEvent('helix_hospitality:client:craftResult', src, true, 'Successfully crafted ' .. recipe.label .. ' with ' .. stars .. ' Stars!', drinkMetadata)
end)

-- ============================================================================
-- REGISTER SIGNATURE COCKTAILS
-- ============================================================================
RegisterNetEvent('helix_hospitality:server:saveSignatureDrink', function(venueId, drinkData)
    local src = source
    local playerIdent = Bridge.GetPlayerIdentifier(src)

    if not venueId or not drinkData or not drinkData.label then
        TriggerClientEvent('helix_hospitality:client:notify', src, 'Invalid drink specifications.', 'error')
        return
    end

    drinkData.id = 'sig_' .. venueId .. '_' .. tostring(os.time())
    drinkData.venueId = venueId
    drinkData.creator = playerIdent

    Storage.SaveSignatureDrink(drinkData, function(success)
        if success then
            TriggerClientEvent('helix_hospitality:client:notify', src, 'Signature cocktail "' .. drinkData.label .. '" registered on the venue menu!', 'success')
            -- Broadcast updated signature drinks to clients in venue
            Storage.GetVenueSignatureDrinks(venueId, function(drinks)
                TriggerClientEvent('helix_hospitality:client:updateVenueSignatureDrinks', -1, venueId, drinks)
            end)
        else
            TriggerClientEvent('helix_hospitality:client:notify', src, 'Failed to save signature cocktail.', 'error')
        end
    end)
end)

-- Fetch venue signature drinks
RegisterNetEvent('helix_hospitality:server:getVenueSignatureDrinks', function(venueId)
    local src = source
    Storage.GetVenueSignatureDrinks(venueId, function(drinks)
        TriggerClientEvent('helix_hospitality:client:updateVenueSignatureDrinks', src, venueId, drinks)
    end)
end)
