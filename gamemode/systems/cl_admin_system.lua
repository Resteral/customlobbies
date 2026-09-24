--[[
    City Underground - Client Admin System
    Admin panel UI bridge and command dispatchers.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Admin = CityUnderground.Admin or {}

function CityUnderground.Admin.Execute(cmd, targetSteamId, arg1, arg2)
    if net and net.Start then
        net.Start("CU_Admin_Action")
        net.WriteString(cmd)
        net.WriteString(targetSteamId or "")
        net.WriteString(arg1 or "")
        net.WriteString(arg2 or "")
        net.SendToServer()
    end
end
