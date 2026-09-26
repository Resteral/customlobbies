@echo off
title CustomLobbies Desktop Client
echo ========================================================
echo       CustomLobbies Desktop Program Client v2.5
echo  Independent Standalone Esports Matchmaking & Voice Platform
echo ========================================================
echo.
echo Launching CustomLobbies Desktop App...

if exist "program\CustomLobbies-win32-x64\CustomLobbies.exe" (
    start "" "program\CustomLobbies-win32-x64\CustomLobbies.exe"
) else (
    echo Launching via Electron development runtime...
    npx electron .
)
