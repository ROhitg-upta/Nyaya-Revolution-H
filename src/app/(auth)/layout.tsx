import type { ReactNode } from "react";

import { LandingBackground } from "@/components/landing";

/**
 * Shared shell for all auth screens: the cinematic layered background with a
 * single centered column. Individual screens supply their own glass card.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingBackground />
      <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
        {children}
      </main>
    </>
  );
}
