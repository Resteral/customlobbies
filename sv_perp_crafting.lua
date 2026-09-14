-- Server PERP Crafting Logic for Helix
local PLUGIN = PLUGIN

util.AddNetworkString("ixPerpOpenCraftingUI")
util.AddNetworkString("ixPerpCraftItem")
util.AddNetworkString("ixPerpCraftResult")

net.Receive("ixPerpCraftItem", function(len, ply)
    local recipeID = net.ReadString()
    local benchEnt = net.ReadEntity()

    local recipe = PLUGIN.CraftingRecipes[recipeID]
    if not recipe then return end

    local character = ply:GetCharacter()
    if not character then return end

    local inventory = character:GetInventory()
    if not inventory then return end

    -- Verify distance to crafting bench if required
    if IsValid(benchEnt) and benchEnt:GetClass() == "ix_perp_crafting_bench" then
        if ply:GetPos():DistToSqr(benchEnt:GetPos()) > 40000 then
            ply:Notify("You are too far from the crafting workbench!")
            return
        end
    end

    -- Check required skills
    if recipe.reqSkills then
        for skillID, reqLvl in pairs(recipe.reqSkills) do
            local curLvl = character:GetSkillLevel(skillID)
            if curLvl < reqLvl then
                local sName = PLUGIN.Skills[skillID] and PLUGIN.Skills[skillID].name or skillID
                ply:Notify("You need " .. sName .. " Level " .. reqLvl .. " to craft this!")
                return
            end
        end
    end

    -- Check required ingredients
    for itemID, count in pairs(recipe.ingredients) do
        local items = inventory:GetItemsByUniqueID(itemID)
        if #items < count then
            ply:Notify("You do not have enough " .. itemID .. " (Need: " .. count .. ", Have: " .. #items .. ")")
            return
        end
    end

    -- Deduct ingredients
    for itemID, count in pairs(recipe.ingredients) do
        local items = inventory:GetItemsByUniqueID(itemID)
        for i = 1, count do
            if items[i] then
                inventory:Remove(items[i].id)
            end
        end
    end

    -- Give crafted item
    inventory:Add(recipe.result, recipe.amount or 1, {}, function(success, item)
        if success then
            ply:Notify("Successfully crafted: " .. recipe.name .. " x" .. (recipe.amount or 1))
            ply:EmitSound("ambient/machines/thumper_dust.wav", 60, 150)

            -- Award skill XP
            if recipe.xp then
                character:AddSkillXP(recipe.xp.skill or "crafting", recipe.xp.amount or 20)
            end

            net.Start("ixPerpCraftResult")
                net.WriteString(recipeID)
                net.WriteBool(true)
            net.Send(ply)
        else
            ply:Notify("Inventory full! Could not store crafted item.")
            net.Start("ixPerpCraftResult")
                net.WriteString(recipeID)
                net.WriteBool(false)
            net.Send(ply)
        end
    end)
end)
