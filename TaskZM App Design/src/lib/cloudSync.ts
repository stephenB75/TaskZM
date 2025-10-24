import { supabase } from './supabase';
import { Task } from '../App';
import { InboxTask } from '../components/InboxPanel';
import { TagDefinition } from '../components/TagManager';

interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingChanges: number;
  syncInProgress: boolean;
}

interface SyncResult {
  success: boolean;
  syncedTasks: number;
  syncedTags: number;
  errors: string[];
}

class CloudSyncService {
  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: 0,
    syncInProgress: false,
  };

  private listeners: ((status: SyncStatus) => void)[] = [];

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Listen for visibility changes to sync when tab becomes active
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.syncStatus.isOnline) {
        this.sync();
      }
    });

    // Periodic sync every 5 minutes when online
    setInterval(() => {
      if (this.syncStatus.isOnline && !this.syncStatus.syncInProgress) {
        this.sync();
      }
    }, 5 * 60 * 1000);
  }

  // Subscribe to sync status changes
  subscribe(listener: (status: SyncStatus) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current sync status
  getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // Handle online event
  private handleOnline() {
    this.syncStatus.isOnline = true;
    this.notifyListeners();
    this.sync();
  }

  // Handle offline event
  private handleOffline() {
    this.syncStatus.isOnline = false;
    this.notifyListeners();
  }

  // Notify listeners of status changes
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.syncStatus));
  }

  // Sync tasks to cloud
  async syncTasks(tasks: Task[]): Promise<SyncResult> {
    if (this.syncStatus.syncInProgress) {
      return { success: false, syncedTasks: 0, syncedTags: 0, errors: ['Sync already in progress'] };
    }

    this.syncStatus.syncInProgress = true;
    this.notifyListeners();

    const result: SyncResult = {
      success: true,
      syncedTasks: 0,
      syncedTags: 0,
      errors: [],
    };

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Sync tasks
      for (const task of tasks) {
        try {
          const { error } = await supabase
            .from('tasks')
            .upsert({
              id: task.id,
              user_id: user.id,
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              due_date: task.dueDate || null,
              tags: task.tags.map(tag => tag.text),
              subtasks: task.subtasks || [],
              dependencies: task.dependencies || [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (error) {
            result.errors.push(`Failed to sync task "${task.title}": ${error.message}`);
          } else {
            result.syncedTasks++;
          }
        } catch (error) {
          result.errors.push(`Failed to sync task "${task.title}": ${error}`);
        }
      }

      this.syncStatus.lastSync = new Date().toISOString();
      this.syncStatus.pendingChanges = 0;
    } catch (error) {
      result.success = false;
      result.errors.push(`Sync failed: ${error}`);
    } finally {
      this.syncStatus.syncInProgress = false;
      this.notifyListeners();
    }

    return result;
  }

  // Sync tags to cloud
  async syncTags(tags: TagDefinition[]): Promise<SyncResult> {
    if (this.syncStatus.syncInProgress) {
      return { success: false, syncedTasks: 0, syncedTags: 0, errors: ['Sync already in progress'] };
    }

    this.syncStatus.syncInProgress = true;
    this.notifyListeners();

    const result: SyncResult = {
      success: true,
      syncedTasks: 0,
      syncedTags: 0,
      errors: [],
    };

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Sync tags
      for (const tag of tags) {
        try {
          const { error } = await supabase
            .from('tags')
            .upsert({
              id: tag.id,
              user_id: user.id,
              name: tag.name,
              color: tag.color,
              created_at: new Date().toISOString(),
            });

          if (error) {
            result.errors.push(`Failed to sync tag "${tag.name}": ${error.message}`);
          } else {
            result.syncedTags++;
          }
        } catch (error) {
          result.errors.push(`Failed to sync tag "${tag.name}": ${error}`);
        }
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Tag sync failed: ${error}`);
    } finally {
      this.syncStatus.syncInProgress = false;
      this.notifyListeners();
    }

    return result;
  }

  // Load tasks from cloud
  async loadTasks(): Promise<Task[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to load tasks: ${error.message}`);
      }

      // Convert database format to Task format
      return data.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        tags: task.tags.map((tagText: string) => ({
          text: tagText,
          bgColor: '#e3e3e3',
          textColor: '#313131',
          fontWeight: 'medium' as const,
        })),
        priority: task.priority,
        assignee: {
          name: 'You',
          avatar: '/default-avatar.png',
        },
        dueDate: task.due_date || '',
        status: task.status,
        scheduledDate: task.due_date || new Date().toISOString().split('T')[0],
        subtasks: task.subtasks || [],
        dependencies: task.dependencies || [],
        archived: task.status === 'archived',
      }));
    } catch (error) {
      console.error('Failed to load tasks from cloud:', error);
      return [];
    }
  }

  // Load tags from cloud
  async loadTags(): Promise<TagDefinition[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to load tags: ${error.message}`);
      }

      return data.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      }));
    } catch (error) {
      console.error('Failed to load tags from cloud:', error);
      return [];
    }
  }

  // Perform full sync
  async sync(): Promise<SyncResult> {
    if (!this.syncStatus.isOnline) {
      return { success: false, syncedTasks: 0, syncedTags: 0, errors: ['Offline'] };
    }

    // This would be called by the main app with current data
    return { success: true, syncedTasks: 0, syncedTags: 0, errors: [] };
  }

  // Mark changes as pending
  markPendingChanges(count: number) {
    this.syncStatus.pendingChanges += count;
    this.notifyListeners();
  }

  // Clear pending changes
  clearPendingChanges() {
    this.syncStatus.pendingChanges = 0;
    this.notifyListeners();
  }
}

// Export singleton instance
export const cloudSync = new CloudSyncService();
export type { SyncStatus, SyncResult };
