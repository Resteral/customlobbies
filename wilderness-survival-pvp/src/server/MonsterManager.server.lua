-- MonsterManager: Controls night spawns, pathfinding chase AI, attacks, and resource drops on death
local Lighting = game:GetService("Lighting")
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Configuration
local MAX_ZOMBIES = 5 -- Max active zombies in the arena at once
local ZOMBIE_SPAWN_INTERVAL = 15 -- Spawn attempt interval in seconds
local ZOMBIE_DAMAGE = 10 -- Damage dealt per hit
local ZOMBIE_ATTACK_COOLDOWN = 1.2 -- Cooldown between attacks in seconds
local ZOMBIE_WALK_SPEED = 10 -- Slow zombie pace (Roblox default is 16)
local ARENA_MIN_X, ARENA_MAX_X = -70, 70
local ARENA_MIN_Z, ARENA_MAX_Z = -70, 70

-- Templates
local ResourcesFolder = ReplicatedStorage:WaitForChild("Resources")
local ZombieTemplate = ResourcesFolder:WaitForChild("Zombie")
local ToolsFolder = ReplicatedStorage:WaitForChild("Tools")
local RawMeatTemplate = ToolsFolder:WaitForChild("RawMeat")

-- Folder for active monsters
local MonsterFolder = Workspace:FindFirstChild("SpawnedMonsters")
if not MonsterFolder then
	MonsterFolder = Instance.new("Folder")
	MonsterFolder.Name = "SpawnedMonsters"
	MonsterFolder.Parent = Workspace
end

-- State Tracker: [Model] = { Thread = thread, LastAttack = timestamp }
local activeZombies = {}

-- Helper: Get ground position using vertical raycast
local function getGroundPosition(x, z)
	local origin = Vector3.new(x, 100, z)
	local direction = Vector3.new(0, -200, 0)
	
	local raycastParams = RaycastParams.new()
	raycastParams.FilterType = Enum.RaycastFilterType.Exclude
	raycastParams.FilterDescendantsInstances = {MonsterFolder, Workspace:FindFirstChild("SpawnedResources")}
	
	local result = Workspace:Raycast(origin, direction, raycastParams)
	if result then
		return result.Position
	end
	return Vector3.new(x, 0, z)
end

-- Helper: Find nearest active player inside the arena
local function getNearestPlayer(zombiePosition)
	local nearestChar = nil
	local nearestHrp = nil
	local minDistance = 100 -- Aggro range in studs
	
	for _, player in ipairs(Players:GetPlayers()) do
		local char = player.Character
		local hrp = char and char:FindFirstChild("HumanoidRootPart")
		local humanoid = char and char:FindFirstChildOfClass("Humanoid")
		
		local inMatch = player:GetAttribute("InMatch") == true
		
		if hrp and humanoid and humanoid.Health > 0 and inMatch then
			local distance = (hrp.Position - zombiePosition).Magnitude
			if distance < minDistance then
				minDistance = distance
				nearestChar = char
				nearestHrp = hrp
			end
		end
	end
	return nearestChar, nearestHrp, minDistance
end

-- Clear all active monsters
local function clearZombies()
	for zombieModel, details in pairs(activeZombies) do
		activeZombies[zombieModel] = nil
		zombieModel:Destroy()
	end
	MonsterFolder:ClearAllChildren()
	print("Cleared all night monsters.")
end

