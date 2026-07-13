# AetherForge UE5 | AI Game Development Engine (RevoltGPT Inspired)

**AetherForge** is a premium, cyber-themed development engine co-pilot designed to automate asset generation, PBR material creation, blueprint scripting, and full level assembly inside **Unreal Engine 5** via real-time Python compiler injection.

---

## 🌟 Key Features

1. **Autonomous AetherBot Chat**: A conversational developer agent. Ask it to "generate a gold sword", "design a dungeon dungeon room", or "create a metal texture", and it automatically re-models the item, compiles the code, and guides you through the process.
2. **LLM Inference Hub**: Swap between cloud inference models and local servers (Ollama / LM Studio) for zero-latency, private, and unlimited token generations.
3. **Interactive 2D Level Grid**: Paint floors, support columns, loot chests, and warm light markers on a visual matrix. AetherForge compiles a corresponding coordinate translation matrix instantly.
4. **Realistic 3D Web Viewport**: Preview procedurally generated realistic multi-material models (fluted granite pillars, steel rune blades, wooden iron-banded chests, flickering wall torches) directly in the browser using Three.js before committing them to Unreal.
5. **Git Commit History (Rewind)**: Git-style version control snapshots. Restore past layout iterations or mesh modifications instantly by hitting the **Rewind** clock icon.
6. **Thread-Safe UE5 Bridge**: A custom local python daemon that runs inside Unreal Engine's Slate thread, allowing you to click "Execute" in the web dashboard to instantly spawn and spawn actors in your active Unreal Editor viewport without lagging or crashing.

---

## 🚀 Setup & Execution Guide

### Step 1: Prepare Unreal Engine 5
1. Launch your Unreal Engine 5 project.
2. Go to **Edit -> Plugins** and ensure the **Python Editor Script Plugin** is enabled. Restart the editor if prompted.
3. Open the **Python Console** in Unreal:
   - Go to **Tools -> Control Panels -> Python Console** (or switch your **Output Log** prompt from *Cmd* to *Python*).

### Step 2: Launch the UE5 Bridge Server
1. Open your terminal inside the `ue5-ai-engine` directory.
2. Run the bridge server using Python:
   ```bash
   python ue5_bridge.py
   ```
   *(Note: You can copy the code inside `ue5_bridge.py` and run/paste it directly in Unreal Engine's Python log line. Running it in UE5 will spawn the listener thread and register the Slate tick callback. If run externally, it operates in a standalone Mock mode so you can test the web app standalone!)*

### Step 3: Run the AetherForge Web Dashboard
1. Spin up a local static server inside the `ue5-ai-engine` directory:
   ```bash
   python -m http.server 8000
   ```
2. Open your web browser and navigate to `http://localhost:8000`.
3. The connection status indicator in the top right should turn green and read **ONLINE**, showing a successful link with the running server.

---

## 🎮 How to Use

- **Conversational Design**: Click the **Sliders icon** next to AetherBot Chat to select local Ollama/LM Studio configurations. Type `generate a rusty sword` or `dungeon level preset` in the prompt bar and press enter.
- **Level Grid Building**: Switch to the **UE5 Level Builder** tab. Select brushes like *Floor*, *Pillar*, *Chest*, or *Light* to draw your map. A coordinate vector is compiled into python instructions in the right terminal.
- **Compiler Push**: Click **EXECUTE CODE IN UNREAL 5** to inject the current script. The actors will immediately spawn and materialize in your open Unreal Editor level!
- **Rewind Time**: Review the **Commit History** on the right side. Hover over past commits and click the **Rewind** button to load a past model or grid map instantly.
