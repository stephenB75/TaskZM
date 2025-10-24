import React, { useState, useEffect } from 'react';
import { Building2, Plus, Settings, Users, Calendar, BarChart3, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { workspaceService, Workspace, WorkspaceMember, WorkspaceInvite } from '../lib/workspaces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface WorkspacesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkspaceChange?: (workspace: Workspace) => void;
}

export default function WorkspacesPanel({ isOpen, onClose, onWorkspaceChange }: WorkspacesPanelProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [activeTab, setActiveTab] = useState('workspaces');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: 'briefcase'
  });

  useEffect(() => {
    if (isOpen) {
      loadWorkspaces();
      loadCurrentWorkspace();
    }
  }, [isOpen]);

  const loadWorkspaces = () => {
    const allWorkspaces = workspaceService.getWorkspaces();
    setWorkspaces(allWorkspaces);
  };

  const loadCurrentWorkspace = () => {
    const current = workspaceService.getCurrentWorkspace();
    setCurrentWorkspace(current);
    if (current) {
      loadWorkspaceData(current.id);
    }
  };

  const loadWorkspaceData = (workspaceId: string) => {
    const workspaceMembers = workspaceService.getWorkspaceMembers(workspaceId);
    const workspaceInvites = workspaceService.getWorkspaceInvites(workspaceId);
    setMembers(workspaceMembers);
    setInvites(workspaceInvites);
  };

  const handleCreateWorkspace = () => {
    if (!formData.name.trim()) {
      toast.error('Workspace name is required');
      return;
    }

    const newWorkspace = workspaceService.createWorkspace({
      name: formData.name,
      description: formData.description,
      color: formData.color,
      icon: formData.icon,
      isDefault: false,
      createdBy: 'current-user',
      settings: {
        allowGuestAccess: false,
        requireApprovalForNewMembers: false,
        defaultTaskPriority: 'medium',
        defaultTaskStatus: 'todo',
        notificationSettings: {
          taskAssigned: true,
          taskCompleted: true,
          taskOverdue: true,
          newMember: true,
        },
        timeTrackingEnabled: true,
        collaborationEnabled: true,
      }
    });

    setWorkspaces(prev => [...prev, newWorkspace]);
    setFormData({ name: '', description: '', color: '#3b82f6', icon: 'briefcase' });
    setShowCreateForm(false);
    toast.success(`Workspace "${newWorkspace.name}" created successfully`);
  };

  const handleSwitchWorkspace = (workspace: Workspace) => {
    workspaceService.setCurrentWorkspace(workspace.id);
    setCurrentWorkspace(workspace);
    loadWorkspaceData(workspace.id);
    onWorkspaceChange?.(workspace);
    toast.success(`Switched to "${workspace.name}"`);
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    if (workspace.isDefault) {
      toast.error('Cannot delete default workspace');
      return;
    }

    if (confirm(`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`)) {
      const success = workspaceService.deleteWorkspace(workspace.id);
      if (success) {
        setWorkspaces(prev => prev.filter(w => w.id !== workspace.id));
        if (currentWorkspace?.id === workspace.id) {
          const defaultWorkspace = workspaces.find(w => w.isDefault);
          if (defaultWorkspace) {
            handleSwitchWorkspace(defaultWorkspace);
          }
        }
        toast.success(`Workspace "${workspace.name}" deleted`);
      } else {
        toast.error('Failed to delete workspace');
      }
    }
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setFormData({
      name: workspace.name,
      description: workspace.description,
      color: workspace.color,
      icon: workspace.icon
    });
    setShowCreateForm(true);
  };

  const handleUpdateWorkspace = () => {
    if (!editingWorkspace || !formData.name.trim()) {
      toast.error('Workspace name is required');
      return;
    }

    const updated = workspaceService.updateWorkspace(editingWorkspace.id, {
      name: formData.name,
      description: formData.description,
      color: formData.color,
      icon: formData.icon
    });

    if (updated) {
      setWorkspaces(prev => prev.map(w => w.id === updated.id ? updated : w));
      if (currentWorkspace?.id === updated.id) {
        setCurrentWorkspace(updated);
      }
      setFormData({ name: '', description: '', color: '#3b82f6', icon: 'briefcase' });
      setShowCreateForm(false);
      setEditingWorkspace(null);
      toast.success(`Workspace "${updated.name}" updated successfully`);
    } else {
      toast.error('Failed to update workspace');
    }
  };

  const getWorkspaceIcon = (icon: string) => {
    // This would be replaced with actual icon components
    return <Building2 className="w-4 h-4" />;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'member': return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Workspaces
              </CardTitle>
              <CardDescription>
                Manage your workspaces and team collaboration
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
              <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Workspaces Tab */}
            <TabsContent value="workspaces" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Your Workspaces</h3>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Create Workspace
                </Button>
              </div>

              {/* Create/Edit Form */}
              {showCreateForm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {editingWorkspace ? 'Edit Workspace' : 'Create New Workspace'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="workspace-name">Name</Label>
                      <Input
                        id="workspace-name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter workspace name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="workspace-description">Description</Label>
                      <Textarea
                        id="workspace-description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter workspace description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="workspace-color">Color</Label>
                        <Input
                          id="workspace-color"
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="workspace-icon">Icon</Label>
                        <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="briefcase">Briefcase</SelectItem>
                            <SelectItem value="building">Building</SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="folder">Folder</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => {
                        setShowCreateForm(false);
                        setEditingWorkspace(null);
                        setFormData({ name: '', description: '', color: '#3b82f6', icon: 'briefcase' });
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={editingWorkspace ? handleUpdateWorkspace : handleCreateWorkspace}>
                        {editingWorkspace ? 'Update' : 'Create'} Workspace
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Workspaces List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workspaces.map((workspace) => (
                  <Card key={workspace.id} className={`cursor-pointer transition-colors ${
                    currentWorkspace?.id === workspace.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: workspace.color }}
                          >
                            {getWorkspaceIcon(workspace.icon)}
                          </div>
                          <div>
                            <CardTitle className="text-sm">{workspace.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {workspace.memberCount} members • {workspace.taskCount} tasks
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {workspace.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                          {currentWorkspace?.id === workspace.id && (
                            <Badge variant="default" className="text-xs">Current</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600 mb-3">
                        {workspace.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSwitchWorkspace(workspace)}
                          disabled={currentWorkspace?.id === workspace.id}
                        >
                          {currentWorkspace?.id === workspace.id ? 'Current' : 'Switch'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditWorkspace(workspace)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        {!workspace.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteWorkspace(workspace)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Workspace Members</h3>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-1" />
                  Invite Member
                </Button>
              </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{member.name}</h4>
                            <p className="text-xs text-gray-600">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getRoleColor(member.role)}`}>
                            {member.role}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Workspace Settings</h3>
                <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4 mr-1" />
                  Edit Settings
                </Button>
              </div>

              {currentWorkspace && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Current Workspace: {currentWorkspace.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Members:</strong> {currentWorkspace.memberCount}
                      </div>
                      <div>
                        <strong>Tasks:</strong> {currentWorkspace.taskCount}
                      </div>
                      <div>
                        <strong>Created:</strong> {new Date(currentWorkspace.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Last Updated:</strong> {new Date(currentWorkspace.updatedAt).toLocaleDateString()}
                      </div>
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
