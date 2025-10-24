import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Users, Clock, CheckCircle } from 'lucide-react';
import { useCollaboration } from '../contexts/CollaborationContext';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TaskCollaborationProps {
  taskId: string;
  taskTitle: string;
}

interface UserActivity {
  userId: string;
  userName: string;
  userAvatar: string;
  activity: 'viewing' | 'editing' | 'commenting';
  timestamp: string;
}

export default function RealTimeTaskCollaboration({ taskId, taskTitle }: TaskCollaborationProps) {
  const { currentUser, realTimeEnabled } = useCollaboration();
  const [viewers, setViewers] = useState<UserActivity[]>([]);
  const [editors, setEditors] = useState<UserActivity[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Simulate real-time updates (in a real app, this would come from WebSocket/Server-Sent Events)
  useEffect(() => {
    if (!realTimeEnabled || !currentUser) return;

    // Simulate other users viewing/editing the task
    const simulateActivity = () => {
      const mockUsers = [
        {
          userId: 'user-1',
          userName: 'Sarah Johnson',
          userAvatar: '/avatars/sarah.jpg',
          activity: 'viewing' as const,
          timestamp: new Date().toISOString(),
        },
        {
          userId: 'user-2',
          userName: 'Mike Chen',
          userAvatar: '/avatars/mike.jpg',
          activity: 'editing' as const,
          timestamp: new Date().toISOString(),
        },
      ];

      setViewers(mockUsers.filter(user => user.activity === 'viewing'));
      setEditors(mockUsers.filter(user => user.activity === 'editing'));
    };

    const interval = setInterval(simulateActivity, 5000);
    simulateActivity(); // Initial call

    return () => clearInterval(interval);
  }, [realTimeEnabled, currentUser]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  if (!realTimeEnabled || (!viewers.length && !editors.length)) {
    return null;
  }

  return (
    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-blue-800">Live Collaboration</span>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {isVisible && (
        <div className="space-y-2">
          {/* Editors */}
          {editors.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-800">
                  Editing ({editors.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {editors.map((editor) => (
                  <TooltipProvider key={editor.userId}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={editor.userAvatar} />
                            <AvatarFallback className="text-xs">
                              {editor.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-green-800">{editor.userName}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {editor.userName} is editing this task
                          <br />
                          <span className="text-gray-500">{formatTimestamp(editor.timestamp)}</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}

          {/* Viewers */}
          {viewers.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Eye className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">
                  Viewing ({viewers.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {viewers.map((viewer) => (
                  <TooltipProvider key={viewer.userId}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={viewer.userAvatar} />
                            <AvatarFallback className="text-xs">
                              {viewer.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-blue-800">{viewer.userName}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {viewer.userName} is viewing this task
                          <br />
                          <span className="text-gray-500">{formatTimestamp(viewer.timestamp)}</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}

          {/* Activity indicator */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>Live updates enabled</span>
          </div>
        </div>
      )}
    </div>
  );
}
