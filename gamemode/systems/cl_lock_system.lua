--[[
    City Underground - Client Lock System Bridge
    Bridges lock interaction prompts, keybinds, and NUI minigame triggers.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Locks = CityUnderground.Locks or {}

function CityUnderground.Locks.OpenPickMinigame(doorId, lockTier)
    if CityUnderground.UI and CityUnderground.UI.SendNUIEvent then
        CityUnderground.UI.SendNUIEvent("OpenAdvancedLockMinigame", {
            doorId = doorId,
            lockTier = lockTier or "tier1_brass"
        })
    end
end
