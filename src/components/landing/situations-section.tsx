import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { situations } from "@/constants/landing";
import { ArrowRight } from "@/lib/icons";

export function SituationsSection() {
  return (
    <Section id="situations" muted>
      <SectionHeading
        eyebrow="Learn by real situations"
        title="Start from what actually happened"
        description="Every lesson begins with a real-life scenario — the way you experience the problem, not the way a statute is written."
      />

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {situations.map((situation, index) => (
          <Reveal
            key={situation.title}
            delay={(index % 3) * 0.06}
            className="h-full"
          >
            <a
              href={situation.href}
              className="focus-visible:ring-ring group/card block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="glass glow-hover relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-2xl p-6 hover:-translate-y-1.5">
                {/* corner glow */}
                <div className="bg-brand/20 pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100" />
                <div className="relative flex items-start justify-between gap-3">
                  <span className="bg-gradient-brand text-primary-foreground glow-brand flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover/card:scale-105">
                    <situation.icon className="size-6" />
                  </span>
                  <Badge variant="brand">{situation.tag}</Badge>
                </div>
                <div className="relative flex flex-col gap-2">
                  <h3 className="text-foreground text-lg leading-snug font-semibold">
                    {situation.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {situation.description}
                  </p>
                </div>
                <span className="text-brand relative inline-flex items-center gap-1.5 text-sm font-medium">
                  Start this scenario
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/card:translate-x-1" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
