import React from 'react';
import { render, screen, fireEvent, waitFor } from './utils';
import AddTaskModal from '../components/AddTaskModal';
import { mockTask } from './utils';

// Mock the AI scheduler
jest.mock('../lib/aiScheduler', () => ({
  aiSmartSchedule: jest.fn().mockResolvedValue('2024-01-15'),
  validateAIScheduleConfig: jest.fn().mockReturnValue([])
}));

describe('AddTaskModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create task modal correctly', () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
  });

  it('renders edit task modal correctly', () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        editingTask={mockTask}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTask.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTask.description)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('validates required fields', async () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Task' }
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test Description' }
    });
    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: 'high' }
    });

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'high'
        })
      );
    });
  });

  it('handles AI scheduling option', async () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Enable AI scheduling
    const aiScheduleCheckbox = screen.getByLabelText('Use AI to schedule this task');
    fireEvent.click(aiScheduleCheckbox);

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Task' }
    });

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('handles subtask management', () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Add a subtask
    const addSubtaskButton = screen.getByText('Add Subtask');
    fireEvent.click(addSubtaskButton);

    expect(screen.getByPlaceholderText('Enter subtask title')).toBeInTheDocument();
  });

  it('handles recurring task configuration', () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Enable recurring
    const recurringCheckbox = screen.getByLabelText('Make this a recurring task');
    fireEvent.click(recurringCheckbox);

    expect(screen.getByText('Recurrence Pattern')).toBeInTheDocument();
    expect(screen.getByLabelText('Frequency')).toBeInTheDocument();
  });

  it('handles task dependencies', () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Add a dependency
    const addDependencyButton = screen.getByText('Add Dependency');
    fireEvent.click(addDependencyButton);

    expect(screen.getByText('Select a task')).toBeInTheDocument();
  });

  it('displays form validation errors', async () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('resets form when modal is closed and reopened', () => {
    const { rerender } = render(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill in some data
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Task' }
    });

    // Close modal
    rerender(
      <AddTaskModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Reopen modal
    rerender(
      <AddTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText('Title')).toHaveValue('');
  });
});
