--[[
    City Underground - Server Skills Engine
    Server-authoritative skill progression, XP rewards, and level-up synchronization.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Skills = CityUnderground.Skills or {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Skills_Sync")
    util.AddNetworkString("CU_Skills_LevelUpNotice")
end

-- Award Skill XP to Player Character
function CityUnderground.Skills.AddXP(ply, skillKey, xpAmount)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    char.skills = char.skills or {
        synthesis = 0,
        lockpicking = 0,
        botany = 0,
        driving = 0,
        medical = 0
    }

    local oldXP = char.skills[skillKey] or 0
    local oldLevel = CityUnderground.Skills.GetLevelFromXP(oldXP)
    local newXP = oldXP + xpAmount
    char.skills[skillKey] = newXP

    local newLevel = CityUnderground.Skills.GetLevelFromXP(newXP)
    if newLevel > oldLevel then
        -- Level-up event
        if net and net.Start then
            net.Start("CU_Skills_LevelUpNotice")
            net.WriteString(skillKey)
            net.WriteInt(newLevel, 8)
            net.Send(ply)
        end
    end

    CityUnderground.Skills.Sync(ply)
    CityUnderground.Persistence.SaveCharacter(char)
end

-- Sync Skills Table to Client
function CityUnderground.Skills.Sync(ply)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    char.skills = char.skills or {
        synthesis = 0,
        lockpicking = 0,
        botany = 0,
        driving = 0,
        medical = 0
    }

    if net and net.Start then
        net.Start("CU_Skills_Sync")
        net.WriteTable(char.skills)
        net.Send(ply)
    end
end
