import { useState } from "react";
import DayColumn from "./components/DayColumn";
import WeekNavigation from "./components/WeekNavigation";
import TimelinePanel from "./components/TimelinePanel";
import VerticalNavBar from "./components/VerticalNavBar";
import MobileBottomNav from "./components/MobileBottomNav";
import InboxPanel, { InboxTask } from "./components/InboxPanel";
import CalendarPanel from "./components/CalendarPanel";
import SettingsPanel from "./components/SettingsPanel";
import ArchivePanel from "./components/ArchivePanel";
import AddTaskModal from "./components/AddTaskModal";
import MobileTodayAgenda from "./components/MobileTodayAgenda";
import MonthView from "./components/MonthView";
import { sampleTasks } from "./data/sampleTasks";
import { Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import { TagDefinition } from "./components/TagManager";

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
  dependencies?: string[];
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number; // e.g., every 1 day, every 2 weeks
    endDate?: string;
    count?: number; // number of occurrences
    daysOfWeek?: number[]; // 0=Sun, 1=Mon, etc. (for weekly)
  };
  recurringGroupId?: string; // Group ID for all instances of a recurring task
}

// Default tags
const defaultTags: TagDefinition[] = [
  {
    id: "1",
    text: "Work",
    bgColor: "#e1f6ff",
    textColor: "#2c62b4",
    fontWeight: "bold",
  },
  {
    id: "2",
    text: "Personal",
    bgColor: "#fbe6fc",
    textColor: "#ff00b8",
    fontWeight: "bold",
  },
  {
    id: "3",
    text: "Project",
    bgColor: "#e8f5e8",
    textColor: "#0d7f0d",
    fontWeight: "bold",
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>(
    [],
  );
  const [availableTags, setAvailableTags] =
    useState<TagDefinition[]>(defaultTags);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] =
    useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(
    null,
  );
  const [isAutoScheduling, setIsAutoScheduling] =
    useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [pendingSchedule, setPendingSchedule] = useState<
    Task[] | null
  >(null);
  const [activePanel, setActivePanel] = useState<
    | "inbox"
    | "calendar"
    | "settings"
    | "archive"
    | "week"
    | null
  >(null);
  const [showMobileCalendar, setShowMobileCalendar] =
    useState(false);
  const [mobileView, setMobileView] = useState<
    "week" | "inbox" | "calendar" | "settings"
  >("week");
  const [inboxTasks, setInboxTasks] = useState<InboxTask[]>([]);
  const [schedulingInboxTaskId, setSchedulingInboxTaskId] =
    useState<string | null>(null);
  const [tasksPerDayLimit, setTasksPerDayLimit] = useState(6);
  const [weekStartMode, setWeekStartMode] = useState<
    "current" | "monday"
  >("current");
  const [viewMode, setViewMode] = useState<"week" | "month">(
    "week",
  );
  const [dismissedNotifications, setDismissedNotifications] =
    useState<Set<string>>(() => {
      // Load dismissed notifications from localStorage
      const stored = localStorage.getItem(
        "dismissedNotifications",
      );
      return stored ? new Set(JSON.parse(stored)) : new Set();
    });
  const TASKS_PER_DAY_LIMIT = tasksPerDayLimit;

  const handleTaskStatusChange = (
    taskId: string,
    newStatus: Task["status"],
  ) => {
    // Check if task is in archive
    const archivedTask = archivedTasks.find(
      (t) => t.id === taskId,
    );

    if (archivedTask) {
      // Task is in archive
      if (newStatus === "done") {
        // Keep in archive, just update status
        setArchivedTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? { ...task, status: newStatus }
              : task,
          ),
        );
      } else {
        // Moving out of done status - restore to active tasks
        const updatedTask = {
          ...archivedTask,
          status: newStatus,
        };
        setArchivedTasks((prevTasks) =>
          prevTasks.filter((t) => t.id !== taskId),
        );
        setTasks((prevTasks) => [...prevTasks, updatedTask]);
        toast.success("Task restored from archive");
      }
    } else {
      // Task is in active tasks
      if (newStatus === "done") {
        // Move to archive
        const taskToArchive = tasks.find(
          (t) => t.id === taskId,
        );
        if (taskToArchive) {
          const archivedTask = {
            ...taskToArchive,
            status: newStatus,
          };
          setTasks((prevTasks) =>
            prevTasks.filter((t) => t.id !== taskId),
          );
          setArchivedTasks((prevTasks) => [
            ...prevTasks,
            archivedTask,
          ]);
          toast.success("Task completed and archived");
        }
      } else {
        // Just update status
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? { ...task, status: newStatus }
              : task,
          ),
        );
      }
    }
  };

  const handleTaskDrop = (taskId: string, targetDate: Date) => {
    const formattedDate = targetDate
      .toISOString()
      .split("T")[0];
    const task = tasks.find((t) => t.id === taskId);
    const oldDate = task?.scheduledDate;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, scheduledDate: formattedDate }
          : task,
      ),
    );

    // Show toast notification
    if (task) {
      const isToday =
        formattedDate ===
        new Date().toISOString().split("T")[0];
      const targetDateStr = targetDate.toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" },
      );

      if (isToday) {
        toast.success("Task moved to today", {
          description: `"${task.title}" has been added to today's agenda`,
        });
      } else {
        toast.success("Task rescheduled", {
          description: `"${task.title}" moved to ${targetDateStr}`,
        });
      }
    }
  };

  const handleReorderTasks = (
    taskId: string,
    targetTaskId: string,
    position: "before" | "after",
  ) => {
    const today = new Date().toISOString().split("T")[0];

    // Get today's tasks sorted by time
    const todayTasks = tasks
      .filter((task) => task.scheduledDate === today)
      .sort((a, b) => {
        const timeA = a.scheduledTime || "23:59";
        const timeB = b.scheduledTime || "23:59";
        return timeA.localeCompare(timeB);
      });

    const draggedTaskIndex = todayTasks.findIndex(
      (t) => t.id === taskId,
    );
    const targetTaskIndex = todayTasks.findIndex(
      (t) => t.id === targetTaskId,
    );

    if (draggedTaskIndex === -1 || targetTaskIndex === -1)
      return;

    // Remove dragged task and insert at new position
    const reorderedTasks = [...todayTasks];
    const [draggedTask] = reorderedTasks.splice(
      draggedTaskIndex,
      1,
    );

    // Calculate new index based on position
    let newIndex = targetTaskIndex;
    if (draggedTaskIndex < targetTaskIndex) {
      // Dragging down
      newIndex =
        position === "before"
          ? targetTaskIndex - 1
          : targetTaskIndex;
    } else {
      // Dragging up
      newIndex =
        position === "before"
          ? targetTaskIndex
          : targetTaskIndex + 1;
    }

    reorderedTasks.splice(newIndex, 0, draggedTask);

    // Recalculate times based on new order
    // Distribute times evenly throughout the day (9 AM to 5 PM)
    const startHour = 9;
    const endHour = 17;
    const totalMinutes = (endHour - startHour) * 60;
    const intervalMinutes = Math.floor(
      totalMinutes / Math.max(reorderedTasks.length, 1),
    );

    const updatedTasks = reorderedTasks.map((task, index) => {
      const totalMinutesFromStart = index * intervalMinutes;
      const hours =
        startHour + Math.floor(totalMinutesFromStart / 60);
      const minutes = totalMinutesFromStart % 60;
      const scheduledTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      return { ...task, scheduledTime };
    });

    // Update all tasks
    setTasks((prevTasks) => {
      const otherTasks = prevTasks.filter(
        (t) => t.scheduledDate !== today,
      );
      return [...otherTasks, ...updatedTasks];
    });

    toast.success("Timeline updated", {
      description: "Task order and times adjusted",
    });
  };

  const handleReorderTasksInDay = (
    date: Date,
    taskId: string,
    targetTaskId: string,
    position: "before" | "after",
  ) => {
    const dateString = date.toISOString().split("T")[0];

    // Get tasks for this specific day sorted by time
    const dayTasks = tasks
      .filter((task) => task.scheduledDate === dateString)
      .sort((a, b) => {
        const timeA = a.scheduledTime || "23:59";
        const timeB = b.scheduledTime || "23:59";
        return timeA.localeCompare(timeB);
      });

    const draggedTaskIndex = dayTasks.findIndex(
      (t) => t.id === taskId,
    );
    const targetTaskIndex = dayTasks.findIndex(
      (t) => t.id === targetTaskId,
    );

    if (draggedTaskIndex === -1 || targetTaskIndex === -1)
      return;

    // Remove dragged task and insert at new position
    const reorderedTasks = [...dayTasks];
    const [draggedTask] = reorderedTasks.splice(
      draggedTaskIndex,
      1,
    );

    // Calculate new index based on position
    let newIndex = targetTaskIndex;
    if (draggedTaskIndex < targetTaskIndex) {
      // Dragging down
      newIndex =
        position === "before"
          ? targetTaskIndex - 1
          : targetTaskIndex;
    } else {
      // Dragging up
      newIndex =
        position === "before"
          ? targetTaskIndex
          : targetTaskIndex + 1;
    }

    reorderedTasks.splice(newIndex, 0, draggedTask);

    // Recalculate times based on new order
    // Distribute times evenly throughout the day (9 AM to 5 PM)
    const startHour = 9;
    const endHour = 17;
    const totalMinutes = (endHour - startHour) * 60;
    const intervalMinutes = Math.floor(
      totalMinutes / Math.max(reorderedTasks.length, 1),
    );

    const updatedTasks = reorderedTasks.map((task, index) => {
      const totalMinutesFromStart = index * intervalMinutes;
      const hours =
        startHour + Math.floor(totalMinutesFromStart / 60);
      const minutes = totalMinutesFromStart % 60;
      const scheduledTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      return { ...task, scheduledTime };
    });

    // Update all tasks
    setTasks((prevTasks) => {
      const otherTasks = prevTasks.filter(
        (t) => t.scheduledDate !== dateString,
      );
      return [...otherTasks, ...updatedTasks];
    });

    toast.success("Tasks reordered", {
      description: `Task order updated for ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    });
  };

  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    if (weekStartMode === "monday") {
      // Calculate Monday of the week
      const day = start.getDay();
      const diff = day === 0 ? -6 : 1 - day; // If Sunday (0), go back 6 days, otherwise go to Monday
      const monday = new Date(start);
      monday.setDate(start.getDate() + diff);
      return monday;
    }

    // Start from the day after the current day for rolling 7-day view
    const tomorrow = new Date(start);
    tomorrow.setDate(start.getDate() + 1);
    return tomorrow;
  };

  const getWeekDays = (startDate: Date) => {
    const days = [];
    // Show all 7 days (Monday-Sunday)
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const filteredTasks = tasks.filter(
      (task) => task.scheduledDate === dateString,
    );
    console.log(
      `Tasks for ${dateString}:`,
      filteredTasks.length,
      filteredTasks.map((t) => t.title),
    );
    return filteredTasks;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getTasksForStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleAddTask = (
    taskData: Omit<Task, "id">,
    useAiSchedule = false,
  ) => {
    // Check if this is a recurring task
    if (taskData.recurring) {
      // Generate recurring task instances
      const recurringGroupId =
        Date.now().toString() +
        Math.random().toString(36).substr(2, 9);
      const instances = generateRecurringTasks(
        taskData,
        recurringGroupId,
        useAiSchedule,
      );

      setTasks((prevTasks) => [...prevTasks, ...instances]);

      // If this task was from inbox, remove it from inbox
      if (schedulingInboxTaskId) {
        setInboxTasks((prevInboxTasks) =>
          prevInboxTasks.filter(
            (t) => t.id !== schedulingInboxTaskId,
          ),
        );
        setSchedulingInboxTaskId(null);
      }

      toast.success(`Recurring task created!`, {
        description: `${instances.length} task instances scheduled`,
      });
    } else {
      // Single task creation
      const newTask: Task = {
        ...taskData,
        id:
          Date.now().toString() +
          Math.random().toString(36).substr(2, 9),
      };

      // If AI schedule is enabled, find the best slot
      if (useAiSchedule) {
        const scheduledDate = findBestScheduleSlot(
          newTask,
          tasks,
        );
        newTask.scheduledDate = scheduledDate;
      }

      setTasks((prevTasks) => [...prevTasks, newTask]);

      // If this task was from inbox, remove it from inbox
      if (schedulingInboxTaskId) {
        setInboxTasks((prevInboxTasks) =>
          prevInboxTasks.filter(
            (t) => t.id !== schedulingInboxTaskId,
          ),
        );
        setSchedulingInboxTaskId(null);
      }

      if (useAiSchedule) {
        toast.success("Task scheduled with AI!", {
          description: `Your task was intelligently scheduled for ${new Date(newTask.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        });
      }
    }
  };

  const generateRecurringTasks = (
    taskData: Omit<Task, "id">,
    recurringGroupId: string,
    useAiSchedule: boolean,
  ): Task[] => {
    const instances: Task[] = [];
    const startDate = new Date(taskData.scheduledDate);
    const recurring = taskData.recurring!;

    // Validate interval
    const interval = Math.max(1, recurring.interval || 1);

    // Calculate how many instances to create
    let count = Math.max(
      1,
      Math.min(52, recurring.count || 10),
    ); // Default to 10, max 52

    if (recurring.endDate) {
      const endDate = new Date(recurring.endDate);
      const daysDiff = Math.floor(
        (endDate.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysDiff > 0) {
        if (recurring.frequency === "daily") {
          count = Math.min(
            count,
            Math.floor(daysDiff / interval) + 1,
          );
        } else if (recurring.frequency === "weekly") {
          count = Math.min(
            count,
            Math.floor(daysDiff / (7 * interval)) + 1,
          );
        } else if (recurring.frequency === "monthly") {
          count = Math.min(
            count,
            Math.floor(daysDiff / 30) + 1,
          );
        }
      }
    }

    // Ensure count is valid and limited
    count = Math.max(1, Math.min(52, count));

    for (let i = 0; i < count; i++) {
      const instanceDate = new Date(startDate);

      if (recurring.frequency === "daily") {
        instanceDate.setDate(
          startDate.getDate() + i * interval,
        );
      } else if (recurring.frequency === "weekly") {
        instanceDate.setDate(
          startDate.getDate() + i * 7 * interval,
        );
      } else if (recurring.frequency === "monthly") {
        instanceDate.setMonth(
          startDate.getMonth() + i * interval,
        );
      }

      // Check if end date is exceeded
      if (
        recurring.endDate &&
        instanceDate > new Date(recurring.endDate)
      ) {
        break;
      }

      const scheduledDate = instanceDate
        .toISOString()
        .split("T")[0];

      const instance: Task = {
        ...taskData,
        id: `${recurringGroupId}-${i}`,
        recurringGroupId,
        scheduledDate,
        // Reset dependencies for recurring instances to avoid complex dependency chains
        dependencies: undefined,
      };

      instances.push(instance);
    }

    return instances;
  };

  const findBestScheduleSlot = (
    newTask: Task,
    existingTasks: Task[],
  ): string => {
    const weekStart = getWeekStart(currentWeek);

    // Priority weights for scheduling
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const taskPriority = priorityWeight[newTask.priority];

    // Start with current week and expand to 4 weeks if needed
    const maxWeeks = 4;
    let allDays: Date[] = [];

    for (let week = 0; week < maxWeeks; week++) {
      const weekStartDate = new Date(weekStart);
      weekStartDate.setDate(weekStart.getDate() + week * 7);
      const weekDays = getWeekDays(weekStartDate);
      allDays.push(...weekDays);
    }

    // Count tasks per day
    const taskCounts: { [key: string]: number } = {};
    const prioritySums: { [key: string]: number } = {};

    allDays.forEach((day) => {
      const dateString = day.toISOString().split("T")[0];
      taskCounts[dateString] = 0;
      prioritySums[dateString] = 0;
    });

    // Count existing tasks and calculate priority load
    existingTasks.forEach((task) => {
      if (
        task.status !== "done" &&
        taskCounts[task.scheduledDate] !== undefined
      ) {
        taskCounts[task.scheduledDate]++;
        prioritySums[task.scheduledDate] +=
          priorityWeight[task.priority];
      }
    });

    // Find the best day based on:
    // 1. Not exceeding the limit
    // 2. Lowest workload (task count)
    // 3. Lowest priority sum (for ties)
    // 4. Earlier in the week for high priority (prefer weekdays)
    let bestDay = allDays[0];
    let bestScore = Infinity;

    allDays.forEach((day) => {
      const dateString = day.toISOString().split("T")[0];
      const count = taskCounts[dateString];
      const prioritySum = prioritySums[dateString];
      const dayOfWeek = day.getDay(); // 0 = Sunday, 6 = Saturday

      // Skip if over limit (unless all days are over limit)
      if (count >= tasksPerDayLimit) {
        const allOverLimit = allDays.every((d) => {
          const ds = d.toISOString().split("T")[0];
          return taskCounts[ds] >= tasksPerDayLimit;
        });
        if (!allOverLimit) return;
      }

      // Calculate score (lower is better)
      // For high priority: prefer weekdays (Mon-Fri) earlier in the timeline with lower load
      // For medium/low priority: prefer days with lowest load
      let score;
      if (newTask.priority === "high") {
        const dayIndex = allDays.indexOf(day);
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const weekendPenalty = isWeekend ? 50 : 0; // Prefer weekdays for high priority
        score =
          count * 100 +
          prioritySum * 10 +
          dayIndex +
          weekendPenalty;
      } else {
        score = count * 100 + prioritySum * 10;
      }

      if (score < bestScore) {
        bestScore = score;
        bestDay = day;
      }
    });

    return bestDay.toISOString().split("T")[0];
  };

  const handleEditTask = (
    taskId: string,
    taskData: Omit<Task, "id">,
    useAiSchedule = false,
  ) => {
    let updatedTaskData = { ...taskData };

    // If AI schedule is enabled, find the best slot
    if (useAiSchedule) {
      const tempTask: Task = { ...taskData, id: taskId };
      // Filter out the current task from the list when finding the best slot
      const otherTasks = tasks.filter((t) => t.id !== taskId);
      const scheduledDate = findBestScheduleSlot(
        tempTask,
        otherTasks,
      );
      updatedTaskData.scheduledDate = scheduledDate;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...updatedTaskData, id: taskId }
          : task,
      ),
    );

    if (useAiSchedule) {
      toast.success("Task rescheduled with AI!", {
        description: `Your task was intelligently rescheduled for ${new Date(updatedTaskData.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      });
    } else {
      toast.success("Task updated successfully!");
    }
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsAddTaskModalOpen(true);
    }
  };

  const [prefilledTaskTitle, setPrefilledTaskTitle] =
    useState<string>("");

  const handleAddInboxTask = (task: InboxTask) => {
    setInboxTasks((prevTasks) => [task, ...prevTasks]);
  };

  const handleScheduleInboxTask = (
    taskId: string,
    title: string,
  ) => {
    // Open the Add Task modal with pre-filled title
    // Track which inbox task is being scheduled
    setSchedulingInboxTaskId(taskId);
    setPrefilledTaskTitle(title);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setIsAddTaskModalOpen(true);
  };

  const handleAddTaskToDay = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    setIsAddTaskModalOpen(true);
    // We'll pass the selected date to the modal
    setSelectedDate(dateString);
  };

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const handlePanelChange = (
    panel:
      | "inbox"
      | "calendar"
      | "settings"
      | "archive"
      | "week",
  ) => {
    // For desktop: toggle panels
    if (panel === "week") {
      setActivePanel(null);
    } else {
      setActivePanel((prevPanel) =>
        prevPanel === panel ? null : panel,
      );
    }
  };

  const handleMobileNavChange = (
    view: "week" | "inbox" | "calendar" | "settings",
  ) => {
    setMobileView(view);
  };

  const handleDismissNotification = (
    notificationId: string,
  ) => {
    setDismissedNotifications((prev) => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      // Save to localStorage
      localStorage.setItem(
        "dismissedNotifications",
        JSON.stringify([...newSet]),
      );
      return newSet;
    });
  };

  const handleClearAllNotifications = (
    notificationIds: string[],
  ) => {
    setDismissedNotifications((prev) => {
      const newSet = new Set(prev);
      notificationIds.forEach((id) => newSet.add(id));
      // Save to localStorage
      localStorage.setItem(
        "dismissedNotifications",
        JSON.stringify([...newSet]),
      );
      return newSet;
    });
  };

  const handleDeleteArchivedTask = (taskId: string) => {
    setArchivedTasks((prevTasks) =>
      prevTasks.filter((t) => t.id !== taskId),
    );
    toast.success("Task permanently deleted");
  };

  const handleClearArchive = () => {
    setArchivedTasks([]);
    toast.success("Archive cleared");
  };

  // Tag management handlers
  const handleAddTag = (tag: Omit<TagDefinition, "id">) => {
    const newTag: TagDefinition = {
      ...tag,
      id:
        Date.now().toString() +
        Math.random().toString(36).substr(2, 9),
    };
    setAvailableTags((prev) => [...prev, newTag]);
    toast.success("Tag created successfully");
  };

  const handleEditTag = (
    id: string,
    tag: Omit<TagDefinition, "id">,
  ) => {
    setAvailableTags((prev) =>
      prev.map((t) => (t.id === id ? { ...tag, id } : t)),
    );
    toast.success("Tag updated successfully");
  };

  const handleDeleteTag = (id: string) => {
    setAvailableTags((prev) => prev.filter((t) => t.id !== id));
    toast.success("Tag deleted successfully");
  };

  const handleAutoSchedule = async () => {
    setIsAutoScheduling(true);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const weekStart = getWeekStart(currentWeek);

    // Get tasks that need scheduling (todo and inprogress, not done)
    const existingTasksToSchedule = tasks.filter(
      (task) => task.status !== "done",
    );

    // Convert inbox tasks to full Task objects (with low priority by default)
    const inboxTasksConverted: Task[] = inboxTasks.map(
      (inboxTask) => ({
        id: inboxTask.id,
        title: inboxTask.title,
        description: "",
        tags: [],
        priority: "low" as const,
        assignee: {
          name: "You",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        },
        dueDate: "",
        status: "todo" as const,
        scheduledDate: new Date().toISOString().split("T")[0],
        scheduledTime: undefined,
      }),
    );

    // Combine existing tasks and inbox tasks
    const allTasksToSchedule = [
      ...existingTasksToSchedule,
      ...inboxTasksConverted,
    ];

    // Sort tasks by priority (high > medium > low) and due date
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const sortedTasks = [...allTasksToSchedule].sort((a, b) => {
      const priorityDiff =
        priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // If same priority, sort by due date if available
      if (a.dueDate && b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate);
      }
      return 0;
    });

    // Calculate how many weeks we need to accommodate all tasks
    const totalTasksToSchedule = sortedTasks.length;
    const tasksPerWeek = TASKS_PER_DAY_LIMIT * 7;
    const weeksNeeded = Math.ceil(
      totalTasksToSchedule / tasksPerWeek,
    );

    // Generate days for multiple weeks if needed
    const allDays: Date[] = [];
    for (let week = 0; week < weeksNeeded; week++) {
      const weekStartDate = new Date(weekStart);
      weekStartDate.setDate(weekStart.getDate() + week * 7);
      const weekDays = getWeekDays(weekStartDate);
      allDays.push(...weekDays);
    }

    // Distribute tasks across available days respecting the limit
    const scheduledTasks: Task[] = [];
    const taskCounts: { [key: string]: number } = {};

    // Initialize task counts for each day
    allDays.forEach((day) => {
      const dateString = day.toISOString().split("T")[0];
      taskCounts[dateString] = 0;
    });

    // Distribute tasks respecting the daily limit
    let dayIndex = 0;
    sortedTasks.forEach((task) => {
      let placed = false;

      // Find the next available day with space
      while (!placed && dayIndex < allDays.length) {
        const targetDay = allDays[dayIndex];
        const formattedDate = targetDay
          .toISOString()
          .split("T")[0];

        if (taskCounts[formattedDate] < TASKS_PER_DAY_LIMIT) {
          scheduledTasks.push({
            ...task,
            scheduledDate: formattedDate,
          });
          taskCounts[formattedDate]++;
          placed = true;
        } else {
          dayIndex++;
        }
      }

      // If still not placed (shouldn't happen with our calculation), place it anyway
      if (!placed && allDays.length > 0) {
        const lastDay = allDays[allDays.length - 1];
        const formattedDate = lastDay
          .toISOString()
          .split("T")[0];
        scheduledTasks.push({
          ...task,
          scheduledDate: formattedDate,
        });
      }
    });

    // Keep done tasks as is
    const doneTasks = tasks.filter(
      (task) => task.status === "done",
    );

    setTasks([...scheduledTasks, ...doneTasks]);

    // Clear inbox since all inbox tasks were scheduled
    setInboxTasks([]);

    setIsAutoScheduling(false);

    const inboxCount = inboxTasksConverted.length;
    const totalCount = sortedTasks.length;
    const existingCount = existingTasksToSchedule.length;

    // Create a descriptive message based on scheduling
    let description = "";
    if (weeksNeeded === 1) {
      description =
        inboxCount > 0
          ? `${totalCount} tasks distributed across the week (${existingCount} existing + ${inboxCount} from inbox).`
          : `${totalCount} tasks distributed across the week based on priority and workload.`;
    } else {
      description =
        inboxCount > 0
          ? `${totalCount} tasks distributed across ${weeksNeeded} weeks (${existingCount} existing + ${inboxCount} from inbox) to maintain ${TASKS_PER_DAY_LIMIT} tasks per day limit.`
          : `${totalCount} tasks distributed across ${weeksNeeded} weeks to maintain ${TASKS_PER_DAY_LIMIT} tasks per day limit.`;
    }

    toast.success("Tasks auto-scheduled successfully!", {
      description,
    });
  };

  const handleConfirmScheduleOverLimit = () => {
    if (!pendingSchedule) return;

    const weekStart = getWeekStart(currentWeek);
    const weekDays = getWeekDays(weekStart);

    // Redistribute ALL tasks evenly, ignoring the limit
    const tasksPerDay = Math.ceil(
      pendingSchedule.length / weekDays.length,
    );
    const scheduledTasks: Task[] = [];

    pendingSchedule.forEach((task, index) => {
      const dayIndex = Math.floor(index / tasksPerDay);
      const targetDay =
        weekDays[Math.min(dayIndex, weekDays.length - 1)];
      const formattedDate = targetDay
        .toISOString()
        .split("T")[0];

      scheduledTasks.push({
        ...task,
        scheduledDate: formattedDate,
      });
    });

    // Keep done tasks as is
    const doneTasks = tasks.filter(
      (task) => task.status === "done",
    );

    setTasks([...scheduledTasks, ...doneTasks]);

    // Clear inbox since all inbox tasks were scheduled
    setInboxTasks([]);

    setShowLimitDialog(false);
    setPendingSchedule(null);

    toast.success("Tasks auto-scheduled successfully!", {
      description: `${pendingSchedule.length} tasks distributed across the week (exceeding ${TASKS_PER_DAY_LIMIT} per day limit).`,
    });
  };

  const handleCancelScheduleOverLimit = () => {
    setShowLimitDialog(false);
    setPendingSchedule(null);

    toast.info("Auto-scheduling cancelled", {
      description:
        "Tasks were not rescheduled. Consider reducing your task load or extending the timeline.",
    });
  };

  const weekStart = getWeekStart(currentWeek);
  const weekDays = getWeekDays(weekStart);

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden bg-[#f8f9fa]">
        {/* Today's Agenda View */}
        {mobileView === "week" && (
          <MobileTodayAgenda
            tasks={tasks}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskClick={handleTaskClick}
            onAddTask={() => {
              setEditingTask(null);
              setSelectedDate(
                new Date().toISOString().split("T")[0],
              );
              setIsAddTaskModalOpen(true);
            }}
            onOpenCalendar={() => setShowMobileCalendar(true)}
            onAutoSchedule={handleAutoSchedule}
            isScheduling={isAutoScheduling}
            onReorderTasks={handleReorderTasks}
          />
        )}

        {/* Inbox Only View */}
        {mobileView === "inbox" && (
          <div className="w-full min-h-screen pb-20">
            <InboxPanel
              inboxTasks={inboxTasks}
              onAddInboxTask={handleAddInboxTask}
              onScheduleTask={handleScheduleInboxTask}
            />
          </div>
        )}

        {/* Calendar View */}
        {mobileView === "calendar" && (
          <div className="w-full min-h-screen pb-20 overflow-y-auto">
            <CalendarPanel
              tasks={tasks}
              onTaskStatusChange={handleTaskStatusChange}
              onTaskClick={handleTaskClick}
            />
          </div>
        )}

        {/* Settings View */}
        {mobileView === "settings" && (
          <div className="w-full min-h-screen pb-20 overflow-y-auto">
            <SettingsPanel
              tasksPerDayLimit={tasksPerDayLimit}
              onTasksPerDayLimitChange={setTasksPerDayLimit}
              weekStartMode={weekStartMode}
              onWeekStartModeChange={setWeekStartMode}
              availableTags={availableTags}
              onAddTag={handleAddTag}
              onEditTag={handleEditTag}
              onDeleteTag={handleDeleteTag}
            />
          </div>
        )}

        {/* Calendar Panel Overlay (from Today view) */}
        {showMobileCalendar && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            <div className="px-6 pt-6 pb-4">
              <button
                onClick={() => setShowMobileCalendar(false)}
                className="p-2 rounded-lg bg-[#e9ebef] hover:bg-[#d9dbe0] transition-colors"
                aria-label="Close calendar"
              >
                <svg
                  className="w-6 h-6 text-[#313131]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <CalendarPanel
              tasks={tasks}
              onTaskStatusChange={handleTaskStatusChange}
              onTaskClick={handleTaskClick}
            />
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          activePanel={mobileView}
          onPanelChange={handleMobileNavChange}
        />
      </div>

      {/* Desktop View - Weekly Kanban */}
      <div className="hidden md:flex min-h-screen bg-[#f8f9fa]">
        {/* Vertical Navigation Bar */}
        <VerticalNavBar
          activePanel={activePanel}
          onPanelChange={handlePanelChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Fixed Left Timeline Panel */}
        <TimelinePanel
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onTaskDrop={handleTaskDrop}
          onReorderTasks={handleReorderTasks}
          dismissedNotifications={dismissedNotifications}
          onDismissNotification={handleDismissNotification}
          onClearAllNotifications={handleClearAllNotifications}
        />

        {/* Main Content */}
        <div
          className="flex-1 flex flex-col min-w-0"
          style={{ height: "100vh" }}
        >
          {/* Week Navigation */}
          <div className="flex-shrink-0">
            <WeekNavigation
              currentWeek={currentWeek}
              onWeekChange={setCurrentWeek}
              onAutoSchedule={handleAutoSchedule}
              isScheduling={isAutoScheduling}
              onAddTask={() => {
                setEditingTask(null);
                setSelectedDate(
                  new Date().toISOString().split("T")[0],
                );
                setIsAddTaskModalOpen(true);
              }}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          {/* Header */}
          <div className="flex-shrink-0 p-8 pb-4">
            <div>
              <h1 className="text-[32px] font-bold text-[#313131] mb-1">
                {viewMode === "month"
                  ? currentWeek.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : weekStartMode === "monday"
                    ? "Weekly Task View"
                    : "Upcoming Week"}
              </h1>
              <p className="text-[12px] text-[#828282] max-w-[1400px]">
                {viewMode === "month"
                  ? "Monthly overview of all your scheduled tasks"
                  : weekStartMode === "monday"
                    ? "Organize and track your project tasks by day"
                    : "Plan your next 7 days starting from tomorrow"}
              </p>
            </div>
          </div>

          {/* View Content */}
          {viewMode === "week" ? (
            /* Weekly Kanban Board */
            <div className="flex-1 min-h-0 px-8 pb-8">
              <div className="h-full overflow-x-auto overflow-y-hidden weekly-scroll-container">
                <div className="h-full flex gap-0 min-w-max">
                  {weekDays.map((day) => {
                    const dayTasks = getTasksForDate(day);
                    return (
                      <DayColumn
                        key={day.toISOString()}
                        date={day}
                        tasks={dayTasks}
                        isToday={isToday(day)}
                        onTaskStatusChange={
                          handleTaskStatusChange
                        }
                        onTaskDrop={handleTaskDrop}
                        onAddTaskToDay={handleAddTaskToDay}
                        onTaskClick={handleTaskClick}
                        allTasks={[...tasks, ...archivedTasks]}
                        onReorderTasksInDay={
                          handleReorderTasksInDay
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Month View */
            <div className="flex-1 min-h-0 px-8 pb-8">
              <div className="h-full">
                <MonthView
                  currentDate={currentWeek}
                  tasks={tasks}
                  onTaskClick={handleTaskClick}
                  onTaskDrop={handleTaskDrop}
                  onAddTaskToDay={handleAddTaskToDay}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sliding Right Panels */}
        {activePanel === "inbox" && (
          <div className="animate-in slide-in-from-right duration-300">
            <InboxPanel
              inboxTasks={inboxTasks}
              onAddInboxTask={handleAddInboxTask}
              onScheduleTask={handleScheduleInboxTask}
            />
          </div>
        )}

        {activePanel === "calendar" && (
          <div className="animate-in slide-in-from-right duration-300">
            <CalendarPanel
              tasks={tasks}
              onTaskStatusChange={handleTaskStatusChange}
              onTaskClick={handleTaskClick}
            />
          </div>
        )}

        {activePanel === "settings" && (
          <div className="animate-in slide-in-from-right duration-300">
            <SettingsPanel
              tasksPerDayLimit={tasksPerDayLimit}
              onTasksPerDayLimitChange={setTasksPerDayLimit}
              weekStartMode={weekStartMode}
              onWeekStartModeChange={setWeekStartMode}
              availableTags={availableTags}
              onAddTag={handleAddTag}
              onEditTag={handleEditTag}
              onDeleteTag={handleDeleteTag}
            />
          </div>
        )}

        {activePanel === "archive" && (
          <div className="animate-in slide-in-from-right duration-300">
            <ArchivePanel
              archivedTasks={archivedTasks}
              onTaskStatusChange={handleTaskStatusChange}
              onTaskClick={handleTaskClick}
              onDeleteTask={handleDeleteArchivedTask}
              onClearArchive={handleClearArchive}
            />
          </div>
        )}
      </div>

      {/* Add Task Modal - Shared between Desktop and Mobile */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => {
          setIsAddTaskModalOpen(false);
          setPrefilledTaskTitle("");
          setSchedulingInboxTaskId(null);
          setEditingTask(null);
        }}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        defaultDate={selectedDate}
        defaultTitle={prefilledTaskTitle}
        editingTask={editingTask || undefined}
        allTasks={tasks}
        currentWeek={currentWeek}
        availableTags={availableTags}
        onManageTags={() => {
          setIsAddTaskModalOpen(false);
          setActivePanel("settings");
        }}
      />

      {/* Task Limit Alert Dialog */}
      <AlertDialog
        open={showLimitDialog}
        onOpenChange={setShowLimitDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Task Limit Exceeded
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have more tasks than can fit within the
              recommended limit of {TASKS_PER_DAY_LIMIT} tasks
              per day. Scheduling all tasks will result in some
              days having more than {TASKS_PER_DAY_LIMIT} tasks.
              <br />
              <br />
              Would you like to continue and schedule all tasks,
              or cancel and adjust your workload?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelScheduleOverLimit}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmScheduleOverLimit}
              className="bg-[#3300ff] hover:bg-[#2200cc]"
            >
              Schedule Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}