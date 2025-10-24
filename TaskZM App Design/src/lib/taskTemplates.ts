import { Task } from '../App';

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: 'work' | 'personal' | 'project' | 'meeting' | 'development' | 'marketing' | 'sales';
  icon: string;
  color: string;
  tasks: Omit<Task, 'id' | 'scheduledDate'>[];
  estimatedDuration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

class TaskTemplateService {
  private templates: TaskTemplate[] = [];
  private categories: TemplateCategory[] = [];

  constructor() {
    this.initializeDefaultTemplates();
    this.initializeCategories();
    this.loadTemplates();
  }

  // Initialize default template categories
  private initializeCategories(): void {
    this.categories = [
      {
        id: 'work',
        name: 'Work',
        description: 'Professional work templates',
        icon: 'briefcase',
        color: '#3b82f6'
      },
      {
        id: 'personal',
        name: 'Personal',
        description: 'Personal productivity templates',
        icon: 'user',
        color: '#10b981'
      },
      {
        id: 'project',
        name: 'Project',
        description: 'Project management templates',
        icon: 'folder',
        color: '#f59e0b'
      },
      {
        id: 'meeting',
        name: 'Meeting',
        description: 'Meeting and collaboration templates',
        icon: 'users',
        color: '#8b5cf6'
      },
      {
        id: 'development',
        name: 'Development',
        description: 'Software development templates',
        icon: 'code',
        color: '#ef4444'
      },
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Marketing campaign templates',
        icon: 'megaphone',
        color: '#ec4899'
      },
      {
        id: 'sales',
        name: 'Sales',
        description: 'Sales process templates',
        icon: 'trending-up',
        color: '#06b6d4'
      }
    ];
  }

  // Initialize default templates
  private initializeDefaultTemplates(): void {
    this.templates = [
      {
        id: 'daily-standup',
        name: 'Daily Standup',
        description: 'Template for daily team standup meetings',
        category: 'meeting',
        icon: 'users',
        color: '#8b5cf6',
        estimatedDuration: 15,
        difficulty: 'easy',
        tags: ['meeting', 'team', 'daily'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        usageCount: 0,
        tasks: [
          {
            title: 'Prepare standup notes',
            description: 'Review yesterday\'s progress and today\'s priorities',
            tags: [],
            priority: 'medium',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo',
            scheduledTime: '09:00'
          },
          {
            title: 'Attend standup meeting',
            description: 'Participate in daily team standup',
            tags: [],
            priority: 'high',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo',
            scheduledTime: '09:15'
          },
          {
            title: 'Update project status',
            description: 'Update project management tools with current status',
            tags: [],
            priority: 'medium',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo',
            scheduledTime: '09:30'
          }
        ]
      },
      {
        id: 'sprint-planning',
        name: 'Sprint Planning',
        description: 'Template for agile sprint planning sessions',
        category: 'project',
        icon: 'calendar',
        color: '#f59e0b',
        estimatedDuration: 120,
        difficulty: 'medium',
        tags: ['agile', 'sprint', 'planning'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        usageCount: 0,
        tasks: [
          {
            title: 'Review backlog',
            description: 'Review and prioritize backlog items',
            tags: [],
            priority: 'high',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Estimate story points',
            description: 'Estimate effort for each user story',
            tags: [],
            priority: 'high',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Create sprint goals',
            description: 'Define clear sprint objectives',
            tags: [],
            priority: 'medium',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Assign tasks',
            description: 'Assign tasks to team members',
            tags: [],
            priority: 'medium',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          }
        ]
      },
      {
        id: 'content-creation',
        name: 'Content Creation',
        description: 'Template for creating blog posts or articles',
        category: 'marketing',
        icon: 'edit',
        color: '#ec4899',
        estimatedDuration: 180,
        difficulty: 'medium',
        tags: ['content', 'writing', 'marketing'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        usageCount: 0,
        tasks: [
          {
            title: 'Research topic',
            description: 'Gather information and research the topic',
            tags: [],
            priority: 'high',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Create outline',
            description: 'Structure the content with headings and key points',
            tags: [],
            priority: 'high',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Write first draft',
            description: 'Write the initial version of the content',
            tags: [],
            priority: 'medium',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Review and edit',
            description: 'Proofread and improve the content',
            tags: [],
            priority: 'medium',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Publish content',
            description: 'Finalize and publish the content',
            tags: [],
            priority: 'low',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          }
        ]
      },
      {
        id: 'bug-fix',
        name: 'Bug Fix',
        description: 'Template for fixing software bugs',
        category: 'development',
        icon: 'bug',
        color: '#ef4444',
        estimatedDuration: 60,
        difficulty: 'medium',
        tags: ['bug', 'fix', 'development'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        usageCount: 0,
        tasks: [
          {
            title: 'Reproduce bug',
            description: 'Identify and reproduce the bug consistently',
            tags: [],
            priority: 'high',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Investigate root cause',
            description: 'Analyze code to find the root cause',
            tags: [],
            priority: 'high',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Implement fix',
            description: 'Write code to fix the bug',
            tags: [],
            priority: 'medium',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Test fix',
            description: 'Test the fix to ensure it works',
            tags: [],
            priority: 'medium',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Deploy fix',
            description: 'Deploy the fix to production',
            tags: [],
            priority: 'low',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          }
        ]
      },
      {
        id: 'client-meeting',
        name: 'Client Meeting',
        description: 'Template for client meetings and presentations',
        category: 'sales',
        icon: 'presentation',
        color: '#06b6d4',
        estimatedDuration: 90,
        difficulty: 'medium',
        tags: ['client', 'meeting', 'sales'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        usageCount: 0,
        tasks: [
          {
            title: 'Prepare presentation',
            description: 'Create slides and materials for the meeting',
            tags: [],
            priority: 'high',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Research client',
            description: 'Research client background and needs',
            tags: [],
            priority: 'high',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Prepare questions',
            description: 'Prepare relevant questions for the client',
            tags: [],
            priority: 'medium',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Conduct meeting',
            description: 'Meet with client and present proposal',
            tags: [],
            priority: 'high',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          },
          {
            title: 'Follow up',
            description: 'Send follow-up materials and next steps',
            tags: [],
            priority: 'medium',
            assignee: { name: 'You', avatar: '/default-avatar.png' },
            dueDate: '',
            status: 'todo'
          }
        ]
      }
    ];
  }

  // Load templates from localStorage
  private loadTemplates(): void {
    try {
      const stored = localStorage.getItem('taskTemplates');
      if (stored) {
        const storedTemplates = JSON.parse(stored);
        this.templates = [...this.templates, ...storedTemplates];
      }
    } catch (error) {
      console.error('Failed to load task templates:', error);
    }
  }

  // Save templates to localStorage
  private saveTemplates(): void {
    try {
      const customTemplates = this.templates.filter(t => t.createdBy !== 'system');
      localStorage.setItem('taskTemplates', JSON.stringify(customTemplates));
    } catch (error) {
      console.error('Failed to save task templates:', error);
    }
  }

  // Get all templates
  getTemplates(): TaskTemplate[] {
    return this.templates;
  }

  // Get templates by category
  getTemplatesByCategory(category: string): TaskTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  // Get template by ID
  getTemplate(id: string): TaskTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  // Get all categories
  getCategories(): TemplateCategory[] {
    return this.categories;
  }

  // Create new template
  createTemplate(template: Omit<TaskTemplate, 'id' | 'createdAt' | 'usageCount'>): TaskTemplate {
    const newTemplate: TaskTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    this.templates.push(newTemplate);
    this.saveTemplates();
    return newTemplate;
  }

  // Update template
  updateTemplate(id: string, updates: Partial<TaskTemplate>): TaskTemplate | null {
    const index = this.templates.findIndex(template => template.id === id);
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates };
      this.saveTemplates();
      return this.templates[index];
    }
    return null;
  }

  // Delete template
  deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex(template => template.id === id);
    if (index !== -1 && this.templates[index].createdBy !== 'system') {
      this.templates.splice(index, 1);
      this.saveTemplates();
      return true;
    }
    return false;
  }

  // Use template (increment usage count)
  useTemplate(id: string): TaskTemplate | null {
    const template = this.getTemplate(id);
    if (template) {
      template.usageCount++;
      this.saveTemplates();
      return template;
    }
    return null;
  }

  // Search templates
  searchTemplates(query: string): TaskTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return this.templates.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get popular templates
  getPopularTemplates(limit: number = 5): TaskTemplate[] {
    return this.templates
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  // Get recent templates
  getRecentTemplates(limit: number = 5): TaskTemplate[] {
    return this.templates
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

// Export singleton instance
export const taskTemplateService = new TaskTemplateService();
