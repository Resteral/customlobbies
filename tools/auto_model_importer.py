import os
import sys
import json
import shutil
import time
from datetime import datetime

"""
Auto Model Importer for HELIX Project (Python Version)
Monitors 'models_raw/' and imports 3D GLB/OBJ models into 'assets/models/'
Updates 'assets/ModelManifest.json' automatically.
"""

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, 'models_raw')
ASSETS_DIR = os.path.join(BASE_DIR, 'assets', 'models')
MANIFEST_PATH = os.path.join(BASE_DIR, 'assets', 'ModelManifest.json')

MODEL_MAPPINGS = {
    'meshy_weed_pot': 'weed_pot',
    'meshy_weed_box': 'weed_box',
    'meshy_crypto_farm': 'crypto_farm',
    'meshy_crypto_usb': 'crypto_usb',
    'meshy_meth_lab': 'meth_lab',
    'meshy_bank_vault': 'bank_vault',
    'meshy_drillable_safe': 'drillable_safe',
    'meshy_thermal_drill': 'thermal_drill',
    'meshy_hack_terminal': 'hack_terminal',
    'meshy_blackmarket_dealer': 'blackmarket_dealer',
    'meshy_loot_bag': 'loot_bag'
}

def ensure_directories():
    os.makedirs(RAW_DIR, exist_ok=True)
    os.makedirs(ASSETS_DIR, exist_ok=True)

def load_manifest():
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {"version": "1.0.0", "lastUpdated": datetime.now().isoformat(), "models": {}}

def save_manifest(manifest):
    manifest["lastUpdated"] = datetime.now().isoformat()
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)
    print(f"[✓] Updated ModelManifest.json with {len(manifest['models'])} assets.")

def import_model_file(filename):
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ['.glb', '.gltf', '.obj', '.fbx', '.mdl']:
        return

    base_name = os.path.splitext(filename)[0]
    target_key = MODEL_MAPPINGS.get(base_name, base_name)
    source_path = os.path.join(RAW_DIR, filename)
    target_filename = f"{target_key}{ext}"
    target_path = os.path.join(ASSETS_DIR, target_filename)

    print(f"[*] Importing 3D Model: {filename} -> assets/models/{target_filename}")
    shutil.copy2(source_path, target_path)

    manifest = load_manifest()
    manifest["models"][target_key] = {
        "key": target_key,
        "filename": target_filename,
        "path": f"assets/models/{target_filename}",
        "format": ext.replace('.', ''),
        "importedAt": datetime.now().isoformat()
    }
    save_manifest(manifest)
    print(f"[✓] Successfully imported '{target_key}' model into HELIX project!")

def scan_and_import_all():
    ensure_directories()
    print("===================================================")
    print(" HELIX Project - Auto 3D Model Importer (Python) ")
    print("===================================================")
    print(f"[*] Scanning '{RAW_DIR}' for new 3D models...")

    files = [f for f in os.listdir(RAW_DIR) if os.path.isfile(os.path.join(RAW_DIR, f))]
    if not files:
        print("[!] No model files found in models_raw/. Add .glb files to import!")
        return

    for f in files:
        import_model_file(f)

def watch_folder():
    ensure_directories()
    scan_and_import_all()
    print(f"\n[📡] File Watcher ACTIVE. Monitoring '{RAW_DIR}' for new models...")
    seen = set(os.listdir(RAW_DIR))
    
    while True:
        try:
            current = set(os.listdir(RAW_DIR))
            new_files = current - seen
            for f in new_files:
                time.sleep(0.5)
                import_model_file(f)
            seen = current
            time.sleep(2)
        except KeyboardInterrupt:
            print("\n[-] Watcher stopped.")
            break

if __name__ == "__main__":
    if "--watch" in sys.argv:
        watch_folder()
    else:
        scan_and_import_all()
