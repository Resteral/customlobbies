Config = {}

-----------------------------------------------------------
-- GENERAL
-----------------------------------------------------------
-- Require bait to fish. If true, one BaitItem is consumed per cast.
Config.UseBait = false
Config.BaitItem = 'fishing_bait'

-- How close (in meters) the player must be to water to cast.
Config.WaterCheckDistance = 25.0

-- Payout account used when selling fish ('cash' or 'bank').
Config.PayAccount = 'cash'

-- Notification helper (uses ox_lib)
Config.Notify = function(msg, type)
    lib.notify({ title = 'Fishing', description = msg, type = type or 'inform' })
end

-----------------------------------------------------------
-- FISH & LOOT VALUES
-- price = how much the merchant pays per fish.
-- trash items have a price of 0 (or near 0) and cannot be "graded".
-----------------------------------------------------------
Config.Fish = {
    -- Tier 1
    fish_sardine   = { label = 'Sardine',        price = 15 },
    fish_anchovy   = { label = 'Anchovy',        price = 20 },
    -- Tier 2
    fish_mackerel  = { label = 'Mackerel',       price = 45 },
    fish_trout     = { label = 'Rainbow Trout',  price = 60 },
    -- Tier 3
    fish_seabass   = { label = 'Sea Bass',       price = 130 },
    fish_salmon    = { label = 'Salmon',         price = 175 },
    -- Tier 4
    fish_tuna      = { label = 'Yellowfin Tuna', price = 360 },
    fish_swordfish = { label = 'Swordfish',      price = 520 },
    -- Tier 5
    fish_marlin    = { label = 'Blue Marlin',    price = 950 },
    fish_bluefin   = { label = 'Bluefin Tuna',   price = 1500 },
    -- Trash / junk
    trash_boot     = { label = 'Old Boot',       price = 0 },
    trash_can      = { label = 'Rusty Can',      price = 0 },
    trash_seaweed  = { label = 'Seaweed',        price = 3 },
}

-----------------------------------------------------------
-- ROD TIERS
-- Rods are ordered lowest -> highest. When fishing, the script
-- automatically uses the highest tier rod the player owns.
--
--   castTime : ms for the cast/minigame window
--   upgrade  : chance (per successful catch) to pull the NEXT rod
--   loot     : weighted loot table for this rod tier
-----------------------------------------------------------
Config.Rods = {
    {
        item = 'fishingrod_basic',
        label = 'Basic Fishing Rod',
        tier = 1,
        castTime = 9000,
        upgrade = { item = 'fishingrod_advanced', chance = 6.0 },
        loot = {
            { item = 'trash_boot',   weight = 12 },
            { item = 'trash_can',    weight = 10 },
            { item = 'trash_seaweed',weight = 8 },
            { item = 'fish_sardine', weight = 40 },
            { item = 'fish_anchovy', weight = 25 },
            { item = 'fish_mackerel',weight = 5 },
        },
    },
    {
        item = 'fishingrod_advanced',
        label = 'Advanced Fishing Rod',
        tier = 2,
        castTime = 8000,
        upgrade = { item = 'fishingrod_pro', chance = 4.5 },
        loot = {
            { item = 'trash_seaweed', weight = 8 },
            { item = 'fish_sardine',  weight = 20 },
            { item = 'fish_anchovy',  weight = 18 },
            { item = 'fish_mackerel', weight = 28 },
            { item = 'fish_trout',    weight = 20 },
            { item = 'fish_seabass',  weight = 6 },
        },
    },
    {
        item = 'fishingrod_pro',
        label = 'Pro Fishing Rod',
        tier = 3,
        castTime = 7500,
        upgrade = { item = 'fishingrod_expert', chance = 3.0 },
        loot = {
            { item = 'fish_mackerel', weight = 15 },
            { item = 'fish_trout',    weight = 20 },
            { item = 'fish_seabass',  weight = 30 },
            { item = 'fish_salmon',   weight = 25 },
            { item = 'fish_tuna',     weight = 8 },
            { item = 'fish_swordfish',weight = 2 },
        },
    },
    {
        item = 'fishingrod_expert',
        label = 'Expert Fishing Rod',
        tier = 4,
        castTime = 7000,
        upgrade = { item = 'fishingrod_master', chance = 2.0 },
        loot = {
            { item = 'fish_salmon',    weight = 15 },
            { item = 'fish_seabass',   weight = 15 },
            { item = 'fish_tuna',      weight = 32 },
            { item = 'fish_swordfish', weight = 26 },
            { item = 'fish_marlin',    weight = 9 },
            { item = 'fish_bluefin',   weight = 3 },
        },
    },
    {
        item = 'fishingrod_master',
        label = 'Master Fishing Rod',
        tier = 5,
        castTime = 6500,
        upgrade = nil, -- top tier, nothing better to pull
        loot = {
            { item = 'fish_tuna',      weight = 18 },
            { item = 'fish_swordfish', weight = 24 },
            { item = 'fish_marlin',    weight = 34 },
            { item = 'fish_bluefin',   weight = 24 },
        },
    },
}

