local TurfStates = {}
local ZoneOccupants = {}
local BusinessDataFile = "businesses.json"
local DynamicBusinesses = {}

-- Load Saved Businesses from JSON
local function LoadBusinesses()
    local fileContent = LoadResourceFile(GetCurrentResourceName(), BusinessDataFile)
    if fileContent and fileContent ~= "" then
        DynamicBusinesses = json.decode(fileContent) or {}
    else
        DynamicBusinesses = {}
    end

    -- Merge Config.Zones with Dynamic Businesses
    for zoneId, zone in pairs(Config.Zones) do
        if not DynamicBusinesses[zoneId] then
            DynamicBusinesses[zoneId] = zone
        else
            DynamicBusinesses[zoneId].label = zone.label or DynamicBusinesses[zoneId].label
            DynamicBusinesses[zoneId].coords = zone.coords or DynamicBusinesses[zoneId].coords
            DynamicBusinesses[zoneId].radius = zone.radius or DynamicBusinesses[zoneId].radius
            DynamicBusinesses[zoneId].passiveReward = zone.passiveReward or DynamicBusinesses[zoneId].passiveReward
            DynamicBusinesses[zoneId].blip = zone.blip or DynamicBusinesses[zoneId].blip
        end
    end

    -- Initialize Turf States with Protection Rep
    for zoneId, zone in pairs(DynamicBusinesses) do
        if not TurfStates[zoneId] then
            TurfStates[zoneId] = {
                owner = zone.owner or "Unclaimed",
                ownerIdentifier = zone.ownerIdentifier or nil,
                protectionRep = zone.protectionRep or 25, -- Base Protection Rep (0 - 100)
                progress = 0,
                capturingIdentifier = nil,
                capturingName = nil,
                isContested = false,
                lastPayout = os.time()
            }
        end
        ZoneOccupants[zoneId] = ZoneOccupants[zoneId] or {}
    end
end

-- Save Dynamic Businesses
local function SaveBusinesses()
    SaveResourceFile(GetCurrentResourceName(), BusinessDataFile, json.encode(DynamicBusinesses, { indent = true }), -1)
end

-- Initialize on resource start
AddEventHandler('onResourceStart', function(res)
    if res == GetCurrentResourceName() then
        LoadBusinesses()
    end
end)

-- Helper: Check if Player is Admin
local function IsPlayerAdmin(src)
    if IsPlayerAceAllowed(src, "command") or IsPlayerAceAllowed(src, "admin") then
        return true
    end
    if exports.qbx_core then
        local player = exports.qbx_core:GetPlayer(src)
        if player and (player.PlayerData.optin or player.PlayerData.group == "admin") then
            return true
        end
    end
    return false
end

-- Helper: Get Player Crew/Gang Name or Character Name
local function GetPlayerCrewOrName(src)
    if exports.qbx_core then
        local player = exports.qbx_core:GetPlayer(src)
        if player and player.PlayerData then
            if player.PlayerData.gang and player.PlayerData.gang.name ~= "none" then
                return player.PlayerData.gang.label or player.PlayerData.gang.name, player.PlayerData.gang.name
            end
            local charName = (player.PlayerData.charinfo.firstname .. " " .. player.PlayerData.charinfo.lastname)
            return charName, player.PlayerData.citizenid
        end
    elseif exports['qb-core'] then
        local player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if player and player.PlayerData then
            if player.PlayerData.gang and player.PlayerData.gang.name ~= "none" then
                return player.PlayerData.gang.label or player.PlayerData.gang.name, player.PlayerData.gang.name
            end
            local charName = (player.PlayerData.charinfo.firstname .. " " .. player.PlayerData.charinfo.lastname)
            return charName, player.PlayerData.citizenid
        end
    end

    local name = GetPlayerName(src) or ("Player #" .. src)
    local id = GetPlayerIdentifier(src, 0) or tostring(src)
    return name, id
end

-- Helper: Add Cash
local function AddMoney(src, amount)
    if exports.ox_inventory then
        return exports.ox_inventory:AddItem(src, 'money', amount)
    elseif exports['qb-core'] then
        local player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if player then player.Functions.AddMoney('cash', amount) end
    end
end

-- Helper: Inventory Helpers
local function GetItemCount(src, item)
    if exports.ox_inventory then
        return exports.ox_inventory:GetItemCount(src, item) or 0
    elseif exports['qb-core'] then
        local player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if not player then return 0 end
        local itm = player.Functions.GetItemByName(item)
        return itm and itm.amount or 0
    end
    return 0
end

local function RemoveItem(src, item, count)
    if exports.ox_inventory then
        return exports.ox_inventory:RemoveItem(src, item, count)
    elseif exports['qb-core'] then
        local player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if not player then return false end
        return player.Functions.RemoveItem(item, count)
    end
    return false
end

local PlayerActiveZone = {}
local PlayerLastZoneEventTime = {}

-- Player Enters Turf Zone
RegisterNetEvent('standalone_turfs:sv:enterZone', function(zoneId)
    local src = source
    if not DynamicBusinesses[zoneId] then return end

    local now = GetGameTimer()
    if PlayerLastZoneEventTime[src] and (now - PlayerLastZoneEventTime[src]) < 200 then
        return -- Debounce rapid duplicate client calls
    end
    PlayerLastZoneEventTime[src] = now

    -- Clear from previous active zone if any
    local prevZone = PlayerActiveZone[src]
    if prevZone and ZoneOccupants[prevZone] then
        ZoneOccupants[prevZone][src] = nil
    end

    PlayerActiveZone[src] = zoneId
    ZoneOccupants[zoneId] = ZoneOccupants[zoneId] or {}
    ZoneOccupants[zoneId][src] = true

    SyncTurfHUD(src, zoneId)
end)

-- Player Leaves Turf Zone
RegisterNetEvent('standalone_turfs:sv:leaveZone', function(zoneId)
    local src = source
    if ZoneOccupants[zoneId] then
        ZoneOccupants[zoneId][src] = nil
    end
    if PlayerActiveZone[src] == zoneId then
        PlayerActiveZone[src] = nil
    end
end)

-- Clean up on player drop
AddEventHandler('playerDropped', function()
    local src = source
    local prevZone = PlayerActiveZone[src]
    if prevZone and ZoneOccupants[prevZone] then
        ZoneOccupants[prevZone][src] = nil
    end
    PlayerActiveZone[src] = nil
    PlayerLastZoneEventTime[src] = nil
end)

-- Request All Active Businesses for Client Sync
RegisterNetEvent('standalone_turfs:sv:requestZones', function()
    local src = source
    TriggerClientEvent('standalone_turfs:cl:syncAllZones', src, DynamicBusinesses)
end)

-- ==============================================================================
-- PROTECTION REP, STAND-ON DEFENSE & OVER-STANDING SEIZURE LOOP (Runs every 1s)
-- ==============================================================================
CreateThread(function()
    while true do
        Wait(1000)
        for zoneId, occupants in pairs(ZoneOccupants) do
            local zoneCfg = DynamicBusinesses[zoneId]
            local state = TurfStates[zoneId]

            if zoneCfg and state then
                local defenderCount = 0
                local rivalCount = 0
                local lastRivalSrc = nil
                local lastDefSrc = nil

                -- Classify occupants into Defenders vs Rivals
                for src, _ in pairs(occupants) do
                    if GetPlayerPing(src) > 0 then
                        local _, crewId = GetPlayerCrewOrName(src)
                        if state.ownerIdentifier and crewId == state.ownerIdentifier then
                            defenderCount = defenderCount + 1
                            lastDefSrc = src
                        else
                            rivalCount = rivalCount + 1
                            lastRivalSrc = src
                        end
                    else
                        occupants[src] = nil
                    end
                end

                local maxCapTime = zoneCfg.captureTime or Config.DefaultCaptureTime or 45

                -- Scenario A: Defenders standing on their own premise (Building Protection Rep: 5 mins per 1 point)
                if defenderCount > 0 and rivalCount == 0 then
                    state.isContested = false
                    state.progress = maxCapTime
                    state.drainTime = 0

                    -- Accumulate defending seconds (e.g. 300s = 5 minutes per 1 Rep point)
                    state.defendTime = (state.defendTime or 0) + 1
                    local repInterval = Config.RepGainIntervalSeconds or 300

                    if state.defendTime >= repInterval then
                        state.defendTime = 0
                        if (state.protectionRep or 0) < 100 then
                            state.protectionRep = math.min(100, (state.protectionRep or 0) + 1)
                        end
                    end
                -- Scenario B: Rivals standing on premise without defenders (Draining Rep & Seizing)
                elseif rivalCount > 0 and defenderCount == 0 then
                    local rivalName, rivalId = GetPlayerCrewOrName(lastRivalSrc)
                    state.defendTime = 0

                    -- If business still has Protection Rep shield, drain it over time!
                    if state.ownerIdentifier and (state.protectionRep or 0) > 0 then
                        state.isContested = true
                        state.drainTime = (state.drainTime or 0) + (1 * rivalCount)
                        local drainInterval = Config.RepDrainIntervalSeconds or 180

                        if state.drainTime >= drainInterval then
                            state.drainTime = 0
                            state.protectionRep = math.max(0, (state.protectionRep or 0) - 1)
                        end
                    else
                        -- Protection Rep is 0 or unowned: advance rival capture timer
                        state.isContested = false
                        if state.capturingIdentifier ~= rivalId then
                            state.capturingIdentifier = rivalId
                            state.capturingName = rivalName
                            state.progress = 0
                        end

                        state.progress = state.progress + (1 * rivalCount)

                        -- Seizure complete! Rivals take over the business!
                        if state.progress >= maxCapTime then
                            state.owner = rivalName
                            state.ownerIdentifier = rivalId
                            state.protectionRep = 20 -- Initial Rep upon seizure
                            state.progress = maxCapTime
                            state.capturingIdentifier = nil
                            state.defendTime = 0
                            state.drainTime = 0

                            TriggerClientEvent('ox_lib:notify', -1, {
                                title = 'Business Seized!',
                                description = string.format('%s stood on the premise and seized %s!', rivalName, zoneCfg.label),
                                type = 'error'
                            })
                        end
                    end
                -- Scenario C: Both Defenders & Rivals on premise (Active Conflict)
                elseif defenderCount > 0 and rivalCount > 0 then
                    state.isContested = true
                else
                    -- Scenario D: Nobody in zone (Slow passive rep decay if below baseline)
                    state.isContested = false
                    if state.protectionRep > 50 then
                        -- Decay very slowly when unmanned
                        if math.random(1, 40) == 1 then
                            state.protectionRep = state.protectionRep - 1
                        end
                    end
                end

                -- Broadcast live HUD update to occupants
                for src, _ in pairs(occupants) do
                    SyncTurfHUD(src, zoneId)
                end
            end
        end
    end
end)

