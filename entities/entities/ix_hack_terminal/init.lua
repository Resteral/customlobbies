AddCSLuaFile("cl_init.lua")
AddCSLuaFile("shared.lua")
include("shared.lua")

function ENT:Initialize()
    local defaultModel = "models/props_lab/monitor01a.mdl"
    local modelPath = defaultModel

    local plugin = ix.plugin.Get("Helix Drugs & Heists")
    if plugin then
        modelPath = plugin:GetAssetModel("hack_terminal", defaultModel)
    end

    self:SetModel(modelPath)
    self:PhysicsInit(SOLID_VPHYSICS)
    self:SetMoveType(MOVETYPE_VPHYSICS)
    self:SetSolid(SOLID_VPHYSICS)
    self:SetUseType(SIMPLE_USE)

    local phys = self:GetPhysicsObject()
    if IsValid(phys) then phys:Wake() phys:EnableMotion(false) end

    self:SetIsHacked(false)
    self.hackDifficulty = 4
end

function ENT:OnHackResult(ply, success)
    if success then
        self:SetIsHacked(true)
        ply:Notify("Security Network Offline! Cameras & Alarms disabled!")
        self:EmitSound("buttons/button1.wav")
    else
        ply:Notify("HACK FAILED! Security system locked out!")
        self:EmitSound("ambient/alerts/alarm1.wav")
        local plugin = ix.plugin.Get("Helix Drugs & Heists")
        if plugin then
            plugin:SendPoliceAlert(self:GetPos(), "ALERT: Security Terminal Tamper Detected!")
        end
    end
end

function ENT:Use(activator, caller)
    if not IsValid(caller) or not caller:IsPlayer() then return end

    if self:GetIsHacked() then
        caller:Notify("Terminal is currently offline / hacked.")
    else
        caller:Notify("Use a Cyber Hacking Device to breach this terminal.")
    end
end
