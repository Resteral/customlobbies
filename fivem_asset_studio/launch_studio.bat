@echo off
title FiveM 3D Asset Studio - Tripo2FiveM Pipeline
echo ========================================================
echo   Launching FiveM 3D Asset Studio (Tripo2FiveM)
echo ========================================================
echo Starting local web server on http://localhost:5050 ...
start "" http://localhost:5050
node server.js
pause
