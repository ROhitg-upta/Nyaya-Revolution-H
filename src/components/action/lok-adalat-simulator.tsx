"use client";

import * as React from "react";
import {
  AlertTriangle,
  BookOpen,
  ExternalLink,
  FileText,
  HelpCircle,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { TTSListenPlayer } from "@/components/voice/tts-listen-player";
import {
  evaluateLokAdalatEducationalPathway,
  LOK_ADALAT_MANDATORY_DISCLAIMER,
} from "@/services/action/lok-adalat-simulator.service";
import type {
  LokAdalatCourtStage,
  LokAdalatDisputeCategory,
  LokAdalatSettlementCapability,
  LokAdalatWillingness,
  SupportedCitizenLanguage,
} from "@/types/action-engine";

interface LokAdalatSimulatorProps {
  language?: SupportedCitizenLanguage;
  onCreateCasePreparationBrief?: (params: {
    disputeLabel: string;
    courtStageLabel: string;
    summaryNote: string;
  }) => void;
}

const DISPUTE_CATEGORY_OPTIONS: Array<{
  value: LokAdalatDisputeCategory;
  label: string;
  sublabel: string;
}> = [
  {
    value: "public_utility_electricity_water_telecom",
    label: "Public Utility Bill / Service (Electricity, Water, Telecom, Insurance)",
    sublabel: "Covered under Section 22B Permanent Lok Adalat & National Lok Adalat",
  },
  {
    value: "banking_loan_recovery_negotiable_instrument",
    label: "Bank Loan / Credit Card Recovery / Cheque Bounce (Section 138 NI Act)",
    sublabel: "Frequently taken up for One-Time Settlement (OTS) or installment compromise",
  },
  {
    value: "motor_accident_claim_mact",
    label: "Motor Accident Compensation Claim (MACT / Third-Party Insurance)",
    sublabel: "Insurance company & claimant conciliation before Lok Adalat bench",
  },
  {
    value: "consumer_service_refund_dispute",
    label: "Consumer Refund, Defective Product or Service Billing Dispute",
    sublabel: "Pre-litigation conciliation or pending consumer complaint settlement",
  },
  {
    value: "tenancy_rent_or_workplace_dues",
    label: "Tenancy Security Deposit, Rent or Unpaid Workplace Dues",
    sublabel: "Civil monetary claim capable of voluntary settlement",
  },
  {
    value: "matrimonial_family_compoundable",
    label: "Matrimonial / Family Dispute (Excluding Non-Compoundable Offences)",
    sublabel: "Pre-litigation family counselling and mutual settlement",
  },
  {
    value: "non_compoundable_criminal_offence",
    label: "Serious / Non-Compoundable Criminal Offence",
    sublabel: "Excluded under Proviso to Section 19(5) of the LSA Act, 1987",
  },
  {
    value: "urgent_safety_or_cyber_freeze",
    label: "Active Cyber Fraud (Golden Hour 1930) or Emergency Safety Threat",
    sublabel: "Requires immediate statutory helpline / police action rather than mediation",
  },
];

const COURT_STAGE_OPTIONS: Array<{
  value: LokAdalatCourtStage;
  label: string;
}> = [
  {
    value: "pre_litigation_no_case_filed",
    label: "No court case filed yet (Pre-Litigation Stage — Section 19(5)(ii) / 22B)",
  },
  {
    value: "pending_in_court",
    label: "Already pending in a Court / Tribunal (Section 20 Referral)",
  },
  {
    value: "unsure",
    label: "Not sure / Only received a notice or demand letter",
  },
];

const SETTLEMENT_CAPABILITY_OPTIONS: Array<{
  value: LokAdalatSettlementCapability;
  label: string;
}> = [
  {
    value: "capable_of_mutual_compromise",
    label: "Yes — It is a monetary, billing, refund, or compoundable civil dispute",
  },
  {
    value: "requires_criminal_prosecution_or_injunction",
    label: "No — It involves a non-compoundable crime or requires an urgent court injunction",
  },
  {
    value: "unsure",
    label: "Not sure whether the law treats this as compoundable",
  },
];

const WILLINGNESS_OPTIONS: Array<{
  value: LokAdalatWillingness;
  label: string;
}> = [
  {
    value: "citizen_wants_dlsa_conciliation_notice",
    label: "I am open to a fair settlement and want DLSA to invite the opposite party",
  },
  {
    value: "both_open_to_settlement",
    label: "Both sides have expressed willingness to discuss a mutual compromise",
  },
  {
    value: "no_willingness_to_settle",
    label: "Neither side wants a compromise — I want a contested adjudication on merits",
  },
  {
    value: "unsure",
    label: "Unsure — I want to understand what Lok Adalat settlement means first",
  },
];

export function LokAdalatSimulator({
  language = "en",
  onCreateCasePreparationBrief,
}: LokAdalatSimulatorProps) {
  const [disputeCategory, setDisputeCategory] =
    React.useState<LokAdalatDisputeCategory>(
      "public_utility_electricity_water_telecom"
    );
  const [courtStage, setCourtStage] = React.useState<LokAdalatCourtStage>(
    "pre_litigation_no_case_filed"
  );
  const [settlementCapability, setSettlementCapability] =
    React.useState<LokAdalatSettlementCapability>(
      "capable_of_mutual_compromise"
    );
  const [willingness, setWillingness] = React.useState<LokAdalatWillingness>(
    "citizen_wants_dlsa_conciliation_notice"
  );

  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>(
    {
      "la-check-basic-facts": true,
      "la-check-parties": true,
    }
  );

  const output = React.useMemo(
    () =>
      evaluateLokAdalatEducationalPathway({
        disputeCategory,
        courtStage,
        settlementCapability,
        willingness,
      }),
    [disputeCategory, courtStage, settlementCapability, willingness]
  );

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedChecklistCount = Object.values(checkedItems).filter(Boolean).length;

  const selectedDisputeObj = DISPUTE_CATEGORY_OPTIONS.find(
    (d) => d.value === disputeCategory
  );
  const selectedStageObj = COURT_STAGE_OPTIONS.find(
    (s) => s.value === courtStage
  );

  return (
    <div className="space-y-6">
      {/* Non-Negotiable Educational Disclaimer Banner */}
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-950 dark:text-amber-200">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <div className="font-extrabold">
              Educational Simulator Boundary (Not a Legal Eligibility Determination)
            </div>
            <p className="mt-1 leading-relaxed">
              {LOK_ADALAT_MANDATORY_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive 4-Step Simulator Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
          <Scale className="size-3.5" />
          Interactive ADR & Pre-Litigation Learning Simulator
        </div>
        <h2 className="mt-2 text-lg font-extrabold text-slate-900 sm:text-xl dark:text-white">
          Could Lok Adalat Be Relevant to This Situation?
        </h2>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
          Answer 4 quick educational questions to understand how Lok Adalat and Permanent Lok Adalat pathways work under the Legal Services Authorities Act, 1987.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {/* Question 1 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <label
              htmlFor="la-dispute-type"
              className="block text-xs font-extrabold text-slate-900 dark:text-white"
            >
              Step 1: What kind of dispute is this?
            </label>
            <select
              id="la-dispute-type"
              value={disputeCategory}
              onChange={(e) =>
                setDisputeCategory(e.target.value as LokAdalatDisputeCategory)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {DISPUTE_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {selectedDisputeObj && (
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                {selectedDisputeObj.sublabel}
              </p>
            )}
          </div>

          {/* Question 2 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <label
              htmlFor="la-court-stage"
              className="block text-xs font-extrabold text-slate-900 dark:text-white"
            >
              Step 2: Is it already before a court?
            </label>
            <select
              id="la-court-stage"
              value={courtStage}
              onChange={(e) =>
                setCourtStage(e.target.value as LokAdalatCourtStage)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {COURT_STAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question 3 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <label
              htmlFor="la-settlement-cap"
              className="block text-xs font-extrabold text-slate-900 dark:text-white"
            >
              Step 3: May this dispute be capable of mutual settlement?
            </label>
            <select
              id="la-settlement-cap"
              value={settlementCapability}
              onChange={(e) =>
                setSettlementCapability(
                  e.target.value as LokAdalatSettlementCapability
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {SETTLEMENT_CAPABILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question 4 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <label
              htmlFor="la-willingness"
              className="block text-xs font-extrabold text-slate-900 dark:text-white"
            >
              Step 4: Is there willingness to explore settlement?
            </label>
            <select
              id="la-willingness"
              value={willingness}
              onChange={(e) =>
                setWillingness(e.target.value as LokAdalatWillingness)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {WILLINGNESS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Educational Pathway Result (Phase 25) */}
        <div
          className={`mt-6 rounded-2xl border p-5 ${
            output.relevanceSignal === "commonly_explored_in_lok_adalat"
              ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20"
              : output.relevanceSignal === "depends_on_compoundability_and_consent"
                ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20"
                : "border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/20"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold text-white dark:bg-white dark:text-slate-950">
                <BookOpen className="size-3.5" />
                Educational Pathway Analysis
              </span>
              <h3 className="mt-2 text-base font-extrabold text-slate-900 sm:text-lg dark:text-white">
                {output.headline}
              </h3>
            </div>

            <TTSListenPlayer
              text={`${output.headline} ${output.whatLokAdalatMeans} ${output.whatSettlementMeans}`}
              language={language}
              label="Listen to Explanation"
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900/90">
              <div className="font-extrabold text-slate-900 dark:text-white">
                What Lok Adalat Generally Means
              </div>
              <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
                {output.whatLokAdalatMeans}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900/90">
              <div className="font-extrabold text-slate-900 dark:text-white">
                What Voluntary Settlement Means
              </div>
              <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
                {output.whatSettlementMeans}
              </p>
            </div>
          </div>

          {/* Why This Pathway Appears & Questions to Ask */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                Key Educational Takeaways
              </div>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {output.whyThisPathwayAppears.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                Questions to Ask Your DLSA Front Office or Panel Lawyer
              </div>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {output.questionsToAskDlsaOrLawyer.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <HelpCircle className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Statutory Citations */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200/60 pt-3 text-[11px] dark:border-slate-800">
            <span className="font-bold text-slate-500">
              Verified Statutory Sources:
            </span>
            {output.statutoryBasis.map((stat) => (
              <a
                key={stat.provision}
                href={stat.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700 hover:border-amber-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <span>{stat.provision}</span>
                <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Phase 26 & 27: Readiness Checklist + 1-Click Case Preparation Brief Bridge */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 sm:text-lg dark:text-white">
              Lok Adalat / ADR Readiness Checklist ({completedChecklistCount}/
              {output.readinessChecklist.length} Prepared)
            </h3>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
              Check the items you have ready, then click &ldquo;Create Case Preparation Brief&rdquo; to generate a printable A4 discussion sheet for your DLSA Front Office or lawyer.
            </p>
          </div>

          {onCreateCasePreparationBrief && (
            <button
              type="button"
              onClick={() =>
                onCreateCasePreparationBrief({
                  disputeLabel:
                    selectedDisputeObj?.label ?? "Civil / Utility Dispute",
                  courtStageLabel:
                    selectedStageObj?.label ?? "Pre-Litigation Stage",
                  summaryNote: `${selectedDisputeObj?.label ?? "Dispute"} (${selectedStageObj?.label ?? "Pre-litigation"}). Prepared ${completedChecklistCount}/${output.readinessChecklist.length} readiness items for DLSA / Lok Adalat consultation.`,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-xs transition hover:bg-amber-400"
            >
              <FileText className="size-4" />
              Create Case Preparation Brief (A4)
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {output.readinessChecklist.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <label
                key={item.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition ${
                  isChecked
                    ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="mt-1 size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      {item.category}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
