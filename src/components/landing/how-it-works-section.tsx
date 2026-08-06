import { Fragment } from "react";

import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import { steps } from "@/constants/landing";
import { ArrowDown } from "@/lib/icons";

export function HowItWorksSection() {
  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow="How it works"
        title="From confusion to confidence in four steps"
        description="A simple, repeatable path that turns a real problem into practical know-how."
      />

      <div className="relative mt-16">
        {/* connecting glow line (desktop) */}
        <div className="via-brand/40 pointer-events-none absolute top-9 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent to-transparent md:block" />

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
          {steps.map((step, index) => (
            <Fragment key={step.title}>
              <Reveal delay={index * 0.1} className="h-full">
                <li className="group/step glass glow-hover relative flex h-full flex-col items-center gap-4 rounded-2xl p-6 text-center hover:-translate-y-1">
                  <div className="bg-gradient-brand text-primary-foreground glow-brand relative flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover/step:scale-105">
                    <step.icon className="size-6.5" />
                    <span className="bg-background text-brand ring-border absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full text-xs font-bold ring-1">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-foreground text-base font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              </Reveal>

              {index < steps.length - 1 ? (
                <div
                  aria-hidden="true"
                  className="text-brand/50 flex items-center justify-center md:hidden"
                >
                  <ArrowDown className="size-5" />
                </div>
              ) : null}
            </Fragment>
          ))}
        </ol>
      </div>
    </Section>
  );
}
