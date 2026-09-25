"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  FileSpreadsheet,
  GitCompare,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  bulkReverifyAuthoritiesAction,
  manualEditAuthorityAction,
  previewAuthorityImportBatchAction,
  publishAuthorityImportBatchAction,
  resolveAuthorityConflictAction,
  rollbackAuthorityImportBatchAction,
  triggerScheduledFreshnessScanAction,
  triggerSourceHealthCheckAction,
} from "@/actions/authority-governance.actions";
import { SAMPLE_AUTHORITY_IMPORT_CSV } from "@/services/governance/authority-governance.service";
import type {
  AuthorityConflictItem,
  AuthorityImportBatch,
  AuthorizedGovernanceRole,
  GovernedAuthorityDetail,
  ModeratorNotificationItem,
  ReviewDecisionType,
  SourceHealthCheckItem,
  VerificationHealthDashboardStats,
} from "@/types/authority-governance";

interface AuthorityGovernanceConsoleProps {
  initialStats: VerificationHealthDashboardStats;
  initialAuthorities: GovernedAuthorityDetail[];
  initialConflicts: AuthorityConflictItem[];
  initialBatches: AuthorityImportBatch[];
  initialHealthChecks: SourceHealthCheckItem[];
  initialNotifications: ModeratorNotificationItem[];
}

