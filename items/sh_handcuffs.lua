ITEM.name = "Police Steel Handcuffs"
ITEM.description = "Heavy-duty double-locking law enforcement handcuffs used to restrain and detain suspects."
ITEM.model = "models/props_c17/tools_wrench01a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Law Enforcement"

ITEM.functions.Cuff = {
    name = "Restrain Suspect",
    tip = "Handcuff a suspect directly in front of you.",
    icon = "icon16/lock.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local target = trace.Entity

        if not IsValid(target) or not target:IsPlayer() or client:GetPos():DistToSqr(target:GetPos()) > 10000 then
            client:Notify("You must be facing a player within close distance!")
            return false
        end

        local isCuffed = target:GetNWBool("ixCuffed", false)
        if isCuffed then
            target:SetNWBool("ixCuffed", false)
            target:SetNWBool("ixBeingDragged", false)
            target:SetRunSpeed(220)
            target:SetWalkSpeed(100)
            client:Notify("You uncuffed " .. target:Name())
            target:Notify("You have been uncuffed by " .. client:Name())
        else
            target:SetNWBool("ixCuffed", true)
            target:SetRunSpeed(80)
            target:SetWalkSpeed(80)
            target:EmitSound("ambient/materials/chain_hang1.wav")
            client:Notify("You restrained and handcuffed " .. target:Name())
            target:Notify("You have been restrained and handcuffed by " .. client:Name())
        end

        return false
    end
}
