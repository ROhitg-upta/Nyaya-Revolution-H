import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { features } from "@/constants/landing";

export function FeaturesSection() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="The platform"
        title="Everything you need to learn the law"
        description="A complete toolkit designed to take you from curious to confident — built for real understanding, not rote memorisation."
      />

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal
            key={feature.title}
            delay={(index % 3) * 0.06}
            className="h-full"
          >
            <div className="glass glow-hover group/card relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-6 hover:-translate-y-1">
              {/* top gradient reveal */}
              <div className="bg-gradient-brand pointer-events-none absolute inset-x-0 top-0 h-0.5 scale-x-0 opacity-0 transition-all duration-300 group-hover/card:scale-x-100 group-hover/card:opacity-100" />
              <div className="flex items-center justify-between">
                <span className="bg-brand/12 text-brand ring-brand/15 flex size-11 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover/card:scale-110 group-hover/card:-rotate-3">
                  <feature.icon className="size-5.5" />
                </span>
                {feature.badge ? (
                  <Badge variant="brand">{feature.badge}</Badge>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-foreground text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
