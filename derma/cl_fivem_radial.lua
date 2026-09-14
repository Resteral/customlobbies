-- FiveM Contextual Radial Quick Wheel Menu for Helix
local PLUGIN = PLUGIN

local PANEL = {}

surface.CreateFont("FiveM_Radial_Font", {
    font = "Montserrat",
    size = 14,
    weight = 700,
    antialias = true
})

surface.CreateFont("FiveM_Radial_Header", {
    font = "Montserrat",
    size = 18,
    weight = 800,
    antialias = true
})

function PANEL:Init()
    self:SetSize(ScrW(), ScrH())
    self:Center()
    self:SetTitle("")
    self:ShowCloseButton(false)
    self:MakePopup()

    self.selectedSlice = -1
    self.slices = self:BuildSlices()
end

function PANEL:BuildSlices()
    local slices = {}
    local ply = LocalPlayer()
    local veh = ply:GetVehicle()
    local char = ply:GetCharacter()
    local isPolice = false

    if char then
        local f = ix.faction.indices[char:GetFaction()]
        if f and (string.find(string.lower(f.name), "police") or string.find(string.lower(f.name), "cop") or string.find(string.lower(f.name), "civil")) then
            isPolice = true
        end
    end

    if IsValid(veh) then
        -- Vehicle Radial Menu
        table.insert(slices, {
            title = "Toggle Engine",
            icon = "key",
            action = function()
                net.Start("ixVehToggleEngine")
                    net.WriteEntity(veh)
                net.SendToServer()
            end
        })
        table.insert(slices, {
            title = "Lock / Unlock",
            icon = "lock",
            action = function()
                net.Start("ixVehToggleLock")
                    net.WriteEntity(veh)
                net.SendToServer()
            end
        })
        table.insert(slices, {
            title = "Open Trunk",
            icon = "box",
            action = function()
                net.Start("ixVehOpenTrunk")
                    net.WriteEntity(veh)
                net.SendToServer()
            end
        })
        table.insert(slices, {
            title = "Toggle Seatbelt",
            icon = "shield",
            action = function()
                local cur = ply:GetNWBool("ixSeatbelt", false)
                ply:SetNWBool("ixSeatbelt", not cur)
                ply:EmitSound(not cur and "buttons/button14.wav" or "buttons/button19.wav")
                ix.util.Notify(not cur and "Seatbelt FASTENED." or "Seatbelt UNBUCKLED.")
            end
        })
    else
        -- On Foot Radial Menu
        table.insert(slices, {
            title = "PERP Skills",
            icon = "star",
            action = function()
                LocalPlayer():ConCommand("ix_skills")
            end
        })
        table.insert(slices, {
            title = "Lockpick Target",
            icon = "key",
            action = function()
                local trace = LocalPlayer():GetEyeTrace()
                if IsValid(trace.Entity) then
                    local c = LocalPlayer():GetCharacter()
                    local s = c and c:GetSkillLevel("lockpicking") or 1
                    net.Start("ixPerpStartLockpick")
                        net.WriteEntity(trace.Entity)
                        net.WriteInt(s, 8)
                    net.SendToServer()
                else
                    ix.util.Notify("Look at a door or vehicle to lockpick!")
                end
            end
        })
        table.insert(slices, {
            title = "Handcuff Suspect",
            icon = "lock",
            action = function()
                local trace = LocalPlayer():GetEyeTrace()
                if IsValid(trace.Entity) and trace.Entity:IsPlayer() then
                    net.Start("ixPerpToggleCuff")
                        net.WriteEntity(trace.Entity)
                    net.SendToServer()
                else
                    ix.util.Notify("Look at a player to handcuff!")
                end
            end
        })
        table.insert(slices, {
            title = "Search Pockets",
            icon = "search",
            action = function()
                local trace = LocalPlayer():GetEyeTrace()
                if IsValid(trace.Entity) and trace.Entity:IsPlayer() then
                    net.Start("ixPerpSearchPlayer")
                        net.WriteEntity(trace.Entity)
                    net.SendToServer()
                else
                    ix.util.Notify("Look at a restrained player to search!")
                end
            end
        })

        if isPolice then
            table.insert(slices, {
                title = "Police MDT / CAD",
                icon = "laptop",
                action = function()
                    LocalPlayer():ConCommand("ix_mdt")
                end
            })
            table.insert(slices, {
                title = "Dispatch GPS",
                icon = "map",
                action = function()
                    ix.util.Notify("Active 911 dispatch waypoints refreshed.")
                end
            })
        else
            table.insert(slices, {
                title = "Call 911 Emergency",
                icon = "phone",
                action = function()
                    Derma_StringRequest("911 Emergency Dispatch", "Describe your emergency to 911 dispatch:", "", function(text)
                        if text and string.Trim(text) ~= "" then
                            net.Start("ixPerpCall911")
                                net.WriteString(text)
                            net.SendToServer()
                        end
                    end)
                end
            })
            table.insert(slices, {
                title = "Black Market Rates",
                icon = "dollar",
                action = function()
                    ix.util.Notify("Check drug dealer NPCs in alleyways for current street prices.")
                end
            })
        end
    end

    return slices
