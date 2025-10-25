import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { calculateDayProgress, getTimeOfDay } from '../lib/adhd';
import { Task } from '../App';

interface TimeAwarenessBarProps {
  isVisible: boolean;
  onToggle: () => void;
  tasks?: Task[];
}

export default function TimeAwarenessBar({ isVisible, onToggle, tasks = [] }: TimeAwarenessBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dayProgress, setDayProgress] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
      setDayProgress(calculateDayProgress());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Calculate analytics
  const getTaskMetrics = () => {
    const completedTasks = tasks.filter(task => task.status === 'done' && !task.archived);
    const totalTasks = tasks.filter(task => !task.archived);
    const completionRate = totalTasks.length > 0 ? (completedTasks.length / totalTasks.length) * 100 : 0;
    
    return {
      tasksCompleted: completedTasks.length,
      totalTasks: totalTasks.length,
      completionRate
    };
  };

  const taskMetrics = getTaskMetrics();

  return (
    <div className="analytics-progress-bar">
      <div className="flex items-center justify-between w-full">
        {/* Time Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/80" />
            <span className="text-white font-medium text-sm">{timeString}</span>
          </div>
        </div>

        {/* Analytics Data */}
        <div className="flex items-center gap-6">
          {/* Task Completion */}
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-white/80" />
            <div className="text-white text-sm font-medium">
              {taskMetrics.tasksCompleted}/{taskMetrics.totalTasks}
            </div>
          </div>

          {/* Completion Rate */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white/80" />
            <div className="text-white text-sm font-medium">
              {Math.round(taskMetrics.completionRate)}%
            </div>
          </div>

          {/* Day Progress */}
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-white/80" />
            <div className="text-white text-sm font-medium">
              {Math.round(dayProgress)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
