"use client";

import { CountUp } from "@/components/common/count-up";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/landing/section";
import { Landmark, Scale, ShieldCheck, Sparkles } from "@/lib/icons";

export function ImpactPhilosophySection() {
  const verifiedMetrics = [
    {
      value: 60,
      suffix: "+",
      label: "Verified Citizen Situations",
      desc: "Curated real-life issues with Do's, Don'ts, and statutory checklists.",
      icon: ShieldCheck,
    },
    {
      value: 8,
      suffix: "",
      label: "Everyday Legal Domains",
      desc: "Cyber, Consumer, Tenant, Student, Labour, Traffic, Women & Constitution.",
      icon: Scale,
    },
    {
      value: 10,
      suffix: "",
      label: "Guided Learning Journeys",
      desc: "Structured paths with modular lessons, interactive quizzes & certificates.",
      icon: Sparkles,
    },
    {
      value: 36,
      suffix: "",
      label: "States & UTs Directory",
      desc: "Verified District Legal Services Authorities & Lok Adalat desks.",
      icon: Landmark,
    },
  ];

  return (
    <Section className="py-12 sm:py-16">
      <Reveal>
        <div className="glass-strong border-border/80 rounded-3xl border p-6 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-brand text-xs font-bold uppercase tracking-wider">
              Legal Literacy for 1.4 Billion Citizens
            </span>
            <h3 className="text-foreground mt-2 text-2xl font-extrabold sm:text-3xl">
              Building Systematic Access to Everyday Justice
            </h3>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
              True legal awareness begins before dispute escalation. We measure our impact by citizen preparedness, verified rights knowledge, and accessible justice.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {verifiedMetrics.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="glass flex flex-col items-center rounded-2xl p-5 text-center"
                >
                  <div className="bg-brand/12 text-brand flex size-10 items-center justify-center rounded-xl">
                    <Icon className="size-5" />
                  </div>
                  <div className="text-gradient-brand mt-3 text-3xl font-extrabold sm:text-4xl">
                    <CountUp value={m.value} suffix={m.suffix} />
                  </div>
                  <h4 className="text-foreground mt-1 text-sm font-bold">
                    {m.label}
                  </h4>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
