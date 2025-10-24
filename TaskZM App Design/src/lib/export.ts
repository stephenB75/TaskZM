import { Task } from '../App';

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'ical' | 'json';
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: {
    status?: string[];
    priority?: string[];
    tags?: string[];
  };
  includeCompleted?: boolean;
  includeArchived?: boolean;
}

export interface ExportResult {
  success: boolean;
  data?: string | Blob;
  filename?: string;
  error?: string;
}

class ExportService {
  // Export tasks to CSV format
  exportToCSV(tasks: Task[], options: ExportOptions): ExportResult {
    try {
      const filteredTasks = this.filterTasks(tasks, options);
      
      const headers = [
        'ID',
        'Title',
        'Description',
        'Status',
        'Priority',
        'Due Date',
        'Scheduled Date',
        'Tags',
        'Assignee',
        'Created At'
      ];

      const csvRows = [
        headers.join(','),
        ...filteredTasks.map(task => [
          task.id,
          this.escapeCSV(task.title),
          this.escapeCSV(task.description),
          task.status,
          task.priority,
          task.dueDate || '',
          task.scheduledDate,
          task.tags.map(tag => tag.text).join(';'),
          task.assignee.name,
          new Date(task.scheduledDate).toISOString()
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      return {
        success: true,
        data: blob,
        filename: `tasks-${this.getDateString()}.csv`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to export CSV: ${error}`
      };
    }
  }

  // Export tasks to JSON format
  exportToJSON(tasks: Task[], options: ExportOptions): ExportResult {
    try {
      const filteredTasks = this.filterTasks(tasks, options);
      
      const exportData = {
        exportDate: new Date().toISOString(),
        totalTasks: filteredTasks.length,
        tasks: filteredTasks
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      
      return {
        success: true,
        data: blob,
        filename: `tasks-${this.getDateString()}.json`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to export JSON: ${error}`
      };
    }
  }

  // Export tasks to iCal format
  exportToICal(tasks: Task[], options: ExportOptions): ExportResult {
    try {
      const filteredTasks = this.filterTasks(tasks, options);
      
      const icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//TaskZM//Task Management//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        ...filteredTasks.map(task => this.taskToICalEvent(task)).flat(),
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
      
      return {
        success: true,
        data: blob,
        filename: `tasks-${this.getDateString()}.ics`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to export iCal: ${error}`
      };
    }
  }

  // Export tasks to PDF format (using browser print functionality)
  exportToPDF(tasks: Task[], options: ExportOptions): ExportResult {
    try {
      const filteredTasks = this.filterTasks(tasks, options);
      
      // Create HTML content for PDF
      const htmlContent = this.generatePDFHTML(filteredTasks, options);
      
      // Open print dialog
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
      
      return {
        success: true,
        filename: `tasks-${this.getDateString()}.pdf`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to export PDF: ${error}`
      };
    }
  }

  // Download file
  downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Filter tasks based on options
  private filterTasks(tasks: Task[], options: ExportOptions): Task[] {
    let filteredTasks = [...tasks];

    // Filter by date range
    if (options.dateRange) {
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.scheduledDate);
        return taskDate >= options.dateRange!.start && taskDate <= options.dateRange!.end;
      });
    }

    // Filter by status
    if (options.filters?.status && options.filters.status.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        options.filters!.status!.includes(task.status)
      );
    }

    // Filter by priority
    if (options.filters?.priority && options.filters.priority.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        options.filters!.priority!.includes(task.priority)
      );
    }

    // Filter by tags
    if (options.filters?.tags && options.filters.tags.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        task.tags.some(tag => options.filters!.tags!.includes(tag.text))
      );
    }

    // Filter completed tasks
    if (!options.includeCompleted) {
      filteredTasks = filteredTasks.filter(task => task.status !== 'done');
    }

    // Filter archived tasks
    if (!options.includeArchived) {
      filteredTasks = filteredTasks.filter(task => !task.archived);
    }

    return filteredTasks;
  }

  // Convert task to iCal event
  private taskToICalEvent(task: Task): string[] {
    const startDate = new Date(task.scheduledDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    return [
      'BEGIN:VEVENT',
      `UID:${task.id}@taskzm.app`,
      `DTSTART:${this.formatICalDate(startDate)}`,
      `DTEND:${this.formatICalDate(endDate)}`,
      `SUMMARY:${this.escapeICal(task.title)}`,
      `DESCRIPTION:${this.escapeICal(task.description)}`,
      `STATUS:${this.getICalStatus(task.status)}`,
      `PRIORITY:${this.getICalPriority(task.priority)}`,
      `CREATED:${this.formatICalDate(new Date(task.scheduledDate))}`,
      'END:VEVENT'
    ];
  }

  // Generate HTML content for PDF
  private generatePDFHTML(tasks: Task[], options: ExportOptions): string {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TaskZM Export - ${this.getDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .task { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
            .task-title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
            .task-meta { color: #666; font-size: 12px; margin-bottom: 5px; }
            .task-description { margin: 10px 0; }
            .task-tags { margin: 5px 0; }
            .tag { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; font-size: 11px; margin-right: 5px; }
            .priority-high { border-left: 4px solid #ff4444; }
            .priority-medium { border-left: 4px solid #ffaa00; }
            .priority-low { border-left: 4px solid #44aa44; }
            .status-done { background: #f0f8f0; }
            .status-inprogress { background: #fff8f0; }
            .status-todo { background: #f8f8f8; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TaskZM Export</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Tasks:</strong> ${totalTasks}</p>
            <p><strong>Completed:</strong> ${completedTasks}</p>
            <p><strong>Completion Rate:</strong> ${completionRate}%</p>
          </div>
          
          <h3>Tasks</h3>
          ${tasks.map(task => `
            <div class="task priority-${task.priority} status-${task.status}">
              <div class="task-title">${task.title}</div>
              <div class="task-meta">
                Status: ${task.status} | Priority: ${task.priority} | 
                Due: ${task.dueDate || 'No due date'} | 
                Assignee: ${task.assignee.name}
              </div>
              ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
              ${task.tags.length > 0 ? `
                <div class="task-tags">
                  ${task.tags.map(tag => `<span class="tag">${tag.text}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;
  }

  // Helper methods
  private escapeCSV(text: string): string {
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  private escapeICal(text: string): string {
    return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
  }

  private formatICalDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private getICalStatus(status: string): string {
    switch (status) {
      case 'done': return 'CONFIRMED';
      case 'inprogress': return 'TENTATIVE';
      case 'todo': return 'CANCELLED';
      default: return 'TENTATIVE';
    }
  }

  private getICalPriority(priority: string): string {
    switch (priority) {
      case 'high': return '1';
      case 'medium': return '5';
      case 'low': return '9';
      default: return '5';
    }
  }

  private getDateString(): string {
    return new Date().toISOString().split('T')[0];
  }
}

// Export singleton instance
export const exportService = new ExportService();
