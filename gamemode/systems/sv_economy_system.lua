--[[
    City Underground - Server Economy Engine
    Server-authoritative money management, ATM deposits, withdrawals, transfers, and logs.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Economy = CityUnderground.Economy or {}
CityUnderground.Economy.Logs = CityUnderground.Economy.Logs or {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Econ_Deposit")
    util.AddNetworkString("CU_Econ_Withdraw")
    util.AddNetworkString("CU_Econ_Transfer")
    util.AddNetworkString("CU_Econ_GiveCash")
    util.AddNetworkString("CU_Econ_DropCash")
    util.AddNetworkString("CU_Econ_SyncLogs")
    util.AddNetworkString("CU_Econ_OpenBankUI")
end

-- Server-side balance modifiers
function CityUnderground.Economy.AddCash(ply, amount, reason)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return false end

    amount = math.floor(math.abs(amount or 0))
    char.cash = (char.cash or 0) + amount

    CityUnderground.Economy.LogTransaction(char.id, "EARN", reason or "Cash Received", amount)
    CityUnderground.Character.SyncStats(ply)
    return true
end

function CityUnderground.Economy.TakeCash(ply, amount, reason)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return false end

    amount = math.floor(math.abs(amount or 0))
    if (char.cash or 0) < amount then return false end

    char.cash = char.cash - amount
    CityUnderground.Economy.LogTransaction(char.id, "EXPENSE", reason or "Cash Spent", -amount)
    CityUnderground.Character.SyncStats(ply)
    return true
end

function CityUnderground.Economy.AddBank(ply, amount, reason)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return false end

    amount = math.floor(math.abs(amount or 0))
    char.bank = (char.bank or 0) + amount

    CityUnderground.Economy.LogTransaction(char.id, "DEPOSIT", reason or "Bank Credit", amount)
    CityUnderground.Character.SyncStats(ply)
    return true
end

function CityUnderground.Economy.TakeBank(ply, amount, reason)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return false end

    amount = math.floor(math.abs(amount or 0))
    if (char.bank or 0) < amount then return false end

    char.bank = char.bank - amount
    CityUnderground.Economy.LogTransaction(char.id, "WITHDRAW", reason or "Bank Debit", -amount)
    CityUnderground.Character.SyncStats(ply)
    return true
end

function CityUnderground.Economy.LogTransaction(charId, transType, desc, amount)
    local entry = {
        timestamp = os.time(),
        charId = charId,
        type = transType,
        description = desc,
        amount = amount
    }
    table.insert(CityUnderground.Economy.Logs, entry)
end

-- Network handlers
if net and net.Receive then
    -- Deposit Cash into Bank
    net.Receive("CU_Econ_Deposit", function(len, ply)
        local amount = math.floor(tonumber(net.ReadInt(32)) or 0)
        if amount <= 0 then return end

        local char = CityUnderground.Character.GetActive(ply)
        if not char or (char.cash or 0) < amount then return end

        char.cash = char.cash - amount
        char.bank = (char.bank or 0) + amount

        CityUnderground.Economy.LogTransaction(char.id, "DEPOSIT", "ATM Deposit", amount)
        CityUnderground.Character.SyncStats(ply)
    end)

    -- Withdraw Bank into Cash
    net.Receive("CU_Econ_Withdraw", function(len, ply)
        local amount = math.floor(tonumber(net.ReadInt(32)) or 0)
        if amount <= 0 then return end

        local char = CityUnderground.Character.GetActive(ply)
        if not char or (char.bank or 0) < amount then return end

        char.bank = char.bank - amount
        char.cash = (char.cash or 0) + amount

        CityUnderground.Economy.LogTransaction(char.id, "WITHDRAW", "ATM Withdrawal", -amount)
        CityUnderground.Character.SyncStats(ply)
    end)

    -- Wire Transfer to Target Player
    net.Receive("CU_Econ_Transfer", function(len, ply)
        local targetCharId = net.ReadString()
        local amount = math.floor(tonumber(net.ReadInt(32)) or 0)
        if amount <= 0 then return end

        local char = CityUnderground.Character.GetActive(ply)
        if not char or (char.bank or 0) < amount then return end

        -- Find target player
        local targetPly = nil
        for _, p in ipairs(player.GetAll()) do
            local tChar = CityUnderground.Character.GetActive(p)
            if tChar and tChar.id == targetCharId then
                targetPly = p
                break
            end
        end

        if not targetPly then return end
        local tChar = CityUnderground.Character.GetActive(targetPly)
        if not tChar then return end

        char.bank = char.bank - amount
        tChar.bank = (tChar.bank or 0) + amount

        CityUnderground.Economy.LogTransaction(char.id, "TRANSFER_OUT", "Transfer to " .. tChar.firstName .. " " .. tChar.lastName, -amount)
        CityUnderground.Economy.LogTransaction(tChar.id, "TRANSFER_IN", "Transfer from " .. char.firstName .. " " .. char.lastName, amount)

        CityUnderground.Character.SyncStats(ply)
        CityUnderground.Character.SyncStats(targetPly)
    end)

    -- Drop Cash to physical pickup entity
    net.Receive("CU_Econ_DropCash", function(len, ply)
        local amount = math.floor(tonumber(net.ReadInt(32)) or 0)
        if amount <= 0 then return end

        local char = CityUnderground.Character.GetActive(ply)
        if not char or (char.cash or 0) < amount then return end

        char.cash = char.cash - amount
        CityUnderground.Economy.LogTransaction(char.id, "DROP", "Dropped Cash", -amount)
        CityUnderground.Character.SyncStats(ply)

        -- Spawn money pile entity
        if ents and ents.Create then
            local cashEnt = ents.Create("cu_money_drop")
            if IsValid(cashEnt) then
                cashEnt:SetPos(ply:GetPos() + ply:GetForward() * 30 + Vector(0, 0, 10))
                cashEnt:SetAmount(amount)
                cashEnt:Spawn()
            end
        end
    end)
end

-- Salary & Wages Heartbeat (Every 5 minutes)
if timer and timer.Create then
    timer.Create("CU_EconomyWagesHeartbeat", 300, 0, function()
        if not player or not player.GetAll then return end
        for _, ply in ipairs(player.GetAll()) do
            local char = CityUnderground.Character.GetActive(ply)
            if char then
                local wage = 75 -- Default citizen stipend
                if char.job == "police" then
                    wage = 350
                elseif char.job == "delivery" then
                    wage = 120
                elseif char.job == "paramedic" then
                    wage = 300
                end

                char.bank = (char.bank or 0) + wage
                CityUnderground.Economy.LogTransaction(char.id, "SALARY", "Direct Deposit: " .. (char.job or "Citizen") .. " Wage", wage)
                CityUnderground.Character.SyncStats(ply)
            end
        end
    end)
end
