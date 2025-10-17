interface TimelineProps {
  currentWeek: Date;
}

export default function WeeklyTimeline({
  currentWeek,
}: TimelineProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <div
      className="bg-white border-r border-[#e3e3e3] flex-shrink-0 w-20 h-full"
      data-name="Timeline"
    >
      {/* Header */}
      <div className="h-[58px] border-b border-[#e3e3e3] flex items-center justify-center">
        <p
          className="font-['DM_Sans:Medium',_sans-serif] font-medium text-[12px] text-[#828282] uppercase tracking-wide"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          Time
        </p>
      </div>

      {/* Timeline Hours */}
      <div className="flex flex-col">
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-16 border-b border-[#f4f4f4] flex items-start justify-center pt-2 relative"
          >
            <p
              className="font-['DM_Sans:Regular',_sans-serif] font-normal text-[11px] text-[#828282] text-center leading-tight"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {formatHour(hour)}
            </p>

            {/* Current time indicator */}
            {(() => {
              const now = new Date();
              const currentHour = now.getHours();
              const currentMinutes = now.getMinutes();

              if (hour === currentHour) {
                const topOffset = (currentMinutes / 60) * 64; // 64px is the height of each hour block
                return (
                  <div
                    className="absolute left-0 w-full h-0.5 bg-red-500 z-10"
                    style={{ top: `${topOffset}px` }}
                  >
                    <div className="absolute left-0 w-2 h-2 bg-red-500 rounded-full -translate-y-1/2 -translate-x-1/2" />
                  </div>
                );
              }
              return null;
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}