-- GatherManager: Handles resource harvesting and physical item drops
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local CollectionService = game:GetService("CollectionService")
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")

-- Remote Event & Tools
local NetworkFolder = ReplicatedStorage:WaitForChild("Network")
local DamageResourceEvent = NetworkFolder:WaitForChild("DamageResource")
local ToolsFolder = ReplicatedStorage:WaitForChild("Tools")

-- Item Templates
local ToolTemplates = {
	Stick = ToolsFolder:WaitForChild("Stick"),
	Branch = ToolsFolder:WaitForChild("Branch"),
	Bark = ToolsFolder:WaitForChild("Bark"),
	Vine = ToolsFolder:WaitForChild("Vine"),
	Flint = ToolsFolder:WaitForChild("Flint"),
	Tinder = ToolsFolder:WaitForChild("Tinder"),
	Ice = ToolsFolder:WaitForChild("Ice"),
	Berry = ToolsFolder:WaitForChild("Berry")
}

-- Configuration
local MAX_GATHER_DISTANCE = 15 -- Max distance in studs player can hit from
local DEFAULT_RESPAWN_TIME = 10 -- Seconds before node respawns

-- Active Node Database
local activeNodes = {}

-- Helper: Spawn a physical tool on the ground
local function spawnPhysicalItem(itemName, cframe)
	local template = ToolTemplates[itemName]
	if not template then return end
	
	local itemClone = template:Clone()
	
	-- Position the handle slightly above the ground with a tiny random offset
	local handle = itemClone:FindFirstChild("Handle")
	if handle then
		handle.CFrame = cframe + Vector3.new(math.random(-2, 2), 2, math.random(-2, 2))
		handle.Anchored = false
	end
	
	itemClone.Parent = Workspace
end

-- Initialize and index resource nodes in the Workspace
local function registerResourceNode(node)
	if not node:IsA("Model") and not node:IsA("BasePart") then return end
	if activeNodes[node] then return end

	-- Determine node type based on name if no configuration is present
	local nodeName = node.Name:lower()
	local resourceType = "Wood"
	local maxHealth = 5
	local respawnTime = DEFAULT_RESPAWN_TIME

	if string.find(nodeName, "rock") or string.find(nodeName, "stone") then
		resourceType = "Stone"
		maxHealth = 8
	elseif string.find(nodeName, "tree") or string.find(nodeName, "wood") then
		resourceType = "Wood"
		maxHealth = 5
	elseif string.find(nodeName, "bush") or string.find(nodeName, "berry") then
		resourceType = "Berry"
		maxHealth = 3
	end

	-- Check for custom attributes or overrides
	if node:GetAttribute("ResourceType") then
		resourceType = node:GetAttribute("ResourceType")
	end
	if node:GetAttribute("MaxHealth") then
		maxHealth = node:GetAttribute("MaxHealth")
	end
	if node:GetAttribute("RespawnTime") then
		respawnTime = node:GetAttribute("RespawnTime")
	end

	-- Capture original positioning for respawning
	local originalCFrame = nil
	if node:IsA("Model") then
		if node.PrimaryPart then
			originalCFrame = node.PrimaryPart.CFrame
		else
			local cframe, _ = node:GetBoundingBox()
			originalCFrame = cframe
		end
	else
		originalCFrame = node.CFrame
	end

	-- Create backup clone for respawning
	node.Archivable = true
	local backupClone = node:Clone()
	
	activeNodes[node] = {
		ResourceType = resourceType,
		Health = maxHealth,
		MaxHealth = maxHealth,
		RespawnTime = respawnTime,
		OriginalCFrame = originalCFrame,
		Backup = backupClone,
		Parent = node.Parent
	}

	if not CollectionService:HasTag(node, "ResourceNode") then
		CollectionService:AddTag(node, "ResourceNode")
	end
end

-- Respawn a node
local function respawnNode(details)
	task.wait(details.RespawnTime)
	
	local newClone = details.Backup:Clone()
	newClone.Parent = details.Parent
	
	if newClone:IsA("Model") then
		newClone:PivotTo(details.OriginalCFrame)
	else
		newClone.CFrame = details.OriginalCFrame
	end
	
	registerResourceNode(newClone)
	print("Respawned resource node: " .. newClone.Name)
end

