"use server";

import {
  deleteCitizenDocumentDraft,
  generateCitizenDocumentDraft,
  getRankedVerifiedResources,
  updateCitizenDocumentDraft,
} from "@/services/action/citizen-action.service";
import { evaluateLokAdalatEducationalPathway } from "@/services/action/lok-adalat-simulator.service";
import {
  findRankedDlsaAuthorities,
  resolveCoordinatesToJurisdiction,
} from "@/services/dlsa/dlsa-locator.service";
import {
  analyzeMultilingualCitizenSituation,
  NyayaSpeechToTextProvider,
  NyayaTextToSpeechProvider,
  saveVoiceTranscriptRecord,
} from "@/services/voice/multilingual-voice.service";
import type {
  CitizenDocumentTemplateType,
  GeneratedCitizenDocument,
  GeneratedDocumentSection,
  LiveSpeechTranscriptionResult,
  LokAdalatSimulatorInput,
  LokAdalatSimulatorOutput,
  MultilingualUnderstandingResult,
  PincodeJurisdictionResult,
  RankedDlsaAuthority,
  RankedVerifiedResource,
  SupportedCitizenLanguage,
  TextToSpeechAudioResult,
  VoiceStoragePreference,
  VoiceTranscriptRecord,
} from "@/types/action-engine";

const speechProvider = new NyayaSpeechToTextProvider();
const ttsProvider = new NyayaTextToSpeechProvider();

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

export async function transcribeLiveVoiceAction(params: {
  audioBase64?: string;
  mimeType: string;
  languageHint?: SupportedCitizenLanguage;
  browserTranscript?: string;
}): Promise<{
  ok: boolean;
  result?: LiveSpeechTranscriptionResult;
  error?: string;
}> {
  if (!checkActionRateLimit("voice-stt", 20, 60_000)) {
    return {
      ok: false,
      error: "Voice transcription rate limit reached. Please wait a moment or type your situation.",
    };
  }

  const result = await speechProvider.transcribeLive(params);
  return { ok: true, result };
}

export async function synthesizeEducationalTtsAction(params: {
  text: string;
  language: SupportedCitizenLanguage;
}): Promise<TextToSpeechAudioResult> {
  if (!checkActionRateLimit("voice-tts", 25, 60_000)) {
    return {
      ok: false,
      audioBase64: null,
      mimeType: "audio/wav",
      provider: "browser_web_speech",
      languageCode: "en-IN",
      fallbackToBrowserTts: true,
      errorReason: "Rate limit reached for server TTS; using browser readback.",
    };
  }

  return ttsProvider.synthesize({
    text: params.text,
    language: params.language,
  });
}

export async function analyzeCitizenVoiceOrTextAction(params: {
  rawInput: string;
  languageHint?: SupportedCitizenLanguage;
  stateJurisdiction?: string;
  districtJurisdiction?: string;
}): Promise<{
  ok: boolean;
  error?: string;
  understanding?: MultilingualUnderstandingResult;
  recommendedResources?: RankedVerifiedResource[];
  recommendedDlsaAuthorities?: RankedDlsaAuthority[];
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

  const targetState =
    params.stateJurisdiction ?? understanding.detectedState ?? "All India";

  const recommendedResources = await getRankedVerifiedResources({
    category: understanding.primaryCategory,
    secondaryCategories: understanding.secondaryCategories,
    state: targetState,
    language: understanding.detectedLanguage,
  });

  const dlsaLookup = findRankedDlsaAuthorities({
    state: targetState,
    district: params.districtJurisdiction,
    issueCategory: understanding.primaryCategory,
    language: understanding.detectedLanguage,
  });

  return {
    ok: true,
    understanding,
    recommendedResources: recommendedResources.slice(0, 6),
    recommendedDlsaAuthorities: dlsaLookup.authorities.slice(0, 4),
  };
}

export async function findLocalDlsaAuthoritiesAction(params: {
  state?: string;
  district?: string | null;
  pincode?: string;
  issueCategory?: string;
  language?: SupportedCitizenLanguage;
  ephemeralCoordinates?: {
    latitude: number;
    longitude: number;
  } | null;
}): Promise<{
  ok: boolean;
  authorities: RankedDlsaAuthority[];
  pincodeResolution: PincodeJurisdictionResult | null;
  derivedJurisdiction: {
    state: string;
    district: string | null;
    privacyNote?: string;
  } | null;
  exactDistrictFound: boolean;
}> {
  let effectiveState = params.state ?? "All India";
  let effectiveDistrict = params.district ?? null;
  let derivedJurisdiction: {
    state: string;
    district: string | null;
    privacyNote?: string;
  } | null = null;

  // Ephemeral coordinate resolution: derive district/state and immediately discard coordinates
  if (params.ephemeralCoordinates) {
    const geo = resolveCoordinatesToJurisdiction({
      latitude: params.ephemeralCoordinates.latitude,
      longitude: params.ephemeralCoordinates.longitude,
    });
    if (geo.matched) {
      effectiveState = geo.state;
      effectiveDistrict = geo.district;
    }
    derivedJurisdiction = {
      state: geo.state,
      district: geo.district,
      privacyNote: geo.privacyNote,
    };
  }

  const lookup = findRankedDlsaAuthorities({
    state: effectiveState,
    district: effectiveDistrict,
    pincode: params.pincode,
    issueCategory: params.issueCategory,
    language: params.language,
  });

  if (lookup.pincodeResolution?.resolvedState && !derivedJurisdiction) {
    derivedJurisdiction = {
      state: lookup.pincodeResolution.resolvedState,
      district: lookup.pincodeResolution.primaryDistrict,
      privacyNote: lookup.pincodeResolution.explanationNote,
    };
  } else if (effectiveState !== "All India" && !derivedJurisdiction) {
    derivedJurisdiction = {
      state: effectiveState,
      district: effectiveDistrict,
    };
  }

  return {
    ok: true,
    authorities: lookup.authorities,
    pincodeResolution: lookup.pincodeResolution,
    derivedJurisdiction,
    exactDistrictFound: lookup.exactDistrictFound,
  };
}

export async function evaluateLokAdalatSimulatorAction(
  input: LokAdalatSimulatorInput
): Promise<{
  ok: boolean;
  output: LokAdalatSimulatorOutput;
}> {
  const output = evaluateLokAdalatEducationalPathway(input);
  return { ok: true, output };
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

