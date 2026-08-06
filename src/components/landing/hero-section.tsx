"use client";

import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { situations, trustBadges } from "@/constants/landing";
import { ArrowRight, ChevronDown, Scale, Search, Sparkles } from "@/lib/icons";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/** Floating glass card used in the hero visual composition. */
function FloatingCard({
  icon: Icon,
  title,
  subtitle,
  className,
  delay = 0,
  float = true,
}: {
  icon: typeof Scale;
  title: string;
  subtitle: string;
  className?: string;
  delay?: number;
  float?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <motion.div
        animate={
          reduceMotion || !float
            ? undefined
            : {
                y: [0, -10, 0],
                transition: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
        className="glass flex items-center gap-3 rounded-2xl p-3.5"
      >
        <span className="bg-brand/15 text-brand ring-brand/20 flex size-9 items-center justify-center rounded-xl ring-1">
          <Icon className="size-4.5" />
        </span>
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">{title}</span>
          <span className="text-muted-foreground text-xs">{subtitle}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeroVisual() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative hidden h-[30rem] lg:block">
      {/* Central emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="bg-brand/20 absolute inset-0 rounded-full blur-3xl" />
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -14, 0],
                  transition: {
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
          className="glass-strong relative flex size-52 items-center justify-center rounded-[2rem]"
        >
          <div className="bg-gradient-brand glow-brand flex size-28 items-center justify-center rounded-3xl">
            <Scale className="text-primary-foreground size-14" />
          </div>
        </motion.div>
      </motion.div>

      <FloatingCard
        icon={situations[0].icon}
        title="Tenant rights"
        subtitle="Deposit disputes"
        delay={0.3}
        className="absolute top-6 -left-2"
      />
      <FloatingCard
        icon={situations[1].icon}
        title="Cyber fraud"
        subtitle="Report & recover"
        delay={0.45}
        className="absolute top-24 right-0"
      />
      <FloatingCard
        icon={Sparkles}
        title="AI Tutor"
        subtitle="Coming soon"
        delay={0.6}
        className="absolute bottom-8 left-6"
      />
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 pt-28 pb-24 sm:px-8 lg:grid-cols-2 lg:pt-36 lg:pb-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start gap-7 text-left"
        >
          <motion.span
            variants={item}
            className="glass text-muted-foreground inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
          >
            <span className="bg-brand size-1.5 animate-pulse rounded-full" />
            Situation-first legal learning for every citizen
          </motion.span>

          <motion.h1
            variants={item}
            className="text-foreground text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Understand your{" "}
            <span className="text-gradient-brand">legal rights</span>, one real
            situation at a time.
          </motion.h1>

          <motion.p
            variants={item}
            className="text-muted-foreground max-w-xl text-lg leading-relaxed text-pretty"
          >
            Nyaya Revolution turns confusing laws into clear, practical guidance
            — so you always know your rights and your next step.
          </motion.p>

          {/* Search bar — UI only */}
          <motion.form
            variants={item}
            onSubmit={(event) => event.preventDefault()}
            role="search"
            className="glass focus-within:ring-ring/50 flex w-full max-w-xl items-center gap-2 rounded-full p-1.5 pl-4 transition focus-within:ring-2"
          >
            <Search className="text-muted-foreground size-5 shrink-0" />
            <input
              type="text"
              aria-label="Search legal situations"
              placeholder="Try “my landlord won't return my deposit”"
              className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none sm:text-base"
            />
            <Button
              type="submit"
              size="lg"
              className="glow-hover shrink-0 rounded-full"
            >
              Explore
            </Button>
          </motion.form>

          <motion.div
            variants={item}
            className="flex flex-col items-stretch gap-3 sm:flex-row"
          >
            <Button size="lg" className="glow-hover rounded-full px-6">
              Start learning free
              <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass rounded-full px-6"
            >
              Browse categories
            </Button>
          </motion.div>

          <motion.ul
            variants={item}
            className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
          >
            {trustBadges.map((badge) => (
              <li key={badge.label} className="flex items-center gap-1.5">
                <badge.icon className="text-brand size-4" />
                {badge.label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <HeroVisual />
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#categories"
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-muted-foreground hover:text-foreground absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 transition-colors sm:flex"
      >
        <span className="text-xs">Scroll to explore</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-5" />
        </motion.span>
      </motion.a>
    </section>
  );
}
