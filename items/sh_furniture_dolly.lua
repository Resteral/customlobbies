ITEM.name = "Heavy Furniture Moving Dolly"
ITEM.description = "An industrial four-wheel furniture dolly. Allows players to rapidly shove, drag, and reposition heavy bookcases, wardrobes, and stoves to blockade breached doors."
ITEM.model = "models/props_wasteland/controlroom_chair001a.mdl"
ITEM.width = 2
ITEM.height = 2
ITEM.category = "Tools & Utility"
ITEM.price = 220

ITEM.functions.Use = {
    name = "Equip Dolly & Shove",
    tip = "Enables rapid barricade shoving and dragging mode.",
    icon = "icon16/arrow_out.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        client:Notify("??? Furniture Dolly equipped! Walk up to heavy bookshelves or wardrobes and hold [E] to shove!")
        return false
    end
}
