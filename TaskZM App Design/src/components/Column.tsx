import TaskCard from "./TaskCard";

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
}

interface ColumnProps {
  title: string;
  tasks: Task[];
  onTaskStatusChange?: (
    taskId: string,
    newStatus: Task["status"],
  ) => void;
  onTaskDrop?: (
    taskId: string,
    targetStatus: Task["status"],
  ) => void;
  status: Task["status"];
}

function ColumnHeader({ title }: { title: string }) {
  return (
    <div
      className="bg-white box-border content-stretch flex gap-[12.082px] items-center justify-center px-[28.996px] py-[14.498px] relative shrink-0 w-[376.942px]"
      data-name="Column Header"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#f4f4f4] border-[0px_0px_1.208px] border-solid inset-0 pointer-events-none"
      />
      <p
        className="basis-0 font-['DM_Sans:Regular',_sans-serif] font-normal grow leading-[28.996px] min-h-px min-w-px relative shrink-0 text-[#313131] text-[19.33px] text-center uppercase"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {title}
      </p>
    </div>
  );
}

export default function Column({
  title,
  tasks,
  onTaskStatusChange,
  onTaskDrop,
  status,
}: ColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId && onTaskDrop) {
      onTaskDrop(taskId, status);
    }
  };

  return (
    <div
      className="bg-[#fdfdfd] relative rounded-[11.567px] size-full"
      data-name="Column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="box-border content-stretch flex flex-col gap-[19.33px] items-center overflow-clip pb-[28.996px] pt-0 px-0 relative size-full">
        <ColumnHeader title={title} />

        {/* Tasks Container */}
        <div className="flex flex-col gap-[19.33px] items-center w-full px-[28.996px] overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", task.id);
              }}
            >
              <TaskCard
                task={task}
                onStatusChange={onTaskStatusChange}
              />
            </div>
          ))}

          {/* Empty State */}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-center">
              <p
                className="font-['DM_Sans:Regular',_sans-serif] font-normal text-[#828282] text-[14.498px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                No tasks
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute border-[#e3e3e3] border-[1.208px] border-solid inset-[-1.208px] pointer-events-none rounded-[12.7751px] shadow-[39.651px_39.651px_99.128px_0px_rgba(0,0,0,0.03)]"
      />
    </div>
  );
}