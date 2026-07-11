--!strict
-- DrugController: handles drug visual effects (screen blur, colour correction,
-- hallucination distortion) and a HUD timer bar showing effect duration.

local Players         = game:GetService("Players")
local TweenService    = game:GetService("TweenService")
local RunService      = game:GetService("RunService")

local Shared   = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Remotes  = require(Shared.Remotes)
local DrugData = require(Shared.Data.Drugs)

local player    = Players.LocalPlayer
local camera    = workspace.CurrentCamera

-- ─────────────────────────────────────────────────────────────────────────────
-- Build the drug effect GUI
-- ─────────────────────────────────────────────────────────────────────────────
local screenGui    = Instance.new("ScreenGui")
screenGui.Name     = "DrugEffectGui"
screenGui.ResetOnSpawn = false
screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
screenGui.Parent   = player.PlayerGui

-- Vignette overlay (darkens edges)
local vignette     = Instance.new("ImageLabel")
vignette.Name      = "Vignette"
vignette.Size      = UDim2.fromScale(1, 1)
vignette.BackgroundTransparency = 1
vignette.Image     = "rbxasset://textures/ui/VignetteImageLabel.png"
vignette.ImageTransparency = 1
vignette.ScaleType = Enum.ScaleType.Stretch
vignette.Parent    = screenGui

-- Effect label (drug name + timer)
local effectFrame  = Instance.new("Frame")
effectFrame.Name   = "EffectFrame"
effectFrame.Size   = UDim2.new(0, 260, 0, 54)
effectFrame.Position = UDim2.new(0.5, -130, 0, 12)
effectFrame.BackgroundColor3 = Color3.fromRGB(15, 15, 20)
effectFrame.BackgroundTransparency = 0.25
effectFrame.BorderSizePixel = 0
effectFrame.Visible = false
effectFrame.Parent  = screenGui

local uiCorner = Instance.new("UICorner")
uiCorner.CornerRadius = UDim.new(0, 10)
uiCorner.Parent = effectFrame

local drugLabel = Instance.new("TextLabel")
drugLabel.Name  = "DrugLabel"
drugLabel.Size  = UDim2.new(1, -10, 0.5, 0)
drugLabel.Position = UDim2.new(0, 10, 0, 0)
drugLabel.BackgroundTransparency = 1
drugLabel.TextColor3 = Color3.fromRGB(255, 220, 80)
drugLabel.Font = Enum.Font.GothamBold
drugLabel.TextSize = 15
drugLabel.TextXAlignment = Enum.TextXAlignment.Left
drugLabel.Parent = effectFrame

local timerLabel = Instance.new("TextLabel")
timerLabel.Name  = "TimerLabel"
timerLabel.Size  = UDim2.new(1, -10, 0.5, 0)
timerLabel.Position = UDim2.new(0, 10, 0.5, 0)
timerLabel.BackgroundTransparency = 1
timerLabel.TextColor3 = Color3.fromRGB(180, 180, 180)
timerLabel.Font = Enum.Font.Gotham
timerLabel.TextSize = 12
timerLabel.TextXAlignment = Enum.TextXAlignment.Left
timerLabel.Parent = effectFrame

-- Progress bar background
local barBg = Instance.new("Frame")
barBg.Name   = "BarBg"
barBg.Size   = UDim2.new(1, 0, 0, 4)
barBg.Position = UDim2.new(0, 0, 1, -4)
barBg.BackgroundColor3 = Color3.fromRGB(40, 40, 50)
barBg.BorderSizePixel  = 0
barBg.Parent = effectFrame

local barFill = Instance.new("Frame")
barFill.Name  = "BarFill"
barFill.Size  = UDim2.new(1, 0, 1, 0)
barFill.BackgroundColor3 = Color3.fromRGB(255, 180, 40)
barFill.BorderSizePixel  = 0
barFill.Parent = barBg

-- Colour correction for hallucination effect
local colourCorrection = Instance.new("ColorCorrectionEffect")
colourCorrection.Name       = "DrugColorCorrection"
colourCorrection.Saturation = 0
colourCorrection.Brightness = 0
colourCorrection.Contrast   = 0
colourCorrection.TintColor  = Color3.new(1, 1, 1)
colourCorrection.Parent = camera

