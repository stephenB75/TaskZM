import React, { useState, useEffect } from 'react';
import { Clock, BarChart3, TrendingUp, Calendar, Target, Zap } from 'lucide-react';
import { timeTracking, TimeTrackingStats } from '../lib/timeTracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

interface TimeTrackingDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TimeTrackingDashboard({ isOpen, onClose }: TimeTrackingDashboardProps) {
  const [stats, setStats] = useState<TimeTrackingStats | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = () => {
    const timeStats = timeTracking.calculateStats();
    setStats(timeStats);
  };

  const formatDuration = (minutes: number) => {
    return timeTracking.formatDuration(minutes);
  };

  const getProductivityLevel = (totalTime: number) => {
    if (totalTime >= 480) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (totalTime >= 360) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (totalTime >= 240) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getWeeklyProgress = () => {
    const weekEntries = timeTracking.getThisWeekTimeEntries();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    
    return days.map((day, index) => {
      const dayEntries = weekEntries.filter(entry => {
        const entryDay = new Date(entry.startTime).getDay();
        return entryDay === (index === 0 ? 1 : index === 6 ? 0 : index + 1);
      });
      
      const totalTime = dayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
      const isToday = index === (today === 0 ? 6 : today - 1);
      
      return {
        day,
        totalTime,
        isToday,
        percentage: Math.min((totalTime / 480) * 100, 100),
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Time Tracking Dashboard
              </CardTitle>
              <CardDescription>
                Track your productivity and time management
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {stats && (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Today</span>
                        </div>
                        <p className="text-2xl font-bold">{formatDuration(stats.totalTimeToday)}</p>
                        <p className="text-xs text-gray-600">Total time tracked</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Tasks</span>
                        </div>
                        <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
                        <p className="text-xs text-gray-600">Completed today</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">Average</span>
                        </div>
                        <p className="text-2xl font-bold">{formatDuration(stats.averageSessionLength)}</p>
                        <p className="text-xs text-gray-600">Session length</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium">Peak Hour</span>
                        </div>
                        <p className="text-2xl font-bold">{stats.mostProductiveHour}:00</p>
                        <p className="text-xs text-gray-600">Most productive</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Productivity Level */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Productivity Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Today's Performance</p>
                          <p className="text-xs text-gray-600">
                            {formatDuration(stats.totalTimeToday)} of 8 hours target
                          </p>
                        </div>
                        <Badge 
                          className={`${getProductivityLevel(stats.totalTimeToday).bg} ${getProductivityLevel(stats.totalTimeToday).color}`}
                        >
                          {getProductivityLevel(stats.totalTimeToday).level}
                        </Badge>
                      </div>
                      <Progress 
                        value={(stats.totalTimeToday / 480) * 100} 
                        className="mt-2 h-2"
                      />
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Daily Tab */}
            <TabsContent value="daily" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Daily Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Time Today</span>
                      <Badge variant="secondary">
                        {stats ? formatDuration(stats.totalTimeToday) : '0m'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tasks Completed</span>
                      <Badge variant="secondary">
                        {stats?.tasksCompleted || 0}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Average per Task</span>
                      <Badge variant="secondary">
                        {stats ? formatDuration(stats.timePerTask) : '0m'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Weekly Tab */}
            <TabsContent value="weekly" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getWeeklyProgress().map((day, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${day.isToday ? 'text-blue-600' : ''}`}>
                            {day.day}
                          </span>
                          <Badge variant={day.isToday ? 'default' : 'secondary'}>
                            {formatDuration(day.totalTime)}
                          </Badge>
                        </div>
                        <Progress value={day.percentage} className="h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Productivity Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Best Performance</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        You're most productive at {stats?.mostProductiveHour || 9}:00
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Session Quality</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Average session: {stats ? formatDuration(stats.averageSessionLength) : '0m'}
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Task Efficiency</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {stats?.timePerTask ? formatDuration(stats.timePerTask) : '0m'} per task
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium">Weekly Total</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {stats ? formatDuration(stats.totalTimeThisWeek) : '0m'} this week
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
