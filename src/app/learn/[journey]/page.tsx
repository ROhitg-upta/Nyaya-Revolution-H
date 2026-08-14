import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JourneyDetail } from "@/components/learning/journey-detail";
import { getJourney, journeys } from "@/constants";

type Params = { params: Promise<{ journey: string }> };

export function generateStaticParams() {
  return journeys.map((j) => ({ journey: j.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { journey } = await params;
  const item = getJourney(journey);
  if (!item) return { title: "Journey not found" };
  return { title: item.title, description: item.tagline };
}

export default async function JourneyPage({ params }: Params) {
  const { journey: slug } = await params;
  const journey = getJourney(slug);
  if (!journey) notFound();

  return <JourneyDetail journeySlug={slug} />;
}
