@echo off
title HELIX Plugin Server & Client Master Launcher
color 0b
cls

:MENU
cls
echo =====================================================================
echo    _   _  ______  _      _____ __   __   _____  ______  ______     __
echo   ^| ^| ^| ^|^|  ____^|^| ^|    ^|_   _^\ \ / /  / ____^|^|  ____^|^|  _ \   /\ \ 
echo   ^| ^|_^| ^|^| ^|__   ^| ^|      ^| ^|   \ V /  ^| (___  ^| ^|__   ^| ^|_) ^| /  \ \ 
echo   ^|  _  ^|^|  __^|  ^| ^|      ^| ^|    ^> ^<    \___ \ ^|  __^|  ^|  _ ^< / /\ \ \ 
echo   ^| ^| ^| ^|^| ^|____ ^| ^|____  _^| ^|_  / . \   ____) ^|^| ^|____ ^| ^| ^| // ____ \ \ 
echo   ^|_^| ^|_^|^|______^|^|______^|^|_____^|/_/ \_\ ^|_____/ ^|______^|^|_^| ^|_/_/    \_\
echo =====================================================================
echo  PACKAGE: HelixGame-PacificaCrimeAndLabs (v1.0.0)
echo  MAP: Pacifica Crime District (/Game/Pacifica/Map/Pacifica)
echo  ACTIVE PLUGINS: Botany, Meth, Coke, Housing, CCTV, GMod Physics
echo =====================================================================
echo.
echo  [1] START DEDICATED SERVER (Headless + Live Console)
echo  [2] START GAME CLIENT (Direct Pacifica Sandbox)
echo  [3] 1-CLICK LAUNCH ALL (Starts Dedicated Server + Launches Game)
echo  [4] VIEW LOADED PLUGINS & SERVER MODULES
echo  [5] SEARCH & DOWNLOAD 3D ASSETS (Poly Haven / Meshy AI)
echo  [6] PUBLISH / REBUILD RELEASE PACKAGE (.ZIP)
echo  [7] OPEN WEBUI STUDIOS IN BROWSER
echo  [8] EXIT
echo.
echo =====================================================================
set /p opt="Enter choice [1-8]: "

if "%opt%"=="1" goto START_SERVER
if "%opt%"=="2" goto START_CLIENT
if "%opt%"=="3" goto START_BOTH
if "%opt%"=="4" goto VIEW_PLUGINS
if "%opt%"=="5" goto ASSET_HUB
if "%opt%"=="6" goto PUBLISH_PKG
if "%opt%"=="7" goto OPEN_WEBUI
if "%opt%"=="8" exit /b
goto MENU

:START_SERVER
cls
echo =====================================================================
echo [*] Launching HELIX Dedicated Server on Pacifica...
echo =====================================================================
cd /d "S:\SteamLibrary\steamapps\common\HELIX Dedicated Server"
start SandboxServer.exe "/Game/Pacifica/Map/Pacifica?Experience=BP_Experience_Sandbox" -cef-disable-gpu -log -port 7777 -QueryPort 27015
echo.
echo [✓] Server is starting up! Check the black console window.
echo.
pause
goto MENU

:START_CLIENT
cls
echo =====================================================================
echo [*] Launching HELIX Game Client...
echo =====================================================================
cd /d "S:\SteamLibrary\steamapps\common\HELIX"
start SandboxGame.exe "/Game/Pacifica/Map/Pacifica?Experience=BP_Experience_Sandbox" -cef-disable-gpu
echo.
echo [✓] Game client launched! Loading Pacifica...
echo.
pause
goto MENU

:START_BOTH
cls
echo =====================================================================
echo [*] 1-Click Master Launch: Server + Client...
echo =====================================================================
cd /d "S:\SteamLibrary\steamapps\common\HELIX Dedicated Server"
start SandboxServer.exe "/Game/Pacifica/Map/Pacifica?Experience=BP_Experience_Sandbox" -cef-disable-gpu -log -port 7777 -QueryPort 27015
echo [✓] Server starting in background... waiting 10 seconds for initialization...
timeout /t 10 /nobreak >nul
cd /d "S:\SteamLibrary\steamapps\common\HELIX"
start SandboxGame.exe 127.0.0.1:7777 -cef-disable-gpu
echo.
echo [✓] Server and Game Client are both running!
echo.
pause
goto MENU

:VIEW_PLUGINS
cls
echo =====================================================================
echo  ACTIVE HELIX SERVER PLUGINS & MODULES
echo =====================================================================
echo.
echo  • Botany & Hydroponics:         js/server/drugs_botany.js
echo  • Meth Synthesis (99.1%%):       js/server/drugs_meth.js
echo  • Cocaine Brick Pressing:       js/server/drugs_coke.js
echo  • Street Dealing & Economy:      js/server/drugs_distribution.js
echo  • GMod Physics Snap & Weld:     js/server/gmod_physics_snap.js
echo  • Planter Melding Studio:       js/server/planter_assembly.js
echo  • Pacifica Real Estate:         js/server/housing_properties.js
echo  • In-House Lab Fixtures:        js/server/indoor_lab_builder.js
echo  • Plant Genetics & Curing:      js/server/botany_curing_cloning.js
echo  • CCTV & Thermite Burn Traps:   js/server/property_security_traps.js
echo  • Mobile Cook RV & Grow Van:    js/server/mobile_lab_rv.js
echo  • Bank Vault Heists & Safes:    js/server/heists.js
echo  • Crypto Farms & USB Hacks:      js/server/crypto.js
echo  • Black Market Vendor:          js/server/blackmarket.js
echo.
echo =====================================================================
pause
goto MENU

:ASSET_HUB
cls
echo =====================================================================
echo  HELIX 3D ASSET SOURCE HUB (Poly Haven CC0 / Meshy AI)
echo =====================================================================
echo.
set /p query="Enter asset search term (e.g. plant, table, barrel, safe): "
cd /d "c:\Users\Sean\Documents\Downloads\HelixGame"
node tools/asset_source_hub.js search "%query%"
echo.
set /p assetid="Enter Asset ID to download into assets/models/ (or leave blank to go back): "
if not "%assetid%"=="" (
    node tools/asset_source_hub.js download "%assetid%"
    node tools/auto_model_importer.js
)
echo.
pause
goto MENU

:PUBLISH_PKG
cls
echo =====================================================================
echo [*] Publishing and Rebuilding Package Bundle (.ZIP)...
echo =====================================================================
cd /d "c:\Users\Sean\Documents\Downloads\HelixGame"
npm run package:publish
echo.
pause
goto MENU

:OPEN_WEBUI
cls
echo =====================================================================
echo [*] Opening In-Game WebUI Studio Previews in Browser...
echo =====================================================================
cd /d "c:\Users\Sean\Documents\Downloads\HelixGame"
start ui/planter_builder.html
start ui/lab.html
start ui/property_tablet.html
start ui/room_designer.html
start ui/security_hub.html
start ui/map.html
echo [✓] Opened 6 WebUI studio screens in your default browser.
echo.
pause
goto MENU
