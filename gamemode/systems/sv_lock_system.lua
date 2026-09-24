--[[
    City Underground - Server Lock Management & Security Breach Logger
    Handles authoritative lock upgrades, door locking states, breach attempts, and police 911 alarms.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Locks = CityUnderground.Locks or {}
CityUnderground.Locks.DoorLocks = CityUnderground.Locks.DoorLocks or {}

if SERVER then
    util.AddNetworkString("CU_Locks_UpgradeLock")
    util.AddNetworkString("CU_Locks_AttemptPick")
    util.AddNetworkString("CU_Locks_PickResult")
    util.AddNetworkString("CU_Locks_TriggerAlarm")
end

net.Receive("CU_Locks_UpgradeLock", function(len, ply)
    local doorId = net.ReadString()
    local lockTier = net.ReadString()

    local tierDef = CityUnderground.Locks.Tiers[lockTier]
    if not tierDef then return end

    CityUnderground.Locks.DoorLocks[doorId] = {
        tier = lockTier,
        installedBy = ply:SteamID(),
        health = 100,
        isLocked = true
    }

    CityUnderground.Notify(ply, "Lock on " .. doorId .. " upgraded to " .. tierDef.name .. "!", "success")
end)

net.Receive("CU_Locks_TriggerAlarm", function(len, ply)
    local doorId = net.ReadString()
    local lockTier = net.ReadString()

    -- Broadcast alarm to police MDT and property owner
    CityUnderground.NotifyAll("🚨 SILENT ALARM TRIPPED: Unauthorized lock breach detected at " .. doorId .. "!", "error")
    
    if CityUnderground.Police and CityUnderground.Police.BroadcastDispatch then
        CityUnderground.Police.BroadcastDispatch("10-31 (Burglary in Progress - Door " .. doorId .. ")", ply:GetPos())
    end
end)
