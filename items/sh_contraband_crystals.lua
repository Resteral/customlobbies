--[[
    City Underground Item: Refined Starlight Crystals (Fictional Contraband)
--]]

CityUnderground.Inventory.RegisterItem("contraband_crystals", {
    name = "Refined Starlight Crystals",
    description = "Luminescent synthetic crystalline compound created through timed laboratory synthesis. Highly valuable to street buyers.",
    category = "Contraband",
    weight = 0.3,
    maxStack = 20,
    icon = "💎",
    isContraband = true,
    useText = "Examine Purity",
    OnUse = function(ply, item)
        return false
    end
})
