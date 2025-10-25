import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Clock, Eye, Brain, Tags, Palette, Shield, CreditCard } from 'lucide-react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import TagManager, { TagDefinition } from './TagManager';
import { toast } from 'sonner';

interface SettingsPanelProps {
  tasksPerDayLimit: number;
  onTasksPerDayLimitChange: (limit: number) => void;
  weekStartMode: 'current' | 'monday';
  onWeekStartModeChange: (mode: 'current' | 'monday') => void;
  availableTags?: TagDefinition[];
  onAddTag?: (tag: Omit<TagDefinition, 'id'>) => void;
  onEditTag?: (id: string, tag: Omit<TagDefinition, 'id'>) => void;
  onDeleteTag?: (id: string) => void;
}

export default function SettingsPanel({
  tasksPerDayLimit,
  onTasksPerDayLimitChange,
  weekStartMode,
  onWeekStartModeChange,
  availableTags = [],
  onAddTag,
  onEditTag,
  onDeleteTag,
}: SettingsPanelProps) {
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  
  // User Profile State
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || 'John Doe';
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || 'john.doe@example.com';
  });
  
  // Notification Settings
  const [pushNotifications, setPushNotifications] = useState(() => {
    return localStorage.getItem('pushNotifications') !== 'false';
  });
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('emailNotifications') === 'true';
  });
  const [taskReminders, setTaskReminders] = useState(() => {
    return localStorage.getItem('taskReminders') !== 'false';
  });
  
  // Date/Time Settings
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(() => {
    return (localStorage.getItem('timeFormat') as '12h' | '24h') || '12h';
  });
  const [dateFormat, setDateFormat] = useState<'US' | 'EU' | 'ISO'>(() => {
    return (localStorage.getItem('dateFormat') as 'US' | 'EU' | 'ISO') || 'US';
  });
  
  // Work Hours Settings
  const [workHoursEnabled, setWorkHoursEnabled] = useState(() => {
    return localStorage.getItem('workHoursEnabled') !== 'false';
  });
  const [workStartTime, setWorkStartTime] = useState(() => {
    return localStorage.getItem('workStartTime') || '09:00';
  });
  const [workEndTime, setWorkEndTime] = useState(() => {
    return localStorage.getItem('workEndTime') || '17:00';
  });
  
  // ADHD Accessibility Settings
  const [focusMode, setFocusMode] = useState(() => {
    return localStorage.getItem('focusMode') === 'true';
  });
  const [visualCalmMode, setVisualCalmMode] = useState(() => {
    return localStorage.getItem('visualCalmMode') === 'true';
  });
  const [timeAwareness, setTimeAwareness] = useState(() => {
    return localStorage.getItem('timeAwareness') !== 'false';
  });
  const [doNotDisturb, setDoNotDisturb] = useState(() => {
    return localStorage.getItem('doNotDisturb') === 'true';
  });
  const [celebrateCompletions, setCelebrateCompletions] = useState(() => {
    return localStorage.getItem('celebrateCompletions') !== 'false';
  });
  const [pomodoroEnabled, setPomodoroEnabled] = useState(() => {
    return localStorage.getItem('pomodoroEnabled') === 'true';
  });
  
  // Theme Settings
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  // Data & Privacy Settings
  const [dataSharing, setDataSharing] = useState(() => {
    return localStorage.getItem('dataSharing') !== 'false';
  });
  const [analytics, setAnalytics] = useState(() => {
    return localStorage.getItem('analytics') !== 'false';
  });

  // Status indicator for debugging
  const [settingsStatus, setSettingsStatus] = useState('Ready');

  const handleSave = () => {
    setSettingsStatus('Saving...');
    console.log('Saving settings...', { 
      focusMode, 
      visualCalmMode, 
      doNotDisturb, 
      theme,
      pushNotifications,
      emailNotifications,
      taskReminders
    });
    
    // Save all settings to localStorage
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('pushNotifications', pushNotifications.toString());
    localStorage.setItem('emailNotifications', emailNotifications.toString());
    localStorage.setItem('taskReminders', taskReminders.toString());
    localStorage.setItem('timeFormat', timeFormat);
    localStorage.setItem('dateFormat', dateFormat);
    localStorage.setItem('workHoursEnabled', workHoursEnabled.toString());
    localStorage.setItem('workStartTime', workStartTime);
    localStorage.setItem('workEndTime', workEndTime);
    localStorage.setItem('focusMode', focusMode.toString());
    localStorage.setItem('visualCalmMode', visualCalmMode.toString());
    localStorage.setItem('timeAwareness', timeAwareness.toString());
    localStorage.setItem('doNotDisturb', doNotDisturb.toString());
    localStorage.setItem('celebrateCompletions', celebrateCompletions.toString());
    localStorage.setItem('pomodoroEnabled', pomodoroEnabled.toString());
    localStorage.setItem('theme', theme);
    localStorage.setItem('dataSharing', dataSharing.toString());
    localStorage.setItem('analytics', analytics.toString());
    
    // Apply settings immediately
    applySettings();
    
    setSettingsStatus('Settings saved!');
    toast.success('Settings saved successfully');
    
    // Reset status after 2 seconds
    setTimeout(() => setSettingsStatus('Ready'), 2000);
  };

  const applySettings = () => {
    console.log('Applying settings...', { focusMode, visualCalmMode, doNotDisturb, theme });
    
    // Apply theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply ADHD settings to app container
    const appContainer = document.querySelector('.min-h-screen');
    if (appContainer) {
      appContainer.classList.toggle('focus-mode', focusMode);
      appContainer.classList.toggle('calm-mode', visualCalmMode);
      appContainer.classList.toggle('do-not-disturb', doNotDisturb);
    }

    // Apply time format globally
    document.documentElement.setAttribute('data-time-format', timeFormat);
    document.documentElement.setAttribute('data-date-format', dateFormat);

    // Apply work hours
    document.documentElement.setAttribute('data-work-hours-enabled', workHoursEnabled.toString());
    if (workHoursEnabled) {
      document.documentElement.setAttribute('data-work-start', workStartTime);
      document.documentElement.setAttribute('data-work-end', workEndTime);
    }

    // Apply notification settings
    document.documentElement.setAttribute('data-push-notifications', pushNotifications.toString());
    document.documentElement.setAttribute('data-email-notifications', emailNotifications.toString());
    document.documentElement.setAttribute('data-task-reminders', taskReminders.toString());

    // Apply ADHD accessibility settings
    document.documentElement.setAttribute('data-time-awareness', timeAwareness.toString());
    document.documentElement.setAttribute('data-celebrate-completions', celebrateCompletions.toString());
    document.documentElement.setAttribute('data-pomodoro-enabled', pomodoroEnabled.toString());

    // Apply privacy settings
    document.documentElement.setAttribute('data-data-sharing', dataSharing.toString());
    document.documentElement.setAttribute('data-analytics', analytics.toString());
  };

  // Apply settings on component mount
  useEffect(() => {
    applySettings();
  }, [focusMode, visualCalmMode, doNotDisturb, theme, timeFormat, dateFormat, workHoursEnabled, workStartTime, workEndTime, pushNotifications, emailNotifications, taskReminders, timeAwareness, celebrateCompletions, pomodoroEnabled, dataSharing, analytics]);

  // Handle individual setting changes
  const handleNotificationChange = (type: string, value: boolean) => {
    console.log(`Notification change: ${type} = ${value}`);
    setSettingsStatus(`Updated ${type} notification`);
    switch (type) {
      case 'push':
        setPushNotifications(value);
        break;
      case 'email':
        setEmailNotifications(value);
        break;
      case 'reminders':
        setTaskReminders(value);
        break;
    }
    // Reset status after 1 second
    setTimeout(() => setSettingsStatus('Ready'), 1000);
  };

  const handleADHDSettingChange = (type: string, value: boolean) => {
    console.log(`ADHD setting change: ${type} = ${value}`);
    setSettingsStatus(`Updated ${type} setting`);
    switch (type) {
      case 'focus':
        setFocusMode(value);
        break;
      case 'calm':
        setVisualCalmMode(value);
        break;
      case 'time':
        setTimeAwareness(value);
        break;
      case 'disturb':
        setDoNotDisturb(value);
        break;
      case 'celebrate':
        setCelebrateCompletions(value);
        break;
      case 'pomodoro':
        setPomodoroEnabled(value);
        break;
    }
    // Reset status after 1 second
    setTimeout(() => setSettingsStatus('Ready'), 1000);
  };

  const handlePrivacyChange = (type: string, value: boolean) => {
    switch (type) {
      case 'data':
        setDataSharing(value);
        break;
      case 'analytics':
        setAnalytics(value);
        break;
    }
  };

  // Handle theme change with immediate application
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // Apply theme immediately
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Handle time format change with immediate application
  const handleTimeFormatChange = (newFormat: string) => {
    setTimeFormat(newFormat as '12h' | '24h');
    document.documentElement.setAttribute('data-time-format', newFormat);
  };

  // Handle date format change with immediate application
  const handleDateFormatChange = (newFormat: string) => {
    setDateFormat(newFormat as 'US' | 'EU' | 'ISO');
    document.documentElement.setAttribute('data-date-format', newFormat);
  };

  // Reset to defaults
  const handleReset = () => {
    setUserName('John Doe');
    setUserEmail('john.doe@example.com');
    setPushNotifications(true);
    setEmailNotifications(false);
    setTaskReminders(true);
    setTimeFormat('12h');
    setDateFormat('US');
    setWorkHoursEnabled(false);
    setWorkStartTime('09:00');
    setWorkEndTime('17:00');
    setFocusMode(false);
    setVisualCalmMode(false);
    setTimeAwareness(true);
    setDoNotDisturb(false);
    setCelebrateCompletions(true);
    setPomodoroEnabled(false);
    setTheme('light');
    setDataSharing(true);
    setAnalytics(true);
    
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="w-full md:w-[315px] h-full md:h-screen bg-white md:border-l border-[#e5e7eb] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#3300ff]/10 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#3300ff]" />
          </div>
          <div>
            <h2 className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[20px] relative shrink-0 text-[#313131] text-[18px]"
                style={{ fontVariationSettings: "'opsz' 14" }}>
          Settings
        </h2>
            <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[13px] relative shrink-0 text-[#828282] text-[10px]"
               style={{ fontVariationSettings: "'opsz' 14" }}>
              Customize your workflow
        </p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <Accordion type="multiple" className="w-full">
          {/* User Profile */}
          <AccordionItem value="user-profile">
            <AccordionTrigger className="flex items-center gap-2 text-[15px] font-medium text-[#313131]">
                <User className="w-4 h-4 text-[#3300ff]" />
                  User Profile
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <div>
                <Label className="text-[12px] text-[#828282]">Name</Label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-[12px] text-[#828282]">Email</Label>
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Core Settings */}
          <AccordionItem value="core-settings">
            <AccordionTrigger className="flex items-center gap-2 text-[15px] font-medium text-[#313131]">
              <Settings className="w-4 h-4 text-[#3300ff]" />
              Core Settings
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
                  <div>
                <Label className="text-[12px] text-[#828282]">Tasks per day limit</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={tasksPerDayLimit}
                  onChange={(e) => onTasksPerDayLimitChange(parseInt(e.target.value) || 6)}
                  className="w-full"
                />
                  </div>
                  <div>
                <Label className="text-[12px] text-[#828282]">Week start mode</Label>
                <Select value={weekStartMode} onValueChange={onWeekStartModeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current day</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Notifications */}
          <AccordionItem value="notifications">
            <AccordionTrigger className="flex items-center gap-2 text-[15px] font-medium text-[#313131]">
                <Bell className="w-4 h-4 text-[#3300ff]" />
                  Notifications
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Push notifications</Label>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={(value) => handleNotificationChange('push', value)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Email notifications</Label>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(value) => handleNotificationChange('email', value)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Task reminders</Label>
                <Switch
                  checked={taskReminders}
                  onCheckedChange={(value) => handleNotificationChange('reminders', value)} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Date & Time */}
          <AccordionItem value="date-time">
            <AccordionTrigger className="flex items-center gap-2 text-[15px] font-medium text-[#313131]">
                <Clock className="w-4 h-4 text-[#3300ff]" />
                  Date & Time
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <div>
                <Label className="text-[12px] text-[#828282]">Time format</Label>
                <Select value={timeFormat} onValueChange={handleTimeFormatChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[12px] text-[#828282]">Date format</Label>
                <Select value={dateFormat} onValueChange={handleDateFormatChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">MM/DD/YYYY</SelectItem>
                    <SelectItem value="EU">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ISO">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Work Hours */}
          <AccordionItem value="work-hours">
            <AccordionTrigger className="flex items-center gap-2 text-[15px] font-medium text-[#313131]">
              <Clock className="w-4 h-4 text-[#3300ff]" />
              Work Hours
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Enable work hours</Label>
                <Switch checked={workHoursEnabled} onCheckedChange={(value) => {
                  setWorkHoursEnabled(value);
                  if (!value) {
                    setWorkStartTime('09:00');
                    setWorkEndTime('17:00');
                  }
                }} />
              </div>
                {workHoursEnabled && (
                <>
                  <div>
                    <Label className="text-[12px] text-[#828282]">Start time</Label>
                      <Input
                        type="time"
                        value={workStartTime}
                      onChange={(e) => setWorkStartTime(e.target.value)}
                      className="w-full"
                      />
                    </div>
                  <div>
                    <Label className="text-[12px] text-[#828282]">End time</Label>
                      <Input
                        type="time"
                        value={workEndTime}
                      onChange={(e) => setWorkEndTime(e.target.value)}
                      className="w-full"
                      />
                  </div>
                </>
                )}
            </AccordionContent>
          </AccordionItem>
          {/* ADHD Support */}
          <AccordionItem value="adhd-support">
            <AccordionTrigger className="flex items-center gap-2 text-[15px] font-medium text-[#313131]">
              <Brain className="w-4 h-4 text-[#3300ff]" />
              ADHD Support
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Focus mode</Label>
                <Switch
                  checked={focusMode} 
                  onCheckedChange={(value) => handleADHDSettingChange('focus', value)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Visual calm mode</Label>
                <Switch checked={visualCalmMode} onCheckedChange={(value) => handleADHDSettingChange('calm', value)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Time awareness</Label>
                <Switch checked={timeAwareness} onCheckedChange={(value) => handleADHDSettingChange('time', value)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Do not disturb</Label>
                <Switch checked={doNotDisturb} onCheckedChange={(value) => handleADHDSettingChange('disturb', value)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Celebrate completions</Label>
                <Switch checked={celebrateCompletions} onCheckedChange={(value) => handleADHDSettingChange('celebrate', value)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Pomodoro timer</Label>
                <Switch checked={pomodoroEnabled} onCheckedChange={(value) => handleADHDSettingChange('pomodoro', value)} />
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Tag Management */}
          <AccordionItem value="tag-management">
            <AccordionTrigger className="flex items-center gap-2 text-[15px] font-medium text-[#313131]">
              <Tags className="w-4 h-4 text-[#3300ff]" />
              Tag Management
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <Button
                onClick={() => setIsTagManagerOpen(true)}
                variant="outline"
                className="w-full justify-start"
              >
                <Tags className="w-4 h-4 mr-2" />
                Manage tags ({availableTags.length})
              </Button>
            </AccordionContent>
          </AccordionItem>
          {/* Theme */}
          <AccordionItem value="theme">
            <AccordionTrigger className="flex items-center gap-2 text-[15px] font-medium text-[#313131]">
              <Palette className="w-4 h-4 text-[#3300ff]" />
              Theme
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
          {/* Data & Privacy */}
          <AccordionItem value="data-privacy">
            <AccordionTrigger className="flex items-center gap-2 text-[15px] font-medium text-[#313131]">
              <Shield className="w-4 h-4 text-[#3300ff]" />
              Data & Privacy
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Data sharing</Label>
                <Switch checked={dataSharing} onCheckedChange={(value) => handlePrivacyChange('data', value)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">Analytics</Label>
                <Switch checked={analytics} onCheckedChange={(value) => handlePrivacyChange('analytics', value)} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Status Indicator */}
        <div className="text-center text-sm text-gray-500 mb-3 mt-6">
          Status: {settingsStatus}
        </div>
        
        {/* Debug Info - Remove in production */}
        <div className="text-xs text-gray-400 mb-2 p-2 bg-gray-50 rounded">
          <div>Push: {pushNotifications ? 'ON' : 'OFF'}</div>
          <div>Email: {emailNotifications ? 'ON' : 'OFF'}</div>
          <div>Focus: {focusMode ? 'ON' : 'OFF'}</div>
          <div>Calm: {visualCalmMode ? 'ON' : 'OFF'}</div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
          <Button onClick={handleReset} variant="outline" className="w-full">
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Tag Manager Modal */}
      {isTagManagerOpen && (
        <TagManager
          isOpen={isTagManagerOpen}
          tags={availableTags}
          onAddTag={onAddTag || (() => {})}
          onEditTag={onEditTag || (() => {})}
          onDeleteTag={onDeleteTag || (() => {})}
          onClose={() => setIsTagManagerOpen(false)}
        />
      )}
    </div>
  );
}