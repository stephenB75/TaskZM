import { useState, useEffect, useCallback, useMemo } from 'react';

export interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  threshold?: number;
}

export interface VirtualizationResult {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  visibleItems: number[];
}

export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
): VirtualizationResult {
  const { itemHeight, containerHeight, overscan = 5, threshold = 0.1 } = options;
  
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  // Calculate total height and offset
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  // Get visible items
  const visibleItems = useMemo(() => {
    const result: number[] = [];
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      result.push(i);
    }
    return result;
  }, [visibleRange.startIndex, visibleRange.endIndex]);

  // Handle scroll events
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Attach scroll listener
  useEffect(() => {
    if (!containerRef) return;

    containerRef.addEventListener('scroll', handleScroll, { passive: true });
    return () => containerRef.removeEventListener('scroll', handleScroll);
  }, [containerRef, handleScroll]);

  // Update scroll position when items change
  useEffect(() => {
    if (!containerRef) return;

    const currentScrollTop = containerRef.scrollTop;
    const maxScrollTop = totalHeight - containerHeight;
    
    if (currentScrollTop > maxScrollTop) {
      containerRef.scrollTop = Math.max(0, maxScrollTop);
    }
  }, [items.length, containerHeight, totalHeight, containerRef]);

  return {
    startIndex: visibleRange.startIndex,
    endIndex: visibleRange.endIndex,
    totalHeight,
    offsetY,
    visibleItems
  };
}

// Hook for dynamic item heights
export function useDynamicVirtualization<T>(
  items: T[],
  options: Omit<VirtualizationOptions, 'itemHeight'> & {
    getItemHeight: (index: number, item: T) => number;
    estimatedItemHeight: number;
  }
): VirtualizationResult & { getItemHeight: (index: number) => number } {
  const { containerHeight, overscan = 5 } = options;
  const { getItemHeight: getItemHeightFn, estimatedItemHeight } = options;
  
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [itemHeights, setItemHeights] = useState<number[]>([]);

  // Calculate item heights
  useEffect(() => {
    const heights = items.map((item, index) => getItemHeightFn(index, item));
    setItemHeights(heights);
  }, [items, getItemHeightFn]);

  // Calculate cumulative heights
  const cumulativeHeights = useMemo(() => {
    const cumulative: number[] = [0];
    let total = 0;
    
    for (let i = 0; i < itemHeights.length; i++) {
      total += itemHeights[i] || estimatedItemHeight;
      cumulative.push(total);
    }
    
    return cumulative;
  }, [itemHeights, estimatedItemHeight]);

  // Find visible range
  const visibleRange = useMemo(() => {
    const totalHeight = cumulativeHeights[cumulativeHeights.length - 1];
    const startIndex = findStartIndex(cumulativeHeights, scrollTop);
    const endIndex = findEndIndex(cumulativeHeights, scrollTop + containerHeight);
    
    return { startIndex, endIndex, totalHeight };
  }, [cumulativeHeights, scrollTop, containerHeight]);

  // Calculate offset
  const offsetY = cumulativeHeights[visibleRange.startIndex] || 0;

  // Get visible items
  const visibleItems = useMemo(() => {
    const result: number[] = [];
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      result.push(i);
    }
    return result;
  }, [visibleRange.startIndex, visibleRange.endIndex]);

  // Handle scroll events
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Attach scroll listener
  useEffect(() => {
    if (!containerRef) return;

    containerRef.addEventListener('scroll', handleScroll, { passive: true });
    return () => containerRef.removeEventListener('scroll', handleScroll);
  }, [containerRef, handleScroll]);

  return {
    startIndex: visibleRange.startIndex,
    endIndex: visibleRange.endIndex,
    totalHeight: visibleRange.totalHeight,
    offsetY,
    visibleItems,
    getItemHeight: (index: number) => itemHeights[index] || estimatedItemHeight
  };
}

// Helper functions
function findStartIndex(cumulativeHeights: number[], scrollTop: number): number {
  let left = 0;
  let right = cumulativeHeights.length - 1;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (cumulativeHeights[mid] < scrollTop) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return Math.max(0, left - 1);
}

function findEndIndex(cumulativeHeights: number[], scrollBottom: number): number {
  let left = 0;
  let right = cumulativeHeights.length - 1;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (cumulativeHeights[mid] < scrollBottom) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return Math.min(cumulativeHeights.length - 1, left);
}
