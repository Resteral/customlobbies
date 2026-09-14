-- ============================================================================
-- VENUE MANAGEMENT & TABLET API
-- ============================================================================

-- Fetch full venue dashboard info
RegisterNetEvent('helix_hospitality:server:getVenueDashboard', function(venueId)
    local src = source
    local playerIdent = Bridge.GetPlayerIdentifier(src)

    Storage.GetVenue(venueId, function(venue)
        if not venue then return end

        Storage.GetVenueEmployees(venueId, function(employees)
            Storage.GetVenueLedger(venueId, function(ledger)
                Storage.GetVenueSignatureDrinks(venueId, function(signatureDrinks)
                    local data = {
                        venue = venue,
                        employees = employees or {},
                        ledger = ledger or {},
                        signatureDrinks = signatureDrinks or {},
                        isOwner = (venue.owner_id == playerIdent),
                        ranks = Config.Ranks,
                        wholesale = Config.WholesaleSupply
                    }
                    TriggerClientEvent('helix_hospitality:client:receiveVenueDashboard', src, data)
                end)
            end)
        end)
    end)
end)

-- Purchase Venue
RegisterNetEvent('helix_hospitality:server:buyVenue', function(venueId)
    local src = source
    local playerIdent = Bridge.GetPlayerIdentifier(src)
    local playerName = Bridge.GetPlayerName(src)
    local venueConfig = Config.Venues[venueId]

    if not venueConfig then return end

    Storage.GetVenue(venueId, function(venue)
        if venue and venue.owner_id and venue.owner_id ~= '' then
            TriggerClientEvent('helix_hospitality:client:notify', src, 'This venue is already owned by ' .. (venue.owner_name or 'someone else') .. '.', 'error')
            return
        end

        local price = venueConfig.buyPrice or 500000
        if not Bridge.RemoveMoney(src, 'bank', price, 'Purchased Venue ' .. venueConfig.name) then
            TriggerClientEvent('helix_hospitality:client:notify', src, 'Insufficient bank balance ($' .. price .. ').', 'error')
            return
        end

        Storage.UpdateVenueOwner(venueId, playerIdent, playerName, function(success)
            if success then
                -- Add owner as rank 6 employee
                Storage.AddEmployee(venueId, playerIdent, playerName, 6, 0)
                Storage.AddLedgerEntry(venueId, 'ACQUISITION', -price, 'Venue Acquired by ' .. playerName)
                TriggerClientEvent('helix_hospitality:client:notify', src, 'Congratulations! You are now the official owner of ' .. venueConfig.name .. '!', 'success')
            end
        end)
    end)
end)

-- Safe Deposit & Withdrawal
RegisterNetEvent('helix_hospitality:server:safeAction', function(venueId, action, amount, pinAttempt)
    local src = source
    amount = tonumber(amount) or 0
    if amount <= 0 then return end

    Storage.GetVenue(venueId, function(venue)
        if not venue then return end

        if pinAttempt and tostring(pinAttempt) ~= tostring(venue.safe_pin) and venue.safe_pin ~= '' then
            TriggerClientEvent('helix_hospitality:client:notify', src, 'Incorrect Safe PIN code.', 'error')
            return
        end

        if action == 'deposit' then
            if Bridge.RemoveMoney(src, 'cash', amount, 'Deposit into ' .. venueId .. ' Safe') then
                Storage.UpdateVenueSafe(venueId, amount, function()
                    Storage.AddLedgerEntry(venueId, 'SAFE_DEPOSIT', amount, 'Cash Deposit by ' .. Bridge.GetPlayerName(src))
                    TriggerClientEvent('helix_hospitality:client:notify', src, 'Successfully deposited $' .. amount .. ' into venue safe.', 'success')
                end)
            else
                TriggerClientEvent('helix_hospitality:client:notify', src, 'You do not have $' .. amount .. ' cash.', 'error')
            end
        elseif action == 'withdraw' then
            if (venue.safe_balance or 0) >= amount then
                Storage.UpdateVenueSafe(venueId, -amount, function()
                    Bridge.AddMoney(src, 'cash', amount, 'Withdrawal from ' .. venueId .. ' Safe')
                    Storage.AddLedgerEntry(venueId, 'SAFE_WITHDRAWAL', -amount, 'Cash Withdrawal by ' .. Bridge.GetPlayerName(src))
                    TriggerClientEvent('helix_hospitality:client:notify', src, 'Withdrew $' .. amount .. ' from venue safe.', 'success')
                end)
            else
                TriggerClientEvent('helix_hospitality:client:notify', src, 'Venue safe does not have enough funds ($' .. (venue.safe_balance or 0) .. ' available).', 'error')
            end
        end
    end)
end)

