// Login 3 from Hirael <https://hirael.com/blocks/auth/login-03>
// Adapted for Nyaya Revolution — Situation-First Legal Learning

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Lock,
  Mail,
  Scale,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants";
import { useAuth } from "@/providers/auth-provider";

const ENTER =
  "animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none";

const stagger = (index: number, step = 60): React.CSSProperties => ({
  animationDelay: `${index * step}ms`,
});

const jitter = (i: number) => {
  const value = Math.sin(i + 1) * 10_000;
  return value - Math.floor(value);
};

const FloatingPaths = ({ position }: { position: number }) => {
  const reduceMotion = useReducedMotion();
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-brand"
        fill="none"
        viewBox="0 0 696 316"
        aria-hidden="true"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            initial={{ pathLength: 0.3 }}
            animate={
              reduceMotion
                ? undefined
                : { pathLength: 1, pathOffset: [0, 1, 0] }
            }
            stroke="currentColor"
            className="opacity-40"
            strokeOpacity={0.08 + path.id * 0.025}
            strokeWidth={path.width}
            transition={{
              duration: 20 + jitter(path.id) * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export interface Login03Props {
  /** Optional custom title. Defaults to legal learning headline. */
  title?: string;
  /** Optional custom subtitle. Defaults to citizen learning description. */
  subtitle?: string;
  /** Optional quote displayed in the aside visual column. */
  quote?: string;
  /** Attribution for the quote. */
  quoteAuthor?: string;
  /** Role or subtitle for the quote author. */
  quoteRole?: string;
  /** Callback fired after successful authentication. */
  onSuccess?: () => void;
  /** Custom redirect route. Defaults to /learn */
  redirectUrl?: string;
  /** Optional wrapper class. */
  className?: string;
}

export function Login03({
  title = "Sign in to Nyaya.",
  subtitle = "Continue your legal learning journey. Master your rights, test your understanding in real scenarios, and track your progress.",
  quote = "Knowledge of your legal rights is the ultimate shield in everyday life. Understanding the law empowers every citizen to act with clarity, dignity, and confidence.",
  quoteAuthor = "Citizen Legal Empowerment",
  quoteRole = "Constitution of India · Part III",
  onSuccess,
  redirectUrl = routes.learn,
  className,
}: Login03Props) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [redirecting, setRedirecting] = React.useState(false);
  const [showEmailForm, setShowEmailForm] = React.useState(false);
  const [email, setEmail] = React.useState("citizen@nyaya.org");
  const [password, setPassword] = React.useState("password123");
  const [error, setError] = React.useState<string | null>(null);

  /** Quick one-click citizen login */
  const onCitizenContinue = async () => {
    setError(null);
    setRedirecting(true);
    try {
      const result = await signIn({
        email: email || "citizen@nyaya.org",
        password: password || "password123",
      });
      if (result.error) {
        setError(result.error.message);
        setRedirecting(false);
        return;
      }
      toast.success("Welcome back to Nyaya Revolution!");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectUrl);
      }
    } catch {
      setError("An unexpected error occurred during sign-in.");
      setRedirecting(false);
    }
  };

  /** Form-based submission */
  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCitizenContinue();
  };

  return (
    <section
      data-slot="login"
      className={cn(
        "relative min-h-svh overflow-hidden bg-background lg:grid lg:grid-cols-2",
        className,
      )}
    >
      {/* ── Left Aside: Law Learning Atmosphere & Floating Paths ─────── */}
      <aside
        data-slot="login-aside"
        className="relative hidden h-full flex-col overflow-hidden border-e border-border bg-card p-10 lg:flex"
      >
        {/* Subtle Unsplash background asset representing the scales of justice & legal scholarship */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-15"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="h-full w-full object-cover mix-blend-luminosity filter"
            draggable={false}
          />
        </div>

        {/* Ambient gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--color-background) 70%, transparent), color-mix(in srgb, var(--color-card) 85%, transparent), var(--color-background))",
          }}
        />

        {/* Flowing motion vectors */}
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>

        {/* Brand header */}
        <div className={cn(ENTER, "relative z-10 flex items-center gap-3")}>
          <span className="bg-gradient-brand text-primary-foreground flex size-10 items-center justify-center rounded-xl shadow-sm">
            <Scale className="size-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground">
              Nyaya Revolution
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Situation-First Legal Learning
            </span>
          </div>
        </div>

        {/* Constitutional quote & citizen testimony */}
        <figure
          style={stagger(4)}
          className={cn(ENTER, "relative z-10 mt-auto flex flex-col gap-4")}
        >
          <div className="flex items-center gap-2">
            <span className="bg-brand/15 text-brand inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
              <ShieldCheck className="size-3.5" />
              Verified Legal Education
            </span>
          </div>
          <blockquote className="font-serif text-2xl leading-relaxed tracking-tight text-foreground md:text-3xl">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <figcaption className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="font-semibold text-foreground/80">{quoteAuthor}</span>
            <span aria-hidden className="text-border">
              |
            </span>
            <span>{quoteRole}</span>
          </figcaption>
        </figure>
      </aside>

      {/* ── Right Main: Interactive Sign-in Panel ─────────────────────── */}
      <div
        data-slot="login-main"
        className="relative flex min-h-svh flex-col justify-center px-6 py-12 sm:px-12 lg:min-h-0"
      >
        {/* Ambient radial glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
        >
          <div
            className="absolute end-0 top-0 h-96 w-96 -translate-y-24 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--color-brand) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Back to Home navigation */}
        <Button
          asChild
          variant="ghost"
          className={cn(
            ENTER,
            "absolute start-5 top-7 z-10 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-foreground",
          )}
        >
          <Link href={routes.home}>
            <ChevronLeft className="size-4 rtl:rotate-180" />
            Home
          </Link>
        </Button>

        {/* Centered Panel */}
        <div
          data-slot="login-panel"
          className="relative z-10 mx-auto w-full space-y-6 sm:max-w-md"
        >
          {/* Mobile brand header */}
          <div className={cn(ENTER, "flex items-center gap-3 lg:hidden")}>
            <span className="bg-gradient-brand text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-sm">
              <Scale className="size-4.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground">
                Nyaya Revolution
              </span>
              <span className="text-xs text-muted-foreground">
                Legal Knowledge Platform
              </span>
            </div>
          </div>

          {/* Heading */}
          <div data-slot="login-header" className="flex flex-col gap-2">
            <h1
              style={stagger(1)}
              className={cn(
                ENTER,
                "text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
              )}
            >
              {title}
            </h1>
            <p
              style={stagger(2)}
              className={cn(
                ENTER,
                "text-balance text-sm leading-relaxed text-muted-foreground",
              )}
            >
              {subtitle}
            </p>
          </div>

          {/* Error notice */}
          {error ? (
            <div
              role="alert"
              className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-xl border p-3 text-sm"
            >
              <span>{error}</span>
            </div>
          ) : null}

          {/* One-Click Sign In Button */}
          <div style={stagger(3)} className={cn(ENTER, "space-y-3")}>
            <Button
              type="button"
              variant="default"
              size="lg"
              disabled={redirecting}
              onClick={onCitizenContinue}
              className="glow-hover w-full gap-2.5 rounded-xl font-semibold"
            >
              {redirecting ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4 text-brand-foreground" />
              )}
              {redirecting
                ? "Signing in to Nyaya…"
                : "Continue as Citizen Learner"}
            </Button>
            <span role="status" className="sr-only">
              {redirecting ? "Signing in to Nyaya" : ""}
            </span>

            {/* Quick demo credentials hint */}
            <div className="text-muted-foreground/80 flex items-center justify-between px-1 text-xs">
              <span className="inline-flex items-center gap-1">
                <UserCheck className="size-3 text-brand" /> Demo Account Ready
              </span>
              <button
                type="button"
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="text-brand hover:underline"
              >
                {showEmailForm ? "Hide email form" : "Sign in with password"}
              </button>
            </div>
          </div>

          {/* Optional Email & Password form expansion */}
          {showEmailForm ? (
            <form
              onSubmit={onFormSubmit}
              style={stagger(4)}
              className={cn(
                ENTER,
                "glass space-y-3.5 rounded-2xl border border-border/60 p-4",
              )}
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="nyaya-email"
                  className="text-xs font-medium text-foreground"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <input
                    id="nyaya-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@nyaya.org"
                    className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border ps-9 pe-3 text-sm outline-none focus-visible:ring-2"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="nyaya-password"
                    className="text-xs font-medium text-foreground"
                  >
                    Password
                  </label>
                  <Link
                    href={routes.forgotPassword}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <input
                    id="nyaya-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border ps-9 pe-3 text-sm outline-none focus-visible:ring-2"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="outline"
                size="lg"
                disabled={redirecting}
                className="w-full rounded-xl"
              >
                {redirecting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Submit & Sign in"
                )}
              </Button>
            </form>
          ) : null}

          {/* New to Nyaya registration link */}
          <div style={stagger(5)} className={cn(ENTER, "text-center text-sm")}>
            <span className="text-muted-foreground">New to Nyaya Revolution? </span>
            <Link
              href={routes.signUp}
              className="text-brand font-semibold hover:underline"
            >
              Create free account
            </Link>
          </div>

          {/* Footer disclaimer */}
          <p
            style={stagger(6)}
            className={cn(
              ENTER,
              "text-center text-xs leading-relaxed text-muted-foreground",
            )}
          >
            By continuing, you agree to our{" "}
            <Link
              href={routes.glossary}
              className="text-foreground underline-offset-4 hover:underline"
            >
              terms of education
            </Link>{" "}
            and{" "}
            <Link
              href={routes.glossary}
              className="text-foreground underline-offset-4 hover:underline"
            >
              privacy policy
            </Link>
            . 100% Free & Open Legal Learning for all Indian citizens.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login03;
