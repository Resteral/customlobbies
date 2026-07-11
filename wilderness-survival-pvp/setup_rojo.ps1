# PowerShell script to download Rojo CLI and install the Roblox Studio plugin
$ProgressPreference = 'SilentlyContinue'

$RojoVersion = "7.7.0"
$DownloadUrl = "https://github.com/rojo-rbx/rojo/releases/download/v$RojoVersion/rojo-$RojoVersion-windows-x86_64.zip"
$ZipPath = Join-Path $PSScriptRoot "rojo.zip"
$ExePath = Join-Path $PSScriptRoot "rojo.exe"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Setting up Rojo v$RojoVersion..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Download Zip file
Write-Host "Downloading Rojo from GitHub..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $ZipPath
    Write-Host "Download complete!" -ForegroundColor Green
} catch {
    Write-Host "Failed to download Rojo: $_" -ForegroundColor Red
    exit 1
}

# 2. Extract Archive
Write-Host "Extracting archive..." -ForegroundColor Yellow
try {
    Expand-Archive -Path $ZipPath -DestinationPath $PSScriptRoot -Force
    Write-Host "Extracted rojo.exe to $PSScriptRoot" -ForegroundColor Green
} catch {
    Write-Host "Failed to extract archive: $_" -ForegroundColor Red
    if (Test-Path $ZipPath) { Remove-Item $ZipPath }
    exit 1
} finally {
    # Clean up Zip
    if (Test-Path $ZipPath) { Remove-Item $ZipPath }
}

# 3. Verify Executable
if (Test-Path $ExePath) {
    $VersionString = & $ExePath --version
    Write-Host "Verified Rojo execution: $VersionString" -ForegroundColor Green
} else {
    Write-Host "rojo.exe was not found in the destination folder after extraction!" -ForegroundColor Red
    exit 1
}

# 4. Install Roblox Studio plugin
Write-Host "Installing Rojo Roblox Studio Plugin..." -ForegroundColor Yellow
try {
    # Run rojo plugin install
    & $ExePath plugin install
    Write-Host "Rojo Plugin installed successfully to Roblox Studio!" -ForegroundColor Green
} catch {
    Write-Host "Could not install plugin automatically via CLI. This is normal if Roblox Studio is in a non-default path." -ForegroundColor Yellow
    Write-Host "You can manually install the Rojo plugin from the Roblox Creator Store: https://create.roblox.com/store/asset/12025700874" -ForegroundColor Cyan
}

Write-Host "`nSetup completed successfully!" -ForegroundColor Green
Write-Host "To start the Rojo server, run the following command in this directory:" -ForegroundColor Yellow
Write-Host "    ./rojo serve" -ForegroundColor Cyan
Write-Host "Then, open your baseplate in Roblox Studio, open the Rojo plugin, and click 'Connect'." -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan
