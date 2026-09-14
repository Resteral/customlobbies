ITEM.name = "Duffel Bag of Cash"
ITEM.description = "Heavy duffel bag stuffed with stolen bearer bonds and cash bills."
ITEM.model = "models/props_junk/cardboard_box001a.mdl"
ITEM.width = 2
ITEM.height = 2
ITEM.category = "Heist Gear"

ITEM.functions.Open = {
    name = "Loot Cash",
    tip = "Empty the duffel bag contents into your wallet.",
    icon = "icon16/money_add.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local character = client:GetCharacter()

        local cashValue = itemTable:GetData("value", math.random(2500, 5000))
        if character then
            character:GiveMoney(cashValue)
            client:EmitSound("mvm/mvm_money_pickup.wav")
            client:Notify("You unpacked the duffel bag and scored $" .. cashValue .. " in clean cash!")
            return true
        end

        return false
    end
}
