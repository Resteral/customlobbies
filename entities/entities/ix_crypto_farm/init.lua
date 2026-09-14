AddCSLuaFile("cl_init.lua")
AddCSLuaFile("shared.lua")
include("shared.lua")

function ENT:Initialize()
    local defaultModel = "models/props_lab/serverbox.mdl"
    local modelPath = defaultModel

    local plugin = ix.plugin.Get("Helix Drugs & Heists")
    if plugin then
        modelPath = plugin:GetAssetModel("crypto_farm", defaultModel)
    end

    self:SetModel(modelPath)
    self:PhysicsInit(SOLID_VPHYSICS)
    self:SetMoveType(MOVETYPE_VPHYSICS)
    self:SetSolid(SOLID_VPHYSICS)
    self:SetUseType(SIMPLE_USE)

    local phys = self:GetPhysicsObject()
    if IsValid(phys) then phys:Wake() end

    self:SetIsMining(true)
    self:SetMinedBalance(0)
    self:SetTemperature(45)
    self.nextMineTick = CurTime() + 5
end

function ENT:Think()
    if SERVER and self:GetIsMining() then
        if CurTime() >= (self.nextMineTick or 0) then
            self.nextMineTick = CurTime() + 5
            
            local current = self:GetMinedBalance()
            self:SetMinedBalance(math.min(10000, current + math.random(50, 120)))
            self:SetTemperature(math.min(95, self:GetTemperature() + math.random(0, 2)))
        end
    end
    self:NextThink(CurTime() + 1)
    return true
end

function ENT:Use(activator, caller)
    if not IsValid(caller) or not caller:IsPlayer() then return end

    local char = caller:GetCharacter()
    if not char then return end

    local balance = self:GetMinedBalance()
    if balance > 0 then
        char:GiveMoney(balance)
        self:SetMinedBalance(0)
        self:EmitSound("mvm/mvm_money_pickup.wav")
        caller:Notify("Withdrew $" .. balance .. " in Crypto profits into clean cash!")
    else
        caller:Notify("Crypto Mining Rig active. Current uncollected balance: $0")
    end
end
