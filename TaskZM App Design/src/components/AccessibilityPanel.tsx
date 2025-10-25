import React, { useState, useEffect } from 'react';
import { Settings, Eye, MousePointer, Type, Volume2, Keyboard, Brain, Clock, Zap, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';
import { useAccessibility, AccessibilitySettings } from '../hooks/useAccessibility';
import { useADHDSettings, ADHDSettings } from '../hooks/useADHDSettings';

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

  const {
    settings: adhdSettings,
    updateSetting: updateADHDSetting,
    resetToDefaults: resetADHDDefaults,
  } = useADHDSettings();

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

        {/* ADHD Support Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              ADHD Support
            </CardTitle>
            <CardDescription>
              Features to help with attention, focus, and overwhelm management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Focus Mode */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="focus-mode" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Focus Mode
                </Label>
                <Switch
                  id="focus-mode"
                  checked={adhdSettings.focusMode}
                  onCheckedChange={(checked) => updateADHDSetting('focusMode', checked)}
                />
              </div>
              {adhdSettings.focusMode && (
                <div className="space-y-2">
                  <Label>Focus Intensity</Label>
                  <Slider
                    value={[adhdSettings.focusIntensity]}
                    onValueChange={([value]) => updateADHDSetting('focusIntensity', value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500">
                    {adhdSettings.focusIntensity === 1 && 'Light dimming'}
                    {adhdSettings.focusIntensity === 2 && 'Subtle focus'}
                    {adhdSettings.focusIntensity === 3 && 'Moderate focus'}
                    {adhdSettings.focusIntensity === 4 && 'Strong focus'}
                    {adhdSettings.focusIntensity === 5 && 'Maximum focus'}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Visual Calm Mode */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="calm-mode" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visual Calm Mode
                </Label>
                <Switch
                  id="calm-mode"
                  checked={adhdSettings.visualCalmMode}
                  onCheckedChange={(checked) => updateADHDSetting('visualCalmMode', checked)}
                />
              </div>
              {adhdSettings.visualCalmMode && (
                <div className="space-y-2">
                  <Label>Calm Intensity</Label>
                  <Slider
                    value={[adhdSettings.calmIntensity]}
                    onValueChange={([value]) => updateADHDSetting('calmIntensity', value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500">
                    {adhdSettings.calmIntensity === 1 && 'Minimal changes'}
                    {adhdSettings.calmIntensity === 2 && 'Light calming'}
                    {adhdSettings.calmIntensity === 3 && 'Moderate calming'}
                    {adhdSettings.calmIntensity === 4 && 'Strong calming'}
                    {adhdSettings.calmIntensity === 5 && 'Maximum calming'}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Time Awareness */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="time-awareness" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Awareness Tools
                </Label>
                <Switch
                  id="time-awareness"
                  checked={adhdSettings.timeAwareness}
                  onCheckedChange={(checked) => updateADHDSetting('timeAwareness', checked)}
                />
              </div>
              {adhdSettings.timeAwareness && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="time-reminders">Time Block Reminders</Label>
                    <Switch
                      id="time-reminders"
                      checked={adhdSettings.timeBlockReminders}
                      onCheckedChange={(checked) => updateADHDSetting('timeBlockReminders', checked)}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Pomodoro Timer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="pomodoro" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pomodoro Timer
                </Label>
                <Switch
                  id="pomodoro"
                  checked={adhdSettings.pomodoroEnabled}
                  onCheckedChange={(checked) => updateADHDSetting('pomodoroEnabled', checked)}
                />
              </div>
              {adhdSettings.pomodoroEnabled && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Work Duration (minutes)</Label>
                      <Select
                        value={adhdSettings.pomodoroWorkDuration.toString()}
                        onValueChange={(value) => updateADHDSetting('pomodoroWorkDuration', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="20">20 minutes</SelectItem>
                          <SelectItem value="25">25 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Break Duration (minutes)</Label>
                      <Select
                        value={adhdSettings.pomodoroBreakDuration.toString()}
                        onValueChange={(value) => updateADHDSetting('pomodoroBreakDuration', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 minutes</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Distraction Blocking */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="do-not-disturb" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Do Not Disturb Mode
                </Label>
                <Switch
                  id="do-not-disturb"
                  checked={adhdSettings.doNotDisturb}
                  onCheckedChange={(checked) => updateADHDSetting('doNotDisturb', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Task Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="task-breakdown">Task Breakdown Assistant</Label>
                <Switch
                  id="task-breakdown"
                  checked={adhdSettings.taskBreakdown}
                  onCheckedChange={(checked) => updateADHDSetting('taskBreakdown', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Visual Indicators */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="priority-indicators">Priority Indicators</Label>
                <Switch
                  id="priority-indicators"
                  checked={adhdSettings.priorityIndicators}
                  onCheckedChange={(checked) => updateADHDSetting('priorityIndicators', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="left-border-colors">Left Border Colors</Label>
                <Switch
                  id="left-border-colors"
                  checked={adhdSettings.leftBorderColors}
                  onCheckedChange={(checked) => updateADHDSetting('leftBorderColors', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Completion Celebrations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="celebrations">Completion Celebrations</Label>
                <Switch
                  id="celebrations"
                  checked={adhdSettings.celebrateCompletions}
                  onCheckedChange={(checked) => updateADHDSetting('celebrateCompletions', checked)}
                />
              </div>
              {adhdSettings.celebrateCompletions && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="completion-sound">Completion Sound</Label>
                  <Switch
                    id="completion-sound"
                    checked={adhdSettings.completionSound}
                    onCheckedChange={(checked) => updateADHDSetting('completionSound', checked)}
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Reset Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={resetADHDDefaults}
                className="text-sm"
              >
                Reset ADHD Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
