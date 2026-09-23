import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Quiz } from "@/components/learning";
import { Container } from "@/components/layout";
import { getJourney, journeys } from "@/constants";
import { Target } from "@/lib/icons";

type Params = { params: Promise<{ journey: string }> };

export function generateStaticParams() {
  return journeys.map((j) => ({ journey: j.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { journey } = await params;
  const item = getJourney(journey);
  if (!item) return { title: "Quiz" };
  return { title: `Quiz · ${item.title}` };
}

export default async function QuizPage({ params }: Params) {
  const { journey } = await params;
  const item = getJourney(journey);
  if (!item) notFound();

  return (
    <Container size="narrow" gutter="page">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="bg-brand/12 flex size-12 items-center justify-center rounded-2xl">
          <Target className="text-brand size-6" />
        </div>
        <span className="text-brand text-xs font-semibold tracking-wider uppercase">
          {item.title}
        </span>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Test your knowledge
        </h1>
        <p className="text-muted-foreground text-sm">
          Answer the questions to earn XP and unlock your certificate.
        </p>
      </div>

      <Quiz journeySlug={journey} />
    </Container>
  );
}