-- Determine hit drops
local function handleHitDrops(resourceType, position)
	if resourceType == "Wood" then
		-- Hitting wood drops Stick, Branch, Bark, or Vine
		local roll = math.random(100)
		if roll <= 40 then
			spawnPhysicalItem("Stick", position)
		elseif roll <= 70 then
			spawnPhysicalItem("Branch", position)
		elseif roll <= 90 then
			spawnPhysicalItem("Bark", position)
		else
			spawnPhysicalItem("Vine", position)
		end
	elseif resourceType == "Stone" then
		-- Hitting stone drops Flint or Ice
		local roll = math.random(100)
		if roll <= 60 then
			spawnPhysicalItem("Flint", position)
		else
			spawnPhysicalItem("Ice", position)
		end
	elseif resourceType == "Berry" then
		-- Hitting bushes drops Tinder or Berries
		local roll = math.random(100)
		if roll <= 50 then
			spawnPhysicalItem("Tinder", position)
		else
			spawnPhysicalItem("Berry", position)
		end
	end
end

-- Handle hit request from client
local function onDamageResource(player, node)
	if not player or not player.Character then return end
	local character = player.Character
	local hrp = character:FindFirstChild("HumanoidRootPart")
	if not hrp then return end

	-- Ensure node exists
	local details = activeNodes[node]
	if not details then 
		local name = node.Name:lower()
		if string.find(name, "tree") or string.find(name, "rock") or string.find(name, "stone") or string.find(name, "bush") or string.find(name, "berry") then
			registerResourceNode(node)
			details = activeNodes[node]
		end
	end
	if not details then return end

	-- Reach check
	local nodeCFrame = nil
	if node:IsA("Model") then
		nodeCFrame = node.PrimaryPart and node.PrimaryPart.CFrame or node:GetBoundingBox()
	else
		nodeCFrame = node.CFrame
	end

	local distance = (hrp.Position - nodeCFrame.Position).Magnitude
	if distance > MAX_GATHER_DISTANCE then
		warn(player.Name .. " hit node from too far (" .. math.round(distance) .. " studs)")
		return
	end

	-- Apply damage
	details.Health = details.Health - 1
	
	-- Drop item at node location on hit
	handleHitDrops(details.ResourceType, nodeCFrame)

	-- Add to basic leaderstats
	local leaderstats = player:FindFirstChild("leaderstats")
	if leaderstats then
		local statName = (details.ResourceType == "Berry") and "Wood" or details.ResourceType -- Bushes count as wood leaderstats
		local resourceValue = leaderstats:FindFirstChild(statName)
		if resourceValue then
			resourceValue.Value = resourceValue.Value + 1
		end
	end

	if details.Health <= 0 then
		print(player.Name .. " destroyed " .. node.Name)
		
		-- Destroy rewards: spawn 2-3 additional items
		local dropCount = math.random(2, 3)
		for i = 1, dropCount do
			handleHitDrops(details.ResourceType, nodeCFrame)
		end
		
		if leaderstats then
			local statName = (details.ResourceType == "Berry") and "Wood" or details.ResourceType
			local resourceValue = leaderstats:FindFirstChild(statName)
			if resourceValue then
				resourceValue.Value = resourceValue.Value + math.random(2, 4)
			end
		end

		activeNodes[node] = nil
		node:Destroy()
		task.spawn(respawnNode, details)
	end
end

-- Monitor workspace for tagged nodes
local function scanWorkspace()
	for _, desc in ipairs(Workspace:GetDescendants()) do
		local name = desc.Name:lower()
		if desc:IsA("Model") or desc:IsA("BasePart") then
			if CollectionService:HasTag(desc, "ResourceNode") or string.find(name, "tree") or string.find(name, "rock") or string.find(name, "stone") or string.find(name, "bush") or string.find(name, "berry") then
				registerResourceNode(desc)
			end
		end
	end
end

scanWorkspace()
DamageResourceEvent.OnServerEvent:Connect(onDamageResource)

Workspace.DescendantAdded:Connect(function(desc)
	task.wait(0.1)
	if not desc.Parent then return end
	local name = desc.Name:lower()
	if CollectionService:HasTag(desc, "ResourceNode") or string.find(name, "tree") or string.find(name, "rock") or string.find(name, "stone") or string.find(name, "bush") or string.find(name, "berry") then
		registerResourceNode(desc)
	end
end)
