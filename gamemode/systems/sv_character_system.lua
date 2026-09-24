--[[
    City Underground - Server Character System
    Handles character lifecycle, multi-character selection, needs decay, and spawn positioning.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Character = CityUnderground.Character or {}

local playerActiveChar = {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Char_RequestList")
    util.AddNetworkString("CU_Char_SendList")
    util.AddNetworkString("CU_Char_Create")
    util.AddNetworkString("CU_Char_Select")
    util.AddNetworkString("CU_Char_Delete")
    util.AddNetworkString("CU_Char_SyncStats")
    util.AddNetworkString("CU_Notification")
end

-- Get active character for a player
function CityUnderground.Character.GetActive(ply)
    if not IsValid(ply) then return nil end
    local steamId = ply:SteamID64() or ply:SteamID() or ply:UniqueID() or "LOCAL_PLAYER"
    return playerActiveChar[steamId]
end

-- Set active character for a player
function CityUnderground.Character.SetActive(ply, charData)
    if not IsValid(ply) then return end
    local steamId = ply:SteamID64() or ply:SteamID() or ply:UniqueID() or "LOCAL_PLAYER"
    playerActiveChar[steamId] = charData

    -- Apply model and appearance
    if charData.model and ply.SetModel then
        ply:SetModel(charData.model)
    end
    if ply.SetHealth then
        ply:SetHealth(charData.health or 100)
        ply:SetMaxHealth(100)
    end

    -- Sync to client
    CityUnderground.Character.SyncStats(ply)
end

-- Sync stats to client
function CityUnderground.Character.SyncStats(ply)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    if net and net.Start then
        net.Start("CU_Char_SyncStats")
        net.WriteTable({
            id = char.id,
            firstName = char.firstName,
            lastName = char.lastName,
            cash = char.cash,
            bank = char.bank,
            job = char.job,
            jobRank = char.jobRank,
            health = char.health,
            hunger = char.hunger,
            thirst = char.thirst,
            isHandcuffed = char.isHandcuffed,
            playtimeMinutes = char.playtimeMinutes
        })
        net.Send(ply)
    end
end

-- Network Handlers
if net and net.Receive then
    -- Request character list
    net.Receive("CU_Char_RequestList", function(len, ply)
        local steamId = ply:SteamID64() or ply:SteamID() or ply:UniqueID() or "LOCAL_PLAYER"
        local chars = CityUnderground.Persistence.LoadPlayerCharacters(steamId)
        
        net.Start("CU_Char_SendList")
        net.WriteTable(chars)
        net.Send(ply)
    end)

    -- Create new character
    net.Receive("CU_Char_Create", function(len, ply)
        local data = net.ReadTable()
        local steamId = ply:SteamID64() or ply:SteamID() or ply:UniqueID() or "LOCAL_PLAYER"
        local chars = CityUnderground.Persistence.LoadPlayerCharacters(steamId)

        local count = 0
        for _ in pairs(chars) do count = count + 1 end
        if count >= CityUnderground.Character.MaxCharactersPerPlayer then
            return
        end

        local valid, err = CityUnderground.Character.ValidateName(data.firstName, data.lastName)
        if not valid then
            return
        end

        local newChar = CityUnderground.Persistence.CreateDefaultCharacter(
            steamId,
            data.firstName,
            data.lastName,
            data.gender,
            data.model,
            data.clothingStyle
        )

        CityUnderground.Persistence.SaveCharacter(newChar)
        CityUnderground.Character.SetActive(ply, newChar)

        -- Spawning
        if ply.SetPos then
            ply:SetPos(Vector(500, 500, 10))
        end

        net.Start("CU_Char_SendList")
        net.WriteTable(CityUnderground.Persistence.LoadPlayerCharacters(steamId))
        net.Send(ply)
    end)

    -- Select existing character
    net.Receive("CU_Char_Select", function(len, ply)
        local charId = net.ReadString()
        local steamId = ply:SteamID64() or ply:SteamID() or ply:UniqueID() or "LOCAL_PLAYER"
        local chars = CityUnderground.Persistence.LoadPlayerCharacters(steamId)

        if chars[charId] then
            CityUnderground.Character.SetActive(ply, chars[charId])
            local pos = chars[charId].lastPosition or { x = 500, y = 500, z = 10 }
            if ply.SetPos then
                ply:SetPos(Vector(pos.x, pos.y, pos.z))
            end
        end
    end)

    -- Delete character
    net.Receive("CU_Char_Delete", function(len, ply)
        local charId = net.ReadString()
        local steamId = ply:SteamID64() or ply:SteamID() or ply:UniqueID() or "LOCAL_PLAYER"
        CityUnderground.Persistence.DeleteCharacter(steamId, charId)

        net.Start("CU_Char_SendList")
        net.WriteTable(CityUnderground.Persistence.LoadPlayerCharacters(steamId))
        net.Send(ply)
    end)
end

-- Player Needs Decay Heartbeat (Runs every 10 seconds)
if timer and timer.Create then
    timer.Create("CU_PlayerNeedsHeartbeat", 10, 0, function()
        if not player or not player.GetAll then return end
        for _, ply in ipairs(player.GetAll()) do
            local char = CityUnderground.Character.GetActive(ply)
            if char then
                -- Decay Hunger (-0.5% every 10s) and Thirst (-0.8% every 10s)
                char.hunger = math.Clamp((char.hunger or 100) - 0.5, 0, 100)
                char.thirst = math.Clamp((char.thirst or 100) - 0.8, 0, 100)
                
                -- Starvation or Dehydration damage
                if char.hunger <= 0 or char.thirst <= 0 then
                    char.health = math.Clamp((char.health or 100) - 2, 0, 100)
                    if ply.SetHealth then ply:SetHealth(char.health) end
                end

                char.playtimeMinutes = (char.playtimeMinutes or 0) + (10 / 60)
                CityUnderground.Character.SyncStats(ply)
            end
        end
    end)
end
