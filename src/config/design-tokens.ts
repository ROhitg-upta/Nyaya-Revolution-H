/**
 * Design tokens — the TypeScript-side single source of truth for the design
 * system's non-colour scales (colour lives in CSS custom properties in
 * `globals.css` so it can flip with the theme).
 *
 * Import these when you need a token value in JS/TS (e.g. Framer Motion
 * transitions, portal z-indexes, responsive logic). In markup, prefer the
 * equivalent Tailwind utility so styling stays declarative.
 */

/** 8px spacing system. Keys are the step; values are rem strings. */
export const spacing = {
  0: "0rem",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px  — base unit
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
} as const;

/**
 * Typographic scale. Each entry pairs a font size with a sensible line height
 * (and, for display sizes, tightened tracking) for a modern, readable feel.
 */
export const typography = {
  fontFamily: {
    sans: "var(--font-sans)",
    heading: "var(--font-heading)",
    mono: "var(--font-mono)",
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
    "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
    "6xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

/** Border radius scale (mirrors the CSS `--radius-*` tokens). */
export const radii = {
  sm: "calc(var(--radius) * 0.6)",
  md: "calc(var(--radius) * 0.8)",
  lg: "var(--radius)",
  xl: "calc(var(--radius) * 1.4)",
  "2xl": "calc(var(--radius) * 1.8)",
  "3xl": "calc(var(--radius) * 2.2)",
  full: "9999px",
} as const;

/** Elevation scale (mirrors the CSS `--shadow-*` tokens). */
export const shadows = {
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  brand: "var(--shadow-brand)",
} as const;

/** Responsive breakpoints (min-width, in px). Matches Tailwind defaults. */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Z-index scale. Use named layers instead of magic numbers so stacking stays
 * predictable across overlays, popovers, and toasts.
 */
export const zIndex = {
  hide: -1,
  base: 0,
  raised: 10,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1700,
  tooltip: 1800,
} as const;

export type Spacing = keyof typeof spacing;
export type FontSize = keyof typeof typography.fontSize;
export type Radius = keyof typeof radii;
export type Shadow = keyof typeof shadows;
export type Breakpoint = keyof typeof breakpoints;
export type ZIndex = keyof typeof zIndex;
