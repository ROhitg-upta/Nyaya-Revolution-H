"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Gavel,
  Landmark,
  Search,
} from "@/lib/icons";
import { caseStudies } from "@/constants";

export function CaseStudiesList() {
  const [query, setQuery] = useState("");

  const filtered = caseStudies.filter((cs) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const haystack = `${cs.title} ${cs.citation} ${cs.problem} ${cs.relevantConcept} ${cs.whyItMatters}`.toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass text-brand mb-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold"
        >
          <Gavel className="size-3.5" />
          Verified Precedents
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-foreground text-3xl font-bold tracking-tight sm:text-5xl"
        >
          Landmark Supreme Court Judgments.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg"
        >
          Learn how pivotal constitutional questions, police arrest guidelines, workplace sexual harassment, and digital privacy doctrines were established by India&apos;s apex court.
        </motion.p>

        {/* Search */}
        <div className="relative mx-auto mt-8 max-w-md">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases by name, citation, or doctrine..."
            className="glass text-foreground placeholder:text-muted-foreground/60 focus:ring-brand/40 w-full rounded-2xl py-3 pr-4 pl-11 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {filtered.map((cs, idx) => (
          <motion.div
            key={cs.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Link
              href={`/case-studies/${cs.slug}`}
              className="glass hover:border-primary/40 group flex h-full flex-col justify-between rounded-3xl p-6 transition-all hover:-translate-y-1"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Landmark className="size-3.5 text-primary" />
                    {cs.court} ({cs.year})
                  </span>
                  <span className="text-primary font-mono text-xs font-semibold">
                    {cs.citation}
                  </span>
                </div>

                <h3 className="text-foreground group-hover:text-primary text-lg font-bold transition-colors">
                  {cs.title}
                </h3>

                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                  {cs.problem}
                </p>

                <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 text-xs text-foreground/90">
                  <strong className="text-primary font-medium">Core Ruling: </strong>
                  <span className="line-clamp-2">{cs.verifiedOutcome}</span>
                </div>
              </div>

              <div className="border-border/40 mt-6 flex items-center justify-between border-t pt-4 text-xs">
                <span className="text-muted-foreground capitalize font-medium">
                  {cs.legalArea} Law
                </span>
                <span className="text-primary font-semibold group-hover:underline">
                  Read Full Case Analysis &rarr;
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
