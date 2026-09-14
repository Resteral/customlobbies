ITEM.name = "Thermite Charge"
ITEM.description = "Pyrotechnic chemical composition capable of creating intense heat to burn through vault hinges."
ITEM.model = "models/props_junk/garbage_metalcan002a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Heist Gear"

ITEM.functions.Plant = {
    name = "Plant Thermite",
    tip = "Attach thermite charge to vault hinges.",
    icon = "icon16/fire.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local ent = trace.Entity

        if IsValid(ent) and ent:GetClass() == "ix_bank_vault" then
            if ent:GetIsBurningThermite() then
                client:Notify("Thermite is already burning on this vault door!")
                return false
            end

            ent:StartThermiteBurn(client)
            client:Notify("Thermite charge ignited! Vault door hinges melting...")
            return true
        else
            client:Notify("You must face a Bank Vault door to attach thermite!")
            return false
        end
    end
}
