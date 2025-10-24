import { Task } from '../App';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  memberCount: number;
  taskCount: number;
  settings: WorkspaceSettings;
}

export interface WorkspaceSettings {
  allowGuestAccess: boolean;
  requireApprovalForNewMembers: boolean;
  defaultTaskPriority: 'low' | 'medium' | 'high';
  defaultTaskStatus: 'todo' | 'inprogress' | 'done';
  notificationSettings: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    taskOverdue: boolean;
    newMember: boolean;
  };
  timeTrackingEnabled: boolean;
  collaborationEnabled: boolean;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  email: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  lastActiveAt: string;
  permissions: WorkspacePermissions;
}

export interface WorkspacePermissions {
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canManageMembers: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
}

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
}

class WorkspaceService {
  private workspaces: Workspace[] = [];
  private members: WorkspaceMember[] = [];
  private invites: WorkspaceInvite[] = [];
  private currentWorkspaceId: string | null = null;

  constructor() {
    this.initializeDefaultWorkspace();
    this.loadWorkspaces();
    this.loadCurrentWorkspace();
  }

  // Initialize default workspace
  private initializeDefaultWorkspace(): void {
    const defaultWorkspace: Workspace = {
      id: 'default-workspace',
      name: 'My Workspace',
      description: 'Your personal workspace',
      color: '#3b82f6',
      icon: 'briefcase',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      memberCount: 1,
      taskCount: 0,
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
    };

    this.workspaces.push(defaultWorkspace);
  }

