/**
 * SPRINT E11 — MULTILINGUAL VOICE, VERIFIED LEGAL AID & CITIZEN ACTION ENGINE
 * Unified Domain Types & Provider Contracts
 */

import type { CommunityCategorySlug } from "./community";

export type SupportedCitizenLanguage =
  | "en"
  | "hi"
  | "hinglish"
  | "ta"
  | "te"
  | "bn"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "pa";

export type VoiceRecordingLifecycleState =
  | "idle"
  | "recording"
  | "paused"
  | "stopping"
  | "processing"
  | "transcribing"
  | "complete"
  | "error";

export type VoiceRecordingState = VoiceRecordingLifecycleState;

export type VoiceStoragePreference =
  | "transcript_only"
  | "audio_and_transcript";

export type AudioRetentionMode = "transcript_only" | "story_attachment";

export interface LanguageDetectionProvider {
  detectLanguage(text: string): Promise<{
    language: SupportedCitizenLanguage;
    script: string;
    confidence: number;
  }>;
}

export interface TranslationProvider {
  normalizeAndTranslate(params: {
    text: string;
    sourceLanguage: SupportedCitizenLanguage;
    targetLanguage: SupportedCitizenLanguage;
  }): Promise<{
    normalizedText: string;
    translatedText: string;
    matchedTerms: Array<{
      originalPhrase: string;
      normalizedEnglishTerm: string;
      legalDomain: string;
      relatedProvision?: string;
    }>;
  }>;
}

export interface SpeechToTextProvider {
  readonly name: string;
  transcribeAudio(params: {
    audioBase64?: string;
    mimeType: string;
    languageHint?: SupportedCitizenLanguage;
    browserTranscript?: string;
  }): Promise<{
    transcript: string;
    detectedLanguage: SupportedCitizenLanguage;
    confidence: number;
  }>;
}

export interface VoiceTranscriptRecord {
  id: string;
  userId: string;
  audioStoragePath: string | null;
  rawTranscript: string;
  editedTranscript: string;
  detectedLanguage: SupportedCitizenLanguage;
  languageScript: string;
  normalizedTranslation: string;
  durationSeconds: number;
  storagePreference: VoiceStoragePreference;
  userReviewed: boolean;
  piiRedacted: boolean;
  linkedStoryId: string | null;
  createdAt: string;
}

export interface MultilingualUnderstandingResult {
  originalText: string;
  detectedLanguage: SupportedCitizenLanguage;
  languageScript: string;
  confidence: number;
  normalizedEnglishText: string;
  matchedLegalTerms: Array<{
    originalPhrase: string;
    normalizedEnglishTerm: string;
    legalDomain: string;
    relatedProvision?: string;
  }>;
  primaryCategory: string;
  secondaryCategories: string[];
  detectedJurisdictionScope: "central" | "state" | "district" | "national";
  detectedState: string;
  urgencyLevel: "standard" | "time-sensitive" | "urgent-financial-or-safety";
  plainLanguageExplanation: string;
  recommendedSituationSlugs: string[];
  recommendedLessonSlugs: string[];
  recommendedRightSlugs: string[];
  piiDetected: boolean;
  piiTypes: string[];
}

export type VerifiedResourceType =
  | "legal_aid_authority"
  | "national_helpline"
  | "grievance_portal"
  | "rti_portal"
  | "ombudsman"
  | "cyber_cell"
  | "labour_commission"
  | "legal_aid"
  | "consumer_grievance"
  | "cybercrime_reporting"
  | "government_grievance"
  | "police_complaint_info"
  | "women_child_safety"
  | "labour_grievance"
  | "financial_ombudsman";

export type ResourceVerificationState =
  | "draft"
  | "needs_review"
  | "verified"
  | "published"
  | "stale"
  | "archived";

export interface VerifiedResource {
  id: string;
  slug: string;
  authorityName: string;
  shortName: string;
  resourceType: VerifiedResourceType;
  jurisdictionScope: "central" | "state" | "district" | "national";
  state: string;
  district?: string;
  issueCategories: string[];
  description: string;
  whoCanUse: string;
  eligibilityNotes: string;
  feeNotes: string;
  helplineNumber?: string;
  officialUrl: string;
  languagesSupported: SupportedCitizenLanguage[];
  operatingHours: string;
  jurisdictionWarning?: string;
  howToUseSteps: string[];
  documentsRequired: string[];
  verificationStatus: ResourceVerificationState;
  lastVerifiedAt: string;
  staleAfterDays: number;
  isPublished: boolean;
}

export interface RankedVerifiedResource extends VerifiedResource {
  matchScore: number;
  matchReasons: string[];
}

export type CitizenDocumentTemplateType =
  | "consumer-grievance-v1"
  | "rti-application-v1"
  | "cyber-fraud-incident-v1"
  | "workplace-wage-representation-v1"
  | "legal-aid-checklist-v1";

export type CitizenTemplateVersion = CitizenDocumentTemplateType;

export interface CitizenDocumentTemplateMeta {
  templateType: CitizenDocumentTemplateType;
  templateVersion: string;
  title: string;
  subtitle: string;
  category: string;
  jurisdictionNote: string;
  mandatoryDisclaimers: string[];
}

export interface GeneratedDocumentSection {
  id: string;
  heading: string;
  body: string;
  editable: boolean;
}

export interface DocumentSourceCitation {
  title: string;
  category: string;
  authorityOrProvision: string;
  slug: string;
}

export interface GeneratedCitizenDocument {
  id: string;
  userId: string;
  templateType: CitizenDocumentTemplateType;
  templateVersion: string;
  title: string;
  language: SupportedCitizenLanguage;
  jurisdictionState: string;
  jurisdictionAuthority: string;
  statusLabel: "Draft / Educational Template / User-Review Required";
  userReviewed: boolean;
  inputFacts: {
    situationSummary: string;
    citizenName: string;
    citizenCityState: string;
    counterpartyOrAuthorityName: string;
    incidentDate: string;
    amountOrReferenceInvolved: string;
    reliefSought: string;
  };
  generatedSections: GeneratedDocumentSection[];
  sourceCitations: DocumentSourceCitation[];
  safetyDisclaimer: string;
  createdAt: string;
  updatedAt: string;
}

export interface TerminologyMapping {
  sourceTerm: string;
  canonicalEnglishTerm: string;
  statutoryConcept: string;
  plainExplanation: string;
}

export interface CitizenDocumentTemplateSpec {
  documentType: string;
  templateVersion: CitizenTemplateVersion;
  title: string;
  subtitle: string;
  category: CommunityCategorySlug | string;
  officialPortalToPrefer: {
    name: string;
    url: string;
    helpline?: string;
    jurisdictionNote: string;
  };
  statutorySources: {
    title: string;
    reference: string;
  }[];
}
