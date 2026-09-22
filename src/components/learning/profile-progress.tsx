"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { LevelBadge } from "@/components/learning/level-badge";
import { ProgressRing } from "@/components/learning/progress-ring";
import { StatTile } from "@/components/learning/stat-tile";
import { WeeklyActivity } from "@/components/learning/weekly-activity";
import { Reveal } from "@/components/common/reveal";
import { journeys, learnRoutes, learnerProfile, routes } from "@/constants";
import {
  ArrowLeft,
  Award,
  Flame,
  Medal,
  Star,
  Target,
  Trophy,
  Zap,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

export function ProfileProgress() {
  const p = learnerProfile;
  const levelPct = Math.round((p.xpIntoLevel / p.xpForLevel) * 100);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      {/* Back */}
      <Link
        href={routes.learn}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to learning
      </Link>

      {/* Profile header */}
      <Reveal>
        <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="bg-brand/8 absolute -top-20 -right-20 size-56 rounded-full blur-3xl" />
          <div className="bg-brand/5 absolute -bottom-12 -left-12 size-40 rounded-full blur-2xl" />

          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <ProgressRing value={levelPct} size={112} strokeWidth={8}>
                <LevelBadge level={p.level} title="" size="md" />
              </ProgressRing>
            </motion.div>

            <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <div>
                <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                  Level {p.level} · {p.levelTitle}
                </span>
                <h1 className="text-foreground mt-1 text-3xl font-bold tracking-tight">
                  {p.name}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-muted h-2.5 w-48 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelPct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="bg-gradient-brand h-full rounded-full"
                  />
                </div>
                <span className="text-muted-foreground text-xs">
                  {p.xpIntoLevel} / {p.xpForLevel} XP
                </span>
              </div>

              <p className="text-muted-foreground text-sm">
                {p.xp.toLocaleString("en-IN")} total XP earned
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Stats grid */}
      <Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile
            icon={Zap}
            label="Total XP"
            value={p.xp.toLocaleString("en-IN")}
          />
          <StatTile
            icon={Flame}
            label="Day streak"
            value={String(p.streakDays)}
          />
          <StatTile
            icon={Medal}
            label="Badges"
            value={`${p.badges.filter((b) => b.earned).length}/${p.badges.length}`}
          />
          <StatTile
            icon={Award}
            label="Certificates"
            value={`${p.certificates.filter((c) => c.earned).length}/${p.certificates.length}`}
          />
        </div>
      </Reveal>

      {/* Weekly activity */}
      <Reveal>
        <WeeklyActivity data={p.weekly} />
      </Reveal>

      {/* Badges */}
      <Reveal>
        <section className="flex flex-col gap-5">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
            <Star className="text-brand size-5" />
            Badges
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {p.badges.map((badge) => {
              const BadgeIcon = badge.icon;
              return (
                <motion.div
                  key={badge.id}
                  whileHover={badge.earned ? { scale: 1.08, rotate: 3 } : {}}
                  className={cn(
                    "glass flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all",
                    badge.earned ? "glow-hover" : "opacity-40 grayscale",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-xl",
                      badge.earned
                        ? "bg-gradient-brand text-white shadow-lg"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <BadgeIcon className="size-6" />
                  </div>
                  <span className="text-foreground text-xs font-semibold">
                    {badge.title}
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    {badge.description}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* Achievements */}
      <Reveal>
        <section className="flex flex-col gap-5">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
            <Trophy className="text-brand size-5" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {p.achievements.map((a) => {
              const AIcon = a.icon;
              const pct = Math.round((a.current / a.target) * 100);
              return (
                <div
                  key={a.title}
                  className="glass flex items-center gap-4 rounded-2xl p-4"
                >
                  <div className="bg-brand/12 flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <AIcon className="text-brand size-5" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-sm font-semibold">
                        {a.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {a.current}/{a.target}
                      </span>
                    </div>
                    <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-gradient-brand h-full rounded-full"
                      />
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {a.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* Journey progress */}
      <Reveal>
        <section className="flex flex-col gap-5">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
            <Target className="text-brand size-5" />
            Journey progress
          </h2>
          <div className="flex flex-col gap-3">
            {journeys.map((j) => {
              const Icon = j.icon;
              return (
                <Link
                  key={j.slug}
                  href={learnRoutes.journey(j.slug)}
                  className="glass group hover:ring-brand/40 flex items-center gap-4 rounded-2xl p-4 transition-all hover:ring-1"
                >
                  <div className="bg-brand/12 flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="text-brand size-5" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground group-hover:text-brand text-sm font-semibold transition-colors">
                        {j.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {j.progress}%
                      </span>
                    </div>
                    <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                      <div
                        className="bg-gradient-brand h-full rounded-full transition-all"
                        style={{ width: `${j.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
