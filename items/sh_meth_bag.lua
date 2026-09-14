ITEM.name = "Crystal Meth Baggie"
ITEM.description = "A baggie of crystal meth. Highly potent, granting extreme movement speed and adrenaline."
ITEM.model = "models/props_junk/garbage_bag001a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Drugs"

ITEM.functions.Consume = {
    name = "Inhale",
    tip = "Consume crystal meth for a intense speed boost and adrenaline surge.",
    icon = "icon16/lightning.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local quality = itemTable:GetData("quality", 90)

        local originalSpeed = client:GetRunSpeed()
        client:SetRunSpeed(originalSpeed * 1.45)

        client:EmitSound("ambient/machines/steam_release1.wav")

        timer.Create("ixMethSpeed_" .. client:SteamID64(), 45, 1, function()
            if IsValid(client) then
                client:SetRunSpeed(originalSpeed)
                client:Notify("The meth adrenaline surge wears off.")
            end
        end)

        local plugin = ix.plugin.Get("Helix Drugs & Heists")
        if plugin then
            plugin:TriggerDrugEffect("meth", 45)
        end

        client:Notify("You consumed crystal meth (" .. quality .. "% Purity)! Adrenaline pumping!")
        return true
    end
}
