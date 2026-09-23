"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info,
  RotateCcw,
  Target,
} from "@/lib/icons";
import { Container } from "@/components/layout";
import { initialKnowledgeProgress } from "@/constants";

export function KnowledgeDashboard() {
  const data = initialKnowledgeProgress;

  return (
    <Container size="default" gutter="page">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="glass text-brand inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold">
            <Brain className="size-3.5" />
            Legal Knowledge Telemetry
          </span>
        </div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          My Legal Knowledge
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Track your comprehension of citizen rights, identify weak areas, and reinforce statutory memory.
        </p>

        {/* Educational Disclaimer */}
        <div className="border-border/70 bg-muted/20 text-muted-foreground mt-2 flex items-start gap-3 rounded-2xl border p-4 text-xs leading-relaxed">
          <Info className="text-brand mt-0.5 size-4 shrink-0" />
          <span>
            <strong className="text-foreground">Educational Progress Notice: </strong>
            This dashboard reflects personal educational learning engagement and awareness on Nyaya Revolution. It does <strong>not</strong> constitute legal competence, certification to practice law, or professional qualification.
          </span>
        </div>
      </div>

      {/* Top Metric Tiles */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-medium">Overall Mastery</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-foreground text-2xl font-bold">{data.overallMastery}%</span>
            <span className="text-xs text-emerald-500 font-semibold">+4% this week</span>
          </div>
          <div className="bg-muted h-1.5 w-full rounded-full overflow-hidden">
            <div
              className="bg-gradient-brand h-full rounded-full"
              style={{ width: `${data.overallMastery}%` }}
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-medium">Lessons Finished</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-foreground text-2xl font-bold">{data.lessonsCompleted}</span>
            <span className="text-xs text-muted-foreground">across journeys</span>
          </div>
          <span className="text-brand text-xs font-semibold flex items-center gap-1">
            <BookOpen className="size-3" />
            Active Learner
          </span>
        </div>

        <div className="glass rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-medium">Quiz Accuracy</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-foreground text-2xl font-bold">{data.overallAccuracy}%</span>
            <span className="text-xs text-muted-foreground">in 8 quizzes</span>
          </div>
          <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
            <Target className="size-3" />
            Solid Retention
          </span>
        </div>

        <div className="glass rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-medium">Learning Streak</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-foreground text-2xl font-bold">{data.streakDays}</span>
            <span className="text-xs text-muted-foreground">days streak</span>
          </div>
          <span className="text-amber-500 text-xs font-semibold flex items-center gap-1">
            <Flame className="size-3" />
            Keep it going!
          </span>
        </div>
      </div>

      {/* Recommended Next Step Hero */}
      <div className="glass-strong border-brand/40 mt-8 flex flex-col gap-4 rounded-3xl p-6 sm:p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-brand text-xs font-bold uppercase tracking-wider">
            Targeted Next Recommendation
          </span>
          <h3 className="text-foreground text-xl font-bold">
            {data.recommendedNextLesson.title}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-xl">
            {data.recommendedNextLesson.reason}
          </p>
        </div>
        <Link
          href={`/learn/${data.recommendedNextLesson.journeySlug}/${data.recommendedNextLesson.slug}`}
          className="shrink-0"
        >
          <button
            type="button"
            className="bg-gradient-brand text-primary-foreground flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold shadow-sm transition-transform hover:scale-[1.02]"
          >
            <span>Continue Learning</span>
            <ChevronRight className="size-4" />
          </button>
        </Link>
      </div>

      {/* Main Grid: Domain Mastery & Weak vs Strong Topics */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols): Domain Mastery Bars */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass rounded-3xl p-6">
            <h3 className="text-foreground text-base font-bold">
              Legal Domain Mastery
            </h3>
            <p className="text-muted-foreground text-xs mt-1">
              Comprehension calculated from completed lessons and scenario evaluations.
            </p>

            <div className="mt-6 flex flex-col gap-5">
              {data.categories.map((cat) => (
                <div key={cat.category} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-semibold">
                      {cat.categoryTitle}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          cat.status === "strong"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : cat.status === "weak"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {cat.status}
                      </span>
                      <span className="text-foreground font-bold">{cat.progressPct}%</span>
                    </div>
                  </div>

                  <div className="bg-muted h-2 w-full rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.progressPct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        cat.status === "strong"
                          ? "bg-emerald-500"
                          : cat.status === "weak"
                            ? "bg-amber-500"
                            : "bg-brand"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revision Queue */}
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-base font-bold">
                  Recommended Revision Queue
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Targeted drills to eliminate misconceptions and strengthen statutory knowledge.
                </p>
              </div>
              <RotateCcw className="text-brand size-5" />
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {data.revisionRecommendations.map((rec) => (
                <Link
                  key={rec.slug}
                  href={rec.href}
                  className="glass hover:border-brand/40 group flex items-center justify-between rounded-xl p-4 transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-brand/10 text-brand rounded px-1.5 py-0.2 text-[10px] font-bold uppercase">
                        {rec.type}
                      </span>
                      <h4 className="text-foreground group-hover:text-brand text-sm font-semibold transition-colors">
                        {rec.title}
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-xs">{rec.reason}</p>
                  </div>
                  <ChevronRight className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Strong & Weak Breakdown + Recently Learned */}
        <div className="flex flex-col gap-6">
          {/* Weak Topics */}
          <div className="glass border-amber-500/30 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="size-4" />
              Focus Areas (Weak Topics)
            </div>
            <ul className="mt-3 flex flex-col gap-2.5 text-xs text-muted-foreground">
              {data.weakTopics.map((topic, i) => (
                <li key={i} className="glass flex items-start gap-2 rounded-xl p-3">
                  <span className="text-amber-500 font-bold">•</span>
                  <span className="text-foreground/90 leading-relaxed font-medium">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strong Topics */}
          <div className="glass border-emerald-500/30 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="size-4" />
              Mastered Areas (Strong Topics)
            </div>
            <ul className="mt-3 flex flex-col gap-2.5 text-xs text-muted-foreground">
              {data.strongTopics.map((topic, i) => (
                <li key={i} className="glass flex items-start gap-2 rounded-xl p-3">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span className="text-foreground/90 leading-relaxed font-medium">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recently Learned */}
          <div className="glass rounded-3xl p-6">
            <h4 className="text-foreground text-sm font-bold">
              Recently Completed
            </h4>
            <div className="mt-3 flex flex-col gap-2">
              {data.recentlyLearned.map((rec) => (
                <div key={rec.slug} className="flex items-center justify-between text-xs py-1.5 border-b border-border/30 last:border-0">
                  <span className="text-foreground font-medium">{rec.title}</span>
                  <span className="text-muted-foreground/70">{rec.completedAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
