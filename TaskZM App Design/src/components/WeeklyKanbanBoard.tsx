import React, { useState } from "react";
import { Plus } from "lucide-react";
import DayColumn from "./DayColumn";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description: string;
  tags: Array<{
    text: string;
    bgColor: string;
    textColor: string;
    fontWeight: "bold" | "medium";
  }>;
  priority: "high" | "medium" | "low";
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  links?: { text: string; url: string }[];
  files?: { name: string; icon: string }[];
  notes?: string;
  status: "todo" | "inprogress" | "done";
  scheduledDate: string;
  scheduledTime?: string;
  estimatedDuration?: string;
  actualDuration?: string;
  subtasks?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  dependencies?: string[];
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    endDate?: string;
    count?: number;
    daysOfWeek?: number[];
  };
  recurringGroupId?: string;
  archived?: boolean;
  archivedAt?: string;
}

interface WeeklyKanbanBoardProps {
  currentWeek: Date;
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: Task["status"]) => void;
  onTaskDrop: (taskId: string, targetDate: Date) => void;
  onAddTaskToDay: (date: Date) => void;
  onTaskClick: (task: Task) => void;
  onReorderTasksInDay: (taskId: string, targetTaskId: string, position: "before" | "after") => void;
  allTasks: Task[];
}

export default function WeeklyKanbanBoard({
  currentWeek,
  tasks,
  onTaskStatusChange,
  onTaskDrop,
  onAddTaskToDay,
  onTaskClick,
  onReorderTasksInDay,
  allTasks,
}: WeeklyKanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // Generate 7 days starting from the current week
  const getWeekDays = (): Date[] => {
    const days: Date[] = [];
    const startDate = new Date(currentWeek);
    startDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => 
      task.scheduledDate === dateStr && !task.archived
    );
  };

  const formatDayHeader = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = date.getDate();
    const isToday = date.getTime() === today.getTime();
    
    return (
      <div className={`text-center py-2.5 ${isToday ? 'bg-blue-50' : ''}`}>
        <div className={`text-xs font-medium text-gray-500 uppercase tracking-wide ${isToday ? 'text-blue-600' : ''}`}>
          {dayName}
        </div>
        <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
          {dayNumber}
        </div>
      </div>
    );
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    if (draggedTask) {
      onTaskDrop(draggedTask.id, targetDate);
      setDraggedTask(null);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      {/* Main scrollable container */}
      <div className="flex-1 flex overflow-x-auto">
        {/* Time column - fixed */}
        <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-gray-50">
          {/* Time header */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Time
            </span>
          </div>
          
          {/* Time labels */}
          <div className="flex flex-col">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="h-16 border-b border-gray-100 flex items-start justify-center pt-2">
                <span className="text-xs text-gray-500">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Day columns container */}
        <div className="flex flex-col">
          {/* Day headers */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex">
              {weekDays.map((day, index) => (
                <div
                  key={`header-${index}`}
                  className="w-[280px] flex-shrink-0 border-r border-gray-200"
                >
                  {formatDayHeader(day)}
                </div>
              ))}
            </div>
          </div>

          {/* Day columns with tasks */}
          <div className="flex">
            {weekDays.map((day: Date, dayIndex: number) => {
              const dayTasks = getTasksForDate(day);
              const isToday = day.getTime() === today.getTime();
              
              return (
                <div
                  key={dayIndex}
                  className="w-[280px] flex-shrink-0 border-r border-gray-200 bg-white"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  <div className="h-full flex flex-col">
                    {/* Tasks for this day */}
                    <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                      {dayTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          No tasks scheduled
                        </div>
                      ) : (
                        dayTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onStatusChange={(taskId: string, newStatus: "todo" | "inprogress" | "done") => onTaskStatusChange(taskId, newStatus)}
                            onTaskClick={(taskId) => onTaskClick(task)}
                            allTasks={allTasks}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
