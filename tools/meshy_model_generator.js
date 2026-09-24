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
    prompt: 'photorealistic mature cannabis plant with dense trichome-covered buds in a weathered clay terracotta pot with moist soil and root details, 8k PBR textures, realistic lighting, game prop',
    art_style: 'realistic',
    output_filename: 'meshy_weed_pot.glb'
  },
  weed_box: {
    prompt: 'commercial indoor hydroponic grow station with aluminum framing, full-spectrum LED quantum board grow lights, digital nutrient pH meter, irrigation tubing, and ventilation exhaust ducting, hyper-realistic, 8k PBR',
    art_style: 'realistic',
    output_filename: 'meshy_weed_box.glb'
  },
  crypto_farm: {
    prompt: 'heavy enterprise 42U server rack loaded with NVIDIA RTX GPU mining rigs, braided high-gauge power cables, liquid cooling tubes with coolant reservoir, spinning exhaust fans, green and amber status LEDs, realistic industrial server hardware',
    art_style: 'realistic',
    output_filename: 'meshy_crypto_farm.glb'
  },
  crypto_usb: {
    prompt: 'rugged military-grade encrypted hardware crypto cold storage USB wallet with titanium casing, tiny OLED micro-display, key lanyard ring, subtle scratched metal texture, high realism',
    art_style: 'realistic',
    output_filename: 'meshy_crypto_usb.glb'
  },
  meth_lab: {
    prompt: 'underground clandestine chemistry workstation, borosilicate glass condenser distillation column, digital magnetic hotplate stirrer with heating mantle, pressure vacuum gauge, amber chemical reagent bottles, realistic glass reflections and grime',
    art_style: 'realistic',
    output_filename: 'meshy_meth_lab.glb'
  },
  bank_vault: {
    prompt: 'massive bank vault security door, brushed steel and polished chrome locking bolts, heavy-duty gear spokes, biometric keypad and mechanical dial combination lock, hydraulic hinges, realistic metallic reflections',
    art_style: 'realistic',
    output_filename: 'meshy_bank_vault.glb'
  },
  drillable_safe: {
    prompt: 'commercial fireproof steel floor safe with reinforced tungsten alloy door, electronic digital keypad, drill point indicator, industrial powder-coated gunmetal texture, scratch and wear marks',
    art_style: 'realistic',
    output_filename: 'meshy_drillable_safe.glb'
  },
  thermal_drill: {
    prompt: 'heavy industrial magnetic-clamp thermal breach drill, magnesium lance head with heat discoloration, high-pressure braided fuel hoses, portable oxygen tank backpack, rugged yellow hazard housing',
    art_style: 'realistic',
    output_filename: 'meshy_thermal_drill.glb'
  },
  hack_terminal: {
    prompt: 'rugged field cyber deck terminal in open Pelican hardcase, military LCD screen showing terminal command matrix, mechanical keypad, patch cables, antenna and exposed diagnostic circuit board',
    art_style: 'realistic',
    output_filename: 'meshy_hack_terminal.glb'
  },
  blackmarket_dealer: {
    prompt: 'tactical contraband arms dealer, dark weather-beaten utility jacket, tactical vest, watchcap, gloves, detailed cloth folds and realistic leather textures',
    art_style: 'realistic',
    output_filename: 'meshy_blackmarket_dealer.glb'
  },
  loot_bag: {
    prompt: 'heavy ballistic nylon tactical duffel bag zipped half-open showing neatly banded stacks of 100 dollar bills and gold bullion bars, realistic canvas fabric weave and metal zippers',
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

  console.log('\n[✓] All 3D models downloaded! Triggering auto-importer to assets/models/...');
  try {
    require('./auto_model_importer.js');
  } catch (err) {
    console.log('[*] Models ready in models_raw/');
  }
}

main();
