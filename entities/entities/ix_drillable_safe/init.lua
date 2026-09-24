AddCSLuaFile("cl_init.lua")
AddCSLuaFile("shared.lua")
include("shared.lua")

function ENT:Initialize()
    local defaultModel = "models/props_silo/silo_door01_static.mdl"
    local modelPath = defaultModel

    local plugin = ix.plugin.Get("Helix Drugs & Heists")
    if plugin then
        modelPath = plugin:GetAssetModel("drillable_safe", defaultModel)
    end

    self:SetModel(modelPath)
    self:PhysicsInit(SOLID_VPHYSICS)
    self:SetMoveType(MOVETYPE_VPHYSICS)
    self:SetSolid(SOLID_VPHYSICS)
    self:SetUseType(SIMPLE_USE)

    local phys = self:GetPhysicsObject()
    if IsValid(phys) then phys:Wake() phys:EnableMotion(false) end

    self:SetIsDrilling(false)
    self:SetIsJammed(false)
    self:SetIsOpen(false)
    self:SetDrillProgress(0)
end

function ENT:StartDrilling(ply)
    self:SetIsDrilling(true)
    self:SetIsJammed(false)
    self:SetDrillProgress(0)
    self.drillerPlayer = ply

    self:EmitSound("ambient/machines/lab_loop1.wav")

    local plugin = ix.plugin.Get("Helix Drugs & Heists")
    if plugin then
        plugin:SendPoliceAlert(self:GetPos(), "SILENT ALARM: Safe Drilling in Progress!")
    end
end

function ENT:Think()
    if SERVER and self:GetIsDrilling() then
        if not self:GetIsJammed() then
            if math.random(1, 25) == 1 then
                self:SetIsJammed(true)
                self:EmitSound("ambient/machines/spinup.wav")
                if IsValid(self.drillerPlayer) then
                    self.drillerPlayer:Notify("THERMAL DRILL JAMMED! Press [E] on safe to repair!")
                end
            else
                local prog = self:GetDrillProgress() + 2
                self:SetDrillProgress(prog)

                if prog >= 100 then
                    self:SetIsDrilling(false)
                    self:SetIsOpen(true)
                    self:SetDrillProgress(100)
                    self:StopSound("ambient/machines/lab_loop1.wav")
                    self:EmitSound("physics/metal/metal_box_break1.wav")
                end
            end
        end
    end
    self:NextThink(CurTime() + 1)
    return true
end

function ENT:Use(activator, caller)
    if not IsValid(caller) or not caller:IsPlayer() then return end

    if self:GetIsDrilling() and self:GetIsJammed() then
        self:SetIsJammed(false)
        self:EmitSound("ambient/machines/cat_catches_rat.wav")
        caller:Notify("You unjammed the thermal drill! Drilling resumed...")
        return
    end

    if self:GetIsOpen() then
        local character = caller:GetCharacter()
        if character then
            local inventory = character:GetInventory()
            if inventory then
                inventory:Add("loot_bag", 1, { value = math.random(3000, 7500) }, function(success)
                    if success then
                        caller:Notify("You looted a Duffel Bag of CL-Points from the safe!")
                        self:SetIsOpen(false)
                        self:SetDrillProgress(0)
                    else
                        caller:Notify("Your inventory is full!")
                    end
                end)
            end
        end
    elseif not self:GetIsDrilling() then
        caller:Notify("Safe is locked. Deploy a Thermal Drill Kit to break into it.")
    end
end
