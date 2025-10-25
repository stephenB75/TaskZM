import { useState } from "react";
import { Inbox, Plus } from "lucide-react";

export interface InboxTask {
  id: string;
  title: string;
  createdAt: string;
}

interface InboxPanelProps {
  inboxTasks: InboxTask[];
  onAddInboxTask: (task: InboxTask) => void;
  onScheduleTask: (taskId: string, title: string) => void;
}

export default function InboxPanel({
  inboxTasks,
  onAddInboxTask,
  onScheduleTask,
}: InboxPanelProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddInboxTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: InboxTask = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        createdAt: new Date().toISOString(),
      };
      onAddInboxTask(newTask);
      setNewTaskTitle("");
    }
  };

  const handleScheduleTask = (task: InboxTask) => {
    // Open the Add Task modal with pre-filled title
    // Don't remove from inbox yet - will be removed when task is saved
    onScheduleTask(task.id, task.title);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddInboxTask();
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full md:w-[315px] md:flex-shrink-0">
      <div className="min-h-[400px] md:h-screen bg-white border border-[#e3e3e3] md:border-l md:border-t-0 md:border-r-0 md:border-b-0 rounded-lg md:rounded-none flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-[#e3e3e3]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#3300ff]/10 rounded-lg flex items-center justify-center">
              <Inbox className="w-5 h-5 text-[#3300ff]" />
            </div>
            <div>
              <h2 className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[20px] relative shrink-0 text-[#313131] text-[18px]"
                  style={{ fontVariationSettings: "'opsz' 14" }}>
                Inbox
              </h2>
              <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[13px] relative shrink-0 text-[#828282] text-[10px]"
                 style={{ fontVariationSettings: "'opsz' 14" }}>
                Quick capture
              </p>
            </div>
          </div>
          <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[13px] relative shrink-0 text-[#828282] text-[10px] mt-2"
             style={{ fontVariationSettings: "'opsz' 14" }}>
            {inboxTasks.length} task
            {inboxTasks.length !== 1 ? "s" : ""} waiting to be
            scheduled
          </p>
        </div>

        {/* Quick Add Input */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-[#e3e3e3]">
          <div className="relative">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a task..."
              className="w-full bg-[#f8f9fa] border border-[#e3e3e3] rounded-lg px-4 py-3 pr-12 text-[14px] text-[#313131] placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-[#3300ff] focus:border-transparent transition-all"
            />
            <button
              onClick={handleAddInboxTask}
              disabled={!newTaskTitle.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#3300ff] text-white rounded-md hover:bg-[#2200cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add task (Enter)"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-[#828282] mt-2">
            Press Enter to add • Click tasks below to open full
            task form
          </p>
        </div>

        {/* Inbox Tasks List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {inboxTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-[#828282]" />
              </div>
              <p className="text-[14px] text-[#828282] mb-1">
                Your inbox is empty
              </p>
              <p className="text-[12px] text-[#828282]">
                Quickly capture tasks as they come to mind
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {inboxTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleScheduleTask(task)}
                  className="w-full bg-[#f8f9fa] hover:bg-[#e9ebef] border border-[#e3e3e3] rounded-lg p-3 text-left transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-[#313131] font-medium mb-1 line-clamp-2">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-[#828282]">
                      Added {formatTime(task.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        {inboxTasks.length > 0 && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-[#e3e3e3] bg-[#f8f9fa]">
            <p className="text-[11px] text-[#828282] text-center">
              Click any task to add it to your schedule
            </p>
          </div>
        )}
      </div>
    </div>
  );
}