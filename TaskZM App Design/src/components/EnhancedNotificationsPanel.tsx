import React, { useState, useEffect } from 'react';
import { Bell, Settings, Clock, Trash2, Check, AlertCircle, CheckCircle, Info, Zap } from 'lucide-react';
import { notificationService, Notification, NotificationSettings } from '../lib/notifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface EnhancedNotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnhancedNotificationsPanel({ isOpen, onClose }: EnhancedNotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(notificationService.getSettings());
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      loadSettings();
    }
  }, [isOpen]);

  const loadNotifications = () => {
    const allNotifications = notificationService.getNotifications();
    setNotifications(allNotifications);
  };

  const loadSettings = () => {
    const currentSettings = notificationService.getSettings();
    setSettings(currentSettings);
  };

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
    loadNotifications();
    toast.success('All notifications marked as read');
  };

  const handleSnooze = (notificationId: string, minutes: number) => {
    notificationService.snoozeNotification(notificationId, minutes);
    loadNotifications();
    toast.success(`Notification snoozed for ${minutes} minutes`);
  };

  const handleDelete = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
    loadNotifications();
    toast.success('Notification deleted');
  };

  const handleClearAll = () => {
    notificationService.clearAllNotifications();
    loadNotifications();
    toast.success('All notifications cleared');
  };

  const handleSettingsChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    notificationService.updateSettings(newSettings);
  };

  const handleReminderTimeChange = (index: number, value: string) => {
    const newReminderTimes = [...settings.reminderTimes.beforeDue];
    newReminderTimes[index] = parseInt(value) || 0;
    handleSettingsChange('reminderTimes', { ...settings.reminderTimes, beforeDue: newReminderTimes });
  };

  const addReminderTime = () => {
    const newReminderTimes = [...settings.reminderTimes.beforeDue, 30];
    handleSettingsChange('reminderTimes', { ...settings.reminderTimes, beforeDue: newReminderTimes });
  };

  const removeReminderTime = (index: number) => {
    const newReminderTimes = settings.reminderTimes.beforeDue.filter((_, i) => i !== index);
    handleSettingsChange('reminderTimes', { ...settings.reminderTimes, beforeDue: newReminderTimes });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Info className="w-4 h-4 text-blue-600" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Enhanced Notifications
              </CardTitle>
              <CardDescription>
                Manage your notifications and reminder settings
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {notifications.filter(n => !n.isRead).length} unread
                  </Badge>
                  <Badge variant="outline">
                    {notifications.length} total
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    disabled={notifications.filter(n => !n.isRead).length === 0}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark All Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    disabled={notifications.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No notifications yet</p>
                    <p className="text-sm text-gray-500">You'll see task reminders and updates here</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Card key={notification.id} className={`${!notification.isRead ? 'border-blue-200 bg-blue-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getPriorityIcon(notification.priority)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(notification.createdAt)}</span>
                              {notification.snoozeUntil && (
                                <span className="text-orange-600">
                                  • Snoozed until {formatTime(notification.snoozeUntil)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSnooze(notification.id, 15)}
                              className="h-8 w-8 p-0"
                            >
                              <Clock className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-xs text-gray-600">Enable browser notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.pushEnabled}
                      onCheckedChange={(checked) => handleSettingsChange('pushEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                      <p className="text-xs text-gray-600">Show desktop notifications</p>
                    </div>
                    <Switch
                      id="desktop-notifications"
                      checked={settings.desktopEnabled}
                      onCheckedChange={(checked) => handleSettingsChange('desktopEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound-notifications">Sound Notifications</Label>
                      <p className="text-xs text-gray-600">Play sound for notifications</p>
                    </div>
                    <Switch
                      id="sound-notifications"
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => handleSettingsChange('soundEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Reminder Times</CardTitle>
                  <CardDescription>
                    Set when you want to be reminded before tasks are due
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {settings.reminderTimes.beforeDue.map((time, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={time}
                          onChange={(e) => handleReminderTimeChange(index, e.target.value)}
                          className="w-24"
                          placeholder="Minutes"
                        />
                        <span className="text-sm text-gray-600">minutes before due</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReminderTime(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addReminderTime}
                      className="w-full"
                    >
                      Add Reminder Time
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Snooze Options</CardTitle>
                  <CardDescription>
                    Available snooze durations for notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {settings.snoozeOptions.map((minutes, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h`}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
