--!strict
-- SkillController: shows the Skills panel (press K) with XP bars, level,
-- and animated level-up notifications.

local Players      = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

local Shared  = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Remotes = require(Shared.Remotes)
local SkillDefs = require(Shared.Data.Skills)

local player = Players.LocalPlayer

-- ─────────────────────────────────────────────────────────────────────────────
-- Fetch initial skill data
-- ─────────────────────────────────────────────────────────────────────────────
local skillData: {[string]: any} = Remotes.GetSkillData:InvokeServer() :: any

-- ─────────────────────────────────────────────────────────────────────────────
-- Build skill panel GUI
-- ─────────────────────────────────────────────────────────────────────────────
local screenGui = Instance.new("ScreenGui")
screenGui.Name           = "SkillsGui"
screenGui.ResetOnSpawn   = false
screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
screenGui.Enabled        = false
screenGui.Parent         = player.PlayerGui

local panel = Instance.new("Frame")
panel.Name             = "Panel"
panel.Size             = UDim2.new(0, 380, 0, 500)
panel.Position         = UDim2.new(1, -400, 0.5, -250)
panel.BackgroundColor3 = Color3.fromRGB(12, 12, 18)
panel.BorderSizePixel  = 0
panel.Parent           = screenGui

local panelCorner = Instance.new("UICorner")
panelCorner.CornerRadius = UDim.new(0, 14)
panelCorner.Parent = panel

local panelStroke = Instance.new("UIStroke")
panelStroke.Color     = Color3.fromRGB(70, 50, 180)
panelStroke.Thickness = 1.5
panelStroke.Parent = panel

-- Title
local titleBar = Instance.new("Frame")
titleBar.Size             = UDim2.new(1, 0, 0, 48)
titleBar.BackgroundColor3 = Color3.fromRGB(22, 16, 50)
titleBar.BorderSizePixel  = 0
titleBar.Parent           = panel

local titleCorner = Instance.new("UICorner")
titleCorner.CornerRadius = UDim.new(0, 14)
titleCorner.Parent = titleBar

local titleFix = Instance.new("Frame")
titleFix.Size             = UDim2.new(1, 0, 0.5, 0)
titleFix.Position         = UDim2.new(0, 0, 0.5, 0)
titleFix.BackgroundColor3 = Color3.fromRGB(22, 16, 50)
titleFix.BorderSizePixel  = 0
titleFix.Parent           = titleBar

local titleLabel = Instance.new("TextLabel")
titleLabel.Size   = UDim2.new(1, -60, 1, 0)
titleLabel.Position = UDim2.new(0, 16, 0, 0)
titleLabel.BackgroundTransparency = 1
titleLabel.Text   = "📊  Skills"
titleLabel.TextColor3 = Color3.fromRGB(200, 180, 255)
titleLabel.Font   = Enum.Font.GothamBold
titleLabel.TextSize = 17
titleLabel.TextXAlignment = Enum.TextXAlignment.Left
titleLabel.Parent = titleBar

local closeBtn = Instance.new("TextButton")
closeBtn.Size   = UDim2.new(0, 32, 0, 32)
closeBtn.Position = UDim2.new(1, -40, 0, 8)
closeBtn.BackgroundColor3 = Color3.fromRGB(200, 50, 50)
closeBtn.Text   = "✕"
closeBtn.TextColor3 = Color3.new(1,1,1)
closeBtn.Font   = Enum.Font.GothamBold
closeBtn.TextSize = 13
closeBtn.BorderSizePixel = 0
closeBtn.Parent = titleBar

local closeBtnCorner = Instance.new("UICorner")
closeBtnCorner.CornerRadius = UDim.new(0, 6)
closeBtnCorner.Parent = closeBtn

-- Scroll area for skill cards
local scrollFrame = Instance.new("ScrollingFrame")
scrollFrame.Size   = UDim2.new(1, -12, 1, -56)
scrollFrame.Position = UDim2.new(0, 6, 0, 52)
scrollFrame.BackgroundTransparency = 1
scrollFrame.BorderSizePixel = 0
scrollFrame.ScrollBarThickness = 4
scrollFrame.ScrollBarImageColor3 = Color3.fromRGB(100, 80, 200)
scrollFrame.CanvasSize          = UDim2.new(0, 0, 0, 0)
scrollFrame.AutomaticCanvasSize = Enum.AutomaticSize.Y
scrollFrame.Parent = panel

