--[[
    City Underground - Client Job System
    Job objectives tracker and mission waypoint display.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Jobs = CityUnderground.Jobs or {}
CityUnderground.Jobs.CurrentMission = nil

if net and net.Receive then
    net.Receive("CU_Job_SyncMission", function()
        local mission = net.ReadTable()
        CityUnderground.Jobs.CurrentMission = (mission and mission.destinationId) and mission or nil

        if CityUnderground.UI and CityUnderground.UI.UpdateObjective then
            CityUnderground.UI.UpdateObjective(CityUnderground.Jobs.CurrentMission)
        end
    end)
end

function CityUnderground.Jobs.RequestStartDelivery()
    if net and net.Start then
        net.Start("CU_Job_StartDelivery")
        net.SendToServer()
    end
end

function CityUnderground.Jobs.RequestCompleteDelivery()
    if net and net.Start then
        net.Start("CU_Job_CompleteDelivery")
        net.SendToServer()
    end
end
