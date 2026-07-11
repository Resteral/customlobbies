--!strict
-- Remotes: central registry for all RemoteEvents and RemoteFunctions.
-- The server creates these once; clients retrieve them by name.

local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Wait for the Network folder (server creates it, client waits)
local function getNetwork(): Folder
	if game:GetService("RunService"):IsServer() then
		local net = ReplicatedStorage:FindFirstChild("Network") :: Folder?
		if net then return net end
		local new = Instance.new("Folder")
		new.Name   = "Network"
		new.Parent = ReplicatedStorage
		return new
	else
		return ReplicatedStorage:WaitForChild("Network", 15) :: Folder
	end
end

local function remote(parent: Folder, class: string, name: string): any
	if game:GetService("RunService"):IsServer() then
		local existing = parent:FindFirstChild(name)
		if existing then return existing end
		local inst = Instance.new(class)
		inst.Name   = name
		inst.Parent = parent
		return inst
	else
		return parent:WaitForChild(name, 15)
	end
end

local Network = getNetwork()

local Remotes = {
	-- ── Drug System ───────────────────────────────────────────────────────────
	UseDrug        = remote(Network, "RemoteEvent",    "UseDrug"),         -- client→server
	SellDrug       = remote(Network, "RemoteEvent",    "SellDrug"),        -- client→server
	DrugEffectSync = remote(Network, "RemoteEvent",    "DrugEffectSync"),  -- server→client

	-- ── Crafting System ───────────────────────────────────────────────────────
	StartCraft     = remote(Network, "RemoteEvent",    "StartCraft"),      -- client→server
	CancelCraft    = remote(Network, "RemoteEvent",    "CancelCraft"),     -- client→server
	CraftProgress  = remote(Network, "RemoteEvent",    "CraftProgress"),   -- server→client (0-1)
	CraftComplete  = remote(Network, "RemoteEvent",    "CraftComplete"),   -- server→client
	CraftFailed    = remote(Network, "RemoteEvent",    "CraftFailed"),     -- server→client
	GetRecipes     = remote(Network, "RemoteFunction", "GetRecipes"),

	-- ── Skill System ──────────────────────────────────────────────────────────
	SkillXpGained  = remote(Network, "RemoteEvent",    "SkillXpGained"),   -- server→client
	SkillLevelUp   = remote(Network, "RemoteEvent",    "SkillLevelUp"),    -- server→client
	GetSkillData   = remote(Network, "RemoteFunction", "GetSkillData"),

	-- ── Inventory ─────────────────────────────────────────────────────────────
	GetInventory    = remote(Network, "RemoteFunction", "GetInventory"),
	UpdateInventory = remote(Network, "RemoteEvent",    "UpdateInventory"), -- server→client

	-- ── Plant Minigame ───────────────────────────────────────────────────────
	PlantStart  = remote(Network, "RemoteEvent", "PlantStart"),   -- client→server
	PlantPluck  = remote(Network, "RemoteEvent", "PlantPluck"),   -- client→server
	PlantSetup  = remote(Network, "RemoteEvent", "PlantSetup"),   -- server→client
	PlantReward = remote(Network, "RemoteEvent", "PlantReward"),  -- server→client
	PlantDenied = remote(Network, "RemoteEvent", "PlantDenied"),  -- server→client
}

return Remotes
