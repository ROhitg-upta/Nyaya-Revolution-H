"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Copy,
  ExternalLink,
  KeyRound,
  QrCode,
  RefreshCw,
  Smartphone,
  Wifi,
  WifiOff,
  XCircle,
} from "lucide-react";
import {
  createCasePrepHandoffAction,
  revokeCasePrepHandoffAction,
  syncOfflineCasePrepDraftAction,
} from "@/actions/case-prep.actions";
import { DEMO_INITIAL_OPAQUE_TOKEN } from "@/services/action/case-prep-handoff.service";
import type {
  CasePrepHandoffAuditEvent,
  CasePrepHandoffSession,
  CitizenCasePrepWorkspace,
  HandoffExpiryDuration,
  HandoffSectionKey,
  OfflineSyncConnectionStatus,
} from "@/types/case-prep";

interface ClinicHandoffAndPwaPanelProps {
  workspace: CitizenCasePrepWorkspace;
  activeUserId: string;
  initialSessions: CasePrepHandoffSession[];
  initialEvents: CasePrepHandoffAuditEvent[];
  onWorkspaceSynced: (updated: CitizenCasePrepWorkspace) => void;
}

export function ClinicHandoffAndPwaPanel({
  workspace,
  activeUserId,
  initialSessions,
  initialEvents,
  onWorkspaceSynced,
}: ClinicHandoffAndPwaPanelProps) {
  const [sessions, setSessions] =
    React.useState<CasePrepHandoffSession[]>(initialSessions);
  const [events, setEvents] =
    React.useState<CasePrepHandoffAuditEvent[]>(initialEvents);

  // Granular Share Scope State (Default: minimum necessary, 0 attachments)
  const [selectedSections, setSelectedSections] = React.useState<
    HandoffSectionKey[]
  >([
    "situationSummary",
    "timeline",
    "checklist",
    "verifiedResources",
    "lokAdalatPreparation",
    "existingDrafts",
    "questions",
  ]);
  const [includedAttachmentIds, setIncludedAttachmentIds] = React.useState<
    string[]
  >([]);
  const [purpose, setPurpose] = React.useState("DLSA Visit");
  const [shareLabel, setShareLabel] = React.useState("Legal Aid Office");
  const [expiryDuration, setExpiryDuration] =
    React.useState<HandoffExpiryDuration>("1h");
  const [confirmSharePreview, setConfirmSharePreview] = React.useState(true);

  // One-Time Generated Token State
  const [oneTimeSharePath, setOneTimeSharePath] = React.useState<string | null>(
    `/handoff/${DEMO_INITIAL_OPAQUE_TOKEN}`
  );
  const [showQrCard, setShowQrCard] = React.useState(true);
  const [revokeConfirmId, setRevokeConfirmId] = React.useState<string | null>(
    null
  );

  // PWA & Offline IndexedDB/Local Draft State
  const [connectionStatus, setConnectionStatus] =
    React.useState<OfflineSyncConnectionStatus>("online_synced");
  const [swRegistered, setSwRegistered] = React.useState(false);
  const [installPromptEvent, setInstallPromptEvent] =
    React.useState<Event | null>(null);
  const [offlineTitleDraft, setOfflineTitleDraft] = React.useState(
    workspace.title
  );
  const [offlineSummaryDraft, setOfflineSummaryDraft] = React.useState(
    workspace.situationSummaryEn
  );
  const [offlineNotesDraft, setOfflineNotesDraft] = React.useState(
    workspace.userPrivateNotes
  );
  const [conflictServerState, setConflictServerState] = React.useState<{
    serverTitle: string;
    serverSummaryEn: string;
    serverNotes: string;
  } | null>(null);

  const [isBusy, setIsBusy] = React.useState(false);
  const [currentTimeMs, setCurrentTimeMs] = React.useState<number>(() =>
    new Date(workspace.updatedAt).getTime()
  );
  const [feedback, setFeedback] = React.useState<{
    tone: "emerald" | "amber" | "rose";
    text: string;
  } | null>(null);

  // Register Zero-Trust Service Worker (`nyaya-static-v1`) & Online/Offline listeners
  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTimeMs(Date.now());
    }, 30000);

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => setSwRegistered(true))
        .catch(() => setSwRegistered(false));
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    const handleOnline = () => setConnectionStatus("online_synced");
    const handleOffline = () => setConnectionStatus("offline_local_only");

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Persist structured draft to IndexedDB when editing offline
  const saveDraftToIndexedDb = (
    draftTitle: string,
    draftSummary: string,
    draftNotes: string
  ) => {
    setOfflineTitleDraft(draftTitle);
    setOfflineSummaryDraft(draftSummary);
    setOfflineNotesDraft(draftNotes);
    setConnectionStatus("saved_on_device");

    if (typeof window !== "undefined" && "indexedDB" in window) {
      try {
        const openReq = window.indexedDB.open("NyayaCasePrepOfflineDB", 1);
        openReq.onupgradeneeded = () => {
          const db = openReq.result;
          if (!db.objectStoreNames.contains("drafts")) {
            db.createObjectStore("drafts", { keyPath: "localDraftId" });
          }
        };
        openReq.onsuccess = () => {
          const db = openReq.result;
          const tx = db.transaction("drafts", "readwrite");
          tx.objectStore("drafts").put({
            localDraftId: workspace.id,
            title: draftTitle,
            summaryEn: draftSummary,
            notes: draftNotes,
            updatedAt: new Date().toISOString(),
            syncStatus: "pending",
          });
        };
      } catch {
        // Fallback already in memory
      }
    }
  };

  const toggleSection = (key: HandoffSectionKey) => {
    setSelectedSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleAttachment = (attId: string) => {
    setIncludedAttachmentIds((prev) =>
      prev.includes(attId)
        ? prev.filter((id) => id !== attId)
        : [...prev, attId]
    );
  };

  const handleGenerateHandoff = async () => {
    if (!confirmSharePreview) {
      setFeedback({
        tone: "amber",
        text: "Please confirm the 'You're about to share' preview summary before generating a temporary handoff token.",
      });
      return;
    }
    setIsBusy(true);
    setFeedback(null);
    try {
      const res = await createCasePrepHandoffAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        scope: {
          sections: selectedSections,
          includedAttachmentIds,
          purpose,
          shareLabel,
          expiryDuration,
          maxAccesses: 25,
        },
      });
      setSessions(res.allHandoffs.sessions);
      setEvents(res.allHandoffs.events);
      setOneTimeSharePath(res.oneTimeSharePath);
      setShowQrCard(true);
      setFeedback({
        tone: "emerald",
        text: `Generated frozen Snapshot v${res.snapshot.snapshotVersion} and one-time opaque handoff link (expires in ${expiryDuration}). Only SHA-256 hash stored at rest.`,
      });
    } catch (err) {
      setFeedback({
        tone: "rose",
        text:
          err instanceof Error ? err.message : "Failed to create handoff link.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRevokeHandoff = async (sessionId: string) => {
    setIsBusy(true);
    setFeedback(null);
    try {
      const res = await revokeCasePrepHandoffAction({
        sessionId,
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
      });
      setSessions(res.allHandoffs.sessions);
      setEvents(res.allHandoffs.events);
      setRevokeConfirmId(null);
      setFeedback({
        tone: "amber",
        text: `Immediately revoked handoff session (${res.revokedSession.tokenPrefix}). Further access via that link or QR is now blocked.`,
      });
    } catch (err) {
      setFeedback({
        tone: "rose",
        text: err instanceof Error ? err.message : "Revocation failed.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleReconnectSync = async (options?: {
    forceConflict?: boolean;
    resolutionStrategy?: "keep_local" | "keep_server";
  }) => {
    setIsBusy(true);
    setConnectionStatus("syncing");
    setFeedback(null);
    try {
      const res = await syncOfflineCasePrepDraftAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        localDraftTitle: offlineTitleDraft,
        localDraftSummaryEn: offlineSummaryDraft,
        localDraftNotes: offlineNotesDraft,
        clientBaseUpdatedAt: workspace.updatedAt,
        forceConflictSimulation: options?.forceConflict,
        resolutionStrategy: options?.resolutionStrategy,
      });
      setSessions(res.allHandoffs.sessions);
      setEvents(res.allHandoffs.events);

      if (res.status === "conflict") {
        setConnectionStatus("conflict_detected");
        setConflictServerState({
          serverTitle: res.serverTitle,
          serverSummaryEn: res.serverSummaryEn,
          serverNotes: res.serverNotes,
        });
        setFeedback({
          tone: "amber",
          text: "Your workspace changed on another device while you were editing offline. Choose Keep Server or Keep Local below.",
        });
      } else {
        setConnectionStatus("online_synced");
        setConflictServerState(null);
        onWorkspaceSynced(res.workspace);
        setOfflineTitleDraft(res.workspace.title);
        setOfflineSummaryDraft(res.workspace.situationSummaryEn);
        setOfflineNotesDraft(res.workspace.userPrivateNotes);
        setFeedback({
          tone: "emerald",
          text: "Successfully synchronized offline draft with verified server workspace.",
        });
      }
    } catch (err) {
      setConnectionStatus("saved_on_device");
      setFeedback({
        tone: "rose",
        text:
          err instanceof Error
            ? err.message
            : "Sync failed — changes remain safely saved on this device.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const copyShareLink = () => {
    if (!oneTimeSharePath) return;
    const fullUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${oneTimeSharePath}`
        : oneTimeSharePath;
    navigator.clipboard.writeText(fullUrl);
    setFeedback({
      tone: "emerald",
      text: "Copied temporary read-only handoff link to clipboard.",
    });
  };

  return (
    <div className="space-y-6 rounded-3xl border border-indigo-500/30 bg-slate-900/95 p-6 text-white shadow-2xl print:hidden">
      {/* =====================================================================
          1. PWA INSTALL & OFFLINE RESILIENCE BAR (Phases 27–41)
         ===================================================================== */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-3">
          {connectionStatus === "online_synced" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
              <Wifi className="h-3.5 w-3.5" />
              Online • Synced with Server
            </span>
          )}
          {connectionStatus === "offline_local_only" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
              <WifiOff className="h-3.5 w-3.5" />
              Offline Mode • Drafting in IndexedDB
            </span>
          )}
          {connectionStatus === "saved_on_device" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
              <Clock className="h-3.5 w-3.5" />
              Saved on this device (Pending Server Sync)
            </span>
          )}
          {connectionStatus === "syncing" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Syncing with Server...
            </span>
          )}
          {connectionStatus === "conflict_detected" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              Sync Conflict Detected
            </span>
          )}

          <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300">
            PWA Shell:{" "}
            <strong className="text-indigo-300">
              {swRegistered
                ? "nyaya-static-v1 Active"
                : "Manifest Ready (/manifest.webmanifest)"}
            </strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {installPromptEvent && (
            <button
              type="button"
              onClick={() => {
                const evt = installPromptEvent as unknown as {
                  prompt?: () => void;
                };
                evt.prompt?.();
                setInstallPromptEvent(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
            >
              <Smartphone className="h-3.5 w-3.5" />
              Install Nyaya Revolution App
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              saveDraftToIndexedDb(
                `${offlineTitleDraft} [Offline Note Added]`,
                offlineSummaryDraft,
                offlineNotesDraft
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Save Local Draft (IndexedDB)
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handleReconnectSync({ forceConflict: false })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Sync Now
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handleReconnectSync({ forceConflict: true })}
            className="rounded-xl border border-amber-500/40 bg-amber-950/30 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-900/50"
          >
            Test Sync Conflict
          </button>
        </div>
      </div>

      {/* Multi-Device Conflict Resolution Modal / Banner (Phase 36) */}
      {connectionStatus === "conflict_detected" && conflictServerState && (
        <div className="rounded-2xl border border-amber-500/50 bg-amber-950/25 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            Your workspace changed on another device — Resolve Sync Conflict
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="font-bold text-emerald-300">
                Server Version (Another Device):
              </div>
              <div className="mt-1 text-slate-200">
                Title: {conflictServerState.serverTitle}
              </div>
              <div className="mt-1 text-slate-400">
                Summary: {conflictServerState.serverSummaryEn}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="font-bold text-indigo-300">
                Local Device Draft (IndexedDB):
              </div>
              <div className="mt-1 text-slate-200">
                Title: {offlineTitleDraft}
              </div>
              <div className="mt-1 text-slate-400">
                Summary: {offlineSummaryDraft}
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handleReconnectSync({ resolutionStrategy: "keep_local" })
              }
              className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
            >
              Keep Local Draft
            </button>
            <button
              type="button"
              onClick={() =>
                handleReconnectSync({ resolutionStrategy: "keep_server" })
              }
              className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
            >
              Keep Server Version
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs ${
            feedback.tone === "emerald"
              ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
              : feedback.tone === "amber"
              ? "border-amber-500/40 bg-amber-950/40 text-amber-200"
              : "border-rose-500/40 bg-rose-950/40 text-rose-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* =====================================================================
          2. ASSISTED PARA-LEGAL CLINIC HANDOFF STUDIO (Phases 1–26)
         ===================================================================== */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 7 Cols: Granular Share Scope, Opt-In Attachments & Preview Confirmation */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300">
                <KeyRound className="h-3 w-3" />
                SPRINT E15 • ZERO-TRUST ASSISTED PARA-LEGAL CLINIC MODE
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">
                Create Temporary Read-Only Handoff Session
              </h3>
            </div>
            <span className="rounded bg-emerald-500/15 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-300">
              SHA-256 Hashed at Rest
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Share a frozen, time-limited snapshot of selected sections with a
            DLSA front-office volunteer, legal-aid clinic, or advocate without
            sharing your account or live workspace.
          </p>

          {/* Purpose, Viewer Label & Expiry Selection */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] text-slate-400">
                Purpose Metadata
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400">
                Helper / Clinic Label
              </label>
              <input
                type="text"
                value={shareLabel}
                onChange={(e) => setShareLabel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400">
                Server-Enforced Expiry
              </label>
              <select
                value={expiryDuration}
                onChange={(e) =>
                  setExpiryDuration(e.target.value as HandoffExpiryDuration)
                }
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-amber-300"
              >
                <option value="30m">30 minutes (Recommended)</option>
                <option value="1h">1 hour</option>
                <option value="4h">4 hours</option>
                <option value="24h">24 hours (Max Policy Cap)</option>
              </select>
            </div>
          </div>

          {/* Granular Section Selection */}
          <div>
            <div className="text-xs font-semibold text-slate-300">
              1. Select Exact Sections to Freeze into Snapshot:
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(
                [
                  ["situationSummary", "Situation Summary"],
                  ["timeline", `Timeline (${workspace.timeline.length})`],
                  ["checklist", `Checklist (${workspace.checklist.length})`],
                  [
                    "participants",
                    `Parties (${workspace.participants.length})`,
                  ],
                  ["verifiedResources", "Verified DLSA Snapshot"],
                  ["lokAdalatPreparation", "Lok Adalat Prep"],
                  [
                    "existingDrafts",
                    `Action Drafts (${workspace.linkedDrafts.length})`,
                  ],
                  ["questions", "Questions to Discuss"],
                  ["notes", "Personal Notes"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(key)}
                    onChange={() => toggleSection(key)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Opt-In Attachment Selection (Default Excluded) */}
          <div>
            <div className="text-xs font-semibold text-slate-300">
              2. Private Attachments (Strictly Opt-In — Excluded by Default):
            </div>
            <div className="mt-2 space-y-1.5">
              {workspace.attachments.map((att) => {
                const included = includedAttachmentIds.includes(att.id);
                return (
                  <div
                    key={att.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs"
                  >
                    <span>
                      {att.filename} ({Math.round(att.fileSizeBytes / 1024)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleAttachment(att.id)}
                      className={`rounded px-2.5 py-0.5 text-[11px] font-bold ${
                        included
                          ? "bg-amber-500 text-slate-950"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {included ? "Included (Opt-In)" : "Excluded (Private)"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase 5: "You're about to share" Explicit Preview & Confirmation */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/25 p-3.5 text-xs">
            <div className="font-bold text-indigo-300">
              You&apos;re about to share (Frozen Read-Only Snapshot):
            </div>
            <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-slate-200">
              <span className="rounded bg-slate-900 px-2 py-0.5">
                {selectedSections.includes("situationSummary") ? 1 : 0} Situation
                Summary
              </span>
              <span className="rounded bg-slate-900 px-2 py-0.5">
                {selectedSections.includes("timeline")
                  ? workspace.timeline.length
                  : 0}{" "}
                Timeline Events
              </span>
              <span className="rounded bg-slate-900 px-2 py-0.5">
                {selectedSections.includes("checklist")
                  ? workspace.checklist.length
                  : 0}{" "}
                Checklist Items
              </span>
              <span className="rounded bg-slate-900 px-2 py-0.5">
                {selectedSections.includes("verifiedResources") &&
                workspace.linkedAuthoritySnapshot
                  ? 1
                  : 0}{" "}
                Verified DLSA Resource
              </span>
              <span className="rounded bg-slate-900 px-2 py-0.5">
                {includedAttachmentIds.length} Attachments
              </span>
              <span className="rounded bg-slate-900 px-2 py-0.5">
                {selectedSections.includes("existingDrafts")
                  ? workspace.linkedDrafts.length
                  : 0}{" "}
                Drafts
              </span>
            </div>
            <label className="mt-2.5 flex cursor-pointer items-center gap-2 text-xs text-white">
              <input
                type="checkbox"
                checked={confirmSharePreview}
                onChange={(e) => setConfirmSharePreview(e.target.checked)}
              />
              <span>
                I confirm sharing only the selected snapshot items above for{" "}
                {expiryDuration}.
              </span>
            </label>
          </div>

          <button
            type="button"
            disabled={isBusy}
            onClick={handleGenerateHandoff}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-extrabold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50"
          >
            Generate Temporary Read-Only Handoff Link & QR
          </button>
        </div>

        {/* Right 5 Cols: One-Time QR Card, Active Handoffs & Immediate Revocation */}
        <div className="space-y-4 lg:col-span-5">
          {/* One-Time Share Link & Compact QR Card */}
          {oneTimeSharePath && showQrCard && (
            <div className="rounded-2xl border border-emerald-500/40 bg-slate-950 p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300">
                  Temporary Handoff Ready (Opaque Token)
                </span>
                <button
                  type="button"
                  onClick={() => setShowQrCard(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Hide
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-white p-1.5 text-slate-950">
                  <QrCode className="h-11 w-11" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="truncate font-mono text-[11px] text-indigo-300">
                    {oneTimeSharePath}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Contains zero PII. Helper sees frozen read-only snapshot.
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={copyShareLink}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-500"
                    >
                      <Copy className="h-3 w-3" />
                      Copy Temporary Handoff Link
                    </button>
                    <Link
                      href={oneTimeSharePath}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-1 text-[11px] font-bold text-emerald-200 hover:bg-emerald-900/60"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open Helper View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Handoffs Dashboard & Immediate Revocation */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h4 className="text-sm font-bold text-white">
              Active & Recent Handoffs ({sessions.length})
            </h4>
            <div className="mt-3 space-y-2.5">
              {sessions.map((sess) => {
                const isRevoked = sess.revokedAt !== null;
                const minsLeft = Math.max(
                  0,
                  Math.ceil(
                    (new Date(sess.expiresAt).getTime() - currentTimeMs) / 60000
                  )
                );
                const isExpired = !isRevoked && minsLeft === 0;

                return (
                  <div
                    key={sess.id}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        {sess.purpose} —{" "}
                        {isRevoked ? (
                          <span className="text-rose-400">Revoked</span>
                        ) : isExpired ? (
                          <span className="text-amber-400">Expired</span>
                        ) : (
                          <span className="text-emerald-300">
                            expires in {minsLeft} min
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {sess.tokenPrefix}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      Opened {sess.accessCount} times
                      {sess.lastAccessedAt
                        ? ` • Last opened ${new Date(
                            sess.lastAccessedAt
                          ).toLocaleTimeString()}`
                        : ""}{" "}
                      • {sess.selectedCountsSummary.attachmentsCount} attachments
                    </div>

                    {!isRevoked && !isExpired && (
                      <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-2">
                        {revokeConfirmId === sess.id ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] text-rose-300">
                              Revoking this link will immediately prevent further
                              access.
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRevokeHandoff(sess.id)}
                              className="rounded bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white"
                            >
                              Confirm Revoke
                            </button>
                            <button
                              type="button"
                              onClick={() => setRevokeConfirmId(null)}
                              className="text-[11px] text-slate-400 underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-[11px] text-emerald-400">
                              Read-only snapshot active
                            </span>
                            <button
                              type="button"
                              onClick={() => setRevokeConfirmId(sess.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/40 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-900/60"
                            >
                              <XCircle className="h-3 w-3" />
                              Revoke
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe Handoff Security Audit Trail */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Zero-Trust Handoff & Sync Audit Log
            </h4>
            <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
              {events.slice(0, 6).map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-300"
                >
                  <span className="font-mono font-bold text-indigo-300">
                    [{ev.eventType}]
                  </span>{" "}
                  {ev.safeSummary}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
