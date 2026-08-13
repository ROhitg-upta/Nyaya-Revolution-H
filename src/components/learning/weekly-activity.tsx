import { BarChart3 } from "@/lib/icons";
import type { WeeklyActivity as WeeklyActivityData } from "@/types";

/** Bar chart of the last 7 days of learning minutes. */
export function WeeklyActivity({ data }: { data: WeeklyActivityData[] }) {
  const max = Math.max(...data.map((d) => d.minutes), 1);
  const total = data.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold">
          <BarChart3 className="text-brand size-4" />
          Weekly progress
        </h3>
        <span className="text-muted-foreground text-xs">{total} min</span>
      </div>
      <div className="flex h-28 items-end justify-between gap-2">
        {data.map((day, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div className="flex h-full w-full items-end">
              <div
                className="bg-gradient-brand w-full rounded-md transition-all duration-500"
                style={{ height: `${(day.minutes / max) * 100}%` }}
                aria-label={`${day.day}: ${day.minutes} minutes`}
              />
            </div>
            <span className="text-muted-foreground text-[0.65rem]">
              {day.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
