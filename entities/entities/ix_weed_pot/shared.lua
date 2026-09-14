ENT.Type = "anim"
ENT.Base = "base_gmodentity"
ENT.PrintName = "Weed Pot"
ENT.Author = "HelixGame"
ENT.Category = "Helix Crime"
ENT.Spawnable = true
ENT.AdminOnly = true

function ENT:SetupDataTables()
    self:NetworkVar("Bool", 0, "HasSeed")
    self:NetworkVar("Int", 0, "Water")
    self:NetworkVar("Int", 1, "Growth")
end
