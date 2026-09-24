"use client";

import * as React from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Languages,
  Loader2,
  Mic,
  Phone,
  Printer,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "@/lib/icons";
import {
  analyzeCitizenVoiceOrTextAction,
  deleteCitizenActionDraftAction,
  generateCitizenActionDraftAction,
  saveVoiceTranscriptAction,
  searchVerifiedResourcesAction,
  updateCitizenActionDraftAction,
} from "@/actions/citizen-action.actions";
import {
  CITIZEN_DOCUMENT_TEMPLATES,
  VERIFIED_RESOURCES_CATALOG,
} from "@/constants/verified-resources";
import {
  VoiceSituationInput,
  type VoiceSituationInputResult,
} from "@/components/voice/voice-situation-input";
import { YourNextStepsCard } from "@/components/action/your-next-steps-card";
import type {
  CitizenDocumentTemplateType,
  GeneratedCitizenDocument,
  MultilingualUnderstandingResult,
  RankedVerifiedResource,
} from "@/types/action-engine";

const INDIAN_STATES_LIST = [
  "All India",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
  "West Bengal",
  "Telangana",
  "Rajasthan",
  "Kerala",
  "Punjab",
];

const ISSUE_CATEGORIES = [
  "All",
  "Consumer Rights",
  "Cyber Safety",
  "Tenancy & Housing",
  "Labour & Employment",
  "RTI & Governance",
  "Fundamental Rights",
];

interface ActionCenterHubProps {
  initialCategory?: string;
  initialTemplate?: CitizenDocumentTemplateType;
  initialQuery?: string;
}

