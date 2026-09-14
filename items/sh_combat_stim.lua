-- Helix Item Definition: Combat Stimulant
ITEM.name = "Combat Stimulant"
ITEM.description = "A useful item in the world."
ITEM.model = "models/props_junk/garbage_plasticbottle003a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Medical"
ITEM.price = 120

ITEM.functions.Consume = {
    name = "Consume",
    tip = "useTip",
    icon = "icon16/cup.png",
    OnRun = function(item)
        local client = item.player
        local char = client:GetCharacter()
        if not char then return false end

        client:SetHealth(math.min(client:GetMaxHealth(), client:Health() + 40))
        client:EmitSound("npc/barnacle/barnacle_gulp1.wav")
        client:Notify("You consumed " .. item.name .. " (+40 HP).")
        return true
    end
}
