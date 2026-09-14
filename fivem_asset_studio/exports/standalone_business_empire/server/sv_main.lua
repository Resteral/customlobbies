-- ==============================================================================
-- Server: Commercial Business Empire (standalone_business_empire)
-- Multi-Framework Bridge & Passive Payout Engine
-- ==============================================================================

local ZoneStates = {}

-- Initialize States
for id, zone in pairs(Config.Zones or {}) do
    ZoneStates[id] = {
        owner = "Unclaimed",
        supplies = 100,
        vaultCash = 5000,
        rep = 50
    }
end

-- Passive Economy Loop
CreateThread(function()
    while true do
        Wait((Config.PayoutIntervalSeconds or 60) * 1000)
        for id, state in pairs(ZoneStates) do
            if Config.EnableSupplies then
                state.supplies = math.max(0, state.supplies - (Config.SupplyDecayPerPayout or 4))
            end
            state.vaultCash = state.vaultCash + (Config.BasePayout or 350)
        end
    end
end)

RegisterNetEvent('standalone_business_empire:server:enterZone', function(zoneId)
    local src = source
    -- Sync client state
end)

RegisterNetEvent('standalone_business_empire:server:leaveZone', function(zoneId)
    local src = source
end)
