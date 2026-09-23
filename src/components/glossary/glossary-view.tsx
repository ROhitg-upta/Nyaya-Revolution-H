"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  BookMarked,
  ChevronDown,
  ChevronUp,
  Search,
} from "@/lib/icons";
import { VerificationBadge } from "@/components/laws/verification-badge";
import { Container } from "@/components/layout";
import { glossaryTerms, legalAreas } from "@/constants";
import type { LegalArea } from "@/types";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function GlossaryView() {
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LegalArea | "all">("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return glossaryTerms.filter((item) => {
      const matchesSearch =
        !q ||
        `${item.term} ${item.simpleExplanation} ${item.detailedExplanation} ${item.relatedLaws.join(" ")}`
          .toLowerCase()
          .includes(q);

      const matchesLetter =
        !selectedLetter ||
        item.term.trim().toUpperCase().startsWith(selectedLetter);

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesLetter && matchesCategory;
    });
  }, [search, selectedLetter, selectedCategory]);

  return (
    <Container size="default" gutter="page">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass text-muted-foreground mx-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
        >
          <BookMarked className="text-brand size-3.5" />
          The Citizen Legal Glossary
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-foreground mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          Legal Terms in Plain English
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base text-pretty sm:text-lg"
        >
          Demystifying complex Indian legal jargon — from Zero FIR and Cognizable Offences
          to Injunctions, POSH ICC, and Anticipatory Bail.
        </motion.p>

        {/* Search Input */}
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
            placeholder="Search terms (e.g. Zero FIR, Bail, Injunction, Rent Control)..."
            className="text-foreground w-full bg-transparent py-2 text-sm outline-none sm:text-base"
          />
        </motion.div>
      </div>

      {/* Alphabet Bar */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => setSelectedLetter(null)}
          className={`flex size-8 items-center justify-center rounded-lg text-xs font-bold transition ${
            selectedLetter === null
              ? "bg-gradient-brand text-primary-foreground shadow-sm"
              : "glass text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {ALPHABET.map((letter) => {
          const count = glossaryTerms.filter((t) =>
            t.term.toUpperCase().startsWith(letter),
          ).length;
          return (
            <button
              key={letter}
              type="button"
              onClick={() =>
                setSelectedLetter((prev) => (prev === letter ? null : letter))
              }
              disabled={count === 0}
              className={`flex size-8 items-center justify-center rounded-lg text-xs font-bold transition ${
                selectedLetter === letter
                  ? "bg-gradient-brand text-primary-foreground shadow-sm"
                  : count > 0
                    ? "glass text-foreground hover:border-brand/40"
                    : "cursor-not-allowed opacity-25 text-muted-foreground"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Category Chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
            selectedCategory === "all"
              ? "bg-brand/15 text-brand"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Categories
        </button>
        {legalAreas.map((area) => (
          <button
            key={area.id}
            type="button"
            onClick={() => setSelectedCategory(area.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              selectedCategory === area.id
                ? "bg-brand/15 text-brand"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {area.title}
          </button>
        ))}
      </div>

      {/* Glossary List */}
      <div className="mt-10 flex flex-col gap-4">
        {filteredTerms.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center text-muted-foreground">
            No terms found matching &ldquo;{search}&rdquo;. Try another keyword.
          </div>
        ) : (
          filteredTerms.map((term) => {
            const isExpanded = expandedSlug === term.slug;
            return (
              <div
                key={term.slug}
                id={term.slug}
                className="glass hover:border-brand/30 rounded-2xl p-6 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-brand/12 text-brand flex size-9 items-center justify-center rounded-xl font-bold">
                      {term.term.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h3 className="text-foreground text-xl font-bold">
                        {term.term}
                      </h3>
                      <span className="text-muted-foreground text-xs font-medium capitalize">
                        {term.category}
                      </span>
                    </div>
                  </div>

                  <VerificationBadge
                    source={term.source}
                    status={term.verificationStatus}
                    lastVerifiedAt={term.lastVerifiedAt}
                  />
                </div>

                {/* Plain-English Definition */}
                <p className="text-foreground/90 mt-4 text-sm leading-relaxed sm:text-base">
                  {term.simpleExplanation}
                </p>

                {/* Example Block */}
                <div className="bg-muted/40 border-brand/20 mt-4 rounded-xl border-l-2 py-2.5 pr-4 pl-4 text-xs leading-relaxed">
                  <span className="text-foreground font-semibold">Everyday Example: </span>
                  <span className="text-muted-foreground">{term.example}</span>
                </div>

                {/* Toggle Detailed Legal Explanation */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSlug((prev) => (prev === term.slug ? null : term.slug))
                  }
                  className="text-brand hover:text-brand-foreground mt-4 inline-flex items-center gap-1 text-xs font-semibold"
                >
                  <span>{isExpanded ? "Hide detailed legal explanation" : "Read procedural legal explanation"}</span>
                  {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </button>

                {isExpanded ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-border/40 mt-4 flex flex-col gap-3 border-t pt-4 text-xs text-muted-foreground"
                  >
                    <div>
                      <strong className="text-foreground">Statutory Formulation: </strong>
                      <span>{term.detailedExplanation}</span>
                    </div>

                    {term.relatedLaws && term.relatedLaws.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <strong className="text-foreground">Codified in: </strong>
                        {term.relatedLaws.map((law, i) => (
                          <span
                            key={i}
                            className="bg-brand/10 text-brand rounded px-2 py-0.5 font-medium"
                          >
                            {law}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {term.relatedSituations && term.relatedSituations.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <strong className="text-foreground">See in action: </strong>
                        {term.relatedSituations.map((slug) => (
                          <Link
                            key={slug}
                            href={`/situations/${slug}`}
                            className="text-brand hover:underline"
                          >
                            {slug.replace(/-/g, " ")} &rarr;
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </motion.div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </Container>
  );
}
