-- Server PERP Skills Logic for Helix
local PLUGIN = PLUGIN

util.AddNetworkString("ixPerpSkillUpdate")
util.AddNetworkString("ixPerpOpenSkillsUI")
util.AddNetworkString("ixPerpSkillLevelUp")

-- Extend Character Meta Table with PERP Skills
local CHAR = ix.meta.character

function CHAR:GetSkills()
    return self:GetData("perp_skills", {})
end

function CHAR:GetSkill(skillID)
    local skills = self:GetSkills()
    return skills[skillID] or { level = 1, xp = 0 }
end

function CHAR:GetSkillLevel(skillID)
    local skill = self:GetSkill(skillID)
    return skill.level or 1
end

function CHAR:GetSkillXP(skillID)
    local skill = self:GetSkill(skillID)
    return skill.xp or 0
end

function CHAR:AddSkillXP(skillID, amount)
    if not PLUGIN.Skills[skillID] then return end
    amount = math.max(0, math.floor(amount))
    if amount == 0 then return end

    local skills = table.Copy(self:GetSkills())
    local current = skills[skillID] or { level = 1, xp = 0 }
    local maxLevel = PLUGIN.Skills[skillID].maxLevel or 20

    if current.level >= maxLevel then
        current.xp = 0
        skills[skillID] = current
        self:SetData("perp_skills", skills)
        return
    end

    current.xp = (current.xp or 0) + amount
    local reqXP = PLUGIN:GetRequiredSkillXP(current.level)
    local leveledUp = false

    while current.xp >= reqXP and current.level < maxLevel do
        current.xp = current.xp - reqXP
        current.level = current.level + 1
        leveledUp = true
        reqXP = PLUGIN:GetRequiredSkillXP(current.level)
    end

    skills[skillID] = current
    self:SetData("perp_skills", skills)

    local ply = self:GetPlayer()
    if IsValid(ply) then
        net.Start("ixPerpSkillUpdate")
            net.WriteString(skillID)
            net.WriteInt(current.level, 8)
            net.WriteInt(current.xp, 32)
        net.Send(ply)

        if leveledUp then
            net.Start("ixPerpSkillLevelUp")
                net.WriteString(skillID)
                net.WriteInt(current.level, 8)
            net.Send(ply)
            
            ply:Notify("LEVEL UP! Your " .. PLUGIN.Skills[skillID].name .. " is now Level " .. current.level .. "!")
        end
    end
end

-- Chat Command to open skills
ix.command.Add("Skills", {
    description = "Open your PERP Skills and Progression menu.",
    OnRun = function(self, ply)
        local character = ply:GetCharacter()
        if not character then return end

        net.Start("ixPerpOpenSkillsUI")
            net.WriteTable(character:GetSkills())
        net.Send(ply)
    end
})

-- Sync skills on character load
function PLUGIN:PlayerLoadedCharacter(ply, character, currentChar)
    if character then
        net.Start("ixPerpOpenSkillsUI")
            net.WriteTable(character:GetSkills())
        net.Send(ply)
    end
end
