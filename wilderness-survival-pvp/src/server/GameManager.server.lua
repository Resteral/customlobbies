-- GameManager: Handles Lobby -> Match -> Win Sequence, Dynamic Spawning, and PvP Team Combat
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Configuration
local MIN_PLAYERS = 1 -- Minimum players needed to start a match (set to 1 for solo testing)
local INTERMISSION_TIME = 15 -- Time in seconds between rounds
local MATCH_DURATION = 300 -- 5 minutes max match time
local LOBBY_SPAWN = Workspace:WaitForChild("LobbySpawn")
local SPAWNS_FOLDER = Workspace:WaitForChild("Spawns")

-- Network
local Network = ReplicatedStorage:WaitForChild("Network")
local JoinGameEvent = Network:WaitForChild("JoinGame")

-- Split spawn folders
local RedSpawnsFolder = SPAWNS_FOLDER:WaitForChild("RedSpawns")
local BlueSpawnsFolder = SPAWNS_FOLDER:WaitForChild("BlueSpawns")

-- Resource Spawner Constants
local ARENA_MIN_X = -70
local ARENA_MAX_X = 70
local ARENA_MIN_Z = -70
local ARENA_MAX_Z = 70
local TREE_SPAWN_COUNT = 18
local ROCK_SPAWN_COUNT = 12
local BERRYBUSH_SPAWN_COUNT = 10 -- Number of berry bushes to spawn

-- Folder References
local ResourcesFolder = ReplicatedStorage:WaitForChild("Resources")
local TreeTemplate = ResourcesFolder:WaitForChild("Tree")
local RockTemplate = ResourcesFolder:WaitForChild("Rock")
local BerryBushTemplate = ResourcesFolder:WaitForChild("BerryBush")
local ToolsFolder = ReplicatedStorage:WaitForChild("Tools")
local SwordTemplate = ToolsFolder:WaitForChild("WoodenSword")

-- State Variables
local InProgress = false
local ActivePlayers = {}

-- Helper: Freeze or unfreeze a character
local function setCharacterFrozen(character, frozen)
	local humanoid = character and character:FindFirstChildOfClass("Humanoid")
	if humanoid then
		humanoid.WalkSpeed = frozen and 0 or 16
		humanoid.JumpPower = frozen and 0 or 50
	end
end

-- Utility: Teleport player safely
local function teleportPlayer(player, targetPart)
	local character = player.Character
	if character and character:FindFirstChild("HumanoidRootPart") then
		character.HumanoidRootPart.CFrame = targetPart.CFrame + Vector3.new(0, 3, 0)
	end
end

-- Helper: Strip match weapons and food items from player
local function stripWeapons(player)
	-- Remove from backpack
	local backpack = player:FindFirstChild("Backpack")
	if backpack then
		for _, item in ipairs(backpack:GetChildren()) do
			if item:IsA("Tool") and (item.Name == "WoodenSword" or item.Name == "Berry") then
				item:Destroy()
			end
		end
	end
	-- Remove from equipped character
	local character = player.Character
	if character then
		for _, item in ipairs(character:GetChildren()) do
			if item:IsA("Tool") and (item.Name == "WoodenSword" or item.Name == "Berry") then
				item:Destroy()
			end
		end
	end
end

-- Helper: Get ground position using vertical raycast
local function getGroundPosition(x, z)
	local origin = Vector3.new(x, 100, z)
	local direction = Vector3.new(0, -200, 0)
	
	local raycastParams = RaycastParams.new()
	raycastParams.FilterType = Enum.RaycastFilterType.Exclude
	
	local filter = {}
	for _, player in ipairs(Players:GetPlayers()) do
		if player.Character then table.insert(filter, player.Character) end
	end
	table.insert(filter, SPAWNS_FOLDER)
	table.insert(filter, LOBBY_SPAWN)
	
	local spawnedFolder = Workspace:FindFirstChild("SpawnedResources")
	if spawnedFolder then table.insert(filter, spawnedFolder) end
	
	raycastParams.FilterDescendantsInstances = filter
	
	local result = Workspace:Raycast(origin, direction, raycastParams)
	if result then
		return result.Position
	end
	return Vector3.new(x, 0, z)
end

