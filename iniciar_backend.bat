@echo off
title Servidor Backend - Django REST Framework (Jumbo Heatmap)
echo ===================================================
echo Iniciando Servidor Backend en Django...
echo ===================================================
echo.

cd /d "%~dp0backend"

:: Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] No se detectó Python en el sistema.
    echo Por favor, instala Python (versión 3.8 o superior) antes de continuar.
    pause
    exit /b
)

:: Crear entorno virtual si no existe
if not exist venv (
    echo Creando entorno virtual de Python (venv)...
    python -m venv venv
)

:: Activar entorno virtual
echo Activando entorno virtual...
call venv\Scripts\activate

:: Instalar dependencias
echo Instalando dependencias (Django, REST Framework, CORS)...
pip install -r requirements.txt

echo.
echo Realizando migraciones de la base de datos...
python manage.py makemigrations api
python manage.py migrate

echo.
echo Poblando base de datos SQLite con zonas iniciales...
python manage.py seed

echo.
echo ===================================================
echo Servidor Backend Django iniciado en http://localhost:3001
echo Presiona Ctrl+C para detener el servidor.
echo ===================================================
echo.

python manage.py runserver 3001
pause
