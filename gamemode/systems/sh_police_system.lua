--[[
    City Underground - Shared Police System
    Defines municipal penal codes, fines, jail durations, and MDT record schemas.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Police = CityUnderground.Police or {}

CityUnderground.Police.PenalCodes = {
    { id = "PC-101", title = "Illegal Contraband Possession", fine = 500, jailMinutes = 3 },
    { id = "PC-102", title = "Unlawful Chemical Synthesis", fine = 1000, jailMinutes = 5 },
    { id = "PC-103", title = "Reckless Driving & Speeding", fine = 250, jailMinutes = 0 },
    { id = "PC-104", title = "Evading Law Enforcement", fine = 750, jailMinutes = 4 },
    { id = "PC-105", title = "Grand Theft Auto", fine = 1200, jailMinutes = 6 }
}

CityUnderground.Police.JailCellPosition = { x = 230, y = 850, z = 10 }
CityUnderground.Police.JailReleasePosition = { x = 160, y = 800, z = 10 }
