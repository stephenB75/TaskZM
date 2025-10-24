import { useState, useEffect } from 'react';
import { User, Calendar, Sparkles, Bell, Info, CreditCard, Clock, RotateCcw, Briefcase, Tags } from 'lucide-react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
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
  // User Profile State
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || 'John Doe';
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || 'john.doe@example.com';
  });
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  
  // Calendar Integration State
  const [iCloudConnected, setICloudConnected] = useState(() => {
    return localStorage.getItem('iCloudConnected') === 'true';
  });
  const [googleConnected, setGoogleConnected] = useState(() => {
    return localStorage.getItem('googleConnected') === 'true';
  });
  const [yahooConnected, setYahooConnected] = useState(() => {
    return localStorage.getItem('yahooConnected') === 'true';
  });
  
  // AI Settings State
  const [aiAutoSchedule, setAiAutoSchedule] = useState(() => {
    return localStorage.getItem('aiAutoSchedule') !== 'false';
  });
  const [aiSmartSuggestions, setAiSmartSuggestions] = useState(() => {
    return localStorage.getItem('aiSmartSuggestions') !== 'false';
  });
  const [aiPriorityDetection, setAiPriorityDetection] = useState(() => {
    return localStorage.getItem('aiPriorityDetection') !== 'false';
  });
  
  // Notification State
  const [pushNotifications, setPushNotifications] = useState(() => {
    return localStorage.getItem('pushNotifications') !== 'false';
  });
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('emailNotifications') === 'true';
  });
  const [taskReminders, setTaskReminders] = useState(() => {
    return localStorage.getItem('taskReminders') !== 'false';
  });
  const [dailyDigest, setDailyDigest] = useState(() => {
    return localStorage.getItem('dailyDigest') !== 'false';
  });
  
  // Date/Time State
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(() => {
    return (localStorage.getItem('timeFormat') as '12h' | '24h') || '12h';
  });
  const [dateFormat, setDateFormat] = useState<'US' | 'EU' | 'ISO'>(() => {
    return (localStorage.getItem('dateFormat') as 'US' | 'EU' | 'ISO') || 'US';
  });
  const [timezone, setTimezone] = useState(() => {
    return localStorage.getItem('timezone') || 'America/New_York';
  });
  
  // Task Rollover State
  const [autoRollover, setAutoRollover] = useState(() => {
    return localStorage.getItem('autoRollover') !== 'false';
  });
  const [rolloverTime, setRolloverTime] = useState(() => {
    return localStorage.getItem('rolloverTime') || 'midnight';
  });
  
  // Work Hours State
  const [workHoursEnabled, setWorkHoursEnabled] = useState(() => {
    return localStorage.getItem('workHoursEnabled') !== 'false';
  });
  const [workStartTime, setWorkStartTime] = useState(() => {
    return localStorage.getItem('workStartTime') || '09:00';
  });
  const [workEndTime, setWorkEndTime] = useState(() => {
    return localStorage.getItem('workEndTime') || '17:00';
  });
  const [personalHoursEnabled, setPersonalHoursEnabled] = useState(() => {
    return localStorage.getItem('personalHoursEnabled') === 'true';
  });
  const [personalStartTime, setPersonalStartTime] = useState(() => {
    return localStorage.getItem('personalStartTime') || '18:00';
  });
  const [personalEndTime, setPersonalEndTime] = useState(() => {
    return localStorage.getItem('personalEndTime') || '21:00';
  });
  
  // Subscription State
  const [subscriptionTier, setSubscriptionTier] = useState('pro');
  const [renewalDate, setRenewalDate] = useState('March 15, 2025');
  
  // Save Profile Handler
  const handleSaveProfile = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
    toast.success('Profile saved successfully', {
      description: 'Your profile information has been updated'
    });
  };
  
  // Calendar Connection Handlers
  const handleICloudToggle = (checked: boolean) => {
    setICloudConnected(checked);
    localStorage.setItem('iCloudConnected', checked.toString());
    if (checked) {
      toast.success('iCloud Calendar connected', {
        description: 'Your iCloud calendar is now synced with your tasks'
      });
    } else {
      toast.info('iCloud Calendar disconnected');
    }
  };
  
  const handleGoogleToggle = (checked: boolean) => {
    setGoogleConnected(checked);
    localStorage.setItem('googleConnected', checked.toString());
    if (checked) {
      toast.success('Google Calendar connected', {
        description: 'Your Google calendar is now synced with your tasks'
      });
    } else {
      toast.info('Google Calendar disconnected');
    }
  };
  
  const handleYahooToggle = (checked: boolean) => {
    setYahooConnected(checked);
    localStorage.setItem('yahooConnected', checked.toString());
    if (checked) {
      toast.success('Yahoo Calendar connected', {
        description: 'Your Yahoo calendar is now synced with your tasks'
      });
    } else {
      toast.info('Yahoo Calendar disconnected');
    }
  };
  
  // AI Settings Handlers
  const handleAiAutoScheduleToggle = (checked: boolean) => {
    setAiAutoSchedule(checked);
    localStorage.setItem('aiAutoSchedule', checked.toString());
    toast.success(checked ? 'AI Auto-Schedule enabled' : 'AI Auto-Schedule disabled');
  };
  
  const handleAiSmartSuggestionsToggle = (checked: boolean) => {
    setAiSmartSuggestions(checked);
    localStorage.setItem('aiSmartSuggestions', checked.toString());
    toast.success(checked ? 'Smart Suggestions enabled' : 'Smart Suggestions disabled');
  };
  
  const handleAiPriorityDetectionToggle = (checked: boolean) => {
    setAiPriorityDetection(checked);
    localStorage.setItem('aiPriorityDetection', checked.toString());
    toast.success(checked ? 'Priority Detection enabled' : 'Priority Detection disabled');
  };
  
  // Notification Handlers
  const handlePushNotificationsToggle = (checked: boolean) => {
    setPushNotifications(checked);
    localStorage.setItem('pushNotifications', checked.toString());
    toast.success(checked ? 'Push Notifications enabled' : 'Push Notifications disabled');
  };
  
  const handleEmailNotificationsToggle = (checked: boolean) => {
    setEmailNotifications(checked);
    localStorage.setItem('emailNotifications', checked.toString());
    toast.success(checked ? 'Email Notifications enabled' : 'Email Notifications disabled');
  };
  
  const handleTaskRemindersToggle = (checked: boolean) => {
    setTaskReminders(checked);
    localStorage.setItem('taskReminders', checked.toString());
    toast.success(checked ? 'Task Reminders enabled' : 'Task Reminders disabled');
  };
  
  const handleDailyDigestToggle = (checked: boolean) => {
    setDailyDigest(checked);
    localStorage.setItem('dailyDigest', checked.toString());
    toast.success(checked ? 'Daily Digest enabled' : 'Daily Digest disabled');
  };
  
  // Date/Time Handlers
  const handleTimeFormatChange = (value: '12h' | '24h') => {
    setTimeFormat(value);
    localStorage.setItem('timeFormat', value);
    toast.success('Time format updated', {
      description: `Changed to ${value === '12h' ? '12-hour' : '24-hour'} format`
    });
  };
  
  const handleDateFormatChange = (value: 'US' | 'EU' | 'ISO') => {
    setDateFormat(value);
    localStorage.setItem('dateFormat', value);
    const formatName = value === 'US' ? 'MM/DD/YYYY' : value === 'EU' ? 'DD/MM/YYYY' : 'YYYY-MM-DD';
    toast.success('Date format updated', {
      description: `Changed to ${formatName}`
    });
  };
  
  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    localStorage.setItem('timezone', value);
    toast.success('Timezone updated', {
      description: `Timezone changed to ${value.split('/')[1]?.replace('_', ' ')}`
    });
  };
  
  // Task Rollover Handlers
  const handleAutoRolloverToggle = (checked: boolean) => {
    setAutoRollover(checked);
    localStorage.setItem('autoRollover', checked.toString());
    toast.success(checked ? 'Auto Rollover enabled' : 'Auto Rollover disabled', {
      description: checked ? 'Incomplete tasks will move to the next day' : 'Tasks will stay on their assigned day'
    });
  };
  
  const handleRolloverTimeChange = (value: string) => {
    setRolloverTime(value);
    localStorage.setItem('rolloverTime', value);
    toast.success('Rollover time updated');
  };
  
  // Work Hours Handlers
  const handleWorkHoursToggle = (checked: boolean) => {
    setWorkHoursEnabled(checked);
    localStorage.setItem('workHoursEnabled', checked.toString());
    toast.success(checked ? 'Work Hours enabled' : 'Work Hours disabled');
  };
  
  const handleWorkStartTimeChange = (value: string) => {
    setWorkStartTime(value);
    localStorage.setItem('workStartTime', value);
  };
  
  const handleWorkEndTimeChange = (value: string) => {
    setWorkEndTime(value);
    localStorage.setItem('workEndTime', value);
  };
  
  const handlePersonalHoursToggle = (checked: boolean) => {
    setPersonalHoursEnabled(checked);
    localStorage.setItem('personalHoursEnabled', checked.toString());
    toast.success(checked ? 'Personal Hours enabled' : 'Personal Hours disabled');
  };
  
  const handlePersonalStartTimeChange = (value: string) => {
    setPersonalStartTime(value);
    localStorage.setItem('personalStartTime', value);
  };
  
  const handlePersonalEndTimeChange = (value: string) => {
    setPersonalEndTime(value);
    localStorage.setItem('personalEndTime', value);
  };
  
  // Subscription Handlers
  const handleManageSubscription = () => {
    toast.info('Opening subscription management', {
      description: 'This would open your subscription settings in the App Store'
    });
  };
  
  // About Handlers
  const handlePrivacyPolicy = () => {
    toast.info('Privacy Policy', {
      description: 'This would open the privacy policy page'
    });
  };
  
  const handleTermsOfService = () => {
    toast.info('Terms of Service', {
      description: 'This would open the terms of service page'
    });
  };
  
  const handleHelpSupport = () => {
    toast.info('Help & Support', {
      description: 'This would open the help center'
    });
  };
  
  const handleChangePhoto = () => {
    toast.info('Change Photo', {
      description: 'This would open the photo picker'
    });
  };

  return (
    <div className="w-full md:w-[380px] h-screen flex-shrink-0 bg-[#e9f7e9] md:border-l border-[#e3e3e3] flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#e3e3e3]">
        <h2 className="font-['DM_Sans:Bold',_sans-serif] text-[18px] text-[#313131]">
          Settings
        </h2>
        <p className="text-[12px] text-[#828282] mt-1">
          Customize your task manager
        </p>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" defaultValue={['profile', 'ai']} className="w-full">
          {/* User Profile Settings */}
          <AccordionItem value="profile" className="border-b border-[#e3e3e3] px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#3300ff]" />
                <span className="font-['DM_Sans:Medium',_sans-serif] text-[14px] text-[#313131]">
                  User Profile
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} />
                  <AvatarFallback>{userName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="text-[12px] h-8" onClick={handleChangePhoto}>
                  Change Photo
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-name" className="text-[13px] text-[#313131]">
                  Name
                </Label>
                <Input
                  id="user-name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="h-9 text-[13px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-email" className="text-[13px] text-[#313131]">
                  Email
                </Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="h-9 text-[13px]"
                />
              </div>
              
              <Button className="w-full bg-[#3300ff] hover:bg-[#2200cc] h-9 text-[13px]" onClick={handleSaveProfile}>
                Save Profile
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Calendar Integration */}
          <AccordionItem value="calendar" className="border-b border-[#e3e3e3] px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#3300ff]" />
                <span className="font-['DM_Sans:Medium',_sans-serif] text-[14px] text-[#313131]">
                  Calendar Integration
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <p className="text-[12px] text-[#828282] mb-3">
                Connect your calendars to sync tasks and events
              </p>
              
              {/* iCloud */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0071e3] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.9 10.9c-.1-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.6-.2-3.2.9-4 .9-.9 0-2.2-.9-3.6-.9-1.9 0-3.6 1.1-4.5 2.7-2 3.4-.5 8.5 1.4 11.3 1 1.4 2.1 2.9 3.6 2.8 1.4-.1 2-.9 3.6-.9 1.6 0 2.1.9 3.6.9 1.5 0 2.5-1.3 3.5-2.7 1.1-1.6 1.6-3.1 1.6-3.2-.1 0-3.1-1.2-3.2-4.7zM15.5 3.7c.8-1 1.4-2.4 1.2-3.7-1.2 0-2.7.8-3.5 1.8-.7.8-1.4 2.2-1.2 3.5 1.3.1 2.7-.7 3.5-1.6z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#313131] font-medium">iCloud Calendar</p>
                    <p className="text-[11px] text-[#828282]">
                      {iCloudConnected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={iCloudConnected}
                  onCheckedChange={handleICloudToggle}
                />
              </div>
              
              {/* Google Calendar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#e3e3e3] flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#313131] font-medium">Google Calendar</p>
                    <p className="text-[11px] text-[#828282]">
                      {googleConnected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={googleConnected}
                  onCheckedChange={handleGoogleToggle}
                />
              </div>
              
              {/* Yahoo Calendar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6001d2] flex items-center justify-center">
                    <span className="text-white font-bold text-[14px]">Y!</span>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#313131] font-medium">Yahoo Calendar</p>
                    <p className="text-[11px] text-[#828282]">
                      {yahooConnected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={yahooConnected}
                  onCheckedChange={handleYahooToggle}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Tags Management */}
          <AccordionItem value="tags" className="border-b border-[#e3e3e3] px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Tags className="w-4 h-4 text-[#3300ff]" />
                <span className="font-['DM_Sans:Medium',_sans-serif] text-[14px] text-[#313131]">
                  Tags Management
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <p className="text-[12px] text-[#828282] mb-3">
                Create and organize tags for your tasks
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-[13px] text-[#313131]">
                    Available Tags ({availableTags.length})
                  </Label>
                </div>
                
                {availableTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 bg-[#f8f9fa] rounded-lg">
                    {availableTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="px-3 py-1 rounded text-xs"
                        style={{
                          backgroundColor: tag.bgColor,
                          color: tag.textColor,
                          fontWeight: tag.fontWeight === 'bold' ? 'bold' : '500'
                        }}
                      >
                        {tag.text}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-[#f8f9fa] rounded-lg text-center">
                    <p className="text-[12px] text-[#828282]">No tags created yet</p>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full bg-[#3300ff] hover:bg-[#2200cc] h-9 text-[13px]"
                onClick={() => setIsTagManagerOpen(true)}
              >
                <Tags className="w-4 h-4 mr-2" />
                Manage Tags
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* AI Settings */}
          <AccordionItem value="ai" className="border-b border-[#e3e3e3] px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#3300ff]" />
                <span className="font-['DM_Sans:Medium',_sans-serif] text-[14px] text-[#313131]">
                  AI Settings
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              {/* Tasks Per Day Limit */}
              <div className="space-y-2">
                <Label htmlFor="tasks-limit" className="text-[13px] text-[#313131]">
                  Tasks Per Day Limit
                </Label>
                <Select 
                  value={tasksPerDayLimit.toString()} 
                  onValueChange={(value) => onTasksPerDayLimitChange(parseInt(value))}
                >
                  <SelectTrigger id="tasks-limit" className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 tasks</SelectItem>
                    <SelectItem value="5">5 tasks</SelectItem>
                    <SelectItem value="6">6 tasks (recommended)</SelectItem>
                    <SelectItem value="7">7 tasks</SelectItem>
                    <SelectItem value="8">8 tasks</SelectItem>
                    <SelectItem value="10">10 tasks</SelectItem>
                    <SelectItem value="12">12 tasks</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-[#828282]">
                  AI will schedule up to {tasksPerDayLimit} tasks per day
                </p>
              </div>
              
              <Separator />
              
              {/* AI Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-[#313131] font-medium">Auto-Schedule</p>
                    <p className="text-[11px] text-[#828282]">Automatically schedule new tasks</p>
                  </div>
                  <Switch
                    checked={aiAutoSchedule}
                    onCheckedChange={handleAiAutoScheduleToggle}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-[#313131] font-medium">Smart Suggestions</p>
                    <p className="text-[11px] text-[#828282]">Get AI-powered task suggestions</p>
                  </div>
                  <Switch
                    checked={aiSmartSuggestions}
                    onCheckedChange={handleAiSmartSuggestionsToggle}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-[#313131] font-medium">Priority Detection</p>
                    <p className="text-[11px] text-[#828282]">Auto-detect task priority</p>
                  </div>
                  <Switch
                    checked={aiPriorityDetection}
                    onCheckedChange={handleAiPriorityDetectionToggle}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Notifications */}
          <AccordionItem value="notifications" className="border-b border-[#e3e3e3] px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[#3300ff]" />
                <span className="font-['DM_Sans:Medium',_sans-serif] text-[14px] text-[#313131]">
                  Notifications
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#313131] font-medium">Push Notifications</p>
                  <p className="text-[11px] text-[#828282]">Receive in-app notifications</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={handlePushNotificationsToggle}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#313131] font-medium">Email Notifications</p>
                  <p className="text-[11px] text-[#828282]">Get updates via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={handleEmailNotificationsToggle}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#313131] font-medium">Task Reminders</p>
                  <p className="text-[11px] text-[#828282]">Reminders before due dates</p>
                </div>
                <Switch
                  checked={taskReminders}
                  onCheckedChange={handleTaskRemindersToggle}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#313131] font-medium">Daily Digest</p>
                  <p className="text-[11px] text-[#828282]">Daily summary of tasks</p>
                </div>
                <Switch
                  checked={dailyDigest}
                  onCheckedChange={handleDailyDigestToggle}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Date & Time */}
          <AccordionItem value="datetime" className="border-b border-[#e3e3e3] px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#3300ff]" />
                <span className="font-['DM_Sans:Medium',_sans-serif] text-[14px] text-[#313131]">
                  Date & Time
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="week-start-mode" className="text-[13px] text-[#313131]">
                  Week Start
                </Label>
                <Select value={weekStartMode} onValueChange={onWeekStartModeChange}>
                  <SelectTrigger id="week-start-mode" className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Day (Rolling 7 days)</SelectItem>
                    <SelectItem value="monday">Monday (Calendar Week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-format" className="text-[13px] text-[#313131]">
                  Time Format
                </Label>
                <Select value={timeFormat} onValueChange={handleTimeFormatChange}>
                  <SelectTrigger id="time-format" className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (14:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-format" className="text-[13px] text-[#313131]">
                  Date Format
                </Label>
                <Select value={dateFormat} onValueChange={handleDateFormatChange}>
                  <SelectTrigger id="date-format" className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">US (MM/DD/YYYY)</SelectItem>
                    <SelectItem value="EU">European (DD/MM/YYYY)</SelectItem>
                    <SelectItem value="ISO">ISO (YYYY-MM-DD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-[13px] text-[#313131]">
                  Time Zone
                </Label>
                <Select value={timezone} onValueChange={handleTimezoneChange}>
                  <SelectTrigger id="timezone" className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Task Rollover */}
          <AccordionItem value="rollover" className="border-b border-[#e3e3e3] px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-[#3300ff]" />
                <span className="font-['DM_Sans:Medium',_sans-serif] text-[14px] text-[#313131]">
                  Task Rollover
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#313131] font-medium">Auto Rollover</p>
                  <p className="text-[11px] text-[#828282]">Move incomplete tasks to next day</p>
                </div>
                <Switch
                  checked={autoRollover}
                  onCheckedChange={handleAutoRolloverToggle}
                />
              </div>
              
              {autoRollover && (
                <div className="space-y-2">
                  <Label htmlFor="rollover-time" className="text-[13px] text-[#313131]">
                    Rollover Time
                  </Label>
                  <Select value={rolloverTime} onValueChange={handleRolloverTimeChange}>
                    <SelectTrigger id="rollover-time" className="w-full h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midnight">Midnight (12:00 AM)</SelectItem>
                      <SelectItem value="early-morning">Early Morning (6:00 AM)</SelectItem>
                      <SelectItem value="morning">Morning (9:00 AM)</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-[#828282]">
                    When to automatically move unfinished tasks
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Work/Personal Hours */}
          <AccordionItem value="hours" className="border-b border-[#e3e3e3] px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-[#3300ff]" />
                <span className="font-['DM_Sans:Medium',_sans-serif] text-[14px] text-[#313131]">
                  Work & Personal Hours
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              {/* Work Hours */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#313131] font-medium">Work Hours</p>
                  <Switch
                    checked={workHoursEnabled}
                    onCheckedChange={handleWorkHoursToggle}
                  />
                </div>
                
                {workHoursEnabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="work-start" className="text-[12px] text-[#828282]">
                        Start Time
                      </Label>
                      <Input
                        id="work-start"
                        type="time"
                        value={workStartTime}
                        onChange={(e) => handleWorkStartTimeChange(e.target.value)}
                        className="h-9 text-[13px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="work-end" className="text-[12px] text-[#828282]">
                        End Time
                      </Label>
                      <Input
                        id="work-end"
                        type="time"
                        value={workEndTime}
                        onChange={(e) => handleWorkEndTimeChange(e.target.value)}
                        className="h-9 text-[13px]"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Personal Hours */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#313131] font-medium">Personal Hours</p>
                  <Switch
                    checked={personalHoursEnabled}
                    onCheckedChange={handlePersonalHoursToggle}
                  />
                </div>
                
                {personalHoursEnabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="personal-start" className="text-[12px] text-[#828282]">
                        Start Time
                      </Label>
                      <Input
                        id="personal-start"
                        type="time"
                        value={personalStartTime}
                        onChange={(e) => handlePersonalStartTimeChange(e.target.value)}
                        className="h-9 text-[13px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personal-end" className="text-[12px] text-[#828282]">
                        End Time
                      </Label>
                      <Input
                        id="personal-end"
                        type="time"
                        value={personalEndTime}
                        onChange={(e) => handlePersonalEndTimeChange(e.target.value)}
                        className="h-9 text-[13px]"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-[11px] text-[#828282] pt-2">
                AI will prioritize work tasks during work hours and personal tasks during personal hours
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Subscription */}
          <AccordionItem value="subscription" className="border-b border-[#e3e3e3] px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-[#3300ff]" />
                <span className="font-['DM_Sans:Medium',_sans-serif] text-[14px] text-[#313131]">
                  Subscription
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="bg-gradient-to-br from-[#3300ff] to-[#5522ff] rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[16px] font-bold">Pro Plan</p>
                    <p className="text-[12px] opacity-90">Billed via Apple</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.9 10.9c-.1-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.6-.2-3.2.9-4 .9-.9 0-2.2-.9-3.6-.9-1.9 0-3.6 1.1-4.5 2.7-2 3.4-.5 8.5 1.4 11.3 1 1.4 2.1 2.9 3.6 2.8 1.4-.1 2-.9 3.6-.9 1.6 0 2.1.9 3.6.9 1.5 0 2.5-1.3 3.5-2.7 1.1-1.6 1.6-3.1 1.6-3.2-.1 0-3.1-1.2-3.2-4.7zM15.5 3.7c.8-1 1.4-2.4 1.2-3.7-1.2 0-2.7.8-3.5 1.8-.7.8-1.4 2.2-1.2 3.5 1.3.1 2.7-.7 3.5-1.6z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[28px] font-bold">$9.99</span>
                  <span className="text-[14px] opacity-90">/month</span>
                </div>
                <p className="text-[11px] opacity-80">Renews on {renewalDate}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-[12px] font-medium text-[#313131]">Plan Features:</p>
                <ul className="space-y-1 text-[12px] text-[#828282]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#3300ff]">✓</span> Unlimited tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#3300ff]">✓</span> AI scheduling & suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#3300ff]">✓</span> Calendar integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#3300ff]">✓</span> Priority support
                  </li>
                </ul>
              </div>
              
              <Button variant="outline" className="w-full h-9 text-[13px]" onClick={handleManageSubscription}>
                Manage Subscription
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* About */}
          <AccordionItem value="about" className="px-6 border-none">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-[#3300ff]" />
                <span className="font-['DM_Sans:Medium',_sans-serif] text-[14px] text-[#313131]">
                  About
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-3">
              <div className="space-y-1 text-[12px] text-[#828282]">
                <p className="text-[#313131] font-medium">Task Manager v1.4.0</p>
                <p>Built with React & Tailwind CSS</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start h-9 text-[13px] text-[#313131]" onClick={handlePrivacyPolicy}>
                  Privacy Policy
                </Button>
                <Button variant="ghost" className="w-full justify-start h-9 text-[13px] text-[#313131]" onClick={handleTermsOfService}>
                  Terms of Service
                </Button>
                <Button variant="ghost" className="w-full justify-start h-9 text-[13px] text-[#313131]" onClick={handleHelpSupport}>
                  Help & Support
                </Button>
              </div>
              
              <Separator />
              
              <p className="text-[11px] text-[#828282] text-center pt-2">
                © 2025 Task Manager. All rights reserved.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Tag Manager Modal */}
      {onAddTag && onEditTag && onDeleteTag && (
        <TagManager
          isOpen={isTagManagerOpen}
          onClose={() => setIsTagManagerOpen(false)}
          tags={availableTags}
          onAddTag={onAddTag}
          onEditTag={onEditTag}
          onDeleteTag={onDeleteTag}
        />
      )}
    </div>
  );
}
