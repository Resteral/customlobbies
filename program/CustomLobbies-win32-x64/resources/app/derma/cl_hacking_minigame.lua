local PANEL = {}

function PANEL:Init()
    self:SetSize(460, 360)
    self:Center()
    self:SetTitle("CYBER SECURITY OVERRIDE TERMINAL")
    self:MakePopup()

    self.difficulty = 4
    self.sequence = {}
    self.userSequence = {}
    self.activeStep = 1

    local gridContainer = vgui.Create("DGrid", self)
    gridContainer:SetPos(30, 70)
    gridContainer:SetCols(4)
    gridContainer:SetColWide(100)
    gridContainer:SetRowHeight(60)

    self.buttons = {}
    for i = 1, 16 do
        local btn = vgui.Create("DButton")
        btn:SetSize(90, 50)
        btn:SetText("NODE [" .. i .. "]")
        btn:SetFont("DermaDefaultBold")
        btn:SetTextColor(Color(0, 255, 200))
        btn.Paint = function(s, w, h)
            local col = Color(20, 35, 45, 220)
            if s:IsHovered() then col = Color(30, 65, 85, 240) end
            if s.isSelected then col = Color(0, 200, 100, 240) end
            surface.SetDrawColor(col)
            surface.DrawRect(0, 0, w, h)
            surface.SetDrawColor(0, 255, 200, 100)
            surface.DrawOutlinedRect(0, 0, w, h)
        end
        btn.DoClick = function(s)
            self:NodeClicked(i, s)
        end
        gridContainer:AddItem(btn)
        self.buttons[i] = btn
    end

    self:GenerateSequence()
end

function PANEL:SetTargetEntity(ent)
    self.targetEntity = ent
end

function PANEL:SetDifficulty(diff)
    self.difficulty = diff or 4
    self:GenerateSequence()
end

function PANEL:GenerateSequence()
    self.sequence = {}
    for i = 1, self.difficulty do
        table.insert(self.sequence, math.random(1, 16))
    end
end

function PANEL:NodeClicked(index, btn)
    if #self.userSequence >= self.difficulty then return end

    table.insert(self.userSequence, index)
    btn.isSelected = true
    surface.PlaySound("buttons/button15.wav")

    -- Check if input sequence matches
    local stepIndex = #self.userSequence
    if self.sequence[stepIndex] ~= index then
        surface.PlaySound("buttons/button11.wav")
        notification.AddLegacy("SECURITY BYPASS FAILED! WRONG NODE SEQUENCE", NOTIFY_ERROR, 3)
        net.Start("ixHeistMinigameResult")
            net.WriteEntity(self.targetEntity)
            net.WriteBool(false)
        net.SendToServer()
        self:Close()
        return
    end

    if #self.userSequence == self.difficulty then
        surface.PlaySound("buttons/button14.wav")
        notification.AddLegacy("CYBER OVERRIDE SUCCESSFUL!", NOTIFY_GENERIC, 3)
        net.Start("ixHeistMinigameResult")
            net.WriteEntity(self.targetEntity)
            net.WriteBool(true)
        net.SendToServer()
        self:Close()
    end
end

function PANEL:Paint(w, h)
    surface.SetDrawColor(10, 15, 25, 245)
    surface.DrawRect(0, 0, w, h)
    surface.SetDrawColor(0, 255, 200, 180)
    surface.DrawOutlinedRect(0, 0, w, h)

    draw.SimpleText("BYPASS NODES REQUIRED: " .. #self.userSequence .. " / " .. self.difficulty, "DermaDefaultBold", w / 2, 45, Color(0, 255, 200), TEXT_ALIGN_CENTER)
end

vgui.Register("ixHackingMinigame", PANEL, "DFrame")
