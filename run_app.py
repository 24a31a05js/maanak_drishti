#!/usr/bin/env python3
"""
Maanak Drishti - One-Click Application Coordinator
Launches FastAPI backend (port 8000) and Vite React frontend (port 5173),
verifies health status, opens the web browser to the unified local entry point,
and keeps both services running seamlessly together.
"""

import sys
import os
import time
import subprocess
import webbrowser
import signal
import shutil
from pathlib import Path

# Safe encoding on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Add Node.js to PATH on Windows if not already present
NODE_DEFAULT_PATH = r"C:\Program Files\nodejs"
if os.path.exists(NODE_DEFAULT_PATH) and NODE_DEFAULT_PATH not in os.environ.get("PATH", ""):
    os.environ["PATH"] = NODE_DEFAULT_PATH + os.pathsep + os.environ.get("PATH", "")

PROJECT_ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
BACKEND_DIR = PROJECT_ROOT / "backend"

BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:5173"

processes = []

def cleanup(sig=None, frame=None):
    print("\n[Maanak Drishti] Shutting down application services...")
    for p in processes:
        try:
            if sys.platform == "win32":
                subprocess.call(["taskkill", "/F", "/T", "/PID", str(p.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                p.terminate()
        except Exception:
            pass
    print("[Maanak Drishti] All services stopped cleanly.")
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
if hasattr(signal, "SIGTERM"):
    signal.signal(signal.SIGTERM, cleanup)

def check_dependencies():
    print("[Maanak Drishti] Verifying system dependencies...")
    
    # 1. Check Python
    print(f"  [OK] Python version: {sys.version.split()[0]}")
    
    # 2. Check Node.js
    node_found = False
    try:
        res = subprocess.run(["node", "-v"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        if res.returncode == 0:
            print(f"  [OK] Node.js version: {res.stdout.strip()}")
            node_found = True
    except Exception:
        pass

    if not node_found:
        print("  [!] Node.js was not detected in PATH. Please install Node.js from https://nodejs.org/")
        return False

    # 3. Check Backend packages
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        import pymysql
        print("  [OK] FastAPI & SQLAlchemy backend packages ready")
    except ImportError as e:
        print(f"  [!] Missing python library: {e}")
        print("  Attempting to install missing requirements...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", str(BACKEND_DIR / "requirements.txt")])

    return True

def start_backend():
    print("[Maanak Drishti] Starting FastAPI Backend on port 8000...")
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "backend.app.main:app",
        "--host",
        "127.0.0.1",
        "--port",
        "8000",
        "--log-level",
        "info",
        "--reload"
    ]
    p = subprocess.Popen(cmd, cwd=str(PROJECT_ROOT))
    processes.append(p)
    return p

def start_frontend():
    print("[Maanak Drishti] Starting React Frontend on port 5173...")
    npm_bin = shutil.which("npm.cmd") if sys.platform == "win32" else shutil.which("npm")
    if not npm_bin:
        npm_bin = "npm"
    cmd = f'"{npm_bin}" run dev --prefix frontend'
    p = subprocess.Popen(cmd, shell=True, cwd=str(PROJECT_ROOT))
    processes.append(p)
    return p

def wait_and_open_browser():
    import urllib.request
    print("[Maanak Drishti] Waiting for services to initialize...")
    
    # Wait for backend health
    backend_ready = False
    for i in range(25):
        try:
            with urllib.request.urlopen(f"{BACKEND_URL}/api/v1/health", timeout=2) as response:
                if response.status == 200:
                    backend_ready = True
                    break
        except Exception:
            time.sleep(0.5)

    if backend_ready:
        print(f"  [OK] Backend API is HEALTHY at {BACKEND_URL}/api/v1/health")
        print(f"  [OK] Swagger API Docs ready at {BACKEND_URL}/docs")
    else:
        print("  [!] Backend initialized, verifying connection...")

    # Wait for frontend
    frontend_ready = False
    for i in range(25):
        try:
            with urllib.request.urlopen(FRONTEND_URL, timeout=2) as response:
                if response.status == 200:
                    frontend_ready = True
                    break
        except Exception:
            time.sleep(0.5)

    if frontend_ready:
        print(f"  [OK] Frontend is READY at {FRONTEND_URL}")
    
    print("\n" + "=" * 60)
    print("  MAANAK DRISHTI -- DIGITAL LEGAL METROLOGY SYSTEM")
    print("=" * 60)
    print(f"  Unified Web Portal:    {FRONTEND_URL}")
    print(f"  Direct Consumer Desk:  {FRONTEND_URL}/consumer/dashboard")
    print(f"  Inspector Enforcement: {FRONTEND_URL}/inspector/dashboard")
    print(f"  FastAPI REST Docs:     {BACKEND_URL}/docs")
    print("=" * 60)
    print("  Press Ctrl+C to stop all services.\n")

    # Automatically open Home page in default web browser
    try:
        webbrowser.open(FRONTEND_URL)
    except Exception:
        pass

def main():
    if not check_dependencies():
        input("\nPress Enter to exit...")
        sys.exit(1)

    start_backend()
    start_frontend()
    wait_and_open_browser()

    # Keep coordinator alive
    try:
        while True:
            time.sleep(1)
            for p in processes:
                if p.poll() is not None:
                    print("[Maanak Drishti] A service process terminated.")
                    cleanup()
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
