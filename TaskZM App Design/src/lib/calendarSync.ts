import { Task } from '../App';

export interface CalendarProvider {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'caldav';
  icon: string;
  color: string;
  isConnected: boolean;
  lastSyncAt?: string;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  errorMessage?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  attendees?: string[];
  provider: string;
  providerEventId: string;
  taskId?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
}

export interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  syncDirection: 'bidirectional' | 'to_calendar' | 'from_calendar';
  includeCompleted: boolean;
  includeArchived: boolean;
  defaultEventDuration: number; // minutes
  syncTimeRange: {
    start: Date;
    end: Date;
  };
  calendarMapping: {
    [taskStatus: string]: string; // task status to calendar event status
  };
}

export interface SyncResult {
  success: boolean;
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
  tasksCreated: number;
  tasksUpdated: number;
  tasksDeleted: number;
  errors: string[];
  lastSyncAt: string;
}

class CalendarSyncService {
  private providers: CalendarProvider[] = [];
  private syncSettings: SyncSettings;
  private syncInterval: NodeJS.Timeout | null = null;
  private listeners: ((result: SyncResult) => void)[] = [];

  constructor() {
    this.initializeProviders();
    this.loadSyncSettings();
    this.startAutoSync();
  }

  // Initialize calendar providers
  private initializeProviders(): void {
    this.providers = [
      {
        id: 'google',
        name: 'Google Calendar',
        type: 'google',
        icon: 'calendar',
        color: '#4285f4',
        isConnected: false,
        syncStatus: 'idle'
      },
      {
        id: 'outlook',
        name: 'Microsoft Outlook',
        type: 'outlook',
        icon: 'mail',
        color: '#0078d4',
        isConnected: false,
        syncStatus: 'idle'
      },
      {
        id: 'apple',
        name: 'Apple Calendar',
        type: 'apple',
        icon: 'apple',
        color: '#000000',
        isConnected: false,
        syncStatus: 'idle'
      },
      {
        id: 'caldav',
        name: 'CalDAV',
        type: 'caldav',
        icon: 'server',
        color: '#6b7280',
        isConnected: false,
        syncStatus: 'idle'
      }
    ];
  }

