const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

/**
 * Meshy AI 3D Model Generator for HELIX Project (Pure Node.js Version)
 * API Endpoint: https://api.meshy.ai/v2/text-to-3d
 *
 * Usage:
 *   node tools/meshy_model_generator.js --api-key msy_your_api_key_here
 */

const API_HOST = 'api.meshy.ai';

const ASSETS_TO_GENERATE = {
  weed_pot: {
    prompt: 'stylized cannabis plant growing inside a terracotta clay pot, game asset, 3d prop',
    art_style: 'realistic',
    output_filename: 'meshy_weed_pot.glb'
  },
  weed_box: {
    prompt: 'high tech hydroponic cannabis planter box with mounted grow lights and nutrient gauge, game prop',
    art_style: 'realistic',
    output_filename: 'meshy_weed_box.glb'
  },
  crypto_farm: {
    prompt: 'modular server rack crypto GPU mining rig with cooling fans and RGB LED lighting, game prop',
    art_style: 'realistic',
    output_filename: 'meshy_crypto_farm.glb'
  },
  crypto_usb: {
    prompt: 'futuristic cyberpunk USB flash drive stick with glowing blue LED screen and circuit lines, game prop',
    art_style: 'realistic',
    output_filename: 'meshy_crypto_usb.glb'
  },
  meth_lab: {
    prompt: 'chemical synthesis laboratory workstation with tubes and gas burner, game asset prop',
    art_style: 'realistic',
    output_filename: 'meshy_meth_lab.glb'
  },
  bank_vault: {
    prompt: 'heavy steel bank vault door with circular locking mechanism, game asset prop',
    art_style: 'realistic',
    output_filename: 'meshy_bank_vault.glb'
  },
  drillable_safe: {
    prompt: 'reinforced industrial floor safe with digital keypad, game asset prop',
    art_style: 'realistic',
    output_filename: 'meshy_drillable_safe.glb'
  },
  thermal_drill: {
    prompt: 'heavy industrial thermal breach drill with battery pack and hoses, game prop',
    art_style: 'realistic',
    output_filename: 'meshy_thermal_drill.glb'
  },
  hack_terminal: {
    prompt: 'cyberpunk computer security override terminal with green screen display, game prop',
    art_style: 'realistic',
    output_filename: 'meshy_hack_terminal.glb'
  },
  blackmarket_dealer: {
    prompt: 'mysterious shady black market dealer character standing in leather trenchcoat',
    art_style: 'realistic',
    output_filename: 'meshy_blackmarket_dealer.glb'
  },
  loot_bag: {
    prompt: 'heavy duffel bag overflowing with stacks of cash bills, game prop',
    art_style: 'realistic',
    output_filename: 'meshy_loot_bag.glb'
  }
};

function getApiKey() {
  const args = process.argv.slice(2);
  const keyIdx = args.indexOf('--api-key');
  if (keyIdx !== -1 && args[keyIdx + 1]) {
    return Promise.resolve(args[keyIdx + 1]);
  }
  if (process.env.MESHY_API_KEY) {
    return Promise.resolve(process.env.MESHY_API_KEY);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('\n[!] No Meshy API Key detected.\n--> Please paste your Meshy API Key here: ', (key) => {
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
          reject(e);
        }
      });
    });
    req.on('error', reject);
    if (bodyData) req.write(JSON.stringify(bodyData));
    req.end();
  });
}

async function createMeshyTask(apiKey, prompt, artStyle) {
  const options = {
    hostname: API_HOST,
    path: '/v2/text-to-3d',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await requestJSON(options, { mode: 'preview', prompt, art_style: artStyle, should_remesh: true });
    return res.result;
  } catch (e) {
    console.error(`[-] Error creating Meshy task for '${prompt}':`, e.message);
    return null;
  }
}

async function pollMeshyTask(apiKey, taskId) {
  const options = {
    hostname: API_HOST,
    path: `/v2/text-to-3d/${taskId}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}` }
  };

  while (true) {
    try {
      const res = await requestJSON(options);
      const status = res.status;
      const progress = res.progress || 0;

      console.log(`[+] Meshy Task ${taskId} Status: ${status} (${progress}%)`);

      if (status === 'SUCCEEDED') {
        return (res.model_urls || {}).glb;
      } else if (['FAILED', 'EXPIRED'].includes(status)) {
        console.error(`[-] Task ${taskId} failed.`);
        return null;
      }
    } catch (e) {
      console.error(`[-] Error polling task ${taskId}:`, e.message);
      return null;
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}

function downloadFile(url, targetPath) {
  return new Promise((resolve, reject) => {
    console.log(`[*] Downloading Meshy Model: ${url} -> ${targetPath}`);
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
  console.log(' Meshy AI 3D Model Generator (Node.js)    ');
  console.log('==========================================');

  const apiKey = await getApiKey();
  if (!apiKey) {
    console.error('[-] API key required. Exiting.');
    process.exit(1);
  }

  const outputDir = path.join(__dirname, '..', 'models_raw');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const [key, info] of Object.entries(ASSETS_TO_GENERATE)) {
    console.log(`\n[ Task ] Requesting Meshy model for '${key}'...`);
    const taskId = await createMeshyTask(apiKey, info.prompt, info.art_style);
    if (taskId) {
      const modelUrl = await pollMeshyTask(apiKey, taskId);
      if (modelUrl) {
        const targetPath = path.join(outputDir, info.output_filename);
        await downloadFile(modelUrl, targetPath);
      }
    }
  }
}

main();
