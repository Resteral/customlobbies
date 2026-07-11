--!strict
-- CraftingController: full crafting UI.
-- Press G to open/close. Shows recipes grouped by category with ingredient
-- counts from your inventory, a craft-time progress bar, and cancel button.

local Players      = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

local Shared   = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Remotes  = require(Shared.Remotes)

local player   = Players.LocalPlayer

-- ─────────────────────────────────────────────────────────────────────────────
-- Fetch data from server
-- ─────────────────────────────────────────────────────────────────────────────
local recipes   = Remotes.GetRecipes:InvokeServer() :: {[string]: any}
local inventory : {[string]: number} = Remotes.GetInventory:InvokeServer() :: any

-- Keep inventory in sync
Remotes.UpdateInventory:Connect(function(newInv)
	inventory = newInv :: any
	-- Refresh counts if UI is open
	task.defer(function() end)  -- placeholder: trigger UI refresh below
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- Build GUI
-- ─────────────────────────────────────────────────────────────────────────────
local screenGui = Instance.new("ScreenGui")
screenGui.Name            = "CraftingGui"
screenGui.ResetOnSpawn    = false
screenGui.ZIndexBehavior  = Enum.ZIndexBehavior.Sibling
screenGui.Enabled         = false
screenGui.Parent          = player.PlayerGui

-- Background panel
local panel = Instance.new("Frame")
panel.Name              = "Panel"
panel.Size              = UDim2.new(0, 540, 0, 480)
panel.Position          = UDim2.new(0.5, -270, 0.5, -240)
panel.BackgroundColor3  = Color3.fromRGB(14, 14, 20)
panel.BorderSizePixel   = 0
panel.Parent            = screenGui

local panelCorner = Instance.new("UICorner")
panelCorner.CornerRadius = UDim.new(0, 14)
panelCorner.Parent = panel

-- Accent border
local stroke = Instance.new("UIStroke")
stroke.Color     = Color3.fromRGB(80, 60, 200)
stroke.Thickness = 1.5
stroke.Parent    = panel

-- Title bar
local titleBar = Instance.new("Frame")
titleBar.Size              = UDim2.new(1, 0, 0, 46)
titleBar.BackgroundColor3  = Color3.fromRGB(25, 20, 50)
titleBar.BorderSizePixel   = 0
titleBar.Parent            = panel

local titleCorner = Instance.new("UICorner")
titleCorner.CornerRadius = UDim.new(0, 14)
titleCorner.Parent       = titleBar

-- Cover bottom corners of title bar
local titleFix = Instance.new("Frame")
titleFix.Size             = UDim2.new(1, 0, 0.5, 0)
titleFix.Position         = UDim2.new(0, 0, 0.5, 0)
titleFix.BackgroundColor3 = Color3.fromRGB(25, 20, 50)
titleFix.BorderSizePixel  = 0
titleFix.Parent           = titleBar

local titleLabel = Instance.new("TextLabel")
titleLabel.Size   = UDim2.new(1, -20, 1, 0)
titleLabel.Position = UDim2.new(0, 16, 0, 0)
titleLabel.BackgroundTransparency = 1
titleLabel.Text   = "🔬  Crafting Table"
titleLabel.TextColor3 = Color3.fromRGB(220, 200, 255)
titleLabel.Font   = Enum.Font.GothamBold
titleLabel.TextSize = 16
titleLabel.TextXAlignment = Enum.TextXAlignment.Left
titleLabel.Parent = titleBar

local closeBtn = Instance.new("TextButton")
closeBtn.Size   = UDim2.new(0, 32, 0, 32)
closeBtn.Position = UDim2.new(1, -40, 0, 7)
closeBtn.BackgroundColor3 = Color3.fromRGB(200, 50, 50)
closeBtn.Text   = "✕"
closeBtn.TextColor3 = Color3.new(1,1,1)
closeBtn.Font   = Enum.Font.GothamBold
closeBtn.TextSize = 14
closeBtn.BorderSizePixel = 0
closeBtn.Parent = titleBar

local closeBtnCorner = Instance.new("UICorner")
closeBtnCorner.CornerRadius = UDim.new(0, 6)
closeBtnCorner.Parent = closeBtn

-- Scroll list of recipes
local scrollFrame = Instance.new("ScrollingFrame")
scrollFrame.Name   = "RecipeList"
scrollFrame.Size   = UDim2.new(1, -16, 1, -120)
scrollFrame.Position = UDim2.new(0, 8, 0, 54)
scrollFrame.BackgroundTransparency = 1
scrollFrame.BorderSizePixel = 0
scrollFrame.ScrollBarThickness = 4
scrollFrame.ScrollBarImageColor3 = Color3.fromRGB(100, 80, 200)
scrollFrame.CanvasSize = UDim2.new(0, 0, 0, 0)
scrollFrame.AutomaticCanvasSize = Enum.AutomaticSize.Y
scrollFrame.Parent = panel

local listLayout = Instance.new("UIListLayout")
listLayout.Padding         = UDim.new(0, 6)
listLayout.SortOrder       = Enum.SortOrder.Name
listLayout.Parent          = scrollFrame

local listPad = Instance.new("UIPadding")
listPad.PaddingLeft   = UDim.new(0, 4)
listPad.PaddingRight  = UDim.new(0, 4)
listPad.PaddingTop    = UDim.new(0, 4)
listPad.Parent        = scrollFrame

-- Progress section (bottom)
local progressFrame = Instance.new("Frame")
progressFrame.Name   = "ProgressFrame"
progressFrame.Size   = UDim2.new(1, -16, 0, 56)
progressFrame.Position = UDim2.new(0, 8, 1, -64)
progressFrame.BackgroundColor3 = Color3.fromRGB(20, 18, 35)
progressFrame.BorderSizePixel  = 0
progressFrame.Visible           = false
progressFrame.Parent            = panel

local progCorner = Instance.new("UICorner")
progCorner.CornerRadius = UDim.new(0, 8)
progCorner.Parent = progressFrame

local progLabel = Instance.new("TextLabel")
progLabel.Size   = UDim2.new(1, -90, 0.5, 0)
progLabel.Position = UDim2.new(0, 10, 0, 0)
progLabel.BackgroundTransparency = 1
progLabel.TextColor3 = Color3.fromRGB(200, 180, 255)
progLabel.Font       = Enum.Font.GothamBold
progLabel.TextSize   = 13
progLabel.TextXAlignment = Enum.TextXAlignment.Left
progLabel.Parent = progressFrame

local cancelBtn = Instance.new("TextButton")
cancelBtn.Size   = UDim2.new(0, 80, 0, 28)
cancelBtn.Position = UDim2.new(1, -88, 0.5, -14)
cancelBtn.BackgroundColor3 = Color3.fromRGB(180, 40, 40)
cancelBtn.Text   = "Cancel"
cancelBtn.TextColor3 = Color3.new(1,1,1)
cancelBtn.Font   = Enum.Font.GothamBold
cancelBtn.TextSize = 12
cancelBtn.BorderSizePixel = 0
cancelBtn.Parent = progressFrame

local cancelBtnCorner = Instance.new("UICorner")
cancelBtnCorner.CornerRadius = UDim.new(0, 6)
cancelBtnCorner.Parent = cancelBtn

local progBarBg = Instance.new("Frame")
progBarBg.Size  = UDim2.new(1, -10, 0, 6)
progBarBg.Position = UDim2.new(0, 5, 1, -12)
progBarBg.BackgroundColor3 = Color3.fromRGB(40, 35, 60)
progBarBg.BorderSizePixel  = 0
progBarBg.Parent = progressFrame

local progBarFill = Instance.new("Frame")
progBarFill.Name  = "Fill"
progBarFill.Size  = UDim2.new(0, 0, 1, 0)
progBarFill.BackgroundColor3 = Color3.fromRGB(120, 80, 255)
progBarFill.BorderSizePixel  = 0
progBarFill.Parent = progBarBg

local progBarCorner = Instance.new("UICorner")
progBarCorner.CornerRadius = UDim.new(1, 0)
progBarCorner.Parent = progBarBg

-- ─────────────────────────────────────────────────────────────────────────────
-- Helpers
-- ─────────────────────────────────────────────────────────────────────────────
local CATEGORY_ICONS = { Drug = "🧪", Tool = "🔧", Consumable = "💊" }
local CATEGORY_COLOURS: {[string]: Color3} = {
	Drug       = Color3.fromRGB(180, 60, 255),
	Tool       = Color3.fromRGB(80, 180, 255),
	Consumable = Color3.fromRGB(60, 220, 120),
}

local function canCraft(recipe: any): boolean
	for _, ing in ipairs(recipe.Ingredients) do
		if (inventory[ing.ItemId] or 0) < ing.Amount then
			return false
		end
	end
	return true
end

local function buildRecipeCard(recipe: any, recipeId: string): Frame
	local accent = CATEGORY_COLOURS[recipe.Category] or Color3.fromRGB(150,150,150)
	local craftable = canCraft(recipe)

	local card = Instance.new("Frame")
	card.Name              = recipeId
	card.Size              = UDim2.new(1, 0, 0, 72)
	card.BackgroundColor3  = Color3.fromRGB(22, 20, 36)
	card.BorderSizePixel   = 0

	local cardCorner = Instance.new("UICorner")
	cardCorner.CornerRadius = UDim.new(0, 8)
	cardCorner.Parent = card

	local cardStroke = Instance.new("UIStroke")
	cardStroke.Color     = accent
	cardStroke.Thickness = craftable and 1.5 or 0.5
	cardStroke.Transparency = craftable and 0 or 0.6
	cardStroke.Parent = card

	-- Icon
	local icon = Instance.new("TextLabel")
	icon.Size   = UDim2.new(0, 52, 0, 52)
	icon.Position = UDim2.new(0, 10, 0.5, -26)
	icon.BackgroundColor3 = Color3.fromRGB(30, 26, 50)
	icon.BorderSizePixel  = 0
	icon.Text   = CATEGORY_ICONS[recipe.Category] or "📦"
	icon.TextSize = 26
	icon.Font     = Enum.Font.GothamBold
	icon.TextColor3 = Color3.new(1,1,1)
	icon.Parent   = card
	local iconCorner = Instance.new("UICorner")
	iconCorner.CornerRadius = UDim.new(0, 8)
	iconCorner.Parent = icon

	-- Recipe name
	local nameLabel = Instance.new("TextLabel")
	nameLabel.Size   = UDim2.new(1, -170, 0, 22)
	nameLabel.Position = UDim2.new(0, 70, 0, 10)
	nameLabel.BackgroundTransparency = 1
	nameLabel.Text   = recipe.Name
	nameLabel.TextColor3 = Color3.fromRGB(220, 220, 240)
	nameLabel.Font   = Enum.Font.GothamBold
	nameLabel.TextSize = 13
	nameLabel.TextXAlignment = Enum.TextXAlignment.Left
	nameLabel.Parent = card

	-- Ingredients
	local ingParts = {}
	for _, ing in ipairs(recipe.Ingredients) do
		local have = inventory[ing.ItemId] or 0
		local ok   = have >= ing.Amount
		table.insert(ingParts,
			string.format("%s%dx %s%s",
				ok and "" or "⚠️ ",
				ing.Amount,
				ing.ItemId:gsub("(%u)", " %1"):gsub("^ ", ""),
				ok and string.format(" (%d)", have) or string.format(" (%d/%d)", have, ing.Amount)))
	end
	local ingLabel = Instance.new("TextLabel")
	ingLabel.Size   = UDim2.new(1, -170, 0, 28)
	ingLabel.Position = UDim2.new(0, 70, 0, 32)
	ingLabel.BackgroundTransparency = 1
	ingLabel.Text   = table.concat(ingParts, "  ·  ")
	ingLabel.TextColor3 = Color3.fromRGB(140, 130, 160)
	ingLabel.Font   = Enum.Font.Gotham
	ingLabel.TextSize = 11
	ingLabel.TextXAlignment = Enum.TextXAlignment.Left
	ingLabel.TextWrapped = true
	ingLabel.Parent = card

	-- Time label
	local timeLabel = Instance.new("TextLabel")
	timeLabel.Size   = UDim2.new(0, 80, 0, 18)
	timeLabel.Position = UDim2.new(1, -160, 0, 10)
	timeLabel.BackgroundTransparency = 1
	timeLabel.Text   = string.format("⏱ %ds", recipe.BaseCraftTime)
	timeLabel.TextColor3 = Color3.fromRGB(120, 120, 160)
	timeLabel.Font   = Enum.Font.Gotham
	timeLabel.TextSize = 11
	timeLabel.TextXAlignment = Enum.TextXAlignment.Right
	timeLabel.Parent = card

	-- Craft button
	local craftBtn = Instance.new("TextButton")
	craftBtn.Size   = UDim2.new(0, 76, 0, 32)
	craftBtn.Position = UDim2.new(1, -86, 0.5, -16)
	craftBtn.BackgroundColor3 = craftable and accent or Color3.fromRGB(50, 45, 70)
	craftBtn.Text   = "Craft"
	craftBtn.TextColor3 = craftable and Color3.new(1,1,1) or Color3.fromRGB(100, 90, 130)
	craftBtn.Font   = Enum.Font.GothamBold
	craftBtn.TextSize = 13
	craftBtn.BorderSizePixel = 0
	craftBtn.AutoButtonColor = craftable
	craftBtn.Active = craftable
	craftBtn.Parent = card

	local craftBtnCorner = Instance.new("UICorner")
	craftBtnCorner.CornerRadius = UDim.new(0, 7)
	craftBtnCorner.Parent = craftBtn

	if craftable then
		craftBtn.MouseButton1Click:Connect(function()
			Remotes.StartCraft:FireServer(recipeId)
			screenGui.Enabled = false
		end)
	end

	return card
end

local recipeCards: {[string]: Frame} = {}

local function refreshRecipeList()
	for _, child in ipairs(scrollFrame:GetChildren()) do
		if child:IsA("Frame") then child:Destroy() end
	end
	recipeCards = {}

	for recipeId, recipe in pairs(recipes) do
		local card = buildRecipeCard(recipe, recipeId)
		card.Parent = scrollFrame
		recipeCards[recipeId] = card
	end
end

-- ─────────────────────────────────────────────────────────────────────────────
-- Open / close
-- ─────────────────────────────────────────────────────────────────────────────
local function openCrafting()
	refreshRecipeList()
	screenGui.Enabled = true
	panel.Size = UDim2.new(0, 0, 0, 0)
	panel.Position = UDim2.new(0.5, 0, 0.5, 0)
	TweenService:Create(panel, TweenInfo.new(0.25, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
		Size     = UDim2.new(0, 540, 0, 480),
		Position = UDim2.new(0.5, -270, 0.5, -240),
	}):Play()
end

local function closeCrafting()
	TweenService:Create(panel, TweenInfo.new(0.18, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
		Size     = UDim2.new(0, 0, 0, 0),
		Position = UDim2.new(0.5, 0, 0.5, 0),
	}):Play()
	task.delay(0.2, function() screenGui.Enabled = false end)
end

closeBtn.MouseButton1Click:Connect(closeCrafting)
cancelBtn.MouseButton1Click:Connect(function()
	Remotes.CancelCraft:FireServer()
	progressFrame.Visible = false
end)

-- Toggle with G key
UserInputService.InputBegan:Connect(function(input, processed)
	if processed then return end
	if input.KeyCode == Enum.KeyCode.G then
		if screenGui.Enabled then closeCrafting() else openCrafting() end
	end
end)

-- ─────────────────────────────────────────────────────────────────────────────
-- Crafting progress updates
-- ─────────────────────────────────────────────────────────────────────────────
Remotes.CraftProgress:Connect(function(recipeId, progress)
	progressFrame.Visible = true
	local recipe = recipes[recipeId]
	progLabel.Text = recipe and ("Crafting: " .. recipe.Name) or "Crafting…"
	TweenService:Create(progBarFill, TweenInfo.new(0.4), {
		Size = UDim2.new(progress :: number, 0, 1, 0),
	}):Play()
end)

Remotes.CraftComplete:Connect(function(itemId, amount)
	progressFrame.Visible = false
	progBarFill.Size = UDim2.new(0, 0, 1, 0)
	-- Toast notification
	local toast = Instance.new("TextLabel")
	toast.Size   = UDim2.new(0, 260, 0, 40)
	toast.Position = UDim2.new(0.5, -130, 1, -80)
	toast.BackgroundColor3 = Color3.fromRGB(30, 180, 80)
	toast.BorderSizePixel  = 0
	toast.Text   = string.format("✅  Crafted %dx %s!", amount, itemId)
	toast.TextColor3 = Color3.new(1,1,1)
	toast.Font   = Enum.Font.GothamBold
	toast.TextSize = 13
	toast.Parent = screenGui
	local toastCorner = Instance.new("UICorner")
	toastCorner.CornerRadius = UDim.new(0, 8)
	toastCorner.Parent = toast
	TweenService:Create(toast, TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
		{ Position = UDim2.new(0.5, -130, 1, -110) }):Play()
	task.delay(2.5, function()
		TweenService:Create(toast, TweenInfo.new(0.4), { TextTransparency = 1, BackgroundTransparency = 1 }):Play()
		task.delay(0.5, function() toast:Destroy() end)
	end)
end)

Remotes.CraftFailed:Connect(function(reason)
	progressFrame.Visible = false
	local toast = Instance.new("TextLabel")
	toast.Size   = UDim2.new(0, 300, 0, 40)
	toast.Position = UDim2.new(0.5, -150, 1, -80)
	toast.BackgroundColor3 = Color3.fromRGB(200, 50, 50)
	toast.BorderSizePixel  = 0
	toast.Text   = "❌  " .. (reason or "Craft failed.")
	toast.TextColor3 = Color3.new(1,1,1)
	toast.Font   = Enum.Font.GothamBold
	toast.TextSize = 12
	toast.TextWrapped = true
	toast.Parent = screenGui
	local toastCorner = Instance.new("UICorner")
	toastCorner.CornerRadius = UDim.new(0, 8)
	toastCorner.Parent = toast
	TweenService:Create(toast, TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
		{ Position = UDim2.new(0.5, -150, 1, -110) }):Play()
	task.delay(3, function()
		TweenService:Create(toast, TweenInfo.new(0.4), { TextTransparency = 1, BackgroundTransparency = 1 }):Play()
		task.delay(0.5, function() toast:Destroy() end)
	end)
end)

-- Refresh inventory display when it updates
Remotes.UpdateInventory:Connect(function(newInv)
	inventory = newInv :: any
	if screenGui.Enabled then refreshRecipeList() end
end)

return {}
