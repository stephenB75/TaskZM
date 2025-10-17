import svgPaths from "../imports/svg-5yy7db8tu3";
import imgIcon from "figma:asset/963deb7708a8414668396d1993b85035b01204ff.png";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

interface Tag {
  text: string;
  bgColor: string;
  textColor: string;
  fontWeight: "bold" | "medium";
}

interface Task {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
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
  dependencies?: string[];
  recurringGroupId?: string;
}

interface TaskCardProps {
  task: Task;
  onStatusChange?: (
    taskId: string,
    newStatus: Task["status"],
  ) => void;
  onTaskClick?: (taskId: string) => void;
  allTasks?: Task[];
}

function Tag({ tag }: { tag: Tag }) {
  return (
    <div
      className="box-border content-stretch flex gap-[2px] items-center px-[5px] py-[2px] relative rounded-[3px] shrink-0"
      style={{ backgroundColor: tag.bgColor }}
      data-name="Tag"
    >
      <p
        className={`font-['DM_Sans:${tag.fontWeight === "bold" ? "Bold" : "Medium"}',_sans-serif] leading-[11px] relative shrink-0 text-[9px] text-nowrap whitespace-pre`}
        style={{
          color: tag.textColor,
          fontWeight:
            tag.fontWeight === "bold" ? "bold" : "500",
          fontVariationSettings: "'opsz' 14",
        }}
      >
        {tag.text}
      </p>
    </div>
  );
}

function Priority({
  level,
}: {
  level: "high" | "medium" | "low";
}) {
  const priorityConfig = {
    high: {
      label: "High",
      bgColor: "#fee2e2",
      textColor: "#dc2626",
      borderColor: "#fecaca",
    },
    medium: {
      label: "Medium",
      bgColor: "#fef3c7",
      textColor: "#d97706",
      borderColor: "#fde68a",
    },
    low: {
      label: "Low",
      bgColor: "#f3f4f6",
      textColor: "#6b7280",
      borderColor: "#e5e7eb",
    },
  };

  const config = priorityConfig[level];

  return (
    <div
      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] border shrink-0"
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        borderColor: config.borderColor,
      }}
    >
      <span className="font-medium">{config.label}</span>
    </div>
  );
}

function TablerIconLink() {
  return (
    <div
      className="relative shrink-0 size-[14px]"
      data-name="tabler-icon-link"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="tabler-icon-link">
          <path
            d={svgPaths.p2196b780}
            id="Vector"
            stroke="var(--stroke-0, #828282)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.20815"
          />
          <path
            d={svgPaths.p289dba00}
            id="Vector_2"
            stroke="var(--stroke-0, #828282)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.20815"
          />
          <path
            d={svgPaths.p39db8f80}
            id="Vector_3"
            stroke="var(--stroke-0, #828282)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.20815"
          />
        </g>
      </svg>
    </div>
  );
}

function TablerIconCalendarEvent() {
  return (
    <div
      className="relative shrink-0 size-[14px]"
      data-name="tabler-icon-calendar-event"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="tabler-icon-calendar-event">
          <path
            d={svgPaths.p27121100}
            id="Vector"
            stroke="var(--stroke-0, #828282)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.20815"
          />
        </g>
      </svg>
    </div>
  );
}

