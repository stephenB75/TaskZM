import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, Timer, BarChart3, TrendingUp } from 'lucide-react';
import { timeTracking, TimeEntry, TimeTrackingStats } from '../lib/timeTracking';
import { Task } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface TimeTrackingProps {
  task: Task;
  onTimeUpdate?: (totalTime: number) => void;
}

export default function TimeTracking({ task, onTimeUpdate }: TimeTrackingProps) {
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [stats, setStats] = useState<TimeTrackingStats | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Subscribe to timer changes
    const unsubscribe = timeTracking.subscribe((timer) => {
      setActiveTimer(timer);
      setIsTracking(timer?.taskId === task.id);
    });

    // Load time entries for this task
    loadTimeEntries();
    loadStats();

    return unsubscribe;
  }, [task.id]);

  const loadTimeEntries = () => {
    const entries = timeTracking.getTimeEntriesForTask(task.id);
    setTimeEntries(entries);
    
    const totalTime = timeTracking.getTotalTimeForTask(task.id);
    onTimeUpdate?.(totalTime);
  };

  const loadStats = () => {
    const timeStats = timeTracking.calculateStats();
    setStats(timeStats);
  };

  const handleStartTimer = () => {
    const entry = timeTracking.startTimer(task.id, `Working on ${task.title}`);
    toast.success('Timer started');
    loadTimeEntries();
    loadStats();
  };

  const handleStopTimer = () => {
    const entry = timeTracking.stopTimer();
    if (entry) {
      toast.success(`Timer stopped. Duration: ${timeTracking.formatDuration(entry.duration || 0)}`);
      loadTimeEntries();
      loadStats();
    }
  };

  const handlePauseTimer = () => {
    const entry = timeTracking.pauseTimer();
    if (entry) {
      toast.success(`Timer paused. Duration: ${timeTracking.formatDuration(entry.duration || 0)}`);
      loadTimeEntries();
      loadStats();
    }
  };

  const getTotalTime = () => {
    return timeTracking.getTotalTimeForTask(task.id);
  };

  const formatDuration = (minutes: number) => {
    return timeTracking.formatDuration(minutes);
  };

  const getCurrentSessionTime = () => {
    if (!activeTimer || activeTimer.taskId !== task.id) {
      return 0;
    }

    const startTime = new Date(activeTimer.startTime);
    const now = new Date();
    return Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
  };

  return (
    <div className="space-y-4">
      {/* Timer Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Timer className="w-4 h-4" />
            Time Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Session */}
          {isTracking && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Currently tracking</p>
                  <p className="text-xs text-blue-600">
                    {formatDuration(getCurrentSessionTime())}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600">Live</span>
                </div>
              </div>
            </div>
          )}

          {/* Timer Controls */}
          <div className="flex items-center gap-2">
            {!isTracking ? (
              <Button
                onClick={handleStartTimer}
                size="sm"
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Timer
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePauseTimer}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
                <Button
                  onClick={handleStopTimer}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </Button>
              </div>
            )}
          </div>

          {/* Total Time */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Time:</span>
            <Badge variant="secondary" className="text-sm">
              {formatDuration(getTotalTime())}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Time Entries */}
      {timeEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timeEntries.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium">
                        {new Date(entry.startTime).toLocaleTimeString()}
                        {entry.endTime && ` - ${new Date(entry.endTime).toLocaleTimeString()}`}
                      </p>
                      {entry.description && (
                        <p className="text-xs text-gray-600">{entry.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {formatDuration(entry.duration || 0)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4" />
              Today's Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatDuration(stats.totalTimeToday)}
                </p>
                <p className="text-xs text-gray-600">Total Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {stats.tasksCompleted}
                </p>
                <p className="text-xs text-gray-600">Tasks</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Average Session</span>
                <span>{formatDuration(stats.averageSessionLength)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Most Productive Hour</span>
                <span>{stats.mostProductiveHour}:00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Time per Task</span>
                <span>{formatDuration(stats.timePerTask)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Daily Progress</span>
                <span>{formatDuration(stats.totalTimeToday)} / 8h</span>
              </div>
              <Progress 
                value={(stats.totalTimeToday / 480) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
