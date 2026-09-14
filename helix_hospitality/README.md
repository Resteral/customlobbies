# Helix Hospitality & Nightlife Tycoon (`helix_hospitality`)

A comprehensive, **100% Standalone** FiveM script for hospitality management, mixology crafting, drunkenness/BAC simulation, VIP bottle service ceremonies, and venue business operations with automated framework bridging.

---

## 🌟 Key Features

### 1. Interactive Mixology & Crafting Station (NUI)
* **Real-time Pouring Minigame:** Hold-to-pour physics meter with sweet-spot fill detection.
* **Shaker Rhythm Minigame:** Tempo-based rhythm bar testing bartender reflexes.
* **1 to 5 Star Quality Rating:** Drink quality directly influences sale price, buff duration, and taste.
* **Custom Signature Cocktails:** Venue owners can invent signature cocktails with custom glassware, colors, and perks.

### 2. Blood Alcohol Content (BAC) & Drunkenness Engine
* Dynamic BAC calculation per standard drink unit with natural metabolic decay.
* **Tiered Effects:**
  * `0.02 - 0.05%`: Mild buzz, stamina regeneration boost.
  * `0.05 - 0.12%`: Tipsy walking style, subtle screen warmth.
  * `0.12 - 0.20%`: Drunk screen shader, camera sway, sprint stumbling.
  * `0.20 - 0.30%`: Extreme drunkenness, ragdoll stumble physics.
  * `0.30%+`: Blackout / pass-out sequence.
* **Sobriety Items:** Water bottles, coffee, energy drinks, and hangover pills to lower BAC.
* **Digital Police Breathalyzer:** Usable breathalyzer tool showing exact BAC percentage and legal status.

### 3. VIP Bottle Service & Nightlife Ambiance
* Full bottle service delivery ceremony with illuminated VIP tray, champagne ice bucket, and **synchronized golden sparkler particle effects**.
* DJ Sound Console with synced web stream audio and venue acoustic falloff.
* VIP Booth tables and private lounge management.

### 4. Deep Business & Venue Management Tablet
* **Financial Ledger & Safe:** Real-time revenue logs, deposit/withdrawal PIN pad, and shift wages.
* **Employee Management:** Hire/fire staff, set rank tiers (Barback, Bartender, VIP Host, Lead Mixologist, Manager, Owner), and manage hourly payroll.
* **Wholesale Stock Orders:** Direct purchasing of spirits, mixers, garnishes, ice bags, and beer cases.
* **POS Cash Register Terminal:** Fast customer billing with automated bartender tip cuts.

---

## 🚀 Installation & Setup

1. Place the `helix_hospitality` folder into your FiveM server's `resources/` directory.
2. Add `ensure helix_hospitality` to your `server.cfg`.
3. *(Optional)* If using MySQL / `oxmysql`, the script will automatically create the required database tables (`helix_venues`, `helix_employees`, `helix_signature_drinks`, etc.). If running standalone without MySQL, it uses the built-in JSON file storage automatically.

---

## ⚙️ Configuration (`config.lua`)

* `Config.Framework`: `'auto'`, `'standalone'`, `'qbcore'`, `'esx'`, `'qbox'`, `'nd'`
* `Config.Inventory`: `'auto'`, `'standalone'`, `'ox_inventory'`, `'qb-inventory'`, `'ps-inventory'`
* `Config.Target`: `'auto'`, `'ox_target'`, `'qb-target'`, `'none'` (3D Prompts / Raycast)
* `Config.Storage`: `'auto'`, `'oxmysql'`, `'json'`
* `Config.Venues`: Pre-configured coordinates for **Bahama Mamas, Galaxy Superclub, Vanilla Unicorn, Tequi-la-la, and Yellow Jack Inn**.
