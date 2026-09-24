"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  FileAudio,
  FileImage,
  FileVideo,
  Lock,
  Save,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserCheck,
} from "lucide-react";

import {
  generateAIStoryAssistanceAction,
  publishOrSaveCommunityStoryAction,
} from "@/actions/community.actions";
import { StoryMediaGallery } from "@/components/community/media-player";
import { StoryLearningBridge } from "@/components/community/story-learning-bridge";
import { VoiceSituationInput } from "@/components/voice/voice-situation-input";
import { Container } from "@/components/layout";
import {
  COMMUNITY_CATEGORIES,
  CONTROLLED_COMMUNITY_TAGS,
  DEFAULT_LEARNING_BRIDGES,
  MEDIA_UPLOAD_LIMITS,
  STORY_TYPES,
} from "@/constants/community";
import { communityStoryRoute, routes } from "@/constants/routes";
import { detectAndRedactPII } from "@/lib/sanitization";
import {
  formatBytes,
  uploadStoryMediaClient,
} from "@/services/storage/media-storage.service";
import type {
  AIStoryAssistanceResult,
  CommunityCategorySlug,
  CommunityStory,
  StoryIdentityMode,
  StoryMediaAttachment,
  StoryType,
  StoryVisibility,
} from "@/types/community";

interface StoryCreationWizardProps {
  initialStory?: CommunityStory | null;
}

const WIZARD_STEPS = [
  { number: 1, title: "1. Type & Legal Area" },
  { number: 2, title: "2. What Happened" },
  { number: 3, title: "3. Action & Takeaway" },
  { number: 4, title: "4. Media Upload" },
  { number: 5, title: "5. AI & Learning Bridge" },
  { number: 6, title: "6. Privacy & Identity" },
  { number: 7, title: "7. Preview & Publish" },
] as const;

