--[[
    City Underground - Shared Admin System
    Defines administrative permissions, user groups, and moderation actions.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Admin = CityUnderground.Admin or {}

CityUnderground.Admin.Ranks = {
    USER = 0,
    MODERATOR = 1,
    ADMIN = 2,
    SUPERADMIN = 3
}

CityUnderground.Admin.Commands = {
    ["kick"] = { minRank = 1, desc = "Kick a player from the server." },
    ["warn"] = { minRank = 1, desc = "Issue a formal moderation warning." },
    ["teleport"] = { minRank = 2, desc = "Teleport to a player or location." },
    ["bring"] = { minRank = 2, desc = "Bring a player to your location." },
    ["revive"] = { minRank = 2, desc = "Revive an unconscious player to full health." },
    ["inspect_inv"] = { minRank = 2, desc = "View a player's live inventory slots." },
    ["set_money"] = { minRank = 3, desc = "Set a character's cash or bank balance." },
    ["spawn_vehicle"] = { minRank = 2, desc = "Spawn an approved administrative or testing vehicle." },
    ["view_logs"] = { minRank = 1, desc = "Review server economy and arrest logs." }
}
