ITEM.name = "Weed Baggie"
ITEM.description = "A baggie of dried cannabis buds. Can be smoked for a high and light healing effect."
ITEM.model = "models/props_junk/garbage_bag001a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Drugs"

ITEM.functions.Consume = {
    name = "Smoke",
    tip = "Smoke the weed to gain stamina, light health regen, and visual high.",
    icon = "icon16/user.png",
    OnRun = function(itemTable)
        local client = itemTable.player

        client:SetHealth(math.min(client:GetMaxHealth(), client:Health() + 25))
        client:EmitSound("ambient/fire/mtov_flame2.wav")

        net.Start("ixPoliceAlert") -- Optional warning if smoked around police
        
        -- Trigger client screen shader
        local plugin = ix.plugin.Get("Helix Drugs & Heists")
        if plugin then
            plugin:TriggerDrugEffect("weed", 60)
        end

        client:Notify("You smoked a weed baggie. Feeling relaxed...")
        return true
    end
}
