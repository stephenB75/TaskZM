import { Task } from '../App';

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeTrackingStats {
  totalTimeToday: number;
  totalTimeThisWeek: number;
  totalTimeThisMonth: number;
  averageSessionLength: number;
  mostProductiveHour: number;
  tasksCompleted: number;
  timePerTask: number;
}

class TimeTrackingService {
  private activeTimer: TimeEntry | null = null;
  private listeners: ((entry: TimeEntry | null) => void)[] = [];

  // Subscribe to timer changes
  subscribe(listener: (entry: TimeEntry | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current active timer
  getActiveTimer(): TimeEntry | null {
    return this.activeTimer;
  }

  // Start tracking time for a task
  startTimer(taskId: string, description?: string): TimeEntry {
    // Stop any existing timer
    if (this.activeTimer) {
      this.stopTimer();
    }

    const now = new Date();
    const newEntry: TimeEntry = {
      id: `timer-${Date.now()}`,
      taskId,
      startTime: now.toISOString(),
      isActive: true,
      description,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.activeTimer = newEntry;
    this.saveTimeEntry(newEntry);
    this.notifyListeners();
    
    return newEntry;
  }

  // Stop the current timer
  stopTimer(): TimeEntry | null {
    if (!this.activeTimer) {
      return null;
    }

    const now = new Date();
    const endTime = now.toISOString();
    const startTime = new Date(this.activeTimer.startTime);
    const duration = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60)); // minutes

    const completedEntry: TimeEntry = {
      ...this.activeTimer,
      endTime,
      duration,
      isActive: false,
      updatedAt: now.toISOString(),
    };

    this.updateTimeEntry(completedEntry);
    this.activeTimer = null;
    this.notifyListeners();

    return completedEntry;
  }

  // Pause the current timer
  pauseTimer(): TimeEntry | null {
    if (!this.activeTimer) {
      return null;
    }

    const now = new Date();
    const endTime = now.toISOString();
    const startTime = new Date(this.activeTimer.startTime);
    const duration = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));

    const pausedEntry: TimeEntry = {
      ...this.activeTimer,
      endTime,
      duration,
      isActive: false,
      updatedAt: now.toISOString(),
    };

    this.updateTimeEntry(pausedEntry);
    this.activeTimer = null;
    this.notifyListeners();

    return pausedEntry;
  }

  // Resume tracking (creates new entry)
  resumeTimer(taskId: string, description?: string): TimeEntry {
    return this.startTimer(taskId, description);
  }

  // Get time entries for a task
  getTimeEntriesForTask(taskId: string): TimeEntry[] {
    const entries = this.getAllTimeEntries();
    return entries.filter(entry => entry.taskId === taskId);
  }

  // Get time entries for a date range
  getTimeEntriesForDateRange(startDate: Date, endDate: Date): TimeEntry[] {
    const entries = this.getAllTimeEntries();
    return entries.filter(entry => {
      const entryDate = new Date(entry.startTime);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  // Get today's time entries
  getTodayTimeEntries(): TimeEntry[] {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return this.getTimeEntriesForDateRange(startOfDay, endOfDay);
  }

  // Get this week's time entries
  getThisWeekTimeEntries(): TimeEntry[] {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return this.getTimeEntriesForDateRange(startOfWeek, endOfWeek);
  }

  // Calculate time tracking statistics
  calculateStats(): TimeTrackingStats {
    const todayEntries = this.getTodayTimeEntries();
    const weekEntries = this.getThisWeekTimeEntries();
    const monthEntries = this.getTimeEntriesForDateRange(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    );

    const totalTimeToday = todayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const totalTimeThisWeek = weekEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const totalTimeThisMonth = monthEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const completedEntries = todayEntries.filter(entry => entry.duration && entry.duration > 0);
    const averageSessionLength = completedEntries.length > 0 
      ? completedEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / completedEntries.length
      : 0;

    // Find most productive hour
    const hourCounts: { [hour: number]: number } = {};
    todayEntries.forEach(entry => {
      const hour = new Date(entry.startTime).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + (entry.duration || 0);
    });
    const mostProductiveHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b, '9'
    );

    const tasksCompleted = new Set(todayEntries.map(entry => entry.taskId)).size;
    const timePerTask = tasksCompleted > 0 ? totalTimeToday / tasksCompleted : 0;

    return {
      totalTimeToday,
      totalTimeThisWeek,
      totalTimeThisMonth,
      averageSessionLength,
      mostProductiveHour: parseInt(mostProductiveHour),
      tasksCompleted,
      timePerTask,
    };
  }

  // Get total time for a task
  getTotalTimeForTask(taskId: string): number {
    const entries = this.getTimeEntriesForTask(taskId);
    return entries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  }

  // Format duration in human-readable format
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  }

  // Get all time entries from localStorage
  private getAllTimeEntries(): TimeEntry[] {
    try {
      const stored = localStorage.getItem('timeEntries');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load time entries:', error);
      return [];
    }
  }

  // Save time entry to localStorage
  private saveTimeEntry(entry: TimeEntry): void {
    try {
      const entries = this.getAllTimeEntries();
      entries.push(entry);
      localStorage.setItem('timeEntries', JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save time entry:', error);
    }
  }

  // Update time entry in localStorage
  private updateTimeEntry(entry: TimeEntry): void {
    try {
      const entries = this.getAllTimeEntries();
      const index = entries.findIndex(e => e.id === entry.id);
      if (index !== -1) {
        entries[index] = entry;
        localStorage.setItem('timeEntries', JSON.stringify(entries));
      }
    } catch (error) {
      console.error('Failed to update time entry:', error);
    }
  }

  // Notify listeners of changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.activeTimer));
  }

  // Clear all time entries
  clearAllEntries(): void {
    localStorage.removeItem('timeEntries');
    this.activeTimer = null;
    this.notifyListeners();
  }

  // Delete time entry
  deleteTimeEntry(entryId: string): void {
    try {
      const entries = this.getAllTimeEntries();
      const filteredEntries = entries.filter(entry => entry.id !== entryId);
      localStorage.setItem('timeEntries', JSON.stringify(filteredEntries));
      
      if (this.activeTimer?.id === entryId) {
        this.activeTimer = null;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to delete time entry:', error);
    }
  }
}

// Export singleton instance
export const timeTracking = new TimeTrackingService();