-- ==============================================================================
-- PASSIVE REVENUE LOOP (AUTOMATICALLY ACCUMULATES VAULT CASH & PROCESSES BANK TIES)
-- ==============================================================================
CreateThread(function()
    while true do
        Wait((Config.PassiveRewardInterval or 60) * 1000)
        local allPlayers = GetPlayers()

        for zoneId, state in pairs(TurfStates) do
            local zoneCfg = DynamicBusinesses[zoneId]
            if state and zoneCfg and state.ownerIdentifier and zoneCfg.passiveReward then
                -- Calculate Rep Multiplier: 0% Rep = 1.0x, 100% Rep = 2.0x, Purchased Deed = 2.5x
                local repMultiplier = 1.0 + ((state.protectionRep or 0) / 100.0)
                if state.isPurchased then
                    repMultiplier = math.max(repMultiplier, Config.PurchasedRevenueMultiplier or 2.5)
                end

                -- Supply Chain Calculation: 100% Supplies = +35% Boost, 0% Supplies = -60% Penalty
                state.supplies = state.supplies or Config.DefaultSupplies or 100
                state.supplies = math.max(0, state.supplies - (Config.SupplyDecayPerPayout or 4))

                local supplyMultiplier = 1.0
                if state.supplies >= 80 then
                    supplyMultiplier = Config.FullSupplyBonusMultiplier or 1.35
                elseif state.supplies <= 0 then
                    supplyMultiplier = Config.ZeroSupplyPenaltyMultiplier or 0.4
                end

                local basePayout = (zoneCfg.passiveReward and zoneCfg.passiveReward.amount) or 150
                local totalPayout = math.floor(basePayout * repMultiplier * supplyMultiplier)

                -- Accumulate cash into the business on-site vault
                state.vaultCash = (state.vaultCash or 0) + totalPayout

                -- Check if Bank Connection is currently active and within valid periodic duration
                local isBankActive = (state.bankConnectionExpires and state.bankConnectionExpires > os.time())

                -- Pay online players directly if Bank Connection is active
                for _, srcStr in ipairs(allPlayers) do
                    local src = tonumber(srcStr)
                    if src and GetPlayerPing(src) > 0 then
                        local _, crewId = GetPlayerCrewOrName(src)
                        if crewId == state.ownerIdentifier then
                            local isOnPremise = (ZoneOccupants[zoneId] and ZoneOccupants[zoneId][src])

                            if isBankActive then
                                -- Direct wire transfer because bank connection is active!
                                local wirePayout = math.floor(totalPayout * 0.75)
                                AddMoney(src, wirePayout)
                                
                                local minsLeft = math.ceil((state.bankConnectionExpires - os.time()) / 60)
                                local note = string.format('+$%d Direct Wire from %s (Supplies: %d%% • Bank Ties: %dm left 🏦)', wirePayout, zoneCfg.label, state.supplies, minsLeft)
                                TriggerClientEvent('ox_lib:notify', src, {
                                    title = '🏦 Direct Bank Wire Paid',
                                    description = note,
                                    type = 'success'
                                })
                            else
                                -- Connection expired or not established: Remind owner to deliver vault cash to bank
                                if isOnPremise then
                                    TriggerClientEvent('ox_lib:notify', src, {
                                        title = '💼 Bank Run Required',
                                        description = string.format('$%d cash accumulated in vault. Bank ties expired—deliver cash to renew connection!', state.vaultCash),
                                        type = 'inform'
                                    })
                                end
                            end
                        end
                    end
                end

                -- Passively harvest crafting materials into business vault
                state.materials = state.materials or { wood = 20, iron = 15, copper = 10, plastic = 15, steel = 8, gunpowder = 6, rubber = 5, aluminum = 4, electronic_kit = 2 }
                local zIdLower = zoneId:lower()
                if zIdLower:find("chop") or zIdLower:find("auto") or zIdLower:find("garage") then
                    state.materials.iron = (state.materials.iron or 0) + math.random(1, 3)
                    state.materials.steel = (state.materials.steel or 0) + math.random(1, 2)
                    state.materials.rubber = (state.materials.rubber or 0) + 1
                    state.materials.copper = (state.materials.copper or 0) + 1
                elseif zIdLower:find("warehouse") or zIdLower:find("dock") or zIdLower:find("port") or zIdLower:find("sawmill") or zIdLower:find("lumber") then
                    state.materials.wood = (state.materials.wood or 0) + math.random(2, 4)
                    state.materials.aluminum = (state.materials.aluminum or 0) + math.random(1, 2)
                    state.materials.plastic = (state.materials.plastic or 0) + math.random(1, 3)
                    if math.random(1, 3) == 1 then
                        state.materials.electronic_kit = (state.materials.electronic_kit or 0) + 1
                    end
                elseif zIdLower:find("weed") or zIdLower:find("dispensary") or zIdLower:find("chemical") then
                    state.materials.plastic = (state.materials.plastic or 0) + math.random(1, 3)
                    state.materials.gunpowder = (state.materials.gunpowder or 0) + math.random(1, 2)
                else
                    state.materials.wood = (state.materials.wood or 0) + 1
                    state.materials.iron = (state.materials.iron or 0) + 1
                    state.materials.plastic = (state.materials.plastic or 0) + 1
                    state.materials.copper = (state.materials.copper or 0) + 1
                end

                -- Sync HUD
                for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do
                    SyncTurfHUD(occSrc, zoneId)
                end
            end
        end
    end
end)

local ActiveRobberies = {}
local RobberyCooldowns = {}
local ActiveBankRuns = {}
local ActiveRestockRuns = {}
local ActiveVIPRuns = {}
local ActiveGunRuns = {}
local ActiveB2BRuns = {}
local ZoneActiveJobs = {}

local function GetZoneActiveJobsCount(zoneId)
    return ZoneActiveJobs[zoneId] or 0
end

local function ModifyZoneActiveJobs(zoneId, delta)
    ZoneActiveJobs[zoneId] = math.max(0, (ZoneActiveJobs[zoneId] or 0) + delta)
end

