import type { Metadata } from "next";
import {
  ActionTrustSection,
  AiShowcaseSection,
  CategoriesSection,
  CommunityShowcaseSection,
  FaqSection,
  HeroSection,
  HowItWorksSection,
  ImpactPhilosophySection,
  LandingBackground,
  LandingFooter,
  LandingNavbar,
  LearningShowcaseSection,
  ProductPreviewsSection,
  SituationsSection,
} from "@/components/landing";

export const metadata: Metadata = {
  title: "Nyaya Revolution — Situation-First Legal Awareness & Citizen Action",
  description:
    "Turn everyday legal confusion into clear, practical guidance. Explore 60+ verified situations, grounded AI explanations, learning journeys, DLSA legal aid, and private case preparation.",
  keywords: [
    "Indian law",
    "citizen rights",
    "legal awareness",
    "cyber fraud 1930",
    "tenant rights",
    "consumer protection act",
    "BNSS zero FIR",
    "DLSA legal aid",
    "Lok Adalat",
  ],
};

/**
 * Next-Gen Landing Experience for Nyaya Revolution (Sprint E19).
 * Product-led, situation-first, and backed by a universal search architecture.
 */
export default function HomePage() {
  return (
    <>
      <LandingBackground />
      <LandingNavbar />
      <main id="main" className="flex flex-col">
        {/* 1. Hero with Live Search & Situation Prompts */}
        <HeroSection />

        {/* 2. Situation Categories Explorer */}
        <CategoriesSection />

        {/* 3. Real Curated Situations Showcase */}
        <SituationsSection />

        {/* 4. Six-Step Citizen Action Journey */}
        <HowItWorksSection />

        {/* 5. Product-in-a-Product Live Previews */}
        <ProductPreviewsSection />

        {/* 6. Structured Learning Journeys Showcase */}
        <LearningShowcaseSection />

        {/* 7. Community Voice & Shared Experiences */}
        <CommunityShowcaseSection />

        {/* 8. Grounded AI Philosophy Showcase */}
        <AiShowcaseSection />

        {/* 9. Citizen Action Center & Trust Infrastructure */}
        <ActionTrustSection />

        {/* 10. Platform Impact & Rights Literacy Philosophy */}
        <ImpactPhilosophySection />

        {/* 11. Authoritative FAQs */}
        <FaqSection />
      </main>
      {/* 12. Closing CTA & Information-Rich Footer */}
      <LandingFooter />
    </>
  );
}
