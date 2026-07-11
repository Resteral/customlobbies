-- HungerManager: Manages player hunger levels and starvation damage
local Players = game:GetService("Players")

-- Configuration
local HUNGER_DECREASE_RATE = 5 -- Interval in seconds to reduce hunger
local HUNGER_DECREASE_AMOUNT = 2 -- Hunger lost per interval
local STARVE_TICK_RATE = 2 -- Time in seconds between starvation damage ticks
local STARVE_DAMAGE = 5 -- Damage dealt when hunger is 0

-- Initialize hunger attribute when player joins
local function onPlayerAdded(player)
	player:SetAttribute("Hunger", 100)
end

Players.PlayerAdded:Connect(onPlayerAdded)

for _, player in ipairs(Players:GetPlayers()) do
	onPlayerAdded(player)
end

-- 1. Hunger Depletion Loop
task.spawn(function()
	while true do
		task.wait(HUNGER_DECREASE_RATE)
		
		for _, player in ipairs(Players:GetPlayers()) do
			local inMatch = player:GetAttribute("InMatch") == true
			
			if inMatch then
				local currentHunger = player:GetAttribute("Hunger") or 100
				local nextHunger = math.max(0, currentHunger - HUNGER_DECREASE_AMOUNT)
				player:SetAttribute("Hunger", nextHunger)
			else
				-- Keep hunger full in the lobby
				player:SetAttribute("Hunger", 100)
			end
		end
	end
end)

-- 2. Starvation Damage Loop
task.spawn(function()
	while true do
		task.wait(STARVE_TICK_RATE)
		
		for _, player in ipairs(Players:GetPlayers()) do
			local inMatch = player:GetAttribute("InMatch") == true
			local hunger = player:GetAttribute("Hunger") or 100
			
			if inMatch and hunger <= 0 then
				local char = player.Character
				local humanoid = char and char:FindFirstChildOfClass("Humanoid")
				
				if humanoid and humanoid.Health > 0 then
					humanoid:TakeDamage(STARVE_DAMAGE)
					print(player.Name .. " is starving! Taking " .. STARVE_DAMAGE .. " damage.")
				end
			end
		end
	end
end)
