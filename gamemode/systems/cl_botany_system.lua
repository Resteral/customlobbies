--[[
    City Underground - Client Botany System
    Client-side plant care interface bridge.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Botany = CityUnderground.Botany or {}

function CityUnderground.Botany.Water(plantId)
    if net and net.Start then
        net.Start("CU_Botany_Water")
        net.WriteString(plantId)
        net.SendToServer()
    end
end

function CityUnderground.Botany.Harvest(plantId)
    if net and net.Start then
        net.Start("CU_Botany_Harvest")
        net.WriteString(plantId)
        net.SendToServer()
    end
end