end

function PANEL:Paint(w, h)
    local cx, cy = w / 2, h / 2
    local radius = 220
    local innerRadius = 75
    local count = #self.slices
    if count == 0 then return end

    local mx, my = gui.MousePos()
    local dx, dy = mx - cx, my - cy
    local dist = math.sqrt(dx * dx + dy * dy)
    local mouseAngle = math.deg(math.atan2(dy, dx))
    if mouseAngle < 0 then mouseAngle = mouseAngle + 360 end

    local sliceAngle = 360 / count
    self.selectedSlice = -1

    if dist >= innerRadius and dist <= radius + 30 then
        self.selectedSlice = math.floor((mouseAngle + (sliceAngle / 2)) % 360 / sliceAngle) + 1
    end

    -- Center Core Circle
    surface.SetDrawColor(18, 22, 32, 240)
    draw.NoTexture()

    -- Draw Radial Slices
    for i = 1, count do
        local isSel = (self.selectedSlice == i)
        local baseDeg = (i - 1) * sliceAngle
        local rad = math.rad(baseDeg)

        local itemX = cx + math.cos(rad) * (radius * 0.65)
        local itemY = cy + math.sin(rad) * (radius * 0.65)

        local itemW, itemH = 130, 44
        local cardX = itemX - (itemW / 2)
        local cardY = itemY - (itemH / 2)

        -- Slice card background
        local bgCol = isSel and Color(0, 200, 160, 230) or Color(22, 28, 40, 220)
        surface.SetDrawColor(bgCol)
        surface.DrawRect(cardX, cardY, itemW, itemH)

        surface.SetDrawColor(0, 255, 200, isSel and 255 or 80)
        surface.DrawOutlinedRect(cardX, cardY, itemW, itemH)

        local txtCol = isSel and Color(12, 20, 25) or Color(255, 255, 255)
        draw.SimpleText(self.slices[i].title, "FiveM_Radial_Font", itemX, itemY - 7, txtCol, TEXT_ALIGN_CENTER)
    end

    -- Central Hub Display
    surface.SetDrawColor(12, 15, 22, 250)
    surface.DrawRect(cx - 60, cy - 60, 120, 120)
    surface.SetDrawColor(0, 255, 200, 200)
    surface.DrawOutlinedRect(cx - 60, cy - 60, 120, 120)

    draw.SimpleText("FIVEM", "FiveM_Radial_Header", cx, cy - 18, Color(0, 255, 200), TEXT_ALIGN_CENTER)
    draw.SimpleText("QUICK WHEEL", "FiveM_Radial_Font", cx, cy + 4, Color(200, 205, 215), TEXT_ALIGN_CENTER)
end

function PANEL:OnMousePressed(mouseCode)
    if mouseCode == MOUSE_LEFT and self.selectedSlice > 0 and self.slices[self.selectedSlice] then
        surface.PlaySound("buttons/button15.wav")
        self.slices[self.selectedSlice].action()
        self:Close()
    elseif mouseCode == MOUSE_RIGHT then
        self:Close()
    end
end

function PANEL:Think()
    if input.IsKeyDown(KEY_ESCAPE) then
        self:Close()
    end
end

vgui.Register("ixFiveMRadialMenu", PANEL, "DFrame")

-- Keybind toggle (C key opens radial menu)
hook.Add("PlayerButtonDown", "FiveM_Radial_Keybind", function(ply, button)
    if button == KEY_C and IsFirstTimePredicted() then
        if IsValid(ix.gui.fivemRadial) then
            ix.gui.fivemRadial:Close()
        else
            ix.gui.fivemRadial = vgui.Create("ixFiveMRadialMenu")
        end
    end
end)

concommand.Add("ix_radial", function()
    if IsValid(ix.gui.fivemRadial) then
        ix.gui.fivemRadial:Close()
    else
        ix.gui.fivemRadial = vgui.Create("ixFiveMRadialMenu")
    end
end)
