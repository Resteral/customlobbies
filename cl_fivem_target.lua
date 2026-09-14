-- FiveM ox_target / qb-target Style Eye Interaction System for Helix
local PLUGIN = PLUGIN

PLUGIN.TargetOptions = PLUGIN.TargetOptions or {}
PLUGIN.TargetModels = PLUGIN.TargetModels or {}
PLUGIN.TargetClasses = PLUGIN.TargetClasses or {}

local isTargeting = false
local currentTarget = nil
local activeOptions = {}

surface.CreateFont("FiveM_Target_Font", {
    font = "Montserrat",
    size = 14,
    weight = 700,
    antialias = true
})

-- Target Registration API
function PLUGIN:AddTargetClass(className, options)
    self.TargetClasses[className] = options
end

function PLUGIN:AddTargetModel(modelPath, options)
    self.TargetModels[string.lower(modelPath)] = options
end

-- Default Target Class Registrations
PLUGIN:AddTargetClass("prop_door_rotating", {
    {
        icon = "lock",
        label = "Lockpick Door",
        action = function(ent)
            local char = LocalPlayer():GetCharacter()
            local lockSkill = char and char:GetSkillLevel("lockpicking") or 1
            net.Start("ixPerpStartLockpick")
                net.WriteEntity(ent)
                net.WriteInt(lockSkill, 8)
            net.SendToServer()
        end
    },
    {
        icon = "door",
        label = "Door Management",
        action = function(ent)
            LocalPlayer():ConCommand("ix_door_menu")
        end
    }
})

PLUGIN:AddTargetClass("ix_perp_crafting_bench", {
    {
        icon = "wrench",
        label = "Open Crafting Workbench",
        action = function(ent)
            net.Start("ixPerpOpenCraftingUI")
                net.WriteEntity(ent)
            net.SendToServer()
        end
    }
})

PLUGIN:AddTargetClass("ix_weed_pot", {
    {
        icon = "leaf",
        label = "Tend / Water Pot",
        action = function(ent)
            net.Start("ixWeedPotInteract")
                net.WriteEntity(ent)
            net.SendToServer()
        end
    }
})

PLUGIN:AddTargetClass("ix_meth_lab", {
    {
        icon = "flask",
        label = "Open Meth Cook Chemistry",
        action = function(ent)
            net.Start("ixDrugLabInteract")
                net.WriteEntity(ent)
            net.SendToServer()
        end
    }
})

PLUGIN:AddTargetClass("ix_drillable_safe", {
    {
        icon = "key",
        label = "Crack Safe Tumbler",
        action = function(ent)
            local char = LocalPlayer():GetCharacter()
            local lockSkill = char and char:GetSkillLevel("lockpicking") or 1
            net.Start("ixPerpStartLockpick")
                net.WriteEntity(ent)
                net.WriteInt(lockSkill, 8)
            net.SendToServer()
        end
    }
})

PLUGIN:AddTargetClass("ix_blackmarket_npc", {
    {
        icon = "cart",
        label = "Access Black Market Dealer",
        action = function(ent)
            net.Start("ixOpenBlackMarketUI")
                net.WriteEntity(ent)
            net.SendToServer()
        end
    }
})

