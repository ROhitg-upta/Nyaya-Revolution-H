"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { responseModes } from "@/constants/ai";
import type { ResponseModeId } from "@/types";
import { ChevronDown, Check } from "@/lib/icons";

interface ResponseModeSelectorProps {
  value: ResponseModeId;
  onChange: (mode: ResponseModeId) => void;
}

export function ResponseModeSelector({
  value,
  onChange,
}: ResponseModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const current = responseModes.find((m) => m.id === value) ?? responseModes[0];
  const Icon = current.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass border-border/40 hover:border-brand/30 flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all"
      >
        <Icon className="text-brand size-3.5" />
        <span className="text-foreground text-xs font-medium">
          {current.label}
        </span>
        <ChevronDown
          className={cn(
            "text-muted-foreground size-3 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="glass-strong border-border/50 absolute bottom-full left-0 z-50 mb-2 w-72 overflow-hidden rounded-xl border shadow-xl"
            >
              <div className="border-border/30 border-b px-3 py-2">
                <p className="text-foreground text-xs font-semibold">
                  Response Mode
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Choose how Nyaya explains your rights
                </p>
              </div>
              <div className="p-1.5">
                {responseModes.map((mode) => {
                  const ModeIcon = mode.icon;
                  const isActive = mode.id === value;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        onChange(mode.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                        isActive ? "bg-brand/10" : "hover:bg-muted/50",
                      )}
                    >
                      <ModeIcon
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          isActive ? "text-brand" : "text-muted-foreground",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isActive ? "text-brand" : "text-foreground",
                          )}
                        >
                          {mode.label}
                        </p>
                        <p className="text-muted-foreground text-[11px] leading-snug">
                          {mode.description}
                        </p>
                      </div>
                      {isActive && (
                        <Check className="text-brand mt-0.5 size-4 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
