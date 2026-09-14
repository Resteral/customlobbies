-- Police MDT / CAD Tablet Interface for Helix
local PLUGIN = PLUGIN

local PANEL = {}

function PANEL:Init()
    self:SetSize(880, 600)
    self:Center()
    self:SetTitle("")
    self:ShowCloseButton(false)
    self:MakePopup()

    self.currentTab = "calls"
    self.calls = PLUGIN.MDT.Calls or {}
    self.warrants = PLUGIN.MDT.Warrants or {}

    -- Top Header
    local topBar = vgui.Create("DPanel", self)
    topBar:Dock(TOP)
    topBar:SetTall(60)
    topBar.Paint = function(s, w, h)
        surface.SetDrawColor(18, 24, 38, 255)
        surface.DrawRect(0, 0, w, h)

        surface.SetDrawColor(52, 152, 219, 240)
        surface.DrawRect(0, h - 3, w, 3)

        draw.SimpleText("POLICE CAD / MDT TERMINAL", "DermaLarge", 20, 12, Color(255, 255, 255), TEXT_ALIGN_LEFT)
        draw.SimpleText("MOBILE DATA DISPATCH SYSTEM v2.4", "DermaDefaultBold", 20, 36, Color(52, 152, 219), TEXT_ALIGN_LEFT)

        local officer = LocalPlayer():GetCharacter() and LocalPlayer():GetCharacter():GetName() or LocalPlayer():Nick()
        draw.SimpleText("OFFICER: " .. officer, "DermaDefaultBold", w - 80, 22, Color(241, 196, 15), TEXT_ALIGN_RIGHT)
    end

    local closeBtn = vgui.Create("DButton", topBar)
    closeBtn:SetSize(36, 36)
    closeBtn:SetPos(830, 12)
    closeBtn:SetText("✕")
    closeBtn:SetFont("DermaDefaultBold")
    closeBtn:SetTextColor(Color(255, 255, 255))
    closeBtn.Paint = function(s, w, h)
        local col = s:IsHovered() and Color(231, 76, 60, 220) or Color(35, 42, 58, 200)
        surface.SetDrawColor(col)
        surface.DrawRect(0, 0, w, h)
    end
    closeBtn.DoClick = function() self:Close() end

    -- Left Navigation Sidebar
    local sideNav = vgui.Create("DPanel", self)
    sideNav:Dock(LEFT)
    sideNav:SetWide(220)
    sideNav:DockMargin(12, 12, 6, 12)
    sideNav.Paint = function(s, w, h)
        surface.SetDrawColor(20, 25, 36, 230)
        surface.DrawRect(0, 0, w, h)
        surface.SetDrawColor(42, 50, 68, 180)
        surface.DrawOutlinedRect(0, 0, w, h)
    end

    local tabs = {
        { id = "calls", name = "911 Dispatch Feed", icon = "phone" },
        { id = "warrants", name = "Active Warrants & BOLO", icon = "shield" },
        { id = "citizens", name = "Citizen Database", icon = "user" },
        { id = "vehicles", name = "Vehicle DMV Registry", icon = "car" }
    }

    for _, t in ipairs(tabs) do
        local btn = vgui.Create("DButton", sideNav)
        btn:Dock(TOP)
        btn:SetTall(46)
        btn:DockMargin(8, 8, 8, 0)
        btn:SetText(t.name)
        btn:SetFont("DermaDefaultBold")
        btn:SetTextColor(Color(240, 240, 240))
        btn.Paint = function(s, w, h)
            local isSel = self.currentTab == t.id
            local col = isSel and Color(52, 152, 219, 220) or (s:IsHovered() and Color(32, 40, 58, 220) or Color(24, 30, 44, 180))
            surface.SetDrawColor(col)
            surface.DrawRect(0, 0, w, h)
            if isSel then
                surface.SetDrawColor(255, 255, 255, 240)
                surface.DrawRect(0, 0, 4, h)
            end
        end
        btn.DoClick = function()
            self.currentTab = t.id
            self:RenderContent()
        end
    end

    -- Main Content Display Area
    self.content = vgui.Create("DPanel", self)
    self.content:Dock(FILL)
    self.content:DockMargin(6, 12, 12, 12)
    self.content.Paint = function(s, w, h)
        surface.SetDrawColor(20, 25, 36, 230)
        surface.DrawRect(0, 0, w, h)
        surface.SetDrawColor(42, 50, 68, 180)
        surface.DrawOutlinedRect(0, 0, w, h)
    end

    self:RenderContent()
end

function PANEL:RenderContent()
    self.content:Clear()

    if self.currentTab == "calls" then
        self:RenderCallsTab()
    elseif self.currentTab == "warrants" then
        self:RenderWarrantsTab()
    elseif self.currentTab == "citizens" then
        self:RenderCitizensTab()
    elseif self.currentTab == "vehicles" then
        self:RenderVehiclesTab()
    end
end

