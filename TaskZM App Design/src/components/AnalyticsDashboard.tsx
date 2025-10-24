import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Target, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { timeTracking } from '../lib/timeTracking';
import { Task } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

interface ProductivityMetrics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageTaskTime: number;
  totalTimeSpent: number;
  productivityScore: number;
  streakDays: number;
  mostProductiveHour: number;
  taskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  weeklyProgress: {
    day: string;
    tasksCompleted: number;
    timeSpent: number;
  }[];
}

export default function AnalyticsDashboard({ isOpen, onClose, tasks }: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<ProductivityMetrics | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      calculateMetrics();
    }
  }, [isOpen, tasks]);

  const calculateMetrics = () => {
    const completedTasks = tasks.filter(task => task.status === 'done');
    const totalTasks = tasks.filter(task => !task.archived);
    const completionRate = totalTasks.length > 0 ? (completedTasks.length / totalTasks.length) * 100 : 0;
    
    // Get time tracking data
    const timeStats = timeTracking.calculateStats();
    const totalTimeSpent = timeStats.totalTimeToday;
    const averageTaskTime = completedTasks.length > 0 ? totalTimeSpent / completedTasks.length : 0;
    
    // Calculate productivity score (0-100)
    const productivityScore = Math.min(
      (completionRate * 0.4) + 
      (Math.min(totalTimeSpent / 480, 1) * 30) + 
      (Math.min(completedTasks.length / 10, 1) * 30),
      100
    );
    
    // Calculate streak (simplified)
    const streakDays = Math.floor(Math.random() * 7) + 1; // Mock data
    
    // Task distribution by priority
    const taskDistribution = {
      high: tasks.filter(task => task.priority === 'high' && !task.archived).length,
      medium: tasks.filter(task => task.priority === 'medium' && !task.archived).length,
      low: tasks.filter(task => task.priority === 'low' && !task.archived).length,
    };
    
    // Weekly progress (mock data)
    const weeklyProgress = [
      { day: 'Mon', tasksCompleted: 3, timeSpent: 240 },
      { day: 'Tue', tasksCompleted: 5, timeSpent: 360 },
      { day: 'Wed', tasksCompleted: 4, timeSpent: 300 },
      { day: 'Thu', tasksCompleted: 6, timeSpent: 420 },
      { day: 'Fri', tasksCompleted: 2, timeSpent: 180 },
      { day: 'Sat', tasksCompleted: 1, timeSpent: 120 },
      { day: 'Sun', tasksCompleted: 0, timeSpent: 0 },
    ];
    
    setMetrics({
      totalTasks: totalTasks.length,
      completedTasks: completedTasks.length,
      completionRate,
      averageTaskTime,
      totalTimeSpent,
      productivityScore,
      streakDays,
      mostProductiveHour: timeStats.mostProductiveHour,
      taskDistribution,
      weeklyProgress,
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  const getProductivityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Track your productivity and performance insights
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
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {metrics && (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Completion Rate</span>
                        </div>
                        <p className="text-2xl font-bold">{metrics.completionRate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-600">
                          {metrics.completedTasks} of {metrics.totalTasks} tasks
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Time Spent</span>
                        </div>
                        <p className="text-2xl font-bold">{formatDuration(metrics.totalTimeSpent)}</p>
                        <p className="text-xs text-gray-600">Today</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">Productivity Score</span>
                        </div>
                        <p className="text-2xl font-bold">{metrics.productivityScore.toFixed(0)}</p>
                        <Badge 
                          className={`${getProductivityLevel(metrics.productivityScore).bg} ${getProductivityLevel(metrics.productivityScore).color}`}
                        >
                          {getProductivityLevel(metrics.productivityScore).level}
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium">Streak</span>
                        </div>
                        <p className="text-2xl font-bold">{metrics.streakDays}</p>
                        <p className="text-xs text-gray-600">Days</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Progress Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Task Completion</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{metrics.completedTasks}/{metrics.totalTasks}</span>
                          </div>
                          <Progress value={metrics.completionRate} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Daily Time Goal</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{formatDuration(metrics.totalTimeSpent)}/8h</span>
                          </div>
                          <Progress value={(metrics.totalTimeSpent / 480) * 100} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Productivity Tab */}
            <TabsContent value="productivity" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Weekly Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {metrics?.weeklyProgress.map((day, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{day.day}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {day.tasksCompleted} tasks
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {formatDuration(day.timeSpent)}
                              </Badge>
                            </div>
                          </div>
                          <Progress 
                            value={(day.tasksCompleted / 6) * 100} 
                            className="h-1" 
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Productivity Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Best Performance</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        You're most productive at {metrics?.mostProductiveHour || 9}:00
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Average Task Time</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {formatDuration(metrics?.averageTaskTime || 0)} per task
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Efficiency</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {metrics?.productivityScore.toFixed(0) || 0}% productivity score
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">High Priority</span>
                    </div>
                    <p className="text-2xl font-bold">{metrics?.taskDistribution.high || 0}</p>
                    <p className="text-xs text-gray-600">Tasks</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">Medium Priority</span>
                    </div>
                    <p className="text-2xl font-bold">{metrics?.taskDistribution.medium || 0}</p>
                    <p className="text-xs text-gray-600">Tasks</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Low Priority</span>
                    </div>
                    <p className="text-2xl font-bold">{metrics?.taskDistribution.low || 0}</p>
                    <p className="text-xs text-gray-600">Tasks</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Task Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed</span>
                      <div className="flex items-center gap-2">
                        <Progress value={metrics?.completionRate || 0} className="w-32 h-2" />
                        <span className="text-sm font-medium">{metrics?.completionRate.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">In Progress</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={((tasks.filter(t => t.status === 'inprogress').length / (metrics?.totalTasks || 1)) * 100)} 
                          className="w-32 h-2" 
                        />
                        <span className="text-sm font-medium">
                          {((tasks.filter(t => t.status === 'inprogress').length / (metrics?.totalTasks || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Todo</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={((tasks.filter(t => t.status === 'todo').length / (metrics?.totalTasks || 1)) * 100)} 
                          className="w-32 h-2" 
                        />
                        <span className="text-sm font-medium">
                          {((tasks.filter(t => t.status === 'todo').length / (metrics?.totalTasks || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Focus Time</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Schedule high-priority tasks during your most productive hour ({metrics?.mostProductiveHour || 9}:00)
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Task Breakdown</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Break down large tasks into smaller, manageable subtasks
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Time Management</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Use time tracking to identify patterns and optimize your schedule
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Performance Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completion Rate</span>
                      <Badge variant="secondary">
                        {metrics?.completionRate.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Task Time</span>
                      <Badge variant="secondary">
                        {formatDuration(metrics?.averageTaskTime || 0)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Streak</span>
                      <Badge variant="secondary">
                        {metrics?.streakDays || 0} days
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Productivity Score</span>
                      <Badge 
                        className={`${getProductivityLevel(metrics?.productivityScore || 0).bg} ${getProductivityLevel(metrics?.productivityScore || 0).color}`}
                      >
                        {metrics?.productivityScore.toFixed(0) || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
