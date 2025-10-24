import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Activity, Zap, Clock, Database, TrendingUp, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  itemCount: number;
  visibleItems: number;
  isOptimized: boolean;
  fps: number;
  networkLatency: number;
  cacheHitRate: number;
}

interface PerformanceMonitorProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: PerformanceMetrics;
  onOptimize: () => void;
  onReset: () => void;
}

export default function PerformanceMonitor({
  isOpen,
  onClose,
  metrics,
  onOptimize,
  onReset
}: PerformanceMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [historicalData, setHistoricalData] = useState<PerformanceMetrics[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Monitor performance metrics
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Calculate FPS
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      const fps = Math.round(1000 / deltaTime);
      
      // Update historical data
      setHistoricalData(prev => {
        const newData = [...prev, { ...metrics, fps }];
        return newData.slice(-50); // Keep last 50 measurements
      });

      // Check for performance issues
      checkPerformanceIssues(metrics, fps);

      lastTimeRef.current = now;
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, metrics]);

  // Check for performance issues
  const checkPerformanceIssues = (currentMetrics: PerformanceMetrics, fps: number) => {
    const newAlerts: string[] = [];

    if (currentMetrics.renderTime > 16) {
      newAlerts.push(`Render time too high: ${currentMetrics.renderTime.toFixed(2)}ms`);
    }

    if (fps < 30) {
      newAlerts.push(`Low FPS: ${fps}`);
    }

    if (currentMetrics.memoryUsage > 100 * 1024 * 1024) { // 100MB
      newAlerts.push(`High memory usage: ${(currentMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }

    if (currentMetrics.cacheHitRate < 0.8) {
      newAlerts.push(`Low cache hit rate: ${(currentMetrics.cacheHitRate * 100).toFixed(1)}%`);
    }

    setAlerts(newAlerts);
  };

  // Calculate performance score
  const getPerformanceScore = (): number => {
    let score = 100;

    // Deduct points for performance issues
    if (metrics.renderTime > 16) score -= 20;
    if (metrics.fps < 30) score -= 30;
    if (metrics.memoryUsage > 100 * 1024 * 1024) score -= 25;
    if (metrics.cacheHitRate < 0.8) score -= 15;

    return Math.max(0, score);
  };

  // Get performance status
  const getPerformanceStatus = (): 'excellent' | 'good' | 'fair' | 'poor' => {
    const score = getPerformanceScore();
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format memory usage
  const formatMemory = (bytes: number): string => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  // Format time
  const formatTime = (ms: number): string => {
    return `${ms.toFixed(2)} ms`;
  };

  if (!isOpen) return null;

  const performanceStatus = getPerformanceStatus();
  const performanceScore = getPerformanceScore();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Performance Monitor
              </CardTitle>
              <CardDescription>
                Monitor and optimize application performance
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isMonitoring ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? 'Stop' : 'Start'} Monitoring
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Performance Score */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Performance Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-center mb-2">
                      {performanceScore}
                    </div>
                    <div className="text-center mb-4">
                      <Badge className={getStatusColor(performanceStatus)}>
                        {performanceStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress value={performanceScore} className="w-full" />
                  </CardContent>
                </Card>

                {/* Current Metrics */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Current Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Render Time:</span>
                      <span className="font-mono">{formatTime(metrics.renderTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FPS:</span>
                      <span className="font-mono">{metrics.fps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory:</span>
                      <span className="font-mono">{formatMemory(metrics.memoryUsage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span className="font-mono">{metrics.visibleItems}/{metrics.itemCount}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button onClick={onOptimize} size="sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Optimize
                    </Button>
                    <Button onClick={onReset} variant="outline" size="sm">
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rendering Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Rendering Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Render Time</span>
                        <span className="text-sm font-mono">{formatTime(metrics.renderTime)}</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (metrics.renderTime / 16) * 100)} 
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">FPS</span>
                        <span className="text-sm font-mono">{metrics.fps}</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (metrics.fps / 60) * 100)} 
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Memory Usage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Memory Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Heap Size</span>
                        <span className="text-sm font-mono">{formatMemory(metrics.memoryUsage)}</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (metrics.memoryUsage / (100 * 1024 * 1024)) * 100)} 
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Cache Hit Rate</span>
                        <span className="text-sm font-mono">{(metrics.cacheHitRate * 100).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={metrics.cacheHitRate * 100} 
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance History</CardTitle>
                </CardHeader>
                <CardContent>
                  {historicalData.length > 0 ? (
                    <div className="space-y-2">
                      {historicalData.slice(-10).reverse().map((data, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">
                            {new Date().toLocaleTimeString()}
                          </span>
                          <div className="flex gap-4 text-sm">
                            <span>Render: {formatTime(data.renderTime)}</span>
                            <span>FPS: {data.fps}</span>
                            <span>Memory: {formatMemory(data.memoryUsage)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No historical data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Performance Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {alerts.length > 0 ? (
                    <div className="space-y-2">
                      {alerts.map((alert, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-800">{alert}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No performance alerts
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
