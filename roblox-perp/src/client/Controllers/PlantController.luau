--!strict
-- PlantController: the weed-plucking minigame UI.
-- Walk up to the WeedPlant in Workspace → press E → harvest buds!
-- Bud positions are drawn on a procedural plant canvas using rotated frames.

local Players         = game:GetService("Players")
local TweenService    = game:GetService("TweenService")
local RunService      = game:GetService("RunService")

local Shared   = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Remotes  = require(Shared.Remotes)

local player = Players.LocalPlayer

-- ─────────────────────────────────────────────────────────────────────────────
-- Constants
-- ─────────────────────────────────────────────────────────────────────────────
local BUD_SIZE   = 38   -- diameter of bud buttons
local GLOW_SIZE  = 56   -- diameter of outer glow rings
local CANVAS_W   = 300
local CANVAS_H   = 300

-- Bud center pixel positions within the 300×300 canvas (plant silhouette)
local BUD_POSITIONS = {
	{ x = 150, y =  35 },  -- 1 top
	{ x =  75, y =  78 },  -- 2 upper-left
	{ x = 225, y =  78 },  -- 3 upper-right
	{ x =  42, y = 148 },  -- 4 mid-left
	{ x = 258, y = 148 },  -- 5 mid-right
	{ x =  70, y = 208 },  -- 6 lower-left
	{ x = 230, y = 208 },  -- 7 lower-right
	{ x = 150, y = 248 },  -- 8 lower-center (drooping bud)
}

-- Stem connection points: buds branch from these Y-positions on the stem (x=150)
local BRANCH_CONNECT_Y = {
	[1] = 82,   -- top bud
	[2] = 90,   [3] = 90,    -- upper pair
	[4] = 152,  [5] = 152,   -- mid pair
	[6] = 208,  [7] = 208,   -- lower pair
	[8] = 255,               -- drooping bud
}

-- ─────────────────────────────────────────────────────────────────────────────
-- ScreenGui scaffold
-- ─────────────────────────────────────────────────────────────────────────────
local screenGui = Instance.new("ScreenGui")
screenGui.Name            = "PlantMinigame"
screenGui.ResetOnSpawn    = false
screenGui.ZIndexBehavior  = Enum.ZIndexBehavior.Sibling
screenGui.Enabled         = false
screenGui.Parent          = player.PlayerGui

-- Dark backdrop
local backdrop = Instance.new("Frame")
backdrop.Size                    = UDim2.fromScale(1, 1)
backdrop.BackgroundColor3        = Color3.fromRGB(0, 0, 0)
backdrop.BackgroundTransparency  = 0.50
backdrop.BorderSizePixel         = 0
backdrop.Parent                  = screenGui

-- Main card
local card = Instance.new("Frame")
card.Name             = "Card"
card.AnchorPoint      = Vector2.new(0.5, 0.5)
card.Size             = UDim2.new(0, 500, 0, 570)
card.Position         = UDim2.new(0.5, 0, 0.5, 0)
card.BackgroundColor3 = Color3.fromRGB(8, 18, 8)
card.BorderSizePixel  = 0
card.Parent           = screenGui

do
	local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(0, 16); c.Parent = card
	local s = Instance.new("UIStroke"); s.Color = Color3.fromRGB(35, 150, 35); s.Thickness = 1.5; s.Parent = card
end

-- ── Header ────────────────────────────────────────────────────────────────────
local header = Instance.new("Frame")
header.Size             = UDim2.new(1, 0, 0, 54)
header.BackgroundColor3 = Color3.fromRGB(14, 34, 14)
header.BorderSizePixel  = 0
header.Parent           = card

do
	local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(0, 16); c.Parent = header
	-- Cover the bottom-two rounded corners of header so it looks flush
	local fix = Instance.new("Frame")
	fix.Size = UDim2.new(1, 0, 0.5, 0); fix.Position = UDim2.new(0, 0, 0.5, 0)
	fix.BackgroundColor3 = Color3.fromRGB(14, 34, 14); fix.BorderSizePixel = 0; fix.Parent = header
