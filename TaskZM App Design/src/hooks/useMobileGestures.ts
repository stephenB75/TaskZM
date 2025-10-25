import { useState, useCallback, useRef, useEffect } from 'react';

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

interface TouchPosition {
  x: number;
  y: number;
}

export const useMobileGestures = () => {
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>({
    direction: null,
    distance: 0,
    velocity: 0,
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null);
  
  const minSwipeDistance = 50;
  const maxSwipeTime = 300;
  const startTime = useRef<number>(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    startTime.current = Date.now();
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const timeElapsed = Date.now() - startTime.current;
    const velocity = distance / timeElapsed;
    
    setIsDragging(false);
    
    if (distance < minSwipeDistance || timeElapsed > maxSwipeTime) {
      setSwipeDirection({ direction: null, distance: 0, velocity: 0 });
      return;
    }
    
    let direction: SwipeDirection['direction'] = null;
    
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      direction = distanceX > 0 ? 'left' : 'right';
    } else {
      direction = distanceY > 0 ? 'up' : 'down';
    }
    
    setSwipeDirection({ direction, distance, velocity });
  }, [touchStart, touchEnd]);

  // Haptic feedback for supported devices
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // iOS specific haptic feedback
  const triggerIOSHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [5],
        medium: [15],
        heavy: [25],
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // Android specific haptic feedback
  const triggerAndroidHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // Detect device type
  const isIOS = useCallback(() => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }, []);

  const isAndroid = useCallback(() => {
    return /Android/.test(navigator.userAgent);
  }, []);

  const isMobile = useCallback(() => {
    return isIOS() || isAndroid() || window.innerWidth < 768;
  }, [isIOS, isAndroid]);

  // Long press detection
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const onLongPressStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      triggerHapticFeedback('medium');
    }, 500);
  }, [triggerHapticFeedback]);

  const onLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPress(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return {
    swipeDirection,
    isDragging,
    isLongPress,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onLongPressStart,
    onLongPressEnd,
    triggerHapticFeedback,
    triggerIOSHaptic,
    triggerAndroidHaptic,
    isIOS,
    isAndroid,
    isMobile,
  };
};
