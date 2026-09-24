--[[
    City Underground - Client Vehicle System
    Vehicle dashboard HUD, dealership UI bridge, and keyfob controls.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Vehicles = CityUnderground.Vehicles or {}
CityUnderground.Vehicles.OwnedList = {}

if net and net.Receive then
    net.Receive("CU_Veh_SyncList", function()
        local list = net.ReadTable()
        CityUnderground.Vehicles.OwnedList = list

        if CityUnderground.UI and CityUnderground.UI.UpdateGarageList then
            CityUnderground.UI.UpdateGarageList(list)
        end
    end)
end

function CityUnderground.Vehicles.Buy(vehicleId)
    if net and net.Start then
        net.Start("CU_Veh_Buy")
        net.WriteString(vehicleId)
        net.SendToServer()
    end
end

function CityUnderground.Vehicles.SpawnGarage(plate)
    if net and net.Start then
        net.Start("CU_Veh_SpawnGarage")
        net.WriteString(plate)
        net.SendToServer()
    end
end

function CityUnderground.Vehicles.ToggleLock()
    if net and net.Start then
        net.Start("CU_Veh_ToggleLock")
        net.SendToServer()
    end
end
