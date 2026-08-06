import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SituationDetail } from "@/components/situations";
import { getSituation, situations } from "@/constants";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return situations.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const situation = getSituation(slug);
  if (!situation) return { title: "Situation not found" };
  return { title: situation.title, description: situation.tagline };
}

export default async function SituationDetailPage({ params }: Params) {
  const { slug } = await params;
  const situation = getSituation(slug);
  if (!situation) notFound();
  return <SituationDetail slug={slug} />;
}
