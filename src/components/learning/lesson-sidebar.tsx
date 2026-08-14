"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { learnRoutes } from "@/constants";
import { BookOpen, CheckCircle, Circle, Lock } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Module } from "@/types";

interface LessonSidebarProps {
  journeySlug: string;
  modules: Module[];
  currentLessonSlug: string;
  completedCount: number;
  className?: string;
}

export function LessonSidebar({
  journeySlug,
  modules,
  currentLessonSlug,
  completedCount,
  className,
}: LessonSidebarProps) {
  let globalIndex = 0;

  return (
    <nav
      className={cn(
        "glass hidden w-64 shrink-0 flex-col gap-4 overflow-y-auto rounded-2xl p-4 xl:flex",
        className,
      )}
      aria-label="Lesson navigation"
    >
      <div className="flex items-center gap-2">
        <BookOpen className="text-brand size-4" />
        <span className="text-foreground text-sm font-semibold">Contents</span>
      </div>

      {modules.map((mod) => (
        <div key={mod.title} className="flex flex-col gap-1">
          <span className="text-muted-foreground px-2 text-[11px] font-semibold tracking-wider uppercase">
            {mod.title}
          </span>
          {mod.lessons.map((lesson) => {
            const idx = globalIndex++;
            const isCurrent = lesson.slug === currentLessonSlug;
            const isDone = idx < completedCount;
            const isLocked = idx > completedCount;

            return (
              <Link
                key={lesson.slug}
                href={
                  isLocked ? "#" : learnRoutes.lesson(journeySlug, lesson.slug)
                }
                className={cn(
                  "group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-all",
                  isCurrent
                    ? "bg-brand/12 text-brand font-medium"
                    : isDone
                      ? "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      : isLocked
                        ? "text-muted-foreground/40 cursor-not-allowed"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
                aria-current={isCurrent ? "page" : undefined}
              >
                {isDone ? (
                  <CheckCircle className="size-3.5 shrink-0 text-emerald-400" />
                ) : isCurrent ? (
                  <motion.div
                    layoutId="lesson-indicator"
                    className="bg-brand size-2 shrink-0 rounded-full"
                  />
                ) : isLocked ? (
                  <Lock className="size-3.5 shrink-0" />
                ) : (
                  <Circle className="size-3.5 shrink-0" />
                )}
                <span className="truncate">{lesson.title}</span>
                <span className="text-muted-foreground/60 ml-auto text-[10px]">
                  {lesson.readingMinutes}m
                </span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
