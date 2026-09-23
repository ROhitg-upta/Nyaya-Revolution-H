/**
 * Auth service entry point.
 *
 * Exposes a unified AuthService. When Supabase environment variables are configured,
 * it delegates to SupabaseAuthService. Otherwise, it gracefully falls back to
 * MockAuthService for local development, demoing, and testing.
 */
import { publicEnv } from "@/config";
import type { AuthService } from "./auth-service";
import { MockAuthService } from "./mock-auth-service";
import { SupabaseAuthService } from "./supabase-auth-service";

export type { AuthService } from "./auth-service";

export const authService: AuthService = publicEnv.isSupabaseConfigured
  ? new SupabaseAuthService()
  : new MockAuthService();
