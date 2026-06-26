@echo off
title Servidor Backend - Jumbo Heatmap
echo ===================================================
echo Iniciando Servidor Backend de Jumbo Heatmap...
echo ===================================================
echo.
cd /d "%~dp0backend"
echo Instalando dependencias del Backend (esto puede tardar unos segundos)...
call npm install
echo.
echo Dependencias listas. Iniciando servidor en http://localhost:3001...
call npm start
pause
