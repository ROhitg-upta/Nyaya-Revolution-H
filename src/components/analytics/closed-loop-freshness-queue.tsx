'use client';

import * as React from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  GitPullRequestArrow,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  fetchAuthorityFreshnessAlertsAction,
  resolveAuthorityFreshnessAlertAction,
} from '@/actions/closed-loop-followup.actions';
import type { AuthorityFreshnessAlertRecord } from '@/types/closed-loop-followup';

const INITIAL_QUEUE: AuthorityFreshnessAlertRecord[] = [
  {
    id: 'alert_labour_mh_01',
    authorityId: 'res_state_labour_desk',
    authorityName: 'Regional Labour Commissioner Helpline Entry (Mumbai / Pune Desk)',
    authorityType: 'Departmental Grievance Desk',
    stateCode: 'MH',
    triggerReason:
      '9 non-contradictory citizen check-ins in the last 30 days reported `could_not_reach` on landline after 17:00 IST (Threshold >= 3).',
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
      'Recent citizen check-ins noted difficulty reaching this landline after 17:00 IST. Moderator verification is in progress. Verified 24x7 online filing channel: samadhan.labour.gov.in or Toll-Free 15100.',
    moderatorResolutionNote: null,
    officialSourceUrl: 'https://samadhan.labour.gov.in',
    createdAt: '2026-09-25T10:15:00.000Z',
    resolvedAt: null,
  },
  {
    id: 'alert_dlsa_up_02',
    authorityId: 'res_dlsa_lucknow_front',
    authorityName: 'District Legal Services Authority (DLSA) Front Office Landline',
    authorityType: 'Statutory Legal Services Authority',
    stateCode: 'UP',
    triggerReason:
      '4 citizen check-ins noted second-Saturday court holiday closure when visiting in person without prior schedule notice (Threshold >= 3).',
    unreachedReportCount: 4,
    totalWindowReports: 16,
    windowDays: 30,
    priorityBadge: 'HIGH_PRIORITY_CITIZEN_SIGNAL',
    status: 'in_review',
    currentVersionNumber: 3,
    resolvedByVersion: null,
    verifiedFallbackChannel:
      'NALSA National Legal Aid Helpline 15100 & UPSLSA Official Portal',
    verifiedFallbackUrl: 'https://nalsa.gov.in',
    citizenNoticeMessage:
      'Note: District Court front offices remain closed on Second Saturdays and gazetted judicial holidays. For immediate phone assistance, dial NALSA Verified Helpline 15100.',
    moderatorResolutionNote:
      'Reviewing updated court calendar hours for v4 snapshot publication.',
    officialSourceUrl: 'https://nalsa.gov.in',
    createdAt: '2026-09-26T14:20:00.000Z',
    resolvedAt: null,
  },
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
];

