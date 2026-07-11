--!strict
-- Constants: game-wide tuning values for Drug / Crafting / Skill systems

local Constants = {
	-- ── Skill System ──────────────────────────────────────────────────────────
	BASE_XP_PER_LEVEL  = 100,    -- XP to go from level 1 → 2
	XP_SCALE_FACTOR    = 1.25,   -- each subsequent level costs 25% more XP
	MAX_SKILL_LEVEL    = 50,

	-- ── Crafting ──────────────────────────────────────────────────────────────
	MIN_CRAFT_TIME_FRACTION = 0.10, -- Chemistry skill can reduce craft time to 10% minimum

	-- ── Drug Economy ─────────────────────────────────────────────────────────
	SELL_NPC_NAME = "Drug Dealer NPC",  -- name of NPC part that triggers sell

	-- ── DataStore ─────────────────────────────────────────────────────────────
	DATA_STORE_KEY     = "PerpPlayerData_v1",
	AUTOSAVE_INTERVAL  = 60,
}

return Constants
