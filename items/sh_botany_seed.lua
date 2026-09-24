--[[
    City Underground Item: Cultivar Botanical Seed Pack
--]]

CityUnderground.Inventory.RegisterItem("botany_seed", {
    name = "Cultivar Botanical Seeds",
    description = "Hybrid herbal seeds suited for indoor hydroponic pot growth. Yields raw chemical reagents when mature.",
    category = "Agriculture",
    weight = 0.1,
    maxStack = 20,
    icon = "🌱",
    useText = "Plant in Hydroponic Pot",
    OnUse = function(ply, item)
        return false
    end
})
