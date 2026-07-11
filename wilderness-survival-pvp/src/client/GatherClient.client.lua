-- GatherClient: Detects tool clicks on resource nodes and sends hits to server
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")
local CollectionService = game:GetService("CollectionService")

local Player = Players.LocalPlayer
local Camera = workspace.CurrentCamera

-- Remote Event
local NetworkFolder = ReplicatedStorage:WaitForChild("Network")
local DamageResourceEvent = NetworkFolder:WaitForChild("DamageResource")

-- Configuration
local HIT_COOLDOWN = 0.5 -- Time in seconds between tool hits
local MaxReach = 15 -- Max distance to hit a node in studs

-- State variables
local nextHitTime = 0

-- Check if an object is a valid resource node
local function findResourceNodeModel(part)
	if not part then return nil end
	
	-- Traverse up the workspace tree to find a tagged model or specific named group
	local current = part
	while current and current ~= workspace do
		if CollectionService:HasTag(current, "ResourceNode") then
			return current
		end
		
		local name = current.Name:lower()
		if string.find(name, "tree") or string.find(name, "rock") or string.find(name, "stone") then
			return current
		end
		
		current = current.Parent
	end
	return nil
end

-- Perform a Raycast from the mouse position
local function getClickedResource()
	local mouseLocation = UserInputService:GetMouseLocation()
	
	-- Create ray from camera through mouse viewport position
	local unitRay = Camera:ViewportPointToRay(mouseLocation.X, mouseLocation.Y)
	
	-- Configure raycast parameters
	local raycastParams = RaycastParams.new()
	raycastParams.FilterType = Enum.RaycastFilterType.Exclude
	
	-- Exclude the player's character from the raycast
	if Player.Character then
		raycastParams.FilterDescendantsInstances = {Player.Character}
	end
	
	local raycastResult = workspace:Raycast(unitRay.Origin, unitRay.Direction * 200, raycastParams)
	
	if raycastResult and raycastResult.Instance then
		return findResourceNodeModel(raycastResult.Instance), raycastResult.Position
	end
	
	return nil, nil
end

-- Process tool hit
local function onInteractionBegan(inputState)
	-- Check cooldown
	local currentTime = os.clock()
	if currentTime < nextHitTime then return end
	
	-- Ensure player character is spawned and has a tool equipped
	local character = Player.Character
	if not character then return end
	
	local equippedTool = character:FindFirstChildOfClass("Tool")
	if not equippedTool then return end
	
	-- Only allow harvesting if holding a gathering tool (Axe or Pickaxe)
	local toolName = equippedTool.Name:lower()
	if not (string.find(toolName, "axe") or string.find(toolName, "pick")) then
		return
	end
	
	-- Find if player clicked on a resource node
	local resourceNode, hitPosition = getClickedResource()
	if not resourceNode or not hitPosition then return end
	
	-- Calculate distance
	local hrp = character:FindFirstChild("HumanoidRootPart")
	if not hrp then return end
	
	local distance = (hrp.Position - hitPosition).Magnitude
	if distance > MaxReach then
		return -- Out of reach
	end
	
	-- Apply cooldown and trigger hit
	nextHitTime = currentTime + HIT_COOLDOWN
	
	-- Play a visual swing effect on the tool (slight rotation tilt)
	task.spawn(function()
		local handle = equippedTool:FindFirstChild("Handle")
		if handle then
			-- Quick local audio/visual indicator (optional)
		end
	end)
	
	-- Fire event to server
	DamageResourceEvent:FireServer(resourceNode)
end

-- Listen for mouse/touch inputs
UserInputService.InputBegan:Connect(function(input, gameProcessedEvent)
	-- Ignore inputs if user is typing in chat or interacting with UI
	if gameProcessedEvent then return end
	
	if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
		onInteractionBegan(input)
	end
end)
