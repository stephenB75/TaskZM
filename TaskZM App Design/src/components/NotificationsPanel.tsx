import { useState, useEffect } from "react";
import {
  Bell,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  X,
} from "lucide-react";

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

interface Notification {
  id: string;
  type:
    | "overdue"
    | "due_today"
    | "upcoming"
    | "high_priority"
    | "calendar_event";
  title: string;
  description: string;
  taskId?: string;
  timestamp: Date;
  read: boolean;
  priority: "high" | "medium" | "low";
}

interface NotificationsPanelProps {
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
  onTaskClick?: (taskId: string) => void;
  dismissedNotifications?: Set<string>;
  onDismissNotification?: (notificationId: string) => void;
  onClearAllNotifications?: (notificationIds: string[]) => void;
}

export default function NotificationsPanel({
  tasks,
  isOpen,
  onClose,
  onTaskClick,
  dismissedNotifications,
  onDismissNotification,
  onClearAllNotifications,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  // Generate notifications based on tasks
  useEffect(() => {
    const generatedNotifications: Notification[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    // Check for overdue tasks
    tasks.forEach((task) => {
      if (
        task.status !== "done" &&
        task.scheduledDate < todayStr
      ) {
        const notificationId = `overdue-${task.id}`;
        if (!dismissedNotifications?.has(notificationId)) {
          generatedNotifications.push({
            id: notificationId,
            type: "overdue",
            title: "Overdue Task",
            description: task.title,
            taskId: task.id,
            timestamp: new Date(),
            read: false,
            priority: "high",
          });
        }
      }
    });

    // Check for tasks due today
    tasks.forEach((task) => {
      if (
        task.status !== "done" &&
        task.scheduledDate === todayStr
      ) {
        const notificationId = `today-${task.id}`;
        if (!dismissedNotifications?.has(notificationId)) {
          generatedNotifications.push({
            id: notificationId,
            type: "due_today",
            title: "Due Today",
            description: task.title,
            taskId: task.id,
            timestamp: new Date(),
            read: false,
            priority:
              task.priority === "high" ? "high" : "medium",
          });
        }
      }
    });

    // Check for high priority upcoming tasks
    tasks.forEach((task) => {
      if (
        task.status !== "done" &&
        task.priority === "high" &&
        task.scheduledDate > todayStr &&
        task.scheduledDate <= tomorrowStr
      ) {
        const notificationId = `upcoming-${task.id}`;
        if (!dismissedNotifications?.has(notificationId)) {
          generatedNotifications.push({
            id: notificationId,
            type: "high_priority",
            title: "High Priority Tomorrow",
            description: task.title,
            taskId: task.id,
            timestamp: new Date(),
            read: false,
            priority: "high",
          });
        }
      }
    });

    // Check for calendar events (tasks with specific times today)
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

        // Notify if event is within next 30 minutes
        if (minutesDiff > 0 && minutesDiff <= 30) {
          const notificationId = `event-${task.id}`;
          if (!dismissedNotifications?.has(notificationId)) {
            generatedNotifications.push({
              id: notificationId,
              type: "calendar_event",
              title: "Event Starting Soon",
              description: `${task.title} at ${task.scheduledTime}`,
              taskId: task.id,
              timestamp: new Date(),
              read: false,
              priority: "medium",
            });
          }
        }
      }
    });

    // Sort by priority (high first) and timestamp
    generatedNotifications.sort((a, b) => {
      if (a.priority === "high" && b.priority !== "high")
        return -1;
      if (a.priority !== "high" && b.priority === "high")
        return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    setNotifications(generatedNotifications);
  }, [tasks, dismissedNotifications]);

  const handleNotificationClick = (
    notification: Notification,
  ) => {
    // Dismiss the notification when clicked
    if (onDismissNotification) {
      onDismissNotification(notification.id);
    }
  };

  const handleClearAll = () => {
    // Dismiss all notifications
    if (onClearAllNotifications) {
      const allNotificationIds = notifications.map((n) => n.id);
      onClearAllNotifications(allNotificationIds);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "due_today":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "upcoming":
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case "high_priority":
        return (
          <AlertCircle className="w-4 h-4 text-amber-500" />
        );
      case "calendar_event":
        return <Calendar className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.read,
  ).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Notifications Panel */}
      <div className="absolute left-2 right-2 top-12 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#3300ff]" />
            <h3 className="font-semibold text-[#111827]">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-red-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4 text-[#9CA3AF]" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <p className="text-[11px] text-[#6B7280]">
              Click to dismiss
            </p>
            <button
              onClick={handleClearAll}
              className="text-[12px] text-[#3300ff] hover:text-[#2200cc] font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-3">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
              <p className="text-[14px] font-semibold text-[#111827] mb-1">
                All caught up!
              </p>
              <p className="text-[12px] text-[#6B7280] text-center">
                You have no notifications at the moment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`p-3 cursor-pointer transition-colors ${
                    notification.read
                      ? "bg-white hover:bg-gray-50"
                      : "bg-blue-50 hover:bg-blue-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[12px] font-semibold text-[#111827]">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-[#3300ff] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[12px] text-[#6B7280] line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-[10px] text-[#9CA3AF] mt-1">
                        {notification.timestamp.toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function NotificationBadge({
  count,
}: {
  count: number;
}) {
  if (count === 0) return null;

  return (
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
      <span className="text-[9px] text-white font-bold">
        {count > 9 ? "9+" : count}
      </span>
    </div>
  );
}