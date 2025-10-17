import { Archive, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import TaskCard from "./TaskCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

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

interface ArchivePanelProps {
  archivedTasks: Task[];
  onTaskStatusChange: (
    taskId: string,
    newStatus: Task["status"],
  ) => void;
  onTaskClick: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onClearArchive?: () => void;
}

export default function ArchivePanel({
  archivedTasks,
  onTaskStatusChange,
  onTaskClick,
  onDeleteTask,
  onClearArchive,
}: ArchivePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<
    string | null
  >(null);

  const filteredTasks = archivedTasks.filter(
    (task) =>
      task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      task.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      task.tags.some((tag) =>
        tag.text
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
  );

  const groupedByDate = filteredTasks.reduce(
    (acc, task) => {
      const date = new Date(task.scheduledDate);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );

  const sortedMonths = Object.keys(groupedByDate).sort(
    (a, b) => {
      const dateA = new Date(groupedByDate[a][0].scheduledDate);
      const dateB = new Date(groupedByDate[b][0].scheduledDate);
      return dateB.getTime() - dateA.getTime();
    },
  );

  const handleDeleteConfirm = () => {
    if (taskToDelete && onDeleteTask) {
      onDeleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const handleClearConfirm = () => {
    if (onClearArchive) {
      onClearArchive();
      setShowClearDialog(false);
    }
  };

  return (
    <div className="w-full md:w-[400px] h-screen bg-[#e9f7e9] border-l border-[#e3e3e3] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#e3e3e3]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#e1f6ff] flex items-center justify-center">
            <Archive className="w-5 h-5 text-[#2c62b4]" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#313131]">
              Archive
            </h2>
            <p className="text-[13px] text-[#828282]">
              {archivedTasks.length} completed{" "}
              {archivedTasks.length === 1 ? "task" : "tasks"}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#828282]" />
          <Input
            type="text"
            placeholder="Search archived tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Clear Archive Button */}
        {archivedTasks.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowClearDialog(true)}
            className="w-full mt-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Archive
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f8f9fa] flex items-center justify-center mb-4">
              <Archive className="w-8 h-8 text-[#828282]" />
            </div>
            <p className="text-[#828282] text-[14px] mb-1">
              {searchQuery
                ? "No tasks found"
                : "No archived tasks"}
            </p>
            <p className="text-[#828282] text-[12px] max-w-[250px]">
              {searchQuery
                ? "Try adjusting your search query"
                : "Completed tasks will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedMonths.map((monthYear) => (
              <div key={monthYear}>
                <h3 className="text-[14px] font-medium text-[#828282] mb-3 sticky top-0 bg-[#e9f7e9] py-2">
                  {monthYear}
                </h3>
                <div className="space-y-3">
                  {groupedByDate[monthYear]
                    .sort(
                      (a, b) =>
                        new Date(b.scheduledDate).getTime() -
                        new Date(a.scheduledDate).getTime(),
                    )
                    .map((task) => (
                      <div
                        key={task.id}
                        className="relative group"
                      >
                        <TaskCard
                          task={task}
                          onStatusChange={onTaskStatusChange}
                          onTaskClick={onTaskClick}
                        />
                        {onDeleteTask && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTaskToDelete(task.id);
                            }}
                            className="absolute top-2 right-10 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
                            title="Delete permanently"
                            aria-label="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Task Dialog */}
      <AlertDialog
        open={taskToDelete !== null}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Task Permanently
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this
              task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Archive Dialog */}
      <AlertDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Archive</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete all{" "}
              {archivedTasks.length} archived tasks? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}