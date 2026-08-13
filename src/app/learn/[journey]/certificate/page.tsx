import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CertificatePreview } from "@/components/learning";
import { getJourney, journeys } from "@/constants";

type Params = { params: Promise<{ journey: string }> };

export function generateStaticParams() {
  return journeys.map((j) => ({ journey: j.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { journey } = await params;
  const item = getJourney(journey);
  return { title: item ? `${item.title} — Certificate` : "Certificate" };
}

export default async function CertificatePage({ params }: Params) {
  const { journey } = await params;
  if (!getJourney(journey)) notFound();
  return <CertificatePreview journeySlug={journey} />;
}
