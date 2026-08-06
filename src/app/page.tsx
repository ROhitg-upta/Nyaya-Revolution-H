import {
  CategoriesSection,
  FaqSection,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  LandingBackground,
  LandingFooter,
  LandingNavbar,
  SituationsSection,
  StatsSection,
  TestimonialsSection,
} from "@/components/landing";

/**
 * Marketing landing page. Composed entirely from reusable section components;
 * all content is sourced from `@/constants/landing`. UI-only — no product,
 * auth, or backend behaviour is wired up here.
 */
export default function HomePage() {
  return (
    <>
      <LandingBackground />
      <LandingNavbar />
      <main id="main" className="flex flex-col">
        <HeroSection />
        <StatsSection />
        <CategoriesSection />
        <SituationsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <LandingFooter />
    </>
  );
}
