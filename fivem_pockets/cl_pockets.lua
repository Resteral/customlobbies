local isUIOpen = false
local isBusy = false
local GroundDrops = {}
local currentStats = { strength = 60, stamina = 70 }

-- Keymapping: Toggle Pockets UI (TAB)
RegisterKeyMapping('togglePockets', 'Toggle Pocket Inventory UI', 'keyboard', Config.OpenKey)
RegisterCommand('togglePockets', function()
    if isUIOpen then
        ClosePocketsUI()
    else
        OpenPocketsUI()
    end
end, false)

-- Keymapping: Quick Draw Primary Holster (H)
RegisterKeyMapping('quickDrawGun1', 'Quick Draw Primary Holster', 'keyboard', Config.QuickDrawGun1)
RegisterCommand('quickDrawGun1', function()
    if not isUIOpen and not isBusy then
        PlayDrawAnim()
        TriggerServerEvent('pocket:sv:quickDrawGun', Config.GunSlot1)
    end
end, false)

-- Keymapping: Quick Draw Secondary Holster (J)
RegisterKeyMapping('quickDrawGun2', 'Quick Draw Secondary Holster', 'keyboard', Config.QuickDrawGun2)
RegisterCommand('quickDrawGun2', function()
    if not isUIOpen and not isBusy then
        PlayDrawAnim()
        TriggerServerEvent('pocket:sv:quickDrawGun', Config.GunSlot2)
    end
end, false)

-- Draw Animation
function PlayDrawAnim()
    local ped = PlayerPedId()
    if IsPedInAnyVehicle(ped, false) then return end

    local animDict = "reaction@intimidation@1h"
    if lib and lib.requestAnimDict then
        lib.requestAnimDict(animDict, 2000)
    else
        RequestAnimDict(animDict)
        while not HasAnimDictLoaded(animDict) do Wait(10) end
    end

    TaskPlayAnim(ped, animDict, "intro", 8.0, -8.0, 800, 49, 0, false, false, false)
    Wait(400)
end

-- Open NUI UI
function OpenPocketsUI()
    local ped = PlayerPedId()
    if IsPedDeadOrDying(ped, true) or IsPedCuffed(ped) or isBusy then
        return
    end

    PlayPocketAnim(true)
    TriggerServerEvent('pocket:sv:requestPocketData')
end

-- Close NUI UI
function ClosePocketsUI()
    if not isUIOpen then return end
    isUIOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "close" })
    PlayPocketAnim(false)
end

-- Pocket Opening Animation
function PlayPocketAnim(opening)
    local ped = PlayerPedId()
    if IsPedInAnyVehicle(ped, false) then return end

    local animDict = "clothingtier@pocket_reach"
    if lib and lib.requestAnimDict then
        lib.requestAnimDict(animDict, 2000)
    else
        RequestAnimDict(animDict)
        while not HasAnimDictLoaded(animDict) do Wait(10) end
    end

    if opening then
        TaskPlayAnim(ped, animDict, "reach_pocket", 8.0, -8.0, 1000, 49, 0, false, false, false)
    else
        ClearPedTasks(ped)
    end
end

-- Qbox Player Load & Character Select Sync
RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    TriggerServerEvent('pocket:sv:requestPocketData')
end)

RegisterNetEvent('qbx_core:client:playerLoaded', function()
    TriggerServerEvent('pocket:sv:requestPocketData')
end)

-- Ground Drops Sync Handler
RegisterNetEvent('pocket:cl:syncGroundDrops', function(drops)
    GroundDrops = drops or {}
end)

-- 3D Text Helper
function DrawText3D(x, y, z, text)
    SetTextScale(0.35, 0.35)
    SetTextFont(4)
    SetTextProportional(1)
    SetTextColour(255, 255, 255, 215)
    SetTextEntry("STRING")
    SetTextCentre(true)
    AddTextComponentString(text)
    SetDrawOrigin(x, y, z, 0)
    DrawText(0.0, 0.0)
    local factor = (string.len(text)) / 370
    DrawRect(0.0, 0.0 + 0.0125, 0.015 + factor, 0.03, 0, 0, 0, 150)
    ClearDrawOrigin()
