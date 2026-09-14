include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local pos = self:GetPos() + Vector(0, 0, 30)
    local ang = LocalPlayer():EyeAngles()
    ang:RotateAroundAxis(ang:Forward(), 90)
    ang:RotateAroundAxis(ang:Right(), 90)

    if LocalPlayer():GetPos():DistToSqr(self:GetPos()) > 62500 then return end

    cam.Start3D2D(pos, Angle(0, ang.y, 90), 0.08)
        draw.SimpleText("CRYPTO MINING RIG", "DermaDefaultBold", 0, -40, Color(0, 220, 255), TEXT_ALIGN_CENTER)
        
        local bal = self:GetMinedBalance()
        local temp = self:GetTemperature()

        draw.SimpleText("Uncollected Crypto: $" .. bal, "DermaDefaultBold", 0, -15, Color(100, 255, 100), TEXT_ALIGN_CENTER)
        draw.SimpleText("GPU Temp: " .. temp .. "°C", "DermaDefault", 0, 5, Color(220, 220, 220), TEXT_ALIGN_CENTER)
        draw.SimpleText("[E] WITHDRAW PROFITS", "DermaDefault", 0, 25, Color(255, 215, 0), TEXT_ALIGN_CENTER)
    cam.End3D2D()
end
