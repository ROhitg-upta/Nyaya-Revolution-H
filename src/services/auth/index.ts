/**
 * Auth service entry point.
 *
 * The rest of the app imports `authService` from here and only knows about the
 * {@link AuthService} interface. To go live, implement `SupabaseAuthService`
 * against the same interface and swap the single line below — nothing else in
 * the codebase changes.
 *
 * @example (future)
 *   import { SupabaseAuthService } from "./supabase-auth-service";
 *   export const authService: AuthService = new SupabaseAuthService();
 */
import { MockAuthService } from "./mock-auth-service";
import type { AuthService } from "./auth-service";

export type { AuthService } from "./auth-service";

export const authService: AuthService = new MockAuthService();
