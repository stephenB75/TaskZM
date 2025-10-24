import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, Settings, Database, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { cloudSync, SyncStatus } from '../lib/cloudSync';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface CloudSyncSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CloudSyncSettings({ isOpen, onClose }: CloudSyncSettingsProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(cloudSync.getStatus());
  const [autoSync, setAutoSync] = useState(true);
  const [syncOnStartup, setSyncOnStartup] = useState(true);
  const [syncInterval, setSyncInterval] = useState(5); // minutes
  const [isManualSync, setIsManualSync] = useState(false);

  useEffect(() => {
    const unsubscribe = cloudSync.subscribe(setSyncStatus);
    return unsubscribe;
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const savedAutoSync = localStorage.getItem('autoSync');
    const savedSyncOnStartup = localStorage.getItem('syncOnStartup');
    const savedSyncInterval = localStorage.getItem('syncInterval');
    
    if (savedAutoSync !== null) {
      setAutoSync(JSON.parse(savedAutoSync));
    }
    if (savedSyncOnStartup !== null) {
      setSyncOnStartup(JSON.parse(savedSyncOnStartup));
    }
    if (savedSyncInterval !== null) {
      setSyncInterval(JSON.parse(savedSyncInterval));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const handleAutoSyncToggle = (enabled: boolean) => {
    setAutoSync(enabled);
    saveSettings('autoSync', enabled);
    toast.success(enabled ? 'Auto-sync enabled' : 'Auto-sync disabled');
  };

  const handleSyncOnStartupToggle = (enabled: boolean) => {
    setSyncOnStartup(enabled);
    saveSettings('syncOnStartup', enabled);
    toast.success(enabled ? 'Startup sync enabled' : 'Startup sync disabled');
  };

  const handleSyncIntervalChange = (interval: number) => {
    setSyncInterval(interval);
    saveSettings('syncInterval', interval);
    toast.success(`Sync interval set to ${interval} minutes`);
  };

  const handleManualSync = async () => {
    setIsManualSync(true);
    try {
      await cloudSync.sync();
      toast.success('Manual sync completed');
    } catch (error) {
      toast.error('Manual sync failed');
    } finally {
      setIsManualSync(false);
    }
  };

  const formatLastSync = () => {
    if (!syncStatus.lastSync) {
      return 'Never';
    }
    
    const lastSync = new Date(syncStatus.lastSync);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    }
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    
    if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    }
    
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Cloud Sync Settings
              </CardTitle>
              <CardDescription>
                Configure cloud synchronization and data persistence
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sync Status */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Sync Status</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {syncStatus.isOnline ? (
                    <Wifi className="w-4 h-4 text-green-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm font-medium">
                    {syncStatus.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {syncStatus.isOnline ? 'Connected to cloud' : 'No internet connection'}
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {syncStatus.syncInProgress ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  ) : syncStatus.pendingChanges > 0 ? (
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span className="text-sm font-medium">
                    {syncStatus.syncInProgress ? 'Syncing...' : 
                     syncStatus.pendingChanges > 0 ? 'Pending' : 'Synced'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {syncStatus.pendingChanges > 0 ? 
                    `${syncStatus.pendingChanges} changes pending` : 
                    'All changes synced'}
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Last Sync</span>
                </div>
                <p className="text-xs text-gray-600">
                  {formatLastSync()}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sync Settings */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Sync Settings</Label>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-sync</Label>
                  <p className="text-xs text-gray-600">
                    Automatically sync changes when online
                  </p>
                </div>
                <Switch
                  checked={autoSync}
                  onCheckedChange={handleAutoSyncToggle}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Sync on startup</Label>
                  <p className="text-xs text-gray-600">
                    Sync data when app starts
                  </p>
                </div>
                <Switch
                  checked={syncOnStartup}
                  onCheckedChange={handleSyncOnStartupToggle}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Sync interval</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncIntervalChange(1)}
                    className={syncInterval === 1 ? 'bg-blue-100' : ''}
                  >
                    1m
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncIntervalChange(5)}
                    className={syncInterval === 5 ? 'bg-blue-100' : ''}
                  >
                    5m
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncIntervalChange(15)}
                    className={syncInterval === 15 ? 'bg-blue-100' : ''}
                  >
                    15m
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncIntervalChange(30)}
                    className={syncInterval === 30 ? 'bg-blue-100' : ''}
                  >
                    30m
                  </Button>
                </div>
                <p className="text-xs text-gray-600">
                  How often to check for changes to sync
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Manual Actions */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Manual Actions</Label>
            
            <div className="flex gap-2">
              <Button
                onClick={handleManualSync}
                disabled={syncStatus.syncInProgress || !syncStatus.isOnline}
                className="flex-1"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isManualSync ? 'animate-spin' : ''}`} />
                {isManualSync ? 'Syncing...' : 'Sync Now'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  // Clear local cache
                  localStorage.removeItem('tasks');
                  localStorage.removeItem('tags');
                  toast.success('Local cache cleared');
                }}
              >
                Clear Cache
              </Button>
            </div>
          </div>

          <Separator />

          {/* Cloud Features */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Cloud Features</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Data Backup</span>
                </div>
                <p className="text-xs text-gray-600">
                  Automatic backup of all tasks and settings
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Real-time Sync</span>
                </div>
                <p className="text-xs text-gray-600">
                  Changes sync across all devices instantly
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Settings Sync</span>
                </div>
                <p className="text-xs text-gray-600">
                  Preferences and customizations sync automatically
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Offline Support</span>
                </div>
                <p className="text-xs text-gray-600">
                  Work offline, sync when connection returns
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
