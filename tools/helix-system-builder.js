#!/usr/bin/env node
/**
 * HELIX Platform (helixgame.com UE5 Sandbox) - CLI System & Script Scaffolder
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function parseArgs() {
  const raw = process.argv.slice(2);
  if (raw.length === 0) return { command: 'help', params: [], flags: {} };

  const command = raw[0];
  const params = [];
  const flags = {};

  for (let i = 1; i < raw.length; i++) {
    const arg = raw[i];
    if (arg.startsWith('--')) {
      const [k, v] = arg.slice(2).split('=');
      flags[k] = v === undefined ? true : v;
    } else {
      params.push(arg);
    }
  }

  return { command, params, flags };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const Generators = {
  system(params, flags) {
    const name = params[0] || flags.name || 'custom_system';
    const id = name.toLowerCase().replace(/[\s-]+/g, '_');
    const title = flags.title || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    const content = `/**
 * HELIX Platform (helixgame.com) - ${title} Server Module
 */

Helix.server(async () => {
  console.log('[HELIX SERVER] Initializing ${title}...');

  const systemState = new Map();

  // Primary Server Endpoint
  Helix.endpoint('${id}Action', async (playerId, data) => {
    const { action, payload } = data || {};
    console.log(\`[${title}] Player \${playerId} performed \${action}:\`, payload);

    let state = systemState.get(playerId) || { level: 1, active: false };

    if (action === 'start') {
      state.active = true;
      systemState.set(playerId, state);
      Helix.emit('${id}StateChanged', { playerId, state });
      return { success: true, message: '${title} activated', state };
    }

    return { success: true, state };
  });

  // Background Tick Loop
  setInterval(() => {
    systemState.forEach((state, playerId) => {
      if (state.active) {
        // Continuous processing logic
      }
    });
  }, 2000);
});
`;

    const serverDir = path.join(ROOT_DIR, 'js', 'server');
    ensureDir(serverDir);
    const targetFile = path.join(serverDir, `${id}.js`);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log(`\x1b[32m✔ Created HELIX Server System:\x1b[0m js/server/${id}.js`);
  },

  station(params, flags) {
    const id = params[0] || flags.id || 'new_station';
    const name = flags.name || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const model = flags.model || 'assets/models/workbench.glb';
    const time = parseInt(flags.time || 5, 10);
    const cash = parseInt(flags.cash || 150, 10);
    const xp = parseInt(flags.xp || 30, 10);
    const rawIn = flags.in || 'raw_material:2';
    const rawOut = flags.out || 'crafted_item:1';

    const parseItems = (str) => {
      const obj = {};
      str.split(',').forEach(p => {
        const [k, v] = p.split(':');
        if (k) obj[k.trim()] = parseInt(v || 1, 10);
      });
      return JSON.stringify(obj).replace(/"/g, "'");
    };

    const code = `
HelixSystems.registerStation('${id}', {
  name: '${name}',
  category: '${flags.cat || 'Processing'}',
  model: '${model}',
  processTime: ${time},
  inputs: ${parseItems(rawIn)},
  outputs: ${parseItems(rawOut)},
  rewardCash: ${cash},
  rewardXP: ${xp},
  onComplete: (playerId, station) => {
    console.log(\`[HELIX STATION] Completed \${station.name} for \${playerId}\`);
  }
});`;

    console.log(`\n\x1b[36m--- Generated HELIX Station Definition (Add to js/server/system_engine.js) ---\x1b[0m`);
    console.log(code);

    if (flags.append) {
      const enginePath = path.join(ROOT_DIR, 'js', 'server', 'system_engine.js');
      if (fs.existsSync(enginePath)) {
        fs.appendFileSync(enginePath, '\n' + code + '\n');
        console.log(`\x1b[32m✔ Appended directly to js/server/system_engine.js\x1b[0m`);
      }
    }
  },

  client(params, flags) {
    const name = params[0] || flags.name || 'custom_hud';
    const id = name.toLowerCase().replace(/[\s-]+/g, '_');
    const key = flags.key || 'U';

    const content = `/**
 * HELIX Platform (helixgame.com) - ${name} Client Controller
 */

Helix.client(() => {
  console.log('[HELIX CLIENT] Initializing ${name} Controller...');

  const ui = new Helix.WebUI('${name}UI', 'file://ui/${id}.html');

  function setFocus(enable) {
    if (typeof Helix.Input !== 'undefined') {
      if (Helix.Input.SetMouseEnabled) Helix.Input.SetMouseEnabled(enable);
      if (Helix.Input.SetInputEnabled) Helix.Input.SetInputEnabled(!enable);
    }
  }

  // Keybind listener
  if (typeof Helix.Input !== 'undefined' && Helix.Input.OnKeyDown) {
    Helix.Input.OnKeyDown('${key}', () => {
      ui.CallEvent('toggleUI');
      setFocus(true);
    });
  }

  // Close event from WebUI
  Helix.on('Close${name}UI', () => {
    setFocus(false);
  });
});
`;

    const clientDir = path.join(ROOT_DIR, 'js', 'client');
    ensureDir(clientDir);
    const targetFile = path.join(clientDir, `${id}.js`);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log(`\x1b[32m✔ Created HELIX Client Controller:\x1b[0m js/client/${id}.js`);
  },

  ui(params, flags) {
    const name = params[0] || flags.name || 'modal';
    const id = name.toLowerCase().replace(/[\s-]+/g, '_');
    const title = flags.title || name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - HELIX WebUI</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: transparent;
      color: #fff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      user-select: none;
    }
    .card {
      background: rgba(18, 24, 38, 0.95);
      border: 1px solid rgba(59, 130, 246, 0.3);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
      border-radius: 12px;
      width: 480px;
      padding: 24px;
      backdrop-filter: blur(10px);
    }
    h2 { font-size: 1.25rem; margin-bottom: 12px; color: #60a5fa; }
    p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; }
    .btn-action {
      background: #3b82f6;
      border: none;
      color: white;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
    }
    .btn-action:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div class="card">
    <h2>${title}</h2>
    <p>Interactive HELIX UE5 In-Game Overlay.</p>
    <button class="btn-action" onclick="performAction()">Activate</button>
  </div>

  <script>
    function performAction() {
      if (typeof Helix !== 'undefined' && Helix.emit) {
        Helix.emit('${id}ActionTriggered', { timestamp: Date.now() });
      }
    }
  </script>
</body>
</html>
`;

    const uiDir = path.join(ROOT_DIR, 'ui');
    ensureDir(uiDir);
    const targetFile = path.join(uiDir, `${id}.html`);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log(`\x1b[32m✔ Created HELIX WebUI Overlay:\x1b[0m ui/${id}.html`);
  },

  help() {
    console.log(`
\x1b[35m=== HELIX Platform (helixgame.com UE5 Sandbox) Script & System Generator ===\x1b[0m

\x1b[33mCommands:\x1b[0m
  \x1b[32msystem <name> [options]\x1b[0m
    Generates a full server backend module in js/server/
    Example: node tools/helix-system-builder.js system bounty_hunting

  \x1b[32mstation <id> [options]\x1b[0m
    Generates data-driven interactive station definition
    --name="Station Name" --time=5 --cash=200 --in="iron:2" --out="gear:1" --append
    Example: node tools/helix-system-builder.js station vehicle_tuner --name="Vehicle Tuning Station" --append

  \x1b[32mclient <name> [options]\x1b[0m
    Generates client controller with WebUI & keybinding
    --key=U
    Example: node tools/helix-system-builder.js client inventory_hud --key=I

  \x1b[32mui <name> [options]\x1b[0m
    Generates WebUI HTML/CSS overlay in ui/
    Example: node tools/helix-system-builder.js ui crafting_menu --title="Forge & Craft"
`);
  }
};

const { command, params, flags } = parseArgs();
if (Generators[command]) {
  Generators[command](params, flags);
} else {
  Generators.help();
}
