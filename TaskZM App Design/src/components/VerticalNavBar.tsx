import React from "react";
import {
  Inbox,
  Calendar,
  Menu,
  Settings,
} from "lucide-react";

interface VerticalNavBarProps {
  activePanel:
    | "inbox"
    | "calendar"
    | "menu"
    | "settings"
    | null;
  onPanelChange: (
    panel:
      | "inbox"
      | "calendar"
      | "menu"
      | "settings",
  ) => void;
}

export default function VerticalNavBar({
  activePanel,
  onPanelChange,
}: VerticalNavBarProps) {
  const navItems = [
    { id: "inbox" as const, icon: Inbox, label: "Inbox" },
    { id: "calendar" as const, icon: Calendar, label: "Calendar" },
    { id: "settings" as const, icon: Settings, label: "Settings" },
    { id: "menu" as const, icon: Menu, label: "More" },
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
              onPanelChange(item.id);
            }}
            className={`
              flex items-center justify-center w-12 h-12 rounded-lg
              transition-all duration-200 group relative
              ${
                isActive
                  ? "text-[#3300ff] bg-[#3300ff]/5"
                  : "text-[#828282] hover:text-[#313131] hover:bg-gray-50"
              }
            `}
            title={item.label}
          >
            <Icon
              className={`w-7 h-7 transition-all ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`}
            />

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#313131] text-white text-[12px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {item.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}