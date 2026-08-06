"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  /** Target number to count to. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Animation length in seconds. */
  durationSeconds?: number;
  className?: string;
}

/**
 * Counts from 0 to `value` when it scrolls into view. Falls back to the final
 * value immediately when reduced motion is preferred. Presentational only.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  durationSeconds = 1.6,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      // Jump straight to the final value when motion is not wanted.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, durationSeconds]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {prefix}
      {Math.round(display).toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
