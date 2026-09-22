"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Landmark,
  Scale,
  Sparkles,
  Users,
} from "@/lib/icons";
import { VerificationBadge } from "@/components/laws/verification-badge";
import { MiniChallenge } from "@/components/learning/mini-challenge";
import { getRelatedCaseStudiesForArticle, getRelatedSituationsForArticle } from "@/lib/legal-graph";
import type { LawArticle } from "@/types";

interface ArticleDetailProps {
  article: LawArticle;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const relatedSituations = getRelatedSituationsForArticle(article.slug);
  const relatedCases = getRelatedCaseStudiesForArticle(article.slug);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      {/* Back button */}
      <Link
        href="/laws"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        All Laws & Articles
      </Link>

      {/* Header Banner */}
      <header className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="bg-brand/15 pointer-events-none absolute -top-24 -right-16 size-80 rounded-full blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="bg-gradient-brand text-primary-foreground glow-brand inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-sm font-bold shadow-md">
              <Landmark className="size-4" />
              {article.articleOrSection}
            </span>
            <VerificationBadge
              source={article.source}
              status={article.verificationStatus}
              lastVerifiedAt={article.lastVerifiedAt}
            />
          </div>

          <h1 className="text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {article.title}
          </h1>

          <p className="text-muted-foreground text-sm font-medium">
            {article.actOrConstitution} · {article.legalArea.toUpperCase()}
          </p>
        </div>
      </header>

      {/* Step 1: What it means in simple language */}
      <section className="glass mt-8 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <span className="bg-brand/12 text-brand flex size-8 items-center justify-center rounded-lg">
            <BookOpen className="size-4.5" />
          </span>
          <h2 className="text-foreground text-xl font-bold">
            What It Means in Plain Language
          </h2>
        </div>
        <p className="text-foreground/90 mt-4 text-base leading-relaxed sm:text-lg">
          {article.simpleExplanation}
        </p>
        {article.detailedExplanation ? (
          <p className="text-muted-foreground border-border/40 mt-4 border-t pt-4 text-sm leading-relaxed">
            {article.detailedExplanation}
          </p>
        ) : null}
      </section>

