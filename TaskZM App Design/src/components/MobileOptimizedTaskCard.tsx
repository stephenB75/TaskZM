import React from 'react';
import { TaskCard } from './TaskCard';
import { useMobile } from '../hooks/useMobile';

interface Task {
  id: string;
  title: string;
  description: string;
  tags: Array<{
    text: string;
    bgColor: string;
    textColor: string;
    fontWeight: "bold" | "medium";
  }>;
  priority: "high" | "medium" | "low";
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  links?: { text: string; url: string }[];
  files?: { name: string; icon: string }[];
  notes?: string;
  status: "todo" | "inprogress" | "done";
  scheduledDate: string;
  scheduledTime?: string;
  dependencies?: string[];
}

interface MobileOptimizedTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const MobileOptimizedTaskCard: React.FC<MobileOptimizedTaskCardProps> = ({
  task,
  onEdit,
  onStatusChange,
  onDragStart,
  onDragEnd
}) => {
  const { isMobile, hapticFeedback } = useMobile();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await hapticFeedback('light');
    onEdit(task);
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    await hapticFeedback('medium');
    onStatusChange(task.id, newStatus);
  };

  const handleDragStart = async (e: React.DragEvent) => {
    await hapticFeedback('light');
    onDragStart?.(e, task);
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    await hapticFeedback('light');
    onDragEnd?.(e);
  };

  return (
    <div
      className={`task-card-wrapper ${isMobile ? 'mobile-optimized' : ''}`}
      onClick={handleClick}
      draggable={!isMobile}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onStatusChange={handleStatusChange}
        className={isMobile ? 'mobile-task-card' : ''}
      />
      
      {isMobile && (
        <style jsx>{`
          .mobile-optimized {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          .mobile-task-card {
            min-height: 60px;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          
          .mobile-task-card:active {
            transform: scale(0.98);
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
          }
          
          .mobile-task-card .task-title {
            font-size: 16px;
            line-height: 1.4;
            margin-bottom: 8px;
          }
          
          .mobile-task-card .task-description {
            font-size: 14px;
            line-height: 1.3;
            margin-bottom: 12px;
          }
          
          .mobile-task-card .task-tags {
            margin-bottom: 12px;
          }
          
          .mobile-task-card .task-tag {
            padding: 4px 8px;
            font-size: 12px;
            border-radius: 6px;
            margin-right: 6px;
            margin-bottom: 4px;
          }
          
          .mobile-task-card .task-metadata {
            font-size: 12px;
            color: #828282;
          }
        `}</style>
      )}
    </div>
  );
};