--[[
    City Underground - Server Crime Engine
    Server-authoritative contraband synthesis, street buyer trading, and 911 police dispatch alerts.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Crime = CityUnderground.Crime or {}
local activeSynthesizing = {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Crime_StartSynthesis")
    util.AddNetworkString("CU_Crime_SynthesisStatus")
    util.AddNetworkString("CU_Crime_SellToBuyer")
end

-- Start Chemical Synthesis
function CityUnderground.Crime.StartSynthesis(ply)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    if activeSynthesizing[char.id] then
        return -- Already synthesizing
    end

    -- Check if player has reagents
    local hasReagents = false
    for _, item in ipairs(char.inventory or {}) do
        if item.itemType == "contraband_reagents" and item.count >= CityUnderground.Crime.RequiredReagents then
            hasReagents = true
            break
        end
    end

    if not hasReagents then return end

    -- Consume reagents
    CityUnderground.Inventory.RemoveItem(ply, "contraband_reagents", CityUnderground.Crime.RequiredReagents)

    activeSynthesizing[char.id] = {
        startTime = os.time(),
        duration = CityUnderground.Crime.SynthesisTimeSeconds
    }

    if net and net.Start then
        net.Start("CU_Crime_SynthesisStatus")
        net.WriteBool(true)
        net.WriteInt(CityUnderground.Crime.SynthesisTimeSeconds, 16)
        net.Send(ply)
    end

    -- Timer for completion
    if timer and timer.Simple then
        timer.Simple(CityUnderground.Crime.SynthesisTimeSeconds, function()
            if not IsValid(ply) then return end
            activeSynthesizing[char.id] = nil

            -- Award refined crystals
            CityUnderground.Inventory.AddItem(ply, "contraband_crystals", CityUnderground.Crime.ProducedCrystals)

            if net and net.Start then
                net.Start("CU_Crime_SynthesisStatus")
                net.WriteBool(false)
                net.WriteInt(0, 16)
                net.Send(ply)
            end
        end)
    end
end

-- Sell Contraband to Street Buyer NPC
function CityUnderground.Crime.SellToBuyer(ply, buyerId, count)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    count = math.floor(math.abs(count or 1))
    local buyer = CityUnderground.Crime.StreetBuyers[buyerId]
    if not buyer then return end

    -- Check player has enough crystals
    local crystalCount = 0
    for _, item in ipairs(char.inventory or {}) do
        if item.itemType == "contraband_crystals" then
            crystalCount = crystalCount + item.count
        end
    end

    if crystalCount < count then return end

    -- Remove crystals & give cash
    CityUnderground.Inventory.RemoveItem(ply, "contraband_crystals", count)
    local unitPrice = math.floor(CityUnderground.Crime.BaseSellPrice * buyer.priceMod)
    local totalCash = unitPrice * count

    CityUnderground.Economy.AddCash(ply, totalCash, "Street Sale to " .. buyer.name)

    -- 35% chance to trigger police dispatch
    if math.random() < CityUnderground.Crime.PoliceAlertChance then
        if CityUnderground.Police and CityUnderground.Police.BroadcastAlert then
            CityUnderground.Police.BroadcastAlert("911 DISPATCH: Suspicious narcotics activity reported near " .. buyer.name .. "!")
        end
    end
end

-- Confiscate Contraband on Arrest
function CityUnderground.Crime.ConfiscateIllegalItems(ply)
    local char = CityUnderground.Character.GetActive(ply)
    if not char or not char.inventory then return {} end

    local confiscated = {}
    local remaining = {}

    for _, item in ipairs(char.inventory) do
        local proto = CityUnderground.Inventory.GetItemData(item.itemType)
        if proto and proto.isContraband then
            table.insert(confiscated, item)
        else
            table.insert(remaining, item)
        end
    end

    char.inventory = remaining
    CityUnderground.Inventory.SyncToClient(ply)
    return confiscated
end

-- Network handlers
if net and net.Receive then
    net.Receive("CU_Crime_StartSynthesis", function(len, ply)
        CityUnderground.Crime.StartSynthesis(ply)
    end)

    net.Receive("CU_Crime_SellToBuyer", function(len, ply)
        local buyerId = net.ReadString()
        local count = net.ReadInt(16)
        CityUnderground.Crime.SellToBuyer(ply, buyerId, count)
    end)
end
