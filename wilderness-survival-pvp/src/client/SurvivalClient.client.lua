-- SurvivalClient: Controls time-of-day HUD display, hunger bars, and freezing visual effects
local Lighting = game:GetService("Lighting")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local Player = Players.LocalPlayer

-- UI Constants
local HUD_BG_COLOR = Color3.fromRGB(30, 30, 35)
local HUD_STROKE_COLOR = Color3.fromRGB(75, 75, 85)
local COLOR_WARM_DAY = Color3.fromRGB(255, 200, 50) -- Yellow
local COLOR_WARM_FIRE = Color3.fromRGB(255, 120, 50) -- Orange
local COLOR_FREEZING = Color3.fromRGB(80, 180, 255) -- Ice Blue
local COLOR_STARVING = Color3.fromRGB(255, 85, 85) -- Red

-- Helper: Convert ClockTime decimal to 12-hour AM/PM string
local function getFormattedTime()
	local totalHours = Lighting.ClockTime
	local hours = math.floor(totalHours)
	local minutes = math.floor((totalHours - hours) * 60)
	
	local ampm = "AM"
	if hours >= 12 then
		ampm = "PM"
	end
	
	local displayHours = hours % 12
	if displayHours == 0 then
		displayHours = 12
	end
	
	return string.format("%02d:%02d %s", displayHours, minutes, ampm)
end

-- Programmatic UI Creation
local function createSurvivalUI()
	local screenGui = Instance.new("ScreenGui")
	screenGui.Name = "SurvivalGui"
	screenGui.ResetOnSpawn = false
	screenGui.Parent = Player:WaitForChild("PlayerGui")

	-- 1. HUD Status Bar at Top Center (Width expanded to fit Hunger)
	local hudFrame = Instance.new("Frame")
	hudFrame.Name = "SurvivalHUD"
	hudFrame.Size = UDim2.new(0, 360, 0, 40)
	hudFrame.Position = UDim2.new(0.5, -180, 0, 15)
	hudFrame.BackgroundColor3 = HUD_BG_COLOR
	hudFrame.BorderSizePixel = 0
	hudFrame.Parent = screenGui

	local hudCorner = Instance.new("UICorner")
	hudCorner.CornerRadius = UDim.new(0, 8)
	hudCorner.Parent = hudFrame

	local hudStroke = Instance.new("UIStroke")
	hudStroke.Color = HUD_STROKE_COLOR
	hudStroke.Thickness = 1.5
	hudStroke.Parent = hudFrame

	-- Time Label
	local timeLabel = Instance.new("TextLabel")
	timeLabel.Name = "TimeDisplay"
	timeLabel.Size = UDim2.new(0.33, -10, 1, 0)
	timeLabel.Position = UDim2.new(0, 10, 0, 0)
	timeLabel.BackgroundTransparency = 1
	timeLabel.Text = "Time: --:--"
	timeLabel.Font = Enum.Font.SourceSansBold
	timeLabel.TextSize = 13
	timeLabel.TextColor3 = Color3.fromRGB(240, 240, 240)
	timeLabel.TextXAlignment = Enum.TextXAlignment.Left
	timeLabel.Parent = hudFrame

	-- Hunger Label
	local hungerLabel = Instance.new("TextLabel")
	hungerLabel.Name = "HungerDisplay"
	hungerLabel.Size = UDim2.new(0.33, 0, 1, 0)
	hungerLabel.Position = UDim2.new(0.33, 0, 0, 0)
	hungerLabel.BackgroundTransparency = 1
	hungerLabel.Text = "🍗 Hunger: 100%"
	hungerLabel.Font = Enum.Font.SourceSansBold
	hungerLabel.TextSize = 13
	hungerLabel.TextColor3 = Color3.fromRGB(85, 255, 127) -- Green by default
	timeLabel.TextXAlignment = Enum.TextXAlignment.Center
	hungerLabel.Parent = hudFrame

	-- Status Label
	local statusLabel = Instance.new("TextLabel")
	statusLabel.Name = "StatusDisplay"
	statusLabel.Size = UDim2.new(0.33, -10, 1, 0)
	statusLabel.Position = UDim2.new(0.66, 0, 0, 0)
	statusLabel.BackgroundTransparency = 1
	statusLabel.Text = "☀️ WARM"
	statusLabel.Font = Enum.Font.SourceSansBold
	statusLabel.TextSize = 13
	statusLabel.TextColor3 = COLOR_WARM_DAY
	statusLabel.TextXAlignment = Enum.TextXAlignment.Right
	statusLabel.Parent = hudFrame

	-- 2. Fullscreen Frost Vignette (Flashes/glows blue when freezing)
	local frostBorder = Instance.new("Frame")
	frostBorder.Name = "FrostBorder"
	frostBorder.Size = UDim2.new(1, 0, 1, 0)
	frostBorder.Position = UDim2.new(0, 0, 0, 0)
	frostBorder.BackgroundTransparency = 1
	frostBorder.Visible = false
	frostBorder.Parent = screenGui

	local frostStroke = Instance.new("UIStroke")
	frostStroke.Color = COLOR_FREEZING
	frostStroke.Thickness = 0
	frostStroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
	frostStroke.Parent = frostBorder

	return timeLabel, hungerLabel, statusLabel, frostBorder, frostStroke
