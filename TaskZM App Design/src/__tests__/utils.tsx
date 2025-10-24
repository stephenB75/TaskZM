import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { CollaborationProvider } from '../contexts/CollaborationContext';

// Mock data
export const mockTask = {
  id: 'test-task-1',
  title: 'Test Task',
  description: 'Test task description',
  tags: [
    { text: 'urgent', bgColor: '#ff4444', textColor: '#ffffff', fontWeight: 'bold' as const }
  ],
  priority: 'high' as const,
  assignee: {
    name: 'Test User',
    avatar: '/test-avatar.png'
  },
  dueDate: '2024-01-15',
  status: 'todo' as const,
  scheduledDate: '2024-01-15',
  scheduledTime: '09:00',
  archived: false,
  subtasks: [],
  dependencies: [],
  recurring: null,
  recurringGroupId: null
};

export const mockTasks = [
  mockTask,
  {
    ...mockTask,
    id: 'test-task-2',
    title: 'Another Test Task',
    status: 'inprogress' as const,
    priority: 'medium' as const
  },
  {
    ...mockTask,
    id: 'test-task-3',
    title: 'Completed Task',
    status: 'done' as const,
    priority: 'low' as const
  }
];

export const mockUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  avatar: '/test-avatar.png'
};

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CollaborationProvider>
          {children}
        </CollaborationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock functions
export const mockOnTaskCreate = jest.fn();
export const mockOnTaskUpdate = jest.fn();
export const mockOnTaskDelete = jest.fn();
export const mockOnTaskStatusChange = jest.fn();
export const mockOnTaskClick = jest.fn();
export const mockOnTaskDrop = jest.fn();
export const mockOnReorderTasks = jest.fn();
export const mockOnAutoSchedule = jest.fn();

// Mock handlers
export const mockHandlers = {
  onTaskCreate: mockOnTaskCreate,
  onTaskUpdate: mockOnTaskUpdate,
  onTaskDelete: mockOnTaskDelete,
  onTaskStatusChange: mockOnTaskStatusChange,
  onTaskClick: mockOnTaskClick,
  onTaskDrop: mockOnTaskDrop,
  onReorderTasks: mockOnReorderTasks,
  onAutoSchedule: mockOnAutoSchedule
};

// Test utilities
export const createMockTask = (overrides: Partial<typeof mockTask> = {}) => ({
  ...mockTask,
  ...overrides
});

export const createMockTasks = (count: number, overrides: Partial<typeof mockTask> = {}) => {
  return Array.from({ length: count }, (_, index) => ({
    ...mockTask,
    id: `test-task-${index + 1}`,
    title: `Test Task ${index + 1}`,
    ...overrides
  }));
};

// Wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock localStorage helpers
export const setMockLocalStorage = (data: Record<string, string>) => {
  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
};

export const getMockLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

// Mock API responses
export const mockApiResponse = (data: any, delay = 0) => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ data }), delay);
  });
};

// Mock fetch responses
export const mockFetchResponse = (data: any, status = 200) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  });
};

// Mock fetch error
export const mockFetchError = (message = 'Network error') => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(message));
};

// Test data generators
export const generateMockTasks = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `task-${index + 1}`,
    title: `Task ${index + 1}`,
    description: `Description for task ${index + 1}`,
    tags: [
      { text: 'work', bgColor: '#3b82f6', textColor: '#ffffff', fontWeight: 'medium' as const }
    ],
    priority: ['low', 'medium', 'high'][index % 3] as 'low' | 'medium' | 'high',
    assignee: {
      name: 'Test User',
      avatar: '/test-avatar.png'
    },
    dueDate: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: ['todo', 'inprogress', 'done'][index % 3] as 'todo' | 'inprogress' | 'done',
    scheduledDate: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '09:00',
    archived: false,
    subtasks: [],
    dependencies: [],
    recurring: null,
    recurringGroupId: null
  }));
};

// Mock workspace data
export const mockWorkspace = {
  id: 'test-workspace-1',
  name: 'Test Workspace',
  description: 'Test workspace description',
  color: '#3b82f6',
  icon: 'briefcase',
  isDefault: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'test-user-1',
  memberCount: 1,
  taskCount: 3,
  settings: {
    allowGuestAccess: false,
    requireApprovalForNewMembers: false,
    defaultTaskPriority: 'medium' as const,
    defaultTaskStatus: 'todo' as const,
    notificationSettings: {
      taskAssigned: true,
      taskCompleted: true,
      taskOverdue: true,
      newMember: true
    },
    timeTrackingEnabled: true,
    collaborationEnabled: true
  }
};

// Mock notification data
export const mockNotification = {
  id: 'test-notification-1',
  type: 'task_due' as const,
  title: 'Task Due Soon',
  message: 'Test task is due soon',
  taskId: 'test-task-1',
  dueDate: '2024-01-15',
  priority: 'high' as const,
  isRead: false,
  createdAt: new Date().toISOString(),
  scheduledFor: undefined,
  snoozeUntil: undefined
};

// Mock template data
export const mockTemplate = {
  id: 'test-template-1',
  name: 'Test Template',
  description: 'Test template description',
  category: 'work' as const,
  icon: 'briefcase',
  color: '#3b82f6',
  estimatedDuration: 60,
  difficulty: 'medium' as const,
  tags: ['work', 'template'],
  isPublic: true,
  createdBy: 'test-user-1',
  createdAt: new Date().toISOString(),
  usageCount: 0,
  tasks: [mockTask]
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };
