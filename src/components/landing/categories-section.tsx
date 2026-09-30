"use client";

import Link from "next/link";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import { situationCategories } from "@/constants/situations";
import { ArrowRight, Compass } from "@/lib/icons";

export function CategoriesSection() {
  return (
    <Section id="categories">
      <SectionHeading
        eyebrow="Explore by situation category"
        title="Real-Life Legal Categories for Everyday Citizens"
        description="Pick where your problem began. Each category provides verified statutory rights, immediate action steps, and official dispute escalation paths."
      />

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {situationCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Reveal
              key={category.id}
              delay={(index % 4) * 0.05}
              className="h-full"
            >
              <Link
                href={`/situations?category=${category.id}`}
                className="focus-visible:ring-ring group/card block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="glass glow-hover relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl p-5.5 hover:-translate-y-1">
                  {/* Top gradient reveal border */}
                  <div className="bg-gradient-brand pointer-events-none absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

                  <div className="flex flex-col gap-3">
                    <span className="bg-brand/12 text-brand ring-brand/15 flex size-11 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover/card:scale-105 group-hover/card:rotate-2">
                      <Icon className="size-5.5" />
                    </span>
                    <div>
                      <h3 className="text-foreground flex items-center justify-between text-base font-bold">
                        <span>{category.title}</span>
                        <ArrowRight className="text-brand size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100" />
                      </h3>
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Top subcategory pills */}
                  <div className="border-border/40 mt-1 flex flex-wrap gap-1 border-t pt-3">
                    {(category.subcategories ?? []).slice(0, 3).map((sub) => (
                      <span
                        key={sub}
                        className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/situations"
          className="glass hover:border-brand/40 text-foreground inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition"
        >
          <Compass className="text-brand size-4" />
          <span>Browse all 60+ real-world situations with step-by-step checklists →</span>
        </Link>
      </div>
    </Section>
  );
}
