"use client";

import Link from "next/link";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  FileText,
  Scale,
  Sparkles,
} from "@/lib/icons";

export function AiShowcaseSection() {
  const steps = [
    {
      title: "1. Your Everyday Situation",
      desc: "Ask any question in plain English or Hinglish without needing formal legal terms.",
      icon: Bot,
    },
    {
      title: "2. Verified Knowledge Retrieval",
      desc: "Mapped against verified Indian statutes (BNSS, CPA 2019, IT Act) and Supreme Court rulings.",
      icon: Scale,
    },
    {
      title: "3. Grounded Plain Explanation",
      desc: "Delivered in plain, clear steps with explicit statutory citations and no synthetic hallucinations.",
      icon: FileText,
    },
    {
      title: "4. Empowered Citizen Learning",
      desc: "Connected directly to learning journeys, quizzes, and verified DLSA assistance.",
      icon: BookOpen,
    },
  ];

  return (
    <Section id="ai-companion" muted>
      <SectionHeading
        eyebrow="Grounded AI philosophy"
        title="Knowledge Grounded in Indian Law, Not Hallucination"
        description="Nyaya AI is designed as a patient educational companion. It retrieves verified statutory provisions and precedent rulings rather than inventing legal advice."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={idx * 0.08} className="h-full">
              <div className="glass glow-hover flex h-full flex-col justify-between gap-4 rounded-2xl p-6 transition-all hover:-translate-y-1">
                <div>
                  <div className="bg-brand/12 text-brand flex size-10 items-center justify-center rounded-xl">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-foreground mt-3 text-base font-bold">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="text-brand flex items-center gap-1 text-[11px] font-semibold">
                  <CheckCircle2 className="size-3.5" />
                  Statutorily Grounded
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mx-auto mt-10 max-w-xl text-center">
        <p className="text-muted-foreground text-xs leading-relaxed">
          * Nyaya AI is an educational assistance companion. It explains your rights under Indian law and helps you organize your facts. It is not formal courtroom legal representation.
        </p>
        <div className="mt-5">
          <Link
            href="/ai"
            className="bg-gradient-brand text-primary-foreground inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold shadow-md transition"
          >
            <Sparkles className="size-3.5" />
            Try Grounded Nyaya AI Free <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
