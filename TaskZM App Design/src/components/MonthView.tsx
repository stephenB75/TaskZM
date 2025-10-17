import { useState } from "react";

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
}

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  onTaskDrop?: (taskId: string, targetDate: Date) => void;
  onAddTaskToDay?: (date: Date) => void;
}

export default function MonthView({
  currentDate,
  tasks,
  onTaskClick,
  onTaskDrop,
  onAddTaskToDay,
}: MonthViewProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<
    string | null
  >(null);

  // Get first day of the month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const startDay = firstDayOfMonth.getDay();

  // Get total days in month
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last few days to fill the calendar
  const prevMonthLastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0,
  ).getDate();

  // Build calendar grid
  const calendarDays: (Date | null)[] = [];

  // Add previous month days
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      prevMonthLastDay - i,
    );
    calendarDays.push(date);
  }

  // Add current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    calendarDays.push(date);
  }

  // Add next month days to complete the grid (need 35 or 42 cells)
  const remainingCells = 42 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      day,
    );
    calendarDays.push(date);
  }

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return tasks.filter(
      (task) => task.scheduledDate === dateString,
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleDragStart = (
    e: React.DragEvent,
    taskId: string,
  ) => {
    e.dataTransfer.setData("text/plain", taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId && onTaskDrop) {
      onTaskDrop(taskId, date);
    }
    setDraggedTaskId(null);
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-yellow-500";
      case "low":
        return "border-l-4 border-gray-400";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return "line-through opacity-60";
      case "inprogress":
        return "";
      case "todo":
        return "";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden">
      {/* Month Calendar Header */}
      <div className="grid grid-cols-7 bg-[#fafafa]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
          (day) => (
            <div
              key={day}
              className="p-4 text-center font-['DM_Sans:Bold',_sans-serif] font-bold text-[#828282] text-[14px] uppercase tracking-wide"
            >
              {day}
            </div>
          ),
        )}
      </div>

      {/* Calendar Grid */}
      <div
        className="flex-1 grid grid-cols-7 gap-[1px] bg-[#f0f0f0] overflow-auto"
        style={{ gridAutoRows: "minmax(180px, 1fr)" }}
      >
        {calendarDays.map((date, index) => {
          if (!date) return null;

          const dayTasks = getTasksForDate(date);
          const isTodayDate = isToday(date);
          const isCurrentMonthDate = isCurrentMonth(date);

          return (
            <div
              key={index}
              className={`p-4 flex flex-col overflow-hidden transition-colors hover:bg-opacity-70 ${
                isTodayDate
                  ? "bg-blue-50"
                  : isCurrentMonthDate
                    ? "bg-white"
                    : "bg-[#fafafa]"
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isTodayDate
                      ? "bg-[#3300ff] text-white font-bold"
                      : isCurrentMonthDate
                        ? "text-[#313131]"
                        : "text-[#9CA3AF]"
                  }`}
                >
                  <span className="text-[14px]">
                    {date.getDate()}
                  </span>
                </div>
                {isCurrentMonthDate && dayTasks.length > 0 && (
                  <span className="text-[11px] text-[#828282] font-medium">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Tasks */}
              <div className="space-y-2.5 flex-1 overflow-y-auto min-h-0 month-day-scroll">
                {dayTasks.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, task.id)
                    }
                    onDragEnd={handleDragEnd}
                    onClick={() => onTaskClick?.(task.id)}
                    className={`pl-2 py-1 text-[11px] cursor-move hover:opacity-70 transition-all ${getPriorityColor(
                      task.priority,
                    )} ${draggedTaskId === task.id ? "opacity-50" : ""}`}
                  >
                    <h2
                      className={`line-clamp-2 ${getStatusColor(task.status)}`}
                    >
                      {task.title}
                    </h2>
                  </div>
                ))}
                {dayTasks.length > 8 && (
                  <div className="text-[10px] text-[#828282] font-medium pl-1 pt-1">
                    +{dayTasks.length - 8} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}