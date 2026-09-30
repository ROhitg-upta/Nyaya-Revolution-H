"use client";

import Link from "next/link";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { situations } from "@/constants/situations";
import { ArrowRight, ShieldCheck } from "@/lib/icons";

// Curated high-impact situations that showcase diverse categories
const SHOWCASE_SLUGS = [
  "upi-fraud",
  "pg-deposit-refusal",
  "police-complaint-fir",
  "college-demanding-illegal-fees",
  "defective-product",
  "unpaid-salary-employer",
];

export function SituationsSection() {
  const showcaseSituations = SHOWCASE_SLUGS.map((slug) =>
    situations.find((s) => s.slug === slug)
  ).filter(Boolean);

  return (
    <Section id="situations" muted>
      <SectionHeading
        eyebrow="Situation-first guidance"
        title="Start from What Actually Happened"
        description="Every issue begins with the exact problem you are experiencing — not legalese. Get immediate Do's and Don'ts, critical timelines, and statutory rights."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {showcaseSituations.map((situation, index) => {
          if (!situation) return null;
          const Icon = situation.icon;

          return (
            <Reveal
              key={situation.slug}
              delay={(index % 3) * 0.06}
              className="h-full"
            >
              <Link
                href={`/situations/${situation.slug}`}
                className="focus-visible:ring-ring group/card block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="glass glow-hover relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-2xl p-6 hover:-translate-y-1.5">
                  {/* Subtle corner glow on hover */}
                  <div className="bg-brand/20 pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100" />

                  <div className="relative flex items-start justify-between gap-3">
                    <span className="bg-gradient-brand text-primary-foreground glow-brand flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover/card:scale-105">
                      <Icon className="size-6" />
                    </span>
                    <Badge variant="brand">{situation.subcategory ?? situation.category}</Badge>
                  </div>

                  <div className="relative flex flex-col gap-2">
                    <h3 className="text-foreground text-lg leading-snug font-bold">
                      {situation.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                      {situation.summary}
                    </p>
                  </div>

                  <div className="border-border/40 relative flex items-center justify-between border-t pt-3 text-xs">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <ShieldCheck className="text-brand size-3.5" />
                      Statutory checklist included
                    </span>
                    <span className="text-brand inline-flex items-center gap-1 font-semibold group-hover/card:underline">
                      View action steps
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/card:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/situations"
          className="border-border/80 hover:bg-muted/70 text-foreground inline-flex items-center gap-2 rounded-xl border px-6 py-2.5 text-xs font-bold transition"
        >
          <span>Explore All 60+ Everyday Situations →</span>
        </Link>
      </div>
    </Section>
  );
}
