#!/bin/bash

# TaskZM Mobile Setup Script
echo "🚀 Setting up TaskZM for mobile deployment..."

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

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Capacitor CLI globally if not already installed
if ! command -v cap &> /dev/null; then
    echo "📱 Installing Capacitor CLI..."
    npm install -g @capacitor/cli
fi

# Initialize Capacitor
echo "🔧 Initializing Capacitor..."
npx cap init TaskZM com.taskzm.app

# Add mobile platforms
echo "📱 Adding mobile platforms..."
npx cap add ios
npx cap add android

# Build the project
echo "🏗️ Building project..."
npm run build

# Sync with mobile platforms
echo "🔄 Syncing with mobile platforms..."
npx cap sync

echo "✅ Mobile setup complete!"
echo ""
echo "Next steps:"
echo "1. For iOS: npx cap open ios"
echo "2. For Android: npx cap open android"
echo "3. For development: npm run ios:dev or npm run android:dev"
echo ""
echo "Happy coding! 🎉"