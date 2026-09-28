'use client';

import * as React from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  Download,
  FileText,
  RefreshCw,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  exportPrivacySafeIcsReminderAction,
  saveCitizenProceduralFollowupAction,
} from '@/actions/closed-loop-followup.actions';
import {
  computeElapsedWindowMetrics,
  STATUTORY_PROCEDURAL_WINDOWS_CATALOG,
  type AuthorityFreshnessAlertRecord,
  type CitizenProceduralFollowupRecord,
  type FollowupProgressStatus,
  type ProceduralPathwayKey,
} from '@/types/closed-loop-followup';

interface ProceduralFollowupTrackerCardProps {
  caseId: string;
  initialAuthorityName?: string;
  initialPathwayKey?: ProceduralPathwayKey;
  initialRecord?: CitizenProceduralFollowupRecord;
  activeFreshnessAlerts?: AuthorityFreshnessAlertRecord[];
}

const PATHWAY_KEYS: ProceduralPathwayKey[] = [
  'cyber_fraud_1930',
  'rti_act_s7',
  'consumer_helpline_1915',
  'labour_samadhan_wages',
  'dlsa_prelitigation_clinic',
];

const FOLLOWUP_STATUS_OPTIONS: Array<{
  value: FollowupProgressStatus;
  label: string;
}> = [
  {
    value: 'awaiting_within_window',
    label: 'Awaiting response (within standard reference window)',
  },
  {
    value: 'acknowledgment_received',
    label: 'Received diary / docket acknowledgment — awaiting action',
  },
  {
    value: 'window_elapsed_escalation_ready',
    label: 'Reference window elapsed — preparing escalation / First Appeal',
  },
  {
    value: 'followup_submitted',
    label: 'Submitted Follow-Up / Escalation Addendum',
  },
  {
    value: 'resolved_closed',
    label: 'Matter addressed or closed',
  },
];

const DEFAULT_ALERTS: AuthorityFreshnessAlertRecord[] = [
  {
    id: 'alert_ncrp_bank_nodal_03',
    authorityId: 'res_ncrp_1930',
    authorityName: 'National Cyber Crime Reporting Portal & 1930 Helpline',
    authorityType: 'Statutory Helpline & Portal',
    stateCode: 'ALL',
    triggerReason:
      '7 citizen check-ins requested clearer UTR & 15-digit NCRP acknowledgement checklist before visiting local cyber cell.',
    unreachedReportCount: 7,
    totalWindowReports: 54,
    windowDays: 30,
    priorityBadge: 'HIGH_PRIORITY_CITIZEN_SIGNAL',
    status: 'resolved_updated',
    currentVersionNumber: 4,
    resolvedByVersion: 5,
    verifiedFallbackChannel:
      'cybercrime.gov.in Online Complaint Tracker + 1930 Toll-Free',
    verifiedFallbackUrl: 'https://cybercrime.gov.in',
    citizenNoticeMessage:
      'Verified Authority Snapshot Updated (v4 → v5): Added direct NCRP 15-digit Acknowledgement status check guidance and Bank Nodal Officer UTR checklist.',
    moderatorResolutionNote:
      'Published immutable snapshot v5 with updated I4C citizen checklist instructions.',
    officialSourceUrl: 'https://cybercrime.gov.in',
    createdAt: '2026-09-22T09:00:00.000Z',
    resolvedAt: '2026-09-27T16:45:00.000Z',
  },
  {
    id: 'alert_labour_mh_01',
    authorityId: 'res_state_labour_desk',
    authorityName: 'Regional Labour Commissioner Helpline Entry (Mumbai / Pune Desk)',
    authorityType: 'Departmental Grievance Desk',
    stateCode: 'MH',
    triggerReason:
      '9 non-contradictory citizen check-ins reported `could_not_reach` on landline after 17:00 IST.',
    unreachedReportCount: 9,
    totalWindowReports: 22,
    windowDays: 30,
    priorityBadge: 'HIGH_PRIORITY_CITIZEN_SIGNAL',
    status: 'open',
    currentVersionNumber: 2,
    resolvedByVersion: null,
    verifiedFallbackChannel:
      'SAMADHAN Official Portal (samadhan.labour.gov.in) & NALSA Toll-Free 15100',
    verifiedFallbackUrl: 'https://samadhan.labour.gov.in',
    citizenNoticeMessage:
      'Recent check-ins noted difficulty reaching this landline after 17:00 IST. Moderator verification is in progress. Verified 24x7 alternative channel: samadhan.labour.gov.in or Toll-Free 15100.',
    moderatorResolutionNote: null,
    officialSourceUrl: 'https://samadhan.labour.gov.in',
    createdAt: '2026-09-25T10:15:00.000Z',
    resolvedAt: null,
  },
];

