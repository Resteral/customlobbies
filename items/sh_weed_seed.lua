ITEM.name = "Weed Seeds"
ITEM.description = "High grade cannabis seeds ready to be planted in a growth pot."
ITEM.model = "models/props_junk/garbage_bag001a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Illegal Items"

ITEM.functions.Plant = {
    name = "Plant Seed",
    tip = "Plant this seed into a nearby Weed Pot.",
    icon = "icon16/plant.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local ent = trace.Entity

        if IsValid(ent) and ent:GetClass() == "ix_weed_pot" then
            if ent:GetHasSeed() then
                client:Notify("This pot already has a growing seed!")
                return false
            end

            ent:SetHasSeed(true)
            ent:SetGrowth(0)
            ent:EmitSound("ambient/levels/canals/sludge_drip1.wav")
            client:Notify("You planted a weed seed in the pot.")
            return true
        else
            client:Notify("You must be looking at a Weed Pot to plant this seed!")
            return false
        end
    end,
    OnCanRun = function(itemTable)
        return true
    end
}
