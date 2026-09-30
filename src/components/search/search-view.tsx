"use client";

import { useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  FileText,
  Landmark,
  Loader2,
  Scale,
  Search,
  Sparkles,
  Users,
  X,
} from "@/lib/icons";
import { Container } from "@/components/layout";
import { POPULAR_SEARCH_SUGGESTIONS } from "@/lib/search";
import { routes } from "@/constants/routes";
import { useUniversalSearch } from "@/hooks/use-universal-search";
import type { SearchEntityType } from "@/types";

const ENTITY_TABS: { id: SearchEntityType | "all"; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "All Results", icon: Sparkles },
  { id: "situation", label: "Situations", icon: Compass },
  { id: "resource", label: "Authorities & DLSA", icon: Landmark },
  { id: "article", label: "Articles", icon: Scale },
  { id: "law", label: "Statutes", icon: Scale },
  { id: "case_study", label: "Precedents", icon: FileText },
  { id: "lesson", label: "Lessons", icon: BookOpen },
  { id: "journey", label: "Journeys", icon: BookOpen },
  { id: "story", label: "Citizen Stories", icon: Users },
  { id: "glossary", label: "Glossary", icon: FileText },
];

interface SearchViewProps {
  initialQuery?: string;
  initialFilter?: SearchEntityType | "all";
}

