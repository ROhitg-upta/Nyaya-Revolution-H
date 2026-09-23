"use client";

import { useState } from "react";

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

import { Container, PageHeader } from "@/components/layout";

export function SituationEngine() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SituationCategoryId | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);

  const selectedCategoryMeta = category ? getCategory(category) : null;

  const q = query.trim().toLowerCase();
  const filtered = situations.filter((s) => {
    const inCategory = !category || s.category === category;
    const inSubcategory = !subcategory || s.subcategory === subcategory;
    const haystack =
      `${s.title} ${s.tagline} ${s.summary} ${s.subcategory ?? ""} ${getCategory(s.category)?.title ?? ""}`.toLowerCase();
    const matches = !q || haystack.includes(q);
    return inCategory && inSubcategory && matches;
  });

  return (
    <Container size="default" gutter="page">
      {/* Heading + search */}
      <PageHeader
        eyebrow="The Situation Engine"
        eyebrowIcon={Sparkles}
        title="What happened with you today?"
        description="Describe your situation in your own words, or pick a category. We'll show you your rights and exactly what to do next."
        actions={
          <div className="w-full max-w-xl mx-auto mt-2">
            <SituationSearch value={query} onChange={setQuery} />
          </div>
        }
      />

      {/* Categories */}
      <div className="mt-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">
            Browse by category ({situationCategories.length})
          </h2>
          {category ? (
            <button
              type="button"
              onClick={() => {
                setCategory(null);
                setSubcategory(null);
              }}
              className="text-brand text-sm font-medium hover:underline"
            >
              Clear filter
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {situationCategories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              selected={category === c.id}
              onSelect={() => {
                setCategory((prev) => (prev === c.id ? null : c.id));
                setSubcategory(null);
              }}
            />
          ))}
        </div>

        {/* Subcategory Pills when Category is selected */}
        {selectedCategoryMeta?.subcategories && selectedCategoryMeta.subcategories.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-muted-foreground mr-1 text-xs font-semibold">
              Filter by issue:
            </span>
            <button
              type="button"
              onClick={() => setSubcategory(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                subcategory === null
                  ? "bg-brand text-brand-foreground shadow-xs"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              All {selectedCategoryMeta.title}
            </button>
            {selectedCategoryMeta.subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() =>
                  setSubcategory((prev) => (prev === sub ? null : sub))
                }
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  subcategory === sub
                    ? "bg-brand text-brand-foreground shadow-xs"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        ) : null}
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
    </Container>
  );
}
