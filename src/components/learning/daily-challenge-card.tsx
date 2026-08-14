"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { learnRoutes } from "@/constants";
import { Sparkles, Target, Zap } from "@/lib/icons";
import type { DailyChallenge } from "@/types";

interface DailyChallengeCardProps {
  challenge: DailyChallenge;
}

export function DailyChallengeCard({ challenge }: DailyChallengeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-strong glow-hover relative overflow-hidden rounded-2xl p-6"
    >
      <div className="bg-brand/10 absolute -top-16 -right-16 size-40 rounded-full blur-2xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-brand flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-lg">
            <Target className="size-6 text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                Daily challenge
              </span>
              <span className="text-warning flex items-center gap-1 text-xs font-bold">
                <Zap className="size-3" />+{challenge.xp} XP
              </span>
            </div>
            <h3 className="text-foreground text-base font-bold">
              {challenge.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {challenge.description}
            </p>
          </div>
        </div>

        <Link href={learnRoutes.quiz(challenge.journeySlug)}>
          <Button className="rounded-xl">
            <Sparkles className="mr-1.5 size-4" />
            Start challenge
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
