-- FiveM Vehicle Client Speedometer HUD & Key Fob VFX for Helix
local PLUGIN = PLUGIN

surface.CreateFont("FiveM_Speedo_Big", {
    font = "Montserrat",
    size = 32,
    weight = 800,
    antialias = true
})

surface.CreateFont("FiveM_Speedo_Small", {
    font = "Montserrat",
    size = 13,
    weight = 600,
    antialias = true
})

local smoothSpeed = 0

function PLUGIN:HUDPaint()
    local ply = LocalPlayer()
    if not IsValid(ply) or not ply:Alive() then return end

    local veh = ply:GetVehicle()
    if not IsValid(veh) then return end

    local scrW, scrH = ScrW(), ScrH()
    local vel = veh:GetVelocity():Length()
    local mph = math.floor(vel * (3600 / 63360) * 0.75) -- approximate source units to MPH
    smoothSpeed = Lerp(FrameTime() * 10, smoothSpeed, mph)

    local fuel = veh:GetNWInt("ixVehFuel", 100)
    local engineOn = veh:GetNWBool("ixVehEngine", false)
    local locked = veh:GetNWBool("ixVehLocked", false)
    local seatbelt = ply:GetNWBool("ixSeatbelt", false)

    -- Bottom-Right Speedometer Cluster
    local boxW, boxH = 190, 110
    local boxX = scrW - boxW - 35
    local boxY = scrH - boxH - 35

    -- Background
    surface.SetDrawColor(16, 20, 30, 220)
    surface.DrawRect(boxX, boxY, boxW, boxH)

    surface.SetDrawColor(40, 48, 65, 180)
    surface.DrawOutlinedRect(boxX, boxY, boxW, boxH)

    -- MPH Speed
    local speedCol = smoothSpeed > 100 and Color(231, 76, 60) or (smoothSpeed > 60 and Color(241, 196, 15) or Color(255, 255, 255))
    draw.SimpleText(string.format("%03d", math.floor(smoothSpeed)), "FiveM_Speedo_Big", boxX + 20, boxY + 12, speedCol, TEXT_ALIGN_LEFT)
    draw.SimpleText("MPH", "FiveM_Speedo_Small", boxX + 90, boxY + 28, Color(160, 165, 180), TEXT_ALIGN_LEFT)

    -- Engine & Lock Status Badges
    local engCol = engineOn and Color(46, 204, 113) or Color(231, 76, 60)
    draw.SimpleText(engineOn and "ENG ON" or "ENG OFF", "FiveM_Speedo_Small", boxX + 130, boxY + 14, engCol, TEXT_ALIGN_LEFT)

    local lockCol = locked and Color(231, 76, 60) or Color(46, 204, 113)
    draw.SimpleText(locked and "LOCKED" or "UNLOCKED", "FiveM_Speedo_Small", boxX + 130, boxY + 30, lockCol, TEXT_ALIGN_LEFT)

    -- Fuel Gauge Bar
    local fuelBarX, fuelBarY = boxX + 20, boxY + 60
    local fuelBarW, fuelBarH = boxW - 40, 10
    local fuelPct = math.Clamp(fuel / 100, 0, 1)

    surface.SetDrawColor(10, 12, 18, 240)
    surface.DrawRect(fuelBarX, fuelBarY, fuelBarW, fuelBarH)

    local fuelCol = fuelPct > 0.4 and Color(52, 152, 219) or (fuelPct > 0.15 and Color(241, 196, 15) or Color(231, 76, 60))
    surface.SetDrawColor(fuelCol)
    surface.DrawRect(fuelBarX, fuelBarY, fuelBarW * fuelPct, fuelBarH)

    surface.SetDrawColor(60, 70, 90, 120)
    surface.DrawOutlinedRect(fuelBarX, fuelBarY, fuelBarW, fuelBarH)

    draw.SimpleText("FUEL: " .. fuel .. "%", "FiveM_Speedo_Small", fuelBarX, fuelBarY + 14, Color(180, 185, 200), TEXT_ALIGN_LEFT)

    -- Seatbelt Warning
    local sbText = seatbelt and "SEATBELT [ON]" or "SEATBELT [OFF]"
    local sbColor = seatbelt and Color(46, 204, 113) or Color(231, 76, 60)
    draw.SimpleText(sbText, "FiveM_Speedo_Small", boxX + boxW - 20, fuelBarY + 14, sbColor, TEXT_ALIGN_RIGHT)
end

-- Key Fob Remote Chirp VFX (Flashing dynamic light)
net.Receive("ixVehFobEffect", function()
    local veh = net.ReadEntity()
    local isLocked = net.ReadBool()

    if IsValid(veh) then
        local dlight = DynamicLight(veh:EntIndex())
        if dlight then
            dlight.pos = veh:GetPos() + Vector(0, 0, 20)
            dlight.r = isLocked and 255 or 0
            dlight.g = isLocked and 50 or 255
            dlight.b = 100
            dlight.brightness = 5
            dlight.Decay = 1500
            dlight.Size = 350
            dlight.DieTime = CurTime() + 0.3
        end
    end
end)
