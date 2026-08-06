/**
 * In-memory / localStorage mock of {@link AuthService}.
 *
 * Lets the entire auth + onboarding UI be built and demoed with no backend.
 * It simulates network latency and a few deterministic error cases so the
 * loading / error / success states are all reachable. NOT for production —
 * it does not hash passwords or perform any real verification.
 */
import type {
  AuthResult,
  AuthSession,
  SignInCredentials,
  SignUpCredentials,
} from "@/types";
import type { AuthService } from "./auth-service";

const SESSION_KEY = "nyaya.auth.session";
const LATENCY = 900;

/** Emails that trigger deterministic demo errors. */
const TAKEN_EMAIL = "taken@example.com";
const WRONG_PASSWORD = "wrongpass";

function delay(ms = LATENCY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeSession(user: AuthSession["user"]): AuthSession {
  return { user, accessToken: `mock.${crypto.randomUUID()}` };
}

function persist(session: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

export class MockAuthService implements AuthService {
  async getSession(): Promise<AuthSession | null> {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  }

  async signIn({
    email,
    password,
  }: SignInCredentials): Promise<AuthResult<AuthSession>> {
    await delay();
    if (password === WRONG_PASSWORD) {
      return {
        data: null,
        error: {
          code: "invalid_credentials",
          message: "Incorrect email or password.",
        },
      };
    }
    const session = makeSession({
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0],
      emailVerified: true,
    });
    persist(session);
    return { data: session, error: null };
  }

  async signUp({
    name,
    email,
  }: SignUpCredentials): Promise<AuthResult<AuthSession>> {
    await delay();
    if (email === TAKEN_EMAIL) {
      return {
        data: null,
        error: {
          code: "email_taken",
          message: "An account with this email already exists.",
        },
      };
    }
    // New accounts start unverified — the UI routes to the verify screen.
    const session = makeSession({
      id: crypto.randomUUID(),
      email,
      name,
      emailVerified: false,
    });
    persist(session);
    return { data: session, error: null };
  }

  async signOut(): Promise<void> {
    await delay(300);
    persist(null);
  }

  async requestPasswordReset(
    email: string,
  ): Promise<AuthResult<{ email: string }>> {
    await delay();
    return { data: { email }, error: null };
  }

  async resendVerification(
    email: string,
  ): Promise<AuthResult<{ email: string }>> {
    await delay(600);
    return { data: { email }, error: null };
  }

  async verifyEmail(): Promise<AuthResult<AuthSession>> {
    await delay();
    const session = await this.getSession();
    if (!session) {
      return {
        data: null,
        error: {
          code: "no_session",
          message: "No pending verification found.",
        },
      };
    }
    const verified = makeSession({ ...session.user, emailVerified: true });
    persist(verified);
    return { data: verified, error: null };
  }
}