  // Load workspaces from localStorage
  private loadWorkspaces(): void {
    try {
      const stored = localStorage.getItem('workspaces');
      if (stored) {
        const storedWorkspaces = JSON.parse(stored);
        this.workspaces = [...this.workspaces, ...storedWorkspaces];
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  }

  // Load current workspace from localStorage
  private loadCurrentWorkspace(): void {
    try {
      const stored = localStorage.getItem('currentWorkspaceId');
      if (stored) {
        this.currentWorkspaceId = stored;
      } else if (this.workspaces.length > 0) {
        this.currentWorkspaceId = this.workspaces[0].id;
      }
    } catch (error) {
      console.error('Failed to load current workspace:', error);
    }
  }

  // Save workspaces to localStorage
  private saveWorkspaces(): void {
    try {
      const customWorkspaces = this.workspaces.filter(w => !w.isDefault);
      localStorage.setItem('workspaces', JSON.stringify(customWorkspaces));
    } catch (error) {
      console.error('Failed to save workspaces:', error);
    }
  }

  // Save current workspace to localStorage
  private saveCurrentWorkspace(): void {
    try {
      if (this.currentWorkspaceId) {
        localStorage.setItem('currentWorkspaceId', this.currentWorkspaceId);
      }
    } catch (error) {
      console.error('Failed to save current workspace:', error);
    }
  }

  // Get all workspaces
  getWorkspaces(): Workspace[] {
    return this.workspaces;
  }

  // Get current workspace
  getCurrentWorkspace(): Workspace | null {
    if (!this.currentWorkspaceId) return null;
    return this.workspaces.find(w => w.id === this.currentWorkspaceId) || null;
  }

  // Set current workspace
  setCurrentWorkspace(workspaceId: string): boolean {
    const workspace = this.workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      this.currentWorkspaceId = workspaceId;
      this.saveCurrentWorkspace();
      return true;
    }
    return false;
  }

  // Create new workspace
  createWorkspace(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'taskCount'>): Workspace {
    const newWorkspace: Workspace = {
      ...workspace,
      id: `workspace-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      memberCount: 1,
      taskCount: 0,
    };

    this.workspaces.push(newWorkspace);
    this.saveWorkspaces();
    return newWorkspace;
  }

  // Update workspace
  updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Workspace | null {
    const index = this.workspaces.findIndex(w => w.id === workspaceId);
    if (index !== -1) {
      this.workspaces[index] = {
        ...this.workspaces[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveWorkspaces();
      return this.workspaces[index];
    }
    return null;
  }

  // Delete workspace
  deleteWorkspace(workspaceId: string): boolean {
    const index = this.workspaces.findIndex(w => w.id === workspaceId);
    if (index !== -1 && !this.workspaces[index].isDefault) {
      this.workspaces.splice(index, 1);
      this.saveWorkspaces();
      
      // If deleted workspace was current, switch to default
      if (this.currentWorkspaceId === workspaceId) {
        const defaultWorkspace = this.workspaces.find(w => w.isDefault);
        if (defaultWorkspace) {
          this.setCurrentWorkspace(defaultWorkspace.id);
        }
      }
      return true;
    }
    return false;
  }

  // Get workspace members
  getWorkspaceMembers(workspaceId: string): WorkspaceMember[] {
    return this.members.filter(m => m.workspaceId === workspaceId);
  }

  // Add member to workspace
  addMember(workspaceId: string, member: Omit<WorkspaceMember, 'id' | 'workspaceId' | 'joinedAt' | 'lastActiveAt'>): WorkspaceMember {
    const newMember: WorkspaceMember = {
      ...member,
      id: `member-${Date.now()}`,
      workspaceId,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    this.members.push(newMember);
    this.updateWorkspaceMemberCount(workspaceId);
    return newMember;
  }

  // Remove member from workspace
  removeMember(workspaceId: string, memberId: string): boolean {
    const index = this.members.findIndex(m => m.id === memberId && m.workspaceId === workspaceId);
    if (index !== -1) {
      this.members.splice(index, 1);
      this.updateWorkspaceMemberCount(workspaceId);
      return true;
    }
    return false;
  }

  // Update member role
  updateMemberRole(workspaceId: string, memberId: string, role: WorkspaceMember['role']): boolean {
    const member = this.members.find(m => m.id === memberId && m.workspaceId === workspaceId);
    if (member) {
      member.role = role;
      return true;
    }
    return false;
  }

  // Create workspace invite
  createInvite(workspaceId: string, email: string, role: WorkspaceInvite['role'], invitedBy: string): WorkspaceInvite {
    const invite: WorkspaceInvite = {
      id: `invite-${Date.now()}`,
      workspaceId,
      email,
      role,
      invitedBy,
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: 'pending',
      token: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.invites.push(invite);
    return invite;
  }

  // Get workspace invites
  getWorkspaceInvites(workspaceId: string): WorkspaceInvite[] {
    return this.invites.filter(i => i.workspaceId === workspaceId);
  }

  // Accept invite
  acceptInvite(inviteId: string): boolean {
    const invite = this.invites.find(i => i.id === inviteId);
    if (invite && invite.status === 'pending' && new Date() < new Date(invite.expiresAt)) {
      invite.status = 'accepted';
      return true;
    }
    return false;
  }

  // Decline invite
  declineInvite(inviteId: string): boolean {
    const invite = this.invites.find(i => i.id === inviteId);
    if (invite && invite.status === 'pending') {
      invite.status = 'declined';
      return true;
    }
    return false;
  }

  // Update workspace member count
  private updateWorkspaceMemberCount(workspaceId: string): void {
    const memberCount = this.members.filter(m => m.workspaceId === workspaceId).length;
    this.updateWorkspace(workspaceId, { memberCount });
  }

  // Update workspace task count
  updateWorkspaceTaskCount(workspaceId: string, taskCount: number): void {
    this.updateWorkspace(workspaceId, { taskCount });
  }

  // Get workspace settings
  getWorkspaceSettings(workspaceId: string): WorkspaceSettings | null {
    const workspace = this.workspaces.find(w => w.id === workspaceId);
    return workspace?.settings || null;
  }

  // Update workspace settings
  updateWorkspaceSettings(workspaceId: string, settings: Partial<WorkspaceSettings>): boolean {
    const workspace = this.workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      workspace.settings = { ...workspace.settings, ...settings };
      workspace.updatedAt = new Date().toISOString();
      this.saveWorkspaces();
      return true;
    }
    return false;
  }

  // Check if user has permission
  hasPermission(workspaceId: string, userId: string, permission: keyof WorkspacePermissions): boolean {
    const member = this.members.find(m => m.workspaceId === workspaceId && m.userId === userId);
    if (!member) return false;
    return member.permissions[permission];
  }

  // Get user role in workspace
  getUserRole(workspaceId: string, userId: string): WorkspaceMember['role'] | null {
    const member = this.members.find(m => m.workspaceId === workspaceId && m.userId === userId);
    return member?.role || null;
  }
}

// Export singleton instance
export const workspaceService = new WorkspaceService();
