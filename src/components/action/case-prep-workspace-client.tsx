"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  Calendar,
  Download,
  ExternalLink,
  FileCheck,
  FolderKanban,
  Languages,
  Lock,
  PlusCircle,
  Printer,
  QrCode,
  ShieldAlert,
  Trash2,
  Upload,
} from "lucide-react";
import {
  addCasePrepParticipantAction,
  addCasePrepTimelineEventAction,
  applyCasePrepPiiDecisionAction,
  deleteCasePrepAttachmentAction,
  deleteCasePrepTimelineEventAction,
  exportVerifiedCasePrepDossierAction,
  linkCasePrepAuthorityAction,
  saveCasePrepSummaryAction,
  toggleCasePrepChecklistAction,
  uploadCasePrepAttachmentMetadataAction,
} from "@/actions/case-prep.actions";
import { DEFAULT_AUTHORIZED_CITIZEN_ID } from "@/services/action/case-prep-workspace.service";
import { ClinicHandoffAndPwaPanel } from "@/components/action/clinic-handoff-and-pwa-panel";
import { CitizenOutcomeCheckinCard } from "@/components/action/citizen-outcome-checkin-card";
import { ProceduralFollowupTrackerCard } from "@/components/action/procedural-followup-tracker-card";
import type { LegalServiceAuthorityRecord } from "@/types/action-engine";
import type {
  CasePrepHandoffAuditEvent,
  CasePrepHandoffSession,
  CasePrepPiiDetectionItem,
  CasePrepReviewGateState,
  CitizenCasePrepWorkspace,
  DossierLanguage,
  WorkspaceCompletionReport,
} from "@/types/case-prep";

interface CasePrepWorkspaceClientProps {
  initialWorkspace: CitizenCasePrepWorkspace;
  initialCompletion: WorkspaceCompletionReport;
  initialPiiDetections: CasePrepPiiDetectionItem[];
  availableAuthorities: LegalServiceAuthorityRecord[];
  initialHandoffSessions: CasePrepHandoffSession[];
  initialHandoffEvents: CasePrepHandoffAuditEvent[];
}

