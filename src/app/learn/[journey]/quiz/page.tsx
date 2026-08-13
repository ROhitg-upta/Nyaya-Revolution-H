import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Quiz } from "@/components/learning";
import { getJourney, journeys } from "@/constants";

type Params = { params: Promise<{ journey: string }> };

export function generateStaticParams() {
  return journeys.map((j) => ({ journey: j.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { journey } = await params;
  const item = getJourney(journey);
  return { title: item ? `${item.title} — Quiz` : "Quiz" };
}

export default async function QuizPage({ params }: Params) {
  const { journey } = await params;
  const item = getJourney(journey);
  if (!item) notFound();
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
      <div className="mb-10 text-center">
        <span className="text-brand text-xs font-semibold tracking-wide uppercase">
          {item.title}
        </span>
        <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Test your knowledge
        </h1>
      </div>
      <Quiz journeySlug={journey} />
    </div>
  );
}
