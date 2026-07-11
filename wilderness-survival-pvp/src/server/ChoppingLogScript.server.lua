-- ChoppingLogScript: Handles extracting sap from wood items dropped on the log stump
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")

local Model = script.Parent
local LogPart = Model:WaitForChild("LogPart")
local ClickDetector = LogPart:WaitForChild("ClickDetector")
local ToolsFolder = ReplicatedStorage:WaitForChild("Tools")
local SapTemplate = ToolsFolder:WaitForChild("Sap")

-- Configuration
local DETECT_RADIUS = 3.5 -- Box X/Z half-size in studs
local DETECT_HEIGHT = 4.0 -- Box Y height in studs

local function onLogClicked(player)
	-- Verify clicker is near the log
	local char = player.Character
	local hrp = char and char:FindFirstChild("HumanoidRootPart")
	if not hrp then return end
	
	local distance = (hrp.Position - LogPart.Position).Magnitude
	if distance > 15 then return end -- Click reach limit
	
	-- Calculate detection box position just above the log surface
	local logTopY = LogPart.Position.Y + (LogPart.Size.Y / 2)
	local boxCenter = Vector3.new(LogPart.Position.X, logTopY + (DETECT_HEIGHT / 2), LogPart.Position.Z)
	local boxSize = Vector3.new(DETECT_RADIUS * 2, DETECT_HEIGHT, DETECT_RADIUS * 2)
	
	-- Overlap checks
	local overlapParams = OverlapParams.new()
	overlapParams.FilterType = Enum.RaycastFilterType.Exclude
	overlapParams.FilterDescendantsInstances = {Model} -- Exclude the log model itself
	
	local overlappingParts = Workspace:GetPartBoundsInBox(CFrame.new(boxCenter), boxSize, overlapParams)
	
	local woodTool = nil
	for _, part in ipairs(overlappingParts) do
		local parent = part.Parent
		if parent and parent:IsA("Tool") then
			local toolName = parent.Name:lower()
			
			-- Acceptable wood items for sap extraction
			if toolName == "stick" or toolName == "branch" or toolName == "bark" or toolName == "wood" or parent:GetAttribute("ResourceType") == "Wood" then
				woodTool = parent
				break
			end
		end
	end
	
	if woodTool then
		-- Consume wood item
		local itemLabel = woodTool.Name
		woodTool:Destroy()
		
		-- Reward Sap tool
		local sap = SapTemplate:Clone()
		sap.Parent = player:WaitForChild("Backpack")
		
		print(player.Name .. " extracted sap from " .. itemLabel .. " using the Chopping Log.")
	else
		print("Could not extract sap: Drop a Stick, Branch, Log, or Bark on top of the log first!")
	end
end

ClickDetector.MouseClick:Connect(onLogClicked)
