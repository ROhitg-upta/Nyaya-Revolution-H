'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Download,
  EyeOff,
  FileJson,
  FileSpreadsheet,
  Filter,
  Globe,
  Info,
  Layers,
  Lock,
  MessageSquareQuote,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  exportAggregateAnalyticsAction,
  fetchInternalImpactAnalyticsAction,
} from '@/actions/outcome-analytics.actions';
import type {
  AnalyticsTimeWindow,
  InstitutionalImpactDashboardSnapshot,
} from '@/types/outcome-analytics';

interface InstitutionalImpactConsoleProps {
  initialSnapshot: InstitutionalImpactDashboardSnapshot;
  viewerRole?: string;
}

const TIME_WINDOWS: Array<{ value: AnalyticsTimeWindow; label: string }> = [
  { value: '7d', label: 'Last 7 Days (Small-Cohort Demo)' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '12m', label: 'Last 12 Months' },
  { value: 'all', label: 'All Recorded' },
];

export function InstitutionalImpactConsole({
  initialSnapshot,
  viewerRole = 'moderator',
}: InstitutionalImpactConsoleProps) {
  const [snapshot, setSnapshot] =
    React.useState<InstitutionalImpactDashboardSnapshot>(initialSnapshot);
  const [selectedPeriod, setSelectedPeriod] =
    React.useState<AnalyticsTimeWindow>(initialSnapshot.period);
  const [isLoadingPeriod, setIsLoadingPeriod] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportPreview, setExportPreview] = React.useState<{
    filename: string;
    content: string;
  } | null>(null);

  async function handlePeriodChange(nextPeriod: AnalyticsTimeWindow) {
    setSelectedPeriod(nextPeriod);
    setIsLoadingPeriod(true);
    try {
      const res = await fetchInternalImpactAnalyticsAction(nextPeriod);
      setSnapshot(res.snapshot);
    } finally {
      setIsLoadingPeriod(false);
    }
  }

  async function handleExport(format: 'csv' | 'json') {
    setIsExporting(true);
    try {
      const file = await exportAggregateAnalyticsAction(selectedPeriod, format);
      setExportPreview({
        filename: file.filename,
        content: file.content,
      });

      if (typeof window !== 'undefined') {
        const blob = new Blob([file.content], { type: file.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section
      aria-label="Institutional Impact & Outcome Intelligence Console"
      className="space-y-6 rounded-2xl border border-teal-500/30 bg-slate-950/90 p-5 sm:p-6 shadow-xl"
    >
      {/* Top Governance & Methodology Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-teal-500/15 text-teal-300 border-teal-500/30 text-xs">
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
              SPRINT E16 • Institutional Impact & Outcome Intelligence
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-700 text-slate-300 text-xs"
            >
              <Lock className="h-3 w-3 mr-1 text-amber-400" />
              Internal Governance Console ({viewerRole})
            </Badge>
            <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-xs">
              Min Public Cohort: n &ge; {snapshot.minCohortThreshold}
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            Verified Outcomes Feedback Loop & Funnel Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Measures how effectively citizens move from initial confusion to structured
            preparation, verified assistance contact, and longitudinal follow-up — with
            exact denominators, evidence tags, and automatic small-cell suppression.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/impact"
            className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-950/40 px-3 py-2 text-xs font-medium text-teal-200 hover:bg-teal-900/50 transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            View Public Safe Impact Page (/impact)
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isExporting}
            onClick={() => handleExport('csv')}
            className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
            Export Aggregate CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isExporting}
            onClick={() => handleExport('json')}
            className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs"
          >
            <FileJson className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
            Export Aggregate JSON
          </Button>
        </div>
      </div>

      {/* Time Window Selector & Respondent Cohort Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mr-1">
            <Filter className="h-3.5 w-3.5 text-teal-400" />
            Observation Window:
          </span>
          {TIME_WINDOWS.map((win) => (
            <button
              key={win.value}
              type="button"
              disabled={isLoadingPeriod}
              onClick={() => handlePeriodChange(win.value)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                selectedPeriod === win.value
                  ? 'bg-teal-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {win.label}
            </button>
          ))}
          {isLoadingPeriod && (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-400 ml-1" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-2.5 py-1 border border-slate-800">
            <Users className="h-3.5 w-3.5 text-teal-400" />
            Valid Check-In Cohort: <strong>n = {snapshot.totalValidRespondents}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-2.5 py-1 border border-slate-800">
            <EyeOff className="h-3.5 w-3.5 text-amber-400" />
            Anonymous: <strong>{snapshot.totalAnonymousCheckIns}</strong> | Linked:{' '}
            <strong>{snapshot.totalAuthenticatedCheckIns}</strong>
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-md bg-rose-950/30 text-rose-300 px-2.5 py-1 border border-rose-500/30"
            title="Contradictory or duplicate submissions excluded from valid denominators"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            Excluded Contradictory Signals: <strong>{snapshot.flaggedAnomalyCount}</strong>
          </span>
        </div>
      </div>

      {/* Strict Methodology & Anti-False-Causality Notice */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-xs text-amber-200 flex items-start gap-3">
        <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-amber-100">
            Denominator & Evidence Governance Rule:
          </strong>{' '}
          {snapshot.methodologyBanner}
        </div>
      </div>

      {/* 3 Honest Headline Cards with Explicit Numerator / Denominator & Population */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          {
            title: 'Procedural & Rights Clarity Signal',
            metric: snapshot.clarityHeadline,
            evidence: 'SELF_REPORTED',
            accent: 'border-teal-500/40 bg-teal-950/20',
          },
          {
            title: 'Case Preparation Workspace Helpfulness',
            metric: snapshot.preparationHelpfulnessHeadline,
            evidence: 'SELF_REPORTED',
            accent: 'border-sky-500/40 bg-sky-950/20',
          },
          {
            title: 'Verified Resource Contact Rate',
            metric: snapshot.nextStepActionHeadline,
            evidence: 'SELF_REPORTED',
            accent: 'border-emerald-500/40 bg-emerald-950/20',
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`rounded-xl border p-4 space-y-2.5 ${card.accent}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-200">
                {card.title}
              </span>
              <Badge
                variant="outline"
                className="border-slate-700 bg-slate-950/80 text-[10px] text-slate-300"
              >
                {card.evidence}
              </Badge>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                {card.metric.percentage}%
              </span>
              <span className="text-xs font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                {card.metric.numerator} / {card.metric.denominator} respondents
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {card.metric.honestStatement}
            </p>
          </div>
        ))}
      </div>

      {/* 7-Stage Citizen Action & Outcome Funnel */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal-400" />
              7-Stage Citizen Journey Funnel ({snapshot.periodLabel})
            </h3>
            <p className="text-xs text-slate-400">
              Separates automated platform interaction telemetry (`PLATFORM_EVENT`) from
              voluntary citizen follow-up check-ins (`SELF_REPORTED`).
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {snapshot.funnelStages.map((stage) => (
            <div
              key={stage.stageKey}
              className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-slate-100">
                    {stage.label}
                  </span>
                  <Badge
                    className={
                      stage.evidenceSource === 'PLATFORM_EVENT'
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-[10px]'
                        : 'bg-teal-500/15 text-teal-300 border-teal-500/30 text-[10px]'
                    }
                  >
                    {stage.evidenceSource}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {stage.numerator.toLocaleString()} /{' '}
                    {stage.denominator.toLocaleString()}
                  </span>
                  <span className="font-bold text-teal-300 w-14 text-right">
                    {stage.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stage.evidenceSource === 'PLATFORM_EVENT'
                      ? 'bg-indigo-500'
                      : 'bg-teal-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(4, stage.percentage))}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>{stage.honestInterpretation}</span>
                <span>Denominator Population: {stage.populationLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Outcome Breakdown with Small-Cell Cohort Suppression */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-400" />
              Issue Category Breakdown & Small-Cell Privacy Suppression
            </h3>
            <p className="text-xs text-slate-400">
              Any category with fewer than {snapshot.minCohortThreshold} respondents (
              <code>n &lt; {snapshot.minCohortThreshold}</code>) automatically suppresses
              percentage breakdowns to prevent small-cohort inference. (Switch window to{' '}
              <strong>Last 7 Days</strong> above to see dynamic cohort suppression across
              categories.)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Legal Issue Category</th>
                <th className="py-2.5 px-3 font-semibold">Sessions / Case Preps</th>
                <th className="py-2.5 px-3 font-semibold">Check-In Cohort (n)</th>
                <th className="py-2.5 px-3 font-semibold">Reported Improved Clarity</th>
                <th className="py-2.5 px-3 font-semibold">Contacted Verified Channel</th>
                <th className="py-2.5 px-3 font-semibold">Addressed / Resolved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {snapshot.categoryBreakdowns.map((cat) => (
                <tr key={cat.categoryKey} className="hover:bg-slate-900/80">
                  <td className="py-3 px-3 font-medium text-slate-100">
                    <div>{cat.categoryLabel}</div>
                    {cat.topContactMethod && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Primary Channel: {cat.topContactMethod}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {cat.totalSessionsStarted.toLocaleString()} /{' '}
                    {cat.totalCasePrepsCreated.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      className={
                        cat.isSuppressedByCohortThreshold
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }
                    >
                      n = {cat.totalRespondents}
                    </Badge>
                  </td>
                  {cat.isSuppressedByCohortThreshold ? (
                    <td
                      colSpan={3}
                      className="py-3 px-3 text-amber-300/90 bg-amber-950/15 font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>
                          {cat.suppressionReason ||
                            'Not enough data to display safely (n < 10)'}
                        </span>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-3 px-3 text-slate-200">
                        <span className="font-bold text-teal-300">
                          {cat.reportedClearerPct}%
                        </span>{' '}
                        <span className="text-slate-400 font-mono text-[11px]">
                          ({cat.reportedClearerCount}/{cat.totalRespondents})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200">
                        <span className="font-bold text-sky-300">
                          {cat.reportedContactedPct}%
                        </span>{' '}
                        <span className="text-slate-400 font-mono text-[11px]">
                          ({cat.reportedContactedCount}/{cat.totalRespondents})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200">
                        <span className="font-bold text-emerald-300">
                          {cat.reportedAddressedOrResolvedPct}%
                        </span>{' '}
                        <span className="text-slate-400 font-mono text-[11px]">
                          ({cat.reportedAddressedOrResolvedCount}/{cat.totalRespondents})
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Column Lower Grid: Descriptive Resource Accessibility & Grounded Qualitative Themes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Descriptive Resource Accessibility Signals */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-3.5">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              Verified Resource Reachability Signals (Descriptive Only)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracks citizen contact experiences to trigger E13 Moderator Freshness
              Verification when phone numbers or office hours change. Never ranks
              authorities as &ldquo;best/worst&rdquo;.
            </p>
          </div>

          <div className="space-y-3">
            {snapshot.resourceAccessibilitySignals.map((res) => (
              <div
                key={res.resourceId}
                className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-slate-100">
                      {res.resourceName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {res.resourceType} • {res.stateName} • Cohort n ={' '}
                      {res.totalFeedbackCount}
                    </div>
                  </div>
                  {res.governanceReviewSuggested ? (
                    <Link
                      href="/governance"
                      className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-950/40 px-2 py-1 text-[11px] font-medium text-amber-200 hover:bg-amber-900/50"
                    >
                      <AlertTriangle className="h-3 w-3 text-amber-400" />
                      Verify Hours in E13 Console
                    </Link>
                  ) : (
                    <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px]">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      High Reachability
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2 text-[11px] text-center pt-1">
                  <div className="rounded bg-slate-900 p-1.5 border border-slate-800">
                    <div className="text-teal-300 font-bold">
                      {res.foundResourceCount}
                    </div>
                    <div className="text-slate-400">Reached</div>
                  </div>
                  <div className="rounded bg-slate-900 p-1.5 border border-slate-800">
                    <div className="text-emerald-300 font-bold">
                      {res.receivedResponseCount}
                    </div>
                    <div className="text-slate-400">Responded</div>
                  </div>
                  <div className="rounded bg-slate-900 p-1.5 border border-slate-800">
                    <div className="text-sky-300 font-bold">
                      {res.stillWaitingCount}
                    </div>
                    <div className="text-slate-400">Awaiting</div>
                  </div>
                  <div className="rounded bg-slate-900 p-1.5 border border-slate-800">
                    <div className="text-amber-300 font-bold">
                      {res.couldNotReachCount}
                    </div>
                    <div className="text-slate-400">Unreached</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 pt-1">
                  {res.descriptiveAccessibilityNote}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Grounded Qualitative Theme Clusters */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-3.5">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <MessageSquareQuote className="h-4 w-4 text-teal-400" />
              Grounded Qualitative Feedback Themes (PII-Scrubbed)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Synthesized strictly from anonymized citizen feedback notes to guide
              product and documentation improvements.
            </p>
          </div>

          <div className="space-y-3">
            {snapshot.qualitativeThemes.map((theme) => (
              <div
                key={theme.themeId}
                className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-100">
                    {theme.themeTitle}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-teal-500/30 text-teal-300 text-[10px]"
                  >
                    {theme.mentionCount} anonymized mentions
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-400">
                  Scope: {theme.categoryScope} • {theme.groundingNote}
                </div>
                <p className="text-xs text-slate-300">{theme.neutralSummary}</p>
                <div className="rounded-lg bg-teal-950/25 border border-teal-500/25 px-2.5 py-1.5 text-[11px] text-teal-200">
                  <strong>Actionable UX Improvement:</strong>{' '}
                  {theme.suggestedPlatformImprovement}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aggregate Export Preview Drawer (if triggered) */}
      {exportPreview && (
        <div className="rounded-xl border border-sky-500/40 bg-slate-950 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
              <Download className="h-4 w-4" />
              <span>
                Downloaded Aggregate Non-Identifying Dataset:{' '}
                <code>{exportPreview.filename}</code>
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExportPreview(null)}
              className="h-7 text-xs text-slate-400 hover:text-slate-200"
            >
              Close Preview
            </Button>
          </div>
          <pre className="max-h-56 overflow-auto rounded-lg border border-slate-800 bg-slate-900/90 p-3 text-[11px] text-slate-200 font-mono">
            {exportPreview.content}
          </pre>
        </div>
      )}
    </section>
  );
}
