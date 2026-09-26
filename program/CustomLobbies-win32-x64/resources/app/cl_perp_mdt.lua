-- Client-side MDT 911 Alert Waypoint Renderer for Police
local PLUGIN = PLUGIN

PLUGIN.active911Calls = PLUGIN.active911Calls or {}

net.Receive("ixPerp911Broadcast", function()
    local call = net.ReadTable()
    if not call then return end

    table.insert(PLUGIN.active911Calls, 1, call)

    -- Play distinctive police dispatch chime
    surface.PlaySound("ambient/alarms/klaxon1.wav")
    ix.util.Notify("[911 DISPATCH] " .. call.caller .. ": " .. call.message)

    -- Create 45-second on-screen GPS waypoint
    local callID = "911_Call_" .. call.id .. "_" .. CurTime()
    local callPos = call.pos

    hook.Add("HUDPaint", callID, function()
        if not callPos then hook.Remove("HUDPaint", callID) return end

        local screenPos = callPos:ToScreen()
        if screenPos.visible then
            surface.SetDrawColor(231, 76, 60, 220)
            surface.DrawRect(screenPos.x - 12, screenPos.y - 12, 24, 24)

            surface.SetDrawColor(255, 255, 255, 255)
            surface.DrawOutlinedRect(screenPos.x - 12, screenPos.y - 12, 24, 24)

            local distMeters = math.floor(LocalPlayer():GetPos():Distance(callPos) * 0.01905) -- source units to meters
            draw.SimpleText("🚨 911 CALL (" .. distMeters .. "m)", "DermaDefaultBold", screenPos.x, screenPos.y - 28, Color(255, 70, 70), TEXT_ALIGN_CENTER)
            draw.SimpleText(call.caller .. ": " .. call.message, "DermaDefault", screenPos.x, screenPos.y + 16, Color(255, 255, 255), TEXT_ALIGN_CENTER)
        end
    end)

    timer.Simple(45, function()
        hook.Remove("HUDPaint", callID)
    end)
end)