end

local titleLabel = Instance.new("TextLabel")
titleLabel.Size   = UDim2.new(1, -120, 1, 0)
titleLabel.Position = UDim2.new(0, 16, 0, 0)
titleLabel.BackgroundTransparency = 1
titleLabel.Text   = "🌿  Weed Plant — Harvest!"
titleLabel.TextColor3 = Color3.fromRGB(60, 220, 80)
titleLabel.Font   = Enum.Font.GothamBold
titleLabel.TextSize   = 17
titleLabel.TextXAlignment = Enum.TextXAlignment.Left
titleLabel.Parent = header

local timerLabel = Instance.new("TextLabel")
timerLabel.Name   = "Timer"
timerLabel.AnchorPoint = Vector2.new(1, 0.5)
timerLabel.Size   = UDim2.new(0, 88, 0, 36)
timerLabel.Position = UDim2.new(1, -12, 0.5, 0)
timerLabel.BackgroundColor3 = Color3.fromRGB(20, 55, 20)
timerLabel.BorderSizePixel  = 0
timerLabel.Text   = "⏱ 20s"
timerLabel.TextColor3 = Color3.fromRGB(100, 255, 100)
timerLabel.Font   = Enum.Font.GothamBold
timerLabel.TextSize   = 15
timerLabel.Parent = header

do local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(0, 8); c.Parent = timerLabel end

-- Hint
local hintLabel = Instance.new("TextLabel")
hintLabel.Size   = UDim2.new(1, -20, 0, 22)
hintLabel.Position = UDim2.new(0, 10, 0, 58)
hintLabel.BackgroundTransparency = 1
hintLabel.Text   = "Click every glowing bud before the timer runs out!"
hintLabel.TextColor3 = Color3.fromRGB(80, 150, 80)
hintLabel.Font   = Enum.Font.Gotham
hintLabel.TextSize   = 12
hintLabel.Parent = card

-- ── Plant canvas ─────────────────────────────────────────────────────────────
local canvas = Instance.new("Frame")
canvas.Name             = "Canvas"
canvas.AnchorPoint      = Vector2.new(0.5, 0)
canvas.Size             = UDim2.new(0, CANVAS_W, 0, CANVAS_H)
canvas.Position         = UDim2.new(0.5, 0, 0, 88)
canvas.BackgroundColor3 = Color3.fromRGB(5, 13, 5)
canvas.BorderSizePixel  = 0
canvas.ClipsDescendants = false
canvas.Parent           = card

do
	local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(0, 12); c.Parent = canvas
	local s = Instance.new("UIStroke"); s.Color = Color3.fromRGB(20, 60, 20); s.Thickness = 1; s.Parent = canvas
end

-- ── Progress ──────────────────────────────────────────────────────────────────
local progBg = Instance.new("Frame")
progBg.Size   = UDim2.new(1, -24, 0, 10)
progBg.Position = UDim2.new(0, 12, 0, 404)
progBg.BackgroundColor3 = Color3.fromRGB(16, 36, 16)
progBg.BorderSizePixel  = 0
progBg.Parent = card

do local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(1, 0); c.Parent = progBg end

local progFill = Instance.new("Frame")
progFill.Name   = "Fill"
progFill.Size   = UDim2.new(0, 0, 1, 0)
progFill.BackgroundColor3 = Color3.fromRGB(40, 200, 60)
progFill.BorderSizePixel  = 0
progFill.Parent = progBg

do local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(1, 0); c.Parent = progFill end

local progLabel = Instance.new("TextLabel")
progLabel.Name   = "ProgLabel"
progLabel.Size   = UDim2.new(1, 0, 0, 26)
progLabel.Position = UDim2.new(0, 0, 0, 418)
progLabel.BackgroundTransparency = 1
progLabel.Text   = "0 / 8 buds plucked"
progLabel.TextColor3 = Color3.fromRGB(80, 180, 80)
progLabel.Font   = Enum.Font.GothamBold
progLabel.TextSize   = 13
progLabel.Parent = card

