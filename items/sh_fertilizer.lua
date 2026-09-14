ITEM.name = "Bio-Nutrient Fertilizer"
ITEM.description = "A nutrient-rich chemical fertilizer that speeds up weed plant growth by 50% and enhances harvest purity."
ITEM.model = "models/props_junk/garbage_bag001a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Botany & Agriculture"

ITEM.functions.Apply = {
    name = "Fertilize Plant",
    tip = "Apply fertilizer to a nearby weed pot.",
    icon = "icon16/leaf.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local pot = trace.Entity

        if not IsValid(pot) or pot:GetClass() ~= "ix_weed_pot" then
            client:Notify("You must be facing an active weed pot!")
            return false
        end

        if pot:GetNWBool("ixFertilized", false) then
            client:Notify("This weed pot is already fertilized!")
            return false
        end

        pot:SetNWBool("ixFertilized", true)
        pot:EmitSound("ambient/materials/sand1.wav", 65, 100)
        client:Notify("Applied Bio-Nutrient Fertilizer! Growth speed increased.")
        
        local char = client:GetCharacter()
        if char then
            char:AddSkillXP("chemistry", 20)
        end

        return true
    end
}