export function ActionCenterHub({
  initialCategory = "All",
  initialTemplate = "consumer-grievance-v1",
  initialQuery = "",
}: ActionCenterHubProps) {
  const [activeTab, setActiveTab] = React.useState<
    "voice-understand" | "verified-directory" | "document-studio"
  >(initialTemplate && initialCategory !== "All" ? "document-studio" : "voice-understand");

  // State 1: Multilingual Understanding & Voice
  const [selectedState, setSelectedState] = React.useState<string>("All India");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [understanding, setUnderstanding] =
    React.useState<MultilingualUnderstandingResult | null>(null);
  const [matchedResources, setMatchedResources] = React.useState<
    RankedVerifiedResource[]
  >(() =>
    VERIFIED_RESOURCES_CATALOG.slice(0, 4).map((r) => ({
      ...r,
      matchScore: 90,
      matchReasons: ["Verified Official Authority"],
    }))
  );

  // State 2: Verified Directory Filters
  const [dirCategory, setDirCategory] = React.useState<string>(initialCategory);
  const [dirState, setDirState] = React.useState<string>("All India");
  const [dirSearch, setDirSearch] = React.useState<string>(initialQuery);
  const [directoryResults, setDirectoryResults] = React.useState<
    RankedVerifiedResource[]
  >(() =>
    VERIFIED_RESOURCES_CATALOG.map((r) => ({
      ...r,
      matchScore: 92,
      matchReasons: ["Verified Official Indian Legal Resource"],
    }))
  );
  const [isSearchingDir, setIsSearchingDir] = React.useState(false);

  // State 3: Citizen Action Document Studio
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<CitizenDocumentTemplateType>(initialTemplate);
  const [situationSummary, setSituationSummary] = React.useState<string>(
    "Purchased a laptop online on 12th of last month. Delivered with cracked display and faulty motherboard. Customer support rejected refund citing 7-day replacement window even though complaint was logged on Day 2."
  );
  const [citizenName, setCitizenName] = React.useState<string>("");
  const [citizenCityState, setCitizenCityState] = React.useState<string>("");
  const [counterpartyName, setCounterpartyName] = React.useState<string>("");
  const [incidentDate, setIncidentDate] = React.useState<string>("");
  const [referenceOrAmount, setReferenceOrAmount] = React.useState<string>("");
  const [reliefSought, setReliefSought] = React.useState<string>("");

  const [generatedDoc, setGeneratedDoc] =
    React.useState<GeneratedCitizenDocument | null>(null);
  const [isGeneratingDoc, setIsGeneratingDoc] = React.useState(false);
  const [userReviewedChecked, setUserReviewedChecked] = React.useState(false);
  const [copiedFeedback, setCopiedFeedback] = React.useState(false);
  const [savedFeedback, setSavedFeedback] = React.useState(false);

  const handleVoiceOrTextConfirmed = async (
    result: VoiceSituationInputResult
  ) => {
    setIsAnalyzing(true);
    try {
      const response = await analyzeCitizenVoiceOrTextAction({
        rawInput: result.editedTranscript,
        languageHint: result.language,
        stateJurisdiction: selectedState,
      });

      if (response.ok && response.understanding) {
        setUnderstanding(response.understanding);
        setSituationSummary(response.understanding.originalText);
        if (response.recommendedResources) {
          setMatchedResources(response.recommendedResources);
        }

        // Also persist the user-reviewed voice transcript record
        await saveVoiceTranscriptAction({
          rawTranscript: result.rawTranscript,
          editedTranscript: result.editedTranscript,
          detectedLanguage: response.understanding.detectedLanguage,
          languageScript: response.understanding.languageScript,
          normalizedTranslation: response.understanding.normalizedEnglishText,
          durationSeconds: result.durationSeconds,
          storagePreference: result.storagePreference,
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFilterDirectory = React.useCallback(
    async (cat: string, st: string, q: string) => {
      setIsSearchingDir(true);
      try {
        const res = await searchVerifiedResourcesAction({
          category: cat,
          state: st,
          query: q,
        });
        if (res.ok) {
          setDirectoryResults(res.resources);
        }
      } finally {
        setIsSearchingDir(false);
      }
    },
    []
  );

  const handleOpenTemplateFromSituation = (
    templateType: CitizenDocumentTemplateType
  ) => {
    setSelectedTemplate(templateType);
    if (understanding) {
      setSituationSummary(
        `${understanding.originalText}\n\n[Normalized Summary]: ${understanding.normalizedEnglishText}`
      );
      if (selectedState !== "All India") {
        setCitizenCityState(selectedState);
      }
    }
    setActiveTab("document-studio");
  };

  const handleGenerateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingDoc(true);
    setUserReviewedChecked(false);
    setSavedFeedback(false);
    try {
      const res = await generateCitizenActionDraftAction({
        templateType: selectedTemplate,
        situationSummary,
        citizenName,
        citizenCityState: citizenCityState || selectedState,
        counterpartyOrAuthorityName: counterpartyName,
        incidentDate,
        amountOrReferenceInvolved: referenceOrAmount,
        reliefSought,
      });
      if (res.ok && res.document) {
        setGeneratedDoc(res.document);
      }
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  const handleUpdateSectionBody = (sectionId: string, newBody: string) => {
    if (!generatedDoc) return;
    setGeneratedDoc({
      ...generatedDoc,
      generatedSections: generatedDoc.generatedSections.map((sec) =>
        sec.id === sectionId ? { ...sec, body: newBody } : sec
      ),
    });
  };

  const handleSaveReviewedDraft = async () => {
    if (!generatedDoc) return;
    await updateCitizenActionDraftAction({
      documentId: generatedDoc.id,
      title: generatedDoc.title,
      generatedSections: generatedDoc.generatedSections,
      userReviewed: userReviewedChecked,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleDeleteDraft = async () => {
    if (!generatedDoc) return;
    await deleteCitizenActionDraftAction(generatedDoc.id);
    setGeneratedDoc(null);
    setUserReviewedChecked(false);
  };

  const formatPlainTextForExport = (): string => {
    if (!generatedDoc) return "";
    const lines: string[] = [
      "==========================================================================",
      `STATUS: ${generatedDoc.statusLabel.toUpperCase()}`,
      `TEMPLATE VERSION: ${generatedDoc.templateType} (${generatedDoc.templateVersion})`,
      "==========================================================================",
      "",
      generatedDoc.title.toUpperCase(),
      "",
    ];

    for (const sec of generatedDoc.generatedSections) {
      lines.push(`--- ${sec.heading} ---`);
      lines.push(sec.body);
      lines.push("");
    }

    lines.push("--------------------------------------------------------------------------");
    lines.push(`SAFETY & EDUCATIONAL NOTICE: ${generatedDoc.safetyDisclaimer}`);
    lines.push("Generated via Nyaya Revolution Citizen Action Engine");
    return lines.join("\n");
  };

  const handleCopyDraftText = async () => {
    if (!generatedDoc || !userReviewedChecked) return;
    await navigator.clipboard.writeText(formatPlainTextForExport());
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2500);
  };

  const handleDownloadMarkdownOrText = () => {
    if (!generatedDoc || !userReviewedChecked) return;
    const text = formatPlainTextForExport();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedDoc.templateType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintA4Pdf = () => {
    if (!generatedDoc || !userReviewedChecked) return;
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Action Engine Mode Switcher + State Jurisdiction Bar (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm print:hidden dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex flex-wrap items-center gap-2" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "voice-understand"}
            onClick={() => setActiveTab("voice-understand")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "voice-understand"
                ? "bg-slate-900 text-white shadow-sm dark:bg-amber-500 dark:text-slate-950"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Mic className="size-4" aria-hidden />
            1. Speak or Describe (Multilingual)
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "verified-directory"}
            onClick={() => setActiveTab("verified-directory")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "verified-directory"
                ? "bg-slate-900 text-white shadow-sm dark:bg-amber-500 dark:text-slate-950"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Building2 className="size-4" aria-hidden />
            2. Verified Legal Aid & Helplines (15100 / 1915 / 1930)
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "document-studio"}
            onClick={() => setActiveTab("document-studio")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "document-studio"
                ? "bg-slate-900 text-white shadow-sm dark:bg-amber-500 dark:text-slate-950"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <FileText className="size-4" aria-hidden />
            3. Citizen Action Draft & Printable A4 Studio
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="citizen-state-select"
            className="text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            Your State / Jurisdiction:
          </label>
          <select
            id="citizen-state-select"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setDirState(e.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {INDIAN_STATES_LIST.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =====================================================================
          WORKSPACE 1: MULTILINGUAL VOICE & SITUATION UNDERSTANDING
      ===================================================================== */}
      {activeTab === "voice-understand" && (
        <div className="space-y-6 print:hidden">
          <VoiceSituationInput
            onTranscriptConfirmed={handleVoiceOrTextConfirmed}
          />

          {isAnalyzing && (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-sm font-medium text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              <Loader2 className="size-5 animate-spin text-amber-600" />
              Detecting language script, mapping Controlled Indian Legal Terminology, and matching Verified Legal Aid Resources...
            </div>
          )}

          {understanding && (
            <div className="space-y-6">
              {/* Multilingual Preservation & Controlled Terminology Bridge Card */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Languages className="size-5 text-amber-600" aria-hidden />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Multilingual Situation Understanding & Legal Terminology Bridge
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
                      Detected Script: {understanding.languageScript}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        understanding.urgencyLevel ===
                        "urgent-financial-or-safety"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      Priority: {understanding.urgencyLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Preserved Citizen Voice (Original Input)
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                      “{understanding.originalText}”
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/25">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      Normalized Legal Understanding (For Verified Retrieval)
                    </div>
                    <p className="mt-1.5 text-sm text-slate-800 dark:text-slate-200">
                      {understanding.normalizedEnglishText}
                    </p>
                  </div>
                </div>

                {understanding.matchedLegalTerms.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Controlled Indian Legal Terminology Mapped:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {understanding.matchedLegalTerms.map((term, idx) => (
                        <div
                          key={`${term.originalPhrase}-${idx}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-2xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <span className="font-medium text-amber-700 dark:text-amber-300">
                            “{term.originalPhrase}”
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {term.normalizedEnglishTerm}
                          </span>
                          {term.relatedProvision && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                              {term.relatedProvision}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Your Next Steps Action Roadmap */}
              <YourNextStepsCard
                primaryCategory={understanding.primaryCategory}
                plainLanguageExplanation={understanding.plainLanguageExplanation}
                recommendedResources={matchedResources}
                recommendedLessons={understanding.recommendedLessonSlugs}
                recommendedRights={understanding.recommendedRightSlugs}
                onSelectTemplateDraft={handleOpenTemplateFromSituation}
              />
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          WORKSPACE 2: VERIFIED ASSISTANCE & LEGAL AID DIRECTORY
      ===================================================================== */}
      {activeTab === "verified-directory" && (
        <div className="space-y-6 print:hidden">
          {/* Search & Jurisdiction Filters */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Verified Indian Legal Aid, Helplines & Statutory Portals
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every authority below is human-verified with freshness tracking (`last_verified_at`), eligibility criteria, and Central vs State jurisdiction warnings.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="size-4" aria-hidden />
                {directoryResults.length} Verified Authorities Active
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div>
                <label
                  htmlFor="dir-category-filter"
                  className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Legal Domain / Issue Category
                </label>
                <select
                  id="dir-category-filter"
                  value={dirCategory}
                  onChange={(e) => {
                    setDirCategory(e.target.value);
                    handleFilterDirectory(e.target.value, dirState, dirSearch);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {ISSUE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="dir-state-filter"
                  className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  State / SLSA Jurisdiction
                </label>
                <select
                  id="dir-state-filter"
                  value={dirState}
                  onChange={(e) => {
                    setDirState(e.target.value);
                    handleFilterDirectory(dirCategory, e.target.value, dirSearch);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {INDIAN_STATES_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="dir-keyword-search"
                  className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Search by Helpline (15100, 1930, 1915) or Authority
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-2.5 left-3 size-3.5 text-slate-400"
                    aria-hidden
                  />
                  <input
                    id="dir-keyword-search"
                    type="search"
                    value={dirSearch}
                    onChange={(e) => {
                      setDirSearch(e.target.value);
                      handleFilterDirectory(
                        dirCategory,
                        dirState,
                        e.target.value
                      );
                    }}
                    placeholder="Search NALSA, Cyber 1930, Consumer 1915, RTI..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-8 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {isSearchingDir ? (
            <div className="flex items-center justify-center p-8 text-xs text-slate-500">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Filtering verified legal aid authorities...
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {directoryResults.map((res) => (
                <article
                  key={res.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                          <BadgeCheck className="size-3.5" aria-hidden />
                          {res.shortName}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {res.state} ({res.jurisdictionScope.toUpperCase()})
                        </span>
                      </div>

                      {res.helplineNumber ? (
                        <a
                          href={`tel:${res.helplineNumber}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800 hover:bg-amber-500/25 dark:text-amber-300"
                        >
                          <Phone className="size-3.5" aria-hidden />
                          Helpline: {res.helplineNumber}
                        </a>
                      ) : null}
                    </div>

                    <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-slate-100">
                      {res.authorityName}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {res.description}
                    </p>

                    {res.jurisdictionWarning && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50/90 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                        <div>
                          <span className="font-semibold">
                            Jurisdiction Clarity Notice:
                          </span>{" "}
                          {res.jurisdictionWarning}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Who Can Use & Fee Structure:
                      </div>
                      <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                        {res.eligibilityNotes} •{" "}
                        <strong className="text-emerald-700 dark:text-emerald-400">
                          {res.feeNotes}
                        </strong>
                      </p>
                    </div>

                    <div className="mt-3">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Step-by-Step Citizen Process:
                      </div>
                      <ol className="mt-1 list-inside list-decimal space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        {res.howToUseSteps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                    <span className="text-[11px] text-slate-500">
                      Verified: <strong>{res.lastVerifiedAt}</strong> • Hours:{" "}
                      {res.operatingHours}
                    </span>

                    <a
                      href={res.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950"
                    >
                      Visit Official Portal
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          WORKSPACE 3: CITIZEN ACTION DOCUMENT & PRINTABLE A4 STUDIO
      ===================================================================== */}
      {activeTab === "document-studio" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Template Selector & Factual Inputs (Hidden in A4 Print) */}
          <div className="space-y-5 lg:col-span-5 print:hidden">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <Scale className="size-5 text-amber-600" aria-hidden />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Citizen Action Document Generator
                  </h2>
                  <p className="text-xs text-slate-500">
                    Versioned, human-reviewed educational templates (`v1`).
                  </p>
                </div>
              </div>

              <form onSubmit={handleGenerateDocument} className="mt-4 space-y-3.5">
                <div>
                  <label
                    htmlFor="doc-template-select"
                    className="mb-1 block text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Select Versioned Citizen Template
                  </label>
                  <select
                    id="doc-template-select"
                    value={selectedTemplate}
                    onChange={(e) =>
                      setSelectedTemplate(
                        e.target.value as CitizenDocumentTemplateType
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {CITIZEN_DOCUMENT_TEMPLATES.map((tpl) => (
                      <option key={tpl.templateType} value={tpl.templateType}>
                        {tpl.title} ({tpl.templateVersion})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="doc-situation-summary"
                    className="mb-1 block text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Factual Chronology of What Happened *
                  </label>
                  <textarea
                    id="doc-situation-summary"
                    rows={4}
                    required
                    value={situationSummary}
                    onChange={(e) => setSituationSummary(e.target.value)}
                    placeholder="Describe the dates, facts, and what went wrong..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="doc-citizen-name"
                      className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Your Name (Optional)
                    </label>
                    <input
                      id="doc-citizen-name"
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="Or leave blank for placeholder"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="doc-city-state"
                      className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      City & State
                    </label>
                    <input
                      id="doc-city-state"
                      type="text"
                      value={citizenCityState}
                      onChange={(e) => setCitizenCityState(e.target.value)}
                      placeholder="e.g., Pune, Maharashtra"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="doc-counterparty"
                      className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Opposite Party / Public Authority
                    </label>
                    <input
                      id="doc-counterparty"
                      type="text"
                      value={counterpartyName}
                      onChange={(e) => setCounterpartyName(e.target.value)}
                      placeholder="Company, Bank, Landlord, or Dept"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="doc-incident-date"
                      className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Date of Incident / Transaction
                    </label>
                    <input
                      id="doc-incident-date"
                      type="text"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      placeholder="e.g., 14 August 2026"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="doc-ref-amount"
                      className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Invoice / UTR / Ref No. & Amount ₹
                    </label>
                    <input
                      id="doc-ref-amount"
                      type="text"
                      value={referenceOrAmount}
                      onChange={(e) => setReferenceOrAmount(e.target.value)}
                      placeholder="e.g., Order #402 / ₹18,500"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="doc-relief"
                      className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Specific Resolution Requested
                    </label>
                    <input
                      id="doc-relief"
                      type="text"
                      value={reliefSought}
                      onChange={(e) => setReliefSought(e.target.value)}
                      placeholder="e.g., Full refund of ₹18,500"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingDoc}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-500 disabled:opacity-50"
                >
                  {isGeneratingDoc ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Generating Structured Citizen Draft...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Generate Structured Citizen Draft
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive Draft Editor & Printable A4 Document Preview */}
          <div className="lg:col-span-7">
            {!generatedDoc ? (
              <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <FileText className="size-10 text-amber-500/80" aria-hidden />
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">
                  Ready to Prepare Your Citizen Action Draft
                </h3>
                <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
                  Select one of the 5 verified Indian citizen templates on the left and click{" "}
                  <strong>Generate Structured Citizen Draft</strong> to open the interactive editor and A4 print view.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Mandatory Educational Banner & Human Review Gate (Print-aware) */}
                <div className="rounded-2xl border-2 border-amber-400/80 bg-amber-50/90 p-4 dark:border-amber-700 dark:bg-amber-950/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      <AlertTriangle className="size-3.5" aria-hidden />
                      {generatedDoc.statusLabel}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-amber-900 dark:text-amber-300">
                      Template: {generatedDoc.templateType} (
                      {generatedDoc.templateVersion})
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-amber-950 dark:text-amber-200">
                    <strong>Mandatory Citizen Review Notice:</strong> This document is a structured educational template prepared to help you organize your facts. It is not a substitute for an advocate&apos;s legal opinion. Please verify all bracketed{" "}
                    <code className="rounded bg-amber-200/70 px-1 py-0.5 font-mono text-[11px] dark:bg-amber-900">
                      [Complete before use: ...]
                    </code>{" "}
                    fields before printing or exporting.
                  </p>
                </div>

                {/* Printable A4 Sheet Container */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:border-none print:p-0 print:shadow-none dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
                    <label
                      htmlFor="editable-doc-title"
                      className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 print:hidden"
                    >
                      Document Heading (Editable)
                    </label>
                    <input
                      id="editable-doc-title"
                      type="text"
                      value={generatedDoc.title}
                      onChange={(e) =>
                        setGeneratedDoc({
                          ...generatedDoc,
                          title: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-transparent bg-transparent text-lg font-bold text-slate-900 focus:border-amber-500 focus:bg-slate-50 focus:px-2 focus:outline-none dark:text-slate-100 dark:focus:bg-slate-800"
                    />
                  </div>

                  {/* Editable Document Sections */}
                  <div className="mt-5 space-y-5">
                    {generatedDoc.generatedSections.map((sec) => (
                      <div key={sec.id} className="space-y-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          {sec.heading}
                        </h4>
                        <textarea
                          rows={Math.max(
                            3,
                            Math.min(10, sec.body.split("\n").length + 1)
                          )}
                          value={sec.body}
                          onChange={(e) =>
                            handleUpdateSectionBody(sec.id, e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 font-sans text-xs leading-relaxed text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none print:border-none print:bg-transparent print:p-0 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Source Traceability Footer */}
                  <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <ShieldCheck
                        className="size-4 text-emerald-600"
                        aria-hidden
                      />
                      Verified Statutory & Authority Traceability
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {generatedDoc.sourceCitations.map((cit, i) => (
                        <li key={i}>
                          • <strong>{cit.title}</strong> —{" "}
                          <span>{cit.authorityOrProvision}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mandatory Human Review Confirmation & Export Bar (Hidden when printing) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden dark:border-slate-800 dark:bg-slate-900">
                  <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={userReviewedChecked}
                      onChange={(e) => setUserReviewedChecked(e.target.checked)}
                      className="mt-0.5 size-4 rounded accent-amber-600"
                    />
                    <span>
                      <strong>Human Review Confirmation (Required to Export/Print):</strong>{" "}
                      I have reviewed every section of this educational template, verified the dates and facts, and understand that this draft is for my personal preparation.
                    </span>
                  </label>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={!userReviewedChecked}
                        onClick={handlePrintA4Pdf}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-500 dark:text-slate-950"
                      >
                        <Printer className="size-3.5" aria-hidden />
                        Print / Save A4 PDF
                      </button>

                      <button
                        type="button"
                        disabled={!userReviewedChecked}
                        onClick={handleDownloadMarkdownOrText}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <Download className="size-3.5" aria-hidden />
                        Download (.txt)
                      </button>

                      <button
                        type="button"
                        disabled={!userReviewedChecked}
                        onClick={handleCopyDraftText}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {copiedFeedback ? (
                          <>
                            <Check className="size-3.5 text-emerald-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            Copy Text
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveReviewedDraft}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="size-3.5" />
                        {savedFeedback ? "Saved!" : "Save Progress"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleDeleteDraft}
                      className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Delete Draft
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
