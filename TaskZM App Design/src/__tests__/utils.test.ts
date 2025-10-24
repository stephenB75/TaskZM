import { generateRecurringTasks, validateRecurringConfig } from '../lib/recurringTasks';
import { aiAutoSchedule, aiSmartSchedule, validateAIScheduleConfig } from '../lib/aiScheduler';
import { notificationService } from '../lib/notifications';
import { taskTemplateService } from '../lib/taskTemplates';
import { workspaceService } from '../lib/workspaces';
import { calendarSyncService } from '../lib/calendarSync';

describe('Utility Functions', () => {
  describe('Recurring Tasks', () => {
    it('generates daily recurring tasks correctly', () => {
      const task = {
        title: 'Daily Task',
        description: 'A daily task',
        tags: [],
        priority: 'medium' as const,
        assignee: { name: 'Test User', avatar: '/avatar.png' },
        dueDate: '2024-01-15',
        status: 'todo' as const,
        scheduledDate: '2024-01-15',
        archived: false,
        subtasks: [],
        dependencies: [],
        recurring: {
          frequency: 'daily',
          interval: 1,
          endDate: '2024-01-20'
        }
      };

      const result = generateRecurringTasks(task, task.recurring!, task.scheduledDate);
      expect(result).toHaveLength(6); // 5 days + original
      expect(result[0].title).toBe('Daily Task');
      expect(result[0].recurringGroupId).toBeDefined();
    });

    it('validates recurring configuration correctly', () => {
      const validConfig = {
        frequency: 'daily',
        interval: 1,
        endDate: '2024-01-20'
      };

      const errors = validateRecurringConfig(validConfig);
      expect(errors).toHaveLength(0);
    });

    it('returns validation errors for invalid configuration', () => {
      const invalidConfig = {
        frequency: 'daily',
        interval: 0, // Invalid interval
        endDate: '2024-01-20'
      };

      const errors = validateRecurringConfig(invalidConfig);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('AI Scheduler', () => {
    it('validates AI schedule configuration correctly', () => {
      const validConfig = {
        maxTasksPerDay: 5,
        workHours: { start: 9, end: 17 },
        breakTime: 30
      };

      const errors = validateAIScheduleConfig(validConfig);
      expect(errors).toHaveLength(0);
    });

    it('returns validation errors for invalid AI configuration', () => {
      const invalidConfig = {
        maxTasksPerDay: 0, // Invalid
        workHours: { start: 9, end: 17 },
        breakTime: 30
      };

      const errors = validateAIScheduleConfig(invalidConfig);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Notification Service', () => {
    it('creates notifications correctly', () => {
      const notification = notificationService.createNotification({
        type: 'task_due',
        title: 'Test Notification',
        message: 'Test message',
        priority: 'high'
      });

      expect(notification.id).toBeDefined();
      expect(notification.title).toBe('Test Notification');
      expect(notification.isRead).toBe(false);
    });

    it('tracks notification count correctly', () => {
      const initialCount = notificationService.getNotificationCount();
      
      notificationService.createNotification({
        type: 'task_due',
        title: 'Test Notification',
        message: 'Test message',
        priority: 'high'
      });

      const newCount = notificationService.getNotificationCount();
      expect(newCount).toBe(initialCount + 1);
    });

    it('marks notifications as read correctly', () => {
      const notification = notificationService.createNotification({
        type: 'task_due',
        title: 'Test Notification',
        message: 'Test message',
        priority: 'high'
      });

      notificationService.markAsRead(notification.id);
      const notifications = notificationService.getNotifications();
      const updatedNotification = notifications.find(n => n.id === notification.id);
      
      expect(updatedNotification?.isRead).toBe(true);
    });
  });

  describe('Task Template Service', () => {
    it('gets all templates correctly', () => {
      const templates = taskTemplateService.getTemplates();
      expect(Array.isArray(templates)).toBe(true);
    });

    it('gets templates by category correctly', () => {
      const workTemplates = taskTemplateService.getTemplatesByCategory('work');
      expect(Array.isArray(workTemplates)).toBe(true);
    });

    it('searches templates correctly', () => {
      const results = taskTemplateService.searchTemplates('daily');
      expect(Array.isArray(results)).toBe(true);
    });

    it('gets popular templates correctly', () => {
      const popular = taskTemplateService.getPopularTemplates(5);
      expect(Array.isArray(popular)).toBe(true);
      expect(popular.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Workspace Service', () => {
    it('gets all workspaces correctly', () => {
      const workspaces = workspaceService.getWorkspaces();
      expect(Array.isArray(workspaces)).toBe(true);
    });

    it('gets current workspace correctly', () => {
      const currentWorkspace = workspaceService.getCurrentWorkspace();
      expect(currentWorkspace).toBeDefined();
    });

    it('creates new workspace correctly', () => {
      const newWorkspace = workspaceService.createWorkspace({
        name: 'Test Workspace',
        description: 'Test description',
        color: '#3b82f6',
        icon: 'briefcase',
        isDefault: false,
        createdBy: 'test-user',
        settings: {
          allowGuestAccess: false,
          requireApprovalForNewMembers: false,
          defaultTaskPriority: 'medium',
          defaultTaskStatus: 'todo',
          notificationSettings: {
            taskAssigned: true,
            taskCompleted: true,
            taskOverdue: true,
            newMember: true
          },
          timeTrackingEnabled: true,
          collaborationEnabled: true
        }
      });

      expect(newWorkspace.id).toBeDefined();
      expect(newWorkspace.name).toBe('Test Workspace');
    });
  });

  describe('Calendar Sync Service', () => {
    it('gets all providers correctly', () => {
      const providers = calendarSyncService.getProviders();
      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBeGreaterThan(0);
    });

    it('gets connected providers correctly', () => {
      const connected = calendarSyncService.getConnectedProviders();
      expect(Array.isArray(connected)).toBe(true);
    });

    it('gets sync settings correctly', () => {
      const settings = calendarSyncService.getSyncSettings();
      expect(settings).toBeDefined();
      expect(settings.autoSync).toBeDefined();
      expect(settings.syncInterval).toBeDefined();
    });

    it('updates sync settings correctly', () => {
      const newSettings = {
        autoSync: true,
        syncInterval: 60
      };

      calendarSyncService.updateSyncSettings(newSettings);
      const updatedSettings = calendarSyncService.getSyncSettings();
      
      expect(updatedSettings.autoSync).toBe(true);
      expect(updatedSettings.syncInterval).toBe(60);
    });
  });
});
