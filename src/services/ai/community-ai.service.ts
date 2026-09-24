import {
  COMMUNITY_CATEGORIES,
  DEFAULT_LEARNING_BRIDGES,
} from "@/constants/community";
import { detectAndRedactPII, sanitizeUserText } from "@/lib/sanitization";
import type {
  AIStoryAssistanceResult,
  CommunityCategorySlug,
  StoryLearningBridgeData,
} from "@/types/community";

/**
 * SPRINT E10 — COMMUNITY AI ASSISTANCE & STORY-TO-LEARNING BRIDGE ENGINE
 *
 * CRITICAL AUTHORITY BOUNDARY:
 * - AI never rewrites the citizen's original testimony without consent.
 * - AI-generated summaries and educational notes are always explicitly labeled.
 * - AI maps the citizen's narrative to verified platform Situations, Legal Areas,
 *   Learning Journeys, Lessons, Concepts, and Practice Scenarios.
 */

const CATEGORY_KEYWORDS: Record<CommunityCategorySlug, string[]> = {
  cyber: [
    "upi",
    "scam",
    "phishing",
    "1930",
    "otp",
    "fraud",
    "cyber",
    "customs",
    "whatsapp",
    "telegram",
    "bank freeze",
    "lien",
    "utr",
  ],
  consumer: [
    "refund",
    "defective",
    "laptop",
    "phone",
    "delivery",
    "ecommerce",
    "return",
    "warranty",
    "nch",
    "1915",
    "edaakhil",
    "seller",
  ],
  workplace: [
    "salary",
    "employer",
    "hr",
    "relieving letter",
    "resignation",
    "notice period",
    "wages",
    "pf",
    "posh",
    "layoff",
  ],
  tenancy: [
    "landlord",
    "deposit",
    "rent",
    "tenant",
    "lease",
    "flat",
    "eviction",
    "repainting",
    "wear and tear",
    "broker",
  ],
  police_rights: [
    "police",
    "fir",
    "zero fir",
    "bnss",
    "station",
    "jurisdiction",
    "stolen",
    "theft",
    "arrest",
    "complaint",
  ],
  family_safety: [
    "domestic",
    "protection officer",
    "181",
    "sakhi",
    "harassment",
    "maintenance",
    "residence order",
    "safety",
  ],
  education: [
    "college",
    "university",
    "ugc",
    "marksheet",
    "original certificate",
    "admission fee",
    "hostel",
    "ragging",
  ],
  rti_civic: [
    "rti",
    "information",
    "public information officer",
    "pio",
    "municipal",
    "passport delay",
    "pension",
    "30 days",
  ],
  traffic_transport: [
    "challan",
    "traffic",
    "digilocker",
    "mparivahan",
    "towing",
    "license",
    "rc",
    "virtual court",
  ],
  general_awareness: [
    "contract",
    "notice",
    "affidavit",
    "evidence",
    "rights",
    "awareness",
  ],
};

export function inferCategoryAndBridge(input: {
  title?: string;
  whatHappened: string;
  actionTaken?: string;
  explicitCategory?: CommunityCategorySlug;
}): {
  category: CommunityCategorySlug;
  tags: string[];
  learningBridge: StoryLearningBridgeData;
} {
  const combined =
    `${input.title || ""} ${input.whatHappened} ${input.actionTaken || ""}`.toLowerCase();

  let bestCategory: CommunityCategorySlug =
    input.explicitCategory || "general_awareness";
  let highestScore = 0;

  if (!input.explicitCategory) {
    for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS) as [
      CommunityCategorySlug,
      string[],
    ][]) {
      const score = words.reduce(
        (acc, word) => (combined.includes(word) ? acc + 1 : acc),
        0
      );
      if (score > highestScore) {
        highestScore = score;
        bestCategory = cat;
      }
    }
  }

  const tags = new Set<string>();
  if (combined.includes("1930") || bestCategory === "cyber") {
    tags.add("1930 Cyber Helpline");
    tags.add("UPI Fraud");
  }
  if (
    combined.includes("refund") ||
    combined.includes("1915") ||
    bestCategory === "consumer"
  ) {
    tags.add("National Consumer Helpline");
    tags.add("e-Daakhil Portal");
  }
  if (combined.includes("fir") || bestCategory === "police_rights") {
    tags.add("Zero FIR (BNSS Sec 173)");
  }
  if (combined.includes("deposit") || bestCategory === "tenancy") {
    tags.add("Security Deposit");
  }
  if (combined.includes("salary") || bestCategory === "workplace") {
    tags.add("Unpaid Salary");
    tags.add("SAMADHAN Portal");
  }
  if (combined.includes("rti") || bestCategory === "rti_civic") {
    tags.add("RTI Act 2005");
  }
  tags.add("Written Notice");

  return {
    category: bestCategory,
    tags: Array.from(tags).slice(0, 5),
    learningBridge:
      DEFAULT_LEARNING_BRIDGES[bestCategory] ||
      DEFAULT_LEARNING_BRIDGES.general_awareness,
  };
}

