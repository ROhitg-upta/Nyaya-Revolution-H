"use client";

import { motion } from "motion/react";

import { Flame } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { WeeklyActivity } from "@/types";

interface StreakCardProps {
  streakDays: number;
  weekly: WeeklyActivity[];
}

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakCard({ streakDays, weekly }: StreakCardProps) {
  return (
    <div className="glass-strong flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-warning/12 flex size-10 items-center justify-center rounded-xl"
          >
            <Flame className="text-warning size-5" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-foreground text-2xl font-bold">
              {streakDays}
            </span>
            <span className="text-muted-foreground text-xs">day streak</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-1.5">
        {weekly.map((d, i) => {
          const active = d.minutes > 0;
          return (
            <div
              key={d.day}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl text-xs font-bold transition-all",
                  active
                    ? "bg-gradient-brand text-white shadow-md"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {active ? <Flame className="size-4" /> : dayLabels[i]}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-foreground" : "text-muted-foreground/50",
                )}
              >
                {dayLabels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
