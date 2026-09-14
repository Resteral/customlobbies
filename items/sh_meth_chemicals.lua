ITEM.name = "Meth Precursor Chemicals"
ITEM.description = "A jug of volatile chemical ingredients required for cooking methamphetamine in a Meth Lab."
ITEM.model = "models/props_junk/garbage_plasticbottle003a.mdl"
ITEM.width = 1
ITEM.height = 2
ITEM.category = "Illegal Items"

ITEM.functions.AddIngredients = {
    name = "Add to Meth Lab",
    tip = "Pour chemicals into a Meth Lab station.",
    icon = "icon16/add.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local ent = trace.Entity

        if IsValid(ent) and ent:GetClass() == "ix_meth_lab" then
            if ent:GetHasChemicals() then
                client:Notify("This lab already has precursor chemicals loaded!")
                return false
            end

            ent:SetHasChemicals(true)
            ent:EmitSound("ambient/water/drip2.wav")
            client:Notify("You loaded precursor chemicals into the Meth Lab.")
            return true
        else
            client:Notify("You must look at a Meth Lab to add chemicals!")
            return false
        end
    end
}
