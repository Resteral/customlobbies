--[[
    Helix In-Game Admin Live System & Spawner Editor
    Allows administrators to view all registered systems, spawn them live into the world,
    save placements to database/JSON persistence, and export code directly.
]]--

local PANEL = {}

function PANEL:Init()
    self:SetSize(ScrW() * 0.65, ScrH() * 0.7)
    self:Center()
    self:MakePopup()
    self:SetTitle("Helix Game System & World Spawner Studio")

    -- Left Sidebar (System Types List)
    self.sidebar = vgui.Create("DScrollPanel", self)
    self.sidebar:Dock(LEFT)
    self.sidebar:SetWide(260)
    self.sidebar:DockMargin(10, 10, 5, 10)
    self.sidebar.Paint = function(s, w, h)
        draw.RoundedBox(6, 0, 0, w, h, Color(18, 22, 28, 220))
    end

    -- Right Content Area (Selected System Details & Controls)
    self.content = vgui.Create("DPanel", self)
    self.content:Dock(FILL)
    self.content:DockMargin(5, 10, 10, 10)
    self.content.Paint = function(s, w, h)
        draw.RoundedBox(6, 0, 0, w, h, Color(24, 28, 36, 220))
    end

    -- Bottom Global Controls
    local bottomBar = self:Add("DPanel")
    bottomBar:Dock(BOTTOM)
    bottomBar:SetTall(46)
    bottomBar:DockMargin(10, 0, 10, 10)
    bottomBar.Paint = function() end

    local saveBtn = bottomBar:Add("DButton")
    saveBtn:Dock(RIGHT)
    saveBtn:SetWide(180)
    saveBtn:SetText("💾 Save All to World Data")
    saveBtn:SetFont("DermaDefaultBold")
    saveBtn:SetTextColor(Color(255, 255, 255))
    saveBtn.Paint = function(s, w, h)
        draw.RoundedBox(6, 0, 0, w, h, s:IsHovered() and Color(41, 128, 185) or Color(52, 152, 219))
    end
    saveBtn.DoClick = function()
        LocalPlayer():ConCommand("ix SaveCustomStations")
        surface.PlaySound("buttons/button14.wav")
        chat.AddText(Color(46, 204, 113), "[Helix Studio] Saved all station entities to persistence data.")
    end
end

function PANEL:PopulateSystems(systems)
    self.systems = systems or {}
    self.sidebar:Clear()

    for id, sys in pairs(self.systems) do
        local btn = self.sidebar:Add("DButton")
        btn:Dock(TOP)
        btn:SetTall(38)
        btn:DockMargin(4, 4, 4, 0)
        btn:SetText(sys.name or id)
        btn:SetTextColor(Color(240, 240, 240))
        btn.Paint = function(s, w, h)
            local bg = s:IsHovered() and Color(45, 52, 65) or Color(28, 32, 42)
            draw.RoundedBox(4, 0, 0, w, h, bg)
        end
        btn.DoClick = function()
            self:ShowSystemDetails(id, sys)
        end
    end

    -- Select first system by default
    local firstID, firstSys = next(self.systems)
    if firstID then
        self:ShowSystemDetails(firstID, firstSys)
    end
end

function PANEL:ShowSystemDetails(id, sys)
    self.content:Clear()

    local title = self.content:Add("DLabel")
    title:Dock(TOP)
    title:DockMargin(16, 16, 16, 8)
    title:SetFont("DermaLarge")
    title:SetText(sys.name or id)
    title:SetTextColor(Color(255, 255, 255))

    local meta = self.content:Add("DLabel")
    meta:Dock(TOP)
    meta:DockMargin(16, 0, 16, 16)
    meta:SetFont("DermaDefault")
    meta:SetText("System ID: " .. id .. " | Category: " .. (sys.category or "None") .. " | Model: " .. (sys.model or "Default"))
    meta:SetTextColor(Color(180, 190, 200))

    -- Code preview box
    local codeHeader = self.content:Add("DLabel")
    codeHeader:Dock(TOP)
    codeHeader:DockMargin(16, 8, 16, 4)
    codeHeader:SetFont("DermaDefaultBold")
    codeHeader:SetText("Lua Definition:")
    codeHeader:SetTextColor(Color(241, 196, 15))

    local codeBox = self.content:Add("DTextEntry")
    codeBox:Dock(FILL)
    codeBox:DockMargin(16, 0, 16, 16)
    codeBox:SetMultiline(true)
    codeBox:SetVerticalScrollbarEnabled(true)

    local luaRepresentation = string.format([[ix.customSystems.Register("%s", {
    name = "%s",
    category = "%s",
    model = "%s",
    processTime = %d,
    reqSkills = %s,
    inputs = %s,
    outputs = %s,
    xp = { skill = "%s", amount = %d }
})]],
        id,
        sys.name or id,
        sys.category or "General",
        sys.model or "models/props_c17/furnituretable002a.mdl",
        sys.processTime or 5,
        util.TableToJSON(sys.reqSkills or {}),
        util.TableToJSON(sys.inputs or {}),
        util.TableToJSON(sys.outputs or {}),
        sys.xp and sys.xp.skill or "crafting",
        sys.xp and sys.xp.amount or 25
    )

    codeBox:SetText(luaRepresentation)

    -- Action Buttons Panel
    local btnBar = self.content:Add("DPanel")
    btnBar:Dock(BOTTOM)
    btnBar:SetTall(42)
    btnBar:DockMargin(16, 0, 16, 16)
    btnBar.Paint = function() end

    local spawnBtn = btnBar:Add("DButton")
    spawnBtn:Dock(LEFT)
    spawnBtn:SetWide(200)
    spawnBtn:SetText("➕ Spawn at Crosshair")
    spawnBtn:SetFont("DermaDefaultBold")
    spawnBtn:SetTextColor(Color(255, 255, 255))
    spawnBtn.Paint = function(s, w, h)
        draw.RoundedBox(6, 0, 0, w, h, s:IsHovered() and Color(39, 174, 96) or Color(46, 204, 113))
    end
    spawnBtn.DoClick = function()
        LocalPlayer Lap = LocalPlayer()
        RunConsoleCommand("ix", "SpawnStation", id)
        surface.PlaySound("buttons/button15.wav")
    end

    local copyBtn = btnBar:Add("DButton")
    copyBtn:Dock(RIGHT)
    copyBtn:SetWide(180)
    copyBtn:SetText("📋 Copy Lua Code")
    copyBtn:SetFont("DermaDefaultBold")
    copyBtn:SetTextColor(Color(255, 255, 255))
    copyBtn.Paint = function(s, w, h)
        draw.RoundedBox(6, 0, 0, w, h, s:IsHovered() and Color(142, 68, 173) or Color(155, 89, 182))
    end
    copyBtn.DoClick = function()
        SetClipboardText(luaRepresentation)
        chat.AddText(Color(155, 89, 182), "[Helix Studio] Copied system Lua definition to clipboard!")
        surface.PlaySound("buttons/button9.wav")
    end
end

function PANEL:Paint(w, h)
    draw.RoundedBox(8, 0, 0, w, h, Color(16, 20, 26, 250))
    draw.RoundedBoxEx(8, 0, 0, w, 32, Color(10, 12, 16, 255), true, true, false, false)
end

vgui.Register("ixSystemEditorMenu", PANEL, "DFrame")
