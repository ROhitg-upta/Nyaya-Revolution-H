"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  ExternalLink,
  FileText,
  Phone,
  Scale,
  ShieldCheck,
} from "@/lib/icons";
import type {
  CitizenDocumentTemplateType,
  RankedVerifiedResource,
} from "@/types/action-engine";

interface YourNextStepsCardProps {
  primaryCategory: string;
  plainLanguageExplanation: string;
  recommendedResources: RankedVerifiedResource[];
  recommendedLessons?: string[];
  recommendedRights?: string[];
  onSelectTemplateDraft?: (templateType: CitizenDocumentTemplateType) => void;
}

const CATEGORY_TO_TEMPLATE: Record<string, CitizenDocumentTemplateType> = {
  "Consumer Rights": "consumer-grievance-v1",
  "Cyber Safety": "cyber-fraud-incident-v1",
  "Tenancy & Housing": "legal-aid-checklist-v1",
  "Labour & Employment": "workplace-wage-representation-v1",
  "RTI & Governance": "rti-application-v1",
  "Fundamental Rights": "legal-aid-checklist-v1",
};

export function YourNextStepsCard({
  primaryCategory,
  plainLanguageExplanation,
  recommendedResources,
  recommendedLessons = [],
  recommendedRights = [],
  onSelectTemplateDraft,
}: YourNextStepsCardProps) {
  const recommendedTemplate =
    CATEGORY_TO_TEMPLATE[primaryCategory] ?? "legal-aid-checklist-v1";

  return (
    <section
      aria-label="Your Next Steps Action Plan"
      className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/70 to-amber-50/30 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <ShieldCheck className="size-3.5" aria-hidden />
            Citizen Action Roadmap • {primaryCategory}
          </span>
          <h3 className="mt-1.5 text-lg font-bold text-slate-900 dark:text-slate-100">
            Your Next Steps: Understand → Learn → Find Verified Help → Prepare Draft
          </h3>
        </div>

        <Link
          href={`/action-center?category=${encodeURIComponent(primaryCategory)}&template=${encodeURIComponent(recommendedTemplate)}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
        >
          <FileText className="size-3.5" aria-hidden />
          Open Citizen Action Studio
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      {/* Step 1: Plain-Language Legal Understanding */}
      <div className="mt-4 rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          <Scale className="size-4" aria-hidden />
          Step 1: What Indian Law Says in Plain Language
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {plainLanguageExplanation}
        </p>
        {(recommendedLessons.length > 0 || recommendedRights.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <BookOpen className="size-3.5 text-amber-600" aria-hidden />
              Verified Learning:
            </span>
            {recommendedLessons.slice(0, 2).map((slug) => (
              <Link
                key={slug}
                href={`/learn`}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-amber-500/15 hover:text-amber-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Lesson: {slug.replace(/-/g, " ")}
              </Link>
            ))}
            {recommendedRights.slice(0, 2).map((slug) => (
              <Link
                key={slug}
                href={`/rights`}
                className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
              >
                Right: {slug.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Top Verified Assistance & Official Helplines */}
      <div className="mt-4">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Building2 className="size-4" aria-hidden />
            Step 2: Verified Official Legal Aid & Grievance Portals
          </div>
          <span className="text-[11px] text-slate-500">
            Strictly verified official sources • Zero unverified contacts
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {recommendedResources.slice(0, 4).map((resource) => (
            <div
              key={resource.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <BadgeCheck className="size-3.5" aria-hidden />
                    {resource.shortName}
                  </span>
                  {resource.helplineNumber ? (
                    <a
                      href={`tel:${resource.helplineNumber}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300"
                    >
                      <Phone className="size-3" aria-hidden />
                      Call {resource.helplineNumber}
                    </a>
                  ) : null}
                </div>

                <h4 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {resource.authorityName}
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {resource.description}
                </p>

                {resource.jurisdictionWarning ? (
                  <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50/80 p-2 text-[11px] text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                    <span>{resource.jurisdictionWarning}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 dark:border-slate-800">
                <span>
                  State: <strong>{resource.state}</strong> • Verified:{" "}
                  {resource.lastVerifiedAt}
                </span>
                <a
                  href={resource.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:underline dark:text-amber-400"
                >
                  Official Portal
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Prepare Structured Citizen Draft */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Step 3: Prepare a Structured Citizen Draft (Educational Template)
          </div>
          <p className="mt-0.5 text-xs text-amber-900/80 dark:text-amber-200/80">
            Generate a structured {recommendedTemplate.replace(/-v1$/, "").replace(/-/g, " ")} draft with chronological facts and statutory context for your personal review.
          </p>
        </div>

        {onSelectTemplateDraft ? (
          <button
            type="button"
            onClick={() => onSelectTemplateDraft(recommendedTemplate)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-500"
          >
            <FileText className="size-3.5" aria-hidden />
            Prepare Draft Now
          </button>
        ) : (
          <Link
            href={`/action-center?category=${encodeURIComponent(primaryCategory)}&template=${encodeURIComponent(recommendedTemplate)}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-500"
          >
            <FileText className="size-3.5" aria-hidden />
            Prepare Draft in Action Studio
          </Link>
        )}
      </div>
    </section>
  );
}
