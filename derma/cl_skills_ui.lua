-- PERP Skills Menu UI for Helix
local PLUGIN = PLUGIN

local PANEL = {}

function PANEL:Init()
    self:SetSize(800, 600)
    self:Center()
    self:SetTitle("")
    self:ShowCloseButton(false)
    self:MakePopup()

    self.clientSkills = PLUGIN.clientSkills or {}

    -- Header / Title Bar
    local topBar = vgui.Create("DPanel", self)
    topBar:Dock(TOP)
    topBar:SetTall(60)
    topBar.Paint = function(s, w, h)
        surface.SetDrawColor(20, 24, 34, 250)
        surface.DrawRect(0, 0, w, h)

        surface.SetDrawColor(243, 156, 18, 200)
        surface.DrawRect(0, h - 2, w, 2)

        draw.SimpleText("PERP SKILLS & PROGRESSION", "DermaLarge", 20, 12, Color(255, 255, 255), TEXT_ALIGN_LEFT)
        
        local totalLevels = 0
        for _, v in pairs(self.clientSkills) do
            totalLevels = totalLevels + (v.level or 1)
        end
        draw.SimpleText("TOTAL MASTERY: LVL " .. totalLevels .. " / 120", "DermaDefaultBold", w - 80, 22, Color(243, 156, 18), TEXT_ALIGN_RIGHT)
    end

    local closeBtn = vgui.Create("DButton", topBar)
    closeBtn:SetSize(36, 36)
    closeBtn:SetPos(750, 12)
    closeBtn:SetText("✕")
    closeBtn:SetFont("DermaDefaultBold")
    closeBtn:SetTextColor(Color(255, 255, 255))
    closeBtn.Paint = function(s, w, h)
        local col = s:IsHovered() and Color(231, 76, 60, 220) or Color(40, 45, 58, 200)
        surface.SetDrawColor(col)
        surface.DrawRect(0, 0, w, h)
    end
    closeBtn.DoClick = function()
        self:Close()
    end

    -- Scrollable Skills Area
    local scroll = vgui.Create("DScrollPanel", self)
    scroll:Dock(FILL)
    scroll:DockMargin(15, 15, 15, 15)

    local sbar = scroll:GetVBar()
    sbar:SetWide(6)
    sbar.Paint = function(s, w, h) surface.SetDrawColor(15, 18, 26, 150) surface.DrawRect(0, 0, w, h) end
    sbar.btnGrip.Paint = function(s, w, h) surface.SetDrawColor(243, 156, 18, 200) surface.DrawRect(0, 0, w, h) end
    sbar.btnUp.Paint = function() end
    sbar.btnDown.Paint = function() end

    for skillID, info in pairs(PLUGIN.Skills) do
        local userSkill = self.clientSkills[skillID] or { level = 1, xp = 0 }
        local curLevel = userSkill.level or 1
        local curXP = userSkill.xp or 0
        local maxLevel = info.maxLevel or 20
        local reqXP = PLUGIN:GetRequiredSkillXP(curLevel)
        local progress = curLevel >= maxLevel and 1 or math.Clamp(curXP / reqXP, 0, 1)

        local card = scroll:Add("DPanel")
        card:Dock(TOP)
        card:DockMargin(0, 0, 0, 12)
        card:SetTall(110)
        card.Paint = function(s, w, h)
            -- Background
            surface.SetDrawColor(25, 30, 42, 230)
            surface.DrawRect(0, 0, w, h)

            -- Left accent color stripe
            surface.SetDrawColor(info.color or Color(243, 156, 18))
            surface.DrawRect(0, 0, 6, h)

            -- Border
            surface.SetDrawColor(45, 52, 70, 200)
            surface.DrawOutlinedRect(0, 0, w, h)

            -- Skill Title & Level
            draw.SimpleText(string.upper(info.name), "DermaDefaultBold", 20, 12, Color(255, 255, 255), TEXT_ALIGN_LEFT)
            draw.SimpleText("LEVEL " .. curLevel .. " / " .. maxLevel, "DermaDefaultBold", w - 20, 12, info.color, TEXT_ALIGN_RIGHT)

            -- Skill Description
            draw.SimpleText(info.desc, "DermaDefault", 20, 32, Color(180, 185, 200), TEXT_ALIGN_LEFT)

            -- Progress Bar
            local barX, barY, barW, barH = 20, 56, w - 40, 14
            surface.SetDrawColor(15, 18, 25, 240)
            surface.DrawRect(barX, barY, barW, barH)

            surface.SetDrawColor(info.color)
            surface.DrawRect(barX, barY, barW * progress, barH)

            surface.SetDrawColor(60, 68, 88, 150)
            surface.DrawOutlinedRect(barX, barY, barW, barH)

            -- XP Text
            local xpText = curLevel >= maxLevel and "MAX LEVEL" or (curXP .. " / " .. reqXP .. " XP (" .. math.floor(progress * 100) .. "%)")
            draw.SimpleText(xpText, "DermaDefaultBold", barX + (barW / 2), barY - 1, Color(255, 255, 255), TEXT_ALIGN_CENTER)

            -- Next Perk Display
            local nextPerk = "Maxed out!"
            for lvl, perk in SortedPairs(info.perks or {}) do
                if lvl > curLevel then
                    nextPerk = "Next (Lvl " .. lvl .. "): " .. perk
                    break
                end
            end
            draw.SimpleText("★ PERK: " .. nextPerk, "DermaDefault", 20, 80, Color(241, 196, 15), TEXT_ALIGN_LEFT)
        end
    end
end

function PANEL:Paint(w, h)
    surface.SetDrawColor(12, 15, 22, 245)
    surface.DrawRect(0, 0, w, h)

    surface.SetDrawColor(40, 48, 65, 200)
    surface.DrawOutlinedRect(0, 0, w, h)
end

vgui.Register("ixPerpSkillsUI", PANEL, "DFrame")

-- Network receiver to update client skills cache
net.Receive("ixPerpSkillUpdate", function()
    local skillID = net.ReadString()
    local level = net.ReadInt(8)
    local xp = net.ReadInt(32)

    PLUGIN.clientSkills = PLUGIN.clientSkills or {}
    PLUGIN.clientSkills[skillID] = { level = level, xp = xp }
end)

net.Receive("ixPerpOpenSkillsUI", function()
    PLUGIN.clientSkills = net.ReadTable() or {}
    if IsValid(ix.gui.perpSkillsUI) then
        ix.gui.perpSkillsUI:Remove()
    end
    ix.gui.perpSkillsUI = vgui.Create("ixPerpSkillsUI")
end)

net.Receive("ixPerpSkillLevelUp", function()
    local skillID = net.ReadString()
    local level = net.ReadInt(8)

    surface.PlaySound("garrysmod/save_load1.wav")
    local skillName = PLUGIN.Skills[skillID] and PLUGIN.Skills[skillID].name or skillID
    ix.util.Notify("★ SKILL LEVEL UP: " .. skillName .. " is now Level " .. level .. "!")
end)
