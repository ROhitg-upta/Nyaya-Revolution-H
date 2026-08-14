"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { Award } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface AchievementPopupProps {
  title: string;
  description: string;
  show: boolean;
  onDone?: () => void;
  className?: string;
}

export function AchievementPopup({
  title,
  description,
  show,
  onDone,
  className,
}: AchievementPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 3500);
    return () => clearTimeout(t);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -30 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={cn(
            "pointer-events-none fixed bottom-20 left-1/2 z-50 w-80 -translate-x-1/2",
            className,
          )}
        >
          <div className="glass-strong flex items-center gap-4 rounded-2xl p-4 shadow-2xl">
            <div className="bg-gradient-brand flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Award className="size-6 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                Achievement unlocked
              </span>
              <span className="text-foreground text-sm font-bold">{title}</span>
              <span className="text-muted-foreground text-xs">
                {description}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
