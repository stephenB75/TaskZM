import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface CollaborationState {
  users: User[];
  activeUsers: User[];
  currentUser: User | null;
  isOnline: boolean;
  realTimeEnabled: boolean;
}

interface CollaborationContextType extends CollaborationState {
  // User management
  setCurrentUser: (user: User) => void;
  updateUserStatus: (isOnline: boolean) => void;
  
  // Real-time features
  enableRealTime: () => void;
  disableRealTime: () => void;
  
  // User presence
  getActiveUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  
  // Collaboration features
  shareWorkspace: (userId: string) => Promise<void>;
  revokeAccess: (userId: string) => Promise<void>;
  getWorkspaceMembers: () => User[];
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

interface CollaborationProviderProps {
  children: React.ReactNode;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  // Initialize current user from auth context
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const userData: User = {
            id: user.id,
            name: user.user_metadata?.full_name || user.email || 'Unknown User',
            avatar: user.user_metadata?.avatar_url || '/default-avatar.png',
            email: user.email || '',
            isOnline: true,
            lastSeen: new Date().toISOString(),
          };
          setCurrentUser(userData);
          setIsOnline(true);
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    initializeUser();
  }, []);

  // Update user status
  const updateUserStatus = useCallback(async (online: boolean) => {
    if (!currentUser) return;

    setIsOnline(online);
    
    try {
      // Update user status in database
      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: currentUser.id,
          is_online: online,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Failed to update user status:', error);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  }, [currentUser]);

  // Enable real-time features
  const enableRealTime = useCallback(() => {
    setRealTimeEnabled(true);
    
    // Set up real-time subscriptions
    if (currentUser) {
      // Subscribe to user presence changes
      const presenceSubscription = supabase
        .channel('user_presence')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        }, (payload) => {
          console.log('User presence change:', payload);
          // Handle real-time user presence updates
        })
        .subscribe();

      // Subscribe to task changes
      const taskSubscription = supabase
        .channel('task_collaboration')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'tasks'
        }, (payload) => {
          console.log('Task collaboration change:', payload);
          // Handle real-time task updates
        })
        .subscribe();

      return () => {
        presenceSubscription.unsubscribe();
        taskSubscription.unsubscribe();
      };
    }
  }, [currentUser]);

  // Disable real-time features
  const disableRealTime = useCallback(() => {
    setRealTimeEnabled(false);
    // Unsubscribe from all channels
    supabase.removeAllChannels();
  }, []);

  // Get active users
  const getActiveUsers = useCallback(() => {
    return users.filter(user => user.isOnline);
  }, [users]);

  // Get user by ID
  const getUserById = useCallback((id: string) => {
    return users.find(user => user.id === id);
  }, [users]);

  // Share workspace with user
  const shareWorkspace = useCallback(async (userId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: 'default', // For now, using default workspace
          user_id: userId,
          role: 'member',
          invited_by: currentUser.id,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Failed to share workspace:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error sharing workspace:', error);
      throw error;
    }
  }, [currentUser]);

  // Revoke user access
  const revokeAccess = useCallback(async (userId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('user_id', userId)
        .eq('workspace_id', 'default');

      if (error) {
        console.error('Failed to revoke access:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error revoking access:', error);
      throw error;
    }
  }, [currentUser]);

  // Get workspace members
  const getWorkspaceMembers = useCallback(() => {
    return users.filter(user => user.id !== currentUser?.id);
  }, [users, currentUser]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => updateUserStatus(true);
    const handleOffline = () => updateUserStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateUserStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (realTimeEnabled) {
        disableRealTime();
      }
    };
  }, [realTimeEnabled, disableRealTime]);

  const value: CollaborationContextType = {
    users,
    activeUsers,
    currentUser,
    isOnline,
    realTimeEnabled,
    setCurrentUser,
    updateUserStatus,
    enableRealTime,
    disableRealTime,
    getActiveUsers,
    getUserById,
    shareWorkspace,
    revokeAccess,
    getWorkspaceMembers,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};
