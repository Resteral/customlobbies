--!strict
-- CraftingService: validates recipes, manages craft timers, rewards XP.
-- Depends on SkillService (injected via Init).

local Players = game:GetService("Players")

local Shared    = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Remotes   = require(Shared.Remotes)
local Recipes   = require(Shared.Data.Recipes)
local Constants = require(Shared.Constants)

-- ─────────────────────────────────────────────────────────────────────────────
-- Types
-- ─────────────────────────────────────────────────────────────────────────────
type Inventory = {[string]: number}

type ActiveCraft = {
	RecipeId  : string,
	StartTime : number,
	EndTime   : number,
	Thread    : thread,
}

-- ─────────────────────────────────────────────────────────────────────────────
-- State
-- ─────────────────────────────────────────────────────────────────────────────
local inventories  : {[number]: Inventory}    = {}
local activeCrafts : {[number]: ActiveCraft}  = {}
local SkillService : any                       = nil  -- injected

-- ─────────────────────────────────────────────────────────────────────────────
-- Internal helpers
-- ─────────────────────────────────────────────────────────────────────────────
local function getInv(player: Player): Inventory
	if not inventories[player.UserId] then
		inventories[player.UserId] = {}
	end
	return inventories[player.UserId]
end

local function syncInv(player: Player)
	Remotes.UpdateInventory:FireClient(player, getInv(player))
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Public API
-- ─────────────────────────────────────────────────────────────────────────────
local CraftingService = {}

--- Inject the SkillService dependency after both services are created.
function CraftingService.Init(skillSvc: any)
	SkillService = skillSvc
end

--- Add items to a player's inventory and sync to client.
function CraftingService.GiveItem(player: Player, itemId: string, amount: number)
	local inv = getInv(player)
	inv[itemId] = (inv[itemId] or 0) + amount
	syncInv(player)
end

--- Remove items if available. Returns true on success.
function CraftingService.TakeItems(player: Player, ingredients: {{ItemId: string, Amount: number}}): boolean
	local inv = getInv(player)
	-- Validation pass
	for _, ing in ipairs(ingredients) do
		if (inv[ing.ItemId] or 0) < ing.Amount then
			return false
		end
	end
	-- Deduction pass
	for _, ing in ipairs(ingredients) do
		inv[ing.ItemId] = (inv[ing.ItemId] or 0) - ing.Amount
		if inv[ing.ItemId] <= 0 then
			inv[ing.ItemId] = nil
		end
	end
	syncInv(player)
	return true
end

--- Raw inventory read (for DrugService sell checks).
function CraftingService.GetInventory(player: Player): Inventory
	return getInv(player)
end