function SyncTurfHUD(src, zoneId)
    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]
    if not zoneCfg or not state then return end

    local repMultiplier = 1.0 + ((state.protectionRep or 0) / 100.0)
    if state.isPurchased then
        repMultiplier = math.max(repMultiplier, Config.PurchasedRevenueMultiplier or 2.5)
    end

    local basePayout = (zoneCfg.passiveReward and zoneCfg.passiveReward.amount) or 150
    local projectedPayout = math.floor(basePayout * repMultiplier)

    local buyPrice = zoneCfg.buyPrice or (basePayout * 80) or Config.DefaultBuyPrice or 25000
    local canBuy = (state.protectionRep >= 100 and not state.isPurchased)

    local activeRobbery = ActiveRobberies[zoneId]
    local isRobbing = (activeRobbery ~= nil)
    local robSeconds = isRobbing and activeRobbery.remaining or 0
    local robTotal = isRobbing and activeRobbery.duration or (Config.RobberyDuration or 35)

    local cooldownRemaining = 0
    if RobberyCooldowns[zoneId] and RobberyCooldowns[zoneId] > os.time() then
        cooldownRemaining = RobberyCooldowns[zoneId] - os.time()
    end

    local _, crewId = GetPlayerCrewOrName(src)
    local isOwner = (state.ownerIdentifier and crewId == state.ownerIdentifier)
    local vaultCash = state.vaultCash or 0

    local repInterval = Config.RepGainIntervalSeconds or 300
    local repGainRemaining = repInterval - (state.defendTime or 0)
    local isEarningRep = (isOwner and (state.protectionRep or 0) < 100 and not state.isContested)

    local curJobs = GetZoneActiveJobsCount(zoneId)
    local maxJobs = Config.MaxConcurrentJobsPerBusiness or 2

    TriggerClientEvent('standalone_turfs:cl:syncTurfHUD', src, {
        zoneId = zoneId,
        label = zoneCfg.label,
        owner = state.owner,
        ownerCrewTag = state.owner or "Unclaimed",
        protectorCrewTag = state.owner or "None",
        protectionRep = state.protectionRep or 0,
        repMultiplier = repMultiplier,
        projectedPayout = projectedPayout,
        progress = state.progress,
        isCapturing = (state.capturingIdentifier ~= nil and state.progress < (zoneCfg.captureTime or 45)),
        isContested = state.isContested,
        captureTime = zoneCfg.captureTime or 45,
        isPurchased = state.isPurchased or false,
        canBuy = canBuy,
        buyPrice = buyPrice,
        isRobbing = isRobbing,
        robSeconds = robSeconds,
        robTotal = robTotal,
        cooldownRemaining = cooldownRemaining,
        isRobber = (isRobbing and activeRobbery.robber == src),
        vaultCash = vaultCash,
        bankConnected = isBankActive,
        bankSecondsRemaining = bankSecondsRemaining,
        canBankRun = canBankRun,
        isOwner = isOwner,
        supplies = state.supplies or 100,
        guardLevel = state.guardLevel or 0,
        isEarningRep = isEarningRep,
        repGainRemaining = math.max(0, repGainRemaining),
        repGainTotal = repInterval,
        activeJobs = curJobs,
        maxJobs = maxJobs,
        graffitiTags = state.graffitiTags or 0,
        isHacked = state.isHacked or false,
        contrabandRisk = state.contrabandRisk or 0,
        importsCount = state.importsCompleted or 0,
        exportsCount = state.exportsCompleted or 0,
        tradeVolume = state.totalTradeVolume or 0,
        materials = state.materials or { iron = 15, copper = 10, plastic = 15, steel = 8, gunpowder = 6, rubber = 5, aluminum = 4, electronic_kit = 2 }
    })
end

-- ==============================================================================
-- BANK MONEY RUN & CONNECTION ESTABLISHMENT EVENTS
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:startBankRun', function(zoneId)
    local src = source
    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]

    if not zoneCfg or not state then return end

    local _, crewId = GetPlayerCrewOrName(src)
    if state.ownerIdentifier and crewId ~= state.ownerIdentifier then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Unauthorized',
            description = 'Only the assigned business owner or crew members can initiate bank cash deliveries!',
            type = 'error'
        })
        return
    end

    local cashToDeliver = math.max(1500, state.vaultCash or 0)

    -- Pick the closest bank dropoff location or default to Pacific Standard / Legion
    local dropoffKey = 'maze_legion'
    local dropoffData = Config.BankDropoffLocations[dropoffKey] or {
        label = "Maze Bank Branch",
        coords = vec3(149.95, -1040.59, 29.37)
    }

    ActiveBankRuns[src] = {
        zoneId = zoneId,
        cash = cashToDeliver,
        dropoffKey = dropoffKey,
        startTime = os.time()
    }

    TriggerClientEvent('standalone_turfs:cl:startBankRun', src, {
        zoneId = zoneId,
        businessLabel = zoneCfg.label,
        cash = cashToDeliver,
        dropoff = dropoffData,
        dropoffKey = dropoffKey
    })

    TriggerClientEvent('ox_lib:notify', src, {
        title = '💼 Bank Run Started!',
        description = string.format('Transport $%s cash bag to %s to establish official bank connection!', string.format("%d", cashToDeliver), dropoffData.label),
        type = 'inform'
    })
end)

RegisterNetEvent('standalone_turfs:sv:completeBankDropoff', function(zoneId, dropoffKey)
    local src = source
    local runData = ActiveBankRuns[src]

    if not runData or runData.zoneId ~= zoneId then
        TriggerClientEvent('ox_lib:notify', src, { title = 'No Active Run', description = 'You do not have an active money delivery run.', type = 'error' })
        return
    end

    ActiveBankRuns[src] = nil

    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]

    local baseCash = runData.cash or 1500
    local bonusPercent = Config.BankRunBonusPercent or 20
    local finalPayout = math.floor(baseCash * (1.0 + (bonusPercent / 100.0)))

    -- Deposit money
    AddMoney(src, finalPayout)

    -- Establish Periodic Bank Connection & Award Protection Rep
    if state then
        local duration = Config.BankConnectionDuration or 1200
        state.bankConnectionExpires = os.time() + duration
        state.bankConnected = true
        state.vaultCash = 0
        local repBonus = Config.BankRunRepAward or 15
        state.protectionRep = math.min(100, (state.protectionRep or 0) + repBonus)

        if zoneCfg then
            zoneCfg.bankConnected = true
        end
        SaveBusinesses()
    end

    TriggerClientEvent('standalone_turfs:cl:finishBankRun', src)

    -- Global / Player Success Announcement
    local minsDuration = math.floor((Config.BankConnectionDuration or 1200) / 60)
    TriggerClientEvent('ox_lib:notify', src, {
        title = '🏦 Bank Connection Active!',
        description = string.format('Delivered $%d cash to the vault! Bank connection renewed for %d minutes (+%d%% Laundering Bonus & +%d%% Rep)!', finalPayout, minsDuration, bonusPercent, (Config.BankRunRepAward or 15)),
        type = 'success'
    })

    -- Sync HUD
    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do
        SyncTurfHUD(occSrc, zoneId)
    end
end)

-- ==============================================================================
-- 1. RESTOCKING CARGO SUPPLY RUNS (BRINGS SUPPLIES TO 100% + CASH & REP)
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:startRestockRun', function(zoneId, depotKey)
    local src = source
    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]
    if not zoneCfg or not state then return end

    local _, crewId = GetPlayerCrewOrName(src)
    if state.ownerIdentifier and crewId ~= state.ownerIdentifier then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Unauthorized', description = 'Only business owners can initiate cargo restocking runs.', type = 'error' })
        return
    end

    depotKey = depotKey or 'ls_docks'
    local depot = Config.RestockPickupLocations[depotKey] or Config.RestockPickupLocations['ls_docks']

    ActiveRestockRuns[src] = {
        zoneId = zoneId,
        depotKey = depotKey,
        depot = depot,
        businessCoords = zoneCfg.coords
    }

    TriggerClientEvent('standalone_turfs:cl:startRestockRun', src, {
        zoneId = zoneId,
        businessLabel = zoneCfg.label,
        depotKey = depotKey,
        depot = depot,
        businessCoords = zoneCfg.coords
    })

    TriggerClientEvent('ox_lib:notify', src, {
        title = '📦 Restock Mission Started',
        description = 'Drive to ' .. depot.label .. ' to collect raw supply crates!',
        type = 'inform'
    })
end)

RegisterNetEvent('standalone_turfs:sv:completeRestockRun', function(zoneId, depotKey)
    local src = source
    local runData = ActiveRestockRuns[src]

    if not runData or runData.zoneId ~= zoneId then
        TriggerClientEvent('ox_lib:notify', src, { title = 'No Active Run', description = 'You do not have an active cargo supply run.', type = 'error' })
        return
    end

    ActiveRestockRuns[src] = nil

    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]
    local depot = runData.depot or Config.RestockPickupLocations['ls_docks']

    local cashReward = depot.rewardCash or 3000
    local repReward = depot.rewardRep or 10

    AddMoney(src, cashReward)

    if state then
        state.supplies = 100 -- Fully restocked!
        state.protectionRep = math.min(100, (state.protectionRep or 0) + repReward)
        SaveBusinesses()
    end

    TriggerClientEvent('standalone_turfs:cl:finishRestockRun', src)

    TriggerClientEvent('ox_lib:notify', src, {
        title = '📦 Restock Complete!',
        description = string.format('Supplies replenished to 100%% (+35%% Yield Boost)! Earned +$%d cash & +%d%% Rep.', cashReward, repReward),
        type = 'success'
    })

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do
        SyncTurfHUD(occSrc, zoneId)
    end
end)

-- ==============================================================================
-- 2. VIP CONTRABAND SMUGGLE DELIVERY RUNS
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:startVIPRun', function(zoneId, vipKey)
    local src = source
    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]
    if not zoneCfg or not state then return end

    local _, crewId = GetPlayerCrewOrName(src)
    if state.ownerIdentifier and crewId ~= state.ownerIdentifier then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Unauthorized', description = 'Only business owners can initiate VIP smuggle drops.', type = 'error' })
        return
    end

    vipKey = vipKey or 'pacific_bluffs'
    local vipData = Config.VIPSmuggleLocations[vipKey] or Config.VIPSmuggleLocations['pacific_bluffs']

    ActiveVIPRuns[src] = {
        zoneId = zoneId,
        vipKey = vipKey,
        vipData = vipData,
        startTime = os.time()
    }

    TriggerClientEvent('standalone_turfs:cl:startVIPRun', src, {
        zoneId = zoneId,
        businessLabel = zoneCfg.label,
        vipKey = vipKey,
        vipData = vipData
    })

    TriggerClientEvent('ox_lib:notify', src, {
        title = '⚡ VIP Smuggle Run Started',
        description = 'Rush high-grade product to ' .. vipData.label .. ' before the timer expires!',
        type = 'inform'
    })
end)

