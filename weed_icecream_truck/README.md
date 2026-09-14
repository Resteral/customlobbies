# 🍦 Munchies Delivery - Weed & Drug Ice Cream Truck Resource (`weed_icecream_truck`)

A complete, feature-packed **Standalone & Framework-Ready Weed & Drug Selling Ice Cream Truck Script** for FiveM GTA V RP servers. Works out of the box with **Pure Standalone**, **QBCore**, **Qbox**, and **ESX Legacy**, with zero mandatory dependencies.

---

## 🌟 Key Features

- **🚗 Dedicated Custom Vehicle (`weedtruck` / `mrtasty`)**:
  - Configured with metadata and script locks to **ONLY ever have that 1 custom drug livery**.
  - **Single Livery Lock Engine**: Prevents accidental livery changes or mod shop overrides, keeping the vehicle strictly branded.
  - Automatically enables all vehicle extras (giant soft-serve roof cone, service hatch, rear dispensers) and applies a clean pearl cream finish.

- **📦 100% Standalone Out of the Box**:
  - Automatic fallback in-memory inventory & cash balance for instant testing on pure standalone servers.
  - Automatic 3D floating text interaction (`[E] Munchies Truck Menu`) when target scripts are not running.
  - Built-in command `/spawntruck` / `/munchiestruck` to spawn the ice cream truck directly into the driver seat.
  - Seamless auto-detection and hooks for `ox_target`, `qb-target`, `ox_inventory`, `qb-inventory`, `qb-core`, `qbox`, and `es_extended`.

- **💻 Modern Quick-Buy HUD & Shopping UI**:
  - **Live Search & Filter Chips**: Filter products instantly with the search bar or category chips (`🍦 Cones`, `🌿 Edibles`, `💊 Street Illicits`).
  - **1-Click Card Quick Buy**: Dedicated `⚡ BUY 1x` and `⚡ BUY 5x` action buttons directly on each product card for lightning-fast purchases.
  - **Multi-Quantity Batch Purchasing**: Buy 1x, 5x, 10x, 25x in a single atomic transaction.
  - **Floating Receipt HUD Toast**: Animated slide-in purchase confirmation popup with item icons, prices, and cash updates.
  - **Pharmacology & Potency Radar**: Interactive holographic inspection stage with THC/purity gauges and status buff breakdown.

- **🎵 3D Audio Jingle Loop**:
  - Driver can toggle classic 3D ice cream chime music that plays in real-time to attract nearby players and pedestrians.

- **🚶‍♂️ AI Pedestrian Customers**:
  - When Selling Mode & Jingle are turned on, random NPCs in the neighborhood walk up to the passenger window, play item handoff animations, and pay cash for weed!
  - **Police Dispatch Alerts**: Configurable chance that suspicious NPCs notice illegal transactions and call 911 (`ps-dispatch`, `cd_dispatch`, or native notification).

- **✨ Consumable Visual Effects & Shaders**:
  - Eating weed cones, brownies, or smoking joints attaches realistic 3D props in the player's hand, plays eating animations, restores stamina/health, and applies GTA V psychedelic screen shaders (`spectator5` & `DrugsTrevorClownsFight`)!

---

## 🛠️ Installation & Setup

1. Place the `weed_icecream_truck` folder in your server's `resources/` directory:
   ```text
   resources/[standalone]/weed_icecream_truck
   ```

2. Add the start command to your `server.cfg`:
   ```cfg
   ensure weed_icecream_truck
   ```

