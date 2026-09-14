--[[
    Interactive Station Player UI
    Displays inputs, outputs, required skills, and process button.
]]--

local PANEL = {}

function PANEL:Init()
    self:SetSize(ScrW() * 0.35, ScrH() * 0.5)
    self:Center()
    self:MakePopup()
    self:SetTitle("Interactive Station")

    self.scroll = vgui.Create("DScrollPanel", self)
    self.scroll:Dock(FILL)
    self.scroll:DockMargin(12, 12, 12, 12)
end

function PANEL:Setup(entity, system)
    self.entity = entity
    self.system = system
    self:SetTitle(system.name)

    -- Header Info
    local header = self.scroll:Add("DPanel")
    header:Dock(TOP)
    header:SetTall(60)
    header:DockMargin(0, 0, 0, 10)
    header.Paint = function(s, w, h)
        draw.RoundedBox(6, 0, 0, w, h, Color(35, 40, 50, 200))
        draw.SimpleText(system.name, "DermaDefaultBold", 12, 14, Color(255, 255, 255))
        draw.SimpleText("Category: " .. (system.category or "General") .. " | Time: " .. system.processTime .. "s", "DermaDefault", 12, 34, Color(180, 190, 200))
    end

    -- Required Skills Section
    if system.reqSkills and next(system.reqSkills) then
        local skillLabel = self.scroll:Add("DLabel")
        skillLabel:Dock(TOP)
        skillLabel:SetFont("DermaDefaultBold")
        skillLabel:SetText("Required Skills:")
        skillLabel:SetTextColor(Color(241, 196, 15))
        skillLabel:DockMargin(0, 0, 0, 4)

        for skill, lvl in pairs(system.reqSkills) do
            local itemRow = self.scroll:Add("DLabel")
            itemRow:Dock(TOP)
            itemRow:SetFont("DermaDefault")
            itemRow:SetText(" • " .. string.upper(skill) .. " Level " .. lvl)
            itemRow:SetTextColor(Color(220, 220, 220))
            itemRow:DockMargin(8, 0, 0, 4)
        end
    end

    -- Input Ingredients Section
    local inLabel = self.scroll:Add("DLabel")
    inLabel:Dock(TOP)
    inLabel:SetFont("DermaDefaultBold")
    inLabel:SetText("Required Ingredients (Consumed):")
    inLabel:SetTextColor(Color(231, 76, 60))
    inLabel:DockMargin(0, 10, 0, 4)

    for itemID, count in pairs(system.inputs) do
        local itemTable = ix.item.list[itemID]
        local itemName = itemTable and itemTable.name or itemID
        local row = self.scroll:Add("DLabel")
        row:Dock(TOP)
        row:SetFont("DermaDefault")
        row:SetText(" • " .. count .. "x " .. itemName)
        row:SetTextColor(Color(240, 240, 240))
        row:DockMargin(8, 0, 0, 4)
    end

    -- Output Yield Section
    local outLabel = self.scroll:Add("DLabel")
    outLabel:Dock(TOP)
    outLabel:SetFont("DermaDefaultBold")
    outLabel:SetText("Expected Output:")
    outLabel:SetTextColor(Color(46, 204, 113))
    outLabel:DockMargin(0, 10, 0, 4)

    for itemID, count in pairs(system.outputs) do
        local itemTable = ix.item.list[itemID]
        local itemName = itemTable and itemTable.name or itemID
        local row = self.scroll:Add("DLabel")
        row:Dock(TOP)
        row:SetFont("DermaDefault")
        row:SetText(" • " .. count .. "x " .. itemName)
        row:SetTextColor(Color(240, 240, 240))
        row:DockMargin(8, 0, 0, 4)
    end

    -- Action Button
    local btn = self:Add("DButton")
    btn:Dock(BOTTOM)
    btn:DockMargin(12, 10, 12, 12)
    btn:SetTall(42)
    btn:SetFont("DermaDefaultBold")
    btn:SetText("START PROCESSING")
    btn:SetTextColor(Color(255, 255, 255))
    btn.Paint = function(s, w, h)
        local col = s:IsHovered() and Color(39, 174, 96) or Color(46, 204, 113)
        draw.RoundedBox(6, 0, 0, w, h, col)
    end

    btn.DoClick = function()
        net.Start("ixCustomSystemProcess")
            net.WriteEntity(self.entity)
            net.WriteString(self.system.id)
        net.SendToServer()
        self:Close()
    end
end

function PANEL:Paint(w, h)
    draw.RoundedBox(8, 0, 0, w, h, Color(22, 26, 34, 248))
    draw.RoundedBoxEx(8, 0, 0, w, 32, Color(16, 18, 24, 255), true, true, false, false)
end

vgui.Register("ixStationMenu", PANEL, "DFrame")
