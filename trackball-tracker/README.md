# 🎯 Logitech Trackball Direction Tracker & Button HUD

A high-performance, stream-ready visualizer overlay designed for Logitech trackball users (MX Ergo, Ergo M575, Trackman Marble, etc.). Viewers on your stream can see your real-time aiming direction vector, 3D trackball rotation, and button clicks (LMB, RMB, MMB, Mouse 4/5, DPI precision toggle, scroll wheel spin) live on stream!

---

## 🌟 Key Features

1. **3D WebGL Logitech Trackball Renderer (Three.js)**:
   - Realistic 3D trackball sphere that rolls and spins dynamically around $(X,Y,Z)$ axes matching your physical trackball movement.
   - Built-in finishes: *Logitech MX Ergo Red*, *Ergo M575 Sapphire Blue*, *Trackman Marble Ruby*, *Matte Stealth Black*, and *Cyberpunk RGB Energy Mesh*.

2. **2D Aim Vector Radar & Reticle**:
   - Live 360° directional arrow, cardinal angle readout (N, NE, E, SE, S, SW, W, NW), speed gauges, and smooth motion particle trails.

3. **Real-Time Logitech Button Click HUD**:
   - Ergonomic Logitech trackball diagram displaying clicks in real-time.
   - Click feedback for:
     - **Left Click (LMB)** & **Right Click (RMB)**
     - **Middle Mouse Click (MMB)**
     - **Side Buttons**: Mouse 4 (Back) & Mouse 5 (Forward)
     - **Precision DPI Target Button**
     - **Scroll Wheel**: Visual up/down spin pulse arrows
   - Animated ripple rings emitting from clicked buttons.

4. **Zero-Lag Win32 Global Mouse Hook**:
   - Captures system-wide trackball movements and clicks even when playing games full-screen.

5. **OBS Studio & Streamlabs Ready**:
   - Native transparent background support (`bg=transparent`) for seamless stream embedding.
   - Custom color themes: *Logitech Blue*, *Cyberpunk Cyan*, *Crimson Ruby*, *Razer Green*, and *Deep Purple*.

---

## 🚀 Quick Start Guide

### 1. Launch the Server
Double-click [`start.bat`](file:///c:/Users/Sean/Documents/Downloads/HelixGame/trackball-tracker/start.bat) or run in terminal:
```cmd
py server.py
```
This starts the background mouse hook and opens the streamer control dashboard at `http://localhost:8765`.

### 2. Add to OBS Studio / Streamlabs
1. In OBS Studio, add a new **Browser Source**.
2. Set the URL to:
   ```
   http://localhost:8765/?mode=overlay&bg=transparent
   ```
3. Set **Width**: `1000` and **Height**: `400` (or adjust to fit your layout).
4. Check **"Shutdown source when not visible"** if desired.

---

## 🎮 Browser Preview Mode (Standalone)
You can test the overlay without running `server.py`:
1. Open `http://localhost:8765` or open `index.html` directly in your browser.
2. Click **"Lock Pointer Test"** inside the browser to test ball rolling, direction vectors, and button click HUD in browser fallback mode.
