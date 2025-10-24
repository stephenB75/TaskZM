export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  component?: string;
  action?: string;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'validation' | 'network' | 'rendering' | 'business' | 'unknown';
}

class ErrorHandler {
  private errorQueue: ErrorReport[] = [];
  private isOnline = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Listen for unhandled errors
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error, {
        component: 'global',
        action: 'unhandled_error',
        ...this.getBaseContext(),
      });
    });

    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(new Error(event.reason), {
        component: 'global',
        action: 'unhandled_promise_rejection',
        ...this.getBaseContext(),
      });
    });
  }

  private getBaseContext(): Partial<ErrorContext> {
    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
  }

  private categorizeError(error: Error): ErrorReport['category'] {
    const message = error.message.toLowerCase();
    
    if (message.includes('validation') || message.includes('invalid')) {
      return 'validation';
    }
    
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'network';
    }
    
    if (message.includes('render') || message.includes('component')) {
      return 'rendering';
    }
    
    if (message.includes('business') || message.includes('logic')) {
      return 'business';
    }
    
    return 'unknown';
  }

  private determineSeverity(error: Error, category: ErrorReport['category']): ErrorReport['severity'] {
    const message = error.message.toLowerCase();
    
    // Critical errors
    if (message.includes('critical') || message.includes('fatal')) {
      return 'critical';
    }
    
    // High severity errors
    if (category === 'network' || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'high';
    }
    
    // Medium severity errors
    if (category === 'validation' || message.includes('warning')) {
      return 'medium';
    }
    
    // Low severity errors
    return 'low';
  }

  handleError(
    error: Error,
    context: Partial<ErrorContext> = {},
    severity?: ErrorReport['severity'],
    category?: ErrorReport['category']
  ): void {
    const fullContext: ErrorContext = {
      ...this.getBaseContext(),
      ...context,
    };

    const errorCategory = category || this.categorizeError(error);
    const errorSeverity = severity || this.determineSeverity(error, errorCategory);

    const errorReport: ErrorReport = {
      error,
      context: fullContext,
      severity: errorSeverity,
      category: errorCategory,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', errorReport);
    }

    // Add to queue
    this.errorQueue.push(errorReport);

    // Send immediately if online, otherwise queue for later
    if (this.isOnline) {
      this.sendErrorReport(errorReport);
    }
  }

  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    try {
      // In a real application, you would send this to your error reporting service
      // For now, we'll just log it
      console.log('Sending error report:', errorReport);
      
      // Example: Send to external service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });
    } catch (sendError) {
      console.error('Failed to send error report:', sendError);
    }
  }

  private async flushErrorQueue(): Promise<void> {
    if (!this.isOnline || this.errorQueue.length === 0) {
      return;
    }

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    for (const errorReport of errorsToSend) {
      await this.sendErrorReport(errorReport);
    }
  }

  // Public methods for different types of errors
  handleValidationError(error: Error, field: string, context?: Partial<ErrorContext>): void {
    this.handleError(error, {
      ...context,
      component: 'validation',
      action: `validate_${field}`,
    }, 'medium', 'validation');
  }

  handleNetworkError(error: Error, endpoint: string, context?: Partial<ErrorContext>): void {
    this.handleError(error, {
      ...context,
      component: 'network',
      action: `request_${endpoint}`,
    }, 'high', 'network');
  }

  handleBusinessError(error: Error, operation: string, context?: Partial<ErrorContext>): void {
    this.handleError(error, {
      ...context,
      component: 'business',
      action: operation,
    }, 'high', 'business');
  }

  handleRenderingError(error: Error, component: string, context?: Partial<ErrorContext>): void {
    this.handleError(error, {
      ...context,
      component,
      action: 'render',
    }, 'medium', 'rendering');
  }

  // Utility method to create user-friendly error messages
  getUserFriendlyMessage(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    if (message.includes('validation')) {
      return 'Please check your input and try again.';
    }
    
    if (message.includes('unauthorized')) {
      return 'You are not authorized to perform this action.';
    }
    
    if (message.includes('timeout')) {
      return 'The request timed out. Please try again.';
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  // Method to clear error queue (useful for testing)
  clearErrorQueue(): void {
    this.errorQueue = [];
  }

  // Method to get current error queue (useful for debugging)
  getErrorQueue(): ErrorReport[] {
    return [...this.errorQueue];
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Export convenience functions
export const handleError = (error: Error, context?: Partial<ErrorContext>) => {
  errorHandler.handleError(error, context);
};

export const handleValidationError = (error: Error, field: string, context?: Partial<ErrorContext>) => {
  errorHandler.handleValidationError(error, field, context);
};

export const handleNetworkError = (error: Error, endpoint: string, context?: Partial<ErrorContext>) => {
  errorHandler.handleNetworkError(error, endpoint, context);
};

export const handleBusinessError = (error: Error, operation: string, context?: Partial<ErrorContext>) => {
  errorHandler.handleBusinessError(error, operation, context);
};

export const handleRenderingError = (error: Error, component: string, context?: Partial<ErrorContext>) => {
  errorHandler.handleRenderingError(error, component, context);
};

export const getUserFriendlyMessage = (error: Error): string => {
  return errorHandler.getUserFriendlyMessage(error);
};
