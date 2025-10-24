import { useCallback, useEffect, useState } from 'react';

export interface TouchGesture {
  type: 'swipe' | 'pinch' | 'tap' | 'longPress';
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  duration?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
}

export const useMobileTouch = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    });
    setTouchEnd(null);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const endTouch = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    
    setTouchEnd(endTouch);
    
    const gesture = detectGesture(touchStart, endTouch);
    return gesture;
  }, [touchStart]);

  const detectGesture = useCallback((start: { x: number; y: number; time: number }, end: { x: number; y: number; time: number }): TouchGesture | null => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const deltaTime = end.time - start.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Long press detection (500ms+)
    if (deltaTime > 500 && distance < 10) {
      return {
        type: 'longPress',
        duration: deltaTime,
        startX: start.x,
        startY: start.y,
        endX: end.x,
        endY: end.y,
      };
    }
    
    // Swipe detection (minimum distance and speed)
    if (distance > 50 && deltaTime < 300) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      if (absX > absY) {
        return {
          type: 'swipe',
          direction: deltaX > 0 ? 'right' : 'left',
          distance,
          duration: deltaTime,
          startX: start.x,
          startY: start.y,
          endX: end.x,
          endY: end.y,
        };
      } else {
        return {
          type: 'swipe',
          direction: deltaY > 0 ? 'down' : 'up',
          distance,
          duration: deltaTime,
          startX: start.x,
          startY: start.y,
          endX: end.x,
          endY: end.y,
        };
      }
    }
    
    // Tap detection
    if (distance < 10 && deltaTime < 300) {
      return {
        type: 'tap',
        duration: deltaTime,
        startX: start.x,
        startY: start.y,
        endX: end.x,
        endY: end.y,
      };
    }
    
    return null;
  }, []);

  const addTouchHandlers = useCallback((element: HTMLElement, onGesture: (gesture: TouchGesture) => void) => {
    const handleStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      });
    };
    
    const handleEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchStart) return;
      
      const touch = e.changedTouches[0];
      const endTouch = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      
      const gesture = detectGesture(touchStart, endTouch);
      if (gesture) {
        onGesture(gesture);
      }
    };
    
    element.addEventListener('touchstart', handleStart, { passive: false });
    element.addEventListener('touchend', handleEnd, { passive: false });
    
    return () => {
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchend', handleEnd);
    };
  }, [touchStart, detectGesture]);

  const preventScroll = useCallback((element: HTMLElement) => {
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const enablePullToRefresh = useCallback((onRefresh: () => void) => {
    let startY = 0;
    let currentY = 0;
    let isRefreshing = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && startY > 0) {
        currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 100 && !isRefreshing) {
          isRefreshing = true;
          onRefresh();
        }
      }
    };
    
    const handleTouchEnd = () => {
      startY = 0;
      currentY = 0;
      setTimeout(() => {
        isRefreshing = false;
      }, 1000);
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return {
    isTouchDevice,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    addTouchHandlers,
    preventScroll,
    enablePullToRefresh,
  };
};
