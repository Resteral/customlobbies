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
    prompt: 'photorealistic mature cannabis plant with dense trichome-covered buds in a weathered clay terracotta pot with moist soil and root details, 8k PBR textures, realistic lighting, game prop',
    output_filename: 'tripo_weed_pot.glb'
  },
  weed_box: {
    prompt: 'commercial indoor hydroponic grow station with aluminum framing, full-spectrum LED quantum board grow lights, digital nutrient pH meter, irrigation tubing, and ventilation exhaust ducting, hyper-realistic, 8k PBR',
    output_filename: 'tripo_weed_box.glb'
  },
  crypto_farm: {
    prompt: 'heavy enterprise 42U server rack loaded with NVIDIA RTX GPU mining rigs, braided high-gauge power cables, liquid cooling tubes with coolant reservoir, spinning exhaust fans, green and amber status LEDs, realistic industrial server hardware',
    output_filename: 'tripo_crypto_farm.glb'
  },
  crypto_usb: {
    prompt: 'rugged military-grade encrypted hardware crypto cold storage USB wallet with titanium casing, tiny OLED micro-display, key lanyard ring, subtle scratched metal texture, high realism',
    output_filename: 'tripo_crypto_usb.glb'
  },
  meth_lab: {
    prompt: 'underground clandestine chemistry workstation, borosilicate glass condenser distillation column, digital magnetic hotplate stirrer with heating mantle, pressure vacuum gauge, amber chemical reagent bottles, realistic glass reflections and grime',
    output_filename: 'tripo_meth_lab.glb'
  },
  bank_vault: {
    prompt: 'massive bank vault security door, brushed steel and polished chrome locking bolts, heavy-duty gear spokes, biometric keypad and mechanical dial combination lock, hydraulic hinges, realistic metallic reflections',
    output_filename: 'tripo_bank_vault.glb'
  },
  drillable_safe: {
    prompt: 'commercial fireproof steel floor safe with reinforced tungsten alloy door, electronic digital keypad, drill point indicator, industrial powder-coated gunmetal texture, scratch and wear marks',
    output_filename: 'tripo_drillable_safe.glb'
  },
  thermal_drill: {
    prompt: 'heavy industrial magnetic-clamp thermal breach drill, magnesium lance head with heat discoloration, high-pressure braided fuel hoses, portable oxygen tank backpack, rugged yellow hazard housing',
    output_filename: 'tripo_thermal_drill.glb'
  },
  hack_terminal: {
    prompt: 'rugged field cyber deck terminal in open Pelican hardcase, military LCD screen showing terminal command matrix, mechanical keypad, patch cables, antenna and exposed diagnostic circuit board',
    output_filename: 'tripo_hack_terminal.glb'
  },
  blackmarket_dealer: {
    prompt: 'tactical contraband arms dealer, dark weather-beaten utility jacket, tactical vest, watchcap, gloves, detailed cloth folds and realistic leather textures',
    output_filename: 'tripo_blackmarket_dealer.glb'
  },
  loot_bag: {
    prompt: 'heavy ballistic nylon tactical duffel bag zipped half-open showing neatly banded stacks of 100 dollar bills and gold bullion bars, realistic canvas fabric weave and metal zippers',
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
