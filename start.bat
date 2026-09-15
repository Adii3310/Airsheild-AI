@echo off
title Airsheild AI - Smart Pollution Reduction Grid
color 0A

echo.
echo ======================================================================
echo                 AIRSHEILD AI - COMMAND CENTER
echo               Smart Pollution Reduction Grid
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [2/3] Checking project dependencies...
if not exist "node_modules\" (
    echo node_modules not found. Installing dependencies...
    call npm install
)

echo [3/3] Launching Airsheild AI web application...
echo Opening http://localhost:3000 in your default web browser...
start http://localhost:3000

echo.
echo ======================================================================
echo  Airsheild AI is running at: http://localhost:3000
echo  Press Ctrl+C in this command window to stop the server.
echo ======================================================================
echo.

call npm run dev
pause
