-- SwordScript: Server-side weapon damage and friendly-fire verification
local Players = game:GetService("Players")

local Tool = script.Parent
local Handle = Tool:WaitForChild("Handle")

-- Configuration
local SWING_COOLDOWN = 0.6 -- Cooldown between swings in seconds
local DAMAGE_AMOUNT = 20 -- Damage dealt per hit
local SWING_DURATION = 0.35 -- Time window where hits can register during a swing

-- State Variables
local isSwinging = false
local hitDebounces = {} -- Cooldowns for humanoids hit during a single swing

-- Activate the swing
local function onActivated()
	if isSwinging then return end
	isSwinging = true
	hitDebounces = {} -- Reset hit database for this swing
	
	-- Hit detection window
	task.wait(SWING_DURATION)
	isSwinging = false
	task.wait(SWING_COOLDOWN - SWING_DURATION)
end

-- Detect collisions during a swing
local function onTouched(otherPart)
	if not isSwinging then return end
	
	local character = otherPart.Parent
	if not character then return end
	
	local humanoid = character:FindFirstChildOfClass("Humanoid")
	if not humanoid or humanoid.Health <= 0 then return end
	
	-- Verify who is holding the sword
	local attackerCharacter = Tool.Parent
	if not attackerCharacter or attackerCharacter:IsA("Player") then return end -- Tool must be equipped
	
	local attackerPlayer = Players:GetPlayerFromCharacter(attackerCharacter)
	if not attackerPlayer then return end
	
	-- Verify if victim is a player
	local victimPlayer = Players:GetPlayerFromCharacter(character)
	if not victimPlayer then return end
	
	-- Ensure attacker isn't hitting themselves
	if attackerPlayer == victimPlayer then return end
	
	-- Safety check: victim must be actively in the match
	if victimPlayer:GetAttribute("InMatch") ~= true then return end
	
	-- Friendly Fire Check: Compare team attributes
	local attackerTeam = attackerPlayer:GetAttribute("Team")
	local victimTeam = victimPlayer:GetAttribute("Team")
	
	if attackerTeam and victimTeam and attackerTeam == victimTeam then
		return -- Teammates! Cancel damage.
	end
	
	-- Apply damage with debounce per swing to prevent multiple hits in one frame
	if not hitDebounces[humanoid] then
		hitDebounces[humanoid] = true
		humanoid:TakeDamage(DAMAGE_AMOUNT)
		print(attackerPlayer.Name .. " hit " .. victimPlayer.Name .. " for " .. DAMAGE_AMOUNT .. " damage.")
	end
end

Tool.Activated:Connect(onActivated)
Handle.Touched:Connect(onTouched)
