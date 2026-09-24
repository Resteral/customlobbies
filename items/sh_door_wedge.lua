ITEM.name = "Titanium Door Jammer Wedge"
ITEM.description = "A heavy-duty serrated titanium door wedge designed to be kicked under doors from the interior. Completely prevents lockpicked doors from opening."
ITEM.model = "models/props_c17/tools_pliers01a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Suburban Defenses"
ITEM.price = 140

ITEM.functions.Use = {
    name = "Kick Wedge Under Door",
    tip = "Firmly jam nearest door shut from inside.",
    icon = "icon16/lock_add.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()

        if client:GetPos():DistToSqr(trace.HitPos) > 10000 then
            client:Notify("Door too far away to jam with wedge!")
            return false
        end

        if SERVER then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("?? [JAMMER]: Titanium Door Wedge firmly kicked under entrance door! Lockpick penetration blocked!")
            net.WriteString("#0284c7")
            net.Broadcast()
        end

        return true
    end
}
