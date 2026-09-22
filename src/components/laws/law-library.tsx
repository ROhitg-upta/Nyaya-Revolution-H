"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  CheckCircle2,
  Scale,
  Search,
} from "@/lib/icons";
import { VerificationBadge } from "@/components/laws/verification-badge";
import { caseStudies, lawArticles, legalAreas, statutoryActs } from "@/constants";
import type { LegalArea } from "@/types";

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

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass text-muted-foreground mx-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
        >
          <Scale className="text-brand size-3.5" />
          The Law Library
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-foreground mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          Understand the Law & Constitution
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base text-pretty sm:text-lg"
        >
          Explore verified Constitutional Articles, statutory provisions, and landmark
          Supreme Court judgments explained in clear, plain language for Indian citizens.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-strong focus-within:ring-ring/50 mt-8 flex items-center gap-3 rounded-2xl p-2 pl-5 transition focus-within:ring-2"
        >
          <Search className="text-brand size-5 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Article 21, Consumer Protection Act, Privacy, Arrest guidelines..."
            className="text-foreground w-full bg-transparent py-2 text-sm outline-none sm:text-base"
          />
        </motion.div>
      </div>

      {/* Filter Tabs: Entity Type */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
        {(
          [
            { id: "all", label: `All (${filteredArticles.length + filteredActs.length + filteredCases.length})` },
            { id: "articles", label: `Constitutional Articles (${filteredArticles.length})` },
            { id: "acts", label: `Statutory Acts (${filteredActs.length})` },
            { id: "cases", label: `Landmark Cases (${filteredCases.length})` },
          ] as const satisfies { id: LawTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-brand text-primary-foreground shadow-sm"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Chips: Legal Area */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedArea("all")}
          className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
            selectedArea === "all"
              ? "bg-brand/15 text-brand"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Areas
        </button>
        {legalAreas.map((area) => (
          <button
            key={area.id}
            type="button"
            onClick={() => setSelectedArea(area.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              selectedArea === area.id
                ? "bg-brand/15 text-brand"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {area.title}
          </button>
        ))}
      </div>

      {/* Section 1: Constitutional Articles */}
      {(activeTab === "all" || activeTab === "articles") && filteredArticles.length > 0 && (
        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-foreground text-2xl font-bold tracking-tight">
                Understand the Articles
              </h2>
              <p className="text-muted-foreground text-sm">
                Fundamental Rights and Constitutional Protections simplified.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredArticles.map((art) => (
              <Link
                key={art.slug}
                href={`/laws/${art.slug}`}
                className="glass-strong hover:border-brand/40 group flex flex-col justify-between rounded-2xl p-6 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-brand/12 text-brand rounded-md px-2.5 py-1 text-xs font-bold">
                      {art.articleOrSection}
                    </span>
                    <VerificationBadge
                      source={art.source}
                      status={art.verificationStatus}
                      lastVerifiedAt={art.lastVerifiedAt}
                    />
                  </div>

                  <h3 className="text-foreground group-hover:text-brand text-lg font-bold transition-colors">
                    {art.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {art.simpleExplanation}
                  </p>
                </div>

                <div className="border-border/40 text-brand mt-5 flex items-center justify-between border-t pt-4 text-xs font-semibold">
                  <span>Explore meaning, examples & quiz &rarr;</span>
                  <span className="text-muted-foreground font-normal">
                    {art.relatedSituations.length} situations linked
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Statutory Acts */}
      {(activeTab === "all" || activeTab === "acts") && filteredActs.length > 0 && (
        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Statutory Acts & Key Provisions
            </h2>
            <p className="text-muted-foreground text-sm">
              Major Indian parliamentary acts governing everyday consumer, cyber, labour, and civil rights.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {filteredActs.map((act) => (
              <div
                key={act.slug}
                id={act.slug}
                className="glass rounded-3xl p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-brand text-xs font-bold tracking-wider uppercase">
                      {act.shortTitle} · Enacted {act.year}
                    </span>
                    <h3 className="text-foreground mt-1 text-xl font-bold sm:text-2xl">
                      {act.title}
                    </h3>
                  </div>
                  <VerificationBadge
                    source={act.source}
                    status={act.verificationStatus}
                    lastVerifiedAt={act.lastVerifiedAt}
                  />
                </div>

                <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                  {act.overview}
                </p>

                {/* Key Provisions */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {act.keyProvisions.map((prov) => (
                    <div
                      key={prov.section}
                      className="glass border-border/40 flex flex-col justify-between rounded-xl p-4"
                    >
                      <div>
                        <span className="bg-brand/10 text-brand inline-block rounded px-2 py-0.5 text-xs font-bold">
                          {prov.section}
                        </span>
                        <h4 className="text-foreground mt-2 text-sm font-semibold">
                          {prov.title}
                        </h4>
                        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                          {prov.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Citizen Remedies */}
                <div className="border-border/40 mt-6 border-t pt-4">
                  <span className="text-foreground text-xs font-bold uppercase tracking-wider">
                    Remedies Available to Citizens:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {act.citizenRemedies.map((rem, i) => (
                      <span
                        key={i}
                        className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs"
                      >
                        ✓ {rem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Landmark Case Studies */}
      {(activeTab === "all" || activeTab === "cases") && filteredCases.length > 0 && (
        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Landmark Judicial Precedents
            </h2>
            <p className="text-muted-foreground text-sm">
              Supreme Court rulings that created binding legal protections for citizens.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredCases.map((cs) => (
              <div
                key={cs.slug}
                id={`case-${cs.slug}`}
                className="glass-strong flex flex-col justify-between rounded-3xl p-6 sm:p-8"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-brand/12 text-brand rounded-md px-2.5 py-0.5 text-xs font-bold">
                      {cs.citation}
                    </span>
                    <VerificationBadge
                      source={cs.source}
                      status={cs.verificationStatus}
                      lastVerifiedAt={cs.lastVerifiedAt}
                    />
                  </div>

                  <h3 className="text-foreground text-lg font-bold sm:text-xl">
                    {cs.title}
                  </h3>
                  <span className="text-muted-foreground text-xs font-medium">
                    {cs.court} ({cs.year}) · {cs.bench}
                  </span>

                  <div className="bg-muted/40 rounded-xl p-4 text-xs leading-relaxed">
                    <strong className="text-foreground">Core Principle: </strong>
                    <span className="text-muted-foreground">{cs.relevantConcept}</span>
                  </div>

                  <div>
                    <h4 className="text-foreground text-xs font-bold uppercase tracking-wider">
                      Key Takeaways for You:
                    </h4>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {cs.citizenLearning.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                          <CheckCircle2 className="text-brand mt-0.5 size-3.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-border/40 text-muted-foreground mt-6 border-t pt-4 text-xs">
                  <strong>Binding Outcome: </strong>
                  <span>{cs.verifiedOutcome}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
