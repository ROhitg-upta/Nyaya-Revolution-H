/**
 * Supabase-backed implementation of AuthService.
 *
 * Interacts with Supabase Auth via browser client, handling session hydration,
 * sign-in, sign-up, password reset, and token verification.
 */
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  AuthResult,
  AuthSession,
  AuthUser,
  SignInCredentials,
  SignUpCredentials,
} from "@/types";
import type { AuthService } from "./auth-service";

function mapSupabaseUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown>; email_confirmed_at?: string }): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    name: (user.user_metadata?.full_name as string) ?? (user.user_metadata?.name as string) ?? undefined,
    emailVerified: !!user.email_confirmed_at,
  };
}

export class SupabaseAuthService implements AuthService {
  async getSession(): Promise<AuthSession | null> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return null;

      return {
        user: mapSupabaseUser(session.user),
        accessToken: session.access_token,
      };
    } catch {
      return null;
    }
  }

  async signIn({ email, password }: SignInCredentials): Promise<AuthResult<AuthSession>> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return {
        data: null,
        error: { code: "CONFIGURATION_ERROR", message: "Supabase client is not configured" },
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        return {
          data: null,
          error: {
            code: error?.code ?? "INVALID_CREDENTIALS",
            message: error?.message ?? "Invalid email or password",
          },
        };
      }

      return {
        data: {
          user: mapSupabaseUser(data.session.user),
          accessToken: data.session.access_token,
        },
        error: null,
      };
    } catch (err) {
      return {
        data: null,
        error: {
          code: "NETWORK_ERROR",
          message: err instanceof Error ? err.message : "Failed to connect to authentication server",
        },
      };
    }
  }

  async signUp({ name, email, password }: SignUpCredentials): Promise<AuthResult<AuthSession>> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return {
        data: null,
        error: { code: "CONFIGURATION_ERROR", message: "Supabase client is not configured" },
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return {
          data: null,
          error: {
            code: error.code ?? "SIGNUP_FAILED",
            message: error.message,
          },
        };
      }

      if (!data.user) {
        return {
          data: null,
          error: { code: "SIGNUP_FAILED", message: "User account could not be created" },
        };
      }

      const user = mapSupabaseUser(data.user);
      const session: AuthSession = {
        user,
        accessToken: data.session?.access_token ?? `token.${user.id}`,
      };

      return { data: session, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          code: "NETWORK_ERROR",
          message: err instanceof Error ? err.message : "Sign-up request failed",
        },
      };
    }
  }

  async signOut(): Promise<void> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
  }

  async requestPasswordReset(email: string): Promise<AuthResult<{ email: string }>> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return {
        data: null,
        error: { code: "CONFIGURATION_ERROR", message: "Supabase client is not configured" },
      };
    }

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) {
        return {
          data: null,
          error: { code: error.code ?? "RESET_FAILED", message: error.message },
        };
      }

      return { data: { email }, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          code: "NETWORK_ERROR",
          message: err instanceof Error ? err.message : "Reset request failed",
        },
      };
    }
  }

  async resendVerification(email: string): Promise<AuthResult<{ email: string }>> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return {
        data: null,
        error: { code: "CONFIGURATION_ERROR", message: "Supabase client is not configured" },
      };
    }

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        return {
          data: null,
          error: { code: error.code ?? "RESEND_FAILED", message: error.message },
        };
      }

      return { data: { email }, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          code: "NETWORK_ERROR",
          message: err instanceof Error ? err.message : "Verification email could not be sent",
        },
      };
    }
  }

  async verifyEmail(token: string): Promise<AuthResult<AuthSession>> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return {
        data: null,
        error: { code: "CONFIGURATION_ERROR", message: "Supabase client is not configured" },
      };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      });

      if (error || !data.session) {
        return {
          data: null,
          error: {
            code: error?.code ?? "VERIFICATION_FAILED",
            message: error?.message ?? "Invalid or expired verification token",
          },
        };
      }

      return {
        data: {
          user: mapSupabaseUser(data.session.user),
          accessToken: data.session.access_token,
        },
        error: null,
      };
    } catch (err) {
      return {
        data: null,
        error: {
          code: "NETWORK_ERROR",
          message: err instanceof Error ? err.message : "Verification request failed",
        },
      };
    }
  }
}
