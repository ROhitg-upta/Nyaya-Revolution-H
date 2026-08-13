import type { ReactNode } from "react";

import { AppHeader } from "@/components/common";
import { LandingBackground } from "@/components/landing";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingBackground />
      <AppHeader />
      <main className="min-h-dvh">{children}</main>
    </>
  );
}
