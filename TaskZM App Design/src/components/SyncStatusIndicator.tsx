import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cloudSync, SyncStatus } from '../lib/cloudSync';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SyncStatusIndicatorProps {
  className?: string;
}

export default function SyncStatusIndicator({ className = '' }: SyncStatusIndicatorProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(cloudSync.getStatus());
  const [isManualSync, setIsManualSync] = useState(false);

  useEffect(() => {
    const unsubscribe = cloudSync.subscribe(setSyncStatus);
    return unsubscribe;
  }, []);

  const handleManualSync = async () => {
    setIsManualSync(true);
    try {
      await cloudSync.sync();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsManualSync(false);
    }
  };

  const getStatusIcon = () => {
    if (syncStatus.syncInProgress) {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }
    
    if (!syncStatus.isOnline) {
      return <WifiOff className="w-4 h-4" />;
    }
    
    if (syncStatus.pendingChanges > 0) {
      return <AlertCircle className="w-4 h-4" />;
    }
    
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (syncStatus.syncInProgress) {
      return 'Syncing...';
    }
    
    if (!syncStatus.isOnline) {
      return 'Offline';
    }
    
    if (syncStatus.pendingChanges > 0) {
      return `${syncStatus.pendingChanges} pending`;
    }
    
    return 'Synced';
  };

  const getStatusColor = () => {
    if (syncStatus.syncInProgress) {
      return 'text-blue-600';
    }
    
    if (!syncStatus.isOnline) {
      return 'text-gray-500';
    }
    
    if (syncStatus.pendingChanges > 0) {
      return 'text-orange-600';
    }
    
    return 'text-green-600';
  };

  const getLastSyncText = () => {
    if (!syncStatus.lastSync) {
      return 'Never synced';
    }
    
    const lastSync = new Date(syncStatus.lastSync);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    }
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    }
    
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            
            {syncStatus.pendingChanges > 0 && (
              <Badge variant="secondary" className="text-xs">
                {syncStatus.pendingChanges}
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualSync}
              disabled={syncStatus.syncInProgress || !syncStatus.isOnline}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`w-3 h-3 ${isManualSync ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </TooltipTrigger>
        
        <TooltipContent>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {syncStatus.isOnline ? (
                <Wifi className="w-3 h-3 text-green-600" />
              ) : (
                <WifiOff className="w-3 h-3 text-gray-500" />
              )}
              <span className="text-xs">
                {syncStatus.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Cloud className="w-3 h-3 text-blue-600" />
              <span className="text-xs">
                Last sync: {getLastSyncText()}
              </span>
            </div>
            
            {syncStatus.pendingChanges > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-orange-600" />
                <span className="text-xs">
                  {syncStatus.pendingChanges} changes pending
                </span>
              </div>
            )}
            
            {syncStatus.syncInProgress && (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                <span className="text-xs">Sync in progress...</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
