include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local pos = self:GetPos() + Vector(0, 0, 36)
    local ang = self:GetAngles()

    ang:RotateAroundAxis(ang:Up(), 90)
    ang:RotateAroundAxis(ang:Forward(), 90)

    if EyePos():DistToSqr(self:GetPos()) > 65536 then return end

    cam.Start3D2D(pos, ang, 0.1)
        surface.SetDrawColor(20, 24, 32, 230)
        surface.DrawRect(-150, -35, 300, 70)

        surface.SetDrawColor(243, 156, 18, 220)
        surface.DrawRect(-150, -35, 300, 4)
        surface.DrawOutlinedRect(-150, -35, 300, 70)

        draw.SimpleText("CRAFTING WORKBENCH", "DermaDefaultBold", 0, -20, Color(255, 255, 255), TEXT_ALIGN_CENTER)
        draw.SimpleText("[E] Open Blueprint Catalog", "DermaDefault", 0, 5, Color(243, 156, 18), TEXT_ALIGN_CENTER)
    cam.End3D2D()
end
