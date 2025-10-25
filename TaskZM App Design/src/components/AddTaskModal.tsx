import { useState, useEffect } from "react";
import { aiSmartSchedule } from "../lib/aiScheduler";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { X, Plus, Sparkles, Repeat } from "lucide-react";
import imgEllipse1 from "figma:asset/d27a4024b461a05be4dc5d2794f44523e1a6d307.png";
import imgEllipse2 from "figma:asset/0b09f1f030532c052b907665b73802b76fc8d1f2.png";

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
  dependencies?: string[];
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    endDate?: string;
    count?: number;
    daysOfWeek?: number[];
  };
  recurringGroupId?: string;
}

export interface TagDefinition {
  id: string;
  text: string;
  bgColor: string;
  textColor: string;
  fontWeight: "bold" | "medium";
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (
    task: Omit<Task, "id">,
    useAiSchedule?: boolean,
  ) => void;
  onEditTask?: (
    taskId: string,
    task: Omit<Task, "id">,
    useAiSchedule?: boolean,
  ) => void;
  defaultDate?: string;
  defaultTitle?: string;
  editingTask?: Task;
  allTasks?: Task[];
  currentWeek?: Date;
  availableTags?: TagDefinition[];
  onManageTags?: () => void;
}

const assigneeOptions = [
  { name: "Sarah Johnson", avatar: imgEllipse1 },
  { name: "Jane Smith", avatar: imgEllipse2 },
  { name: "Mike Chen", avatar: imgEllipse1 },
  { name: "Alex Rivera", avatar: imgEllipse2 },
  { name: "Emma Watson", avatar: imgEllipse1 },
  { name: "David Kim", avatar: imgEllipse2 },
];