end

local timeLabel, hungerLabel, statusLabel, frostBorder, frostStroke = createSurvivalUI()

-- Update HUD values
local function updateHUD()
	timeLabel.Text = "🕒 " .. getFormattedTime()
	
	local isFreezing = Player:GetAttribute("IsFreezing") == true
	local inMatch = Player:GetAttribute("InMatch") == true
	local hunger = Player:GetAttribute("Hunger") or 100
	
	if not inMatch then
		statusLabel.Text = "💤 LOBBY"
		statusLabel.TextColor3 = Color3.fromRGB(180, 180, 180)
		hungerLabel.Text = "🍗 Hunger: --%"
		hungerLabel.TextColor3 = Color3.fromRGB(180, 180, 180)
		frostBorder.Visible = false
		return
	end
	
	-- 1. Update Hunger display & color
	hungerLabel.Text = "🍗 Hunger: " .. hunger .. "%"
	if hunger <= 0 then
		hungerLabel.TextColor3 = COLOR_STARVING
	elseif hunger < 35 then
		hungerLabel.TextColor3 = Color3.fromRGB(255, 170, 0) -- Orange
	else
		hungerLabel.TextColor3 = Color3.fromRGB(85, 255, 127) -- Green
	end
	
	-- 2. Update Status & Frost Glow
	if isFreezing then
		statusLabel.Text = "❄️ FREEZING!"
		statusLabel.TextColor3 = COLOR_FREEZING
		frostBorder.Visible = true
	elseif hunger <= 0 then
		statusLabel.Text = "💀 STARVING!"
		statusLabel.TextColor3 = COLOR_STARVING
		frostBorder.Visible = false
	else
		-- Determine if warm due to day or campfire
		local currentTime = Lighting.ClockTime
		local isNight = currentTime >= 18.0 or currentTime <= 6.0
		
		if isNight then
			statusLabel.Text = "🔥 WARM"
			statusLabel.TextColor3 = COLOR_WARM_FIRE
		else
			statusLabel.Text = "☀️ WARM"
			statusLabel.TextColor3 = COLOR_WARM_DAY
		end
		frostBorder.Visible = false
	end
end

-- Render loops for updating HUD and animating the frost border pulse
Lighting:GetPropertyChangedSignal("ClockTime"):Connect(updateHUD)
Player:GetAttributeChangedSignal("IsFreezing"):Connect(updateHUD)
Player:GetAttributeChangedSignal("InMatch"):Connect(updateHUD)
Player:GetAttributeChangedSignal("Hunger"):Connect(updateHUD)

-- Initial run
updateHUD()

-- Icy screen pulse animation
local pulseDirection = 1
local thickness = 10

RunService.RenderStepped:Connect(function(dt)
	if frostBorder.Visible then
		thickness = thickness + (dt * 15 * pulseDirection)
		if thickness > 22 then
			thickness = 22
			pulseDirection = -1
		elseif thickness < 10 then
			thickness = 10
			pulseDirection = 1
		end
		frostStroke.Thickness = thickness
	end
end)