export default function TaskCard({
  task,
  onStatusChange,
  onTaskClick,
  allTasks = [],
}: TaskCardProps) {
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">(
    "12h",
  );

  useEffect(() => {
    // Read time format from localStorage
    const savedTimeFormat = localStorage.getItem(
      "timeFormat",
    ) as "12h" | "24h";
    if (savedTimeFormat) {
      setTimeFormat(savedTimeFormat);
    }
  }, []);

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "#3300ff";
      case "inprogress":
        return "#ff5c00";
      case "done":
        return "#00c851";
      default:
        return "#3300ff";
    }
  };

  const handleMarkDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      const newStatus =
        task.status === "done" ? "todo" : "done";
      onStatusChange(task.id, newStatus);
    }
  };

  // Check if dependencies are met
  const getDependencyStatus = () => {
    if (!task.dependencies || task.dependencies.length === 0) {
      return {
        hasUnmetDependencies: false,
        unmetCount: 0,
        totalCount: 0,
      };
    }

    const unmetDependencies = task.dependencies.filter(
      (depId) => {
        const depTask = allTasks.find((t) => t.id === depId);
        return depTask && depTask.status !== "done";
      },
    );

    return {
      hasUnmetDependencies: unmetDependencies.length > 0,
      unmetCount: unmetDependencies.length,
      totalCount: task.dependencies.length,
    };
  };

  const dependencyStatus = getDependencyStatus();

  // Format time based on user preference
  const formatTime = (time: string | undefined) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":").map(Number);

    if (timeFormat === "12h") {
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours =
        hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    }

    return time; // 24h format
  };

  return (
    <div
      className="bg-white box-border content-stretch flex flex-col gap-[6px] items-start p-[8px] relative rounded-[10px] shrink-0 w-[236px] cursor-pointer hover:shadow-lg transition-shadow"
      data-name="Card"
      onClick={() => onTaskClick?.(task.id)}
    >
      <div
        aria-hidden="true"
        className="absolute border-[#e3e3e3] border-[1px] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[39px_50px_18px_0px_rgba(0,0,0,0),25px_32px_16px_0px_rgba(0,0,0,0),14px_18px_13px_0px_rgba(0,0,0,0.01),6px_8px_10px_0px_rgba(0,0,0,0.01),2px_2px_5px_0px_rgba(0,0,0,0.01),0px_0px_0px_0px_rgba(0,0,0,0.01)]"
      />

      {/* Mark as Done Checkbox */}
      <button
        onClick={handleMarkDone}
        className={`absolute top-1.5 right-1.5 z-10 flex items-center justify-center rounded-full transition-all ${
          task.status === "done"
            ? "bg-[#00c851] w-4 h-4"
            : "border-2 border-[#d0d0d0] hover:border-[#00c851] w-4 h-4 hover:bg-[#f0fdf4]"
        }`}
        title={
          task.status === "done"
            ? "Mark as incomplete"
            : "Mark as done"
        }
        aria-label={
          task.status === "done"
            ? "Mark as incomplete"
            : "Mark as done"
        }
      >
        {task.status === "done" && (
          <Check
            className="w-3 h-3 text-white"
            strokeWidth={3}
          />
        )}
      </button>

      {/* Tags */}
      <div
        className="content-start flex flex-wrap gap-[4px] items-start relative shrink-0 w-full"
        data-name="Tags"
      >
        {task.tags.map((tag, index) => (
          <Tag key={index} tag={tag} />
        ))}
        {/* Recurring Indicator */}
        {task.recurringGroupId && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-purple-50 text-purple-700 border border-purple-200">
            <svg
              className="w-2.5 h-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="font-medium">Repeating</span>
          </div>
        )}
      </div>

      {/* Dependencies Indicator */}
      {task.dependencies && task.dependencies.length > 0 && (
        <div
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] ${
            dependencyStatus.hasUnmetDependencies
              ? "bg-orange-50 text-orange-700 border border-orange-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          <svg
            className="w-2.5 h-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="font-medium">
            {dependencyStatus.hasUnmetDependencies
              ? `Blocked by ${dependencyStatus.unmetCount} task${dependencyStatus.unmetCount > 1 ? "s" : ""}`
              : `${dependencyStatus.totalCount} dep${dependencyStatus.totalCount > 1 ? "s" : ""} met`}
          </span>
        </div>
      )}

      {/* Title */}
      <div
        className="content-stretch flex gap-[3px] items-start relative shrink-0 w-full"
        data-name="Title"
      >
        <p
          className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[16px] relative shrink-0 text-[#313131] text-[13px] w-full"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {task.title}
        </p>
      </div>

      {/* Description */}
      <p
        className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[13px] relative shrink-0 text-[#828282] text-[10px] w-full"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {task.description}
      </p>

      {/* Links */}
      {task.links && task.links.length > 0 && (
        <div
          className="content-start flex flex-wrap gap-[6px] items-start relative shrink-0 w-full"
          data-name="Links"
        >
          {task.links.map((link, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                window.open(link.url, "_blank");
              }}
              className="content-stretch flex gap-[2px] items-start relative shrink-0 hover:bg-gray-50 rounded p-0.5 -m-0.5 transition-colors"
              data-name="URL"
              title={`Open ${link.url}`}
            >
              <TablerIconLink />
              <p
                className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[13px] relative shrink-0 text-[#313131] text-[10px] text-nowrap whitespace-pre hover:text-[#3300ff]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {link.text}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Files */}
      {task.files && task.files.length > 0 && (
        <div
          className="content-start flex flex-wrap gap-[6px] items-start relative shrink-0 w-full"
          data-name="Files"
        >
          {task.files.map((file, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                // Future: Could download or open file
                console.log("File clicked:", file.name);
              }}
              className="content-stretch flex gap-[2px] items-start relative shrink-0 hover:bg-gray-50 rounded p-0.5 -m-0.5 transition-colors"
              data-name="File"
              title={`Open ${file.name}`}
            >
              <div
                className="overflow-clip relative shrink-0 size-[14px]"
                data-name="FileIcon"
              >
                <div
                  className="absolute left-[1.5px] size-[11px] top-[1.5px]"
                  data-name="Icon"
                >
                  <img
                    alt=""
                    className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                    src={imgIcon}
                  />
                </div>
              </div>
              <p
                className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[13px] relative shrink-0 text-[#313131] text-[10px] text-nowrap whitespace-pre hover:text-[#3300ff]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {file.name}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Notes */}
      {task.notes && (
        <div
          className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full"
          data-name="Notes"
        >
          <p
            className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[11px] relative shrink-0 text-[#828282] text-[9px] w-full"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Notes:
          </p>
          <p
            className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[13px] relative shrink-0 text-[#313131] text-[10px] w-full"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {task.notes}
          </p>
        </div>
      )}

      {/* Separator */}
      <div
        className="h-0 relative shrink-0 w-full"
        data-name="Notes"
      >
        <div className="absolute bottom-0 left-0 right-0 top-[-1.21px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 281 2"
          >
            <g id="Notes">
              <line
                id="Line 1"
                stroke="var(--stroke-0, #E3E3E3)"
                strokeWidth="1.20815"
                x2="280.29"
                y1="1.39593"
                y2="1.39593"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Empty spacing for separator */}
      <div className="h-0 shrink-0 w-full" data-name="Notes" />

      {/* Priority + Scheduled Time */}
      <div
        className="content-stretch flex items-center justify-between relative shrink-0 w-full"
        data-name="Priority + Scheduled Time"
      >
        <Priority level={task.priority} />

        {task.scheduledTime && (
          <p
            className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[13px] relative shrink-0 text-[#3300ff] text-[10px] text-nowrap whitespace-pre"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {formatTime(task.scheduledTime)}
          </p>
        )}
      </div>

      {/* Status Bar */}
      <div
        className="absolute h-[32px] left-[-1px] rounded-[12080.3px] top-[28px] w-[2.5px]"
        style={{ backgroundColor: getStatusColor(task.status) }}
      />
    </div>
  );
}