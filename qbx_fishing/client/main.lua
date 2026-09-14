local isFishing = false

-----------------------------------------------------------
-- Build a quick lookup of rod item -> tier index
-----------------------------------------------------------
local rodByItem = {}
for index, rod in ipairs(Config.Rods) do
    rodByItem[rod.item] = index
end

-----------------------------------------------------------
-- Return the highest tier rod the player currently owns.
-- Returns the rod config table + tier index, or nil.
-----------------------------------------------------------
local function getBestRod()
    local best, bestIndex = nil, 0
    for _, item in ipairs(exports.ox_inventory:Search('slots', '') or {}) do
        local index = rodByItem[item.name]
        if index and index > bestIndex then
            best, bestIndex = Config.Rods[index], index
        end
    end
    return best, bestIndex
end

-----------------------------------------------------------
-- Check the player is next to / facing water.
-----------------------------------------------------------
local function isNearWater()
    local ped = cache.ped or PlayerPedId()
    local coords = GetEntityCoords(ped)

    -- Straight-down probe (standing in shallow water / on a dock edge)
    local foundHere, waterZ = GetWaterHeight(coords.x, coords.y, coords.z)
    if foundHere and math.abs(coords.z - waterZ) < 8.0 then
        return true
    end

    -- Probe a point in front of the player (casting off a pier/boat)
    local forward = GetEntityForwardVector(ped)
    for dist = 2.0, Config.WaterCheckDistance, 2.0 do
        local checkX = coords.x + forward.x * dist
        local checkY = coords.y + forward.y * dist
        local found = GetWaterHeight(checkX, checkY, coords.z)
        if found then return true end
    end
    return false
end

-----------------------------------------------------------
-- Fishing animation. Plays a cast throw, then settles into the
-- idle "waiting for a bite" loop.
-----------------------------------------------------------
local function playCastAnim()
    local ped = cache.ped or PlayerPedId()
    lib.requestAnimDict('amb@world_human_stand_fishing@idle_a')
    -- Big cast motion, then blend into the idle loop.
    TaskPlayAnim(ped, 'amb@world_human_stand_fishing@idle_a', 'idle_c', 8.0, -8.0, 1200, 48, 0, false, false, false)
    Wait(900)
    TaskPlayAnim(ped, 'amb@world_human_stand_fishing@idle_a', 'idle_c', 2.0, -2.0, -1, 11, 0, false, false, false)
end

local function playReelAnim()
    local ped = cache.ped or PlayerPedId()
    lib.requestAnimDict('amb@world_human_stand_fishing@idle_a')
    TaskPlayAnim(ped, 'amb@world_human_stand_fishing@idle_a', 'idle_c', 6.0, -6.0, -1, 51, 0, false, false, false)
end

local function stopFishingAnim()
    ClearPedTasks(cache.ped or PlayerPedId())
end

-----------------------------------------------------------
-- Build the per-tier minigame difficulty payload for the NUI.
-----------------------------------------------------------
local function buildMinigameConfig(tier)
    local mg = Config.Minigame
    local b, p, c = mg.base, mg.perTier, mg.clamp
    local steps = math.max(0, tier - 1)

    local biteWindowMs = math.max(c.minBiteWindowMs, b.biteWindowMs + p.biteWindowMs * steps)
    local barZone = math.max(c.minBarZone, b.barZone + p.barZone * steps)
    local struggleMinGap = math.max(c.minStruggleGap, b.struggleMinGap + p.struggleMinGap * steps)
    local struggleMaxGap = math.max(struggleMinGap + 0.4, b.struggleMaxGap + p.struggleMaxGap * steps)

    return {
        tier           = tier,
        biteWindowMs   = biteWindowMs,
        reelTimeMs     = b.reelTimeMs,
        barZone        = barZone,
        fishSpeed      = b.fishSpeed + p.fishSpeed * steps,
        fishSlip       = b.fishSlip + p.fishSlip * steps,
        fill           = b.fill,
        drain          = b.drain,
        -- struggle mechanic
        struggleMinGap  = struggleMinGap,
        struggleMaxGap  = struggleMaxGap,
        struggleTime    = b.struggleTime + p.struggleTime * steps,
        struggleGraceMs = b.struggleGraceMs,
        tensionBuild    = b.tensionBuild + p.tensionBuild * steps,
        tensionEase     = b.tensionEase,
    }
end

-----------------------------------------------------------
-- Run the visual NUI minigame and wait for its result.
-- Returns a table: { hooked = bool, landed = bool }
--   hooked = player reacted to the bite in time
--   landed = player won the reel/fight
-----------------------------------------------------------
local minigameActive = false
local minigameResult = nil

RegisterNUICallback('fishingResult', function(data, cb)
    minigameResult = data or {}
    minigameActive = false
    SetNuiFocus(false, false)
    cb('ok')
end)

local function runMinigame(rod, tier)
    minigameActive = true
    minigameResult = nil

    SetNuiFocus(true, false)
    SendNUIMessage({
        action = 'start',
        config = buildMinigameConfig(tier),
        rodLabel = rod.label,
    })

    -- Wait for the NUI to post a result back (with a hard timeout safety net).
    local timeout = GetGameTimer() + (Config.Minigame.base.reelTimeMs + 20000)
    while minigameActive do
        if GetGameTimer() > timeout then
            minigameActive = false
            SetNuiFocus(false, false)
            SendNUIMessage({ action = 'forceClose' })
            break
        end
        Wait(50)
    end

    return minigameResult or { hooked = false, landed = false }
