-- FiveM / Skyrim-Style Interactive Sweet-Spot Lockpick Minigame for Helix
local PLUGIN = PLUGIN

local PANEL = {}

function PANEL:Init()
    self:SetSize(420, 420)
    self:Center()
    self:SetTitle("")
    self:ShowCloseButton(false)
    self:MakePopup()

    self.targetEntity = nil
    self.skillLevel = 1
    self.sweetSpot = math.random(-80, 80)
    self.pickAngle = 0
    self.cylinderAngle = 0
    self.turning = false
    self.pickHealth = 100
    self.isUnlocked = false

    -- Tolerance calculated from Lockpicking skill (Base 12 deg + 1.5 deg per level)
    self.tolerance = 12
end

function PANEL:SetTarget(ent, skillLvl)
    self.targetEntity = ent
    self.skillLevel = skillLvl or 1
    self.tolerance = 12 + (self.skillLevel * 1.5)
end

function PANEL:Think()
    if self.isUnlocked then return end

    -- Update pick angle with mouse X
    if not self.turning then
        local mx = gui.MousePos()
        local cx = self:GetX() + self:GetWide() / 2
        local offset = (mx - cx) / (self:GetWide() / 2)
        self.pickAngle = math.Clamp(offset * 90, -90, 90)
    end

    -- Check if tension key (A, D, or SPACE) is held
    local isTensionHeld = input.IsKeyDown(KEY_A) or input.IsKeyDown(KEY_D) or input.IsKeyDown(KEY_SPACE)
    self.turning = isTensionHeld

    local distFromSweet = math.abs(self.pickAngle - self.sweetSpot)

    if self.turning then
        -- Max possible turn angle based on proximity to sweet spot
        local maxTurn = 0
        if distFromSweet <= self.tolerance then
            maxTurn = 90
        else
            maxTurn = math.max(0, 90 - ((distFromSweet - self.tolerance) * 2.5))
        end

        self.cylinderAngle = math.Approach(self.cylinderAngle, maxTurn, FrameTime() * 150)

        -- If cylinder reaches 90 degrees -> Unlocked!
        if self.cylinderAngle >= 88 then
            self.isUnlocked = true
            surface.PlaySound("doors/door_locked2.wav")
            surface.PlaySound("garrysmod/save_load1.wav")
            notification.AddLegacy("LOCK SUCCESSFULLY PICKED!", NOTIFY_GENERIC, 3)

            net.Start("ixPerpLockpickResult")
                net.WriteEntity(self.targetEntity)
                net.WriteBool(true)
            net.SendToServer()

            timer.Simple(0.8, function()
                if IsValid(self) then self:Close() end
            end)
            return
        end

        -- If struggling at barrier, damage lockpick
        if self.cylinderAngle >= maxTurn - 2 and maxTurn < 85 then
            self.pickHealth = self.pickHealth - FrameTime() * 45
            if math.random(1, 15) == 1 then
                surface.PlaySound("ambient/materials/shutter5.wav")
            end

            -- Pick snaps
            if self.pickHealth <= 0 then
                self.isUnlocked = true
                surface.PlaySound("ambient/materials/metal_groan.wav")
                notification.AddLegacy("YOUR LOCKPICK SNAPPED!", NOTIFY_ERROR, 3)

                net.Start("ixPerpLockpickResult")
                    net.WriteEntity(self.targetEntity)
                    net.WriteBool(false)
                net.SendToServer()

                timer.Simple(0.5, function()
                    if IsValid(self) then self:Close() end
                end)
                return
            end
        end
    else
        self.cylinderAngle = math.Approach(self.cylinderAngle, 0, FrameTime() * 300)
    end

    if input.IsKeyDown(KEY_ESCAPE) then
        self:Close()
    end
end

function PANEL:Paint(w, h)
    local cx, cy = w / 2, h / 2

    -- Background frame
    surface.SetDrawColor(15, 18, 26, 245)
    surface.DrawRect(0, 0, w, h)

    surface.SetDrawColor(155, 89, 182, 220)
    surface.DrawRect(0, 0, w, 4)
    surface.DrawOutlinedRect(0, 0, w, h)

    -- Header
    draw.SimpleText("LOCKPICK TUMBLER MECHANISM", "DermaDefaultBold", cx, 20, Color(255, 255, 255), TEXT_ALIGN_CENTER)
    draw.SimpleText("Move Mouse to align pick | Hold [A / D / SPACE] to turn", "DermaDefault", cx, 38, Color(180, 185, 200), TEXT_ALIGN_CENTER)

    -- Outer Lock Housing Circle
    surface.SetDrawColor(30, 36, 50, 240)
    draw.NoTexture()
    surface.DrawRect(cx - 100, cy - 100, 200, 200)

    surface.SetDrawColor(155, 89, 182, 180)
    surface.DrawOutlinedRect(cx - 100, cy - 100, 200, 200)

    -- Inner Rotating Cylinder Keyway
    local keywayRad = math.rad(self.cylinderAngle)
    local kx = cx + math.sin(keywayRad) * 40
    local ky = cy + math.cos(keywayRad) * 40

    surface.SetDrawColor(10, 12, 18, 255)
    surface.DrawRect(cx - 45, cy - 45, 90, 90)

    -- Render Cylinder Slot Line
    surface.SetDrawColor(241, 196, 15, 240)
    surface.DrawLine(cx, cy - 35, cx, cy + 35)

    -- Render Lockpick Needle
    local pickRad = math.rad(self.pickAngle)
    local px = cx + math.sin(pickRad) * 75
    local py = cy - math.cos(pickRad) * 75

    surface.SetDrawColor(200, 220, 240, 240)
    surface.DrawLine(cx, cy, px, py)
    surface.DrawLine(cx + 1, cy + 1, px + 1, py + 1)

    -- Pick Health / Integrity Bar
    local barW, barH = 260, 10
    local barX, barY = cx - (barW / 2), h - 35

    surface.SetDrawColor(20, 24, 34, 200)
    surface.DrawRect(barX, barY, barW, barH)

    local hpPct = math.Clamp(self.pickHealth / 100, 0, 1)
    local col = hpPct > 0.5 and Color(46, 204, 113) or (hpPct > 0.25 and Color(241, 196, 15) or Color(231, 76, 60))
    surface.SetDrawColor(col)
    surface.DrawRect(barX, barY, barW * hpPct, barH)

    surface.SetDrawColor(60, 70, 90, 150)
    surface.DrawOutlinedRect(barX, barY, barW, barH)

    draw.SimpleText("PICK INTEGRITY: " .. math.floor(self.pickHealth) .. "%", "DermaDefault", cx, barY - 16, Color(220, 220, 230), TEXT_ALIGN_CENTER)
end

vgui.Register("ixLockpickMinigame", PANEL, "DFrame")

net.Receive("ixPerpStartLockpick", function()
    local ent = net.ReadEntity()
    local skillLvl = net.ReadInt(8)

    if IsValid(ix.gui.lockpickMinigame) then
        ix.gui.lockpickMinigame:Remove()
    end

    ix.gui.lockpickMinigame = vgui.Create("ixLockpickMinigame")
    if IsValid(ix.gui.lockpickMinigame) then
        ix.gui.lockpickMinigame:SetTarget(ent, skillLvl)
    end
end)
