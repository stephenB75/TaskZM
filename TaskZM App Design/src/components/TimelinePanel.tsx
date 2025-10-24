import { Bell, GripVertical } from "lucide-react";
import { useState } from "react";
import NotificationsPanel, {
  NotificationBadge,
} from "./NotificationsPanel";

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
  subtasks?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

interface TimelinePanelProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  onTaskDrop?: (taskId: string, targetDate: Date) => void;
  onReorderTasks?: (
    taskId: string,
    targetTaskId: string,
    position: "before" | "after",
  ) => void;
  dismissedNotifications?: Set<string>;
  onDismissNotification?: (notificationId: string) => void;
  onClearAllNotifications?: (notificationIds: string[]) => void;
}

const getStatusTag = (status: Task["status"]) => {
  switch (status) {
    case "done":
      return {
        text: "Completed",
        bgColor: "#DCF3E7",
        textColor: "#16A34A",
      };
    case "inprogress":
      return {
        text: "In progress",
        bgColor: "#DBEAFE",
        textColor: "#2563EB",
      };
    case "todo":
      return {
        text: "To do",
        bgColor: "#FEE2E2",
        textColor: "#DC2626",
      };
  }
};

const getPriorityTag = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return {
        text: "High",
        bgColor: "#FEE2E2",
        textColor: "#DC2626",
      };
    case "medium":
      return {
        text: "Medium",
        bgColor: "#FEF3C7",
        textColor: "#D97706",
      };
    case "low":
      return {
        text: "Low",
        bgColor: "#E0E7FF",
        textColor: "#3730A3",
      };
  }
};

