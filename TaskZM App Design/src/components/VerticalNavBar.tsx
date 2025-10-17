import {
  Inbox,
  Calendar,
  CalendarDays,
  Settings,
  Archive,
} from "lucide-react";

interface VerticalNavBarProps {
  activePanel:
    | "inbox"
    | "calendar"
    | "settings"
    | "archive"
    | "week"
    | null;
  onPanelChange: (
    panel:
      | "inbox"
      | "calendar"
      | "settings"
      | "archive"
      | "week",
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
    { id: "inbox" as const, icon: Inbox, label: "Inbox" },
    {
      id: "calendar" as const,
      icon: Calendar,
      label: "Calendar",
    },
    { id: "week" as const, icon: CalendarDays, label: "Week" },
    { id: "archive" as const, icon: Archive, label: "Archive" },
    {
      id: "settings" as const,
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div className="w-16 h-screen flex-shrink-0 bg-white border-r border-[#e3e3e3] flex flex-col items-center py-6 gap-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        let isActive = false;

        if (item.id === "inbox") {
          isActive = activePanel === "inbox";
        } else if (item.id === "calendar") {
          isActive = activePanel === "calendar";
        } else if (item.id === "settings") {
          isActive = activePanel === "settings";
        } else if (item.id === "archive") {
          isActive = activePanel === "archive";
        } else if (item.id === "week") {
          isActive =
            activePanel === null || activePanel === "week";
        }

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
              } else if (
                item.id === "inbox" ||
                item.id === "calendar" ||
                item.id === "settings" ||
                item.id === "archive"
              ) {
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