# Maanak Drishti - Digital Legal Metrology Application Launcher (PowerShell)
$Host.UI.RawUI.WindowTitle = "Maanak Drishti - Application Launcher"

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "          MAANAK DRISHTI -- DIGITAL LEGAL METROLOGY SYSTEM" -ForegroundColor Yellow
Write-Host "                  One-Click Local Application Startup" -ForegroundColor White
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# Ensure Node is in PATH
if (Test-Path "C:\Program Files\nodejs") {
    $env:PATH = "C:\Program Files\nodejs;" + $env:PATH
}

# Check Python
try {
    $pyVer = python --version
    Write-Host "[1/3] Python environment verified: $pyVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python was not detected in PATH. Please install Python 3.10+ from python.org" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

# Check Node
try {
    $nodeVer = node -v
    Write-Host "[2/3] Node.js environment verified: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js was not detected in PATH. Please install Node.js 18+ from nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host "[3/3] Launching FastAPI Backend (Port 8000) and React Frontend (Port 5173)..." -ForegroundColor Cyan
Write-Host "Opening unified local entrance at http://localhost:5173..." -ForegroundColor Yellow
Write-Host ""

python run_app.py
