include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local pos = self:GetPos() + Vector(0, 0, 22)
    local ang = LocalPlayer():EyeAngles()
    ang:RotateAroundAxis(ang:Forward(), 90)
    ang:RotateAroundAxis(ang:Right(), 90)

    if LocalPlayer():GetPos():DistToSqr(self:GetPos()) > 62500 then return end

    cam.Start3D2D(pos, Angle(0, ang.y, 90), 0.08)
        draw.SimpleText("METH SYNTHESIS LAB", "DermaDefaultBold", 0, -50, Color(180, 80, 240), TEXT_ALIGN_CENTER)

        if self:GetIsCooking() then
            local temp = self:GetTemperature()
            local prog = self:GetProgress()
            local purity = self:GetPurity()

            local tempColor = Color(40, 220, 80)
            if temp > 100 then tempColor = Color(240, 60, 40) end

            draw.SimpleText("Temperature: " .. temp .. "°C", "DermaDefaultBold", 0, -25, tempColor, TEXT_ALIGN_CENTER)

            -- Progress Bar
            surface.SetDrawColor(30, 30, 30, 200)
            surface.DrawRect(-60, -5, 120, 15)
            surface.SetDrawColor(180, 80, 240, 240)
            surface.DrawRect(-58, -3, (116 * (prog / 100)), 11)
            draw.SimpleText("Cook: " .. prog .. "%", "DermaDefault", 0, -3, Color(255, 255, 255), TEXT_ALIGN_CENTER)

            draw.SimpleText("Batch Purity: " .. purity .. "%", "DermaDefault", 0, 18, Color(200, 200, 250), TEXT_ALIGN_CENTER)
        elseif self:GetProgress() >= 100 then
            draw.SimpleText("[E] COLLECT BATCH (" .. self:GetPurity() .. "% Purity)", "DermaDefaultBold", 0, -10, Color(255, 215, 0), TEXT_ALIGN_CENTER)
        elseif not self:GetHasChemicals() then
            draw.SimpleText("Status: Requires Precursor Chemicals", "DermaDefault", 0, -10, Color(220, 100, 100), TEXT_ALIGN_CENTER)
        else
            draw.SimpleText("[E] OPEN CONTROL PANEL", "DermaDefaultBold", 0, -10, Color(100, 220, 255), TEXT_ALIGN_CENTER)
        end
    cam.End3D2D()
end