-- Player & Vehicle Dynamic Targets
local function GetEntityTargetOptions(ent)
    if not IsValid(ent) then return nil end
    local options = {}

    local class = ent:GetClass()
    if PLUGIN.TargetClasses[class] then
        for _, opt in ipairs(PLUGIN.TargetClasses[class]) do
            table.insert(options, opt)
        end
    end

    if ent:IsVehicle() or class == "prop_vehicle_jeep" or class == "prop_vehicle_airboat" then
        table.insert(options, {
            icon = "car",
            label = "Open Vehicle Trunk",
            action = function(v)
                net.Start("ixVehOpenTrunk")
                    net.WriteEntity(v)
                net.SendToServer()
            end
        })
        table.insert(options, {
            icon = "key",
            label = "Toggle Engine",
            action = function(v)
                net.Start("ixVehToggleEngine")
                    net.WriteEntity(v)
                net.SendToServer()
            end
        })
        table.insert(options, {
            icon = "lock",
            label = "Lockpick Vehicle",
            action = function(v)
                local char = LocalPlayer():GetCharacter()
                local lockSkill = char and char:GetSkillLevel("lockpicking") or 1
                net.Start("ixPerpStartLockpick")
                    net.WriteEntity(v)
                    net.WriteInt(lockSkill, 8)
                net.SendToServer()
            end
        })
    elseif ent:IsPlayer() and ent ~= LocalPlayer() then
        table.insert(options, {
            icon = "handcuffs",
            label = "Restrain / Unrestrain",
            action = function(p)
                net.Start("ixPerpToggleCuff")
                    net.WriteEntity(p)
                net.SendToServer()
            end
        })
        table.insert(options, {
            icon = "search",
            label = "Search Pockets",
            action = function(p)
                net.Start("ixPerpSearchPlayer")
                    net.WriteEntity(p)
                net.SendToServer()
            end
        })
    end

    return #options > 0 and options or nil
end

-- Keybinds Hook (Hold Left Alt for Target Eye)
hook.Add("Think", "FiveM_Target_KeyThink", function()
    local isAltDown = input.IsKeyDown(KEY_LALT)
    if isAltDown and not isTargeting then
        isTargeting = true
        gui.EnableScreenClicker(true)
    elseif not isAltDown and isTargeting then
        isTargeting = false
        gui.EnableScreenClicker(false)
        currentTarget = nil
        activeOptions = {}
    end

    if isTargeting then
        local ply = LocalPlayer()
        local trace = ply:GetEyeTrace()
        if IsValid(trace.Entity) and trace.HitPos:DistToSqr(ply:GetPos()) < 22500 then
            currentTarget = trace.Entity
            activeOptions = GetEntityTargetOptions(currentTarget) or {}
        else
            currentTarget = nil
            activeOptions = {}
        end
    end
end)

-- Render HUD Eye & Option Badges
function PLUGIN:HUDPaintBackground()
    if not isTargeting then return end

    local scrW, scrH = ScrW(), ScrH()
    local centerX, centerY = scrW / 2, scrH / 2
    local hasTarget = IsValid(currentTarget) and #activeOptions > 0

    -- Center Eye Icon
    local eyeColor = hasTarget and Color(0, 255, 200, 240) or Color(255, 255, 255, 180)
    surface.SetDrawColor(eyeColor)
    surface.DrawRect(centerX - 4, centerY - 4, 8, 8)
    surface.DrawOutlinedRect(centerX - 8, centerY - 8, 16, 16)

    if hasTarget then
        -- Render Interactive Context Badges next to crosshair
        local menuX = centerX + 30
        local menuY = centerY - (#activeOptions * 18)

        local mouseX, mouseY = gui.MousePos()

        for i, opt in ipairs(activeOptions) do
            local btnY = menuY + (i - 1) * 38
            local btnW, btnH = 220, 32

            local isHovered = mouseX >= menuX and mouseX <= menuX + btnW and mouseY >= btnY and mouseY <= btnY + btnH

            -- Background
            local bgCol = isHovered and Color(0, 200, 160, 230) or Color(20, 25, 35, 220)
            surface.SetDrawColor(bgCol)
            surface.DrawRect(menuX, btnY, btnW, btnH)

            -- Border
            surface.SetDrawColor(0, 255, 200, isHovered and 255 or 120)
            surface.DrawOutlinedRect(menuX, btnY, btnW, btnH)

            -- Text
            local txtCol = isHovered and Color(10, 20, 25) or Color(255, 255, 255)
            draw.SimpleText(opt.label, "FiveM_Target_Font", menuX + 12, btnY + 8, txtCol, TEXT_ALIGN_LEFT)

            -- Left click execution
            if isHovered and input.IsMouseDown(MOUSE_LEFT) then
                if not opt.hasClicked then
                    opt.hasClicked = true
                    surface.PlaySound("buttons/button15.wav")
                    opt.action(currentTarget)
                    timer.Simple(0.3, function() if opt then opt.hasClicked = false end end)
                end
            end
        end
    end
end
