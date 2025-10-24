import { toast } from 'sonner';

export interface NotificationSettings {
  pushEnabled: boolean;
  reminderTimes: {
    beforeDue: number[]; // minutes before due date
    customReminders: CustomReminder[];
  };
  snoozeOptions: number[]; // minutes
  soundEnabled: boolean;
  desktopEnabled: boolean;
}

export interface CustomReminder {
  id: string;
  name: string;
  minutesBefore: number;
  enabled: boolean;
}

export interface Notification {
  id: string;
  type: 'task_due' | 'task_overdue' | 'reminder' | 'achievement' | 'system';
  title: string;
  message: string;
  taskId?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  scheduledFor?: string;
  snoozeUntil?: string;
}

class NotificationService {
  private settings: NotificationSettings;
  private notifications: Notification[] = [];
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private listeners: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    this.settings = this.loadSettings();
    this.loadNotifications();
    this.requestNotificationPermission();
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Create a new notification
  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Show browser notification if enabled
    if (this.settings.pushEnabled && Notification.permission === 'granted') {
      this.showBrowserNotification(newNotification);
    }

    // Show toast notification
    this.showToastNotification(newNotification);

    return newNotification;
  }

  // Schedule a notification for later
  scheduleNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>, scheduledFor: Date): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      scheduledFor: scheduledFor.toISOString(),
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Schedule the notification
    const delay = scheduledFor.getTime() - Date.now();
    if (delay > 0) {
      const timer = setTimeout(() => {
        this.showBrowserNotification(newNotification);
        this.showToastNotification(newNotification);
        this.timers.delete(newNotification.id);
      }, delay);
      this.timers.set(newNotification.id, timer);
    }

    return newNotification;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.saveNotifications();
    this.notifyListeners();
  }

  // Snooze notification
  snoozeNotification(notificationId: string, minutes: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000);
      notification.snoozeUntil = snoozeUntil.toISOString();
      this.saveNotifications();
      this.notifyListeners();

      // Schedule snooze
      const timer = setTimeout(() => {
        this.showBrowserNotification(notification);
        this.showToastNotification(notification);
        this.timers.delete(notification.id);
      }, minutes * 60 * 1000);
      this.timers.set(notification.id, timer);
    }
  }

  // Delete notification
  deleteNotification(notificationId: string): void {
    const timer = this.timers.get(notificationId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(notificationId);
    }

    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Get unread notifications
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  // Get notification settings
  getSettings(): NotificationSettings {
    return this.settings;
  }

  // Update notification settings
  updateSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
  }

  // Create task due notification
  createTaskDueNotification(taskId: string, taskTitle: string, dueDate: string, priority: 'low' | 'medium' | 'high' | 'urgent'): void {
    this.createNotification({
      type: 'task_due',
      title: 'Task Due Soon',
      message: `"${taskTitle}" is due soon`,
      taskId,
      dueDate,
      priority,
    });
  }

  // Create task overdue notification
  createTaskOverdueNotification(taskId: string, taskTitle: string, dueDate: string): void {
    this.createNotification({
      type: 'task_overdue',
      title: 'Task Overdue',
      message: `"${taskTitle}" is overdue`,
      taskId,
      dueDate,
      priority: 'urgent',
    });
  }

  // Create achievement notification
  createAchievementNotification(title: string, message: string): void {
    this.createNotification({
      type: 'achievement',
      title,
      message,
      priority: 'medium',
    });
  }

  // Create reminder notification
  createReminderNotification(taskId: string, taskTitle: string, message: string): void {
    this.createNotification({
      type: 'reminder',
      title: 'Reminder',
      message: `"${taskTitle}": ${message}`,
      taskId,
      priority: 'medium',
    });
  }

  // Show browser notification
  private showBrowserNotification(notification: Notification): void {
    if (!this.settings.pushEnabled || Notification.permission !== 'granted') {
      return;
    }

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent',
    });

    browserNotification.onclick = () => {
      window.focus();
      browserNotification.close();
    };

    // Auto-close after 5 seconds for non-urgent notifications
    if (notification.priority !== 'urgent') {
      setTimeout(() => browserNotification.close(), 5000);
    }
  }

  // Show toast notification
  private showToastNotification(notification: Notification): void {
    const toastOptions = {
      duration: notification.priority === 'urgent' ? 0 : 5000,
    };

    switch (notification.priority) {
      case 'urgent':
        toast.error(notification.message, toastOptions);
        break;
      case 'high':
        toast.warning(notification.message, toastOptions);
        break;
      case 'medium':
        toast.info(notification.message, toastOptions);
        break;
      case 'low':
        toast.success(notification.message, toastOptions);
        break;
    }
  }

  // Load settings from localStorage
  private loadSettings(): NotificationSettings {
    try {
      const stored = localStorage.getItem('notificationSettings');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }

    return {
      pushEnabled: false,
      reminderTimes: {
        beforeDue: [60, 15], // 1 hour and 15 minutes before due
        customReminders: [],
      },
      snoozeOptions: [5, 15, 30, 60, 120], // 5 min, 15 min, 30 min, 1 hour, 2 hours
      soundEnabled: true,
      desktopEnabled: true,
    };
  }

  // Save settings to localStorage
  private saveSettings(): void {
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  }

  // Load notifications from localStorage
  private loadNotifications(): void {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  // Save notifications to localStorage
  private saveNotifications(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  // Notify listeners of changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Clear all notifications
  clearAllNotifications(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Get notification count
  getNotificationCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
