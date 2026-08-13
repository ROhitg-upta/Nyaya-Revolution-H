import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DifficultyBadge, Roadmap } from "@/components/learning";
import { getJourney, journeys, lessonCount, routes } from "@/constants";
import { Award, BookOpen, Clock, Layers, Zap } from "@/lib/icons";

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

  const lessons = lessonCount(journey);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
      <a
        href={routes.learn}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
      >
        ← Learning home
      </a>

      {/* header */}
      <header className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="bg-brand/20 pointer-events-none absolute -top-20 -right-10 size-72 rounded-full blur-3xl" />
        <div className="relative flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-brand text-primary-foreground glow-brand flex size-14 items-center justify-center rounded-2xl">
              <journey.icon className="size-7" />
            </span>
            <DifficultyBadge difficulty={journey.difficulty} />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              {journey.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
              {journey.description}
            </p>
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {journey.estimatedMinutes} min
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="size-4" />
              {journey.modules.length} modules
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-4" />
              {lessons} lessons
            </span>
            <span className="text-brand flex items-center gap-1.5 font-medium">
              <Zap className="size-4" />
              {journey.xpReward} XP
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="size-4" />
              Certificate
            </span>
          </div>
          {/* progress */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Your progress</span>
              <span className="text-foreground font-semibold">
                {journey.progress}%
              </span>
            </div>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div
                className="bg-gradient-brand h-full rounded-full"
                style={{ width: `${journey.progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* roadmap */}
      <section className="mt-12">
        <div className="mb-6">
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            Your roadmap
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Modules → lessons → quiz → challenge → certificate.
          </p>
        </div>
        <Roadmap journeySlug={journey.slug} />
      </section>
    </div>
  );
}
