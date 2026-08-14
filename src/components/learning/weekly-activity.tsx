"use client";

import { motion } from "motion/react";

import { BarChart3 } from "@/lib/icons";
import type { WeeklyActivity as WeeklyData } from "@/types";

interface WeeklyActivityProps {
  data: WeeklyData[];
}

export function WeeklyActivity({ data }: WeeklyActivityProps) {
  const max = Math.max(...data.map((d) => d.minutes), 1);
  const total = data.reduce((s, d) => s + d.minutes, 0);

  return (
    <div className="glass-strong flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand/12 flex size-9 items-center justify-center rounded-xl">
            <BarChart3 className="text-brand size-4" />
          </div>
          <span className="text-foreground text-sm font-semibold">
            Weekly activity
          </span>
        </div>
        <span className="text-muted-foreground text-xs">{total} min total</span>
      </div>

      <div className="flex items-end justify-between gap-2">
        {data.map((d, i) => {
          const pct = Math.round((d.minutes / max) * 100);
          return (
            <div
              key={d.day}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <span className="text-muted-foreground text-[10px]">
                {d.minutes > 0 ? `${d.minutes}m` : ""}
              </span>
              <div className="bg-muted flex h-24 w-full items-end overflow-hidden rounded-lg">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="bg-gradient-brand w-full rounded-lg"
                />
              </div>
              <span className="text-muted-foreground text-[10px] font-medium">
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
