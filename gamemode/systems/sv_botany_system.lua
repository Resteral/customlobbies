--[[
    City Underground - Server Botany Engine
    Server-authoritative hydroponic plant growth ticks, hydration, and harvesting.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Botany = CityUnderground.Botany or {}
CityUnderground.Botany.ActivePlants = CityUnderground.Botany.ActivePlants or {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Botany_Water")
    util.AddNetworkString("CU_Botany_Fertilize")
    util.AddNetworkString("CU_Botany_Harvest")
    util.AddNetworkString("CU_Botany_SyncPlant")
end

-- Create or Register a Plant Pot
function CityUnderground.Botany.PlantSeed(ownerPly, plantId, seedType)
    local char = CityUnderground.Character.GetActive(ownerPly)
    if not char then return end

    local plant = {
        id = plantId or ("plant_" .. os.time() .. "_" .. math.random(100, 999)),
        ownerCharId = char.id,
        seedType = seedType or "botany_seed",
        progress = 0,
        water = 80,
        fertilizer = 0,
        health = 100,
        stage = 1
    }

    CityUnderground.Botany.ActivePlants[plant.id] = plant
    return plant
end

-- Water Plant
function CityUnderground.Botany.WaterPlant(ply, plantId)
    local plant = CityUnderground.Botany.ActivePlants[plantId]
    if not plant then return end

    -- Check if player has water
    local removed = CityUnderground.Inventory.RemoveItem(ply, "drink_water", 1)
    if removed then
        plant.water = math.Clamp(plant.water + 40, 0, CityUnderground.Botany.WaterCapacity)
        CityUnderground.Skills.AddXP(ply, "botany", 25)
    end
end

-- Harvest Plant
function CityUnderground.Botany.HarvestPlant(ply, plantId)
    local plant = CityUnderground.Botany.ActivePlants[plantId]
    if not plant or plant.progress < 100 then return end

    local yieldCount = math.random(CityUnderground.Botany.HarvestYieldMin, CityUnderground.Botany.HarvestYieldMax)
    
    -- Add harvested reagents and new seeds
    CityUnderground.Inventory.AddItem(ply, "contraband_reagents", yieldCount)
    CityUnderground.Inventory.AddItem(ply, "botany_seed", 1)

    -- Award Botany XP
    CityUnderground.Skills.AddXP(ply, "botany", 120)

    -- Reset plant pot
    plant.progress = 0
    plant.stage = 1
    plant.water = 50
end

-- Botany Growth Heartbeat (Runs every 5 seconds)
if timer and timer.Create then
    timer.Create("CU_BotanyGrowthHeartbeat", 5, 0, function()
        for _, plant in pairs(CityUnderground.Botany.ActivePlants) do
            if plant.progress < 100 and plant.water > 0 then
                local growthRate = 2.5 + (plant.fertilizer > 0 and 1.5 or 0)
                plant.progress = math.min(100, plant.progress + growthRate)
                plant.water = math.max(0, plant.water - 1.2)

                if plant.progress >= 100 then
                    plant.stage = 4
                elseif plant.progress >= 70 then
                    plant.stage = 3
                elseif plant.progress >= 30 then
                    plant.stage = 2
                else
                    plant.stage = 1
                end
            end
        end
    end)
end

-- Network handlers
if net and net.Receive then
    net.Receive("CU_Botany_Water", function(len, ply)
        local plantId = net.ReadString()
        CityUnderground.Botany.WaterPlant(ply, plantId)
    end)

    net.Receive("CU_Botany_Harvest", function(len, ply)
        local plantId = net.ReadString()
        CityUnderground.Botany.HarvestPlant(ply, plantId)
    end)
end
