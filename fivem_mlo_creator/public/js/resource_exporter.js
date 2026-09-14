/**
 * FiveM Resource Exporter - Server Runtime & Prop Physics Synchronizer
 * Generates fxmanifest.lua, client.lua runtime scripts, config.lua, ox_doorlock configs,
 * GTA V room audio reverbs, interactive curtain scripts, and in-game live re-anchoring.
 */

class ResourceExporter {
    static generateFxManifest(resName) {
        return `fx_version 'cerulean'
game 'gta5'

author 'FiveM MLO Studio'
description 'High-Performance Photorealistic MLO Interior Resource'
version '1.3.0'

this_is_a_map 'yes'

data_file 'DLC_ITYP_REQUEST' 'stream/${resName}.ytyp'

client_scripts {
    'config.lua',
    'client.lua'
}
`;
    }

    static generateConfigLua(mloData) {
        const resName = (mloData.name || 'custom_mlo').toLowerCase().replace(/[^a-z0-9_]/g, '_');
        const pos = mloData.position || { x: 970.2, y: -100.5, z: 74.0 };

        const entitiesData = (mloData.entities || []).map((ent, idx) => {
            const epos = ent.pos || { x: 0, y: 0, z: 0 };
            const erot = ent.rot || { x: 0, y: 0, z: 0, w: 1 };
            const euler = (typeof CodeWalkerXML !== 'undefined') ? CodeWalkerXML.quaternionToEuler(erot) : { pitch: 0, roll: 0, yaw: 0 };

            return `    {
        id = ${idx + 1},
        name = "${(ent.name || ent.model || 'prop').replace(/"/g, '')}",
        model = \`${ent.model || 'prop_box_wood02a'}\`,
        modelName = "${ent.model || 'prop_box_wood02a'}",
        room = ${ent.room !== undefined ? ent.room : 1},
        offset = vec3(${epos.x.toFixed(3)}, ${epos.y.toFixed(3)}, ${epos.z.toFixed(3)}),
        rot = vec3(${euler.pitch.toFixed(1)}, ${euler.roll.toFixed(1)}, ${euler.yaw.toFixed(1)}),
        isDoor = ${ent.model && ent.model.includes('door') ? 'true' : 'false'},
        isCurtain = ${ent.isCurtain || (ent.model && ent.model.includes('curtain')) ? 'true' : 'false'},
        material = "${ent.materialId || 'none'}"
    }`;
        }).join(',\n');

        return `Config = {}

Config.InteriorName = "${mloData.displayName || resName}"
Config.ResourceName = "${resName}"
Config.ArchetypeName = "${(mloData.archetype || resName).toLowerCase()}"

-- Base World Coordinates (Change here or use in-game /spawnhere command)
Config.Location = vec3(${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})
Config.Heading = 0.0

-- In-Game Prop Spawner & Physics Options
Config.SpawnEntitiesAtRuntime = true   -- Spawns all placed walls, furniture & props with collision
Config.EnableTargetInteractions = true  -- Enables ox_target / qb-target for curtains & doors
Config.EnableAudioReverbs = true        -- Applies room acoustic dampening & reverbs

-- Room Definitions & Acoustic Audio Reverbs
Config.Rooms = {
${(mloData.rooms || []).map(r => {
    let reverb = 'reverb_large_hall';
    if (r.name.includes('bath')) reverb = 'reverb_small_bathroom';
    else if (r.name.includes('bunker') || r.name.includes('vault')) reverb = 'reverb_concrete_bunker';
    else if (r.name.includes('office') || r.name.includes('room')) reverb = 'reverb_medium_room';

    return `    [${r.id}] = { name = "${r.name}", timecycle = "${r.timecycle || 'default'}", audioReverb = "${reverb}" }`;
}).join(',\n')}
}

-- Placed Props & Furniture Array
Config.Entities = {
${entitiesData}
}

-- Dynamic Switchable Entity Sets
Config.EntitySets = {
${(mloData.entitySets || []).map(es => `    ["${es.name}"] = { defaultActive = true }`).join(',\n')}
}
`;
    }

