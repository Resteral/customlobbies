--[[
    City Underground - Shared Interaction System
    Defines interactive entity types, distance bounds, and interaction verbs.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Interaction = CityUnderground.Interaction or {}

CityUnderground.Interaction.MaxDistance = 120 -- Reach distance in units

CityUnderground.Interaction.Types = {
    BANK_ATM = { prompt = "Access First Trust ATM", key = "E", icon = "💳" },
    BANK_TELLER = { prompt = "Speak with Bank Teller", key = "E", icon = "🏦" },
    STORE_CASHIER = { prompt = "Browse QuickMart Supplies", key = "E", icon = "🛒" },
    POLICE_DUTY = { prompt = "Toggle Police Duty & Equipment", key = "E", icon = "👮" },
    POLICE_MDT = { prompt = "Open Police CAD / MDT Terminal", key = "E", icon = "💻" },
    DELIVERY_DISPATCH = { prompt = "Sign on as Delivery Driver", key = "E", icon = "📦" },
    DEALERSHIP_SALES = { prompt = "Browse Metro Motors Showroom", key = "E", icon = "🚗" },
    GAS_PUMP = { prompt = "Refuel Vehicle ($45)", key = "E", icon = "⛽" },
    APARTMENT_DOOR = { prompt = "Apartment 101 Access & Management", key = "E", icon = "🚪" },
    APARTMENT_STASH = { prompt = "Open Personal Secure Stash", key = "E", icon = "🗄️" },
    SYNTH_LAB = { prompt = "Operate Chemical Synthesis Lab", key = "E", icon = "⚗️" },
    STREET_BUYER = { prompt = "Trade Contraband with Street Contact", key = "E", icon = "🕶️" },
    VEHICLE = { prompt = "Enter / Manage Vehicle", key = "E", icon = "🚙" },
    PLAYER = { prompt = "Roleplay Citizen Interaction", key = "E", icon = "👤" }
}
