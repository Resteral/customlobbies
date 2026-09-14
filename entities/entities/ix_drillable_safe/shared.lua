ENT.Type = "anim"
ENT.Base = "base_gmodentity"
ENT.PrintName = "Drillable Safe"
ENT.Author = "HelixGame"
ENT.Category = "Helix Crime"
ENT.Spawnable = true
ENT.AdminOnly = true

function ENT:SetupDataTables()
    self:NetworkVar("Bool", 0, "IsDrilling")
    self:NetworkVar("Bool", 1, "IsJammed")
    self:NetworkVar("Bool", 2, "IsOpen")
    self:NetworkVar("Int", 0, "DrillProgress")
end
