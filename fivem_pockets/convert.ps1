Add-Type -AssemblyName System.Drawing
$source = "C:\Users\Sean\.gemini\antigravity\brain\f6f5cfc9-4e4b-4fb7-b4c0-f63c3bbcc637\savable_fivem_unified_inventory_4k_1787034650551.jpg"
$dest1 = "c:\Users\Sean\Documents\Downloads\HelixGame\fivem_pockets\fivem_inventory_preview.png"
$dest2 = "C:\Users\Sean\.gemini\antigravity\brain\f6f5cfc9-4e4b-4fb7-b4c0-f63c3bbcc637\fivem_inventory_preview.png"

$img = [System.Drawing.Image]::FromFile($source)
$img.Save($dest1, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Save($dest2, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()

Write-Host "PNG saved successfully to both project directory and artifacts directory!"
