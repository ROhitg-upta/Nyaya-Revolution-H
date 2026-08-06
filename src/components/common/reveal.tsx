"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";

import { duration, easing } from "@/config/animation";

interface RevealProps extends ComponentPropsWithoutRef<typeof motion.div> {
  /** Stagger delay in seconds (e.g. `index * 0.06`). */
  delay?: number;
  /** Vertical travel distance in px. */
  y?: number;
}

/**
 * Subtle scroll-reveal wrapper: fades and rises its children into view once.
 * Honours `prefers-reduced-motion` by rendering statically.
 */
export function Reveal({ children, delay = 0, y = 16, ...props }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <motion.div {...props}>{children}</motion.div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: duration.slow, ease: easing.out, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
