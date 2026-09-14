-- PERP Crafting Catalog UI for Helix
local PLUGIN = PLUGIN

local PANEL = {}

function PANEL:Init()
    self:SetSize(860, 580)
    self:Center()
    self:SetTitle("")
    self:ShowCloseButton(false)
    self:MakePopup()

    self.selectedCategory = "All"
    self.selectedRecipeID = nil
    self.benchEntity = nil
    self.isCrafting = false
    self.craftEndTime = 0
    self.craftDuration = 0

    -- Header
    local topBar = vgui.Create("DPanel", self)
    topBar:Dock(TOP)
    topBar:SetTall(60)
    topBar.Paint = function(s, w, h)
        surface.SetDrawColor(20, 24, 34, 250)
        surface.DrawRect(0, 0, w, h)

        surface.SetDrawColor(243, 156, 18, 220)
        surface.DrawRect(0, h - 2, w, 2)

        draw.SimpleText("WORKBENCH BLUEPRINTS & FABRICATION", "DermaLarge", 20, 14, Color(255, 255, 255), TEXT_ALIGN_LEFT)
    end

    local closeBtn = vgui.Create("DButton", topBar)
    closeBtn:SetSize(36, 36)
    closeBtn:SetPos(810, 12)
    closeBtn:SetText("✕")
    closeBtn:SetFont("DermaDefaultBold")
    closeBtn:SetTextColor(Color(255, 255, 255))
    closeBtn.Paint = function(s, w, h)
        local col = s:IsHovered() and Color(231, 76, 60, 220) or Color(40, 45, 58, 200)
        surface.SetDrawColor(col)
        surface.DrawRect(0, 0, w, h)
    end
    closeBtn.DoClick = function() self:Close() end

    -- Left category sidebar
    local catPanel = vgui.Create("DPanel", self)
    catPanel:Dock(LEFT)
    catPanel:SetWide(200)
    catPanel:DockMargin(12, 12, 6, 12)
    catPanel.Paint = function(s, w, h)
        surface.SetDrawColor(22, 26, 38, 220)
        surface.DrawRect(0, 0, w, h)
        surface.SetDrawColor(40, 46, 62, 180)
        surface.DrawOutlinedRect(0, 0, w, h)
    end

    local categories = { "All", "Tools & Burglary", "Vehicle & Mechanics", "Botany & Agriculture", "Construction" }
    for _, cat in ipairs(categories) do
        local catBtn = vgui.Create("DButton", catPanel)
        catBtn:Dock(TOP)
        catBtn:SetTall(42)
        catBtn:DockMargin(8, 8, 8, 0)
        catBtn:SetText(cat)
        catBtn:SetFont("DermaDefaultBold")
        catBtn:SetTextColor(Color(240, 240, 240))
        catBtn.Paint = function(s, w, h)
            local isSel = self.selectedCategory == cat
            local col = isSel and Color(243, 156, 18, 200) or (s:IsHovered() and Color(35, 42, 60, 220) or Color(28, 34, 48, 180))
            surface.SetDrawColor(col)
            surface.DrawRect(0, 0, w, h)
            if isSel then
                surface.SetDrawColor(255, 255, 255, 240)
                surface.DrawRect(0, 0, 4, h)
            end
        end
        catBtn.DoClick = function()
            self.selectedCategory = cat
            self:PopulateRecipes()
        end
    end

    -- Center Recipe List
    self.recipeScroll = vgui.Create("DScrollPanel", self)
    self.recipeScroll:Dock(LEFT)
    self.recipeScroll:SetWide(300)
    self.recipeScroll:DockMargin(6, 12, 6, 12)
    self.recipeScroll.Paint = function(s, w, h)
        surface.SetDrawColor(22, 26, 38, 220)
        surface.DrawRect(0, 0, w, h)
        surface.SetDrawColor(40, 46, 62, 180)
        surface.DrawOutlinedRect(0, 0, w, h)
    end

    -- Right Detail Panel
    self.detailPanel = vgui.Create("DPanel", self)
    self.detailPanel:Dock(FILL)
    self.detailPanel:DockMargin(6, 12, 12, 12)
    self.detailPanel.Paint = function(s, w, h)
        surface.SetDrawColor(22, 26, 38, 220)
        surface.DrawRect(0, 0, w, h)
        surface.SetDrawColor(40, 46, 62, 180)
        surface.DrawOutlinedRect(0, 0, w, h)
    end

    self:PopulateRecipes()
