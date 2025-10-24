import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.metaKey === event.metaKey
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);
}

// Common keyboard shortcuts for TaskZM
export const TASKZM_SHORTCUTS = {
  // Navigation
  NAVIGATE_TODAY: { key: 't', ctrlKey: true, description: 'Go to today' },
  NAVIGATE_WEEK: { key: 'w', ctrlKey: true, description: 'Go to week view' },
  NAVIGATE_MONTH: { key: 'm', ctrlKey: true, description: 'Go to month view' },
  
  // Task Management
  NEW_TASK: { key: 'n', ctrlKey: true, description: 'Create new task' },
  SEARCH_TASKS: { key: 'f', ctrlKey: true, description: 'Search tasks' },
  TOGGLE_ARCHIVE: { key: 'a', ctrlKey: true, description: 'Toggle archive view' },
  
  // Time Tracking
  START_TIMER: { key: 's', ctrlKey: true, description: 'Start timer' },
  STOP_TIMER: { key: 'x', ctrlKey: true, description: 'Stop timer' },
  
  // Views and Panels
  TOGGLE_ANALYTICS: { key: 'g', ctrlKey: true, description: 'Toggle analytics' },
  TOGGLE_TIME_TRACKING: { key: 'h', ctrlKey: true, description: 'Toggle time tracking' },
  TOGGLE_CUSTOM_VIEWS: { key: 'v', ctrlKey: true, description: 'Toggle custom views' },
  
  // Settings
  TOGGLE_SETTINGS: { key: ',', ctrlKey: true, description: 'Toggle settings' },
  TOGGLE_THEME: { key: 'd', ctrlKey: true, description: 'Toggle dark mode' },
  
  // Quick Actions
  QUICK_SAVE: { key: 's', ctrlKey: true, description: 'Quick save' },
  QUICK_UNDO: { key: 'z', ctrlKey: true, description: 'Undo' },
  QUICK_REDO: { key: 'y', ctrlKey: true, description: 'Redo' },
  
  // Help
  SHOW_SHORTCUTS: { key: '?', ctrlKey: true, description: 'Show keyboard shortcuts' },
} as const;

export type ShortcutKey = keyof typeof TASKZM_SHORTCUTS;
