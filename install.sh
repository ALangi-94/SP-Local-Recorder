#!/bin/bash

# SP Local Recorder Installation Script
# This script installs all required dependencies for running the application

set -e

echo "======================================"
echo "SP Local Recorder - Installation"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo ""
    echo "Please install Node.js 18 or higher from:"
    echo "  macOS/Windows: https://nodejs.org/"
    echo "  or use a package manager:"
    echo "  macOS (Homebrew): brew install node"
    echo "  Windows (Chocolatey): choco install nodejs"
    echo ""
    exit 1
else
    NODE_VERSION=$(node -v)
    echo "✅ Node.js is installed: $NODE_VERSION"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed (should come with Node.js)"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo "✅ npm is installed: $NPM_VERSION"
fi

echo ""
echo "Installing project dependencies..."
echo ""

# Install npm dependencies
npm install

echo ""
echo "======================================"
echo "✅ Installation complete!"
echo "======================================"
echo ""
echo "To start the application, run:"
echo "  npm run dev"
echo ""
echo "The app will open at http://localhost:5173"
echo ""
