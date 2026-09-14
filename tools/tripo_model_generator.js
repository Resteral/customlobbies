const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

/**
 * Tripo 3D Model Generator for HELIX Project (Pure Node.js Version)
 * API Endpoint: https://api.tripo3d.ai/v2/openapi/task
 *
 * Requirements:
 * Requires a Tripo 3D Secret API Key (starts with tsk_...)
 * Get your API Key at: https://platform.tripo3d.ai/apiKey
 */

const API_HOST = 'api.tripo3d.ai';

const ASSETS_TO_GENERATE = {
  weed_pot: {
    prompt: 'stylized cannabis plant growing inside a terracotta clay pot, game asset, 3d prop',
    output_filename: 'tripo_weed_pot.glb'
  },
  weed_box: {
    prompt: 'high tech hydroponic cannabis planter box with mounted grow lights and nutrient gauge, game prop',
    output_filename: 'tripo_weed_box.glb'
  },
  crypto_farm: {
    prompt: 'modular server rack crypto GPU mining rig with cooling fans and RGB LED lighting, game prop',
    output_filename: 'tripo_crypto_farm.glb'
  },
  crypto_usb: {
    prompt: 'futuristic cyberpunk USB flash drive stick with glowing blue LED screen and circuit lines, game prop',
    output_filename: 'tripo_crypto_usb.glb'
  },
  meth_lab: {
    prompt: 'chemical synthesis laboratory workstation with tubes and gas burner, game asset prop',
    output_filename: 'tripo_meth_lab.glb'
  },
  bank_vault: {
    prompt: 'heavy steel bank vault door with circular locking mechanism, game asset prop',
    output_filename: 'tripo_bank_vault.glb'
  },
  drillable_safe: {
    prompt: 'reinforced industrial floor safe with digital keypad, game asset prop',
    output_filename: 'tripo_drillable_safe.glb'
  },
  thermal_drill: {
    prompt: 'heavy industrial thermal breach drill with battery pack and hoses, game prop',
    output_filename: 'tripo_thermal_drill.glb'
  },
  hack_terminal: {
    prompt: 'cyberpunk computer security override terminal with green screen display, game prop',
    output_filename: 'tripo_hack_terminal.glb'
  },
  blackmarket_dealer: {
    prompt: 'mysterious shady black market dealer character standing in leather trenchcoat',
    output_filename: 'tripo_blackmarket_dealer.glb'
  },
  loot_bag: {
    prompt: 'heavy duffel bag overflowing with stacks of cash bills, game prop',
    output_filename: 'tripo_loot_bag.glb'
  }
};

function getApiKey() {
  const args = process.argv.slice(2);
  const keyIdx = args.indexOf('--api-key');
  if (keyIdx !== -1 && args[keyIdx + 1]) {
    return Promise.resolve(args[keyIdx + 1]);
  }
  if (process.env.TRIPO_API_KEY) {
    return Promise.resolve(process.env.TRIPO_API_KEY);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('\n[!] No Tripo 3D API Key detected.\n--> Please paste your Tripo 3D Secret API Key (tsk_...): ', (key) => {
      rl.close();
      resolve(key.trim());
    });
  });
}

function requestJSON(options, bodyData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, status: res.statusCode });
        }
      });
    });
    req.on('error', reject);
    if (bodyData) req.write(JSON.stringify(bodyData));
    req.end();
  });
}

async function createTripoTask(apiKey, prompt) {
  const options = {
    hostname: API_HOST,
    path: '/v2/openapi/task',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await requestJSON(options, { type: 'text_to_model', prompt });
    if (res.code === 1002) {
      console.error(`[-] Tripo API Authentication Error: ${res.message}. Please check your Secret API Key (starts with tsk_...).`);
      return null;
    }

    if (res.code === 0 && res.data) {
      return res.data.task_id || res.data.id;
    }
    if (res.data && (res.data.task_id || res.data.id)) {
      return res.data.task_id || res.data.id;
    }
    if (res.task_id || res.id) {
      return res.task_id || res.id;
    }
  } catch (e) {
    console.error(`[-] Error creating task for '${prompt}':`, e.message);
  }
  return null;
}

async function pollTripoTask(apiKey, taskId) {
  const options = {
    hostname: API_HOST,
    path: `/v2/openapi/task/${taskId}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}` }
  };

  while (true) {
    try {
      const res = await requestJSON(options);
      const taskData = res.data || {};
      const status = taskData.status || res.status;
      const progress = taskData.progress || 0;

      console.log(`[+] Tripo Task ${taskId} Status: ${status} (${progress}%)`);

      if (status === 'success' || status === 'SUCCEEDED') {
        const output = taskData.output || taskData.result || {};
        return output.model || output.pbr_model || output.base_model;
      } else if (['failed', 'FAILED', 'cancelled'].includes(status)) {
        console.error(`[-] Task ${taskId} failed.`);
        return null;
      }
    } catch (e) {
      console.error(`[-] Error polling task ${taskId}:`, e.message);
      return null;
    }
    await new Promise(r => setTimeout(r, 4000));
  }
}

function downloadFile(url, targetPath) {
  return new Promise((resolve, reject) => {
    console.log(`[*] Downloading Tripo Model: ${url} -> ${targetPath}`);
    const file = fs.createWriteStream(targetPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`[✓] Saved ${targetPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(targetPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('==========================================');
  console.log(' Tripo 3D Model Generator (Node.js)     ');
  console.log('==========================================');

  const apiKey = await getApiKey();
  if (!apiKey) {
    console.error('[-] API key required. Exiting.');
    process.exit(1);
  }

  const outputDir = path.join(__dirname, '..', 'models_raw');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const [key, info] of Object.entries(ASSETS_TO_GENERATE)) {
    console.log(`\n[ Task ] Requesting Tripo 3D model for '${key}'...`);
    const taskId = await createTripoTask(apiKey, info.prompt);
    if (taskId) {
      const modelUrl = await pollTripoTask(apiKey, taskId);
      if (modelUrl) {
        const targetPath = path.join(outputDir, info.output_filename);
        await downloadFile(modelUrl, targetPath);
      }
    } else {
      break;
    }
  }
}

main();
