import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar, FileJson, Settings } from 'lucide-react';
import { exportService, ExportOptions } from '../lib/export';
import { Task } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

export default function ExportPanel({ isOpen, onClose, tasks }: ExportPanelProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'ical' | 'json'>('csv');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    tags: [] as string[],
  });
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const options: ExportOptions = {
        format: exportFormat,
        dateRange: {
          start: new Date(dateRange.start),
          end: new Date(dateRange.end),
        },
        filters: {
          status: filters.status.length > 0 ? filters.status : undefined,
          priority: filters.priority.length > 0 ? filters.priority : undefined,
          tags: filters.tags.length > 0 ? filters.tags : undefined,
        },
        includeCompleted,
        includeArchived,
      };

      let result;
      switch (exportFormat) {
        case 'csv':
          result = exportService.exportToCSV(tasks, options);
          break;
        case 'json':
          result = exportService.exportToJSON(tasks, options);
          break;
        case 'ical':
          result = exportService.exportToICal(tasks, options);
          break;
        case 'pdf':
          result = exportService.exportToPDF(tasks, options);
          break;
        default:
          throw new Error('Unsupported export format');
      }

      if (result.success && result.data && result.filename) {
        exportService.downloadFile(result.data as Blob, result.filename);
        toast.success(`Exported ${exportFormat.toUpperCase()} successfully`);
        onClose();
      } else {
        toast.error(result.error || 'Export failed');
      }
    } catch (error) {
      toast.error(`Export failed: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterChange = (type: 'status' | 'priority' | 'tags', value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }));
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'csv': return <FileSpreadsheet className="w-4 h-4" />;
      case 'ical': return <Calendar className="w-4 h-4" />;
      case 'json': return <FileJson className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'pdf': return 'Portable Document Format - Best for printing and sharing';
      case 'csv': return 'Comma Separated Values - Best for Excel and data analysis';
      case 'ical': return 'iCalendar format - Import into calendar applications';
      case 'json': return 'JSON format - For developers and data integration';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Tasks
              </CardTitle>
              <CardDescription>
                Export your tasks in various formats
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="format" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="format">Format</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
            </TabsList>

            {/* Format Selection */}
            <TabsContent value="format" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['pdf', 'csv', 'ical', 'json'] as const).map((format) => (
                  <Card 
                    key={format}
                    className={`cursor-pointer transition-colors ${
                      exportFormat === format ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setExportFormat(format)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {getFormatIcon(format)}
                        <div>
                          <h3 className="font-medium text-sm">{format.toUpperCase()}</h3>
                          <p className="text-xs text-gray-600">
                            {getFormatDescription(format)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Filters */}
            <TabsContent value="filters" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Date Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Status Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['todo', 'inprogress', 'done'].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onCheckedChange={(checked) => 
                            handleFilterChange('status', status, !!checked)
                          }
                        />
                        <Label htmlFor={`status-${status}`} className="capitalize">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Priority Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['high', 'medium', 'low'].map((priority) => (
                      <div key={priority} className="flex items-center space-x-2">
                        <Checkbox
                          id={`priority-${priority}`}
                          checked={filters.priority.includes(priority)}
                          onCheckedChange={(checked) => 
                            handleFilterChange('priority', priority, !!checked)
                          }
                        />
                        <Label htmlFor={`priority-${priority}`} className="capitalize">
                          {priority}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Options */}
            <TabsContent value="options" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-completed"
                      checked={includeCompleted}
                      onCheckedChange={setIncludeCompleted}
                    />
                    <Label htmlFor="include-completed">
                      Include completed tasks
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-archived"
                      checked={includeArchived}
                      onCheckedChange={setIncludeArchived}
                    />
                    <Label htmlFor="include-archived">
                      Include archived tasks
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Export Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Format:</strong> {exportFormat.toUpperCase()}</p>
                    <p><strong>Date Range:</strong> {dateRange.start} to {dateRange.end}</p>
                    <p><strong>Status Filter:</strong> {filters.status.length > 0 ? filters.status.join(', ') : 'All'}</p>
                    <p><strong>Priority Filter:</strong> {filters.priority.length > 0 ? filters.priority.join(', ') : 'All'}</p>
                    <p><strong>Include Completed:</strong> {includeCompleted ? 'Yes' : 'No'}</p>
                    <p><strong>Include Archived:</strong> {includeArchived ? 'Yes' : 'No'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {exportFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
