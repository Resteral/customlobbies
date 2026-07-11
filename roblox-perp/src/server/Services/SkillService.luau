--!strict
-- SkillService: manages XP, levelling, and bonus calculations for all skills.
-- Hooks: SkillService.Initialize(player, savedData?) on join
--        SkillService.AwardXP(player, skillId, amount)
--        SkillService.GetLevel(player, skillId) → number
--        SkillService.GetBonus(player, skillId, bonusKey) → number
--        SkillService.Serialize(player) → table (for DataStore)

local Players = game:GetService("Players")

local Shared    = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Remotes   = require(Shared.Remotes)
local Skills    = require(Shared.Data.Skills)
local Constants = require(Shared.Constants)

-- ─────────────────────────────────────────────────────────────────────────────
-- Types
-- ─────────────────────────────────────────────────────────────────────────────
type SkillEntry = {
	Level         : number,
	XP            : number,
	XPToNextLevel : number,
}
type PlayerSkills = {[string]: SkillEntry}

-- ─────────────────────────────────────────────────────────────────────────────
-- State
-- ─────────────────────────────────────────────────────────────────────────────
local store: {[number]: PlayerSkills} = {}

-- ─────────────────────────────────────────────────────────────────────────────
-- Helpers
-- ─────────────────────────────────────────────────────────────────────────────
local function xpForLevel(level: number): number
	return math.floor(Constants.BASE_XP_PER_LEVEL * (Constants.XP_SCALE_FACTOR ^ (level - 1)))
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Public API
-- ─────────────────────────────────────────────────────────────────────────────
local SkillService = {}

--- Call on PlayerAdded (or after DataStore load). savedData is optional.
function SkillService.Initialize(player: Player, savedData: PlayerSkills?)
	local skills: PlayerSkills = {}
	for id, _ in pairs(Skills) do
		if savedData and savedData[id] then
			skills[id] = savedData[id]
		else
			skills[id] = { Level = 1, XP = 0, XPToNextLevel = xpForLevel(1) }
		end
	end
	store[player.UserId] = skills
end

--- Award XP to a skill, fire level-up events as needed.
function SkillService.AwardXP(player: Player, skillId: string, amount: number)
	local data = store[player.UserId]
	if not data then return end
	local entry = data[skillId]
	if not entry then return end
	local def = Skills[skillId]
	if not def then return end

	entry.XP += amount

	-- Notify client of XP gain
	Remotes.SkillXpGained:FireClient(player, skillId, amount, entry.XP, entry.XPToNextLevel)

	-- Level-up loop (handles multiple levels at once)
	while entry.Level < def.MaxLevel and entry.XP >= entry.XPToNextLevel do
		entry.XP -= entry.XPToNextLevel
		entry.Level += 1
		entry.XPToNextLevel = xpForLevel(entry.Level)
		Remotes.SkillLevelUp:FireClient(player, skillId, entry.Level)
	end

	-- Cap at max level
	if entry.Level >= def.MaxLevel then
		entry.XP            = 0
		entry.XPToNextLevel = 0
	end
end

--- Returns the current level of a skill (defaults to 1 if missing).
function SkillService.GetLevel(player: Player, skillId: string): number
	local data = store[player.UserId]
	if not data or not data[skillId] then return 1 end
	return data[skillId].Level
end

--- Returns the total accumulated bonus value for a given bonusKey.
--- Example: GetBonus(player, "Chemistry", "CraftTimeReduction") → 0.30 at level 21
function SkillService.GetBonus(player: Player, skillId: string, bonusKey: string): number
	local data = store[player.UserId]
	if not data or not data[skillId] then return 0 end
	local def = Skills[skillId]
	if not def then return 0 end
	local perLevel = (def.BonusPerLevel :: any)[bonusKey] :: number?
	if not perLevel then return 0 end
	-- Level 1 gives no bonus; bonus starts accumulating at level 2
	return perLevel * math.max(0, data[skillId].Level - 1)
end

--- Returns the raw skill table for a player (for DataStore serialization).
function SkillService.Serialize(player: Player): PlayerSkills?
	return store[player.UserId]
end

--- Release memory on leave.
function SkillService.Cleanup(player: Player)
	store[player.UserId] = nil
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Remote handlers
-- ─────────────────────────────────────────────────────────────────────────────
Remotes.GetSkillData.OnServerInvoke = function(player: Player)
	return store[player.UserId] or {}
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Player lifecycle
-- ─────────────────────────────────────────────────────────────────────────────
Players.PlayerAdded:Connect(function(player)
	-- In production: load savedData from DataStore first, then pass here
	SkillService.Initialize(player, nil)
end)

Players.PlayerRemoving:Connect(function(player)
	-- In production: save SkillService.Serialize(player) to DataStore here
	SkillService.Cleanup(player)
end)

return SkillService
