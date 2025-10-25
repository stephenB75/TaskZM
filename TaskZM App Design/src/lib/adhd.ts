// ADHD-specific utility functions

export interface TimeBlock {
  start: string;
  end: string;
  task: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface StreakData {
  current: number;
  longest: number;
  lastCompleted: string | null;
}

// Time formatting helpers
export function formatTimeRemaining(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  if (hour < 22) return 'evening';
  return 'night';
}

export function calculateDayProgress(): number {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  
  const totalDay = endOfDay.getTime() - startOfDay.getTime();
  const elapsed = now.getTime() - startOfDay.getTime();
  
  return Math.min(Math.max((elapsed / totalDay) * 100, 0), 100);
}

// Focus calculation logic
export function calculateFocusScore(tasks: any[]): number {
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  
  if (totalTasks === 0) return 100;
  
  return Math.round((completedTasks / totalTasks) * 100);
}

export function getFocusRecommendation(focusScore: number): string {
  if (focusScore >= 80) return "Great focus! Keep up the momentum.";
  if (focusScore >= 60) return "Good progress. Consider taking a short break.";
  if (focusScore >= 40) return "You're making progress. Try breaking down larger tasks.";
  return "Start with one small task to build momentum.";
}

// Achievement tracking
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-task',
    name: 'Getting Started',
    description: 'Complete your first task',
    icon: '🎯',
  },
  {
    id: 'streak-3',
    name: 'Three Day Streak',
    description: 'Complete tasks for 3 days in a row',
    icon: '🔥',
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Complete tasks for 7 days in a row',
    icon: '⚡',
  },
  {
    id: 'focus-master',
    name: 'Focus Master',
    description: 'Complete 10 tasks in focus mode',
    icon: '🧠',
  },
  {
    id: 'time-blocker',
    name: 'Time Blocker',
    description: 'Use time blocking for 5 days',
    icon: '⏰',
  },
];

export function checkAchievements(
  tasks: any[],
  completedTasks: any[],
  settings: any
): Achievement[] {
  const unlocked: Achievement[] = [];
  
  // Check for first task completion
  if (completedTasks.length >= 1) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'first-task');
    if (achievement) unlocked.push(achievement);
  }
  
  // Check for focus mode usage
  if (settings.focusMode && completedTasks.length >= 10) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'focus-master');
    if (achievement) unlocked.push(achievement);
  }
  
  return unlocked;
}

// Streak calculation
export function calculateStreak(completedDates: string[]): StreakData {
  if (completedDates.length === 0) {
    return { current: 0, longest: 0, lastCompleted: null };
  }
  
  const sortedDates = completedDates
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate current streak
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    date.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (i === 0 && daysDiff <= 1) {
      current = 1;
      tempStreak = 1;
    } else if (i > 0) {
      const prevDate = new Date(sortedDates[i - 1]);
      prevDate.setHours(0, 0, 0, 0);
      const daysBetween = Math.floor((prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysBetween === 1) {
        tempStreak++;
        if (i === 1) current = tempStreak;
      } else {
        longest = Math.max(longest, tempStreak);
        tempStreak = 1;
      }
    }
  }
  
  longest = Math.max(longest, tempStreak);
  
  return {
    current,
    longest,
    lastCompleted: sortedDates[0].toISOString().split('T')[0],
  };
}

// Pomodoro timer helpers
export function getPomodoroPhase(
  startTime: Date,
  workDuration: number,
  breakDuration: number
): 'work' | 'break' | 'long-break' {
  const now = new Date();
  const elapsed = now.getTime() - startTime.getTime();
  const totalCycle = (workDuration + breakDuration) * 60 * 1000;
  
  const cyclePosition = elapsed % totalCycle;
  const workTime = workDuration * 60 * 1000;
  
  if (cyclePosition < workTime) {
    return 'work';
  } else {
    return 'break';
  }
}

export function getPomodoroTimeRemaining(
  startTime: Date,
  workDuration: number,
  breakDuration: number
): number {
  const now = new Date();
  const elapsed = now.getTime() - startTime.getTime();
  const totalCycle = (workDuration + breakDuration) * 60 * 1000;
  
  const cyclePosition = elapsed % totalCycle;
  const workTime = workDuration * 60 * 1000;
  
  if (cyclePosition < workTime) {
    return Math.max(0, workTime - cyclePosition);
  } else {
    return Math.max(0, totalCycle - cyclePosition);
  }
}

// Task breakdown suggestions
export function suggestSubtasks(taskTitle: string, taskDescription: string): string[] {
  const suggestions: string[] = [];
  
  // Common task patterns
  if (taskTitle.toLowerCase().includes('research')) {
    suggestions.push('Gather initial information', 'Review sources', 'Take notes', 'Summarize findings');
  }
  
  if (taskTitle.toLowerCase().includes('write') || taskTitle.toLowerCase().includes('document')) {
    suggestions.push('Create outline', 'Write first draft', 'Review and edit', 'Final proofread');
  }
  
  if (taskTitle.toLowerCase().includes('meeting') || taskTitle.toLowerCase().includes('call')) {
    suggestions.push('Prepare agenda', 'Send invitations', 'Conduct meeting', 'Follow up with notes');
  }
  
  if (taskTitle.toLowerCase().includes('design') || taskTitle.toLowerCase().includes('create')) {
    suggestions.push('Brainstorm ideas', 'Create initial concepts', 'Refine design', 'Get feedback');
  }
  
  if (taskTitle.toLowerCase().includes('plan') || taskTitle.toLowerCase().includes('organize')) {
    suggestions.push('Define objectives', 'Create timeline', 'Identify resources', 'Set milestones');
  }
  
  // Generic breakdown if no patterns match
  if (suggestions.length === 0) {
    suggestions.push('Prepare materials', 'Execute main task', 'Review results', 'Complete follow-up');
  }
  
  return suggestions.slice(0, 4); // Limit to 4 suggestions
}
