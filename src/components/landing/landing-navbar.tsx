"use client";

import { AppHeader } from "@/components/common/app-header";

/**
 * Unified Landing & Product Navigation Bar.
 * Delegates to the adaptive AppHeader so the landing page and application
 * share one consistent, route-aware Mega Menu & Command Search experience.
 */
export function LandingNavbar() {
  return <AppHeader />;
}
