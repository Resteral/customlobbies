--[[
    City Underground - Client Base Building System
    Client-side build mode state manager, grid preview, and network bridge.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.BaseBuilder = CityUnderground.BaseBuilder or {}
CityUnderground.BaseBuilder.ActivePropertyId = "apt_101"
CityUnderground.BaseBuilder.PlacedObjects = {}

if net and net.Receive then
    net.Receive("CU_Base_SyncLayout", function()
        local propId = net.ReadString()
        local objects = net.ReadTable()

        CityUnderground.BaseBuilder.ActivePropertyId = propId
        CityUnderground.BaseBuilder.PlacedObjects = objects

        if CityUnderground.UI and CityUnderground.UI.UpdateBaseLayout then
            CityUnderground.UI.UpdateBaseLayout(propId, objects)
        end
    end)

    net.Receive("CU_Base_BroadcastDefenseAlert", function()
        local message = net.ReadString()
        local color = net.ReadString()
        if CityUnderground.Chat and CityUnderground.Chat.AddMessage then
            CityUnderground.Chat.AddMessage({
                channel = "Local",
                sender = "DEFENSE SYSTEM",
                text = message,
                color = color or "#ef4444"
            })
        end
    end)
end

function CityUnderground.BaseBuilder.Place(propId, catalogId, gridX, gridY, rotation, customColor)
    if net and net.Start then
        net.Start("CU_Base_PlaceObject")
        net.WriteString(propId)
        net.WriteString(catalogId)
        net.WriteInt(gridX, 16)
        net.WriteInt(gridY, 16)
        net.WriteInt(rotation or 0, 16)
        net.WriteString(customColor or "")
        net.SendToServer()
    end
end

function CityUnderground.BaseBuilder.Remove(propId, objId)
    if net and net.Start then
        net.Start("CU_Base_RemoveObject")
        net.WriteString(propId)
        net.WriteString(objId)
        net.SendToServer()
    end
end

function CityUnderground.BaseBuilder.Move(propId, objId, newX, newY, newRot)
    if net and net.Start then
        net.Start("CU_Base_MoveObject")
        net.WriteString(propId)
        net.WriteString(objId)
        net.WriteInt(newX, 16)
        net.WriteInt(newY, 16)
        net.WriteInt(newRot or 0, 16)
        net.SendToServer()
    end
end

function CityUnderground.BaseBuilder.Interact(propId, objId, actionType)
    if net and net.Start then
        net.Start("CU_Base_InteractObject")
        net.WriteString(propId)
        net.WriteString(objId)
        net.WriteString(actionType or "")
        net.SendToServer()
    end
end