end

function PANEL:SetBenchEntity(ent)
    self.benchEntity = ent
end

function PANEL:PopulateRecipes()
    self.recipeScroll:Clear()

    for recipeID, recipe in pairs(PLUGIN.CraftingRecipes) do
        if self.selectedCategory == "All" or recipe.category == self.selectedCategory then
            local rBtn = self.recipeScroll:Add("DButton")
            rBtn:Dock(TOP)
            rBtn:SetTall(56)
            rBtn:DockMargin(6, 6, 6, 0)
            rBtn:SetText("")
            rBtn.Paint = function(s, w, h)
                local isSel = self.selectedRecipeID == recipeID
                local col = isSel and Color(38, 48, 70, 240) or (s:IsHovered() and Color(30, 36, 52, 220) or Color(24, 28, 40, 180))
                surface.SetDrawColor(col)
                surface.DrawRect(0, 0, w, h)
                if isSel then
                    surface.SetDrawColor(243, 156, 18, 240)
                    surface.DrawRect(0, 0, 4, h)
                end

                draw.SimpleText(recipe.name, "DermaDefaultBold", 12, 10, Color(255, 255, 255), TEXT_ALIGN_LEFT)
                draw.SimpleText(recipe.category .. " | " .. (recipe.craftTime or 5) .. "s", "DermaDefault", 12, 30, Color(160, 165, 180), TEXT_ALIGN_LEFT)
            end
            rBtn.DoClick = function()
                self.selectedRecipeID = recipeID
                self:ShowRecipeDetails(recipeID)
            end

            if not self.selectedRecipeID then
                self.selectedRecipeID = recipeID
                self:ShowRecipeDetails(recipeID)
            end
        end
    end
end