local listLayout = Instance.new("UIListLayout")
listLayout.Padding   = UDim.new(0, 8)
listLayout.SortOrder = Enum.SortOrder.LayoutOrder
listLayout.Parent    = scrollFrame

local listPad = Instance.new("UIPadding")
listPad.PaddingTop   = UDim.new(0, 6)
listPad.PaddingLeft  = UDim.new(0, 4)
listPad.PaddingRight = UDim.new(0, 4)
listPad.Parent       = scrollFrame

-- ─────────────────────────────────────────────────────────────────────────────
-- Per-skill colour palette
-- ─────────────────────────────────────────────────────────────────────────────
local SKILL_COLOURS: {[string]: Color3} = {
	Chemistry = Color3.fromRGB(180, 80, 255),
	Crafting  = Color3.fromRGB(80, 180, 255),
	Agility   = Color3.fromRGB(80, 255, 160),
	Stealth   = Color3.fromRGB(100, 120, 255),
	Strength  = Color3.fromRGB(255, 100, 80),
}

-- ─────────────────────────────────────────────────────────────────────────────
-- Skill card builder
-- ─────────────────────────────────────────────────────────────────────────────
type SkillCardRefs = {
	xpBar      : Frame,
	xpLabel    : TextLabel,
	levelLabel : TextLabel,
}
local skillCardRefs: {[string]: SkillCardRefs} = {}

local SKILL_ORDER = { "Chemistry", "Crafting", "Agility", "Stealth", "Strength" }

