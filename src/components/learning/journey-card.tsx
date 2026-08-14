"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { DifficultyBadge } from "@/components/learning/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import { learnRoutes, lessonCount } from "@/constants";
import { Award, BookOpen, Clock, Zap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Journey } from "@/types";

interface JourneyCardProps {
  journey: Journey;
  fixedWidth?: boolean;
}

export function JourneyCard({ journey, fixedWidth = false }: JourneyCardProps) {
  const lessons = lessonCount(journey);
  const started = journey.progress > 0;
  const Icon = journey.icon;

  return (
    <Link
      href={learnRoutes.journey(journey.slug)}
      className={cn(
        "focus-visible:ring-ring group/card block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none",
        fixedWidth && "w-[19rem] shrink-0",
      )}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass glow-hover relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-5"
      >
        <div className="bg-brand/20 pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100" />

        <div className="relative flex items-start justify-between gap-3">
          <motion.span
            whileHover={{ scale: 1.08, rotate: 3 }}
            className="bg-gradient-brand glow-brand flex size-12 items-center justify-center rounded-2xl shadow-lg"
          >
            <Icon className="size-6 text-white" />
          </motion.span>
          <div className="flex items-center gap-1.5">
            <DifficultyBadge difficulty={journey.difficulty} />
            {journey.progress === 100 && (
              <Badge variant="success">
                <Award className="mr-0.5 size-3" />
                Done
              </Badge>
            )}
          </div>
        </div>

        <div className="relative flex flex-col gap-1.5">
          <h3 className="text-foreground group-hover/card:text-brand text-base leading-snug font-semibold transition-colors">
            {journey.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {journey.tagline}
          </p>
        </div>

        <div className="text-muted-foreground relative flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {journey.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3.5" />
            {lessons} lessons
          </span>
          <span className="text-brand flex items-center gap-1 font-medium">
            <Zap className="size-3.5" />
            {journey.xpReward} XP
          </span>
          <span className="flex items-center gap-1">
            <Award className="size-3.5" />
            Certificate
          </span>
        </div>

        <div className="relative mt-auto flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {started
                ? journey.progress === 100
                  ? "Completed"
                  : "In progress"
                : "Not started"}
            </span>
            <span className="text-foreground font-semibold">
              {journey.progress}%
            </span>
          </div>
          <div className="bg-muted h-1.5 overflow-hidden rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${journey.progress}%` }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-brand h-full rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
