import { useState, useEffect } from 'react';

export interface ADHDSettings {
  focusMode: boolean;
  visualCalmMode: boolean;
  doNotDisturb: boolean;
  timeAwareness: boolean;
  celebrateCompletions: boolean;
  pomodoroEnabled: boolean;
  focusIntensity: number; // 1-5 scale
  calmIntensity: number; // 1-5 scale
  timeBlockReminders: boolean;
  taskBreakdown: boolean;
  priorityIndicators: boolean;
  leftBorderColors: boolean;
  completionSound: boolean;
  pomodoroWorkDuration: number; // minutes
  pomodoroBreakDuration: number; // minutes
}

const defaultADHDSettings: ADHDSettings = {
  focusMode: false,
  visualCalmMode: false,
  doNotDisturb: false,
  timeAwareness: true,
  celebrateCompletions: true,
  pomodoroEnabled: false,
  focusIntensity: 3,
  calmIntensity: 3,
  timeBlockReminders: true,
  taskBreakdown: true,
  priorityIndicators: false,
  leftBorderColors: false,
  completionSound: false,
  pomodoroWorkDuration: 25,
  pomodoroBreakDuration: 5,
};

export function useADHDSettings() {
  const [settings, setSettings] = useState<ADHDSettings>(defaultADHDSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adhd-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultADHDSettings, ...parsed });
      } catch (error) {
        console.warn('Failed to parse ADHD settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('adhd-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof ADHDSettings>(
    key: K,
    value: ADHDSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(defaultADHDSettings);
  };

  return {
    settings,
    updateSetting,
    resetToDefaults,
  };
}
