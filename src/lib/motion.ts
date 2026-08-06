/**
 * Reusable Framer Motion variants and transitions.
 *
 * "Framer Motion ready": drop these into any `motion.*` element for consistent,
 * subtle entrance animations. They read their timing from `@/config/animation`
 * so the whole app shares one motion language.
 *
 * @example
 * import { motion } from "motion/react";
 * import { fadeInUp } from "@/lib/motion";
 *
 * <motion.div variants={fadeInUp} initial="hidden" animate="visible" />
 */
import type { Transition, Variants } from "motion/react";

import { duration, easing } from "@/config/animation";

/** Default transition applied to most entrances. */
export const transition: Transition = {
  duration: duration.normal,
  ease: easing.out,
};

/** Simple fade. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition },
};

/** Fade + rise — the workhorse entrance for cards and sections. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition },
};

/** Fade + gentle scale — good for modals, popovers, and media. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition },
};

/**
 * Container that staggers its children. Pair with a child variant such as
 * `fadeInUp` and set `initial="hidden" animate="visible"` on the container.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};
