"use server";

import {
  deleteCitizenDocumentDraft,
  generateCitizenDocumentDraft,
  getRankedVerifiedResources,
  updateCitizenDocumentDraft,
} from "@/services/action/citizen-action.service";
import {
  analyzeMultilingualCitizenSituation,
  saveVoiceTranscriptRecord,
} from "@/services/voice/multilingual-voice.service";
import type {
  CitizenDocumentTemplateType,
  GeneratedCitizenDocument,
  GeneratedDocumentSection,
  MultilingualUnderstandingResult,
  RankedVerifiedResource,
  SupportedCitizenLanguage,
  VoiceStoragePreference,
  VoiceTranscriptRecord,
} from "@/types/action-engine";

// Lightweight in-memory rate-limit bucket per session key
const actionRateMap = new Map<string, { count: number; resetAt: number }>();

function checkActionRateLimit(key: string, maxRequests = 25, windowMs = 60_000): boolean {
  const now = Date.now();
  const existing = actionRateMap.get(key);
  if (!existing || now > existing.resetAt) {
    actionRateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= maxRequests) {
    return false;
  }
  existing.count += 1;
  return true;
}

export async function analyzeCitizenVoiceOrTextAction(params: {
  rawInput: string;
  languageHint?: SupportedCitizenLanguage;
  stateJurisdiction?: string;
}): Promise<{
  ok: boolean;
  error?: string;
  understanding?: MultilingualUnderstandingResult;
  recommendedResources?: RankedVerifiedResource[];
}> {
  if (!checkActionRateLimit("multilingual-analyze", 30, 60_000)) {
    return {
      ok: false,
      error: "Too many requests. Please wait a moment and try again.",
    };
  }

  const trimmed = (params.rawInput ?? "").trim();
  if (trimmed.length < 4) {
    return {
      ok: false,
      error: "Please describe or speak at least a short sentence about what happened.",
    };
  }

  const understanding = await analyzeMultilingualCitizenSituation({
    rawInput: trimmed,
    languageHint: params.languageHint,
    stateJurisdiction: params.stateJurisdiction,
  });

  const recommendedResources = await getRankedVerifiedResources({
    category: understanding.primaryCategory,
    secondaryCategories: understanding.secondaryCategories,
    state: params.stateJurisdiction ?? understanding.detectedState ?? "All India",
    language: understanding.detectedLanguage,
  });

  return {
    ok: true,
    understanding,
    recommendedResources: recommendedResources.slice(0, 6),
  };
}

export async function saveVoiceTranscriptAction(params: {
  rawTranscript: string;
  editedTranscript: string;
  detectedLanguage: SupportedCitizenLanguage;
  languageScript: string;
  normalizedTranslation: string;
  durationSeconds: number;
  storagePreference: VoiceStoragePreference;
  audioStoragePath?: string | null;
  linkedStoryId?: string | null;
}): Promise<{
  ok: boolean;
  record?: VoiceTranscriptRecord;
  error?: string;
}> {
  if (!checkActionRateLimit("voice-save", 20, 60_000)) {
    return { ok: false, error: "Rate limit exceeded for voice transcript storage." };
  }

  const record = await saveVoiceTranscriptRecord(params);
  return { ok: true, record };
}

export async function searchVerifiedResourcesAction(params: {
  category?: string;
  state?: string;
  language?: SupportedCitizenLanguage;
  query?: string;
}): Promise<{
  ok: boolean;
  resources: RankedVerifiedResource[];
}> {
  const resources = await getRankedVerifiedResources({
    category: params.category,
    state: params.state,
    language: params.language,
    query: params.query,
    includeAllIfNoFilter: true,
  });

  return {
    ok: true,
    resources,
  };
}

export async function generateCitizenActionDraftAction(params: {
  templateType: CitizenDocumentTemplateType;
  situationSummary: string;
  citizenName?: string;
  citizenCityState?: string;
  counterpartyOrAuthorityName?: string;
  incidentDate?: string;
  amountOrReferenceInvolved?: string;
  reliefSought?: string;
  language?: SupportedCitizenLanguage;
}): Promise<{
  ok: boolean;
  document?: GeneratedCitizenDocument;
  error?: string;
}> {
  if (!checkActionRateLimit("doc-generate", 15, 60_000)) {
    return {
      ok: false,
      error: "Rate limit reached for document generation. Please wait 1 minute.",
    };
  }

  if (!params.situationSummary || params.situationSummary.trim().length < 5) {
    return {
      ok: false,
      error: "Please provide a brief summary of what happened so we can structure your draft.",
    };
  }

  const document = await generateCitizenDocumentDraft(params);
  return {
    ok: true,
    document,
  };
}

export async function updateCitizenActionDraftAction(params: {
  documentId: string;
  title: string;
  generatedSections: GeneratedDocumentSection[];
  userReviewed: boolean;
}): Promise<{
  ok: boolean;
  updatedAt?: string;
}> {
  const res = await updateCitizenDocumentDraft(params);
  return { ok: res.ok, updatedAt: res.updatedAt };
}

export async function deleteCitizenActionDraftAction(
  documentId: string
): Promise<{ ok: boolean }> {
  return deleteCitizenDocumentDraft(documentId);
}
