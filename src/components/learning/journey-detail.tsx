"use client";

import { JourneyHero } from "@/components/learning/journey-hero";
import { Roadmap } from "@/components/learning/roadmap";
import { getJourney } from "@/constants";

interface JourneyDetailProps {
  journeySlug: string;
}

export function JourneyDetail({ journeySlug }: JourneyDetailProps) {
  const journey = getJourney(journeySlug);
  if (!journey) return null;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      <JourneyHero journey={journey} />

      <section className="mt-12">
        <Roadmap journeySlug={journeySlug} />
      </section>
    </div>
  );
}
