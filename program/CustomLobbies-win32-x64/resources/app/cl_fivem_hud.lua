-- FiveM-Style Modern Glassmorphic HUD & Compass for Helix
local PLUGIN = PLUGIN

surface.CreateFont("FiveM_HUD_Large", {
    font = "Montserrat",
    size = 20,
    weight = 700,
    antialias = true
})

surface.CreateFont("FiveM_HUD_Medium", {
    font = "Montserrat",
    size = 15,
    weight = 600,
    antialias = true
})

surface.CreateFont("FiveM_HUD_Small", {
    font = "Montserrat",
    size = 12,
    weight = 600,
    antialias = true
})

surface.CreateFont("FiveM_Compass", {
    font = "Montserrat",
    size = 16,
    weight = 800,
    antialias = true
})

local smoothHP = 100
local smoothArmor = 0
local smoothStamina = 100
local smoothMoney = 0

-- Helper to draw rounded glassmorphic status pill
local function DrawStatusPill(x, y, w, h, iconText, percent, mainColor, bgColor)
    surface.SetDrawColor(bgColor or Color(15, 18, 25, 200))
    surface.DrawRect(x, y, w, h)

    -- Fill bar
    local fillW = math.Clamp(w * percent, 0, w)
    surface.SetDrawColor(mainColor)
    surface.DrawRect(x, y, fillW, h)

    -- Border
    surface.SetDrawColor(255, 255, 255, 35)
    surface.DrawOutlinedRect(x, y, w, h)

    -- Icon / Short tag
    draw.SimpleText(iconText, "FiveM_HUD_Small", x + 6, y + (h / 2) - 6, Color(255, 255, 255, 230), TEXT_ALIGN_LEFT)
end

-- Function to get compass cardinal heading
local function GetCompassHeading(yaw)
    local directions = { "N", "NE", "E", "SE", "S", "SW", "W", "NW" }
    local index = math.floor(((yaw + 22.5) % 360) / 45) + 1
    return directions[index] or "N"
end

function PLUGIN:HUDPaint()
    if not ix.config.Get("enableFiveMHUD", true) then return end

    local ply = LocalPlayer()
    if not IsValid(ply) or not ply:Alive() or not ply:GetCharacter() then return end

    local scrW, scrH = ScrW(), ScrH()
    local curTime = CurTime()
    local char = ply:GetCharacter()

    -- Smooth interpolation
    local targetHP = ply:Health()
    local targetArmor = ply:Armor()
    local targetStamina = ply:GetLocalVar("stm", 100)
    local targetMoney = char:GetMoney()

    smoothHP = Lerp(FrameTime() * 8, smoothHP, targetHP)
    smoothArmor = Lerp(FrameTime() * 8, smoothArmor, targetArmor)
    smoothStamina = Lerp(FrameTime() * 8, smoothStamina, targetStamina)
    smoothMoney = Lerp(FrameTime() * 6, smoothMoney, targetMoney)

    local baseX = 35
    local baseY = scrH - 120

    -- 1. Voice Chat / Mic Range Indicator (Whisper / Normal / Shout)
    local voiceRange = ply:GetNWInt("ixVoiceMode", 2) -- 1 = Whisper, 2 = Normal, 3 = Shout
    local isSpeaking = ply:IsSpeaking()
    local voiceColor = isSpeaking and Color(46, 204, 113, 240) or Color(200, 200, 200, 180)

    surface.SetDrawColor(18, 22, 32, 220)
    surface.DrawRect(baseX, baseY - 32, 100, 24)
    surface.SetDrawColor(voiceColor)
    surface.DrawOutlinedRect(baseX, baseY - 32, 100, 24)

    local voiceName = voiceRange == 1 and "WHISPER" or (voiceRange == 3 and "SHOUT" or "NORMAL")
    draw.SimpleText("MIC: " .. voiceName, "FiveM_HUD_Small", baseX + 10, baseY - 26, voiceColor, TEXT_ALIGN_LEFT)

    -- Pulsing active mic indicator
    if isSpeaking then
        local pulse = math.abs(math.sin(curTime * 8)) * 4
        surface.SetDrawColor(46, 204, 113, 200)
        surface.DrawRect(baseX + 85 - pulse / 2, baseY - 24 - pulse / 2, 8 + pulse, 8 + pulse)
    end

    -- 2. FiveM Status Indicators (Health, Armor, Stamina)
    local pillW = 55
    local pillH = 14
    local spacing = 6

    -- Health
    local hpPct = math.Clamp(smoothHP / ply:GetMaxHealth(), 0, 1)
    local hpColor = hpPct > 0.5 and Color(46, 204, 113, 220) or (hpPct > 0.25 and Color(241, 196, 15, 220) or Color(231, 76, 60, 220))
    DrawStatusPill(baseX, baseY, pillW, pillH, "HP", hpPct, hpColor)

    -- Armor
    local armorPct = math.Clamp(smoothArmor / 100, 0, 1)
    DrawStatusPill(baseX + (pillW + spacing), baseY, pillW, pillH, "ARM", armorPct, Color(52, 152, 219, 220))

    -- Stamina
    local stmPct = math.Clamp(smoothStamina / 100, 0, 1)
    DrawStatusPill(baseX + (pillW + spacing) * 2, baseY, pillW, pillH, "STM", stmPct, Color(243, 156, 18, 220))

    -- 3. FiveM Cash & Bank Display (Top-right of screen)
    local cashX = scrW - 40
    local cashY = 30

    -- Cash
    draw.SimpleText("$" .. string.Comma(math.floor(smoothMoney)), "FiveM_HUD_Large", cashX, cashY, Color(46, 204, 113, 240), TEXT_ALIGN_RIGHT)
    draw.SimpleText("CASH", "FiveM_HUD_Small", cashX, cashY - 14, Color(180, 185, 195, 200), TEXT_ALIGN_RIGHT)

    -- Bank
    local bankMoney = char:GetData("bank", 5000)
    draw.SimpleText("$" .. string.Comma(bankMoney), "FiveM_HUD_Medium", cashX, cashY + 28, Color(52, 152, 219, 240), TEXT_ALIGN_RIGHT)
    draw.SimpleText("BANK", "FiveM_HUD_Small", cashX, cashY + 16, Color(180, 185, 195, 200), TEXT_ALIGN_RIGHT)

    -- 4. FiveM Street Location & Compass (Bottom Center / Left HUD)
    local ang = ply:EyeAngles()
    local heading = GetCompassHeading(ang.y)
    local zoneText = "LOS SANTOS / DISTRICT 1"
    
    surface.SetDrawColor(15, 18, 26, 200)
    surface.DrawRect(baseX, baseY + 24, 210, 24)
    surface.SetDrawColor(45, 52, 70, 180)
    surface.DrawOutlinedRect(baseX, baseY + 24, 210, 24)

    draw.SimpleText("[" .. heading .. "] " .. zoneText, "FiveM_HUD_Small", baseX + 10, baseY + 29, Color(255, 255, 255, 240), TEXT_ALIGN_LEFT)
end