export function CasePrepWorkspaceClient({
  initialWorkspace,
  initialCompletion,
  initialPiiDetections,
  availableAuthorities,
  initialHandoffSessions,
  initialHandoffEvents,
}: CasePrepWorkspaceClientProps) {
  const [workspace, setWorkspace] =
    React.useState<CitizenCasePrepWorkspace>(initialWorkspace);
  const [completion, setCompletion] =
    React.useState<WorkspaceCompletionReport>(initialCompletion);
  const [piiDetections, setPiiDetections] =
    React.useState<CasePrepPiiDetectionItem[]>(initialPiiDetections);

  // Active section tab
  const [activeTab, setActiveTab] = React.useState<
    | "facts_and_timeline"
    | "checklist_and_attachments"
    | "sources_dlsa_and_drafts"
    | "review_and_a4_dossier"
  >("facts_and_timeline");

  // Security / Owner IDOR Test Switcher
  const [activeUserId, setActiveUserId] = React.useState<string>(
    DEFAULT_AUTHORIZED_CITIZEN_ID
  );

  // Form States for Section 1 (Situation & Languages)
  const [title, setTitle] = React.useState(initialWorkspace.title);
  const [category, setCategory] = React.useState(
    initialWorkspace.situationCategory
  );
  const [summaryEn, setSummaryEn] = React.useState(
    initialWorkspace.situationSummaryEn
  );
  const [summaryHi, setSummaryHi] = React.useState(
    initialWorkspace.situationSummaryHi
  );
  const [descriptionEn, setDescriptionEn] = React.useState(
    initialWorkspace.userDescriptionEn
  );
  const [primaryLang, setPrimaryLang] = React.useState<DossierLanguage>(
    initialWorkspace.primaryLanguage
  );
  const [secondaryLang, setSecondaryLang] = React.useState<
    DossierLanguage | "none"
  >(initialWorkspace.secondaryLanguage);
  const [privateNotes, setPrivateNotes] = React.useState(
    initialWorkspace.userPrivateNotes
  );

  // Timeline Add Form
  const [newEventDate, setNewEventDate] = React.useState("2026-09-20");
  const [newEventApprox, setNewEventApprox] = React.useState(false);
  const [newEventTitle, setNewEventTitle] = React.useState("");
  const [newActionTaken, setNewActionTaken] = React.useState("");
  const [newResponseReceived, setNewResponseReceived] = React.useState("");
  const [newSourceNote, setNewSourceNote] = React.useState("");

  // Participant Add Form
  const [newPartRole, setNewPartRole] = React.useState("Witness / Other Party");
  const [newPartName, setNewPartName] = React.useState("");
  const [newPartOrg, setNewPartOrg] = React.useState("");
  const [newPartContact, setNewPartContact] = React.useState("");

  // Attachment Upload Form
  const [attDesc, setAttDesc] = React.useState(
    "Supporting receipt or notice for discussion"
  );

  // Review Gate Checkboxes
  const [reviewGate, setReviewGate] = React.useState<CasePrepReviewGateState>(
    initialWorkspace.reviewGate
  );

  // Feedback Banner & Autosave Status
  const [statusBanner, setStatusBanner] = React.useState<{
    tone: "emerald" | "amber" | "rose";
    message: string;
  } | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastLocalBackupAt, setLastLocalBackupAt] =
    React.useState<string>("Just now");

  // Safe Local Browser Draft Backup (Metadata only, never stores raw sensitive files)
  const handleBackupToLocalDraft = React.useCallback(
    (nextTitle: string, nextSummary: string) => {
      try {
        window.localStorage.setItem(
          `nyaya_e14_draft_${workspace.id}`,
          JSON.stringify({
            title: nextTitle,
            summaryEn: nextSummary,
            savedAt: new Date().toISOString(),
          })
        );
        setLastLocalBackupAt(new Date().toLocaleTimeString());
      } catch {
        // Ignore storage quota errors in restricted browsers
      }
    },
    [workspace.id]
  );

  const handleSaveSummary = async () => {
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await saveCasePrepSummaryAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        title,
        situationCategory: category,
        situationSummaryEn: summaryEn,
        situationSummaryHi: summaryHi,
        userDescriptionEn: descriptionEn,
        primaryLanguage: primaryLang,
        secondaryLanguage: secondaryLang,
        userPrivateNotes: privateNotes,
      });
      setWorkspace(res.workspace);
      setCompletion(res.completion);
      setPiiDetections(res.piiDetections);
      setSummaryHi(res.workspace.situationSummaryHi);
      handleBackupToLocalDraft(title, summaryEn);
      setStatusBanner({
        tone: "emerald",
        message:
          "Saved workspace summary, bilingual presentation, and private notes.",
      });
    } catch (err) {
      setStatusBanner({
        tone: "rose",
        message:
          err instanceof Error ? err.message : "Failed to save workspace.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await addCasePrepTimelineEventAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        eventDate: newEventDate,
        isApproximateDate: newEventApprox,
        eventTitle: newEventTitle,
        actionTaken: newActionTaken,
        responseReceived: newResponseReceived,
        sourceOrNote: newSourceNote,
      });
      setWorkspace(res.workspace);
      setCompletion(res.completion);
      setPiiDetections(res.piiDetections);
      setNewEventTitle("");
      setNewActionTaken("");
      setNewResponseReceived("");
      setNewSourceNote("");
      setStatusBanner({
        tone: "emerald",
        message: "Added chronological timeline event and sorted timeline.",
      });
    } catch (err) {
      setStatusBanner({
        tone: "rose",
        message:
          err instanceof Error ? err.message : "Could not add timeline event.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTimeline = async (eventId: string) => {
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await deleteCasePrepTimelineEventAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        eventId,
      });
      setWorkspace(res.workspace);
      setCompletion(res.completion);
    } catch (err) {
      setStatusBanner({
        tone: "rose",
        message:
          err instanceof Error ? err.message : "Could not delete timeline event.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleChecklist = async (itemId: string) => {
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await toggleCasePrepChecklistAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        itemId,
      });
      setWorkspace(res.workspace);
      setCompletion(res.completion);
    } catch (err) {
      setStatusBanner({
        tone: "rose",
        message:
          err instanceof Error ? err.message : "Checklist update blocked.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await addCasePrepParticipantAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        roleLabel: newPartRole,
        nameOrLabel: newPartName,
        organization: newPartOrg,
        contactReference: newPartContact,
      });
      setWorkspace(res.workspace);
      setCompletion(res.completion);
      setPiiDetections(res.piiDetections);
      setNewPartName("");
      setNewPartOrg("");
      setNewPartContact("");
      setStatusBanner({
        tone: "emerald",
        message: "Added party/organization to preparation workspace.",
      });
    } catch (err) {
      setStatusBanner({
        tone: "rose",
        message: err instanceof Error ? err.message : "Could not add party.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAttachmentFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await uploadCasePrepAttachmentMetadataAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        filename: file.name,
        mimeType: file.type || "application/pdf",
        fileSizeBytes: file.size,
        description: attDesc,
      });
      setWorkspace(res.workspace);
      setCompletion(res.completion);
      setStatusBanner({
        tone: "emerald",
        message: `Added private attachment "${file.name}" to encrypted owner vault.`,
      });
    } catch (err) {
      setStatusBanner({
        tone: "rose",
        message:
          err instanceof Error ? err.message : "Attachment validation failed.",
      });
    } finally {
      setIsSaving(false);
      e.target.value = "";
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await deleteCasePrepAttachmentAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        attachmentId,
      });
      setWorkspace(res.workspace);
      setCompletion(res.completion);
      setStatusBanner({
        tone: "amber",
        message:
          "Removed attachment metadata and cleaned private storage object reference.",
      });
    } catch (err) {
      setStatusBanner({
        tone: "rose",
        message:
          err instanceof Error ? err.message : "Could not delete attachment.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAuthority = async (authorityId: string) => {
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await linkCasePrepAuthorityAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        authorityId,
      });
      setWorkspace(res.workspace);
      setCompletion(res.completion);
      setStatusBanner({
        tone: "emerald",
        message: `Captured live verified authority snapshot (Version v${
          res.workspace.linkedAuthoritySnapshot?.publishedVersionNumber ?? 1
        }) for dossier traceability.`,
      });
    } catch (err) {
      setStatusBanner({
        tone: "rose",
        message:
          err instanceof Error ? err.message : "Could not link authority.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePiiAction = async (
    item: CasePrepPiiDetectionItem,
    decision: "keep" | "redact"
  ) => {
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await applyCasePrepPiiDecisionAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        matchedValue: item.matchedValue,
        redactedReplacement: item.redactedReplacement,
        decision,
      });
      setWorkspace(res.workspace);
      setDescriptionEn(res.workspace.userDescriptionEn);
      setSummaryEn(res.workspace.situationSummaryEn);
      setPrivateNotes(res.workspace.userPrivateNotes);
      setPiiDetections(
        res.piiDetections.filter((d) => d.matchedValue !== item.matchedValue)
      );
      setStatusBanner({
        tone: "emerald",
        message:
          decision === "redact"
            ? `Redacted sensitive ${item.label} (${item.redactedReplacement}).`
            : `Kept ${item.label} per your explicit preference.`,
      });
    } catch (err) {
      setStatusBanner({
        tone: "rose",
        message: err instanceof Error ? err.message : "PII update failed.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportDossier = async (
    format: "pdf_print" | "bilingual_dossier" | "offline_text"
  ) => {
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await exportVerifiedCasePrepDossierAction({
        workspaceId: workspace.id,
        requestingUserId: activeUserId,
        reviewGate,
        exportFormat: format,
      });
      setWorkspace(res.workspace);
      setCompletion(res.completion);

      if (format === "offline_text") {
        // Trigger offline self-contained .txt download
        const textContent = [
          "======================================================================",
          "NYAYA REVOLUTION — CITIZEN CASE PREPARATION DOSSIER (OFFLINE PACK)",
          `Dossier Version: v${res.newExportVersion.versionNumber} | Prepared: ${new Date(
            res.newExportVersion.exportedAt
          ).toLocaleString()}`,
          `Languages: ${res.workspace.primaryLanguage.toUpperCase()} + ${res.workspace.secondaryLanguage.toUpperCase()}`,
          "======================================================================",
          "",
          "1. SITUATION SUMMARY (USER-AUTHORED FACTS)",
          `Title: ${res.workspace.title}`,
          `English: ${res.workspace.situationSummaryEn || "[Complete before use]"}`,
          `Hindi: ${res.workspace.situationSummaryHi || "[Complete before use]"}`,
          "",
          "2. CHRONOLOGICAL TIMELINE",
          ...res.workspace.timeline.map(
            (t, idx) =>
              `${idx + 1}. [${t.eventDate}] ${t.eventTitle} | Action: ${
                t.actionTaken
              } | Response: ${t.responseReceived}`
          ),
          "",
          "3. DOCUMENTS & INFORMATION CHECKLIST FOR DISCUSSION",
          ...res.workspace.checklist.map(
            (c) => `[${c.isChecked ? "X" : " "}] ${c.itemLabel} (${c.userNote})`
          ),
          "",
          "4. VERIFIED ASSISTANCE AUTHORITY SNAPSHOT AT EXPORT",
          `Authority: ${
            res.workspace.linkedAuthoritySnapshot?.authorityName ??
            "[Complete before use]"
          }`,
          `Published Authority Version: v${
            res.workspace.linkedAuthoritySnapshot?.publishedVersionNumber ?? 1
          }`,
          `Phone / Helpline: ${
            res.workspace.linkedAuthoritySnapshot?.phone ?? "Not listed"
          } / ${res.workspace.linkedAuthoritySnapshot?.helpline ?? "15100"}`,
          `Address: ${
            res.workspace.linkedAuthoritySnapshot?.address ?? "Not listed"
          }`,
          `Official Source URL: ${
            res.workspace.linkedAuthoritySnapshot?.sourceUrl ?? ""
          }`,
          `Verified Date at Snapshot: ${
            res.workspace.linkedAuthoritySnapshot?.verifiedAtSnapshot ?? ""
          }`,
          "",
          "5. QUESTIONS TO DISCUSS WITH A PROFESSIONAL / AUTHORITY",
          ...res.workspace.questionsToDiscuss
            .filter((q) => q.isIncluded)
            .map((q) => `- ${q.questionEn}\n  ${q.questionHi}`),
          "",
          "======================================================================",
          "SAFETY & ORGANIZATIONAL NOTICE:",
          "This pack is a user-prepared organizational document. It is not legal advice, legal representation, or a guarantee of outcome. Verify current official information before acting.",
          "======================================================================",
        ].join("\n");

        const blob = new Blob([textContent], {
          type: "text/plain;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nyaya-case-prep-dossier-v${res.newExportVersion.versionNumber}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Switch to review & dossier view and invoke browser A4 print/PDF
        setActiveTab("review_and_a4_dossier");
        setTimeout(() => {
          window.print();
        }, 250);
      }

      setStatusBanner({
        tone: "emerald",
        message: `Generated immutable Dossier Version v${res.newExportVersion.versionNumber} (captured Authority Snapshot v${res.newExportVersion.authoritySnapshotVersion}).`,
      });
    } catch (err) {
      setStatusBanner({
        tone: "rose",
        message:
          err instanceof Error ? err.message : "Export blocked by Review Gate.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const allReviewChecked =
    reviewGate.factsCorrect &&
    reviewGate.datesCorrect &&
    reviewGate.removedUnnecessaryPrivateInfo &&
    reviewGate.reviewedAttachedDocuments &&
    reviewGate.checkedSelectedAuthority &&
    reviewGate.reviewedGeneratedDrafts;

  return (
    <div className="space-y-8">
      {/* =====================================================================
          WEB WORKSPACE HEADER & PROGRESS BAR (Hidden during A4 Print)
         ===================================================================== */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-xl print:hidden">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <Lock className="h-3.5 w-3.5" />
                Private Citizen Case Preparation Workspace (RLS Protected)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <Languages className="h-3.5 w-3.5" />
                Bilingual Dossier Engine ({primaryLang.toUpperCase()} +{" "}
                {secondaryLang.toUpperCase()})
              </span>
            </div>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {workspace.title}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              This workspace helps organize information, timelines, checklists,
              and verified assistance resources for discussion with a legal
              professional or authority. It does not decide your legal case.
            </p>
          </div>

          {/* Owner / IDOR Security Simulator & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/90 p-3.5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Workspace RLS / IDOR Guard
              </label>
              <select
                value={activeUserId}
                onChange={(e) => setActiveUserId(e.target.value)}
                className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-emerald-300"
              >
                <option value={DEFAULT_AUTHORIZED_CITIZEN_ID}>
                  citizen-owner-user-a (Workspace Owner)
                </option>
                <option value="citizen-unauthorized-user-b">
                  citizen-unauthorized-user-b (Test 403 IDOR Block)
                </option>
              </select>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">
                Draft Autosave Backup
              </div>
              <div className="text-xs font-semibold text-indigo-300">
                {lastLocalBackupAt}
              </div>
            </div>
          </div>
        </div>

        {/* Real 10-Section Progress Bar & Smart Completion Check */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                Preparation Progress: {completion.completedCount} /{" "}
                {completion.totalCount} sections complete (
                {completion.percentage}%)
              </span>
              <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300">
                Status: {workspace.status.replaceAll("_", " ").toUpperCase()}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("review_and_a4_dossier")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
              >
                <FileCheck className="h-3.5 w-3.5" />
                Review Pack & A4 Preview
              </button>
              <button
                type="button"
                onClick={() => handleExportDossier("bilingual_dossier")}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                <Printer className="h-3.5 w-3.5" />
                Export & Print PDF (v
                {(workspace.exportHistory[workspace.exportHistory.length - 1]
                  ?.versionNumber ?? 0) + 1}
                )
              </button>
              <Link
                href="/action-center/binder"
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/40 px-3.5 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-900/50 transition-colors"
              >
                <FolderKanban className="h-3.5 w-3.5" />
                Case Binder (E18)
              </Link>
            </div>
          </div>

          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${completion.percentage}%` }}
            />
          </div>

          {completion.missingRequiredForExport.length > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                Missing for export:{" "}
                {completion.missingRequiredForExport.join(", ")} (Missing items
                remain marked <code className="font-mono">[Complete before use]</code>{" "}
                — never invented).
              </span>
            </div>
          )}
        </div>

        {/* Status Feedback Banner */}
        {statusBanner && (
          <div
            className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-medium ${
              statusBanner.tone === "emerald"
                ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                : statusBanner.tone === "amber"
                ? "border-amber-500/40 bg-amber-950/40 text-amber-200"
                : "border-rose-500/40 bg-rose-950/40 text-rose-200"
            }`}
          >
            <span>{statusBanner.message}</span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="ml-4 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4 Modular Workspace Navigation Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab("facts_and_timeline")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "facts_and_timeline"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Calendar className="h-4 w-4" />
            1. Situation Summary, Chronology & Parties ({workspace.timeline.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("checklist_and_attachments")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "checklist_and_attachments"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <FolderKanban className="h-4 w-4" />
            2. Document Checklist, Private Vault & PII Guard (
            {workspace.attachments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sources_dlsa_and_drafts")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "sources_dlsa_and_drafts"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Building2 className="h-4 w-4" />
            3. Verified DLSA Snapshot, Lok Adalat & Drafts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("review_and_a4_dossier")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "review_and_a4_dossier"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Printer className="h-4 w-4" />
            4. Review Gate, Bilingual A4 Dossier & Export History (v
            {workspace.exportHistory.length})
          </button>
        </div>
      </div>

      {/* SPRINT E15: ASSISTED PARA-LEGAL CLINIC HANDOFF & OFFLINE PWA SYNC PANEL */}
      <ClinicHandoffAndPwaPanel
        workspace={workspace}
        activeUserId={activeUserId}
        initialSessions={initialHandoffSessions}
        initialEvents={initialHandoffEvents}
        onWorkspaceSynced={(updated) => {
          setWorkspace(updated);
          setTitle(updated.title);
          setSummaryEn(updated.situationSummaryEn);
          setSummaryHi(updated.situationSummaryHi);
          setPrivateNotes(updated.userPrivateNotes);
        }}
      />

      {/* =====================================================================
          TAB 1: SITUATION SUMMARY, BILINGUAL CONTROLS, TIMELINE & PARTIES
         ===================================================================== */}
      {activeTab === "facts_and_timeline" && (
        <div className="grid gap-6 lg:grid-cols-12 print:hidden">
          {/* Left 7 Cols: Situation Summary & Bilingual Editor */}
          <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-white lg:col-span-7">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Section 1 — Situation Summary & Bilingual Presentation
              </h2>
              <span className="rounded-md bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                USER FACTS (SACRED)
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400">
                  Preparation Workspace Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    handleBackupToLocalDraft(e.target.value, summaryEn);
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400">
                  Situation Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="Tenancy & Housing">Tenancy & Housing</option>
                  <option value="Consumer Rights">Consumer Rights</option>
                  <option value="Cyber Safety">Cyber Safety</option>
                  <option value="Labour & Employment">
                    Labour & Employment
                  </option>
                  <option value="RTI & Governance">RTI & Governance</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-slate-400">
                  Primary Dossier Language
                </label>
                <select
                  value={primaryLang}
                  onChange={(e) =>
                    setPrimaryLang(e.target.value as DossierLanguage)
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="en">English (Primary)</option>
                  <option value="hi">Hindi / हिन्दी (Primary)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400">
                  Secondary Bilingual Track
                </label>
                <select
                  value={secondaryLang}
                  onChange={(e) =>
                    setSecondaryLang(
                      e.target.value as DossierLanguage | "none"
                    )
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="hi">Hindi / हिन्दी (Bilingual Stacked A4)</option>
                  <option value="en">English (Bilingual Stacked A4)</option>
                  <option value="none">Single Language Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400">
                Situation Summary (English — User-Authored Facts)
              </label>
              <textarea
                rows={3}
                value={summaryEn}
                onChange={(e) => {
                  setSummaryEn(e.target.value);
                  handleBackupToLocalDraft(title, e.target.value);
                }}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400">
                Translated Presentation (Hindi — Preserves Names, Dates, Amounts
                & Authority IDs)
              </label>
              <textarea
                rows={3}
                value={summaryHi}
                onChange={(e) => setSummaryHi(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-amber-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400">
                Detailed User Account / Corrected Voice Transcript
              </label>
              <textarea
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400">
                Personal Preparation Notes (Included in Section 9 of Dossier)
              </label>
              <input
                type="text"
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveSummary}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              Save Workspace Summary & Sync Bilingual Presentation
            </button>
          </div>

          {/* Right 5 Cols: Interactive Chronology Timeline & Parties */}
          <div className="space-y-6 lg:col-span-5">
            {/* Timeline Builder */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-white">
              <h2 className="text-base font-bold">
                Section 2 — Interactive Chronology / Timeline
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Events are automatically ordered chronologically. Missing details
                remain <code className="font-mono">[Complete before use]</code>.
              </p>

              <div className="mt-4 space-y-3">
                {workspace.timeline.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono font-bold text-indigo-300">
                        {ev.eventDate}
                        {ev.isApproximateDate ? " (Approx.)" : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTimeline(ev.id)}
                        className="text-slate-500 hover:text-rose-400"
                        title="Delete timeline event"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-1.5 font-semibold text-white">
                      {ev.eventTitle}
                    </div>
                    {ev.eventTitleHi && (
                      <div className="text-[11px] text-amber-300/90">
                        {ev.eventTitleHi}
                      </div>
                    )}
                    <div className="mt-1 text-[11px] text-slate-300">
                      <span className="text-slate-400">Action:</span>{" "}
                      {ev.actionTaken} |{" "}
                      <span className="text-slate-400">Response:</span>{" "}
                      {ev.responseReceived}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Timeline Event Form */}
              <form
                onSubmit={handleAddTimelineEvent}
                className="mt-4 space-y-2.5 border-t border-slate-800 pt-4"
              >
                <div className="text-xs font-semibold text-indigo-300">
                  + Add Chronology Event
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={newEventApprox}
                      onChange={(e) => setNewEventApprox(e.target.checked)}
                    />
                    Approximate date
                  </label>
                </div>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="What happened on this date?"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newActionTaken}
                    onChange={(e) => setNewActionTaken(e.target.value)}
                    placeholder="Action taken..."
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newResponseReceived}
                    onChange={(e) => setNewResponseReceived(e.target.value)}
                    placeholder="Response received..."
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2 text-xs font-bold text-white hover:bg-slate-700"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Event to Chronology
                </button>
              </form>
            </div>

            {/* Section 3: Parties / People */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-white">
              <h2 className="text-base font-bold">
                Section 3 — Parties / Organizations Involved
              </h2>
              <div className="mt-3 space-y-2">
                {workspace.participants.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs"
                  >
                    <span className="font-bold text-indigo-300">
                      {p.roleLabel}:
                    </span>{" "}
                    <span className="font-semibold text-white">
                      {p.nameOrLabel}
                    </span>{" "}
                    ({p.organization})
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleAddParticipant}
                className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800 pt-3"
              >
                <input
                  type="text"
                  value={newPartRole}
                  onChange={(e) => setNewPartRole(e.target.value)}
                  placeholder="Role (e.g., Opposite Party)"
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  placeholder="Name or Organization"
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                />
                <button
                  type="submit"
                  className="col-span-2 rounded-lg bg-slate-800 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
                >
                  + Add Party / Organization
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: CHECKLIST, PRIVATE ATTACHMENTS VAULT & PII REDACTION GUARD
         ===================================================================== */}
      {activeTab === "checklist_and_attachments" && (
        <div className="grid gap-6 lg:grid-cols-12 print:hidden">
          {/* Left 6 Cols: Document / Information Checklist */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-white lg:col-span-6">
            <h2 className="text-lg font-bold">
              Section 4 — Information & Documents You May Want to Keep for
              Discussion
            </h2>
            <p className="text-xs text-slate-400">
              Educational organization checklist. Items are not claimed to be
              legally mandatory or sufficient evidence.
            </p>

            <div className="space-y-2.5">
              {workspace.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition ${
                    item.isChecked
                      ? "border-emerald-500/40 bg-emerald-950/20"
                      : "border-slate-800 bg-slate-950/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => {}}
                      className="mt-1 rounded border-slate-700"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-white">
                        {item.itemLabel}
                      </div>
                      <div className="text-[11px] text-amber-300/90">
                        {item.itemLabelHi}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-slate-400">
                        Note: {item.userNote || "[Complete before use]"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 6 Cols: Private Attachments Vault + PII Redaction Assistance */}
          <div className="space-y-6 lg:col-span-6">
            {/* Private Attachments Vault */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">
                  Private Attachment Index (MIME & 10 MB Guarded)
                </h2>
                <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                  Private Vault Only
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Attachments stay strictly private, are never indexed in public
                search, and are never sent to AI automatically. Permitted: PDF,
                JPEG, PNG, WEBP, TXT (≤ 10 MB).
              </p>

              <div className="mt-4 space-y-2.5">
                {workspace.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {att.filename}{" "}
                        <span className="text-[11px] text-slate-400">
                          ({Math.round(att.fileSizeBytes / 1024)} KB ·{" "}
                          {att.mimeType})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {att.description}
                      </div>
                      <div className="font-mono text-[10px] text-indigo-300">
                        Vault Path: {att.storagePath}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAttachment(att.id)}
                      className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-2 text-rose-300 hover:bg-rose-900/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <input
                  type="text"
                  value={attDesc}
                  onChange={(e) => setAttDesc(e.target.value)}
                  placeholder="Attachment description..."
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white sm:col-span-2"
                />
                <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Add Private File</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.txt"
                    onChange={handleAttachmentFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* PII Redaction Assistance Scanner */}
            <div className="rounded-2xl border border-amber-500/40 bg-slate-900/95 p-5 text-white">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
                <h2 className="text-base font-bold">
                  PII & Sensitive Information Redaction Assistant
                </h2>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Potentially sensitive information detected in your workspace. We
                never blindly overwrite your facts — choose whether to{" "}
                <strong>Redact</strong> or <strong>Keep</strong> each item before
                printing.
              </p>

              <div className="mt-3 space-y-2.5">
                {piiDetections.length === 0 ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300">
                    No unreviewed Aadhaar, PAN, or phone patterns flagged.
                  </div>
                ) : (
                  piiDetections.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-amber-300">
                          {item.label}
                        </span>{" "}
                        in {item.locationLabel}:{" "}
                        <code className="rounded bg-slate-950 px-1.5 py-0.5 text-white">
                          {item.matchedValue}
                        </code>{" "}
                        →{" "}
                        <code className="rounded bg-slate-950 px-1.5 py-0.5 text-emerald-300">
                          {item.redactedReplacement}
                        </code>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handlePiiAction(item, "redact")}
                          className="rounded-lg bg-amber-500 px-3 py-1 font-bold text-slate-950 hover:bg-amber-400"
                        >
                          Redact
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePiiAction(item, "keep")}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-white hover:bg-slate-700"
                        >
                          Keep
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: VERIFIED DLSA SNAPSHOT, LOK ADALAT BRIDGE & SOURCE BUNDLE
         ===================================================================== */}
      {activeTab === "sources_dlsa_and_drafts" && (
        <div className="grid gap-6 lg:grid-cols-12 print:hidden">
          {/* Left 6 Cols: Verified DLSA Authority Snapshot & Selector */}
          <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-white lg:col-span-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">
                Section 6 — Verified Legal-Services Resource Snapshot (E12 + E13)
              </h2>
              <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                OFFICIAL RESOURCE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Relevant verified legal-services resource based on your selected
              jurisdiction. Raw GPS coordinates are never stored or copied into
              your dossier.
            </p>

            {/* Authority Selector */}
            <div>
              <label className="block text-xs text-slate-400">
                Switch or Re-Snapshot Verified Authority from Live Governed
                Directory
              </label>
              <select
                value={workspace.linkedAuthoritySnapshot?.authorityId ?? ""}
                onChange={(e) => handleSelectAuthority(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                {availableAuthorities.map((auth) => (
                  <option key={auth.id} value={auth.id}>
                    {auth.officeName} ({auth.district ?? auth.state})
                  </option>
                ))}
              </select>
            </div>

            {workspace.linkedAuthoritySnapshot && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-emerald-300 text-sm">
                    {workspace.linkedAuthoritySnapshot.authorityName}
                  </span>
                  <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono font-bold text-indigo-300">
                    Snapshot Version v
                    {workspace.linkedAuthoritySnapshot.publishedVersionNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Jurisdiction: </span>
                  {workspace.linkedAuthoritySnapshot.district
                    ? `${workspace.linkedAuthoritySnapshot.district}, ${workspace.linkedAuthoritySnapshot.state}`
                    : workspace.linkedAuthoritySnapshot.state}
                </div>
                <div>
                  <span className="text-slate-400">Official Phone / Helpline: </span>
                  <span className="font-mono font-semibold text-white">
                    {workspace.linkedAuthoritySnapshot.phone ?? "Not listed"} /{" "}
                    {workspace.linkedAuthoritySnapshot.helpline ?? "15100"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Address: </span>
                  {workspace.linkedAuthoritySnapshot.address ?? "Not listed"}
                </div>
                <div>
                  <span className="text-slate-400">Official Source URL: </span>
                  <a
                    href={workspace.linkedAuthoritySnapshot.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-300 underline"
                  >
                    {workspace.linkedAuthoritySnapshot.sourceUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="text-[11px] text-slate-400">
                  Verified Date at Snapshot:{" "}
                  {workspace.linkedAuthoritySnapshot.verifiedAtSnapshot} |
                  Captured:{" "}
                  {new Date(
                    workspace.linkedAuthoritySnapshot.capturedAt
                  ).toLocaleString()}
                </div>

                {workspace.linkedAuthoritySnapshot.liveFreshnessWarning !==
                  "none" && (
                  <div className="mt-2 rounded-lg border border-amber-500/40 bg-amber-950/40 p-2.5 text-amber-200">
                    <strong>Freshness Notice:</strong>{" "}
                    {workspace.linkedAuthoritySnapshot.liveWarningMessage}
                  </div>
                )}
              </div>
            )}

            {/* Lok Adalat Preparation Bridge (Phases 14 & 15) */}
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300">
                  Lok Adalat & Pre-Litigation ADR Preparation Bridge (E12)
                </span>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[11px] text-indigo-200">
                  {workspace.lokAdalatBridge.readinessChecklistCount}
                </span>
              </div>
              <p className="text-slate-300">
                {workspace.lokAdalatBridge.educationalStatusNotice}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-200">
                {workspace.lokAdalatBridge.settlementDiscussionPoints.map(
                  (pt, idx) => (
                    <li key={idx}>{pt}</li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Right 6 Cols: Linked E11 Drafts & Multi-Layer Source Bundle */}
          <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-white lg:col-span-6">
            <h2 className="text-base font-bold">
              Section 5 & 7 — Linked E11 Action Drafts & Separated Source Layers
            </h2>
            <p className="text-xs text-slate-400">
              Maintains strict visual separation: USER FACTS ≠ AI EXPLANATION ≠
              VERIFIED LEGAL CONTENT ≠ COMMUNITY STORY ≠ OFFICIAL RESOURCE.
            </p>

            {/* Linked E11 Drafts */}
            <div className="space-y-2.5">
              {workspace.linkedDrafts.map((dr) => (
                <div
                  key={dr.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{dr.title}</span>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                      Template {dr.templateVersion} · {dr.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-300">{dr.summaryExcerpt}</p>
                  <div className="mt-1 text-[11px] text-indigo-300">
                    Statutory Refs: {dr.sourceReferences.join(" | ")}
                  </div>
                </div>
              ))}
            </div>

            {/* Separated Source Layers */}
            <div className="space-y-2">
              {workspace.sourceBundle.map((src) => (
                <div
                  key={src.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs"
                >
                  <div>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                      {src.sourceLayer}
                    </span>{" "}
                    <span className="font-semibold text-white">{src.title}</span>
                    <div className="text-[11px] text-slate-400">
                      {src.referenceCode} (Verified: {src.verifiedDate})
                    </div>
                  </div>
                  <Link
                    href={src.href}
                    className="text-xs font-semibold text-indigo-400 underline"
                  >
                    Open
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: REVIEW GATE, EXPORT HISTORY & BILINGUAL A4 DOSSIER PREVIEW
         ===================================================================== */}
      {activeTab === "review_and_a4_dossier" && (
        <div className="space-y-8">
          {/* Mandatory 6-Point Review Gate & Export Ledger (Hidden on Print) */}
          <div className="grid gap-6 lg:grid-cols-12 print:hidden">
            <div className="space-y-4 rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-5 text-white lg:col-span-7">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Mandatory Pre-Export Review Gate (“Review Your Pack”)
                </h2>
                <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                  User Control Enforced
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Confirm all 6 items below before generating a new versioned
                bilingual A4 dossier or offline pack.
              </p>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {(
                  [
                    ["factsCorrect", "My facts are correct"],
                    ["datesCorrect", "Dates are correct"],
                    [
                      "removedUnnecessaryPrivateInfo",
                      "I removed unnecessary private information",
                    ],
                    [
                      "reviewedAttachedDocuments",
                      "I reviewed attached documents",
                    ],
                    [
                      "checkedSelectedAuthority",
                      "I checked the selected authority/resource",
                    ],
                    [
                      "reviewedGeneratedDrafts",
                      "I reviewed generated drafts",
                    ],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={reviewGate[key]}
                      onChange={(e) =>
                        setReviewGate((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                    />
                    <span className="font-medium text-white">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  disabled={!allReviewChecked || isSaving}
                  onClick={() => handleExportDossier("bilingual_dossier")}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-40"
                >
                  <Printer className="h-4 w-4" />
                  Print / Save Bilingual A4 PDF Dossier
                </button>
                <button
                  type="button"
                  disabled={!allReviewChecked || isSaving}
                  onClick={() => handleExportDossier("offline_text")}
                  className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/50 px-4 py-2.5 text-xs font-bold text-indigo-200 hover:bg-indigo-900/60 disabled:opacity-40"
                >
                  <Download className="h-4 w-4" />
                  Download Offline Text Pack (.txt)
                </button>
              </div>
            </div>

            {/* Export History Ledger */}
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-white lg:col-span-5">
              <h2 className="text-base font-bold">
                Immutable Dossier Export History (Owner Only)
              </h2>
              <div className="space-y-2.5">
                {[...workspace.exportHistory].reverse().map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-300">
                        Dossier Version v{exp.versionNumber}
                      </span>
                      <span className="text-slate-400">
                        {new Date(exp.exportedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 text-slate-200">
                      Languages: {exp.primaryLanguage.toUpperCase()}
                      {exp.secondaryLanguage !== "none"
                        ? ` + ${exp.secondaryLanguage.toUpperCase()}`
                        : ""}{" "}
                      | Authority Snapshot: v{exp.authoritySnapshotVersion}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {exp.authorityNameSnapshot}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================================
              PRINTABLE A4 BILINGUAL CITIZEN CASE PREPARATION DOSSIER
              (Visible in Preview & Styled for Clean A4 Paper Printing)
             ================================================================= */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-slate-300 bg-white p-8 text-slate-900 shadow-2xl print:max-w-none print:rounded-none print:border-none print:p-0 print:shadow-none">
            {/* A4 Cover Banner */}
            <div className="border-b-2 border-slate-900 pb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
                    NYAYA REVOLUTION • CITIZEN CASE PREPARATION PACK (द्विभाषी तैयारी डोजियर)
                  </div>
                  <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
                    {workspace.title}
                  </h2>
                  <div className="mt-1 text-xs text-slate-600">
                    Dossier Version: v{workspace.exportHistory.length} | Prepared
                    on: {new Date().toLocaleDateString("en-IN")} | Languages:{" "}
                    {primaryLang.toUpperCase()} +{" "}
                    {secondaryLang.toUpperCase()}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-right text-[11px] text-slate-700">
                  <div className="font-bold">ORGANIZATIONAL DOSSIER</div>
                  <div>Not a Legal Decision or Filing</div>
                </div>
              </div>
            </div>

            {/* Section 1: Bilingual Situation Summary (Stacked for A4 Readability) */}
            <section className="mt-6 space-y-3 border-b border-slate-200 pb-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Section 1 — Situation Summary / स्थिति का सारांश
                </h3>
                <span className="rounded border border-slate-300 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  SOURCE LAYER: USER-ENTERED FACTS
                </span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed">
                <div className="font-bold text-slate-700">
                  ENGLISH (ORIGINAL USER FACTS):
                </div>
                <p className="mt-1 text-slate-900">
                  {summaryEn || "[Complete before use]"}
                </p>
                {secondaryLang !== "none" && (
                  <div className="mt-3 border-t border-slate-200 pt-2.5">
                    <div className="font-bold text-slate-700">
                      HINDI / हिन्दी (अनुवादित प्रस्तुति — मूल तिथियाँ और राशि संरक्षित):
                    </div>
                    <p className="mt-1 text-slate-900">
                      {summaryHi || "[Complete before use]"}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Section 2: Chronology Timeline */}
            <section className="mt-6 space-y-3 border-b border-slate-200 pb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Section 2 — Chronology of Events / घटनाक्रम समयरेखा
              </h3>
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100">
                    <th className="p-2 font-bold">Date / तिथि</th>
                    <th className="p-2 font-bold">Event & Bilingual Note</th>
                    <th className="p-2 font-bold">Action & Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {workspace.timeline.map((ev) => (
                    <tr key={ev.id}>
                      <td className="p-2 font-mono font-semibold whitespace-nowrap">
                        {ev.eventDate}
                      </td>
                      <td className="p-2">
                        <div className="font-semibold text-slate-900">
                          {ev.eventTitle}
                        </div>
                        {secondaryLang !== "none" && ev.eventTitleHi && (
                          <div className="text-[11px] text-slate-600">
                            {ev.eventTitleHi}
                          </div>
                        )}
                      </td>
                      <td className="p-2 text-[11px] text-slate-700">
                        <div>Action: {ev.actionTaken}</div>
                        <div>Response: {ev.responseReceived}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Section 3 & 4: Parties + Checklist */}
            <section className="mt-6 grid gap-6 border-b border-slate-200 pb-5 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Section 3 — Parties / संबंधित पक्ष
                </h3>
                <ul className="mt-2 space-y-2 text-xs">
                  {workspace.participants.map((p) => (
                    <li
                      key={p.id}
                      className="rounded border border-slate-200 p-2.5"
                    >
                      <strong>{p.roleLabel}:</strong> {p.nameOrLabel} (
                      {p.organization})
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Section 4 — Documents & Info Checklist / दस्तावेज़ सूची
                </h3>
                <ul className="mt-2 space-y-1.5 text-xs">
                  {workspace.checklist.map((c) => (
                    <li key={c.id}>
                      <span className="font-mono font-bold">
                        [{c.isChecked ? "✓" : "☐"}]
                      </span>{" "}
                      {c.itemLabel}
                      {secondaryLang !== "none" && (
                        <div className="pl-5 text-[11px] text-slate-600">
                          {c.itemLabelHi}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 6: Verified Assistance Authority Snapshot + HTTPS QR Reference */}
            {workspace.linkedAuthoritySnapshot && (
              <section className="mt-6 border-b border-slate-200 pb-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Section 6 — Verified Legal-Services Authority Snapshot / विधिक सेवा प्राधिकरण
                  </h3>
                  <span className="rounded border border-slate-300 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    OFFICIAL RESOURCE SNAPSHOT (v
                    {workspace.linkedAuthoritySnapshot.publishedVersionNumber})
                  </span>
                </div>
                <div className="mt-2 flex flex-col justify-between gap-4 rounded-lg border border-slate-300 bg-slate-50 p-4 text-xs sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-950">
                      {workspace.linkedAuthoritySnapshot.authorityName}
                    </div>
                    <div>
                      Jurisdiction:{" "}
                      {workspace.linkedAuthoritySnapshot.district ??
                        workspace.linkedAuthoritySnapshot.state}{" "}
                      (State: {workspace.linkedAuthoritySnapshot.state})
                    </div>
                    <div>
                      Official Phone:{" "}
                      <strong>
                        {workspace.linkedAuthoritySnapshot.phone ?? "Not listed"}
                      </strong>{" "}
                      | Toll-Free Helpline:{" "}
                      <strong>
                        {workspace.linkedAuthoritySnapshot.helpline ?? "15100"}
                      </strong>
                    </div>
                    <div>
                      Postal Address:{" "}
                      {workspace.linkedAuthoritySnapshot.address ?? "Not listed"}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Official HTTPS Source:{" "}
                      {workspace.linkedAuthoritySnapshot.sourceUrl} | Verified Date
                      at Export:{" "}
                      {workspace.linkedAuthoritySnapshot.verifiedAtSnapshot}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-center rounded border border-slate-300 bg-white p-2.5 text-center">
                    <QrCode className="h-12 w-12 text-slate-900" />
                    <span className="mt-1 text-[9px] font-semibold uppercase text-slate-600">
                      Verified HTTPS Reference
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Section 8 & 9: Questions to Discuss & Personal Notes */}
            <section className="mt-6 space-y-3 border-b border-slate-200 pb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Section 8 — Questions to Discuss with an Authority or Professional / पूछे जाने वाले प्रश्न
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                {workspace.questionsToDiscuss
                  .filter((q) => q.isIncluded)
                  .map((q) => (
                    <li key={q.id}>
                      <div className="font-medium text-slate-900">
                        {q.questionEn}
                      </div>
                      {secondaryLang !== "none" && (
                        <div className="text-[11px] text-slate-600">
                          {q.questionHi}
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
              <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 text-xs">
                <strong>Section 9 — User Private Preparation Notes:</strong>{" "}
                {privateNotes || "[Complete before use]"}
              </div>
            </section>

            {/* Concise Document Sources & Safety Footer */}
            <footer className="mt-6 pt-2 text-[11px] text-slate-600">
              <div className="font-semibold text-slate-800">
                Document Source Provenance Snapshot:
              </div>
              <div>
                Authority:{" "}
                {workspace.linkedAuthoritySnapshot?.authorityName ?? "NALSA"} |
                Source URL:{" "}
                {workspace.linkedAuthoritySnapshot?.sourceUrl ??
                  "https://nalsa.gov.in"}{" "}
                | Verification Date at Export:{" "}
                {workspace.linkedAuthoritySnapshot?.verifiedAtSnapshot ??
                  "2026-09-18"}
              </div>
              <p className="mt-2 border-t border-slate-200 pt-2 text-slate-700">
                <strong>Organizational Notice:</strong> This is a user-prepared
                organizational document. It is not legal advice, legal
                representation, or a guarantee of outcome. Verify current
                official information before acting.
              </p>
            </footer>
          </div>
        </div>
      )}

      {/* SPRINT E17 — Closed-Loop Authority Self-Healing & Procedural Follow-Up Engine */}
      <div className="mt-6 print:hidden">
        <ProceduralFollowupTrackerCard
          caseId={workspace.id}
          initialAuthorityName={
            workspace.linkedAuthoritySnapshot?.authorityName ??
            "National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)"
          }
        />
      </div>

      {/* SPRINT E16 — Voluntary Citizen Outcome & Experience Check-In */}
      <div className="mt-6 print:hidden">
        <CitizenOutcomeCheckinCard
          caseId={workspace.id}
          issueCategory={workspace.situationCategory}
          stateCode={workspace.linkedAuthoritySnapshot?.state ?? "DL"}
          districtName={workspace.linkedAuthoritySnapshot?.district ?? null}
          languageCode={primaryLang}
          verifiedResourceId={workspace.linkedAuthoritySnapshot?.authorityId ?? null}
          verifiedResourceType={workspace.linkedAuthoritySnapshot?.authorityType ?? null}
        />
      </div>
    </div>
  );
}