-- Clear spawned resources and player-built structures
local function clearResources()
	local spawnedFolder = Workspace:FindFirstChild("SpawnedResources")
	if spawnedFolder then
		spawnedFolder:ClearAllChildren()
	end
	
	local placedStructures = Workspace:FindFirstChild("PlacedStructures")
	if placedStructures then
		placedStructures:ClearAllChildren()
	end
	print("Cleared round resources and structures.")
end

-- Spawn trees, rocks, and berry bushes dynamically
local function spawnResources()
	local spawnedFolder = Workspace:FindFirstChild("SpawnedResources")
	if not spawnedFolder then
		spawnedFolder = Instance.new("Folder")
		spawnedFolder.Name = "SpawnedResources"
		spawnedFolder.Parent = Workspace
	end
	
	-- 1. Spawn Trees
	for i = 1, TREE_SPAWN_COUNT do
		local x = math.random(ARENA_MIN_X, ARENA_MAX_X)
		local z = math.random(ARENA_MIN_Z, ARENA_MAX_Z)
		local groundPos = getGroundPosition(x, z)
		
		local tree = TreeTemplate:Clone()
		tree.Parent = spawnedFolder
		
		local size = tree:GetExtentsSize()
		local spawnPos = groundPos + Vector3.new(0, size.Y / 2, 0)
		tree:PivotTo(CFrame.new(spawnPos))
	end
	
	-- 2. Spawn Rocks
	for i = 1, ROCK_SPAWN_COUNT do
		local x = math.random(ARENA_MIN_X, ARENA_MAX_X)
		local z = math.random(ARENA_MIN_Z, ARENA_MAX_Z)
		local groundPos = getGroundPosition(x, z)
		
		local rock = RockTemplate:Clone()
		rock.Parent = spawnedFolder
		
		local size = rock:GetExtentsSize()
		local spawnPos = groundPos + Vector3.new(0, size.Y / 2, 0)
		rock:PivotTo(CFrame.new(spawnPos))
	end

	-- 3. Spawn Berry Bushes
	for i = 1, BERRYBUSH_SPAWN_COUNT do
		local x = math.random(ARENA_MIN_X, ARENA_MAX_X)
		local z = math.random(ARENA_MIN_Z, ARENA_MAX_Z)
		local groundPos = getGroundPosition(x, z)
		
		local bush = BerryBushTemplate:Clone()
		bush.Parent = spawnedFolder
		
		local size = bush:GetExtentsSize()
		local spawnPos = groundPos + Vector3.new(0, size.Y / 2, 0)
		bush:PivotTo(CFrame.new(spawnPos))
	end
	
	print("Spawned trees, rocks, and berry bushes at random locations.")
end

-- Reset everything and bring players back to Lobby
local function resetMatch()
	InProgress = false
	ActivePlayers = {}
	print("Resetting match. Teleporting players back to Lobby...")
	
	clearResources()
	
	for _, player in ipairs(Players:GetPlayers()) do
		player:SetAttribute("InMatch", false)
		player:SetAttribute("IsFreezing", false)
		player:SetAttribute("Team", nil) -- Remove team tag
		player:SetAttribute("Hunger", 100) -- Reset hunger
		
		stripWeapons(player)
		teleportPlayer(player, LOBBY_SPAWN)
	end
end

-- Check if the match is over (Team Win condition check)
local function checkMatchStatus()
	if not InProgress then return end
	
	local teamsAlive = {}
	local aliveCount = 0
	local survivingPlayer = nil
	local winningTeam = nil
	
	-- Collect remaining players and their teams
	for player, isAlive in pairs(ActivePlayers) do
		if isAlive and player.Parent == Players then
			aliveCount = aliveCount + 1
			survivingPlayer = player
			local team = player:GetAttribute("Team") or "Solo"
			teamsAlive[team] = true
		end
	end
	
	-- Count distinct teams remaining
	local activeTeamsCount = 0
	for team, _ in pairs(teamsAlive) do
		activeTeamsCount = activeTeamsCount + 1
		winningTeam = team
	end
	
	-- Win Condition: Only 1 team (or 0 if draw) left alive
	if activeTeamsCount <= 1 then
		InProgress = false
		if activeTeamsCount == 1 then
			if winningTeam == "Solo" and survivingPlayer then
				print("Winner of the match: " .. survivingPlayer.Name)
			else
				print("Winning Team: " .. tostring(winningTeam) .. " Team!")
			end
		else
			print("Match ended in a draw! No survivors.")
		end
		
		task.wait(3)
		resetMatch()
	end