RegisterNetEvent('standalone_turfs:sv:completeVIPRun', function(zoneId, vipKey)
    local src = source
    local runData = ActiveVIPRuns[src]

    if not runData or runData.zoneId ~= zoneId then
        TriggerClientEvent('ox_lib:notify', src, { title = 'No Active Run', description = 'You do not have an active VIP delivery.', type = 'error' })
        return
    end

    ActiveVIPRuns[src] = nil

    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]
    local vipData = runData.vipData or Config.VIPSmuggleLocations['pacific_bluffs']

    local cashReward = vipData.rewardCash or 11500
    local repReward = vipData.rewardRep or 25

    AddMoney(src, cashReward)

    if state then
        state.protectionRep = math.min(100, (state.protectionRep or 0) + repReward)
        SaveBusinesses()
    end

    TriggerClientEvent('standalone_turfs:cl:finishVIPRun', src)

    TriggerClientEvent('ox_lib:notify', src, {
        title = '💰 VIP Delivery Success!',
        description = string.format('Delivered product to the VIP! Earned +$%d cash & +%d%% Protection Rep.', cashReward, repReward),
        type = 'success'
    })

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do
        SyncTurfHUD(occSrc, zoneId)
    end
end)

-- ==============================================================================
-- 3. SECURITY GUARD UPGRADES
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:upgradeSecurity', function(zoneId, level)
    local src = source
    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]
    if not zoneCfg or not state then return end

    local _, crewId = GetPlayerCrewOrName(src)
    if state.ownerIdentifier and crewId ~= state.ownerIdentifier then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Unauthorized', description = 'Only the owner can hire security.', type = 'error' })
        return
    end

    local guardCfg = Config.GuardUpgrades[level]
    if not guardCfg then return end

    local cost = guardCfg.cost or 5000
    if GetMoney(src) >= cost then
        if RemoveMoney(src, cost) then
            state.guardLevel = level
            SaveBusinesses()

            TriggerClientEvent('ox_lib:notify', src, {
                title = '🛡️ Security Hired!',
                description = 'Successfully hired ' .. guardCfg.name .. ' for ' .. zoneCfg.label .. '!',
                type = 'success'
            })

            for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do
                SyncTurfHUD(occSrc, zoneId)
            end
        end
    else
        TriggerClientEvent('ox_lib:notify', src, { title = 'Insufficient Funds', description = 'You need $' .. cost .. ' to hire this guard detail.', type = 'error' })
    end
end)

-- ==============================================================================
-- BUSINESS HEIST & ROBBERY EVENT HANDLERS
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:startRobbery', function(zoneId)
    local src = source
    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]

    if not zoneCfg or not state then return end

    -- Check if robbery is already active
    if ActiveRobberies[zoneId] then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Robbery Active',
            description = 'A heist is already in progress on this business safe!',
            type = 'error'
        })
        return
    end

    -- Check Robbery Cooldown
    if RobberyCooldowns[zoneId] and RobberyCooldowns[zoneId] > os.time() then
        local minsLeft = math.ceil((RobberyCooldowns[zoneId] - os.time()) / 60)
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Vault Empty',
            description = string.format('This business safe was recently cleaned out. Cooldown: %d min(s) remaining.', minsLeft),
            type = 'error'
        })
        return
    end

    -- Check if player is the actual owner (Owners can't rob their own business)
    local _, crewId = GetPlayerCrewOrName(src)
    if state.ownerIdentifier and crewId == state.ownerIdentifier then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Own Property',
            description = 'You cannot rob your own business! Defend it instead.',
            type = 'error'
        })
        return
    end

    local duration = Config.RobberyDuration or 35
    ActiveRobberies[zoneId] = {
        robber = src,
        duration = duration,
        remaining = duration
    }

    -- Notify Robber
    TriggerClientEvent('ox_lib:notify', src, {
        title = '🚨 Robbery Initiated!',
        description = string.format('Cracking the safe at %s! Stay in the zone for %ds.', zoneCfg.label, duration),
        type = 'inform'
    })

    -- Alert the Business Owner / Gang if online
    if state.ownerIdentifier then
        for _, pSrcStr in ipairs(GetPlayers()) do
            local pSrc = tonumber(pSrcStr)
            if pSrc and GetPlayerPing(pSrc) > 0 then
                local _, pCrewId = GetPlayerCrewOrName(pSrc)
                if pCrewId == state.ownerIdentifier then
                    TriggerClientEvent('ox_lib:notify', pSrc, {
                        title = '🚨 RED ALERT: BUSINESS ROBBERY!',
                        description = string.format('Your commercial business %s is being ROBBED! Rush to defend it!', zoneCfg.label),
                        type = 'error'
                    })
                end
            end
        end
    end

    -- Start 1-Second Robbery Countdown Loop
    CreateThread(function()
        while ActiveRobberies[zoneId] do
            Wait(1000)
            local robData = ActiveRobberies[zoneId]
            if not robData then break end

            local robberSrc = robData.robber

            -- Check if robber is still alive and inside the zone
            if GetPlayerPing(robberSrc) <= 0 or not ZoneOccupants[zoneId] or not ZoneOccupants[zoneId][robberSrc] then
                -- Robber fled or died
                ActiveRobberies[zoneId] = nil
                TriggerClientEvent('ox_lib:notify', robberSrc, {
                    title = 'Robbery Failed',
                    description = 'You fled the business premise! Robbery aborted.',
                    type = 'error'
                })
                for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do
                    SyncTurfHUD(occSrc, zoneId)
                end
                break
            end

            robData.remaining = robData.remaining - 1

            -- Broadcast updated HUD
            for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do
                SyncTurfHUD(occSrc, zoneId)
            end

            -- Robbery Success!
            if robData.remaining <= 0 then
                ActiveRobberies[zoneId] = nil

                local minCash = Config.RobberyMinCash or 3000
                local maxCash = Config.RobberyMaxCash or 8500
                local stolenCash = math.random(minCash, maxCash)

                -- Give Cash
                AddMoney(robberSrc, stolenCash)

                -- Chance for Contraband Bonus Loot
                local lootPool = Config.RobberyBonusLoot or { "weed_baggy", "coke_brick" }
                local bonusItem = lootPool[math.random(#lootPool)]
                if exports.ox_inventory then
                    exports.ox_inventory:AddItem(robberSrc, bonusItem, 1)
                end

                -- Damage Business Protection Rep
                local repDamage = Config.RobberyRepDamage or 40
                state.protectionRep = math.max(0, (state.protectionRep or 0) - repDamage)

                -- Set Cooldown (10 minutes)
                RobberyCooldowns[zoneId] = os.time() + (Config.RobberyCooldown or 600)

                TriggerClientEvent('ox_lib:notify', robberSrc, {
                    title = '💰 HEIST SUCCESSFUL!',
                    description = string.format('You cracked the vault at %s and looted $%d cash + bonus contraband!', zoneCfg.label, stolenCash),
                    type = 'success'
                })

                -- Global server notification
                TriggerClientEvent('ox_lib:notify', -1, {
                    title = '💥 Commercial Safe Cracked!',
                    description = string.format('%s safe was robbed of $%d cash! (Business Defense Damaged: -%d%% Rep)', zoneCfg.label, stolenCash, repDamage),
                    type = 'error'
                })

                for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do
                    SyncTurfHUD(occSrc, zoneId)
                end
                break
            end
        end
    end)
end)

-- Buy Business Deed Event (Available once player reaches 100% Protection Rep!)
RegisterNetEvent('standalone_turfs:sv:buyBusiness', function(zoneId)
    local src = source
    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]

    if not zoneCfg or not state then return end

    if (state.protectionRep or 0) < 100 then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Reputation Insufficient',
            description = 'You must defend the premise and reach 100% Full Protection Rep before acquiring the official title deed!',
            type = 'error'
        })
        return
    end

    if state.isPurchased then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Already Purchased',
            description = 'This business title deed has already been officially claimed!',
            type = 'inform'
        })
        return
    end

    local basePayout = (zoneCfg.passiveReward and zoneCfg.passiveReward.amount) or 150
    local buyPrice = zoneCfg.buyPrice or (basePayout * 80) or Config.DefaultBuyPrice or 25000

    -- Check player funds
    local currentMoney = GetItemCount(src, 'money')
    if currentMoney < buyPrice then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Insufficient Funds',
            description = string.format('You need $%s cash to purchase the official deed to %s.', string.format("%d", buyPrice), zoneCfg.label),
            type = 'error'
        })
        return
    end

    if RemoveItem(src, 'money', buyPrice) then
        local crewName, crewId = GetPlayerCrewOrName(src)
        state.isPurchased = true
        state.deedOwner = crewName
        state.owner = crewName
        state.ownerIdentifier = crewId
        state.protectionRep = 100

        zoneCfg.owner = crewName
        zoneCfg.ownerIdentifier = crewId
        zoneCfg.isPurchased = true

        SaveBusinesses()
        TriggerClientEvent('standalone_turfs:cl:syncAllZones', -1, DynamicBusinesses)

        -- Global server announcement
        TriggerClientEvent('ox_lib:notify', -1, {
            title = '👑 Commercial Property Purchased!',
            description = string.format('%s has officially acquired the permanent Title Deed to %s ($%d)!', crewName, zoneCfg.label, buyPrice),
            type = 'success'
        })

        -- Broadcast HUD update
        for occupantSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do
            SyncTurfHUD(occupantSrc, zoneId)
        end
    end
