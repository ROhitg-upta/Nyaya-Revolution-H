/**
 * Browser-side Supabase client singleton.
 *
 * Uses `@supabase/ssr` to maintain auth state and cookies in the browser.
 * Safe to import and call in client components.
 */

import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/config";
import type { Database } from "./types";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null =
  null;

export function getSupabaseBrowserClient() {
  if (!publicEnv.isSupabaseConfigured) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(
      publicEnv.supabaseUrl,
      publicEnv.supabaseAnonKey,
    );
  }

  return clientInstance;
}

export const supabase = getSupabaseBrowserClient();
