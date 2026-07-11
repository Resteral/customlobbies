-- PlacementManager: Manages crafting, placement validation, campfire fuel, cooking, and brewing
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")
local StarterPack = game:GetService("StarterPack")

-- Remote Event & Templates
local NetworkFolder = ReplicatedStorage:WaitForChild("Network")
local PlaceStructureEvent = NetworkFolder:WaitForChild("PlaceStructure")
local StructuresFolder = ReplicatedStorage:WaitForChild("Structures")
local ToolsFolder = ReplicatedStorage:WaitForChild("Tools")

-- Item Templates
local TorchTemplate = ToolsFolder:WaitForChild("Torch")
local CookedMeatTemplate = ToolsFolder:WaitForChild("CookedMeat")
local BoiledWaterTemplate = ToolsFolder:WaitForChild("BoiledWater")
local HealingPotionTemplate = ToolsFolder:WaitForChild("HealingPotion")

-- Configuration
local MAX_BUILD_REACH = 25
local CAMPFIRE_MAX_FUEL = 180 -- Max fuel in seconds
local CAMPFIRE_HEAL_RADIUS = 12
local CAMPFIRE_HEAL_AMOUNT = 5
local HEAL_TICK_RATE = 2
local SPIKE_DAMAGE = 15
local SPIKE_COOLDOWN = 1.0

-- Recipes for leaderstats structures
local LeaderstatsRecipes = {
	WoodenWall = { Wood = 10, Stone = 0 },
	WoodenSpikes = { Wood = 15, Stone = 0 },
	ChoppingLog = { Wood = 10, Stone = 0 },
	TimberPile = { Wood = 6, Stone = 0 } -- Cost: 6 Wood (requires Axe equipped)
}

-- Placed structures folder
local PlacedStructures = Workspace:FindFirstChild("PlacedStructures")
if not PlacedStructures then
	PlacedStructures = Instance.new("Folder")
	PlacedStructures.Name = "PlacedStructures"
	PlacedStructures.Parent = Workspace
end

-- Active Campfires database: [Model] = { Fuel = seconds, Owner = string }
local activeCampfires = {}

-- Helper: Check and consume tools from a player's inventory
local function consumeBackpackTools(player, itemNames)
	local backpack = player:FindFirstChild("Backpack")
	local character = player.Character
	if not backpack then return false end
	
	-- Verify all items exist
	local foundItems = {}
	local targetMatches = {}
	for _, name in ipairs(itemNames) do
		targetMatches[name] = (targetMatches[name] or 0) + 1
	end
	
	for name, countNeeded in pairs(targetMatches) do
		local foundCount = 0
		local items = {}
		
		-- Search backpack
		for _, item in ipairs(backpack:GetChildren()) do
			if item:IsA("Tool") and item.Name == name then
				foundCount = foundCount + 1
				table.insert(items, item)
				if foundCount >= countNeeded then break end
			end
		end
		
		-- Search equipped
		if foundCount < countNeeded and character then
			for _, item in ipairs(character:GetChildren()) do
				if item:IsA("Tool") and item.Name == name then
					foundCount = foundCount + 1
					table.insert(items, item)
					if foundCount >= countNeeded then break end
				end
			end
		end
		
		if foundCount < countNeeded then
			return false -- Insufficient items
		end
		
		foundItems[name] = items
	end
	
	-- Consume items
	for _, itemsList in pairs(foundItems) do
		for _, item in ipairs(itemsList) do
			item:Destroy()
		end
	end
	return true
end

-- Custom Behavior: Spikes damage trap
local function setupSpikeTrap(model, ownerPlayer)
	local hitDebounces = {}
	for _, part in ipairs(model:GetDescendants()) do
		if part:IsA("BasePart") then
			part.Touched:Connect(function(otherPart)
				local character = otherPart.Parent
				local humanoid = character and character:FindFirstChildOfClass("Humanoid")
				if not humanoid or humanoid.Health <= 0 then return end
				if character.Name == ownerPlayer.Name then return end
				
				local now = os.clock()
				if hitDebounces[humanoid] and now < hitDebounces[humanoid] then return end
				
				hitDebounces[humanoid] = now + SPIKE_COOLDOWN
				humanoid:TakeDamage(SPIKE_DAMAGE)
				print(ownerPlayer.Name .. "'s spike trap damaged " .. character.Name)
			end)
		end
	end
end

