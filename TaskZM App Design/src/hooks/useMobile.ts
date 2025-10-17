import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<'web' | 'ios' | 'android'>('web');

  useEffect(() => {
    const checkPlatform = async () => {
      const isNativePlatform = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();
      
      setIsMobile(isNativePlatform);
      setIsNative(isNativePlatform);
      setPlatform(platform as 'web' | 'ios' | 'android');

      if (isNativePlatform) {
        await setupMobile();
      }
    };

    checkPlatform();
  }, []);

  const setupMobile = async () => {
    try {
      // Configure status bar
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#3300ff' });

      // Hide splash screen
      await SplashScreen.hide();

      // Setup keyboard
      await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
      await Keyboard.setStyle({ style: 'dark' });

      // Request notification permissions
      await PushNotifications.requestPermissions();

      // Setup push notifications
      await PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
      });

      await PushNotifications.addListener('registrationError', (err) => {
        console.error('Registration error: ' + JSON.stringify(err));
      });

      await PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('Push notification received: ', notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
      });

    } catch (error) {
      console.error('Error setting up mobile features:', error);
    }
  };

  const hapticFeedback = async (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (isNative) {
      try {
        const impactStyle = style === 'light' ? ImpactStyle.Light : 
                          style === 'medium' ? ImpactStyle.Medium : 
                          ImpactStyle.Heavy;
        await Haptics.impact({ style: impactStyle });
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
  };

  const showKeyboard = async () => {
    if (isNative) {
      await Keyboard.show();
    }
  };

  const hideKeyboard = async () => {
    if (isNative) {
      await Keyboard.hide();
    }
  };

  return {
    isMobile,
    isNative,
    platform,
    hapticFeedback,
    showKeyboard,
    hideKeyboard,
    setupMobile
  };
};