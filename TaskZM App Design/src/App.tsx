import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { CollaborationProvider } from "./contexts/CollaborationContext";
import Login from "./components/Login";
import DayColumn from "./components/DayColumn";
import WeekNavigation from "./components/WeekNavigation";
import TimelinePanel from "./components/TimelinePanel";
import WeeklyKanbanBoard from "./components/WeeklyKanbanBoard";
import VerticalNavBar from "./components/VerticalNavBar";
import MobileBottomNav from "./components/MobileBottomNav";
import InboxPanel, { InboxTask } from "./components/InboxPanel";
import CalendarPanel from "./components/CalendarPanel";
import SettingsPanel from "./components/SettingsPanel";
import ArchivePanel from "./components/ArchivePanel";
import AddTaskModal from "./components/AddTaskModal";
import MobileTodayAgenda from "./components/MobileTodayAgenda";
import MonthView from "./components/MonthView";
import CollaborationPanel from "./components/CollaborationPanel";
import TeamPresenceIndicator from "./components/TeamPresenceIndicator";
import RealTimeTaskCollaboration from "./components/RealTimeTaskCollaboration";
import SyncStatusIndicator from "./components/SyncStatusIndicator";
import CloudSyncSettings from "./components/CloudSyncSettings";
import TimeTrackingDashboard from "./components/TimeTrackingDashboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CustomViews from "./components/CustomViews";
import ThemeToggle from "./components/ThemeToggle";
import KeyboardShortcutsHelp from "./components/KeyboardShortcutsHelp";
import EnhancedNotificationsPanel from "./components/EnhancedNotificationsPanel";
import ExportPanel from "./components/ExportPanel";
import TaskTemplatesPanel from "./components/TaskTemplatesPanel";
import WorkspacesPanel from "./components/WorkspacesPanel";
import CalendarSyncPanel from "./components/CalendarSyncPanel";
import VirtualizedTaskList from "./components/VirtualizedTaskList";
import PerformanceMonitor from "./components/PerformanceMonitor";
import RightSidePanel from "./components/RightSidePanel";
import AccessibilityPanel from "./components/AccessibilityPanel";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { usePerformanceOptimization } from "./hooks/usePerformanceOptimization";
import { notificationService } from "./lib/notifications";
import { taskTemplateService } from "./lib/taskTemplates";
import { workspaceService } from "./lib/workspaces";
import ErrorBoundary from "./components/ErrorBoundary";
import { handleError, getUserFriendlyMessage } from "./lib/errorHandler";
import { validateTask } from "./lib/validation";
import { calendarSyncService } from "./lib/calendarSync";
import { cloudSync } from "./lib/cloudSync";
import { sampleTasks } from "./data/sampleTasks";
import { Plus, Users, Cloud, Clock, BarChart3, Filter, Bell, Download, FileText, Building2, Calendar, Activity } from "lucide-react";
import { toast } from "sonner";
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
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { TagDefinition } from "./components/TagManager";
import { tasksApi } from "./lib/api";
import { generateRecurringTasks, validateRecurringConfig } from "./lib/recurringTasks";
import { aiAutoSchedule, aiSmartSchedule, validateAIScheduleConfig } from "./lib/aiScheduler";

