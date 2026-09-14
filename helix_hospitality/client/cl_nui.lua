-- Generic Close NUI
RegisterNUICallback('close_ui', function(data, cb)
    SetNuiFocus(false, false)
    cb({ status = 'ok' })
end)

-- POS Bill Customer
RegisterNUICallback('pos_charge_bill', function(data, cb)
    SetNuiFocus(false, false)
    TriggerServerEvent('helix_hospitality:server:chargeCustomerBill', data.venueId, data.targetServerId, data.amount, data.description)
    cb({ status = 'ok' })
end)

-- Safe Action (Deposit / Withdraw)
RegisterNUICallback('safe_submit_action', function(data, cb)
    SetNuiFocus(false, false)
    TriggerServerEvent('helix_hospitality:server:safeAction', data.venueId, data.action, data.amount, data.pin)
    cb({ status = 'ok' })
end)

-- Tablet: Hire Employee
RegisterNUICallback('tablet_hire_employee', function(data, cb)
    TriggerServerEvent('helix_hospitality:server:hireEmployee', data.venueId, data.targetServerId, data.rankId)
    cb({ status = 'ok' })
end)

-- Tablet: Fire Employee
RegisterNUICallback('tablet_fire_employee', function(data, cb)
    TriggerServerEvent('helix_hospitality:server:fireEmployee', data.venueId, data.employeeIdent)
    cb({ status = 'ok' })
end)

-- Tablet: Order Wholesale Stock
RegisterNUICallback('tablet_order_stock', function(data, cb)
    TriggerServerEvent('helix_hospitality:server:orderWholesaleStock', data.venueId, data.itemName, data.quantity)
    cb({ status = 'ok' })
end)

-- Tablet: Save Custom Signature Drink
RegisterNUICallback('tablet_save_signature_drink', function(data, cb)
    TriggerServerEvent('helix_hospitality:server:saveSignatureDrink', data.venueId, data.drink)
    cb({ status = 'ok' })
end)

-- DJ: Play Track
RegisterNUICallback('dj_play_track', function(data, cb)
    SetNuiFocus(false, false)
    TriggerServerEvent('helix_hospitality:server:playDJTrack', data.venueId, data.url, data.volume)
    cb({ status = 'ok' })
end)

-- DJ: Stop Track
RegisterNUICallback('dj_stop_track', function(data, cb)
    SetNuiFocus(false, false)
    TriggerServerEvent('helix_hospitality:server:stopDJTrack', data.venueId)
    cb({ status = 'ok' })
end)