-- ─────────────────────────────────────────────────────────────────────────────
-- Plant drawing utilities
-- ─────────────────────────────────────────────────────────────────────────────
local STEM_COLOR   = Color3.fromRGB(85, 52, 20)
local BRANCH_COLOR = Color3.fromRGB(62, 42, 15)

--- Draw a rotated line between two pixel coordinates on the canvas.
local function drawLine(x1: number, y1: number, x2: number, y2: number, color: Color3, thickness: number): Frame
	local dx     = x2 - x1
	local dy     = y2 - y1
	local length = math.sqrt(dx * dx + dy * dy)
	local angle  = math.deg(math.atan2(dy, dx))

	local line = Instance.new("Frame")
	line.Size             = UDim2.new(0, length, 0, thickness)
	line.Position         = UDim2.new(0, x1, 0, y1)
	line.AnchorPoint      = Vector2.new(0, 0.5)
	line.Rotation         = angle
	line.BackgroundColor3 = color
	line.BorderSizePixel  = 0
	line.ZIndex           = 1
	line.Parent           = canvas

	local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(0, 4); c.Parent = line
	return line
end

--- Draw the static plant skeleton (stem + branches). Called once at build.
local function drawPlantSkeleton()
	-- Main stem: from bottom up to where the topmost branch starts
	drawLine(150, 285, 150, 80, STEM_COLOR, 7)

	-- Branches: from stem to each bud connection point
	for i, pos in ipairs(BUD_POSITIONS) do
		local connectY = BRANCH_CONNECT_Y[i]
		-- Only draw a visible branch if the bud isn't on the centre axis
		if math.abs(pos.x - 150) > 10 then
			drawLine(150, connectY, pos.x, pos.y, BRANCH_COLOR, 3)
		end
	end

	-- A few small leaf hints along the stem
	local leafColor = Color3.fromRGB(22, 88, 22)
	drawLine(150, 120, 118, 105, leafColor, 4)
	drawLine(150, 120, 182, 105, leafColor, 4)
	drawLine(150, 175, 115, 162, leafColor, 4)
	drawLine(150, 175, 185, 162, leafColor, 4)
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Session state
-- ─────────────────────────────────────────────────────────────────────────────
local sessionActive  = false
local sessionEndTime = 0
local pluckedCount   = 0
local totalBuds      = 8
local activeTweens: {Tween} = {}

