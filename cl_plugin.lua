local PLUGIN = PLUGIN

PLUGIN.activeDrugEffects = PLUGIN.activeDrugEffects or {}

-- Drug trip visuals screen effect hook
function PLUGIN:RenderScreenspaceEffects()
    local curTime = CurTime()
    local activeTrip = false
    local colorModify = {
        ["$pp_colour_addr"] = 0,
        ["$pp_colour_addg"] = 0,
        ["$pp_colour_addb"] = 0,
        ["$pp_colour_brightness"] = 0,
        ["$pp_colour_contrast"] = 1,
        ["$pp_colour_colour"] = 1,
        ["$pp_colour_mulr"] = 0,
        ["$pp_colour_mulg"] = 0,
        ["$pp_colour_mulb"] = 0
    }

    if PLUGIN.activeDrugEffects["weed"] and PLUGIN.activeDrugEffects["weed"] > curTime then
        activeTrip = true
        local timeLeft = PLUGIN.activeDrugEffects["weed"] - curTime
        local intensity = math.min(1, timeLeft / 30)
        DrawMotionBlur(0.1, 0.5 * intensity, 0.05)
        colorModify["$pp_colour_colour"] = 1 + (0.8 * intensity)
        colorModify["$pp_colour_contrast"] = 1 + (0.2 * math.sin(curTime * 2) * intensity)
    end

    if PLUGIN.activeDrugEffects["meth"] and PLUGIN.activeDrugEffects["meth"] > curTime then
        activeTrip = true
        local timeLeft = PLUGIN.activeDrugEffects["meth"] - curTime
        local intensity = math.min(1, timeLeft / 40)
        DrawSharpen(2 * intensity, 1.5 * intensity)
        DrawMotionBlur(0.05, 0.8 * intensity, 0.02)
        colorModify["$pp_colour_brightness"] = 0.05 * math.sin(curTime * 10) * intensity
        colorModify["$pp_colour_colour"] = 1 - (0.4 * intensity)
    end

    if PLUGIN.activeDrugEffects["cocaine"] and PLUGIN.activeDrugEffects["cocaine"] > curTime then
        activeTrip = true
        local timeLeft = PLUGIN.activeDrugEffects["cocaine"] - curTime
        local intensity = math.min(1, timeLeft / 45)
        DrawSharpen(3 * intensity, 2 * intensity)
        colorModify["$pp_colour_contrast"] = 1.3 * intensity
        colorModify["$pp_colour_addg"] = 0.05 * intensity
    end

    if activeTrip then
        DrawColorModify(colorModify)
    end
end

-- Client Police Dispatch Alert receiver
net.Receive("ixPoliceAlert", function()
    local pos = net.ReadVector()
    local msg = net.ReadString()

    surface.PlaySound("ambient/alerts/alarm1.wav")

    -- Add temporary waypoint/notification
    ix.util.Notify("[POLICE DISPATCH] " .. msg)

    -- Hook for client HUD marker draw
    local alertId = "PoliceAlert_" .. CurTime()
    hook.Add("HUDPaint", alertId, function()
        if not pos then hook.Remove("HUDPaint", alertId) return end
        
        local screenPos = pos:ToScreen()
        if screenPos.visible then
            surface.SetDrawColor(255, 40, 40, 220)
            surface.DrawRect(screenPos.x - 10, screenPos.y - 10, 20, 20)
            draw.SimpleText("! CRIME SCENE !", "DermaDefaultBold", screenPos.x, screenPos.y - 25, Color(255, 50, 50), TEXT_ALIGN_CENTER)
        end
    end)

    timer.Simple(25, function()
        hook.Remove("HUDPaint", alertId)
    end)
end)

-- Receive Hacking Minigame trigger
net.Receive("ixHeistStartMinigame", function()
    local ent = net.ReadEntity()
    local difficulty = net.ReadInt(8)

    local frame = vgui.Create("ixHackingMinigame")
    if IsValid(frame) then
        frame:SetTargetEntity(ent)
        frame:SetDifficulty(difficulty or 4)
    end
end)

-- Receive Black Market UI open
net.Receive("ixOpenBlackMarketUI", function()
    local ent = net.ReadEntity()
    local frame = vgui.Create("ixBlackMarketUI")
    if IsValid(frame) then
        frame:SetDealerEntity(ent)
    end
end)

-- Receive Drug Lab UI open
net.Receive("ixDrugLabInteract", function()
    local ent = net.ReadEntity()
    local frame = vgui.Create("ixDrugLabUI")
    if IsValid(frame) then
        frame:SetLabEntity(ent)
    end
end)

-- Receive Vault Keypad UI open
net.Receive("ixVaultKeypadOpen", function()
    local ent = net.ReadEntity()
    local frame = vgui.Create("ixVaultKeypadUI")
    if IsValid(frame) then
        frame:SetVaultEntity(ent)
    end
end)

-- Function to trigger drug trip client effect
function PLUGIN:TriggerDrugEffect(drugType, duration)
    PLUGIN.activeDrugEffects[drugType] = CurTime() + duration
end
