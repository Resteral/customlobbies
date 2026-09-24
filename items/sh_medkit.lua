--[[
    City Underground Item: First Aid Trauma Kit
--]]

CityUnderground.Inventory.RegisterItem("medkit", {
    name = "First Aid Trauma Kit",
    description = "Sterile trauma bandages and antiseptic solution. Restores 50 Health.",
    category = "Medical",
    weight = 0.8,
    maxStack = 3,
    icon = "🩹",
    useText = "Apply Bandages",
    OnUse = function(ply, item)
        local char = CityUnderground.Character.GetActive(ply)
        if not char then return false end
        char.health = math.Clamp((char.health or 100) + 50, 0, 100)
        if ply.SetHealth then ply:SetHealth(char.health) end
        return true
    end
})
