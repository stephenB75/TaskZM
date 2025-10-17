#!/bin/bash

# TaskZM Android Deployment Script
echo "🤖 Preparing TaskZM for Google Play Store..."

# Build the project
echo "🏗️ Building project..."
npm run build:mobile

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Open Android project in Android Studio
echo "📱 Opening Android project in Android Studio..."
npx cap open android

echo "✅ Android project opened in Android Studio!"
echo ""
echo "Next steps in Android Studio:"
echo "1. Sync project with Gradle files"
echo "2. Generate signed APK/AAB"
echo "3. Upload to Google Play Console"
echo ""
echo "For testing on device:"
echo "1. Enable Developer Options on your Android device"
echo "2. Enable USB Debugging"
echo "3. Connect device and run: npm run android:dev"
echo ""
echo "For testing on emulator:"
echo "1. Create Android Virtual Device (AVD)"
echo "2. Start emulator"
echo "3. Run: npm run android:dev"