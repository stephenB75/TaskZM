import React from 'react';
import { render, screen, fireEvent, waitFor } from './utils';
import WeeklyKanbanBoard from '../components/WeeklyKanbanBoard';
import { mockTasks } from './utils';

describe('WeeklyKanbanBoard Component', () => {
  const mockHandlers = {
    onTaskStatusChange: jest.fn(),
    onTaskDrop: jest.fn(),
    onTaskClick: jest.fn(),
    onReorderTasks: jest.fn(),
    onAutoSchedule: jest.fn()
  };

  const currentWeek = new Date('2024-01-15');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the weekly kanban board', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={mockTasks}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
    expect(screen.getByText('Wednesday')).toBeInTheDocument();
    expect(screen.getByText('Thursday')).toBeInTheDocument();
    expect(screen.getByText('Friday')).toBeInTheDocument();
    expect(screen.getByText('Saturday')).toBeInTheDocument();
    expect(screen.getByText('Sunday')).toBeInTheDocument();
  });

  it('displays tasks in the correct day columns', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={mockTasks}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    mockTasks.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  it('shows the week navigation', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={mockTasks}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });

  it('displays the current week date range', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={mockTasks}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    // Check that the week date range is displayed
    expect(screen.getByText(/Jan 15/)).toBeInTheDocument();
  });

  it('shows the auto-schedule button', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={mockTasks}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    expect(screen.getByText('Auto Schedule')).toBeInTheDocument();
  });

  it('calls onTaskClick when a task is clicked', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={mockTasks}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    const firstTask = screen.getByText(mockTasks[0].title);
    fireEvent.click(firstTask);

    expect(mockHandlers.onTaskClick).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('handles task status changes', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={mockTasks}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    // This would test the status change functionality
    // The actual implementation would depend on how status changes are triggered
  });

  it('displays empty state when no tasks', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={[]}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    // Check for empty state indicators
    expect(screen.getByText('No tasks scheduled')).toBeInTheDocument();
  });

  it('shows task counts for each day', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={mockTasks}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    // Check that task counts are displayed
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  it('handles week navigation', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={mockTasks}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    // Test week navigation buttons
    const prevWeekButton = screen.getByRole('button', { name: /previous week/i });
    const nextWeekButton = screen.getByRole('button', { name: /next week/i });

    expect(prevWeekButton).toBeInTheDocument();
    expect(nextWeekButton).toBeInTheDocument();
  });

  it('displays the current week indicator', () => {
    render(
      <WeeklyKanbanBoard
        currentWeek={currentWeek}
        tasks={mockTasks}
        onTaskStatusChange={mockHandlers.onTaskStatusChange}
        onTaskDrop={mockHandlers.onTaskDrop}
        onTaskClick={mockHandlers.onTaskClick}
        onReorderTasks={mockHandlers.onReorderTasks}
        onAutoSchedule={mockHandlers.onAutoSchedule}
      />
    );

    // Check for current week indicator
    expect(screen.getByText('Current Week')).toBeInTheDocument();
  });
});