-- Custom Behavior: Add fuel or ignite a stick on the campfire
local function setupCampfireClick(model)
	local logPart = model:WaitForChild("Part")
	
	local clickDetector = Instance.new("ClickDetector")
	clickDetector.MaxActivationDistance = 15
	clickDetector.Parent = logPart
	
	clickDetector.MouseClick:Connect(function(player)
		local character = player.Character
		if not character then return end
		
		local equippedTool = character:FindFirstChildOfClass("Tool")
		local campfireDetails = activeCampfires[model]
		if not campfireDetails then return end
		
		if equippedTool then
			-- 1. Stick -> Torch
			if equippedTool.Name == "Stick" then
				equippedTool:Destroy()
				local torch = TorchTemplate:Clone()
				torch.Parent = player:WaitForChild("Backpack")
				print(player.Name .. " lit a Stick into a Torch!")
				return
			end
		end
		
		-- 2. Wood -> Refuel fire
		local leaderstats = player:FindFirstChild("leaderstats")
		local woodVal = leaderstats and leaderstats:FindFirstChild("Wood")
		if woodVal and woodVal.Value >= 1 then
			woodVal.Value = woodVal.Value - 1
			campfireDetails.Fuel = math.min(CAMPFIRE_MAX_FUEL, campfireDetails.Fuel + 30)
			print(player.Name .. " fueled the campfire (+30s). Fuel: " .. math.round(campfireDetails.Fuel) .. "s")
		else
			print("Need Wood in leaderstats (or hold a Stick) to interact with campfire.")
		end
	end)
end

-- Campfire Tick: Healing, Fuel Decay, Cooking, and Brewing Loop
task.spawn(function()
	local scanRate = 1.5
	while true do
		task.wait(scanRate)
		
		for campfireModel, details in pairs(activeCampfires) do
			if not campfireModel.Parent then
				activeCampfires[campfireModel] = nil
			else
				-- 1. Fuel Decay
				details.Fuel = details.Fuel - scanRate
				if details.Fuel <= 0 then
					print("Campfire went out.")
					activeCampfires[campfireModel] = nil
					campfireModel:Destroy()
					continue
				end
				
				-- 2. Healing near campfire
				local centerPart = campfireModel:FindFirstChild("Part")
				if centerPart then
					for _, player in ipairs(Players:GetPlayers()) do
						local char = player.Character
						local hrp = char and char:FindFirstChild("HumanoidRootPart")
						local humanoid = char and char:FindFirstChildOfClass("Humanoid")
						
						if hrp and humanoid and humanoid.Health > 0 and humanoid.Health < humanoid.MaxHealth then
							local dist = (hrp.Position - centerPart.Position).Magnitude
							if dist <= CAMPFIRE_HEAL_RADIUS then
								humanoid.Health = math.min(humanoid.MaxHealth, humanoid.Health + (CAMPFIRE_HEAL_AMOUNT * (scanRate / HEAL_TICK_RATE)))
							end
						end
					end
					
					-- 3. Bounding box scan for dropped items (Cooking and Brewing)
					local boxSize = Vector3.new(10, 6, 10)
					local overlapParams = OverlapParams.new()
					overlapParams.FilterType = Enum.RaycastFilterType.Exclude
					overlapParams.FilterDescendantsInstances = {campfireModel}
					
					local parts = Workspace:GetPartBoundsInBox(centerPart.CFrame, boxSize, overlapParams)
					local foundTools = {}
					
					for _, part in ipairs(parts) do
						local parent = part.Parent
						if parent and parent:IsA("Tool") and not foundTools[parent] then
							foundTools[parent] = true
						end
					end
					
					-- Process cooking of RawMeat & Ice
					local saps = {}
					local berries = {}
					
					for tool, _ in pairs(foundTools) do
						local name = tool.Name
						
						-- Cooking RawMeat -> CookedMeat
						if name == "RawMeat" then
							local cookTime = tool:GetAttribute("CookTime") or 0
							cookTime = cookTime + scanRate
							if cookTime >= 4 then
								local cframe = tool.Handle.CFrame
								tool:Destroy()
								local cooked = CookedMeatTemplate:Clone()
								cooked.Handle.CFrame = cframe
								cooked.Parent = Workspace
								print("Cooked Raw Meat into Cooked Meat!")
							else
								tool:SetAttribute("CookTime", cookTime)
							end
						
						-- Melting Ice -> BoiledWater
						elseif name == "Ice" then
							local meltTime = tool:GetAttribute("MeltTime") or 0
							meltTime = meltTime + scanRate
							if meltTime >= 3 then
								local cframe = tool.Handle.CFrame
								tool:Destroy()
								local water = BoiledWaterTemplate:Clone()
								water.Handle.CFrame = cframe
								water.Parent = Workspace
								print("Melted Ice into Boiled Water!")
							else
								tool:SetAttribute("MeltTime", meltTime)
							end
						
						-- Brewing Ingredients
						elseif name == "Sap" then
							table.insert(saps, tool)
						elseif name == "Berry" then
							table.insert(berries, tool)
						end
					end
					
					-- Potion Brewing (requires 1 Sap + 1 Berry nearby)
					if #saps > 0 and #berries > 0 then
						-- Find close pairs
						local sap = saps[1]
						local berry = berries[1]
						
						local dist = (sap.Handle.Position - berry.Handle.Position).Magnitude
						if dist <= 5 then
							local brewTime = sap:GetAttribute("BrewTime") or 0
							brewTime = brewTime + scanRate
							if brewTime >= 5 then
								local cframe = sap.Handle.CFrame
								sap:Destroy()
								berry:Destroy()
								
								local potion = HealingPotionTemplate:Clone()
								potion.Handle.CFrame = cframe
								potion.Parent = Workspace
								print("Brewed Sap and Berry into a Healing Potion!")
							else
								sap:SetAttribute("BrewTime", brewTime)
							end
						end
					end
				end
			end
		end
	end
end)

