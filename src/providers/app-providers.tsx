"use client";

import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/theme-provider";

/**
 * Single composition point for all client-side React context providers
 * (theme, tooltips, and — later — query client, analytics, feature flags).
 *
 * Add new providers by nesting them here rather than editing the root layout.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
