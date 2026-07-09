-- ============================================================
-- COAlAbilityTrainer - Combat Log  (/coal log)
--
-- A floating, scrollable, color-coded in-game combat log with
-- rich settings: filter by event type, control font size,
-- opacity, max entries, timestamps, and auto-clear on zone.
-- ============================================================

CoAAT_CombatLog = {}

-- ─────────────────────────────────────────────────────────────
-- Default settings (merged into CoAAT_DB.combatLog on load)
-- ─────────────────────────────────────────────────────────────
CoAAT_CombatLog.DEFAULTS = {
    enabled        = true,
    showTimestamp  = true,
    autoClearZone  = false,
    maxEntries     = 120,
    fontSize       = 10,
    winOpacity     = 0.90,
    -- Per-category filters (true = show)
    showDamageOut  = true,   -- damage player deals
    showDamageIn   = true,   -- damage player takes
    showHealOut    = true,   -- heals player casts
    showHealIn     = true,   -- heals received
    showCasts      = true,   -- SPELL_CAST_SUCCESS
    showMisses     = true,   -- miss/dodge/parry/immune
    showProcs      = true,   -- proc/aura triggers
    showCC         = true,   -- crowd-control applied/removed
    showInterrupts = true,   -- interrupts
    showDeaths     = true,   -- kills / player death
    showResources  = false,  -- resource gain/loss (noisy)
}

local _frame    = nil
local _entries  = {}   -- { text=string, r,g,b }
local _lines    = {}   -- pool of FontString widgets

-- ─────────────────────────────────────────────────────────────
-- Helpers
-- ─────────────────────────────────────────────────────────────
local function DB()
    if not CoAAT_DB then return {} end
    if not CoAAT_DB.combatLog then
        CoAAT_DB.combatLog = {}
        for k, v in pairs(CoAAT_CombatLog.DEFAULTS) do
            CoAAT_DB.combatLog[k] = v
        end
    end
    -- Fill any missing keys (addon updates)
    for k, v in pairs(CoAAT_CombatLog.DEFAULTS) do
        if CoAAT_DB.combatLog[k] == nil then
            CoAAT_DB.combatLog[k] = v
        end
    end
    return CoAAT_DB.combatLog
end

local function TimeStamp()
    local h, m, s = GetGameTime()
    -- GetGameTime returns a float in hours; convert
    if type(h) == "number" and h < 24 then
        local totalSec = math.floor(h * 3600)
        local hh = math.floor(totalSec / 3600) % 24
        local mm = math.floor(totalSec / 60) % 60
        local ss = totalSec % 60
        return string.format("|cff666666[%02d:%02d:%02d]|r ", hh, mm, ss)
    end
    -- Fallback: server time
    return string.format("|cff666666[%s]|r ", date("%H:%M:%S"))
end

-- ─────────────────────────────────────────────────────────────
-- Add an entry
-- ─────────────────────────────────────────────────────────────
function CoAAT_CombatLog.AddEntry(category, text, r, g, b)
    local db = DB()
    if not db.enabled then return end

    -- Category gate
    local gate = {
        damageOut  = db.showDamageOut,
        damageIn   = db.showDamageIn,
        healOut    = db.showHealOut,
        healIn     = db.showHealIn,
        cast       = db.showCasts,
        miss       = db.showMisses,
        proc       = db.showProcs,
        cc         = db.showCC,
        interrupt  = db.showInterrupts,
        death      = db.showDeaths,
        resource   = db.showResources,
    }
    if category and gate[category] == false then return end

    local ts = db.showTimestamp and TimeStamp() or ""
    local full = ts .. text

    -- Trim to maxEntries
    local maxE = db.maxEntries or 120
    while #_entries >= maxE do
        table.remove(_entries, 1)
    end
    table.insert(_entries, { text = full, r = r or 1, g = g or 1, b = b or 1 })

    CoAAT_CombatLog.Refresh()
end

