import React from 'react';
import { Keyboard, X } from 'lucide-react';
import { TASKZM_SHORTCUTS } from '../hooks/useKeyboardShortcuts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Navigation',
      shortcuts: [
        { key: 'Ctrl + T', description: 'Go to today' },
        { key: 'Ctrl + W', description: 'Go to week view' },
        { key: 'Ctrl + M', description: 'Go to month view' },
      ],
    },
    {
      title: 'Task Management',
      shortcuts: [
        { key: 'Ctrl + N', description: 'Create new task' },
        { key: 'Ctrl + F', description: 'Search tasks' },
        { key: 'Ctrl + A', description: 'Toggle archive view' },
      ],
    },
    {
      title: 'Time Tracking',
      shortcuts: [
        { key: 'Ctrl + S', description: 'Start timer' },
        { key: 'Ctrl + X', description: 'Stop timer' },
      ],
    },
    {
      title: 'Views & Panels',
      shortcuts: [
        { key: 'Ctrl + G', description: 'Toggle analytics' },
        { key: 'Ctrl + H', description: 'Toggle time tracking' },
        { key: 'Ctrl + V', description: 'Toggle custom views' },
      ],
    },
    {
      title: 'Settings',
      shortcuts: [
        { key: 'Ctrl + ,', description: 'Toggle settings' },
        { key: 'Ctrl + D', description: 'Toggle dark mode' },
      ],
    },
    {
      title: 'Quick Actions',
      shortcuts: [
        { key: 'Ctrl + S', description: 'Quick save' },
        { key: 'Ctrl + Z', description: 'Undo' },
        { key: 'Ctrl + Y', description: 'Redo' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                Keyboard Shortcuts
              </CardTitle>
              <CardDescription>
                Power user shortcuts for faster navigation and task management
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {shortcutGroups.map((group, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div
                    key={shortcutIndex}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {shortcut.key}
                    </Badge>
                  </div>
                ))}
              </div>
              {index < shortcutGroups.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Pro Tip
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Press <Badge variant="secondary" className="font-mono text-xs">Ctrl + ?</Badge> anytime 
                  to open this help dialog. All shortcuts work globally when the app is focused.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