/**
 * Generates AI Assistance for a citizen draft (Summary, Educational Note, Privacy Warnings,
 * Suggested Tags, and Story-to-Learning Bridge).
 * Uses Gemini API if configured, with immediate deterministic grounding fallback.
 */
export async function analyzeCitizenStoryWithAI(input: {
  title: string;
  whatHappened: string;
  actionTaken: string;
  legalOutcome: string;
  citizenTakeaway?: string;
  category?: CommunityCategorySlug;
}): Promise<AIStoryAssistanceResult> {
  const cleanTitle = sanitizeUserText(input.title);
  const cleanWhatHappened = sanitizeUserText(input.whatHappened);
  const cleanAction = sanitizeUserText(input.actionTaken);
  const cleanOutcome = sanitizeUserText(input.legalOutcome);

  const piiScan = detectAndRedactPII(
    `${cleanTitle} ${cleanWhatHappened} ${cleanAction} ${cleanOutcome}`
  );

  const { category, tags, learningBridge } = inferCategoryAndBridge({
    title: cleanTitle,
    whatHappened: cleanWhatHappened,
    actionTaken: cleanAction,
    explicitCategory: input.category,
  });

  const categoryConfig =
    COMMUNITY_CATEGORIES.find((c) => c.slug === category) ||
    COMMUNITY_CATEGORIES[0];

  const defaultSummary = `Citizen shared a real-world ${categoryConfig.label.toLowerCase()} situation: ${cleanWhatHappened.slice(0, 140)}${cleanWhatHappened.length > 140 ? "..." : ""} Action taken involved ${cleanAction.slice(0, 100)}${cleanAction.length > 100 ? "..." : ""}`;

  const defaultEducationalNote = `Educational Context (Not Legal Advice): This community experience connects to ${learningBridge.legalAreaTitle}. ${learningBridge.rightsSummary}`;

  // Optional Gemini enhancement if GEMINI_API_KEY is available on server
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && typeof window === "undefined") {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are Nyaya Revolution's Legal-Education Safety Assistant.
Analyze this citizen story and return JSON only with keys:
"suggestedTitle" (max 120 chars, neutral and educational),
"aiSummary" (2 sentences summarizing what happened and the resolution without inventing facts),
"aiEducationalNote" (2 sentences starting with "Educational Context (Not Legal Advice):" connecting the story to ${learningBridge.legalAreaTitle}).

Citizen Title: ${cleanTitle}
What Happened: ${cleanWhatHappened}
Action Taken: ${cleanAction}
Outcome: ${cleanOutcome}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const parsed = JSON.parse(rawText);
        if (parsed.aiSummary && parsed.aiEducationalNote) {
          return {
            suggestedCategory: category,
            suggestedTags: tags,
            suggestedTitle: sanitizeUserText(parsed.suggestedTitle || cleanTitle),
            aiSummary: sanitizeUserText(parsed.aiSummary),
            aiEducationalNote: sanitizeUserText(parsed.aiEducationalNote),
            privacyWarnings: piiScan.warningMessages,
            learningBridge,
          };
        }
      }
    } catch {
      // Fallback to deterministic grounded synthesis below
    }
  }

  return {
    suggestedCategory: category,
    suggestedTags: tags,
    suggestedTitle:
      cleanTitle.length >= 12
        ? cleanTitle
        : `How I Navigated a ${categoryConfig.shortLabel} Situation`,
    aiSummary: defaultSummary,
    aiEducationalNote: defaultEducationalNote,
    privacyWarnings: piiScan.warningMessages,
    learningBridge,
  };
}
