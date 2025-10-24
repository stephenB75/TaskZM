import React, { useState } from 'react';
import { Clock, User, Tag, MoreVertical, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useMobileTouch, TouchGesture } from '../hooks/useMobileTouch';

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
  status: "todo" | "in_progress" | "done" | "archived";
  scheduledDate: string;
  archived: boolean;
}

interface MobileTaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onSwipeLeft?: (task: Task) => void;
  onSwipeRight?: (task: Task) => void;
  onLongPress?: (task: Task) => void;
}

export default function MobileTaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
}: MobileTaskCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { isTouchDevice, addTouchHandlers, preventScroll } = useMobileTouch();

  const handleGesture = (gesture: TouchGesture) => {
    switch (gesture.type) {
      case 'swipe':
        if (gesture.direction === 'left' && onSwipeLeft) {
          onSwipeLeft(task);
        } else if (gesture.direction === 'right' && onSwipeRight) {
          onSwipeRight(task);
        }
        break;
      case 'longPress':
        if (onLongPress) {
          onLongPress(task);
        }
        break;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'todo':
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm
        ${isPressed ? 'scale-95 shadow-lg' : ''}
        ${isOverdue ? 'border-red-200 bg-red-50' : ''}
        transition-all duration-150 ease-in-out
        touch-manipulation
      `}
      style={{
        touchAction: 'pan-y',
        userSelect: 'none',
      }}
      ref={(el) => {
        if (el && isTouchDevice) {
          addTouchHandlers(el, handleGesture);
        }
      }}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {getStatusIcon(task.status)}
          <h3 className="font-semibold text-gray-900 truncate">
            {task.title}
          </h3>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange(task.id, task.status === 'done' ? 'todo' : 'done')}
            >
              {task.status === 'done' ? 'Mark as Todo' : 'Mark as Done'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-red-600"
            >
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs"
              style={{
                backgroundColor: tag.bgColor,
                color: tag.textColor,
                fontWeight: tag.fontWeight,
              }}
            >
              {tag.text}
            </Badge>
          ))}
          {task.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{task.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Priority */}
          <Badge
            variant="outline"
            className={`text-xs ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </Badge>
          
          {/* Due Date */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        </div>

        {/* Assignee */}
        {task.assignee && (
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500 truncate max-w-16">
              {task.assignee.name}
            </span>
          </div>
        )}
      </div>

      {/* Swipe Actions Indicator */}
      {isTouchDevice && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 transition-opacity" />
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-500 opacity-0 transition-opacity" />
        </div>
      )}
    </div>
  );
}
