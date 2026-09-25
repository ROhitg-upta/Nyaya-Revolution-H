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
  | "legal-aid-checklist-v1"
  | "lok-adalat-prep-brief-v1";

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

// ============================================================================
// SPRINT E12: LIVE SPEECH PROVIDERS (BHASHINI ULCA + GEMINI AUDIO + TTS)
// ============================================================================

export type ActiveSpeechProviderId =
  | "bhashini_ulca"
  | "gemini_audio"
  | "browser_web_speech"
  | "text_fallback";

export interface LiveSpeechTranscriptionResult {
  transcript: string;
  requestedLanguage: SupportedCitizenLanguage;
  detectedLanguage: SupportedCitizenLanguage;
  providerLanguageCode: string;
  languageScript: string;
  confidence: number;
  provider: ActiveSpeechProviderId;
  fallbackUsed: boolean;
  latencyMs: number;
  createdAt: string;
}

export interface TextToSpeechSynthesisInput {
  text: string;
  language: SupportedCitizenLanguage;
  voiceGender?: "female" | "male";
}

export interface TextToSpeechAudioResult {
  ok: boolean;
  audioBase64: string | null;
  mimeType: string;
  provider: ActiveSpeechProviderId;
  languageCode: string;
  fallbackToBrowserTts: boolean;
  errorReason?: string;
}

export interface TextToSpeechProvider {
  readonly name: string;
  synthesize(input: TextToSpeechSynthesisInput): Promise<TextToSpeechAudioResult>;
}

// ============================================================================
// SPRINT E12: SOURCE-DRIVEN DLSA / SLSA DIRECTORY & GEO-LOCATOR
// ============================================================================

export type LegalAuthorityTier = "NALSA" | "SLSA" | "DLSA" | "TLSC" | "HCLSC";

export type AuthorityVerificationLifecycleState =
  | "new"
  | "needs_review"
  | "verified"
  | "published"
  | "review_due"
  | "stale"
  | "conflicted"
  | "archived";

export interface AuthorityConflictMetadata {
  conflictStatus: "none" | "conflicted" | "resolved";
  sourceA?: {
    sourceUrl: string;
    valueSummary: string;
    checkedAt: string;
  };
  sourceB?: {
    sourceUrl: string;
    valueSummary: string;
    checkedAt: string;
  };
  reviewRequired: boolean;
  notes?: string;
}

export interface LegalServiceAuthorityRecord {
  id: string;
  slug: string;
  authorityType: LegalAuthorityTier;
  state: string;
  district: string | null;
  talukOrLocalOffice?: string | null;
  officeName: string;
  contact: {
    phone: string | null;
    helpline: string | null;
    email: string | null;
  };
  address: string | null;
  website: string | null;
  jurisdiction: string;
  services: string[];
  issueCategories: string[];
  languagesSupported: SupportedCitizenLanguage[];
  sourceUrl: string;
  sourceType: "nalsa_portal" | "official_slsa_directory" | "ecourts_district_portal";
  verificationStatus: AuthorityVerificationLifecycleState;
  lastVerifiedAt: string;
  staleAfterDays: number;
  conflictMetadata?: AuthorityConflictMetadata;
  isPublished: boolean;
}

export interface RankedDlsaAuthority extends LegalServiceAuthorityRecord {
  matchScore: number;
  matchTier: "exact_district" | "state_slsa" | "national_nalsa";
  matchReasons: string[];
  isStale: boolean;
}

export interface PincodeJurisdictionResult {
  validFormat: boolean;
  pincode: string;
  resolvedState: string | null;
  primaryDistrict: string | null;
  candidateDistricts: string[];
  isAmbiguous: boolean;
  resolutionConfidence: "exact_district_prefix" | "state_postal_circle" | "unknown";
  explanationNote: string;
}

// ============================================================================
// SPRINT E12: LOK ADALAT EDUCATIONAL SIMULATOR
// ============================================================================

export type LokAdalatDisputeCategory =
  | "public_utility_electricity_water_telecom"
  | "motor_accident_claim_mact"
  | "banking_loan_recovery_negotiable_instrument"
  | "consumer_service_refund_dispute"
  | "tenancy_rent_or_workplace_dues"
  | "matrimonial_family_compoundable"
  | "non_compoundable_criminal_offence"
  | "urgent_safety_or_cyber_freeze";

export type LokAdalatCourtStage =
  | "pre_litigation_no_case_filed"
  | "pending_in_court"
  | "unsure";

export type LokAdalatSettlementCapability =
  | "capable_of_mutual_compromise"
  | "requires_criminal_prosecution_or_injunction"
  | "unsure";

export type LokAdalatWillingness =
  | "both_open_to_settlement"
  | "citizen_wants_dlsa_conciliation_notice"
  | "no_willingness_to_settle"
  | "unsure";

export interface LokAdalatSimulatorInput {
  disputeCategory: LokAdalatDisputeCategory;
  courtStage: LokAdalatCourtStage;
  settlementCapability: LokAdalatSettlementCapability;
  willingness: LokAdalatWillingness;
  state?: string;
  district?: string;
  situationSummary?: string;
}

export interface LokAdalatReadinessItem {
  id: string;
  category:
    | "Basic facts"
    | "Parties involved"
    | "Relevant documents"
    | "Existing case information"
    | "Contact details"
    | "Important dates"
    | "Previous communications"
    | "Desired resolution";
  title: string;
  description: string;
  requiredForBrief: boolean;
}

export interface LokAdalatSimulatorOutput {
  headline: string;
  relevanceSignal:
    | "commonly_explored_in_lok_adalat"
    | "depends_on_compoundability_and_consent"
    | "not_typical_for_lok_adalat";
  whatLokAdalatMeans: string;
  whatSettlementMeans: string;
  statutoryBasis: {
    provision: string;
    summary: string;
    sourceUrl: string;
  }[];
  whyThisPathwayAppears: string[];
  whenNotAppropriate: string[];
  questionsToAskDlsaOrLawyer: string[];
  readinessChecklist: LokAdalatReadinessItem[];
  mandatoryEducationalDisclaimer: string;
}

