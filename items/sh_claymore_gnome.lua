ITEM.name = "Tactical Claymore Lawn Gnome"
ITEM.description = "A seemingly innocent ceramic garden gnome packed with military-grade directional blast powder and proximity trip-sensors."
ITEM.model = "models/props_junk/terracotta01.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Suburban Defenses"
ITEM.price = 320

ITEM.functions.Use = {
    name = "Arm Lawn Gnome",
    tip = "Plant and arm the claymore gnome on your lawn or porch perimeter.",
    icon = "icon16/bomb.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()

        if client:GetPos():DistToSqr(trace.HitPos) > 10000 then
            client:Notify("Too far away to plant lawn defense!")
            return false
        end

        if SERVER then
            local gnome = ents.Create("prop_physics")
            if IsValid(gnome) then
                gnome:SetModel("models/props_junk/terracotta01.mdl")
                gnome:SetPos(trace.HitPos)
                gnome:Spawn()
                gnome:SetNWBool("IsClaymoreGnome", true)
                gnome:SetNWEntity("OwnerPlayer", client)
                client:Notify("Tactical Lawn Gnome planted and armed! Proximity sensor live.")
            end
        end

        return true
    end
}
