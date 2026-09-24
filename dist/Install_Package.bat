@echo off
title HELIX Package Installer - HelixGame-PacificaCrimeAndLabs
color 0a
cls

echo =====================================================================
echo   HELIX Package Installer: HelixGame-PacificaCrimeAndLabs (v1.0.0)
echo =====================================================================
echo.
echo [*] Searching for HELIX Dedicated Server and Client installations...
echo.

set "TARGET_DIR="

if exist "S:\SteamLibrary\steamapps\common\HELIX Dedicated Server\Packages" (
    set "TARGET_DIR=S:\SteamLibrary\steamapps\common\HELIX Dedicated Server\Packages\HelixGame"
) else if exist "C:\Program Files (x86)\Steam\steamapps\common\HELIX Dedicated Server\Packages" (
    set "TARGET_DIR=C:\Program Files (x86)\Steam\steamapps\common\HELIX Dedicated Server\Packages\HelixGame"
)

if "%TARGET_DIR%"=="" (
    echo [!] Could not automatically detect HELIX Steam path.
    echo Please copy this folder into your "HELIX Dedicated Server\Packages\" directory.
    pause
    exit /b
)

echo [✓] Found HELIX Server directory: %TARGET_DIR%
echo [*] Installing package files...

xcopy /E /I /Y "%~dp0..\*" "%TARGET_DIR%\" /EXCLUDE:%~dp0exclude.txt

echo.
echo =====================================================================
echo [✓] SUCCESS! HelixGame-PacificaCrimeAndLabs installed and ready to play!
echo =====================================================================
echo.
pause
