AddCSLuaFile("cl_init.lua")
AddCSLuaFile("shared.lua")
include("shared.lua")

function ENT:Initialize()
    local defaultModel = "models/props_lab/bindergraylabel01b.mdl"
    local modelPath = defaultModel

    local plugin = ix.plugin.Get("Helix Drugs & Heists")
    if plugin then
        modelPath = plugin:GetAssetModel("meth_lab", defaultModel)
    end

    self:SetModel(modelPath)
    self:PhysicsInit(SOLID_VPHYSICS)
    self:SetMoveType(MOVETYPE_VPHYSICS)
    self:SetSolid(SOLID_VPHYSICS)
    self:SetUseType(SIMPLE_USE)

    local phys = self:GetPhysicsObject()
    if IsValid(phys) then phys:Wake() end

    self:SetHasChemicals(false)
    self:SetIsCooking(false)
    self:SetTemperature(20)
    self:SetProgress(0)
    self:SetPurity(100)
end

function ENT:HandleCookAction(ply, action)
    if action == "start" then
        if not self:GetHasChemicals() then
            ply:Notify("Load Precursor Chemicals first!")
            return
        end
        self:SetIsCooking(true)
        self:SetProgress(0)
        self:SetPurity(99)
        ply:Notify("Started Meth Batch Cooking. Keep temperature between 75°C and 95°C!")
    elseif action == "heat" then
        if self:GetIsCooking() then
            self:SetTemperature(math.min(150, self:GetTemperature() + 15))
            self:EmitSound("ambient/machines/steam_release1.wav")
        end
    elseif action == "cool" then
        if self:GetIsCooking() then
            self:SetTemperature(math.max(10, self:GetTemperature() - 15))
            self:EmitSound("ambient/water/drip1.wav")
        end
    end
end

function ENT:Think()
    if SERVER and self:GetIsCooking() then
        local temp = self:GetTemperature()

        if temp < 85 then
            self:SetTemperature(math.min(150, temp + math.random(1, 3)))
        elseif temp >= 85 then
            self:SetTemperature(math.min(150, temp + math.random(2, 5)))
        end

        if temp >= 130 then
            local exp = ents.Create("env_explosion")
            exp:SetPos(self:GetPos())
            exp:Spawn()
            exp:Fire("Explode", 0, 0)
            self:Remove()
            return
        end

        if temp < 70 or temp > 100 then
            self:SetPurity(math.max(30, self:GetPurity() - 2))
        end

        local newProg = self:GetProgress() + 4
        self:SetProgress(newProg)

        if newProg >= 100 then
            self:SetIsCooking(false)
            self:SetHasChemicals(false)
            self:SetProgress(100)
            self:EmitSound("ambient/levels/labs/coinslot1.wav")
        end
    end
    self:NextThink(CurTime() + 1)
    return true
end

function ENT:Use(activator, caller)
    if not IsValid(caller) or not caller:IsPlayer() then return end

    if self:GetProgress() >= 100 and not self:GetIsCooking() and not self:GetHasChemicals() then
        local character = caller:GetCharacter()
        if character then
            local inventory = character:GetInventory()
            if inventory then
                local purity = self:GetPurity()
                inventory:Add("meth_bag", 1, { quality = purity }, function(success)
                    if success then
                        caller:Notify("Harvested Crystal Meth (" .. purity .. "% Purity)!")
                        self:SetProgress(0)
                        self:SetTemperature(20)
                    else
                        caller:Notify("Your inventory is full!")
                    end
                end)
            end
        end
        return
    end

    net.Start("ixDrugLabInteract")
        net.WriteEntity(self)
    net.Send(caller)
end
