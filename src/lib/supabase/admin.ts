/**
 * Privileged Service-Role Supabase Client (Server-Only).
 *
 * Bypasses Row Level Security (RLS) for background jobs, database seeding,
 * and verified administrative moderation tasks.
 *
 * SECURITY WARNING:
 * NEVER import this file into Client Components or expose the service role
 * key to public browser bundles.
 */

import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/config";
import type { Database } from "./types";

export function createSupabaseAdminClient() {
  if (!publicEnv.isSupabaseConfigured || !serverEnv.supabaseServiceRoleKey.trim()) {
    return null;
  }

  return createClient<Database>(
    publicEnv.supabaseUrl,
    serverEnv.supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
