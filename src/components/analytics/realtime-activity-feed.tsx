"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  Flame,
  Pause,
  Play,
  ShieldCheck,
  Zap,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import type { RealtimeLearningEvent } from "@/types";

interface RealtimeActivityFeedProps {
  events: RealtimeLearningEvent[];
  isLive: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
}

export function RealtimeActivityFeed({
  events,
  isLive,
  isPaused,
  onTogglePause,
}: RealtimeActivityFeedProps) {
  const getEventIcon = (type: RealtimeLearningEvent["eventType"]) => {
    switch (type) {
      case "practice_completed":
        return {
          icon: Zap,
          className: "bg-brand/15 text-brand border-brand/30",
        };
      case "quiz_passed":
        return {
          icon: Award,
          className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
        };
      case "streak_milestone":
        return {
          icon: Flame,
          className: "bg-amber-500/15 text-amber-500 border-amber-500/30",
        };
      case "situation_verified":
        return {
          icon: ShieldCheck,
          className: "bg-blue-500/15 text-blue-500 border-blue-500/30",
        };
    }
  };

  return (
    <div className="glass-strong border-brand/30 flex flex-col gap-5 rounded-3xl p-6 sm:p-8">
      {/* Stream Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex size-3 items-center justify-center">
            <span
              className={`absolute inline-flex size-full rounded-full opacity-75 ${
                isPaused
                  ? "bg-muted"
                  : isLive
                    ? "bg-emerald-400 animate-ping"
                    : "bg-amber-400 animate-ping"
              }`}
            />
            <span
              className={`relative inline-flex size-2 rounded-full ${
                isPaused ? "bg-muted-foreground" : isLive ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </div>
          <div>
            <h3 className="text-foreground text-lg font-bold flex items-center gap-2">
              <span>Live Citizen Learning Stream</span>
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {isPaused ? "Paused" : "Realtime SSE / Pulse"}
              </span>
            </h3>
            <p className="text-muted-foreground text-xs">
              Live notifications of citizen scenario resolutions, assessments, and advocate verifications.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onTogglePause}
          className="glass rounded-xl gap-1.5 text-xs font-semibold"
        >
          {isPaused ? (
            <>
              <Play className="size-3.5 fill-current" />
              Resume Stream
            </>
          ) : (
            <>
              <Pause className="size-3.5" />
              Pause Stream
            </>
          )}
        </Button>
      </div>

      {/* Events List */}
      <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {events.map((evt) => {
            const badge = getEventIcon(evt.eventType);
            const Icon = badge.icon;
            const timeAgo = formatTimeAgo(evt.timestamp);

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="glass hover:border-brand/40 flex items-center justify-between gap-3 rounded-2xl p-3.5 text-xs transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl border ${badge.className}`}
                  >
                    <Icon className="size-4" />
                  </span>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-bold">{evt.userName}</span>
                      <span className="bg-muted/80 text-muted-foreground rounded px-1.5 py-0.2 text-[10px] font-medium">
                        {evt.state}
                      </span>
                    </div>
                    <span className="text-foreground/90 font-medium leading-relaxed">
                      {evt.title}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="bg-brand/15 text-brand rounded-full px-2 py-0.5 text-[11px] font-bold">
                    +{evt.xpEarned} XP
                  </span>
                  <span className="text-muted-foreground text-[10px]">{timeAgo}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function formatTimeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 20) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}
