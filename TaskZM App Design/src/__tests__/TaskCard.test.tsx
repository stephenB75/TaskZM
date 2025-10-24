import React from 'react';
import { render, screen, fireEvent, waitFor } from './utils';
import TaskCard from '../components/TaskCard';
import { mockTask, mockTasks } from './utils';

// Mock the time tracking service
jest.mock('../lib/timeTracking', () => ({
  timeTracking: {
    subscribe: jest.fn().mockReturnValue(() => {}),
    getTotalTimeForTask: jest.fn().mockReturnValue(0),
    getActiveTimer: jest.fn().mockReturnValue(null),
    startTimer: jest.fn(),
    stopTimer: jest.fn(),
    pauseTimer: jest.fn()
  }
}));

describe('TaskCard Component', () => {
  const mockHandlers = {
    onStatusChange: jest.fn(),
    onTaskClick: jest.fn(),
    onTaskDrop: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(screen.getByText(mockTask.assignee.name)).toBeInTheDocument();
  });

  it('displays priority badge correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    const priorityBadge = screen.getByText(mockTask.priority);
    expect(priorityBadge).toBeInTheDocument();
  });

  it('displays tags correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    mockTask.tags.forEach(tag => {
      expect(screen.getByText(tag.text)).toBeInTheDocument();
    });
  });

  it('calls onTaskClick when task is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    const taskCard = screen.getByText(mockTask.title).closest('div');
    fireEvent.click(taskCard!);
    expect(mockHandlers.onTaskClick).toHaveBeenCalledWith(mockTask);
  });

  it('displays time tracking controls', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument();
  });

  it('shows recurring badge for recurring tasks', () => {
    const recurringTask = {
      ...mockTask,
      recurringGroupId: 'recurring-group-1'
    };

    render(
      <TaskCard
        task={recurringTask}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    expect(screen.getByText('Repeating')).toBeInTheDocument();
  });

  it('displays subtasks when present', () => {
    const taskWithSubtasks = {
      ...mockTask,
      subtasks: [
        { id: 'subtask-1', title: 'Subtask 1', completed: false },
        { id: 'subtask-2', title: 'Subtask 2', completed: true }
      ]
    };

    render(
      <TaskCard
        task={taskWithSubtasks}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    expect(screen.getByText('Subtask 1')).toBeInTheDocument();
    expect(screen.getByText('Subtask 2')).toBeInTheDocument();
  });

  it('shows dependency status for tasks with dependencies', () => {
    const taskWithDependencies = {
      ...mockTask,
      dependencies: ['task-2']
    };

    render(
      <TaskCard
        task={taskWithDependencies}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('handles time tracking start/stop', async () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pause timer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /stop timer/i })).toBeInTheDocument();
    });
  });

  it('displays task status correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    expect(screen.getByText(mockTask.status)).toBeInTheDocument();
  });

  it('shows due date when present', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockHandlers.onStatusChange}
        onTaskClick={mockHandlers.onTaskClick}
        allTasks={mockTasks}
      />
    );

    expect(screen.getByText(mockTask.dueDate)).toBeInTheDocument();
  });
});
