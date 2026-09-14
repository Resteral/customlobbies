-- =========================================================================
-- The Sims MLO House Builder - FiveM Client Engine (Sims 4 Style MLO Generator)
-- 1-Click Rooms, Walls, Floors, Ceilings, Furnished Sets & Dynamic Lighting
-- Resource: mlo_custom_interior
-- =========================================================================

local isMenuOpen = false
local currentTool = 'place'
local currentSelection = { type = 'room', id = 'room_4x4', name = 'Square Room (4x4m)' }
local currentRotationYaw = 0.0
local currentElevationOffset = 0.0

-- Spawned Props Pool & History for Undo
local spawnedProps = {}
local projectEntities = {}
local historyStack = {}
local dynamicLights = {}
local hiddenWorldBuildings = {}

-- Stream all High-End Luxury Apartment & Interior IPLs on startup
CreateThread(function()
    local interiorIpls = {
        "v_apartment_low",
        "v_apartment_mid",
        "v_apartment_high",
        "apa_v_mp_h_01_a",
        "apa_v_mp_h_01_b",
        "apa_v_mp_h_01_c",
        "apa_v_mp_h_02_a",
        "apa_v_mp_h_02_b",
        "apa_v_mp_h_03_a",
        "apa_v_mp_h_04_a",
        "apa_v_mp_h_05_a",
        "apa_v_mp_h_06_a",
        "apa_v_mp_h_07_a",
        "apa_v_mp_h_08_a",
        "v_motel_mp",
        "v_office_01",
        "v_office_02",
        "v_office_03",
        "v_club_vu",
        "v_bkr_biker_interior_m"
    }
    for _, ipl in ipairs(interiorIpls) do
        RequestIpl(ipl)
    end
    print("[^2Sims Builder^7] Streamed all interior apartment IPLs successfully!")
end)

-- High-Quality Realistic Building Assets (Real Plaster Drywall, Marble, Hardwood)
local BASE_MODELS = {
    floor = GetHashKey("v_res_m_h_flooring"), -- Luxury Polished Hardwood Floor
    marble_floor = GetHashKey("v_res_ph_floor"), -- Luxury Carrara Marble
    wall = GetHashKey("v_res_m_wall01"), -- Clean White Interior Plaster Drywall
    wall_dark = GetHashKey("v_res_m_wall02"), -- Charcoal Accent Drywall
    divider = GetHashKey("v_corp_divider01"), -- Modern Office Room Divider
    tall_partition = GetHashKey("v_corp_offscreen1"), -- Tall Partition Screen
    glass_wall = GetHashKey("v_res_mp_shower"), -- Frameless Glass Wall
    mirror_wall = GetHashKey("v_res_mp_mirror"), -- Luxury Full-Height Mirror
    door = GetHashKey("v_ilev_trev_doorfront"), -- Solid Walnut Front Door
    glass_door = GetHashKey("v_ilev_bk_door01"), -- Modern Pivot Glass Door
    bath_door = GetHashKey("v_ilev_bath_door"), -- Frosted Glass Bathroom Door
    sofa = GetHashKey("v_club_leather_sofa"), -- Italian Leather Sectional
    tv = GetHashKey("prop_tv_flat_01"), -- 65" 4K OLED TV
    bed = GetHashKey("v_res_d_bed"), -- King Size Luxury Platform Bed
    tub = GetHashKey("v_res_mp_soakertub"), -- Freestanding Oval Soaking Tub
    vanity = GetHashKey("v_res_mp_vanity"), -- Double Marble Vanity Sink
    kitchen_island = GetHashKey("v_res_kit_counter"), -- Quartz Kitchen Counter Island
    fridge = GetHashKey("v_res_fridge"), -- French Door Stainless Refrigerator
    toilet = GetHashKey("prop_toilet_01"), -- Modern Porcelain Toilet
    desk = GetHashKey("v_corp_desk"), -- Executive Mahogany Desk
    office_chair = GetHashKey("v_corp_offchair"), -- Ergonomic Leather Chair
    light = GetHashKey("prop_ceiling_light_01") -- Warm Ceiling Downlight Emitter
}

-- Utility: Request and Load Model
local function LoadModel(modelHash)
    if not modelHash or modelHash == 0 then modelHash = BASE_MODELS.wall end

    if not HasModelLoaded(modelHash) then
        RequestModel(modelHash)
        local timeout = 0
        while not HasModelLoaded(modelHash) and timeout < 100 do
            Wait(10)
            timeout = timeout + 1
        end
    end

    return HasModelLoaded(modelHash), modelHash
