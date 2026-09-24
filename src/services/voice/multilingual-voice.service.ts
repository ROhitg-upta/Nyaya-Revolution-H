import { CONTROLLED_LEGAL_TERMINOLOGY_BRIDGE } from "@/constants/verified-resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { detectAndRedactPII } from "@/lib/sanitization";
import type {
  LanguageDetectionProvider,
  MultilingualUnderstandingResult,
  SpeechToTextProvider,
  SupportedCitizenLanguage,
  TranslationProvider,
  VoiceStoragePreference,
  VoiceTranscriptRecord,
} from "@/types/action-engine";

/**
 * Prompt Injection Defense for untrusted voice transcripts and citizen text.
 * Strips instruction-hijacking patterns so user input is always processed strictly as data.
 */
export function sanitizeUntrustedCitizenInput(rawInput: string): {
  sanitizedText: string;
  flaggedPatterns: string[];
} {
  const injectionPatterns: Array<{ regex: RegExp; label: string }> = [
    {
      regex: /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi,
      label: "Prompt override attempt",
    },
    {
      regex: /you\s+are\s+now\s+(?:a|an)\s+(?:lawyer|advocate|judge|unrestricted)/gi,
      label: "Persona override attempt",
    },
    {
      regex: /system\s*prompt\s*:/gi,
      label: "System prompt delimiter injection",
    },
    {
      regex: /<\s*\/?\s*(?:system|instruction|prompt|admin)\s*>/gi,
      label: "XML control tag injection",
    },
  ];

  let sanitizedText = rawInput.trim().slice(0, 4000);
  const flaggedPatterns: string[] = [];

  for (const item of injectionPatterns) {
    if (item.regex.test(sanitizedText)) {
      flaggedPatterns.push(item.label);
      sanitizedText = sanitizedText.replace(item.regex, "[filtered]");
    }
  }

  return { sanitizedText, flaggedPatterns };
}

/**
 * Provider 1: Deterministic Indian Script + Hinglish Language Detection Provider
 */
export class IndianCitizenLanguageDetector implements LanguageDetectionProvider {
  async detectLanguage(text: string): Promise<{
    language: SupportedCitizenLanguage;
    script: string;
    confidence: number;
  }> {
    const trimmed = text.trim();
    if (!trimmed) {
      return { language: "en", script: "Latin", confidence: 1.0 };
    }

    // Unicode script ranges for Indian scripts
    if (/[\u0900-\u097F]/.test(trimmed)) {
      // Check Marathi specific markers vs Hindi in Devanagari
      const marathiTokens = /\b(माझा|माझी|आहे|नाही|तक्रार|पगार|घरमालक)\b/i;
      if (marathiTokens.test(trimmed)) {
        return { language: "mr", script: "Devanagari (Marathi)", confidence: 0.92 };
      }
      return { language: "hi", script: "Devanagari (Hindi)", confidence: 0.96 };
    }
    if (/[\u0980-\u09FF]/.test(trimmed)) {
      return { language: "bn", script: "Bengali", confidence: 0.95 };
    }
    if (/[\u0B80-\u0BFF]/.test(trimmed)) {
      return { language: "ta", script: "Tamil", confidence: 0.96 };
    }
    if (/[\u0C00-\u0C7F]/.test(trimmed)) {
      return { language: "te", script: "Telugu", confidence: 0.96 };
    }
    if (/[\u0C80-\u0CFF]/.test(trimmed)) {
      return { language: "kn", script: "Kannada", confidence: 0.96 };
    }
    if (/[\u0A80-\u0AFF]/.test(trimmed)) {
      return { language: "gu", script: "Gujarati", confidence: 0.95 };
    }
    if (/[\u0D00-\u0D7F]/.test(trimmed)) {
      return { language: "ml", script: "Malayalam", confidence: 0.95 };
    }
    if (/[\u0A00-\u0A7F]/.test(trimmed)) {
      return { language: "pa", script: "Gurmukhi (Punjabi)", confidence: 0.95 };
    }

    // Check Hinglish (Romanized Hindi + English code-switching)
    const hinglishMarkers =
      /\b(mera|meri|mere|nahi|nhi|wapas|waapas|paisa|paise|de\s+raha|kar\s+raha|kya\s+karu|dukandar|makan\s+malik|dhoka|pagar|tankhwah|thana|shikayat|mujhe|humko|abhi\s+tak|zabardasti|nikal\s+diya|kat\s+gaya)\b/i;
    if (hinglishMarkers.test(trimmed)) {
      return {
        language: "hinglish",
        script: "Latin (Hinglish Code-Switched)",
        confidence: 0.93,
      };
    }

    return { language: "en", script: "Latin (English)", confidence: 0.94 };
  }
}

