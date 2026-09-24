--[[
    City Underground - Client Map Spawner System
    Client-side entity cache, 3D interaction raycasting, and placement tool bridge.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Spawner = CityUnderground.Spawner or {}
CityUnderground.Spawner.Entities = {}

if net and net.Receive then
    net.Receive("CU_Spawner_SyncList", function()
        local entities = net.ReadTable()
        CityUnderground.Spawner.Entities = entities

        if CityUnderground.UI and CityUnderground.UI.UpdatePlacedEntities then
            CityUnderground.UI.UpdatePlacedEntities(entities)
        end
    end)
end

function CityUnderground.Spawner.Place(archetypeId, pos, heading, customName)
    if net and net.Start then
        net.Start("CU_Spawner_Place")
        net.WriteString(archetypeId)
        net.WriteTable(pos or { x = 500, y = 500, z = 10 })
        net.WriteFloat(heading or 0)
        net.WriteString(customName or "")
        net.SendToServer()
    end
end

function CityUnderground.Spawner.Remove(entId)
    if net and net.Start then
        net.Start("CU_Spawner_Remove")
        net.WriteString(entId)
        net.SendToServer()
    end
end
