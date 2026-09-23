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
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  isSupabaseConfigured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
} as const;

/** Server-only backend configuration (NOT bundled into the browser). */
export const serverEnv = {
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
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
