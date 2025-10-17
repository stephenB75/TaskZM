import { useState } from "react";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

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
  estimatedHours?: number;
  scheduledTime?: string; // Format: "HH:MM"
}

interface DayColumnProps {
  date: Date;
  tasks: Task[];
  isToday?: boolean;
  onTaskStatusChange?: (
    taskId: string,
    newStatus: Task["status"],
  ) => void;
  onTaskDrop?: (taskId: string, targetDate: Date) => void;
  onAddTaskToDay?: (date: Date) => void;
  onTaskClick?: (taskId: string) => void;
  allTasks?: Task[];
  onReorderTasksInDay?: (
    date: Date,
    taskId: string,
    targetTaskId: string,
    position: "before" | "after",
  ) => void;
}

export default function DayColumn({
  date,
  tasks,
  isToday,
  onTaskStatusChange,
  onTaskDrop,
  onAddTaskToDay,
  onTaskClick,
  allTasks,
  onReorderTasksInDay,
}: DayColumnProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<
    string | null
  >(null);
  const [dropTarget, setDropTarget] = useState<{
    taskId: string;
    position: "before" | "after";
  } | null>(null);

  const dayName = date.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const dateString = date.toISOString().split("T")[0];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const sourceDateStr = e.dataTransfer.getData("source-date");

    // If dragging from a different day, move the task
    if (taskId && sourceDateStr !== dateString && onTaskDrop) {
      onTaskDrop(taskId, date);
    }

    setDraggedTaskId(null);
    setDropTarget(null);
  };

  return (
    <div
      className={`bg-[#fdfdfd] w-[320px] flex-shrink-0 h-full border-r border-[#e3e3e3] flex flex-col ${isToday ? "bg-blue-50" : ""}`}
      data-name="DayColumn"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Day Header */}
      <div
        className={`flex-shrink-0 bg-white box-border content-stretch flex flex-col gap-[3px] items-center justify-center px-[20px] py-[10px] relative w-full border-b border-[#f4f4f4] ${isToday ? "bg-blue-100" : ""}`}
        data-name="Day Header"
      >
        <div className="flex items-center justify-end w-full pr-2">
          <div className="flex flex-col items-center gap-[3px]">
            <p
              className="font-['DM_Sans:Bold',_sans-serif] font-bold leading-[18px] text-[#828282] text-[16px] text-center uppercase tracking-wide"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {dayName}
            </p>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${isToday ? "bg-blue-600 text-white" : ""}`}
            >
              <p
                className={`font-['DM_Sans:Bold',_sans-serif] font-bold leading-[24px] text-[17px] ${isToday ? "text-white" : "text-[#313131]"}`}
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {dayNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 overflow-y-auto day-scroll-container p-[12px]">
        {tasks.length > 0 ? (
          <div className="space-y-[10px]">
            {tasks.map((task) => {
              const isDragging = draggedTaskId === task.id;
              const hasDropIndicator =
                dropTarget?.taskId === task.id;

              return (
                <div key={task.id} className="relative">
                  {/* Drop indicator - before */}
                  {hasDropIndicator &&
                    dropTarget?.position === "before" && (
                      <div className="absolute -top-[6px] left-0 right-0 h-[2px] bg-[#3300ff] rounded-full z-10 shadow-md shadow-[#3300ff]/50" />
                    )}

                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        "text/plain",
                        task.id,
                      );
                      e.dataTransfer.setData(
                        "source-date",
                        dateString,
                      );
                      setDraggedTaskId(task.id);
                    }}
                    onDragEnd={() => {
                      setDraggedTaskId(null);
                      setDropTarget(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const sourceDateStr =
                        e.dataTransfer.types.includes(
                          "source-date",
                        )
                          ? dateString
                          : null;

                      // Only show drop indicator if dragging within the same day
                      if (
                        draggedTaskId &&
                        draggedTaskId !== task.id
                      ) {
                        const rect =
                          e.currentTarget.getBoundingClientRect();
                        const midpoint =
                          rect.top + rect.height / 2;
                        const position =
                          e.clientY < midpoint
                            ? "before"
                            : "after";
                        setDropTarget({
                          taskId: task.id,
                          position,
                        });
                      }
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Clear drop target when leaving this specific task
                      if (dropTarget?.taskId === task.id) {
                        setDropTarget(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const droppedTaskId =
                        e.dataTransfer.getData("text/plain");
                      const sourceDateStr =
                        e.dataTransfer.getData("source-date");

                      // If dropping within the same day and on a different task, reorder
                      if (
                        droppedTaskId &&
                        sourceDateStr === dateString &&
                        droppedTaskId !== task.id &&
                        dropTarget &&
                        onReorderTasksInDay
                      ) {
                        onReorderTasksInDay(
                          date,
                          droppedTaskId,
                          task.id,
                          dropTarget.position,
                        );
                      }

                      setDraggedTaskId(null);
                      setDropTarget(null);
                    }}
                    className={`cursor-move transition-opacity ${isDragging ? "opacity-40" : "opacity-100"}`}
                  >
                    <TaskCard
                      task={task}
                      onStatusChange={onTaskStatusChange}
                      onTaskClick={onTaskClick}
                      allTasks={allTasks}
                    />
                  </div>

                  {/* Drop indicator - after */}
                  {hasDropIndicator &&
                    dropTarget?.position === "after" && (
                      <div className="absolute -bottom-[6px] left-0 right-0 h-[2px] bg-[#3300ff] rounded-full z-10 shadow-md shadow-[#3300ff]/50" />
                    )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-center">
            <p
              className="font-['DM_Sans:Regular',_sans-serif] font-normal text-[#828282] text-[14px]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              No tasks scheduled
            </p>
          </div>
        )}
      </div>

      {/* Day Column Border */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-px bg-[#e3e3e3] pointer-events-none"
      />
    </div>
  );
}