end

-- Get Ground Target in Front of Player / Camera
local function GetAimTargetCoords()
    local camPos = GetGameplayCamCoord()
    local camRot = GetGameplayCamRot(2)

    local radX = math.rad(camRot.x)
    local radZ = math.rad(camRot.z)
    local cosX = math.cos(radX)

    local fwd = vector3(-math.sin(radZ) * cosX, math.cos(radZ) * cosX, math.sin(radX))
    local endPos = camPos + fwd * 60.0

    local ray = StartShapeTestRay(camPos.x, camPos.y, camPos.z, endPos.x, endPos.y, endPos.z, 17, PlayerPedId(), 7)
    local _, hit, hitCoords, _, entityHit = GetShapeTestResult(ray)

    if hit == 0 then
        local ped = PlayerPedId()
        hitCoords = GetEntityCoords(ped) + GetEntityForwardVector(ped) * 6.0
        hit = 1
    end

    return hitCoords, entityHit
end

-- Spawn a Solid Physical Prop
local function SpawnSolidProp(modelHash, coords, rot, name, isLight)
    local loaded, actualHash = LoadModel(modelHash)
    if not loaded then return nil end

    local prop = CreateObjectNoOffset(actualHash, coords.x, coords.y, coords.z, true, true, false)
    if DoesEntityExist(prop) then
        SetEntityRotation(prop, rot.x, rot.y, rot.z, 2, true)
        FreezeEntityPosition(prop, true)
        SetEntityInvincible(prop, true)
        SetEntityProofs(prop, true, true, true, true, true, true, true, true)
        SetEntityCanBeDamaged(prop, false)
        SetEntityLodDist(prop, 350)

        local record = {
            id = #projectEntities + 1,
            name = name or "Sims Prop",
            model = actualHash,
            offset = coords,
            rot = rot,
            entityHandle = prop,
            isLight = isLight or false
        }

        table.insert(projectEntities, record)
        table.insert(spawnedProps, prop)

        if isLight then
            table.insert(dynamicLights, {
                coords = coords,
                color = { r = 255, g = 214, b = 170 },
                intensity = 8.0,
                range = 10.0
            })
        end

        return prop
    end
    return nil
end

-- =========================================================================
-- SIMS ROOM BUILDER GENERATOR (Assembles 4 Walls, Floor, Ceiling & Door)
-- =========================================================================
local function GenerateSimsRoom(roomSize, centerCoords, yaw, elevation)
    local halfSize = (roomSize or 4.0) / 2.0
    local ox = centerCoords.x
    local oy = centerCoords.y
    local oz = centerCoords.z + elevation

    local spawnedInStep = {}

    -- 1. Polished Hardwood Flooring Layer
    local woodFloor = SpawnSolidProp(BASE_MODELS.floor, vec3(ox, oy, oz), vec3(0,0,yaw), "Polished Hardwood Floor")
    if woodFloor then table.insert(spawnedInStep, woodFloor) end

    -- 2. Perimeter North Wall (Clean White Plaster Drywall)
    local wNorth = SpawnSolidProp(BASE_MODELS.wall, vec3(ox, oy + halfSize, oz), vec3(0,0,yaw), "North Wall")
    if wNorth then table.insert(spawnedInStep, wNorth) end

    -- 3. Perimeter South Wall (With Walk-in Entrance Doorway)
    local wSouthL = SpawnSolidProp(BASE_MODELS.wall, vec3(ox - (halfSize * 0.5), oy - halfSize, oz), vec3(0,0,yaw), "South Wall (Left)")
    if wSouthL then table.insert(spawnedInStep, wSouthL) end
    local wSouthR = SpawnSolidProp(BASE_MODELS.wall, vec3(ox + (halfSize * 0.5), oy - halfSize, oz), vec3(0,0,yaw), "South Wall (Right)")
    if wSouthR then table.insert(spawnedInStep, wSouthR) end
    local door = SpawnSolidProp(BASE_MODELS.door, vec3(ox, oy - halfSize, oz), vec3(0,0,yaw), "Front Entrance Door")
    if door then table.insert(spawnedInStep, door) end

    -- 4. Perimeter East Wall (Panoramic Clear Glass)
    local wEast = SpawnSolidProp(BASE_MODELS.glass_wall, vec3(ox + halfSize, oy, oz), vec3(0,0,yaw + 90.0), "East Glass Wall")
    if wEast then table.insert(spawnedInStep, wEast) end

    -- 5. Perimeter West Wall
    local wWest = SpawnSolidProp(BASE_MODELS.wall, vec3(ox - halfSize, oy, oz), vec3(0,0,yaw + 90.0), "West Wall")
    if wWest then table.insert(spawnedInStep, wWest) end

    -- 6. Finished Ceiling Roof Deck
    local roof = SpawnSolidProp(BASE_MODELS.floor, vec3(ox, oy, oz + 3.0), vec3(0,0,yaw), "Ceiling Roof Deck")
    if roof then table.insert(spawnedInStep, roof) end

    -- 7. Warm Dynamic Ceiling Light Emitter
    local light = SpawnSolidProp(BASE_MODELS.light, vec3(ox, oy, oz + 2.8), vec3(0,0,yaw), "Warm Ceiling Downlight", true)
    if light then table.insert(spawnedInStep, light) end

    table.insert(historyStack, spawnedInStep)
    PlaySoundFrontend(-1, "CHALLENGE_UNLOCKED", "HUD_AWARDS", true)

    TriggerEvent('chat:addMessage', {
        color = { 34, 197, 94 },
        multiline = true,
        args = { "Sims Builder", ("^2✨ Built Complete %dx%dm Enclosed Room with Smooth White Plaster Walls, Hardwood Floor & Roof!^7"):format(math.floor(roomSize), math.floor(roomSize)) }
    })
