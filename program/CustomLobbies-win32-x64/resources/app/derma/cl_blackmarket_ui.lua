local PANEL = {}

function PANEL:Init()
    self:SetSize(600, 480)
    self:Center()
    self:SetTitle("BLACK MARKET DEALER EXCHANGE")
    self:MakePopup()

    local sheet = vgui.Create("DPropertySheet", self)
    sheet:Dock(FILL)

    -- Sell Panel
    local pnlSell = vgui.Create("DPanel", sheet)
    pnlSell.Paint = function() end

    local scrollSell = vgui.Create("DScrollPanel", pnlSell)
    scrollSell:Dock(FILL)

    local sellItems = {
        { id = "weed_bag", name = "Weed Baggie", base = 150 },
        { id = "meth_bag", name = "Crystal Meth Baggie", base = 350 },
        { id = "cocaine_brick", name = "Cocaine Brick", base = 600 }
    }

    for _, v in ipairs(sellItems) do
        local row = scrollSell:Add("DPanel")
        row:Dock(TOP)
        row:DockMargin(5, 5, 5, 5)
        row:SetHeight(50)
        row.Paint = function(s, w, h)
            surface.SetDrawColor(30, 35, 45, 240)
            surface.DrawRect(0, 0, w, h)
        end

        local lbl = vgui.Create("DLabel", row)
        lbl:SetPos(15, 15)
        lbl:SetText(v.name)
        lbl:SetFont("DermaDefaultBold")
        lbl:SizeToContents()

        local btnSell = vgui.Create("DButton", row)
        btnSell:SetPos(420, 10)
        btnSell:SetSize(120, 30)
        btnSell:SetText("SELL CONTRABAND")
        btnSell:SetTextColor(Color(255, 255, 255))
        btnSell.Paint = function(s, w, h)
            surface.SetDrawColor(220, 80, 40, 230)
            surface.DrawRect(0, 0, w, h)
        end
        btnSell.DoClick = function()
            self:Transaction(v.id, "sell")
        end
    end

    sheet:AddSheet("Sell Drugs", pnlSell, "icon16/money_add.png")

    -- Buy Equipment & Building Parts Panel
    local pnlBuy = vgui.Create("DPanel", sheet)
    pnlBuy.Paint = function() end

    local scrollBuy = vgui.Create("DScrollPanel", pnlBuy)
    scrollBuy:Dock(FILL)

    local buyItems = {
        { id = "weed_seed", name = "Weed Seeds", cost = 50 },
        { id = "meth_chemicals", name = "Meth Precursor Chemicals", cost = 120 },
        { id = "thermal_drill", name = "Thermal Drill Kit", cost = 1500 },
        { id = "hacking_device", name = "Cyber Hacking Device", cost = 800 },
        { id = "thermite", name = "Thermite Charge", cost = 600 },
        { id = "keycard", name = "Security Vault Keycard", cost = 1000 },
        { id = "brick_wall", name = "Modular Metal Wall Panel", cost = 250 },
        { id = "brick_counter", name = "Modular Lab Workbench", cost = 200 },
        { id = "security_grate", name = "Modular Security Grate", cost = 300 }
    }

    for _, v in ipairs(buyItems) do
        local row = scrollBuy:Add("DPanel")
        row:Dock(TOP)
        row:DockMargin(5, 5, 5, 5)
        row:SetHeight(50)
        row.Paint = function(s, w, h)
            surface.SetDrawColor(30, 35, 45, 240)
            surface.DrawRect(0, 0, w, h)
        end

        local lbl = vgui.Create("DLabel", row)
        lbl:SetPos(15, 15)
        lbl:SetText(v.name .. " - $" .. v.cost)
        lbl:SetFont("DermaDefaultBold")
        lbl:SizeToContents()

        local btnBuy = vgui.Create("DButton", row)
        btnBuy:SetPos(420, 10)
        btnBuy:SetSize(120, 30)
        btnBuy:SetText("BUY ITEM")
        btnBuy:SetTextColor(Color(255, 255, 255))
        btnBuy.Paint = function(s, w, h)
            surface.SetDrawColor(40, 160, 80, 230)
            surface.DrawRect(0, 0, w, h)
        end
        btnBuy.DoClick = function()
            self:Transaction(v.id, "buy")
        end
    end

    sheet:AddSheet("Buy Gear & Parts", pnlBuy, "icon16/basket.png")
end

function PANEL:SetDealerEntity(ent)
    self.dealerEntity = ent
end

function PANEL:Transaction(itemID, action)
    if IsValid(self.dealerEntity) then
        net.Start("ixBlackMarketTransaction")
            net.WriteString(itemID)
            net.WriteString(action)
            net.WriteEntity(self.dealerEntity)
        net.SendToServer()
    end
end

function PANEL:Paint(w, h)
    surface.SetDrawColor(15, 18, 24, 250)
    surface.DrawRect(0, 0, w, h)
    surface.SetDrawColor(240, 60, 60, 180)
    surface.DrawOutlinedRect(0, 0, w, h)
end

vgui.Register("ixBlackMarketUI", PANEL, "DFrame")