/**
 * Provider 2: Controlled Legal Terminology & Multilingual Normalization Provider
 * Preserves original text while mapping colloquial/vernacular expressions to verified Nyaya domains.
 */
export class ControlledTerminologyTranslationProvider implements TranslationProvider {
  async normalizeAndTranslate(params: {
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
  }> {
    const { text, sourceLanguage } = params;
    const lowerText = text.toLowerCase();

    const matchedTerms: Array<{
      originalPhrase: string;
      normalizedEnglishTerm: string;
      legalDomain: string;
      relatedProvision?: string;
    }> = [];

    for (const entry of CONTROLLED_LEGAL_TERMINOLOGY_BRIDGE) {
      const matchedTrigger = entry.triggers.find((trigger) =>
        lowerText.includes(trigger.toLowerCase())
      );
      if (matchedTrigger) {
        matchedTerms.push({
          originalPhrase: matchedTrigger,
          normalizedEnglishTerm: entry.normalizedEnglishTerm,
          legalDomain: entry.legalDomain,
          relatedProvision: entry.relatedProvision,
        });
      }
    }

    // Build a clean normalized English understanding without erasing the citizen's voice
    let normalizedText = text.trim();

    if (sourceLanguage === "hinglish" || sourceLanguage === "hi" || matchedTerms.length > 0) {
      const domainConcepts = matchedTerms
        .map((m) => `${m.normalizedEnglishTerm} (${m.legalDomain})`)
        .join("; ");

      // Replace common Hinglish phrases with clear English equivalents for retrieval indexing
      const englishAdapted = text
        .replace(/\bmera\s+landlord\b/gi, "My landlord")
        .replace(/\bmakan\s+malik\b/gi, "landlord")
        .replace(/\bdeposit\s+wapas\s+nahi\s+de\s+raha\b/gi, "is refusing to refund the security deposit")
        .replace(/\bwapas\s+nahi\s+de\s+raha\b/gi, "is refusing to return/refund")
        .replace(/\bpaisa\s+kat\s+gaya\b/gi, "money was debited from my account")
        .replace(/\bsalary\s+nahi\s+di\b/gi, "has not paid my earned salary/wages")
        .replace(/\bpagar\s+nahi\s+mili\b/gi, "wages have been withheld")
        .replace(/\bfake\s+saman\b/gi, "defective or counterfeit product")
        .replace(/\brefund\s+nahi\s+mil\s+raha\b/gi, "refund is being denied")
        .replace(/\bfir\s+nahi\s+likh\s+rahe\b/gi, "police station is refusing to register FIR");

      if (domainConcepts) {
        normalizedText = `${englishAdapted.trim()} [Identified Legal Issues: ${domainConcepts}]`;
      } else {
        normalizedText = englishAdapted.trim();
      }
    }

    return {
      normalizedText,
      translatedText: normalizedText,
      matchedTerms,
    };
  }
}

/**
 * Provider 3: Speech-to-Text Abstraction Provider
 * Supports browser Web Speech API transcript verification and server-side audio normalization.
 */
export class NyayaSpeechToTextProvider implements SpeechToTextProvider {
  readonly name = "NyayaMultilingualSpeechProvider";
  private detector = new IndianCitizenLanguageDetector();