-- ─────────────────────────────────────────────────────────────
-- Refresh the scroll content
-- ─────────────────────────────────────────────────────────────
function CoAAT_CombatLog.Refresh()
    if not _frame or not _frame:IsShown() then return end
    local db = DB()
    local content = _frame._content
    local sz = db.fontSize or 10

    -- Resize pool if needed
    while #_lines < #_entries do
        local fs = content:CreateFontString(nil, "OVERLAY")
        fs:SetFont("Fonts\\FRIZQT__.TTF", sz, "OUTLINE")
        fs:SetJustifyH("LEFT")
        fs:SetWidth(content:GetWidth() - 8)
        table.insert(_lines, fs)
    end

    local lineH = sz + 3
    local yOff  = 0

    for i, entry in ipairs(_entries) do
        local fs = _lines[i]
        fs:SetFont("Fonts\\FRIZQT__.TTF", sz, "OUTLINE")
        fs:SetWidth(content:GetWidth() - 8)
        fs:SetPoint("TOPLEFT", content, "TOPLEFT", 4, yOff)
        fs:SetTextColor(entry.r, entry.g, entry.b)
        fs:SetText(entry.text)
        fs:Show()
        yOff = yOff - (fs:GetStringHeight() + 2)
    end
    -- Hide unused pool slots
    for i = #_entries + 1, #_lines do
        _lines[i]:Hide()
    end

    content:SetHeight(math.abs(yOff) + 10)

    -- Auto-scroll to bottom
    local scroll = _frame._scroll
    local maxVal = math.max(0, content:GetHeight() - scroll:GetHeight())
    scroll:SetVerticalScroll(maxVal)
end

-- ─────────────────────────────────────────────────────────────
-- Clear all entries
-- ─────────────────────────────────────────────────────────────
function CoAAT_CombatLog.Clear()
    _entries = {}
    for _, fs in ipairs(_lines) do fs:Hide() end
    if _frame and _frame._content then
        _frame._content:SetHeight(1)
    end
end

-- ─────────────────────────────────────────────────────────────
-- Toggle visibility
-- ─────────────────────────────────────────────────────────────
function CoAAT_CombatLog.Toggle()
    if not _frame then
        CoAAT_CombatLog.Build()
    end
    if _frame:IsShown() then
        _frame:Hide()
    else
        _frame:Show()
        CoAAT_CombatLog.Refresh()
    end
end

