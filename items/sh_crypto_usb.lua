ITEM.name = "Crypto Siphon USB Drive"
ITEM.description = "Encrypted cyber security USB flash drive designed to siphon uncollected crypto mining funds from enemy rigs."
ITEM.model = "models/props_lab/reciever01a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Heist Gear"

ITEM.functions.Siphon = {
    name = "Insert USB & Siphon",
    tip = "Plug USB drive into a Crypto Mining Rig to steal its earnings.",
    icon = "icon16/drive.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local ent = trace.Entity

        if IsValid(ent) and ent:GetClass() == "ix_crypto_farm" then
            local balance = ent:GetMinedBalance()
            if balance <= 0 then
                client:Notify("This Crypto Mining Rig has no accumulated funds to siphon!")
                return false
            end

            local char = client:GetCharacter()
            if char then
                char:GiveMoney(balance)
                ent:SetMinedBalance(0)
                client:EmitSound("ambient/machines/keyboard7_clicks.wav")
                client:Notify("Crypto Siphon USB successful! Stole $" .. balance .. " in crypto funds!")
                return true
            end
        else
            client:Notify("You must be facing a Crypto Mining Rig!")
            return false
        end
    end
}