export default function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
  onEditTask,
  defaultDate,
  defaultTitle,
  editingTask,
  allTasks = [],
  currentWeek = new Date(),
  availableTags = [],
  onManageTags,
}: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    assignee: assigneeOptions[0],
    dueDate: "",
    scheduledDate:
      defaultDate || new Date().toISOString().split("T")[0],
    scheduledTime: "",
    status: "todo" as Task["status"],
    notes: "",
    selectedTags: [] as Array<{
      text: string;
      bgColor: string;
      textColor: string;
      fontWeight: "bold" | "medium";
    }>,
    dependencies: [] as string[],
    subtasks: [] as Array<{
      id: string;
      text: string;
      completed: boolean;
    }>,
  });

  const [useAiSchedule, setUseAiSchedule] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringData, setRecurringData] = useState({
    frequency: "weekly" as "daily" | "weekly" | "monthly",
    interval: 1,
    endType: "count" as "never" | "date" | "count",
    endDate: "",
    count: 10,
  });

  // Load editing task data
  useEffect(() => {
    if (editingTask) {
      const assignee =
        assigneeOptions.find(
          (a) => a.name === editingTask.assignee.name,
        ) || assigneeOptions[0];
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        assignee: assignee,
        dueDate: editingTask.dueDate,
        scheduledDate: editingTask.scheduledDate,
        scheduledTime: editingTask.scheduledTime || "",
        status: editingTask.status,
        notes: editingTask.notes || "",
        selectedTags: editingTask.tags,
        dependencies: editingTask.dependencies || [],
        subtasks: editingTask.subtasks || [],
      });
      // Reset AI schedule and recurring toggles when loading edit task
      setUseAiSchedule(false);
      setIsRecurring(false);
    }
  }, [editingTask]);

  // Reset recurring state when modal opens
  useEffect(() => {
    if (isOpen && !editingTask) {
      setIsRecurring(false);
      setRecurringData({
        frequency: "weekly",
        interval: 1,
        endType: "count",
        endDate: "",
        count: 10,
      });
    }
  }, [isOpen, editingTask]);

  // Update scheduledDate when defaultDate changes
  useEffect(() => {
    if (defaultDate && !editingTask) {
      setFormData((prev) => ({
        ...prev,
        scheduledDate: defaultDate,
      }));
    }
  }, [defaultDate, editingTask]);

  // Update title when defaultTitle changes (from inbox)
  useEffect(() => {
    if (defaultTitle && !editingTask) {
      setFormData((prev) => ({ ...prev, title: defaultTitle }));
    }
  }, [defaultTitle, editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    // If AI scheduling is enabled, find the best date
    let scheduledDate = formData.scheduledDate;
    if (useAiSchedule && !editingTask) {
      const bestDate = aiSmartSchedule(
        {
          title: formData.title,
          description: formData.description,
          tags: formData.selectedTags,
          priority: formData.priority,
          assignee: formData.assignee,
          dueDate: formData.dueDate,
          status: formData.status,
          notes: formData.notes,
          dependencies: formData.dependencies.length > 0 ? formData.dependencies : undefined,
        } as Task,
        allTasks,
        currentWeek,
        6
      );
      
      if (bestDate) {
        scheduledDate = bestDate;
      }
    }

    const taskData: Omit<Task, "id"> = {
      title: formData.title,
      description: formData.description,
      tags: formData.selectedTags,
      priority: formData.priority,
      assignee: formData.assignee,
      dueDate: formData.dueDate,
      scheduledDate: scheduledDate,
      scheduledTime: formData.scheduledTime || undefined,
      status: formData.status,
      notes: formData.notes || undefined,
      subtasks: formData.subtasks.length > 0 ? formData.subtasks : undefined,
      dependencies:
        formData.dependencies.length > 0
          ? formData.dependencies
          : undefined,
      recurring: isRecurring
        ? {
            frequency: recurringData.frequency,
            interval: recurringData.interval,
            endDate:
              recurringData.endType === "date"
                ? recurringData.endDate
                : undefined,
            count:
              recurringData.endType === "count"
                ? recurringData.count
                : undefined,
          }
        : undefined,
    };

    if (editingTask && onEditTask) {
      console.log(
        "Editing task with id:",
        editingTask.id,
        "useAiSchedule:",
        useAiSchedule,
      );
      onEditTask(editingTask.id, taskData, useAiSchedule);
    } else {
      console.log(
        "Adding new task with scheduledDate:",
        formData.scheduledDate,
        "useAiSchedule:",
        useAiSchedule,
      );
      onAddTask(taskData, useAiSchedule);
    }

    onClose();

    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      assignee: assigneeOptions[0],
      dueDate: "",
      scheduledDate:
        defaultDate || new Date().toISOString().split("T")[0],
      scheduledTime: "",
      status: "todo",
      notes: "",
      selectedTags: [],
      dependencies: [],
      subtasks: [],
    });
    setUseAiSchedule(false);
    setIsRecurring(false);
    setRecurringData({
      frequency: "weekly",
      interval: 1,
      endType: "count",
      endDate: "",
      count: 10,
    });
  };

  const toggleTag = (tag: TagDefinition) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.find(
        (t) => t.text === tag.text,
      )
        ? prev.selectedTags.filter((t) => t.text !== tag.text)
        : [
            ...prev.selectedTags,
            {
              text: tag.text,
              bgColor: tag.bgColor,
              textColor: tag.textColor,
              fontWeight: tag.fontWeight,
            },
          ],
    }));
  };

  // Helper function to check if adding a dependency would create a circular dependency
  const wouldCreateCircularDependency = (
    taskId: string,
    newDependencyId: string,
  ): boolean => {
    if (taskId === newDependencyId) return true;

    const visited = new Set<string>();
    const stack = [newDependencyId];

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      if (currentId === taskId) return true;

      const currentTask = allTasks.find(
        (t) => t.id === currentId,
      );
      if (currentTask?.dependencies) {
        stack.push(...currentTask.dependencies);
      }
    }

    return false;
  };

  const toggleDependency = (taskId: string) => {
    // Check for circular dependency
    if (
      editingTask &&
      wouldCreateCircularDependency(editingTask.id, taskId)
    ) {
      alert(
        "Cannot add this dependency: it would create a circular dependency chain.",
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      dependencies: prev.dependencies.includes(taskId)
        ? prev.dependencies.filter((id) => id !== taskId)
        : [...prev.dependencies, taskId],
    }));
  };

  // Get available tasks for dependency selection (exclude current task if editing)
  const availableTasksForDependencies = allTasks.filter(
    (task) => {
      // Exclude the current task being edited
      if (editingTask && task.id === editingTask.id)
        return false;
      // Only show incomplete tasks
      return task.status !== "done";
    },
  );

  // Subtasks management functions
  const addSubtask = () => {
    const newSubtask = {
      id: `subtask-${Date.now()}`,
      text: "",
      completed: false,
    };
    setFormData((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask],
    }));
  };

  const updateSubtask = (id: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, text } : subtask
      ),
    }));
  };

  const toggleSubtaskCompletion = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
      ),
    }));
  };

  const removeSubtask = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((subtask) => subtask.id !== id),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-3 sm:p-6">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[20px] relative shrink-0 text-[#313131] text-[18px] sm:text-[24px] pr-6"
                       style={{ fontVariationSettings: "'opsz' 14" }}>
            {editingTask ? "Edit Task" : "Add Task"}
          </DialogTitle>
          <DialogDescription className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[13px] relative shrink-0 text-[#828282] text-[10px] sm:text-[13px] hidden sm:block"
                             style={{ fontVariationSettings: "'opsz' 14" }}>
            {editingTask
              ? "Update task details and schedule"
              : "Create a new task with all necessary details and schedule it for a specific day"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-6"
        >
          {/* Title */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="title"
              className="text-xs sm:text-sm"
            >
              Task Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Enter task title"
              required
              className="h-8 sm:h-10 text-sm"
            />
          </div>

          {/* Description - Hidden on mobile */}
          <div className="space-y-2 hidden sm:block">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          {/* Tags - Compact on mobile */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs sm:text-sm">Tags</Label>
              {onManageTags && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onManageTags}
                  className="h-auto py-0.5 sm:py-1 px-1.5 sm:px-2 text-[10px] sm:text-xs text-[#3300ff] hover:text-[#2200cc] hover:bg-[#e1f6ff]"
                >
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  Manage
                </Button>
              )}
            </div>
            {availableTags.length === 0 ? (
              <div className="p-2 sm:p-4 text-center border border-dashed border-[#e3e3e3] rounded-lg">
                <p className="text-xs sm:text-sm text-[#828282] mb-1 sm:mb-2">
                  No tags available
                </p>
                {onManageTags && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onManageTags}
                    className="text-xs h-7 sm:h-8"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Create Tag
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs transition-all ${
                      formData.selectedTags.find(
                        (t) => t.text === tag.text,
                      )
                        ? "opacity-100 ring-1 sm:ring-2 ring-offset-1"
                        : "opacity-50 hover:opacity-75"
                    }`}
                    style={{
                      backgroundColor: tag.bgColor,
                      color: tag.textColor,
                      fontWeight:
                        tag.fontWeight === "bold"
                          ? "bold"
                          : "500",
                      ringColor: formData.selectedTags.find(
                        (t) => t.text === tag.text,
                      )
                        ? tag.textColor
                        : "transparent",
                    }}
                  >
                    {tag.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Task["priority"]) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: value,
                  }))
                }
              >
                <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task["status"]) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
              >
                <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="inprogress">
                    In Progress
                  </SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee - Hidden on mobile */}
          <div className="space-y-2 hidden sm:block">
            <Label>Assignee</Label>
            <Select
              value={formData.assignee.name}
              onValueChange={(value) => {
                const assignee = assigneeOptions.find(
                  (a) => a.name === value,
                );
                if (assignee) {
                  setFormData((prev) => ({
                    ...prev,
                    assignee,
                  }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assigneeOptions.map((assignee) => (
                  <SelectItem
                    key={assignee.name}
                    value={assignee.name}
                  >
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Dependencies - Hidden on mobile */}
          <div className="space-y-2 hidden sm:block">
            <div className="flex items-center justify-between">
              <Label>Task Dependencies</Label>
              <span className="text-xs text-[#828282]">
                {formData.dependencies.length > 0
                  ? `${formData.dependencies.length} selected`
                  : "Optional"}
              </span>
            </div>
            <p className="text-xs text-[#828282]">
              Select tasks that must be completed before this
              task can start
            </p>
            {availableTasksForDependencies.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-[#e3e3e3] rounded-lg">
                <p className="text-sm text-[#828282]">
                  No tasks available for dependencies
                </p>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-[#e3e3e3] rounded-lg">
                {availableTasksForDependencies.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleDependency(task.id)}
                    className={`w-full flex items-start gap-3 p-3 text-left hover:bg-[#f8f9fa] transition-colors border-b border-[#e3e3e3] last:border-b-0 ${
                      formData.dependencies.includes(task.id)
                        ? "bg-[#e1f6ff]"
                        : ""
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                        formData.dependencies.includes(task.id)
                          ? "bg-[#3300ff] border-[#3300ff]"
                          : "border-[#d0d0d0]"
                      }`}
                    >
                      {formData.dependencies.includes(
                        task.id,
                      ) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#313131] truncate">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-[#828282] truncate mt-0.5">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-xs text-[#828282]">
                          {new Date(
                            task.scheduledDate,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Schedule Toggle - Compact on mobile */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <Label
                  htmlFor="ai-schedule"
                  className="cursor-pointer text-xs sm:text-base leading-tight"
                >
                  AI Smart Schedule
                </Label>
                <p className="text-[10px] sm:text-xs text-[#828282] mt-0.5 hidden sm:block">
                  {editingTask
                    ? "Let AI reschedule this task to the best time slot"
                    : "Let AI find the best time slot based on priority and workload"}
                </p>
              </div>
            </div>
            <Switch
              id="ai-schedule"
              checked={useAiSchedule}
              onCheckedChange={setUseAiSchedule}
              className="shrink-0 scale-90 sm:scale-100"
            />
          </div>

          {/* Dates and Time - Simplified on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="scheduledDate"
                className="text-xs sm:text-sm"
              >
                Scheduled Date {!useAiSchedule && "*"}
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledDate: e.target.value,
                  }))
                }
                required={!useAiSchedule}
                disabled={useAiSchedule}
                className={`h-8 sm:h-10 text-xs sm:text-sm ${useAiSchedule ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {useAiSchedule && (
                <p className="text-[10px] sm:text-xs text-purple-600 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  AI will schedule
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2 hidden sm:block">
              <Label
                htmlFor="scheduledTime"
                className="text-xs sm:text-sm"
              >
                Scheduled Time
              </Label>
              <Input
                id="scheduledTime"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledTime: e.target.value,
                  }))
                }
                disabled={useAiSchedule}
                className={`h-8 sm:h-10 text-xs sm:text-sm ${useAiSchedule ? "opacity-50 cursor-not-allowed" : ""}`}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2 hidden sm:block">
              <Label
                htmlFor="dueDate"
                className="text-xs sm:text-sm"
              >
                Due Date
              </Label>
              <Input
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
                placeholder="e.g., 25 Aug"
                className="h-8 sm:h-10 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Recurring Task Section */}
          {!editingTask && (
            <div className="space-y-3 p-3 sm:p-4 bg-[#f8f9fa] rounded-lg border border-[#e3e3e3]">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Label
                    htmlFor="is-recurring"
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    Repeat Task
                  </Label>
                  <p className="text-[10px] sm:text-xs text-[#828282] mt-0.5">
                    Create recurring instances of this task
                  </p>
                </div>
                <Switch
                  id="is-recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                  className="shrink-0 scale-90 sm:scale-100"
                />
              </div>

              {isRecurring && (
                <div className="space-y-3 pt-2 border-t border-[#e3e3e3]">
                  {/* Frequency */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs sm:text-sm">
                        Repeat Every
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={recurringData.interval}
                          onChange={(e) =>
                            setRecurringData((prev) => ({
                              ...prev,
                              interval: Math.max(
                                1,
                                parseInt(e.target.value) || 1,
                              ),
                            }))
                          }
                          className="h-8 sm:h-10 text-xs sm:text-sm w-16"
                        />
                        <Select
                          value={recurringData.frequency}
                          onValueChange={(
                            value:
                              | "daily"
                              | "weekly"
                              | "monthly",
                          ) =>
                            setRecurringData((prev) => ({
                              ...prev,
                              frequency: value,
                            }))
                          }
                        >
                          <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">
                              {recurringData.interval === 1
                                ? "Day"
                                : "Days"}
                            </SelectItem>
                            <SelectItem value="weekly">
                              {recurringData.interval === 1
                                ? "Week"
                                : "Weeks"}
                            </SelectItem>
                            <SelectItem value="monthly">
                              {recurringData.interval === 1
                                ? "Month"
                                : "Months"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* End Type */}
                    <div className="space-y-1.5">
                      <Label className="text-xs sm:text-sm">
                        Ends
                      </Label>
                      <Select
                        value={recurringData.endType}
                        onValueChange={(
                          value: "never" | "date" | "count",
                        ) =>
                          setRecurringData((prev) => ({
                            ...prev,
                            endType: value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="count">
                            After X times
                          </SelectItem>
                          <SelectItem value="date">
                            On date
                          </SelectItem>
                          <SelectItem value="never">
                            Never
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* End Date or Count */}
                  {recurringData.endType === "date" && (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="recurring-end-date"
                        className="text-xs sm:text-sm"
                      >
                        End Date
                      </Label>
                      <Input
                        id="recurring-end-date"
                        type="date"
                        value={recurringData.endDate}
                        onChange={(e) =>
                          setRecurringData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                        min={formData.scheduledDate}
                        className="h-8 sm:h-10 text-xs sm:text-sm"
                      />
                    </div>
                  )}

                  {recurringData.endType === "count" && (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="recurring-count"
                        className="text-xs sm:text-sm"
                      >
                        Number of Occurrences
                      </Label>
                      <Input
                        id="recurring-count"
                        type="number"
                        min="1"
                        max="52"
                        value={recurringData.count}
                        onChange={(e) =>
                          setRecurringData((prev) => ({
                            ...prev,
                            count: Math.min(
                              52,
                              Math.max(
                                1,
                                parseInt(e.target.value) || 1,
                              ),
                            ),
                          }))
                        }
                        className="h-8 sm:h-10 text-xs sm:text-sm"
                      />
                      <p className="text-[10px] text-[#828282]">
                        Maximum 52 occurrences
                      </p>
                    </div>
                  )}

                  {/* Preview */}
                  <div className="p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded text-[10px] sm:text-xs text-[#313131]">
                    <span className="font-medium">
                      Preview:{" "}
                    </span>
                    {recurringData.frequency === "daily" &&
                      `Every ${recurringData.interval} ${recurringData.interval === 1 ? "day" : "days"}`}
                    {recurringData.frequency === "weekly" &&
                      `Every ${recurringData.interval} ${recurringData.interval === 1 ? "week" : "weeks"}`}
                    {recurringData.frequency === "monthly" &&
                      `Every ${recurringData.interval} ${recurringData.interval === 1 ? "month" : "months"}`}
                    {recurringData.endType === "count" &&
                      `, ${recurringData.count} times`}
                    {recurringData.endType === "date" &&
                      recurringData.endDate &&
                      `, until ${recurringData.endDate}`}
                    {recurringData.endType === "never" &&
                      ", indefinitely (max 52 occurrences)"}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subtasks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs sm:text-sm">Subtasks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubtask}
                className="h-7 sm:h-8 text-xs"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Add Subtask
              </Button>
            </div>
            
            {formData.subtasks.length === 0 ? (
              <div className="p-3 sm:p-4 text-center border border-dashed border-[#e3e3e3] rounded-lg">
                <p className="text-xs sm:text-sm text-[#828282]">
                  No subtasks added yet
                </p>
                <p className="text-[10px] sm:text-xs text-[#828282] mt-1">
                  Break down complex tasks into smaller steps
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.subtasks.map((subtask, index) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 p-2 sm:p-3 bg-[#f8f9fa] border border-[#e3e3e3] rounded-lg"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSubtaskCompletion(subtask.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                        subtask.completed
                          ? "bg-[#00c851] border-[#00c851]"
                          : "border-[#d0d0d0] hover:border-[#00c851]"
                      }`}
                    >
                      {subtask.completed && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    
                    <Input
                      value={subtask.text}
                      onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                      placeholder={`Subtask ${index + 1}`}
                      className={`flex-1 h-8 sm:h-10 text-xs sm:text-sm ${
                        subtask.completed ? "line-through text-[#828282]" : ""
                      }`}
                    />
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSubtask(subtask.id)}
                      className="h-8 sm:h-10 w-8 sm:w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes - Hidden on mobile */}
          <div className="space-y-2 hidden sm:block">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Additional notes for this task"
              rows={2}
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2 sm:pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto h-9 sm:h-10 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#3300ff] hover:bg-[#2200cc] text-white w-full sm:w-auto h-9 sm:h-10 text-sm"
            >
              {editingTask ? "Save Changes" : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}