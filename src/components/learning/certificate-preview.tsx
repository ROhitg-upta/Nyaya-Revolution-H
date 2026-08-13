"use client";

import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  getJourney,
  learnRoutes,
  learnerProfile,
  siteConfig,
} from "@/constants";
import {
  ArrowLeft,
  Award,
  Download,
  PartyPopper,
  Scale,
  Sparkles,
} from "@/lib/icons";

export function CertificatePreview({ journeySlug }: { journeySlug: string }) {
  const journey = getJourney(journeySlug);
  const reduceMotion = useReducedMotion();
  if (!journey) return null;

  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-5 py-12 sm:px-8">
      {/* completion celebration */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <span className="bg-gradient-brand text-primary-foreground glow-brand flex size-16 items-center justify-center rounded-3xl">
          <PartyPopper className="size-8" />
        </span>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Journey complete!
        </h1>
        <p className="text-muted-foreground text-sm">
          You&apos;ve earned your {journey.title} certificate.
        </p>
      </motion.div>

      {/* certificate */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass-strong ring-brand/20 relative w-full overflow-hidden rounded-3xl p-8 ring-1 sm:p-12"
      >
        <div className="bg-brand/15 pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl" />
        <div className="relative flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-brand text-primary-foreground flex size-9 items-center justify-center rounded-xl">
              <Scale className="size-5" />
            </span>
            <span className="text-foreground text-lg font-semibold tracking-tight">
              {siteConfig.name}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-brand text-xs font-semibold tracking-[0.2em] uppercase">
              Certificate of Completion
            </span>
            <div className="via-brand/40 mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent to-transparent" />
          </div>

          <p className="text-muted-foreground text-sm">This certifies that</p>
          <p className="text-gradient-brand text-3xl font-bold">
            {learnerProfile.name}
          </p>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            has successfully completed the{" "}
            <span className="text-foreground font-semibold">
              {journey.title}
            </span>{" "}
            learning journey and demonstrated awareness of the associated legal
            concepts.
          </p>

          <div className="mt-2 flex items-center gap-2">
            <Award className="text-warning size-5" />
            <span className="text-foreground text-sm font-semibold">
              +{journey.xpReward} XP earned
            </span>
          </div>

          <div className="mt-4 flex w-full items-end justify-between gap-6 text-left">
            <div className="flex flex-col">
              <span className="text-foreground border-border border-b pb-1 text-sm font-medium">
                {date}
              </span>
              <span className="text-muted-foreground mt-1 text-xs">
                Date issued
              </span>
            </div>
            <span className="bg-brand/12 text-brand flex size-12 items-center justify-center rounded-full">
              <Sparkles className="size-6" />
            </span>
            <div className="flex flex-col text-right">
              <span className="text-foreground border-border border-b pb-1 text-sm font-medium">
                {siteConfig.name}
              </span>
              <span className="text-muted-foreground mt-1 text-xs">
                Issued by
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Button size="lg" className="glow-hover rounded-xl" disabled>
          <Download />
          Download (soon)
        </Button>
        <a href={learnRoutes.journey(journey.slug)}>
          <Button
            size="lg"
            variant="outline"
            className="glass w-full rounded-xl"
          >
            <ArrowLeft />
            Back to journey
          </Button>
        </a>
      </div>
    </div>
  );
}
