import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserMinus, Wifi, WifiOff, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useCollaboration } from '../contexts/CollaborationContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollaborationPanel({ isOpen, onClose }: CollaborationPanelProps) {
  const {
    users,
    activeUsers,
    currentUser,
    isOnline,
    realTimeEnabled,
    updateUserStatus,
    enableRealTime,
    disableRealTime,
    getActiveUsers,
    shareWorkspace,
    revokeAccess,
    getWorkspaceMembers,
  } = useCollaboration();

  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  // Get workspace members
  const workspaceMembers = getWorkspaceMembers();
  const onlineUsers = getActiveUsers();

  // Handle real-time toggle
  const handleRealTimeToggle = (enabled: boolean) => {
    if (enabled) {
      enableRealTime();
      toast.success('Real-time collaboration enabled');
    } else {
      disableRealTime();
      toast.success('Real-time collaboration disabled');
    }
  };

  // Handle user invitation
  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsInviting(true);
    try {
      // In a real implementation, you would send an invitation email
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  // Handle revoke access
  const handleRevokeAccess = async (userId: string, userName: string) => {
    try {
      await revokeAccess(userId);
      toast.success(`Access revoked for ${userName}`);
    } catch (error) {
      toast.error('Failed to revoke access');
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Collaboration
              </CardTitle>
              <CardDescription>
                Manage team members and real-time collaboration features
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current User Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Your Status</Label>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Wifi className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>

            {/* Real-time Collaboration Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Real-time Collaboration</Label>
                <p className="text-xs text-gray-600">
                  Enable live updates and team presence
                </p>
              </div>
              <Switch
                checked={realTimeEnabled}
                onCheckedChange={handleRealTimeToggle}
              />
            </div>
          </div>

          <Separator />

          {/* Team Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Team Members ({workspaceMembers.length})</Label>
              <Badge variant="outline" className="text-green-600">
                {onlineUsers.length} online
              </Badge>
            </div>

            {/* Invite New Member */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleInviteUser}
                disabled={isInviting || !inviteEmail.trim()}
                size="sm"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                {isInviting ? 'Inviting...' : 'Invite'}
              </Button>
            </div>

            {/* Members List */}
            <div className="space-y-2">
              {workspaceMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No team members yet</p>
                  <p className="text-xs">Invite team members to start collaborating</p>
                </div>
              ) : (
                workspaceMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {member.isOnline ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Online
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {member.lastSeen ? formatLastSeen(member.lastSeen) : 'Offline'}
                        </Badge>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeAccess(member.id, member.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserMinus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* Collaboration Features */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Collaboration Features</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Real-time Updates</span>
                </div>
                <p className="text-xs text-gray-600">
                  See task changes as they happen
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Team Presence</span>
                </div>
                <p className="text-xs text-gray-600">
                  See who's online and working
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Conflict Resolution</span>
                </div>
                <p className="text-xs text-gray-600">
                  Handle simultaneous edits gracefully
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Shared Workspace</span>
                </div>
                <p className="text-xs text-gray-600">
                  Collaborate on the same tasks
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
