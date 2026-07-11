--!strict
-- DrugService: handles UseDrug (apply effects) and SellDrug (earn cash + XP).
-- Depends on SkillService and CraftingService (injected via Init).

local Players = game:GetService("Players")

local Shared  = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Remotes = require(Shared.Remotes)
local Drugs   = require(Shared.Data.Drugs)

-- ─────────────────────────────────────────────────────────────────────────────
-- Types
-- ─────────────────────────────────────────────────────────────────────────────
type ActiveEffect = {
	DrugId        : string,
	EndTime       : number,
	BaseWalkSpeed : number,
	BaseJumpPower : number,
}

-- ─────────────────────────────────────────────────────────────────────────────
-- State
-- ─────────────────────────────────────────────────────────────────────────────
local activeEffects  : {[number]: ActiveEffect} = {}
local SkillService   : any                       = nil
local CraftingService: any                       = nil

-- Simulated economy ledger (replace with EconomyService in full game)
local wallets: {[number]: number} = {}

-- ─────────────────────────────────────────────────────────────────────────────
-- Internal helpers
-- ─────────────────────────────────────────────────────────────────────────────
local function getBaseStats(player: Player): (number, number)
	local char = player.Character
	if not char then return 16, 50 end
	local hum = char:FindFirstChildOfClass("Humanoid")
	if not hum then return 16, 50 end
	return hum.WalkSpeed, hum.JumpPower
end

local function setStats(player: Player, speed: number, jump: number)
	local char = player.Character
	if not char then return end
	local hum = char:FindFirstChildOfClass("Humanoid")
	if not hum then return end
	hum.WalkSpeed = speed
	hum.JumpPower = jump
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Public API
-- ─────────────────────────────────────────────────────────────────────────────
local DrugService = {}

--- Inject service dependencies.
function DrugService.Init(skillSvc: any, craftingSvc: any)
	SkillService    = skillSvc
	CraftingService = craftingSvc
end

--- Remove all active drug effects from a player.
function DrugService.ClearEffect(player: Player)
	local effect = activeEffects[player.UserId]
	if not effect then return end
	setStats(player, effect.BaseWalkSpeed, effect.BaseJumpPower)
	activeEffects[player.UserId] = nil
	Remotes.DrugEffectSync:FireClient(player, nil, nil, 0)
end

--- Apply a drug's effect to the player's humanoid + notify client for VFX.
function DrugService.ApplyEffect(player: Player, drugId: string)
	local drug = Drugs[drugId]
	if not drug then return end

	local char = player.Character
	if not char then return end

	-- Clear any existing effect first
	DrugService.ClearEffect(player)

	local baseSpeed, baseJump = getBaseStats(player)
	-- Also factor in Agility skill bonuses as the "true" baseline
	if SkillService then
		baseSpeed += SkillService.GetBonus(player, "Agility", "SpeedBonus")
		baseJump  += SkillService.GetBonus(player, "Agility", "JumpBonus")
	end

	activeEffects[player.UserId] = {
		DrugId        = drugId,
		EndTime       = os.clock() + drug.Effects.Duration,
		BaseWalkSpeed = baseSpeed,
		BaseJumpPower = baseJump,
	}

	-- Apply stat modifiers
	setStats(player,
		baseSpeed * drug.Effects.SpeedMultiplier,
		baseJump  * drug.Effects.JumpMultiplier)

	-- Notify client (HUD timer, hallucination FX, etc.)
	Remotes.DrugEffectSync:FireClient(player, drugId, drug.Effects, drug.Effects.Duration)

	-- Health regen/drain loop
	if drug.Effects.HealthRegen ~= 0 then
		local regenRate  = drug.Effects.HealthRegen
		local effectEnd  = os.clock() + drug.Effects.Duration
		task.spawn(function()
			while os.clock() < effectEnd do
				task.wait(1)
				local c = player.Character
				if not c then break end
				local h = c:FindFirstChildOfClass("Humanoid")
				if not h then break end
				if not activeEffects[player.UserId] then break end
				h.Health = math.clamp(h.Health + regenRate, 0, h.MaxHealth)
			end
		end)
	end

	-- Wear-off timer
	task.delay(drug.Effects.Duration, function()
		if Players:GetPlayerByUserId(player.UserId) then
			DrugService.ClearEffect(player)
		end
	end)

	-- Addiction check (placeholder — extend with craving system)
	if math.random() < drug.AddictionChance then
		warn(string.format("[DrugService] %s may be developing addiction to %s",
			player.Name, drug.Name))
	end
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Remote handlers
-- ─────────────────────────────────────────────────────────────────────────────

-- Client requests to use a drug from their inventory
Remotes.UseDrug.OnServerEvent:Connect(function(player, drugId)
	if typeof(drugId) ~= "string" then return end
	if not Drugs[drugId] then return end
	if not CraftingService then return end

	local ok = CraftingService.TakeItems(player, {{ ItemId = drugId, Amount = 1 }})
	if not ok then return end  -- not in inventory

	DrugService.ApplyEffect(player, drugId)
end)

-- Client requests to sell drugs at NPC
Remotes.SellDrug.OnServerEvent:Connect(function(player, drugId, rawAmount)
	if typeof(drugId) ~= "string" then return end
	if not Drugs[drugId] then return end
	if not CraftingService then return end

	local amount = math.clamp(math.floor(rawAmount or 1), 1, 50)

	local ok = CraftingService.TakeItems(player, {{ ItemId = drugId, Amount = amount }})
	if not ok then return end

	local drug = Drugs[drugId]

	-- Price scaled by Chemistry quality bonus
	local qualityBonus = SkillService and SkillService.GetBonus(player, "Chemistry", "DrugQualityBonus") or 0
	local pricePerUnit = drug.BaseSellPrice * (1 + qualityBonus)
	local total        = math.floor(pricePerUnit * amount)

	-- Wallet credit
	wallets[player.UserId] = (wallets[player.UserId] or 0) + total

	-- XP: small XP from selling (Chemistry + Stealth)
	if SkillService then
		SkillService.AwardXP(player, "Chemistry", math.floor(total * 0.05))
		SkillService.AwardXP(player, "Stealth",   8 * amount)
	end

	print(string.format("[DrugService] %s sold %dx %s → $%d (wallet: $%d)",
		player.Name, amount, drug.Name, total, wallets[player.UserId]))
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- Player lifecycle
-- ─────────────────────────────────────────────────────────────────────────────
Players.PlayerAdded:Connect(function(player)
	wallets[player.UserId] = 500  -- starting cash
end)

Players.PlayerRemoving:Connect(function(player)
	DrugService.ClearEffect(player)
	wallets[player.UserId]  = nil
	activeEffects[player.UserId] = nil
end)

return DrugService
