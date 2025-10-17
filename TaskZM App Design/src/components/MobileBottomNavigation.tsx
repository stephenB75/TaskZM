import React from 'react';
import { useMobile } from '../hooks/useMobile';
import { Home, Inbox, Calendar, Settings, Bell } from 'lucide-react';

interface MobileBottomNavigationProps {
  activeTab: 'week' | 'inbox' | 'calendar' | 'settings';
  onTabChange: (tab: 'week' | 'inbox' | 'calendar' | 'settings') => void;
  notificationCount?: number;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeTab,
  onTabChange,
  notificationCount = 0
}) => {
  const { isMobile, hapticFeedback } = useMobile();

  const handleTabClick = async (tab: 'week' | 'inbox' | 'calendar' | 'settings') => {
    await hapticFeedback('light');
    onTabChange(tab);
  };

  if (!isMobile) return null;

  const tabs = [
    { id: 'week', icon: Home, label: 'Week' },
    { id: 'inbox', icon: Inbox, label: 'Inbox' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ] as const;

  return (
    <div className="mobile-bottom-nav">
      {tabs.map(({ id, icon: Icon, label }) => {
        const isActive = activeTab === id;
        const showBadge = id === 'inbox' && notificationCount > 0;
        
        return (
          <button
            key={id}
            className={`nav-tab ${isActive ? 'active' : ''}`}
            onClick={() => handleTabClick(id)}
          >
            <div className="nav-icon-wrapper">
              <Icon size={20} />
              {showBadge && (
                <div className="notification-badge">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </div>
              )}
            </div>
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
      
      <style jsx>{`
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
          z-index: 1000;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .nav-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 60px;
          -webkit-tap-highlight-color: transparent;
        }
        
        .nav-tab:active {
          transform: scale(0.95);
        }
        
        .nav-icon-wrapper {
          position: relative;
          margin-bottom: 4px;
        }
        
        .nav-icon-wrapper svg {
          color: #828282;
          transition: color 0.2s ease;
        }
        
        .nav-tab.active .nav-icon-wrapper svg {
          color: #3300ff;
        }
        
        .nav-label {
          font-size: 10px;
          color: #828282;
          transition: color 0.2s ease;
          font-weight: 500;
        }
        
        .nav-tab.active .nav-label {
          color: #3300ff;
        }
        
        .notification-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: #d32f2f;
          color: white;
          border-radius: 10px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          padding: 0 4px;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};