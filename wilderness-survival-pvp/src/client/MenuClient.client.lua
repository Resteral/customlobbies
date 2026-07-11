-- MenuClient: Programmatically creates and manages the Main Menu GUI
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")

local Player = Players.LocalPlayer
local PlayerGui = Player:WaitForChild("PlayerGui")
local Network = ReplicatedStorage:WaitForChild("Network")
local JoinGameEvent = Network:WaitForChild("JoinGame")

-- Helper: Create Menu UI
local function createMenu()
	local screenGui = Instance.new("ScreenGui")
	screenGui.Name = "MainMenuGui"
	screenGui.ResetOnSpawn = false
	screenGui.IgnoreGuiInset = true
	screenGui.Parent = PlayerGui

	-- Background overlay
	local bg = Instance.new("Frame")
	bg.Name = "Background"
	bg.Size = UDim2.new(1, 0, 1, 0)
	bg.BackgroundColor3 = Color3.fromRGB(15, 15, 20)
	bg.BorderSizePixel = 0
	bg.Parent = screenGui

	-- Gradient background look
	local gradient = Instance.new("UIGradient")
	gradient.Color = ColorSequence.new({
		ColorSequenceKeypoint.new(0, Color3.fromRGB(12, 12, 16)),
		ColorSequenceKeypoint.new(1, Color3.fromRGB(24, 28, 38))
	})
	gradient.Rotation = 45
	gradient.Parent = bg

	-- Main panel container
	local container = Instance.new("Frame")
	container.Name = "Container"
	container.Size = UDim2.new(0, 480, 0, 320)
	container.Position = UDim2.new(0.5, -240, 0.5, -160)
	container.BackgroundTransparency = 1
	container.Parent = bg

	-- Game Title
	local title = Instance.new("TextLabel")
	title.Name = "Title"
	title.Text = "WILDERNESS PVP SURVIVAL"
	title.Font = Enum.Font.GothamBold
	title.TextSize = 28
	title.TextColor3 = Color3.fromRGB(255, 255, 255)
	title.Size = UDim2.new(1, 0, 0, 50)
	title.Position = UDim2.new(0, 0, 0.1, 0)
	title.BackgroundTransparency = 1
	title.Parent = container

	-- Title glow stroke
	local titleStroke = Instance.new("UIStroke")
	titleStroke.Color = Color3.fromRGB(74, 185, 124)
	titleStroke.Thickness = 1.2
	titleStroke.Parent = title

	-- Game Subtitle
	local subtitle = Instance.new("TextLabel")
	subtitle.Name = "Subtitle"
	subtitle.Text = "Harvest resources. Build a base. Survive the freezing night and zombies. Defeat the enemy team."
	subtitle.Font = Enum.Font.GothamMedium
	subtitle.TextSize = 13
	subtitle.TextColor3 = Color3.fromRGB(160, 170, 190)
	subtitle.Size = UDim2.new(1, -40, 0, 60)
	subtitle.Position = UDim2.new(0, 20, 0.3, 0)
	subtitle.BackgroundTransparency = 1
	subtitle.TextWrapped = true
	subtitle.Parent = container

	-- Play Button
	local playBtn = Instance.new("TextButton")
	playBtn.Name = "PlayButton"
	playBtn.Text = "PLAY NOW"
	playBtn.Font = Enum.Font.GothamBold
	playBtn.TextSize = 16
	playBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
	playBtn.BackgroundColor3 = Color3.fromRGB(46, 175, 102)
	playBtn.Size = UDim2.new(0, 200, 0, 50)
	playBtn.Position = UDim2.new(0.5, -100, 0.65, 0)
	playBtn.BorderSizePixel = 0
	playBtn.Parent = container

	local btnCorner = Instance.new("UICorner")
	btnCorner.CornerRadius = UDim.new(0, 8)
	btnCorner.Parent = playBtn

	local btnStroke = Instance.new("UIStroke")
	btnStroke.Color = Color3.fromRGB(75, 220, 140)
	btnStroke.Thickness = 1.5
	btnStroke.Parent = playBtn

	-- Button Animations & Hover effects
	playBtn.MouseEnter:Connect(function()
		TweenService:Create(playBtn, TweenInfo.new(0.2), {
			BackgroundColor3 = Color3.fromRGB(55, 205, 120),
			Size = UDim2.new(0, 210, 0, 52),
			Position = UDim2.new(0.5, -105, 0.65, -1)
		}):Play()
	end)

	playBtn.MouseLeave:Connect(function()
		TweenService:Create(playBtn, TweenInfo.new(0.2), {
			BackgroundColor3 = Color3.fromRGB(46, 175, 102),
			Size = UDim2.new(0, 200, 0, 50),
			Position = UDim2.new(0.5, -100, 0.65, 0)
		}):Play()
	end)

	-- Button Click Action
	playBtn.MouseButton1Click:Connect(function()
		playBtn.Active = false
		JoinGameEvent:FireServer()
		
		-- Fade out GUI transition
		local fadeTween = TweenService:Create(bg, TweenInfo.new(0.5), { BackgroundTransparency = 1 })
		TweenService:Create(container, TweenInfo.new(0.4), { ImageTransparency = 1 }):Play()
		
		for _, child in ipairs(container:GetChildren()) do
			if child:IsA("TextLabel") or child:IsA("TextButton") then
				TweenService:Create(child, TweenInfo.new(0.4), { TextTransparency = 1, BackgroundTransparency = 1 }):Play()
				local stroke = child:FindFirstChildOfClass("UIStroke")
				if stroke then
					TweenService:Create(stroke, TweenInfo.new(0.4), { Transparency = 1 }):Play()
				end
			end
		end
		
		fadeTween:Play()
		fadeTween.Completed:Connect(function()
			screenGui:Destroy()
		end)
	end)
end

-- Render the menu upon joining
createMenu()
