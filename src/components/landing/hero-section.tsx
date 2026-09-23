"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  ImageStreamHero,
  type StreamImage,
} from "@/components/ui/image-stream-hero";
import { routes } from "@/constants";
import { trustBadges } from "@/constants/landing";
import { ArrowRight, ChevronDown, Search, Sparkles } from "@/lib/icons";

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

/** Curated legal & civic situation imagery cycling through the 3D perspective corridor. */
const HERO_STREAM_IMAGES: StreamImage[] = [
  {
    src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    alt: "Scales of justice symbol of constitutional rights and law",
  },
  {
    src: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80",
    alt: "Legal library and statutory law references",
  },
  {
    src: "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=800&q=80",
    alt: "Pillars of justice neoclassical court architecture",
  },
  {
    src: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    alt: "Gavel resting on an open legal statute book",
  },
  {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    alt: "College students learning campus rights and consumer safety",
  },
  {
    src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    alt: "Keys to tenant apartment and rental agreement protections",
  },
  {
    src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    alt: "Cyber fraud protection and digital security lock",
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    alt: "Citizens and legal advocates in collaborative discussion",
  },
  {
    src: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80",
    alt: "Consumer making digital payment with transaction rights",
  },
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    alt: "Modern civic architecture reflecting rule of law",
  },
  {
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    alt: "Citizen reviewing employment agreement and contract terms",
  },
  {
    src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
    alt: "Road transport safety and traffic regulation awareness",
  },
];

export function HeroSection() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <ImageStreamHero
        images={HERO_STREAM_IMAGES}
        cards={10}
        speed={22}
        axis={50}
        className="relative flex min-h-[92dvh] w-full items-center justify-center border-b border-border/40 bg-background pt-28 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32"
      >
        {/* Soft radial backdrop to keep typography readable while keeping corridor 3D depth visible on the sides */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, var(--color-background) 0%, color-mix(in srgb, var(--color-background) 85%, transparent) 45%, color-mix(in srgb, var(--color-background) 35%, transparent) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-5 text-center sm:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-7"
          >
            {/* Pill badge */}
            <motion.span
              variants={item}
              className="glass text-muted-foreground inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
            >
              <span className="bg-brand size-1.5 animate-pulse rounded-full" />
              <Sparkles className="text-brand size-3.5" />
              Situation-first legal learning for every citizen
            </motion.span>

            {/* Main Headline */}
            <motion.h1
              variants={item}
              className="text-foreground text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Understand your{" "}
              <span className="text-gradient-brand">legal rights</span>,
              <br />
              front and centre.
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={item}
              className="text-muted-foreground max-w-2xl text-balance text-base leading-relaxed sm:text-lg"
            >
              Nyaya Revolution turns confusing laws into clear, practical
              guidance — so you always know your rights and your next step.
            </motion.p>

            {/* Search bar */}
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
              <Link href={routes.situations}>
                <Button
                  type="button"
                  size="lg"
                  className="glow-hover shrink-0 rounded-full"
                >
                  Explore
                </Button>
              </Link>
            </motion.form>

            {/* Primary & secondary CTA actions */}
            <motion.div
              variants={item}
              className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row"
            >
              <Link href={routes.signUp}>
                <Button
                  size="lg"
                  className="glow-hover w-full rounded-full px-6 sm:w-auto"
                >
                  Start learning free
                  <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
                </Button>
              </Link>
              <Link href={routes.situations}>
                <Button
                  size="lg"
                  variant="outline"
                  className="glass w-full rounded-full px-6 sm:w-auto"
                >
                  Explore situations
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.ul
              variants={item}
              className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
            >
              {trustBadges.map((badge) => (
                <li key={badge.label} className="flex items-center gap-1.5">
                  <badge.icon className="text-brand size-4" />
                  {badge.label}
                </li>
              ))}
            </motion.ul>
          </motion.div>
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
      </ImageStreamHero>
    </section>
  );
}

export default HeroSection;
