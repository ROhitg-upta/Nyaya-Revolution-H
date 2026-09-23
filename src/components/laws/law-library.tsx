"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gavel,
  Landmark,
  Scale,
  Search,
  ShieldCheck,
  ShoppingBag,
  X,
} from "@/lib/icons";
import { VerificationBadge } from "@/components/laws/verification-badge";
import { caseStudies, lawArticles, legalAreas, statutoryActs } from "@/constants";
import type { LegalArea } from "@/types";
import { Container } from "@/components/layout";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

type LawTab = "all" | "articles" | "acts" | "cases";

export function LawLibrary() {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<LegalArea | "all">("all");
  const [activeTab, setActiveTab] = useState<LawTab>("all");

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return lawArticles.filter((art) => {
      const matchArea = selectedArea === "all" || art.legalArea === selectedArea;
      const matchQ =
        !q ||
        `${art.title} ${art.articleOrSection} ${art.simpleExplanation} ${art.derivedRights.join(" ")}`
          .toLowerCase()
          .includes(q);
      return matchArea && matchQ;
    });
  }, [search, selectedArea]);

  const filteredActs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return statutoryActs.filter((act) => {
      const matchArea = selectedArea === "all" || act.legalArea === selectedArea;
      const matchQ =
        !q ||
        `${act.title} ${act.shortTitle} ${act.overview} ${act.citizenRemedies.join(" ")}`
          .toLowerCase()
          .includes(q);
      return matchArea && matchQ;
    });
  }, [search, selectedArea]);

  const filteredCases = useMemo(() => {
    const q = search.trim().toLowerCase();
    return caseStudies.filter((cs) => {
      const matchArea = selectedArea === "all" || cs.legalArea === selectedArea;
      const matchQ =
        !q ||
        `${cs.title} ${cs.citation} ${cs.problem} ${cs.relevantConcept} ${cs.whyItMatters}`
          .toLowerCase()
          .includes(q);
      return matchArea && matchQ;
    });
  }, [search, selectedArea]);

  const totalResults =
    filteredArticles.length + filteredActs.length + filteredCases.length;

  const handleResetFilters = () => {
    setSearch("");
    setSelectedArea("all");
    setActiveTab("all");
  };

  return (
    <Container size="default" gutter="page" className="relative pb-20">
      {/* Ambient background glow */}
      <div
        className="bg-brand/10 pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 size-96 rounded-full blur-3xl opacity-40 dark:opacity-20"
        aria-hidden="true"
      />

      {/* Hero Header */}
      <header className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass text-brand ring-brand/20 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ring-1 shadow-xs"
        >
          <Scale className="size-3.5" />
          The Citizen Law Library & Constitution
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-foreground mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-balance"
        >
          Understand the Law & Constitution
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed sm:text-base text-pretty"
        >
          Plain-language explanations of India&apos;s Constitutional Articles, Statutory
          Acts, and landmark Supreme Court rulings. Learn your fundamental rights,
          know what to cite, and understand the legal safeguards that protect you every day.
        </motion.p>

        {/* Quick Knowledge Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs"
        >
          <span className="bg-brand/10 text-brand border-brand/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold">
            <Landmark className="size-3.5" />
            {lawArticles.length} Constitutional Articles
          </span>
          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold">
            <BookOpen className="size-3.5" />
            {statutoryActs.length} Major Statutory Acts
          </span>
          <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold">
            <Gavel className="size-3.5" />
            {caseStudies.length} Landmark Judgments
          </span>
          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold">
            <ShieldCheck className="size-3.5" />
            100% Statutorily Verified
          </span>
        </motion.div>
      </header>

      {/* Featured Starter Learning Pathways (Visible when not actively searching) */}
      {!search && selectedArea === "all" && activeTab === "all" && (
        <section aria-labelledby="starter-pathways-heading" className="mt-12">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-brand text-xs font-bold uppercase tracking-wider">
                Start Learning Here
              </span>
              <h2
                id="starter-pathways-heading"
                className="text-foreground text-xl font-bold tracking-tight sm:text-2xl"
              >
                Recommended Legal Foundations
              </h2>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Essential rights and statutory protections every citizen should know first.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pathway 1: Article 21 */}
            <Link
              href="/laws/article-21-protection-of-life-and-personal-liberty"
              className="glass hover:border-brand/40 group flex flex-col justify-between rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-brand/12 text-brand rounded-lg px-2.5 py-1 text-xs font-mono font-bold">
                    Article 21
                  </span>
                  <span className="text-muted-foreground group-hover:text-brand text-xs transition-colors">
                    Core Freedom &rarr;
                  </span>
                </div>
                <h3 className="text-foreground group-hover:text-brand text-base font-bold transition-colors">
                  Protection of Life, Liberty & Dignity
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Your foundational constitutional shield against illegal police custody,
                  arbitrary surveillance, and infringements on bodily autonomy.
                </p>
              </div>
              <div className="border-border/40 text-brand mt-4 flex items-center gap-1.5 border-t pt-3 text-xs font-semibold">
                <CheckCircle2 className="size-3.5" />
                <span>Learn Article & Practice Quiz</span>
              </div>
            </Link>

            {/* Pathway 2: Consumer Protection Act */}
            <a
              href="#consumer-protection-act-2019"
              onClick={() => {
                setActiveTab("acts");
                setSelectedArea("consumer");
              }}
              className="glass hover:border-brand/40 group flex flex-col justify-between rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-500/12 text-blue-600 dark:text-blue-400 rounded-lg px-2.5 py-1 text-xs font-mono font-bold">
                    CPA, 2019
                  </span>
                  <span className="text-muted-foreground group-hover:text-brand text-xs transition-colors">
                    Citizen Redressal &rarr;
                  </span>
                </div>
                <h3 className="text-foreground group-hover:text-brand text-base font-bold transition-colors">
                  Consumer Protection & Fair Trade
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  How to demand full refunds, statutory damages, and hold e-commerce
                  platforms accountable for defective goods and misleading ads.
                </p>
              </div>
              <div className="border-border/40 text-brand mt-4 flex items-center gap-1.5 border-t pt-3 text-xs font-semibold">
                <ShoppingBag className="size-3.5" />
                <span>Explore Citizen Remedies</span>
              </div>
            </a>

            {/* Pathway 3: D.K. Basu Precedent */}
            <Link
              href="/case-studies/dk-basu-v-state-of-wb-1997"
              className="glass hover:border-brand/40 group flex flex-col justify-between rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-purple-500/12 text-purple-600 dark:text-purple-400 rounded-lg px-2.5 py-1 text-xs font-mono font-bold">
                    D.K. Basu (1997)
                  </span>
                  <span className="text-muted-foreground group-hover:text-brand text-xs transition-colors">
                    Supreme Court Ruling &rarr;
                  </span>
                </div>
                <h3 className="text-foreground group-hover:text-brand text-base font-bold transition-colors">
                  11 Binding Police Arrest Guidelines
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Supreme Court mandatory requirements: Memo of arrest, medical checks,
                  informing a friend/lawyer, and display of officer identification tags.
                </p>
              </div>
              <div className="border-border/40 text-brand mt-4 flex items-center gap-1.5 border-t pt-3 text-xs font-semibold">
                <Gavel className="size-3.5" />
                <span>Read Full Landmark Case</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Unified Search & Filter Command Panel */}
      <section aria-label="Search and filter resources" className="mt-12">
        <div className="glass-strong border-border/70 flex flex-col gap-4 rounded-3xl p-4 sm:p-6 shadow-sm">
          {/* Top row: Search input & live counter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="focus-within:border-brand/60 focus-within:ring-ring/30 bg-muted/40 relative flex flex-1 items-center rounded-2xl border transition focus-within:ring-2">
              <Search className="text-muted-foreground ml-3.5 size-4.5 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Article 21, Consumer Protection Act, Arrest guidelines, Privacy..."
                className="text-foreground w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-muted-foreground hover:text-foreground mr-3 rounded-full p-1 transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>

            <div className="text-muted-foreground flex items-center justify-between sm:justify-end gap-2 text-xs">
              <span className="bg-muted text-foreground/80 rounded-lg px-2.5 py-1 font-semibold">
                {totalResults} {totalResults === 1 ? "resource" : "resources"} found
              </span>
              {(search || selectedArea !== "all" || activeTab !== "all") && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-brand hover:underline font-medium cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>
          </div>

          {/* Middle row: Tab Switcher */}
          <div
            role="tablist"
            className="bg-muted/40 border-border/40 flex flex-wrap items-center gap-1.5 rounded-2xl border p-1"
          >
            {(
              [
                { id: "all", label: `All Knowledge (${totalResults})` },
                {
                  id: "articles",
                  label: `Constitutional Articles (${filteredArticles.length})`,
                },
                { id: "acts", label: `Statutory Acts (${filteredActs.length})` },
                { id: "cases", label: `Landmark Cases (${filteredCases.length})` },
              ] as const satisfies { id: LawTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-brand text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bottom row: Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground shrink-0 font-medium">Domain:</span>
            <button
              type="button"
              onClick={() => setSelectedArea("all")}
              className={`rounded-lg px-3 py-1 font-medium transition cursor-pointer shrink-0 ${
                selectedArea === "all"
                  ? "bg-brand/15 text-brand font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              All Domains
            </button>
            {legalAreas.map((area) => (
              <button
                key={area.id}
                type="button"
                onClick={() => setSelectedArea(area.id)}
                className={`rounded-lg px-3 py-1 font-medium transition cursor-pointer shrink-0 ${
                  selectedArea === area.id
                    ? "bg-brand/15 text-brand font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {area.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {totalResults === 0 && (
        <div className="mt-14">
          <EmptyState
            icon={Search}
            title="No matching legal provisions found"
            description={`We couldn't find any resources matching "${search}". Try searching for terms like "Article 21", "Consumer", "Police", or "Privacy".`}
            action={
              <Button onClick={handleResetFilters} variant="outline" size="sm">
                Clear Filters & Show All
              </Button>
            }
          />
        </div>
      )}

      {/* SECTION 1: Constitutional Articles */}
      {(activeTab === "all" || activeTab === "articles") &&
        filteredArticles.length > 0 && (
          <section aria-labelledby="articles-heading" className="mt-14">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-brand text-xs font-bold uppercase tracking-wider">
                  Part III — Fundamental Rights
                </span>
                <h2
                  id="articles-heading"
                  className="text-foreground text-2xl font-bold tracking-tight"
                >
                  Constitutional Articles
                </h2>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Fundamental rights and constitutional guarantees simplified for daily life.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {filteredArticles.map((art) => (
                <Link
                  key={art.slug}
                  href={`/laws/${art.slug}`}
                  className="glass hover:border-brand/50 group relative flex flex-col justify-between rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-3.5">
                    {/* Header: Article Badge & Verification */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-brand/12 text-brand ring-brand/20 rounded-lg px-2.5 py-1 text-xs font-mono font-bold ring-1">
                        {art.articleOrSection}
                      </span>
                      <VerificationBadge
                        source={art.source}
                        status={art.verificationStatus}
                        lastVerifiedAt={art.lastVerifiedAt}
                        showLink={false}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-foreground group-hover:text-brand text-lg font-bold leading-snug transition-colors">
                      {art.title}
                    </h3>

                    {/* Simple Plain-English Explanation */}
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {art.simpleExplanation}
                    </p>

                    {/* Derived Rights Chips (Educational Value) */}
                    {art.derivedRights.length > 0 && (
                      <div className="border-border/30 bg-muted/20 flex flex-col gap-1.5 rounded-xl border p-3">
                        <span className="text-foreground/90 text-[11px] font-semibold">
                          Key Derived Rights:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {art.derivedRights.slice(0, 3).map((right, rIdx) => (
                            <span
                              key={rIdx}
                              className="bg-background/80 text-muted-foreground border-border/50 rounded-md border px-2 py-0.5 text-[10px] font-medium"
                            >
                              ✓ {right}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Action + Situation Link Count */}
                  <div className="border-border/40 text-brand mt-5 flex items-center justify-between border-t pt-4 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1 group-hover:underline">
                      Learn article, examples & quiz
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="text-muted-foreground font-normal">
                      {art.relatedSituations.length} situations linked
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      {/* SECTION 2: Statutory Acts */}
      {(activeTab === "all" || activeTab === "acts") && filteredActs.length > 0 && (
        <section aria-labelledby="acts-heading" className="mt-16">
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-brand text-xs font-bold uppercase tracking-wider">
                Parliamentary Legislation
              </span>
              <h2
                id="acts-heading"
                className="text-foreground text-2xl font-bold tracking-tight"
              >
                Statutory Acts & Everyday Rights
              </h2>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Major statutes protecting consumer, tenancy, cyber, labour, and civil safety.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {filteredActs.map((act) => (
              <article
                key={act.slug}
                id={act.slug}
                className="glass-strong border-border/70 relative flex flex-col justify-between rounded-3xl border p-6 sm:p-8 shadow-xs"
              >
                <div className="flex flex-col gap-4">
                  {/* Top Bar: Short Title, Year, Verification */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-brand/12 text-brand rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                          {act.shortTitle}
                        </span>
                        <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-semibold">
                          Enacted {act.year}
                        </span>
                      </div>
                      <h3 className="text-foreground text-xl font-bold sm:text-2xl">
                        {act.title}
                      </h3>
                    </div>

                    <VerificationBadge
                      source={act.source}
                      status={act.verificationStatus}
                      lastVerifiedAt={act.lastVerifiedAt}
                      showLink={true}
                    />
                  </div>

                  {/* Overview */}
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {act.overview}
                  </p>

                  {/* Key Provisions Grid */}
                  <div className="mt-2 flex flex-col gap-2">
                    <span className="text-foreground text-xs font-bold uppercase tracking-wider">
                      Key Provisions You Can Cite:
                    </span>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {act.keyProvisions.map((prov) => (
                        <div
                          key={prov.section}
                          className="glass border-border/40 flex flex-col justify-between rounded-xl border p-3.5"
                        >
                          <div>
                            <span className="bg-brand/10 text-brand inline-block rounded-md px-2 py-0.5 text-xs font-mono font-bold">
                              {prov.section}
                            </span>
                            <h4 className="text-foreground mt-2 text-xs font-semibold">
                              {prov.title}
                            </h4>
                            <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                              {prov.summary}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Citizen Remedies */}
                  <div className="border-border/40 mt-3 border-t pt-4">
                    <span className="text-foreground text-xs font-bold uppercase tracking-wider">
                      Concrete Remedies Guaranteed to Citizens:
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {act.citizenRemedies.map((rem, i) => (
                        <span
                          key={i}
                          className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"
                        >
                          ✓ {rem}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: Landmark Case Studies */}
      {(activeTab === "all" || activeTab === "cases") && filteredCases.length > 0 && (
        <section aria-labelledby="cases-heading" className="mt-16">
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-brand text-xs font-bold uppercase tracking-wider">
                Supreme Court Jurisprudence
              </span>
              <h2
                id="cases-heading"
                className="text-foreground text-2xl font-bold tracking-tight"
              >
                Landmark Precedents & Rulings
              </h2>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Supreme Court judgments that created binding citizen protections nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredCases.map((cs) => (
              <Link
                key={cs.slug}
                id={`case-${cs.slug}`}
                href={`/case-studies/${cs.slug}`}
                className="glass hover:border-brand/50 group flex flex-col justify-between rounded-3xl border p-6 sm:p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-col gap-3.5">
                  {/* Top Bar: Citation & Verification */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-brand/12 text-brand rounded-md px-2.5 py-0.5 text-xs font-mono font-bold">
                      {cs.citation}
                    </span>
                    <VerificationBadge
                      source={cs.source}
                      status={cs.verificationStatus}
                      lastVerifiedAt={cs.lastVerifiedAt}
                      showLink={false}
                    />
                  </div>

                  {/* Title & Court */}
                  <div>
                    <h3 className="text-foreground group-hover:text-brand text-lg font-bold sm:text-xl transition-colors">
                      {cs.title}
                    </h3>
                    <span className="text-muted-foreground text-xs font-medium">
                      {cs.court} ({cs.year}) · {cs.bench}
                    </span>
                  </div>

                  {/* The Problem / Dilemma */}
                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                    {cs.problem}
                  </p>

                  {/* Core Principle Box */}
                  <div className="bg-brand/5 border-brand/20 rounded-xl border p-3.5 text-xs leading-relaxed">
                    <strong className="text-brand font-semibold">
                      Core Principle Established:{" "}
                    </strong>
                    <span className="text-foreground/90">{cs.relevantConcept}</span>
                  </div>

                  {/* Key Takeaways */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-foreground text-[11px] font-bold uppercase tracking-wider">
                      Key Takeaways for Citizens:
                    </span>
                    <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
                      {cs.citizenLearning.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="text-emerald-500 mt-0.5 size-3.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer with CTA */}
                <div className="border-border/40 text-brand mt-6 flex items-center justify-between border-t pt-4 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 group-hover:underline">
                    Read full precedent & citizen impact
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-muted-foreground font-normal">
                    Binding SC law
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
