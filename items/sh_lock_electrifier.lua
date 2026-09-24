ITEM.name = "Anti-Lockpick Handle Stun Rig"
ITEM.description = "A clip-on 10,000V capacitor trap that connects to metal door handles. Zaps unauthorized lockpickers and instantly destroys their picks."
ITEM.model = "models/props_lab/reciever01a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Suburban Defenses"
ITEM.price = 480

ITEM.functions.Use = {
    name = "Attach to Door Handle",
    tip = "Energize door handle with 10,000V anti-lockpick stun circuit.",
    icon = "icon16/lightning.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()

        if client:GetPos():DistToSqr(trace.HitPos) > 10000 then
            client:Notify("Too far away from door handle!")
            return false
        end

        if SERVER then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("? [STUN RIG]: Anti-Lockpick Handle Stun Rig clamped to door lock! High-voltage circuit energized!")
            net.WriteString("#eab308")
            net.Broadcast()
        end

        return true
    end
}