-- ─────────────────────────────────────────────────────────────────────────────
-- Particle burst when a bud is plucked
-- ─────────────────────────────────────────────────────────────────────────────
local function spawnParticles(cx: number, cy: number)
	for i = 1, 7 do
		local angle  = (i / 7) * math.pi * 2
		local dist   = math.random(22, 50)
		local tx, ty = cx + math.cos(angle) * dist, cy + math.sin(angle) * dist

		local p = Instance.new("Frame")
		p.Size             = UDim2.new(0, 9, 0, 9)
		p.Position         = UDim2.new(0, cx - 4, 0, cy - 4)
		p.BackgroundColor3 = Color3.fromHSV(math.random(30, 45)/100, 0.6, 1)
		p.BorderSizePixel  = 0
		p.ZIndex           = 12
		p.Parent           = canvas

		do local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(1, 0); c.Parent = p end

		TweenService:Create(p, TweenInfo.new(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
			Position               = UDim2.new(0, tx, 0, ty),
			BackgroundTransparency = 1,
			Size                   = UDim2.new(0, 4, 0, 4),
		}):Play()

		task.delay(0.45, function() p:Destroy() end)
	end
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Create interactive bud buttons
-- ─────────────────────────────────────────────────────────────────────────────
local function buildBuds()
	for i, pos in ipairs(BUD_POSITIONS) do
		-- Outer glow ring (pulsing)
		local glow = Instance.new("Frame")
		glow.Name             = "Glow_" .. i
		glow.AnchorPoint      = Vector2.new(0.5, 0.5)
		glow.Size             = UDim2.new(0, GLOW_SIZE, 0, GLOW_SIZE)
		glow.Position         = UDim2.new(0, pos.x, 0, pos.y)
		glow.BackgroundColor3 = Color3.fromRGB(30, 180, 50)
		glow.BackgroundTransparency = 0.60
		glow.BorderSizePixel  = 0
		glow.ZIndex           = 3
		glow.Parent           = canvas

		do local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(1, 0); c.Parent = glow end

		-- Infinite pulse tween on glow
		local pulseTween = TweenService:Create(glow,
			TweenInfo.new(0.85, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, -1, true), {
			Size                   = UDim2.new(0, GLOW_SIZE + 14, 0, GLOW_SIZE + 14),
			BackgroundTransparency = 0.78,
		})
		pulseTween:Play()
		table.insert(activeTweens, pulseTween)

		-- Bud button
		local bud = Instance.new("TextButton")
		bud.Name          = "Bud_" .. i
		bud.AnchorPoint   = Vector2.new(0.5, 0.5)
		bud.Size          = UDim2.new(0, BUD_SIZE, 0, BUD_SIZE)
		bud.Position      = UDim2.new(0, pos.x, 0, pos.y)
		bud.BackgroundColor3 = Color3.fromRGB(28, 195, 55)
		bud.Text          = "🌿"
		bud.TextSize      = 20
		bud.Font          = Enum.Font.GothamBold
		bud.BorderSizePixel = 0
		bud.ZIndex        = 5
		bud.Parent        = canvas

		do local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(1, 0); c.Parent = bud end

		-- Hover grow
		bud.MouseEnter:Connect(function()
			TweenService:Create(bud, TweenInfo.new(0.1), {
				Size = UDim2.new(0, BUD_SIZE + 10, 0, BUD_SIZE + 10),
			}):Play()
		end)
		bud.MouseLeave:Connect(function()
			TweenService:Create(bud, TweenInfo.new(0.1), {
				Size = UDim2.new(0, BUD_SIZE, 0, BUD_SIZE),
			}):Play()
		end)

		-- Click → pluck
		local localI    = i
		local localBud  = bud
		local localGlow = glow
		local clicked   = false

		bud.MouseButton1Click:Connect(function()
			if not sessionActive or clicked then return end
			clicked = true

			-- Shrink & fade out the bud
			TweenService:Create(localBud, TweenInfo.new(0.18, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
				Size                   = UDim2.new(0, 0, 0, 0),
				BackgroundTransparency = 1,
			}):Play()
			TweenService:Create(localGlow, TweenInfo.new(0.18), {
				Size                   = UDim2.new(0, 0, 0, 0),
				BackgroundTransparency = 1,
			}):Play()

			spawnParticles(pos.x, pos.y)

			task.delay(0.22, function()
				localBud:Destroy()
				localGlow:Destroy()
			end)

			-- Update progress
			pluckedCount += 1
			local frac = pluckedCount / totalBuds
			TweenService:Create(progFill, TweenInfo.new(0.3), {
				Size = UDim2.new(frac, 0, 1, 0),
			}):Play()
			progLabel.Text = pluckedCount .. " / " .. totalBuds .. " buds plucked"

			-- Tell server
			Remotes.PlantPluck:FireServer(localI)
		end)
	end
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Show / hide
-- ─────────────────────────────────────────────────────────────────────────────
local function openMinigame(buds: number, sessionTime: number)
	totalBuds    = buds
	pluckedCount = 0
	sessionActive   = true
	sessionEndTime  = os.clock() + sessionTime

	progFill.Size   = UDim2.new(0, 0, 1, 0)
	progLabel.Text  = "0 / " .. buds .. " buds plucked"
	timerLabel.Text = "⏱ " .. sessionTime .. "s"
	timerLabel.TextColor3 = Color3.fromRGB(100, 255, 100)

	-- Clear any leftover plant elements
	for _, child in ipairs(canvas:GetChildren()) do
		if child:IsA("Frame") or child:IsA("TextButton") then child:Destroy() end
	end

	drawPlantSkeleton()
	buildBuds()

	screenGui.Enabled = true
	card.Size     = UDim2.new(0, 0, 0, 0)
	TweenService:Create(card, TweenInfo.new(0.28, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
		Size = UDim2.new(0, 500, 0, 570),
	}):Play()
