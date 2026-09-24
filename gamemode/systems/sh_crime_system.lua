--[[
    City Underground - Shared Crime System
    Fictional contraband synthesis recipes, laboratory states, and street buyers.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Crime = CityUnderground.Crime or {}

CityUnderground.Crime.SynthesisTimeSeconds = 12
CityUnderground.Crime.RequiredReagents = 1
CityUnderground.Crime.ProducedCrystals = 2
CityUnderground.Crime.BaseSellPrice = 450
CityUnderground.Crime.PoliceAlertChance = 0.35

CityUnderground.Crime.StreetBuyers = {
    ["npc_buyer_1"] = { name = "Shady Alley Broker", priceMod = 1.15, demand = "High" },
    ["npc_buyer_2"] = { name = "Night Club Bouncer Contact", priceMod = 0.95, demand = "Medium" },
    ["npc_buyer_3"] = { name = "Docks Fence", priceMod = 1.25, demand = "Surge" }
}
