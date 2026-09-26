/**
 * Paradise Coast RP - Default Wiki Database
 * Pre-seeded comprehensive articles, categories, penal codes, and server data.
 */

window.DEFAULT_WIKI_DATA = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  categories: [
    {
      id: "rules",
      name: "Server Rules & Guidelines",
      icon: "📜",
      color: "#f59e0b",
      description: "Official community standards, roleplay rules, NLR, RDM, VDM, and metagaming policies."
    },
    {
      id: "getting-started",
      name: "Getting Started & Guides",
      icon: "🚀",
      color: "#06b6d4",
      description: "New player onboarding, airport arrival, ID cards, phone usage, bank accounts, and basics."
    },
    {
      id: "emergency-services",
      name: "Police, EMS & Justice",
      icon: "🚓",
      color: "#3b82f6",
      description: "PCPD departments, Sheriff's Office, Hospital & EMS ranks, Court system, and Lawyers."
    },
    {
      id: "civilian-jobs",
      name: "Civilian Life & Businesses",
      icon: "💼",
      color: "#10b981",
      description: "Mining, Deep Sea Fishing, Benny's Customs, Towing, Delivery, Farming, and Player Businesses."
    },
    {
      id: "criminal-underworld",
      name: "Criminal Underworld",
      icon: "💀",
      color: "#ef4444",
      description: "Drug synthesis, bank vaults, house robberies, street racing, turfs, and Black Market."
    },
    {
      id: "vehicles-mechanics",
      name: "Vehicles & Tuning",
      icon: "🏎️",
      color: "#8b5cf6",
      description: "Dealership tiers, custom engine tuning, nitrous, drifting, impound, and vehicle classes."
    },
    {
      id: "housing-realestate",
      name: "Housing & Real Estate",
      icon: "🏡",
      color: "#ec4899",
      description: "Apartments, luxury mansions, stashes, furniture customization, and property taxes."
    },
    {
      id: "keybinds-commands",
      name: "Keybinds & Commands",
      icon: "⌨️",
      color: "#6366f1",
      description: "Complete keyboard cheat sheet, radial menus, voice channels, and chat commands."
    },
    {
      id: "lore-locations",
      name: "Server Lore & Map POIs",
      icon: "🌴",
      color: "#14b8a6",
      description: "Paradise Coast island lore, tourist spots, gang territories, secret hideouts, and landmarks."
    }
  ],
  articles: [
    {
      id: "server-rules-charter",
      slug: "server-rules-charter",
      title: "Paradise Coast RP - Core Server Rules",
      category: "rules",
      tags: ["Rules", "Core", "Mandatory", "Staff"],
      author: "Paradise Coast Staff Team",
      summary: "The definitive guide to server etiquette, roleplay standards, FearRP, NLR, VDM/RDM, and combat logging.",
      featured: true,
      pinned: true,
      updatedAt: "2026-08-28T12:00:00Z",
      infobox: {
        "Enforcement Level": "Strict Zero-Tolerance",
        "Microphone Required": "Yes (High Quality)",
        "Minimum Age": "18+ / Serious RP",
        "Ban Policy": "Warning -> 3-Day -> Permanent",
        "Discord Appeals": "ticket-appeals"
      },
      content: `# 📜 Paradise Coast RP - Core Server Rules

Welcome to **Paradise Coast Roleplay**! Our goal is to provide a premier, immersive, story-driven GTA RP experience set against the sun-soaked shores of Paradise Coast. All players must strictly abide by these rules at all times.

> [!IMPORTANT]
> Ignorance of the rules is not an excuse. Reading this charter before entering the city is mandatory.

---

## 1. Fundamental Roleplay Principles

### 1.1 Stay In Character (IC) at All Times
- You must remain in character from the moment you connect until you disconnect.
- Use of out-of-character (OOC) speech in voice is strictly prohibited. If a rule break occurs, roleplay through the scenario and submit a staff report afterwards on Discord.
- Local OOC chat (\`/ooc\`) should only be used for technical emergencies (e.g., getting scuffed or stuck).

### 1.2 Value of Life & FearRP
- You must value your character's life as you would in the real world.
- If you are held at gunpoint, outnumbered, or in an inescapable life-or-death situation, you must comply with reasonable demands.
- **Example:** Pulling a weapon while two officers have shotguns pointed at your head from 3 feet away is a direct violation of FearRP.

### 1.3 New Life Rule (NLR) & Memory Wipe
- If your character is "Downed" and bleeds out or respawns at the Hospital, you **forget the events and identities** directly leading up to your death.
- You may NOT return to the scene of your death for at least **15 minutes**.
- You may NOT seek revenge or act on information obtained during the fatal encounter.
- *Exception:* If you are revived on-scene by an EMS Paramedic, you remember the scenario unless you were shot in the head.

---

## 2. Prohibited Exploitative Behaviors

| Rule Violation | Definition | Consequence |
| :--- | :--- | :--- |
| **RDM (Random Deathmatch)** | Attacking or killing players without valid roleplay initiation and verbal dialogue. | 48-Hour Ban |
| **VDM (Vehicle Deathmatch)** | Using a motorized vehicle as a primary weapon to ram, crush, or kill players. | 48-Hour Ban |
| **Combat Logging** | Disconnecting, crashing intentionally, or closing your game during an active police chase or robbery. | 7-Day Ban |
| **Metagaming** | Using outside knowledge (Twitch streams, Discord DMs, wiki exploits) in-character. | Permanent Ban |
| **Powergaming** | Forcing actions upon others without giving them a realistic chance to react or roleplay. | Warning / Ban |

---

## 3. Hostage Taking & Criminal Caps

- **Police Pursuit Caps:** Maximum of 4 cop cruisers for standard fleeca banks; maximum of 6 for Central Pacific Bank Vault.
- **Hostage Limits:** Hostages must be actual players (not NPCs). Fake or paid hostages ("friends as hostages") are strictly disallowed.
- **Cooldowns:** Criminal crews must wait at least 45 minutes between major store/bank robberies.

> [!TIP]
> Prioritize **story and high-quality dialogue** over winning gunfights. Paradise Coast rewards creative roleplayers with custom story arcs, priority whitelisting, and business grants!`
    },
    {
      id: "pcpd-department-handbook",
      slug: "pcpd-department-handbook",
      title: "Paradise Coast Police Department (PCPD) Handbook",
      category: "emergency-services",
      tags: ["Police", "PCPD", "Law", "Whitelisted", "Handbook"],
      author: "Chief of Police J. Martinez",
      summary: "Official SOPs, patrol ranks, radio frequencies, pursuit intervention techniques (PIT), and lethal force matrix.",
      featured: true,
      pinned: false,
      updatedAt: "2026-08-28T14:30:00Z",
      infobox: {
        "Department": "PCPD & BCSO",
        "Headquarters": "Mission Row Station",
        "Primary Radio": "Frequency 1.0 (TAC-1)",
        "Application": "Whitelisted (Discord)",
        "Starting Rank": "Cadet / Officer I",
        "Starting Pay": "1,450 CL-Points / 15-min paycheck"
      },
      content: `# 🚓 Paradise Coast Police Department (PCPD) Handbook

The **Paradise Coast Police Department** is dedicated to upholding the law, protecting the citizens of the coast, and conducting fair, structured roleplay investigations.

---

## 1. Chain of Command & Ranks

\`\`\`
[CHIEF OF POLICE] ➔ [ASSISTANT CHIEF] ➔ [CAPTAIN] ➔ [LIEUTENANT]
       ➔ [SERGEANT] ➔ [SENIOR OFFICER] ➔ [OFFICER II / I] ➔ [CADET]
\`\`\`

- **Cadet:** Trainee officer. Must be paired with a Field Training Officer (FTO) at all times. Cannot initiate pursuits without approval.
- **Officer I / II:** Solo patrol certified. Authorized to carry standard issue Glock-17, Taser X26, and Flashlight.
- **Senior Officer:** Primary tactical units, eligible for K-9 division or High-Speed Interceptor (HSI) certification.
- **Sergeant & Above:** Shift supervisors, scene commanders during bank heists, and authorized to authorize PIT maneuvers.

---

## 2. Radio Frequencies

| Frequency | Channel Name | Purpose |
| :--- | :--- | :--- |
| **1.0 MHz** | Main PCPD Dispatch | General 10-41 check-ins, traffic stops, and 911 calls. |
| **2.0 MHz** | PCPD Tactical 1 | Active chases, bank robberies, and gunfights. |
| **3.0 MHz** | State Troopers / SASP | Highway patrol and air-one operations. |
| **5.0 MHz** | PCPD / EMS Interop | Cross-agency medical emergency coordination. |

---

## 3. Pursuit Protocol & Use of Force Matrix

> [!CAUTION]
> Lethal force is **strictly a last resort**. Discharging a firearm at a suspect is only authorized when a direct threat to human life exists.

1. **Code 1:** Normal driving, following traffic laws (no lights/sirens).
2. **Code 2:** Urgent response, emergency lights on, no sirens (silent arrival).
3. **Code 3:** Full emergency, lights and audible sirens activated.
4. **PIT Authorization:** Permitted only when pursuit speed drops under **80 MPH** and no innocent pedestrians are in the immediate radius. Authorization from a Sergeant+ is required.

---

## 4. Standard 10-Codes

- \`10-4\` - Acknowledged / Message Received
- \`10-8\` - In Service / Available for Calls
- \`10-7\` - Out of Service
- \`10-13\` - Officer Down (Emergency SOS)
- \`10-20\` - Current Location
- \`10-38\` - Traffic Stop
- \`10-80\` - Active Vehicle Pursuit
- \`10-99\` - Officer in Danger / Urgent Backup Required`
    },
    {
      id: "criminal-drug-synthesis-guide",
      slug: "criminal-drug-synthesis-guide",
      title: "Underworld Guide: Drug Synthesis & Turfs",
      category: "criminal-underworld",
      tags: ["Crime", "Drugs", "Weed", "Meth", "Cocaine", "Heists"],
      author: "Anonymous 'Ghost' Syndicate",
      summary: "Recipes, lab mechanics, temperature control, table setups, and corner selling hotspots across Paradise Coast.",
      featured: true,
      pinned: false,
      updatedAt: "2026-08-27T18:00:00Z",
      infobox: {
        "Risk Rating": "High (5-Star Felony)",
        "Minimum Crew": "1-3 Players",
        "Tools Needed": "Lab Beakers, Hydrochloric Acid, Pseudoephedrine",
        "Sell Mechanics": "Corner Hustle & Bulk NPC Hand-offs",
        "Average Profit": "8,000 CL-Points - 35,000 CL-Points / Batch"
      },
      content: `# 💀 Underworld Guide: Drug Synthesis & Turfs

Manufacturing and distributing contraband on Paradise Coast is a lucrative yet perilous enterprise. This guide outlines the core mechanics for cultivating and synthesizing illegal narcotics.

---

## 1. Weed Cultivation & Strains

Weed seeds can be planted in soil outdoors or cultivated in indoor hydroponic tents inside player apartments and warehouses.

### Growth Cycle:
1. **Soil Preparation:** Use *Organic Fertilizer* + *Purified Water*.
2. **Watering Schedule:** Check moisture levels every **30 minutes**. Letting moisture fall below 20% kills the plant.
3. **Harvesting:** Yields **12-16 Raw Buds** per mature plant.
4. **Processing Table:** Combine **1x Raw Bud** + **1x Rolling Paper** + **1x Ziploc Bag** ➔ **1x Bagged Kush (100% Purity)**.

---

## 2. Methamphetamine Chemistry Lab

Meth labs require mobile RVs or hidden underground industrial basements. 

> [!WARNING]
> Temperature monitoring is crucial! If lab temperature exceeds **180°C**, the cooker will explode, causing instant incapacitation and alerting PCPD Dispatch.

### Recipe Breakdown:
\`\`\`
1x Pseudoephedrine Bottle + 1x Hydrochloric Acid + 1x Red Phosphorus
  ➔ Stir for 45s (Maintain Temp between 140°C - 165°C)
  ➔ Liquid Meth Solution
  ➔ Tray Crystallization (Cooling 5 Mins)
  ➔ 8x Sky Blue Meth Bags (4,200 CL-Points/ea Street Value)
\`\`\`

---

## 3. Street Corner Distribution

- Walk into active **Gang Turfs** or populated alleyways.
- Press \`[G]\` to initiate **Corner Hustle**.
- Local NPCs will approach you. Watch out for undercover detectives or rival gang members who may attempt to rob your stash!`
    },
    {
      id: "civilian-mining-and-smelting",
      slug: "civilian-mining-and-smelting",
      title: "Civilian Career: Mining, Smelting & Jewelry",
      category: "civilian-jobs",
      tags: ["Civilian", "Jobs", "Mining", "Smelting", "Crafting", "Legal"],
      author: "Paradise Coast Department of Labor",
      summary: "How to purchase a pickaxe, mine raw ores at Davis Quartz Quarry, smelt gold/iron/copper ingots, and craft jewelry.",
      featured: false,
      pinned: false,
      updatedAt: "2026-08-26T10:15:00Z",
      infobox: {
        "Job Type": "Civilian Non-Whitelisted",
        "Location": "Davis Quartz Quarry",
        "Required Gear": "Pickaxe, Drill, Hardhat",
        "Hourly Income": "12,000 CL-Points - 22,000 CL-Points / Hour",
        "Skill Progression": "Level 1 (Rock) ➔ Level 10 (Diamonds)"
      },
      content: `# ⛏️ Civilian Career: Mining, Smelting & Jewelry

Looking for an honest, high-yield living that keeps you away from handcuffs? Mining and metallurgy is one of the foundational legal economies on Paradise Coast.

---

## Step-by-Step Starter Guide

### 1. Equipment & Location
- Head to any **Hardware Store** (Icon 🔨 on GPS).
- Purchase:
  - **1x Steel Pickaxe** (450 CL-Points) or **Heavy Duty Jackhammer** (2,200 CL-Points)
  - **1x Mining Wash Pan** (150 CL-Points)
- Drive to **Davis Quartz Quarry** located in eastern San Chianski.

---

## 2. Mining Nodes & Yields

| Ore Type | Node Rarity | Smelting Output | Value per Ingot |
| :--- | :--- | :--- | :--- |
| **Copper Ore** | Common (60%) | 2x Copper Ingots | 180 CL-Points |
| **Iron Ore** | Common (50%) | 2x Iron Ingots | 260 CL-Points |
| **Silver Ore** | Uncommon (25%) | 1x Silver Ingot | 520 CL-Points |
| **Gold Ore** | Rare (10%) | 1x Gold Bar | 1,250 CL-Points |
| **Uncut Diamond** | Ultra Rare (3%) | 1x Polished Diamond | 3,800 CL-Points |

---

## 3. Smelting & Jewelry Crafting

Take your unrefined ores to the **Industrial Foundry at Cypress Flats**:
- **Smelt Ingots:** Insert raw ore into the furnace. Requires 1x Coal per smelt.
- **Jewelry Bench:** Combine \`1x Gold Bar + 1x Polished Diamond\` ➔ **Diamond Ring** (5,500 CL-Points at Vangelico Wholesale).`
    },
    {
      id: "server-keybinds-and-commands",
      slug: "server-keybinds-and-commands",
      title: "Keybinds, Radial Menus & Slash Commands",
      category: "keybinds-commands",
      tags: ["Controls", "Keybinds", "Commands", "Quickstart"],
      author: "Paradise Coast Tech Team",
      summary: "Complete reference for default hotkeys, radial wheel, inventory, animations, voice distance, and player commands.",
      featured: true,
      pinned: true,
      updatedAt: "2026-08-28T15:00:00Z",
      infobox: {
        "Default Framework": "Qbox / Ox / Helix Core",
        "Inventory Key": "TAB / F2",
        "Voice Key": "N (Push to Talk)",
        "Radial Menu": "F1 / Extra Mouse Button",
        "Phone Hotkey": "M / Arrow UP"
      },
      content: `# ⌨️ Keybinds, Radial Menus & Slash Commands

Master your controls to react quickly in high-stakes scenarios on Paradise Coast RP.

---

## 1. Essential Hotkey Reference

| Keybind | Action | Description |
| :--- | :--- | :--- |
| \`[TAB]\` or \`[F2]\` | **Open Inventory** | View your pockets, backpack, weapon slots, and hotbar. |
| \`[F1]\` | **Radial Wheel** | Quick access to vehicle controls, citizen interactions, and emotes. |
| \`[M]\` or \`[UP ARROW]\` | **Smartphone** | Open your smartphone (Twitter, Banking, Messages, Camera). |
| \`[N]\` | **Push to Talk** | Transmit in-game proximity voice. |
| \`[CAPS LOCK]\` | **Radio PTT** | Push-to-talk for Police/EMS and handheld walkie-talkies. |
| \`[Z]\` | **Voice Distance** | Cycle voice range (Whisper: 1.5m ➔ Normal: 5m ➔ Shout: 15m). |
| \`[K]\` | **Seatbelt** | Fasten or unfasten vehicle seatbelt (prevents ejection). |
| \`[X]\` | **Hands Up** | Surrender / raise hands above head. |
| \`[B]\` | **Point Finger** | Point with your right hand. |
| \`[L]\` | **Vehicle Locks** | Lock / unlock owned vehicles remotely. |

---

## 2. Essential Slash Commands

- \`/me [action]\` - Describes an in-character physical action (e.g., \`/me checks suspect's pulse with two fingers\`).
- \`/do [description]\` - Describes ambient environment or answers another player's roleplay inquiry (e.g., \`/do A strong smell of alcohol is noticeable\`).
- \`/ooc [message]\` - Global Out of Character message (use sparingly).
- \`/givecarkeys [id]\` - Hand your vehicle keys to a nearby player.
- \`/e [emote]\` - Play a specific animation (e.g., \`/e smoke\`, \`/e sit\`, \`/e lean\`).
- \`/emotemenu\` - Open full 800+ animation & prop catalog.
- \`/report [reason]\` - Submit a ticket to active staff moderators.`
    },
    {
      id: "emergency-ems-medical-sop",
      slug: "emergency-ems-medical-sop",
      title: "Paradise Coast Medical & EMS Protocols",
      category: "emergency-services",
      tags: ["EMS", "Hospital", "Medical", "Doctors", "SOP"],
      author: "Chief Medical Officer Dr. Evelyn Vance",
      summary: "Triage guidelines, medical treatments, surgery procedures, prescription drugs, and stretcher transport.",
      featured: false,
      pinned: false,
      updatedAt: "2026-08-25T11:20:00Z",
      infobox: {
        "Hospital Facility": "Pillbox Hill Medical Center",
        "Primary Radio": "Frequency 4.0 (EMS-1)",
        "Call Dispatch": "911 / 311",
        "Application": "Whitelisted (Discord)",
        "Standard Equipment": "Medkit, Defibrillator, Morphine, Bandages"
      },
      content: `# 🚑 Paradise Coast Medical & EMS Protocols

Paramedics and Doctors at **Pillbox Hill Medical Center** provide around-the-clock emergency medical response and life-saving trauma care.

---

## 1. Triage Priority System

When arriving at mass-casualty incidents (such as shootout scenes or highway multi-car crashes), use the standard **START Triage System**:

1. **🔴 RED (Immediate):** Critical life-threatening injuries (severe bleeding, flatlining pulse, gunshot wound to chest). Treat within 2 minutes.
2. **🟡 YELLOW (Delayed):** Serious injuries but stable (broken limbs, moderate blood loss, concussion).
3. **🟢 GREEN (Minor):** Walking wounded (cuts, minor bruises, mild sprains).
4. **⚫ BLACK (Deceased):** Unresponsive, no pulse, decapitation or massive trauma incompatible with life (declare 10-79).

---

## 2. Standard Field Treatments

| Injury | Field Treatment Procedure | Item Required |
| :--- | :--- | :--- |
| **Bleeding Arteries** | Apply pressure, wrap sterile gauze tourniquet. | \`1x Tourniquet + 2x Bandage\` |
| **Cardiac Arrest** | Apply defibrillator pads, deliver 200J shock, begin CPR. | \`1x Defibrillator\` |
| **Bone Fracture** | Set bone, immobilize with padded splint. | \`1x Medical Splint\` |
| **Burn Trauma** | Apply cooling saline compress and burn ointment. | \`1x Burn Cream\` |`
    },
    {
      id: "heist-mechanics-vault-fleeca",
      slug: "heist-mechanics-vault-fleeca",
      title: "Bank Robbery & Heist Progression Guide",
      category: "criminal-underworld",
      tags: ["Heists", "Fleeca", "Paleto", "Vault", "Hacking", "Thermite"],
      author: "Anonymous 'Ghost' Syndicate",
      summary: "Progression tier list from 24/7 stores to Fleeca Branches, Paleto Bay, and Central Pacific Vault.",
      featured: true,
      pinned: false,
      updatedAt: "2026-08-28T09:00:00Z",
      infobox: {
        "Progression Tier": "Tier 1 (Store) ➔ Tier 4 (Vault)",
        "Minimum Police": "2 to 6 PCPD Officers",
        "Required Gear": "Lockpicks, Laptop, Thermite, Drill",
        "Reward Range": "15,000 CL-Points - 350,000 CL-Points Black Market Rep",
        "Cooldown": "45 Mins - 2 Hours"
      },
      content: `# 🏦 Bank Robbery & Heist Progression Guide

Executing heists in Paradise Coast requires careful preparation, the right tools, and tight coordination.

---

## 1. Heist Tier Progression

\`\`\`
[TIER 1: 24/7 Convenience Store] ➔ [TIER 2: Fleeca Bank Branches]
       ➔ [TIER 3: Paleto Bay Savings] ➔ [TIER 4: Central Pacific Vault]
\`\`\`

---

## 2. Equipment Matrix

| Heist Target | Min Police Online | Key Requirements | Typical Payout |
| :--- | :--- | :--- | :--- |
| **24/7 & Gas Stations** | 2 PCPD | 1x Standard Lockpick + Threat Weapon | 1,500 CL-Points - 3,500 CL-Points + Register Items |
| **Fleeca Bank** | 3 PCPD | 1x Green Crypto Laptop + 1x Thermite Charge | 25,000 CL-Points - 45,000 CL-Points Black Market Rep + Gold Bars |
| **Paleto Savings Bank** | 4 PCPD | 1x Blue Hacking USB + 2x Thermite + Drill | 75,000 CL-Points - 130,000 CL-Points Black Market Rep + Rare Gems |
| **Central Pacific Vault** | 6 PCPD | 1x Red Military Cryptor + 4x Thermite + Laser | 250,000 CL-Points - 500,000 CL-Points Black Market Rep + Crypto Drives |

---

## 3. Mini-game Guide

- **Thermite Melting:** Connect sequential circuit paths without letting the heat gauge reach red.
- **Laptop Cryptography:** Identify matching memory sequences before the 20-second countdown expires.
- **Laser Vault Drilling:** Keep temperature balanced inside the green threshold to avoid snapping drill bits.`
    },
    {
      id: "vehicles-tuning-customs-guide",
      slug: "vehicles-tuning-customs-guide",
      title: "Vehicle Tuning, Performance Upgrades & Dealerships",
      category: "vehicles-mechanics",
      tags: ["Vehicles", "Tuning", "Cars", "Benny's", "Racing", "Drifting"],
      author: "Benny's Original Motor Works",
      summary: "Engine swap ratings, turbochargers, drift kits, cosmetic bodykits, insurance claims, and vehicle classes.",
      featured: false,
      pinned: false,
      updatedAt: "2026-08-27T16:45:00Z",
      infobox: {
        "Custom Shops": "Benny's, Los Santos Customs, Tuner Shop",
        "Vehicle Classes": "D / C / B / A / S / S+ Tier",
        "Insurance Rate": "2.5% of Vehicle MSRP / Month",
        "Drift Handling": "Available at Tuner Shop",
        "Nitrous Boost": "100 Shot / 200 Shot Purge Bottles"
      },
      content: `# 🏎️ Vehicle Tuning, Performance Upgrades & Dealerships

Whether you are hitting top speed down the Del Perro Freeway or drifting through the Vinewood Hills, your vehicle is your lifeline on Paradise Coast.

---

## 1. Performance Upgrade Hierarchy

1. **Engine Upgrades (Levels 1 - 4):** Increases base torque and horsepower.
2. **Transmission (Levels 1 - 3):** Reduces gear shift latency and improves acceleration curves.
3. **Brakes (Street, Sport, Race):** Decreases stopping distance and brake fade during high-speed police chases.
4. **Turbocharger:** Adds massive low-end torque boost and signature spool blow-off sound.
5. **Suspension Lowering:** Lowers center of gravity, significantly improving cornering stability.

---

## 2. Vehicle Class Performance Tiers

- **S+ Tier (Supercars):** Pegassi Ignus, Grotti Turismo R, Pfister Neon.
- **A Tier (Sports & Muscle):** Bravado Gauntlet Hellfire, Annis Elegy RH8, Ubermacht Sentinel Classic.
- **B Tier (Sedans & Coupes):** Karin Sultan, Dinka Blista Kanjo, Vapid Dominator.
- **C / D Tier (Compact & Utility):** Weeny Issi, Declasse Rhapsody, Albany Emperor.`
    },
    {
      id: "housing-apartments-and-real-estate",
      slug: "housing-apartments-and-real-estate",
      title: "Housing, Apartments & Interior Decorating",
      category: "housing-realestate",
      tags: ["Housing", "Real Estate", "Apartments", "Mansions", "Furniture"],
      author: "Dynasty 8 Real Estate",
      summary: "How to purchase apartments, upgrade personal stashes, share property keys with roommates, and place custom furniture.",
      featured: false,
      pinned: false,
      updatedAt: "2026-08-25T14:10:00Z",
      infobox: {
        "Agency": "Dynasty 8 Realty",
        "Entry Apartment": "Free on Arrival (Alta St)",
        "Stash Weight": "250kg ➔ 2,000kg (Upgradable)",
        "Key Sharing": "Up to 5 Co-owners",
        "Decoration": "Full 3D Free-cam Furniture Placement"
      },
      content: `# 🏡 Housing, Apartments & Interior Decorating

Every citizen on Paradise Coast is entitled to personal sanctuary. Secure your stash, invite friends, and design your dream aesthetic.

---

## 1. Apartment Starter System
Upon landing at the Los Santos International Airport, every new resident receives access to an **Alta Street Starter Apartment** with:
- **1x Personal Wardrobe** (Save and switch custom outfits).
- **1x Secure Stash** (250 KG base storage capacity).
- **1x Safehouse Spawn Point**.

---

## 2. Purchasing Real Estate through Dynasty 8
- Meet with an in-game **Dynasty 8 Real Estate Agent**.
- Choose between pre-furnished modern lofts, beachside villas in Del Perro, or secluded cabins in Paleto Bay.
- Set up automated mortgage auto-debits to avoid foreclosure!`
    }
  ],
  penalCodes: [
    { code: "PC-101", title: "Speeding (15-30 MPH over limit)", category: "Traffic", fine: 250, jailMonths: 0, points: 2, severity: "Infraction" },
    { code: "PC-102", title: "Reckless Driving & Endangerment", category: "Traffic", fine: 750, jailMonths: 5, points: 4, severity: "Misdemeanor" },
    { code: "PC-103", title: "Driving Under the Influence (DUI)", category: "Traffic", fine: 1200, jailMonths: 10, points: 6, severity: "Misdemeanor" },
    { code: "PC-104", title: "Evading Law Enforcement in Motor Vehicle", category: "Traffic", fine: 2500, jailMonths: 15, points: 6, severity: "Felony" },
    { code: "PC-201", title: "Petty Theft (Under 2,000 CL-Points)", category: "Theft", fine: 500, jailMonths: 5, points: 0, severity: "Misdemeanor" },
    { code: "PC-202", title: "Grand Theft Auto (Vehicle Theft)", category: "Theft", fine: 2000, jailMonths: 15, points: 0, severity: "Felony" },
    { code: "PC-203", title: "Armed Robbery of Commercial Business (24/7 / Gas Station)", category: "Robbery", fine: 4500, jailMonths: 25, points: 0, severity: "Felony" },
    { code: "PC-204", title: "Armed Robbery of Financial Institution (Fleeca / Bank)", category: "Robbery", fine: 8500, jailMonths: 40, points: 0, severity: "Class A Felony" },
    { code: "PC-205", title: "Heist of Central Pacific Federal Vault", category: "Robbery", fine: 25000, jailMonths: 75, points: 0, severity: "Capital Felony" },
    { code: "PC-301", title: "Possession of Class B Controlled Substance (Weed/Shrooms)", category: "Narcotics", fine: 750, jailMonths: 5, points: 0, severity: "Misdemeanor" },
    { code: "PC-302", title: "Possession with Intent to Distribute (Class A/B)", category: "Narcotics", fine: 3500, jailMonths: 20, points: 0, severity: "Felony" },
    { code: "PC-303", title: "Manufacturing / Chemical Synthesis of Class A Narcotics (Meth/Coke)", category: "Narcotics", fine: 12000, jailMonths: 45, points: 0, severity: "Class A Felony" },
    { code: "PC-401", title: "Carrying Concealed Firearm without Valid CCW", category: "Weapons", fine: 1500, jailMonths: 10, points: 0, severity: "Misdemeanor" },
    { code: "PC-402", title: "Possession of Illegal Class 2 Automatic Firearm / SMG", category: "Weapons", fine: 6000, jailMonths: 30, points: 0, severity: "Felony" },
    { code: "PC-403", title: "Trafficking of Military Grade Firearms / Explosives", category: "Weapons", fine: 18000, jailMonths: 60, points: 0, severity: "Class A Felony" },
    { code: "PC-501", title: "Assault with a Deadly Weapon (Civilian)", category: "Violent Crime", fine: 5000, jailMonths: 30, points: 0, severity: "Felony" },
    { code: "PC-502", title: "Attempted Murder of a Peace Officer / First Responder", category: "Violent Crime", fine: 15000, jailMonths: 60, points: 0, severity: "Class A Felony" },
    { code: "PC-503", title: "First Degree Premeditated Murder", category: "Violent Crime", fine: 35000, jailMonths: 120, points: 0, severity: "Capital Felony" },
    { code: "PC-601", title: "Kidnapping / False Imprisonment / Hostage Taking", category: "Violent Crime", fine: 7500, jailMonths: 35, points: 0, severity: "Felony" },
    { code: "PC-602", title: "Obstruction of Justice & Resisting Arrest", category: "Public Order", fine: 1000, jailMonths: 10, points: 0, severity: "Misdemeanor" }
  ],
  craftingRecipes: [
    {
      id: "weed-bag",
      name: "Bagged Kush",
      category: "Narcotics",
      inputs: [{ item: "Raw Weed Bud", qty: 1 }, { item: "Ziploc Bags", qty: 1 }, { item: "Rolling Papers", qty: 1 }],
      output: { item: "Bagged Kush", qty: 1 },
      craftTimeSec: 5,
      sellPrice: 350,
      tools: ["Scales", "Rolling Tray"]
    },
    {
      id: "meth-pure",
      name: "Blue Crystal Meth",
      category: "Narcotics",
      inputs: [{ item: "Pseudoephedrine", qty: 2 }, { item: "Hydrochloric Acid", qty: 1 }, { item: "Red Phosphorus", qty: 1 }],
      output: { item: "Blue Crystal Meth Bag", qty: 4 },
      craftTimeSec: 45,
      sellPrice: 4200,
      tools: ["Meth Cooking Flask", "Thermometer"]
    },
    {
      id: "lockpick-adv",
      name: "Advanced Lockpick",
      category: "Tools & Heists",
      inputs: [{ item: "Steel Ingot", qty: 2 }, { item: "Spring Wire", qty: 3 }, { item: "Rubber Grip", qty: 1 }],
      output: { item: "Advanced Lockpick", qty: 1 },
      craftTimeSec: 15,
      sellPrice: 850,
      tools: ["Workbench", "File Tool"]
    },
    {
      id: "thermite-charge",
      name: "Thermite Bomb Charge",
      category: "Tools & Heists",
      inputs: [{ item: "Aluminum Powder", qty: 4 }, { item: "Iron Oxide (Rust)", qty: 4 }, { item: "Electronic Detonator", qty: 1 }],
      output: { item: "Thermite Charge", qty: 1 },
      craftTimeSec: 30,
      sellPrice: 6500,
      tools: ["Chemistry Station"]
    },
    {
      id: "diamond-ring",
      name: "Luxury Diamond Ring",
      category: "Civilian Jewelry",
      inputs: [{ item: "Gold Bar", qty: 1 }, { item: "Polished Diamond", qty: 1 }],
      output: { item: "Luxury Diamond Ring", qty: 1 },
      craftTimeSec: 20,
      sellPrice: 5500,
      tools: ["Jewelry Bench"]
    }
  ],
  turfs: [
    {
      id: "grove-st",
      name: "Grove Street Cul-de-Sac",
      zone: "Davis / South LS",
      controllingFaction: "Families Syndicate",
      color: "#22c55e",
      influence: 88,
      drugBonus: "+25% Weed Selling Speed & Price",
      description: "Historic heart of Davis. Heavy Families presence, high foot traffic for green sales.",
      coordinates: { x: 55, y: 78 }
    },
    {
      id: "rancho",
      name: "Rancho Projects",
      zone: "Rancho / East LS",
      controllingFaction: "Vagos Cartel",
      color: "#eab308",
      influence: 75,
      drugBonus: "+20% Cocaine Street Margins",
      description: "Industrial apartment complexes, fortified alleys, and active lookout posts.",
      coordinates: { x: 68, y: 72 }
    },
    {
      id: "chamberlain",
      name: "Chamberlain Hills 60s",
      zone: "Chamberlain / South LS",
      controllingFaction: "Ballas Gang",
      color: "#a855f7",
      influence: 92,
      drugBonus: "+30% Methamphetamine Price",
      description: "Dense residential block near Strawberry station. Heavily patrolled by purple flags.",
      coordinates: { x: 48, y: 70 }
    },
    {
      id: "little-seoul",
      name: "Little Seoul Plaza",
      zone: "Little Seoul / Central",
      controllingFaction: "Seoul Syndicate",
      color: "#06b6d4",
      influence: 65,
      drugBonus: "+15% Oxy & Pill Bulk Trade",
      description: "High-density urban market with hidden backroom gambling dens.",
      coordinates: { x: 42, y: 55 }
    },
    {
      id: "sandy-shores",
      name: "Sandy Shores Trailer Park",
      zone: "Grand Senora Desert",
      controllingFaction: "Lost MC",
      color: "#f97316",
      influence: 80,
      drugBonus: "+35% Moonshine & Meth RV Cook Yield",
      description: "Desert badlands, biker clubhouse, and unregulated off-grid chemical cooking.",
      coordinates: { x: 52, y: 35 }
    },
    {
      id: "vinewood",
      name: "Vinewood Luxury Hills",
      zone: "Vinewood / North LS",
      controllingFaction: "Contested / Neutral",
      color: "#ec4899",
      influence: 40,
      drugBonus: "+40% High-Purity Drug Payout to Elites",
      description: "Mansion district with wealthy buyers. High PCPD response times.",
      coordinates: { x: 50, y: 45 }
    }
  ],
  businesses: [
    {
      id: "bennys-customs",
      name: "Benny's Original Motor Works",
      category: "Mechanic & Tuning",
      icon: "🔧",
      owner: "Jaxson 'Jax' Vance",
      location: "Strawberry Ave, Davis",
      hiring: true,
      description: "Premier custom automotive workshop offering engine swaps, turbochargers, widebody kits, and nitro purge.",
      services: [
        { name: "Full Performance Tune-Up", price: "4,500 CL-Points" },
        { name: "Turbo Installation", price: "12,500 CL-Points" },
        { name: "Custom Widebody Conversion", price: "18,000 CL-Points" },
        { name: "Vehicle Armor Plating (Tier 1)", price: "8,000 CL-Points" }
      ]
    },
    {
      id: "burgershot",
      name: "Burger Shot Del Perro",
      category: "Food & Hospitality",
      icon: "🍔",
      owner: "Chloe Martinez",
      location: "Del Perro Pier",
      hiring: true,
      description: "Fast food diner supplying hunger/thirst replenishment, Bleeder burgers, and Heart Stopper combos with stamina buffs.",
      services: [
        { name: "The Bleeder Burger Combo", price: "45 CL-Points" },
        { name: "Moneyshot Giant Burger", price: "65 CL-Points" },
        { name: "Torpedo Sub & Large Cola", price: "50 CL-Points" }
      ]
    },
    {
      id: "diamond-casino",
      name: "Diamond Casino & Resort",
      category: "Entertainment & Gaming",
      icon: "🎰",
      owner: "State Enterprise / Board of Directors",
      location: "Vinewood Park Drive",
      hiring: false,
      description: "High-stakes blackjack, roulette, three-card poker, daily lucky wheel spins, and penthouse suites.",
      services: [
        { name: "VIP Casino Membership Card", price: "2,500 CL-Points" },
        { name: "High-Roller Penthouse Suite", price: "250,000 CL-Points" },
        { name: "Lucky Wheel Spin", price: "Free (1x Daily)" }
      ]
    },
    {
      id: "dynasty8-realty",
      name: "Dynasty 8 Real Estate",
      category: "Property & Construction",
      icon: "🏡",
      owner: "Victoria Sterling",
      location: "Rockford Hills",
      hiring: true,
      description: "Licensed property broker for suburban houses, beach villas, luxury penthouses, stashes, and warehouse compounds.",
      services: [
        { name: "Alta St Starter Apartment (Free)", price: "0 CL-Points" },
        { name: "Del Perro Modern Beach Condo", price: "85,000 CL-Points" },
        { name: "Vinewood Hills Mansion Compound", price: "450,000 CL-Points" },
        { name: "Industrial Stash Warehouse", price: "120,000 CL-Points" }
      ]
    },
    {
      id: "pearls-seafood",
      name: "Pearl's Oceanview Seafood",
      category: "Food & Hospitality",
      icon: "🦞",
      owner: "Captain Marcus Cole",
      location: "La Puerta Marina",
      hiring: true,
      description: "Fresh ocean catch restaurant buying high-grade tuna, salmon, and crabs from local civilian deep sea fishermen.",
      services: [
        { name: "Wholesale Fish Buyback (Per KG)", price: "120 CL-Points - 450 CL-Points" },
        { name: "Lobster Thermidor Platter", price: "95 CL-Points" },
        { name: "Deep Sea Fishing Bait & Tackle Box", price: "150 CL-Points" }
      ]
    }
  ],
  radioFrequencies: [
    { freq: "1.0", name: "PCPD Primary Dispatch", agency: "Police", desc: "10-41 check-ins, general patrol, and 911 callouts" },
    { freq: "2.0", name: "PCPD Tactical 1 (TAC-1)", agency: "Police", desc: "Active vehicle pursuits (10-80), bank robberies, and active shootouts" },
    { freq: "3.0", name: "SASP / State Troopers", agency: "State Police", desc: "Highway patrol, radar speed traps, and Air-1 aviation" },
    { freq: "4.0", name: "Pillbox Hospital & EMS", agency: "EMS / Medical", desc: "Paramedic medical dispatch, trauma triage, and ICU transport" },
    { freq: "5.0", name: "Inter-Agency Joint Comms", agency: "PCPD / EMS / DOJ", desc: "Coordinated tactical operations and disaster response" },
    { freq: "10.0", name: "Benny's Towing & Roadside", agency: "Civilian / Mechanic", desc: "Tow dispatch, impound requests, and roadside vehicle repairs" },
    { freq: "15.0", name: "Paradise City Taxi & Transit", agency: "Civilian", desc: "Passenger ride hailing and logistics dispatch" },
    { freq: "99.1", name: "Underground Tuner Race Comms", agency: "Underworld", desc: "Street race checkpoints, spotters, and PCPD scanner alerts" }
  ],
  emotes: [
    { cmd: "/e smoke", name: "Smoke Cigarette", cat: "General", prop: "Cigarette" },
    { cmd: "/e phonecall", name: "Phone Call to Ear", cat: "General", prop: "Smartphone" },
    { cmd: "/e lean", name: "Lean Against Wall", cat: "Idle", prop: "None" },
    { cmd: "/e sit", name: "Sit on Ground / Chair", cat: "Idle", prop: "None" },
    { cmd: "/e crossarms", name: "Cross Arms", cat: "Stance", prop: "None" },
    { cmd: "/e handsup", name: "Hands in the Air", cat: "Surrender", prop: "None" },
    { cmd: "/e surrender", name: "Kneel with Hands on Head", cat: "Surrender", prop: "None" },
    { cmd: "/e notepad", name: "Take Notes / Clipboard", cat: "Police & Job", prop: "Clipboard & Pen" },
    { cmd: "/e cpr", name: "Perform CPR Chest Compressions", cat: "EMS / Medical", prop: "None" },
    { cmd: "/e mechanic", name: "Inspect & Fix Engine", cat: "Mechanic", prop: "Wrench" },
    { cmd: "/e coffee", name: "Drink Hot Coffee", cat: "Consumable", prop: "Coffee Mug" },
    { cmd: "/e beer", name: "Drink Cold Beer", cat: "Consumable", prop: "Beer Bottle" },
    { cmd: "/e guard", name: "Security Guard Stance", cat: "Stance", prop: "Earpiece" },
    { cmd: "/e radio", name: "Speak into Shoulder Mic", cat: "Police & EMS", prop: "Radio Mic" },
    { cmd: "/e drill", name: "Heavy Laser Drill Vault", cat: "Crime", prop: "Laser Drill" },
    { cmd: "/e binos", name: "Look Through Binoculars", cat: "Tactical", prop: "Binoculars" }
  ]
};

