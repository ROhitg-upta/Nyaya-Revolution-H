"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  History,
  Layers,
  Link2,
  Lock,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Unlink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  addDocketReferenceAction,
  createBinderExpiringHandoffAction,
  generateBinderDocumentPackAction,
  linkWorkspaceToBinderAction,
  unlinkWorkspaceFromBinderAction,
} from "@/actions/case-binder.actions";
import {
  PROCEDURAL_TEMPLATES_CATALOG,
  type BinderDocumentPackRecord,
  type BinderExpiringHandoffSession,
  type BinderReviewGateState,
  type BinderStatusMatrixItem,
  type BinderTimelineEvent,
  type CitizenCaseBinder,
  type DocketReferenceType,
  type ProceduralTemplateType,
  type WorkspaceRelationshipType,
} from "@/types/case-binder";
import type { CitizenCasePrepWorkspace } from "@/types/case-prep";

interface CaseBinderDashboardProps {
  initialBinder: CitizenCaseBinder;
  initialTimeline: BinderTimelineEvent[];
  initialStatusMatrix: BinderStatusMatrixItem[];
  availableWorkspaces: CitizenCasePrepWorkspace[];
}

export function CaseBinderDashboard({
  initialBinder,
  initialTimeline,
  initialStatusMatrix,
  availableWorkspaces,
}: CaseBinderDashboardProps) {
  const [binder, setBinder] = React.useState<CitizenCaseBinder>(initialBinder);
  const [timeline] = React.useState<BinderTimelineEvent[]>(initialTimeline);
  const [statusMatrix] = React.useState<BinderStatusMatrixItem[]>(initialStatusMatrix);

  // Active sub-tab
  const [activeTab, setActiveTab] = React.useState<
    "workspaces" | "timeline" | "dockets" | "matrix" | "documents" | "export"
  >("workspaces");

  // Link Workspace Modal / Form state
  const [selectedWorkspaceToLink, setSelectedWorkspaceToLink] = React.useState("");
  const [linkRelationship, setLinkRelationship] =
    React.useState<WorkspaceRelationshipType>("related");
  const [linkNotes, setLinkNotes] = React.useState("");
  const [isLinking, setIsLinking] = React.useState(false);
  const [linkError, setLinkError] = React.useState<string | null>(null);

  // Add Docket Form state
  const [docketType, setDocketType] = React.useState<DocketReferenceType>("docket");
  const [docketNumber, setDocketNumber] = React.useState("");
  const [docketAuthority, setDocketAuthority] = React.useState("");
  const [docketWorkspaceId, setDocketWorkspaceId] = React.useState(
    initialBinder.linkedWorkspaces[0]?.workspaceId || ""
  );
  const [docketDate, setDocketDate] = React.useState("2026-09-28");
  const [docketNotes, setDocketNotes] = React.useState("");
  const [isAddingDocket, setIsAddingDocket] = React.useState(false);

  // Document Pack Builder state
  const [packTitle, setPackTitle] = React.useState(
    `${initialBinder.title} — Procedural Document Pack`
  );
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<ProceduralTemplateType>("first-appeal-generic-v1");
  const [primaryLang, setPrimaryLang] = React.useState<"en" | "hi">("en");
  const [secondaryLang, setSecondaryLang] = React.useState<"en" | "hi" | "none">("hi");
  const [selectedWorkspaceIdsForPack, setSelectedWorkspaceIdsForPack] =
    React.useState<string[]>(initialBinder.linkedWorkspaces.map((w) => w.workspaceId));

  // Review Gate state (Phase 35)
  const [reviewGate, setReviewGate] = React.useState<BinderReviewGateState>({
    workspaceSeparationConfirmed: true,
    factsAccurate: true,
    datesVerified: true,
    docketsChecked: true,
    attachmentsAuthorized: true,
    draftWordingReviewed: true,
    privacyPreserved: true,
  });

  const [isGeneratingPack, setIsGeneratingPack] = React.useState(false);
  const [generatedPack, setGeneratedPack] =
    React.useState<BinderDocumentPackRecord | null>(null);
  const [packError, setPackError] = React.useState<string | null>(null);

  // Temporary Handoff state (Phase 38)
  const [showHandoffModal, setShowHandoffModal] = React.useState(false);
  const [handoffHelperName, setHandoffHelperName] = React.useState("Para-Legal Volunteer");
  const [handoffHours, setHandoffHours] = React.useState(24);
  const [handoffSession, setHandoffSession] =
    React.useState<BinderExpiringHandoffSession | null>(null);
  const [handoffToken, setHandoffToken] = React.useState<string | null>(null);
  const [isCreatingHandoff, setIsCreatingHandoff] = React.useState(false);
  const [copiedToken, setCopiedToken] = React.useState(false);

  // Total summary metrics
  const totalWorkspaces = binder.linkedWorkspaces.length;
  const totalDockets = binder.dockets.length;
  const totalTimelineEvents = timeline.length;
  const totalDrafts = binder.linkedWorkspaces.reduce(
    (acc, w) => acc + (w.workspaceSnapshot?.linkedDrafts.length || 0),
    0
  );

  // Check for any chronology conflicts in master timeline
  const hasTimelineConflicts = timeline.some((t) => t.hasChronologyConflict);

  async function handleLinkWorkspace(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedWorkspaceToLink) return;
    setIsLinking(true);
    setLinkError(null);

    const res = await linkWorkspaceToBinderAction({
      binderId: binder.id,
      workspaceId: selectedWorkspaceToLink,
      relationshipType: linkRelationship,
      notes: linkNotes,
    });

    setIsLinking(false);
    if (!res.success || !res.binder) {
      setLinkError(res.error || "Failed to link workspace.");
      return;
    }

    setBinder(res.binder);
    setSelectedWorkspaceToLink("");
    setLinkNotes("");
  }

  async function handleUnlinkWorkspace(workspaceId: string) {
    const res = await unlinkWorkspaceFromBinderAction(binder.id, workspaceId);
    if (res.success && res.binder) {
      setBinder(res.binder);
    }
  }

  async function handleAddDocket(e: React.FormEvent) {
    e.preventDefault();
    if (!docketNumber.trim() || !docketAuthority.trim()) return;
    setIsAddingDocket(true);

    const res = await addDocketReferenceAction({
      binderId: binder.id,
      workspaceId: docketWorkspaceId,
      referenceType: docketType,
      referenceNumber: docketNumber.trim(),
      authorityName: docketAuthority.trim(),
      submittedAt: docketDate,
      notes: docketNotes.trim(),
    });

    setIsAddingDocket(false);
    if (res.success && res.docket) {
      setBinder((prev) => ({
        ...prev,
        dockets: [...prev.dockets, res.docket!],
      }));
      setDocketNumber("");
      setDocketAuthority("");
      setDocketNotes("");
    }
  }

  async function handleGeneratePack(e: React.FormEvent) {
    e.preventDefault();
    setIsGeneratingPack(true);
    setPackError(null);

    const res = await generateBinderDocumentPackAction({
      binderId: binder.id,
      packTitle,
      templateType: selectedTemplate,
      primaryLanguage: primaryLang,
      secondaryLanguage: secondaryLang,
      selectedWorkspaceIds: selectedWorkspaceIdsForPack,
      selectedAttachmentIds: [],
      reviewGate,
    });

    setIsGeneratingPack(false);
    if (!res.success || !res.pack) {
      setPackError(res.error || "Could not generate document pack.");
      return;
    }

    setGeneratedPack(res.pack);
  }

  async function handleCreateHandoff() {
    setIsCreatingHandoff(true);
    const res = await createBinderExpiringHandoffAction({
      binderId: binder.id,
      createdByName: handoffHelperName,
      clinicOrHelperNote: "Multi-Workspace Case Binder Snapshot for Clinic Triage",
      durationHours: handoffHours,
    });
    setIsCreatingHandoff(false);
    if (res.success && res.handoffSession && res.plaintextToken) {
      setHandoffSession(res.handoffSession);
      setHandoffToken(res.plaintextToken);
    }
  }

  function handleCopyToken() {
    if (!handoffToken || typeof navigator === "undefined") return;
    navigator.clipboard.writeText(handoffToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  }

  // Workspaces not yet linked to the binder
  const unlinkedWorkspaces = availableWorkspaces.filter(
    (w) => !binder.linkedWorkspaces.some((l) => l.workspaceId === w.id)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Header */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/30 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link
              href="/action-center"
              className="inline-flex items-center gap-1 hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Action Center
            </Link>
            <span>/</span>
            <Link
              href="/action-center/case-prep"
              className="hover:text-indigo-300 transition-colors"
            >
              Individual Case Prep
            </Link>
            <span>/</span>
            <span className="text-indigo-300 font-semibold">Case Binder (E18)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-xs px-2.5 py-1">
              <FolderKanban className="h-3.5 w-3.5 mr-1.5" />
              SPRINT E18 • Multi-Workspace Case Binder
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-700 bg-slate-950 text-slate-300 text-xs"
            >
              <Lock className="h-3 w-3 mr-1 text-teal-400" />
              Private Citizen Vault
            </Badge>
            <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-xs">
              Linked ≠ Merged (Strict Data Isolation)
            </Badge>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {binder.title}
          </h1>
          <p className="text-sm text-slate-300 max-w-4xl leading-relaxed">
            {binder.description}
          </p>
        </div>

        {/* 5-Metric Executive Dashboard Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              Linked Workspaces
            </div>
            <div className="text-2xl font-black text-white">{totalWorkspaces}</div>
            <div className="text-[11px] text-slate-400">Independent facts</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5 text-teal-400" />
              Dockets / Diary Nos.
            </div>
            <div className="text-2xl font-black text-white">{totalDockets}</div>
            <div className="text-[11px] text-slate-400">Official references</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-amber-400" />
              Master Chronology
            </div>
            <div className="text-2xl font-black text-white">{totalTimelineEvents}</div>
            <div className="text-[11px] text-slate-400">Unified milestones</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-sky-400" />
              Associated Drafts
            </div>
            <div className="text-2xl font-black text-white">{totalDrafts}</div>
            <div className="text-[11px] text-slate-400">Educational templates</div>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-3 flex flex-col justify-between gap-2">
            <div>
              <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5" />
                Clinic Handoff
              </div>
              <div className="text-xs text-slate-300 mt-1">E15 Read-Only Snapshot</div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => setShowHandoffModal(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-7 font-semibold"
            >
              Share Frozen Pass
            </Button>
          </div>
        </div>

        {/* Chronology Conflict Warning (Phase 28) */}
        {hasTimelineConflicts && (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-950/20 p-3.5 text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-amber-100">
                Chronology Alignment Notice:
              </strong>{" "}
              Multiple events share identical dates across different workspaces. Check
              the Master Timeline tab to review date sequences before generating your
              procedural document pack.
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-800 flex flex-wrap gap-2 text-xs font-medium">
        {[
          { key: "workspaces", label: "1. Linked Workspaces", icon: Layers, count: totalWorkspaces },
          { key: "timeline", label: "2. Master Timeline", icon: History, count: totalTimelineEvents },
          { key: "dockets", label: "3. Multi-Docket Tracking", icon: FileSpreadsheet, count: totalDockets },
          { key: "matrix", label: "4. Status Matrix (E16/E17)", icon: Scale },
          { key: "documents", label: "5. Document Library", icon: BookOpen, count: totalDrafts },
          { key: "export", label: "6. Group Dossier Export", icon: Printer },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`inline-flex items-center gap-2 py-3 px-4 border-b-2 transition-all ${
                isActive
                  ? "border-indigo-400 text-white font-bold bg-slate-900/60"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Linked Workspaces (Phase 3 & 4) */}
      {activeTab === "workspaces" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  Workspaces Linked to this Binder
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Each linked workspace maintains its own isolated facts, checklists, notes,
                  and ownership boundaries.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {binder.linkedWorkspaces.map((link, idx) => {
                const ws = link.workspaceSnapshot;
                return (
                  <div
                    key={link.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            #{idx + 1}
                          </span>
                          <span className="text-sm font-bold text-white">
                            {ws ? ws.title : link.workspaceId}
                          </span>
                          <Badge
                            className={
                              link.relationshipType === "primary"
                                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-[10px]"
                                : link.relationshipType === "related"
                                ? "bg-teal-500/20 text-teal-300 border-teal-500/40 text-[10px]"
                                : "bg-slate-800 text-slate-300 text-[10px]"
                            }
                          >
                            {link.relationshipType.toUpperCase()}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-slate-700 text-slate-400 text-[10px]"
                          >
                            {ws ? ws.situationCategory : "General"}
                          </Badge>
                        </div>
                        {link.notes && (
                          <p className="text-xs text-slate-300 pt-0.5">
                            <strong>Organizational Note:</strong> {link.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href="/action-center/case-prep"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                        >
                          <FileText className="h-3 w-3" />
                          Open Workspace
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        {link.relationshipType !== "primary" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnlinkWorkspace(link.workspaceId)}
                            className="h-7 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/40"
                            title="Unlink from this binder"
                          >
                            <Unlink className="h-3 w-3 mr-1" />
                            Unlink
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Snapshot Metadata Strip */}
                    {ws && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                        <div>
                          <strong>Timeline Events:</strong> {ws.timeline.length}
                        </div>
                        <div>
                          <strong>Checklist Items:</strong>{" "}
                          {ws.checklist.filter((c) => c.isChecked).length} /{" "}
                          {ws.checklist.length}
                        </div>
                        <div>
                          <strong>Drafts Prepared:</strong> {ws.linkedDrafts.length}
                        </div>
                        <div>
                          <strong>Attachments:</strong> {ws.attachments.length} private files
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Link Another Workspace Form (Phase 4) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Link2 className="h-4 w-4 text-teal-400" />
              Link Another Owned Workspace to this Binder
            </h3>
            <p className="text-xs text-slate-400">
              Only workspaces you own or hold authorized access to can be linked. No
              cross-citizen data can be accessed.
            </p>

            {unlinkedWorkspaces.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-xs text-slate-400 text-center">
                All your existing Case Preparation Workspaces are currently linked to this
                binder. Create a new workspace in Case Prep to add more.
              </div>
            ) : (
              <form onSubmit={handleLinkWorkspace} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Select Your Workspace
                    </label>
                    <select
                      value={selectedWorkspaceToLink}
                      onChange={(e) => setSelectedWorkspaceToLink(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">-- Choose an available workspace --</option>
                      {unlinkedWorkspaces.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.title} ({w.situationCategory})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Relationship Type
                    </label>
                    <select
                      value={linkRelationship}
                      onChange={(e) =>
                        setLinkRelationship(e.target.value as WorkspaceRelationshipType)
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="related">Related Matter</option>
                      <option value="followup">Follow-Up Phase</option>
                      <option value="supporting">Supporting Evidence</option>
                      <option value="group_member">Group Member Claim</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Organizational Relationship Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={linkNotes}
                    onChange={(e) => setLinkNotes(e.target.value)}
                    placeholder="e.g., Landlord deducted appliance cost from security deposit."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {linkError && (
                  <div className="rounded-lg border border-rose-500/40 bg-rose-950/30 p-2.5 text-xs text-rose-200">
                    {linkError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!selectedWorkspaceToLink || isLinking}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  {isLinking ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Linking Workspace...
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Link Workspace to Binder
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Master Chronology (Phase 6, 7 & 27) */}
      {activeTab === "timeline" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="h-4 w-4 text-amber-400" />
                  Cross-Workspace Master Chronology
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Unified timeline sorted in strict chronological order. Every event explicitly
                  cites its originating workspace.
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-slate-700 bg-slate-900 text-slate-300 text-xs"
              >
                {timeline.length} Total Verified Events
              </Badge>
            </div>

            <div className="divide-y divide-slate-800/80 pt-2">
              {timeline.map((evt) => (
                <div key={evt.id} className="py-3.5 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/30">
                        {evt.eventDate}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {evt.eventTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-800 text-slate-300 text-[10px]">
                        Source: {evt.sourceWorkspaceTitle}
                      </Badge>
                      {evt.hasChronologyConflict && (
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Same Date Review
                        </Badge>
                      )}
                    </div>
                  </div>

                  {evt.eventTitleHi && (
                    <div className="text-xs text-slate-400">{evt.eventTitleHi}</div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
                      <strong>Action Taken:</strong> {evt.actionTaken || "None recorded"}
                    </div>
                    <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
                      <strong>Response / Outcome:</strong>{" "}
                      {evt.responseReceived || "Pending response"}
                    </div>
                  </div>

                  {evt.sourceOrNote && (
                    <div className="text-[11px] text-slate-400">
                      <strong>Documentary Reference:</strong> {evt.sourceOrNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Multi-Docket Tracking (Phase 13 & 14) */}
      {activeTab === "dockets" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-teal-400" />
                  Official Multi-Docket & Reference Ledger
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tracks diary, docket, acknowledgment, and complaint numbers across different
                  authorities without exposing them in public URLs or search.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference / Docket No.</th>
                    <th className="py-2.5 px-3">Authority / Office</th>
                    <th className="py-2.5 px-3">Associated Workspace</th>
                    <th className="py-2.5 px-3">Date Submitted</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {binder.dockets.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-900/60">
                      <td className="py-3 px-3 uppercase text-[10px] font-mono text-slate-300">
                        {doc.referenceType}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-teal-300">
                        {doc.referenceNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-200">{doc.authorityName}</td>
                      <td className="py-3 px-3 text-slate-400">
                        {doc.workspaceTitle || doc.workspaceId}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono">
                        {doc.submittedAt}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          className={
                            doc.status === "acknowledged"
                              ? "bg-teal-500/20 text-teal-300 border-teal-500/30 text-[10px]"
                              : doc.status === "resolved"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]"
                              : "bg-slate-800 text-slate-300 text-[10px]"
                          }
                        >
                          {doc.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Docket Form */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-indigo-400" />
              Add Official Docket or Diary Reference
            </h3>

            <form onSubmit={handleAddDocket} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Reference Type
                  </label>
                  <select
                    value={docketType}
                    onChange={(e) => setDocketType(e.target.value as DocketReferenceType)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="docket">Helpline / Portal Docket</option>
                    <option value="diary">DLSA / Court Diary Number</option>
                    <option value="acknowledgment">15-digit NCRP Acknowledgment</option>
                    <option value="complaint">Online Complaint ID</option>
                    <option value="reference">Speed Post / Postal Consignment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Reference / Docket Number
                  </label>
                  <input
                    type="text"
                    value={docketNumber}
                    onChange={(e) => setDocketNumber(e.target.value)}
                    placeholder="e.g. DLSA-2026-D8819 or NCH-88192"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Authority / Office
                  </label>
                  <input
                    type="text"
                    value={docketAuthority}
                    onChange={(e) => setDocketAuthority(e.target.value)}
                    placeholder="e.g. DLSA New Delhi or National Consumer Helpline"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Associated Workspace
                  </label>
                  <select
                    value={docketWorkspaceId}
                    onChange={(e) => setDocketWorkspaceId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  >
                    {binder.linkedWorkspaces.map((l) => (
                      <option key={l.workspaceId} value={l.workspaceId}>
                        {l.workspaceSnapshot?.title || l.workspaceId}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Date Submitted
                  </label>
                  <input
                    type="date"
                    value={docketDate}
                    onChange={(e) => setDocketDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={docketNotes}
                    onChange={(e) => setDocketNotes(e.target.value)}
                    placeholder="e.g. Inward stamp obtained at front office"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!docketNumber.trim() || isAddingDocket}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
              >
                {isAddingDocket ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Recording Reference...
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Record Official Reference
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: Status Matrix (Phase 16 & 17) */}
      {activeTab === "matrix" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="h-4 w-4 text-indigo-400" />
                  Independent Workspace Status Matrix
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reflects distinct E16 self-reported outcomes and E17 procedural follow-up
                  windows per workspace without collapsing them into an artificial single verdict.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Workspace / Issue</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Role in Binder</th>
                    <th className="py-2.5 px-3">E16 Self-Reported Outcome</th>
                    <th className="py-2.5 px-3">E17 Follow-Up Window</th>
                    <th className="py-2.5 px-3 text-center">Dockets</th>
                    <th className="py-2.5 px-3 text-center">Drafts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {statusMatrix.map((item) => (
                    <tr key={item.workspaceId} className="hover:bg-slate-900/60">
                      <td className="py-3 px-3 font-semibold text-white">
                        {item.workspaceTitle}
                      </td>
                      <td className="py-3 px-3 text-slate-300">{item.category}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className="border-indigo-500/40 text-indigo-300 text-[10px]"
                        >
                          {item.relationshipType.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-teal-300">
                          {item.e16SelfReportedOutcome}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-amber-300 text-[11px]">
                          {item.e17FollowupWindowStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">
                        {item.docketsCount}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-200">
                        {item.documentsCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-300 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Outcome Separation Principle:</strong> A binder may contain both
                resolved and unresolved matters simultaneously. Each workspace remains
                individually verifiable under its original administrative docket.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Linked Document Library (Phase 18) */}
      {activeTab === "documents" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-sky-400" />
                Linked Workspace Document Library
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Displays educational drafts, legal-aid briefs, and representations generated
                across all linked workspaces.
              </p>
            </div>

            <div className="space-y-4">
              {binder.linkedWorkspaces.map((link) => {
                const ws = link.workspaceSnapshot;
                const drafts = ws?.linkedDrafts || [];
                return (
                  <div
                    key={link.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        {ws?.title} ({drafts.length} drafts)
                      </span>
                      <Badge
                        variant="outline"
                        className="border-slate-700 text-slate-400 text-[10px]"
                      >
                        {link.relationshipType}
                      </Badge>
                    </div>

                    {drafts.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">
                        No drafts generated in this workspace yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {drafts.map((d) => (
                          <div
                            key={d.id}
                            className="rounded-lg border border-slate-800 bg-slate-950/90 p-3 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{d.title}</span>
                              <Badge className="bg-sky-500/15 text-sky-300 border-sky-500/30 text-[10px]">
                                {d.templateVersion}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-300">{d.summaryExcerpt}</p>
                            <div className="text-[10px] text-slate-500 font-mono pt-1">
                              Status: {d.status.toUpperCase()} | Created: {d.createdAt}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Group Dossier & First-Appeal Pack Builder (Phase 20, 25, 30, 35 & 51) */}
      {activeTab === "export" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Printer className="h-4 w-4 text-emerald-400" />
                Multi-Annexure Procedural Document Pack Builder
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate an educational procedural representation (First Appeal, Grievance
                Escalation, or Conciliation Brief) pairing your binder master chronology with
                individual workspace annexures.
              </p>
            </div>

            <form onSubmit={handleGeneratePack} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300">
                  Document Pack Title
                </label>
                <input
                  type="text"
                  value={packTitle}
                  onChange={(e) => setPackTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Composite Grievance Pack v1"
                />
              </div>

              {/* Template Selector & Official Form Notice (Phase 20 & 21) */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Select Procedural Representation Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    Object.keys(PROCEDURAL_TEMPLATES_CATALOG) as ProceduralTemplateType[]
                  ).map((key) => {
                    const tmpl = PROCEDURAL_TEMPLATES_CATALOG[key];
                    const isSelected = selectedTemplate === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setSelectedTemplate(key)}
                        className={`cursor-pointer rounded-xl border p-3.5 space-y-1.5 transition-all ${
                          isSelected
                            ? "border-emerald-500/60 bg-emerald-950/20"
                            : "border-slate-800 bg-slate-900/60 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {tmpl.templateTitle}
                          </span>
                          <Badge
                            className={
                              tmpl.officialFormAvailable
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]"
                                : "bg-sky-500/20 text-sky-300 border-sky-500/30 text-[10px]"
                            }
                          >
                            {tmpl.officialFormAvailable
                              ? "Official Form Exists"
                              : "Educational Draft"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {tmpl.description}
                        </p>
                        <div className="text-[10px] text-slate-400 pt-1">
                          <strong>Citation:</strong> {tmpl.statutoryReference}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Language Selection (Phase 29) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Primary Language
                  </label>
                  <select
                    value={primaryLang}
                    onChange={(e) => setPrimaryLang(e.target.value as "en" | "hi")}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="en">English (Primary)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Secondary Language (Side-by-side)
                  </label>
                  <select
                    value={secondaryLang}
                    onChange={(e) =>
                      setSecondaryLang(e.target.value as "en" | "hi" | "none")
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="hi">Hindi (हिन्दी) — Bilingual Pack</option>
                    <option value="en">English (Bilingual)</option>
                    <option value="none">None (Monolingual only)</option>
                  </select>
                </div>
              </div>

              {/* Workspace Selection for Annexures (Phase 31) */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Select Workspaces to Include as Annexures
                </label>
                <div className="space-y-2">
                  {binder.linkedWorkspaces.map((l, idx) => {
                    const isChecked = selectedWorkspaceIdsForPack.includes(l.workspaceId);
                    return (
                      <label
                        key={l.workspaceId}
                        className={`flex items-center justify-between rounded-lg border p-3 text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? "border-emerald-500/40 bg-emerald-950/20"
                            : "border-slate-800 bg-slate-900/60 text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedWorkspaceIdsForPack((prev) => [
                                  ...prev,
                                  l.workspaceId,
                                ]);
                              } else {
                                setSelectedWorkspaceIdsForPack((prev) =>
                                  prev.filter((id) => id !== l.workspaceId)
                                );
                              }
                            }}
                            className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="font-semibold text-white">
                            Annexure {String.fromCharCode(65 + idx)}:{" "}
                            {l.workspaceSnapshot?.title || l.workspaceId}
                          </span>
                        </div>
                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                          {l.relationshipType}
                        </Badge>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Mandatory Review Gate (Phase 35) */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  Mandatory Factual Review Gate (Required before Export)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    {
                      key: "workspaceSeparationConfirmed" as const,
                      label: "I confirmed that distinct workspace facts remain separated.",
                    },
                    {
                      key: "factsAccurate" as const,
                      label: "I verified that all entered facts and claim figures are accurate.",
                    },
                    {
                      key: "datesVerified" as const,
                      label: "I verified the chronological order of timeline events.",
                    },
                    {
                      key: "docketsChecked" as const,
                      label: "I checked official docket, diary, and receipt numbers.",
                    },
                    {
                      key: "draftWordingReviewed" as const,
                      label: "I reviewed generated draft text as an educational document.",
                    },
                    {
                      key: "privacyPreserved" as const,
                      label: "I ensured unnecessary sensitive personal info is not exposed.",
                    },
                  ].map((chk) => (
                    <label
                      key={chk.key}
                      className="flex items-start gap-2 text-slate-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={reviewGate[chk.key]}
                        onChange={(e) =>
                          setReviewGate((prev) => ({
                            ...prev,
                            [chk.key]: e.target.checked,
                          }))
                        }
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>{chk.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {packError && (
                <div className="rounded-lg border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-200">
                  {packError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isGeneratingPack}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5"
              >
                {isGeneratingPack ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Assembling Procedural Pack...
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4 mr-2" />
                    Generate & Print Group Procedural Document Pack
                  </>
                )}
              </Button>
            </form>

            {/* Generated Pack Preview & Print Container */}
            {generatedPack && (
              <div className="mt-8 rounded-2xl border-2 border-emerald-500/40 bg-slate-950 p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Document Pack v{generatedPack.packVersion} Ready
                    </Badge>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {generatedPack.title}
                    </h3>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") window.print();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                  >
                    <Printer className="h-3.5 w-3.5 mr-1.5" />
                    Print to A4 / Save as PDF
                  </Button>
                </div>

                {/* Printable Pack Body */}
                <div className="space-y-6 text-slate-200 print:text-black">
                  {generatedPack.generatedTextEn && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        English Procedural Representation (Main Draft)
                      </div>
                      <pre className="whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-xs font-mono leading-relaxed overflow-x-auto text-slate-100">
                        {generatedPack.generatedTextEn}
                      </pre>
                    </div>
                  )}

                  {generatedPack.generatedTextHi && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                        हिन्दी अभ्यावेदन प्रारूप (अनुलग्नक एवं द्विभाषी प्रति)
                      </div>
                      <pre className="whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-xs font-mono leading-relaxed overflow-x-auto text-slate-100">
                        {generatedPack.generatedTextHi}
                      </pre>
                    </div>
                  )}

                  {/* Mandatory Non-Advisory Legal Disclaimer (Phase 52) */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-200">Legal Standard Notice:</strong> This
                    is a citizen-organized procedural preparation pack containing user-provided
                    facts and selected educational statutory frameworks. It does not constitute
                    legal representation, a formal court filing, or a guarantee of outcome.
                    Transcribe onto official prescribed forms where required by competent
                    authorities.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Temporary Handoff Modal (Phase 38 & 39) */}
      {showHandoffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="h-5 w-5 text-indigo-400" />
                Create Expiring Binder Handoff (E15 Extension)
              </h3>
              <button
                type="button"
                onClick={() => setShowHandoffModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Generates a temporary, read-only snapshot of this binder for a DLSA clinic
              volunteer or para-legal assistant. The live binder remains private.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300">
                  Helper / Clinic Note
                </label>
                <input
                  type="text"
                  value={handoffHelperName}
                  onChange={(e) => setHandoffHelperName(e.target.value)}
                  placeholder="e.g. DLSA Front-Office Para-Legal"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300">
                  Expiry Duration
                </label>
                <select
                  value={handoffHours}
                  onChange={(e) => setHandoffHours(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                >
                  <option value={12}>12 Hours</option>
                  <option value={24}>24 Hours (Standard Clinic Day)</option>
                  <option value={48}>48 Hours</option>
                </select>
              </div>
            </div>

            {handoffToken ? (
              <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
                <div className="text-xs font-semibold text-emerald-300">
                  Expiring Access Pass Generated:
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={handoffToken}
                    className="w-full rounded border border-slate-700 bg-slate-950 p-1.5 text-xs font-mono text-emerald-200"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopyToken}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                  >
                    {copiedToken ? "Copied!" : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                <div className="text-[11px] text-slate-400">
                  Session {handoffSession?.id} ({handoffSession?.status}) • Expires in {handoffHours} hours. Revocable anytime from privacy settings.
                </div>
              </div>
            ) : (
              <Button
                type="button"
                disabled={isCreatingHandoff}
                onClick={handleCreateHandoff}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
              >
                {isCreatingHandoff ? "Generating Snapshot..." : "Freeze & Generate Pass"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
