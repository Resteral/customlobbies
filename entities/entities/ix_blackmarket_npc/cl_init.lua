include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local pos = self:GetPos() + Vector(0, 0, 78)
    local ang = LocalPlayer():EyeAngles()
    ang:RotateAroundAxis(ang:Forward(), 90)
    ang:RotateAroundAxis(ang:Right(), 90)

    if LocalPlayer():GetPos():DistToSqr(self:GetPos()) > 62500 then return end

    cam.Start3D2D(pos, Angle(0, ang.y, 90), 0.08)
        draw.SimpleText("BLACK MARKET DEALER", "DermaDefaultBold", 0, -30, Color(240, 60, 60), TEXT_ALIGN_CENTER)
        draw.SimpleText("[E] TRADE CONTRABAND & GEAR", "DermaDefault", 0, -10, Color(220, 220, 220), TEXT_ALIGN_CENTER)
    cam.End3D2D()
end
