import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
}

interface CalendarPanelProps {
  tasks: Task[];
  onTaskStatusChange: (
    taskId: string,
    newStatus: Task["status"],
  ) => void;
  onTaskClick?: (taskId: string) => void;
}

export default function CalendarPanel({
  tasks,
  onTaskStatusChange,
  onTaskClick,
}: CalendarPanelProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    null,
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, firstDay };
  };

  const { daysInMonth, startingDayOfWeek, firstDay } =
    getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
      ),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
      ),
    );
  };

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return tasks.filter(
      (task) => task.scheduledDate === dateString,
    );
  };

  const selectedDateTasks = selectedDate
    ? getTasksForDate(selectedDate)
    : [];

  const weekDays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const monthYearString = currentMonth.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const renderCalendarDays = () => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />,
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      );
      const dateString = date.toISOString().split("T")[0];
      const dayTasks = getTasksForDate(date);
      const isSelected =
        selectedDate?.toDateString() === date.toDateString();
      const isToday =
        new Date().toDateString() === date.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`
            aspect-square p-1 md:p-1 rounded-lg border transition-all
            hover:border-[#3300ff] hover:bg-[#f0edff] active:bg-[#f0edff]
            ${isSelected ? "bg-[#3300ff] text-white border-[#3300ff]" : "bg-white border-[#e5e7eb]"}
            ${isToday && !isSelected ? "border-[#3300ff] border-2" : ""}
            min-h-[44px] md:min-h-0
          `}
        >
          <div className="flex flex-col h-full justify-center">
            <span
              className={`text-[14px] md:text-[13px] ${isSelected ? "font-bold" : "font-medium"}`}
            >
              {day}
            </span>
            {dayTasks.length > 0 && (
              <div className="flex-1 flex items-end justify-center pb-0.5 mt-0.5">
                <div
                  className={`w-1.5 h-1.5 md:w-1.5 md:h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#3300ff]"}`}
                />
              </div>
            )}
          </div>
        </button>,
      );
    }

    return days;
  };

  return (
    <div className="w-full md:w-[315px] h-full md:h-screen bg-[#e9f7e9] md:border-l border-[#e5e7eb] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-0 pb-4 md:p-6 border-b border-[#e5e7eb]">
        <h2 className="text-[24px] font-bold text-[#313131]">
          Calendar
        </h2>
      </div>

      {/* Calendar Section */}
      <div className="flex-shrink-0 px-6 py-4 md:p-6 border-b border-[#e5e7eb]">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] md:text-[16px] font-bold text-[#313131]">
            {monthYearString}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 md:p-1 rounded hover:bg-[#f0edff] transition-colors"
            >
              <ChevronLeft className="w-6 h-6 md:w-5 md:h-5 text-[#313131]" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 md:p-1 rounded hover:bg-[#f0edff] transition-colors"
            >
              <ChevronRight className="w-6 h-6 md:w-5 md:h-5 text-[#313131]" />
            </button>
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 md:gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[12px] md:text-[11px] font-bold text-[#828282] py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 md:gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-4 pb-2 md:px-6 md:pt-6">
          <h3 className="text-[18px] md:text-[16px] font-bold text-[#313131]">
            {selectedDate
              ? `Tasks for ${selectedDate.toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )}`
              : "Select a date"}
          </h3>
          {selectedDate && (
            <p className="text-[14px] md:text-[13px] text-[#828282] mt-1">
              {selectedDateTasks.length}{" "}
              {selectedDateTasks.length === 1
                ? "task"
                : "tasks"}
            </p>
          )}
        </div>

        {selectedDate && selectedDateTasks.length === 0 && (
          <div className="text-center py-8 px-6">
            <p className="text-[14px] text-[#828282]">
              No tasks scheduled for this day
            </p>
          </div>
        )}

        {selectedDate && selectedDateTasks.length > 0 && (
          <div className="px-6 pb-6 pt-2 space-y-3 md:px-6 md:pb-6 md:pt-0 flex flex-col items-center md:items-start">
            {selectedDateTasks.map((task) => (
              <div
                key={task.id}
                className="w-full max-w-[236px] md:transform md:scale-[0.85] md:origin-top-left md:w-[117.6%] md:max-w-none"
              >
                <TaskCard
                  task={task}
                  onStatusChange={onTaskStatusChange}
                  onTaskClick={onTaskClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}