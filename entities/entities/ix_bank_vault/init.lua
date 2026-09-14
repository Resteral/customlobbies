AddCSLuaFile("cl_init.lua")
AddCSLuaFile("shared.lua")
include("shared.lua")

function ENT:Initialize()
    local defaultModel = "models/props_doors/doorfreezer01.mdl"
    local modelPath = defaultModel

    local plugin = ix.plugin.Get("Helix Drugs & Heists")
    if plugin then
        modelPath = plugin:GetAssetModel("bank_vault", defaultModel)
    end

    self:SetModel(modelPath)
    self:PhysicsInit(SOLID_VPHYSICS)
    self:SetMoveType(MOVETYPE_VPHYSICS)
    self:SetSolid(SOLID_VPHYSICS)
    self:SetUseType(SIMPLE_USE)

    local phys = self:GetPhysicsObject()
    if IsValid(phys) then phys:Wake() phys:EnableMotion(false) end

    self:SetIsOpen(false)
    self:SetIsHacked(false)
    self:SetIsBurningThermite(false)
    self:SetThermiteProgress(0)
    self.passcode = "1337"
    self.hackDifficulty = 5
end

function ENT:StartThermiteBurn(ply)
    self:SetIsBurningThermite(true)
    self:SetThermiteProgress(0)
    self:EmitSound("ambient/fire/mtov_flame2.wav")

    local plugin = ix.plugin.Get("Helix Drugs & Heists")
    if plugin then
        plugin:SendPoliceAlert(self:GetPos(), "CRITICAL: Thermite Charge Breach at Bank Vault!")
    end
end

function ENT:OnHackResult(ply, success)
    if success then
        self:SetIsHacked(true)
        self:ToggleVaultDoor()
        ply:Notify("Cyber Security Hack Succeeded! Vault Door Opening...")
        self:EmitSound("buttons/button3.wav")
    else
        ply:Notify("HACK FAILED! Security alarm triggered!")
        self:EmitSound("ambient/alerts/alarm1.wav")
        local plugin = ix.plugin.Get("Helix Drugs & Heists")
        if plugin then
            plugin:SendPoliceAlert(self:GetPos(), "SECURITY BREACH: Vault Hack Attempt Failed!")
        end
    end
end

function ENT:ToggleVaultDoor()
    local isOpen = self:GetIsOpen()
    self:SetIsOpen(not isOpen)

    if not isOpen then
        self:EmitSound("doors/door1_move.wav")
        self:SetCollisionGroup(COLLISION_GROUP_WORLD)
    else
        self:EmitSound("doors/door_latch3.wav")
        self:SetCollisionGroup(COLLISION_GROUP_NONE)
    end
end

function ENT:Think()
    if SERVER and self:GetIsBurningThermite() then
        local prog = self:GetThermiteProgress() + 4
        self:SetThermiteProgress(prog)

        if prog >= 100 then
            self:SetIsBurningThermite(false)
            self:ToggleVaultDoor()
            self:EmitSound("physics/metal/metal_box_break2.wav")
        end
    end
    self:NextThink(CurTime() + 1)
    return true
end

function ENT:Use(activator, caller)
    if not IsValid(caller) or not caller:IsPlayer() then return end

    if self:GetIsOpen() then
        self:ToggleVaultDoor()
        caller:Notify("Vault door closed.")
    else
        net.Start("ixVaultKeypadOpen")
            net.WriteEntity(self)
        net.Send(caller)
    end
end
