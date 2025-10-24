#!/bin/bash

# TaskZM App Development Environment Setup
echo "🚀 Setting up TaskZM App Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Start development server
echo "🌐 Starting development server..."
echo "📱 The app will be available at: http://localhost:3000"
echo "🔄 Press Ctrl+C to stop the server"
echo ""

npm run dev
