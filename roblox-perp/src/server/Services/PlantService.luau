--!strict
-- PlantService: manages weed plant harvest sessions.
-- Players walk up to WeedPlant, press E → PlantStart fires.
-- Server tracks per-pluck count, enforces cooldown, awards items + XP.

local Players = game:GetService("Players")

local Shared  = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Remotes = require(Shared.Remotes)

-- ─────────────────────────────────────────────────────────────────────────────
-- Config
-- ─────────────────────────────────────────────────────────────────────────────
local TOTAL_BUDS     = 8    -- buds per harvest
local SESSION_TIME   = 20   -- seconds the minigame lasts
local PLANT_COOLDOWN = 60   -- seconds before plant regrows (shared, not per-player)

-- ─────────────────────────────────────────────────────────────────────────────
-- Types
-- ─────────────────────────────────────────────────────────────────────────────
type Session = {
	PluckedCount : number,
	StartTime    : number,
	TimerThread  : thread,
}

-- ─────────────────────────────────────────────────────────────────────────────
-- State
-- ─────────────────────────────────────────────────────────────────────────────
local activeSessions  : {[number]: Session} = {}
local nextHarvestTime : number              = 0

local CraftingService : any = nil
local SkillService    : any = nil

-- ─────────────────────────────────────────────────────────────────────────────
-- Public API
-- ─────────────────────────────────────────────────────────────────────────────
local PlantService = {}

function PlantService.Init(craftingSvc: any, skillSvc: any)
	CraftingService = craftingSvc
	SkillService    = skillSvc
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Reward calculation
-- ─────────────────────────────────────────────────────────────────────────────
-- Returns: seeds, weed, fertilizer, chemistryXP
local function calcRewards(plucked: number): (number, number, number, number)
	local seeds      = plucked           -- 1 seed per bud
	local weed       = 0
	local fertilizer = 0
	local xp         = plucked * 8

	if plucked >= 5 then weed = 1;        xp += 15 end
	if plucked >= 7 then weed = 2;        xp += 10 end
	if plucked == TOTAL_BUDS then
		fertilizer = 1                    -- perfect harvest bonus
		xp        += 30
	end

	return seeds, weed, fertilizer, xp
end

-- ─────────────────────────────────────────────────────────────────────────────
-- End a session and award rewards
-- ─────────────────────────────────────────────────────────────────────────────
local function endSession(player: Player)
	local session = activeSessions[player.UserId]
	if not session then return end

	task.cancel(session.TimerThread)
	activeSessions[player.UserId] = nil

	local plucked                          = session.PluckedCount
	local seeds, weed, fertilizer, xp = calcRewards(plucked)

	if CraftingService then
		if seeds      > 0 then CraftingService.GiveItem(player, "WeedSeeds",  seeds)      end
		if weed       > 0 then CraftingService.GiveItem(player, "Weed",       weed)       end
		if fertilizer > 0 then CraftingService.GiveItem(player, "Fertilizer", fertilizer) end
	end

	if SkillService and xp > 0 then
		SkillService.AwardXP(player, "Chemistry", xp)
	end

	Remotes.PlantReward:FireClient(player, plucked, TOTAL_BUDS, seeds, weed, fertilizer)
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Remote: client wants to start a harvest
-- ─────────────────────────────────────────────────────────────────────────────
Remotes.PlantStart.OnServerEvent:Connect(function(player: Player)
	-- Plant cooldown check
	if os.clock() < nextHarvestTime then
		local remaining = math.ceil(nextHarvestTime - os.clock())
		Remotes.PlantDenied:FireClient(player,
			string.format("Plant still regrowing… %.0fs left.", remaining))
		return
	end

	-- Already in session?
	if activeSessions[player.UserId] then return end

	-- Lock plant for cooldown
	nextHarvestTime = os.clock() + PLANT_COOLDOWN

	-- Server-side timeout so session always ends even if client disconnects
	local timerThread = task.delay(SESSION_TIME + 2, function()
		if Players:GetPlayerByUserId(player.UserId) then
			endSession(player)
		end
	end)

	activeSessions[player.UserId] = {
		PluckedCount = 0,
		StartTime    = os.clock(),
		TimerThread  = timerThread,
	}

	Remotes.PlantSetup:FireClient(player, TOTAL_BUDS, SESSION_TIME)
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- Remote: client plucked a bud
-- ─────────────────────────────────────────────────────────────────────────────
Remotes.PlantPluck.OnServerEvent:Connect(function(player: Player, budIndex)
	local session = activeSessions[player.UserId]
	if not session then return end
	if typeof(budIndex) ~= "number" then return end
	-- Anti-exploit: can't pluck more than TOTAL_BUDS
	if session.PluckedCount >= TOTAL_BUDS then return end

	session.PluckedCount = math.min(session.PluckedCount + 1, TOTAL_BUDS)

	if session.PluckedCount >= TOTAL_BUDS then
		endSession(player)
	end
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- Lifecycle
-- ─────────────────────────────────────────────────────────────────────────────
Players.PlayerRemoving:Connect(function(player)
	local session = activeSessions[player.UserId]
	if session then
		task.cancel(session.TimerThread)
		activeSessions[player.UserId] = nil
	end
end)

return PlantService
