--[[
    City Underground Item: Pure Spring Water
--]]

CityUnderground.Inventory.RegisterItem("drink_water", {
    name = "Bottled Spring Water",
    description = "Cold filtered spring water bottle. Restores 45 Thirst.",
    category = "Consumable",
    weight = 0.5,
    maxStack = 6,
    icon = "💧",
    useText = "Drink Water",
    OnUse = function(ply, item)
        local char = CityUnderground.Character.GetActive(ply)
        if not char then return false end
        char.thirst = math.Clamp((char.thirst or 100) + 45, 0, 100)
        return true
    end
})
