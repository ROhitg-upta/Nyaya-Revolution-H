"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import {
  ArrowRight,
  Bot,
  Brain,
  Check,
  CheckCircle2,
  Compass,
  Landmark,
  Languages,
  Mic,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from "@/lib/icons";

type PreviewTab = "situation" | "ai" | "action" | "learn" | "community";

export function ProductPreviewsSection() {
  const [activeTab, setActiveTab] = useState<PreviewTab>("situation");

  return (
    <Section id="platform-previews" className="pt-8">
      <SectionHeading
        eyebrow="Inside Nyaya Revolution"
        title="Real Tools Designed for Real Situations"
        description="We don't show mockups. Explore actual product surfaces built to assist Indian citizens from the first moment of dispute to resolution."
      />

      {/* Tabs */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {[
          { id: "situation", label: "Situation Triage", icon: Compass },
          { id: "ai", label: "Grounded AI Companion", icon: Sparkles },
          { id: "action", label: "Action Center & Voice", icon: Mic },
          { id: "learn", label: "Scenario Simulation", icon: Brain },
          { id: "community", label: "Community Story", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as PreviewTab)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                active
                  ? "bg-gradient-brand text-primary-foreground shadow-md"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Preview Container */}
      <Reveal className="mx-auto mt-8 max-w-4xl">
        <div className="glass-strong border-border/80 relative overflow-hidden rounded-3xl border p-6 shadow-2xl sm:p-8">
          {/* Tab 1: Situation Triage Preview */}
          {activeTab === "situation" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-brand/15 text-brand rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Live Situation Checklist
                    </span>
                    <span className="border-border/60 text-muted-foreground rounded-full border px-2 py-0.2 text-[10px]">
                      Model Tenancy Act, 2021
                    </span>
                  </div>
                  <h3 className="text-foreground mt-2 text-xl font-extrabold sm:text-2xl">
                    Hostel / PG Owner Refusing to Return Security Deposit
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Statutory maximum deduction rules, notice period proof, and formal demand notice steps.
                  </p>
                </div>
                <Link
                  href="/situations/pg-deposit-refusal"
                  className="bg-brand/12 hover:bg-brand/20 text-brand inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition"
                >
                  Open Full Checklist <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {/* Do's and Don'ts Split Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span className="text-xs font-bold uppercase">Immediate Do&apos;s</span>
                  </div>
                  <ul className="mt-2.5 space-y-2 text-xs text-foreground/90">
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      Take high-res photos and video of the vacated room before handing over keys.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      Obtain written or WhatsApp move-out acknowledgment confirming room condition.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      Issue formal 7-day refund notice citing Section 13 of Model Tenancy Act.
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <ShieldAlert className="size-4 shrink-0" />
                    <span className="text-xs font-bold uppercase">Critical Don&apos;ts</span>
                  </div>
                  <ul className="mt-2.5 space-y-2 text-xs text-foreground/90">
                    <li className="flex items-start gap-2">
                      <X className="size-3.5 text-destructive mt-0.5 shrink-0" />
                      Do not surrender keys without written signed acknowledgement of handover.
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="size-3.5 text-destructive mt-0.5 shrink-0" />
                      Do not accept verbal promises of &ldquo;I will transfer in a week&rdquo;.
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="size-3.5 text-destructive mt-0.5 shrink-0" />
                      Do not sign blank clearance vouchers or waivers.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Grounded AI Companion Preview */}
          {activeTab === "ai" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-gradient-brand text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                    <Bot className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-foreground text-sm font-bold">Nyaya AI Companion</h4>
                    <span className="text-muted-foreground text-[11px]">
                      Grounded in Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)
                    </span>
                  </div>
                </div>
                <Link
                  href="/ai"
                  className="bg-brand/12 hover:bg-brand/20 text-brand inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition"
                >
                  Try AI Free →
                </Link>
              </div>

              {/* Chat Dialog Excerpt */}
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-end">
                  <div className="bg-brand text-primary-foreground max-w-sm rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm">
                    Police officer in Mumbai is refusing to file FIR for mobile theft because the incident happened on highway in Gujarat. What are my rights?
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-muted text-foreground flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                    ⚖️
                  </div>
                  <div className="bg-muted/50 border-border/60 max-w-lg rounded-2xl rounded-tl-none border p-4 text-foreground/90 space-y-2">
                    <p>
                      <strong>Under Section 173(1) of the Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)</strong>, the police station has a mandatory legal obligation to register a <strong>Zero FIR</strong> regardless of territorial jurisdiction.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      <li>The officer cannot turn you away or instruct you to travel to Gujarat.</li>
                      <li>They must record your complaint, issue a stamped Zero FIR acknowledgment, and transfer the case diary internally.</li>
                      <li>Refusal by an officer constitutes non-compliance under Section 199 of BNS.</li>
                    </ul>
                    <div className="border-border/40 mt-2 flex items-center justify-between border-t pt-2 text-[10px] text-muted-foreground">
                      <span>✓ Statutory verification: Supreme Court Lalita Kumari (2014)</span>
                      <span className="italic">Educational assistance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Action Center & Voice */}
          {activeTab === "action" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/50 pb-4">
                <div>
                  <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Citizen Action Center
                  </span>
                  <h3 className="text-foreground mt-2 text-xl font-extrabold sm:text-2xl">
                    Multilingual Voice, DLSA Locator &amp; Dossier Assembly
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Speak your complaint naturally in Hindi, English, or Hinglish. Automatically locate your District Legal Services Authority.
                  </p>
                </div>
                <Link
                  href="/action-center"
                  className="bg-brand/12 hover:bg-brand/20 text-brand inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition"
                >
                  Open Action Center <ArrowRight className="size-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex size-10 items-center justify-center rounded-xl">
                    <Mic className="size-5" />
                  </div>
                  <h4 className="text-foreground mt-2 text-xs font-bold">Multilingual Voice</h4>
                  <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                    Voice triage in 10+ Indian languages with automatic legal issue extraction.
                  </p>
                </div>

                <div className="glass rounded-2xl p-4 text-center">
                  <div className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex size-10 items-center justify-center rounded-xl">
                    <Landmark className="size-5" />
                  </div>
                  <h4 className="text-foreground mt-2 text-xs font-bold">Verified DLSA Locator</h4>
                  <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                    Direct phone, address, and free legal aid counsel across 36 States &amp; UTs.
                  </p>
                </div>

                <div className="glass rounded-2xl p-4 text-center">
                  <div className="bg-brand/15 text-brand mx-auto flex size-10 items-center justify-center rounded-xl">
                    <Languages className="size-5" />
                  </div>
                  <h4 className="text-foreground mt-2 text-xs font-bold">Bilingual Dossier</h4>
                  <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                    Export printable English-Hindi case prep packs with statutory citations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Scenario Simulation Preview */}
          {activeTab === "learn" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div>
                  <span className="bg-brand/15 text-brand rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Interactive Dilemma Simulation
                  </span>
                  <h4 className="text-foreground mt-1 text-base font-bold sm:text-lg">
                    College Withheld Marksheet Due to Fee Dispute
                  </h4>
                </div>
                <Link
                  href="/learn/scenarios/pg-deposit-refusal"
                  className="bg-brand/12 hover:bg-brand/20 text-brand rounded-lg px-2.5 py-1 text-xs font-bold transition"
                >
                  Play Scenarios →
                </Link>
              </div>

              <div className="bg-muted/40 border-border/70 rounded-2xl border p-4 text-xs">
                <p className="text-foreground font-semibold">
                  Situation Dilemma: The university examination branch refuses to release your final degree marksheet, stating your department has pending hostel fee arrears. Can they legally retain your original academic documents?
                </p>

                <div className="mt-3.5 space-y-2">
                  <div className="border-border/70 hover:border-brand/50 hover:bg-muted/60 flex items-center justify-between rounded-xl border p-2.5 transition">
                    <span>Option A: Yes, colleges retain right to lien on academic records.</span>
                    <span className="text-muted-foreground text-[10px]">Incorrect</span>
                  </div>
                  <div className="border-brand/60 bg-brand/10 flex items-center justify-between rounded-xl border p-2.5 text-foreground font-semibold">
                    <span>Option B: No. UGC Notification (2018) strictly prohibits retaining original certificates.</span>
                    <span className="bg-brand text-primary-foreground rounded-md px-1.5 py-0.5 text-[10px]">✓ Correct Statutory Answer</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Community Story Preview */}
          {activeTab === "community" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div>
                  <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Verified Citizen Story
                  </span>
                  <h4 className="text-foreground mt-1 text-base font-bold sm:text-lg">
                    Recovered ₹38,000 Fake Parcel UPI Scam using 1930 Helpline
                  </h4>
                </div>
                <Link
                  href="/community"
                  className="bg-brand/12 hover:bg-brand/20 text-brand rounded-lg px-2.5 py-1 text-xs font-bold transition"
                >
                  Read Community Stories →
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  &ldquo;I received a call claiming a parcel in my name contained contraband. In panic, I transferred ₹38,000 before realizing it was a fraud. Because of Nyaya Revolution&apos;s 1930 golden-hour guide, I called within 22 minutes. The receiving mule account was frozen immediately by the Cyber Cell.&rdquo;
                </p>
                <div className="border-border/50 flex flex-wrap items-center justify-between border-t pt-2.5 text-muted-foreground">
                  <span>Author: Abhishek K. (Bengaluru)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Amount Recovered</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
