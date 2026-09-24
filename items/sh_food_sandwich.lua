--[[
    City Underground Item: Deli Roast Sandwich
--]]

CityUnderground.Inventory.RegisterItem("food_sandwich", {
    name = "Deli Roast Sandwich",
    description = "Freshly prepared sub sandwich with roasted turkey, cheese, and crisp lettuce. Restores 40 Hunger.",
    category = "Consumable",
    weight = 0.35,
    maxStack = 5,
    icon = "🥪",
    useText = "Eat Sandwich",
    OnUse = function(ply, item)
        local char = CityUnderground.Character.GetActive(ply)
        if not char then return false end
        char.hunger = math.Clamp((char.hunger or 100) + 40, 0, 100)
        return true
    end
})
