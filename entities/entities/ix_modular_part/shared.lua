ENT.Type = "anim"
ENT.Base = "base_gmodentity"
ENT.PrintName = "Modular Structure Part"
ENT.Author = "HelixGame"
ENT.Category = "Helix Crime"
ENT.Spawnable = true
ENT.AdminOnly = true

function ENT:SetupDataTables()
    self:NetworkVar("String", 0, "PartType")
    self:NetworkVar("String", 1, "OwnerID")
end