export interface Task {
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
  const [activePanel, setActivePanel] = useState<"timeline" | "week" | "calendar" | "inbox" | "archive" | "analytics" | "time-tracking" | "custom-views" | "collaboration" | "export" | "templates" | "workspaces" | "calendar-sync" | "notifications" | "settings" | "accessibility" | null>("timeline");
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inboxTasks, setInboxTasks] = useState<InboxTask[]>([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [taskToArchive, setTaskToArchive] = useState<Task | null>(null);
  const [customTags, setCustomTags] = useState<TagDefinition[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [showCloudSyncSettings, setShowCloudSyncSettings] = useState(false);
  const [showTimeTrackingDashboard, setShowTimeTrackingDashboard] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [showCustomViews, setShowCustomViews] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showEnhancedNotifications, setShowEnhancedNotifications] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showTaskTemplates, setShowTaskTemplates] = useState(false);
  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const [showCalendarSync, setShowCalendarSync] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaceService.getCurrentWorkspace());
  const [notificationCount, setNotificationCount] = useState(0);

  // Performance optimization
  const { optimizedTasks, metrics, isVirtualized, shouldLazyLoad } = usePerformanceOptimization(
    tasks,
    {
      enableVirtualization: true,
      enableMemoization: true,
      enableDebouncing: true,
      debounceDelay: 300,
      maxRenderItems: 100,
      enableLazyLoading: true,
      lazyLoadThreshold: 50
    }
  );

  // Load tasks from API when user is authenticated
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      { key: 'n', ctrlKey: true, action: () => setShowAddTaskModal(true), description: 'Create new task' },
      { key: 'g', ctrlKey: true, action: () => setShowAnalyticsDashboard(true), description: 'Toggle analytics' },
      { key: 'h', ctrlKey: true, action: () => setShowTimeTrackingDashboard(true), description: 'Toggle time tracking' },
      { key: 'v', ctrlKey: true, action: () => setShowCustomViews(true), description: 'Toggle custom views' },
      { key: 'b', ctrlKey: true, action: () => setShowEnhancedNotifications(true), description: 'Toggle notifications' },
      { key: '?', ctrlKey: true, action: () => setShowKeyboardShortcuts(true), description: 'Show keyboard shortcuts' },
    ],
    enabled: true,
  });

  // Notification count updates
  useEffect(() => {
    const updateNotificationCount = () => {
      setNotificationCount(notificationService.getNotificationCount());
    };

    updateNotificationCount();
    const unsubscribe = notificationService.subscribe(updateNotificationCount);
    return unsubscribe;
  }, []);

  const loadTasks = async () => {
    try {
      // Try to load from cloud first
      const cloudTasks = await cloudSync.loadTasks();
      if (cloudTasks.length > 0) {
        setTasks(cloudTasks);
        return;
      }

      // Fallback to API
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

  const handleTaskStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, status: newStatus };
      await handleTaskUpdate(updatedTask);
    }
  };

  const handleTaskDrop = async (taskId: string, targetDate: Date) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { 
        ...task, 
        scheduledDate: targetDate.toISOString().split('T')[0] 
      };
      await handleTaskUpdate(updatedTask);
    }
  };

  const handleTaskClick = (task: Task) => {
    // Open edit modal with pre-filled data
    setShowAddTaskModal(true);
    // TODO: Pre-fill the modal with task data
  };

  const handleReorderTasksInDay = async (taskId: string, targetTaskId: string, position: "before" | "after") => {
    // TODO: Implement task reordering within a day
    console.log("Reorder task", taskId, "to", position, "of", targetTaskId);
  };

  const handleAutoSchedule = async () => {
    try {
      // Get inbox tasks
      const inboxTasks = getInboxTasks();
      
      // Validate configuration
      const totalTasks = tasks.filter(t => !t.archived && (t.status === 'todo' || t.status === 'inprogress')).length + inboxTasks.length;
      const validationErrors = validateAIScheduleConfig(6, totalTasks);
      
      if (validationErrors.length > 0) {
        toast.error(`Scheduling validation failed: ${validationErrors.join(", ")}`);
        return;
      }
      
      // Run AI auto-scheduling
      const result = aiAutoSchedule({
        tasksPerDayLimit: 6,
        currentWeek,
        tasks,
        inboxTasks,
      });
      
      // Update tasks with new schedules
      const updatedTasks = tasks.map(task => {
        const scheduledTask = result.scheduledTasks.find(st => st.id === task.id);
        return scheduledTask || task;
      });
      
      // Add newly scheduled inbox tasks
      const newScheduledTasks = result.scheduledTasks.filter(st => 
        !tasks.find(t => t.id === st.id)
      );
      
      setTasks([...updatedTasks, ...newScheduledTasks]);
      
      // Clear inbox if it was cleared
      if (result.inboxCleared) {
        setInboxTasks([]);
      }
      
      // Show success message
      const weekText = result.weeksUsed === 1 ? 'week' : 'weeks';
      toast.success(
        `AI scheduling completed! Scheduled ${result.tasksScheduled} tasks across ${result.weeksUsed} ${weekText}`
      );
      
    } catch (error) {
      console.error("Failed to auto-schedule:", error);
      toast.error("Failed to auto-schedule tasks");
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
          // Sync to cloud
          await cloudSync.syncTasks([...tasks, ...createdTasks]);
          cloudSync.markPendingChanges(createdTasks.length);
          toast.success(`Created ${createdTasks.length} recurring task${createdTasks.length > 1 ? 's' : ''}`);
        } else {
          toast.error("Failed to create any recurring task instances");
        }
      } else {
        // Regular single task
        const createdTask = await tasksApi.create(newTask);
        const newTaskWithId = { ...newTask, id: createdTask.id };
        setTasks(prev => [...prev, newTaskWithId]);
        // Sync to cloud
        await cloudSync.syncTasks([...tasks, newTaskWithId]);
        cloudSync.markPendingChanges(1);
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
      case "analytics":
        return (
          <AnalyticsDashboard
            isOpen={true}
            onClose={() => setActivePanel("week")}
          />
        );
      case "time-tracking":
        return (
          <TimeTrackingDashboard
            isOpen={true}
            onClose={() => setActivePanel("week")}
          />
        );
      case "custom-views":
        return (
          <CustomViews
            isOpen={true}
            onClose={() => setActivePanel("week")}
          />
        );
      case "collaboration":
        return (
          <CollaborationPanel
            isOpen={true}
            onClose={() => setActivePanel("week")}
          />
        );
      case "export":
        return (
          <ExportPanel
            isOpen={true}
            onClose={() => setActivePanel("week")}
            tasks={tasks}
          />
        );
      case "templates":
        return (
          <TaskTemplatesPanel
            isOpen={true}
            onClose={() => setActivePanel("week")}
          />
        );
      case "workspaces":
        return (
          <WorkspacesPanel
            isOpen={true}
            onClose={() => setActivePanel("week")}
          />
        );
      case "calendar-sync":
        return (
          <CalendarSyncPanel
            isOpen={true}
            onClose={() => setActivePanel("week")}
          />
        );
      case "notifications":
        return (
          <EnhancedNotificationsPanel
            isOpen={true}
            onClose={() => setActivePanel("week")}
          />
        );
      case "settings":
        return (
          <SettingsPanel
            customTags={customTags}
            onTagsUpdate={setCustomTags}
          />
        );
      case "accessibility":
        setShowAccessibility(true);
        return null;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        handleError(error, {
          component: 'App',
          action: 'render',
        });
      }}
    >
      <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex h-screen">
          <VerticalNavBar
            activePanel={activePanel}
            onPanelChange={setActivePanel}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          {activePanel === "timeline" || activePanel === "week" ? (
            <div className="flex flex-1">
              {activePanel === "timeline" && (
                <TimelinePanel
                  tasks={getTodayTasks()}
                  onTaskClick={handleTaskClick}
                  onTaskDrop={handleTaskDrop}
                  onReorderTasks={handleReorderTasksInDay}
                />
              )}
              {/* Main View */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <WeekNavigation
                    currentWeek={currentWeek}
                    onWeekChange={setCurrentWeek}
                    onAutoSchedule={handleAutoSchedule}
                    onAddTask={() => setShowAddTaskModal(true)}
                  />
                  <div className="flex items-center gap-2">
                    <SyncStatusIndicator />
                    <TeamPresenceIndicator />
                    <ThemeToggle />
                  </div>
                </div>
                {viewMode === "week" ? (
                  <WeeklyKanbanBoard
                    currentWeek={currentWeek}
                    tasks={tasks}
                    onTaskStatusChange={handleTaskStatusChange}
                    onTaskDrop={handleTaskDrop}
                    onAddTaskToDay={(date) => {
                      setShowAddTaskModal(true);
                      // Pre-fill the date in the modal
                    }}
                    onTaskClick={handleTaskClick}
                    onReorderTasksInDay={handleReorderTasksInDay}
                    allTasks={tasks}
                  />
                ) : (
                  <MonthView
                    currentWeek={currentWeek}
                    tasks={tasks}
                    onTaskStatusChange={handleTaskStatusChange}
                    onTaskDrop={handleTaskDrop}
                    onAddTaskToDay={(date) => {
                      setShowAddTaskModal(true);
                      // Pre-fill the date in the modal
                    }}
                    onTaskClick={handleTaskClick}
                    onReorderTasksInDay={handleReorderTasksInDay}
                    allTasks={tasks}
                  />
                )}
              </div>
            </div>
          ) : (
            renderMainContent()
          )}
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

      {/* Right-Side Panels */}
      <RightSidePanel
        isOpen={showCollaborationPanel}
        onClose={() => setShowCollaborationPanel(false)}
        title="Team Collaboration"
      >
        <CollaborationPanel
          isOpen={true}
          onClose={() => setShowCollaborationPanel(false)}
        />
      </RightSidePanel>

      <RightSidePanel
        isOpen={showCloudSyncSettings}
        onClose={() => setShowCloudSyncSettings(false)}
        title="Cloud Sync Settings"
      >
        <CloudSyncSettings
          isOpen={true}
          onClose={() => setShowCloudSyncSettings(false)}
        />
      </RightSidePanel>

      <RightSidePanel
        isOpen={showTimeTrackingDashboard}
        onClose={() => setShowTimeTrackingDashboard(false)}
        title="Time Tracking"
      >
        <TimeTrackingDashboard
          isOpen={true}
          onClose={() => setShowTimeTrackingDashboard(false)}
        />
      </RightSidePanel>

      <RightSidePanel
        isOpen={showAnalyticsDashboard}
        onClose={() => setShowAnalyticsDashboard(false)}
        title="Analytics Dashboard"
      >
        <AnalyticsDashboard
          isOpen={true}
          onClose={() => setShowAnalyticsDashboard(false)}
          tasks={tasks}
        />
      </RightSidePanel>

      <RightSidePanel
        isOpen={showCustomViews}
        onClose={() => setShowCustomViews(false)}
        title="Custom Views"
      >
        <CustomViews
          isOpen={true}
          onClose={() => setShowCustomViews(false)}
          tasks={tasks}
        />
      </RightSidePanel>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      <RightSidePanel
        isOpen={showEnhancedNotifications}
        onClose={() => setShowEnhancedNotifications(false)}
        title="Notifications"
      >
        <EnhancedNotificationsPanel
          isOpen={true}
          onClose={() => setShowEnhancedNotifications(false)}
        />
      </RightSidePanel>

      <RightSidePanel
        isOpen={showExportPanel}
        onClose={() => setShowExportPanel(false)}
        title="Export Tasks"
      >
        <ExportPanel
          isOpen={true}
          onClose={() => setShowExportPanel(false)}
          tasks={tasks}
        />
      </RightSidePanel>

      <RightSidePanel
        isOpen={showTaskTemplates}
        onClose={() => setShowTaskTemplates(false)}
        title="Task Templates"
      >
        <TaskTemplatesPanel
          isOpen={true}
          onClose={() => setShowTaskTemplates(false)}
          onTemplateSelect={(template) => {
            // Create tasks from template
            const templateTasks = template.tasks.map((task, index) => ({
              ...task,
              id: `task-${Date.now()}-${index}`,
              scheduledDate: new Date().toISOString().split('T')[0]
            }));
            
            setTasks(prev => [...prev, ...templateTasks]);
            toast.success(`Created ${templateTasks.length} tasks from "${template.name}" template`);
          }}
        />
      </RightSidePanel>

      <RightSidePanel
        isOpen={showWorkspaces}
        onClose={() => setShowWorkspaces(false)}
        title="Workspaces"
      >
        <WorkspacesPanel
          isOpen={true}
          onClose={() => setShowWorkspaces(false)}
          onWorkspaceChange={(workspace) => {
            setCurrentWorkspace(workspace);
            // Reload tasks for the new workspace
            loadTasks();
          }}
        />
      </RightSidePanel>

      <RightSidePanel
        isOpen={showCalendarSync}
        onClose={() => setShowCalendarSync(false)}
        title="Calendar Sync"
      >
        <CalendarSyncPanel
          isOpen={true}
          onClose={() => setShowCalendarSync(false)}
        />
      </RightSidePanel>

      {/* Settings Panel */}
      <RightSidePanel
        isOpen={activePanel === "settings"}
        onClose={() => setActivePanel("timeline")}
        title="Settings"
      >
        <SettingsPanel
          tasksPerDayLimit={5}
          onTasksPerDayLimitChange={(limit) => {
            // Handle tasks per day limit change
            toast.success(`Tasks per day limit set to ${limit}`);
          }}
          weekStartMode="monday"
          onWeekStartModeChange={(mode) => {
            // Handle week start mode change
            toast.success(`Week starts on ${mode === 'monday' ? 'Monday' : 'Current day'}`);
          }}
          availableTags={customTags}
          onAddTag={(tag) => {
            const newTag = { ...tag, id: `tag-${Date.now()}` };
            setCustomTags(prev => [...prev, newTag]);
            toast.success(`Tag "${tag.name}" added`);
          }}
          onEditTag={(id, tag) => {
            setCustomTags(prev => prev.map(t => t.id === id ? { ...tag, id } : t));
            toast.success(`Tag "${tag.name}" updated`);
          }}
          onDeleteTag={(id) => {
            setCustomTags(prev => prev.filter(t => t.id !== id));
            toast.success('Tag deleted');
          }}
        />
      </RightSidePanel>

      {/* Accessibility Panel */}
      <RightSidePanel
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
        title="Accessibility Settings"
      >
        <AccessibilityPanel
          isOpen={showAccessibility}
          onClose={() => setShowAccessibility(false)}
        />
      </RightSidePanel>

      <RightSidePanel
        isOpen={showPerformanceMonitor}
        onClose={() => setShowPerformanceMonitor(false)}
        title="Performance Monitor"
      >
        <PerformanceMonitor
          isOpen={true}
          onClose={() => setShowPerformanceMonitor(false)}
          metrics={{
            renderTime: metrics.renderTime,
            memoryUsage: metrics.memoryUsage,
            itemCount: metrics.itemCount,
            visibleItems: metrics.visibleItems,
            isOptimized: metrics.isOptimized,
            fps: 60, // This would be calculated in a real implementation
            networkLatency: 0,
            cacheHitRate: 0.95
          }}
          onOptimize={() => {
            // Trigger performance optimization
            toast.success('Performance optimization applied');
          }}
          onReset={() => {
            // Reset performance settings
            toast.success('Performance settings reset');
          }}
        />
      </RightSidePanel>

      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return <TaskZMApp />;
}