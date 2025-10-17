#!/bin/bash

# TaskZM Mobile Build Script
echo "🏗️ Building TaskZM for mobile deployment..."

# Build the web app
echo "📦 Building web application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Web build failed!"
    exit 1
fi

# Sync with mobile platforms
echo "🔄 Syncing with mobile platforms..."
npx cap sync

if [ $? -ne 0 ]; then
    echo "❌ Sync failed!"
    exit 1
fi

echo "✅ Mobile build complete!"
echo ""
echo "Platforms ready:"
echo "- iOS: npx cap open ios"
echo "- Android: npx cap open android"
echo ""
echo "For live development:"
echo "- iOS: npm run ios:live"
echo "- Android: npm run android:live"