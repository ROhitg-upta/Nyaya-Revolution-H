"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authService } from "@/services/auth";
import type {
  AuthResult,
  AuthSession,
  AuthStatus,
  AuthUser,
  SignInCredentials,
  SignUpCredentials,
} from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  signIn: (c: SignInCredentials) => Promise<AuthResult<AuthSession>>;
  signUp: (c: SignUpCredentials) => Promise<AuthResult<AuthSession>>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * App-wide auth state. Hydrates the session on mount and exposes the auth
 * actions. Backed by `authService`, so it is provider-agnostic.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let active = true;
    authService.getSession().then((s) => {
      if (!active) return;
      setSession(s);
      setStatus(s ? "authenticated" : "unauthenticated");
    });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    const result = await authService.signIn(credentials);
    if (result.data) {
      setSession(result.data);
      setStatus("authenticated");
    }
    return result;
  }, []);

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    const result = await authService.signUp(credentials);
    if (result.data) {
      setSession(result.data);
      setStatus("authenticated");
    }
    return result;
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setSession(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user: session?.user ?? null, status, signIn, signUp, signOut }),
    [session, status, signIn, signUp, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

/** Access auth state and actions. Must be used within `AuthProvider`. */
export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>.");
  }
  return ctx;
}
