ITEM.name = "Security Vault Keycard"
ITEM.description = "Encrypted keycard credentials used to bypass high-security electronic locks."
ITEM.model = "models/props_lab/clipboard.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Heist Gear"

ITEM.functions.Swipe = {
    name = "Swipe Keycard",
    tip = "Swipe card at a vault door lock.",
    icon = "icon16/key.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local ent = trace.Entity

        if IsValid(ent) and ent:GetClass() == "ix_bank_vault" then
            if ent:GetIsOpen() then
                client:Notify("The vault door is already unlocked!")
                return false
            end

            ent:ToggleVaultDoor()
            client:EmitSound("buttons/button14.wav")
            client:Notify("Keycard accepted! Access Granted.")
            return true
        else
            client:Notify("Look at a Bank Vault door to swipe keycard!")
            return false
        end
    end
}
