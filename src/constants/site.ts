/**
 * Static, app-wide constants. No secrets, no runtime state — just values that
 * are safe to import anywhere (client or server).
 */

export const siteConfig = {
  name: "Nyaya Revolution",
  shortName: "Nyaya",
  description:
    "India's first situation-based legal learning platform — learn the law through real-life scenarios.",
  locale: "en-IN",
} as const;

export type SiteConfig = typeof siteConfig;
