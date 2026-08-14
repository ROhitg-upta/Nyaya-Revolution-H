"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  getJourney,
  learnRoutes,
  learnerProfile,
  siteConfig,
} from "@/constants";
import { ArrowLeft, Award, Download, PartyPopper, Scale } from "@/lib/icons";

interface CertificatePreviewProps {
  journeySlug: string;
}

export function CertificatePreview({ journeySlug }: CertificatePreviewProps) {
  const journey = getJourney(journeySlug);
  if (!journey) return null;

  const p = learnerProfile;
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      {/* Celebration header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <PartyPopper className="text-brand size-12" />
        </motion.div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Journey complete!
        </h1>
        <p className="text-muted-foreground text-base">
          You&apos;ve earned a certificate for completing {journey.title}.
        </p>
      </motion.div>

      {/* Certificate card */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.2 }}
        className="glass-strong glow-brand w-full overflow-hidden rounded-3xl"
      >
        <div className="bg-gradient-brand px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="size-5 text-white/80" />
              <span className="text-sm font-semibold text-white/90">
                {siteConfig.name}
              </span>
            </div>
            <span className="text-xs text-white/60">Certificate</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 px-8 py-10 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              Certificate of Completion
            </span>
            <div className="bg-border my-2 h-px w-16" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-muted-foreground text-sm">
              This certifies that
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-foreground text-2xl font-bold tracking-tight"
            >
              {p.name}
            </motion.span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-muted-foreground text-sm">
              has successfully completed
            </span>
            <span className="text-brand text-xl font-bold">
              {journey.title}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-brand text-lg font-bold">
                {journey.xpReward}
              </span>
              <span className="text-muted-foreground text-xs">XP earned</span>
            </div>
            <div className="bg-border h-8 w-px" />
            <div className="flex flex-col items-center gap-0.5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <Award className="text-brand size-8" />
              </motion.div>
              <span className="text-muted-foreground text-xs">Certified</span>
            </div>
            <div className="bg-border h-8 w-px" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-foreground text-sm font-semibold">
                {today}
              </span>
              <span className="text-muted-foreground text-xs">Date</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 pt-4">
            <div className="bg-border h-px w-32" />
            <span className="text-muted-foreground text-xs">
              Issued by {siteConfig.name}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled className="rounded-xl opacity-50">
          <Download className="mr-1.5 size-4" />
          Download (coming soon)
        </Button>
        <Link href={learnRoutes.journey(journeySlug)}>
          <Button variant="outline" className="glass rounded-xl">
            <ArrowLeft className="mr-1.5 size-4" />
            Back to journey
          </Button>
        </Link>
      </div>
    </div>
  );
}
