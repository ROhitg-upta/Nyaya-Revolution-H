"use client";

import { motion } from "motion/react";

import { Crown } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  title: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
} as const;

const iconSizes = { sm: "size-3", md: "size-4", lg: "size-5" } as const;

export function LevelBadge({
  level,
  title,
  size = "md",
  className,
}: LevelBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 3 }}
      className={cn("flex flex-col items-center gap-1", className)}
    >
      <div
        className={cn(
          "bg-gradient-brand relative flex items-center justify-center rounded-2xl font-bold text-white shadow-lg",
          sizes[size],
        )}
      >
        <Crown
          className={cn(
            "absolute -top-1.5 -right-1.5 rotate-12 text-amber-400",
            iconSizes[size],
          )}
        />
        {level}
      </div>
      <span className="text-muted-foreground text-[10px] font-medium">
        {title}
      </span>
    </motion.div>
  );
}
