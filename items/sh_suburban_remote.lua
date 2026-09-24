ITEM.name = "Suburban Master Defense Remote"
ITEM.description = "A heavy-duty wireless remote control paired with your home's garage blast doors, sprinkler defenses, sirens, and megaphone horns."
ITEM.model = "models/props_lab/keypad.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Suburban Defenses"
ITEM.price = 250

ITEM.functions.TriggerSprinklers = {
    name = "Activate Yard Sprinklers",
    tip = "Remotely engage pepper-gas sprinklers on lawn.",
    icon = "icon16/control_play.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        if SERVER then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("?? [REMOTE]: Yard Chemical Sprinklers remotely triggered by property owner!")
            net.WriteString("#06b6d4")
            net.Broadcast()
        end
        return false
    end
}

ITEM.functions.TriggerMegaphone = {
    name = "Broadcast Megaphone Warning",
    tip = "Remotely blast 'GET OFF MY LAWN' over roof PA.",
    icon = "icon16/sound.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        if SERVER then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("?? [REMOTE]: 'GET OFF MY LAWN! THIS IS PRIVATE PROPERTY!'")
            net.WriteString("#fbbf24")
            net.Broadcast()
        end
        return false
    end
}
