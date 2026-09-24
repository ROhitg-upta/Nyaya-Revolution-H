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

/**
 * Resolves the first non-empty candidate into a guaranteed valid absolute URL.
 * Handles empty strings (`""`), whitespace, and bare domains (e.g. `VERCEL_URL` without `https://`).
 */
function resolveValidUrl(...candidates: Array<string | undefined>): string {
  const fallback = "http://localhost:3000";
  for (const raw of candidates) {
    const trimmed = raw?.trim();
    if (!trimmed) continue;
    const withProtocol =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;
    try {
      return new URL(withProtocol).toString().replace(/\/$/, "");
    } catch {
      continue;
    }
  }
  return fallback;
}

function isValidHttpUrl(raw: string | undefined): boolean {
  const trimmed = raw?.trim();
  if (!trimmed || (!trimmed.startsWith("http://") && !trimmed.startsWith("https://"))) {
    return false;
  }
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

const resolvedAppUrl = resolveValidUrl(
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  process.env.NEXT_PUBLIC_VERCEL_URL,
  process.env.VERCEL_URL,
);

/** Client-safe configuration (bundled into the browser). */
export const publicEnv = {
  appUrl: resolvedAppUrl,
  siteUrl: resolveValidUrl(
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    resolvedAppUrl,
  ),
  supabaseUrl: isValidHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!.trim()
    : "",
  supabaseAnonKey: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim(),
  isSupabaseConfigured: Boolean(
    isValidHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
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
