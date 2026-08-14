"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { ContinueCard } from "@/components/learning/continue-card";
import { DailyChallengeCard } from "@/components/learning/daily-challenge-card";
import { JourneyCard } from "@/components/learning/journey-card";
import { LevelBadge } from "@/components/learning/level-badge";
import { ProgressRing } from "@/components/learning/progress-ring";
import { SectionRow } from "@/components/learning/section-row";
import { StreakCard } from "@/components/learning/streak-card";
import { WeeklyActivity } from "@/components/learning/weekly-activity";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import {
  bookmarks,
  dailyChallenge,
  inProgressJourneys,
  journeys,
  journeysByTag,
  learnRoutes,
  learnerProfile,
  learningDisclaimer,
  routes,
} from "@/constants";
import {
  Award,
  Bookmark,
  BookmarkCheck,
  Compass,
  Flame,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Zap,
} from "@/lib/icons";

export function LearningHome() {
  const p = learnerProfile;
  const levelPct = Math.round((p.xpIntoLevel / p.xpForLevel) * 100);
  const continueJourneys = inProgressJourneys();
  const recommended = journeysByTag("recommended");
  const trending = journeysByTag("trending");
  const recent = journeysByTag("recent");
  const profileBased = journeysByTag("profile");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong relative overflow-hidden rounded-3xl"
      >
        <div className="bg-brand/8 absolute -top-24 -right-24 size-64 rounded-full blur-3xl" />
        <div className="bg-brand/5 absolute -bottom-16 -left-16 size-48 rounded-full blur-2xl" />

        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-5">
            <LevelBadge level={p.level} title={p.levelTitle} size="lg" />
            <div className="flex flex-col gap-1">
              <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {p.name}
              </h1>
              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <Zap className="text-brand size-4" />
                  {p.xp.toLocaleString("en-IN")} XP
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="text-warning size-4" />
                  {p.streakDays}-day streak
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="bg-muted h-2 w-40 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelPct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="bg-gradient-brand h-full rounded-full"
                  />
                </div>
                <span className="text-muted-foreground text-xs">
                  {p.xpIntoLevel}/{p.xpForLevel} XP to next level
                </span>
              </div>
            </div>
          </div>

          <Link href={routes.learnProfile}>
            <Button variant="outline" className="glass rounded-xl">
              <User className="mr-1.5 size-4" />
              View profile
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Daily challenge */}
      <Reveal>
        <DailyChallengeCard challenge={dailyChallenge} />
      </Reveal>

      {/* Continue learning */}
      {continueJourneys.length > 0 && (
        <Reveal>
          <SectionRow
            icon={Play}
            title="Continue learning"
            description="Pick up where you left off."
          >
            {continueJourneys.map((j) => (
              <ContinueCard key={j.slug} journey={j} />
            ))}
          </SectionRow>
        </Reveal>
      )}

      {/* Streak + Weekly activity */}
      <Reveal>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StreakCard streakDays={p.streakDays} weekly={p.weekly} />
          <WeeklyActivity data={p.weekly} />
        </div>
      </Reveal>

      {/* Recommended */}
      {recommended.length > 0 && (
        <Reveal>
          <SectionRow
            icon={Sparkles}
            title="Recommended for you"
            description="Curated starting points based on your interests."
            seeAllHref={routes.learn}
          >
            {recommended.map((j) => (
              <JourneyCard key={j.slug} journey={j} fixedWidth />
            ))}
          </SectionRow>
        </Reveal>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <Reveal>
          <SectionRow
            icon={TrendingUp}
            title="Trending journeys"
            description="What learners are exploring right now."
          >
            {trending.map((j) => (
              <JourneyCard key={j.slug} journey={j} fixedWidth />
            ))}
          </SectionRow>
        </Reveal>
      )}

      {/* Recently added */}
      {recent.length > 0 && (
        <Reveal>
          <SectionRow
            icon={Star}
            title="Recently added"
            description="Fresh journeys just published."
          >
            {recent.map((j) => (
              <JourneyCard key={j.slug} journey={j} fixedWidth />
            ))}
          </SectionRow>
        </Reveal>
      )}

      {/* Based on profile */}
      {profileBased.length > 0 && (
        <Reveal>
          <SectionRow
            icon={Compass}
            title="Based on your profile"
            description="Matched to your onboarding choices."
          >
            {profileBased.map((j) => (
              <JourneyCard key={j.slug} journey={j} fixedWidth />
            ))}
          </SectionRow>
        </Reveal>
      )}

      {/* Certificates */}
      <Reveal>
        <section className="flex flex-col gap-5">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
            <Award className="text-brand size-5" />
            Certificates
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.certificates.map((c) => (
              <Link
                key={c.journeySlug}
                href={
                  c.earned
                    ? learnRoutes.certificate(c.journeySlug)
                    : learnRoutes.journey(c.journeySlug)
                }
                className="glass glow-hover group flex items-center gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5"
              >
                <span
                  className={
                    c.earned
                      ? "bg-gradient-brand glow-brand flex size-12 items-center justify-center rounded-xl shadow-lg"
                      : "bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-xl"
                  }
                >
                  <Award
                    className={c.earned ? "size-6 text-white" : "size-5"}
                  />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-foreground group-hover:text-brand text-sm font-semibold transition-colors">
                    {c.title}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {c.earned ? `Earned · ${c.date}` : "In progress"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <Reveal>
          <section className="flex flex-col gap-5">
            <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
              <BookmarkCheck className="text-brand size-5" />
              Bookmarks
            </h2>
            <div className="flex flex-col gap-2.5">
              {bookmarks.map((b) => (
                <Link
                  key={b.lessonSlug}
                  href={learnRoutes.lesson(b.journeySlug, b.lessonSlug)}
                  className="glass hover:ring-brand/40 group flex items-center gap-3 rounded-xl p-4 transition-all hover:ring-1"
                >
                  <Bookmark className="text-brand size-4 shrink-0" />
                  <div className="flex flex-1 flex-col">
                    <span className="text-foreground group-hover:text-brand text-sm font-medium transition-colors">
                      {b.title}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {b.journeyTitle}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* All journeys */}
      <Reveal>
        <section className="flex flex-col gap-5">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
            <Compass className="text-brand size-5" />
            All journeys
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((j, i) => (
              <Reveal key={j.slug} delay={(i % 3) * 0.05} className="h-full">
                <JourneyCard journey={j} />
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <p className="text-muted-foreground/60 text-center text-xs">
        {learningDisclaimer}
      </p>
    </div>
  );
}
