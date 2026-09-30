"use client";

import Link from "next/link";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import {
  ArrowRight,
  FolderKanban,
  Landmark,
  Languages,
  Lock,
  Mic,
  RefreshCw,
  Scale,
  ShieldCheck,
  UserCheck,
} from "@/lib/icons";

export function ActionTrustSection() {
  const actionCapabilities = [
    {
      title: "Multilingual Voice Triage",
      desc: "Speak naturally in Hindi, English, or Hinglish. Automatically transcribes and extracts factual timelines.",
      icon: Mic,
      href: "/action-center",
      badge: "Voice AI",
    },
    {
      title: "DLSA & Lok Adalat Geo-Locator",
      desc: "Find verified District Legal Services Authorities across 36 States & UTs with official emergency helplines.",
      icon: Landmark,
      href: "/action-center",
      badge: "Verified Directory",
    },
    {
      title: "Private Case Prep Workspace",
      desc: "Assemble chronological facts, evidence checklists, and notes into structured records without data leakage.",
      icon: FolderKanban,
      href: "/action-center/case-prep",
      badge: "Private Workspace",
    },
    {
      title: "Bilingual Dossier & Binder Pack",
      desc: "Generate watermarked educational draft applications in English and Hindi for discussion with advocates.",
      icon: Languages,
      href: "/action-center/binder",
      badge: "Document Pack",
    },
  ];

  const trustPillars = [
    {
      title: "Statutory Source Grounding",
      desc: "Every checklist and guide links to specific sections of Indian statutes (BNSS, BNS, CPA 2019, Model Tenancy Act).",
      icon: Scale,
    },
    {
      title: "Human Moderator Verification",
      desc: "All authority listings, contact numbers, and community stories pass through human-in-the-loop review.",
      icon: UserCheck,
    },
    {
      title: "Automated Source Freshness",
      desc: "Proactive freshness engine tracks helpline status and jurisdictional changes so data never goes stale.",
      icon: RefreshCw,
    },
    {
      title: "Zero-Knowledge Clinic Handoff",
      desc: "Share your case dossier with legal aid volunteers using temporary, 60-minute expiring tokens.",
      icon: Lock,
    },
  ];

  return (
    <Section id="action-and-trust">
      <SectionHeading
        eyebrow="Citizen action & platform trust"
        title="Actionable Assistance Built on Trust Infrastructure"
        description="Nyaya Revolution bridges the gap between understanding your rights and taking real-world action. Engineered with institutional verification, privacy-first isolation, and human governance."
      />

      {/* Action Center Grid */}
      <div className="mt-14">
        <h3 className="text-foreground text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Citizen Action Capabilities
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {actionCapabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <Reveal key={cap.title} delay={idx * 0.06} className="h-full">
                <Link
                  href={cap.href}
                  className="focus-visible:ring-ring group/card block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="glass glow-hover relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="bg-brand/12 text-brand flex size-10 items-center justify-center rounded-xl">
                          <Icon className="size-5" />
                        </span>
                        <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-[10px] font-semibold">
                          {cap.badge}
                        </span>
                      </div>
                      <h4 className="text-foreground group-hover:text-brand mt-3 text-base font-bold transition-colors">
                        {cap.title}
                      </h4>
                      <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                        {cap.desc}
                      </p>
                    </div>

                    <span className="text-brand inline-flex items-center gap-1 text-xs font-semibold">
                      Explore tool <ArrowRight className="size-3.5 transition-transform group-hover/card:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Trust & Verification Pillars */}
      <div className="border-border/50 bg-muted/15 mt-14 rounded-3xl border p-6 sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-brand inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="size-4" />
            Institutional Trust Architecture
          </span>
          <h3 className="text-foreground mt-2 text-xl font-bold sm:text-2xl">
            Why Citizens and Legal Aid Counsel Rely on Nyaya
          </h3>
          <p className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
            We hold ourselves to strict standards of privacy, verifiability, and transparency.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={idx * 0.06} className="h-full">
                <div className="glass flex h-full flex-col gap-3 rounded-2xl p-5">
                  <div className="bg-brand/12 text-brand flex size-9 items-center justify-center rounded-xl">
                    <Icon className="size-4.5" />
                  </div>
                  <h4 className="text-foreground text-sm font-bold">{p.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
