/**
 * Animation constants — durations and easing curves for subtle, premium motion.
 *
 * These are framework-agnostic primitives. Framer Motion variants that consume
 * them live in `@/lib/motion`; CSS/Tailwind animations should reference the
 * same numeric feel to stay consistent.
 */

/** Durations in seconds (for Framer Motion) — keep motion quick and subtle. */
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.5,
} as const;

/** Cubic-bezier easing curves as [x1, y1, x2, y2] tuples. */
export const easing = {
  /** Standard ease-out — good default for entrances. */
  out: [0.16, 1, 0.3, 1],
  /** Gentle ease-in-out for moves/reflows. */
  inOut: [0.65, 0, 0.35, 1],
  /** Snappy spring-like feel without an actual spring. */
  emphasized: [0.2, 0, 0, 1],
} as const;

/** CSS-string equivalents for use in inline styles or CSS variables. */
export const easingCss = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
} as const;

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