  // Load sync settings from localStorage
  private loadSyncSettings(): void {
    try {
      const stored = localStorage.getItem('calendarSyncSettings');
      if (stored) {
        this.syncSettings = JSON.parse(stored);
      } else {
        this.syncSettings = {
          autoSync: false,
          syncInterval: 30,
          syncDirection: 'bidirectional',
          includeCompleted: false,
          includeArchived: false,
          defaultEventDuration: 60,
          syncTimeRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
          },
          calendarMapping: {
            'todo': 'tentative',
            'inprogress': 'confirmed',
            'done': 'cancelled'
          }
        };
      }
    } catch (error) {
      console.error('Failed to load calendar sync settings:', error);
      this.syncSettings = this.getDefaultSyncSettings();
    }
  }

  // Get default sync settings
  private getDefaultSyncSettings(): SyncSettings {
    return {
      autoSync: false,
      syncInterval: 30,
      syncDirection: 'bidirectional',
      includeCompleted: false,
      includeArchived: false,
      defaultEventDuration: 60,
      syncTimeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      calendarMapping: {
        'todo': 'tentative',
        'inprogress': 'confirmed',
        'done': 'cancelled'
      }
    };
  }

  // Save sync settings to localStorage
  private saveSyncSettings(): void {
    try {
      localStorage.setItem('calendarSyncSettings', JSON.stringify(this.syncSettings));
    } catch (error) {
      console.error('Failed to save calendar sync settings:', error);
    }
  }

  // Start auto-sync if enabled
  private startAutoSync(): void {
    if (this.syncSettings.autoSync && this.syncInterval === null) {
      this.syncInterval = setInterval(() => {
        this.syncAllProviders();
      }, this.syncSettings.syncInterval * 60 * 1000);
    }
  }

  // Stop auto-sync
  private stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Get all providers
  getProviders(): CalendarProvider[] {
    return this.providers;
  }

  // Get connected providers
  getConnectedProviders(): CalendarProvider[] {
    return this.providers.filter(p => p.isConnected);
  }

  // Get provider by ID
  getProvider(id: string): CalendarProvider | undefined {
    return this.providers.find(p => p.id === id);
  }

  // Get sync settings
  getSyncSettings(): SyncSettings {
    return this.syncSettings;
  }

  // Update sync settings
  updateSyncSettings(settings: Partial<SyncSettings>): void {
    this.syncSettings = { ...this.syncSettings, ...settings };
    this.saveSyncSettings();
    
    // Restart auto-sync if settings changed
    this.stopAutoSync();
    this.startAutoSync();
  }

  // Connect to provider
  async connectProvider(providerId: string): Promise<boolean> {
    const provider = this.getProvider(providerId);
    if (!provider) return false;

    try {
      provider.syncStatus = 'syncing';
      
      // Simulate OAuth flow
      const success = await this.simulateOAuthFlow(provider);
      
      if (success) {
        provider.isConnected = true;
        provider.lastSyncAt = new Date().toISOString();
        provider.syncStatus = 'success';
        provider.errorMessage = undefined;
      } else {
        provider.syncStatus = 'error';
        provider.errorMessage = 'Failed to authenticate';
      }
      
      return success;
    } catch (error) {
      provider.syncStatus = 'error';
      provider.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return false;
    }
  }

  // Disconnect from provider
  disconnectProvider(providerId: string): boolean {
    const provider = this.getProvider(providerId);
    if (!provider) return false;

    provider.isConnected = false;
    provider.lastSyncAt = undefined;
    provider.syncStatus = 'idle';
    provider.errorMessage = undefined;
    
    return true;
  }

  // Simulate OAuth flow
  private async simulateOAuthFlow(provider: CalendarProvider): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success/failure based on provider
    const successRates = {
      'google': 0.9,
      'outlook': 0.85,
      'apple': 0.8,
      'caldav': 0.7
    };
    
    const successRate = successRates[provider.type] || 0.5;
    return Math.random() < successRate;
  }

  // Sync all connected providers
  async syncAllProviders(): Promise<SyncResult> {
    const connectedProviders = this.getConnectedProviders();
    if (connectedProviders.length === 0) {
      return {
        success: true,
        eventsCreated: 0,
        eventsUpdated: 0,
        eventsDeleted: 0,
        tasksCreated: 0,
        tasksUpdated: 0,
        tasksDeleted: 0,
        errors: [],
        lastSyncAt: new Date().toISOString()
      };
    }

    const results: SyncResult[] = [];
    
    for (const provider of connectedProviders) {
      try {
        provider.syncStatus = 'syncing';
        const result = await this.syncProvider(provider.id);
        results.push(result);
        provider.syncStatus = 'success';
        provider.lastSyncAt = new Date().toISOString();
      } catch (error) {
        provider.syncStatus = 'error';
        provider.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          success: false,
          eventsCreated: 0,
          eventsUpdated: 0,
          eventsDeleted: 0,
          tasksCreated: 0,
          tasksUpdated: 0,
          tasksDeleted: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          lastSyncAt: new Date().toISOString()
        });
      }
    }

    // Combine results
    const combinedResult = this.combineSyncResults(results);
    this.notifyListeners(combinedResult);
    
    return combinedResult;
  }

  // Sync specific provider
  async syncProvider(providerId: string): Promise<SyncResult> {
    const provider = this.getProvider(providerId);
    if (!provider || !provider.isConnected) {
      throw new Error('Provider not connected');
    }

    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate sync results
    const result: SyncResult = {
      success: true,
      eventsCreated: Math.floor(Math.random() * 5),
      eventsUpdated: Math.floor(Math.random() * 3),
      eventsDeleted: Math.floor(Math.random() * 2),
      tasksCreated: Math.floor(Math.random() * 4),
      tasksUpdated: Math.floor(Math.random() * 2),
      tasksDeleted: Math.floor(Math.random() * 1),
      errors: [],
      lastSyncAt: new Date().toISOString()
    };

    return result;
  }

  // Convert task to calendar event
  taskToCalendarEvent(task: Task, provider: string): CalendarEvent {
    const startDate = new Date(task.scheduledDate);
    const endDate = new Date(startDate.getTime() + this.syncSettings.defaultEventDuration * 60 * 1000);
    
    return {
      id: `event-${task.id}`,
      title: task.title,
      description: task.description,
      start: startDate,
      end: endDate,
      allDay: false,
      provider,
      providerEventId: `provider-${task.id}`,
      taskId: task.id,
      isRecurring: !!task.recurring,
      recurrencePattern: task.recurring ? this.taskRecurrenceToCalendar(task.recurring) : undefined
    };
  }

  // Convert calendar event to task
  calendarEventToTask(event: CalendarEvent): Omit<Task, 'id'> {
    return {
      title: event.title,
      description: event.description || '',
      tags: [],
      priority: 'medium',
      assignee: {
        name: 'You',
        avatar: '/default-avatar.png'
      },
      dueDate: event.end.toISOString().split('T')[0],
      status: this.calendarStatusToTaskStatus(event),
      scheduledDate: event.start.toISOString().split('T')[0],
      scheduledTime: event.start.toTimeString().split(' ')[0].substring(0, 5),
      archived: false
    };
  }

  // Convert task recurrence to calendar recurrence
  private taskRecurrenceToCalendar(recurring: any): string {
    // This would convert our recurring task format to iCal RRULE format
    return 'FREQ=DAILY;COUNT=7'; // Example
  }

  // Convert calendar status to task status
  private calendarStatusToTaskStatus(event: CalendarEvent): 'todo' | 'inprogress' | 'done' {
    // This would map calendar event status to task status
    return 'todo';
  }

  // Combine multiple sync results
  private combineSyncResults(results: SyncResult[]): SyncResult {
    return results.reduce((combined, result) => ({
      success: combined.success && result.success,
      eventsCreated: combined.eventsCreated + result.eventsCreated,
      eventsUpdated: combined.eventsUpdated + result.eventsUpdated,
      eventsDeleted: combined.eventsDeleted + result.eventsDeleted,
      tasksCreated: combined.tasksCreated + result.tasksCreated,
      tasksUpdated: combined.tasksUpdated + result.tasksUpdated,
      tasksDeleted: combined.tasksDeleted + result.tasksDeleted,
      errors: [...combined.errors, ...result.errors],
      lastSyncAt: new Date().toISOString()
    }), {
      success: true,
      eventsCreated: 0,
      eventsUpdated: 0,
      eventsDeleted: 0,
      tasksCreated: 0,
      tasksUpdated: 0,
      tasksDeleted: 0,
      errors: [],
      lastSyncAt: new Date().toISOString()
    });
  }

  // Subscribe to sync results
  subscribe(listener: (result: SyncResult) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify listeners
  private notifyListeners(result: SyncResult): void {
    this.listeners.forEach(listener => listener(result));
  }

  // Get sync status
  getSyncStatus(): {
    isAutoSyncEnabled: boolean;
    connectedProviders: number;
    lastSyncAt?: string;
    nextSyncAt?: string;
  } {
    const connectedProviders = this.getConnectedProviders();
    const lastSyncAt = connectedProviders
      .map(p => p.lastSyncAt)
      .filter(Boolean)
      .sort()
      .pop();

    return {
      isAutoSyncEnabled: this.syncSettings.autoSync,
      connectedProviders: connectedProviders.length,
      lastSyncAt,
      nextSyncAt: this.syncSettings.autoSync 
        ? new Date(Date.now() + this.syncSettings.syncInterval * 60 * 1000).toISOString()
        : undefined
    };
  }

  // Test connection
  async testConnection(providerId: string): Promise<boolean> {
    const provider = this.getProvider(providerId);
    if (!provider) return false;

    try {
      provider.syncStatus = 'syncing';
      await new Promise(resolve => setTimeout(resolve, 1000));
      provider.syncStatus = 'success';
      return true;
    } catch (error) {
      provider.syncStatus = 'error';
      provider.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return false;
    }
  }

  // Clear all connections
  clearAllConnections(): void {
    this.providers.forEach(provider => {
      provider.isConnected = false;
      provider.lastSyncAt = undefined;
      provider.syncStatus = 'idle';
      provider.errorMessage = undefined;
    });
  }
}

// Export singleton instance
export const calendarSyncService = new CalendarSyncService();
