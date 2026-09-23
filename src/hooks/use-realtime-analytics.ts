"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { analyticsService } from "@/services/analytics/analytics.service";
import type {
  IndianLegalDomainVelocity,
  PlatformVelocitySummary,
  RealtimeLearningEvent,
} from "@/types";

export function useRealtimeAnalytics() {
  const [events, setEvents] = useState<RealtimeLearningEvent[]>(() =>
    analyticsService.getRecentLearningEvents()
  );
  const [stats, setStats] = useState<PlatformVelocitySummary>(() =>
    analyticsService.getPlatformVelocitySummary()
  );
  const [domains, setDomains] = useState<IndianLegalDomainVelocity[]>(() =>
    analyticsService.getDomainVelocityMetrics()
  );
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    let channel: ReturnType<NonNullable<ReturnType<typeof getSupabaseBrowserClient>>["channel"]> | null = null;
    let timer: NodeJS.Timeout | null = null;
    const supabase = getSupabaseBrowserClient();

    // 1. Attempt Supabase Realtime Subscription if client is available
    if (supabase) {
      try {
        channel = supabase
          .channel("learning-velocity-feed")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "user_activity_logs",
            },
            (payload: { new: Record<string, unknown> }) => {
              if (isPausedRef.current) return;
              const newLog = payload.new as {
                id?: string;
                activity_type?: string;
                xp_earned?: number;
                created_at?: string;
              };
              const newEvent: RealtimeLearningEvent = {
                id: newLog.id ?? `evt-${Date.now()}`,
                userName: "Citizen Learner",
                state: "India",
                eventType:
                  newLog.activity_type === "ai_practice_completed"
                    ? "practice_completed"
                    : "quiz_passed",
                title:
                  newLog.activity_type === "ai_practice_completed"
                    ? `Solved Scenario (+${newLog.xp_earned} XP)`
                    : `Completed Assessment (+${newLog.xp_earned} XP)`,
                xpEarned: newLog.xp_earned ?? 25,
                timestamp: newLog.created_at ?? new Date().toISOString(),
              };

              setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
              setStats((prev) => ({
                ...prev,
                scenariosCompletedToday: prev.scenariosCompletedToday + 1,
                activeLearnersNow: prev.activeLearnersNow + (Math.random() > 0.5 ? 1 : 0),
              }));
            }
          )
          .subscribe((status: string) => {
            if (status === "SUBSCRIBED") {
              setIsLive(true);
            }
          });
      } catch (err) {
        console.warn("Realtime channel subscription error, using pulse generator:", err);
      }
    }

    // 2. Pulse generator for continuous lively demonstration & offline mode
    timer = setInterval(() => {
      if (isPausedRef.current) return;

      const simEvent = analyticsService.generateSimulatedEvent();
      setEvents((prev) => [simEvent, ...prev.slice(0, 19)]);

      setStats((prev) => {
        const deltaLearners = Math.floor(Math.random() * 5) - 2; // -2 to +2 jitter
        return {
          ...prev,
          activeLearnersNow: Math.max(310, prev.activeLearnersNow + deltaLearners),
          scenariosCompletedToday: prev.scenariosCompletedToday + 1,
          lastUpdated: new Date().toISOString(),
        };
      });

      // Micro-fluctuate random domain learner count
      setDomains((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        const target = updated[idx];
        if (target) {
          updated[idx] = {
            ...target,
            activeLearners: target.activeLearners + 1,
            completedScenarios: target.completedScenarios + 1,
          };
        }
        return updated;
      });
    }, 5500);

    return () => {
      if (timer) clearInterval(timer);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const togglePause = () => {
    setIsPaused((p) => !p);
  };

  return {
    events,
    stats,
    domains,
    isLive,
    isPaused,
    togglePause,
  };
}
