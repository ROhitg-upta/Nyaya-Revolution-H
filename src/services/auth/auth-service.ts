/**
 * Auth service contract.
 *
 * The entire app depends on this interface — never on a concrete provider.
 * Today it's fulfilled by `MockAuthService`; swapping in a Supabase-backed
 * implementation later requires zero changes to UI or context code.
 */
import type {
  AuthResult,
  AuthSession,
  SignInCredentials,
  SignUpCredentials,
} from "@/types";

export interface AuthService {
  /** Returns the persisted session, or null if signed out. */
  getSession(): Promise<AuthSession | null>;
  signIn(credentials: SignInCredentials): Promise<AuthResult<AuthSession>>;
  signUp(credentials: SignUpCredentials): Promise<AuthResult<AuthSession>>;
  signOut(): Promise<void>;
  /** Sends a password-reset email (no-op in the mock). */
  requestPasswordReset(email: string): Promise<AuthResult<{ email: string }>>;
  /** Re-sends the verification email. */
  resendVerification(email: string): Promise<AuthResult<{ email: string }>>;
  /** Confirms an email address from a verification token/link. */
  verifyEmail(token: string): Promise<AuthResult<AuthSession>>;
}
