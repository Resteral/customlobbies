import os
import sys
import json
import urllib.request
import urllib.parse
import time
import argparse

"""
Meshy AI 3D Model Generator for Helix Game Mod
API Endpoint: https://api.meshy.ai/v2/text-to-3d

Usage:
  python tools/meshy_model_generator.py --api-key msy_your_api_key_here
"""

API_URL = "https://api.meshy.ai/v2/text-to-3d"

ASSETS_TO_GENERATE = {
    "weed_pot": {
        "prompt": "stylized cannabis plant growing inside a terracotta clay pot, game asset, 3d prop",
        "art_style": "realistic",
        "output_filename": "meshy_weed_pot.glb"
    },
    "weed_box": {
        "prompt": "high tech hydroponic cannabis planter box with mounted grow lights and nutrient gauge, game prop",
        "art_style": "realistic",
        "output_filename": "meshy_weed_box.glb"
    },
    "crypto_farm": {
        "prompt": "modular server rack crypto GPU mining rig with cooling fans and RGB LED lighting, game prop",
        "art_style": "realistic",
        "output_filename": "meshy_crypto_farm.glb"
    },
    "crypto_usb": {
        "prompt": "futuristic cyberpunk USB flash drive stick with glowing blue LED screen and circuit lines, game prop",
        "art_style": "realistic",
        "output_filename": "meshy_crypto_usb.glb"
    },
    "meth_lab": {
        "prompt": "chemical synthesis laboratory workstation with tubes and gas burner, game asset prop",
        "art_style": "realistic",
        "output_filename": "meshy_meth_lab.glb"
    },
    "bank_vault": {
        "prompt": "heavy steel bank vault door with circular locking mechanism, game asset prop",
        "art_style": "realistic",
        "output_filename": "meshy_bank_vault.glb"
    },
    "drillable_safe": {
        "prompt": "reinforced industrial floor safe with digital keypad, game asset prop",
        "art_style": "realistic",
        "output_filename": "meshy_drillable_safe.glb"
    },
    "thermal_drill": {
        "prompt": "heavy industrial thermal breach drill with battery pack and hoses, game prop",
        "art_style": "realistic",
        "output_filename": "meshy_thermal_drill.glb"
    },
    "hack_terminal": {
        "prompt": "cyberpunk computer security override terminal with green screen display, game prop",
        "art_style": "realistic",
        "output_filename": "meshy_hack_terminal.glb"
    },
    "blackmarket_npc": {
        "prompt": "mysterious shady black market dealer character standing in leather trenchcoat",
        "art_style": "realistic",
        "output_filename": "meshy_blackmarket_dealer.glb"
    },
    "loot_bag": {
        "prompt": "heavy duffel bag overflowing with stacks of cash bills, game prop",
        "art_style": "realistic",
        "output_filename": "meshy_loot_bag.glb"
    }
}

def get_api_key():
    parser = argparse.ArgumentParser(description="Meshy AI 3D Model Generator for Helix")
    parser.add_argument("--api-key", help="Your Meshy API Key")
    args, _ = parser.parse_known_args()

    if args.api_key:
        return args.api_key

    env_key = os.environ.get("MESHY_API_KEY")
    if env_key:
        return env_key

    print("\n[!] No Meshy API Key detected.")
    key = input("--> Please paste your Meshy API Key here: ").strip()
    return key

def create_task(api_key, prompt, art_style="realistic"):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "mode": "preview",
        "prompt": prompt,
        "art_style": art_style,
        "should_remesh": True
    }

    req = urllib.request.Request(API_URL, data=json.dumps(payload).encode('utf-8'), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get("result")
    except Exception as e:
        print(f"[-] Error creating task for prompt '{prompt}': {e}")
        return None

def poll_task(api_key, task_id):
    headers = {"Authorization": f"Bearer {api_key}"}
    req = urllib.request.Request(f"{API_URL}/{task_id}", headers=headers, method="GET")

    while True:
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                status = data.get("status")
                progress = data.get("progress", 0)
                print(f"[+] Task {task_id} Status: {status} ({progress}%)")

                if status == "SUCCEEDED":
                    return data.get("model_urls", {})
                elif status in ["FAILED", "EXPIRED"]:
                    print(f"[-] Task failed with status: {status}")
                    return None
        except Exception as e:
            print(f"[-] Error polling task {task_id}: {e}")
            return None

        time.sleep(5)

def download_file(url, target_path):
    print(f"[*] Downloading {url} -> {target_path}")
    urllib.request.urlretrieve(url, target_path)
    print(f"[✓] Saved {target_path}")

def main():
    print("==========================================")
    print(" Meshy AI 3D Generator for Helix Game Mod ")
    print("==========================================")

    api_key = get_api_key()
    if not api_key:
        print("[-] API key required to proceed. Exiting.")
        sys.exit(1)

    output_dir = os.path.join(os.path.dirname(__file__), "..", "models_raw")
    os.makedirs(output_dir, exist_ok=True)

    for key, info in ASSETS_TO_GENERATE.items():
        print(f"\n[ Task ] Generating {key}...")
        task_id = create_task(api_key, info["prompt"], info["art_style"])
        if task_id:
            urls = poll_task(api_key, task_id)
            if urls and "glb" in urls:
                target_file = os.path.join(output_dir, info["output_filename"])
                download_file(urls["glb"], target_file)

if __name__ == "__main__":
    main()