    static generateClientLua(mloData) {
        const resName = (mloData.name || 'custom_mlo').toLowerCase().replace(/[^a-z0-9_]/g, '_');
        const pos = mloData.position || { x: 970.2, y: -100.5, z: 74.0 };

        return `-- =========================================================================
-- FiveM MLO Studio - Server Runtime Controller & Prop Collision Synchronizer
-- Resource: ${resName}
-- =========================================================================

local interiorCoords = Config.Location
local currentInteriorId = 0
local spawnedProps = {}
local isInteriorLoaded = false

-- Utility: Load Model with Timeout
local function LoadModel(modelHash)
    if not IsModelValid(modelHash) then return false end
    if not HasModelLoaded(modelHash) then
        RequestModel(modelHash)
        local timeout = 0
        while not HasModelLoaded(modelHash) and timeout < 100 do
            Wait(10)
            timeout = timeout + 1
        end
    end
    return HasModelLoaded(modelHash)
end

-- Spawn All Placed Walls, Furniture & Props with Collision
local function SpawnInteriorProps(baseCoords)
    if not Config.SpawnEntitiesAtRuntime then return end
    
    -- Cleanup previous spawned props if any
    for _, propObj in ipairs(spawnedProps) do
        if DoesEntityExist(propObj) then
            DeleteEntity(propObj)
        end
    end
    spawnedProps = {}

    print(("[^2MLO^7] Spawning %d placed props & furniture pieces..."):format(#Config.Entities))
    
    for _, ent in ipairs(Config.Entities) do
        if LoadModel(ent.model) then
            local wx = baseCoords.x + ent.offset.x
            local wy = baseCoords.y + ent.offset.y
            local wz = baseCoords.z + ent.offset.z

            local prop = CreateObjectNoOffset(ent.model, wx, wy, wz, false, false, false)
            if DoesEntityExist(prop) then
                SetEntityRotation(prop, ent.rot.x, ent.rot.y, ent.rot.z, 2, true)
                FreezeEntityPosition(prop, true)
                SetEntityInvincible(prop, true)
                SetEntityProofs(prop, true, true, true, true, true, true, true, true)
                SetEntityCanBeDamaged(prop, false)
                SetEntityLodDist(prop, 150)
                
                -- Target interactions for curtains
                if ent.isCurtain and Config.EnableTargetInteractions then
                    if exports and exports['ox_target'] then
                        exports['ox_target']:addLocalEntity(prop, {
                            {
                                name = 'toggle_curtain_' .. ent.id,
                                icon = 'fas fa-eye',
                                label = 'Toggle Curtain / Blinds',
                                onSelect = function()
                                    ExecuteCommand("togglecurtains")
                                end
                            }
                        })
                    end
                end

                table.insert(spawnedProps, prop)
            end
            SetModelAsNoLongerNeeded(ent.model)
        end
    end

    print(("[^2MLO^7] Successfully spawned %d/%d interior props with collision!"):format(#spawnedProps, #Config.Entities))
end

-- Main Startup Thread
CreateThread(function()
    RequestIpl("${resName}_instance")
    
    -- Cache interior ID
    currentInteriorId = GetInteriorAtCoords(interiorCoords.x, interiorCoords.y, interiorCoords.z)
    
    if currentInteriorId ~= 0 and IsValidInterior(currentInteriorId) then
        PinInteriorInMemory(currentInteriorId)
        
        -- Activate Default Entity Sets
        for setName, data in pairs(Config.EntitySets) do
            if data.defaultActive then
                ActivateInteriorEntitySet(currentInteriorId, setName)
            end
        end
        
        -- Set Realistic Interior Audio Reverbs
        if Config.EnableAudioReverbs then
            for roomId, roomData in pairs(Config.Rooms) do
                if roomData.audioReverb then
                    SetInteriorRoomFlag(currentInteriorId, roomId, 4) -- Acoustic sound dampening
                end
            end
        end
        
        RefreshInterior(currentInteriorId)
    end

    -- Spawn placed props with collision
    SpawnInteriorProps(interiorCoords)
    isInteriorLoaded = true
    print(("[^2MLO^7] Photorealistic MLO '%s' is ready on server! Coordinates: vec3(%.2f, %.2f, %.2f)"):format(Config.InteriorName, interiorCoords.x, interiorCoords.y, interiorCoords.z))
end)

-- Teleport In-Game Command
RegisterCommand("tp_" .. "${resName}", function()
    local ped = PlayerPedId()
    SetEntityCoords(ped, interiorCoords.x, interiorCoords.y, interiorCoords.z + 0.5, false, false, false, true)
    print("^2Teleported to " .. Config.InteriorName .. "^7")
end, false)

-- Live In-Game Re-anchor Command (Spawns the MLO right where the player is standing!)
RegisterCommand("spawnhere_" .. "${resName}", function()
    local ped = PlayerPedId()
    local pcoords = GetEntityCoords(ped)
    interiorCoords = pcoords
    SpawnInteriorProps(interiorCoords)
    print(("^2[MLO] Re-anchored %s to your player coordinates: vec3(%.2f, %.2f, %.2f)^7"):format(Config.InteriorName, pcoords.x, pcoords.y, pcoords.z))
end, false)

-- Toggle Curtains Command
RegisterCommand("togglecurtains", function()
    local ped = PlayerPedId()
    local pcoords = GetEntityCoords(ped)
    
    for _, prop in ipairs(spawnedProps) do
        local mcoords = GetEntityCoords(prop)
        if #(pcoords - mcoords) < 3.5 then
            local model = GetEntityModel(prop)
            if model == \`prop_curtain_open_01\` then
                local rot = GetEntityRotation(prop, 2)
                DeleteEntity(prop)
                if LoadModel(\`prop_curtain_closed_01\`) then
                    local newProp = CreateObjectNoOffset(\`prop_curtain_closed_01\`, mcoords.x, mcoords.y, mcoords.z, false, false, false)
                    SetEntityRotation(newProp, rot.x, rot.y, rot.z, 2, true)
                    FreezeEntityPosition(newProp, true)
                    PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
                end
            elseif model == \`prop_curtain_closed_01\` then
                local rot = GetEntityRotation(prop, 2)
                DeleteEntity(prop)
                if LoadModel(\`prop_curtain_open_01\`) then
                    local newProp = CreateObjectNoOffset(\`prop_curtain_open_01\`, mcoords.x, mcoords.y, mcoords.z, false, false, false)
                    SetEntityRotation(newProp, rot.x, rot.y, rot.z, 2, true)
                    FreezeEntityPosition(newProp, true)
                    PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
                end
            end
        end
    end
end, false)

-- Entity Sets Toggle Command
RegisterCommand("mlo_toggle", function(source, args)
    local setName = args[1]
    if not setName then
        print("^3Usage: /mlo_toggle [entitySetName]^7")
        return
    end

    if currentInteriorId ~= 0 and IsValidInterior(currentInteriorId) then
        if IsInteriorEntitySetActive(currentInteriorId, setName) then
            DeactivateInteriorEntitySet(currentInteriorId, setName)
            print(("[^1MLO^7] Deactivated Entity Set: %s"):format(setName))
        else
            ActivateInteriorEntitySet(currentInteriorId, setName)
            print(("[^2MLO^7] Activated Entity Set: %s"):format(setName))
        end
        RefreshInterior(currentInteriorId)
    end
end, false)

-- Cleanup on Resource Stop
AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        for _, prop in ipairs(spawnedProps) do
            if DoesEntityExist(prop) then
                DeleteEntity(prop)
            end
        end
        spawnedProps = {}
        print("[^1MLO^7] Cleaned up all spawned interior props.")
    end
end)
`;
    }

