import { useState, useEffect } from "react";
import DayColumn from "./components/DayColumn";
import WeekNavigation from "./components/WeekNavigation";
import TimelinePanel from "./components/TimelinePanel";
import VerticalNavBar from "./components/VerticalNavBar";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileBottomNavigation from "./components/MobileBottomNavigation";
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
import { useMobile } from "./hooks/useMobile";

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
  const { isMobile, platform } = useMobile();
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
  const [activePanel, setActivePanel] = useState<
    "inbox" | "calendar" | "archive" | "settings" | null
  >(null);
  const [isMonthView, setIsMonthView] = useState(false);
  const [inboxTasks, setInboxTasks] = useState<InboxTask[]>([]);
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);
  const [mobileActiveTab, setMobileActiveTab] = useState<'week' | 'inbox' | 'calendar' | 'settings'>('week');

  // Load dismissed notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dismissedNotifications');
    if (saved) {
      try {
        setDismissedNotifications(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading dismissed notifications:', error);
      }
    }
  }, []);

  // Save dismissed notifications to localStorage
  const saveDismissedNotifications = (notifications: string[]) => {
    setDismissedNotifications(notifications);
    localStorage.setItem('dismissedNotifications', JSON.stringify(notifications));
  };

  // Generate notifications
  const generateNotifications = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    const notifications = [];

    // Overdue tasks
    tasks.forEach(task => {
      if (task.status !== 'done' && task.scheduledDate < today) {
        const notificationId = `overdue-${task.id}`;
        if (!dismissedNotifications.includes(notificationId)) {
          notifications.push({
            id: notificationId,
            type: 'overdue',
            title: 'Overdue Task',
            message: `${task.title} was due ${task.scheduledDate}`,
            taskId: task.id,
            priority: task.priority
          });
        }
      }
    });

    // Due today
    tasks.forEach(task => {
      if (task.status !== 'done' && task.scheduledDate === today) {
        const notificationId = `today-${task.id}`;
        if (!dismissedNotifications.includes(notificationId)) {
          notifications.push({
            id: notificationId,
            type: 'today',
            title: 'Due Today',
            message: task.title,
            taskId: task.id,
            priority: task.priority
          });
        }
      }
    });

    // High priority tomorrow
    tasks.forEach(task => {
      if (task.status !== 'done' && task.priority === 'high' && task.scheduledDate === tomorrow) {
        const notificationId = `upcoming-${task.id}`;
        if (!dismissedNotifications.includes(notificationId)) {
          notifications.push({
            id: notificationId,
            type: 'upcoming',
            title: 'High Priority Tomorrow',
            message: task.title,
            taskId: task.id,
            priority: task.priority
          });
        }
      }
    });

    // Calendar events starting soon
    tasks.forEach(task => {
      if (task.status !== 'done' && task.scheduledDate === today && task.scheduledTime) {
        const taskTime = new Date(`${task.scheduledDate}T${task.scheduledTime}`);
        if (taskTime > now && taskTime <= thirtyMinutesFromNow) {
          const notificationId = `event-${task.id}`;
          if (!dismissedNotifications.includes(notificationId)) {
            notifications.push({
              id: notificationId,
              type: 'event',
              title: 'Starting Soon',
              message: `${task.title} at ${task.scheduledTime}`,
              taskId: task.id,
              priority: task.priority
            });
          }
        }
      }
    });

    return notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const notifications = generateNotifications();

  // Mobile-specific handlers
  const handleMobileTabChange = (tab: 'week' | 'inbox' | 'calendar' | 'settings') => {
    setMobileActiveTab(tab);
    if (tab === 'inbox') {
      setActivePanel('inbox');
    } else if (tab === 'calendar') {
      setActivePanel('calendar');
    } else if (tab === 'settings') {
      setActivePanel('settings');
    } else {
      setActivePanel(null);
    }
  };

  // Rest of your existing functions remain the same...
  const addTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    };
    setTasks((prev) => [...prev, newTask]);
    toast.success("Task added successfully!");
  };

  const updateTask = (taskId: string, updatedData: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task
      )
    );
    toast.success("Task updated successfully!");
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success("Task deleted successfully!");
  };

  const moveTask = (taskId: string, newDate: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, scheduledDate: newDate } : task
      )
    );
  };

  const archiveTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setArchivedTasks((prev) => [...prev, task]);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("Task archived successfully!");
    }
  };

  const restoreTask = (taskId: string) => {
    const task = archivedTasks.find((t) => t.id === taskId);
    if (task) {
      setTasks((prev) => [...prev, task]);
      setArchivedTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("Task restored successfully!");
    }
  };

  const addInboxTask = (title: string) => {
    const newInboxTask: InboxTask = {
      id: Date.now().toString(),
      title,
    };
    setInboxTasks((prev) => [...prev, newInboxTask]);
  };

  const removeInboxTask = (taskId: string) => {
    setInboxTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const scheduleInboxTask = (inboxTask: InboxTask) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: inboxTask.title,
      description: "",
      tags: [],
      priority: "low",
      assignee: { name: "", avatar: "" },
      dueDate: "",
      status: "todo",
      scheduledDate: new Date().toISOString().split("T")[0],
    };
    setTasks((prev) => [...prev, newTask]);
    removeInboxTask(inboxTask.id);
    toast.success("Task scheduled successfully!");
  };

  const handleDismissNotification = (notificationId: string) => {
    const newDismissed = [...dismissedNotifications, notificationId];
    saveDismissedNotifications(newDismissed);
  };

  const handleClearAllNotifications = () => {
    const allNotificationIds = notifications.map(n => n.id);
    const newDismissed = [...dismissedNotifications, ...allNotificationIds];
    saveDismissedNotifications(newDismissed);
  };

  // AI Auto-Scheduler function
  const aiAutoSchedule = async () => {
    setIsAutoScheduling(true);
    
    try {
      // Simulate AI scheduling delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Your existing AI scheduling logic here
      toast.success("AI scheduling completed!");
    } catch (error) {
      toast.error("AI scheduling failed!");
    } finally {
      setIsAutoScheduling(false);
    }
  };

  // Mobile view
  if (isMobile) {
    return (
      <div className="mobile-app">
        <div className="mobile-content">
          {mobileActiveTab === 'week' && (
            <MobileTodayAgenda
              tasks={tasks.filter(task => task.scheduledDate === new Date().toISOString().split('T')[0])}
              onEditTask={setEditingTask}
              onStatusChange={(taskId, newStatus) => {
                setTasks(prev => prev.map(task => 
                  task.id === taskId ? { ...task, status: newStatus } : task
                ));
              }}
              onAddTask={() => setIsAddTaskModalOpen(true)}
            />
          )}
          
          {mobileActiveTab === 'inbox' && (
            <InboxPanel
              inboxTasks={inboxTasks}
              onAddInboxTask={addInboxTask}
              onRemoveInboxTask={removeInboxTask}
              onScheduleInboxTask={scheduleInboxTask}
            />
          )}
          
          {mobileActiveTab === 'calendar' && (
            <CalendarPanel
              tasks={tasks}
              onEditTask={setEditingTask}
              onAddTask={() => setIsAddTaskModalOpen(true)}
            />
          )}
          
          {mobileActiveTab === 'settings' && (
            <SettingsPanel
              availableTags={availableTags}
              onUpdateTags={setAvailableTags}
            />
          )}
        </div>
        
        <MobileBottomNavigation
          activeTab={mobileActiveTab}
          onTabChange={handleMobileTabChange}
          notificationCount={notifications.length}
        />
        
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => {
            setIsAddTaskModalOpen(false);
            setEditingTask(null);
          }}
          onSave={editingTask ? updateTask : addTask}
          task={editingTask}
          availableTags={availableTags}
          onUpdateTags={setAvailableTags}
        />
        
        <style jsx global>{`
          .mobile-app {
            height: 100vh;
            overflow: hidden;
            background: #f8f9fa;
          }
          
          .mobile-content {
            height: calc(100vh - 80px);
            overflow-y: auto;
            padding-bottom: env(safe-area-inset-bottom);
          }
          
          /* Mobile-specific optimizations */
          .mobile-app * {
            -webkit-tap-highlight-color: transparent;
          }
          
          .mobile-app input,
          .mobile-app textarea,
          .mobile-app select {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        `}</style>
      </div>
    );
  }

  // Desktop view (existing code)
  return (
    <div className="app">
      <VerticalNavBar
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        notificationCount={notifications.length}
      />
      
      <TimelinePanel
        tasks={tasks.filter(task => task.scheduledDate === new Date().toISOString().split('T')[0])}
        onEditTask={setEditingTask}
        onStatusChange={(taskId, newStatus) => {
          setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
          ));
        }}
        notifications={notifications}
        onDismissNotification={handleDismissNotification}
        onClearAllNotifications={handleClearAllNotifications}
      />
      
      <div className="main-content">
        <WeekNavigation
          currentWeek={currentWeek}
          onWeekChange={setCurrentWeek}
          onAddTask={() => setIsAddTaskModalOpen(true)}
          onAISchedule={aiAutoSchedule}
          isAutoScheduling={isAutoScheduling}
          onToggleMonthView={() => setIsMonthView(!isMonthView)}
          isMonthView={isMonthView}
        />
        
        {isMonthView ? (
          <MonthView
            tasks={tasks}
            onEditTask={setEditingTask}
            onAddTask={() => setIsAddTaskModalOpen(true)}
          />
        ) : (
          <div className="week-view">
            <div className="week-header">
              <h1 className="week-title">
                {currentWeek.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })} - Week {Math.ceil(currentWeek.getDate() / 7)}
              </h1>
              <p className="week-subtitle">
                {currentWeek.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })} - {new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="week-columns">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(currentWeek);
                date.setDate(currentWeek.getDate() - currentWeek.getDay() + i);
                const dateString = date.toISOString().split('T')[0];
                const isToday = dateString === new Date().toISOString().split('T')[0];
                
                return (
                  <DayColumn
                    key={i}
                    date={date}
                    tasks={tasks.filter(task => task.scheduledDate === dateString)}
                    onEditTask={setEditingTask}
                    onStatusChange={(taskId, newStatus) => {
                      setTasks(prev => prev.map(task => 
                        task.id === taskId ? { ...task, status: newStatus } : task
                      ));
                    }}
                    onAddTask={() => {
                      setEditingTask({
                        id: '',
                        title: '',
                        description: '',
                        tags: [],
                        priority: 'medium',
                        assignee: { name: '', avatar: '' },
                        dueDate: '',
                        status: 'todo',
                        scheduledDate: dateString,
                      });
                      setIsAddTaskModalOpen(true);
                    }}
                    onMoveTask={moveTask}
                    isToday={isToday}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {activePanel === 'inbox' && (
        <InboxPanel
          inboxTasks={inboxTasks}
          onAddInboxTask={addInboxTask}
          onRemoveInboxTask={removeInboxTask}
          onScheduleInboxTask={scheduleInboxTask}
        />
      )}
      
      {activePanel === 'calendar' && (
        <CalendarPanel
          tasks={tasks}
          onEditTask={setEditingTask}
          onAddTask={() => setIsAddTaskModalOpen(true)}
        />
      )}
      
      {activePanel === 'archive' && (
        <ArchivePanel
          archivedTasks={archivedTasks}
          onRestoreTask={restoreTask}
          onDeleteTask={(taskId) => {
            setArchivedTasks(prev => prev.filter(task => task.id !== taskId));
            toast.success("Task permanently deleted!");
          }}
          onClearArchive={() => {
            setArchivedTasks([]);
            toast.success("Archive cleared!");
          }}
        />
      )}
      
      {activePanel === 'settings' && (
        <SettingsPanel
          availableTags={availableTags}
          onUpdateTags={setAvailableTags}
        />
      )}
      
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => {
          setIsAddTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? updateTask : addTask}
        task={editingTask}
        availableTags={availableTags}
        onUpdateTags={setAvailableTags}
      />
    </div>
  );
}