export function SearchView({
  initialQuery = "",
  initialFilter = "all",
}: SearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read URL query if provided
  const queryParam = searchParams.get("q") ?? initialQuery;
  const filterParam = (searchParams.get("type") as SearchEntityType | "all") ?? initialFilter;

  const {
    query,
    setQuery,
    entityFilter,
    setEntityFilter,
    items,
    results,
    isLoading,
    intent,
    total,
    clear,
  } = useUniversalSearch({
    initialQuery: queryParam,
    initialFilter: filterParam,
    debounceMs: 200,
  });

  // Keep URL in sync with active search without hard navigation reload
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (entityFilter !== "all") params.set("type", entityFilter);

    const newUrl = params.toString() ? `${routes.search}?${params.toString()}` : routes.search;

    startTransition(() => {
      window.history.replaceState(null, "", newUrl);
    });
  }, [query, entityFilter]);

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <Container size="default" gutter="page" className="py-10 sm:py-14">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass text-muted-foreground mx-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold"
        >
          <Search className="text-brand size-3.5" />
          Universal Legal Discovery Engine
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-foreground mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl"
        >
          Search India&apos;s Legal Knowledge &amp; Situations
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mx-auto mt-3 max-w-2xl text-balance text-sm leading-relaxed sm:text-base"
        >
          Describe your problem in everyday English or Hinglish. We match across 60+ real situations,
          constitutional articles, statutory acts, supreme court cases, and verified legal aid authorities.
        </motion.p>

        {/* Search Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-strong focus-within:ring-ring/50 mt-8 flex items-center gap-3 rounded-2xl p-2 pl-4 transition focus-within:ring-2"
        >
          <Search className="text-brand size-5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “landlord deposit”, “upi fraud 1930”, “police fir refused”, or “article 21”..."
            className="text-foreground placeholder:text-muted-foreground w-full bg-transparent py-2.5 text-sm outline-none sm:text-base"
            autoFocus
          />
          {isLoading && (
            <Loader2 className="text-brand size-4 shrink-0 animate-spin" />
          )}
          {query && !isLoading && (
            <button
              type="button"
              onClick={clear}
              className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors"
              aria-label="Clear search query"
            >
              <X className="size-4" />
            </button>
          )}
        </motion.div>

        {/* Suggestion Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="text-muted-foreground font-medium">Try:</span>
          {POPULAR_SEARCH_SUGGESTIONS.slice(0, 4).map((sugg) => (
            <button
              key={sugg}
              type="button"
              onClick={() => handleSelectSuggestion(sugg)}
              className="border-border/60 hover:border-brand/40 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full border px-2.5 py-0.5 transition"
            >
              {sugg}
            </button>
          ))}
        </div>
      </div>

      {/* Entity Facet Tabs & Intent Banner */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5">
          {ENTITY_TABS.map((tab) => {
            const count =
              tab.id === "all"
                ? total
                : results.byType[tab.id]?.length ?? 0;

            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEntityFilter(tab.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  entityFilter === tab.id
                    ? "bg-gradient-brand text-primary-foreground shadow-sm"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
                {query.trim() && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      entityFilter === tab.id
                        ? "bg-black/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Intent Badge */}
        {query.trim() && intent !== "mixed" && (
          <div className="border-border/60 bg-muted/40 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <span className="bg-brand size-1.5 rounded-full" />
            <span>
              Intent recognized:{" "}
              <strong className="text-foreground capitalize">{intent.replace("_", " ")}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Search Results Area */}
      <div className="mt-8 flex flex-col gap-3">
        {!query.trim() ? (
          <div className="glass rounded-3xl p-12 text-center text-muted-foreground">
            <Sparkles className="text-brand mx-auto size-9 opacity-60" />
            <h3 className="text-foreground mt-3 text-base font-bold">
              Ready for your legal query
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed">
              Start typing any everyday dispute, statutory question, or authority helpline above.
              We instantly search across all verified platform records.
            </p>
          </div>
        ) : isLoading ? (
          /* Loading Skeletons */
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="glass border-border/40 animate-pulse rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted size-8 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted h-4 w-1/3 rounded" />
                    <div className="bg-muted/70 h-3 w-1/4 rounded" />
                  </div>
                </div>
                <div className="bg-muted/50 mt-3 h-3 w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="glass rounded-3xl p-10 text-center">
            <p className="text-foreground text-base font-bold">
              No matching records for &ldquo;{query}&rdquo;
            </p>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-xs leading-relaxed">
              Try using simpler words, checking your spelling, or letting our Grounded Nyaya AI Companion
              analyze your situation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => router.push(`${routes.ai}?q=${encodeURIComponent(query)}`)}
                className="bg-gradient-brand text-primary-foreground inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold"
              >
                <Sparkles className="size-3.5" />
                Ask Grounded Nyaya AI
              </button>
              <Link
                href={routes.situations}
                className="border-border hover:bg-muted text-foreground inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold"
              >
                <Compass className="size-3.5" />
                Browse 60+ Real Situations
              </Link>
            </div>
          </div>
        ) : (
          /* Result Cards */
          items.map((item) => {
            const Icon =
              item.type === "situation"
                ? Compass
                : item.type === "story"
                  ? Users
                  : item.type === "lesson" || item.type === "journey"
                    ? BookOpen
                    : item.type === "article" || item.type === "law"
                      ? Scale
                      : item.type === "resource"
                        ? Landmark
                        : FileText;

            return (
              <Link
                key={item.id}
                href={item.href}
                className="glass hover:border-brand/40 group flex flex-col justify-between rounded-2xl p-5 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-brand/12 text-brand mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl">
                      <Icon className="size-4.5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-brand/10 text-brand rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {item.type.replace("_", " ")}
                        </span>
                        {item.category && (
                          <span className="text-muted-foreground text-xs font-medium">
                            • {item.category}
                          </span>
                        )}
                        {item.verificationStatus === "verified" && (
                          <span className="border-border/60 text-muted-foreground rounded-md border px-1.5 py-0.2 text-[9px] font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-foreground group-hover:text-brand mt-1 text-base font-bold transition-colors sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="text-muted-foreground group-hover:text-brand mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>

                <p className="text-muted-foreground mt-3 text-xs leading-relaxed sm:text-sm">
                  {item.summary}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="border-border/30 mt-3.5 flex flex-wrap gap-1.5 border-t pt-2.5 text-xs">
                    {item.tags.map((tag, i) => (
                      <span
                        key={`${tag}-${i}`}
                        className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-[10px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </Container>
  );
}
