--[[
    Server-Side Processing and Persistence for Helix Custom Systems Engine
]]--

local PLUGIN = PLUGIN or {}

util.AddNetworkString("ixCustomSystemProcess")
util.AddNetworkString("ixCustomSystemOpen")
util.AddNetworkString("ixCustomSystemSpawn")
util.AddNetworkString("ixCustomSystemSaveAll")

-- Open station UI or ox_target interaction
function ix.customSystems.OpenStation(client, entity)
    if not IsValid(client) or not IsValid(entity) then return end

    local systemID = entity:GetStationID()
    local system = ix.customSystems.Get(systemID)
    if not system then
        client:Notify("This station is not configured properly.")
        return
    end

    net.Start("ixCustomSystemOpen")
        net.WriteEntity(entity)
        net.WriteString(systemID)
    net.Send(client)
end

-- Process crafting / manufacturing on a station
net.Receive("ixCustomSystemProcess", function(len, client)
    if not IsValid(client) or not client:Alive() then return end

    local entity = net.ReadEntity()
    local systemID = net.ReadString()

    if not IsValid(entity) or entity:GetPos():DistToSqr(client:GetPos()) > (128 * 128) then
        client:Notify("You are too far away from the station!")
        return
    end

    local system = ix.customSystems.Get(systemID)
    if not system then return end

    local canProcess, reason = ix.customSystems.HasRequirements(client, systemID)
    if not canProcess then
        client:Notify(reason)
        return
    end

    local char = client:GetCharacter()
    local inv = char:GetInventory()
    if not inv then return end

    -- Start progress bar & sound
    if system.startSound then
        entity:EmitSound(system.startSound, 65, 100)
    end

    client:SetAction("Processing " .. system.name .. "...", system.processTime, function()
        if not IsValid(client) or not IsValid(entity) or entity:GetPos():DistToSqr(client:GetPos()) > (140 * 140) then
            client:Notify("Processing cancelled.")
            return
        end

        -- Double check inventory before consumption
        local validAgain, failReason = ix.customSystems.HasRequirements(client, systemID)
        if not validAgain then
            client:Notify(failReason)
            return
        end

        -- Consume inputs
        for itemID, count in pairs(system.inputs) do
            for i = 1, count do
                local itemObj = inv:HasItem(itemID)
                if itemObj then
                    itemObj:Remove()
                end
            end
        end

        -- Grant outputs
        for itemID, count in pairs(system.outputs) do
            for i = 1, count do
                if not inv:Add(itemID) then
                    ix.item.Spawn(itemID, client:GetPos() + Vector(0, 0, 20))
                    client:Notify("Inventory full! Item dropped onto ground.")
                end
            end
        end

        -- Grant XP if PERP skills system is active
        if system.xp and PLUGIN.AddSkillXP then
            PLUGIN:AddSkillXP(client, system.xp.skill, system.xp.amount)
        end

        -- Sound & Notification
        if system.finishSound then
            entity:EmitSound(system.finishSound, 70, 100)
        end
        client:Notify("Completed: " .. system.name)
    end)
end)

-- Admin spawn command
ix.command.Add("SpawnStation", {
    description = "Spawn a configured custom Helix station at your crosshair.",
    adminOnly = true,
    arguments = {
        ix.type.string
    },
    OnRun = function(self, client, stationID)
        local system = ix.customSystems.Get(stationID)
        if not system then
            return "Invalid station ID! Registered IDs: " .. table.concat(table.GetKeys(ix.customSystems.GetAll()), ", ")
        end

        local tr = client:GetEyeTraceNoCursor()
        local ent = ents.Create("ix_station")
        ent:SetPos(tr.HitPos + tr.HitNormal * 2)
        ent:SetAngles(Angle(0, client:EyeAngles().y - 180, 0))
        ent:Spawn()
        ent:Activate()
        ent:SetStationID(stationID)
        if system.model then
            ent:SetModel(system.model)
        end

        local phys = ent:GetPhysicsObject()
        if IsValid(phys) then
            phys:EnableMotion(false)
        end

        return string.format("Spawned %s (%s). Use /SystemEditor to save or configure.", system.name, stationID)
    end
})

-- In-game Live Admin System Editor Command
ix.command.Add("SystemEditor", {
    description = "Open the visual Helix Custom Systems & Entity Spawner Editor.",
    adminOnly = true,
    OnRun = function(self, client)
        net.Start("ixCustomSystemSpawn")
            net.WriteTable(ix.customSystems.GetAll())
        net.Send(client)
    end
})

-- Save & Load Persistence
function PLUGIN:SaveCustomStations()
    local saved = {}
    for _, ent in ipairs(ents.FindByClass("ix_station")) do
        if IsValid(ent) and ent.GetStationID then
            table.insert(saved, {
                stationID = ent:GetStationID(),
                pos = ent:GetPos(),
                ang = ent:GetAngles(),
                model = ent:GetModel()
            })
        end
    end
    ix.data.Set("custom_stations", saved, true)
end

function PLUGIN:LoadCustomStations()
    local saved = ix.data.Get("custom_stations", {})
    for _, data in ipairs(saved) do
        local ent = ents.Create("ix_station")
        ent:SetPos(data.pos)
        ent:SetAngles(data.ang)
        ent:Spawn()
        ent:Activate()
        ent:SetStationID(data.stationID)
        if data.model then
            ent:SetModel(data.model)
        end
        local phys = ent:GetPhysicsObject()
        if IsValid(phys) then
            phys:EnableMotion(false)
        end
    end
end