-----------------------------------------------------------
-- MINIGAME (visual NUI fishing)
-- The reel-in is a live minigame: watch the line cast, a fish
-- shadow swims up and bites, you hook it, then fight it in a
-- Stardew-style catch bar. Difficulty scales with rod tier -
-- better rods pull tougher fish that are worth more money.
-----------------------------------------------------------
Config.Minigame = {
    enabled = true,

    -- Base difficulty (applied to a Tier 1 basic rod).
    base = {
        biteWindowMs = 1200,  -- ms to react and hook once the fish bites
        reelTimeMs   = 14000, -- overall time limit for the catch bar
        barZone      = 0.30,  -- size of your green control zone (fraction of bar)
        fishSpeed    = 0.85,  -- how fast the fish darts up/down the bar
        fishSlip     = 0.50,  -- how erratic / jumpy the fish is
        fill         = 0.30,  -- catch progress gained per second while on the fish
        drain        = 0.22,  -- catch progress lost per second while off the fish

        -- STRUGGLE mechanic. The fish periodically thrashes. While it
        -- struggles, reeling (holding SPACE) spikes line tension. Ease off
        -- during the struggle or tension maxes out and the line SNAPS.
        struggleMinGap  = 2.6,  -- min seconds between struggles
        struggleMaxGap  = 4.2,  -- max seconds between struggles
        struggleTime    = 1.6,  -- how long a struggle lasts (seconds)
        struggleGraceMs = 400,  -- reaction window at the start of a struggle
                                -- (tension won't build yet - time to ease off)
        tensionBuild    = 0.85, -- tension/sec gained while reeling during a struggle
        tensionEase     = 0.70, -- tension/sec lost while eased off / calm
    },

    -- Per-tier modifiers. Applied (tier - 1) times on top of base.
    -- Higher tiers => tighter window, smaller zone, faster & fiercer fish.
    perTier = {
        biteWindowMs   = -90,
        barZone        = -0.025,
        fishSpeed      = 0.16,
        fishSlip       = 0.07,
        struggleTime   = 0.22,  -- struggles last longer
        struggleMinGap = -0.28, -- and happen more often
        struggleMaxGap = -0.34,
        tensionBuild   = 0.14,  -- tension climbs faster
    },

    -- Safety clamps so the highest tiers stay hard-but-fair.
    clamp = {
        minBiteWindowMs = 650,
        minBarZone      = 0.16,
        minStruggleGap  = 1.4,
    },
}

-----------------------------------------------------------
-- FISH MERCHANT (sell zone)
-----------------------------------------------------------
Config.Merchant = {
    model = `s_m_m_dockwork_01`,
    coords = vec4(-1850.15, -1231.75, 13.02, 141.0), -- Del Perro Pier
    scenario = 'WORLD_HUMAN_CLIPBOARD',
    blip = {
        enabled = true,
        sprite = 356,
        color = 3,
        scale = 0.75,
        label = 'Fish Merchant',
    },
}

-----------------------------------------------------------
-- STARTER ITEM
-- Give a basic rod to players who have no rod when they try to fish.
-- Set to false if you distribute rods yourself (shop, admin, etc.)
-----------------------------------------------------------
Config.GiveStarterRod = true

-----------------------------------------------------------
-- ADMIN COMMANDS (for testing / giving out gear)
-- Restricted by an ace permission so only staff can use them.
--   /fishgive <rod|bait|fish> [id] [amount]
--   /fishkit  [id]                (full set of every rod + bait)
--   /fishlist                     (prints every item id to the console)
-- QBox/txAdmin admins already inherit the "group.admin" ace by default.
-----------------------------------------------------------
Config.Admin = {
    enabled = true,
    ace = 'group.admin', -- ace permission required to run the commands
}