-- Blur effect
local blur       = Instance.new("BlurEffect")
blur.Name        = "DrugBlur"
blur.Size        = 0
blur.Parent      = camera

-- ─────────────────────────────────────────────────────────────────────────────
-- State
-- ─────────────────────────────────────────────────────────────────────────────
local activeDrugId  : string? = nil
local effectEndTime : number  = 0
local isHallucinating = false
local hallucinationConn: RBXScriptConnection? = nil

-- ─────────────────────────────────────────────────────────────────────────────
-- Helpers
-- ─────────────────────────────────────────────────────────────────────────────
local function tweenProperty(obj: Instance, props: {[string]: any}, duration: number)
	TweenService:Create(obj, TweenInfo.new(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), props):Play()
end

local function stopHallucination()
	isHallucinating = false
	if hallucinationConn then
		hallucinationConn:Disconnect()
		hallucinationConn = nil
	end
	tweenProperty(colourCorrection, {
		Saturation = 0,
		Contrast   = 0,
		TintColor  = Color3.new(1, 1, 1),
	}, 2)
	tweenProperty(blur, { Size = 0 }, 2)
end

local function startHallucination()
	if isHallucinating then return end
	isHallucinating = true
	-- Oscillate colour and blur over time
	local t = 0
	hallucinationConn = RunService.Heartbeat:Connect(function(dt)
		t += dt
		colourCorrection.Saturation = 0.6 + math.sin(t * 0.8) * 0.4
		colourCorrection.Contrast   = 0.2 + math.abs(math.sin(t * 0.5)) * 0.3
		colourCorrection.TintColor  = Color3.fromHSV((t * 0.05) % 1, 0.5, 1)
		blur.Size                   = 8 + math.sin(t * 1.5) * 6
	end)
end

local function clearEffects()
	activeDrugId  = nil
	effectEndTime = 0
	stopHallucination()
	tweenProperty(vignette, { ImageTransparency = 1 }, 1.5)
	effectFrame.Visible = false
	tweenProperty(blur, { Size = 0 }, 1.5)
end

local function applyEffects(drugId: string, effectsData: any, duration: number)
	activeDrugId  = drugId
	effectEndTime = os.clock() + duration

	local drug = DrugData[drugId]
	local drugName = drug and drug.Name or drugId

	drugLabel.Text  = "🧪 " .. drugName
	effectFrame.Visible = true

	-- Vignette colour based on tier
	local tier = drug and drug.Tier or 1
	local vigColour = if tier == 1 then Color3.fromRGB(0, 200, 80)
		elseif tier == 2 then Color3.fromRGB(220, 120, 0)
		else Color3.fromRGB(200, 0, 0)

	tweenProperty(vignette, { ImageTransparency = 0.55 }, 0.8)
	vignette.ImageColor3 = vigColour
	barFill.BackgroundColor3 = vigColour

	if effectsData and effectsData.Hallucinate then
		startHallucination()
	end
end

-- ─────────────────────────────────────────────────────────────────────────────
-- RenderStepped: update timer bar
-- ─────────────────────────────────────────────────────────────────────────────
RunService.RenderStepped:Connect(function()
	if not activeDrugId then return end
	local remaining = math.max(0, effectEndTime - os.clock())
	local total     = (DrugData[activeDrugId] and DrugData[activeDrugId].Effects.Duration) or 1
	local fraction  = remaining / total

	barFill.Size = UDim2.new(fraction, 0, 1, 0)
	timerLabel.Text = string.format("⏱ %.1fs remaining", remaining)

	if remaining <= 0 then
		clearEffects()
	end
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- Remote handler
-- ─────────────────────────────────────────────────────────────────────────────
Remotes.DrugEffectSync:Connect(function(drugId, effectsData, duration)
	if drugId == nil or duration == 0 then
		clearEffects()
	else
		applyEffects(drugId :: string, effectsData, duration :: number)
	end
end)

return {}