local function buildSkillCard(skillId: string, order: number)
	local def   = SkillDefs[skillId]
	local entry = skillData[skillId] or { Level = 1, XP = 0, XPToNextLevel = 100 }
	local accent = SKILL_COLOURS[skillId] or Color3.fromRGB(150, 150, 200)

	local card = Instance.new("Frame")
	card.Name             = skillId
	card.LayoutOrder      = order
	card.Size             = UDim2.new(1, 0, 0, 84)
	card.BackgroundColor3 = Color3.fromRGB(18, 16, 30)
	card.BorderSizePixel  = 0
	card.Parent           = scrollFrame

	local cardCorner = Instance.new("UICorner")
	cardCorner.CornerRadius = UDim.new(0, 10)
	cardCorner.Parent = card

	local cardStroke = Instance.new("UIStroke")
	cardStroke.Color     = accent
	cardStroke.Thickness = 1
	cardStroke.Transparency = 0.5
	cardStroke.Parent = card

	-- Left accent bar
	local accentBar = Instance.new("Frame")
	accentBar.Size             = UDim2.new(0, 4, 0, 60)
	accentBar.Position         = UDim2.new(0, 0, 0.5, -30)
	accentBar.BackgroundColor3 = accent
	accentBar.BorderSizePixel  = 0
	accentBar.Parent           = card
	local accentCorner = Instance.new("UICorner")
	accentCorner.CornerRadius = UDim.new(1, 0)
	accentCorner.Parent = accentBar

	-- Icon
	local iconLabel = Instance.new("TextLabel")
	iconLabel.Size   = UDim2.new(0, 40, 0, 40)
	iconLabel.Position = UDim2.new(0, 12, 0.5, -20)
	iconLabel.BackgroundTransparency = 1
	iconLabel.Text     = def and def.Icon or "⭐"
	iconLabel.TextSize = 24
	iconLabel.Font     = Enum.Font.GothamBold
	iconLabel.Parent   = card

	-- Skill name
	local nameLabel = Instance.new("TextLabel")
	nameLabel.Size   = UDim2.new(1, -180, 0, 22)
	nameLabel.Position = UDim2.new(0, 58, 0, 10)
	nameLabel.BackgroundTransparency = 1
	nameLabel.Text   = def and def.Name or skillId
	nameLabel.TextColor3 = Color3.fromRGB(220, 210, 240)
	nameLabel.Font   = Enum.Font.GothamBold
	nameLabel.TextSize = 14
	nameLabel.TextXAlignment = Enum.TextXAlignment.Left
	nameLabel.Parent = card

	-- Description
	local descLabel = Instance.new("TextLabel")
	descLabel.Size   = UDim2.new(1, -180, 0, 18)
	descLabel.Position = UDim2.new(0, 58, 0, 32)
	descLabel.BackgroundTransparency = 1
	descLabel.Text   = def and def.Description or ""
	descLabel.TextColor3 = Color3.fromRGB(120, 110, 150)
	descLabel.Font   = Enum.Font.Gotham
	descLabel.TextSize = 10
	descLabel.TextXAlignment = Enum.TextXAlignment.Left
	descLabel.TextWrapped    = true
	descLabel.Parent = card

	-- Level badge
	local levelLabel = Instance.new("TextLabel")
	levelLabel.Size   = UDim2.new(0, 72, 0, 36)
	levelLabel.Position = UDim2.new(1, -80, 0.5, -18)
	levelLabel.BackgroundColor3 = Color3.fromRGB(22, 18, 40)
	levelLabel.BorderSizePixel  = 0
	levelLabel.Text   = "Lv. " .. entry.Level
	levelLabel.TextColor3 = accent
	levelLabel.Font   = Enum.Font.GothamBold
	levelLabel.TextSize = 16
	levelLabel.Parent = card

	local lvlCorner = Instance.new("UICorner")
	lvlCorner.CornerRadius = UDim.new(0, 6)
	lvlCorner.Parent = levelLabel

	-- XP bar background
	local xpBarBg = Instance.new("Frame")
	xpBarBg.Size   = UDim2.new(1, -68, 0, 6)
	xpBarBg.Position = UDim2.new(0, 58, 1, -14)
	xpBarBg.BackgroundColor3 = Color3.fromRGB(30, 26, 46)
	xpBarBg.BorderSizePixel  = 0
	xpBarBg.Parent = card

	local xpBarCorner = Instance.new("UICorner")
	xpBarCorner.CornerRadius = UDim.new(1, 0)
	xpBarCorner.Parent = xpBarBg

	local xpFraction = entry.XPToNextLevel > 0 and (entry.XP / entry.XPToNextLevel) or 1
	local xpBar = Instance.new("Frame")
	xpBar.Size   = UDim2.new(math.clamp(xpFraction, 0, 1), 0, 1, 0)
	xpBar.BackgroundColor3 = accent
	xpBar.BorderSizePixel  = 0
	xpBar.Parent = xpBarBg

	local xpBarFillCorner = Instance.new("UICorner")
	xpBarFillCorner.CornerRadius = UDim.new(1, 0)
	xpBarFillCorner.Parent = xpBar

	-- XP text
	local xpLabel = Instance.new("TextLabel")
	xpLabel.Size   = UDim2.new(1, -68, 0, 14)
	xpLabel.Position = UDim2.new(0, 58, 1, -28)
	xpLabel.BackgroundTransparency = 1
	xpLabel.Text   = string.format("%d / %d XP", entry.XP, entry.XPToNextLevel)
	xpLabel.TextColor3 = Color3.fromRGB(100, 90, 130)
	xpLabel.Font   = Enum.Font.Gotham
	xpLabel.TextSize = 10
	xpLabel.TextXAlignment = Enum.TextXAlignment.Left
	xpLabel.Parent = card

	skillCardRefs[skillId] = {
		xpBar      = xpBar,
		xpLabel    = xpLabel,
		levelLabel = levelLabel,
	}
end

local function buildAllCards()
	for _, child in ipairs(scrollFrame:GetChildren()) do
		if child:IsA("Frame") then child:Destroy() end
	end
	skillCardRefs = {}
	for i, skillId in ipairs(SKILL_ORDER) do
		buildSkillCard(skillId, i)
	end
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Open / close
-- ─────────────────────────────────────────────────────────────────────────────
local function openPanel()
	buildAllCards()
	screenGui.Enabled = true
	panel.Position = UDim2.new(1, 0, 0.5, -250)
	TweenService:Create(panel, TweenInfo.new(0.25, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
		Position = UDim2.new(1, -400, 0.5, -250),
	}):Play()
end

local function closePanel()
	TweenService:Create(panel, TweenInfo.new(0.18, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
		Position = UDim2.new(1, 0, 0.5, -250),
	}):Play()
	task.delay(0.2, function() screenGui.Enabled = false end)
end

closeBtn.MouseButton1Click:Connect(closePanel)

