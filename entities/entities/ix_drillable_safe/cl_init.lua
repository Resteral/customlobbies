include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local pos = self:GetPos() + Vector(0, 0, 30)
    local ang = LocalPlayer():EyeAngles()
    ang:RotateAroundAxis(ang:Forward(), 90)
    ang:RotateAroundAxis(ang:Right(), 90)

    if LocalPlayer():GetPos():DistToSqr(self:GetPos()) > 62500 then return end

    cam.Start3D2D(pos, Angle(0, ang.y, 90), 0.08)
        draw.SimpleText("REINFORCED SAFE", "DermaDefaultBold", 0, -50, Color(220, 220, 220), TEXT_ALIGN_CENTER)

        if self:GetIsDrilling() then
            if self:GetIsJammed() then
                draw.SimpleText("[E] DRILL JAMMED - REPAIR NOW!", "DermaDefaultBold", 0, -15, Color(255, 40, 40), TEXT_ALIGN_CENTER)
            else
                local prog = self:GetDrillProgress()
                surface.SetDrawColor(30, 30, 30, 200)
                surface.DrawRect(-60, -15, 120, 15)
                surface.SetDrawColor(240, 140, 40, 240)
                surface.DrawRect(-58, -13, (116 * (prog / 100)), 11)
                draw.SimpleText("Drilling: " .. prog .. "%", "DermaDefault", 0, -13, Color(255, 255, 255), TEXT_ALIGN_CENTER)
            end
        elseif self:GetIsOpen() then
            draw.SimpleText("[E] LOOT SAFE CASH", "DermaDefaultBold", 0, -15, Color(255, 215, 0), TEXT_ALIGN_CENTER)
        else
            draw.SimpleText("Status: Locked", "DermaDefault", 0, -15, Color(180, 180, 180), TEXT_ALIGN_CENTER)
        end
    cam.End3D2D()
end
