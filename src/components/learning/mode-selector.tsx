"use client";

import {
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  RotateCcw,
  Scale,
} from "@/lib/icons";
import type { LearningModeId } from "@/types";

interface ModeSelectorProps {
  currentMode: LearningModeId;
  onModeChange: (mode: LearningModeId) => void;
  hasScenario?: boolean;
  hasFlashcards?: boolean;
}

export function ModeSelector({
  currentMode,
  onModeChange,
  hasScenario = true,
  hasFlashcards = true,
}: ModeSelectorProps) {
  const modes: {
    id: LearningModeId;
    label: string;
    description: string;
    icon: typeof BookOpen;
    badge?: string;
  }[] = [
    {
      id: "learn",
      label: "Learn",
      description: "Structured guide",
      icon: BookOpen,
    },
    {
      id: "quick",
      label: "Quick Learn",
      description: "3-min core rights",
      icon: Clock,
      badge: "2-5 Min",
    },
    {
      id: "deep",
      label: "Deep Study",
      description: "Statutes & Precedents",
      icon: Scale,
      badge: "In-Depth",
    },
    {
      id: "scenario",
      label: "Scenario",
      description: "Decision challenge",
      icon: Brain,
      badge: hasScenario ? "Active" : undefined,
    },
    {
      id: "revision",
      label: "Revision",
      description: "Flashcards & Recall",
      icon: RotateCcw,
      badge: hasFlashcards ? "Cards" : undefined,
    },
    {
      id: "test",
      label: "Test",
      description: "Quick quiz",
      icon: CheckCircle2,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Learning Modes"
      className="glass border-border/70 grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 rounded-2xl p-1.5 sm:gap-2"
    >
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = currentMode === m.id;
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${m.id}`}
            type="button"
            onClick={() => onModeChange(m.id)}
            className={`group relative flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all sm:flex-1 sm:min-w-[100px] sm:px-4 sm:py-2.5 cursor-pointer ${
              isActive
                ? "bg-gradient-brand text-primary-foreground shadow-sm font-bold"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="truncate">{m.label}</span>
            {m.badge ? (
              <span
                className={`hidden rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-tight xl:inline ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-brand/10 text-brand"
                }`}
              >
                {m.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
