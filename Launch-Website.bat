@echo off
title CustomLobbies Local Web Server
echo ========================================================
echo       CustomLobbies Local Website Server
echo ========================================================
echo.
echo Starting web server at http://localhost:3000 ...
start http://localhost:3000
node tools\web-server.js
pause
