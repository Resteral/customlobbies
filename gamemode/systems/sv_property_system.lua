--[[
    City Underground - Server Property & Real Estate Engine
    Server-authoritative deed ownership, rentals, co-builder keys, and building permissions.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Property = CityUnderground.Property or {}
CityUnderground.Property.State = CityUnderground.Property.State or {
    ["apt_101"] = { ownerCharId = nil, isRented = false, isLocked = true, keys = {}, stash = {} },
    ["mlo_industrial_warehouse"] = { ownerCharId = nil, isRented = false, isLocked = true, keys = {}, stash = {} },
    ["mlo_suburban_ranch"] = { ownerCharId = nil, isRented = false, isLocked = true, keys = {}, stash = {} },
    ["mlo_downtown_storefront"] = { ownerCharId = nil, isRented = false, isLocked = true, keys = {}, stash = {} },
    ["mlo_dockside_garage"] = { ownerCharId = nil, isRented = false, isLocked = true, keys = {}, stash = {} },
    ["mlo_underground_bunker"] = { ownerCharId = nil, isRented = false, isLocked = true, keys = {}, stash = {} }
}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Prop_Buy")
    util.AddNetworkString("CU_Prop_Rent")
    util.AddNetworkString("CU_Prop_SellDeed")
    util.AddNetworkString("CU_Prop_ToggleLock")
    util.AddNetworkString("CU_Prop_GrantKey")
    util.AddNetworkString("CU_Prop_OpenStash")
    util.AddNetworkString("CU_Prop_SyncProperties")
end

-- Check if character has building / deed permissions on property
function CityUnderground.Property.HasBuildingPermission(charId, propId)
    local propData = CityUnderground.Property.State[propId]
    if not propData then return false end

    if propData.ownerCharId == charId then
        return true
    end

    if propData.keys and table.HasValue(propData.keys, charId) then
        return true
    end

    return false
end

-- Buy or Rent Property Deed
function CityUnderground.Property.Purchase(ply, propId, isRent)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    local propConfig = CityUnderground.Property.Registry[propId]
    local propData = CityUnderground.Property.State[propId]
    if not propConfig or not propData then return end

    if propData.ownerCharId then
        if ply and ply.Notify then ply:Notify("This real estate plot is already owned!") end
        return -- Already owned
    end

    local cost = isRent and propConfig.rentPrice or propConfig.buyPrice
    if (char.bank or 0) < cost then
        if ply and ply.Notify then ply:Notify("Insufficient funds in bank account to purchase real estate deed!") end
        return
    end

    char.bank = char.bank - cost
    propData.ownerCharId = char.id
    propData.isRented = isRent
    propData.isLocked = true
    propData.keys = propData.keys or {}

    CityUnderground.Economy.LogTransaction(char.id, "PURCHASE", (isRent and "Leased Deed: " or "Purchased Deed: ") .. propConfig.name, -cost)
    CityUnderground.Character.SyncStats(ply)
    CityUnderground.Property.SyncToAll()

    if ply and ply.Notify then
        ply:Notify("🎉 Congratulations! You are now the official deed owner of " .. propConfig.name .. "! Base Building is unlocked.")
    end
end

-- Sell Property Deed (80% Equity Refund)
function CityUnderground.Property.SellDeed(ply, propId)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    local propConfig = CityUnderground.Property.Registry[propId]
    local propData = CityUnderground.Property.State[propId]
    if not propConfig or not propData then return end

    if propData.ownerCharId ~= char.id then
        if ply and ply.Notify then ply:Notify("You do not hold the primary deed for this property!") end
        return
    end

    local refund = math.floor((propConfig.buyPrice or 10000) * 0.8)
    char.bank = (char.bank or 0) + refund
    propData.ownerCharId = nil
    propData.isRented = false
    propData.keys = {}

    CityUnderground.Economy.LogTransaction(char.id, "SALE", "Sold Real Estate Deed: " .. propConfig.name, refund)
    CityUnderground.Character.SyncStats(ply)
    CityUnderground.Property.SyncToAll()

    if ply and ply.Notify then
        ply:Notify("🏷️ Sold real estate deed for +" .. string.Comma(refund) .. "! Property is now back on the open market.")
    end
end

-- Grant Co-Builder Key to Roommate / Gang Member
function CityUnderground.Property.GrantKey(ply, propId, targetCharId)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    local propData = CityUnderground.Property.State[propId]
    if not propData or propData.ownerCharId ~= char.id then return end

    propData.keys = propData.keys or {}
    if not table.HasValue(propData.keys, targetCharId) then
        table.insert(propData.keys, targetCharId)
        CityUnderground.Property.SyncToAll()
        if ply and ply.Notify then ply:Notify("🔑 Co-Builder Key & Base Access granted to Citizen #" .. targetCharId) end
    end
end

-- Sync Property Ownership State
function CityUnderground.Property.SyncToAll()
    if net and net.Start then
        net.Start("CU_Prop_SyncProperties")
        net.WriteTable(CityUnderground.Property.State)
        net.Broadcast()
    end
end

-- Network handlers
if net and net.Receive then
    net.Receive("CU_Prop_Buy", function(len, ply)
        local propId = net.ReadString()
        CityUnderground.Property.Purchase(ply, propId, false)
    end)

    net.Receive("CU_Prop_Rent", function(len, ply)
        local propId = net.ReadString()
        CityUnderground.Property.Purchase(ply, propId, true)
    end)

    net.Receive("CU_Prop_SellDeed", function(len, ply)
        local propId = net.ReadString()
        CityUnderground.Property.SellDeed(ply, propId)
    end)

    net.Receive("CU_Prop_ToggleLock", function(len, ply)
        local propId = net.ReadString()
        local char = CityUnderground.Character.GetActive(ply)
        local propData = CityUnderground.Property.State[propId]

        if not char or not propData then return end
        if propData.ownerCharId == char.id or (propData.keys and table.HasValue(propData.keys, char.id)) then
            propData.isLocked = not propData.isLocked
        end
    end)

    net.Receive("CU_Prop_GrantKey", function(len, ply)
        local propId = net.ReadString()
        local targetCharId = net.ReadString()
        CityUnderground.Property.GrantKey(ply, propId, targetCharId)
    end)
end
