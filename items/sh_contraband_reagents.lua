--[[
    City Underground Item: Abstract Chemical Reagent Pack
--]]

CityUnderground.Inventory.RegisterItem("contraband_reagents", {
    name = "Reagent Flask Alpha & Catalyst",
    description = "Abstract industrial solvent precursor used in synthesis chambers. Unmarked chemical components.",
    category = "Contraband Ingredient",
    weight = 0.8,
    maxStack = 10,
    icon = "🧪",
    isContraband = true,
    useText = "Inspect Chemicals",
    OnUse = function(ply, item)
        return false
    end
})
