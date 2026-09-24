--[[
    City Underground - Shared Communication System
    Defines chat channels, distance ranges, and roleplay actions.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Chat = CityUnderground.Chat or {}

CityUnderground.Chat.Distances = {
    WHISPER = 90,
    LOCAL = 250,
    SHOUT = 600,
    ME_ACTION = 250,
    DO_ACTION = 250
}

CityUnderground.Chat.Channels = {
    LOCAL = { name = "Local", color = "#f8fafc" },
    WHISPER = { name = "Whisper", color = "#94a3b8" },
    SHOUT = { name = "Shout", color = "#f59e0b" },
    ME = { name = "Action (/me)", color = "#c084fc" },
    DO = { name = "Narrative (/do)", color = "#38bdf8" },
    OOC = { name = "OOC", color = "#64748b" },
    PM = { name = "Private Msg", color = "#ec4899" }
}