function PANEL:RenderCallsTab()
    local scroll = vgui.Create("DScrollPanel", self.content)
    scroll:Dock(FILL)
    scroll:DockMargin(12, 12, 12, 12)

    if #self.calls == 0 then
        local emptyLbl = scroll:Add("DLabel")
        emptyLbl:Dock(TOP)
        emptyLbl:SetText("No active 911 dispatch calls in log.")
        emptyLbl:SetFont("DermaDefaultBold")
        emptyLbl:SetTextColor(Color(180, 185, 195))
        return
    end

    for _, call in ipairs(self.calls) do
        local card = scroll:Add("DPanel")
        card:Dock(TOP)
        card:DockMargin(0, 0, 0, 10)
        card:SetTall(75)
        card.Paint = function(s, w, h)
            surface.SetDrawColor(26, 32, 46, 240)
            surface.DrawRect(0, 0, w, h)
            surface.SetDrawColor(231, 76, 60, 200)
            surface.DrawRect(0, 0, 4, h)
            surface.SetDrawColor(48, 56, 76, 160)
            surface.DrawOutlinedRect(0, 0, w, h)

            draw.SimpleText("CALL #" .. call.id .. " | TIME: " .. call.time .. " | CALLER: " .. call.caller, "DermaDefaultBold", 14, 10, Color(255, 255, 255), TEXT_ALIGN_LEFT)
            draw.SimpleText(call.message, "DermaDefault", 14, 32, Color(200, 205, 215), TEXT_ALIGN_LEFT)
        end

        local gpsBtn = vgui.Create("DButton", card)
        gpsBtn:SetSize(110, 32)
        gpsBtn:SetPos(480, 20)
        gpsBtn:SetText("SET GPS")
        gpsBtn:SetFont("DermaDefaultBold")
        gpsBtn:SetTextColor(Color(255, 255, 255))
        gpsBtn.Paint = function(s, w, h)
            local col = s:IsHovered() and Color(46, 204, 113, 240) or Color(39, 174, 96, 200)
            surface.SetDrawColor(col)
            surface.DrawRect(0, 0, w, h)
        end
        gpsBtn.DoClick = function()
            if call.pos then
                net.Start("ixPerp911Broadcast")
                    net.WriteTable(call)
                net.SendToServer()
                ix.util.Notify("GPS Waypoint activated on HUD.")
            end
        end
    end
end

function PANEL:RenderWarrantsTab()
    local topActions = vgui.Create("DPanel", self.content)
    topActions:Dock(TOP)
    topActions:SetTall(48)
    topActions:DockMargin(12, 12, 12, 0)
    topActions.Paint = function() end

    local newWarrantBtn = vgui.Create("DButton", topActions)
    newWarrantBtn:Dock(RIGHT)
    newWarrantBtn:SetWide(180)
    newWarrantBtn:SetText("+ ISSUE NEW WARRANT")
    newWarrantBtn:SetFont("DermaDefaultBold")
    newWarrantBtn:SetTextColor(Color(255, 255, 255))
    newWarrantBtn.Paint = function(s, w, h)
        local col = s:IsHovered() and Color(231, 76, 60, 240) or Color(192, 57, 43, 220)
        surface.SetDrawColor(col)
        surface.DrawRect(0, 0, w, h)
    end
    newWarrantBtn.DoClick = function()
        Derma_StringRequest("Issue Arrest Warrant", "Enter Suspect Name:", "", function(suspect)
            if not suspect or string.Trim(suspect) == "" then return end
            Derma_StringRequest("Issue Arrest Warrant", "Enter Criminal Charges / Reason:", "", function(reason)
                if not reason or string.Trim(reason) == "" then return end
                net.Start("ixPerpAddWarrant")
                    net.WriteString(suspect)
                    net.WriteString(reason)
                net.SendToServer()
            end)
        end)
    end

    local scroll = vgui.Create("DScrollPanel", self.content)
    scroll:Dock(FILL)
    scroll:DockMargin(12, 12, 12, 12)

    if #self.warrants == 0 then
        local emptyLbl = scroll:Add("DLabel")
        emptyLbl:Dock(TOP)
        emptyLbl:SetText("No active arrest warrants on record.")
        emptyLbl:SetFont("DermaDefaultBold")
        emptyLbl:SetTextColor(Color(180, 185, 195))
        return
    end

    for _, w in ipairs(self.warrants) do
        local card = scroll:Add("DPanel")
        card:Dock(TOP)
        card:DockMargin(0, 0, 0, 10)
        card:SetTall(75)
        card.Paint = function(s, wth, h)
            surface.SetDrawColor(26, 32, 46, 240)
            surface.DrawRect(0, 0, wth, h)
            surface.SetDrawColor(241, 196, 15, 200)
            surface.DrawRect(0, 0, 4, h)
            surface.SetDrawColor(48, 56, 76, 160)
            surface.DrawOutlinedRect(0, 0, wth, h)

            draw.SimpleText("SUSPECT: " .. w.suspect .. " | OFFICER: " .. w.officer .. " | DATE: " .. w.time, "DermaDefaultBold", 14, 10, Color(255, 255, 255), TEXT_ALIGN_LEFT)
            draw.SimpleText("CHARGES: " .. w.reason, "DermaDefault", 14, 32, Color(241, 196, 15), TEXT_ALIGN_LEFT)
        end

        local clearBtn = vgui.Create("DButton", card)
        clearBtn:SetSize(100, 32)
        clearBtn:SetPos(480, 20)
        clearBtn:SetText("REVOKE")
        clearBtn:SetFont("DermaDefaultBold")
        clearBtn:SetTextColor(Color(255, 255, 255))
        clearBtn.Paint = function(s, wth, h)
            local col = s:IsHovered() and Color(231, 76, 60, 240) or Color(192, 57, 43, 200)
            surface.SetDrawColor(col)
            surface.DrawRect(0, 0, wth, h)
        end
        clearBtn.DoClick = function()
            net.Start("ixPerpRemoveWarrant")
                net.WriteInt(w.id, 16)
            net.SendToServer()
            timer.Simple(0.2, function()
                if IsValid(self) then self:RenderContent() end
            end)
        end
    end
