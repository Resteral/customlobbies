--[[
    Item: Whey Protein Recovery Shake
    Consumable workout beverage boosting Physical Strength XP (+50 XP) and restoring +35 Stamina.
--]]

ITEM = ITEM or {}
ITEM.id = "protein_shake"
ITEM.name = "Whey Isolate Protein Shake"
ITEM.category = "Consumables & Nutrition"
ITEM.model = "models/props/protein_bottle.mdl"
ITEM.icon = "🥤"
ITEM.weight = 0.5
ITEM.price = 35
ITEM.description = "High-protein anabolic recovery shake. Grants +50 Physical Strength XP and restores 35% stamina."

function ITEM:OnUse(ply)
    if SERVER then
        if CityUnderground.Skills and CityUnderground.Skills.AddXP then
            CityUnderground.Skills.AddXP(ply, "strength", 50)
            CityUnderground.Notify(ply, "Gained +50 Physical Strength XP from Protein Shake! 💪", "success")
        end
    end
    return true
end
