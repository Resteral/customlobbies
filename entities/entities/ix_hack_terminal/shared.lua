ENT.Type = "anim"
ENT.Base = "base_gmodentity"
ENT.PrintName = "Security Hack Terminal"
ENT.Author = "HelixGame"
ENT.Category = "Helix Crime"
ENT.Spawnable = true
ENT.AdminOnly = true

function ENT:SetupDataTables()
    self:NetworkVar("Bool", 0, "IsHacked")
end
