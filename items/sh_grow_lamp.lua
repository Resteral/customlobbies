ITEM.name = "UV Hydroponic Grow Lamp"
ITEM.description = "A high-intensity ultraviolet grow lamp that can be placed over crops and weed pots to drastically improve photosynthesis."
ITEM.model = "models/props_c17/light_cagelight02_on.mdl"
ITEM.width = 2
ITEM.height = 1
ITEM.category = "Botany & Agriculture"

ITEM.functions.Deploy = {
    name = "Deploy Lamp",
    tip = "Place down a UV Grow Lamp on the ground or ceiling.",
    icon = "icon16/lightbulb.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()

        local ent = ents.Create("ix_perp_grow_lamp")
        ent:SetPos(trace.HitPos + Vector(0, 0, 10))
        ent:SetAngles(Angle(0, client:EyeAngles().y, 0))
        ent:Spawn()
        ent:Activate()
        ent.ixOwner = client

        client:Notify("Deployed UV Grow Lamp!")
        return true
    end
}
