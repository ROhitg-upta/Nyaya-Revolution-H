import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import { routes } from "@/constants";
import { categories } from "@/constants/landing";
import { ArrowRight } from "@/lib/icons";

export function CategoriesSection() {
  return (
    <Section id="categories">
      <SectionHeading
        eyebrow="Explore by area"
        title="Legal categories for everyday life"
        description="Start where it matters to you. Each category breaks the law down into clear, situation-based lessons."
      />

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Reveal
            key={category.title}
            delay={(index % 4) * 0.05}
            className="h-full"
          >
            <a
              href={routes.situations}
              className="focus-visible:ring-ring group/card block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="glass glow-hover relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl p-5 hover:-translate-y-1">
                {/* hover sheen */}
                <div className="bg-gradient-brand pointer-events-none absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
                <span className="bg-brand/12 text-brand ring-brand/15 flex size-11 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover/card:scale-110 group-hover/card:rotate-3">
                  <category.icon className="size-5.5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-foreground flex items-center gap-1 text-base font-semibold">
                    {category.title}
                    <ArrowRight className="text-brand size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