export function StoryCreationWizard({
  initialStory,
}: StoryCreationWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [storyType, setStoryType] = useState<StoryType>(
    initialStory?.storyType || "experience"
  );
  const [category, setCategory] = useState<CommunityCategorySlug>(
    initialStory?.category || "cyber"
  );
  const [title, setTitle] = useState(initialStory?.title || "");
  const [whatHappened, setWhatHappened] = useState(
    initialStory?.whatHappened || ""
  );
  const [warningSigns, setWarningSigns] = useState(
    initialStory?.warningSigns || ""
  );
  const [locationState, setLocationState] = useState(
    initialStory?.locationState || "Karnataka"
  );
  const [actionTaken, setActionTaken] = useState(
    initialStory?.actionTaken || ""
  );
  const [legalOutcome, setLegalOutcome] = useState(
    initialStory?.legalOutcome || ""
  );
  const [resolutionStatus, setResolutionStatus] = useState<
    "resolved" | "ongoing" | "mediated"
  >("resolved");
  const [statutoryBacking, setStatutoryBacking] = useState(
    initialStory?.statutoryBacking || ""
  );
  const [citizenTakeaway, setCitizenTakeaway] = useState(
    initialStory?.citizenTakeaway || ""
  );
  const [tags, setTags] = useState<string[]>(
    initialStory?.tags || ["Written Notice"]
  );

  // Media State
  const [mediaAttachments, setMediaAttachments] = useState<
    StoryMediaAttachment[]
  >(initialStory?.media || []);
  const [mediaCaptionInput, setMediaCaptionInput] = useState("");
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // AI Assistance State
  const [aiResult, setAiResult] = useState<AIStoryAssistanceResult | null>(
    null
  );
  const [aiSummary, setAiSummary] = useState(initialStory?.aiSummary || "");
  const [aiEducationalNote, setAiEducationalNote] = useState(
    initialStory?.aiEducationalNote || ""
  );

  // Privacy & Identity State
  const [identityMode, setIdentityMode] = useState<StoryIdentityMode>(
    initialStory?.identityMode || "pseudonym"
  );
  const [authorDisplayName, setAuthorDisplayName] = useState(
    initialStory?.authorName?.replace(" (Pseudonym)", "") || "Aarav K."
  );
  const [authorRoleLabel, setAuthorRoleLabel] = useState(
    initialStory?.authorRole || "Citizen Contributor"
  );
  const [visibility, setVisibility] = useState<StoryVisibility>(
    initialStory?.visibility || "public"
  );

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [publishedStory, setPublishedStory] = useState<CommunityStory | null>(
    null
  );

  // Real-time PII Detection across all text fields
  const piiDetection = useMemo(() => {
    return detectAndRedactPII(
      `${title} ${whatHappened} ${warningSigns} ${actionTaken} ${legalOutcome} ${citizenTakeaway}`
    );
  }, [
    title,
    whatHappened,
    warningSigns,
    actionTaken,
    legalOutcome,
    citizenTakeaway,
  ]);

  const handleAutoRedactAllPII = () => {
    setTitle(detectAndRedactPII(title).redactedPreview);
    setWhatHappened(detectAndRedactPII(whatHappened).redactedPreview);
    setWarningSigns(detectAndRedactPII(warningSigns).redactedPreview);
    setActionTaken(detectAndRedactPII(actionTaken).redactedPreview);
    setLegalOutcome(detectAndRedactPII(legalOutcome).redactedPreview);
    setCitizenTakeaway(detectAndRedactPII(citizenTakeaway).redactedPreview);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (mediaAttachments.length >= MEDIA_UPLOAD_LIMITS.maxAttachmentsPerStory) {
      setMediaUploadError(
        `Maximum ${MEDIA_UPLOAD_LIMITS.maxAttachmentsPerStory} media attachments allowed per story.`
      );
      return;
    }

    const file = files[0];
    setMediaUploadError(null);
    setIsUploadingMedia(true);

    const res = await uploadStoryMediaClient({
      file,
      storyId: initialStory?.id || "draft",
      caption: mediaCaptionInput || `${file.name} (${title || "Evidence"})`,
      altText: mediaCaptionInput || file.name,
      sortOrder: mediaAttachments.length,
    });

    setIsUploadingMedia(false);
    if (!res.success || !res.attachment) {
      setMediaUploadError(res.error || "Failed to validate or upload file.");
      return;
    }

    setMediaAttachments((prev) => [...prev, res.attachment!]);
    setMediaCaptionInput("");
    e.target.value = "";
  };

  const handleRemoveMedia = (id: string) => {
    setMediaAttachments((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRunAIAssistance = () => {
    startTransition(async () => {
      const res = await generateAIStoryAssistanceAction({
        title,
        whatHappened,
        actionTaken,
        legalOutcome,
        citizenTakeaway,
        category,
      });

      if (res.success) {
        setAiResult(res.data);
        setAiSummary(res.data.aiSummary);
        setAiEducationalNote(res.data.aiEducationalNote);
        if (res.data.suggestedTags.length > 0) {
          setTags(res.data.suggestedTags);
        }
      }
    });
  };

  const handleSaveOrPublish = (saveAsDraft: boolean) => {
    setSubmitError(null);
    startTransition(async () => {
      const res = await publishOrSaveCommunityStoryAction({
        storyId: initialStory?.id,
        storyType,
        category,
        title:
          title.trim().length >= 8
            ? title
            : `Citizen ${category.toUpperCase()} Experience & Resolution`,
        whatHappened:
          whatHappened.trim().length >= 25
            ? whatHappened
            : "Detailed citizen situation narrative describing the timeline, communication trail, and statutory touchpoints.",
        warningSigns,
        actionTaken:
          actionTaken.trim().length >= 10
            ? actionTaken
            : "Filed written representation and preserved official docket number.",
        legalOutcome:
          legalOutcome.trim().length >= 5
            ? legalOutcome
            : "Resolved through formal grievance channel.",
        citizenTakeaway:
          citizenTakeaway.trim().length >= 10
            ? citizenTakeaway
            : "Always preserve written trails and use official helplines within statutory timelines.",
        resolutionStatus,
        statutoryBacking,
        locationState,
        tags,
        identityMode,
        authorDisplayName,
        authorRoleLabel,
        visibility: saveAsDraft ? "private_draft" : visibility,
        saveAsDraft,
        media: mediaAttachments.map((m) => ({
          id: m.id,
          mediaType: m.mediaType,
          fileName: m.fileName,
          mimeType: m.mimeType,
          fileSizeBytes: m.fileSizeBytes,
          url: m.url,
          storagePath: m.storagePath,
          durationSeconds: m.durationSeconds,
          caption: m.caption,
          altText: m.altText,
          posterUrl: m.posterUrl,
          transcript: m.transcript,
        })),
        aiSummary,
        aiEducationalNote,
      });

      if (!res.success) {
        setSubmitError(res.error.message);
        return;
      }

      setPublishedStory(res.data.story);
    });
  };

  const activeLearningBridge =
    aiResult?.learningBridge ||
    DEFAULT_LEARNING_BRIDGES[category] ||
    DEFAULT_LEARNING_BRIDGES.general_awareness;

  if (publishedStory) {
    return (
      <Container size="default" gutter="page">
        <div className="glass-strong border-border/70 mx-auto max-w-3xl rounded-3xl border p-8 text-center shadow-lg">
          <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
          <span className="mt-3 inline-block rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">
            {publishedStory.moderationStatus === "draft"
              ? "SAVED AS PRIVATE DRAFT"
              : publishedStory.moderationStatus === "under_review"
                ? "SUBMITTED FOR PRIVACY & SAFETY REVIEW"
                : "PUBLISHED TO COMMUNITY VOICE & LINKED TO VERIFIED LAW"}
          </span>
          <h1 className="text-foreground mt-4 text-2xl font-bold sm:text-3xl">
            {publishedStory.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Your contribution has been connected to{" "}
            <strong className="text-foreground">
              {publishedStory.learningBridge.legalAreaTitle}
            </strong>{" "}
            so fellow citizens can learn what rights protect them in similar
            situations.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(communityStoryRoute(publishedStory.slug))
              }
              className="bg-gradient-brand text-primary-foreground inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold shadow-sm"
            >
              View Story & Learning Bridge
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => router.push(routes.communityMyStories)}
              className="glass rounded-2xl px-5 py-3 text-xs font-bold"
            >
              Go to My Stories
            </button>
            <button
              type="button"
              onClick={() => router.push(routes.community)}
              className="glass rounded-2xl px-5 py-3 text-xs font-bold"
            >
              Back to Community Hub
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container size="default" gutter="page">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-brand text-xs font-bold tracking-wider uppercase">
              Sprint E10 • Citizen Story & Media Creation Studio
            </span>
            <h1 className="text-foreground mt-1 text-2xl font-bold sm:text-3xl">
              {initialStory
                ? "Edit Your Citizen Story"
                : "Share a Real Situation to Help Another Citizen Learn"}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => handleSaveOrPublish(true)}
            disabled={isPending}
            className="glass hover:border-brand/40 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition"
          >
            <Save className="text-brand size-3.5" />
            Save Private Draft
          </button>
        </div>

        {/* 7-Step Progress Bar */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-7">
          {WIZARD_STEPS.map((s) => {
            const isActive = step === s.number;
            const isDone = step > s.number;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => setStep(s.number)}
                className={`rounded-xl border px-2.5 py-2 text-left text-[11px] font-bold transition ${
                  isActive
                    ? "border-brand bg-brand/15 text-brand"
                    : isDone
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-border/60 bg-background/50 text-muted-foreground"
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>

        {/* Real-Time PII Alert Banner (If Personal Identifiers Detected) */}
        {piiDetection.hasPII && (
          <div className="mt-5 rounded-2xl border border-amber-500/50 bg-amber-500/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-foreground text-xs font-bold">
                    Privacy & Safety Shield: Sensitive Personal Identifiers
                    Detected
                  </p>
                  <ul className="mt-1 space-y-0.5 text-xs text-amber-800 dark:text-amber-200">
                    {piiDetection.warningMessages.map((msg) => (
                      <li key={msg}>• {msg}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutoRedactAllPII}
                className="rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-amber-700"
              >
                Auto-Redact Detected PII Now
              </button>
            </div>
          </div>
        )}

        {submitError && (
          <div className="border-destructive/50 bg-destructive/10 text-destructive mt-4 rounded-2xl border p-4 text-xs font-semibold">
            {submitError}
          </div>
        )}

        {/* Wizard Step Body */}
        <div className="glass-strong border-border/70 mt-6 rounded-3xl border p-6 sm:p-8">
          {/* STEP 1: STORY TYPE & LEGAL CATEGORY */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-lg font-bold">
                  Step 1: Choose Story Type & Legal Domain
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Selecting the right type and category connects your story to
                  the matching verified Indian legal learning path.
                </p>
              </div>

              <div>
                <label className="text-foreground mb-2.5 block text-xs font-bold uppercase tracking-wider">
                  What kind of contribution are you sharing?
                </label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {STORY_TYPES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStoryType(st.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        storyType === st.id
                          ? "border-brand bg-brand/10 shadow-xs"
                          : "border-border/70 bg-background/60 hover:border-brand/40"
                      }`}
                    >
                      <span className="text-brand text-[10px] font-bold uppercase">
                        {st.badgeText}
                      </span>
                      <p className="text-foreground mt-1 text-sm font-bold">
                        {st.label}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {st.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-foreground mb-2.5 block text-xs font-bold uppercase tracking-wider">
                  Which legal domain best fits this situation?
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {COMMUNITY_CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => setCategory(cat.slug)}
                      className={`rounded-2xl border p-3.5 text-left transition ${
                        category === cat.slug
                          ? "border-brand bg-brand/10"
                          : "border-border/70 bg-background/60 hover:border-brand/40"
                      }`}
                    >
                      <p className="text-foreground text-xs font-bold">
                        {cat.label}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-[11px]">
                        {cat.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: WHAT HAPPENED & WARNING SIGNS */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-foreground text-lg font-bold">
                  Step 2: Describe What Happened
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Focus on the timeline, facts, and early warning signs so
                  another citizen can recognize a similar situation early.
                </p>
              </div>

              <div>
                <label className="text-foreground block text-xs font-bold">
                  Story Headline (Clear & Educational) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., How calling 1930 within 25 minutes helped freeze an unauthorized UPI debit"
                  className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <VoiceSituationInput
                  compact
                  onTranscriptConfirmed={(voiceRes) => {
                    setWhatHappened((prev) =>
                      prev.trim()
                        ? `${prev.trim()}\n\n${voiceRes.editedTranscript}`
                        : voiceRes.editedTranscript
                    );
                    if (
                      voiceRes.storagePreference === "audio_and_transcript" &&
                      voiceRes.audioBlobUrl
                    ) {
                      setMediaAttachments((prev) => [
                        ...prev,
                        {
                          id: `voice-${Date.now()}`,
                          storyId: initialStory?.id || "draft",
                          storageBucket: "community-media",
                          sortOrder: prev.length,
                          mediaType: "audio",
                          fileName: `citizen-voice-${voiceRes.language}.webm`,
                          mimeType: "audio/webm",
                          fileSizeBytes: 64000,
                          url: voiceRes.audioBlobUrl!,
                          storagePath: `voice/${Date.now()}.webm`,
                          caption: `Reviewed Citizen Voice Note (${voiceRes.language.toUpperCase()})`,
                          durationSeconds: voiceRes.durationSeconds,
                        },
                      ]);
                    }
                  }}
                />
              </div>

              <div>
                <label className="text-foreground block text-xs font-bold">
                  What Happened? (Chronological Facts) *
                </label>
                <textarea
                  rows={5}
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  placeholder="Describe the sequence of events without sharing private phone numbers, Aadhaar, or bank account numbers..."
                  className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border p-4 text-sm outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-foreground block text-xs font-bold">
                    Early Warning Signs / Red Flags (Optional)
                  </label>
                  <input
                    type="text"
                    value={warningSigns}
                    onChange={(e) => setWarningSigns(e.target.value)}
                    placeholder="What red flag should other citizens watch out for?"
                    className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-foreground block text-xs font-bold">
                    State / Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={locationState}
                    onChange={(e) => setLocationState(e.target.value)}
                    placeholder="e.g., Maharashtra, Karnataka, Delhi, All India"
                    className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ACTION TAKEN, OUTCOME & CITIZEN TAKEAWAY */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-foreground text-lg font-bold">
                  Step 3: Action Taken, Outcome & Citizen Takeaway
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Share the exact steps, portals, or statutory procedures used
                  and what another citizen should remember.
                </p>
              </div>

              <div>
                <label className="text-foreground block text-xs font-bold">
                  What Action Was Taken? *
                </label>
                <textarea
                  rows={4}
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="e.g., Preserved the unboxing video, emailed the Nodal Officer under Rule 5 of E-Commerce Rules, and filed a docket on NCH 1915..."
                  className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border p-3.5 text-sm outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-foreground block text-xs font-bold">
                    Current Status / Legal Outcome *
                  </label>
                  <input
                    type="text"
                    value={legalOutcome}
                    onChange={(e) => setLegalOutcome(e.target.value)}
                    placeholder="e.g., Full refund credited within 6 working days"
                    className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-foreground block text-xs font-bold">
                    Resolution Stage
                  </label>
                  <select
                    value={resolutionStatus}
                    onChange={(e) =>
                      setResolutionStatus(
                        e.target.value as "resolved" | "ongoing" | "mediated"
                      )
                    }
                    className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
                  >
                    <option value="resolved">Resolved</option>
                    <option value="mediated">Mediated Settlement</option>
                    <option value="ongoing">Ongoing Process</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-foreground block text-xs font-bold">
                  Statutory / Helpline Reference (Optional)
                </label>
                <input
                  type="text"
                  value={statutoryBacking}
                  onChange={(e) => setStatutoryBacking(e.target.value)}
                  placeholder="e.g., Consumer Protection Act, 2019 (Sec 2(11)) or BNSS Sec 173 (Zero FIR)"
                  className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-foreground block text-xs font-bold">
                  Key Takeaway for Fellow Citizens *
                </label>
                <textarea
                  rows={3}
                  value={citizenTakeaway}
                  onChange={(e) => setCitizenTakeaway(e.target.value)}
                  placeholder="In 1-2 sentences, what is the single most useful lesson another citizen can learn from your experience?"
                  className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border p-3.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-foreground block text-xs font-bold">
                  Select Relevant Topics / Tags (Up to 5)
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {CONTROLLED_COMMUNITY_TAGS.map((t) => {
                    const selected = tags.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setTags((prev) =>
                            selected
                              ? prev.filter((x) => x !== t)
                              : prev.length < 5
                                ? [...prev, t]
                                : prev
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          selected
                            ? "border-brand bg-brand/15 text-brand font-bold"
                            : "border-border/70 text-muted-foreground"
                        }`}
                      >
                        #{t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MULTI-MEDIA UPLOAD (IMAGE, AUDIO, VIDEO) */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-lg font-bold">
                  Step 4: Attach Redacted Images, Voice Notes, or Video
                  Walkthroughs
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Upload redacted screenshots, a short voice note explaining
                  what happened, or an instructional video clip. Ensure all
                  personal phone numbers, QR codes, and Aadhaar digits are
                  blurred before uploading.
                </p>
              </div>

              {/* Media Type Limits Spec Cards */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="border-border/70 bg-background/60 rounded-2xl border p-3.5">
                  <div className="text-brand flex items-center gap-1.5 text-xs font-bold">
                    <FileImage className="size-4" />
                    Images (JPG, PNG, WEBP)
                  </div>
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    Max {MEDIA_UPLOAD_LIMITS.image.maxSizeLabel}. Ideal for
                    redacted docket acknowledgements or checklists.
                  </p>
                </div>
                <div className="border-border/70 bg-background/60 rounded-2xl border p-3.5">
                  <div className="text-brand flex items-center gap-1.5 text-xs font-bold">
                    <FileAudio className="size-4" />
                    Audio Voice Notes (MP3, WAV, M4A)
                  </div>
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    Max {MEDIA_UPLOAD_LIMITS.audio.maxSizeLabel}. Explain how you
                    navigated the helpline or station desk.
                  </p>
                </div>
                <div className="border-border/70 bg-background/60 rounded-2xl border p-3.5">
                  <div className="text-brand flex items-center gap-1.5 text-xs font-bold">
                    <FileVideo className="size-4" />
                    Video Walkthroughs (MP4, WEBM)
                  </div>
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    Max {MEDIA_UPLOAD_LIMITS.video.maxSizeLabel}. Demonstrate
                    evidence checklists or portal steps.
                  </p>
                </div>
              </div>

              {/* Caption & File Upload Box */}
              <div className="border-brand/40 bg-brand/5 rounded-2xl border border-dashed p-5">
                <label className="text-foreground block text-xs font-bold">
                  Attachment Caption / Accessibility Description (Optional)
                </label>
                <input
                  type="text"
                  value={mediaCaptionInput}
                  onChange={(e) => setMediaCaptionInput(e.target.value)}
                  placeholder="e.g., Redacted 1930 lien confirmation SMS timeline..."
                  className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border px-3.5 py-2 text-xs outline-none"
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <label className="bg-gradient-brand text-primary-foreground inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xs transition hover:opacity-95">
                    <Upload className="size-4" />
                    {isUploadingMedia
                      ? "Validating & Uploading..."
                      : "Select Image, Audio, or Video File"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/mp3,audio/wav,audio/mp4,audio/webm,video/mp4,video/webm"
                      onChange={handleFileChange}
                      disabled={isUploadingMedia}
                      className="hidden"
                    />
                  </label>
                  <span className="text-muted-foreground text-xs">
                    {mediaAttachments.length} of{" "}
                    {MEDIA_UPLOAD_LIMITS.maxAttachmentsPerStory} attachments
                    added
                  </span>
                </div>

                {mediaUploadError && (
                  <p className="text-destructive mt-3 text-xs font-semibold">
                    {mediaUploadError}
                  </p>
                )}
              </div>

              {/* Uploaded Attachments List & Live Media Player Preview */}
              {mediaAttachments.length > 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {mediaAttachments.map((att) => (
                      <div
                        key={att.id}
                        className="border-border/70 bg-background/80 flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5"
                      >
                        <div className="text-xs">
                          <span className="text-brand font-bold uppercase">
                            [{att.mediaType}]
                          </span>{" "}
                          <strong className="text-foreground">
                            {att.fileName}
                          </strong>{" "}
                          <span className="text-muted-foreground">
                            ({formatBytes(att.fileSizeBytes)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(att.id)}
                          className="text-destructive hover:bg-destructive/10 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
                        >
                          <Trash2 className="size-3.5" />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <StoryMediaGallery media={mediaAttachments} />
                </div>
              )}
            </div>
          )}

          {/* STEP 5: AI STORY ASSISTANCE & STORY-TO-LEARNING BRIDGE */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-foreground text-lg font-bold">
                    Step 5: AI Educational Framing & Learning Bridge
                  </h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Generate an explicitly labeled AI Educational Summary and
                    preview the verified legal modules connected to your story.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleRunAIAssistance}
                  className="bg-gradient-brand text-primary-foreground inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xs"
                >
                  <Sparkles className="size-4" />
                  {isPending
                    ? "Synthesizing Grounded Summary..."
                    : "Run AI Educational Assistant"}
                </button>
              </div>

              <div className="border-border/70 bg-background/70 space-y-4 rounded-2xl border p-4">
                <div>
                  <label className="text-brand flex items-center gap-1.5 text-xs font-bold uppercase">
                    <Sparkles className="size-3.5" />
                    Labeled AI Summary (Editable • Displayed Alongside Original
                    Story)
                  </label>
                  <textarea
                    rows={3}
                    value={aiSummary}
                    onChange={(e) => setAiSummary(e.target.value)}
                    placeholder="Click 'Run AI Educational Assistant' above or write a concise 2-sentence educational summary..."
                    className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border p-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-foreground block text-xs font-bold">
                    Educational Statutory Context Note
                  </label>
                  <textarea
                    rows={2}
                    value={aiEducationalNote}
                    onChange={(e) => setAiEducationalNote(e.target.value)}
                    placeholder="Educational Context (Not Legal Advice): Connects story to the relevant statutory framework..."
                    className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border p-3 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Preview of the Connected Learning Bridge */}
              <StoryLearningBridge
                bridge={activeLearningBridge}
                storyTitle={title}
              />
            </div>
          )}

          {/* STEP 6: PRIVACY, IDENTITY MODE & VISIBILITY */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-lg font-bold">
                  Step 6: Choose Your Identity Mode & Visibility
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  You control how your name appears to the community and who can
                  access this story.
                </p>
              </div>

              {/* Identity Mode Selector */}
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    {
                      id: "pseudonym",
                      title: "Pseudonym (Recommended)",
                      desc: "Displays a protective initials/first-name alias (e.g., 'Aarav K. (Pseudonym)').",
                    },
                    {
                      id: "anonymous",
                      title: "Fully Anonymous",
                      desc: "Displays 'Citizen Contributor (Anonymous)' with zero personal identifiers.",
                    },
                    {
                      id: "real_name",
                      title: "Verified Display Name",
                      desc: "Publishes under your chosen citizen display name and role.",
                    },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setIdentityMode(mode.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      identityMode === mode.id
                        ? "border-brand bg-brand/10"
                        : "border-border/70 bg-background/60"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="text-brand size-4" />
                      <span className="text-foreground text-xs font-bold">
                        {mode.title}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1.5 text-[11px] leading-relaxed">
                      {mode.desc}
                    </p>
                  </button>
                ))}
              </div>

              {identityMode !== "anonymous" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-foreground block text-xs font-bold">
                      Display Name / Alias
                    </label>
                    <input
                      type="text"
                      value={authorDisplayName}
                      onChange={(e) => setAuthorDisplayName(e.target.value)}
                      className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-foreground block text-xs font-bold">
                      Role / Context Descriptor
                    </label>
                    <input
                      type="text"
                      value={authorRoleLabel}
                      onChange={(e) => setAuthorRoleLabel(e.target.value)}
                      placeholder="e.g., Commuter • Chennai or Tenant • Pune"
                      className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Visibility Selector */}
              <div>
                <label className="text-foreground mb-2 block text-xs font-bold uppercase tracking-wider">
                  Story Visibility Level
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      {
                        id: "public",
                        label: "Public Community & Search",
                        desc: "Visible on /community and indexed in Nyaya Unified Search.",
                        icon: Eye,
                      },
                      {
                        id: "community_only",
                        label: "Community Hub Only",
                        desc: "Visible inside the Community Hub feed, excluded from global search.",
                        icon: ShieldCheck,
                      },
                      {
                        id: "unlisted",
                        label: "Unlisted (Direct Link Only)",
                        desc: "Accessible only to people with the direct story link.",
                        icon: Lock,
                      },
                      {
                        id: "private_draft",
                        label: "Private Draft",
                        desc: "Visible only to you inside My Stories.",
                        icon: Save,
                      },
                    ] as const
                  ).map((vis) => {
                    const Icon = vis.icon;
                    return (
                      <button
                        key={vis.id}
                        type="button"
                        onClick={() => setVisibility(vis.id)}
                        className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
                          visibility === vis.id
                            ? "border-brand bg-brand/10"
                            : "border-border/70 bg-background/60"
                        }`}
                      >
                        <Icon className="text-brand mt-0.5 size-4 shrink-0" />
                        <div>
                          <p className="text-foreground text-xs font-bold">
                            {vis.label}
                          </p>
                          <p className="text-muted-foreground mt-0.5 text-[11px]">
                            {vis.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: FINAL REVIEW & SUBMIT */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-lg font-bold">
                  Step 7: Final Review & Publish
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Verify how your story, media attachments, and verified legal
                  learning bridge will appear to fellow citizens.
                </p>
              </div>

              <div className="border-border/70 bg-background/70 space-y-4 rounded-2xl border p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="bg-brand/15 text-brand rounded-full px-3 py-1 text-xs font-bold">
                    {category.toUpperCase()} • {storyType.toUpperCase()}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Identity: <strong>{identityMode}</strong> • Visibility:{" "}
                    <strong>{visibility}</strong>
                  </span>
                </div>

                <h3 className="text-foreground text-xl font-bold">
                  {title || "Untitled Citizen Story"}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {whatHappened || "No narrative entered yet."}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="bg-brand/5 rounded-xl p-3 text-xs">
                    <strong className="text-brand block">Action Taken:</strong>
                    <span className="text-muted-foreground">
                      {actionTaken || "Not specified"}
                    </span>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 p-3 text-xs">
                    <strong className="block text-emerald-600 dark:text-emerald-400">
                      Citizen Takeaway:
                    </strong>
                    <span className="text-muted-foreground">
                      {citizenTakeaway || "Not specified"}
                    </span>
                  </div>
                </div>

                {mediaAttachments.length > 0 && (
                  <StoryMediaGallery media={mediaAttachments} compact />
                )}
              </div>

              <div className="border-border/70 bg-background/80 flex items-start gap-3 rounded-2xl border p-4 text-xs">
                <ShieldAlert className="text-brand mt-0.5 size-5 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">
                    Nyaya Community Pledge:
                  </strong>{" "}
                  I confirm this story shares an educational civic experience,
                  does not expose third-party private phone/Aadhaar numbers, and
                  is shared for legal awareness—not as a substitute for formal
                  legal representation.
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSaveOrPublish(true)}
                  className="glass inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold"
                >
                  <Save className="size-4" />
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSaveOrPublish(false)}
                  className="bg-gradient-brand text-primary-foreground inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold shadow-md transition hover:opacity-95"
                >
                  <Send className="size-4" />
                  {isPending
                    ? "Publishing Story..."
                    : initialStory
                      ? "Save Changes & Re-Verify"
                      : "Publish Citizen Story"}
                </button>
              </div>
            </div>
          )}

          {/* Step Footer Navigation */}
          <div className="border-border/60 mt-8 flex items-center justify-between border-t pt-5">
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              disabled={step === 1}
              className="glass inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold disabled:opacity-40"
            >
              <ArrowLeft className="size-3.5" />
              Previous Step
            </button>

            <span className="text-muted-foreground text-xs font-medium">
              Step {step} of {WIZARD_STEPS.length}
            </span>

            {step < WIZARD_STEPS.length ? (
              <button
                type="button"
                onClick={() =>
                  setStep((prev) => Math.min(WIZARD_STEPS.length, prev + 1))
                }
                className="bg-gradient-brand text-primary-foreground inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold"
              >
                Next Step
                <ArrowRight className="size-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Container>
  );
}
