"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { ProgressRing } from "@/components/learning/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { learnRoutes, lessonCount } from "@/constants";
import { Play } from "@/lib/icons";
import type { Journey } from "@/types";

interface ContinueCardProps {
  journey: Journey;
}

export function ContinueCard({ journey }: ContinueCardProps) {
  const total = lessonCount(journey);
  const doneCount = Math.round((journey.progress / 100) * total);
  const allLessons = journey.modules.flatMap((m) => m.lessons);
  const nextLesson = allLessons[doneCount] ?? allLessons[allLessons.length - 1];
  const Icon = journey.icon;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass glow-hover w-[21rem] shrink-0 rounded-2xl p-5"
    >
      <div className="flex items-start gap-4">
        <ProgressRing value={journey.progress} size={56} strokeWidth={5}>
          <span className="text-foreground text-xs font-bold">
            {journey.progress}%
          </span>
        </ProgressRing>
        <div className="flex flex-1 flex-col gap-1">
          <Badge variant="secondary" className="w-fit text-[10px]">
            {journey.category}
          </Badge>
          <span className="text-foreground text-sm font-semibold">
            {journey.title}
          </span>
        </div>
        <div className="bg-gradient-brand flex size-10 shrink-0 items-center justify-center rounded-xl shadow-md">
          <Icon className="size-5 text-white" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">
          Up next:{" "}
          <span className="text-foreground font-medium">
            {nextLesson?.title}
          </span>
        </span>
        <Link href={learnRoutes.lesson(journey.slug, nextLesson?.slug ?? "")}>
          <Button size="sm" className="w-full rounded-xl">
            <Play className="mr-1.5 size-3.5" />
            Resume
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
