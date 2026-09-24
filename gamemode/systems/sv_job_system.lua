--[[
    City Underground - Server Delivery Job Engine
    Server-authoritative delivery route generation, company van management, and payout verification.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Jobs = CityUnderground.Jobs or {}
CityUnderground.Jobs.ActiveMissions = CityUnderground.Jobs.ActiveMissions or {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Job_SetJob")
    util.AddNetworkString("CU_Job_StartDelivery")
    util.AddNetworkString("CU_Job_CompleteDelivery")
    util.AddNetworkString("CU_Job_SyncMission")
    util.AddNetworkString("CU_Job_CancelDelivery")
end

local deliveryDestinations = {
    { id = "deliv_bank", name = "First Trust Bank Main Lobby", x = 380, y = 620 },
    { id = "deliv_shop", name = "Corner QuickMart Loading Dock", x = 620, y = 620 },
    { id = "deliv_precinct", name = "3rd Precinct Mail Desk", x = 180, y = 820 },
    { id = "deliv_hospital", name = "Mercy General Pharmacy Receiving", x = 820, y = 820 },
    { id = "deliv_gas", name = "Sunoco Service Office", x = 380, y = 380 },
    { id = "deliv_apt", name = "Harborview Resident Mailboxes", x = 180, y = 380 }
}

-- Start Delivery Route
function CityUnderground.Jobs.StartDeliveryMission(ply)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    if char.job ~= "delivery" then
        char.job = "delivery"
        CityUnderground.Character.SyncStats(ply)
    end

    -- Pick random destination
    local dest = deliveryDestinations[math.random(1, #deliveryDestinations)]
    local mission = {
        charId = char.id,
        destinationId = dest.id,
        destinationName = dest.name,
        targetX = dest.x,
        targetY = dest.y,
        startTime = os.time(),
        basePayout = 200,
        bonus = math.random(50, 150)
    }

    CityUnderground.Jobs.ActiveMissions[char.id] = mission

    -- Give delivery parcel to inventory
    CityUnderground.Inventory.AddItem(ply, "delivery_parcel", 1)

    -- Notify client
    if net and net.Start then
        net.Start("CU_Job_SyncMission")
        net.WriteTable(mission)
        net.Send(ply)
    end
end

-- Complete Delivery Route
function CityUnderground.Jobs.CompleteDeliveryMission(ply)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    local mission = CityUnderground.Jobs.ActiveMissions[char.id]
    if not mission then return end

    -- Verify player distance to delivery target <= 120 units
    local plyPos = ply.GetPos and ply:GetPos() or { x = mission.targetX, y = mission.targetY }
    local dx = (plyPos.x or 0) - mission.targetX
    local dy = (plyPos.y or 0) - mission.targetY
    local dist = math.sqrt(dx * dx + dy * dy)

    if dist > 150 then
        return -- Player too far from dropoff
    end

    -- Remove delivery parcel
    CityUnderground.Inventory.RemoveItem(ply, "delivery_parcel", 1)

    -- Payout
    local totalPayout = mission.basePayout + mission.bonus
    CityUnderground.Economy.AddCash(ply, totalPayout, "Delivery Job Payout - " .. mission.destinationName)

    CityUnderground.Jobs.ActiveMissions[char.id] = nil

    if net and net.Start then
        net.Start("CU_Job_SyncMission")
        net.WriteTable({}) -- Clear mission
        net.Send(ply)
    end
end

-- Network handlers
if net and net.Receive then
    net.Receive("CU_Job_SetJob", function(len, ply)
        local jobName = net.ReadString()
        local char = CityUnderground.Character.GetActive(ply)
        if not char then return end

        if CityUnderground.Jobs.Registry[jobName] then
            char.job = jobName
            CityUnderground.Character.SyncStats(ply)
        end
    end)

    net.Receive("CU_Job_StartDelivery", function(len, ply)
        CityUnderground.Jobs.StartDeliveryMission(ply)
    end)

    net.Receive("CU_Job_CompleteDelivery", function(len, ply)
        CityUnderground.Jobs.CompleteDeliveryMission(ply)
    end)
end
