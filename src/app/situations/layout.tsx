import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { LandingBackground } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { routes, siteConfig } from "@/constants";
import { Scale } from "@/lib/icons";

function AppHeader() {
  return (
    <header className="border-border/50 bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href={routes.home} className="flex items-center gap-2">
          <span className="bg-gradient-brand glow-brand text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <Scale className="size-4.5" />
          </span>
          <span className="text-foreground text-base font-semibold tracking-tight">
            {siteConfig.name}
          </span>
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={routes.signIn}>
            <Button size="sm" className="glow-hover rounded-full px-5">
              Log in
            </Button>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default function SituationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <LandingBackground />
      <AppHeader />
      <main className="min-h-dvh">{children}</main>
    </>
  );
}
