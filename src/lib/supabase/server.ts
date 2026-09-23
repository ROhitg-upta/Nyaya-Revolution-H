/**
 * Server-side Supabase client for Next.js App Router.
 *
 * Designed for use in:
 * - Server Components
 * - Server Actions ("use server")
 * - Route Handlers (app/api/)
 *
 * Reads and sets cookies securely via Next.js `next/headers`.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "@/config";
import type { Database } from "./types";

export async function createSupabaseServerClient() {
  if (!publicEnv.isSupabaseConfigured) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Can be ignored in Server Components where cookies are read-only
          }
        },
      },
    },
  );
}
