"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

import { Sparkles } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface XpToastProps {
  xp: number;
  show: boolean;
  onDone?: () => void;
  className?: string;
}

export function XpToast({ xp, show, onDone, className }: XpToastProps) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      onDone?.();
    }, 2000);
    return () => clearTimeout(t);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2",
            className,
          )}
        >
          <div className="bg-gradient-brand flex items-center gap-2 rounded-full px-5 py-2.5 shadow-xl">
            <Sparkles className="size-5 text-white" />
            <span className="text-sm font-bold text-white">+{xp} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
