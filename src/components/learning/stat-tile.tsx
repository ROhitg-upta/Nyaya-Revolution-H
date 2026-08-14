"use client";

import { motion } from "motion/react";

import type { LucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

export function StatTile({
  icon: Icon,
  label,
  value,
  className,
}: StatTileProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "glass glow-hover flex flex-col items-center gap-2 rounded-2xl p-4 text-center",
        className,
      )}
    >
      <div className="bg-brand/12 flex size-10 items-center justify-center rounded-xl">
        <Icon className="text-brand size-5" />
      </div>
      <span className="text-foreground text-xl font-bold">{value}</span>
      <span className="text-muted-foreground text-xs">{label}</span>
    </motion.div>
  );
}
