import React from 'react';
import {
  BarChart3,
  Activity,
  Filter,
  Users,
  Building2,
  Download,
  FileText,
  Calendar,
  Bell,
  Settings,
  Accessibility,
  Monitor,
} from 'lucide-react';

interface FeaturesMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFeatureClick: (feature: string) => void;
}

export default function FeaturesMenuPanel({ 
  isOpen, 
  onClose, 
  onFeatureClick 
}: FeaturesMenuPanelProps) {
  if (!isOpen) return null;

  const features = [
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics Dashboard',
      description: 'View productivity insights and reports'
    },
    {
      id: 'time-tracking',
      icon: Activity,
      label: 'Time Tracking',
      description: 'Track time spent on tasks'
    },
    {
      id: 'custom-views',
      icon: Filter,
      label: 'Custom Views',
      description: 'Create custom task filters and views'
    },
    {
      id: 'collaboration',
      icon: Users,
      label: 'Team Collaboration',
      description: 'Work together with your team'
    },
    {
      id: 'workspaces',
      icon: Building2,
      label: 'Workspaces',
      description: 'Manage multiple projects and workspaces'
    },
    {
      id: 'export',
      icon: Download,
      label: 'Export Tasks',
      description: 'Export your tasks in various formats'
    },
    {
      id: 'templates',
      icon: FileText,
      label: 'Task Templates',
      description: 'Create and manage task templates'
    },
    {
      id: 'calendar-sync',
      icon: Calendar,
      label: 'Calendar Sync',
      description: 'Sync with external calendars'
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      description: 'Manage notification preferences'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      description: 'App preferences and configuration'
    },
    {
      id: 'accessibility',
      icon: Accessibility,
      label: 'Accessibility',
      description: 'Accessibility options and settings'
    },
    {
      id: 'performance',
      icon: Monitor,
      label: 'Performance Monitor',
      description: 'Monitor app performance and usage'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-250"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="fixed top-0 right-0 h-full bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 ease-out"
        style={{ width: '315px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-900">Features & Tools</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-200 transition-colors rounded flex items-center justify-center"
          >
            <span className="text-gray-500">×</span>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto animate-in fade-in duration-200 delay-100 p-6">
          <div className="space-y-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => {
                    onFeatureClick(feature.id);
                    onClose();
                  }}
                  className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#3300ff]/10 flex items-center justify-center group-hover:bg-[#3300ff]/20 transition-colors">
                    <Icon className="w-5 h-5 text-[#3300ff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {feature.label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
