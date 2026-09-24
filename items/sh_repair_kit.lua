--[[
    City Underground Item: Automotive Repair Kit
--]]

CityUnderground.Inventory.RegisterItem("repair_kit", {
    name = "Auto Wrench & Repair Kit",
    description = "Heavy duty ratchet, spark plugs, and coolant hose. Repairs vehicle engine and chassis damage.",
    category = "Utility",
    weight = 2.5,
    maxStack = 2,
    icon = "🔧",
    useText = "Repair Vehicle",
    OnUse = function(ply, item)
        if CityUnderground.Vehicles and CityUnderground.Vehicles.RepairNearestVehicle then
            local success, err = CityUnderground.Vehicles.RepairNearestVehicle(ply)
            return success
        end
        return false
    end
})
