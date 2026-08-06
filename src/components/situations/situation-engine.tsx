"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { Reveal } from "@/components/common/reveal";
import { CategoryCard } from "@/components/situations/category-card";
import { SituationCard } from "@/components/situations/situation-card";
import { SituationSearch } from "@/components/situations/situation-search";
import {
  getCategory,
  situationCategories,
  situationDisclaimer,
  situations,
} from "@/constants";
import { Search, Sparkles } from "@/lib/icons";
import type { SituationCategoryId } from "@/types";

export function SituationEngine() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SituationCategoryId | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return situations.filter((s) => {
      const inCategory = !category || s.category === category;
      const haystack =
        `${s.title} ${s.tagline} ${s.summary} ${getCategory(s.category)?.title ?? ""}`.toLowerCase();
      const matches = !q || haystack.includes(q);
      return inCategory && matches;
    });
  }, [query, category]);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      {/* Heading + search */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass text-muted-foreground mx-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
        >
          <Sparkles className="text-brand size-3.5" />
          The Situation Engine
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-foreground mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          What happened with you today?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="text-muted-foreground mx-auto mt-3 max-w-xl text-base text-pretty sm:text-lg"
        >
          Describe your situation in your own words, or pick a category.
          We&apos;ll show you your rights and exactly what to do next.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-8"
        >
          <SituationSearch value={query} onChange={setQuery} />
        </motion.div>
      </div>

      {/* Categories */}
      <div className="mt-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">
            Browse by category
          </h2>
          {category ? (
            <button
              type="button"
              onClick={() => setCategory(null)}
              className="text-brand text-sm font-medium hover:underline"
            >
              Clear filter
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {situationCategories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              selected={category === c.id}
              onSelect={() =>
                setCategory((prev) => (prev === c.id ? null : c.id))
              }
            />
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-14">
        <h2 className="text-foreground mb-5 text-lg font-semibold">
          {filtered.length} situation{filtered.length === 1 ? "" : "s"}
        </h2>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s, index) => (
              <Reveal
                key={s.slug}
                delay={(index % 3) * 0.05}
                className="h-full"
              >
                <SituationCard situation={s} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No matching situations yet"
            description="Try different words or clear the filters — more situations are being added."
          />
        )}
      </div>

      <p className="text-muted-foreground/60 mt-12 text-center text-xs">
        {situationDisclaimer}
      </p>
    </div>
  );
}