end

-- =========================================================================
-- SIMS 1-CLICK FURNISHED ROOM SETS GENERATOR
-- =========================================================================
local function GenerateFurnishedSet(setId, centerCoords, yaw, elevation)
    local ox = centerCoords.x
    local oy = centerCoords.y
    local oz = centerCoords.z + elevation
    local spawnedInStep = {}

    if setId == 'set_living' then
        local sofa = SpawnSolidProp(BASE_MODELS.sofa, vec3(ox, oy - 1.5, oz), vec3(0,0,yaw), "Italian Leather Sectional")
        local tv = SpawnSolidProp(BASE_MODELS.tv, vec3(ox, oy + 2.0, oz + 1.0), vec3(0,0,yaw + 180.0), "65\" 4K TV")
        local light = SpawnSolidProp(BASE_MODELS.light, vec3(ox, oy, oz + 2.8), vec3(0,0,yaw), "Living Room Downlight", true)
        if sofa then table.insert(spawnedInStep, sofa) end
        if tv then table.insert(spawnedInStep, tv) end
        if light then table.insert(spawnedInStep, light) end
    elseif setId == 'set_bedroom' then
        local bed = SpawnSolidProp(BASE_MODELS.bed, vec3(ox, oy + 1.5, oz), vec3(0,0,yaw + 180.0), "King Platform Bed")
        local light = SpawnSolidProp(BASE_MODELS.light, vec3(ox, oy, oz + 2.8), vec3(0,0,yaw), "Bedroom Ceiling Light", true)
        if bed then table.insert(spawnedInStep, bed) end
        if light then table.insert(spawnedInStep, light) end
    elseif setId == 'set_kitchen' then
        local island = SpawnSolidProp(BASE_MODELS.kitchen_island, vec3(ox, oy, oz), vec3(0,0,yaw), "Kitchen Quartz Island")
        local fridge = SpawnSolidProp(BASE_MODELS.fridge, vec3(ox - 2.0, oy + 1.0, oz), vec3(0,0,yaw), "Stainless Refrigerator")
        if island then table.insert(spawnedInStep, island) end
        if fridge then table.insert(spawnedInStep, fridge) end
    elseif setId == 'set_bathroom' then
        local tub = SpawnSolidProp(BASE_MODELS.tub, vec3(ox - 1.5, oy, oz), vec3(0,0,yaw), "Spa Soaking Tub")
        local vanity = SpawnSolidProp(BASE_MODELS.vanity, vec3(ox + 1.5, oy, oz), vec3(0,0,yaw + 180.0), "Double Vanity Sink")
        local toilet = SpawnSolidProp(BASE_MODELS.toilet, vec3(ox, oy + 2.0, oz), vec3(0,0,yaw + 180.0), "Modern Toilet")
        if tub then table.insert(spawnedInStep, tub) end
        if vanity then table.insert(spawnedInStep, vanity) end
        if toilet then table.insert(spawnedInStep, toilet) end
    elseif setId == 'set_office' then
        local desk = SpawnSolidProp(BASE_MODELS.desk, vec3(ox, oy, oz), vec3(0,0,yaw), "Executive Desk")
        local chair = SpawnSolidProp(BASE_MODELS.office_chair, vec3(ox, oy - 0.8, oz), vec3(0,0,yaw), "Ergonomic Chair")
        if desk then table.insert(spawnedInStep, desk) end
        if chair then table.insert(spawnedInStep, chair) end
    end

    table.insert(historyStack, spawnedInStep)
    PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
    TriggerEvent('chat:addMessage', {
        color = { 34, 197, 94 },
        multiline = true,
        args = { "Sims Builder", ("^2🛋️ Furnished Room Set Spawned!^7") }
    })