3. Configure your preferences in [config.lua](file:///c:/Users/Sean/Documents/Downloads/HelixGame/weed_icecream_truck/config.lua).

---

## 🎮 In-Game Commands & Controls

| Command / Control | Description |
| :--- | :--- |
| `[E]` (Near Side Window) | Open the customer order window & contraband menu |
| `[E]` / `[G]` (Inside Cab) | Open the Driver Management Dashboard (Stock, Jingle, Selling Mode, Livery) |
| `/spawntruck` or `/munchiestruck` | Spawns the ice cream truck van directly with custom livery & roof extras |
| `/truckmenu` | Manually opens the truck menu if standing near or sitting inside |
| `/trucklivery <number>` | Changes the truck livery dynamically (e.g., `/trucklivery 1`) |
| `/setlivery <number>` | Alias for `/trucklivery` |

---

## 📦 Optional Framework Item Registrations

If you are using **ox_inventory**, **QBCore**, or **ESX**, add the items to your server item database:

### QBCore (`qb-core/shared/items.lua`)
```lua
['vanilla_cone']      = {['name'] = 'vanilla_cone',      ['label'] = 'Vanilla Soft Serve',       ['weight'] = 200, ['type'] = 'item', ['image'] = 'vanilla_cone.png',      ['unique'] = false, ['useable'] = true, ['shouldClose'] = true, ['description'] = 'Classic vanilla soft serve.'},
['chocolate_gelato']  = {['name'] = 'chocolate_gelato',  ['label'] = 'Double Chocolate Gelato',  ['weight'] = 250, ['type'] = 'item', ['image'] = 'chocolate_gelato.png',  ['unique'] = false, ['useable'] = true, ['shouldClose'] = true, ['description'] = 'Rich dark chocolate gelato.'},
['weed_icecream']     = {['name'] = 'weed_icecream',     ['label'] = 'Mint Cannabis Cone',       ['weight'] = 200, ['type'] = 'item', ['image'] = 'weed_icecream.png',     ['unique'] = false, ['useable'] = true, ['shouldClose'] = true, ['description'] = 'Refreshing THC infused ice cream.'},
['weed_brownie']      = {['name'] = 'weed_brownie',      ['label'] = 'Pot Fudge Brownie',        ['weight'] = 250, ['type'] = 'item', ['image'] = 'weed_brownie.png',      ['unique'] = false, ['useable'] = true, ['shouldClose'] = true, ['description'] = 'Dark chocolate pot brownie.'},
['weed_gummies']      = {['name'] = 'weed_gummies',      ['label'] = 'THC Gummy Bears',          ['weight'] = 100, ['type'] = 'item', ['image'] = 'weed_gummies.png',      ['unique'] = false, ['useable'] = true, ['shouldClose'] = true, ['description'] = '100mg nano THC gummies.'},
['weed_baggy']        = {['name'] = 'weed_baggy',        ['label'] = 'OG Kush Baggie (1g)',      ['weight'] = 100, ['type'] = 'item', ['image'] = 'weed_baggy.png',        ['unique'] = false, ['useable'] = true, ['shouldClose'] = true, ['description'] = '1g dried cannabis bud.'},
['weed_joint']        = {['name'] = 'weed_joint',        ['label'] = 'King-Size Pre-Roll',       ['weight'] = 50,  ['type'] = 'item', ['image'] = 'weed_joint.png',        ['unique'] = false, ['useable'] = true, ['shouldClose'] = true, ['description'] = 'Tightly rolled joint.'},
['coke_baggy']        = {['name'] = 'coke_baggy',        ['label'] = 'Cocaine Gram Baggy',       ['weight'] = 100, ['type'] = 'item', ['image'] = 'coke_baggy.png',        ['unique'] = false, ['useable'] = true, ['shouldClose'] = true, ['description'] = 'Powder cocaine gram baggie.'},
['meth_baggy']        = {['name'] = 'meth_baggy',        ['label'] = 'Crystal Meth Shards',      ['weight'] = 100, ['type'] = 'item', ['image'] = 'meth_baggy.png',        ['unique'] = false, ['useable'] = true, ['shouldClose'] = true, ['description'] = 'Crystal blue meth shards.'},
```

### ox_inventory (`ox_inventory/data/items.lua`)
```lua
['weed_icecream'] = { label = 'Mint Cannabis Cone', weight = 200, stack = true, close = true, description = 'Refreshing THC infused ice cream cone.' },
['weed_brownie']  = { label = 'Pot Fudge Brownie', weight = 250, stack = true, close = true, description = 'Dark chocolate pot brownie.' },
['weed_gummies']  = { label = 'THC Gummy Bears', weight = 100, stack = true, close = true, description = '100mg nano THC gummies.' },
['weed_baggy']    = { label = 'OG Kush Baggie (1g)', weight = 100, stack = true, close = true, description = '1g dried cannabis bud.' },
['weed_joint']    = { label = 'King-Size Pre-Roll', weight = 50, stack = true, close = true, description = 'Pre-rolled joint.' },
['coke_baggy']    = { label = 'Cocaine Gram Baggy', weight = 100, stack = true, close = true, description = 'Street cocaine baggie.' },
['meth_baggy']    = { label = 'Crystal Meth Shards', weight = 100, stack = true, close = true, description = 'Crystal blue meth.' },
```