export function ProceduralFollowupTrackerCard({
  caseId,
  initialAuthorityName = 'National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)',
  initialPathwayKey = 'cyber_fraud_1930',
  initialRecord,
  activeFreshnessAlerts = DEFAULT_ALERTS,
}: ProceduralFollowupTrackerCardProps) {
  const [pathwayKey, setPathwayKey] =
    React.useState<ProceduralPathwayKey>(
      initialRecord?.pathwayKey || initialPathwayKey
    );
  const [docketOrDiaryRef, setDocketOrDiaryRef] = React.useState(
    initialRecord?.docketOrDiaryRef || 'NCRP-ACK-2026-0918442'
  );
  const [authorityContactedName, setAuthorityContactedName] = React.useState(
    initialRecord?.authorityContactedName || initialAuthorityName
  );
  const [contactChannelUsed, setContactChannelUsed] = React.useState(
    initialRecord?.contactChannelUsed ||
      STATUTORY_PROCEDURAL_WINDOWS_CATALOG[initialPathwayKey].initialFilingChannel
  );
  const [contactedAt, setContactedAt] = React.useState(
    initialRecord?.contactedAt || '2026-09-19'
  );
  const [reminderIntervalDays, setReminderIntervalDays] = React.useState<7 | 15 | 30>(
    initialRecord?.reminderIntervalDays || 15
  );
  const [followupStatus, setFollowupStatus] =
    React.useState<FollowupProgressStatus>(
      initialRecord?.followupStatus || 'awaiting_within_window'
    );
  const [summaryOfResponse, setSummaryOfResponse] = React.useState(
    initialRecord?.summaryOfResponse ||
      'Received automated 15-digit NCRP SMS acknowledgment; awaiting bank nodal lien confirmation and police station FIR diary reference.'
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [copiedAddendum, setCopiedAddendum] = React.useState(false);
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);
  const [showAddendumPreview, setShowAddendumPreview] = React.useState(true);

  const currentSpec = STATUTORY_PROCEDURAL_WINDOWS_CATALOG[pathwayKey];
  const windowMetrics = computeElapsedWindowMetrics(
    contactedAt,
    currentSpec.standardWindowDays
  );

  const liveAddendumEn = [
    `=== NYAYA REVOLUTION • CITIZEN PROCEDURAL FOLLOW-UP ADDENDUM ===`,
    `1. Pathway Reference: ${currentSpec.pathwayTitle}`,
    `2. Statutory / Administrative Citation: ${currentSpec.statutoryOrRuleCitation}`,
    `3. Initial Authority Contacted: ${authorityContactedName} (${contactChannelUsed})`,
    `4. Date of Initial Submission: ${contactedAt} (${windowMetrics.elapsedDays} days elapsed of standard ${currentSpec.standardWindowDays}-day reference window)`,
    `5. Official Docket / Diary / Registration No.: ${docketOrDiaryRef || '[Pending Reference]'}`,
    `6. Status / Summary of Response to Date: ${summaryOfResponse || 'Awaiting substantive response'}`,
    `7. Next Procedural Step / Escalation Channel: ${currentSpec.escalationAuthorityTitle}`,
    `Notice: Citizen-organized follow-up record prepared for verification with ${currentSpec.escalationAuthorityTitle} or a DLSA Legal-Aid Clinic.`,
  ].join('\n');

  const liveAddendumHi = [
    `=== न्याय रिवोल्यूशन • नागरिक प्रक्रियात्मक फॉलो-अप अनुलग्नक (ADDENDUM) ===`,
    `1. प्रक्रिया मार्ग: ${currentSpec.pathwayTitleHi}`,
    `2. विधिक / प्रशासनिक संदर्भ: ${currentSpec.statutoryOrRuleCitation}`,
    `3. प्रारंभिक संपर्क कार्यालय: ${authorityContactedName} (${contactChannelUsed})`,
    `4. प्रारंभिक आवेदन तिथि: ${contactedAt} (मानक ${currentSpec.standardWindowDays}-दिवसीय संदर्भ अवधि में से ${windowMetrics.elapsedDays} दिन पूर्ण)`,
    `5. डॉकेट / डायरी / पंजीकरण संख्या: ${docketOrDiaryRef || '[लंबित संदर्भ संख्या]'}`,
    `6. अब तक प्राप्त उत्तर / स्थिति का विवरण: ${summaryOfResponse || 'प्रतिक्रिया की प्रतीक्षा है'}`,
    `7. अगला प्रक्रियात्मक चरण / अपीलीय प्राधिकारी: ${currentSpec.escalationAuthorityTitleHi}`,
  ].join('\n');

  async function handleSaveFollowup(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMsg(null);

    try {
      const res = await saveCitizenProceduralFollowupAction({
        caseId,
        pathwayKey,
        docketOrDiaryRef,
        authorityContactedName,
        contactChannelUsed,
        contactedAt,
        reminderIntervalDays,
        followupStatus,
        summaryOfResponse,
      });
      if (res.success) {
        setFeedbackMsg(
          `Saved Follow-Up Docket (${res.record.docketOrDiaryRef}) & refreshed Bilingual Escalation Addendum.`
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDownloadIcs(days: 7 | 15 | 30) {
    setReminderIntervalDays(days);
    const file = await exportPrivacySafeIcsReminderAction(days, pathwayKey);
    if (typeof window !== 'undefined') {
      const blob = new Blob([file.icsContent], { type: file.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFeedbackMsg(
        `Downloaded privacy-safe +${days} Day calendar reminder (${file.filename}) with zero PII in event title.`
      );
    }
  }

  function handleCopyAddendum() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${liveAddendumEn}\n\n${liveAddendumHi}`);
      setCopiedAddendum(true);
      setTimeout(() => setCopiedAddendum(false), 2500);
    }
  }

  const progressPct = Math.min(
    100,
    Math.max(
      6,
      Math.round((windowMetrics.elapsedDays / currentSpec.standardWindowDays) * 100)
    )
  );

  return (
    <section
      aria-label="Closed-Loop Authority Freshness & Procedural Follow-Up Engine"
      className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-950/25 p-5 sm:p-6 shadow-xl space-y-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-[11px]">
              <CalendarClock className="h-3.5 w-3.5 mr-1" />
              SPRINT E17 • Closed-Loop Self-Healing & Follow-Up Engine
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-700 text-slate-300 text-[11px]"
            >
              Non-Advisory Statutory Reference Windows
            </Badge>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100">
            Procedural Waiting-Window Tracker, Authority Self-Healing & Follow-Up Addendum
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Tracks elapsed days from your initial filing, surfaces verified fallback
            channels whenever citizen check-ins flag an unreachable desk, and prepares a
            1-page Bilingual Follow-Up Addendum without re-entering your case.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {([7, 15, 30] as const).map((days) => (
            <Button
              key={days}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDownloadIcs(days)}
              className="border-indigo-500/40 bg-indigo-950/40 text-indigo-200 hover:bg-indigo-900/60 text-xs"
            >
              <BellRing className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
              +{days}d .ics Reminder
            </Button>
          ))}
        </div>
      </div>

      {/* PART 1: Closed-Loop Authority Self-Healing Notices (E16 -> E13 -> E14) */}
      <div className="space-y-2.5">
        <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-400" />
          <span>
            Live Closed-Loop Directory Freshness Status (E16 Citizen Signals → E13
            Moderator Governance)
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {activeFreshnessAlerts.slice(0, 2).map((alert) => {
            const isResolved = alert.status === 'resolved_updated';
            return (
              <div
                key={alert.id}
                className={`rounded-xl border p-3.5 space-y-1.5 ${
                  isResolved
                    ? 'border-emerald-500/35 bg-emerald-950/20'
                    : 'border-amber-500/35 bg-amber-950/20'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-100">
                    {alert.authorityName}
                  </span>
                  <Badge
                    className={
                      isResolved
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px]'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px]'
                    }
                  >
                    {isResolved ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Snapshot Updated (v{alert.currentVersionNumber} → v
                        {alert.resolvedByVersion})
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Under Freshness Review (n = {alert.unreachedReportCount} signals)
                      </>
                    )}
                  </Badge>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {alert.citizenNoticeMessage}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-300">
                  <span>
                    <strong>Verified Backup Channel:</strong>{' '}
                    {alert.verifiedFallbackChannel}
                  </span>
                  {alert.verifiedFallbackUrl && (
                    <a
                      href={alert.verifiedFallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-300 hover:underline font-medium"
                    >
                      Official Portal
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PART 2: Statutory & Procedural Waiting-Window Elapsed Tracker */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5" />
              <span>{currentSpec.statutoryOrRuleCitation}</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-100">
              {currentSpec.pathwayTitle}
            </h4>
            <p className="text-xs text-slate-400">{currentSpec.pathwayTitleHi}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className={
                windowMetrics.isWindowElapsed
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 text-xs px-3 py-1'
                  : 'bg-teal-500/15 text-teal-300 border-teal-500/30 text-xs px-3 py-1'
              }
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Day {windowMetrics.elapsedDays} of {currentSpec.standardWindowDays}-Day
              Reference Window
            </Badge>
          </div>
        </div>

        {/* Elapsed Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-2.5 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all ${
                windowMetrics.isWindowElapsed ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
            <span>
              Initial Filing Date: <strong>{contactedAt}</strong> (
              {windowMetrics.elapsedDays} days elapsed)
            </span>
            <span>
              {windowMetrics.isWindowElapsed
                ? `Standard ${currentSpec.standardWindowDays}-day reference window completed — Escalation / First Appeal readiness unlocked.`
                : `${windowMetrics.remainingDays} days remaining in standard ${currentSpec.standardWindowDays}-day procedural reference window.`}
            </span>
          </div>
        </div>

        {/* Escalation Authority & Required Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
              Next Procedural / Appellate Authority
            </div>
            <div className="text-xs font-bold text-slate-100">
              {currentSpec.escalationAuthorityTitle}
            </div>
            <div className="text-[11px] text-slate-400">
              {currentSpec.escalationAuthorityTitleHi}
            </div>
            <p className="text-xs text-slate-300 pt-1">
              {currentSpec.escalationProcedureSummary}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <ClipboardCheck className="h-3.5 w-3.5" />
              <span>Documents to Attach with Follow-Up / Appeal</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              {currentSpec.requiredFollowupDocuments.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mandatory Non-Advisory Statutory Window Disclaimer */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-[11px] text-slate-300">
          <strong className="text-amber-300">Educational Reference Notice:</strong>{' '}
          {currentSpec.educationalSafetyNotice}
        </div>
      </div>

      {/* PART 3: Citizen Follow-Up Docket Logger & Bilingual Addendum Generator */}
      <form onSubmit={handleSaveFollowup} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-200">
              1. Procedural Pathway Reference Window
            </label>
            <select
              value={pathwayKey}
              onChange={(e) => {
                const nextKey = e.target.value as ProceduralPathwayKey;
                setPathwayKey(nextKey);
                setContactChannelUsed(
                  STATUTORY_PROCEDURAL_WINDOWS_CATALOG[nextKey].initialFilingChannel
                );
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
            >
              {PATHWAY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {STATUTORY_PROCEDURAL_WINDOWS_CATALOG[key].pathwayTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-200">
              2. Initial Filing / Docket / Diary Reference No.
            </label>
            <input
              type="text"
              value={docketOrDiaryRef}
              onChange={(e) => setDocketOrDiaryRef(e.target.value)}
              placeholder="e.g., NCRP-ACK-2026-0918442 or RTI Reg No."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-200">
              3. Date Initial Application / Complaint Submitted
            </label>
            <input
              type="date"
              value={contactedAt}
              onChange={(e) => setContactedAt(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-200">
              4. Authority / Office Contacted
            </label>
            <input
              type="text"
              value={authorityContactedName}
              onChange={(e) => setAuthorityContactedName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs font-medium text-slate-200">
              5. Current Follow-Up Stage
            </label>
            <select
              value={followupStatus}
              onChange={(e) =>
                setFollowupStatus(e.target.value as FollowupProgressStatus)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
            >
              {FOLLOWUP_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 md:col-span-3">
            <label className="block text-xs font-medium text-slate-200">
              6. Summary of Acknowledgment / Response Received So Far (Max 400 chars)
            </label>
            <textarea
              rows={2}
              maxLength={400}
              value={summaryOfResponse}
              onChange={(e) => setSummaryOfResponse(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100"
            />
          </div>
        </div>

        {feedbackMsg && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-3.5 py-2 text-xs text-emerald-200">
            {feedbackMsg}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Updating Addendum...
                </>
              ) : (
                <>
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Save Docket Log & Refresh Addendum
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddendumPreview((p) => !p)}
              className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs"
            >
              {showAddendumPreview
                ? 'Hide Bilingual Follow-Up Addendum'
                : 'Preview Bilingual Follow-Up Addendum'}
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyAddendum}
            className="border-teal-500/40 bg-teal-950/30 text-teal-200 hover:bg-teal-900/50 text-xs"
          >
            {copiedAddendum ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                Copied Bilingual Addendum!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy Bilingual Follow-Up Addendum
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Bilingual Follow-Up Addendum Preview */}
      {showAddendumPreview && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold text-indigo-300 flex items-center gap-2">
              <Download className="h-3.5 w-3.5" />
              <span>
                1-Page Bilingual Follow-Up & Escalation Addendum (Pairs with Case Dossier
                v1)
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Reminder Interval: +{reminderIntervalDays} Days
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <pre className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-900/90 p-3 text-[11px] text-slate-200 font-mono leading-relaxed">
              {liveAddendumEn}
            </pre>
            <pre className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-900/90 p-3 text-[11px] text-slate-200 font-mono leading-relaxed">
              {liveAddendumHi}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
