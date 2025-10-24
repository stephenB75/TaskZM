import { useState } from "react";
import TaskCard from "./TaskCard";
import { Calendar, Plus, Sparkles } from "lucide-react";
import { useMobileGestures } from "../hooks/useMobileGestures";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

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

interface MobileTodayAgendaProps {
  tasks: Task[];
  onTaskStatusChange?: (
    taskId: string,
    newStatus: Task["status"],
  ) => void;
  onTaskClick?: (taskId: string) => void;
  onAddTask?: () => void;
  onOpenCalendar?: () => void;
  onAutoSchedule?: () => void;
  isScheduling?: boolean;
  onReorderTasks?: (
    taskId: string,
    targetTaskId: string,
    position: "before" | "after",
  ) => void;
}

export default function MobileTodayAgenda({
  tasks,
  onTaskStatusChange,
  onTaskClick,
  onAddTask,
  onOpenCalendar,
  onAutoSchedule,
  isScheduling,
  onReorderTasks,
}: MobileTodayAgendaProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<
    string | null
  >(null);
  
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    triggerHapticFeedback,
    isMobile,
  } = useMobileGestures();
  const [dragOverTaskId, setDragOverTaskId] = useState<
    string | null
  >(null);
  const [dragPosition, setDragPosition] = useState<
    "before" | "after"
  >("before");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Filter tasks for today
  const todayTasks = tasks.filter(
    (task) => task.scheduledDate === today,
  );

  // Split tasks into first 3 and remaining
  const firstThreeTasks = todayTasks.slice(0, 3);
  const remainingTasks = todayTasks.slice(3);

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div 
      className="bg-[#f8f9fa] p-4 pb-6 ios-optimized android-optimized mobile-padding ios-safe-area"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2">
          <h1 className="text-[28px] font-bold text-[#313131]">
            Today's Agenda
          </h1>
        </div>
        <p className="text-[14px] text-[#828282]">
          {formatDate()}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#3300ff] rounded-full" />
            <span className="text-[12px] text-[#828282]">
              {
                todayTasks.filter((t) => t.status === "todo")
                  .length
              }{" "}
              To Do
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ff5c00] rounded-full" />
            <span className="text-[12px] text-[#828282]">
              {
                todayTasks.filter(
                  (t) => t.status === "inprogress",
                ).length
              }{" "}
              In Progress
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00c851] rounded-full" />
            <span className="text-[12px] text-[#828282]">
              {
                todayTasks.filter((t) => t.status === "done")
                  .length
              }{" "}
              Done
            </span>
          </div>
        </div>

        {/* AI Schedule Button */}
        {onAutoSchedule && (
          <button
            onClick={onAutoSchedule}
            disabled={isScheduling}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#3300ff] to-[#5533ff] text-white rounded-lg hover:from-[#2200cc] hover:to-[#4422cc] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Sparkles
              className={`w-4 h-4 ${isScheduling ? "animate-spin" : ""}`}
            />
            <span className="font-medium">
              {isScheduling
                ? "Scheduling..."
                : "AI Schedule Week"}
            </span>
          </button>
        )}
      </div>

      {/* Tasks Display */}
      {todayTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#e9ebef] rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#828282]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-[16px] text-[#828282]">
            No tasks scheduled for today
          </p>
        </div>
      ) : (
        <>
          {/* Accordion for first 3 tasks */}
          <Accordion
            type="single"
            collapsible
            className="space-y-2.5"
          >
            {firstThreeTasks.map((task, index) => (
              <AccordionItem
                key={task.id}
                value={`task-${task.id}`}
                className="border-none bg-white rounded-[10px] shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-2.5 w-full text-left">
                    <div
                      className="w-1 h-8 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          task.status === "todo"
                            ? "#3300ff"
                            : task.status === "inprogress"
                              ? "#ff5c00"
                              : "#00c851",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-medium text-[#828282]">
                          {task.scheduledTime || ""}
                        </span>
                        {task.priority === "high" && (
                          <span className="text-[10px] font-bold text-[#EC6240] bg-[#fef2f2] px-1.5 py-0.5 rounded">
                            HIGH
                          </span>
                        )}
                      </div>
                      <h3 className="text-[14px] font-medium text-[#313131] truncate">
                        {task.title}
                      </h3>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="flex justify-center pt-2">
                    <TaskCard
                      task={task}
                      onStatusChange={onTaskStatusChange}
                      onTaskClick={onTaskClick}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Show remaining tasks count */}
          {remainingTasks.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-[14px] text-[#828282]">
                +{remainingTasks.length} more task
                {remainingTasks.length !== 1 ? "s" : ""}
              </p>
              <p className="text-[12px] text-[#828282] mt-1">
                Tap the calendar icon to view by date
              </p>
            </div>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <button
        onClick={onAddTask}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#3300ff] text-white rounded-full shadow-lg hover:bg-[#2200cc] transition-all hover:scale-110 flex items-center justify-center z-50"
        aria-label="Add new task"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}