end

-----------------------------------------------------------
-- Main fishing routine
-----------------------------------------------------------
local function doFishing()
    if isFishing then return end

    local rod, tier = getBestRod()

    if not rod then
        if Config.GiveStarterRod then
            Config.Notify('You do not have a rod. Requesting a basic one...', 'inform')
            local granted = lib.callback.await('qbx_fishing:server:starterRod', false)
            if not granted then
                Config.Notify('Could not get a starter rod.', 'error')
                return
            end
            rod, tier = getBestRod()
            if not rod then return end
        else
            Config.Notify('You need a fishing rod to fish.', 'error')
            return
        end
    end

    if not isNearWater() then
        Config.Notify('You need to be near water to cast.', 'error')
        return
    end

    if Config.UseBait then
        local baitCount = exports.ox_inventory:Search('count', Config.BaitItem)
        if not baitCount or baitCount < 1 then
            Config.Notify('You are out of bait.', 'error')
            return
        end
    end

    isFishing = true
    Config.Notify(('Casting with your %s...'):format(rod.label), 'inform')

    -- In-world cast throw, then settle into the idle fishing loop.
    playCastAnim()

    -- Visual NUI minigame: watch the line, wait for the bite, hook it,
    -- then fight the fish in the catch bar. Difficulty scales with rod tier.
    local result
    if Config.Minigame.enabled then
        result = runMinigame(rod, tier)
    else
        -- Fallback if the minigame is disabled in config.
        local reeled = lib.skillCheck({ 'easy', 'easy', 'medium' }, { 'w', 'a', 's', 'd' })
        result = { hooked = reeled, landed = reeled }
    end

    -- Player yanked the line in / fish took the bait and got away.
    if result.hooked then playReelAnim() end
    Wait(400)

    stopFishingAnim()
    isFishing = false

    if not result.hooked then
        Config.Notify('You missed the bite - the fish stole your bait!', 'error')
        return
    end

    if not result.landed then
        Config.Notify('The line snapped - the fish got away!', 'error')
        return
    end

    -- Server resolves loot + rod upgrade (authoritative & anti-cheat).
    TriggerServerEvent('qbx_fishing:server:catch', rod.item)
end

-----------------------------------------------------------
-- Command + keybind to start fishing
-----------------------------------------------------------
RegisterCommand('fish', function()
    doFishing()
end, false)

lib.addKeybind({
    name = 'startfishing',
    description = 'Cast fishing line',
    defaultKey = 'F5',
    onReleased = function()
        doFishing()
    end,
})

-----------------------------------------------------------
-- FISH MERCHANT: ped, blip, target, sell menu
-----------------------------------------------------------
local function openSellMenu()
    local inventory = exports.ox_inventory:Search('slots', '') or {}
    local options, total, anyFish = {}, 0, false

    for _, slot in ipairs(inventory) do
        local fish = Config.Fish[slot.name]
        if fish and fish.price > 0 then
            anyFish = true
            local lineTotal = fish.price * slot.count
            total = total + lineTotal
            options[#options + 1] = {
                title = ('%s x%d'):format(fish.label, slot.count),
                description = ('$%d each  •  $%d total'):format(fish.price, lineTotal),
                icon = 'fish',
            }
        end
    end

    if not anyFish then
        Config.Notify('You have no fish to sell.', 'error')
        return
    end

    table.insert(options, 1, {
        title = ('Sell Everything ($%d)'):format(total),
        description = 'Sell all sellable fish in your inventory',
        icon = 'sack-dollar',
        onSelect = function()
            TriggerServerEvent('qbx_fishing:server:sellAll')
        end,
    })

    lib.registerContext({
        id = 'qbx_fishing_sell',
        title = 'Fish Merchant',
        options = options,
    })
    lib.showContext('qbx_fishing_sell')
end

CreateThread(function()
    local m = Config.Merchant

    -- Blip
    if m.blip.enabled then
        local blip = AddBlipForCoord(m.coords.x, m.coords.y, m.coords.z)
        SetBlipSprite(blip, m.blip.sprite)
        SetBlipColour(blip, m.blip.color)
        SetBlipScale(blip, m.blip.scale)
        SetBlipAsShortRange(blip, true)
        BeginTextCommandSetBlipName('STRING')
        AddTextComponentSubstringPlayerName(m.blip.label)
        EndTextCommandSetBlipName(blip)
    end

    -- Ped
    lib.requestModel(m.model)
    local ped = CreatePed(4, m.model, m.coords.x, m.coords.y, m.coords.z - 1.0, m.coords.w, false, true)
    FreezeEntityPosition(ped, true)
    SetEntityInvincible(ped, true)
    SetBlockingOfNonTemporaryEvents(ped, true)
    if m.scenario then TaskStartScenarioInPlace(ped, m.scenario, 0, true) end

    -- Target
    exports.ox_target:addLocalEntity(ped, {
        {
            name = 'qbx_fishing_sell',
            icon = 'fa-solid fa-fish',
            label = 'Sell Fish',
            onSelect = openSellMenu,
            distance = 2.5,
        },
    })
end)