    static generateDoorlockConfig(mloData) {
        const doorEntities = (mloData.entities || []).filter(e => {
            const m = (e.model || '').toLowerCase();
            return m.includes('door') || m.includes('gate') || m.includes('secdoor');
        });

        if (doorEntities.length === 0) {
            return `-- No door entities detected in MLO project.\n-- Add doors from Prop Library to auto-generate OX/QB doorlock entries.`;
        }

        const worldPos = mloData.position || { x: 970.2, y: -100.5, z: 74.0 };

        let ox = `-- ==========================================\n-- OX_DOORLOCK CONFIGURATION (Copy to ox_doorlock/config.lua)\n-- ==========================================\n\n`;
        doorEntities.forEach((d, idx) => {
            const dx = (worldPos.x + d.pos.x).toFixed(2);
            const dy = (worldPos.y + d.pos.y).toFixed(2);
            const dz = (worldPos.z + d.pos.z).toFixed(2);
            ox += `{\n    name = "${mloData.name || 'interior'}_door_${idx + 1}",\n    model = \`${d.model}\`,\n    coords = vec3(${dx}, ${dy}, ${dz}),\n    distance = 2.0,\n    state = 1,\n    locked = true\n},\n`;
        });

        return ox;
    }
}

if (typeof module !== 'undefined') {
    module.exports = ResourceExporter;
}