-- AI Brain Loop for a Zombie
local function runZombieAI(zombie)
	local torso = zombie:WaitForChild("Torso")
	local humanoid = zombie:WaitForChild("Humanoid")
	
	-- Setup Attack Cooldown
	local lastAttackTime = 0
	
	while zombie.Parent and humanoid.Health > 0 do
		task.wait(0.5) -- AI tick rate
		
		local nearestChar, nearestHrp, distance = getNearestPlayer(torso.Position)
		
		if nearestHrp and humanoid.Health > 0 then
			-- Walk toward player
			humanoid:MoveTo(nearestHrp.Position)
			
			-- Attack check
			if distance <= 5 then
				local now = os.clock()
				if now - lastAttackTime >= ZOMBIE_ATTACK_COOLDOWN then
					lastAttackTime = now
					local targetHumanoid = nearestChar:FindFirstChildOfClass("Humanoid")
					if targetHumanoid and targetHumanoid.Health > 0 then
						targetHumanoid:TakeDamage(ZOMBIE_DAMAGE)
						print("Zombie attacked " .. nearestChar.Name .. " for " .. ZOMBIE_DAMAGE .. " damage.")
					end
				end
			end
		else
			-- Idle: Walk to a random nearby spot to wander
			if math.random(100) <= 25 then
				local wanderOffset = Vector3.new(math.random(-15, 15), 0, math.random(-15, 15))
				humanoid:MoveTo(torso.Position + wanderOffset)
			end
		end
	end
end

-- Spawn a single zombie
local function spawnZombie()
	local x = math.random(ARENA_MIN_X, ARENA_MAX_X)
	local z = math.random(ARENA_MIN_Z, ARENA_MAX_Z)
	local groundPos = getGroundPosition(x, z)
	
	local zombie = ZombieTemplate:Clone()
	zombie.Parent = MonsterFolder
	zombie:PivotTo(CFrame.new(groundPos + Vector3.new(0, 3, 0)))
	
	local torso = zombie:WaitForChild("Torso")
	local head = zombie:WaitForChild("Head")
	local humanoid = zombie:WaitForChild("Humanoid")
	
	-- Dynamic physics assembly
	torso.Anchored = false
	head.Anchored = false
	
	local weld = Instance.new("WeldConstraint")
	weld.Part0 = torso
	weld.Part1 = head
	weld.Parent = torso
	
	zombie.PrimaryPart = torso
	humanoid.WalkSpeed = ZOMBIE_WALK_SPEED
	
	-- Drop raw meat on death
	humanoid.Died:Connect(function()
		print("Zombie killed!")
		
		-- Spawn raw meat drop
		local drop = RawMeatTemplate:Clone()
		drop.Handle.CFrame = torso.CFrame
		drop.Parent = Workspace
		
		activeZombies[zombie] = nil
		task.wait(1.5)
		zombie:Destroy()
	end)
	
	-- Start AI loop
	local aiThread = task.spawn(runZombieAI, zombie)
	activeZombies[zombie] = { Thread = aiThread }
	print("Spawned a night zombie at " .. tostring(math.round(torso.Position.X)) .. ", " .. tostring(math.round(torso.Position.Z)))
end

-- Main Spawner Loop (Runs infinitely)
task.spawn(function()
	while true do
		task.wait(ZOMBIE_SPAWN_INTERVAL)
		
		-- Determine if it's currently night
		local currentTime = Lighting.ClockTime
		local isNight = currentTime >= 18.0 or currentTime <= 6.0
		
		-- Count active zombies
		local activeCount = 0
		for zombie, _ in pairs(activeZombies) do
			if zombie.Parent and zombie:FindFirstChild("Humanoid") and zombie.Humanoid.Health > 0 then
				activeCount = activeCount + 1
			else
				activeZombies[zombie] = nil -- Clean dead tracking
			end
		end
		
		if isNight then
			if activeCount < MAX_ZOMBIES then
				spawnZombie()
			end
		else
			if activeCount > 0 then
				clearZombies()
			end
		end
	end
end)

-- Monitor game manager round resets to clear zombies
local GameManagerScript = game:GetService("ServerScriptService"):WaitForChild("Server"):WaitForChild("GameManager")
-- We hook clearZombies to clean the arena if a round resets
Workspace:GetPropertyChangedSignal("DistributedGameTime"):Connect(function()
	-- Basic hook to listen if structures folder clears, clean zombies too
	local PlacedStructures = Workspace:FindFirstChild("PlacedStructures")
	if PlacedStructures and #PlacedStructures:GetChildren() == 0 then
		-- If structures reset, clean all monsters
		clearZombies()
	end
end)
