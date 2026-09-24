--[[
    City Underground - Shared Multi-Tier Lock System
    Defines lock tiers, pick resistances, electronic bypass requirements, and silent alarm timers.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Locks = CityUnderground.Locks or {}

CityUnderground.Locks.Tiers = {
    ["tier1_brass"] = {
        name = "Standard 5-Pin Brass Tumbler",
        tier = 1,
        pinCount = 5,
        pickHealthDamage = 15,
        canBePicked = true,
        isElectronic = false,
        breakChance = 0.08
    },
    ["tier2_medeco"] = {
        name = "Medeco Biaxial Anti-Pick Cylinder",
        tier = 2,
        pinCount = 6,
        hasSpoolPins = true,
        hasSerratedPins = true,
        pickHealthDamage = 25,
        canBePicked = true,
        isElectronic = false,
        breakChance = 0.25
    },
    ["tier3_keypad"] = {
        name = "Digital Keypad Solenoid Deadbolt",
        tier = 3,
        isElectronic = true,
        requiresMultimeter = true,
        tamperAlarm = true,
        alarmDelay = 15.0
    },
    ["tier4_biometric"] = {
        name = "Capacitive Biometric Fingerprint Scanner",
        tier = 4,
        isElectronic = true,
        requiresThermalScanner = true,
        tamperAlarm = true,
        alarmDelay = 8.0
    },
    ["tier5_maglock"] = {
        name = "1200-lb Heavy Industrial Maglock",
        tier = 5,
        isElectronic = true,
        holdingForceLbs = 1200,
        requiresEMP = true,
        tamperAlarm = true
    }
}
