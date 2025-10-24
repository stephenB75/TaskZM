import React from 'react';
import { Home, Calendar, BarChart3, Users, Settings, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useMobileTouch } from '../hooks/useMobileTouch';

interface MobileBottomNavProps {
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
  onAddTask: () => void;
}

export default function MobileBottomNav({
  activePanel,
  onPanelChange,
  onAddTask,
}: MobileBottomNavProps) {
  const { isTouchDevice } = useMobileTouch();

  const navItems = [
    { id: 'week', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'collaboration', icon: Users, label: 'Team' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleNavClick = (panelId: string) => {
    // Haptic feedback for touch devices
    if (isTouchDevice && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    onPanelChange(panelId);
  };

  const handleAddTaskClick = () => {
    // Haptic feedback for touch devices
    if (isTouchDevice && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
    
    onAddTask();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex items-center justify-between">
        {/* Navigation Items */}
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`
                  flex flex-col items-center gap-1 h-12 px-2 min-w-0 flex-1
                  ${isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                  transition-colors duration-150
                `}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Add Task Button */}
        <Button
          onClick={handleAddTaskClick}
          className="
            ml-2 h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700
            shadow-lg hover:shadow-xl transition-all duration-200
            active:scale-95
          "
          size="sm"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
}