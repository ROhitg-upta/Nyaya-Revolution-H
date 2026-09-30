"use client";

import Link from "next/link";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Compass,
  FolderKanban,
  Landmark,
} from "@/lib/icons";

const CITIZEN_JOURNEY_STEPS = [
  {
    step: "01",
    title: "Tell Us What Happened",
    description: "Search in plain words, speak in your language, or select from 60+ curated everyday situations.",
    icon: Compass,
    href: "/situations",
  },
  {
    step: "02",
    title: "Understand Your Rights",
    description: "Get plain-language statutory protections, critical golden-hour timelines, and immediate Do's and Don'ts.",
    icon: CheckCircle2,
    href: "/situations/upi-fraud",
  },
  {
    step: "03",
    title: "Learn Key Legal Concepts",
    description: "Master the exact statutes (BNSS, Consumer Protection Act, BNS, IT Act) with interactive modular lessons.",
    icon: BookOpen,
    href: "/learn",
  },
  {
    step: "04",
    title: "Practice with Simulations",
    description: "Test your legal judgment against realistic dilemmas in interactive scenario simulations.",
    icon: Brain,
    href: "/learn/scenarios",
  },
  {
    step: "05",
    title: "Find Verified Assistance",
    description: "Access verified District Legal Services Authorities (DLSA), Lok Adalat settlement, or official helplines.",
    icon: Landmark,
    href: "/action-center",
  },
  {
    step: "06",
    title: "Prepare Your Case Pack",
    description: "Compile private chronological facts, evidence checklists, and bilingual drafts for formal review.",
    icon: FolderKanban,
    href: "/action-center/case-prep",
  },
] as const;

export function HowItWorksSection() {
  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow="The citizen journey"
        title="From Confusion to Prepared Action in Six Steps"
        description="A clear, repeatable workflow that takes you from experiencing a problem to understanding your rights, finding verified assistance, and organizing your case."
      />

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CITIZEN_JOURNEY_STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.title} delay={index * 0.05} className="h-full">
              <Link
                href={step.href}
                className="focus-visible:ring-ring group/step block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="glass glow-hover relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="bg-gradient-brand text-primary-foreground glow-brand flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover/step:scale-105">
                      <Icon className="size-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-muted-foreground/30 transition-colors group-hover/step:text-brand">
                      {step.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-foreground text-base font-bold">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <span className="text-brand inline-flex items-center text-xs font-semibold group-hover/step:underline">
                    Explore step →
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
