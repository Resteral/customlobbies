local PANEL = {}

function PANEL:Init()
    self:SetSize(400, 300)
    self:Center()
    self:SetTitle("METH SYNTHESIS CONTROL PANEL")
    self:MakePopup()

    local btnStart = vgui.Create("DButton", self)
    btnStart:SetPos(40, 60)
    btnStart:SetSize(320, 45)
    btnStart:SetText("START COOKING BATCH")
    btnStart:SetFont("DermaDefaultBold")
    btnStart:SetTextColor(Color(255, 255, 255))
    btnStart.Paint = function(s, w, h)
        surface.SetDrawColor(40, 160, 80, 230)
        surface.DrawRect(0, 0, w, h)
    end
    btnStart.DoClick = function()
        self:SendCookAction("start")
    end

    local btnHeat = vgui.Create("DButton", self)
    btnHeat:SetPos(40, 125)
    btnHeat:SetSize(150, 50)
    btnHeat:SetText("HEAT (+15°C)")
    btnHeat:SetFont("DermaDefaultBold")
    btnHeat:SetTextColor(Color(255, 255, 255))
    btnHeat.Paint = function(s, w, h)
        surface.SetDrawColor(220, 60, 40, 230)
        surface.DrawRect(0, 0, w, h)
    end
    btnHeat.DoClick = function()
        self:SendCookAction("heat")
    end

    local btnCool = vgui.Create("DButton", self)
    btnCool:SetPos(210, 125)
    btnCool:SetSize(150, 50)
    btnCool:SetText("COOL (-15°C)")
    btnCool:SetFont("DermaDefaultBold")
    btnCool:SetTextColor(Color(255, 255, 255))
    btnCool.Paint = function(s, w, h)
        surface.SetDrawColor(40, 120, 220, 230)
        surface.DrawRect(0, 0, w, h)
    end
    btnCool.DoClick = function()
        self:SendCookAction("cool")
    end
end

function PANEL:SetLabEntity(ent)
    self.labEntity = ent
end

function PANEL:SendCookAction(act)
    if IsValid(self.labEntity) then
        net.Start("ixDrugLabCookAction")
            net.WriteEntity(self.labEntity)
            net.WriteString(act)
        net.SendToServer()
    end
end

function PANEL:Paint(w, h)
    surface.SetDrawColor(20, 20, 30, 245)
    surface.DrawRect(0, 0, w, h)
    surface.SetDrawColor(180, 80, 240, 180)
    surface.DrawOutlinedRect(0, 0, w, h)

    draw.SimpleText("Target Safe Temp Zone: 75°C - 95°C", "DermaDefault", w / 2, 200, Color(200, 200, 200), TEXT_ALIGN_CENTER)
    draw.SimpleText("WARNING: Exceeding 130°C causes catastrophic explosion!", "DermaDefault", w / 2, 225, Color(255, 60, 60), TEXT_ALIGN_CENTER)
end

vgui.Register("ixDrugLabUI", PANEL, "DFrame")
