@echo off
title FiveM MLO Creator Suite - Helix Games
cd /d "%~dp0"
echo =======================================================
echo          FIVEM MLO CREATOR & 3D STUDIO
echo =======================================================
echo Launching Server on http://localhost:5150...
start http://localhost:5150
node server.js
pause
