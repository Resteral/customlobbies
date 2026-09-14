-- Register Usable Items Across All Frameworks (Standalone, QBCore, ESX, QBox)

local function RegisterItem(itemName, callback)
    if Bridge.FrameworkName == 'qbcore' or Bridge.FrameworkName == 'qbox' then
        local QBCore = exports['qb-core']:GetCoreObject()
        QBCore.Functions.CreateUseableItem(itemName, function(source, item)
            callback(source, item)
        end)
    elseif Bridge.FrameworkName == 'esx' then
        local ESX = exports['es_extended']:getSharedObject()
        ESX.RegisterUsableItem(itemName, function(source)
            callback(source, { name = itemName })
        end)
    end
end

-- ============================================================================
-- USABLE BREATHALYZER DEVICE
-- ============================================================================
RegisterItem('breathalyzer', function(src, item)
    TriggerClientEvent('helix_hospitality:client:useBreathalyzer', src)
end)

-- Standalone Command Fallback for Breathalyzer
RegisterCommand('breathalyzer', function(src, args)
    if src > 0 then
        TriggerClientEvent('helix_hospitality:client:useBreathalyzer', src)
    end
end, false)

-- ============================================================================
-- CONSUMABLE CRAFTED COCKTAILS
-- ============================================================================
RegisterItem('crafted_cocktail', function(src, item)
    local metadata = item.info or item.metadata or {}
    Bridge.RemoveItem(src, 'crafted_cocktail', 1)
    TriggerClientEvent('helix_hospitality:client:drinkAlcohol', src, metadata)
end)

-- Standalone Command Fallback to Drink
RegisterCommand('drink_cocktail', function(src, args)
    if src > 0 then
        local defaultDrink = {
            label = 'Classic Cocktail',
            alcoholStrength = 1.0,
            buffType = 'stamina',
            buffDuration = 180,
            glassType = 'rocks'
        }
        TriggerClientEvent('helix_hospitality:client:drinkAlcohol', src, defaultDrink)
    end
end, false)

-- ============================================================================
-- SOBER CONSUMABLES (WATER, COFFEE, HANGOVER PILLS, ENERGY DRINKS)
-- ============================================================================
local soberItems = { 'water_bottle', 'energy_drink', 'hot_coffee', 'hangover_pill' }
for _, soberItem in ipairs(soberItems) do
    RegisterItem(soberItem, function(src, item)
        Bridge.RemoveItem(src, soberItem, 1)
        TriggerClientEvent('helix_hospitality:client:useSoberItem', src, soberItem)
    end)
end

-- ============================================================================
-- BRANDED SPIRIT BOTTLES (DIRECT SIP / CONSUME)
-- ============================================================================
local brandedSpirits = {
    'grey_goose_vodka', 'belvedere_vodka', 'titos_vodka', 'absolut_vodka',
    'patron_silver', 'casamigos_blanco', 'don_julio_blanco', 'del_maguey_mezcal',
    'hennessy_vs', 'jameson_whiskey', 'jack_daniels', 'macallan_12',
    'bulleit_bourbon', 'crown_royal', 'fireball_whiskey',
    'bombay_sapphire', 'hendricks_gin', 'tanqueray_gin',
    'bacardi_superior', 'captain_morgan', 'malibu_rum', 'havana_club_7',
    'jagermeister', 'baileys_irish_cream', 'kahlua_coffee', 'peppermint_schnapps'
}

for _, spirit in ipairs(brandedSpirits) do
    RegisterItem(spirit, function(src, item)
        local cfg = Config.WholesaleSupply[spirit]
        Bridge.RemoveItem(src, spirit, 1)
        TriggerClientEvent('helix_hospitality:client:drinkAlcohol', src, {
            label = cfg and cfg.label or spirit,
            alcoholStrength = 1.3,
            buffType = 'speed',
            buffDuration = 120,
            glassType = 'rocks'
        })
    end)
end
