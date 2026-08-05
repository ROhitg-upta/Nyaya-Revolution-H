/**
 * Centralised, typed access to environment variables.
 *
 * Read every environment value through this module instead of touching
 * `process.env` directly across the codebase. This gives us a single place to
 * document, validate, and (later) schema-check configuration.
 *
 * NOTE: Only variables prefixed with `NEXT_PUBLIC_` are available in the
 * browser. Server-only secrets (database URLs, service keys, AI keys) must be
 * read from server-only modules — never import them into client components.
 */

/** Reads a required variable, throwing early if it is missing at runtime. */
function required(key: string, value: string | undefined): string {
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/** Client-safe configuration (bundled into the browser). */
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000",
} as const;

/** Convenience runtime flags. */
export const env = {
  ...publicEnv,
  nodeEnv: process.env.NODE_ENV ?? "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

export { required as requiredEnv };
