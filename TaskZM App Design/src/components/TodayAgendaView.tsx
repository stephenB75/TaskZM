import React, { useState, useEffect } from 'react';
import { Clock, Plus, CheckCircle, Circle, Play, Pause } from 'lucide-react';
import { Task } from '../App';

interface TodayAgendaViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
  onAddTask: () => void;
}

export default function TodayAgendaView({
  tasks,
  onTaskClick,
  onTaskUpdate,
  onAddTask
}: TodayAgendaViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate time slots from 9 AM to 5 PM (PRD specification)
  const generateTimeSlots = () => {
    const slots: Array<{ time: Date; displayTime: string }> = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = new Date();
      time.setHours(hour, 0, 0, 0);
      slots.push({
        time,
        displayTime: time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  // Get tasks for today
  const todayTasks = tasks.filter(task => 
    task.scheduledDate === todayString && !task.archived
  );

  // Get current time for highlighting
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const getTasksForTimeSlot = (hour: number) => {
    return todayTasks.filter(task => {
      if (!task.scheduledTime) return false;
      const [taskHour] = task.scheduledTime.split(':').map(Number);
      return taskHour === hour;
    });
  };

  const isCurrentTimeSlot = (hour: number) => {
    return hour === currentHour;
  };

  const isPastTimeSlot = (hour: number) => {
    return hour < currentHour;
  };

  const formatTaskTime = (scheduledTime: string) => {
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-orange-500 bg-orange-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header - PRD Timeline Panel Header */}
      <div className="flex-shrink-0 px-6 py-8 border-b border-[rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-[#313131]">
              Today's Agenda
            </h1>
            <p className="text-[13px] text-[#828282] mt-1">
              {today.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline - PRD Timeline Panel */}
      <div className="flex-1 overflow-y-auto">
          {timeSlots.map((slot, index) => {
            const tasksInSlot = getTasksForTimeSlot(slot.time.getHours());
            const isCurrent = isCurrentTimeSlot(slot.time.getHours());
            const isPast = isPastTimeSlot(slot.time.getHours());

            return (
              <div key={index} className="border-b border-[rgba(0,0,0,0.05)]">
                {/* Time Slot - PRD Specification: h-16 (64px) */}
                <div className={`h-16 flex items-center px-6 ${
                  isCurrent ? 'bg-[#3300ff]/5' : ''
                }`}>
                  {/* Time Label - PRD Specification: text-[12px], text-[#828282] */}
                  <div className={`w-20 text-[12px] ${
                    isCurrent ? 'text-[#3300ff]' : 
                    isPast ? 'text-gray-400' : 'text-[#828282]'
                  }`}>
                    {slot.displayTime}
                  </div>

                  {/* Current Time Indicator */}
                  {isCurrent && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3300ff] rounded-full" />
                  )}

                  {/* Tasks in this time slot */}
                  <div className="flex-1 ml-4">
                    {tasksInSlot.length > 0 ? (
                      tasksInSlot.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className={`p-2 rounded border-l-2 cursor-pointer hover:shadow-sm transition-all ${getPriorityColor(task.priority)}`}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedTask = {
                                  ...task,
                                  status: task.status === 'done' ? 'todo' as const : 'done' as const
                                };
                                onTaskUpdate(updatedTask);
                              }}
                              className="flex-shrink-0"
                            >
                              {task.status === 'done' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400 hover:text-green-600" />
                              )}
                            </button>
                            <h3 className={`text-[13px] ${
                              task.status === 'done' ? 'line-through text-[#828282]' : 'text-[#313131]'
                            }`}>
                              {task.title}
                            </h3>
                          </div>
                          {task.description && (
                            <p className="text-[10px] text-[#828282] mt-1 ml-6">
                              {task.description}
                            </p>
                          )}
                        </div>
                      ))
                    ) : null}
                  </div>
                </div>

              </div>
            );
          })}
      </div>
    </div>
  );
}
