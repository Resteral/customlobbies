@echo off
title HELIX - Pacifica Server & Steam Client Launcher
color 0a
cls

echo =====================================================================
echo    _   _  ______  _      _____ __   __
echo   ^| ^| ^| ^|^|  ____^|^| ^|    ^|_   _^\ \ / /
echo   ^| ^|_^| ^|^| ^|__   ^| ^|      ^| ^|   \ V / 
echo   ^|  _  ^|^|  __^|  ^| ^|      ^| ^|    ^> ^<  
echo   ^| ^| ^| ^|^| ^|____ ^| ^|____  _^| ^|_  / . \ 
echo   ^|_^| ^|_^|^|______^|^|______^|^|_____^|/_/ \_\
echo =====================================================================
echo  MAP: Pacifica Crime District
echo  PACKAGE: HelixGame (AI Studio F6, Gunsmith F10, Tow Truck F9, Mining F11)
echo =====================================================================
echo.
echo [1/2] Starting HELIX Steam Dedicated Server...
cd /d "S:\SteamLibrary\steamapps\common\HELIX Dedicated Server"
start "HELIX Dedicated Server" SandboxServer.exe "/Game/Pacifica/Map/Pacifica?Experience=BP_Experience_Sandbox" -cef-disable-gpu -log -port 7777 -QueryPort 27015

echo.
echo [2/2] Launching HELIX Client through Steam (AppID 2594840 with Steam/EOS Auth)...
start steam://rungameid/2594840

echo.
echo =====================================================================
echo [✓] SERVER ^& STEAM CLIENT LAUNCHED!
echo.
echo How to join once the game opens:
echo   1. On the Main Menu, press ~ (Tilde) and type: open 127.0.0.1:7777
echo      OR go to Server Browser -> LAN / Direct Connect
echo   2. Alternatively, click "Create a World" -> select "New World" -> Play!
echo.
echo Hotkeys:
echo   - F6:  In-Game AI Studio Companion (Text-to-World Architect)
echo   - F10: Modular Weapon Gunsmith ^& Exotic Ammo Press
echo   - F11: Subterranean Mining ^& Blast Furnace Foundry
echo   - F9:  Tow Truck Winch Remote ^& Vehicle Stashes
echo   - B:   Sandbox Construction Toolgun
echo   - F8:  Pacifica Gang Turf Wars
echo   - M:   Pacifica GPS Map
echo =====================================================================
echo.
timeout /t 15
exit /b