function PANEL:ShowRecipeDetails(recipeID)
    self.detailPanel:Clear()
    local recipe = PLUGIN.CraftingRecipes[recipeID]
    if not recipe then return end

    local char = LocalPlayer():GetCharacter()
    local inv = char and char:GetInventory()

    -- Title & Description
    local title = vgui.Create("DLabel", self.detailPanel)
    title:Dock(TOP)
    title:DockMargin(16, 16, 16, 4)
    title:SetText(recipe.name)
    title:SetFont("DermaLarge")
    title:SetTextColor(Color(255, 255, 255))
    title:SizeToContents()

    local desc = vgui.Create("DLabel", self.detailPanel)
    desc:Dock(TOP)
    desc:DockMargin(16, 4, 16, 12)
    desc:SetText(recipe.desc or "")
    desc:SetFont("DermaDefault")
    desc:SetTextColor(Color(180, 185, 200))
    desc:SetWrap(true)
    desc:SetAutoStretchVertical(true)

    -- Required Skills Section
    local skillHeader = vgui.Create("DLabel", self.detailPanel)
    skillHeader:Dock(TOP)
    skillHeader:DockMargin(16, 8, 16, 4)
    skillHeader:SetText("REQUIRED SKILLS:")
    skillHeader:SetFont("DermaDefaultBold")
    skillHeader:SetTextColor(Color(243, 156, 18))

    local canCraft = true

    if recipe.reqSkills then
        for skillID, reqLvl in pairs(recipe.reqSkills) do
            local sName = PLUGIN.Skills[skillID] and PLUGIN.Skills[skillID].name or skillID
            local curLvl = PLUGIN.clientSkills and PLUGIN.clientSkills[skillID] and PLUGIN.clientSkills[skillID].level or 1
            local met = curLvl >= reqLvl
            if not met then canCraft = false end

            local sLbl = vgui.Create("DLabel", self.detailPanel)
            sLbl:Dock(TOP)
            sLbl:DockMargin(24, 2, 16, 2)
            sLbl:SetText("• " .. sName .. ": Level " .. reqLvl .. " (Your Level: " .. curLvl .. ") " .. (met and "✓" or "✗"))
            sLbl:SetFont("DermaDefault")
            sLbl:SetTextColor(met and Color(46, 204, 113) or Color(231, 76, 60))
        end
    end

    -- Required Materials Section
    local matHeader = vgui.Create("DLabel", self.detailPanel)
    matHeader:Dock(TOP)
    matHeader:DockMargin(16, 12, 16, 4)
    matHeader:SetText("REQUIRED INGREDIENTS:")
    matHeader:SetFont("DermaDefaultBold")
    matHeader:SetTextColor(Color(243, 156, 18))

    for itemID, count in pairs(recipe.ingredients or {}) do
        local itemCount = 0
        if inv then
            itemCount = #inv:GetItemsByUniqueID(itemID)
        end
        local met = itemCount >= count
        if not met then canCraft = false end

        local mLbl = vgui.Create("DLabel", self.detailPanel)
        mLbl:Dock(TOP)
        mLbl:DockMargin(24, 2, 16, 2)
        mLbl:SetText("• " .. itemID .. ": " .. itemCount .. " / " .. count .. " " .. (met and "✓" or "✗"))
        mLbl:SetFont("DermaDefault")
        mLbl:SetTextColor(met and Color(46, 204, 113) or Color(231, 76, 60))
    end

    -- Craft Progress Bar & Action Button
    local craftBtn = vgui.Create("DButton", self.detailPanel)
    craftBtn:Dock(BOTTOM)
    craftBtn:DockMargin(16, 16, 16, 16)
    craftBtn:SetTall(48)
    craftBtn:SetText("")
    craftBtn.Paint = function(s, w, h)
        if self.isCrafting then
            local timeLeft = math.max(0, self.craftEndTime - CurTime())
            local progress = 1 - (timeLeft / self.craftDuration)
            surface.SetDrawColor(30, 35, 48, 240)
            surface.DrawRect(0, 0, w, h)

            surface.SetDrawColor(243, 156, 18, 220)
            surface.DrawRect(0, 0, w * progress, h)

            draw.SimpleText("FABRICATING... " .. string.format("%.1f", timeLeft) .. "s", "DermaDefaultBold", w / 2, h / 2 - 8, Color(255, 255, 255), TEXT_ALIGN_CENTER)
        else
            local col = canCraft and (s:IsHovered() and Color(39, 174, 96, 240) or Color(46, 204, 113, 220)) or Color(80, 85, 95, 180)
            surface.SetDrawColor(col)
            surface.DrawRect(0, 0, w, h)
            surface.SetDrawColor(255, 255, 255, 60)
            surface.DrawOutlinedRect(0, 0, w, h)

            local txt = canCraft and ("CRAFT ITEM (" .. (recipe.craftTime or 5) .. "s)") or "MISSING REQUIREMENTS"
            draw.SimpleText(txt, "DermaDefaultBold", w / 2, h / 2 - 8, Color(255, 255, 255), TEXT_ALIGN_CENTER)
        end
    end
    craftBtn.DoClick = function()
        if not canCraft or self.isCrafting then return end

        self.isCrafting = true
        self.craftDuration = recipe.craftTime or 5
        self.craftEndTime = CurTime() + self.craftDuration

        surface.PlaySound("ambient/machines/combine_terminal_idle2.wav")

        timer.Simple(self.craftDuration, function()
            if IsValid(self) then
                net.Start("ixPerpCraftItem")
                    net.WriteString(recipeID)
                    net.WriteEntity(self.benchEntity)
                net.SendToServer()
                self.isCrafting = false
                self:ShowRecipeDetails(recipeID)
            end
        end)
    end
end

function PANEL:Paint(w, h)
    surface.SetDrawColor(14, 18, 26, 245)
    surface.DrawRect(0, 0, w, h)

    surface.SetDrawColor(40, 48, 65, 200)
    surface.DrawOutlinedRect(0, 0, w, h)
end

vgui.Register("ixPerpCraftingUI", PANEL, "DFrame")

net.Receive("ixPerpOpenCraftingUI", function()
    local benchEnt = net.ReadEntity()
    if IsValid(ix.gui.perpCraftingUI) then
        ix.gui.perpCraftingUI:Remove()
    end
    ix.gui.perpCraftingUI = vgui.Create("ixPerpCraftingUI")
    if IsValid(ix.gui.perpCraftingUI) then
        ix.gui.perpCraftingUI:SetBenchEntity(benchEnt)
    end
end)
