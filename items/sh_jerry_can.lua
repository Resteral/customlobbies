ITEM.name = "Fuel Jerry Can"
ITEM.description = "A 20L Jerry Can filled with fuel for replenishing empty vehicle gas tanks."
ITEM.model = "models/props_junk/gascan001a.mdl"
ITEM.width = 2
ITEM.height = 2
ITEM.category = "Vehicle & Mechanics"

ITEM.functions.Refuel = {
    name = "Refuel Vehicle",
    tip = "Fill up a vehicle fuel tank.",
    icon = "icon16/car.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local veh = trace.Entity

        if not IsValid(veh) or (not veh:IsVehicle() and veh:GetClass() ~= "prop_vehicle_jeep" and veh:GetClass() ~= "prop_vehicle_airboat") then
            client:Notify("You must be facing a vehicle!")
            return false
        end

        if client:GetPos():DistToSqr(veh:GetPos()) > 22500 then
            client:Notify("You are too far from the vehicle!")
            return false
        end

        client:SetAction("Refueling Vehicle...", 3.5, function()
            if IsValid(veh) and IsValid(client) then
                local curFuel = veh:GetNWInt("ixVehFuel", 100)
                local newFuel = math.min(100, curFuel + 50)
                veh:SetNWInt("ixVehFuel", newFuel)
                veh:EmitSound("ambient/water/water_splash1.wav", 65, 120)
                client:Notify("Vehicle refueled to " .. newFuel .. "% tank capacity!")
            end
        end)

        return true
    end
}
