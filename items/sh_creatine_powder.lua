--[[
    Item: Pure Creatine Monohydrate Tub
    Nutritional supplement granting +80 Physical Strength XP and +15% sprint recovery.
--]]

ITEM = ITEM or {}
ITEM.id = "creatine_powder"
ITEM.name = "Creatine Monohydrate (500g Tub)"
ITEM.category = "Consumables & Nutrition"
ITEM.model = "models/props/creatine_tub.mdl"
ITEM.icon = "💊"
ITEM.weight = 0.5
ITEM.price = 60
ITEM.description = "Micronized creatine powder. Grants +80 Physical Strength XP and increases muscle ATP regeneration."

function ITEM:OnUse(ply)
    if SERVER then
        if CityUnderground.Skills and CityUnderground.Skills.AddXP then
            CityUnderground.Skills.AddXP(ply, "strength", 80)
            CityUnderground.Notify(ply, "Gained +80 Physical Strength XP from Creatine! 💪", "success")
        end
    end
    return true
end
