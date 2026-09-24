--[[
    City Underground - Shared Botany & Hydroponics System
    Defines plant genetics, growth stages, watering needs, and harvest yields.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Botany = CityUnderground.Botany or {}

CityUnderground.Botany.GrowthStages = {
    [1] = { name = "Germinated Seedling", minProgress = 0, icon = "🌱" },
    [2] = { name = "Vegetative Foliage", minProgress = 30, icon = "🌿" },
    [3] = { name = "Budding Flowering", minProgress = 70, icon = "🪴" },
    [4] = { name = "Ready for Harvest", minProgress = 100, icon = "🌾" }
}

CityUnderground.Botany.BaseGrowthTimeSeconds = 60
CityUnderground.Botany.WaterCapacity = 100
CityUnderground.Botany.HarvestYieldMin = 2
CityUnderground.Botany.HarvestYieldMax = 4
