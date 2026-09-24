--[[
    City Underground - Server Map Spawner & Entity Placement Engine
    Authoritative world entity placement, persistence file management, and runtime NPC lifecycle.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Spawner = CityUnderground.Spawner or {}
CityUnderground.Spawner.PlacedEntities = CityUnderground.Spawner.PlacedEntities or {}

local SAVE_PATH = "city_underground/placed_entities.json"

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Spawner_Place")
    util.AddNetworkString("CU_Spawner_Remove")
    util.AddNetworkString("CU_Spawner_SyncList")
    util.AddNetworkString("CU_Spawner_OpenUI")
end

-- Initialize and Load Placed World Entities
function CityUnderground.Spawner.Init()
    CityUnderground.Spawner.LoadAll()
    print("[CityUnderground Spawner] Initialized world placement engine. Loaded " .. table.Count(CityUnderground.Spawner.PlacedEntities) .. " entities.")
end

-- Load from Persistent Storage
function CityUnderground.Spawner.LoadAll()
    if file and file.Exists and file.Exists(SAVE_PATH, "DATA") then
        local raw = file.Read(SAVE_PATH, "DATA")
        local data = util.JSONToTable(raw)
        if data and type(data) == "table" then
            CityUnderground.Spawner.PlacedEntities = data
            return data
        end
    end

    -- Default Placed Entities in New Harbor District if no save file exists yet
    CityUnderground.Spawner.PlacedEntities = {
        ["npc_fisherman_1"] = {
            id = "npc_fisherman_1",
            archetypeId = "fisherman",
            name = "Old Salty Fisherman",
            pos = { x = 850, y = 250, z = 10 },
            heading = 180
        },
        ["npc_gas_1"] = {
            id = "npc_gas_1",
            archetypeId = "gas_attendant",
            name = "Sunoco Service Clerk",
            pos = { x = 380, y = 370, z = 10 },
            heading = 90
        },
        ["npc_dealer_1"] = {
            id = "npc_dealer_1",
            archetypeId = "drug_dealer",
            name = "Alleyway Fence & Broker",
            pos = { x = 260, y = 260, z = 10 },
            heading = 45
        },
        ["npc_car_1"] = {
            id = "npc_car_1",
            archetypeId = "car_dealer",
            name = "Metro Motors Sales Agent",
            pos = { x = 640, y = 360, z = 10 },
            heading = 270
        },
        ["npc_casino_1"] = {
            id = "npc_casino_1",
            archetypeId = "casino_dealer",
            name = "Velvet Lounge Pit Boss",
            pos = { x = 500, y = 680, z = 10 },
            heading = 0
        },
        ["npc_doc_1"] = {
            id = "npc_doc_1",
            archetypeId = "doctor",
            name = "Dr. Alvarez, MD",
            pos = { x = 800, y = 800, z = 10 },
            heading = 90
        },
        ["npc_courier_1"] = {
            id = "npc_courier_1",
            archetypeId = "courier_dispatch",
            name = "Logistics Dispatcher Evans",
            pos = { x = 800, y = 160, z = 10 },
            heading = 180
        }
    }

    CityUnderground.Spawner.SaveAll()
    return CityUnderground.Spawner.PlacedEntities
end

-- Save to Persistent Storage
function CityUnderground.Spawner.SaveAll()
    if file and file.Write then
        local jsonStr = util.TableToJSON(CityUnderground.Spawner.PlacedEntities, true)
        file.Write(SAVE_PATH, jsonStr)
    end
end

-- Place / Spawn an Entity
function CityUnderground.Spawner.PlaceEntity(adminPly, archetypeId, pos, heading, customName)
    if adminPly and not CityUnderground.Admin.IsAdmin(adminPly, 2) then return false, "Insufficient permissions" end

    local arch = CityUnderground.Spawner.Archetypes[archetypeId]
    if not arch then return false, "Invalid archetype" end

    local entId = "ent_" .. archetypeId .. "_" .. os.time() .. "_" .. math.random(100, 999)
    local entRecord = {
        id = entId,
        archetypeId = archetypeId,
        name = customName or arch.name,
        pos = pos or { x = 500, y = 500, z = 10 },
        heading = heading or 0,
        placedBy = adminPly and adminPly:Nick() or "Console",
        placedAt = os.time()
    }

    CityUnderground.Spawner.PlacedEntities[entId] = entRecord
    CityUnderground.Spawner.SaveAll()
    CityUnderground.Spawner.SyncToAll()

    if adminPly then
        CityUnderground.Admin.LogAction(adminPly:Nick(), "SPAWN_NPC", "Placed " .. arch.name .. " at (" .. math.floor(entRecord.pos.x) .. ", " .. math.floor(entRecord.pos.y) .. ")")
    end

    return true, entRecord
end

-- Remove / Despawn an Entity
function CityUnderground.Spawner.RemoveEntity(adminPly, entId)
    if adminPly and not CityUnderground.Admin.IsAdmin(adminPly, 2) then return false, "Insufficient permissions" end

    if CityUnderground.Spawner.PlacedEntities[entId] then
        local entName = CityUnderground.Spawner.PlacedEntities[entId].name
        CityUnderground.Spawner.PlacedEntities[entId] = nil
        CityUnderground.Spawner.SaveAll()
        CityUnderground.Spawner.SyncToAll()

        if adminPly then
            CityUnderground.Admin.LogAction(adminPly:Nick(), "REMOVE_NPC", "Deleted " .. entName .. " (" .. entId .. ")")
        end
        return true
    end
    return false, "Entity not found"
end

-- Sync Entity List to All Connected Players
function CityUnderground.Spawner.SyncToAll()
    if net and net.Start then
        net.Start("CU_Spawner_SyncList")
        net.WriteTable(CityUnderground.Spawner.PlacedEntities)
        net.Broadcast()
    end
end

-- Network handlers
if net and net.Receive then
    net.Receive("CU_Spawner_Place", function(len, ply)
        local archetypeId = net.ReadString()
        local pos = net.ReadTable()
        local heading = net.ReadFloat()
        local customName = net.ReadString()

        CityUnderground.Spawner.PlaceEntity(ply, archetypeId, pos, heading, customName)
    end)

    net.Receive("CU_Spawner_Remove", function(len, ply)
        local entId = net.ReadString()
        CityUnderground.Spawner.RemoveEntity(ply, entId)
    end)
end

-- Auto-sync upon player connect
hook.Add("PlayerInitialSpawn", "CU_Spawner_SyncOnJoin", function(ply)
    if timer and timer.Simple then
        timer.Simple(2, function()
            if IsValid(ply) and net and net.Start then
                net.Start("CU_Spawner_SyncList")
                net.WriteTable(CityUnderground.Spawner.PlacedEntities)
                net.Send(ply)
            end
        end)
    end
end)

CityUnderground.Spawner.Init()