end

-- Ground Drop Loop
CreateThread(function()
    while true do
        local wait = 1000
        local ped = PlayerPedId()
        local coords = GetEntityCoords(ped)

        for dropId, dropData in pairs(GroundDrops) do
            if dropData and dropData.coords then
                local dist = #(coords - vector3(dropData.coords.x, dropData.coords.y, dropData.coords.z))
                if dist < 10.0 then
                    wait = 0
                    local itemLabel = Config.Items[dropData.item.name] and Config.Items[dropData.item.name].label or dropData.item.name
                    DrawText3D(dropData.coords.x, dropData.coords.y, dropData.coords.z + 0.2, "[E] Pick up " .. itemLabel .. " (x" .. dropData.item.amount .. ")")

                    if dist < 1.5 and IsControlJustReleased(0, 38) then
                        TriggerServerEvent('pocket:sv:pickupItem', dropId)
                    end
                end
            end
        end
        Wait(wait)
    end
end)

-- Stamina & Sprint Buff Loop
CreateThread(function()
    while true do
        Wait(1000)
        local ped = PlayerPedId()
        if IsPedSprinting(ped) or IsPedRunning(ped) then
            local staminaBonus = (currentStats.stamina or 50) / 100.0
            RestorePlayerStamina(PlayerId(), 0.2 * staminaBonus)
        end
    end
end)

-- Receive Inventory Payload & Open NUI
RegisterNetEvent('pocket:cl:receivePocketData', function(payload)
    isUIOpen = true
    if payload.stats then currentStats = payload.stats end
    SetNuiFocus(true, true)
    
    local strBonus = (currentStats.strength or 60) * Config.Stats.StrengthWeightMultiplier
    local maxCap = Config.BasePocketWeight + strBonus + (payload.hasBackpack and Config.MaxBackpackWeight or 0.0)

    SendNUIMessage({
        action = "open",
        slots = payload.slots,
        stats = currentStats,
        hasBackpack = payload.hasBackpack,
        totalWeight = payload.totalWeight,
        maxWeight = math.floor(maxCap * 10) / 10,
        equipmentConfig = Config.EquipmentSlots,
        pocketsConfig = Config.Pockets,
        itemsConfig = Config.Items
    })
end)

-- Sync Inventory Payload
RegisterNetEvent('pocket:cl:syncPockets', function(payload)
    if payload.stats then currentStats = payload.stats end
    if isUIOpen then
        local strBonus = (currentStats.strength or 60) * Config.Stats.StrengthWeightMultiplier
        local maxCap = Config.BasePocketWeight + strBonus + (payload.hasBackpack and Config.MaxBackpackWeight or 0.0)

        SendNUIMessage({
            action = "update",
            slots = payload.slots,
            stats = currentStats,
            hasBackpack = payload.hasBackpack,
            totalWeight = payload.totalWeight,
            maxWeight = math.floor(maxCap * 10) / 10
        })
    end
end)

-- NUI Callbacks
RegisterNUICallback('closeUI', function(data, cb)
    ClosePocketsUI()
    cb('ok')
end)

RegisterNUICallback('moveItem', function(data, cb)
    TriggerServerEvent('pocket:sv:moveItem', data)
    cb('ok')
end)

RegisterNUICallback('useItem', function(data, cb)
    TriggerServerEvent('pocket:sv:useItem', data.slot)
    cb('ok')
end)

RegisterNUICallback('dropItem', function(data, cb)
    local coords = GetEntityCoords(PlayerPedId())
    TriggerServerEvent('pocket:sv:dropItem', {
        slot = data.slot,
        amount = data.amount,
        coords = { x = coords.x, y = coords.y, z = coords.z }
    })
    cb('ok')
end)

-- Notification Handler
RegisterNetEvent('pocket:cl:notify', function(msg, msgType)
    if lib and lib.notify then
        lib.notify({
            description = msg,
            type = msgType or 'inform'
        })
    end
    SendNUIMessage({
        action = "notification",
        message = msg,
        type = msgType or "info"
    })
end)
