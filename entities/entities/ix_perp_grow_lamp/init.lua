AddCSLuaFile("cl_init.lua")
AddCSLuaFile("shared.lua")
include("shared.lua")

function ENT:Initialize()
    self:SetModel("models/props_c17/light_cagelight02_on.mdl")
    self:PhysicsInit(SOLID_VPHYSICS)
    self:SetMoveType(MOVETYPE_VPHYSICS)
    self:SetSolid(SOLID_VPHYSICS)
    self:SetUseType(SIMPLE_USE)

    local phys = self:GetPhysicsObject()
    if IsValid(phys) then
        phys:Wake()
    end

    self:SetNWBool("ixLampActive", true)

    -- Timer to boost nearby weed pots
    timer.Create("ix_lamp_boost_" .. self:EntIndex(), 5, 0, function()
        if not IsValid(self) then return end
        if not self:GetNWBool("ixLampActive", true) then return end

        for _, ent in ipairs(ents.FindInSphere(self:GetPos(), 180)) do
            if ent:GetClass() == "ix_weed_pot" and ent:GetWater() > 0 and ent:GetGrowth() < 100 then
                local growth = ent:GetGrowth()
                ent:SetGrowth(math.min(100, growth + 2))
                ent:SetNWBool("ixLampPowered", true)
            end
        end
    end)
end

function ENT:OnRemove()
    timer.Remove("ix_lamp_boost_" .. self:EntIndex())
end

function ENT:Use(activator)
    if not IsValid(activator) or not activator:IsPlayer() then return end

    local active = self:GetNWBool("ixLampActive", true)
    self:SetNWBool("ixLampActive", not active)

    if not active then
        self:EmitSound("buttons/button9.wav")
        activator:Notify("UV Grow Lamp powered ON.")
    else
        self:EmitSound("buttons/button19.wav")
        activator:Notify("UV Grow Lamp powered OFF.")
    end
end
