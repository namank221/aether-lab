@echo off
setlocal
cd /d "%~dp0"
title Aether Ultimate Research Lab v4.0 — Launcher
color 0b

echo ==============================================================================
echo             AETHER ULTIMATE RESEARCH LABORATORY v4.0 -- LAUNCHER
echo ==============================================================================
echo.

:: Dedicated collision-free port: 8000 (Prevents collision with Brand Site on 8080/8082)
set PORT=8000

echo [1/2] Launching browser at http://localhost:%PORT%/ ...
start "" http://localhost:%PORT%/

echo [2/2] Serving Aether Ultimate Lab on port %PORT% (Press Ctrl+C to stop)...
py -m http.server %PORT% --bind 127.0.0.1
if errorlevel 1 (
    echo [FALLBACK] Port %PORT% occupied, opening index.html directly...
    start "" "%~dp0index.html"
    pause
)
