ITEM.name = "Modular Metal Wall Part"
ITEM.description = "Heavy reinforced metal wall panel for constructing drug safehouses and vault enclosures."
ITEM.model = "models/props_building_details/storefront_template001a_bars.mdl"
ITEM.width = 2
ITEM.height = 2
ITEM.category = "Building Parts"

ITEM.functions.Place = {
    name = "Deploy Wall",
    tip = "Place modular wall panel on the ground in front of you.",
    icon = "icon16/building.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()

        local ent = ents.Create("ix_modular_part")
        ent:SetPos(trace.HitPos + Vector(0, 0, 20))
        ent:SetAngles(Angle(0, client:EyeAngles().y, 0))
        ent:SetModel("models/props_building_details/storefront_template001a_bars.mdl")
        ent:Spawn()
        ent:SetPartType("Metal Wall")

        local char = client:GetCharacter()
        if char then
            ent:SetOwnerID(tostring(char:GetID()))
        end

        client:Notify("Deployed Modular Metal Wall Panel.")
        return true
    end
}
