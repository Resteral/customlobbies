--[[
    City Underground - Client Police System
    Police MDT UI bridge, 911 dispatch alerts, and arrest tools.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Police = CityUnderground.Police or {}

if net and net.Receive then
    net.Receive("CU_Police_DispatchAlert", function()
        local alertText = net.ReadString()
        if CityUnderground.UI and CityUnderground.UI.ShowPoliceAlert then
            CityUnderground.UI.ShowPoliceAlert(alertText)
        end
    end)
end

function CityUnderground.Police.ToggleDuty()
    if net and net.Start then
        net.Start("CU_Police_ToggleDuty")
        net.SendToServer()
    end
end

function CityUnderground.Police.IssueCitation(suspectCharId, code, fine)
    if net and net.Start then
        net.Start("CU_Police_IssueCitation")
        net.WriteString(suspectCharId)
        net.WriteString(code)
        net.WriteInt(fine, 32)
        net.SendToServer()
    end
end
