include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local stationID = self:GetStationID()
    local system = ix.customSystems and ix.customSystems.Get(stationID)
    local name = system and system.name or "Interactive Station"
    local badgeCol = system and system.color or Color(52, 152, 219)

    local ply = LocalPlayer()
    if not IsValid(ply) then return end

    local distSq = ply:GetPos():DistToSqr(self:GetPos())
    if distSq > (250 * 250) then return end

    local pos = self:GetPos() + Vector(0, 0, 48)
    local ang = Angle(0, ply:EyeAngles().y - 90, 90)

    cam.Start3D2D(pos, ang, 0.08)
        -- Glow outline & background box
        draw.RoundedBox(8, -120, -25, 240, 50, Color(18, 22, 28, 220))
        draw.RoundedBox(2, -120, 23, 240, 4, badgeCol)
        draw.SimpleText(name, "DermaDefaultBold", 0, -8, Color(255, 255, 255), TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER)
        draw.SimpleText("[E] Open Station", "DermaDefault", 0, 10, Color(200, 210, 220), TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER)
    cam.End3D2D()
end
