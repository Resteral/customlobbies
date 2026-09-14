include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    if not self:GetNWBool("ixLampActive", true) then return end

    local dlight = DynamicLight(self:EntIndex())
    if dlight then
        dlight.pos = self:GetPos() - Vector(0, 0, 10)
        dlight.r = 180
        dlight.g = 40
        dlight.b = 255
        dlight.brightness = 3
        dlight.Decay = 1000
        dlight.Size = 250
        dlight.DieTime = CurTime() + 0.1
    end
end
