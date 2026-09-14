AddCSLuaFile()

ENT.Type = "anim"
ENT.Base = "base_gmodentity"
ENT.PrintName = "Interactive Helix Station"
ENT.Author = "HelixGame"
ENT.Spawnable = true
ENT.AdminOnly = false
ENT.Category = "Helix Systems"

function ENT:SetupDataTables()
    self:NetworkVar("String", 0, "StationID")
end
