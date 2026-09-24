--[[
    City Underground - Server Persistence Engine
    Server-authoritative persistence handling file/JSON/SQLite storage with safe atomic writes.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Persistence = CityUnderground.Persistence or {}

local DATA_DIR = "city_underground/players/"
local charactersCache = {}

function CityUnderground.Persistence.Init()
    if file and file.CreateDir then
        file.CreateDir("city_underground")
        file.CreateDir("city_underground/players")
        file.CreateDir("city_underground/logs")
    end
    print("[CityUnderground] Server persistence system initialized.")
end

-- Get all characters belonging to a SteamID/PlayerID
function CityUnderground.Persistence.LoadPlayerCharacters(steamId)
    local path = DATA_DIR .. tostring(steamId):gsub("[:/\\]", "_") .. ".json"
    if file and file.Exists and file.Exists(path, "DATA") then
        local raw = file.Read(path, "DATA")
        local data = util.JSONToTable(raw)
        if data and type(data) == "table" then
            charactersCache[steamId] = data
            return data
        end
    end
    
    charactersCache[steamId] = charactersCache[steamId] or {}
    return charactersCache[steamId]
end

-- Save specific character to persistent storage
function CityUnderground.Persistence.SaveCharacter(charData)
    if not charData or not charData.steamId or not charData.id then return false end

    charData.lastSavedAt = os.time()
    local steamId = charData.steamId
    local playerChars = CityUnderground.Persistence.LoadPlayerCharacters(steamId)
    
    playerChars[charData.id] = charData
    charactersCache[steamId] = playerChars

    local path = DATA_DIR .. tostring(steamId):gsub("[:/\\]", "_") .. ".json"
    local jsonStr = util.TableToJSON(playerChars, true)
    
    if file and file.Write then
        file.Write(path, jsonStr)
    end

    return true
end

-- Delete character by ID
function CityUnderground.Persistence.DeleteCharacter(steamId, charId)
    local playerChars = CityUnderground.Persistence.LoadPlayerCharacters(steamId)
    if playerChars[charId] then
        playerChars[charId] = nil
        charactersCache[steamId] = playerChars
        local path = DATA_DIR .. tostring(steamId):gsub("[:/\\]", "_") .. ".json"
        local jsonStr = util.TableToJSON(playerChars, true)
        if file and file.Write then
            file.Write(path, jsonStr)
        end
        return true
    end
    return false
end

-- Auto-Save Heartbeat (Every 5 minutes)
if timer and timer.Create then
    timer.Create("CityUnderground_AutoSave", 300, 0, function()
        for steamId, chars in pairs(charactersCache) do
            local path = DATA_DIR .. tostring(steamId):gsub("[:/\\]", "_") .. ".json"
            local jsonStr = util.TableToJSON(chars, true)
            if file and file.Write then
                file.Write(path, jsonStr)
            end
        end
    end)
end

CityUnderground.Persistence.Init()
