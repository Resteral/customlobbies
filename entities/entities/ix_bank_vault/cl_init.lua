include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local pos = self:GetPos() + Vector(0, 0, 45)
    local ang = LocalPlayer():EyeAngles()
    ang:RotateAroundAxis(ang:Forward(), 90)
    ang:RotateAroundAxis(ang:Right(), 90)

    if LocalPlayer():GetPos():DistToSqr(self:GetPos()) > 62500 then return end

    cam.Start3D2D(pos, Angle(0, ang.y, 90), 0.08)
        draw.SimpleText("HIGH-SECURITY BANK VAULT", "DermaDefaultBold", 0, -50, Color(240, 200, 40), TEXT_ALIGN_CENTER)

        if self:GetIsBurningThermite() then
            local prog = self:GetThermiteProgress()
            surface.SetDrawColor(30, 30, 30, 200)
            surface.DrawRect(-60, -15, 120, 15)
            surface.SetDrawColor(255, 100, 20, 240)
            surface.DrawRect(-58, -13, (116 * (prog / 100)), 11)
            draw.SimpleText("Thermite Melting: " .. prog .. "%", "DermaDefault", 0, -13, Color(255, 255, 255), TEXT_ALIGN_CENTER)
        elseif self:GetIsOpen() then
            draw.SimpleText("STATUS: OPEN", "DermaDefaultBold", 0, -15, Color(40, 240, 80), TEXT_ALIGN_CENTER)
        else
            draw.SimpleText("STATUS: LOCKED (KEYCARD / HACK / THERMITE)", "DermaDefault", 0, -15, Color(240, 60, 60), TEXT_ALIGN_CENTER)
        end
    cam.End3D2D()
end
