import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { learnRoutes, routes, situationRoute } from "@/constants/routes";
import type { StoryLearningBridgeData } from "@/types/community";

interface StoryLearningBridgeProps {
  bridge: StoryLearningBridgeData;
  storyTitle?: string;
}

export function StoryLearningBridge({
  bridge,
  storyTitle,
}: StoryLearningBridgeProps) {
  return (
    <section
      aria-label="Learn from this situation bridge"
      className="border-brand/30 from-brand/10 via-background to-background relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 shadow-sm sm:p-8"
    >
      {/* Authority Separation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="size-4" />
          VERIFIED LEGAL LEARNING BRIDGE
        </div>
        <span className="text-muted-foreground text-xs font-medium">
          Citizen Experience → Verified Indian Statutory Framework
        </span>
      </div>

      <h2 className="text-foreground mt-4 text-xl font-bold tracking-tight sm:text-2xl">
        Learn From This Situation: {bridge.situationTitle}
      </h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        While the story above reflects one citizen&apos;s personal experience, the
        cards below link directly to{" "}
        <strong className="text-foreground">
          Nyaya Revolution&apos;s verified legal education modules
        </strong>{" "}
        under <span className="text-brand font-semibold">{bridge.legalAreaTitle}</span>.
      </p>

      {/* Core Statutory Principle Box */}
      <div className="border-border/80 bg-background/90 mt-5 rounded-2xl border p-4">
        <div className="flex items-start gap-3">
          <Scale className="text-brand mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-foreground text-xs font-bold tracking-wider uppercase">
              Core Statutory Protection ({bridge.legalAreaTitle})
            </p>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {bridge.rightsSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 3-Column Action Grid: Situation Guide, Learning Journey, Related Concepts */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {/* 1. Situation Guide */}
        <div className="border-border/70 bg-background/80 flex flex-col justify-between rounded-2xl border p-4">
          <div>
            <span className="text-brand inline-flex items-center gap-1.5 text-[11px] font-bold uppercase">
              <Compass className="size-3.5" />
              1. Verified Situation Guide
            </span>
            <h3 className="text-foreground mt-2 text-sm font-bold">
              {bridge.situationTitle}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              Step-by-step Do&apos;s, Don&apos;ts, documents required, and official
              helpline workflows.
            </p>
          </div>
          <Link
            href={situationRoute(bridge.situationSlug)}
            className="text-brand mt-4 inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
          >
            Open Situation Playbook
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* 2. Structured Learning Journey & Lessons */}
        <div className="border-border/70 bg-background/80 flex flex-col justify-between rounded-2xl border p-4">
          <div>
            <span className="text-brand inline-flex items-center gap-1.5 text-[11px] font-bold uppercase">
              <BookOpen className="size-3.5" />
              2. Recommended Lessons
            </span>
            <h3 className="text-foreground mt-2 text-sm font-bold">
              {bridge.journeyTitle}
            </h3>
            <ul className="mt-2 space-y-1.5">
              {bridge.recommendedLessons.map((lesson) => (
                <li
                  key={lesson.slug}
                  className="text-muted-foreground flex items-center justify-between gap-2 text-xs"
                >
                  <span className="line-clamp-1">• {lesson.title}</span>
                  <span className="text-foreground/70 shrink-0 text-[10px] font-semibold">
                    {lesson.durationMinutes}m
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={learnRoutes.journey(bridge.journeySlug)}
            className="text-brand mt-4 inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
          >
            Start Learning Journey
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* 3. AI Practice Scenario */}
        <div className="border-border/70 bg-background/80 flex flex-col justify-between rounded-2xl border p-4">
          <div>
            <span className="text-brand inline-flex items-center gap-1.5 text-[11px] font-bold uppercase">
              <Sparkles className="size-3.5" />
              3. Practice Scenario (+25 XP)
            </span>
            <h3 className="text-foreground mt-2 text-sm font-bold">
              Test Your Readiness
            </h3>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {bridge.practiceScenarioPrompt}
            </p>
          </div>
          <Link
            href={`${routes.ai}?q=${encodeURIComponent(
              `Help me practice how to handle: ${storyTitle || bridge.situationTitle}`
            )}`}
            className="bg-gradient-brand text-primary-foreground mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm transition hover:opacity-95"
          >
            Practice With AI Companion
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Key Statutory Concepts */}
      {bridge.relatedConcepts.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {bridge.relatedConcepts.map((concept) => (
            <div
              key={concept.title}
              className="border-border/60 bg-background/60 flex items-start gap-2.5 rounded-xl border p-3.5"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <div>
                <p className="text-foreground text-xs font-bold">
                  {concept.title}
                </p>
                <p className="text-brand text-[11px] font-semibold">
                  {concept.statutoryReference}
                </p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {concept.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