end

local function closeMinigame()
	sessionActive = false
	for _, t in ipairs(activeTweens) do t:Cancel() end
	activeTweens = {}

	TweenService:Create(card, TweenInfo.new(0.18, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
		Size = UDim2.new(0, 0, 0, 0),
	}):Play()
	task.delay(0.22, function() screenGui.Enabled = false end)
end

-- ─────────────────────────────────────────────────────────────────────────────
-- RenderStepped: timer countdown
-- ─────────────────────────────────────────────────────────────────────────────
RunService.RenderStepped:Connect(function()
	if not sessionActive then return end
	local remaining = math.max(0, sessionEndTime - os.clock())
	timerLabel.Text = string.format("⏱ %.0fs", remaining)

	if remaining <= 5 then
		timerLabel.TextColor3 = Color3.fromRGB(255, 70, 70)
	elseif remaining <= 10 then
		timerLabel.TextColor3 = Color3.fromRGB(255, 200, 40)
	else
		timerLabel.TextColor3 = Color3.fromRGB(100, 255, 100)
	end
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- Remote: server sends minigame setup
-- ─────────────────────────────────────────────────────────────────────────────
Remotes.PlantSetup.OnClientEvent:Connect(function(buds, sessionTime)
	openMinigame(buds :: number, sessionTime :: number)
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- Remote: server sends rewards (session ended)
-- ─────────────────────────────────────────────────────────────────────────────
Remotes.PlantReward.OnClientEvent:Connect(function(plucked, total, seeds, weed, fertilizer)
	sessionActive = false
	for _, t in ipairs(activeTweens) do t:Cancel() end

	local isPerfect = (plucked == total)

	-- Results overlay on top of the card
	local overlay = Instance.new("Frame")
	overlay.Size                    = UDim2.fromScale(1, 1)
	overlay.BackgroundColor3        = Color3.fromRGB(5, 16, 5)
	overlay.BackgroundTransparency  = 0.08
	overlay.BorderSizePixel         = 0
	overlay.ZIndex                  = 20
	overlay.Parent                  = card

	do local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(0, 16); c.Parent = overlay end

	-- Title
	local titleResult = Instance.new("TextLabel")
	titleResult.AnchorPoint = Vector2.new(0.5, 0)
	titleResult.Size   = UDim2.new(0.9, 0, 0, 56)
	titleResult.Position = UDim2.new(0.5, 0, 0.15, 0)
	titleResult.BackgroundTransparency = 1
	titleResult.Text   = isPerfect and "🌟  Perfect Harvest!" or "🌿  Harvest Complete!"
	titleResult.TextColor3 = isPerfect
		and Color3.fromRGB(255, 220, 40)
		or  Color3.fromRGB(60, 220, 80)
	titleResult.Font     = Enum.Font.GothamBold
	titleResult.TextSize = 26
	titleResult.ZIndex   = 21
	titleResult.Parent   = overlay

	-- Plucked count
	local countResult = Instance.new("TextLabel")
	countResult.AnchorPoint = Vector2.new(0.5, 0)
	countResult.Size   = UDim2.new(0.9, 0, 0, 28)
	countResult.Position = UDim2.new(0.5, 0, 0.15, 58)
	countResult.BackgroundTransparency = 1
	countResult.Text   = string.format("%d / %d buds plucked", plucked, total)
	countResult.TextColor3 = Color3.fromRGB(120, 190, 120)
	countResult.Font   = Enum.Font.Gotham
	countResult.TextSize = 14
	countResult.ZIndex = 21
	countResult.Parent = overlay

	-- Reward box
	local rewardLines: {string} = {}
	if seeds      > 0 then table.insert(rewardLines, string.format("🌱  +%d  WeedSeeds",  seeds))      end
	if weed       > 0 then table.insert(rewardLines, string.format("🌿  +%d  Weed",        weed))       end
	if fertilizer > 0 then table.insert(rewardLines, string.format("🌻  +%d  Fertilizer  ✨ bonus!", fertilizer)) end

	local rewardBox = Instance.new("TextLabel")
	rewardBox.AnchorPoint = Vector2.new(0.5, 0)
	rewardBox.Size   = UDim2.new(0.8, 0, 0, math.max(70, #rewardLines * 26 + 20))
	rewardBox.Position = UDim2.new(0.5, 0, 0.40, 0)
	rewardBox.BackgroundColor3 = Color3.fromRGB(10, 28, 10)
	rewardBox.BorderSizePixel  = 0
	rewardBox.Text   = #rewardLines > 0 and table.concat(rewardLines, "\n") or "No buds plucked."
	rewardBox.TextColor3 = Color3.fromRGB(170, 240, 170)
	rewardBox.Font   = Enum.Font.GothamBold
	rewardBox.TextSize = 14
	rewardBox.ZIndex = 21
	rewardBox.Parent = overlay

	do local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(0, 10); c.Parent = rewardBox end

	-- Auto-close after 3.5 seconds
	task.delay(3.5, function()
		closeMinigame()
		overlay:Destroy()
	end)
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- Remote: plant denied (cooldown)
-- ─────────────────────────────────────────────────────────────────────────────
Remotes.PlantDenied.OnClientEvent:Connect(function(reason)
	local toast = Instance.new("TextLabel")
	toast.AnchorPoint = Vector2.new(0.5, 0)
	toast.Size   = UDim2.new(0, 320, 0, 44)
	toast.Position = UDim2.new(0.5, 0, 0, -60)
	toast.BackgroundColor3 = Color3.fromRGB(160, 80, 20)
	toast.BorderSizePixel  = 0
	toast.Text   = "🌿  " .. (reason or "Plant not ready.")
	toast.TextColor3 = Color3.new(1, 1, 1)
	toast.Font   = Enum.Font.GothamBold
	toast.TextSize = 13
	toast.ZIndex = 50
	toast.Parent = screenGui

	do local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(0, 8); c.Parent = toast end

	TweenService:Create(toast, TweenInfo.new(0.35, Enum.EasingStyle.Back), {
		Position = UDim2.new(0.5, 0, 0, 18),
	}):Play()
	task.delay(3, function()
		TweenService:Create(toast, TweenInfo.new(0.3), {
			BackgroundTransparency = 1, TextTransparency = 1,
		}):Play()
		task.delay(0.35, function() toast:Destroy() end)
	end)
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- Wire up the ProximityPrompt on the WeedPlant in Workspace
-- ─────────────────────────────────────────────────────────────────────────────
task.spawn(function()
	local weedPlant = workspace:WaitForChild("WeedPlant", 30) :: BasePart?
	if not weedPlant then
		warn("[PlantController] WeedPlant not found in Workspace.")
		return
	end
	local prompt = weedPlant:WaitForChild("ProximityPrompt", 10) :: ProximityPrompt?
	if not prompt then
		warn("[PlantController] ProximityPrompt not found on WeedPlant.")
		return
	end
	prompt.Triggered:Connect(function()
		if not sessionActive then
			Remotes.PlantStart:FireServer()
		end
	end)
end)

return {}
