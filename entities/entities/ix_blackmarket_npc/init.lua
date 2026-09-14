AddCSLuaFile("cl_init.lua")
AddCSLuaFile("shared.lua")
include("shared.lua")

function ENT:Initialize()
    local defaultModel = "models/gman_high.mdl"
    local modelPath = defaultModel

    local plugin = ix.plugin.Get("Helix Drugs & Heists")
    if plugin then
        modelPath = plugin:GetAssetModel("blackmarket_npc", defaultModel)
    end

    self:SetModel(modelPath)
    self:SetHullType(HULL_HUMAN)
    self:SetHullSizeNormal()
    self:SetNPCState(NPC_STATE_SCRIPT)
    self:SetSolid(SOLID_BBOX)
    self:SetUseType(SIMPLE_USE)
    self:DropToFloor()
end

function ENT:AcceptInput(name, activator, caller)
    if name == "Use" and IsValid(caller) and caller:IsPlayer() then
        net.Start("ixOpenBlackMarketUI")
            net.WriteEntity(self)
        net.Send(caller)
    end
end
