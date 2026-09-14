AddCSLuaFile("cl_init.lua")
AddCSLuaFile("shared.lua")
include("shared.lua")

function ENT:Initialize()
    local defaultModel = "models/props_junk/terracotta01.mdl"
    local modelPath = defaultModel

    local plugin = ix.plugin.Get("Helix Drugs & Heists")
    if plugin then
        modelPath = plugin:GetAssetModel("weed_pot", defaultModel)
    end

    self:SetModel(modelPath)
    self:PhysicsInit(SOLID_VPHYSICS)
    self:SetMoveType(MOVETYPE_VPHYSICS)
    self:SetSolid(SOLID_VPHYSICS)
    self:SetUseType(SIMPLE_USE)

    local phys = self:GetPhysicsObject()
    if IsValid(phys) then phys:Wake() end

    self:SetHasSeed(false)
    self:SetWater(50)
    self:SetGrowth(0)
    self.nextGrowthTick = CurTime() + 2
end

function ENT:Think()
    if SERVER then
        if self:GetHasSeed() and self:GetGrowth() < 100 then
            if CurTime() >= (self.nextGrowthTick or 0) then
                self.nextGrowthTick = CurTime() + (3 / ix.config.Get("weedGrowthMultiplier", 1.0))
                
                if self:GetWater() > 0 then
                    self:SetWater(math.max(0, self:GetWater() - 1))
                    self:SetGrowth(math.min(100, self:GetGrowth() + 2))
                end
            end
        end
    end
    self:NextThink(CurTime() + 1)
    return true
end

function ENT:Use(activator, caller)
    if not IsValid(caller) or not caller:IsPlayer() then return end

    local character = caller:GetCharacter()
    if not character then return end

    if self:GetHasSeed() then
        if self:GetGrowth() >= 100 then
            local inventory = character:GetInventory()
            if inventory then
                inventory:Add("weed_bag", 2, {}, function(success)
                    if success then
                        caller:Notify("You harvested 2 Baggies of Weed!")
                        self:SetHasSeed(false)
                        self:SetGrowth(0)
                        self:EmitSound("ambient/levels/foliage/foliage_bush_in1.wav")
                    else
                        caller:Notify("Your inventory is full!")
                    end
                end)
            end
        elseif self:GetWater() < 80 then
            self:SetWater(100)
            self:EmitSound("ambient/water/drip1.wav")
            caller:Notify("You watered the weed pot.")
        else
            caller:Notify("Plant is currently well watered (" .. self:GetWater() .. "%). Growth: " .. self:GetGrowth() .. "%")
        end
    else
        caller:Notify("Empty pot. Plant a Weed Seed to start growing!")
    end
end
