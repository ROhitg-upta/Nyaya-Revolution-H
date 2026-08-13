import { Flame } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { WeeklyActivity } from "@/types";

interface StreakCardProps {
  streakDays: number;
  weekly: WeeklyActivity[];
}

/** Learning streak with a 7-day activity strip. */
export function StreakCard({ streakDays, weekly }: StreakCardProps) {
  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <span className="bg-warning/15 text-warning flex size-11 items-center justify-center rounded-xl">
          <Flame className="size-6" />
        </span>
        <div className="flex flex-col">
          <span className="text-foreground text-2xl font-bold">
            {streakDays} days
          </span>
          <span className="text-muted-foreground text-xs">Current streak</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-1.5">
        {weekly.map((day, index) => {
          const active = day.minutes > 0;
          return (
            <div
              key={index}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                  active
                    ? "bg-gradient-brand text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {active ? <Flame className="size-3.5" /> : day.day}
              </span>
              <span className="text-muted-foreground text-[0.65rem]">
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
