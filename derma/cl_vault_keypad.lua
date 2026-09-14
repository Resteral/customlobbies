local PANEL = {}

function PANEL:Init()
    self:SetSize(320, 420)
    self:Center()
    self:SetTitle("SECURITY VAULT KEYPAD")
    self:MakePopup()

    self.enteredCode = ""

    local grid = vgui.Create("DGrid", self)
    grid:SetPos(35, 110)
    grid:SetCols(3)
    grid:SetColWide(80)
    grid:SetRowHeight(60)

    for i = 1, 9 do
        local btn = vgui.Create("DButton")
        btn:SetSize(70, 50)
        btn:SetText(tostring(i))
        btn:SetFont("DermaLarge")
        btn:SetTextColor(Color(255, 255, 255))
        btn.Paint = function(s, w, h)
            surface.SetDrawColor(40, 45, 60, 240)
            surface.DrawRect(0, 0, w, h)
        end
        btn.DoClick = function()
            if #self.enteredCode < 6 then
                self.enteredCode = self.enteredCode .. tostring(i)
                surface.PlaySound("buttons/button15.wav")
            end
        end
        grid:AddItem(btn)
    end

    -- 0, Clear, Submit row
    local btnClear = vgui.Create("DButton")
    btnClear:SetSize(70, 50)
    btnClear:SetText("CLR")
    btnClear:SetFont("DermaDefaultBold")
    btnClear:SetTextColor(Color(255, 100, 100))
    btnClear.Paint = function(s, w, h)
        surface.SetDrawColor(60, 30, 30, 240)
        surface.DrawRect(0, 0, w, h)
    end
    btnClear.DoClick = function()
        self.enteredCode = ""
        surface.PlaySound("buttons/button10.wav")
    end
    grid:AddItem(btnClear)

    local btn0 = vgui.Create("DButton")
    btn0:SetSize(70, 50)
    btn0:SetText("0")
    btn0:SetFont("DermaLarge")
    btn0:SetTextColor(Color(255, 255, 255))
    btn0.Paint = function(s, w, h)
        surface.SetDrawColor(40, 45, 60, 240)
        surface.DrawRect(0, 0, w, h)
    end
    btn0.DoClick = function()
        if #self.enteredCode < 6 then
            self.enteredCode = self.enteredCode .. "0"
            surface.PlaySound("buttons/button15.wav")
        end
    end
    grid:AddItem(btn0)

    local btnSubmit = vgui.Create("DButton")
    btnSubmit:SetSize(70, 50)
    btnSubmit:SetText("ENT")
    btnSubmit:SetFont("DermaDefaultBold")
    btnSubmit:SetTextColor(Color(100, 255, 100))
    btnSubmit.Paint = function(s, w, h)
        surface.SetDrawColor(30, 60, 30, 240)
        surface.DrawRect(0, 0, w, h)
    end
    btnSubmit.DoClick = function()
        self:SubmitPIN()
    end
    grid:AddItem(btnSubmit)
end

function PANEL:SetVaultEntity(ent)
    self.vaultEntity = ent
end

function PANEL:SubmitPIN()
    if IsValid(self.vaultEntity) then
        if self.enteredCode == (self.vaultEntity.passcode or "1337") then
            surface.PlaySound("buttons/button14.wav")
            notification.AddLegacy("PIN ACCEPTED! UNLOCKING VAULT...", NOTIFY_GENERIC, 3)
            net.Start("ixVaultKeypadSubmit")
                net.WriteEntity(self.vaultEntity)
                net.WriteBool(true)
            net.SendToServer()
            self:Close()
        else
            surface.PlaySound("buttons/button11.wav")
            notification.AddLegacy("INVALID PIN ENTERED!", NOTIFY_ERROR, 3)
            self.enteredCode = ""
        end
    end
end

function PANEL:Paint(w, h)
    surface.SetDrawColor(15, 20, 30, 250)
    surface.DrawRect(0, 0, w, h)
    surface.SetDrawColor(240, 200, 40, 180)
    surface.DrawOutlinedRect(0, 0, w, h)

    -- Display PIN box
    surface.SetDrawColor(0, 0, 0, 200)
    surface.DrawRect(35, 50, 250, 45)
    surface.SetDrawColor(240, 200, 40, 100)
    surface.DrawOutlinedRect(35, 50, 250, 45)

    local displayPass = string.rep("*", #self.enteredCode)
    draw.SimpleText(displayPass, "DermaLarge", 160, 72, Color(240, 200, 40), TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER)
end

vgui.Register("ixVaultKeypadUI", PANEL, "DFrame")
