@echo off
title Logitech Trackball Direction Tracker & Button HUD Server
color 0A
cls
echo ========================================================================
echo   LOGITECH TRACKBALL DIRECTION TRACKER & BUTTON HUD (OBS STREAM OVERLAY)
echo ========================================================================
echo.
echo   [1/2] Cleaning up previous background processes...
powershell -Command "Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*server.py*' } | Stop-Process -Force -ErrorAction SilentlyContinue" 2>nul

echo   [2/2] Launching Win32 Mouse Hook & WebSocket Broadcast Server...
echo.
echo   ----------------------------------------------------------------------
echo   -> Stream Overlay URL : http://127.0.0.1:8765/overlay.html
echo   -> Streamer Dashboard : http://127.0.0.1:8765
echo   ----------------------------------------------------------------------
echo.
echo   [!] Keep this window OPEN while streaming!
echo.
echo ========================================================================
echo.

timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8765"
py -u server.py

pause
