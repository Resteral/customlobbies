ITEM.name = "Cocaine Brick"
ITEM.description = "A heavy pressed brick of pure cocaine powder. Valuable illegal commodity."
ITEM.model = "models/props_junk/cardboard_box004a.mdl"
ITEM.width = 2
ITEM.height = 1
ITEM.category = "Drugs"

ITEM.functions.Consume = {
    name = "Snort Portion",
    tip = "Snort a small portion for a temporary armor/health boost.",
    icon = "icon16/heart.png",
    OnRun = function(itemTable)
        local client = itemTable.player

        client:SetArmor(math.min(100, client:Armor() + 50))
        client:EmitSound("ambient/voices/cough1.wav")

        local plugin = ix.plugin.Get("Helix Drugs & Heists")
        if plugin then
            plugin:TriggerDrugEffect("cocaine", 40)
        end

        client:Notify("You snorted a portion of cocaine. Gained +50 Armor.")
        return true
    end
}
