"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookMarked,
  CheckCircle2,
  Gavel,
  Landmark,
  Users,
} from "@/lib/icons";
import { VerificationBadge } from "@/components/laws/verification-badge";
import { ContentDiscovery } from "@/components/common/content-discovery";
import type { CaseStudy } from "@/types";

interface CaseStudyReaderProps {
  caseStudy: CaseStudy;
}

export function CaseStudyReader({ caseStudy }: CaseStudyReaderProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      {/* Back link */}
      <Link
        href="/case-studies"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        All Landmark Case Studies
      </Link>

      {/* Case Header Card */}
      <div className="glass-strong border-primary/30 flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-primary/15 text-primary rounded-md px-2.5 py-1 text-xs font-bold tracking-wider uppercase">
              Supreme Court Precedent
            </span>
            <span className="text-primary font-mono text-xs font-semibold">
              {caseStudy.citation}
            </span>
          </div>
          <VerificationBadge
            source={caseStudy.source}
            status={caseStudy.verificationStatus}
            lastVerifiedAt={caseStudy.lastVerifiedAt}
          />
        </div>

        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {caseStudy.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Landmark className="size-4 text-primary" />
            {caseStudy.court} ({caseStudy.year})
          </span>
          {caseStudy.bench && (
            <span className="flex items-center gap-1">
              <Users className="size-4 text-primary" />
              Bench: {caseStudy.bench}
            </span>
          )}
          <span className="capitalize text-foreground font-semibold">
            Area: {caseStudy.legalArea} Law
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {/* Core Ruling Highlight */}
        <div className="glass border-primary/40 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
            <Gavel className="size-4" />
            Binding Judicial Ruling & Ratio Decidendi
          </div>
          <p className="mt-3 text-foreground text-base sm:text-lg font-semibold leading-relaxed">
            &ldquo;{caseStudy.verifiedOutcome}&rdquo;
          </p>
          <div className="mt-4 pt-3 border-t border-primary/20 text-xs text-muted-foreground">
            <strong className="text-foreground">Doctrinal Concept Established: </strong>
            <span className="text-primary font-medium">{caseStudy.relevantConcept}</span>
          </div>
        </div>

        {/* Factual Context & Legal Problem */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6 flex flex-col gap-2">
            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              1. Factual Background
            </span>
            <p className="text-sm leading-relaxed text-foreground/90">
              {caseStudy.context}
            </p>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col gap-2">
            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              2. The Dispute & Rights Violation
            </span>
            <p className="text-sm leading-relaxed text-foreground/90">
              {caseStudy.problem}
            </p>
          </div>
        </div>

        {/* Constitutional / Legal Question */}
        <div className="glass rounded-2xl p-6 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase text-brand tracking-wider">
            The Legal Question Answered by the Court
          </span>
          <p className="text-foreground text-sm font-semibold leading-relaxed">
            {caseStudy.legalQuestion}
          </p>
        </div>

        {/* Why It Matters */}
        <div className="glass rounded-2xl p-6 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Significance in Indian Jurisprudence
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {caseStudy.whyItMatters}
          </p>
        </div>

        {/* Citizen Learnings */}
        <div className="glass border-emerald-500/30 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="size-4" />
            Actionable Citizen Learnings & Takeaways
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {caseStudy.citizenLearning.map((item, idx) => (
              <div key={idx} className="glass flex items-start gap-3 rounded-xl p-3.5 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                  {idx + 1}
                </span>
                <span className="text-foreground font-medium leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Constitutional Articles */}
        {caseStudy.relatedArticles && caseStudy.relatedArticles.length > 0 && (
          <div className="glass rounded-2xl p-6 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              Associated Constitutional Provisions
            </span>
            <div className="flex flex-wrap gap-2">
              {caseStudy.relatedArticles.map((artSlug) => (
                <Link
                  key={artSlug}
                  href={`/laws/${artSlug}`}
                  className="glass hover:border-brand/50 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-brand transition-colors"
                >
                  <BookMarked className="size-3.5" />
                  <span className="capitalize">{artSlug.replace(/-/g, " ")}</span>
                  <span>&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Content Discovery */}
        <ContentDiscovery
          title="Explore Connected Concepts"
          subtitle="See how this landmark judgment impacts everyday citizen situations and learning journeys."
          understandHref={
            caseStudy.relatedLessons?.[0]
              ? `/learn/${caseStudy.relatedLessons[0].journeySlug}/${caseStudy.relatedLessons[0].lessonSlug}`
              : undefined
          }
          understandLabel="Related Learning Lesson"
          deeperHref={
            caseStudy.relatedArticles?.[0]
              ? `/laws/${caseStudy.relatedArticles[0]}`
              : "/laws"
          }
          deeperLabel="Constitutional Law Library"
          practiceHref="/learn/scenarios/police-stop-warrantless-search"
          practiceLabel="Police Check Scenario"
        />
      </div>
    </div>
  );
}
