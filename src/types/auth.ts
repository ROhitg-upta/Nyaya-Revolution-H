/**
 * Authentication domain types. Shaped to map cleanly onto Supabase Auth so the
 * mock service can be swapped for the real one without touching UI code.
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  /** Whether the email address has been confirmed. */
  emailVerified: boolean;
}

export interface AuthSession {
  user: AuthUser;
  /** Opaque access token — real value supplied by Supabase later. */
  accessToken: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

/** Normalised auth error — never leak raw provider internals to the UI. */
export interface AuthError {
  code: string;
  message: string;
}

export type AuthResult<T> =
  { data: T; error: null } | { data: null; error: AuthError };