export function AuthorityGovernanceConsole({
  initialStats,
  initialAuthorities,
  initialConflicts,
  initialBatches,
  initialHealthChecks,
  initialNotifications,
}: AuthorityGovernanceConsoleProps) {
  const [stats, setStats] = React.useState(initialStats);
  const [authorities, setAuthorities] = React.useState(initialAuthorities);
  const [conflicts, setConflicts] = React.useState(initialConflicts);
  const [batches, setBatches] = React.useState(initialBatches);
  const [healthChecks, setHealthChecks] = React.useState(initialHealthChecks);
  const [notifications] = React.useState(initialNotifications);

  // Active sub-tab in the Authority Governance Console
  const [subTab, setSubTab] = React.useState<
    "queue_and_conflicts" | "import_and_rollback" | "freshness_and_health"
  >("queue_and_conflicts");

  // Active Reviewer Identity & Role (allows testing RBAC & 403 rejection)
  const [reviewerName, setReviewerName] = React.useState("Adv. Meera Krishnan");
  const [reviewerRole, setReviewerRole] = React.useState<
    AuthorizedGovernanceRole | "citizen"
  >("moderator");

  // Feedback banner
  const [bannerMessage, setBannerMessage] = React.useState<{
    tone: "emerald" | "amber" | "rose";
    text: string;
  } | null>(null);
  const [isBusy, setIsBusy] = React.useState(false);

  // Queue Filters
  const [stateFilter, setStateFilter] = React.useState("ALL");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [freshnessFilter, setFreshnessFilter] = React.useState<
    "all" | "conflicted" | "stale" | "review_due" | "fresh"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [bulkNote, setBulkNote] = React.useState(
    "Verified against Q3 2026 official SLSA & eCourts portal directory."
  );

  // Side-by-Side Conflict Resolution State
  const [activeConflictId, setActiveConflictId] = React.useState<string | null>(
    initialConflicts[0]?.id ?? null
  );
  const [conflictDecision, setConflictDecision] =
    React.useState<ReviewDecisionType>("accept_import");
  const [conflictNotes, setConflictNotes] = React.useState(
    "Verified updated phone and ADR Centre gate address against official SLSA Q3 bulletin."
  );
  const [manualPhoneOverride, setManualPhoneOverride] = React.useState("");
  const [manualAddressOverride, setManualAddressOverride] = React.useState("");

  // Authority Detail Inspector Modal State
  const [inspectedAuthorityId, setInspectedAuthorityId] = React.useState<
    string | null
  >(null);
  const [inspectorTab, setInspectorTab] = React.useState<
    "overview_edit" | "versions" | "audit"
  >("overview_edit");

  // Manual Edit Form inside Inspector
  const [editPhone, setEditPhone] = React.useState("");
  const [editHelpline, setEditHelpline] = React.useState("15100");
  const [editAddress, setEditAddress] = React.useState("");
  const [editSourceUrl, setEditSourceUrl] = React.useState("");
  const [editNotes, setEditNotes] = React.useState("");

  // Import Studio State
  const [importFormat, setImportFormat] = React.useState<"csv" | "json">("csv");
  const [importSourceLabel, setImportSourceLabel] = React.useState(
    "SLSA Official District Directory Update (CSV Feed)"
  );
  const [importRawContent, setImportRawContent] = React.useState(
    SAMPLE_AUTHORITY_IMPORT_CSV
  );
  const [selectedBatchId, setSelectedBatchId] = React.useState<string>(
    initialBatches[0]?.id ?? ""
  );
  const [publishBatchNotes, setPublishBatchNotes] = React.useState(
    "Reviewed batch preview rows; approved NEW validated records and routed CONFLICTED rows to side-by-side review."
  );
  const [rollbackReason, setRollbackReason] = React.useState(
    "Reverting batch to re-verify district helpline prefix."
  );

  // Distinct states for filter dropdown
  const distinctStates = React.useMemo(() => {
    const s = new Set<string>();
    authorities.forEach((a) => s.add(a.authority.state));
    return Array.from(s).sort();
  }, [authorities]);

  // Filtered Priority Queue
  const filteredAuthorities = React.useMemo(() => {
    return authorities.filter((item) => {
      const auth = item.authority;
      if (stateFilter !== "ALL" && auth.state !== stateFilter) return false;
      if (typeFilter !== "ALL" && auth.authorityType !== typeFilter)
        return false;
      if (freshnessFilter !== "all") {
        if (freshnessFilter === "conflicted") {
          if (
            item.openConflicts.length === 0 &&
            auth.verificationStatus !== "conflicted"
          ) {
            return false;
          }
        } else if (auth.freshness.status !== freshnessFilter) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const hay = `${auth.officeName} ${auth.state} ${auth.district ?? ""} ${
          auth.contact.phone ?? ""
        } ${auth.address ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [authorities, stateFilter, typeFilter, freshnessFilter, searchQuery]);

  const activeConflict = React.useMemo(
    () => conflicts.find((c) => c.id === activeConflictId) ?? conflicts[0] ?? null,
    [conflicts, activeConflictId]
  );

  const inspectedAuthority = React.useMemo(
    () =>
      authorities.find((a) => a.authority.id === inspectedAuthorityId) ?? null,
    [authorities, inspectedAuthorityId]
  );

  const selectedBatch = React.useMemo(
    () => batches.find((b) => b.id === selectedBatchId) ?? batches[0] ?? null,
    [batches, selectedBatchId]
  );

  const handleOpenAuthorityInspector = (item: GovernedAuthorityDetail) => {
    setInspectedAuthorityId(item.authority.id);
    setInspectorTab("overview_edit");
    setEditPhone(item.authority.contact.phone ?? "");
    setEditHelpline(item.authority.contact.helpline ?? "15100");
    setEditAddress(item.authority.address ?? "");
    setEditSourceUrl(item.authority.sourceUrl);
    setEditNotes(
      "Verified updated district contact details against official SLSA portal."
    );
  };

  const handleSelectConflict = (c: AuthorityConflictItem) => {
    setActiveConflictId(c.id);
    setManualPhoneOverride(c.importedCandidateRecord.contact.phone ?? "");
    setManualAddressOverride(c.importedCandidateRecord.address ?? "");
  };

  const toggleSelectAuthority = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkReverify = async () => {
    if (selectedIds.length === 0) return;
    setIsBusy(true);
    setBannerMessage(null);
    try {
      const res = await bulkReverifyAuthoritiesAction({
        authorityIds: selectedIds,
        reviewerName,
        reviewerRole,
        notes: bulkNote,
      });
      setStats(res.stats);
      setAuthorities(res.authorities);
      setSelectedIds([]);
      setBannerMessage({
        tone: "emerald",
        text: `Re-verified ${res.updatedCount} authority record(s). Version snapshots incremented and freshness windows reset to 90 days.`,
      });
    } catch (err) {
      setBannerMessage({
        tone: "rose",
        text: err instanceof Error ? err.message : "Bulk re-verification failed.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleResolveConflict = async () => {
    if (!activeConflict) return;
    setIsBusy(true);
    setBannerMessage(null);
    try {
      const res = await resolveAuthorityConflictAction({
        conflictId: activeConflict.id,
        decision: conflictDecision,
        reviewerName,
        reviewerRole,
        reviewNotes: conflictNotes,
        manualOverride:
          conflictDecision === "manual_edit"
            ? {
                phone: manualPhoneOverride,
                address: manualAddressOverride,
              }
            : undefined,
      });
      setStats(res.stats);
      setAuthorities(res.authorities);
      setConflicts(res.conflicts);
      setActiveConflictId(res.conflicts[0]?.id ?? null);
      setBannerMessage({
        tone: "emerald",
        text: `Resolved conflict for "${res.updatedAuthority.authority.officeName}" via '${conflictDecision}'. Created immutable version v${res.updatedAuthority.authority.activeVersion} and updated public DLSA locator.`,
      });
    } catch (err) {
      setBannerMessage({
        tone: "rose",
        text: err instanceof Error ? err.message : "Conflict resolution failed.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleManualSave = async () => {
    if (!inspectedAuthority) return;
    setIsBusy(true);
    setBannerMessage(null);
    try {
      const res = await manualEditAuthorityAction({
        authorityId: inspectedAuthority.authority.id,
        officeName: inspectedAuthority.authority.officeName,
        phone: editPhone || null,
        helpline: editHelpline || "15100",
        email: inspectedAuthority.authority.contact.email,
        address: editAddress || null,
        website: inspectedAuthority.authority.website,
        jurisdiction: inspectedAuthority.authority.jurisdiction,
        sourceUrl: editSourceUrl,
        verificationStatus: "verified",
        reviewNotes: editNotes,
        reviewerName,
        reviewerRole,
      });
      setStats(res.stats);
      setAuthorities(res.authorities);
      setBannerMessage({
        tone: "emerald",
        text: `Saved manual edit for "${res.updatedAuthority.authority.officeName}". Created immutable version v${res.updatedAuthority.authority.activeVersion}.`,
      });
    } catch (err) {
      setBannerMessage({
        tone: "rose",
        text: err instanceof Error ? err.message : "Manual edit failed.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handlePreviewImport = async () => {
    setIsBusy(true);
    setBannerMessage(null);
    try {
      const res = await previewAuthorityImportBatchAction({
        rawContent: importRawContent,
        fileFormat: importFormat,
        sourceLabel: importSourceLabel,
        uploadedBy: reviewerName,
        uploadedRole: reviewerRole,
      });
      setStats(res.stats);
      setBatches(res.batches);
      setSelectedBatchId(res.batch.id);
      setBannerMessage({
        tone: "emerald",
        text: `Parsed Batch #${res.batch.id}: ${res.batch.newRecords} NEW, ${res.batch.conflictedRecords} CONFLICTED, ${res.batch.invalidRows} INVALID rows blocked.`,
      });
    } catch (err) {
      setBannerMessage({
        tone: "rose",
        text: err instanceof Error ? err.message : "Import preview failed.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handlePublishBatch = async (batchId: string) => {
    setIsBusy(true);
    setBannerMessage(null);
    try {
      const res = await publishAuthorityImportBatchAction({
        batchId,
        reviewerName,
        reviewerRole,
        reviewNotes: publishBatchNotes,
      });
      setStats(res.stats);
      setAuthorities(res.authorities);
      setConflicts(res.conflicts);
      setBatches(res.batches);
      setBannerMessage({
        tone: "emerald",
        text: `Published Batch #${batchId}: ${res.publishedNewCount} new verified authority record(s) live in Citizen DLSA Geo-Locator; ${res.createdConflictsCount} conflicted record(s) routed to Side-by-Side Conflict Review without overwriting.`,
      });
    } catch (err) {
      setBannerMessage({
        tone: "rose",
        text: err instanceof Error ? err.message : "Batch publication failed.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRollbackBatch = async (batchId: string) => {
    setIsBusy(true);
    setBannerMessage(null);
    try {
      const res = await rollbackAuthorityImportBatchAction({
        batchId,
        reviewerName,
        reviewerRole,
        reason: rollbackReason,
      });
      setStats(res.stats);
      setAuthorities(res.authorities);
      setBatches(res.batches);
      setBannerMessage({
        tone: "amber",
        text: `Rolled back Batch #${res.batch.id}. Restored previous verified snapshots and removed newly created batch records from Citizen DLSA Geo-Locator.`,
      });
    } catch (err) {
      setBannerMessage({
        tone: "rose",
        text: err instanceof Error ? err.message : "Batch rollback failed.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRunFreshnessScan = async () => {
    setIsBusy(true);
    setBannerMessage(null);
    try {
      const res = await triggerScheduledFreshnessScanAction(reviewerRole);
      setStats(res.stats);
      setAuthorities(res.authorities);
      setBannerMessage({
        tone: "emerald",
        text: `Scheduled Freshness Scan complete: scanned ${res.report.scannedCount} records (${res.report.freshCount} Fresh, ${res.report.reviewDueCount} Review Due, ${res.report.staleCount} Stale, ${res.report.conflictedCount} Conflicted).`,
      });
    } catch (err) {
      setBannerMessage({
        tone: "rose",
        text: err instanceof Error ? err.message : "Freshness scan failed.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRunHealthCheck = async () => {
    setIsBusy(true);
    setBannerMessage(null);
    try {
      const res = await triggerSourceHealthCheckAction({
        reviewerRole,
      });
      setHealthChecks(res.healthChecks);
      setStats(res.stats);
      setAuthorities(res.authorities);
      setBannerMessage({
        tone: "emerald",
        text: `Source Health Check verified ${res.healthChecks.length} official endpoints. Fingerprint drift flagged for human review without auto-overwriting verified data.`,
      });
    } catch (err) {
      setBannerMessage({
        tone: "rose",
        text: err instanceof Error ? err.message : "Health check failed.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isJson = file.name.toLowerCase().endsWith(".json");
    setImportFormat(isJson ? "json" : "csv");
    setImportSourceLabel(`Uploaded File: ${file.name}`);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImportRawContent(reader.result);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Governance Header & Role RBAC Bar */}
      <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Database className="h-3.5 w-3.5" />
              SPRINT E13 — TRUST INFRASTRUCTURE & SOURCE FRESHNESS ENGINE
            </div>
            <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              Moderator Authority Ingestion & Conflict Resolution Console
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Every NALSA, SLSA, and DLSA record is traceable to an official HTTPS
              source, versioned (`v1 → v2`), freshness-monitored, and protected
              against silent overwrites.
            </p>
          </div>

          {/* Active Governance Role Selector (with RBAC verification) */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Reviewer Identity
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="mt-1 w-44 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                RBAC Role Check
              </label>
              <select
                value={reviewerRole}
                onChange={(e) =>
                  setReviewerRole(
                    e.target.value as AuthorizedGovernanceRole | "citizen"
                  )
                }
                className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-indigo-300"
              >
                <option value="moderator">moderator (Authorized)</option>
                <option value="admin">admin (Authorized)</option>
                <option value="advocate">advocate (Authorized)</option>
                <option value="legal_educator">legal_educator (Authorized)</option>
                <option value="citizen">citizen (Test 403 Block)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Verification Health KPI Strip (Computed from Real Records) */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
            <div className="text-xs text-slate-400">Total Governed</div>
            <div className="mt-1 text-2xl font-bold text-white">
              {stats.totalGoverned}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              NALSA / SLSA / DLSA
            </div>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5">
            <div className="flex items-center justify-between text-xs text-emerald-300">
              <span>Fresh Verified</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-300">
              {stats.freshCount}
            </div>
            <div className="mt-0.5 text-[11px] text-emerald-400/80">
              Within 90-day window
            </div>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span>Review Due</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-1 text-2xl font-bold text-amber-300">
              {stats.reviewDueCount}
            </div>
            <div className="mt-0.5 text-[11px] text-amber-400/80">
              ≤ 15 days remaining
            </div>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5">
            <div className="flex items-center justify-between text-xs text-rose-300">
              <span>Stale Overdue</span>
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>
            <div className="mt-1 text-2xl font-bold text-rose-300">
              {stats.staleCount}
            </div>
            <div className="mt-0.5 text-[11px] text-rose-400/80">
              Exceeded 90-day cycle
            </div>
          </div>
          <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3.5">
            <div className="flex items-center justify-between text-xs text-purple-300">
              <span>Open Conflicts</span>
              <GitCompare className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-1 text-2xl font-bold text-purple-300">
              {stats.conflictedCount}
            </div>
            <div className="mt-0.5 text-[11px] text-purple-400/80">
              Side-by-side diff queue
            </div>
          </div>
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5">
            <div className="flex items-center justify-between text-xs text-cyan-300">
              <span>Source Endpoints</span>
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-1 text-2xl font-bold text-cyan-300">
              {stats.healthySourcesCount}/{stats.totalGoverned}
            </div>
            <div className="mt-0.5 text-[11px] text-cyan-400/80">
              {stats.sourcesRequiringReviewCount} fingerprint drift
            </div>
          </div>
        </div>

        {/* Status Feedback Banner */}
        {bannerMessage && (
          <div
            className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
              bannerMessage.tone === "emerald"
                ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                : bannerMessage.tone === "amber"
                ? "border-amber-500/40 bg-amber-950/40 text-amber-200"
                : "border-rose-500/40 bg-rose-950/40 text-rose-200"
            }`}
          >
            <span>{bannerMessage.text}</span>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              className="ml-4 text-xs underline opacity-80 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Console Sub-Navigation */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => setSubTab("queue_and_conflicts")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              subTab === "queue_and_conflicts"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <GitCompare className="h-4 w-4" />
            1. Priority Verification Queue & Side-by-Side Conflicts (
            {conflicts.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("import_and_rollback")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              subTab === "import_and_rollback"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            2. Safe CSV/JSON Bulk Import & Reversible Rollback ({batches.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("freshness_and_health")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              subTab === "freshness_and_health"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            3. Automated Freshness Scanner & Source Health Monitor
          </button>
        </div>
      </div>

      {/* =====================================================================
          SUB-TAB 1: SIDE-BY-SIDE CONFLICT RESOLUTION & PRIORITY QUEUE
         ===================================================================== */}
      {subTab === "queue_and_conflicts" && (
        <div className="space-y-6">
          {/* Side-by-Side Conflict Resolution Card (Pillar B) */}
          {conflicts.length > 0 && activeConflict && (
            <div className="rounded-2xl border border-amber-500/40 bg-slate-900/95 p-5 shadow-xl">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    SIDE-BY-SIDE AUTHORITY CONFLICT REVIEW (NO SILENT OVERWRITE)
                  </div>
                  <h3 className="mt-1.5 text-lg font-bold text-white">
                    {activeConflict.authorityName} ({activeConflict.state})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {conflicts.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectConflict(c)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        c.id === activeConflict.id
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {c.district ?? c.state} ({c.fieldDiffs.length} diff)
                    </button>
                  ))}
                </div>
              </div>

              {/* Side-by-Side Comparison Grid */}
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {/* LEFT: CURRENT VERIFIED RECORD (SOURCE A) */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                      CURRENT VERIFIED RECORD (LIVE PUBLIC)
                    </span>
                    <span className="text-xs text-slate-400">
                      Verified: {activeConflict.sourceA.verifiedAt}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-slate-200">
                    <div>
                      <span className="text-slate-400">Office Name: </span>
                      <span className="font-semibold">
                        {activeConflict.currentPublishedRecord.officeName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Phone / Helpline: </span>
                      <span className="font-mono font-semibold text-emerald-300">
                        {activeConflict.currentPublishedRecord.contact.phone ??
                          "null"}{" "}
                        /{" "}
                        {activeConflict.currentPublishedRecord.contact
                          .helpline ?? "15100"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Address: </span>
                      <span>
                        {activeConflict.currentPublishedRecord.address ?? "null"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Source A URL: </span>
                      <a
                        href={activeConflict.sourceA.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-300 underline"
                      >
                        {activeConflict.sourceA.sourceUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* RIGHT: INCOMING CANDIDATE RECORD (SOURCE B) */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                      NEW CANDIDATE SOURCE (HELD FOR REVIEW)
                    </span>
                    <span className="text-xs text-slate-400">
                      Imported: {activeConflict.sourceB.importedAt}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-slate-200">
                    <div>
                      <span className="text-slate-400">Office Name: </span>
                      <span className="font-semibold">
                        {activeConflict.importedCandidateRecord.officeName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Phone / Helpline: </span>
                      <span className="font-mono font-semibold text-amber-300">
                        {activeConflict.importedCandidateRecord.contact.phone ??
                          "null"}{" "}
                        /{" "}
                        {activeConflict.importedCandidateRecord.contact
                          .helpline ?? "15100"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Address: </span>
                      <span>
                        {activeConflict.importedCandidateRecord.address ??
                          "null"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Source B URL: </span>
                      <a
                        href={activeConflict.sourceB.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-amber-300 underline"
                      >
                        {activeConflict.sourceB.sourceUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field-Level Diffs Table */}
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                <div className="text-xs font-semibold text-slate-300">
                  Deterministic Field-Level Discrepancies Detected:
                </div>
                <div className="mt-2 space-y-1.5">
                  {activeConflict.fieldDiffs.map((d) => (
                    <div
                      key={d.field}
                      className="grid grid-cols-1 gap-2 rounded-lg bg-slate-900/90 px-3 py-2 text-xs sm:grid-cols-3"
                    >
                      <span className="font-semibold text-indigo-300">
                        {d.label} ({d.conflictType})
                      </span>
                      <span className="text-emerald-300">
                        Current: {d.currentValue ?? "null"}
                      </span>
                      <span className="text-amber-300">
                        Incoming: {d.importedValue ?? "null"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moderator Decision Controls */}
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Resolution Action
                  </label>
                  <select
                    value={conflictDecision}
                    onChange={(e) =>
                      setConflictDecision(e.target.value as ReviewDecisionType)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="accept_import">
                      accept_import (Publish Incoming as v+1)
                    </option>
                    <option value="keep_existing">
                      keep_existing (Re-confirm Current Record)
                    </option>
                    <option value="manual_edit">
                      manual_edit (Custom Merged Fields)
                    </option>
                    <option value="reject_import">
                      reject_import (Discard Candidate)
                    </option>
                    <option value="request_reverification">
                      request_reverification (Flag Review Due)
                    </option>
                    <option value="archive_record">
                      archive_record (Unpublish from Citizen View)
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Mandatory Reviewer Justification Note (Audit Trail)
                  </label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={conflictNotes}
                      onChange={(e) => setConflictNotes(e.target.value)}
                      placeholder="Explain why this source was accepted or rejected..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={handleResolveConflict}
                      className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
                    >
                      Commit Decision
                    </button>
                  </div>
                </div>
              </div>

              {conflictDecision === "manual_edit" && (
                <div className="mt-3 grid gap-3 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-indigo-200">
                      Merged Official Phone
                    </label>
                    <input
                      type="text"
                      value={manualPhoneOverride}
                      onChange={(e) => setManualPhoneOverride(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-indigo-200">
                      Merged Office Address
                    </label>
                    <input
                      type="text"
                      value={manualAddressOverride}
                      onChange={(e) => setManualAddressOverride(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filter & Bulk Re-verification Toolbar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="relative lg:col-span-2">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search DLSA, district, state, phone..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white"
                />
              </div>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="ALL">All States ({distinctStates.length})</option>
                {distinctStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="ALL">All Tiers (NALSA / SLSA / DLSA)</option>
                <option value="NALSA">NALSA</option>
                <option value="SLSA">SLSA</option>
                <option value="DLSA">DLSA</option>
              </select>
              <select
                value={freshnessFilter}
                onChange={(e) =>
                  setFreshnessFilter(
                    e.target.value as
                      | "all"
                      | "conflicted"
                      | "stale"
                      | "review_due"
                      | "fresh"
                  )
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="all">All Freshness States</option>
                <option value="conflicted">Conflicted Pending Review</option>
                <option value="stale">Stale (&gt; 90 Days)</option>
                <option value="review_due">Review Due (≤ 15 Days)</option>
                <option value="fresh">Fresh Verified</option>
              </select>
            </div>

            {/* Bulk Re-verify Bar */}
            {selectedIds.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-3">
                <div className="text-xs font-semibold text-indigo-200">
                  {selectedIds.length} authority record(s) selected for bulk
                  90-day re-verification
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={bulkNote}
                    onChange={(e) => setBulkNote(e.target.value)}
                    className="w-64 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-white"
                  />
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleBulkReverify}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    Mark Selected Re-Verified
                  </button>
                </div>
              </div>
            )}

            {/* Priority Verification Queue Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-[11px] uppercase text-slate-400">
                  <tr>
                    <th className="py-2.5 pr-2">Select</th>
                    <th className="py-2.5 px-2">Authority & Jurisdiction</th>
                    <th className="py-2.5 px-2">Contact & Helpline</th>
                    <th className="py-2.5 px-2">Version</th>
                    <th className="py-2.5 px-2">Freshness & Cycle</th>
                    <th className="py-2.5 px-2">Official Source</th>
                    <th className="py-2.5 pl-2 text-right">Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredAuthorities.map((item) => {
                    const auth = item.authority;
                    const hasConflict = item.openConflicts.length > 0;
                    return (
                      <tr
                        key={auth.id}
                        className="hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3 pr-2">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(auth.id)}
                            onChange={() => toggleSelectAuthority(auth.id)}
                            className="rounded border-slate-700 bg-slate-900"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-semibold text-white">
                            {auth.officeName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {auth.authorityType} ·{" "}
                            {auth.district
                              ? `${auth.district}, ${auth.state}`
                              : auth.state}
                          </div>
                        </td>
                        <td className="py-3 px-2 font-mono text-[11px]">
                          <div>Phone: {auth.contact.phone ?? "Not Listed"}</div>
                          <div className="text-indigo-300">
                            Helpline: {auth.contact.helpline ?? "15100"}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-300">
                            v{auth.activeVersion}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {hasConflict ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                              <GitCompare className="h-3 w-3" />
                              Conflict Open
                            </span>
                          ) : auth.freshness.status === "stale" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300">
                              <AlertTriangle className="h-3 w-3" />
                              Stale ({auth.freshness.ageInDays}d old)
                            </span>
                          ) : auth.freshness.status === "review_due" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                              <Clock className="h-3 w-3" />
                              Review Due ({auth.freshness.daysUntilReview}d)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" />
                              Fresh ({auth.freshness.daysUntilReview}d left)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <a
                            href={auth.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-indigo-300 underline"
                          >
                            {auth.sourceType}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenAuthorityInspector(item)}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700"
                          >
                            Inspect / History (v{auth.activeVersion})
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Authority Detail, Version History (v1->v2) & Audit Trail Inspector Drawer */}
          {inspectedAuthority && (
            <div className="rounded-2xl border border-indigo-500/40 bg-slate-900 p-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-semibold uppercase text-indigo-400">
                    Versioned Authority Governance Inspector
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {inspectedAuthority.authority.officeName} (Active v
                    {inspectedAuthority.authority.activeVersion})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectorTab("overview_edit")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      inspectorTab === "overview_edit"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    Manual Edit & Source Verification
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectorTab("versions")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      inspectorTab === "versions"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    Immutable Versions ({inspectedAuthority.versions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectorTab("audit")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      inspectorTab === "audit"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    Audit Trail ({inspectedAuthority.auditTimeline.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectedAuthorityId(null)}
                    className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>

              {inspectorTab === "overview_edit" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-slate-400">
                      Official District Phone
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      Statutory Toll-Free Helpline
                    </label>
                    <input
                      type="text"
                      value={editHelpline}
                      onChange={(e) => setEditHelpline(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400">
                      Verified Front-Office Postal Address
                    </label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      Authoritative HTTPS Source URL (Mandatory)
                    </label>
                    <input
                      type="text"
                      value={editSourceUrl}
                      onChange={(e) => setEditSourceUrl(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      Reviewer Note for New Version Snapshot
                    </label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={handleManualSave}
                        className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                      >
                        Save as v{inspectedAuthority.authority.activeVersion + 1}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {inspectorTab === "versions" && (
                <div className="mt-4 space-y-3">
                  {inspectedAuthority.versions.map((ver) => (
                    <div
                      key={ver.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono font-bold text-indigo-300">
                          Version v{ver.versionNumber}{" "}
                          {ver.isActivePublished ? "(ACTIVE PUBLISHED)" : "(HISTORICAL)"}
                        </span>
                        <span className="text-slate-400">
                          Verified by {ver.verifiedBy} ·{" "}
                          {new Date(ver.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1.5 text-slate-300">
                        Reason: <span className="text-white">{ver.changeReason}</span>
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-slate-400">
                        Phone: {ver.snapshot.contact.phone ?? "null"} | Address:{" "}
                        {ver.snapshot.address ?? "null"} | Source: {ver.sourceUrl}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {inspectorTab === "audit" && (
                <div className="mt-4 space-y-2">
                  {inspectedAuthority.auditTimeline.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs"
                    >
                      <div>
                        <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-indigo-300">
                          {log.eventType}
                        </span>{" "}
                        <span className="font-semibold text-white">
                          {log.summary}
                        </span>
                        {log.reviewNotes && (
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Note: {log.reviewNotes}
                          </p>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {log.actorName} ({log.actorRole}) ·{" "}
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 2: SAFE BULK CSV/JSON IMPORT & REVERSIBLE ROLLBACK
         ===================================================================== */}
      {subTab === "import_and_rollback" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: CSV/JSON Payload Studio */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Safe Authority Import Studio (Schema v1.0)
              </h3>
              <span className="rounded-md bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                Header-Mapped Parser
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Upload or paste official SLSA/DLSA CSV or JSON feeds. Rows missing
              an HTTPS <code className="text-indigo-300">sourceUrl</code> are
              quarantined automatically, and existing verified authorities are
              never overwritten without side-by-side approval.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-slate-400">Format</label>
                <select
                  value={importFormat}
                  onChange={(e) =>
                    setImportFormat(e.target.value as "csv" | "json")
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="csv">CSV (Header-Name Mapped)</option>
                  <option value="json">JSON (Array / records[])</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400">
                  Upload Local File (.csv / .json)
                </label>
                <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950 px-3 py-2 text-xs text-indigo-300 hover:border-indigo-500">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400">
                Batch Source Provenance Label
              </label>
              <input
                type="text"
                value={importSourceLabel}
                onChange={(e) => setImportSourceLabel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400">
                  Raw CSV / JSON Feed Payload
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setImportFormat("csv");
                    setImportRawContent(SAMPLE_AUTHORITY_IMPORT_CSV);
                  }}
                  className="text-[11px] text-indigo-400 underline"
                >
                  Reset Sample Feed
                </button>
              </div>
              <textarea
                rows={7}
                value={importRawContent}
                onChange={(e) => setImportRawContent(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-[11px] text-slate-200"
              />
            </div>

            <button
              type="button"
              disabled={isBusy}
              onClick={handlePreviewImport}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              Validate & Generate Import Preview Batch
            </button>
          </div>

          {/* Right Column: Batch Preview, Invalid Row Report, Publish & Rollback */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-white">
                Import Batch Preview & Reversible Rollback Ledger
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {batches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBatchId(b.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                      selectedBatch?.id === b.id
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    #{b.id.slice(-8)} ({b.status})
                  </button>
                ))}
              </div>
            </div>

            {selectedBatch && (
              <div className="space-y-4">
                {/* Summary Classification Pills */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-center">
                    <div className="text-[10px] text-slate-400">TOTAL</div>
                    <div className="text-base font-bold text-white">
                      {selectedBatch.totalRows}
                    </div>
                  </div>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-center">
                    <div className="text-[10px] text-emerald-300">NEW</div>
                    <div className="text-base font-bold text-emerald-300">
                      {selectedBatch.newRecords}
                    </div>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-2.5 text-center">
                    <div className="text-[10px] text-amber-300">CONFLICTED</div>
                    <div className="text-base font-bold text-amber-300">
                      {selectedBatch.conflictedRecords}
                    </div>
                  </div>
                  <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-2.5 text-center">
                    <div className="text-[10px] text-rose-300">INVALID</div>
                    <div className="text-base font-bold text-rose-300">
                      {selectedBatch.invalidRows}
                    </div>
                  </div>
                  <div className="rounded-lg border border-purple-500/30 bg-purple-950/20 p-2.5 text-center">
                    <div className="text-[10px] text-purple-300">DUPLICATE</div>
                    <div className="text-base font-bold text-purple-300">
                      {selectedBatch.duplicateRecords}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-center">
                    <div className="text-[10px] text-slate-400">UNCHANGED</div>
                    <div className="text-base font-bold text-slate-300">
                      {selectedBatch.unchangedRecords}
                    </div>
                  </div>
                </div>

                {/* Row-by-Row Classification Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-slate-800 text-[11px] uppercase text-slate-400">
                      <tr>
                        <th className="p-2.5">Row</th>
                        <th className="p-2.5">Classification</th>
                        <th className="p-2.5">Authority & State</th>
                        <th className="p-2.5">Details / Validation Report</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {selectedBatch.rows.map((r) => (
                        <tr key={r.rowNumber}>
                          <td className="p-2.5 font-mono">#{r.rowNumber}</td>
                          <td className="p-2.5">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                r.classification === "NEW"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : r.classification === "CONFLICTED"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : r.classification === "INVALID"
                                  ? "bg-rose-500/20 text-rose-300"
                                  : "bg-slate-800 text-slate-300"
                              }`}
                            >
                              {r.classification}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <div className="font-semibold text-white">
                              {r.authorityName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {r.authorityType} · {r.district ?? r.state}
                            </div>
                          </td>
                          <td className="p-2.5 text-[11px]">
                            {r.validationErrors.length > 0 ? (
                              <span className="text-rose-300">
                                Blocked: {r.validationErrors.join("; ")}
                              </span>
                            ) : r.fieldDiffs.length > 0 ? (
                              <span className="text-amber-300">
                                {r.fieldDiffs.length} field diff(s) vs live record
                                — routed to Side-by-Side Conflict Queue
                              </span>
                            ) : (
                              <span className="text-emerald-300">
                                Validated HTTPS source ({r.sourceUrl})
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Publish Confirmation OR Reversible Rollback Controls */}
                {selectedBatch.status === "ready_for_review" && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4">
                    <div className="text-xs font-bold text-emerald-300">
                      Human Confirmation Required Before Publishing
                    </div>
                    <p className="mt-1 text-xs text-slate-300">
                      Publish {selectedBatch.newRecords} validated NEW authority
                      record(s) and route {selectedBatch.conflictedRecords}{" "}
                      conflicted record(s) to Side-by-Side Conflict Review? (
                      {selectedBatch.invalidRows} invalid row(s) will remain
                      blocked.)
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={publishBatchNotes}
                        onChange={(e) => setPublishBatchNotes(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handlePublishBatch(selectedBatch.id)}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                      >
                        Publish Verified Authority Changes
                      </button>
                    </div>
                  </div>
                )}

                {selectedBatch.status === "published" && (
                  <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">
                        Batch Published ({selectedBatch.publishedAuthorityIds.length}{" "}
                        live authority record(s) created)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Reversible Snapshot Stored
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={rollbackReason}
                        onChange={(e) => setRollbackReason(e.target.value)}
                        placeholder="Reason for rolling back batch..."
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleRollbackBatch(selectedBatch.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Rollback Batch ({selectedBatch.id})
                      </button>
                    </div>
                  </div>
                )}

                {selectedBatch.status === "rolled_back" && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-200">
                    Batch Rolled Back by {selectedBatch.rolledBackBy} at{" "}
                    {selectedBatch.rolledBackAt
                      ? new Date(selectedBatch.rolledBackAt).toLocaleString()
                      : "N/A"}
                    . Reason: {selectedBatch.rollbackReason}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 3: AUTOMATED FRESHNESS SCANNER & SOURCE HEALTH MONITOR
         ===================================================================== */}
      {subTab === "freshness_and_health" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: Source Health & Fingerprint Drift Table */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Official Source Health & Fingerprint Drift Monitor
                </h3>
                <p className="text-xs text-slate-400">
                  Monitors HTTPS reachability and SHA-256 content fingerprints.
                  Remote portal changes mark a record Review Due without ever
                  auto-overwriting verified citizen data.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={handleRunFreshnessScan}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Run Freshness Scan
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={handleRunHealthCheck}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 text-xs font-bold text-cyan-200 hover:bg-cyan-900/50"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Check Source Endpoints
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-[11px] uppercase text-slate-400">
                  <tr>
                    <th className="p-3">Authority</th>
                    <th className="p-3">HTTP Status</th>
                    <th className="p-3">Fingerprint</th>
                    <th className="p-3">Governance Status Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {healthChecks.slice(0, 10).map((hc) => (
                    <tr key={hc.id}>
                      <td className="p-3">
                        <div className="font-semibold text-white">
                          {hc.authorityName}
                        </div>
                        <a
                          href={hc.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-indigo-300 underline"
                        >
                          {hc.sourceUrl}
                        </a>
                      </td>
                      <td className="p-3 font-mono">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
                          HTTP {hc.httpStatus ?? 200}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <div>{hc.lastObservedFingerprint}</div>
                        {hc.fingerprintChanged && (
                          <span className="text-amber-300">
                            Remote Hash Changed
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[11px] text-slate-300">
                        {hc.statusNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Moderator Notification Center */}
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 lg:col-span-4">
            <h3 className="text-base font-bold text-white">
              Governance Alert Feed ({notifications.length})
            </h3>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl border p-3.5 text-xs ${
                    n.severity === "critical"
                      ? "border-rose-500/30 bg-rose-950/20"
                      : n.severity === "warning"
                      ? "border-amber-500/30 bg-amber-950/20"
                      : "border-indigo-500/30 bg-indigo-950/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{n.title}</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                      {n.eventType}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-300">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
