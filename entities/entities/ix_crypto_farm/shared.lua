ENT.Type = "anim"
ENT.Base = "base_gmodentity"
ENT.PrintName = "Crypto Mining Rig"
ENT.Author = "HelixGame"
ENT.Category = "Helix Crime"
ENT.Spawnable = true
ENT.AdminOnly = true

function ENT:SetupDataTables()
    self:NetworkVar("Bool", 0, "IsMining")
    self:NetworkVar("Int", 0, "MinedBalance")
    self:NetworkVar("Int", 1, "Temperature")
end
