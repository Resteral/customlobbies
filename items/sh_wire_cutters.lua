ITEM.name = "Tactical Wire Cutters & Defusal Kit"
ITEM.description = "Insulated heavy wire cutters capable of snipping tripwires, disarming explosive garden gnomes, and bypassing electric fence gates."
ITEM.model = "models/weapons/w_crowbar.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Tools & Burglary"
ITEM.price = 175

ITEM.functions.Use = {
    name = "Defuse Nearby Defense Trap",
    tip = "Carefully snip tripwire triggers on neighbor defenses.",
    icon = "icon16/cut.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()

        if client:GetPos():DistToSqr(trace.HitPos) > 10000 then
            client:Notify("Target defense trap too far away to cut!")
            return false
        end

        client:Notify("?? Snipping defense trigger wires... Stand still!")
        return false
    end
}