export function ClosedLoopFreshnessQueue() {
  const [alerts, setAlerts] =
    React.useState<AuthorityFreshnessAlertRecord[]>(INITIAL_QUEUE);
  const [resolvingId, setResolvingId] = React.useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = React.useState<Record<string, string>>({
    alert_labour_mh_01:
      'Verified official desk hours (10:00–17:00 IST Mon–Fri) & added 24x7 SAMADHAN portal direct intake link in immutable snapshot v3.',
    alert_dlsa_up_02:
      'Added Second-Saturday judicial holiday notice and NALSA 15100 toll-free escalation line in immutable snapshot v4.',
  });

  async function handleRefreshQueue() {
    const latest = await fetchAuthorityFreshnessAlertsAction();
    if (latest && latest.length > 0) {
      setAlerts(latest);
    }
  }

  async function handleModeratorResolve(
    alert: AuthorityFreshnessAlertRecord,
    action: 'publish_updated_version' | 'mark_verified_dismiss'
  ) {
    setResolvingId(alert.id);
    try {
      const note =
        resolutionNotes[alert.id] ||
        `Verified against ${alert.officialSourceUrl} and published updated version v${alert.currentVersionNumber + 1}.`;
      const res = await resolveAuthorityFreshnessAlertAction({
        alertId: alert.id,
        resolutionAction: action,
        updatedContactSummary: note,
        officialSourceUrl: alert.officialSourceUrl,
      });
      if (res.success && res.updatedAlert) {
        setAlerts((prev) =>
          prev.map((item) =>
            item.id === res.updatedAlert?.id ? res.updatedAlert : item
          )
        );
      }
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <div className="rounded-xl border border-indigo-500/35 bg-slate-900/80 p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-xs">
              <GitPullRequestArrow className="h-3.5 w-3.5 mr-1.5" />
              SPRINT E17 • Closed-Loop Authority Self-Healing Queue (E16 → E13 → E14)
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-300 text-[11px]"
            >
              Anti-Poisoning Guard: Human Moderator Approval Required
            </Badge>
          </div>
          <h3 className="text-base font-bold text-slate-100">
            Threshold-Triggered Authority Re-Verification Tickets (n &ge; 3 Unreached
            Signals)
          </h3>
          <p className="text-xs text-slate-300">
            When a verified resource accumulates 3 or more non-contradictory{' '}
            <code>could_not_reach</code> citizen check-ins, the platform surfaces a
            verified fallback channel to citizens and queues a priority ticket here so
            moderators can publish an immutable version update (<code>vN → vN+1</code>).
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefreshQueue}
          className="border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
          Sync Freshness Tickets
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const isResolved =
            alert.status === 'resolved_updated' ||
            alert.status === 'dismissed_verified';
          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 space-y-3 ${
                isResolved
                  ? 'border-emerald-500/30 bg-emerald-950/15'
                  : 'border-amber-500/35 bg-slate-950/90'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">
                      {alert.authorityName}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-slate-700 text-slate-300 text-[10px]"
                    >
                      {alert.stateCode} • {alert.authorityType}
                    </Badge>
                    <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px]">
                      <ShieldAlert className="h-3 w-3 mr-1" />
                      {alert.priorityBadge} ({alert.unreachedReportCount}/
                      {alert.totalWindowReports} check-ins)
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{alert.triggerReason}</p>
                </div>

                <div>
                  {isResolved ? (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Published Snapshot v{alert.currentVersionNumber} → v
                      {alert.resolvedByVersion}
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/40 text-xs">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      Awaiting Moderator Verification (Current: v
                      {alert.currentVersionNumber})
                    </Badge>
                  )}
                </div>
              </div>

              {/* Active Citizen Fallback Banner */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 text-xs space-y-1">
                <div className="text-teal-300 font-semibold flex items-center justify-between">
                  <span>Active Citizen Notice & Verified Backup Channel:</span>
                  <a
                    href={alert.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sky-300 hover:underline text-[11px]"
                  >
                    Official Source ({alert.officialSourceUrl})
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-slate-200">{alert.citizenNoticeMessage}</p>
              </div>

              {/* Moderator Action Controls */}
              {!isResolved ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <input
                    type="text"
                    value={resolutionNotes[alert.id] || ''}
                    onChange={(e) =>
                      setResolutionNotes((prev) => ({
                        ...prev,
                        [alert.id]: e.target.value,
                      }))
                    }
                    placeholder="Enter verified update note for v(N+1) snapshot..."
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      disabled={resolvingId === alert.id}
                      onClick={() =>
                        handleModeratorResolve(alert, 'publish_updated_version')
                      }
                      className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Publish Verified Snapshot (v{alert.currentVersionNumber} → v
                      {alert.currentVersionNumber + 1})
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={resolvingId === alert.id}
                      onClick={() =>
                        handleModeratorResolve(alert, 'mark_verified_dismiss')
                      }
                      className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                      Confirm Hours Valid
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>
                    <strong>Moderator Resolution:</strong>{' '}
                    {alert.moderatorResolutionNote}
                  </span>
                  <span>
                    Propagated to linked Citizen Case Prep Workspaces (`v
                    {alert.resolvedByVersion}`)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