end

function PANEL:RenderCitizensTab()
    local scroll = vgui.Create("DScrollPanel", self.content)
    scroll:Dock(FILL)
    scroll:DockMargin(12, 12, 12, 12)

    for _, p in ipairs(player.GetAll()) do
        local char = p:GetCharacter()
        if char then
            local card = scroll:Add("DPanel")
            card:Dock(TOP)
            card:DockMargin(0, 0, 0, 8)
            card:SetTall(56)
            card.Paint = function(s, w, h)
                surface.SetDrawColor(26, 32, 46, 240)
                surface.DrawRect(0, 0, w, h)
                surface.SetDrawColor(52, 152, 219, 150)
                surface.DrawRect(0, 0, 4, h)
                surface.SetDrawColor(48, 56, 76, 160)
                surface.DrawOutlinedRect(0, 0, w, h)

                local f = ix.faction.indices[char:GetFaction()]
                local fName = f and f.name or "Citizen"

                draw.SimpleText(char:GetName() .. " (ID: #" .. char:GetID() .. ")", "DermaDefaultBold", 14, 10, Color(255, 255, 255), TEXT_ALIGN_LEFT)
                draw.SimpleText("Occupation: " .. fName .. " | Health: " .. p:Health() .. "% | Cuffed: " .. (p:GetNWBool("ixCuffed", false) and "YES" or "NO"), "DermaDefault", 14, 30, Color(180, 185, 200), TEXT_ALIGN_LEFT)
            end
        end
    end
end

function PANEL:RenderVehiclesTab()
    local scroll = vgui.Create("DScrollPanel", self.content)
    scroll:Dock(FILL)
    scroll:DockMargin(12, 12, 12, 12)

    local vehs = ents.FindByClass("prop_vehicle_*")
    for _, v in ipairs(vehs) do
        local card = scroll:Add("DPanel")
        card:Dock(TOP)
        card:DockMargin(0, 0, 0, 8)
        card:SetTall(56)
        card.Paint = function(s, w, h)
            surface.SetDrawColor(26, 32, 46, 240)
            surface.DrawRect(0, 0, w, h)
            surface.SetDrawColor(46, 204, 113, 150)
            surface.DrawRect(0, 0, 4, h)
            surface.SetDrawColor(48, 56, 76, 160)
            surface.DrawOutlinedRect(0, 0, w, h)

            local plate = "LS-" .. string.upper(string.sub(util.CRC(v:EntIndex() .. "plate"), 1, 6))
            local fuel = v:GetNWInt("ixVehFuel", 100)
            local locked = v:GetNWBool("ixVehLocked", false)

            draw.SimpleText("LICENSE PLATE: [" .. plate .. "] | MODEL: " .. v:GetModel(), "DermaDefaultBold", 14, 10, Color(255, 255, 255), TEXT_ALIGN_LEFT)
            draw.SimpleText("Fuel Level: " .. fuel .. "% | Security Status: " .. (locked and "LOCKED" or "UNLOCKED"), "DermaDefault", 14, 30, Color(180, 185, 200), TEXT_ALIGN_LEFT)
        end
    end
end

function PANEL:Paint(w, h)
    surface.SetDrawColor(12, 16, 24, 245)
    surface.DrawRect(0, 0, w, h)

    surface.SetDrawColor(40, 48, 65, 200)
    surface.DrawOutlinedRect(0, 0, w, h)
end

vgui.Register("ixPoliceMDT", PANEL, "DFrame")

net.Receive("ixPerpOpenMDT", function()
    PLUGIN.MDT.Calls = net.ReadTable() or {}
    PLUGIN.MDT.Warrants = net.ReadTable() or {}

    if IsValid(ix.gui.policeMDT) then
        ix.gui.policeMDT:Remove()
    end
    ix.gui.policeMDT = vgui.Create("ixPoliceMDT")
end)

net.Receive("ixPerpSyncMDT", function()
    PLUGIN.MDT.Calls = net.ReadTable() or {}
    PLUGIN.MDT.Warrants = net.ReadTable() or {}

    if IsValid(ix.gui.policeMDT) then
        ix.gui.policeMDT:RenderContent()
    end
end)
