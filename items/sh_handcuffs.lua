--[[
    City Underground Item: Police Restraint Handcuffs
--]]

CityUnderground.Inventory.RegisterItem("handcuffs", {
    name = "Steel Hinged Handcuffs",
    description = "Department-issued law enforcement physical restraints. Used to restrain and escort suspects.",
    category = "Law Enforcement",
    weight = 0.6,
    maxStack = 2,
    icon = "⛓️",
    useText = "Restrain Target",
    OnUse = function(ply, item)
        if CityUnderground.Police and CityUnderground.Police.RestrainTarget then
            return CityUnderground.Police.RestrainTarget(ply)
        end
        return false
    end
})
