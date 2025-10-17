import {
  Inbox,
  Calendar,
  CalendarDays,
  Settings,
} from "lucide-react";

interface MobileBottomNavProps {
  activePanel: "inbox" | "calendar" | "settings" | "week";
  onPanelChange: (
    panel: "inbox" | "calendar" | "settings" | "week",
  ) => void;
}

export default function MobileBottomNav({
  activePanel,
  onPanelChange,
}: MobileBottomNavProps) {
  const navItems = [
    { id: "week" as const, icon: CalendarDays, label: "Today" },
    { id: "inbox" as const, icon: Inbox, label: "Inbox" },
    {
      id: "calendar" as const,
      icon: Calendar,
      label: "Calendar",
    },
    {
      id: "settings" as const,
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e3e3e3] z-40 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPanelChange(item.id)}
              className={`
                flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg
                transition-all duration-200 min-w-[70px]
                ${
                  isActive ? "text-[#3300ff]" : "text-[#828282]"
                }
              `}
              aria-label={item.label}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-[#3300ff]" : ""}`}
              />
              <span
                className={`text-[11px] font-medium ${isActive ? "text-[#3300ff]" : "text-[#828282]"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}