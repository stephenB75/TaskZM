# TaskZM Mobile App

TaskZM is now available as a mobile app for iOS and Android! This guide will help you set up, build, and deploy the mobile version.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- For iOS: Xcode 14+ and macOS
- For Android: Android Studio and Java 11+

### Setup

1. **Install dependencies and setup mobile platforms:**
   ```bash
   chmod +x scripts/setup-mobile.sh
   ./scripts/setup-mobile.sh
   ```

2. **For development:**
   ```bash
   # iOS (requires macOS)
   npm run ios:dev
   
   # Android
   npm run android:dev
   ```

3. **For live development with hot reload:**
   ```bash
   # iOS
   npm run ios:live
   
   # Android
   npm run android:live
   ```

## 📱 Mobile Features

### Native Features
- **Push Notifications**: Real-time task reminders
- **Haptic Feedback**: Touch feedback for interactions
- **Status Bar**: Custom status bar styling
- **Splash Screen**: Branded app launch screen
- **Keyboard Management**: Optimized keyboard handling
- **Safe Areas**: Support for notched devices

### Mobile-Optimized UI
- **Touch-Friendly**: Larger touch targets
- **Swipe Gestures**: Natural mobile interactions
- **Bottom Navigation**: Easy thumb navigation
- **Responsive Design**: Adapts to all screen sizes
- **Offline Support**: Works without internet connection

### Platform-Specific Features
- **iOS**: Native iOS design patterns
- **Android**: Material Design elements
- **PWA**: Progressive Web App capabilities

## 🛠️ Development

### Project Structure
```
TaskZM/
├── src/
│   ├── hooks/
│   │   └── useMobile.ts          # Mobile-specific hooks
│   ├── components/
│   │   ├── MobileBottomNavigation.tsx
│   │   └── MobileOptimizedTaskCard.tsx
│   └── styles/
│       └── mobile.css            # Mobile-specific styles
├── ios/                          # iOS native project
├── android/                      # Android native project
├── scripts/                      # Build and deployment scripts
└── capacitor.config.ts           # Capacitor configuration
```

### Available Scripts

```bash
# Development
npm run dev                       # Web development server
npm run ios:dev                   # iOS development
npm run android:dev               # Android development
npm run ios:live                  # iOS with live reload
npm run android:live              # Android with live reload

# Building
npm run build                     # Web build
npm run build:mobile              # Mobile build + sync
npm run ios:build                 # iOS build + open Xcode
npm run android:build             # Android build + open Android Studio

# Deployment
./scripts/deploy-ios.sh           # Prepare for iOS App Store
./scripts/deploy-android.sh       # Prepare for Google Play Store
```

## 📦 Building for Production

### iOS App Store

1. **Prepare for iOS:**
   ```bash
   ./scripts/deploy-ios.sh
   ```

2. **In Xcode:**
   - Select your development team
   - Set bundle identifier: `com.taskzm.app`
   - Add app icons and splash screens
   - Configure signing & capabilities
   - Archive and upload to App Store Connect

3. **App Store Requirements:**
   - App icons: 1024x1024, 180x180, 120x120, 87x87, 80x80, 76x76, 60x60, 58x58, 40x40, 29x29
   - Splash screens for all device sizes
   - Privacy policy and terms of service
   - App description and screenshots

### Google Play Store

1. **Prepare for Android:**
   ```bash
   ./scripts/deploy-android.sh
   ```

2. **In Android Studio:**
   - Sync project with Gradle files
   - Generate signed APK/AAB
   - Upload to Google Play Console

3. **Play Store Requirements:**
   - App icons: 512x512, 192x192, 144x144, 96x96, 72x72, 48x48, 36x36
   - Feature graphic: 1024x500
   - Screenshots for phone and tablet
   - Privacy policy

## 🎨 Design Standards

The mobile app maintains all existing design standards:

