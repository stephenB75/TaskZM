import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  Plus,
  Settings,
} from "lucide-react";

interface WeekNavigationProps {
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
  onAutoSchedule?: () => void;
  isScheduling?: boolean;
  onAddTask?: () => void;
  viewMode?: "week" | "month";
  onViewModeChange?: (mode: "week" | "month") => void;
  onOpenSettings?: () => void;
}

export default function WeekNavigation({
  currentWeek,
  onWeekChange,
  onAutoSchedule,
  isScheduling = false,
  onAddTask,
  viewMode = "week",
  onViewModeChange,
  onOpenSettings,
}: WeekNavigationProps) {
  const getWeekStart = (date: Date) => {
    // Return the date as-is for rolling 7-day view
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getWeekEnd = (date: Date) => {
    const start = getWeekStart(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  };

  const formatWeekRange = (startDate: Date) => {
    const month = startDate.toLocaleDateString("en-US", {
      month: "long",
    });
    const year = startDate.getFullYear();
    return `${month} ${year}`;
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    onWeekChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    onWeekChange(newDate);
  };

  const goToToday = () => {
    onWeekChange(new Date());
  };

  const isCurrentWeek = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentWeekStart = getWeekStart(currentWeek);
    const currentWeekEnd = getWeekEnd(currentWeek);

    // Check if today falls within the current displayed week
    return (
      today.getTime() >= currentWeekStart.getTime() &&
      today.getTime() <= currentWeekEnd.getTime()
    );
  };

  return (
    <div className="bg-white border-b border-[#e3e3e3] px-6 py-4 flex items-center justify-between">
      {/* Week Range */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className="font-['DM_Sans:Bold',_sans-serif] font-bold leading-[23px] relative shrink-0 text-[#313131] text-[21px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {formatWeekRange(currentWeek)}
          </span>
        </div>
        {!isCurrentWeek() && (
          <button
            onClick={goToToday}
            className="flex items-center gap-2 px-3 py-2 text-[#828282] hover:text-[#313131] hover:bg-gray-100 rounded-md transition-colors"
            title="Go to Current Week"
          >
            <span
              className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[16px] relative shrink-0 text-[#828282] text-[13px]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Today
            </span>
          </button>
        )}

        {onAutoSchedule && (
          <button
            onClick={onAutoSchedule}
            disabled={isScheduling}
            className="flex items-center gap-2 px-3 py-2 text-[#828282] hover:text-[#313131] hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="AI Auto-Schedule Tasks"
          >
            <Sparkles className="w-5 h-5" />
            <span
              className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[16px] relative shrink-0 text-[#828282] text-[13px]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {isScheduling ? "Scheduling..." : "AI Schedule"}
            </span>
          </button>
        )}

      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={goToPreviousWeek}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors group"
          title="Previous Week"
        >
          <ChevronLeft className="w-5 h-5 text-[#828282] group-hover:text-[#313131]" />
        </button>

        <button
          onClick={goToNextWeek}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors group"
          title="Next Week"
        >
          <ChevronRight className="w-5 h-5 text-[#828282] group-hover:text-[#313131]" />
        </button>

        <div className="w-px h-6 bg-[#e3e3e3] mx-2" />

        <button
          onClick={() => {
            if (onViewModeChange) {
              onViewModeChange(
                viewMode === "week" ? "month" : "week",
              );
            }
          }}
          className="flex items-center gap-2 px-3 py-2 text-[#828282] hover:text-[#313131] hover:bg-gray-100 rounded-md transition-colors"
          title={`Switch to ${viewMode === "week" ? "Month" : "Week"} View`}
        >
          <Calendar className="w-5 h-5" />
          <span
            className="font-['DM_Sans:Medium',_sans-serif] font-medium text-[14px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {viewMode === "week" ? "Week View" : "Month View"}
          </span>
        </button>

        <div className="w-px h-6 bg-[#e3e3e3] mx-2" />

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3 py-2 text-[#828282] hover:text-[#313131] hover:bg-gray-100 rounded-md transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
          <span
            className="font-['DM_Sans:Medium',_sans-serif] font-medium text-[14px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Settings
          </span>
        </button>
      </div>
    </div>
  );
}