ITEM.name = "Bobby Pin Lockpick"
ITEM.description = "A precision lockpicking tool used for picking door locks, vehicle ignitions, and property entrances."
ITEM.model = "models/props_lab/box01a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Tools & Burglary"

ITEM.functions.Use = {
    name = "Pick Lock",
    tip = "Attempt to pick a nearby door, safe, or vehicle lock.",
    icon = "icon16/key.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local ent = trace.Entity

        if not IsValid(ent) or client:GetPos():DistToSqr(ent:GetPos()) > 10000 then
            client:Notify("You are not looking at a valid lockable target!")
            return false
        end

        local isDoor = ent:IsDoor() or ent:GetClass() == "prop_door_rotating"
        local isVehicle = ent:IsVehicle() or ent:GetClass() == "prop_vehicle_jeep" or ent:GetClass() == "prop_vehicle_airboat"
        local isSafe = ent:GetClass() == "ix_drillable_safe"

        if not isDoor and not isVehicle and not isSafe then
            client:Notify("This object cannot be lockpicked!")
            return false
        end

        local char = client:GetCharacter()
        local lockSkill = char and char:GetSkillLevel("lockpicking") or 1

        net.Start("ixPerpStartLockpick")
            net.WriteEntity(ent)
            net.WriteInt(lockSkill, 8)
        net.Send(client)

        client:Notify("Engaging lock tumbler... Hold position!")
        return false -- We only consume on break or success handled via net
    end
}
