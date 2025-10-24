import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
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
import { tasksApi } from "./lib/api";
import { generateRecurringTasks, validateRecurringConfig } from "./lib/recurringTasks";

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

interface TaskZMAppProps {}

function TaskZMApp({}: TaskZMAppProps) {
  const { user, loading } = useAuth();
  const [activePanel, setActivePanel] = useState<string>("timeline");
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inboxTasks, setInboxTasks] = useState<InboxTask[]>([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [taskToArchive, setTaskToArchive] = useState<Task | null>(null);
  const [customTags, setCustomTags] = useState<TagDefinition[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Load tasks from API when user is authenticated
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const apiTasks = await tasksApi.getAll();
      // Convert API tasks to our Task format
      const formattedTasks = apiTasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || "",
        tags: task.tags || [],
        priority: task.priority || "medium",
        assignee: {
          name: "You",
          avatar: "/default-avatar.png"
        },
        dueDate: task.due_date || "",
        status: task.status || "todo",
        scheduledDate: task.due_date || new Date().toISOString().split('T')[0],
        archived: task.status === "archived"
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      // Fallback to sample tasks for development
      setTasks(sampleTasks);
    }
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show login if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      await tasksApi.update(updatedTask.id, updatedTask);
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleTaskCreate = async (newTask: Omit<Task, "id">) => {
    try {
      // Check if this is a recurring task
      if (newTask.recurring) {
        // Validate recurring configuration
        const validationErrors = validateRecurringConfig(newTask.recurring);
        if (validationErrors.length > 0) {
          toast.error(`Recurring task validation failed: ${validationErrors.join(", ")}`);
          return;
        }

        // Generate recurring task instances
        const recurringTasks = generateRecurringTasks(
          newTask,
          newTask.recurring,
          newTask.scheduledDate
        );

        // Create all recurring task instances
        const createdTasks: Task[] = [];
        for (const taskInstance of recurringTasks) {
          try {
            const createdTask = await tasksApi.create(taskInstance);
            createdTasks.push({ ...taskInstance, id: createdTask.id });
          } catch (error) {
            console.error("Failed to create recurring task instance:", error);
            // Continue with other instances even if one fails
          }
        }

        if (createdTasks.length > 0) {
          setTasks(prev => [...prev, ...createdTasks]);
          toast.success(`Created ${createdTasks.length} recurring task${createdTasks.length > 1 ? 's' : ''}`);
        } else {
          toast.error("Failed to create any recurring task instances");
        }
      } else {
        // Regular single task
        const createdTask = await tasksApi.create(newTask);
        setTasks(prev => [...prev, { ...newTask, id: createdTask.id }]);
        toast.success("Task created successfully");
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await tasksApi.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleArchiveTask = (task: Task) => {
    setTaskToArchive(task);
    setShowArchiveDialog(true);
  };

  const confirmArchiveTask = async () => {
    if (taskToArchive) {
      const archivedTask = {
        ...taskToArchive,
        status: "archived" as const,
        archived: true,
        archivedAt: new Date().toISOString(),
      };
      await handleTaskUpdate(archivedTask);
      setShowArchiveDialog(false);
      setTaskToArchive(null);
    }
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => 
      task.scheduledDate === dateStr && !task.archived
    );
  };

  const getTodayTasks = () => {
    const today = new Date();
    return getTasksForDate(today);
  };

  const getInboxTasks = () => {
    return tasks.filter(task => 
      !task.scheduledDate && !task.archived
    ).map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      tags: task.tags,
      createdAt: new Date().toISOString(),
    }));
  };

  const renderMainContent = () => {
    switch (activePanel) {
      case "timeline":
        return (
          <div className="flex-1 flex flex-col">
            <WeekNavigation
              currentWeek={currentWeek}
              onWeekChange={setCurrentWeek}
            />
            <TimelinePanel
              currentWeek={currentWeek}
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskArchive={handleArchiveTask}
              onTaskDelete={handleTaskDelete}
            />
          </div>
        );
      case "calendar":
        return (
          <CalendarPanel
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskArchive={handleArchiveTask}
            onTaskDelete={handleTaskDelete}
          />
        );
      case "inbox":
        return (
          <InboxPanel
            tasks={getInboxTasks()}
            onTaskUpdate={handleTaskUpdate}
            onTaskArchive={handleArchiveTask}
            onTaskDelete={handleTaskDelete}
          />
        );
      case "archive":
        return (
          <ArchivePanel
            tasks={tasks.filter(task => task.archived)}
            onTaskRestore={(task) => {
              const restoredTask = { ...task, archived: false, status: "todo" as const };
              handleTaskUpdate(restoredTask);
            }}
            onTaskDelete={handleTaskDelete}
          />
        );
      case "settings":
        return (
          <SettingsPanel
            customTags={customTags}
            onTagsUpdate={setCustomTags}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex h-screen">
          <VerticalNavBar
            activePanel={activePanel}
            onPanelChange={setActivePanel}
            onAddTask={() => setShowAddTaskModal(true)}
          />
          {renderMainContent()}
        </div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div className="flex flex-col h-screen">
          {activePanel === "timeline" && (
            <MobileTodayAgenda
              tasks={getTodayTasks()}
              onTaskUpdate={handleTaskUpdate}
              onTaskArchive={handleArchiveTask}
              onTaskDelete={handleTaskDelete}
            />
          )}
          {activePanel !== "timeline" && (
            <div className="flex-1 overflow-hidden">
              {renderMainContent()}
            </div>
          )}
          <MobileBottomNav
            activePanel={activePanel}
            onPanelChange={setActivePanel}
            onAddTask={() => setShowAddTaskModal(true)}
          />
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <AddTaskModal
          onClose={() => setShowAddTaskModal(false)}
          onTaskCreate={handleTaskCreate}
          customTags={customTags}
        />
      )}

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{taskToArchive?.title}"? 
              This will move it to the archive panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmArchiveTask}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function App() {
  return <TaskZMApp />;
}