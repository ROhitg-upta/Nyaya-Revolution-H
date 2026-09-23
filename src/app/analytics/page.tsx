import type { Metadata } from "next";
import { AppHeader } from "@/components/common/app-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export const metadata: Metadata = {
  title: "Realtime Learning Velocity Analytics · Nyaya Revolution",
  description:
    "Live platform analytics tracking citizen learning velocity, pass rates, and statutory grounding across 7 Indian legal domains.",
};

export default function AnalyticsPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen py-10">
        <AnalyticsDashboard />
      </main>
      <LandingFooter />
    </>
  );
}
