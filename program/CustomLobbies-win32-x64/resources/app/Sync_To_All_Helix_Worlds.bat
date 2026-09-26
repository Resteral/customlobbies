@echo off
title HELIX - Universal World Script Sync Tool
color 0b
cls

echo =====================================================================
echo    _   _  ______  _      _____ __   __
echo   ^| ^| ^| ^|^|  ____^|^| ^|    ^|_   _^\ \ / /
echo   ^| ^|_^| ^|^| ^|__   ^| ^|      ^| ^|   \ V / 
echo   ^|  _  ^|^|  __^|  ^| ^|      ^| ^|    ^> ^<  
echo   ^| ^| ^| ^|^| ^|____ ^| ^|____  _^| ^|_  / . \ 
echo   ^|_^| ^|_^|^|______^|^|______^|^|_____^|/_/ \_\
echo =====================================================================
echo  Injecting all Server Scripts, Weapons, Tow Truck, Mining,
echo  AI Studio Companion, and UI into ALL HELIX Worlds...
echo =====================================================================
echo.

cd /d "%~dp0"
node tools/sync_to_helix_workspace.js

echo.
pause
