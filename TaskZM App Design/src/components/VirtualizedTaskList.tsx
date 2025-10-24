import React, { useRef, useEffect, useState } from 'react';
import { Task } from '../App';
import { useVirtualization } from '../hooks/useVirtualization';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';
import TaskCard from './TaskCard';

interface VirtualizedTaskListProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, status: string) => void;
  onTaskClick: (task: Task) => void;
  onTaskDrop: (taskId: string, newStatus: string) => void;
  onReorderTasks: (taskId: string, newIndex: number) => void;
  itemHeight?: number;
  containerHeight?: number;
  enablePerformanceOptimization?: boolean;
  className?: string;
}

export default function VirtualizedTaskList({
  tasks,
  onTaskStatusChange,
  onTaskClick,
  onTaskDrop,
  onReorderTasks,
  itemHeight = 120,
  containerHeight = 600,
  enablePerformanceOptimization = true,
  className = ''
}: VirtualizedTaskListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Performance optimization
  const { optimizedTasks, metrics, isVirtualized, shouldLazyLoad } = usePerformanceOptimization(
    tasks,
    {
      enableVirtualization: true,
      enableMemoization: true,
      enableDebouncing: true,
      debounceDelay: 300,
      maxRenderItems: 100,
      enableLazyLoading: true,
      lazyLoadThreshold: 50
    }
  );

  // Virtualization
  const {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    visibleItems
  } = useVirtualization(optimizedTasks, {
    itemHeight,
    containerHeight,
    overscan: 5
  });

  // Handle scroll events
  const handleScroll = () => {
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Render visible tasks
  const renderVisibleTasks = () => {
    return visibleItems.map(index => {
      const task = optimizedTasks[index];
      if (!task) return null;

      return (
        <div
          key={task.id}
          style={{
            height: itemHeight,
            position: 'absolute',
            top: index * itemHeight,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`
          }}
          className="px-2 py-1"
        >
          <TaskCard
            task={task}
            onStatusChange={onTaskStatusChange}
            onTaskClick={onTaskClick}
            allTasks={optimizedTasks}
          />
        </div>
      );
    });
  };

  // Performance indicator
  const renderPerformanceIndicator = () => {
    if (!enablePerformanceOptimization) return null;

    return (
      <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
        <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
        <div>Items: {metrics.visibleItems}/{metrics.itemCount}</div>
        <div>Optimized: {metrics.isOptimized ? '✓' : '⚠'}</div>
      </div>
    );
  };

  // Loading indicator for lazy loading
  const renderLoadingIndicator = () => {
    if (!shouldLazyLoad || !isScrolling) return null;

    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Performance indicator */}
      {renderPerformanceIndicator()}
      
      {/* Loading indicator */}
      {renderLoadingIndicator()}
      
      {/* Virtualized container */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{
          height: containerHeight,
          position: 'relative'
        }}
      >
        {/* Spacer for total height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible tasks */}
          {renderVisibleTasks()}
        </div>
      </div>
      
      {/* Performance metrics (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <div className="font-semibold">Performance Metrics:</div>
          <div>Render Time: {metrics.renderTime.toFixed(2)}ms</div>
          <div>Memory Usage: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB</div>
          <div>Total Items: {metrics.itemCount}</div>
          <div>Visible Items: {metrics.visibleItems}</div>
          <div>Virtualization: {isVirtualized ? 'Enabled' : 'Disabled'}</div>
          <div>Lazy Loading: {shouldLazyLoad ? 'Enabled' : 'Disabled'}</div>
          <div>Optimized: {metrics.isOptimized ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}
