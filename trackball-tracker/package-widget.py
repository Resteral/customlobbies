import os
import zipfile

def package_streamlabs_widget():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    zip_filename = os.path.join(base_dir, "Logitech-Trackball-Streamlabs-Widget.zip")

    files_to_include = [
        "server.py",
        "index.html",
        "overlay.html",
        "start.bat",
        "README.md",
        ("css/styles.css", "css/styles.css"),
        ("js/app.js", "js/app.js")
    ]

    print(f"[*] Packaging Streamlabs Downloadable Widget into: {zip_filename}")

    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for item in files_to_include:
            if isinstance(item, tuple):
                src, arcname = item
            else:
                src, arcname = item, item

            full_src = os.path.join(base_dir, src)
            if os.path.exists(full_src):
                zipf.write(full_src, arcname)
                print(f"  + Added: {arcname}")
            else:
                print(f"  ! Warning: {src} not found.")

        # Create Streamlabs QuickStart Setup HTML guide inside the zip
        guide_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Streamlabs Desktop QuickStart Guide - Logitech Trackball Tracker</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 12px; }
    .step { background: #0f172a; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #38bdf8; }
    code { background: #334155; color: #38bdf8; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-size: 0.95rem; }
    .btn { display: inline-block; background: #38bdf8; color: #0f172a; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Streamlabs Desktop QuickStart Guide</h1>
    <p>Follow these simple steps to add your 3D Logitech Trackball Direction & Button HUD Overlay to Streamlabs Desktop / OBS Studio:</p>

    <div class="step">
      <h3>Step 1: Start the Desktop Tracker Server</h3>
      <p>Double-click <code>start.bat</code> in this folder. This launches the low-overhead tracking server in the background.</p>
    </div>

    <div class="step">
      <h3>Step 2: Add a Browser Source in Streamlabs</h3>
      <p>1. Open <strong>Streamlabs Desktop</strong>.</p>
      <p>2. In your <strong>Sources</strong> panel, click <strong>+ (Add Source)</strong>.</p>
      <p>3. Select <strong>Browser Source</strong> and click <strong>Add Source</strong>.</p>
      <p>4. Name your source: <code>Logitech Trackball Overlay</code>.</p>
    </div>

    <div class="step">
      <h3>Step 3: Choose Your Overlay Preset URL</h3>
      <p>In the Streamlabs Browser Source Settings, enter your preferred overlay URL:</p>
      <ul>
        <li><strong>Compact HUD Overlay:</strong> <code>http://localhost:8765/overlay.html</code> (Width: 650, Height: 240)</li>
        <li><strong>Full Dashboard Overlay:</strong> <code>http://localhost:8765/?mode=overlay&bg=transparent</code> (Width: 1200, Height: 500)</li>
      </ul>
    </div>

    <p>🎉 Your stream viewers can now see your live 3D trackball aim vector and button clicks on stream!</p>
  </div>
</body>
</html>
"""
        zipf.writestr("Streamlabs-Guide.html", guide_html)
        print("  + Added: Streamlabs-Guide.html")

    print("\n[+] Streamlabs Downloadable Widget Package created successfully!")

if __name__ == '__main__':
    package_streamlabs_widget()