end)

-- ==============================================================================
-- ADMIN BUSINESS CREATOR COMMANDS & NUI CALLBACKS
-- ==============================================================================

-- Open Admin Business Creator NUI
RegisterCommand('createbusiness', function(source, args)
    local src = source
    if src > 0 and not IsPlayerAdmin(src) then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Access Denied', description = 'You do not have developer/admin permissions.', type = 'error' })
        return
    end

    local ped = GetPlayerPed(src)
    local coords = GetEntityCoords(ped)

    TriggerClientEvent('standalone_turfs:cl:openAdminCreator', src, {
        coords = { x = coords.x, y = coords.y, z = coords.z },
        existingBusinesses = DynamicBusinesses
    })
end, false)

RegisterCommand('businessadmin', function(source, args)
    ExecuteCommand('createbusiness')
end, false)

-- Save / Deploy New Business from Admin UI
RegisterNetEvent('standalone_turfs:sv:deployBusiness', function(data)
    local src = source
    if src > 0 and not IsPlayerAdmin(src) then return end

    local zoneId = tostring(data.id or ("biz_" .. os.time()))
    local label = data.label or "New Business Front"
    local payoutAmount = tonumber(data.payout) or 200
    local captureTime = tonumber(data.captureTime) or 45
    local radius = tonumber(data.radius) or 18.0
    local owner = data.owner or "Unclaimed"
    local ownerIdentifier = (owner ~= "Unclaimed") and owner or nil

    DynamicBusinesses[zoneId] = {
        label = label,
        coords = vec3(data.coords.x, data.coords.y, data.coords.z),
        radius = radius,
        captureTime = captureTime,
        passiveReward = { item = "money", amount = payoutAmount },
        color = { r = 46, g = 196, b = 182, a = 120 },
        blip = { sprite = 378, color = 2, scale = 0.8, label = "Business: " .. label },
        owner = owner,
        ownerIdentifier = ownerIdentifier
    }

    TurfStates[zoneId] = {
        owner = owner,
        ownerIdentifier = ownerIdentifier,
        protectionRep = 50,
        progress = captureTime,
        capturingIdentifier = nil,
        capturingName = nil,
        isContested = false,
        lastPayout = os.time()
    }
    ZoneOccupants[zoneId] = {}

    SaveBusinesses()
    TriggerClientEvent('standalone_turfs:cl:syncAllZones', -1, DynamicBusinesses)
    TriggerClientEvent('ox_lib:notify', src, {
        title = 'Business Deployed!',
        description = string.format('Successfully registered %s ($%d/min, %dm radius)', label, payoutAmount, radius),
        type = 'success'
    })
end)

-- Request Admin Creator UI
RegisterNetEvent('standalone_turfs:sv:requestAdminCreator', function()
    local src = source
    if src > 0 and not IsPlayerAdmin(src) then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Access Denied', description = 'You do not have developer/admin permissions.', type = 'error' })
        return
    end

    local ped = GetPlayerPed(src)
    local coords = GetEntityCoords(ped)

    TriggerClientEvent('standalone_turfs:cl:openAdminCreator', src, {
        coords = { x = coords.x, y = coords.y, z = coords.z },
        existingBusinesses = DynamicBusinesses
    })
end)

-- Delete Business Event from NUI
RegisterNetEvent('standalone_turfs:sv:deleteBusiness', function(zoneId)
    local src = source
    if src > 0 and not IsPlayerAdmin(src) then return end

    if zoneId and DynamicBusinesses[zoneId] then
        local label = DynamicBusinesses[zoneId].label or zoneId
        DynamicBusinesses[zoneId] = nil
        TurfStates[zoneId] = nil
        ZoneOccupants[zoneId] = nil

        SaveBusinesses()
        TriggerClientEvent('standalone_turfs:cl:syncAllZones', -1, DynamicBusinesses)
        TriggerClientEvent('ox_lib:notify', src, { title = 'Building Deleted', description = 'Successfully deleted ' .. label, type = 'inform' })
    end
end)

-- Delete Business Command
RegisterCommand('deletebusiness', function(source, args)
    local src = source
    if src > 0 and not IsPlayerAdmin(src) then return end

    local zoneId = args[1]
    if not zoneId or not DynamicBusinesses[zoneId] then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Invalid ID', description = 'Usage: /deletebusiness [zoneId]', type = 'error' })
        return
    end

    DynamicBusinesses[zoneId] = nil
    TurfStates[zoneId] = nil
    ZoneOccupants[zoneId] = nil

    SaveBusinesses()
    TriggerClientEvent('standalone_turfs:cl:syncAllZones', -1, DynamicBusinesses)
    TriggerClientEvent('ox_lib:notify', src, { title = 'Business Deleted', description = 'Removed business ' .. zoneId, type = 'inform' })
end, false)

