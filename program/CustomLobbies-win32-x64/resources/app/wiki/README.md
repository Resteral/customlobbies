# 🌴 Paradise Coast RP - Official Wiki Platform

A dedicated, modern, feature-packed Wiki and Knowledge Base single-page application built for the **Paradise Coast RP** GTA / FiveM community.

---

## ✨ Key Features

1. **📝 Full In-Browser Article Editor & Creator**:
   - Create, edit, categorize, and delete articles with zero backend setup needed.
   - Rich Markdown formatting toolbar (Headings, bold/italic, code blocks, alert boxes, tables, keybind badges, images, links).
   - Dynamic **Infobox Builder** (custom properties like Boss, Headquarters, Salary, Danger Level, etc.).
   - Live split-screen or full preview mode with instant markdown compilation.

2. **💾 LocalStorage & Portable Data Persistence**:
   - All your changes and new articles persist in browser `localStorage`.
   - **Full JSON Backup & Restore**: Export the entire wiki to `.json` with one click or import previous backups.
   - **Markdown Export**: Download individual articles directly as standard `.md` files.
   - **Reset to Seed**: Reset back to the official starter database whenever needed.

3. **🔍 Instant Global Search (Ctrl + K)**:
   - Real-time search across titles, tags, category names, full article contents, and penal codes.
   - Quick navigation shortcuts.

4. **⚡ Embedded In-Game Roleplay Tools**:
   - **⚖️ PCPD Penal Code & Sentence Calculator**: Search 20+ Paradise Coast penal codes, stack offenses with quantity counters, apply plea bargain / first-offender reductions, and copy formatted MDT arrest reports.
   - **🧪 Drug & Crafting Lab Calculator**: Select recipes (Weed, Blue Crystal Meth, Lockpicks, Thermite, Jewelry), adjust batch sizes, and see required ingredients and street profits.
   - **🗺️ Interactive Gang Turf & Territory Map**: Live map of San Andreas gang claims (Grove St, Rancho, Chamberlain, Little Seoul, Sandy Shores, Vinewood) with drug perks and influence stats.
   - **💼 Player Businesses & Services Directory**: Roster of garages (Benny's, Tuner Shop), diners (Burgershot, Pearls), casino, and real estate with pricing menus and hiring status badges.
   - **📻 Radio Frequency Directory & Scanner**: All official emergency and civilian radio channels (PCPD TAC-1, SASP, EMS, Tow, Tuner) with 1-click tune copy.
   - **🎭 Emotes & Animations Quick Reference**: Searchable catalog of 50+ FiveM RP animations with instant copy to clipboard.
   - **⌨️ Keybinds & Command Reference**: Full cheat sheet for hotkeys, radial wheels, and `/me` `/do` commands.

5. **📂 9 Pre-loaded Categories & Lore Articles**:
   - Server Rules & Core Roleplay Guidelines
   - PCPD Police Department Handbook & SOPs
   - Pillbox Hill Hospital EMS & Medical Triage
   - Underworld Drug Synthesis & Turfs
   - Bank Robbery & Heist Progression
   - Civilian Mining, Smelting & Jewelry
   - Vehicle Tuning, Dealerships & Performance Classes
   - Housing & Apartments
   - Keybinds, Radios & Slash Commands

---

## 🚀 How to Open & Use

### Option 1: Direct File
Simply open `HelixGame/wiki/index.html` in any web browser (Chrome, Edge, Firefox, Brave, Safari).

### Option 2: Local HTTP Server
Run with Python or Node:
```bash
# Using Python
cd wiki && python -m http.server 8080

# Using npx serve
npx serve wiki
```
Then navigate to `http://localhost:8080` in your browser.
