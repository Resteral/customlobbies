-- InventoryManager: Manages player resource inventories
local Players = game:GetService("Players")

local function onPlayerAdded(player)
	-- Create leaderstats folder so values display on the player list in the top right
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player

	-- Wood resource variable
	local wood = Instance.new("IntValue")
	wood.Name = "Wood"
	wood.Value = 0
	wood.Parent = leaderstats

	-- Stone resource variable
	local stone = Instance.new("IntValue")
	stone.Name = "Stone"
	stone.Value = 0
	stone.Parent = leaderstats
	
	print("Initialized inventory leaderstats for player: " .. player.Name)
end

Players.PlayerAdded:Connect(onPlayerAdded)

-- Handle any players who joined before the script ran (useful during playtests)
for _, player in ipairs(Players:GetPlayers()) do
	onPlayerAdded(player)
end