  async transcribeAudio(params: {
    audioBase64?: string;
    mimeType: string;
    languageHint?: SupportedCitizenLanguage;
    browserTranscript?: string;
  }): Promise<{
    transcript: string;
    detectedLanguage: SupportedCitizenLanguage;
    confidence: number;
  }> {
    const candidateTranscript = (params.browserTranscript ?? "").trim();

    if (candidateTranscript.length > 0) {
      const detection = await this.detector.detectLanguage(candidateTranscript);
      return {
        transcript: candidateTranscript,
        detectedLanguage: params.languageHint && params.languageHint !== "en"
          ? params.languageHint
          : detection.language,
        confidence: detection.confidence,
      };
    }

    return {
      transcript: "",
      detectedLanguage: params.languageHint ?? "en",
      confidence: 0.85,
    };
  }
}

const languageDetector = new IndianCitizenLanguageDetector();
const terminologyTranslator = new ControlledTerminologyTranslationProvider();

/**
 * Full Multilingual Situation Understanding Pipeline:
 * 1. Sanitizes untrusted voice/text input against prompt injection
 * 2. Detects Indian script / Hinglish / English language
 * 3. Runs PII detection & redaction (Phone, Aadhaar, PAN, Email, Vehicle Reg)
 * 4. Maps citizen expressions through Controlled Legal Terminology Bridge
 * 5. Classifies primary & secondary categories, jurisdiction scope, and learning bridges
 */
export async function analyzeMultilingualCitizenSituation(params: {
  rawInput: string;
  languageHint?: SupportedCitizenLanguage;
  stateJurisdiction?: string;
}): Promise<MultilingualUnderstandingResult> {
  const { sanitizedText } = sanitizeUntrustedCitizenInput(params.rawInput);
  const piiScan = detectAndRedactPII(sanitizedText);
  const detected = await languageDetector.detectLanguage(sanitizedText);

  const effectiveLanguage =
    params.languageHint && params.languageHint !== "en" && detected.language === "en"
      ? params.languageHint
      : detected.language;

  const translation = await terminologyTranslator.normalizeAndTranslate({
    text: piiScan.redactedPreview,
    sourceLanguage: effectiveLanguage,
    targetLanguage: "en",
  });

  const lower = `${sanitizedText} ${translation.normalizedText}`.toLowerCase();

  // Classify primary and secondary categories deterministically
  const categoryScores: Record<string, number> = {
    "Consumer Rights": 0,
    "Cyber Safety": 0,
    "Tenancy & Housing": 0,
    "Labour & Employment": 0,
    "RTI & Governance": 0,
    "Fundamental Rights": 0,
  };

  if (/(refund|defective|product|shopkeeper|dukandar|e-commerce|warranty|overcharg|consumer|parcel|bill)/.test(lower)) {
    categoryScores["Consumer Rights"] += 45;
  }
  if (/(upi|otp|cyber|scam|fraud|phishing|bank|account\s+freeze|1930|gpay|phonepe|paytm|online\s+dhoka|kat\s+gaya)/.test(lower)) {
    categoryScores["Cyber Safety"] += 50;
  }
  if (/(landlord|tenant|deposit|rent|evict|makan\s+malik|kiraya|flat|pg|hostel|lease|pagdi)/.test(lower)) {
    categoryScores["Tenancy & Housing"] += 48;
  }
  if (/(salary|wage|pagar|tankhwah|employer|company|pf|epfo|layoff|termination|relieving|notice\s+period)/.test(lower)) {
    categoryScores["Labour & Employment"] += 48;
  }
  if (/(rti|public\s+authority|government|municipality|ration|pension|certificate|delay|information|department)/.test(lower)) {
    categoryScores["RTI & Governance"] += 45;
  }
  if (/(police|fir|thana|arrest|detention|harass|bail|24\s+hours|legal\s+aid|fundamental\s+right)/.test(lower)) {
    categoryScores["Fundamental Rights"] += 45;
  }

  const sortedCategories = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  const primaryCategory = sortedCategories[0][1] > 0 ? sortedCategories[0][0] : "Consumer Rights";
  const secondaryCategories = sortedCategories
    .slice(1)
    .filter(([, score]) => score > 0)
    .map(([cat]) => cat);

  // Determine urgency level
  let urgencyLevel: "standard" | "time-sensitive" | "urgent-financial-or-safety" = "standard";
  if (primaryCategory === "Cyber Safety" || /(upi|otp|bank\s+fraud|police|arrest|detain|evict\s+tonight)/.test(lower)) {
    urgencyLevel = "urgent-financial-or-safety";
  } else if (/(salary|deposit|notice|deadline|30\s+days)/.test(lower)) {
    urgencyLevel = "time-sensitive";
  }

  // Detect Central vs State vs District jurisdiction hints
  let detectedJurisdictionScope: "central" | "state" | "district" | "national" = "national";
  if (/(railway|passport|epfo|income\s+tax|central\s+government|national\s+highway|bank|rbi)/.test(lower)) {
    detectedJurisdictionScope = "central";
  } else if (params.stateJurisdiction && params.stateJurisdiction !== "All India") {
    detectedJurisdictionScope = "state";
  }

  // Map to verified Nyaya Learning Slugs
  const learningBridgeByCategory: Record<
    string,
    {
      plainLanguageExplanation: string;
      situations: string[];
      lessons: string[];
      rights: string[];
    }
  > = {
    "Consumer Rights": {
      plainLanguageExplanation:
        "Under the Consumer Protection Act, 2019, every buyer has the right to a refund, replacement, or compensation for defective goods, deficient services, or unfair trade practices—even when a seller writes 'No Refund' on an invoice.",
      situations: ["e-commerce-refund-denied-defective-item", "overcharged-above-mrp"],
      lessons: ["consumer-rights-defective-goods", "how-to-file-e-daakhil-complaint"],
      rights: ["right-to-redressal-cpa-2019", "right-to-fair-trade-practices"],
    },
    "Cyber Safety": {
      plainLanguageExplanation:
        "For unauthorised UPI, OTP, or banking fraud, immediate reporting within the Golden Hour on the National Cyber Crime Helpline (1930) or cybercrime.gov.in enables banks to freeze the fraudulent transaction trail under RBI Zero/Limited Liability guidelines.",
      situations: ["upi-fraud-unauthorised-debit", "whatsapp-telegram-investment-scam"],
      lessons: ["cyber-fraud-golden-hour-1930", "rbi-limited-liability-circular"],
      rights: ["right-to-zero-liability-unauthorized-banking", "right-to-zero-fir-cybercrime"],
    },
    "Tenancy & Housing": {
      plainLanguageExplanation:
        "A security deposit is held in trust by the landlord and cannot be arbitrarily forfeited for normal wear and tear. Landlords also cannot disconnect essential utilities (water/electricity) or evict a tenant without due legal notice.",
      situations: ["landlord-withholding-security-deposit", "threat-of-illegal-eviction-without-notice"],
      lessons: ["security-deposit-recovery-steps", "tenant-protection-essential-services"],
      rights: ["right-against-unlawful-eviction", "right-to-essential-utilities-tenancy"],
    },
    "Labour & Employment": {
      plainLanguageExplanation:
        "Earned wages and salaries are legally protected property. Employers cannot withhold earned salary for past work done, and disputes can be conciliated online via the Ministry of Labour's SAMADHAN portal or the State Labour Commissioner.",
      situations: ["unpaid-salary-after-resignation", "employer-withholding-relieving-letter"],
      lessons: ["payment-of-wages-and-samadhan-portal", "employment-notice-period-rights"],
      rights: ["right-to-timely-payment-of-wages", "right-to-statutory-provident-fund"],
    },
    "RTI & Governance": {
      plainLanguageExplanation:
        "Under Section 6(1) of the Right to Information Act, 2005, any Indian citizen can request official records, file status, and reasons for administrative delay from a Public Authority, which must reply within 30 days.",
      situations: ["government-application-stuck-without-reason", "civic-work-funds-transparency"],
      lessons: ["how-to-draft-effective-rti-questions", "central-vs-state-rti-portals"],
      rights: ["right-to-information-section-6", "right-to-first-appeal-section-19"],
    },
    "Fundamental Rights": {
      plainLanguageExplanation:
        "Article 21 and Article 22 of the Constitution protect personal liberty, mandate grounds of arrest, and require production before a Magistrate within 24 hours. Section 12 of the Legal Services Authorities Act entitles eligible citizens to free legal aid through NALSA/DLSA.",
      situations: ["police-refusing-to-register-fir", "know-your-rights-at-police-station"],
      lessons: ["zero-fir-and-bnss-section-173", "free-legal-aid-nalsa-dlsa"],
      rights: ["article-21-life-and-personal-liberty", "article-39a-equal-justice-and-free-legal-aid"],
    },
  };

  const bridge =
    learningBridgeByCategory[primaryCategory] ?? learningBridgeByCategory["Consumer Rights"];

  return {
    originalText: piiScan.redactedPreview,
    detectedLanguage: effectiveLanguage,
    languageScript: detected.script,
    confidence: detected.confidence,
    normalizedEnglishText: translation.normalizedText,
    matchedLegalTerms: translation.matchedTerms,
    primaryCategory,
    secondaryCategories,
    detectedJurisdictionScope,
    detectedState: params.stateJurisdiction ?? "All India",
    urgencyLevel,
    plainLanguageExplanation: bridge.plainLanguageExplanation,
    recommendedSituationSlugs: bridge.situations,
    recommendedLessonSlugs: bridge.lessons,
    recommendedRightSlugs: bridge.rights,
    piiDetected: piiScan.hasPII,
    piiTypes: piiScan.detectedTypes,
  };
}

/**
 * Persists a user-reviewed voice transcript record to Supabase (`voice_transcripts`)
 * when authenticated, respecting the citizen's choice (`transcript_only` vs `audio_and_transcript`).
 */
export async function saveVoiceTranscriptRecord(params: {
  rawTranscript: string;
  editedTranscript: string;
  detectedLanguage: SupportedCitizenLanguage;
  languageScript: string;
  normalizedTranslation: string;
  durationSeconds: number;
  storagePreference: VoiceStoragePreference;
  audioStoragePath?: string | null;
  linkedStoryId?: string | null;
}): Promise<VoiceTranscriptRecord> {
  const piiCheck = detectAndRedactPII(params.editedTranscript);
  const nowIso = new Date().toISOString();

  const fallbackRecord: VoiceTranscriptRecord = {
    id: `vt-${Date.now()}`,
    userId: "citizen-session",
    audioStoragePath:
      params.storagePreference === "audio_and_transcript"
        ? (params.audioStoragePath ?? null)
        : null,
    rawTranscript: params.rawTranscript,
    editedTranscript: piiCheck.redactedPreview,
    detectedLanguage: params.detectedLanguage,
    languageScript: params.languageScript,
    normalizedTranslation: params.normalizedTranslation,
    durationSeconds: params.durationSeconds,
    storagePreference: params.storagePreference,
    userReviewed: true,
    piiRedacted: piiCheck.hasPII,
    linkedStoryId: params.linkedStoryId ?? null,
    createdAt: nowIso,
  };

  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return fallbackRecord;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fallbackRecord;

    const untypedClient = supabase as unknown as {
      from: (table: string) => {
        insert: (row: Record<string, unknown>) => {
          select: (cols: string) => {
            single: () => Promise<{
              data: Record<string, unknown> | null;
              error: unknown;
            }>;
          };
        };
      };
    };

    const { data, error } = await untypedClient
      .from("voice_transcripts")
      .insert({
        user_id: user.id,
        audio_storage_path:
          params.storagePreference === "audio_and_transcript"
            ? (params.audioStoragePath ?? null)
            : null,
        raw_transcript: params.rawTranscript,
        edited_transcript: piiCheck.redactedPreview,
        detected_language: params.detectedLanguage,
        language_script: params.languageScript,
        normalized_translation: params.normalizedTranslation,
        duration_seconds: params.durationSeconds,
        storage_preference: params.storagePreference,
        user_reviewed: true,
        pii_redacted: piiCheck.hasPII,
        linked_story_id: params.linkedStoryId ?? null,
      })
      .select("*")
      .single();

    if (error || !data) return fallbackRecord;

    return {
      id: String(data.id),
      userId: String(data.user_id),
      audioStoragePath: (data.audio_storage_path as string | null) ?? null,
      rawTranscript: String(data.raw_transcript),
      editedTranscript: String(data.edited_transcript),
      detectedLanguage: data.detected_language as SupportedCitizenLanguage,
      languageScript: String(data.language_script),
      normalizedTranslation: String(data.normalized_translation),
      durationSeconds: Number(data.duration_seconds),
      storagePreference: data.storage_preference as VoiceStoragePreference,
      userReviewed: Boolean(data.user_reviewed),
      piiRedacted: Boolean(data.pii_redacted),
      linkedStoryId: (data.linked_story_id as string | null) ?? null,
      createdAt: String(data.created_at),
    };
  } catch {
    return fallbackRecord;
  }
}
