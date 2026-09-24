import type { Metadata } from "next";
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
      <div className="min-h-screen py-10">
        <SituationSubmitForm />
      </div>
      <LandingFooter />
    </>
  );
}
