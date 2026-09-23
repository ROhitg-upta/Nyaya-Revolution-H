import type { ReactNode } from "react";

import { LandingBackground } from "@/components/landing";

/**
 * Centered shell for standalone auth screens (Sign up, Forgot password,
 * Verify email, Welcome). Provides the atmospheric layered backdrop and
 * a centered column for AuthCard.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingBackground />
      <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
        {children}
      </main>
    </>
  );
}

export default AuthShell;
