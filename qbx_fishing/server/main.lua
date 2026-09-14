-----------------------------------------------------------
-- Server-side notify (ox_lib client net event)
-----------------------------------------------------------
local function notify(src, msg, type)
    TriggerClientEvent('ox_lib:notify', src, {
        title = 'Fishing',
        description = msg,
        type = type or 'inform',
    })
end

-----------------------------------------------------------
-- Rod lookup by item -> tier index
-----------------------------------------------------------
local rodByItem = {}
for index, rod in ipairs(Config.Rods) do
    rodByItem[rod.item] = index
end

-----------------------------------------------------------
-- Weighted random pick from a loot table
-----------------------------------------------------------
local function weightedPick(loot)
    local total = 0
    for i = 1, #loot do
        total = total + loot[i].weight
    end
    if total <= 0 then return nil end

    local roll = math.random() * total
    local cumulative = 0
    for i = 1, #loot do
        cumulative = cumulative + loot[i].weight
        if roll <= cumulative then
            return loot[i].item
        end
    end
    return loot[#loot].item
end

-----------------------------------------------------------
-- Find the highest tier rod a player actually owns (server-side check)
-----------------------------------------------------------
local function getServerBestRod(src)
    local best, bestIndex = nil, 0
    local items = exports.ox_inventory:Search(src, 'slots', '') or {}
    for _, item in ipairs(items) do
        local index = rodByItem[item.name]
        if index and index > bestIndex then
            best, bestIndex = Config.Rods[index], index
        end
    end
    return best, bestIndex
end

-----------------------------------------------------------
-- Starter rod callback
-----------------------------------------------------------
lib.callback.register('qbx_fishing:server:starterRod', function(src)
    if not Config.GiveStarterRod then return false end
    local best = getServerBestRod(src)
    if best then return true end -- already has a rod
    return exports.ox_inventory:AddItem(src, Config.Rods[1].item, 1)
end)

-----------------------------------------------------------
-- Resolve a catch: validate rod, consume bait, roll loot,
-- roll rod upgrade. All authoritative on the server.
-----------------------------------------------------------
RegisterNetEvent('qbx_fishing:server:catch', function()
    local src = source

    -- Always use the server's view of the player's best rod (ignore client claim).
    local rod, tier = getServerBestRod(src)
    if not rod then
        notify(src, 'You do not have a fishing rod.', 'error')
        return
    end

    -- Consume bait if enabled
    if Config.UseBait then
        local baitCount = exports.ox_inventory:GetItemCount(src, Config.BaitItem)
        if not baitCount or baitCount < 1 then
            notify(src, 'You are out of bait.', 'error')
            return
        end
        exports.ox_inventory:RemoveItem(src, Config.BaitItem, 1)
    end

    -- Roll the catch
    local caught = weightedPick(rod.loot)
    if not caught then return end

    local added = exports.ox_inventory:AddItem(src, caught, 1)
    if not added then
        notify(src, 'Your inventory is full!', 'error')
        return
    end

    local fishData = Config.Fish[caught]
    local caughtLabel = fishData and fishData.label or caught
    notify(src, ('You caught: %s'):format(caughtLabel), 'success')

    -- Roll for a better rod (only if this rod has an upgrade path)
    if rod.upgrade then
        local roll = math.random() * 100
        if roll <= rod.upgrade.chance then
            local upgradeItem = rod.upgrade.item
            local upgradeIndex = rodByItem[upgradeItem]
            local upgradeRod = upgradeIndex and Config.Rods[upgradeIndex]

            -- Don't hand out duplicates of a rod they already own
            local alreadyHas = exports.ox_inventory:GetItemCount(src, upgradeItem)
            if not alreadyHas or alreadyHas < 1 then
                if exports.ox_inventory:AddItem(src, upgradeItem, 1) then
                    notify(src, ('RARE! You pulled up a %s!'):format(
                        upgradeRod and upgradeRod.label or upgradeItem), 'success')
                end
            end
        end
    end
end)

-----------------------------------------------------------
-- Sell all sellable fish
-----------------------------------------------------------
RegisterNetEvent('qbx_fishing:server:sellAll', function()
    local src = source
    local player = exports.qbx_core:GetPlayer(src)
    if not player then return end

    local items = exports.ox_inventory:Search(src, 'slots', '') or {}
    local total = 0
    local sold = 0

    for _, slot in ipairs(items) do
        local fish = Config.Fish[slot.name]
        if fish and fish.price > 0 and slot.count > 0 then
            if exports.ox_inventory:RemoveItem(src, slot.name, slot.count) then
                total = total + (fish.price * slot.count)
                sold = sold + slot.count
            end
        end
    end

    if total <= 0 then
        notify(src, 'You had nothing to sell.', 'error')
        return
    end

    player.Functions.AddMoney(Config.PayAccount, total, 'fish-sold')
    notify(src, ('Sold %d fish for $%d'):format(sold, total), 'success')
end)

-----------------------------------------------------------
-- ADMIN COMMANDS
-----------------------------------------------------------
if Config.Admin and Config.Admin.enabled then
    -- Console-safe messaging: src 0 = server console, otherwise notify in-game.
    local function tell(src, msg, type)
        if src == 0 then
            print(('[qbx_fishing] %s'):format(msg))
        else
            notify(src, msg, type)
        end
    end

    -- Permission check. The server console (src 0) always passes.
    local function isAdmin(src)
        if src == 0 then return true end
        return IsPlayerAceAllowed(src, Config.Admin.ace)
    end

    -- Resolve a target id from an argument, defaulting to the caller.
    local function resolveTarget(src, arg)
        local target = tonumber(arg)
        if target then return target end
        if src ~= 0 then return src end
        return nil
    end

    -- Give any fishing item by keyword or exact item id.
    -- keyword: "rod" (basic), a rod tier number/name, "bait", or a fish key.
    local function giveByKeyword(src, keyword, target, amount)
        amount = math.max(1, tonumber(amount) or 1)
        keyword = (keyword or ''):lower()

        local item

        if keyword == 'bait' then
            item = Config.BaitItem
        elseif keyword == 'rod' then
            item = Config.Rods[1].item
        elseif Config.Rods[tonumber(keyword) or -1] then
            item = Config.Rods[tonumber(keyword)].item
        else
            -- exact rod item, exact fish key, or fish label match
            for _, rod in ipairs(Config.Rods) do
                if rod.item == keyword then item = rod.item break end
            end
            if not item then
                if Config.Fish[keyword] then
                    item = keyword
                else
                    for key, fish in pairs(Config.Fish) do
                        if fish.label:lower() == keyword then item = key break end
                    end
                end
            end
        end

        if not item then
            tell(src, ('Unknown item "%s". Use /fishlist to see valid ids.'):format(keyword), 'error')
            return
        end

        if exports.ox_inventory:AddItem(target, item, amount) then
            tell(src, ('Gave %dx %s to player %d.'):format(amount, item, target), 'success')
        else
            tell(src, ('Failed to give %s (inventory full?).'):format(item), 'error')
        end
    end

    -- /fishgive <rod|bait|fish|itemid> [id] [amount]
    lib.addCommand('fishgive', {
        help = 'Give a fishing rod, bait, or fish (admin).',
        params = {
            { name = 'item',   help = 'rod | <tier 1-5> | bait | <fish key/label> | exact item id', type = 'string' },
            { name = 'id',     help = 'Target player server id (default: you)', type = 'number', optional = true },
            { name = 'amount', help = 'Amount to give (default: 1)', type = 'number', optional = true },
        },
        restricted = Config.Admin.ace,
    }, function(source, args)
        if not isAdmin(source) then return end
        local target = resolveTarget(source, args.id)
        if not target then
            tell(source, 'Specify a player id when running from the console.', 'error')
            return
        end
        giveByKeyword(source, args.item, target, args.amount)
    end)

    -- /fishkit [id]  -> one of every rod + a stack of bait
    lib.addCommand('fishkit', {
        help = 'Give a full set of every rod + bait (admin).',
        params = {
            { name = 'id', help = 'Target player server id (default: you)', type = 'number', optional = true },
        },
        restricted = Config.Admin.ace,
    }, function(source, args)
        if not isAdmin(source) then return end
        local target = resolveTarget(source, args.id)
        if not target then
            tell(source, 'Specify a player id when running from the console.', 'error')
            return
        end
        for _, rod in ipairs(Config.Rods) do
            exports.ox_inventory:AddItem(target, rod.item, 1)
        end
        exports.ox_inventory:AddItem(target, Config.BaitItem, 25)
        tell(source, ('Gave the full fishing kit to player %d.'):format(target), 'success')
    end)

    -- /fishlist -> print every valid id to the console
    lib.addCommand('fishlist', {
        help = 'Print every fishing item id to the console (admin).',
        restricted = Config.Admin.ace,
    }, function(source)
        if not isAdmin(source) then return end
        print('[qbx_fishing] Rods:')
        for i, rod in ipairs(Config.Rods) do
            print(('  %d) %s  (%s)'):format(i, rod.item, rod.label))
        end
        print('[qbx_fishing] Bait: ' .. Config.BaitItem)
        print('[qbx_fishing] Fish:')
        for key, fish in pairs(Config.Fish) do
            print(('  %s  (%s) $%d'):format(key, fish.label, fish.price))
        end
        if source ~= 0 then
            notify(source, 'Item ids printed to the server console.', 'inform')
        end
    end)
end
