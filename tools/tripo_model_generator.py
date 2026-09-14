import os
import sys
import json
import urllib.request
import time
import argparse

"""
Tripo 3D Model Generator for HELIX Project
API Endpoint: https://api.tripo3d.ai/v2/openapi/task

Usage:
  python tools/tripo_model_generator.py --api-key tsk_your_tripo_api_key_here
"""

API_URL = "https://api.tripo3d.ai/v2/openapi/task"

ASSETS_TO_GENERATE = {
    "weed_pot": {
        "prompt": "stylized cannabis plant growing inside a terracotta clay pot, game asset, 3d prop",
        "output_filename": "tripo_weed_pot.glb"
    },
    "weed_box": {
        "prompt": "high tech hydroponic cannabis planter box with mounted grow lights and nutrient gauge, game prop",
        "output_filename": "tripo_weed_box.glb"
    },
    "crypto_farm": {
        "prompt": "modular server rack crypto GPU mining rig with cooling fans and RGB LED lighting, game prop",
        "output_filename": "tripo_crypto_farm.glb"
    },
    "crypto_usb": {
        "prompt": "futuristic cyberpunk USB flash drive stick with glowing blue LED screen and circuit lines, game prop",
        "output_filename": "tripo_crypto_usb.glb"
    },
    "meth_lab": {
        "prompt": "chemical synthesis laboratory workstation with tubes and gas burner, game asset prop",
        "output_filename": "tripo_meth_lab.glb"
    },
    "bank_vault": {
        "prompt": "heavy steel bank vault door with circular locking mechanism, game asset prop",
        "output_filename": "tripo_bank_vault.glb"
    },
    "drillable_safe": {
        "prompt": "reinforced industrial floor safe with digital keypad, game asset prop",
        "output_filename": "tripo_drillable_safe.glb"
    },
    "thermal_drill": {
        "prompt": "heavy industrial thermal breach drill with battery pack and hoses, game prop",
        "output_filename": "tripo_thermal_drill.glb"
    },
    "hack_terminal": {
        "prompt": "cyberpunk computer security override terminal with green screen display, game prop",
        "output_filename": "tripo_hack_terminal.glb"
    },
    "blackmarket_dealer": {
        "prompt": "mysterious shady black market dealer character standing in leather trenchcoat",
        "output_filename": "tripo_blackmarket_dealer.glb"
    },
    "loot_bag": {
        "prompt": "heavy duffel bag overflowing with stacks of cash bills, game prop",
        "output_filename": "tripo_loot_bag.glb"
    }
}

def get_api_key():
    parser = argparse.ArgumentParser(description="Tripo 3D Model Generator for HELIX")
    parser.add_argument("--api-key", help="Your Tripo 3D API Key")
    args, _ = parser.parse_known_args()

    if args.api_key:
        return args.api_key

    env_key = os.environ.get("TRIPO_API_KEY")
    if env_key:
        return env_key

    print("\n[!] No Tripo 3D API Key detected.")
    key = input("--> Please paste your Tripo 3D API Key here: ").strip()
    return key

def create_task(api_key, prompt):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "type": "text_to_model",
        "prompt": prompt
    }

    req = urllib.request.Request(API_URL, data=json.dumps(payload).encode('utf-8'), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data.get("code") == 0 and "data" in data:
                return data["data"].get("task_id")
            elif "task_id" in data:
                return data.get("task_id")
            elif "result" in data:
                return data.get("result")
    except Exception as e:
        print(f"[-] Error creating Tripo task for prompt '{prompt}': {e}")
        return None

def poll_task(api_key, task_id):
    headers = {"Authorization": f"Bearer {api_key}"}
    req = urllib.request.Request(f"{API_URL}/{task_id}", headers=headers, method="GET")

    while True:
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                task_data = data.get("data", {})
                status = task_data.get("status") or data.get("status")
                progress = task_data.get("progress", 0)
                print(f"[+] Tripo Task {task_id} Status: {status} ({progress}%)")

                if status == "success" or status == "SUCCEEDED":
                    output = task_data.get("output", {}) or task_data.get("result", {})
                    model_url = output.get("model") or output.get("pbr_model") or output.get("base_model")
                    return model_url
                elif status in ["failed", "FAILED", "cancelled"]:
                    print(f"[-] Tripo Task failed with status: {status}")
                    return None
        except Exception as e:
            print(f"[-] Error polling Tripo task {task_id}: {e}")
            return None

        time.sleep(4)

def download_file(url, target_path):
    print(f"[*] Downloading Tripo Model: {url} -> {target_path}")
    urllib.request.urlretrieve(url, target_path)
    print(f"[✓] Saved {target_path}")

def main():
    print("==========================================")
    print(" Tripo 3D Model Generator for HELIX      ")
    print("==========================================")

    api_key = get_api_key()
    if not api_key:
        print("[-] API key required to proceed. Exiting.")
        sys.exit(1)

    output_dir = os.path.join(os.path.dirname(__file__), "..", "models_raw")
    os.makedirs(output_dir, exist_ok=True)

    for key, info in ASSETS_TO_GENERATE.items():
        print(f"\n[ Task ] Requesting Tripo 3D model for '{key}'...")
        task_id = create_task(api_key, info["prompt"])
        if task_id:
            model_url = poll_task(api_key, task_id)
            if model_url:
                target_file = os.path.join(output_dir, info["output_filename"])
                download_file(model_url, target_file)

if __name__ == "__main__":
    main()