function TimelineItem({
  task,
  index,
  isNextTask,
  isLastItem,
  onTaskClick,
  onReorderTasks,
}: {
  task: Task;
  index: number;
  isNextTask: boolean;
  isLastItem: boolean;
  onTaskClick?: (taskId: string) => void;
  onReorderTasks?: (
    taskId: string,
    targetTaskId: string,
    position: "before" | "after",
  ) => void;
}) {
  const [dragOver, setDragOver] = useState<
    "before" | "after" | null
  >(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (time: string | undefined) => {
    if (!time) return "No time";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour =
      hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const statusTag = getStatusTag(task.status);
  const priorityTag = getPriorityTag(task.priority);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.setData("timeline-task", "true");
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger click when dragging
    if (isDragging) return;
    if (onTaskClick) {
      onTaskClick(task.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isTimelineTask =
      e.dataTransfer.types.includes("timeline-task");
    if (!isTimelineTask) return;

    // Determine if dropping before or after based on mouse position
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const position = e.clientY < midpoint ? "before" : "after";
    setDragOver(position);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const draggedTaskId = e.dataTransfer.getData("text/plain");
    const isTimelineTask =
      e.dataTransfer.types.includes("timeline-task");

    if (
      isTimelineTask &&
      draggedTaskId !== task.id &&
      onReorderTasks &&
      dragOver
    ) {
      onReorderTasks(draggedTaskId, task.id, dragOver);
    }

    setDragOver(null);
  };

  return (
    <div
      className={`timeline-item-wrapper flex gap-2 mb-4 relative transition-opacity ${isDragging ? "opacity-40" : "opacity-100"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop indicator - before */}
      {dragOver === "before" && (
        <div className="absolute -top-2 left-0 right-0 h-1 bg-[#3300ff] rounded-full z-10 shadow-md shadow-[#3300ff]/50" />
      )}

      {/* Drop indicator - after */}
      {dragOver === "after" && (
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#3300ff] rounded-full z-10 shadow-md shadow-[#3300ff]/50" />
      )}

      {/* Timeline indicator */}
      <div className="flex flex-col items-center pointer-events-none">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            isNextTask
              ? "bg-[#3300ff] text-white"
              : "bg-[#E5E7EB] text-[#374151]"
          }`}
        >
          <span className="text-[10px] font-medium">
            {index + 1}
          </span>
        </div>
        {!isLastItem && (
          <div
            className={`w-[2px] h-12 mt-1 ${
              isNextTask ? "bg-[#3300ff]/30" : "bg-[#F3F4F6]"
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Time */}
        <div
          className={`text-[10px] font-medium mb-1 pointer-events-none ${
            isNextTask ? "text-[#3300ff]" : "text-[#6B7280]"
          }`}
        >
          {formatTime(task.scheduledTime)}
        </div>

        {/* Task card - fully draggable */}
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          className={`task-card-content w-full bg-white rounded-lg p-2 mb-0.5 transition-all cursor-move relative ${
            isNextTask
              ? "border-2 border-[#3300ff] shadow-md shadow-[#3300ff]/20"
              : "border border-[#F3F4F6] hover:border-[#D1D5DB] hover:shadow-sm"
          } ${isDragging ? "opacity-50" : ""}`}
        >
          {/* First tag */}
          {task.tags.length > 0 && (
            <div className="mb-1">
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[8px] font-medium"
                style={{
                  backgroundColor: task.tags[0].bgColor,
                  color: task.tags[0].textColor,
                }}
              >
                {task.tags[0].text}
              </span>
            </div>
          )}

          {/* Task title */}
          <h4 className="font-medium text-[#111827] text-[11px] mb-0.5 line-clamp-1">
            {task.title}
          </h4>

          {/* Description */}
          <p className="text-[9px] text-[#6B7280] mb-2 line-clamp-2 leading-snug">
            {task.description}
          </p>

          {/* Tags and avatar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 flex-wrap">
              {/* Additional tags */}
              {task.tags.slice(1).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-block px-1.5 py-0.5 rounded text-[8px] font-medium"
                  style={{
                    backgroundColor: tag.bgColor,
                    color: tag.textColor,
                  }}
                >
                  {tag.text}
                </span>
              ))}
              {/* Priority tag */}
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[8px] font-medium"
                style={{
                  backgroundColor: priorityTag.bgColor,
                  color: priorityTag.textColor,
                }}
              >
                {priorityTag.text}
              </span>
              {/* Status tag */}
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[8px] font-medium"
                style={{
                  backgroundColor: statusTag.bgColor,
                  color: statusTag.textColor,
                }}
              >
                {statusTag.text}
              </span>
            </div>

            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Working status */}
        {isNextTask && (
          <div className="text-[9px] text-[#3300ff] font-medium mt-0.5 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-[#3300ff] rounded-full animate-pulse" />
            Next up
          </div>
        )}
      </div>
    </div>
  );
}

export default function TimelinePanel({
  tasks,
  onTaskClick,
  onTaskDrop,
  onReorderTasks,
  dismissedNotifications,
  onDismissNotification,
  onClearAllNotifications,
}: TimelinePanelProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);
  const today = new Date().toISOString().split("T")[0];

  // Filter tasks for today and sort by scheduled time
  const todayTasks = tasks
    .filter((task) => task.scheduledDate === today)
    .sort((a, b) => {
      const timeA = a.scheduledTime || "23:59";
      const timeB = b.scheduledTime || "23:59";
      return timeA.localeCompare(timeB);
    });

  // Find the next task that's not done
  const nextTaskIndex = todayTasks.findIndex(
    (task) => task.status !== "done",
  );

  // Calculate unread notification count (excluding dismissed ones)
  const getUnreadNotificationCount = () => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const todayStr = todayDate.toISOString().split("T")[0];

    const tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    let count = 0;

    // Count overdue tasks (not dismissed)
    tasks.forEach((task) => {
      if (
        task.status !== "done" &&
        task.scheduledDate < todayStr
      ) {
        const notificationId = `overdue-${task.id}`;
        if (!dismissedNotifications?.has(notificationId)) {
          count++;
        }
      }
    });

    // Count tasks due today (not dismissed)
    tasks.forEach((task) => {
      if (
        task.status !== "done" &&
        task.scheduledDate === todayStr
      ) {
        const notificationId = `today-${task.id}`;
        if (!dismissedNotifications?.has(notificationId)) {
          count++;
        }
      }
    });

    // Count high priority tasks for tomorrow (not dismissed)
    tasks.forEach((task) => {
      if (
        task.status !== "done" &&
        task.priority === "high" &&
        task.scheduledDate > todayStr &&
        task.scheduledDate <= tomorrowStr
      ) {
        const notificationId = `upcoming-${task.id}`;
        if (!dismissedNotifications?.has(notificationId)) {
          count++;
        }
      }
    });

    // Count calendar events starting soon (not dismissed)
    tasks.forEach((task) => {
      if (
        task.status !== "done" &&
        task.scheduledDate === todayStr &&
        task.scheduledTime
      ) {
        const [hours, minutes] = task.scheduledTime
          .split(":")
          .map(Number);
        const taskTime = new Date();
        taskTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const timeDiff = taskTime.getTime() - now.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        if (minutesDiff > 0 && minutesDiff <= 30) {
          const notificationId = `event-${task.id}`;
          if (!dismissedNotifications?.has(notificationId)) {
            count++;
          }
        }
      }
    });

    return count;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId && onTaskDrop) {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      onTaskDrop(taskId, todayDate);
    }
  };

  return (
    <div className="w-[315px] flex-shrink-0">
      {/* Panel */}
      <div
        className="h-screen flex flex-col overflow-hidden bg-[#e9f7e9] border-r border-[#E5E7EB]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 relative">
          {/* User profile */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTA4Njk3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-[#111827] text-[14px]">
                  Armenuh Ivanyan
                </h3>
                <p className="text-[12px] text-[#6B7280]">
                  Ivanyan_Armenia
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() =>
                  setIsNotificationsOpen(!isNotificationsOpen)
                }
                className="p-1 rounded hover:bg-gray-100 transition-colors relative"
                title="View notifications"
              >
                <Bell className="w-5 h-5 text-[#9CA3AF] hover:text-[#6B7280]" />
                <NotificationBadge
                  count={getUnreadNotificationCount()}
                />
              </button>
            </div>
          </div>

          {/* Notifications Panel - positioned relative to header */}
          <NotificationsPanel
            tasks={tasks}
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onTaskClick={onTaskClick}
            dismissedNotifications={dismissedNotifications}
            onDismissNotification={onDismissNotification}
            onClearAllNotifications={onClearAllNotifications}
          />

          {/* Section title */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#111827] text-[16px]">
              Today's Agenda
            </h2>
          </div>
          <div className="text-[#828282] mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
            })}{" "}
            {new Date().getDate()}
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            {todayTasks.length} task
            {todayTasks.length !== 1 ? "s" : ""} scheduled
          </p>
        </div>

        {/* Timeline */}
        <div className="flex-1 px-6 overflow-y-auto min-h-0 relative">
          <div className="pb-6">
            {todayTasks.length > 0 ? (
              todayTasks.map((task, index) => (
                <TimelineItem
                  key={task.id}
                  task={task}
                  index={index}
                  isNextTask={index === nextTaskIndex}
                  isLastItem={index === todayTasks.length - 1}
                  onTaskClick={onTaskClick}
                  onReorderTasks={onReorderTasks}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">📅</span>
                </div>
                <p className="text-[12px] text-[#6B7280] mb-1">
                  No tasks scheduled for today
                </p>
                <p className="text-[11px] text-[#9CA3AF]">
                  Drag tasks here or add new ones
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}