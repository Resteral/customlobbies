-- PlacementClient: Handles crafting UI, building previews, and rotation
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")

local Player = Players.LocalPlayer
local Camera = workspace.CurrentCamera
local Mouse = Player:GetMouse()

-- Remote Event & Templates
local NetworkFolder = ReplicatedStorage:WaitForChild("Network")
local PlaceStructureEvent = NetworkFolder:WaitForChild("PlaceStructure")
local StructuresFolder = ReplicatedStorage:WaitForChild("Structures")

-- Configuration
local MAX_BUILD_REACH = 25 -- Match server limit
local ROTATION_STEP = 90 -- Degrees to rotate on 'R'

-- State variables
local currentStructure = nil -- Name of structure being placed
local previewModel = nil -- Local preview instance
local currentRotationY = 0 -- Rotation around Y-axis
local isPlacing = false

-- Color constants for preview validation
local COLOR_VALID = Color3.fromRGB(85, 255, 127) -- Semi-transparent Green
local COLOR_INVALID = Color3.fromRGB(255, 85, 85) -- Semi-transparent Red

-- Helper: Create a programmatically designed UI element
local function createUI()
	local screenGui = Instance.new("ScreenGui")
	screenGui.Name = "CraftingGui"
	screenGui.ResetOnSpawn = false
	screenGui.Parent = Player:WaitForChild("PlayerGui")

	-- Main background panel
	local frame = Instance.new("Frame")
	frame.Name = "CraftingPanel"
	frame.Size = UDim2.new(0, 260, 0, 260)
	frame.Position = UDim2.new(0, 20, 1, -280)
	frame.BackgroundColor3 = Color3.fromRGB(30, 30, 35)
	frame.BorderSizePixel = 0
	frame.Active = true
	frame.Parent = screenGui

	-- Round corners for panel
	local frameCorner = Instance.new("UICorner")
	frameCorner.CornerRadius = UDim.new(0, 10)
	frameCorner.Parent = frame

	-- Add subtle UI stroke for premium outline look
	local frameStroke = Instance.new("UIStroke")
	frameStroke.Color = Color3.fromRGB(75, 75, 85)
	frameStroke.Thickness = 1.5
	frameStroke.Parent = frame

	-- Title label
	local title = Instance.new("TextLabel")
	title.Name = "Title"
	title.Text = "🔨 CRAFTING MENU"
	title.Font = Enum.Font.SourceSansBold
	title.TextSize = 14
	title.TextColor3 = Color3.fromRGB(240, 240, 240)
	title.Size = UDim2.new(1, 0, 0, 30)
	title.Position = UDim2.new(0, 0, 0, 5)
	title.BackgroundTransparency = 1
	title.Parent = frame

	-- List Layout for buttons
	local buttonContainer = Instance.new("Frame")
	buttonContainer.Name = "ButtonContainer"
	buttonContainer.Size = UDim2.new(1, -20, 1, -45)
	buttonContainer.Position = UDim2.new(0, 10, 0, 35)
	buttonContainer.BackgroundTransparency = 1
	buttonContainer.Parent = frame

	local layout = Instance.new("UIListLayout")
	layout.Padding = UDim.new(0, 6)
	layout.SortOrder = Enum.SortOrder.LayoutOrder
	layout.Parent = buttonContainer

	-- Items list: Name, Label, Cost Text
	local craftableItems = {
		{ Name = "Axe", Label = "Craft Axe", Cost = "1 Stick, 1 Flint, 1 Vine" },
		{ Name = "WoodenWall", Label = "Wooden Wall", Cost = "10 Wood" },
		{ Name = "WoodenSpikes", Label = "Spike Trap", Cost = "15 Wood" },
		{ Name = "Campfire", Label = "Campfire", Cost = "Flint, Tinder, Stick" },
		{ Name = "ChoppingLog", Label = "Chopping Log", Cost = "10 Wood" },
		{ Name = "TimberPile", Label = "Timber Pile", Cost = "Axe + 6 Wood" }
	}

	for i, item in ipairs(craftableItems) do
		local btn = Instance.new("TextButton")
		btn.Name = item.Name
		btn.Text = item.Label .. "   (" .. item.Cost .. ")"
		btn.Font = Enum.Font.SourceSansSemibold
		btn.TextSize = 13
		btn.TextColor3 = Color3.fromRGB(240, 240, 240)
		btn.BackgroundColor3 = Color3.fromRGB(45, 45, 52)
		btn.Size = UDim2.new(1, 0, 0, 32)
		btn.BorderSizePixel = 0
		btn.LayoutOrder = i
		btn.Parent = buttonContainer

		local btnCorner = Instance.new("UICorner")
		btnCorner.CornerRadius = UDim.new(0, 6)
		btnCorner.Parent = btn

		-- Hover effects
		btn.MouseEnter:Connect(function()
			btn.BackgroundColor3 = Color3.fromRGB(60, 60, 70)
		end)
		btn.MouseLeave:Connect(function()
			btn.BackgroundColor3 = Color3.fromRGB(45, 45, 52)
		end)

		-- Button click handler
		btn.MouseButton1Click:Connect(function()
			startPlacement(item.Name)
		end)
	end
	
	-- Helper info label
	local infoLabel = Instance.new("TextLabel")
	infoLabel.Name = "Info"
	infoLabel.Text = "Press [R] to Rotate. [Backspace] to Cancel."
	infoLabel.Font = Enum.Font.SourceSansItalic
	infoLabel.TextSize = 10
	infoLabel.TextColor3 = Color3.fromRGB(150, 150, 160)
	infoLabel.Size = UDim2.new(1, 0, 0, 20)
	infoLabel.Position = UDim2.new(0, 0, 1, -22)
	infoLabel.BackgroundTransparency = 1
	infoLabel.Visible = false
	infoLabel.Parent = frame

	return infoLabel