end

-- World Building Eraser
local function EraseWorldBuilding()
    local hitCoords, entityHit = GetAimTargetCoords()
    local targetEntity = entityHit
    local model = 0
    local coords = hitCoords

    if targetEntity and targetEntity ~= 0 and DoesEntityExist(targetEntity) then
        model = GetEntityModel(targetEntity)
        coords = GetEntityCoords(targetEntity)
    else
        local nearbyObj = GetClosestObjectOfType(hitCoords.x, hitCoords.y, hitCoords.z, 20.0, 0, false, false, false)
        if DoesEntityExist(nearbyObj) then
            targetEntity = nearbyObj
            model = GetEntityModel(nearbyObj)
            coords = GetEntityCoords(nearbyObj)
        end
    end

    if model ~= 0 or (targetEntity and DoesEntityExist(targetEntity)) then
        CreateModelHide(coords.x, coords.y, coords.z, 35.0, model, true)

        if targetEntity and DoesEntityExist(targetEntity) then
            SetEntityCoords(targetEntity, 0.0, 0.0, -300.0, false, false, false, false)
            SetEntityCollision(targetEntity, false, false)
            SetEntityAsMissionEntity(targetEntity, true, true)
            DeleteObject(targetEntity)
        end

        table.insert(hiddenWorldBuildings, {
            id = #hiddenWorldBuildings + 1,
            model = model,
            coords = { x = coords.x, y = coords.y, z = coords.z },
            radius = 35.0
        })

        UseParticleFxAssetNextCall("core")
        StartParticleFxNonLoopedAtCoord("exp_grd_debris", coords.x, coords.y, coords.z + 1.0, 0.0, 0.0, 0.0, 2.0, false, false, false)
        PlaySoundFrontend(-1, "DELETE", "HUD_DEATHMATCH_SOUNDSET", true)

        TriggerServerEvent('mlo_maker:saveHiddenBuildings', hiddenWorldBuildings)
        TriggerEvent('chat:addMessage', {
            color = { 244, 63, 94 },
            multiline = true,
            args = { "Sims Builder", "^1Erased GTA V World Building! Empty lot ready for construction.^7" }
        })
    end
end

-- Toggle Studio NUI
local function ToggleSimsStudio(enable)
    isMenuOpen = enable
    SetNuiFocus(enable, enable)
    SetNuiFocusKeepInput(enable)
    SendNUIMessage({ action = enable and 'open' or 'close' })
end

-- Render Loop for Real Dynamic Lights & Target Grid Indicator
CreateThread(function()
    while true do
        if isMenuOpen then
            local aimCoords, _ = GetAimTargetCoords()
            DrawMarker(28, aimCoords.x, aimCoords.y, aimCoords.z + 0.05, 0,0,0, 0,0,0, 1.5, 1.5, 0.2, 34, 197, 94, 180, false, false, 2, false, nil, nil, false)
            SendNUIMessage({ action = 'setAimCoords', coords = aimCoords })
            Wait(0)
        else
            Wait(300)
        end
    end
end)

-- Real Dynamic Point Lights
CreateThread(function()
    while true do
        if #dynamicLights > 0 then
            for _, light in ipairs(dynamicLights) do
                DrawLightWithRange(light.coords.x, light.coords.y, light.coords.z, light.color.r, light.color.g, light.color.b, light.range or 10.0, light.intensity or 6.0)
            end
            Wait(0)
        else
            Wait(500)
        end
    end
end)

-- NUI Callbacks
RegisterNUICallback('closeMenu', function(data, cb)
    ToggleSimsStudio(false)
    cb('ok')
end)

