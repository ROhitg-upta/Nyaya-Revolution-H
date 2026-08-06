import type { Metadata } from "next";

import { LandingBackground } from "@/components/landing";
import { OnboardingWizard } from "@/components/onboarding";

export const metadata: Metadata = { title: "Personalize your journey" };

export default function OnboardingPage() {
  return (
    <>
      <LandingBackground />
      <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
        <OnboardingWizard />
      </main>
    </>
  );
}
