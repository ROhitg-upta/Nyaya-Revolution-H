"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { DifficultyBadge } from "@/components/learning/difficulty-badge";
import { ProgressRing } from "@/components/learning/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { learnRoutes, routes } from "@/constants";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Clock,
  Layers,
  Play,
  Sparkles,
  Zap,
} from "@/lib/icons";
import type { Journey } from "@/types";

interface JourneyHeroProps {
  journey: Journey;
}

export function JourneyHero({ journey }: JourneyHeroProps) {
  const Icon = journey.icon;
  const totalLessons = journey.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0,
  );
  const completedLessons = Math.round((journey.progress / 100) * totalLessons);
  const firstLesson = journey.modules[0]?.lessons[0];
  const started = journey.progress > 0;

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          href={routes.learn}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          All journeys
        </Link>
      </motion.div>

      <div className="glass-strong overflow-hidden rounded-3xl">
        <div className="relative px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
          <div className="bg-brand/8 absolute -top-20 -right-20 size-60 rounded-full blur-3xl" />
          <div className="bg-brand/5 absolute -bottom-10 -left-10 size-40 rounded-full blur-2xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="bg-gradient-brand flex size-20 shrink-0 items-center justify-center rounded-3xl shadow-lg sm:size-24"
            >
              <Icon className="size-10 text-white sm:size-12" />
            </motion.div>

            <div className="flex flex-1 flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex flex-wrap items-center gap-2"
              >
                <DifficultyBadge difficulty={journey.difficulty} />
                <Badge variant="brand">
                  <Award className="mr-1 size-3" />
                  Certificate
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl"
              >
                {journey.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="text-muted-foreground max-w-xl text-base leading-relaxed sm:text-lg"
              >
                {journey.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm"
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="text-brand size-4" />
                  {journey.estimatedMinutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="text-brand size-4" />
                  {journey.modules.length} modules
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="text-brand size-4" />
                  {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="text-brand size-4" />
                  {journey.xpReward} XP
                </span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex shrink-0 flex-col items-center gap-3"
            >
              <ProgressRing value={journey.progress} size={96} strokeWidth={8}>
                <span className="text-foreground text-xl font-bold">
                  {journey.progress}%
                </span>
              </ProgressRing>
              <span className="text-muted-foreground text-xs">
                {completedLessons}/{totalLessons} lessons
              </span>
            </motion.div>
          </div>

          {firstLesson && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Link href={learnRoutes.lesson(journey.slug, firstLesson.slug)}>
                <Button size="lg" className="rounded-xl">
                  {started ? (
                    <>
                      <Play className="mr-1.5 size-4" />
                      Continue learning
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-1.5 size-4" />
                      Start journey
                    </>
                  )}
                </Button>
              </Link>
              <Link href={learnRoutes.quiz(journey.slug)}>
                <Button
                  variant="outline"
                  size="lg"
                  className="glass rounded-xl"
                >
                  Take quiz
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
