"use client";

import Link from "next/link";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { journeys } from "@/constants";
import { ArrowRight, BookOpen, Clock } from "@/lib/icons";

export function LearningShowcaseSection() {
  // Select top 4 comprehensive journeys
  const featuredJourneys = journeys.slice(0, 4);

  return (
    <Section id="learning-showcase" muted>
      <SectionHeading
        eyebrow="Structured legal education"
        title="Comprehensive Learning Journeys"
        description="Bite-sized, practical paths designed to take you from legal novice to empowered citizen. Learn at your own pace with interactive quizzes and real-world case precedents."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {featuredJourneys.map((journey, index) => {
          const totalLessons = journey.modules.reduce(
            (acc, m) => acc + m.lessons.length,
            0
          );
          const totalMinutes = journey.modules.reduce(
            (acc, m) =>
              acc +
              m.lessons.reduce((lAcc, l) => lAcc + l.readingMinutes, 0),
            0
          );

          return (
            <Reveal
              key={journey.slug}
              delay={index * 0.06}
              className="h-full"
            >
              <Link
                href={`/learn/${journey.slug}`}
                className="focus-visible:ring-ring group/card block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="glass glow-hover relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="bg-brand/12 text-brand rounded-lg p-2 font-mono text-xs font-bold uppercase">
                        {journey.category}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {journey.difficulty}
                      </Badge>
                    </div>

                    <h3 className="text-foreground group-hover:text-brand mt-3 text-base font-bold transition-colors">
                      {journey.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 line-clamp-3 text-xs leading-relaxed">
                      {journey.description}
                    </p>
                  </div>

                  <div className="border-border/40 border-t pt-3">
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <BookOpen className="size-3.5" />
                        {totalLessons} Lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        ~{totalMinutes} mins
                      </span>
                    </div>

                    <div className="text-brand mt-3 flex items-center justify-between text-xs font-semibold">
                      <span>Start Journey</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover/card:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/learn"
          className="border-border/80 hover:bg-muted/70 text-foreground inline-flex items-center gap-2 rounded-xl border px-6 py-2.5 text-xs font-bold transition"
        >
          <span>Explore All 10 Guided Learning Journeys →</span>
        </Link>
      </div>
    </Section>
  );
}
