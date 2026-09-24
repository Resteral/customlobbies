--[[
    City Underground - Client Skills System
    Receives skill progression and triggers UI updates.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Skills = CityUnderground.Skills or {}
CityUnderground.Skills.ClientData = {}

if net and net.Receive then
    net.Receive("CU_Skills_Sync", function()
        local skills = net.ReadTable()
        CityUnderground.Skills.ClientData = skills

        if CityUnderground.UI and CityUnderground.UI.UpdateSkills then
            CityUnderground.UI.UpdateSkills(skills)
        end
    end)

    net.Receive("CU_Skills_LevelUpNotice", function()
        local skillKey = net.ReadString()
        local level = net.ReadInt(8)
        local skillInfo = CityUnderground.Skills.List[skillKey]
        local name = skillInfo and skillInfo.name or skillKey

        if CityUnderground.UI and CityUnderground.UI.ShowToast then
            CityUnderground.UI.ShowToast(`🎉 Skill Level Up: ${name} reached Level ${level}!`, 'success');
        end
    end)
end