RegisterNUICallback('setTool', function(data, cb)
    currentTool = data.tool or 'place'
    cb('ok')
end)

RegisterNUICallback('setAngleYaw', function(data, cb)
    currentRotationYaw = tonumber(data.yaw) or 0.0
    cb('ok')
end)

RegisterNUICallback('setElevationOffset', function(data, cb)
    currentElevationOffset = tonumber(data.offset) or 0.0
    cb('ok')
end)

RegisterNUICallback('selectSimsPreview', function(data, cb)
    currentSelection = data.selection
    cb('ok')
end)

RegisterNUICallback('stampSimsSelection', function(data, cb)
    local aimCoords, _ = GetAimTargetCoords()
    local sel = data.selection or currentSelection
    local yaw = tonumber(data.yaw) or currentRotationYaw
    local elev = tonumber(data.elevation) or currentElevationOffset

    if sel.type == 'room' then
        local size = 4.0
        if sel.id == 'room_6x6' then size = 6.0
        elseif sel.id == 'room_8x8' then size = 8.0
        elseif sel.id == 'room_12x12' then size = 12.0
        end
        GenerateSimsRoom(size, aimCoords, yaw, elev)
    elseif sel.type == 'house_shell' then
        GenerateSimsRoom(8.0, aimCoords, yaw, elev)
        GenerateFurnishedSet('set_living', aimCoords + vec3(0, -2.0, 0), yaw, elev)
        GenerateFurnishedSet('set_bedroom', aimCoords + vec3(0, 2.0, 0), yaw, elev)
    elseif sel.type == 'furnished_set' then
        GenerateFurnishedSet(sel.id, aimCoords, yaw, elev)
    elseif sel.type == 'prop' and sel.model then
        local p = SpawnSolidProp(GetHashKey(sel.model), aimCoords + vec3(0, 0, elev), vec3(0, 0, yaw), sel.name, sel.isLight)
        if p then table.insert(historyStack, { p }) end
        PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
        TriggerEvent('chat:addMessage', { color = { 34, 197, 94 }, multiline = true, args = { "Sims Builder", ("^2Placed %s^7"):format(sel.name) } })
    end
    cb('ok')
end)

RegisterNUICallback('eraseTargetBuilding', function(data, cb)
    EraseWorldBuilding()
    cb('ok')
end)

RegisterNUICallback('undoLast', function(data, cb)
    if #historyStack > 0 then
        local lastStep = table.remove(historyStack)
        for _, ent in ipairs(lastStep) do
            if DoesEntityExist(ent) then
                DeleteEntity(ent)
            end
        end
        PlaySoundFrontend(-1, "DELETE", "HUD_DEATHMATCH_SOUNDSET", true)
        TriggerEvent('chat:addMessage', { color = { 244, 63, 94 }, multiline = true, args = { "Sims Builder", "^1Undid last placed structure!^7" } })
    end
    cb('ok')
end)

RegisterNUICallback('saveProject', function(data, cb)
    local exportList = {}
    for _, ent in ipairs(projectEntities) do
        table.insert(exportList, {
            id = ent.id,
            name = ent.name,
            model = ent.model,
            pos = { x = ent.offset.x, y = ent.offset.y, z = ent.offset.z },
            rot = { x = ent.rot.x, y = ent.rot.y, z = ent.rot.z }
        })
    end

    TriggerServerEvent('mlo_maker:saveProject', exportList)
    TriggerServerEvent('mlo_maker:saveHiddenBuildings', hiddenWorldBuildings)
    PlaySoundFrontend(-1, "CHALLENGE_UNLOCKED", "HUD_AWARDS", true)
    cb('ok')
end)

-- In-Game Commands
RegisterCommand('mlomaker', function()
    ToggleSimsStudio(not isMenuOpen)
end, false)

RegisterCommand('sims', function()
    ToggleSimsStudio(not isMenuOpen)
end, false)

RegisterKeyMapping('mlomaker', 'Open The Sims House Builder', 'keyboard', 'F7')

-- Auto-Hide Configured Buildings on Startup
CreateThread(function()
    if Config.HiddenBuildings and #Config.HiddenBuildings > 0 then
        for _, bld in ipairs(Config.HiddenBuildings) do
            CreateModelHide(bld.coords.x, bld.coords.y, bld.coords.z, bld.radius or 35.0, bld.model, true)
            table.insert(hiddenWorldBuildings, bld)
        end
    end
end)
