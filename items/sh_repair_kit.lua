ITEM.name = "Vehicle Repair Kit"
ITEM.description = "A heavy-duty toolbox with replacement parts and fluids for repairing damaged vehicle engines and tires."
ITEM.model = "models/props_c17/tools_wrench01a.mdl"
ITEM.width = 2
ITEM.height = 2
ITEM.category = "Vehicle & Mechanics"

ITEM.functions.Use = {
    name = "Repair Vehicle",
    tip = "Fix a smoking or damaged vehicle engine.",
    icon = "icon16/wrench.png",
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

        local char = client:GetCharacter()
        local driveSkill = char and char:GetSkillLevel("driving") or 1
        local repairAmt = 50 + (driveSkill * 3)

        client:SetAction("Repairing Engine...", 4, function()
            if IsValid(veh) and IsValid(client) then
                local curHealth = veh:GetNWInt("ixVehHealth", 100)
                local newHealth = math.min(100, curHealth + repairAmt)
                veh:SetNWInt("ixVehHealth", newHealth)
                veh:EmitSound("ambient/energy/spark1.wav")
                client:Notify("Vehicle repaired to " .. newHealth .. "% health!")
                
                if char then
                    char:AddSkillXP("driving", 30)
                end
            end
        end)

        return true
    end
}
