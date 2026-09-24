--[[
    City Underground - Client Economy System
    Client-side banking and currency event dispatcher.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Economy = CityUnderground.Economy or {}

function CityUnderground.Economy.Deposit(amount)
    if net and net.Start then
        net.Start("CU_Econ_Deposit")
        net.WriteInt(amount, 32)
        net.SendToServer()
    end
end

function CityUnderground.Economy.Withdraw(amount)
    if net and net.Start then
        net.Start("CU_Econ_Withdraw")
        net.WriteInt(amount, 32)
        net.SendToServer()
    end
end

function CityUnderground.Economy.Transfer(targetCharId, amount)
    if net and net.Start then
        net.Start("CU_Econ_Transfer")
        net.WriteString(targetCharId)
        net.WriteInt(amount, 32)
        net.SendToServer()
    end
end

function CityUnderground.Economy.DropCash(amount)
    if net and net.Start then
        net.Start("CU_Econ_DropCash")
        net.WriteInt(amount, 32)
        net.SendToServer()
    end
end

if net and net.Receive then
    net.Receive("CU_Econ_OpenBankUI", function()
        if CityUnderground.UI and CityUnderground.UI.OpenBanking then
            CityUnderground.UI.OpenBanking()
        end
    end)
end
