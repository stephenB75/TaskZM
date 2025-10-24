import React, { useState, useEffect } from 'react';
import { Users, Wifi, WifiOff, Clock } from 'lucide-react';
import { useCollaboration } from '../contexts/CollaborationContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TeamPresenceIndicatorProps {
  className?: string;
}

export default function TeamPresenceIndicator({ className = '' }: TeamPresenceIndicatorProps) {
  const { 
    users, 
    activeUsers, 
    currentUser, 
    isOnline, 
    realTimeEnabled,
    getActiveUsers 
  } = useCollaboration();

  const [isOpen, setIsOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(activeUsers);

  // Update online users when activeUsers changes
  useEffect(() => {
    setOnlineUsers(getActiveUsers());
  }, [activeUsers, getActiveUsers]);

  // Format last seen time
  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get status color
  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  // Get status text
  const getStatusText = (isOnline: boolean, lastSeen?: string) => {
    if (isOnline) return 'Online';
    if (lastSeen) return `Last seen ${formatLastSeen(lastSeen)}`;
    return 'Offline';
  };

  if (!realTimeEnabled) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
        >
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {onlineUsers.length} online
          </span>
          <Badge 
            variant="secondary" 
            className="ml-1 text-xs"
          >
            {users.length}
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">Team Presence</span>
            </div>
            <div className="flex items-center gap-1">
              {isOnline ? (
                <Wifi className="w-3 h-3 text-green-600" />
              ) : (
                <WifiOff className="w-3 h-3 text-gray-400" />
              )}
              <span className="text-xs text-gray-600">
                {isOnline ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Online Users */}
          {onlineUsers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Online ({onlineUsers.length})</span>
              </div>
              <div className="space-y-2">
                {onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.isOnline)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Clock className="w-3 h-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {getStatusText(user.isOnline, user.lastSeen)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offline Users */}
          {users.filter(user => !user.isOnline && user.id !== currentUser?.id).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium">
                  Offline ({users.filter(user => !user.isOnline && user.id !== currentUser?.id).length})
                </span>
              </div>
              <div className="space-y-2">
                {users
                  .filter(user => !user.isOnline && user.id !== currentUser?.id)
                  .slice(0, 3) // Show only first 3 offline users
                  .map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.isOnline)} rounded-full border-2 border-white`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-600">
                          {getStatusText(user.isOnline, user.lastSeen)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              {users.filter(user => !user.isOnline && user.id !== currentUser?.id).length > 3 && (
                <p className="text-xs text-gray-500 mt-2">
                  +{users.filter(user => !user.isOnline && user.id !== currentUser?.id).length - 3} more offline
                </p>
              )}
            </div>
          )}

          {/* No team members */}
          {users.length === 0 && (
            <div className="text-center py-4">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">No team members yet</p>
              <p className="text-xs text-gray-400">Invite team members to see their presence</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
