--[[
    City Underground - Server Inventory Engine
    Server-authoritative item management, slot movement, usage, physical drops, and containers.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Inventory = CityUnderground.Inventory or {}
CityUnderground.Inventory.Containers = CityUnderground.Inventory.Containers or {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Inv_Sync")
    util.AddNetworkString("CU_Inv_Use")
    util.AddNetworkString("CU_Inv_Drop")
    util.AddNetworkString("CU_Inv_Give")
    util.AddNetworkString("CU_Inv_MoveSlot")
    util.AddNetworkString("CU_Inv_Pickup")
    util.AddNetworkString("CU_Inv_OpenContainer")
    util.AddNetworkString("CU_Inv_ContainerSync")
    util.AddNetworkString("CU_Inv_ContainerTransfer")
end

-- Sync inventory to client
function CityUnderground.Inventory.SyncToClient(ply)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    if net and net.Start then
        net.Start("CU_Inv_Sync")
        net.WriteTable(char.inventory or {})
        net.WriteFloat(CityUnderground.Inventory.CalculateTotalWeight(char.inventory))
        net.Send(ply)
    end
end

-- Add item to player inventory
function CityUnderground.Inventory.AddItem(ply, itemType, count)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return false, "No active character" end

    count = count or 1
    local proto = CityUnderground.Inventory.GetItemData(itemType)
    if not proto then return false, "Invalid item type" end

    local currentWeight = CityUnderground.Inventory.CalculateTotalWeight(char.inventory)
    if currentWeight + (proto.weight * count) > CityUnderground.Inventory.MaxWeightKg then
        return false, "Inventory is too heavy"
    end

    char.inventory = char.inventory or {}

    -- Check if stackable with existing item
    if proto.maxStack > 1 then
        for _, item in ipairs(char.inventory) do
            if item.itemType == itemType and (item.count + count) <= proto.maxStack then
                item.count = item.count + count
                CityUnderground.Inventory.SyncToClient(ply)
                return true
            end
        end
    end

    -- Find next open slot
    local usedSlots = {}
    for _, item in ipairs(char.inventory) do
        usedSlots[item.slot] = true
    end

    local openSlot = nil
    for s = 1, CityUnderground.Inventory.MaxSlots do
        if not usedSlots[s] then
            openSlot = s
            break
        end
    end

    if not openSlot then return false, "No free inventory slots" end

    table.insert(char.inventory, {
        id = string.format("item_%d_%d", os.time(), math.random(100, 999)),
        itemType = itemType,
        count = count,
        slot = openSlot
    })

    CityUnderground.Inventory.SyncToClient(ply)
    return true
end

-- Remove item from player inventory
function CityUnderground.Inventory.RemoveItem(ply, itemType, count)
    local char = CityUnderground.Character.GetActive(ply)
    if not char or not char.inventory then return false end

    count = count or 1
    for i, item in ipairs(char.inventory) do
        if item.itemType == itemType then
            if item.count > count then
                item.count = item.count - count
                CityUnderground.Inventory.SyncToClient(ply)
                return true
            else
                table.remove(char.inventory, i)
                CityUnderground.Inventory.SyncToClient(ply)
                return true
            end
        end
    end
    return false
end

-- Network handlers
if net and net.Receive then
    -- Use Item
    net.Receive("CU_Inv_Use", function(len, ply)
        local itemId = net.ReadString()
        local char = CityUnderground.Character.GetActive(ply)
        if not char or not char.inventory then return end

        for i, item in ipairs(char.inventory) do
            if item.id == itemId then
                local proto = CityUnderground.Inventory.GetItemData(item.itemType)
                if proto and proto.OnUse then
                    local consumed = proto.OnUse(ply, item)
                    if consumed then
                        if item.count > 1 then
                            item.count = item.count - 1
                        else
                            table.remove(char.inventory, i)
                        end
                        CityUnderground.Inventory.SyncToClient(ply)
                        CityUnderground.Character.SyncStats(ply)
                    end
                end
                break
            end
        end
    end)

    -- Drop Item
    net.Receive("CU_Inv_Drop", function(len, ply)
        local itemId = net.ReadString()
        local char = CityUnderground.Character.GetActive(ply)
        if not char or not char.inventory then return end

        for i, item in ipairs(char.inventory) do
            if item.id == itemId then
                local itemType = item.itemType
                local count = item.count

                table.remove(char.inventory, i)
                CityUnderground.Inventory.SyncToClient(ply)

                -- Spawn physical ground pickup
                if ents and ents.Create then
                    local ent = ents.Create("cu_item_drop")
                    if IsValid(ent) then
                        ent:SetPos(ply:GetPos() + ply:GetForward() * 35 + Vector(0, 0, 10))
                        ent:SetItemData(itemType, count)
                        ent:Spawn()
                    end
                end
                break
            end
        end
    end)

    -- Give Item to Nearby Player
    net.Receive("CU_Inv_Give", function(len, ply)
        local itemId = net.ReadString()
        local targetCharId = net.ReadString()
        local char = CityUnderground.Character.GetActive(ply)
        if not char or not char.inventory then return end

        -- Locate target player and verify distance <= 150 units
        local targetPly = nil
        for _, p in ipairs(player.GetAll()) do
            local tChar = CityUnderground.Character.GetActive(p)
            if tChar and tChar.id == targetCharId then
                if ply:GetPos():DistToSqr(p:GetPos()) <= (150 * 150) then
                    targetPly = p
                end
                break
            end
        end

        if not targetPly then return end

        for i, item in ipairs(char.inventory) do
            if item.id == itemId then
                local success, err = CityUnderground.Inventory.AddItem(targetPly, item.itemType, item.count)
                if success then
                    table.remove(char.inventory, i)
                    CityUnderground.Inventory.SyncToClient(ply)
                end
                break
            end
        end
    end)
end
