# qbx_fishing

An in-depth, server-authoritative tiered fishing script for **Qbox** (`qbx_core`).

Start with a **Basic Fishing Rod**. Every catch has a small chance to pull up the
**next tier rod**, which unlocks rarer, more valuable fish — all the way up to the
**Master Fishing Rod** and the Bluefin Tuna.

## Rod progression

| Tier | Rod | Chance to pull next rod | Best fish unlocked |
|------|-----|------------------------|--------------------|
| 1 | Basic Fishing Rod | 6.0% | Sardine / Anchovy |
| 2 | Advanced Fishing Rod | 4.5% | Trout / Sea Bass |
| 3 | Pro Fishing Rod | 3.0% | Salmon / Tuna |
| 4 | Expert Fishing Rod | 2.0% | Swordfish / Marlin |
| 5 | Master Fishing Rod | — (top) | Bluefin Tuna ($1,500) |

The script always uses the **highest tier rod you own** automatically. Chances,
loot tables, and prices are all editable in `config.lua`.

## Dependencies

- `qbx_core`
- `ox_lib`
- `ox_inventory`
- `ox_target`

## Installation

1. Drop the `qbx_fishing` folder into your `resources`.
2. Add the item definitions from `ox_inventory_items.lua` into
   `ox_inventory/data/items.lua`.
3. (Optional) Add matching PNG icons to `ox_inventory/web/images/`.
4. Add `ensure qbx_fishing` to your `server.cfg` (after its dependencies).

## Usage

- Stand near water and press **F5** or run **/fish**.
- Your rod casts the line into the water. Watch a fish shadow swim up toward the bobber.
- When it **BITES**, mash **SPACE** before the timer runs out to set the hook.
- Then **fight the fish**: hold **SPACE** to raise the control bar and keep it over
  the darting fish to fill the catch meter. Fill it fully to land the fish.
- Sell your haul at the **Fish Merchant** on Del Perro Pier (blip on the map).

## The minigame

The reel-in is a live visual minigame rendered with a NUI overlay:

1. **Cast** — animated rod throw, the bobber arcs out and splashes into the water.
2. **Wait** — the bobber floats while fish shadows swim in the deep.
3. **Bite** — a fish darts up, the bobber yanks under, react with **SPACE**.
4. **Reel** — a Stardew-style catch bar; keep your zone on the fleeing fish.

Difficulty **scales with your rod tier** — higher tiers hook tougher, faster fish
(smaller control zone, tighter bite window) but reward far more valuable catches.
All timing and difficulty values live in `Config.Minigame`. Set
`Config.Minigame.enabled = false` to fall back to the simple `lib.skillCheck`.

## Admin commands

Restricted by the `Config.Admin.ace` permission (default `group.admin`, which
QBox/txAdmin admins already have). All three also work from the **server console**.

| Command | Description |
|---------|-------------|
| `/fishgive <item> [id] [amount]` | Give a rod, bait, or fish. `<item>` can be `rod`, a tier number `1`-`5`, `bait`, a fish key/label (e.g. `fish_tuna` or `Salmon`), or an exact item id. Defaults to yourself and amount 1. |
| `/fishkit [id]` | Give one of **every** rod plus 25 bait — the fastest way to test all tiers. |
| `/fishlist` | Print every valid rod / bait / fish id to the server console. |

Examples:

```
/fishgive rod          # give yourself a basic rod
/fishgive 5 2          # give player id 2 the tier-5 Master rod
/fishgive fish_tuna 2 10   # give player 2 ten Yellowfin Tuna
/fishkit               # give yourself the full set to test progression
```

## Notes

- All loot rolls, rod upgrades, and payouts are resolved **server-side** to
  prevent client spoofing.
- Set `Config.GiveStarterRod = false` if you distribute rods via a shop/admin.
- Set `Config.UseBait = true` to consume `fishing_bait` per cast.
- Disable the admin commands entirely with `Config.Admin.enabled = false`.
