"use client";

import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  Scale,
  Users,
  Zap,
} from "@/lib/icons";
import { Container } from "@/components/layout";
import { useRealtimeAnalytics } from "@/hooks/use-realtime-analytics";
import { DomainVelocityMatrix } from "./domain-velocity-matrix";
import { RealtimeActivityFeed } from "./realtime-activity-feed";
import type { AnalyticsTimeframe } from "@/types";

export function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>("today");
  const { events, stats, domains, isLive, isPaused, togglePause } =
    useRealtimeAnalytics();

  const timeframes: { id: AnalyticsTimeframe; label: string }[] = [
    { id: "today", label: "Today (Live)" },
    { id: "week", label: "7 Days" },
    { id: "month", label: "30 Days" },
    { id: "all", label: "All Time" },
  ];

  return (
    <Container size="default" gutter="page" className="flex flex-col gap-10">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand/15 text-brand flex size-8 items-center justify-center rounded-xl shadow-sm">
              <Activity className="size-4.5" />
            </span>
            <span className="text-brand text-xs font-bold uppercase tracking-wider">
              Real-Time Platform Intelligence
            </span>
          </div>
          <h1 className="text-foreground mt-1 text-2xl font-bold tracking-tight sm:text-4xl">
            Learning Velocity & Grounding Analytics
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Measuring citizen legal comprehension velocity, statutory accuracy, and scenario mastery across India.
          </p>
        </div>

        {/* Timeframe Selector & Live Radar */}
        <div className="flex items-center gap-3">
          <div className="glass border-emerald-500/30 flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs">
            <span className="relative flex size-2.5">
              <span className="bg-emerald-400 absolute inline-flex size-full animate-ping rounded-full opacity-75" />
              <span className="bg-emerald-500 relative inline-flex size-2.5 rounded-full" />
            </span>
            <span className="text-foreground font-semibold">Realtime Feed: Active</span>
          </div>

          <div className="glass flex items-center gap-1 rounded-2xl p-1">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => setTimeframe(tf.id)}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                  timeframe === tf.id
                    ? "bg-brand text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top KPI Velocity Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Active Learners Right Now */}
        <div className="glass-strong border-brand/30 flex flex-col gap-2 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Active Citizens Learning
            </span>
            <span className="bg-brand/15 text-brand flex size-8 items-center justify-center rounded-xl">
              <Users className="size-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-3xl sm:text-4xl font-extrabold tracking-tight">
              {stats.activeLearnersNow}
            </span>
            <span className="text-emerald-500 text-xs font-bold">Online Now</span>
          </div>
          <span className="text-muted-foreground text-xs">
            Across 28 Indian States & UTs
          </span>
        </div>

        {/* Scenarios Solved Today */}
        <div className="glass-strong border-brand/30 flex flex-col gap-2 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Scenarios Solved Today
            </span>
            <span className="bg-emerald-500/15 text-emerald-500 flex size-8 items-center justify-center rounded-xl">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-3xl sm:text-4xl font-extrabold tracking-tight">
              {stats.scenariosCompletedToday.toLocaleString("en-IN")}
            </span>
            <span className="text-emerald-500 text-xs font-bold">+38% vs Avg</span>
          </div>
          <span className="text-muted-foreground text-xs">
            Tactical decision practice completions
          </span>
        </div>

        {/* XP Velocity Rate */}
        <div className="glass-strong border-brand/30 flex flex-col gap-2 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Platform XP Velocity
            </span>
            <span className="bg-amber-500/15 text-amber-500 flex size-8 items-center justify-center rounded-xl">
              <Zap className="size-4 fill-current" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-3xl sm:text-4xl font-extrabold tracking-tight">
              +{stats.xpVelocityPerHour.toLocaleString("en-IN")}
            </span>
            <span className="text-muted-foreground text-xs font-semibold">XP / hour</span>
          </div>
          <span className="text-muted-foreground text-xs">
            Citizen knowledge accumulation rate
          </span>
        </div>

        {/* Verified Grounding Ratio */}
        <div className="glass-strong border-brand/30 flex flex-col gap-2 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Statutory Grounding Rate
            </span>
            <span className="bg-blue-500/15 text-blue-500 flex size-8 items-center justify-center rounded-xl">
              <Scale className="size-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-3xl sm:text-4xl font-extrabold tracking-tight">
              {stats.groundingAccuracyRate}%
            </span>
            <span className="text-emerald-500 text-xs font-bold">Anti-Hallucination</span>
          </div>
          <span className="text-muted-foreground text-xs">
            Directly mapped to verified bare acts
          </span>
        </div>
      </div>

      {/* Realtime Stream Component */}
      <RealtimeActivityFeed
        events={events}
        isLive={isLive}
        isPaused={isPaused}
        onTogglePause={togglePause}
      />

      {/* Domain Learning Velocity Matrix */}
      <DomainVelocityMatrix domains={domains} />
    </Container>
  );
}
