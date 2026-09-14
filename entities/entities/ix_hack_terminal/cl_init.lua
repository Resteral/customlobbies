include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local pos = self:GetPos() + Vector(0, 0, 15)
    local ang = LocalPlayer():EyeAngles()
    ang:RotateAroundAxis(ang:Forward(), 90)
    ang:RotateAroundAxis(ang:Right(), 90)

    if LocalPlayer():GetPos():DistToSqr(self:GetPos()) > 62500 then return end

    cam.Start3D2D(pos, Angle(0, ang.y, 90), 0.08)
        draw.SimpleText("SECURITY CONTROL TERMINAL", "DermaDefaultBold", 0, -40, Color(80, 200, 240), TEXT_ALIGN_CENTER)

        if self:GetIsHacked() then
            draw.SimpleText("STATUS: OFFLINE (BYPASSED)", "DermaDefaultBold", 0, -10, Color(40, 240, 80), TEXT_ALIGN_CENTER)
        else
            draw.SimpleText("STATUS: ONLINE & MONITORING", "DermaDefault", 0, -10, Color(240, 60, 60), TEXT_ALIGN_CENTER)
        end
    cam.End3D2D()
end
