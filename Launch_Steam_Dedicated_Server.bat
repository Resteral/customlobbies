@echo off
title HELIX Steam Dedicated Server Launcher
color 0b
cls

echo =====================================================================
echo  Starting Official Steam HELIX Dedicated Server on Pacifica...
echo  Directory: S:\SteamLibrary\steamapps\common\HELIX Dedicated Server
echo =====================================================================
echo.

cd /d "S:\SteamLibrary\steamapps\common\HELIX Dedicated Server"
start SandboxServer.exe "/Game/Pacifica/Map/Pacifica?Experience=BP_Experience_Sandbox" -log -port 7777 -QueryPort 27015

echo [✓] SandboxServer.exe is running on port 7777!
echo.
pause