-- Corner Drug Selling
RegisterNetEvent('standalone_turfs:sv:findBuyer', function(currentZoneId)
    local src = source
    local availableDrugs = {}
    for drugKey, drugInfo in pairs(Config.Drugs) do
        if GetItemCount(src, drugKey) > 0 then
            table.insert(availableDrugs, drugKey)
        end
    end

    if #availableDrugs == 0 then
        TriggerClientEvent('ox_lib:notify', src, { title = 'No Product', description = 'You have no drugs in your pockets to sell!', type = 'error' })
        return
    end

    local chosenDrug = availableDrugs[math.random(#availableDrugs)]
    local drugInfo = Config.Drugs[chosenDrug]
    local basePrice = math.random(drugInfo.minPrice, drugInfo.maxPrice)

    local isTurfBonus = false
    if currentZoneId and TurfStates[currentZoneId] then
        local _, crewId = GetPlayerCrewOrName(src)
        if TurfStates[currentZoneId].ownerIdentifier == crewId then
            basePrice = math.floor(basePrice * (Config.TurfBonusMultiplier or 1.35))
            isTurfBonus = true
        end
    end

    TriggerClientEvent('standalone_turfs:cl:spawnBuyer', src, chosenDrug, basePrice, isTurfBonus)
end)

RegisterNetEvent('standalone_turfs:sv:completeSale', function(drugKey, price, isTurfBonus)
    local src = source
    local drugInfo = Config.Drugs[drugKey]
    if not drugInfo then return end

    if GetItemCount(src, drugKey) > 0 then
        if RemoveItem(src, drugKey, 1) then
            AddMoney(src, price)
            local msg = string.format('Sold %s for $%d cash!', drugInfo.label, price)
            if isTurfBonus then
                msg = string.format('Sold %s for $%d cash! (Includes Turf Dominance Bonus 👑)', drugInfo.label, price)
            end
            TriggerClientEvent('ox_lib:notify', src, { title = 'Handshake Complete', description = msg, type = 'success' })

            if math.random(1, 100) <= (Config.CopAlertChance or 18) then
                TriggerClientEvent('standalone_turfs:cl:policeAlert', src)
            end
        end
    end
end)

-- Admin Quick Cheats & System Overrides
RegisterNetEvent('standalone_turfs:sv:adminCheat', function(zoneId, cheatType)
    local src = source
    if src > 0 and not IsPlayerAdmin(src) then return end

    local state = zoneId and TurfStates[zoneId]
    local zoneCfg = zoneId and DynamicBusinesses[zoneId]

    if cheatType == 'max_rep' then
        if state then
            state.protectionRep = 100
            SaveBusinesses()
            TriggerClientEvent('ox_lib:notify', src, { title = 'Admin Cheat', description = 'Set Protection Rep to 100% (Fortress)!', type = 'success' })
            for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
        end
    elseif cheatType == 'max_supplies' then
        if state then
            state.supplies = 100
            SaveBusinesses()
            TriggerClientEvent('ox_lib:notify', src, { title = 'Admin Cheat', description = 'Refilled Raw Supplies to 100% (+35% Boost)!', type = 'success' })
            for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
        end
    elseif cheatType == 'add_vault_cash' then
        if state then
            state.vaultCash = (state.vaultCash or 0) + 10000
            SaveBusinesses()
            TriggerClientEvent('ox_lib:notify', src, { title = 'Admin Cheat', description = 'Added $10,000 to business vault!', type = 'success' })
            for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
        end
    elseif cheatType == 'force_robbery' then
        if zoneId then
            TriggerEvent('standalone_turfs:sv:startRobbery', zoneId)
            TriggerClientEvent('ox_lib:notify', src, { title = 'Admin Cheat', description = 'Force triggered vault safe heist on ' .. (zoneCfg and zoneCfg.label or zoneId), type = 'inform' })
        end
    end
end)

-- ==============================================================================
-- 6. ANTI-VANDALISM (GRAFFITI) & DATA TERMINAL HACKING
-- ==============================================================================
-- Usable Spray Can Item Registrations
CreateThread(function()
    if exports.qbx_core then
        exports.qbx_core:CreateUseableItem('spray_can', function(source)
            TriggerClientEvent('standalone_turfs:cl:useSprayCan', source)
        end)
        exports.qbx_core:CreateUseableItem('graffiti_spraycan', function(source)
            TriggerClientEvent('standalone_turfs:cl:useSprayCan', source)
        end)
    elseif exports['qb-core'] then
        local QBCore = exports['qb-core']:GetCoreObject()
        QBCore.Functions.CreateUseableItem('spray_can', function(source)
            TriggerClientEvent('standalone_turfs:cl:useSprayCan', source)
        end)
        QBCore.Functions.CreateUseableItem('graffiti_spraycan', function(source)
            TriggerClientEvent('standalone_turfs:cl:useSprayCan', source)
        end)
    end
end)

RegisterCommand('givespray', function(source, args)
    local src = source
    if src > 0 and not IsPlayerAdmin(src) then return end
    local target = tonumber(args[1]) or src
    if exports.ox_inventory then
        exports.ox_inventory:AddItem(target, 'spray_can', 1)
    elseif exports['qb-core'] then
        local p = exports['qb-core']:GetCoreObject().Functions.GetPlayer(target)
        if p then p.Functions.AddItem('spray_can', 1) end
    end
    TriggerClientEvent('ox_lib:notify', target, { title = 'Graffiti Spray Can', description = 'Acquired Graffiti Spray Can! Use it to tag rival walls and lower rep.', type = 'success' })
end, false)

RegisterNetEvent('standalone_turfs:sv:tagGraffiti', function(zoneId)
    local src = source
    local state = TurfStates[zoneId]
    local zoneCfg = DynamicBusinesses[zoneId]
    if not state or not zoneCfg then return end

    local playerName, playerId = GetPlayerCrewOrName(src)
    if state.ownerIdentifier and state.ownerIdentifier == playerId then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Vandalism Denied', description = 'You cannot vandalize your own property!', type = 'error' })
        return
    end

    state.graffitiTags = (state.graffitiTags or 0) + 1
    local repDmg = Config.GraffitiRepDamage or 15
    state.protectionRep = math.max(0, (state.protectionRep or 0) - repDmg)
    SaveBusinesses()

    TriggerClientEvent('ox_lib:notify', src, {
        title = '🎨 Graffiti Tagged!',
        description = string.format('Spray painted gang tag on %s! (-%d%% Protection Rep)', zoneCfg.label, repDmg),
        type = 'success'
    })

    TriggerClientEvent('standalone_turfs:cl:showUIPopup', src, {
        title = "🎨 GRAFFITI SPRAYED",
        description = string.format("Tagged %s with rival gang art! Lowered protection rep by -%d%%.", zoneCfg.label, repDmg),
        type = "inform",
        badge = "TAGGED",
        icon = "fa-spray-can"
    })

    -- Alert defenders online
    for _, ply in ipairs(GetPlayers()) do
        local pSrc = tonumber(ply)
        if pSrc then
            local _, cId = GetPlayerCrewOrName(pSrc)
            if cId == state.ownerIdentifier then
                TriggerClientEvent('ox_lib:notify', pSrc, {
                    title = '🚨 Property Vandalized!',
                    description = string.format('Rivals spray painted %s! Clean the tag to restore Protection Rep.', zoneCfg.label),
                    type = 'error'
                })
                TriggerClientEvent('standalone_turfs:cl:showUIPopup', pSrc, {
                    title = "🚨 RED ALERT: VANDALISM",
                    description = string.format("Rivals tagged %s! Protection Rep reduced by -%d%%. Scrub the wall to restore rep!", zoneCfg.label, repDmg),
                    type = "error",
                    badge = "BREACH",
                    icon = "fa-spray-can"
                })
            end
        end
    end

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

RegisterNetEvent('standalone_turfs:sv:cleanGraffiti', function(zoneId)
    local src = source
    local state = TurfStates[zoneId]
    local zoneCfg = DynamicBusinesses[zoneId]
    if not state or not zoneCfg then return end

    if (state.graffitiTags or 0) <= 0 then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Clean Property', description = 'No active graffiti tags on premise!', type = 'inform' })
        return
    end

    state.graffitiTags = math.max(0, (state.graffitiTags or 0) - 1)
    state.protectionRep = math.min(100, (state.protectionRep or 0) + (Config.GraffitiCleanRewardRep or 10))
    AddMoney(src, 800)
    SaveBusinesses()

    TriggerClientEvent('ox_lib:notify', src, {
        title = '🧹 Graffiti Scrubbed!',
        description = string.format('Cleaned tag off %s. +%d%% Rep restored and earned $800 cash!', zoneCfg.label, Config.GraffitiCleanRewardRep or 10),
        type = 'success'
    })

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

RegisterNetEvent('standalone_turfs:sv:hackDataTerminal', function(zoneId)
    local src = source
    local state = TurfStates[zoneId]
    local zoneCfg = DynamicBusinesses[zoneId]
    if not state or not zoneCfg then return end

    local playerName, playerId = GetPlayerCrewOrName(src)
    if state.ownerIdentifier and state.ownerIdentifier == playerId then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Hack Denied', description = 'You cannot hack your own company servers!', type = 'error' })
        return
    end

    state.isHacked = true
    state.protectionRep = math.max(0, (state.protectionRep or 0) - (Config.DataHackRepDamage or 25))
    
    local hackBounty = 3500
    AddMoney(src, hackBounty)
    SaveBusinesses()

    TriggerClientEvent('ox_lib:notify', src, {
        title = '💻 Data Breach Successful!',
        description = string.format('Hacked %s terminal! Downloaded corporate ledger for $%d payout.', zoneCfg.label, hackBounty),
        type = 'success'
    })

    -- Alert defenders
    for _, ply in ipairs(GetPlayers()) do
        local pSrc = tonumber(ply)
        if pSrc then
            local _, cId = GetPlayerCrewOrName(pSrc)
            if cId == state.ownerIdentifier then
                TriggerClientEvent('ox_lib:notify', pSrc, {
                    title = '🚨 Corporate Data Breach!',
                    description = string.format('Security breach detected at %s! Dividends frozen until firewall is rebooted.', zoneCfg.label),
                    type = 'error'
                })
            end
        end
    end

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

RegisterNetEvent('standalone_turfs:sv:rebootTerminal', function(zoneId)
    local src = source
    local state = TurfStates[zoneId]
    local zoneCfg = DynamicBusinesses[zoneId]
    if not state or not zoneCfg then return end

    state.isHacked = false
    state.protectionRep = math.min(100, (state.protectionRep or 0) + 15)
    SaveBusinesses()

    TriggerClientEvent('ox_lib:notify', src, {
        title = '🛡️ Firewall Rebooted',
        description = string.format('Restored %s corporate servers and cybersecurity encryption.', zoneCfg.label),
        type = 'success'
    })

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

-- ==============================================================================
-- 7. CONTRABAND STASH RISK & TITLE DEED FORFEITURE RAIDS
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:toggleContrabandStash', function(zoneId, hasContraband)
    local src = source
    local state = TurfStates[zoneId]
    if not state then return end

    state.contrabandRisk = hasContraband and 100 or 0
    SaveBusinesses()

    local msg = hasContraband and "⚠️ Stored illicit narcotics on site! Business is now vulnerable to Raids & Title Forfeiture." or "✅ Cleared contraband from premise. Legitimate title deed is 100% safe."
    TriggerClientEvent('ox_lib:notify', src, {
        title = 'Contraband Vault Status',
        description = msg,
        type = hasContraband and 'error' or 'success'
    })

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

RegisterNetEvent('standalone_turfs:sv:raidContrabandBusiness', function(zoneId)
    local src = source
    local state = TurfStates[zoneId]
    local zoneCfg = DynamicBusinesses[zoneId]
    if not state or not zoneCfg then return end

    local playerName, playerId = GetPlayerCrewOrName(src)
    if state.ownerIdentifier and state.ownerIdentifier == playerId then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Raid Denied', description = 'You cannot raid your own operation!', type = 'error' })
        return
    end

    -- Check if Contraband is stored on site
    if (state.contrabandRisk or 0) > 0 then
        -- ILLICIT NARCOTICS DISCOVERED! FORFEIT BUSINESS DEED!
        local formerOwner = state.owner
        state.isPurchased = false
        state.owner = "Unclaimed"
        state.ownerIdentifier = nil
        state.protectionRep = 15
        state.contrabandRisk = 0
        state.vaultCash = 0
        SaveBusinesses()

        AddMoney(src, 15000)

        TriggerClientEvent('ox_lib:notify', -1, {
            title = '🚨 BUSINESS DEED FORFEITED!',
            description = string.format('Contraband seized at %s! Former owner %s lost their title deed due to illegal drug storage. Rewarded $%d!', zoneCfg.label, formerOwner, 15000),
            type = 'error'
        })
    else
        -- Clean Operation! Legitimate Deed is Protected!
        TriggerClientEvent('ox_lib:notify', src, {
            title = '🛡️ Clean Legitimate Business',
            description = string.format('Raid failed! %s holds a legitimate commercial license with 0 illicit contraband. Deed remains secure.', zoneCfg.label),
            type = 'inform'
        })
    end

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

-- ==============================================================================
-- 8. CORPORATE FLEET REGISTRY & VEHICLE SPAWNER
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:buyCompanyFleet', function(zoneId, vehicleKey)
    local src = source
    local state = TurfStates[zoneId]
    local preset = Config.CompanyFleetPresets[vehicleKey]
    if not state or not preset then return end

    local vCash = state.vaultCash or 0
    if vCash < preset.price then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Insufficient Vault Cash', description = string.format('Need $%d in company vault (have $%d).', preset.price, vCash), type = 'error' })
        return
    end

    state.vaultCash = vCash - preset.price
    state.fleet = state.fleet or {}

    local plate = "CORP" .. math.random(100, 999)
    table.insert(state.fleet, {
        model = preset.model,
        label = preset.label,
        plate = plate,
        stored = true
    })
    SaveBusinesses()

    TriggerClientEvent('ox_lib:notify', src, {
        title = '🚗 Fleet Vehicle Acquired!',
        description = string.format('Purchased %s under business entity (Plate: %s). Employees can now spawn it!', preset.label, plate),
        type = 'success'
    })

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

-- ==============================================================================
-- 9. DISTRICT REAL ESTATE INVESTMENT & DIVIDENDS
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:investInDistrict', function(fromZoneId, targetZoneId, amount)
    local src = source
    local fromState = TurfStates[fromZoneId]
    local targetState = TurfStates[targetZoneId]
    local targetCfg = DynamicBusinesses[targetZoneId]

    if not fromState or not targetState or not targetCfg then return end

    amount = tonumber(amount) or 0
    if amount < (Config.MinInvestment or 5000) then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Invalid Investment', description = string.format('Minimum investment is $%d.', Config.MinInvestment or 5000), type = 'error' })
        return
    end

    local vCash = fromState.vaultCash or 0
    if vCash < amount then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Insufficient Vault Funds', description = string.format('Need $%d in vault (have $%d).', amount, vCash), type = 'error' })
        return
    end

    fromState.vaultCash = vCash - amount
    fromState.investments = fromState.investments or {}
    fromState.investments[targetZoneId] = (fromState.investments[targetZoneId] or 0) + amount
    SaveBusinesses()

    TriggerClientEvent('ox_lib:notify', src, {
        title = '📈 Real Estate Portfolio Expanded',
        description = string.format('Invested $%d in %s! Earning %d%% passive dividends every cycle while secure.', amount, targetCfg.label, Config.DividendRatePercent or 8),
        type = 'success'
    })

    for occSrc, _ in pairs(ZoneOccupants[fromZoneId] or {}) do SyncTurfHUD(occSrc, fromZoneId) end
end)

-- ==============================================================================
-- 10. HIRING JOB BOARD & CUSTOM QUEST DISPATCHER
-- ==============================================================================
local GlobalJobBoard = {}

RegisterNetEvent('standalone_turfs:sv:postJobQuest', function(zoneId, jobType, title, bounty)
    local src = source
    local state = TurfStates[zoneId]
    local zoneCfg = DynamicBusinesses[zoneId]
    if not state or not zoneCfg then return end

    bounty = tonumber(bounty) or 2500
    local vCash = state.vaultCash or 0
    if vCash < bounty then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Insufficient Funds', description = string.format('Need $%d in vault to fund job bounty.', bounty), type = 'error' })
        return
    end

    state.vaultCash = vCash - bounty
    local jobId = "job_" .. os.time() .. "_" .. math.random(10, 99)
    local jobObj = {
        id = jobId,
        sponsorZone = zoneId,
        sponsorLabel = zoneCfg.label,
        jobType = jobType,
        title = title or (Config.JobTypes[jobType] and Config.JobTypes[jobType].label) or "Commercial Run",
        bounty = bounty,
        status = "available",
        claimedBy = nil
    }

    table.insert(GlobalJobBoard, jobObj)
    SaveBusinesses()

    TriggerClientEvent('ox_lib:notify', src, {
        title = '💼 Job Posted on Board',
        description = string.format('Posted "%s" for $%d bounty! Freelancers and crew can now accept it.', jobObj.title, bounty),
        type = 'success'
    })

    TriggerClientEvent('standalone_turfs:cl:syncJobBoard', -1, GlobalJobBoard)
    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

RegisterNetEvent('standalone_turfs:sv:claimJobQuest', function(jobId)
    local src = source
    local pName, pId = GetPlayerCrewOrName(src)

    for _, job in ipairs(GlobalJobBoard) do
        if job.id == jobId and job.status == "available" then
            job.status = "in_progress"
            job.claimedBy = src
            job.claimedName = pName

            TriggerClientEvent('ox_lib:notify', src, {
                title = '💼 Job Accepted!',
                description = string.format('Accepted "%s" from %s! Complete the objective to claim $%d.', job.title, job.sponsorLabel, job.bounty),
                type = 'success'
            })

            TriggerClientEvent('standalone_turfs:cl:syncJobBoard', -1, GlobalJobBoard)
            return
        end
    end
end)

RegisterNetEvent('standalone_turfs:sv:completeJobQuest', function(jobId)
    local src = source
    for idx, job in ipairs(GlobalJobBoard) do
        if job.id == jobId and job.claimedBy == src then
            AddMoney(src, job.bounty)

            local sponsorState = TurfStates[job.sponsorZone]
            if sponsorState then
                sponsorState.protectionRep = math.min(100, (sponsorState.protectionRep or 0) + 10)
                sponsorState.supplies = math.min(100, (sponsorState.supplies or 0) + 25)
                SaveBusinesses()
            end

            TriggerClientEvent('ox_lib:notify', src, {
                title = '⭐ Job Complete & Paid!',
                description = string.format('Successfully delivered contract! Paid $%d bounty.', job.bounty),
                type = 'success'
            })

            table.remove(GlobalJobBoard, idx)
            TriggerClientEvent('standalone_turfs:cl:syncJobBoard', -1, GlobalJobBoard)
            return
        end
    end
end)

-- Fetch Job Board Callback
RegisterNetEvent('standalone_turfs:sv:getJobBoard', function()
    local src = source
    TriggerClientEvent('standalone_turfs:cl:syncJobBoard', src, GlobalJobBoard)
end)

-- ==============================================================================
-- 11. DIRTY GUN RUNS (BLACK MARKET ARMS SMUGGLING)
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:startGunRun', function(zoneId, gunKey)
    local src = source
    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]
    if not zoneCfg or not state then return end

    if (ZoneActiveJobs[zoneId] or 0) >= (Config.MaxConcurrentJobsPerBusiness or 2) then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Job Limit Reached (2 Max)', description = 'This business already has 2 active runs in progress!', type = 'error' })
        return
    end

    gunKey = gunKey or 'lsia_airfield'
    local gunDrop = Config.DirtyGunRuns[gunKey] or Config.DirtyGunRuns['lsia_airfield']

    ModifyZoneActiveJobs(zoneId, 1)
    ActiveGunRuns[src] = {
        zoneId = zoneId,
        gunKey = gunKey,
        drop = gunDrop
    }

    TriggerClientEvent('standalone_turfs:cl:startGunRun', src, {
        zoneId = zoneId,
        gunKey = gunKey,
        drop = gunDrop
    })

    TriggerClientEvent('ox_lib:notify', src, {
        title = '🔫 Dirty Gun Run Dispatched',
        description = 'Smuggle arms from ' .. gunDrop.label .. '! High police alert risk.',
        type = 'error'
    })

    if math.random(1, 100) <= (gunDrop.policeAlertChance or 50) then
        TriggerClientEvent('standalone_turfs:cl:policeAlert', src)
    end
end)

RegisterNetEvent('standalone_turfs:sv:completeGunRun', function(zoneId, gunKey)
    local src = source
    local runData = ActiveGunRuns[src]
    if not runData or runData.zoneId ~= zoneId then return end

    ActiveGunRuns[src] = nil
    ModifyZoneActiveJobs(zoneId, -1)

    local gunDrop = runData.drop or Config.DirtyGunRuns['lsia_airfield']
    local cash = gunDrop.rewardCash or 8500
    local rep = gunDrop.rewardRep or 20

    AddMoney(src, cash)
    if exports['ox_inventory'] then
        exports.ox_inventory:AddItem(src, gunDrop.rewardWeapon or "WEAPON_PISTOL50", 1)
    else
        GiveWeaponToPed(GetPlayerPed(src), GetHashKey(gunDrop.rewardWeapon or "WEAPON_PISTOL50"), 120, false, true)
    end

    local state = TurfStates[zoneId]
    if state then
        state.protectionRep = math.min(100, (state.protectionRep or 0) + rep)
        SaveBusinesses()
    end

    TriggerClientEvent('standalone_turfs:cl:finishGunRun', src)
    TriggerClientEvent('ox_lib:notify', src, {
        title = '🔫 Arms Smuggle Complete!',
        description = string.format('Delivered %s! Earned +$%d cash, +%d%% Rep & acquired firearm.', gunDrop.rewardWeaponLabel, cash, rep),
        type = 'success'
    })

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

-- ==============================================================================
-- 12. B2B IMPORT & EXPORT CONTRACTS
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:startB2BDeal', function(tradeKey)
    local src = source
    local trade = Config.B2BTradeDeals[tradeKey]
    if not trade then return end

    local fromZone = trade.fromZone
    if (ZoneActiveJobs[fromZone] or 0) >= (Config.MaxConcurrentJobsPerBusiness or 2) then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Job Limit Reached', description = 'Origin business has 2 active runs in progress!', type = 'error' })
        return
    end

    ModifyZoneActiveJobs(fromZone, 1)
    ActiveB2BRuns[src] = {
        tradeKey = tradeKey,
        trade = trade
    }

    local targetCfg = DynamicBusinesses[trade.toZone]
    TriggerClientEvent('standalone_turfs:cl:startB2BDeal', src, {
        tradeKey = tradeKey,
        trade = trade,
        targetCoords = targetCfg and targetCfg.coords or vec3(0,0,0)
    })

    TriggerClientEvent('ox_lib:notify', src, {
        title = '💼 B2B Trade Contract Active',
        description = 'Transporting wholesale cargo for ' .. trade.label .. '!',
        type = 'inform'
    })
end)

RegisterNetEvent('standalone_turfs:sv:completeB2BDeal', function(tradeKey)
    local src = source
    local runData = ActiveB2BRuns[src]
    if not runData or runData.tradeKey ~= tradeKey then return end

    ActiveB2BRuns[src] = nil
    local trade = runData.trade
    ModifyZoneActiveJobs(trade.fromZone, -1)

    local payout = trade.payout or 4500
    local supplies = trade.suppliesAward or 35

    AddMoney(src, payout)

    local fromState = TurfStates[trade.fromZone]
    if fromState then
        fromState.supplies = math.min(100, (fromState.supplies or 0) + supplies)
        fromState.protectionRep = math.min(100, (fromState.protectionRep or 0) + 10)
        SaveBusinesses()
    end

    TriggerClientEvent('standalone_turfs:cl:finishB2BDeal', src)
    TriggerClientEvent('ox_lib:notify', src, {
        title = '💼 B2B Trade Delivered!',
        description = string.format('Contract complete! Earned +$%d cash and delivered +%d%% supplies.', payout, supplies),
        type = 'success'
    })

    for occSrc, _ in pairs(ZoneOccupants[trade.fromZone] or {}) do SyncTurfHUD(occSrc, trade.fromZone) end
end)

-- ==============================================================================
-- 13. MUNCHIES MOBILE WEED TRUCK STREET TRAVEL & TAKEOVER DISPATCH
-- ==============================================================================
local ActiveTruckDispatches = {}

RegisterNetEvent('standalone_turfs:sv:requestTruckToStreet', function(zoneId)
    local src = source
    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]
    if not zoneCfg or not state then return end

    local _, crewId = GetPlayerCrewOrName(src)
    if state.ownerIdentifier and crewId ~= state.ownerIdentifier then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Unauthorized', description = 'Only the business owner can request the weed selling truck!', type = 'error' })
        return
    end

    if ActiveTruckDispatches[zoneId] and ActiveTruckDispatches[zoneId] > os.time() then
        local minsLeft = math.ceil((ActiveTruckDispatches[zoneId] - os.time()) / 60)
        TriggerClientEvent('ox_lib:notify', src, { title = 'Truck Active', description = string.format('Weed selling truck is already active on this street! (%d mins remaining)', minsLeft), type = 'inform' })
        return
    end

    ActiveTruckDispatches[zoneId] = os.time() + (15 * 60)

    TriggerClientEvent('standalone_turfs:cl:dispatchTruckToStreet', src, {
        zoneId = zoneId,
        label = zoneCfg.label,
        coords = zoneCfg.coords
    })

    TriggerClientEvent('standalone_turfs:cl:showUIPopup', -1, {
        title = "🍦 MUNCHIES TRUCK DISPATCHED",
        description = "Mobile Weed Selling Truck is traveling to " .. zoneCfg.label .. "! +50% street sales surge active.",
        type = "success",
        badge = "SURGE",
        icon = "fa-truck"
    })
end)

RegisterNetEvent('standalone_turfs:sv:truckArrivedAtStreet', function(zoneId)
    local zoneCfg = DynamicBusinesses[zoneId]
    local state = TurfStates[zoneId]
    if not zoneCfg or not state then return end

    state.streetSurgeExpires = os.time() + (15 * 60)
    state.protectionRep = math.min(100, (state.protectionRep or 0) + 15)
    SaveBusinesses()

    TriggerClientEvent('standalone_turfs:cl:showUIPopup', -1, {
        title = "🍦 MUNCHIES TRUCK ARRIVED",
        description = "Mobile Weed Dispensary arrived at " .. zoneCfg.label .. "! Corner selling & +50% Revenue Surge active.",
        type = "success",
        badge = "ACTIVE",
        icon = "fa-ice-cream"
    })

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

-- ==============================================================================
-- 14. ARMS & ITEMS CRAFTING WORKBENCH SERVER HANDLERS
-- ==============================================================================
RegisterNetEvent('standalone_turfs:sv:craftItem', function(zoneId, recipeKey)
    local src = source
    local state = TurfStates[zoneId]
    local zoneCfg = DynamicBusinesses[zoneId]
    local recipe = Config.CraftingRecipes[recipeKey]

    if not state or not zoneCfg or not recipe then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Crafting Error', description = 'Invalid blueprint or business premise.', type = 'error' })
        return
    end

    local currentRep = state.protectionRep or 0
    if currentRep < (recipe.repRequired or 0) then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Reputation Required',
            description = string.format('Requires %d%% Protection Rep (Current: %d%%). Upgrade defenses to craft this blueprint!', recipe.repRequired, currentRep),
            type = 'error'
        })
        return
    end

    state.materials = state.materials or { iron = 0, copper = 0, plastic = 0, steel = 0, gunpowder = 0, rubber = 0, aluminum = 0, electronic_kit = 0 }

    -- Verify materials (from business stash and player inventory)
    local missingMaterials = {}
    for _, mat in ipairs(recipe.materials) do
        local inVault = state.materials[mat.item] or 0
        local inPlayer = GetItemCount(src, mat.item)
        local totalAvailable = inVault + inPlayer

        if totalAvailable < mat.amount then
            table.insert(missingMaterials, string.format("%dx %s (Have %d)", mat.amount, mat.label or mat.item, totalAvailable))
        end
    end

    if #missingMaterials > 0 then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'Missing Materials',
            description = 'Need: ' .. table.concat(missingMaterials, ', '),
            type = 'error'
        })
        return
    end

    -- Deduct materials (vault first, then player inventory)
    for _, mat in ipairs(recipe.materials) do
        local need = mat.amount
        local fromVault = math.min(state.materials[mat.item] or 0, need)
        state.materials[mat.item] = (state.materials[mat.item] or 0) - fromVault
        need = need - fromVault

        if need > 0 then
            if exports.ox_inventory then
                exports.ox_inventory:RemoveItem(src, mat.item, need)
            elseif exports['qb-core'] then
                local player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
                if player then player.Functions.RemoveItem(mat.item, need) end
            end
        end
    end

    SaveBusinesses()

    -- Award Crafted Item / Weapon / Ammo
    if recipe.type == "weapon" then
        if exports.ox_inventory then
            exports.ox_inventory:AddItem(src, recipe.item, 1)
        elseif exports['qb-core'] then
            local player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
            if player then player.Functions.AddItem(recipe.item, 1) end
        else
            GiveWeaponToPed(GetPlayerPed(src), GetHashKey(recipe.item), recipe.ammo or 100, false, true)
        end
    elseif recipe.type == "ammo" then
        if exports.ox_inventory then
            exports.ox_inventory:AddItem(src, recipe.item, recipe.amount or 100)
        elseif exports['qb-core'] then
            local player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
            if player then player.Functions.AddItem(recipe.item, recipe.amount or 100) end
        end
    else
        if exports.ox_inventory then
            exports.ox_inventory:AddItem(src, recipe.item, recipe.amount or 1)
        elseif exports['qb-core'] then
            local player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
            if player then player.Functions.AddItem(recipe.item, recipe.amount or 1) end
        end
    end

    TriggerClientEvent('ox_lib:notify', src, {
        title = '🛠️ Crafting Succeeded!',
        description = string.format('Successfully manufactured %s!', recipe.label),
        type = 'success'
    })

    TriggerClientEvent('standalone_turfs:cl:showUIPopup', src, {
        title = "🛠️ CRAFTING SUCCESS",
        description = string.format("Forged %s from raw materials!", recipe.label),
        type = "success",
        badge = "CRAFTED",
        icon = "fa-hammer"
    })

    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)

RegisterNetEvent('standalone_turfs:sv:depositMaterial', function(zoneId, matItem, amount)
    local src = source
    local state = TurfStates[zoneId]
    if not state or not matItem then return end

    amount = tonumber(amount) or 1
    local pCount = GetItemCount(src, matItem)
    if pCount < amount then
        TriggerClientEvent('ox_lib:notify', src, { title = 'Insufficient Items', description = 'You do not have enough of this material on you.', type = 'error' })
        return
    end

    if exports.ox_inventory then
        exports.ox_inventory:RemoveItem(src, matItem, amount)
    elseif exports['qb-core'] then
        local player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if player then player.Functions.RemoveItem(matItem, amount) end
    end

    state.materials = state.materials or {}
    state.materials[matItem] = (state.materials[matItem] or 0) + amount
    SaveBusinesses()

    TriggerClientEvent('ox_lib:notify', src, { title = 'Material Deposited', description = string.format('Stored +%dx %s in business stash.', amount, matItem), type = 'success' })
    for occSrc, _ in pairs(ZoneOccupants[zoneId] or {}) do SyncTurfHUD(occSrc, zoneId) end
end)



