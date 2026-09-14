ITEM.name = "Modular Lab Workbench"
ITEM.description = "Heavy industrial laboratory table for mounting weed pots and meth synthesis labs."
ITEM.model = "models/props_furniture/table001a.mdl"
ITEM.width = 2
ITEM.height = 2
ITEM.category = "Building Parts"

ITEM.functions.Place = {
    name = "Deploy Table",
    tip = "Place workbench on the ground in front of you.",
    icon = "icon16/table.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()

        local ent = ents.Create("ix_modular_part")
        ent:SetPos(trace.HitPos + Vector(0, 0, 15))
        ent:SetAngles(Angle(0, client:EyeAngles().y, 0))
        ent:SetModel("models/props_furniture/table001a.mdl")
        ent:Spawn()
        ent:SetPartType("Workbench")

        local char = client:GetCharacter()
        if char then
            ent:SetOwnerID(tostring(char:GetID()))
        end

        client:Notify("Deployed Modular Lab Workbench.")
        return true
    end
}