      {/* Step 2 & 3: Why it exists & Who it protects */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <span className="bg-brand/10 text-brand flex size-7 items-center justify-center rounded-lg">
              <Scale className="size-4" />
            </span>
            <h3 className="text-foreground text-base font-bold">Why It Exists</h3>
          </div>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            {article.whyItExists}
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <span className="bg-brand/10 text-brand flex size-7 items-center justify-center rounded-lg">
              <Users className="size-4" />
            </span>
            <h3 className="text-foreground text-base font-bold">Who It Protects</h3>
          </div>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            {article.whoItProtects}
          </p>
        </div>
      </div>

      {/* Step 4: Real-world citizen example */}
      <section className="glass-strong border-brand/20 mt-6 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <span className="bg-brand/15 text-brand flex size-8 items-center justify-center rounded-lg">
            <Sparkles className="size-4.5" />
          </span>
          <h2 className="text-foreground text-lg font-bold">
            Real-World Citizen Example
          </h2>
        </div>
        <p className="text-foreground/90 mt-3 text-sm leading-relaxed sm:text-base">
          {article.realWorldExample}
        </p>
      </section>

      {/* Step 5: Common Misunderstanding (Myth vs Reality) */}
      {article.commonMisunderstanding ? (
        <section className="glass border-border/60 mt-6 overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-destructive/5 p-6 md:border-r md:border-border/40">
              <div className="flex items-center gap-2">
                <span className="text-destructive font-bold text-xs uppercase tracking-wider">
                  Common Misunderstanding (Myth)
                </span>
              </div>
              <p className="text-foreground mt-2 text-sm font-semibold leading-snug">
                &ldquo;{article.commonMisunderstanding.myth}&rdquo;
              </p>
            </div>
            <div className="bg-success/5 p-6">
              <div className="flex items-center gap-2">
                <span className="text-success font-bold text-xs uppercase tracking-wider">
                  Legal Reality
                </span>
              </div>
              <p className="text-foreground mt-2 text-sm font-semibold leading-snug">
                {article.commonMisunderstanding.reality}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* Derived Fundamental Rights */}
      {article.derivedRights && article.derivedRights.length > 0 ? (
        <section className="glass mt-6 rounded-2xl p-6">
          <h3 className="text-foreground text-sm font-bold uppercase tracking-wider">
            Derived Rights You Hold:
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {article.derivedRights.map((r, i) => (
              <span
                key={i}
                className="bg-brand/10 text-foreground border-brand/20 inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium"
              >
                <CheckCircle2 className="text-brand size-3.5 shrink-0" />
                {r}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Step 6: Related Situations */}
      {relatedSituations.length > 0 && (
        <section className="mt-10">
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            Related Real-World Situations
          </h2>
          <p className="text-muted-foreground text-xs">
            Where this provision is invoked in everyday citizen experiences.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {relatedSituations.map((sit) => (
              <Link
                key={sit.slug}
                href={`/situations/${sit.slug}`}
                className="glass hover:border-brand/40 group flex flex-col justify-between rounded-xl p-4 transition-all"
              >
                <div>
                  <span className="text-brand text-xs font-semibold capitalize">
                    {sit.category}
                  </span>
                  <h4 className="text-foreground group-hover:text-brand mt-1 text-sm font-bold transition-colors">
                    {sit.title}
                  </h4>
                  <p className="text-muted-foreground mt-1 text-xs line-clamp-2">
                    {sit.summary}
                  </p>
                </div>
                <span className="text-brand mt-3 text-xs font-medium">
                  View checklist & actions &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Step 7: Landmark Case Studies */}
      {relatedCases.length > 0 && (
        <section className="mt-10">
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            Landmark Precedent
          </h2>
          <p className="text-muted-foreground text-xs">
            Supreme Court judgment that established or expanded this principle.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {relatedCases.map((cs) => (
              <div key={cs.slug} className="glass-strong rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <span className="bg-brand/12 text-brand rounded-md px-2.5 py-0.5 text-xs font-bold">
                    {cs.citation}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {cs.court} ({cs.year})
                  </span>
                </div>
                <h3 className="text-foreground mt-2 text-lg font-bold">
                  {cs.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  <strong className="text-foreground">Binding Outcome: </strong>
                  {cs.verifiedOutcome}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Step 8: Quick Quiz Check */}
      {article.quiz && article.quiz.length > 0 && (
        <section className="glass-strong border-brand/30 mt-10 rounded-2xl p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="bg-brand/15 text-brand flex size-8 items-center justify-center rounded-lg">
              <Sparkles className="size-4.5" />
            </span>
            <div>
              <span className="text-brand text-xs font-bold uppercase tracking-wider">
                Quick Knowledge Check
              </span>
              <h3 className="text-foreground text-lg font-bold">
                Test Your Understanding
              </h3>
            </div>
          </div>
          <MiniChallenge
            question={article.quiz[0].question}
            options={article.quiz[0].options}
            correctIndex={article.quiz[0].correctIndex}
            explanation={article.quiz[0].explanation}
            xp={article.quiz[0].xp}
          />
        </section>
      )}

      {/* Step 9: Official Source Citation */}
      <footer className="glass border-border/40 text-muted-foreground mt-12 flex flex-col items-start justify-between gap-3 rounded-2xl p-5 text-xs sm:flex-row sm:items-center">
        <div>
          <strong className="text-foreground">Official Statutory Citation: </strong>
          <span>{article.source.title} ({article.source.citation ?? "Official Gazette"})</span>
          <div className="text-[11px] text-muted-foreground/80">
            Published by {article.source.publisher}
          </div>
        </div>
        {article.source.url ? (
          <a
            href={article.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand inline-flex items-center gap-1 font-semibold hover:underline"
          >
            <span>View on Official Portal</span>
            <ExternalLink className="size-3.5" />
          </a>
        ) : null}
      </footer>
    </div>
  );
}
