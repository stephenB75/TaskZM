export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class ValidationError extends Error {
  public errors: ValidationError[];
  public field: string;

  constructor(field: string, message: string, errors: ValidationError[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.errors = errors;
  }
}

// Task validation
export const validateTask = (task: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Title validation
  if (!task.title || typeof task.title !== 'string') {
    errors.push({
      field: 'title',
      message: 'Title is required',
      code: 'REQUIRED'
    });
  } else if (task.title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Title cannot be empty',
      code: 'EMPTY'
    });
  } else if (task.title.length > 200) {
    errors.push({
      field: 'title',
      message: 'Title must be less than 200 characters',
      code: 'TOO_LONG'
    });
  }

  // Description validation
  if (task.description && typeof task.description === 'string' && task.description.length > 1000) {
    errors.push({
      field: 'description',
      message: 'Description must be less than 1000 characters',
      code: 'TOO_LONG'
    });
  }

  // Priority validation
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!task.priority || !validPriorities.includes(task.priority)) {
    errors.push({
      field: 'priority',
      message: 'Priority must be one of: low, medium, high, urgent',
      code: 'INVALID_VALUE'
    });
  }

  // Status validation
  const validStatuses = ['todo', 'in_progress', 'done', 'archived'];
  if (!task.status || !validStatuses.includes(task.status)) {
    errors.push({
      field: 'status',
      message: 'Status must be one of: todo, in_progress, done, archived',
      code: 'INVALID_VALUE'
    });
  }

  // Due date validation
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.push({
        field: 'dueDate',
        message: 'Due date must be a valid date',
        code: 'INVALID_DATE'
      });
    } else if (dueDate < new Date('1900-01-01')) {
      errors.push({
        field: 'dueDate',
        message: 'Due date cannot be before 1900',
        code: 'INVALID_DATE'
      });
    }
  }

  // Tags validation
  if (task.tags && Array.isArray(task.tags)) {
    if (task.tags.length > 10) {
      errors.push({
        field: 'tags',
        message: 'Maximum 10 tags allowed',
        code: 'TOO_MANY'
      });
    }

    task.tags.forEach((tag: any, index: number) => {
      if (typeof tag !== 'object' || !tag.text) {
        errors.push({
          field: `tags[${index}]`,
          message: 'Each tag must have a text property',
          code: 'INVALID_TAG'
        });
      } else if (tag.text.length > 50) {
        errors.push({
          field: `tags[${index}].text`,
          message: 'Tag text must be less than 50 characters',
          code: 'TOO_LONG'
        });
      }
    });
  }

  // Subtasks validation
  if (task.subtasks && Array.isArray(task.subtasks)) {
    if (task.subtasks.length > 20) {
      errors.push({
        field: 'subtasks',
        message: 'Maximum 20 subtasks allowed',
        code: 'TOO_MANY'
      });
    }

    task.subtasks.forEach((subtask: any, index: number) => {
      if (!subtask.title || typeof subtask.title !== 'string') {
        errors.push({
          field: `subtasks[${index}].title`,
          message: 'Subtask title is required',
          code: 'REQUIRED'
        });
      }
    });
  }

  // Dependencies validation
  if (task.dependencies && Array.isArray(task.dependencies)) {
    if (task.dependencies.length > 10) {
      errors.push({
        field: 'dependencies',
        message: 'Maximum 10 dependencies allowed',
        code: 'TOO_MANY'
      });
    }

    task.dependencies.forEach((dep: any, index: number) => {
      if (!dep || typeof dep !== 'string') {
        errors.push({
          field: `dependencies[${index}]`,
          message: 'Dependency must be a valid task ID',
          code: 'INVALID_DEPENDENCY'
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// User validation
export const validateUser = (user: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Email validation
  if (!user.email || typeof user.email !== 'string') {
    errors.push({
      field: 'email',
      message: 'Email is required',
      code: 'REQUIRED'
    });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      errors.push({
        field: 'email',
        message: 'Email must be a valid email address',
        code: 'INVALID_EMAIL'
      });
    }
  }

  // Name validation
  if (!user.name || typeof user.name !== 'string') {
    errors.push({
      field: 'name',
      message: 'Name is required',
      code: 'REQUIRED'
    });
  } else if (user.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Name cannot be empty',
      code: 'EMPTY'
    });
  } else if (user.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Name must be less than 100 characters',
      code: 'TOO_LONG'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Tag validation
export const validateTag = (tag: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!tag.name || typeof tag.name !== 'string') {
    errors.push({
      field: 'name',
      message: 'Tag name is required',
      code: 'REQUIRED'
    });
  } else if (tag.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Tag name cannot be empty',
      code: 'EMPTY'
    });
  } else if (tag.name.length > 50) {
    errors.push({
      field: 'name',
      message: 'Tag name must be less than 50 characters',
      code: 'TOO_LONG'
    });
  }

  // Color validation
  if (!tag.color || typeof tag.color !== 'string') {
    errors.push({
      field: 'color',
      message: 'Tag color is required',
      code: 'REQUIRED'
    });
  } else {
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(tag.color)) {
      errors.push({
        field: 'color',
        message: 'Color must be a valid hex color (e.g., #FF0000)',
        code: 'INVALID_COLOR'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Workspace validation
export const validateWorkspace = (workspace: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!workspace.name || typeof workspace.name !== 'string') {
    errors.push({
      field: 'name',
      message: 'Workspace name is required',
      code: 'REQUIRED'
    });
  } else if (workspace.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Workspace name cannot be empty',
      code: 'EMPTY'
    });
  } else if (workspace.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Workspace name must be less than 100 characters',
      code: 'TOO_LONG'
    });
  }

  // Description validation
  if (workspace.description && typeof workspace.description === 'string' && workspace.description.length > 500) {
    errors.push({
      field: 'description',
      message: 'Description must be less than 500 characters',
      code: 'TOO_LONG'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generic validation helper
export const validateField = (value: any, rules: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}): string | null => {
  if (rules.required && (!value || (typeof value === 'string' && value.trim().length === 0))) {
    return 'This field is required';
  }

  if (value && typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be less than ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format';
    }
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

// Error handling utilities
export const handleValidationError = (error: ValidationError): string => {
  return error.errors.map(e => `${e.field}: ${e.message}`).join(', ');
};

export const formatValidationErrors = (errors: ValidationError[]): Record<string, string> => {
  const formatted: Record<string, string> = {};
  errors.forEach(error => {
    formatted[error.field] = error.message;
  });
  return formatted;
};
