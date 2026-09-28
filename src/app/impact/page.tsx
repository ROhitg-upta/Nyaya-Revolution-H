import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  EyeOff,
  Globe,
  Info,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AppHeader } from '@/components/common/app-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { Badge } from '@/components/ui/badge';
import { fetchPublicImpactSummaryAction } from '@/actions/outcome-analytics.actions';

export const metadata: Metadata = {
  title: 'Public Impact & Privacy-Preserving Citizen Outcomes · Nyaya Revolution',
  description:
    'Transparent, denominator-verified aggregate citizen outcome indicators with strict small-cohort privacy suppression (n >= 10).',
};

export default async function PublicImpactPage() {
  const summary = await fetchPublicImpactSummaryAction('90d');

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-950 py-10 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Governance Link */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/action-center/case-prep"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-teal-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Citizen Case Preparation Workspace
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-teal-500/40 hover:text-teal-200 transition-colors"
            >
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              Internal Moderator Analytics Console (/analytics)
            </Link>
          </div>

          {/* Public Hero Header */}
          <header className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-teal-950/25 p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-teal-500/15 text-teal-300 border-teal-500/30 text-xs">
                <Globe className="h-3.5 w-3.5 mr-1.5" />
                Public Privacy-Preserving Impact Report
              </Badge>
              <Badge
                variant="outline"
                className="border-slate-700 text-slate-300 text-xs"
              >
                Observation Window: {summary.periodLabel}
              </Badge>
              <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                Small-Cell Privacy Threshold: n &ge; {summary.minPublicCohortThreshold}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Citizen Clarity, Preparation & Verified Assistance Impact
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Nyaya Revolution tracks whether plain-language legal modules, bilingual
              case preparation dossiers, and verified directory entries actually help
              citizens understand their options and take a concrete next step — without
              collecting unnecessary sensitive data or making exaggerated causal claims.
            </p>

            {/* Methodology & Non-Causality Banner */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200 flex items-start gap-3">
              <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-100">
                  Methodology & Statistical Honesty Guarantee:
                </strong>{' '}
                {summary.methodologyDisclaimer}
              </div>
            </div>
          </header>

          {/* 4 Public Aggregate Headline Cards */}
          <section
            aria-label="Public Aggregate Outcome Indicators"
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {summary.aggregateMetrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-bold text-slate-100">
                    {metric.title}
                  </h2>
                  <Badge
                    className={
                      metric.evidenceType === 'PLATFORM_EVENT'
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-[10px]'
                        : 'bg-teal-500/15 text-teal-300 border-teal-500/30 text-[10px]'
                    }
                  >
                    {metric.evidenceType}
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-3xl font-extrabold text-teal-300">
                    {metric.valueDisplay}
                  </div>
                  {!metric.isSuppressed && (
                    <span className="font-mono text-xs text-slate-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      Exact Cohort: {metric.numerator.toLocaleString()} /{' '}
                      {metric.denominator.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {metric.populationDescription}
                </p>
              </div>
            ))}
          </section>

          {/* Safe Category Summaries with Small-Cell Suppression */}
          <section
            aria-label="Category-Level Public Summary"
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-teal-400" />
                  Issue Category Breakdown (Privacy-Thresholded)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Categories with fewer than {summary.minPublicCohortThreshold} voluntary
                  respondents automatically suppress percentage distributions in public
                  views.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {summary.safeCategorySummaries.map((cat) => (
                <div
                  key={cat.categoryLabel}
                  className={`rounded-xl border p-4 flex flex-wrap items-center justify-between gap-4 ${
                    cat.isSuppressed
                      ? 'border-amber-500/30 bg-amber-950/15'
                      : 'border-slate-800 bg-slate-950/80'
                  }`}
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100">
                        {cat.categoryLabel}
                      </span>
                      <Badge
                        className={
                          cat.isSuppressed
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px]'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px]'
                        }
                      >
                        {cat.isSuppressed ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Suppressed (n = {cat.totalRespondents} &lt;{' '}
                            {summary.minPublicCohortThreshold})
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified Cohort (n = {cat.totalRespondents})
                          </>
                        )}
                      </Badge>
                    </div>
                    <p
                      className={`text-xs ${
                        cat.isSuppressed ? 'text-amber-200/90' : 'text-slate-300'
                      }`}
                    >
                      {cat.summaryStatement}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action for Citizens */}
          <section className="rounded-2xl border border-teal-500/30 bg-teal-950/20 p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-400" />
                Have you used the Citizen Case Preparation Workspace?
              </h3>
              <p className="text-xs text-slate-300">
                You can voluntarily log or update your outcome timeline (privately or in
                strict anonymous mode) directly inside your Case Preparation Workspace.
              </p>
            </div>
            <Link
              href="/action-center/case-prep"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-500 transition-colors"
            >
              Open Case Prep & Voluntary Check-In
            </Link>
          </section>
        </div>
      </main>
      <LandingFooter />
    </>
  );
}