-- Handle placement requests
local function onPlaceStructure(player, structureName, targetCFrame)
	if not player or not player.Character then return end
	local character = player.Character
	local hrp = character:FindFirstChild("HumanoidRootPart")
	if not hrp then return end
	
	-- 1. Special Tool Crafting: Stick + Flint + Vine = Axe
	if structureName == "Axe" then
		local axeTemplate = StarterPack:FindFirstChild("Axe")
		if not axeTemplate then
			warn("Axe tool template not found in StarterPack!")
			return
		end
		
		-- Consume ingredients
		if consumeBackpackTools(player, { "Stick", "Flint", "Vine" }) then
			local axe = axeTemplate:Clone()
			axe.Parent = player:WaitForChild("Backpack")
			print(player.Name .. " crafted an Axe!")
		else
			warn(player.Name .. " lacks ingredients to craft an Axe (needs 1 Stick, 1 Flint, 1 Vine)")
		end
		return
	end
	
	-- 2. Special Structure Crafting: Flint + Tinder + Stick = Campfire
	if structureName == "Campfire" then
		local template = StructuresFolder:FindFirstChild("Campfire")
		if not template then return end
		
		-- Distance check
		local distance = (hrp.Position - targetCFrame.Position).Magnitude
		if distance > MAX_BUILD_REACH then return end
		
		-- Consume ingredients
		if consumeBackpackTools(player, { "Flint", "Tinder", "Stick" }) then
			local campfire = template:Clone()
			campfire.Parent = PlacedStructures
			campfire:PivotTo(targetCFrame)
			
			-- Register Campfire
			activeCampfires[campfire] = { Fuel = 90, Owner = player.Name }
			setupCampfireClick(campfire)
			print(player.Name .. " placed a Campfire (fueled for 90s).")
		else
			warn(player.Name .. " lacks ingredients for Campfire (needs 1 Flint, 1 Tinder, 1 Stick)")
		end
		return
	end
	
	-- 3. Standard Leaderstats Recipes (Walls, Spikes, Chopping Logs, Timber Piles)
	local recipe = LeaderstatsRecipes[structureName]
	if not recipe then return end
	
	-- Reach check
	local distance = (hrp.Position - targetCFrame.Position).Magnitude
	if distance > MAX_BUILD_REACH then return end
	
	-- Special Condition for Timber Pile: Requires Axe equipped or in backpack
	if structureName == "TimberPile" then
		local backpack = player:FindFirstChild("Backpack")
		local hasAxe = backpack:FindFirstChild("Axe") or character:FindFirstChild("Axe")
		if not hasAxe then
			warn(player.Name .. " cannot build Timber Pile without holding an Axe!")
			return
		end
	end
	
	-- Validate and Deduct leaderstats
	local leaderstats = player:FindFirstChild("leaderstats")
	if not leaderstats then return end
	local woodVal = leaderstats:FindFirstChild("Wood")
	local stoneVal = leaderstats:FindFirstChild("Stone")
	if not woodVal or not stoneVal then return end
	
	if woodVal.Value < recipe.Wood or stoneVal.Value < recipe.Stone then
		warn(player.Name .. " lacks resources to build " .. structureName)
		return
	end
	
	-- Spawn structure
	local template = StructuresFolder:FindFirstChild(structureName)
	if not template then return end
	
	woodVal.Value = woodVal.Value - recipe.Wood
	stoneVal.Value = stoneVal.Value - recipe.Stone
	
	local spawnedModel = template:Clone()
	spawnedModel.Parent = PlacedStructures
	
	for _, part in ipairs(spawnedModel:GetDescendants()) do
		if part:IsA("BasePart") then
			part.Anchored = true
		end
	end
	
	spawnedModel:PivotTo(targetCFrame)
	spawnedModel:SetAttribute("Owner", player.Name)
	
	if structureName == "WoodenSpikes" then
		setupSpikeTrap(spawnedModel, player)
	end
	print(player.Name .. " built a " .. structureName)
end

PlaceStructureEvent.OnServerEvent:Connect(onPlaceStructure)