--- Initiate a craft. Fires progress updates and CraftComplete/CraftFailed.
function CraftingService.StartCraft(player: Player, recipeId: string)
	if activeCrafts[player.UserId] then
		Remotes.CraftFailed:FireClient(player, "You're already crafting something.")
		return
	end

	local recipe = Recipes[recipeId]
	if not recipe then
		Remotes.CraftFailed:FireClient(player, "Unknown recipe.")
		return
	end

	-- Skill gate
	if recipe.RequiredSkill and recipe.RequiredSkillLevel then
		local lvl = SkillService and SkillService.GetLevel(player, recipe.RequiredSkill) or 1
		if lvl < recipe.RequiredSkillLevel then
			Remotes.CraftFailed:FireClient(player,
				string.format("Requires %s level %d (you have level %d).",
					recipe.RequiredSkill, recipe.RequiredSkillLevel, lvl))
			return
		end
	end

	-- Ingredient check & deduction
	if not CraftingService.TakeItems(player, recipe.Ingredients) then
		Remotes.CraftFailed:FireClient(player, "Missing ingredients.")
		return
	end

	-- Craft time (reduced by relevant skill)
	local skillKey   = recipe.RequiredSkill or "Crafting"
	local reduction  = SkillService and SkillService.GetBonus(player, skillKey, "CraftTimeReduction") or 0
	local craftTime  = recipe.BaseCraftTime
		* math.max(Constants.MIN_CRAFT_TIME_FRACTION, 1 - reduction)

	local now   = os.clock()
	local endAt = now + craftTime

	-- Spawn timed thread with progress ticks
	local thread = task.spawn(function()
		local TICK = 0.5  -- progress update interval
		while os.clock() < endAt do
			task.wait(TICK)
			if not Players:GetPlayerByUserId(player.UserId) then return end
			local progress = math.clamp((os.clock() - now) / craftTime, 0, 1)
			Remotes.CraftProgress:FireClient(player, recipeId, progress)
		end

		activeCrafts[player.UserId] = nil

		-- Yield bonus (Chemistry DrugYieldBonus applies to drug recipes)
		local yieldBonus = 0
		if recipe.Category == "Drug" and SkillService then
			yieldBonus = SkillService.GetBonus(player, "Chemistry", "DrugYieldBonus")
		end
		local outputAmount = recipe.OutputAmount + (math.random() < yieldBonus and 1 or 0)

		CraftingService.GiveItem(player, recipe.OutputItemId, outputAmount)

		-- Award XP
		if SkillService then
			for skillId, xp in pairs(recipe.XpReward) do
				SkillService.AwardXP(player, skillId, xp)
			end
		end

		Remotes.CraftComplete:FireClient(player, recipe.OutputItemId, outputAmount, craftTime)
	end)

	activeCrafts[player.UserId] = {
		RecipeId  = recipeId,
		StartTime = now,
		EndTime   = endAt,
		Thread    = thread,
	}
end

--- Cancel an in-progress craft (ingredients are NOT refunded).
function CraftingService.CancelCraft(player: Player)
	local active = activeCrafts[player.UserId]
	if not active then return end
	task.cancel(active.Thread)
	activeCrafts[player.UserId] = nil
	Remotes.CraftFailed:FireClient(player, "Craft cancelled.")
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Remote handlers
-- ─────────────────────────────────────────────────────────────────────────────
Remotes.StartCraft.OnServerEvent:Connect(function(player, recipeId)
	if typeof(recipeId) ~= "string" then return end
	CraftingService.StartCraft(player, recipeId)
end)

Remotes.CancelCraft.OnServerEvent:Connect(function(player)
	CraftingService.CancelCraft(player)
end)

Remotes.GetRecipes.OnServerInvoke = function(_player)
	return Recipes
end

Remotes.GetInventory.OnServerInvoke = function(player)
	return getInv(player)
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Player lifecycle
-- ─────────────────────────────────────────────────────────────────────────────
Players.PlayerAdded:Connect(function(player)
	inventories[player.UserId] = {}
	-- ── DEV STARTER KIT ── give test ingredients so you can try recipes immediately
	task.wait(2)
	if not Players:GetPlayerByUserId(player.UserId) then return end
	CraftingService.GiveItem(player, "WeedSeeds",       10)
	CraftingService.GiveItem(player, "Fertilizer",       5)
	CraftingService.GiveItem(player, "MushroomSpores",   6)
	CraftingService.GiveItem(player, "CompostBag",       4)
	CraftingService.GiveItem(player, "MetalScrap",       8)
	CraftingService.GiveItem(player, "Bandage",         10)
	CraftingService.GiveItem(player, "Antiseptic",       5)
	CraftingService.GiveItem(player, "Tape",             3)
	-- Pre-crafted drugs so you can test UseDrug immediately
	CraftingService.GiveItem(player, "Weed",             2)
	CraftingService.GiveItem(player, "Shrooms",          2)
end)

Players.PlayerRemoving:Connect(function(player)
	CraftingService.CancelCraft(player)
	inventories[player.UserId]  = nil
	activeCrafts[player.UserId] = nil
end)

return CraftingService
