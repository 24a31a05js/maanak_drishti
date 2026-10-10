@echo off
title Maanak Drishti - Digital Legal Metrology Application Launcher
color 0b

echo =====================================================================
echo           MAANAK DRISHTI -- DIGITAL LEGAL METROLOGY SYSTEM
echo                   One-Click Local Application Startup
echo =====================================================================
echo.

:: Ensure Node.js is in PATH
if exist "C:\Program Files\nodejs" (
    set "PATH=C:\Program Files\nodejs;%PATH%"
)

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Python 3 was not detected in PATH.
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

:: Check Node
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js was not detected in PATH.
    echo Please install Node.js 18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/3] System environment verified (Python and Node.js detected).
echo [2/3] Launching FastAPI Backend (Port 8000) and React Frontend (Port 5173)...
echo [3/3] The browser will automatically open http://localhost:5173 once ready.
echo.

:: Run the application coordinator
python run_app.py

pause
