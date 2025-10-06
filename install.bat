@echo off
REM SP Local Recorder Installation Script for Windows
REM This script installs all required dependencies for running the application

echo ======================================
echo SP Local Recorder - Installation
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [31mNode.js is not installed.[0m
    echo.
    echo Please install Node.js 18 or higher from:
    echo   https://nodejs.org/
    echo   or use Chocolatey: choco install nodejs
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [32mNode.js is installed: %NODE_VERSION%[0m

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [31mnpm is not installed (should come with Node.js)[0m
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [32mnpm is installed: %NPM_VERSION%[0m

echo.
echo Installing project dependencies...
echo.

REM Install npm dependencies
call npm install

if %errorlevel% neq 0 (
    echo [31mInstallation failed![0m
    pause
    exit /b 1
)

echo.
echo ======================================
echo [32mInstallation complete![0m
echo ======================================
echo.
echo To start the application, run:
echo   npm run dev
echo.
echo The app will open at http://localhost:5173
echo.
pause