end

-- Start the Match
local function startMatch()
	if InProgress then return end
	InProgress = true
	ActivePlayers = {}
	
	local currentPlayers = Players:GetPlayers()
	local spawnParts = SPAWNS_FOLDER:GetChildren()
	
	if #spawnParts == 0 then
		warn("No spawn parts found in Workspace.Spawns folder!")
		InProgress = false
		return
	end
	
	clearResources()
	spawnResources()
	
	print("Starting match! Distributing teams and teleporing players...")
	
	for i, player in ipairs(currentPlayers) do
		ActivePlayers[player] = true
		player:SetAttribute("InMatch", true)
		player:SetAttribute("Hunger", 100) -- Initialize hunger at 100
		
		-- Sort players into Red and Blue Teams (Red for odd indices, Blue for even)
		local teamName = (i % 2 == 1) and "Red" or "Blue"
		player:SetAttribute("Team", teamName)
		print(player.Name .. " assigned to " .. teamName .. " Team.")
		
		-- Give Weapon
		stripWeapons(player)
		local sword = SwordTemplate:Clone()
		sword.Parent = player:WaitForChild("Backpack")
		
		-- Teleport player to their team's spawn folder
		local teamFolder = (teamName == "Red") and RedSpawnsFolder or BlueSpawnsFolder
		local teamSpawns = teamFolder:GetChildren()
		local spawnPart = teamSpawns[math.random(1, #teamSpawns)]
		teleportPlayer(player, spawnPart)
		
		-- Listen for player death
		local character = player.Character or player.CharacterAdded:Wait()
		local humanoid = character:WaitForChild("Humanoid")
		
		humanoid.Died:Connect(function()
			if ActivePlayers[player] then
				ActivePlayers[player] = false
				player:SetAttribute("InMatch", false)
				player:SetAttribute("IsFreezing", false)
				
				stripWeapons(player)
				print(player.Name .. " has been eliminated!")
				checkMatchStatus()
			end
		end)
	end
	
	-- Setup a match timer to prevent infinite matches
	task.spawn(function()
		local elapsed = 0
		while InProgress and elapsed < MATCH_DURATION do
			task.wait(1)
			elapsed = elapsed + 1
		end
		if InProgress then
			print("Time limit reached!")
			resetMatch()
		end
	end)
end

-- Main Game Loop
task.spawn(function()
	while true do
		local playersList = Players:GetPlayers()
		if #playersList >= MIN_PLAYERS and not InProgress then
			print("Intermission starting... " .. INTERMISSION_TIME .. " seconds remaining.")
			task.wait(INTERMISSION_TIME)
			
			if #Players:GetPlayers() >= MIN_PLAYERS then
				startMatch()
			else
				print("Not enough players to start. Resetting intermission.")
			end
		else
			if not InProgress then
				print("Waiting for at least " .. MIN_PLAYERS .. " players to start...")
				task.wait(5)
			end
		end
		task.wait(1)
	end
end)

-- Handle players leaving the game mid-match
Players.PlayerRemoving:Connect(function(player)
	if ActivePlayers[player] then
		ActivePlayers[player] = false
		print(player.Name .. " disconnected during the match.")
		checkMatchStatus()
	end
end)

-- Freeze character while player is in the Main Menu
Players.PlayerAdded:Connect(function(player)
	player:SetAttribute("InMenu", true)
	
	-- Freeze on first spawn
	player.CharacterAdded:Connect(function(character)
		if player:GetAttribute("InMenu") then
			task.wait() -- wait one frame for humanoid to initialize
			setCharacterFrozen(character, true)
		end
	end)
end)

-- Handle JoinGame event fired by MenuClient
JoinGameEvent.OnServerEvent:Connect(function(player)
	if not player:GetAttribute("InMenu") then return end
	
	player:SetAttribute("InMenu", false)
	
	local character = player.Character
	if character then
		setCharacterFrozen(character, false)
	end
	
	-- Teleport to lobby spawn to await the next match
	teleportPlayer(player, LOBBY_SPAWN)
	print(player.Name .. " joined from main menu and is now in the Lobby.")
end)
