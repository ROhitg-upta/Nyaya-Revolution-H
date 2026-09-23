import type { Metadata } from "next";
import { AppHeader } from "@/components/common/app-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { SituationSubmitForm } from "@/components/situations/situation-submit-form";

export const metadata: Metadata = {
  title: "Submit a Legal Situation · Nyaya Revolution",
  description:
    "Contribute real-world legal encounters to Nyaya Revolution. Advocates review and codify statutory remedies for fellow Indian citizens.",
};

export default function SubmitSituationPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen py-10">
        <SituationSubmitForm />
      </main>
      <LandingFooter />
    </>
  );
}