UserInputService.InputBegan:Connect(function(input, processed)
	if processed then return end
	if input.KeyCode == Enum.KeyCode.K then
		if screenGui.Enabled then closePanel() else openPanel() end
	end
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- XP / level-up handlers
-- ─────────────────────────────────────────────────────────────────────────────
Remotes.SkillXpGained:Connect(function(skillId, _amount, currentXp, xpToNext)
	-- Update local cache
	if skillData[skillId] then
		skillData[skillId].XP = currentXp
		skillData[skillId].XPToNextLevel = xpToNext
	end
	-- Animate bar if visible
	local refs = skillCardRefs[skillId]
	if not refs then return end
	local fraction = xpToNext > 0 and (currentXp / xpToNext) or 1
	TweenService:Create(refs.xpBar, TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
		Size = UDim2.new(math.clamp(fraction, 0, 1), 0, 1, 0),
	}):Play()
	refs.xpLabel.Text = string.format("%d / %d XP", currentXp, xpToNext)
end)

Remotes.SkillLevelUp:Connect(function(skillId, newLevel)
	-- Update cache
	if skillData[skillId] then
		skillData[skillId].Level = newLevel
	end
	-- Update level badge if visible
	local refs = skillCardRefs[skillId]
	if refs then
		refs.levelLabel.Text = "Lv. " .. newLevel
		TweenService:Create(refs.levelLabel, TweenInfo.new(0.3, Enum.EasingStyle.Bounce), {
			TextSize = 20,
		}):Play()
		task.delay(0.35, function()
			TweenService:Create(refs.levelLabel, TweenInfo.new(0.2), { TextSize = 16 }):Play()
		end)
	end

	-- Level-up notification (always shown, even if panel is closed)
	local def    = SkillDefs[skillId]
	local accent = SKILL_COLOURS[skillId] or Color3.fromRGB(150, 150, 200)

	local notif = Instance.new("Frame")
	notif.Size   = UDim2.new(0, 280, 0, 56)
	notif.Position = UDim2.new(0.5, -140, 0, -70)
	notif.BackgroundColor3 = Color3.fromRGB(14, 12, 28)
	notif.BorderSizePixel  = 0
	notif.Parent = screenGui

	local notifCorner = Instance.new("UICorner")
	notifCorner.CornerRadius = UDim.new(0, 10)
	notifCorner.Parent = notif

	local notifStroke = Instance.new("UIStroke")
	notifStroke.Color     = accent
	notifStroke.Thickness = 1.5
	notifStroke.Parent = notif

	local icon = Instance.new("TextLabel")
	icon.Size   = UDim2.new(0, 40, 1, 0)
	icon.BackgroundTransparency = 1
	icon.Text   = def and def.Icon or "⭐"
	icon.TextSize = 24
	icon.Font     = Enum.Font.GothamBold
	icon.Parent   = notif

	local text = Instance.new("TextLabel")
	text.Size   = UDim2.new(1, -44, 0.5, 0)
	text.Position = UDim2.new(0, 40, 0, 2)
	text.BackgroundTransparency = 1
	text.Text   = "LEVEL UP!"
	text.TextColor3 = accent
	text.Font   = Enum.Font.GothamBold
	text.TextSize = 15
	text.TextXAlignment = Enum.TextXAlignment.Left
	text.Parent = notif

	local subText = Instance.new("TextLabel")
	subText.Size   = UDim2.new(1, -44, 0.5, 0)
	subText.Position = UDim2.new(0, 40, 0.5, -2)
	subText.BackgroundTransparency = 1
	subText.Text   = string.format("%s → Level %d", (def and def.Name or skillId), newLevel)
	subText.TextColor3 = Color3.fromRGB(180, 170, 210)
	subText.Font   = Enum.Font.Gotham
	subText.TextSize = 12
	subText.TextXAlignment = Enum.TextXAlignment.Left
	subText.Parent = notif

	-- Slide in from top
	TweenService:Create(notif, TweenInfo.new(0.4, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
		Position = UDim2.new(0.5, -140, 0, 16),
	}):Play()

	task.delay(2.8, function()
		TweenService:Create(notif, TweenInfo.new(0.35, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
			Position = UDim2.new(0.5, -140, 0, -70),
		}):Play()
		task.delay(0.4, function() notif:Destroy() end)
	end)
end)

return {}
