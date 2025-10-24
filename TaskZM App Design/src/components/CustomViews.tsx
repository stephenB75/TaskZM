import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Save, Trash2, Eye, Settings } from 'lucide-react';
import { Task } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

interface CustomView {
  id: string;
  name: string;
  description?: string;
  filters: ViewFilter[];
  grouping: GroupingOption;
  sorting: SortingOption;
  layout: 'grid' | 'list';
  isDefault: boolean;
  createdAt: string;
}

interface ViewFilter {
  id: string;
  field: 'status' | 'priority' | 'assignee' | 'tags' | 'dueDate' | 'createdAt';
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'before' | 'after' | 'between';
  value: string | string[];
  label: string;
}

interface GroupingOption {
  field: 'status' | 'priority' | 'assignee' | 'dueDate' | 'none';
  direction: 'asc' | 'desc';
}

interface SortingOption {
  field: 'title' | 'priority' | 'dueDate' | 'createdAt' | 'status';
  direction: 'asc' | 'desc';
}

interface CustomViewsProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onViewChange?: (view: CustomView) => void;
}

export default function CustomViews({ isOpen, onClose, tasks, onViewChange }: CustomViewsProps) {
  const [views, setViews] = useState<CustomView[]>([]);
  const [activeView, setActiveView] = useState<CustomView | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newView, setNewView] = useState<Partial<CustomView>>({
    name: '',
    description: '',
    filters: [],
    grouping: { field: 'none', direction: 'asc' },
    sorting: { field: 'title', direction: 'asc' },
    layout: 'grid',
    isDefault: false,
  });

  useEffect(() => {
    loadViews();
  }, []);

  const loadViews = () => {
    try {
      const stored = localStorage.getItem('customViews');
      const savedViews = stored ? JSON.parse(stored) : [];
      setViews(savedViews);
    } catch (error) {
      console.error('Failed to load custom views:', error);
    }
  };

  const saveViews = (updatedViews: CustomView[]) => {
    try {
      localStorage.setItem('customViews', JSON.stringify(updatedViews));
      setViews(updatedViews);
    } catch (error) {
      console.error('Failed to save custom views:', error);
    }
  };

  const handleCreateView = () => {
    if (!newView.name) return;

    const view: CustomView = {
      id: `view-${Date.now()}`,
      name: newView.name,
      description: newView.description || '',
      filters: newView.filters || [],
      grouping: newView.grouping || { field: 'none', direction: 'asc' },
      sorting: newView.sorting || { field: 'title', direction: 'asc' },
      layout: newView.layout || 'grid',
      isDefault: newView.isDefault || false,
      createdAt: new Date().toISOString(),
    };

    const updatedViews = [...views, view];
    saveViews(updatedViews);
    setActiveView(view);
    setIsCreating(false);
    setNewView({
      name: '',
      description: '',
      filters: [],
      grouping: { field: 'none', direction: 'asc' },
      sorting: { field: 'title', direction: 'asc' },
      layout: 'grid',
      isDefault: false,
    });
  };

  const handleDeleteView = (viewId: string) => {
    const updatedViews = views.filter(view => view.id !== viewId);
    saveViews(updatedViews);
    if (activeView?.id === viewId) {
      setActiveView(null);
    }
  };

  const handleApplyView = (view: CustomView) => {
    setActiveView(view);
    onViewChange?.(view);
  };

  const addFilter = () => {
    const newFilter: ViewFilter = {
      id: `filter-${Date.now()}`,
      field: 'status',
      operator: 'equals',
      value: '',
      label: '',
    };
    setNewView(prev => ({
      ...prev,
      filters: [...(prev.filters || []), newFilter],
    }));
  };

  const updateFilter = (filterId: string, updates: Partial<ViewFilter>) => {
    setNewView(prev => ({
      ...prev,
      filters: (prev.filters || []).map(filter =>
        filter.id === filterId ? { ...filter, ...updates } : filter
      ),
    }));
  };

  const removeFilter = (filterId: string) => {
    setNewView(prev => ({
      ...prev,
      filters: (prev.filters || []).filter(filter => filter.id !== filterId),
    }));
  };

  const getFilterOptions = (field: string) => {
    switch (field) {
      case 'status':
        return [
          { value: 'todo', label: 'Todo' },
          { value: 'inprogress', label: 'In Progress' },
          { value: 'done', label: 'Done' },
        ];
      case 'priority':
        return [
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ];
      case 'assignee':
        return [
          { value: 'You', label: 'You' },
          { value: 'Team', label: 'Team' },
        ];
      default:
        return [];
    }
  };

  const applyFilters = (tasks: Task[], filters: ViewFilter[]) => {
    return tasks.filter(task => {
      return filters.every(filter => {
        switch (filter.field) {
          case 'status':
            return filter.operator === 'equals' ? task.status === filter.value : task.status !== filter.value;
          case 'priority':
            return filter.operator === 'equals' ? task.priority === filter.value : task.priority !== filter.value;
          case 'assignee':
            return filter.operator === 'equals' ? task.assignee.name === filter.value : task.assignee.name !== filter.value;
          case 'tags':
            return filter.operator === 'contains' 
              ? task.tags.some(tag => tag.text === filter.value)
              : !task.tags.some(tag => tag.text === filter.value);
          default:
            return true;
        }
      });
    });
  };

  const groupTasks = (tasks: Task[], grouping: GroupingOption) => {
    if (grouping.field === 'none') return { 'All Tasks': tasks };

    const groups: { [key: string]: Task[] } = {};
    
    tasks.forEach(task => {
      let groupKey = '';
      switch (grouping.field) {
        case 'status':
          groupKey = task.status;
          break;
        case 'priority':
          groupKey = task.priority;
          break;
        case 'assignee':
          groupKey = task.assignee.name;
          break;
        case 'dueDate':
          groupKey = task.dueDate || 'No Due Date';
          break;
        default:
          groupKey = 'All Tasks';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
    });

    return groups;
  };

  const sortTasks = (tasks: Task[], sorting: SortingOption) => {
    return [...tasks].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sorting.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate || '9999-12-31');
          bValue = new Date(b.dueDate || '9999-12-31');
          break;
        case 'createdAt':
          aValue = new Date(a.scheduledDate);
          bValue = new Date(b.scheduledDate);
          break;
        case 'status':
          const statusOrder = { todo: 1, inprogress: 2, done: 3 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Custom Views
              </CardTitle>
              <CardDescription>
                Create and manage custom views with filters and groupings
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="views" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="views">Saved Views</TabsTrigger>
              <TabsTrigger value="create">Create View</TabsTrigger>
            </TabsList>

            {/* Saved Views Tab */}
            <TabsContent value="views" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {views.map((view) => (
                  <Card key={view.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{view.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          {view.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteView(view.id)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {view.description && (
                        <CardDescription className="text-xs">
                          {view.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Filter className="w-3 h-3" />
                          <span>{view.filters.length} filters</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Grid className="w-3 h-3" />
                          <span>Group by {view.grouping.field}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <List className="w-3 h-3" />
                          <span>Sort by {view.sorting.field}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleApplyView(view)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Apply View
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {views.length === 0 && (
                <div className="text-center py-8">
                  <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No custom views created yet</p>
                  <p className="text-sm text-gray-500">Create your first custom view to get started</p>
                </div>
              )}
            </TabsContent>

            {/* Create View Tab */}
            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">View Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="view-name">View Name</Label>
                      <Input
                        id="view-name"
                        value={newView.name || ''}
                        onChange={(e) => setNewView(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter view name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="view-description">Description</Label>
                      <Input
                        id="view-description"
                        value={newView.description || ''}
                        onChange={(e) => setNewView(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="grouping">Group By</Label>
                      <Select
                        value={newView.grouping?.field || 'none'}
                        onValueChange={(value) => setNewView(prev => ({
                          ...prev,
                          grouping: { ...prev.grouping!, field: value as any }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Grouping</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                          <SelectItem value="assignee">Assignee</SelectItem>
                          <SelectItem value="dueDate">Due Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="sorting">Sort By</Label>
                      <Select
                        value={newView.sorting?.field || 'title'}
                        onValueChange={(value) => setNewView(prev => ({
                          ...prev,
                          sorting: { ...prev.sorting!, field: value as any }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="title">Title</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                          <SelectItem value="dueDate">Due Date</SelectItem>
                          <SelectItem value="createdAt">Created Date</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="layout">Layout</Label>
                      <Select
                        value={newView.layout || 'grid'}
                        onValueChange={(value) => setNewView(prev => ({ ...prev, layout: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="default-view"
                      checked={newView.isDefault || false}
                      onCheckedChange={(checked) => setNewView(prev => ({ ...prev, isDefault: !!checked }))}
                    />
                    <Label htmlFor="default-view">Set as default view</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Filters Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Filters</CardTitle>
                    <Button variant="outline" size="sm" onClick={addFilter}>
                      <Filter className="w-3 h-3 mr-1" />
                      Add Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {newView.filters?.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No filters added. Click "Add Filter" to create one.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {newView.filters?.map((filter) => (
                        <div key={filter.id} className="flex items-center gap-2 p-3 border rounded-lg">
                          <Select
                            value={filter.field}
                            onValueChange={(value) => updateFilter(filter.id, { field: value as any })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="status">Status</SelectItem>
                              <SelectItem value="priority">Priority</SelectItem>
                              <SelectItem value="assignee">Assignee</SelectItem>
                              <SelectItem value="tags">Tags</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={filter.operator}
                            onValueChange={(value) => updateFilter(filter.id, { operator: value as any })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="notEquals">Not Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="notContains">Not Contains</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={filter.value as string}
                            onValueChange={(value) => updateFilter(filter.id, { value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getFilterOptions(filter.field).map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFilter(filter.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateView} disabled={!newView.name}>
                  <Save className="w-4 h-4 mr-1" />
                  Create View
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