- **Colors**: Same color palette (#3300ff primary)
- **Typography**: DM Sans font family
- **Components**: shadcn/ui components
- **Spacing**: 8px base unit system
- **Responsive**: Mobile-first approach

### Mobile-Specific Adaptations

- **Touch Targets**: Minimum 44px for accessibility
- **Typography**: Slightly larger for mobile readability
- **Spacing**: Optimized for thumb navigation
- **Animations**: Smooth 60fps transitions
- **Gestures**: Native swipe and tap interactions

## 🔧 Configuration

### Capacitor Configuration

```typescript
// capacitor.config.ts
{
  appId: 'com.taskzm.app',
  appName: 'TaskZM',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f8f9fa"
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#3300ff"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
}
```

### Environment Variables

```bash
# .env
REACT_APP_API_URL=https://api.taskzm.com
REACT_APP_PUSH_KEY=your_push_key
REACT_APP_ANALYTICS_ID=your_analytics_id
```

## 🧪 Testing

### Device Testing

1. **iOS Simulator:**
   ```bash
   npm run ios:dev
   ```

2. **Android Emulator:**
   ```bash
   npm run android:dev
   ```

3. **Physical Devices:**
   - iOS: Connect via USB, trust computer
   - Android: Enable USB debugging

### Testing Checklist

- [ ] App launches without crashes
- [ ] All features work as expected
- [ ] Push notifications work
- [ ] Offline functionality works
- [ ] Performance is smooth (60fps)
- [ ] Memory usage is reasonable
- [ ] Battery usage is optimized

## 🚀 Deployment

### App Store Connect (iOS)

1. Create app in App Store Connect
2. Upload build via Xcode or Transporter
3. Add app metadata and screenshots
4. Submit for review

### Google Play Console (Android)

1. Create app in Google Play Console
2. Upload APK/AAB
3. Add store listing
4. Submit for review

### Web Deployment

The web version can be deployed to:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## 📊 Analytics & Monitoring

### Built-in Analytics

- User engagement tracking
- Feature usage analytics
- Performance monitoring
- Error tracking
- Crash reporting

### Custom Events

```typescript
// Track custom events
import { Analytics } from '@capacitor/analytics';

Analytics.track({
  name: 'task_created',
  properties: {
    priority: 'high',
    has_dependencies: true
  }
});
```

## 🔒 Security

### Data Protection

- All data encrypted in transit (HTTPS)
- Local storage encrypted
- Biometric authentication support
- Secure keychain storage

### Privacy

- GDPR compliant
- No tracking without consent
- Data export capabilities
- Account deletion support

## 🆘 Troubleshooting

### Common Issues

1. **Build fails:**
   ```bash
   # Clear cache and rebuild
   npm run build:mobile
   npx cap sync
   ```

2. **iOS build issues:**
   - Check Xcode version (14+ required)
   - Verify signing certificates
   - Clean build folder

3. **Android build issues:**
   - Check Java version (11+ required)
   - Update Android SDK
   - Clean Gradle cache

4. **Live reload not working:**
   - Check network connectivity
   - Verify device and computer on same network
   - Restart development server

### Getting Help

- Check Capacitor documentation
- Review iOS/Android native logs
- Test on different devices
- Check network connectivity

## 📈 Performance

### Optimization Tips

1. **Image Optimization:**
   - Use WebP format
   - Implement lazy loading
   - Compress images

2. **Bundle Size:**
   - Tree shaking enabled
   - Code splitting
   - Remove unused dependencies

3. **Runtime Performance:**
   - Use React.memo for components
   - Implement virtual scrolling
   - Optimize re-renders

## 🎯 Future Enhancements

### Planned Features

- [ ] Offline sync
- [ ] Widget support
- [ ] Apple Watch app
- [ ] Android Wear app
- [ ] Voice commands
- [ ] AR task visualization
- [ ] Team collaboration
- [ ] Advanced analytics

---

**Happy coding! 🚀**

For more information, check the main [README.md](./README.md) or visit our [documentation](https://docs.taskzm.com).