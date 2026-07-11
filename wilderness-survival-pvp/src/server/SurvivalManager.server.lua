-- SurvivalManager: Controls the Day/Night cycle and applies night-time freezing damage
local Lighting = game:GetService("Lighting")
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")

-- Configuration
local CYCLE_DURATION_SECONDS = 240 -- 4 minutes for a full day/night cycle
local FREEZING_TICK_RATE = 2 -- Time in seconds between freeze damage ticks
local FREEZING_DAMAGE = 8 -- Damage per tick
local CAMPFIRE_WARMTH_RADIUS = 12 -- Warmth radius of campfires
local FREEZE_START_HOUR = 18.0 -- 6:00 PM (Night begins)
local FREEZE_END_HOUR = 6.0 -- 6:00 AM (Day begins)

-- Ensure PlacedStructures folder exists
local PlacedStructures = Workspace:FindFirstChild("PlacedStructures")
if not PlacedStructures then
	PlacedStructures = Instance.new("Folder")
	PlacedStructures.Name = "PlacedStructures"
	PlacedStructures.Parent = Workspace
end

-- 1. Day/Night Cycle Loop
task.spawn(function()
	Lighting.ClockTime = 8.0 -- Start at 8:00 AM
	local tickInterval = 0.1
	local incrementPerTick = (24 / CYCLE_DURATION_SECONDS) * tickInterval

	while true do
		task.wait(tickInterval)
		Lighting.ClockTime = (Lighting.ClockTime + incrementPerTick) % 24
	end
end)

-- Helper: Get all active campfires in the workspace
local function getActiveCampfires()
	local campfires = {}
	for _, child in ipairs(PlacedStructures:GetChildren()) do
		if child.Name == "Campfire" then
			local centerPart = child.PrimaryPart or child:FindFirstChildWhichIsA("BasePart")
			if centerPart then
				table.insert(campfires, centerPart)
			end
		end
	end
	return campfires
end

-- Helper: Check if a position is near any campfire
local function isNearCampfire(position, campfires)
	for _, centerPart in ipairs(campfires) do
		local distance = (position - centerPart.Position).Magnitude
		if distance <= CAMPFIRE_WARMTH_RADIUS then
			return true
		end
	end
	return false
end

-- Helper: Check if it is currently night
local function isNightTime()
	local currentTime = Lighting.ClockTime
	return currentTime >= FREEZE_START_HOUR or currentTime <= FREEZE_END_HOUR
end

-- 2. Freezing Damage Loop
task.spawn(function()
	while true do
		task.wait(FREEZING_TICK_RATE)
		
		local isNight = isNightTime()
		local campfires = getActiveCampfires()
		
		for _, player in ipairs(Players:GetPlayers()) do
			local character = player.Character
			local hrp = character and character:FindFirstChild("HumanoidRootPart")
			local humanoid = character and character:FindFirstChildOfClass("Humanoid")
			
			-- Only freeze players who are actively in the match
			local inMatch = player:GetAttribute("InMatch") == true
			
			if hrp and humanoid and humanoid.Health > 0 and inMatch then
				if isNight then
					-- Check if player is near a campfire
					if isNearCampfire(hrp.Position, campfires) then
						player:SetAttribute("IsFreezing", false)
					else
						-- Player is freezing!
						player:SetAttribute("IsFreezing", true)
						humanoid:TakeDamage(FREEZING_DAMAGE)
						print(player.Name .. " is freezing! Taking " .. FREEZING_DAMAGE .. " damage.")
					end
				else
					-- Warm during the day
					player:SetAttribute("IsFreezing", false)
				end
			else
				-- If not spawned or not in match, clear freezing state
				player:SetAttribute("IsFreezing", false)
			end
		end
	end
end)
