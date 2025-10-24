import { Task } from "../App";

export interface AIScheduleResult {
  scheduledTasks: Task[];
  weeksUsed: number;
  tasksScheduled: number;
  inboxCleared: boolean;
}

export interface AIScheduleOptions {
  tasksPerDayLimit: number;
  currentWeek: Date;
  tasks: Task[];
  inboxTasks: Task[];
}

/**
 * AI Auto-Scheduler with multi-week support
 * Distributes tasks across multiple weeks based on priority, workload, and weekend awareness
 */
export function aiAutoSchedule(options: AIScheduleOptions): AIScheduleResult {
  const { tasksPerDayLimit, currentWeek, tasks, inboxTasks } = options;
  
  // Get all active tasks (todo, in-progress) and inbox tasks
  const activeTasks = tasks.filter(task => 
    !task.archived && 
    (task.status === 'todo' || task.status === 'inprogress')
  );
  
  // Convert inbox tasks to full tasks with low priority
  const convertedInboxTasks: Task[] = inboxTasks.map(task => ({
    ...task,
    priority: 'low' as const,
    status: 'todo' as const,
    scheduledDate: '', // Will be set by scheduler
  }));
  
  // Combine all tasks to schedule
  const allTasksToSchedule = [...activeTasks, ...convertedInboxTasks];
  
  // Sort by priority (high → medium → low)
  const priorityWeights = { high: 3, medium: 2, low: 1 };
  allTasksToSchedule.sort((a, b) => 
    priorityWeights[b.priority] - priorityWeights[a.priority]
  );
  
  // Calculate weeks needed
  const totalTasks = allTasksToSchedule.length;
  const weeksNeeded = Math.ceil(totalTasks / (tasksPerDayLimit * 7));
  
  // Generate days across all needed weeks
  const days = generateDaysAcrossWeeks(currentWeek, weeksNeeded);
  
  // Initialize day task counts
  const dayTaskCounts = new Map<string, number>();
  days.forEach(day => {
    dayTaskCounts.set(day, 0);
  });
  
  // Schedule tasks
  const scheduledTasks: Task[] = [];
  
  for (const task of allTasksToSchedule) {
    const bestDay = findBestDayForTask(task, days, dayTaskCounts, tasksPerDayLimit);
    
    if (bestDay) {
      const scheduledTask = {
        ...task,
        scheduledDate: bestDay,
      };
      scheduledTasks.push(scheduledTask);
      
      // Update day count
      const currentCount = dayTaskCounts.get(bestDay) || 0;
      dayTaskCounts.set(bestDay, currentCount + 1);
    }
  }
  
  return {
    scheduledTasks,
    weeksUsed: weeksNeeded,
    tasksScheduled: scheduledTasks.length,
    inboxCleared: inboxTasks.length > 0,
  };
}

/**
 * Generate days across multiple weeks starting from current week
 */
function generateDaysAcrossWeeks(startWeek: Date, weeksNeeded: number): string[] {
  const days: string[] = [];
  const startDate = new Date(startWeek);
  startDate.setHours(0, 0, 0, 0);
  
  for (let week = 0; week < weeksNeeded; week++) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (week * 7) + day);
      days.push(date.toISOString().split('T')[0]);
    }
  }
  
  return days;
}

/**
 * Find the best day for a task based on scoring algorithm
 */
function findBestDayForTask(
  task: Task,
  days: string[],
  dayTaskCounts: Map<string, number>,
  tasksPerDayLimit: number
): string | null {
  let bestDay: string | null = null;
  let bestScore = Infinity;
  
  for (const day of days) {
    const currentCount = dayTaskCounts.get(day) || 0;
    
    // Skip if day is at limit
    if (currentCount >= tasksPerDayLimit) {
      continue;
    }
    
    const score = calculateDayScore(task, day, currentCount);
    
    if (score < bestScore) {
      bestScore = score;
      bestDay = day;
    }
  }
  
  return bestDay;
}

/**
 * Calculate score for a day (lower score = better placement)
 */
function calculateDayScore(task: Task, day: string, currentCount: number): number {
  const date = new Date(day);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Base score from current task count
  let score = currentCount * 100;
  
  // Priority-based scoring
  const priorityWeights = { high: 3, medium: 2, low: 1 };
  const prioritySum = priorityWeights[task.priority];
  score += prioritySum * 10;
  
  // Weekend penalty for high priority tasks
  if (task.priority === 'high' && isWeekend) {
    score += 50;
  }
  
  // Day index penalty (prefer earlier days)
  const dayIndex = date.getDate();
  score += dayIndex;
  
  return score;
}

/**
 * AI Smart Schedule for individual tasks
 * Finds the best available slot across up to 4 weeks
 */
export function aiSmartSchedule(
  task: Task,
  allTasks: Task[],
  currentWeek: Date,
  tasksPerDayLimit: number = 6
): string | null {
  // Generate days for 4 weeks
  const days = generateDaysAcrossWeeks(currentWeek, 4);
  
  // Get current task counts for each day
  const dayTaskCounts = new Map<string, number>();
  days.forEach(day => {
    const tasksOnDay = allTasks.filter(t => 
      t.scheduledDate === day && 
      !t.archived && 
      t.id !== task.id
    );
    dayTaskCounts.set(day, tasksOnDay.length);
  });
  
  // Find best day
  return findBestDayForTask(task, days, dayTaskCounts, tasksPerDayLimit);
}

/**
 * Validate AI scheduling configuration
 */
export function validateAIScheduleConfig(
  tasksPerDayLimit: number,
  totalTasks: number
): string[] {
  const errors: string[] = [];
  
  if (tasksPerDayLimit <= 0) {
    errors.push("Tasks per day limit must be greater than 0");
  }
  
  if (totalTasks <= 0) {
    errors.push("No tasks to schedule");
  }
  
  if (tasksPerDayLimit > 20) {
    errors.push("Tasks per day limit seems too high (max recommended: 20)");
  }
  
  return errors;
}
