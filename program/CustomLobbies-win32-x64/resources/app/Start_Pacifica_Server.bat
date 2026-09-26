@echo off
title HELIX Platform - Pacifica Map Dedicated Server
color 0b
cls

echo =====================================================================
echo   _   _  ______  _      _____ __   __
echo  ^| ^| ^| ^|^|  ____^|^| ^|    ^|_   _^\ \ / /
echo  ^| ^|_^| ^|^| ^|__   ^| ^|      ^| ^|   \ V / 
echo  ^|  _  ^|^|  __^|  ^| ^|      ^| ^|    ^> ^<  
echo  ^| ^| ^| ^|^| ^|____ ^| ^|____  _^| ^|_  / . \ 
echo  ^|_^| ^|_^|^|______^|^|______^|^|_____^|/_/ \_\
echo =====================================================================
echo  MAP: Pacifica City ^& Outskirts (Unreal Engine 5 Sandbox)
echo  PACKAGE: Pacifica Crime, Botany, Meth Labs ^& GMod Physics
echo  CONFIG: Server.json ^& maps/pacifica_crime_map.json
echo =====================================================================
echo.
echo [*] Starting Pacifica Server Engine...
echo [*] Spawning 11 Realistic PBR Interactive POIs in Pacifica...
echo [*] Launching Botany, Meth Synthesis, Cocaine Press ^& GMod Physics...
echo.

node js/index.js

pause
