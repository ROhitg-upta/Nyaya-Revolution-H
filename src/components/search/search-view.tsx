"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Search, Sparkles } from "@/lib/icons";
import { Container } from "@/components/layout";
import { unifiedSearch } from "@/lib/search";
import type { SearchEntityType } from "@/types";

const ENTITY_TABS: { id: SearchEntityType | "all"; label: string }[] = [
  { id: "all", label: "All Results" },
  { id: "situation", label: "Situations" },
  { id: "article", label: "Articles" },
  { id: "law", label: "Statutes" },
  { id: "case_study", label: "Precedents" },
  { id: "lesson", label: "Lessons" },
  { id: "journey", label: "Journeys" },
  { id: "glossary", label: "Glossary" },
];

export function SearchView() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchEntityType | "all">("all");

  const searchResults = useMemo(() => {
    return unifiedSearch(query, activeTab);
  }, [query, activeTab]);

  return (
    <Container size="default" gutter="page">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass text-muted-foreground mx-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
        >
          <Search className="text-brand size-3.5" />
          Unified Legal Search
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-foreground mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          Search the Legal Knowledge Graph
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base text-pretty sm:text-lg"
        >
          Instant search across 50+ everyday situations, constitutional articles,
          acts, Supreme Court case studies, and definitions.
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'landlord deposit', 'arrest rights', 'upi scam', or 'article 21'..."
            className="text-foreground w-full bg-transparent py-2.5 text-base outline-none sm:text-lg"
            autoFocus
          />
        </motion.div>
      </div>

      {/* Entity Facet Tabs */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {ENTITY_TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? searchResults.total
              : searchResults.byType[tab.id]?.length ?? 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-brand text-primary-foreground shadow-sm"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label} ({query ? count : 0})
            </button>
          );
        })}
      </div>

      {/* Search Results */}
      <div className="mt-10 flex flex-col gap-4">
        {!query ? (
          <div className="glass rounded-3xl p-12 text-center text-muted-foreground">
            <Sparkles className="text-brand mx-auto size-8 opacity-50" />
            <p className="mt-3 text-sm">
              Type any legal question or situation above to query across all entities.
            </p>
          </div>
        ) : searchResults.items.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center text-muted-foreground">
            No matching legal entries found for &ldquo;{query}&rdquo;. Try broader terms like &ldquo;deposit&rdquo;, &ldquo;salary&rdquo;, or &ldquo;police&rdquo;.
          </div>
        ) : (
          searchResults.items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="glass hover:border-brand/40 group flex flex-col justify-between rounded-2xl p-5 transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="bg-brand/10 text-brand rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                    {item.type.replace("_", " ")}
                  </span>
                  <h3 className="text-foreground group-hover:text-brand mt-1.5 text-lg font-bold transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-muted-foreground text-xs font-medium">
                    {item.subtitle}
                  </span>
                </div>

                {item.verificationStatus === "verified" ? (
                  <span className="border-border/40 text-muted-foreground hidden rounded-full border px-2.5 py-0.5 text-[11px] sm:inline">
                    ✓ Verified
                  </span>
                ) : null}
              </div>

              <p className="text-muted-foreground mt-2 text-sm leading-relaxed line-clamp-2">
                {item.summary}
              </p>

              {item.tags && item.tags.length > 0 ? (
                <div className="border-border/30 mt-4 flex flex-wrap gap-1.5 border-t pt-3 text-xs">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-[11px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          ))
        )}
      </div>
    </Container>
  );
}
