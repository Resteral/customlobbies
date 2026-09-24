--[[
    City Underground - Server Vehicle Engine
    Server-authoritative vehicle purchasing, spawning limits, garage storage, and repairs.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Vehicles = CityUnderground.Vehicles or {}
CityUnderground.Vehicles.SpawnedVehicles = CityUnderground.Vehicles.SpawnedVehicles or {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Veh_Buy")
    util.AddNetworkString("CU_Veh_SpawnGarage")
    util.AddNetworkString("CU_Veh_StoreGarage")
    util.AddNetworkString("CU_Veh_ToggleLock")
    util.AddNetworkString("CU_Veh_ToggleIgnition")
    util.AddNetworkString("CU_Veh_Repair")
    util.AddNetworkString("CU_Veh_Refuel")
    util.AddNetworkString("CU_Veh_SyncList")
end

-- Buy Vehicle from Dealership
function CityUnderground.Vehicles.BuyVehicle(ply, vehicleId)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    local modelData = CityUnderground.Vehicles.Catalog[vehicleId]
    if not modelData then return end

    -- Verify bank balance
    if (char.bank or 0) < modelData.price then
        return
    end

    char.bank = char.bank - modelData.price
    char.ownedVehicles = char.ownedVehicles or {}

    local newPlate = string.format("NH-%d%d%d", math.random(1, 9), math.random(1, 9), math.random(1, 9))
    local vehRecord = {
        plate = newPlate,
        vehicleId = vehicleId,
        fuel = modelData.fuelCapacity,
        health = 100,
        inGarage = true
    }

    table.insert(char.ownedVehicles, vehRecord)
    CityUnderground.Economy.LogTransaction(char.id, "PURCHASE", "Purchased " .. modelData.name .. " (" .. newPlate .. ")", -modelData.price)

    CityUnderground.Character.SyncStats(ply)
    CityUnderground.Persistence.SaveCharacter(char)

    if net and net.Start then
        net.Start("CU_Veh_SyncList")
        net.WriteTable(char.ownedVehicles)
        net.Send(ply)
    end
end

-- Spawn Vehicle from Garage
function CityUnderground.Vehicles.SpawnFromGarage(ply, plate)
    local char = CityUnderground.Character.GetActive(ply)
    if not char or not char.ownedVehicles then return end

    -- Check if player already has an active vehicle spawned
    if CityUnderground.Vehicles.SpawnedVehicles[char.id] then
        return -- Only 1 active vehicle allowed
    end

    for _, v in ipairs(char.ownedVehicles) do
        if v.plate == plate and v.inGarage then
            v.inGarage = false

            local spawned = {
                ownerCharId = char.id,
                plate = plate,
                vehicleId = v.vehicleId,
                fuel = v.fuel or 50,
                health = v.health or 100,
                isLocked = true,
                engineOn = false,
                pos = { x = 600, y = 340, z = 10 }
            }

            CityUnderground.Vehicles.SpawnedVehicles[char.id] = spawned
            break
        end
    end
end

-- Repair Nearest Vehicle
function CityUnderground.Vehicles.RepairNearestVehicle(ply)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return false end

    local activeVeh = CityUnderground.Vehicles.SpawnedVehicles[char.id]
    if activeVeh then
        activeVeh.health = 100
        return true
    end
    return false
end

-- Network handlers
if net and net.Receive then
    net.Receive("CU_Veh_Buy", function(len, ply)
        local vehicleId = net.ReadString()
        CityUnderground.Vehicles.BuyVehicle(ply, vehicleId)
    end)

    net.Receive("CU_Veh_SpawnGarage", function(len, ply)
        local plate = net.ReadString()
        CityUnderground.Vehicles.SpawnFromGarage(ply, plate)
    end)

    net.Receive("CU_Veh_ToggleLock", function(len, ply)
        local char = CityUnderground.Character.GetActive(ply)
        if not char then return end

        local activeVeh = CityUnderground.Vehicles.SpawnedVehicles[char.id]
        if activeVeh then
            activeVeh.isLocked = not activeVeh.isLocked
        end
    end)
end
