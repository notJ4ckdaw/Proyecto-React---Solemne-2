@echo off
title Servidor Frontend - Jumbo Heatmap
echo ===================================================
echo Iniciando Servidor Frontend de Jumbo Heatmap...
echo ===================================================
echo.
cd /d "%~dp0"
echo Instalando dependencias del Frontend (si faltan)...
call npm install
echo.
echo Dependencias listas. Iniciando servidor de desarrollo...
call npm run dev
pause
