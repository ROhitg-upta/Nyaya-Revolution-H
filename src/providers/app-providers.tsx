"use client";

import type { ReactNode } from "react";

/**
 * Single composition point for all client-side React context providers
 * (theme, query client, analytics, feature flags, …).
 *
 * Add new providers by nesting them here rather than editing the root layout.
 * Today it is a pass-through — the foundation is in place for providers to be
 * added without touching `app/layout.tsx` again.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
