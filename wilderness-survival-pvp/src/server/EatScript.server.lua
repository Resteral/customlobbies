-- EatScript: Server script to consume food/potions and restore health & hunger
local Players = game:GetService("Players")

local Tool = script.Parent

local function onActivated()
	local character = Tool.Parent
	if not character or character:IsA("Player") then return end -- Tool must be equipped
	
	local player = Players:GetPlayerFromCharacter(character)
	local humanoid = character:FindFirstChildOfClass("Humanoid")
	if not player or not humanoid or humanoid.Health <= 0 then return end
	
	local toolName = Tool.Name
	local hunger = player:GetAttribute("Hunger") or 100
	
	local hungerRestore = 0
	local healthRestore = 0
	
	if toolName == "Berry" then
		hungerRestore = 20
	elseif toolName == "CookedMeat" then
		hungerRestore = 40
		healthRestore = 20
	elseif toolName == "BoiledWater" then
		hungerRestore = 15
		healthRestore = 25
	elseif toolName == "HealingPotion" then
		healthRestore = 50
	end
	
	-- 1. Apply Hunger Restoration
	if hungerRestore > 0 then
		local nextHunger = math.min(100, hunger + hungerRestore)
		player:SetAttribute("Hunger", nextHunger)
	end
	
	-- 2. Apply Health Restoration
	if healthRestore > 0 then
		humanoid.Health = math.min(humanoid.MaxHealth, humanoid.Health + healthRestore)
	end
	
	print(player.Name .. " consumed " .. toolName .. "! Restored " .. hungerRestore .. " Hunger, " .. healthRestore .. " Health.")
	
	-- 3. Consume the tool
	Tool:Destroy()
end

Tool.Activated:Connect(onActivated)
