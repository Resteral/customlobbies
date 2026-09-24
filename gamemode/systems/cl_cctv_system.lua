--[[
    City Underground - Client CCTV Surveillance Terminal Bridge
    Handles client viewports, camera HUD overlays, and motion alert notifications.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.CCTV = CityUnderground.CCTV or {}

-- Receive Motion Alert from Server
net.Receive("CU_CCTV_MotionAlert", function()
    local propId = net.ReadString()
    local camLabel = net.ReadString()
    local intruderName = net.ReadString()

    -- Play warning beep
    surface.PlaySound("ambient/alarms/klaxon1.wav")
    
    -- Dispatch notification banner
    notification.AddLegacy("🚨 CCTV SECURITY ALERT: Intruder detected on [" .. camLabel .. "]!", NOTIFY_ERROR, 5)
    
    if CityUnderground.UI and CityUnderground.UI.SendNUIEvent then
        CityUnderground.UI.SendNUIEvent("CCTV_MotionTriggered", {
            propId = propId,
            camLabel = camLabel,
            intruder = intruderName
        })
    end
end)
