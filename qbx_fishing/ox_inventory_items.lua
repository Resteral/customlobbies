-- =====================================================================
-- COPY THESE ENTRIES INTO: ox_inventory/data/items.lua
-- (paste inside the returned table, e.g. before the final `}` )
-- Optional: drop matching PNGs into ox_inventory/web/images/ using the
-- item name (e.g. fish_marlin.png) so they show in the inventory UI.
-- =====================================================================

-- Rods ---------------------------------------------------------------
['fishingrod_basic'] = {
    label = 'Basic Fishing Rod',
    weight = 1000,
    stack = false,
    close = true,
    description = 'A worn-out rod. Might snag something better if you are lucky.',
},
['fishingrod_advanced'] = {
    label = 'Advanced Fishing Rod',
    weight = 1000,
    stack = false,
    close = true,
    description = 'A sturdier rod that reaches deeper waters.',
},
['fishingrod_pro'] = {
    label = 'Pro Fishing Rod',
    weight = 1000,
    stack = false,
    close = true,
    description = 'Professional grade. Reels in serious fish.',
},
['fishingrod_expert'] = {
    label = 'Expert Fishing Rod',
    weight = 1000,
    stack = false,
    close = true,
    description = 'Engineered for trophy catches.',
},
['fishingrod_master'] = {
    label = 'Master Fishing Rod',
    weight = 1000,
    stack = false,
    close = true,
    description = 'The finest rod money cannot buy. Only the deep sea remains.',
},

-- Optional bait ------------------------------------------------------
['fishing_bait'] = {
    label = 'Fishing Bait',
    weight = 10,
    stack = true,
    close = false,
    description = 'Consumed each cast when bait is enabled.',
},

-- Fish (tier 1) ------------------------------------------------------
['fish_sardine']  = { label = 'Sardine',       weight = 200, stack = true, close = false },
['fish_anchovy']  = { label = 'Anchovy',       weight = 180, stack = true, close = false },
-- Fish (tier 2) ------------------------------------------------------
['fish_mackerel'] = { label = 'Mackerel',      weight = 350, stack = true, close = false },
['fish_trout']    = { label = 'Rainbow Trout', weight = 400, stack = true, close = false },
-- Fish (tier 3) ------------------------------------------------------
['fish_seabass']  = { label = 'Sea Bass',      weight = 600, stack = true, close = false },
['fish_salmon']   = { label = 'Salmon',        weight = 700, stack = true, close = false },
-- Fish (tier 4) ------------------------------------------------------
['fish_tuna']     = { label = 'Yellowfin Tuna',weight = 1200, stack = true, close = false },
['fish_swordfish']= { label = 'Swordfish',     weight = 1800, stack = true, close = false },
-- Fish (tier 5) ------------------------------------------------------
['fish_marlin']   = { label = 'Blue Marlin',   weight = 2500, stack = true, close = false },
['fish_bluefin']  = { label = 'Bluefin Tuna',  weight = 3000, stack = true, close = false },

-- Trash / junk -------------------------------------------------------
['trash_boot']    = { label = 'Old Boot',      weight = 300, stack = true, close = false },
['trash_can']     = { label = 'Rusty Can',     weight = 150, stack = true, close = false },
['trash_seaweed'] = { label = 'Seaweed',       weight = 100, stack = true, close = false },
