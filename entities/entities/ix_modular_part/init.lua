AddCSLuaFile("cl_init.lua")
AddCSLuaFile("shared.lua")
include("shared.lua")

function ENT:Initialize()
    self:SetModel("models/props_junk/wood_crate001a.mdl") -- Default fallback prop
    self:PhysicsInit(SOLID_VPHYSICS)
    self:SetMoveType(MOVETYPE_VPHYSICS)
    self:SetSolid(SOLID_VPHYSICS)
    self:SetUseType(SIMPLE_USE)

    local phys = self:GetPhysicsObject()
    if IsValid(phys) then
        phys:Wake()
        phys:EnableMotion(false) -- Freeze by default for building stability
    end

    self:SetPartType("wall")
    self:SetOwnerID("")
end

function ENT:Use(activator, caller)
    if not IsValid(caller) or not caller:IsPlayer() then return end

    local char = caller:GetCharacter()
    if not char then return end

    if self:GetOwnerID() == "" or self:GetOwnerID() == tostring(char:GetID()) or caller:IsAdmin() then
        -- Toggle freeze state
        local phys = self:GetPhysicsObject()
        if IsValid(phys) then
            local isMotionEnabled = phys:IsMotionEnabled()
            phys:EnableMotion(not isMotionEnabled)
            if not isMotionEnabled then
                phys:Wake()
                caller:Notify("Unfrozen structure part.")
            else
                caller:Notify("Frozen structure part in place.")
            end
        end
    else
        caller:Notify("You do not own this structure part!")
    end
end
