ENT.Type = "anim"
ENT.Base = "base_gmodentity"
ENT.PrintName = "Bank Vault Door"
ENT.Author = "HelixGame"
ENT.Category = "Helix Crime"
ENT.Spawnable = true
ENT.AdminOnly = true

function ENT:SetupDataTables()
    self:NetworkVar("Bool", 0, "IsOpen")
    self:NetworkVar("Bool", 1, "IsHacked")
    self:NetworkVar("Bool", 2, "IsBurningThermite")
    self:NetworkVar("Int", 0, "ThermiteProgress")
end
