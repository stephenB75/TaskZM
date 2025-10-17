#!/bin/bash

# TaskZM iOS Deployment Script
echo "🍎 Preparing TaskZM for iOS App Store..."

# Build the project
echo "🏗️ Building project..."
npm run build:mobile

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Open iOS project in Xcode
echo "📱 Opening iOS project in Xcode..."
npx cap open ios

echo "✅ iOS project opened in Xcode!"
echo ""
echo "Next steps in Xcode:"
echo "1. Select your development team"
echo "2. Set bundle identifier (com.taskzm.app)"
echo "3. Add app icons and splash screens"
echo "4. Configure signing & capabilities"
echo "5. Archive and upload to App Store Connect"
echo ""
echo "For testing on device:"
echo "1. Connect your iOS device"
echo "2. Select your device in Xcode"
echo "3. Click the Run button"