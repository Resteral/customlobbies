AddEventHandler('onResourceStart', function(res)
    if res ~= GetCurrentResourceName() then return end
    Storage.Init()
    print('^2====================================================^0')
    print('^2[helix_hospitality]^0 Nightlife & Mixology Tycoon Loaded')
    print('^2[helix_hospitality]^0 Universal Bridge Active: ' .. Bridge.FrameworkName)
    print('^2====================================================^0')
end)

-- Automated Payroll & Venue Hype Decay Loop
CreateThread(function()
    while true do
        Wait(Config.PayrollIntervalMinutes * 60 * 1000)

        Storage.GetAllVenues(function(venues)
            for venueId, venue in pairs(venues or {}) do
                Storage.GetVenueEmployees(venueId, function(employees)
                    local totalPayroll = 0
                    for _, emp in ipairs(employees or {}) do
                        totalPayroll = totalPayroll + (emp.pay_rate or 0)
                    end

                    if totalPayroll > 0 then
                        Storage.UpdateVenueSafe(venueId, -totalPayroll, function(success)
                            if success then
                                Storage.AddLedgerEntry(venueId, 'PAYROLL', -totalPayroll, 'Automated Employee Shift Wages')
                            else
                                Storage.AddLedgerEntry(venueId, 'PAYROLL_MISSED', 0, 'Insufficient funds in venue safe to pay payroll')
                            end
                        end)
                    end
                end)
            end
        end)
    end
end)

-- Fetch Initial State for Clients
RegisterNetEvent('helix_hospitality:server:getInitialState', function()
    local src = source
    Storage.GetAllVenues(function(venues)
        TriggerClientEvent('helix_hospitality:client:syncVenues', src, venues)
    end)
end)
