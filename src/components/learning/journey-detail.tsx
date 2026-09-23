"use client";

import { JourneyHero } from "@/components/learning/journey-hero";
import { Roadmap } from "@/components/learning/roadmap";
import { Container } from "@/components/layout";
import { getJourney } from "@/constants";

interface JourneyDetailProps {
  journeySlug: string;
}

export function JourneyDetail({ journeySlug }: JourneyDetailProps) {
  const journey = getJourney(journeySlug);
  if (!journey) return null;

  return (
    <Container size="default" gutter="page">
      <JourneyHero journey={journey} />

      <section className="mt-12">
        <Roadmap journeySlug={journeySlug} />
      </section>
    </Container>
  );
}
