include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local pos = self:GetPos() + Vector(0, 0, 18)
    local ang = LocalPlayer():EyeAngles()
    ang:RotateAroundAxis(ang:Forward(), 90)
    ang:RotateAroundAxis(ang:Right(), 90)

    if LocalPlayer():GetPos():DistToSqr(self:GetPos()) > 62500 then return end -- 250 units distance render limit

    cam.Start3D2D(pos, Angle(0, ang.y, 90), 0.08)
        draw.SimpleText("CANNABIS POT", "DermaDefaultBold", 0, -50, Color(40, 220, 80), TEXT_ALIGN_CENTER)
        
        if self:GetHasSeed() then
            local growth = self:GetGrowth()
            local water = self:GetWater()

            -- Growth Bar
            surface.SetDrawColor(30, 30, 30, 200)
            surface.DrawRect(-60, -25, 120, 15)
            surface.SetDrawColor(40, 220, 80, 240)
            surface.DrawRect(-58, -23, (116 * (growth / 100)), 11)
            draw.SimpleText("Growth: " .. growth .. "%", "DermaDefault", 0, -23, Color(255, 255, 255), TEXT_ALIGN_CENTER)

            -- Water Bar
            surface.SetDrawColor(30, 30, 30, 200)
            surface.DrawRect(-60, 0, 120, 15)
            surface.SetDrawColor(40, 140, 240, 240)
            surface.DrawRect(-58, 2, (116 * (water / 100)), 11)
            draw.SimpleText("Water: " .. water .. "%", "DermaDefault", 0, 2, Color(255, 255, 255), TEXT_ALIGN_CENTER)

            if growth >= 100 then
                draw.SimpleText("[E] HARVEST BUDS", "DermaDefaultBold", 0, 25, Color(255, 215, 0), TEXT_ALIGN_CENTER)
            end
        else
            draw.SimpleText("Status: Empty Pot", "DermaDefault", 0, -20, Color(200, 200, 200), TEXT_ALIGN_CENTER)
            draw.SimpleText("Plant a Weed Seed", "DermaDefault", 0, 0, Color(150, 150, 150), TEXT_ALIGN_CENTER)
        end
    cam.End3D2D()
end
