include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local pos = self:GetPos() + Vector(0, 0, 20)
    local ang = LocalPlayer():EyeAngles()
    ang:RotateAroundAxis(ang:Forward(), 90)
    ang:RotateAroundAxis(ang:Right(), 90)

    if LocalPlayer():GetPos():DistToSqr(self:GetPos()) > 40000 then return end -- 200 units limit

    cam.Start3D2D(pos, Angle(0, ang.y, 90), 0.06)
        draw.SimpleText("MODULAR STRUCTURE (" .. string.upper(self:GetPartType() or "PART") .. ")", "DermaDefaultBold", 0, -20, Color(240, 180, 40), TEXT_ALIGN_CENTER)
        draw.SimpleText("[E] TOGGLE FREEZE / UNFREEZE", "DermaDefault", 0, 0, Color(200, 200, 200), TEXT_ALIGN_CENTER)
    cam.End3D2D()
end
