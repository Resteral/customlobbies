ITEM.name = "Modular Security Grate"
ITEM.description = "Steel security fence grate panel for securing windows and lab entrances."
ITEM.model = "models/props_wasteland/barricade001a.mdl"
ITEM.width = 2
ITEM.height = 2
ITEM.category = "Building Parts"

ITEM.functions.Place = {
    name = "Deploy Grate",
    tip = "Place security grate in front of you.",
    icon = "icon16/shield.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()

        local ent = ents.Create("ix_modular_part")
        ent:SetPos(trace.HitPos + Vector(0, 0, 20))
        ent:SetAngles(Angle(0, client:EyeAngles().y, 0))
        ent:SetModel("models/props_wasteland/barricade001a.mdl")
        ent:Spawn()
        ent:SetPartType("Security Grate")

        local char = client:GetCharacter()
        if char then
            ent:SetOwnerID(tostring(char:GetID()))
        end

        client:Notify("Deployed Modular Security Grate.")
        return true
    end
}
