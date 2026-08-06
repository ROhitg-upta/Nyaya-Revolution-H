"use client";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { routes, siteConfig } from "@/constants";
import { trustBadges } from "@/constants/landing";
import { ArrowRight, Scale } from "@/lib/icons";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function WelcomeView() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="flex w-full max-w-md flex-col items-center gap-8 text-center"
    >
      <motion.span
        variants={item}
        className="bg-gradient-brand glow-brand text-primary-foreground flex size-16 items-center justify-center rounded-3xl"
      >
        <Scale className="size-8" />
      </motion.span>

      <div className="flex flex-col gap-3">
        <motion.h1
          variants={item}
          className="text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          Welcome to{" "}
          <span className="text-gradient-brand">{siteConfig.name}</span>
        </motion.h1>
        <motion.p
          variants={item}
          className="text-muted-foreground text-base text-pretty sm:text-lg"
        >
          Understand your legal rights, one real situation at a time. Let&apos;s
          set up a journey made just for you.
        </motion.p>
      </div>

      <motion.div variants={item} className="flex w-full flex-col gap-3">
        <a href={routes.signUp} className="w-full">
          <Button size="lg" className="glow-hover w-full rounded-xl">
            Create your account
            <ArrowRight />
          </Button>
        </a>
        <a href={routes.signIn} className="w-full">
          <Button
            size="lg"
            variant="outline"
            className="glass w-full rounded-xl"
          >
            I already have an account
          </Button>
        </a>
      </motion.div>

      <motion.a
        variants={item}
        href={routes.home}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        Explore without an account
      </motion.a>

      <motion.ul
        variants={item}
        className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs"
      >
        {trustBadges.map((badge) => (
          <li key={badge.label} className="flex items-center gap-1.5">
            <badge.icon className="text-brand size-3.5" />
            {badge.label}
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