-- ─────────────────────────────────────────────────────────────
-- Build the window
-- ─────────────────────────────────────────────────────────────
function CoAAT_CombatLog.Build()
    if _frame then return end

    local db = DB()

    local f = CreateFrame("Frame", "CoAATCombatLogFrame", UIParent)
    f:SetSize(420, 280)
    f:SetFrameStrata("HIGH")
    f:SetToplevel(true)
    f:SetMovable(true)
    f:EnableMouse(true)
    f:RegisterForDrag("LeftButton")
    f:SetScript("OnDragStart", f.StartMoving)
    f:SetScript("OnDragStop", function(self)
        self:StopMovingOrSizing()
        local pt, _, _, x, y = self:GetPoint()
        if CoAAT_DB then CoAAT_DB.combatLogPos = { pt=pt, x=x, y=y } end
    end)

    if CoAAT_DB and CoAAT_DB.combatLogPos then
        local p = CoAAT_DB.combatLogPos
        f:SetPoint(p.pt or "BOTTOMLEFT", UIParent, p.pt or "BOTTOMLEFT", p.x or 0, p.y or 200)
    else
        f:SetPoint("BOTTOMLEFT", UIParent, "BOTTOMLEFT", 10, 200)
    end

    -- Background
    local bg = f:CreateTexture(nil, "BACKGROUND")
    bg:SetAllPoints()
    bg:SetTexture(0.02, 0.03, 0.07, db.winOpacity or 0.90)
    f._bg = bg

    -- Border lines (thin accent)
    f._borderLines = {}
    local function MakeLine(p1, p2, w, h)
        local l = f:CreateTexture(nil, "OVERLAY")
        l:SetTexture("Interface\\ChatFrame\\ChatFrameBackground")
        l:SetVertexColor(0.5, 0.1, 0.9, 0.55)
        l:SetSize(w, h)
        l:SetPoint(p1, f, p2, 0, 0)
        table.insert(f._borderLines, l)
    end
    MakeLine("TOPLEFT",    "TOPLEFT",    420, 1)
    MakeLine("BOTTOMLEFT", "BOTTOMLEFT", 420, 1)
    MakeLine("TOPLEFT",    "TOPLEFT",    1, 280)
    MakeLine("TOPRIGHT",   "TOPRIGHT",   1, 280)

    -- Title bar
    local titleBG = f:CreateTexture(nil, "ARTWORK")
    titleBG:SetSize(420, 22)
    titleBG:SetPoint("TOPLEFT", f, "TOPLEFT", 0, 0)
    titleBG:SetTexture("Interface\\ChatFrame\\ChatFrameBackground")
    titleBG:SetVertexColor(0.08, 0.04, 0.18, 0.95)
    f._titleBG = titleBG

    local title = f:CreateFontString(nil, "OVERLAY")
    title:SetFont("Fonts\\FRIZQT__.TTF", 11, "OUTLINE")
    title:SetPoint("TOPLEFT", f, "TOPLEFT", 8, -5)
    title:SetText("|cffcc88ff⚔ CoA|r |cff00ccffCombat Log|r")

    -- Close button
    local closeBtn = CreateFrame("Button", nil, f)
    closeBtn:SetSize(18, 18)
    closeBtn:SetPoint("TOPRIGHT", f, "TOPRIGHT", -4, -2)
    local closeLbl = closeBtn:CreateFontString(nil, "OVERLAY")
    closeLbl:SetFont("Fonts\\FRIZQT__.TTF", 12, "OUTLINE")
    closeLbl:SetAllPoints()
    closeLbl:SetText("|cffff4444✕|r")
    closeBtn:SetScript("OnClick", function() f:Hide() end)

    -- Clear button
    local clearBtn = CreateFrame("Button", nil, f)
    clearBtn:SetSize(42, 16)
    clearBtn:SetPoint("TOPRIGHT", closeBtn, "TOPLEFT", -6, 0)
    local clearBtnBG = clearBtn:CreateTexture(nil, "BACKGROUND")
    clearBtnBG:SetAllPoints()
    clearBtnBG:SetTexture(0.25, 0.06, 0.06, 0.9)
    local clearLbl = clearBtn:CreateFontString(nil, "OVERLAY")
    clearLbl:SetFont("Fonts\\FRIZQT__.TTF", 8, "OUTLINE")
    clearLbl:SetAllPoints()
    clearLbl:SetJustifyH("CENTER")
    clearLbl:SetText("|cffff6666Clear|r")
    clearBtn:SetScript("OnClick", function() CoAAT_CombatLog.Clear() end)
    clearBtn:SetScript("OnEnter", function() clearBtnBG:SetVertexColor(0.5, 0.1, 0.1, 0.9) end)
    clearBtn:SetScript("OnLeave", function() clearBtnBG:SetVertexColor(0.25, 0.06, 0.06, 0.9) end)

    -- Resize grip (bottom-right corner)
    local grip = CreateFrame("Frame", nil, f)
    grip:SetSize(14, 14)
    grip:SetPoint("BOTTOMRIGHT", f, "BOTTOMRIGHT", -1, 1)
    grip:EnableMouse(true)
    local gripTex = grip:CreateTexture(nil, "OVERLAY")
    gripTex:SetAllPoints()
    gripTex:SetTexture(0.5, 0.1, 0.9, 0.5)
    f:SetResizable(true)
    if f.SetMinResize then f:SetMinResize(250, 120) end
    grip:SetScript("OnMouseDown", function() f:StartSizing("BOTTOMRIGHT") end)
    grip:SetScript("OnMouseUp",   function() f:StopMovingOrSizing() end)

    -- Scroll frame
    local scroll = CreateFrame("ScrollFrame", "CoAATCombatLogScroll", f, "UIPanelScrollFrameTemplate")
    scroll:SetPoint("TOPLEFT",     f, "TOPLEFT",     4, -25)
    scroll:SetPoint("BOTTOMRIGHT", f, "BOTTOMRIGHT", -26, 4)
    f._scroll = scroll

    local content = CreateFrame("Frame", nil, scroll)
    content:SetWidth(scroll:GetWidth() - 4)
    content:SetHeight(1)
    scroll:SetScrollChild(content)
    f._content = content

    f:Hide()
    _frame = f
end

-- ─────────────────────────────────────────────────────────────
-- Apply saved settings (called after DB load and from settings)
-- ─────────────────────────────────────────────────────────────
function CoAAT_CombatLog.ApplySettings()
    if not _frame then return end
    local db = DB()
    if _frame._bg then
        _frame._bg:SetTexture(0.02, 0.03, 0.07, db.winOpacity or 0.90)
    end
    -- Re-render with new font size
    for _, fs in ipairs(_lines) do
        fs:SetFont("Fonts\\FRIZQT__.TTF", db.fontSize or 10, "OUTLINE")
    end
    CoAAT_CombatLog.Refresh()
end

-- ─────────────────────────────────────────────────────────────
-- Zone change: auto-clear if enabled
-- ─────────────────────────────────────────────────────────────
function CoAAT_CombatLog.OnZoneChanged()
    local db = DB()
    if db.autoClearZone then
        CoAAT_CombatLog.Clear()
        CoAAT_CombatLog.AddEntry("cast", "|cff888888-- Zone changed, log cleared --|r", 0.5, 0.5, 0.5)
    end
end

function CoAAT_CombatLog.ApplyTheme(r, g, b, hex)
    local f = _frame
    if not f then return end
    if f._borderLines then
        for _, line in ipairs(f._borderLines) do
            line:SetVertexColor(r, g, b, 0.55)
        end
    end
    if f._titleBG then
        -- Title bar is slightly darker version of class color
        f._titleBG:SetVertexColor(r * 0.4, g * 0.4, b * 0.4, 0.95)
    end
end

