import { useMemo, useCallback, useRef, useEffect } from 'react';
import { Task } from '../App';

export interface PerformanceOptions {
  enableVirtualization: boolean;
  enableMemoization: boolean;
  enableDebouncing: boolean;
  debounceDelay: number;
  maxRenderItems: number;
  enableLazyLoading: boolean;
  lazyLoadThreshold: number;
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  itemCount: number;
  visibleItems: number;
  isOptimized: boolean;
}

export function usePerformanceOptimization(
  tasks: Task[],
  options: Partial<PerformanceOptions> = {}
): {
  optimizedTasks: Task[];
  metrics: PerformanceMetrics;
  isVirtualized: boolean;
  shouldLazyLoad: boolean;
} {
  const defaultOptions: PerformanceOptions = {
    enableVirtualization: true,
    enableMemoization: true,
    enableDebouncing: true,
    debounceDelay: 300,
    maxRenderItems: 100,
    enableLazyLoading: true,
    lazyLoadThreshold: 50
  };

  const finalOptions = { ...defaultOptions, ...options };
  const renderStartTime = useRef<number>(0);
  const renderEndTime = useRef<number>(0);

  // Start performance measurement
  useEffect(() => {
    renderStartTime.current = performance.now();
  }, [tasks]);

  // End performance measurement
  useEffect(() => {
    renderEndTime.current = performance.now();
  });

  // Memoize task processing
  const processedTasks = useMemo(() => {
    if (!finalOptions.enableMemoization) return tasks;

    return tasks.map(task => ({
      ...task,
      // Pre-compute expensive operations
      isOverdue: new Date(task.dueDate) < new Date(),
      isToday: new Date(task.scheduledDate).toDateString() === new Date().toDateString(),
      priorityScore: getPriorityScore(task.priority),
      completionScore: getCompletionScore(task.status)
    }));
  }, [tasks, finalOptions.enableMemoization]);

  // Optimize task list based on options
  const optimizedTasks = useMemo(() => {
    if (!finalOptions.enableVirtualization) return processedTasks;

    // Limit rendered items for performance
    if (processedTasks.length > finalOptions.maxRenderItems) {
      return processedTasks.slice(0, finalOptions.maxRenderItems);
    }

    return processedTasks;
  }, [processedTasks, finalOptions.enableVirtualization, finalOptions.maxRenderItems]);

  // Calculate performance metrics
  const metrics: PerformanceMetrics = useMemo(() => {
    const renderTime = renderEndTime.current - renderStartTime.current;
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    const itemCount = tasks.length;
    const visibleItems = optimizedTasks.length;
    const isOptimized = renderTime < 16 && visibleItems < itemCount; // 60fps threshold

    return {
      renderTime,
      memoryUsage,
      itemCount,
      visibleItems,
      isOptimized
    };
  }, [tasks.length, optimizedTasks.length]);

  // Determine if lazy loading should be enabled
  const shouldLazyLoad = useMemo(() => {
    return finalOptions.enableLazyLoading && 
           tasks.length > finalOptions.lazyLoadThreshold;
  }, [tasks.length, finalOptions.enableLazyLoading, finalOptions.lazyLoadThreshold]);

  return {
    optimizedTasks,
    metrics,
    isVirtualized: finalOptions.enableVirtualization,
    shouldLazyLoad
  };
}

// Debounced search hook
export function useDebouncedSearch<T>(
  items: T[],
  searchFn: (items: T[], query: string) => T[],
  delay: number = 300
): {
  searchResults: T[];
  search: (query: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
} {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<T[]>(items);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSearch = useCallback((searchQuery: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSearching(true);
    
    timeoutRef.current = setTimeout(() => {
      const results = searchQuery.trim() 
        ? searchFn(items, searchQuery)
        : items;
      
      setSearchResults(results);
      setIsSearching(false);
    }, delay);
  }, [items, searchFn, delay]);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setSearchResults(items);
    setIsSearching(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [items]);

  return {
    searchResults,
    search,
    clearSearch,
    isSearching
  };
}

// Memoized component wrapper
export function useMemoizedComponent<T extends Record<string, any>>(
  component: React.ComponentType<T>,
  props: T,
  deps: any[] = []
): React.ComponentType<T> {
  return useMemo(() => {
    return React.memo(component);
  }, deps);
}

// Performance monitoring hook
export function usePerformanceMonitor(
  componentName: string,
  threshold: number = 16 // 60fps threshold
): {
  startMeasure: () => void;
  endMeasure: () => void;
  getMetrics: () => PerformanceMetrics;
} {
  const startTime = useRef<number>(0);
  const endTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  const startMeasure = useCallback(() => {
    startTime.current = performance.now();
    renderCount.current++;
  }, []);

  const endMeasure = useCallback(() => {
    endTime.current = performance.now();
    
    const renderTime = endTime.current - startTime.current;
    
    if (renderTime > threshold) {
      console.warn(`Performance warning: ${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }
  }, [componentName, threshold]);

  const getMetrics = useCallback((): PerformanceMetrics => {
    const renderTime = endTime.current - startTime.current;
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    return {
      renderTime,
      memoryUsage,
      itemCount: renderCount.current,
      visibleItems: renderCount.current,
      isOptimized: renderTime < threshold
    };
  }, [threshold]);

  return {
    startMeasure,
    endMeasure,
    getMetrics
  };
}

// Helper functions
function getPriorityScore(priority: string): number {
  switch (priority) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
}

function getCompletionScore(status: string): number {
  switch (status) {
    case 'done': return 1;
    case 'inprogress': return 0.5;
    case 'todo': return 0;
    default: return 0;
  }
}

// Export React for the memoized component
import React from 'react';
