ENT.Type = "anim"
ENT.Base = "base_gmodentity"
ENT.PrintName = "Meth Lab Station"
ENT.Author = "HelixGame"
ENT.Category = "Helix Crime"
ENT.Spawnable = true
ENT.AdminOnly = true

function ENT:SetupDataTables()
    self:NetworkVar("Bool", 0, "HasChemicals")
    self:NetworkVar("Bool", 1, "IsCooking")
    self:NetworkVar("Int", 0, "Temperature")
    self:NetworkVar("Int", 1, "Progress")
    self:NetworkVar("Int", 2, "Purity")
end
