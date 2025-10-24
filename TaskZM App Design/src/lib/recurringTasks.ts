import { Task } from "../App";

export interface RecurringTaskData {
  frequency: "daily" | "weekly" | "monthly";
  interval: number;
  endDate?: string;
  count?: number;
  daysOfWeek?: number[];
}

/**
 * Generates recurring task instances based on the recurring configuration
 */
export function generateRecurringTasks(
  baseTask: Omit<Task, "id">,
  recurringData: RecurringTaskData,
  startDate: string
): Omit<Task, "id">[] {
  const tasks: Omit<Task, "id">[] = [];
  const start = new Date(startDate);
  let currentDate = new Date(start);
  
  // Calculate end date based on end type
  let endDate: Date | null = null;
  if (recurringData.endDate) {
    endDate = new Date(recurringData.endDate);
  } else if (recurringData.count) {
    // Calculate end date based on count
    const maxOccurrences = Math.min(recurringData.count, 52); // Cap at 52 occurrences
    endDate = calculateEndDateFromCount(start, recurringData, maxOccurrences);
  } else {
    // Never ending - cap at 52 occurrences
    endDate = calculateEndDateFromCount(start, recurringData, 52);
  }

  let occurrenceCount = 0;
  const maxOccurrences = recurringData.count ? Math.min(recurringData.count, 52) : 52;

  while (currentDate <= endDate && occurrenceCount < maxOccurrences) {
    // Create task instance for current date
    const taskInstance: Omit<Task, "id"> = {
      ...baseTask,
      scheduledDate: currentDate.toISOString().split('T')[0],
      recurring: undefined, // Remove recurring data from individual instances
      recurringGroupId: generateRecurringGroupId(), // Add group ID for tracking
    };

    tasks.push(taskInstance);
    occurrenceCount++;

    // Calculate next occurrence date
    currentDate = getNextOccurrenceDate(currentDate, recurringData);
  }

  return tasks;
}

/**
 * Calculates the next occurrence date based on frequency and interval
 */
function getNextOccurrenceDate(
  currentDate: Date,
  recurringData: RecurringTaskData
): Date {
  const nextDate = new Date(currentDate);

  switch (recurringData.frequency) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + recurringData.interval);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + (7 * recurringData.interval));
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + recurringData.interval);
      break;
  }

  return nextDate;
}

/**
 * Calculates end date based on occurrence count
 */
function calculateEndDateFromCount(
  startDate: Date,
  recurringData: RecurringData,
  count: number
): Date {
  let currentDate = new Date(startDate);
  
  // Generate dates for the specified count
  for (let i = 1; i < count; i++) {
    currentDate = getNextOccurrenceDate(currentDate, recurringData);
  }
  
  return currentDate;
}

/**
 * Generates a unique group ID for recurring tasks
 */
function generateRecurringGroupId(): string {
  return `recurring_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Checks if a task is part of a recurring group
 */
export function isRecurringTask(task: Task): boolean {
  return !!task.recurringGroupId;
}

/**
 * Gets all tasks in the same recurring group
 */
export function getRecurringGroupTasks(tasks: Task[], groupId: string): Task[] {
  return tasks.filter(task => task.recurringGroupId === groupId);
}

/**
 * Updates all tasks in a recurring group
 */
export function updateRecurringGroup(
  tasks: Task[],
  groupId: string,
  updates: Partial<Task>
): Task[] {
  return tasks.map(task => 
    task.recurringGroupId === groupId 
      ? { ...task, ...updates }
      : task
  );
}

/**
 * Deletes all tasks in a recurring group
 */
export function deleteRecurringGroup(tasks: Task[], groupId: string): Task[] {
  return tasks.filter(task => task.recurringGroupId !== groupId);
}

/**
 * Gets the next occurrence date for a recurring task
 */
export function getNextRecurringDate(
  lastDate: string,
  recurringData: RecurringTaskData
): string {
  const last = new Date(lastDate);
  const next = getNextOccurrenceDate(last, recurringData);
  return next.toISOString().split('T')[0];
}

/**
 * Validates recurring task configuration
 */
export function validateRecurringConfig(recurringData: RecurringTaskData): string[] {
  const errors: string[] = [];

  if (recurringData.interval < 1) {
    errors.push("Interval must be at least 1");
  }

  if (recurringData.interval > 365) {
    errors.push("Interval cannot exceed 365");
  }

  if (recurringData.endDate && recurringData.count) {
    errors.push("Cannot specify both end date and count");
  }

  if (recurringData.endDate) {
    const endDate = new Date(recurringData.endDate);
    const today = new Date();
    if (endDate <= today) {
      errors.push("End date must be in the future");
    }
  }

  if (recurringData.count && (recurringData.count < 1 || recurringData.count > 52)) {
    errors.push("Count must be between 1 and 52");
  }

  return errors;
}
