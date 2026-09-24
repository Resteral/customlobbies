--[[
    City Underground - Client Inventory System
    Client-side inventory state management and network bridge.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Inventory = CityUnderground.Inventory or {}
CityUnderground.Inventory.ClientItems = {}
CityUnderground.Inventory.ClientWeight = 0

if net and net.Receive then
    net.Receive("CU_Inv_Sync", function()
        local items = net.ReadTable()
        local weight = net.ReadFloat()

        CityUnderground.Inventory.ClientItems = items
        CityUnderground.Inventory.ClientWeight = weight

        if CityUnderground.UI and CityUnderground.UI.UpdateInventory then
            CityUnderground.UI.UpdateInventory(items, weight, CityUnderground.Inventory.MaxWeightKg)
        end
    end)
end

function CityUnderground.Inventory.UseItem(itemId)
    if net and net.Start then
        net.Start("CU_Inv_Use")
        net.WriteString(itemId)
        net.SendToServer()
    end
end

function CityUnderground.Inventory.DropItem(itemId)
    if net and net.Start then
        net.Start("CU_Inv_Drop")
        net.WriteString(itemId)
        net.SendToServer()
    end
end

function CityUnderground.Inventory.GiveItem(itemId, targetCharId)
    if net and net.Start then
        net.Start("CU_Inv_Give")
        net.WriteString(itemId)
        net.WriteString(targetCharId)
        net.SendToServer()
    end
end
