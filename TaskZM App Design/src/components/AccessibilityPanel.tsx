import React, { useState, useEffect } from 'react';
import { Settings, Eye, MousePointer, Type, Volume2, Keyboard } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useAccessibility, AccessibilitySettings } from '../hooks/useAccessibility';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const {
    getAccessibilitySettings,
    saveAccessibilitySettings,
    applyAccessibilitySettings,
    announceToScreenReader,
  } = useAccessibility();

  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    fontSize: 'medium',
    keyboardNavigation: true,
  });

  useEffect(() => {
    if (isOpen) {
      const currentSettings = getAccessibilitySettings();
      setSettings(currentSettings);
    }
  }, [isOpen, getAccessibilitySettings]);

  const handleSettingChange = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveAccessibilitySettings(newSettings);
    applyAccessibilitySettings(newSettings);
    
    // Announce changes to screen readers
    const settingNames: Record<keyof AccessibilitySettings, string> = {
      highContrast: 'High contrast mode',
      reducedMotion: 'Reduced motion',
      screenReader: 'Screen reader optimization',
      fontSize: 'Font size',
      keyboardNavigation: 'Keyboard navigation',
    };
    
    announceToScreenReader(`${settingNames[key]} ${value ? 'enabled' : 'disabled'}`);
  };

  const resetToDefaults = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      screenReader: false,
      fontSize: 'medium',
      keyboardNavigation: true,
    };
    
    setSettings(defaultSettings);
    saveAccessibilitySettings(defaultSettings);
    applyAccessibilitySettings(defaultSettings);
    announceToScreenReader('Accessibility settings reset to defaults');
  };

  if (!isOpen) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Accessibility Settings
          </h2>
          <p className="text-gray-600 mt-1">
            Customize the app for better accessibility and usability
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Visual Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visual Settings
            </CardTitle>
            <CardDescription>
              Adjust visual appearance for better visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
                <p className="text-sm text-gray-600">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="font-size">Font Size</Label>
                <p className="text-sm text-gray-600">
                  Adjust text size for better readability
                </p>
              </div>
              <Select
                value={settings.fontSize}
                onValueChange={(value) => handleSettingChange('fontSize', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Motion Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="w-5 h-5" />
              Motion Settings
            </CardTitle>
            <CardDescription>
              Control animations and motion effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
                <p className="text-sm text-gray-600">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Screen Reader Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Screen Reader Settings
            </CardTitle>
            <CardDescription>
              Optimize for screen reader users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="screen-reader">Screen Reader Optimization</Label>
                <p className="text-sm text-gray-600">
                  Enhance screen reader compatibility
                </p>
              </div>
              <Switch
                id="screen-reader"
                checked={settings.screenReader}
                onCheckedChange={(checked) => handleSettingChange('screenReader', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Settings
            </CardTitle>
            <CardDescription>
              Configure keyboard navigation options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="keyboard-nav">Enhanced Keyboard Navigation</Label>
                <p className="text-sm text-gray-600">
                  Enable advanced keyboard shortcuts and navigation
                </p>
              </div>
              <Switch
                id="keyboard-nav"
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => handleSettingChange('keyboardNavigation', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={resetToDefaults} variant="outline">
            Reset to Defaults
          </Button>
          <Button onClick={onClose}>
            Save Settings
          </Button>
        </div>

        {/* Keyboard Shortcuts Help */}
        <Card>
          <CardHeader>
            <CardTitle>Keyboard Shortcuts</CardTitle>
            <CardDescription>
              Essential keyboard shortcuts for accessibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Navigation</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Focus next element</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Focus previous element</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Shift + Tab</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Activate focused element</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">App Controls</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Open accessibility panel</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + A</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Focus main content</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Alt + M</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Skip to navigation</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Alt + N</kbd>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
