import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, Settings, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { calendarSyncService, CalendarProvider, SyncResult, SyncSettings } from '../lib/calendarSync';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface CalendarSyncPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarSyncPanel({ isOpen, onClose }: CalendarSyncPanelProps) {
  const [providers, setProviders] = useState<CalendarProvider[]>([]);
  const [syncSettings, setSyncSettings] = useState<SyncSettings | null>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('providers');
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadProviders();
      loadSyncSettings();
      loadSyncStatus();
    }
  }, [isOpen]);

  const loadProviders = () => {
    const allProviders = calendarSyncService.getProviders();
    setProviders(allProviders);
  };

  const loadSyncSettings = () => {
    const settings = calendarSyncService.getSyncSettings();
    setSyncSettings(settings);
  };

  const loadSyncStatus = () => {
    const status = calendarSyncService.getSyncStatus();
    setSyncStatus(status);
  };

  const handleConnectProvider = async (providerId: string) => {
    const success = await calendarSyncService.connectProvider(providerId);
    if (success) {
      toast.success(`Connected to ${providers.find(p => p.id === providerId)?.name}`);
      loadProviders();
      loadSyncStatus();
    } else {
      toast.error(`Failed to connect to ${providers.find(p => p.id === providerId)?.name}`);
    }
  };

  const handleDisconnectProvider = (providerId: string) => {
    const success = calendarSyncService.disconnectProvider(providerId);
    if (success) {
      toast.success(`Disconnected from ${providers.find(p => p.id === providerId)?.name}`);
      loadProviders();
      loadSyncStatus();
    }
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const result = await calendarSyncService.syncAllProviders();
      setLastSyncResult(result);
      loadProviders();
      loadSyncStatus();
      
      if (result.success) {
        toast.success(`Sync completed: ${result.eventsCreated} events created, ${result.tasksCreated} tasks created`);
      } else {
        toast.error(`Sync failed: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      toast.error(`Sync failed: ${error}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTestConnection = async (providerId: string) => {
    const success = await calendarSyncService.testConnection(providerId);
    if (success) {
      toast.success('Connection test successful');
    } else {
      toast.error('Connection test failed');
    }
    loadProviders();
  };

  const handleSettingsChange = (key: keyof SyncSettings, value: any) => {
    if (!syncSettings) return;
    
    const newSettings = { ...syncSettings, [key]: value };
    setSyncSettings(newSettings);
    calendarSyncService.updateSyncSettings(newSettings);
    loadSyncStatus();
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'google': return '🔵';
      case 'outlook': return '🔷';
      case 'apple': return '🍎';
      case 'caldav': return '📅';
      default: return '📅';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'syncing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatLastSync = (lastSyncAt?: string) => {
    if (!lastSyncAt) return 'Never';
    const date = new Date(lastSyncAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Calendar Sync
              </CardTitle>
              <CardDescription>
                Sync your tasks with external calendar applications
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="sync">Sync</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Providers Tab */}
            <TabsContent value="providers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <Card key={provider.id} className={`${provider.isConnected ? 'border-green-200 bg-green-50' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getProviderIcon(provider.type)}</div>
                          <div>
                            <CardTitle className="text-sm">{provider.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {provider.isConnected ? 'Connected' : 'Not connected'}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(provider.syncStatus)}
                          <Badge className={`text-xs ${getStatusColor(provider.syncStatus)}`}>
                            {provider.syncStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {provider.isConnected && (
                        <div className="text-xs text-gray-600 mb-3">
                          Last sync: {formatLastSync(provider.lastSyncAt)}
                        </div>
                      )}
                      
                      {provider.errorMessage && (
                        <div className="text-xs text-red-600 mb-3">
                          Error: {provider.errorMessage}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {provider.isConnected ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTestConnection(provider.id)}
                              disabled={provider.syncStatus === 'syncing'}
                            >
                              Test
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisconnectProvider(provider.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleConnectProvider(provider.id)}
                            disabled={provider.syncStatus === 'syncing'}
                            className="w-full"
                          >
                            {provider.syncStatus === 'syncing' ? (
                              <>
                                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              'Connect'
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sync Tab */}
            <TabsContent value="sync" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sync Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Auto Sync:</strong> {syncStatus?.isAutoSyncEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                    <div>
                      <strong>Connected Providers:</strong> {syncStatus?.connectedProviders}
                    </div>
                    <div>
                      <strong>Last Sync:</strong> {formatLastSync(syncStatus?.lastSyncAt)}
                    </div>
                    <div>
                      <strong>Next Sync:</strong> {formatLastSync(syncStatus?.nextSyncAt)}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleSyncAll}
                      disabled={isSyncing || syncStatus?.connectedProviders === 0}
                      className="flex items-center gap-2"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Sync All
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Last Sync Result */}
              {lastSyncResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Last Sync Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Events Created:</strong> {lastSyncResult.eventsCreated}
                      </div>
                      <div>
                        <strong>Events Updated:</strong> {lastSyncResult.eventsUpdated}
                      </div>
                      <div>
                        <strong>Tasks Created:</strong> {lastSyncResult.tasksCreated}
                      </div>
                      <div>
                        <strong>Tasks Updated:</strong> {lastSyncResult.tasksUpdated}
                      </div>
                    </div>
                    
                    {lastSyncResult.errors.length > 0 && (
                      <div className="mt-4">
                        <strong className="text-red-600">Errors:</strong>
                        <ul className="text-xs text-red-600 mt-1">
                          {lastSyncResult.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              {syncSettings && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Sync Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-sync">Auto Sync</Label>
                        <p className="text-xs text-gray-600">Automatically sync with connected calendars</p>
                      </div>
                      <Switch
                        id="auto-sync"
                        checked={syncSettings.autoSync}
                        onCheckedChange={(checked) => handleSettingsChange('autoSync', checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                      <Input
                        id="sync-interval"
                        type="number"
                        value={syncSettings.syncInterval}
                        onChange={(e) => handleSettingsChange('syncInterval', parseInt(e.target.value) || 30)}
                        min="5"
                        max="1440"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sync-direction">Sync Direction</Label>
                      <Select
                        value={syncSettings.syncDirection}
                        onValueChange={(value) => handleSettingsChange('syncDirection', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bidirectional">Bidirectional</SelectItem>
                          <SelectItem value="to_calendar">To Calendar Only</SelectItem>
                          <SelectItem value="from_calendar">From Calendar Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="include-completed">Include Completed Tasks</Label>
                        <p className="text-xs text-gray-600">Sync completed tasks to calendar</p>
                      </div>
                      <Switch
                        id="include-completed"
                        checked={syncSettings.includeCompleted}
                        onCheckedChange={(checked) => handleSettingsChange('includeCompleted', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="include-archived">Include Archived Tasks</Label>
                        <p className="text-xs text-gray-600">Sync archived tasks to calendar</p>
                      </div>
                      <Switch
                        id="include-archived"
                        checked={syncSettings.includeArchived}
                        onCheckedChange={(checked) => handleSettingsChange('includeArchived', checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="default-duration">Default Event Duration (minutes)</Label>
                      <Input
                        id="default-duration"
                        type="number"
                        value={syncSettings.defaultEventDuration}
                        onChange={(e) => handleSettingsChange('defaultEventDuration', parseInt(e.target.value) || 60)}
                        min="15"
                        max="480"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
