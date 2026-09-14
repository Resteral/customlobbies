local isUIOpen = false
local currentFurnaceId = nil
local currentFurnaceData = nil
local activeParticles = {}

-- Initialize Map Blips & Targets
CreateThread(function()
    for furnaceId, data in pairs(Config.Furnaces) do
        -- 1. Create Map Blip if configured
        if data.blip then
            local blip = AddBlipForCoord(data.coords.x, data.coords.y, data.coords.z)
            SetBlipSprite(blip, data.blip.sprite)
            SetBlipDisplay(blip, 4)
            SetBlipScale(blip, data.blip.scale)
            SetBlipColour(blip, data.blip.color)
            SetBlipAsShortRange(blip, true)
            BeginTextCommandSetBlipName("STRING")
            AddTextComponentSubstringPlayerName(data.blip.label)
            EndTextCommandSetBlipName(blip)
        end

        -- 2. Setup ox_target / qb-target
        if GetResourceState('ox_target') == 'started' then
            exports.ox_target:addSphereZone({
                coords = data.coords,
                radius = data.radius or 2.0,
                debug = Config.Debug,
                options = {
                    {
                        name = 'smelter_' .. furnaceId,
                        icon = 'fa-solid fa-fire-burner',
                        label = 'Access ' .. data.label,
                        onSelect = function()
                            OpenSmelter(furnaceId)
                        end
                    }
                }
            })
        elseif GetResourceState('qb-target') == 'started' then
            exports['qb-target']:AddCircleZone('smelter_' .. furnaceId, data.coords, data.radius or 2.0, {
                name = 'smelter_' .. furnaceId,
                debugPoly = Config.Debug,
            }, {
                options = {
                    {
                        icon = 'fas fa-fire-burner',
                        label = 'Access ' .. data.label,
                        action = function()
                            OpenSmelter(furnaceId)
                        end
                    }
                },
                distance = 2.5
            })
        end
    end
end)

-- Open Smelter NUI
function OpenSmelter(furnaceId)
    local furnace = Config.Furnaces[furnaceId]
    if not furnace then return end

    currentFurnaceId = furnaceId

    -- Request live server state for this furnace
    lib.callback('qbx_smelting:sv:getFurnaceState', false, function(state, playerInventory)
        if not state then
            lib.notify({ title = 'Smelter', description = 'Failed to connect to smelter sensors.', type = 'error' })
            return
        end

        currentFurnaceData = state
        isUIOpen = true
        SetNuiFocus(true, true)

        SendNUIMessage({
            action = 'open',
            furnaceId = furnaceId,
            label = furnace.label,
            type = furnace.type,
            maxTemp = furnace.maxTemperature,
            currentTemp = state.temp,
            fuelLevel = state.fuel,
            activeFuel = state.activeFuel,
            allowedCategories = furnace.allowedCategories,
            recipes = Config.Recipes,
            fuels = Config.Fuels,
            inventory = playerInventory
        })
    end, furnaceId)
end

-- Close Smelter NUI
RegisterNUICallback('close', function(data, cb)
    isUIOpen = false
    SetNuiFocus(false, false)
    currentFurnaceId = nil
    cb('ok')
end)

-- Add Fuel Callback from NUI
RegisterNUICallback('addFuel', function(data, cb)
    if not currentFurnaceId then cb({ success = false }) return end

    local fuelName = data.fuelName
    lib.callback('qbx_smelting:sv:addFuel', false, function(success, updatedState)
        if success then
            PlayFuelSound()
            cb({ success = true, state = updatedState })
        else
            cb({ success = false, message = "Insufficient fuel in inventory." })
        end
    end, currentFurnaceId, fuelName)
end)

-- Start Smelt Callback from NUI (Keeps UI open to display live working animation!)
RegisterNUICallback('startSmelt', function(data, cb)
    if not currentFurnaceId then cb({ success = false }) return end

    local recipeId = data.recipeId
    local recipe = Config.Recipes[recipeId]
    if not recipe then
        cb({ success = false, message = "Invalid recipe." })
        return
    end

    -- Trigger world ped anim and particle effects in background while UI animates
    CreateThread(function()
        StartSmeltingSequence(currentFurnaceId, recipeId, recipe)
    end)

    cb({ success = true })
end)

-- Visual & Audio Smelting Sequence in World
function StartSmeltingSequence(furnaceId, recipeId, recipe)
    local ped = PlayerPedId()
    local furnace = Config.Furnaces[furnaceId]

    -- Load animation
    lib.requestAnimDict(Config.SmeltAnim.dict)
    TaskPlayAnim(ped, Config.SmeltAnim.dict, Config.SmeltAnim.anim, 8.0, -8.0, -1, Config.SmeltAnim.flag, 0, false, false, false)

    -- Particle VFX at furnace coords
    RequestNamedPtfxAsset(Config.Particles.dict)
    while not HasNamedPtfxAssetLoaded(Config.Particles.dict) do Wait(10) end

    UseParticleFxAssetNextCall(Config.Particles.dict)
    local smokePtfx = StartParticleFxLoopedAtCoord(Config.Particles.smoke, furnace.coords.x, furnace.coords.y, furnace.coords.z + 1.2, 0.0, 0.0, 0.0, 0.8, false, false, false, false)

    UseParticleFxAssetNextCall(Config.Particles.dict)
    local sparkPtfx = StartParticleFxLoopedAtCoord(Config.Particles.moltenSparks, furnace.coords.x, furnace.coords.y, furnace.coords.z + 0.5, 0.0, 0.0, 0.0, 0.7, false, false, false, false)

    -- Wait for the smelt duration to finish in sync with NUI animation
    Wait(recipe.smeltTime or 8000)

    -- Complete Smelt on Server
    TriggerServerEvent('qbx_smelting:sv:completeSmelt', furnaceId, recipeId)

    -- Cleanup world effects
    StopParticleFxLooped(smokePtfx, false)
    StopParticleFxLooped(sparkPtfx, false)
    ClearPedTasks(ped)
end

-- Audio Helpers
function PlayFuelSound()
    PlaySoundFrontend(-1, "FLIGHT_SCHOOL_LESSON_PASSED", "HUD_AWARDS", true)
end

-- Server State Sync Event
RegisterNetEvent('qbx_smelting:cl:syncFurnace', function(furnaceId, state)
    if isUIOpen and currentFurnaceId == furnaceId then
        SendNUIMessage({
            action = 'updateState',
            currentTemp = state.temp,
            fuelLevel = state.fuel,
            activeFuel = state.activeFuel
        })
    end
end)