-- Hire & Manage Employees
RegisterNetEvent('helix_hospitality:server:hireEmployee', function(venueId, targetServerId, rankId)
    local src = source
    rankId = tonumber(rankId) or 1
    local rankConfig = Config.Ranks[rankId] or Config.Ranks[1]

    local targetIdent = Bridge.GetPlayerIdentifier(targetServerId)
    local targetName = Bridge.GetPlayerName(targetServerId)

    if not targetIdent then
        TriggerClientEvent('helix_hospitality:client:notify', src, 'Patron is not available to hire.', 'error')
        return
    end

    Storage.AddEmployee(venueId, targetIdent, targetName, rankId, rankConfig.defaultPay, function(success)
        if success then
            TriggerClientEvent('helix_hospitality:client:notify', src, 'Hired ' .. targetName .. ' as ' .. rankConfig.label .. '.', 'success')
            TriggerClientEvent('helix_hospitality:client:notify', targetServerId, 'You have been hired at ' .. venueId .. ' as ' .. rankConfig.label .. '!', 'success')
        end
    end)
end)

RegisterNetEvent('helix_hospitality:server:fireEmployee', function(venueId, employeeIdent)
    local src = source
    Storage.RemoveEmployee(venueId, employeeIdent, function(success)
        if success then
            TriggerClientEvent('helix_hospitality:client:notify', src, 'Employee removed from roster.', 'info')
        end
    end)
end)

-- Wholesale Stock Orders
RegisterNetEvent('helix_hospitality:server:orderWholesaleStock', function(venueId, itemName, quantity)
    local src = source
    quantity = tonumber(quantity) or 1
    local supply = Config.WholesaleSupply[itemName]
    if not supply or quantity <= 0 then return end

    local totalCost = (supply.wholesalePrice or 20) * quantity

    Storage.GetVenue(venueId, function(venue)
        if not venue or (venue.safe_balance or 0) < totalCost then
            TriggerClientEvent('helix_hospitality:client:notify', src, 'Insufficient funds in venue safe ($' .. totalCost .. ' required).', 'error')
            return
        end

        Storage.UpdateVenueSafe(venueId, -totalCost, function()
            Bridge.AddItem(src, itemName, quantity)
            Storage.AddLedgerEntry(venueId, 'WHOLESALE_ORDER', -totalCost, 'Ordered ' .. quantity .. 'x ' .. supply.label)
            TriggerClientEvent('helix_hospitality:client:notify', src, 'Wholesale order received: ' .. quantity .. 'x ' .. supply.label, 'success')
        end)
    end)
end)

-- POS Cash Register Billing
RegisterNetEvent('helix_hospitality:server:chargeCustomerBill', function(venueId, targetServerId, amount, itemDescription)
    local src = source
    amount = tonumber(amount) or 0
    if amount <= 0 then return end

    local bartenderName = Bridge.GetPlayerName(src)
    local customerName = Bridge.GetPlayerName(targetServerId)

    if not Bridge.RemoveMoney(targetServerId, 'cash', amount, 'Bar Tab at ' .. venueId) then
        if not Bridge.RemoveMoney(targetServerId, 'bank', amount, 'Bar Tab at ' .. venueId) then
            TriggerClientEvent('helix_hospitality:client:notify', src, customerName .. ' could not afford the tab ($' .. amount .. ').', 'error')
            TriggerClientEvent('helix_hospitality:client:notify', targetServerId, 'You could not afford the bar tab of $' .. amount .. '.', 'error')
            return
        end
    end

    -- 80% goes to Venue Safe, 20% direct tip to Bartender
    local venueCut = math.floor(amount * 0.80)
    local bartenderTip = amount - venueCut

    Storage.UpdateVenueSafe(venueId, venueCut)
    Bridge.AddMoney(src, 'cash', bartenderTip, 'Bar Tab Tip')
    Storage.AddLedgerEntry(venueId, 'BAR_TAB', venueCut, 'Tab paid by ' .. customerName .. ' (' .. (itemDescription or 'Drinks') .. ')')

    TriggerClientEvent('helix_hospitality:client:notify', src, 'Billed ' .. customerName .. ' for $' .. amount .. ' (Earned $' .. bartenderTip .. ' Tip).', 'success')
    TriggerClientEvent('helix_hospitality:client:notify', targetServerId, 'You paid $' .. amount .. ' for your bar tab.', 'info')
end)
