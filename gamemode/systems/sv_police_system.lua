--[[
    City Underground - Server Police Engine
    Server-authoritative law enforcement, restraints, jail sentences, citations, and MDT records.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Police = CityUnderground.Police or {}
CityUnderground.Police.Warrants = CityUnderground.Police.Warrants or {}
CityUnderground.Police.Citations = CityUnderground.Police.Citations or {}
CityUnderground.Police.DispatchCalls = CityUnderground.Police.DispatchCalls or {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Police_ToggleDuty")
    util.AddNetworkString("CU_Police_Handcuff")
    util.AddNetworkString("CU_Police_SearchSuspect")
    util.AddNetworkString("CU_Police_SuspectInv")
    util.AddNetworkString("CU_Police_Confiscate")
    util.AddNetworkString("CU_Police_IssueCitation")
    util.AddNetworkString("CU_Police_Arrest")
    util.AddNetworkString("CU_Police_DispatchAlert")
    util.AddNetworkString("CU_Police_SyncMDT")
end

-- Broadcast 911 Dispatch Alert to all police officers
function CityUnderground.Police.BroadcastAlert(message)
    local alertData = {
        id = "call_" .. os.time(),
        timestamp = os.time(),
        message = message
    }
    table.insert(CityUnderground.Police.DispatchCalls, 1, alertData)

    if not player or not player.GetAll then return end
    for _, ply in ipairs(player.GetAll()) do
        local char = CityUnderground.Character.GetActive(ply)
        if char and char.job == "police" then
            if net and net.Start then
                net.Start("CU_Police_DispatchAlert")
                net.WriteString(message)
                net.Send(ply)
            end
        end
    end
end

-- Toggle Police Duty
function CityUnderground.Police.ToggleDuty(ply)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    if char.job == "police" then
        char.job = "citizen"
        if ply.SetModel then ply:SetModel(char.model or "models/player/citizen_01.mdl") end
    else
        char.job = "police"
        if ply.SetModel then ply:SetModel("models/player/police.mdl") end
        CityUnderground.Inventory.AddItem(ply, "handcuffs", 1)
    end

    CityUnderground.Character.SyncStats(ply)
end

-- Handcuff Suspect
function CityUnderground.Police.HandcuffSuspect(copPly, targetPly)
    local copChar = CityUnderground.Character.GetActive(copPly)
    local targetChar = CityUnderground.Character.GetActive(targetPly)

    if not copChar or copChar.job ~= "police" or not targetChar then return end

    -- Verify distance <= 120
    if copPly:GetPos():DistToSqr(targetPly:GetPos()) > (120 * 120) then return end

    targetChar.isHandcuffed = not targetChar.isHandcuffed
    CityUnderground.Character.SyncStats(targetPly)
end

-- Arrest Suspect and Teleport to Jail Cell
function CityUnderground.Police.ArrestSuspect(copPly, targetPly, minutes, reason)
    local copChar = CityUnderground.Character.GetActive(copPly)
    local targetChar = CityUnderground.Character.GetActive(targetPly)

    if not copChar or copChar.job ~= "police" or not targetChar then return end

    -- Confiscate contraband
    CityUnderground.Crime.ConfiscateIllegalItems(targetPly)

    minutes = math.Clamp(tonumber(minutes) or 3, 1, 10)
    targetChar.jailTimeRemaining = minutes * 60
    targetChar.isHandcuffed = false

    -- Teleport to jail cell
    if targetPly.SetPos then
        targetPly:SetPos(Vector(CityUnderground.Police.JailCellPosition.x, CityUnderground.Police.JailCellPosition.y, CityUnderground.Police.JailCellPosition.z))
    end

    -- Log citation / arrest in MDT
    table.insert(CityUnderground.Police.Citations, {
        timestamp = os.time(),
        officer = copChar.firstName .. " " .. copChar.lastName,
        suspect = targetChar.firstName .. " " .. targetChar.lastName,
        charges = reason or "Contraband Offense",
        jailMinutes = minutes
    })

    CityUnderground.Character.SyncStats(targetPly)
end

-- Jail sentence countdown heartbeat (Runs every 5 seconds)
if timer and timer.Create then
    timer.Create("CU_PoliceJailTimerHeartbeat", 5, 0, function()
        if not player or not player.GetAll then return end
        for _, ply in ipairs(player.GetAll()) do
            local char = CityUnderground.Character.GetActive(ply)
            if char and (char.jailTimeRemaining or 0) > 0 then
                char.jailTimeRemaining = math.max(0, char.jailTimeRemaining - 5)
                
                -- Sentence completed: Release player to precinct lobby
                if char.jailTimeRemaining <= 0 then
                    if ply.SetPos then
                        ply:SetPos(Vector(CityUnderground.Police.JailReleasePosition.x, CityUnderground.Police.JailReleasePosition.y, CityUnderground.Police.JailReleasePosition.z))
                    end
                end
                CityUnderground.Character.SyncStats(ply)
            end
        end
    end)
end

-- Network handlers
if net and net.Receive then
    net.Receive("CU_Police_ToggleDuty", function(len, ply)
        CityUnderground.Police.ToggleDuty(ply)
    end)

    net.Receive("CU_Police_IssueCitation", function(len, ply)
        local suspectCharId = net.ReadString()
        local code = net.ReadString()
        local fine = net.ReadInt(32)

        local copChar = CityUnderground.Character.GetActive(ply)
        if not copChar or copChar.job ~= "police" then return end

        for _, p in ipairs(player.GetAll()) do
            local sChar = CityUnderground.Character.GetActive(p)
            if sChar and sChar.id == suspectCharId then
                CityUnderground.Economy.TakeBank(p, fine, "Police Citation: " .. code)
                break
            end
        end
    end)
end