end

local infoLabel = createUI()

-- Clean up preview model
local function cancelPlacement()
	if previewModel then
		previewModel:Destroy()
		previewModel = nil
	end
	currentStructure = nil
	isPlacing = false
	infoLabel.Visible = false
end

-- Initialize and style the preview model
local function configurePreviewModel(model)
	-- Turn off collision and physics queries so the raycast doesn't hit the blueprint itself
	for _, part in ipairs(model:GetDescendants()) do
		if part:IsA("BasePart") then
			part.CanCollide = false
			part.CanQuery = false
			part.CanTouch = false
			part.Anchored = true
			part.Transparency = 0.5
		end
	end
end

-- Update colors based on validity
local function setPreviewColor(model, color)
	for _, part in ipairs(model:GetDescendants()) do
		if part:IsA("BasePart") then
			part.Color = color
		end
	end
end

-- Start Placement Mode
function startPlacement(structureName)
	cancelPlacement() -- Cancel any existing preview
	
	if structureName == "Axe" then
		PlaceStructureEvent:FireServer("Axe", CFrame.new())
		return
	end
	
	local template = StructuresFolder:FindFirstChild(structureName)
	if not template then
		warn("Cannot place: Template not found in ReplicatedStorage.Structures: " .. structureName)
		return
	end
	
	currentStructure = structureName
	currentRotationY = 0
	isPlacing = true
	infoLabel.Visible = true
	
	-- Create preview instance
	previewModel = template:Clone()
	configurePreviewModel(previewModel)
	previewModel.Parent = workspace
end

-- Raycast to find placement point on ground
local function getPlacementCFrame()
	local mouseLocation = UserInputService:GetMouseLocation()
	local unitRay = Camera:ViewportPointToRay(mouseLocation.X, mouseLocation.Y)
	
	local raycastParams = RaycastParams.new()
	raycastParams.FilterType = Enum.RaycastFilterType.Exclude
	
	-- Exclude player and preview model from raycasting to avoid hits on ourselves
	local filter = {Player.Character}
	if previewModel then table.insert(filter, previewModel) end
	raycastParams.FilterDescendantsInstances = filter
	
	local raycastResult = workspace:Raycast(unitRay.Origin, unitRay.Direction * 200, raycastParams)
	
	local targetPosition = nil
	local normal = Vector3.new(0, 1, 0)
	
	if raycastResult then
		targetPosition = raycastResult.Position
		normal = raycastResult.Normal
	else
		-- Fallback to standard terrain plane if nothing is hit
		targetPosition = unitRay.Origin + unitRay.Direction * 20
	end
	
	-- Calculate orientation aligned with ground surface normal
	local baseCFrame = CFrame.new(targetPosition, targetPosition + normal)
	-- Rotate 90 degrees on X to lay flat, then apply Y rotation offset
	local finalCFrame = baseCFrame * CFrame.Angles(math.rad(90), 0, 0) * CFrame.Angles(0, math.rad(currentRotationY), 0)
	
	return finalCFrame, targetPosition
end

-- Render loop to update preview position
RunService.RenderStepped:Connect(function()
	if not isPlacing or not previewModel or not Player.Character then return end
	
	local hrp = Player.Character:FindFirstChild("HumanoidRootPart")
	if not hrp then return end
	
	local finalCFrame, targetPosition = getPlacementCFrame()
	
	-- Update position
	if previewModel:IsA("Model") then
		previewModel:PivotTo(finalCFrame)
	else
		previewModel.CFrame = finalCFrame
	end
	
	-- Distance Check (Visual indicator)
	local distance = (hrp.Position - targetPosition).Magnitude
	if distance <= MAX_BUILD_REACH then
		setPreviewColor(previewModel, COLOR_VALID)
	else
		setPreviewColor(previewModel, COLOR_INVALID)
	end
end)

-- Handle placement confirmation & rotation
UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if not isPlacing then return end
	
	-- 1. Rotation key [R]
	if input.KeyCode == Enum.KeyCode.R and not gameProcessed then
		currentRotationY = (currentRotationY + ROTATION_STEP) % 360
	
	-- 2. Cancel keys [Backspace]
	elseif input.KeyCode == Enum.KeyCode.Backspace and not gameProcessed then
		cancelPlacement()
		
	-- 3. Mouse Placement Confirmation
	elseif input.UserInputType == Enum.UserInputType.MouseButton1 and not gameProcessed then
		local hrp = Player.Character and Player.Character:FindFirstChild("HumanoidRootPart")
		if not hrp then return end
		
		local finalCFrame, targetPosition = getPlacementCFrame()
		local distance = (hrp.Position - targetPosition).Magnitude
		
		-- Submit request to server if within reach
		if distance <= MAX_BUILD_REACH then
			PlaceStructureEvent:FireServer(currentStructure, finalCFrame)
			cancelPlacement()
		end
		
	-- 4. Right-click to cancel placement
	elseif input.UserInputType == Enum.UserInputType.MouseButton2 then
		cancelPlacement()
	end
end)
