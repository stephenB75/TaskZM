import React from 'react';
import { render, screen, fireEvent, waitFor } from './utils';
import App from '../App';

// Mock the hooks and services
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com', name: 'Test User' },
    signIn: jest.fn(),
    signOut: jest.fn(),
    loading: false
  })
}));

jest.mock('../lib/cloudSync', () => ({
  cloudSync: {
    loadTasks: jest.fn().mockResolvedValue([]),
    syncTasks: jest.fn(),
    markPendingChanges: jest.fn()
  }
}));

jest.mock('../lib/notificationService', () => ({
  notificationService: {
    getNotificationCount: jest.fn().mockReturnValue(0),
    subscribe: jest.fn().mockReturnValue(() => {})
  }
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('TaskZM')).toBeInTheDocument();
  });

  it('displays the main navigation', () => {
    render(<App />);
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();
  });

  it('shows the add task button', () => {
    render(<App />);
    const addButton = screen.getByRole('button', { name: /add task/i });
    expect(addButton).toBeInTheDocument();
  });

  it('opens add task modal when add button is clicked', async () => {
    render(<App />);
    const addButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
  });

  it('displays the weekly kanban board by default', () => {
    render(<App />);
    // Check for week navigation elements
    expect(screen.getByText('Week')).toBeInTheDocument();
  });

  it('switches between navigation panels', async () => {
    render(<App />);
    
    // Click on Timeline
    const timelineButton = screen.getByText('Timeline');
    fireEvent.click(timelineButton);
    
    await waitFor(() => {
      expect(screen.getByText('Today\'s Tasks')).toBeInTheDocument();
    });
  });

  it('displays the theme toggle', () => {
    render(<App />);
    const themeToggle = screen.getByRole('button', { name: /theme/i });
    expect(themeToggle).toBeInTheDocument();
  });

  it('shows collaboration features when user is authenticated', () => {
    render(<App />);
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Sync')).toBeInTheDocument();
  });

  it('displays all feature buttons', () => {
    render(<App />);
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Workspaces')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });
});
