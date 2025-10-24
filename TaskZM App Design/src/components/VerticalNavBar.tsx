import React from "react";
import {
  Inbox,
  Calendar,
  CalendarDays,
  Settings,
  Archive,
  Clock,
  BarChart3,
  Users,
  Download,
  FileText,
  Building2,
  Bell,
  Filter,
  Activity,
  Accessibility,
} from "lucide-react";

interface VerticalNavBarProps {
  activePanel:
    | "inbox"
    | "calendar"
    | "settings"
    | "archive"
    | "week"
    | "timeline"
    | "analytics"
    | "time-tracking"
    | "collaboration"
    | "export"
    | "templates"
    | "workspaces"
    | "calendar-sync"
    | "notifications"
    | "custom-views"
    | "accessibility"
    | null;
  onPanelChange: (
    panel:
      | "inbox"
      | "calendar"
      | "settings"
      | "archive"
      | "week"
      | "timeline"
      | "analytics"
      | "time-tracking"
      | "collaboration"
      | "export"
      | "templates"
      | "workspaces"
      | "calendar-sync"
      | "notifications"
      | "custom-views"
      | "accessibility",
  ) => void;
  viewMode: "week" | "month";
  onViewModeChange: (mode: "week" | "month") => void;
}

export default function VerticalNavBar({
  activePanel,
  onPanelChange,
  viewMode,
  onViewModeChange,
}: VerticalNavBarProps) {
  const navItems = [
    // Core Navigation
    { id: "week" as const, icon: CalendarDays, label: "Week" },
    { id: "timeline" as const, icon: Clock, label: "Timeline" },
    { id: "inbox" as const, icon: Inbox, label: "Inbox" },
    { id: "calendar" as const, icon: Calendar, label: "Calendar" },
    { id: "archive" as const, icon: Archive, label: "Archive" },
    
    // Productivity & Analytics
    { id: "analytics" as const, icon: BarChart3, label: "Analytics" },
    { id: "time-tracking" as const, icon: Activity, label: "Time Tracking" },
    { id: "custom-views" as const, icon: Filter, label: "Custom Views" },
    
    // Collaboration & Team
    { id: "collaboration" as const, icon: Users, label: "Team" },
    { id: "workspaces" as const, icon: Building2, label: "Workspaces" },
    
    // Export & Templates
    { id: "export" as const, icon: Download, label: "Export" },
    { id: "templates" as const, icon: FileText, label: "Templates" },
    
    // Integration & Notifications
    { id: "calendar-sync" as const, icon: Calendar, label: "Calendar Sync" },
    { id: "notifications" as const, icon: Bell, label: "Notifications" },
    
    // Settings & Accessibility
    { id: "settings" as const, icon: Settings, label: "Settings" },
    { id: "accessibility" as const, icon: Accessibility, label: "Accessibility" },
  ];

  return (
    <div className="w-20 h-screen flex-shrink-0 bg-white border-r border-[#e3e3e3] flex flex-col items-center py-6 gap-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        let isActive = activePanel === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "week") {
                // Toggle between week and month view
                onViewModeChange(
                  viewMode === "week" ? "month" : "week",
                );
                // Close any open panels to show the main view
                onPanelChange("week");
              } else {
                onPanelChange(item.id);
              }
            }}
            className={`
              flex items-center justify-center
              transition-all duration-200 group relative
              ${
                isActive
                  ? "text-[#3300ff]"
                  : "text-[#828282] hover:text-[#313131]"
              }
            `}
            title={
              item.id === "week"
                ? viewMode === "week"
                  ? "Switch to Month View"
                  : "Switch to Week View"
                : item.label
            }
          >
            <Icon
              className={`w-6 h-6 transition-all ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`}
            />

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#313131] text-white text-[12px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {item.id === "week"
                ? viewMode === "week"
                  ? "Switch to Month"
                  : "Switch to Week"
                : item.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}