ITEM.name = "Cyber Hacking Device"
ITEM.description = "Electronic bypass tablet capable of hijacking security terminals, cameras, and electronic keypads."
ITEM.model = "models/props_lab/reciever01b.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Heist Gear"

ITEM.functions.Hack = {
    name = "Connect & Hack",
    tip = "Connect device to a hacking terminal or security keypad.",
    icon = "icon16/computer.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local ent = trace.Entity

        if IsValid(ent) and (ent:GetClass() == "ix_hack_terminal" or ent:GetClass() == "ix_bank_vault") then
            if ent:GetIsHacked() then
                client:Notify("This terminal is already hacked!")
                return false
            end

            local plugin = ix.plugin.Get("Helix Drugs & Heists")
            if plugin and plugin:GetPoliceCount() < ix.config.Get("minPoliceForHeist", 2) then
                client:Notify("Not enough police officers online to hack security systems!")
                return false
            end

            net.Start("ixHeistStartMinigame")
                net.WriteEntity(ent)
                net.WriteInt(ent.hackDifficulty or 4, 8)
            net.Send(client)

            client:Notify("Initiating bypass connection...")
            return false -- Keep device in inventory unless destroyed or used up
        else
            client:Notify("Look at a Security Terminal or Electronic Vault to hack!")
            return false
        end
    end
}
