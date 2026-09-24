--[[
    City Underground - Server Admin Engine
    Server-authoritative administrative moderation commands, audit logs, and player inspection.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Admin = CityUnderground.Admin or {}
CityUnderground.Admin.AuditLogs = CityUnderground.Admin.AuditLogs or {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Admin_Action")
    util.AddNetworkString("CU_Admin_InspectInv")
    util.AddNetworkString("CU_Admin_SendInv")
    util.AddNetworkString("CU_Admin_RequestLogs")
    util.AddNetworkString("CU_Admin_SendLogs")
end

-- Helper to check if player is an Admin
function CityUnderground.Admin.IsAdmin(ply, minRank)
    if not IsValid(ply) then return false end
    if ply.IsSuperAdmin and ply:IsSuperAdmin() then return true end
    if ply.IsAdmin and ply:IsAdmin() then return (minRank or 2) <= 2 end
    return false
end

function CityUnderground.Admin.LogAction(adminName, action, details)
    table.insert(CityUnderground.Admin.AuditLogs, 1, {
        timestamp = os.time(),
        admin = adminName,
        action = action,
        details = details
    })
end

-- Network handlers
if net and net.Receive then
    net.Receive("CU_Admin_Action", function(len, ply)
        if not CityUnderground.Admin.IsAdmin(ply, 1) then return end

        local cmd = net.ReadString()
        local targetSteamId = net.ReadString()
        local arg1 = net.ReadString()
        local arg2 = net.ReadString()

        local adminName = ply:Nick() or "Staff"

        if cmd == "teleport" then
            for _, targetPly in ipairs(player.GetAll()) do
                if targetPly:SteamID64() == targetSteamId or targetPly:SteamID() == targetSteamId then
                    ply:SetPos(targetPly:GetPos() + Vector(30, 30, 0))
                    CityUnderground.Admin.LogAction(adminName, "TELEPORT", "Teleported to " .. targetPly:Nick())
                    break
                end
            end
        elseif cmd == "bring" then
            for _, targetPly in ipairs(player.GetAll()) do
                if targetPly:SteamID64() == targetSteamId or targetPly:SteamID() == targetSteamId then
                    targetPly:SetPos(ply:GetPos() + Vector(30, 30, 0))
                    CityUnderground.Admin.LogAction(adminName, "BRING", "Brought " .. targetPly:Nick() .. " to staff")
                    break
                end
            end
        elseif cmd == "revive" then
            for _, targetPly in ipairs(player.GetAll()) do
                if targetPly:SteamID64() == targetSteamId or targetPly:SteamID() == targetSteamId then
                    local char = CityUnderground.Character.GetActive(targetPly)
                    if char then
                        char.health = 100
                        targetPly:SetHealth(100)
                        CityUnderground.Character.SyncStats(targetPly)
                        CityUnderground.Admin.LogAction(adminName, "REVIVE", "Revived " .. targetPly:Nick())
                    end
                    break
                end
            end
        elseif cmd == "set_money" then
            local amount = tonumber(arg1) or 0
            for _, targetPly in ipairs(player.GetAll()) do
                if targetPly:SteamID64() == targetSteamId or targetPly:SteamID() == targetSteamId then
                    local char = CityUnderground.Character.GetActive(targetPly)
                    if char then
                        char.bank = amount
                        CityUnderground.Character.SyncStats(targetPly)
                        CityUnderground.Admin.LogAction(adminName, "SET_MONEY", "Set bank of " .. targetPly:Nick() .. " to $" .. amount)
                    end
                    break
                end
            end
        end
    end)
end
