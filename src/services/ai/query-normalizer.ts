/**
 * Query Normalizer & Intent Classification Engine.
 *
 * Normalizes citizen queries (in English, Hindi, and Hinglish) into canonical
 * legal search concepts, detects domain categories, and flags sensitive/emergency situations.
 */

import type { SituationClassification } from "@/types";

export interface NormalizedQuery {
  rawQuery: string;
  normalizedConcepts: string[];
  canonicalSearchQuery: string;
  classification: SituationClassification;
  isSensitive: boolean;
  emergencyCategory?: string;
}

// Multilingual topic dictionaries (English, Hindi, Hinglish terms)
const TOPIC_MAPPINGS: Record<
  string,
  {
    category: string;
    keywords: string[];
    concepts: string[];
    sensitive?: boolean;
  }
> = {
  housing_deposit: {
    category: "housing",
    keywords: [
      "landlord", "tenant", "deposit", "security deposit", "rent", "pg", "kiraya", "makan malik",
      "wapas", "deduction", "eviction", "agreement", "notice", "broker", "maintenance",
    ],
    concepts: [
      "Model Tenancy Act",
      "Security Deposit Refund",
      "Deficiency in PG Service",
      "Illegal Eviction Protection",
    ],
  },
  police_search: {
    category: "criminal",
    keywords: [
      "police", "thana", "fir", "daroga", "check", "arrest", "custody", "warrant",
      "chowki", "detain", "phone check", "patrol", "handcuff", "bail", "bina warrant",
    ],
    concepts: [
      "Article 21 Personal Liberty",
      "D.K. Basu Arrest Guidelines",
      "Section 50 CrPC Right to Grounds of Arrest",
      "Zero FIR",
    ],
    sensitive: true,
  },
  cyber_fraud: {
    category: "cyber",
    keywords: [
      "upi", "otp", "cyber", "scam", "fraud", "hacked", "phishing", "online paise",
      "bank fraud", "link click", "cheating", "fake call", "crypto", "sim swap",
    ],
    concepts: [
      "IT Act 2000 Section 66D",
      "RBI Zero Liability Circular",
      "National Cyber Crime Reporting Helpline 1930",
    ],
  },
  consumer_defect: {
    category: "consumer",
    keywords: [
      "defective", "refund", "return", "amazon", "flipkart", "warranty", "kharab saman",
      "complaint", "service deficiency", "fake product", "guarantee", "invoice", "bill",
    ],
    concepts: [
      "Consumer Protection Act 2019",
      "Deficiency in Service",
      "Right to Refund and Replacement",
      "National Consumer Helpline 1915",
    ],
  },
  traffic_challan: {
    category: "traffic",
    keywords: [
      "traffic", "challan", "police stop", "fine", "license", "rc", "helmet", "seatbelt",
      "towing", "m-parivahan", "digilocker", "drunk driving", "rto",
    ],
    concepts: [
      "Motor Vehicles Amendment Act 2019",
      "Rule 139 Central Motor Vehicles Rules",
      "DigiLocker Validity",
      "On-spot Challan Payment Rights",
    ],
  },
  education_ragging: {
    category: "education",
    keywords: [
      "ragging", "college", "university", "hostel", "senior", "fees", "documents withheld",
      "original certificate", "marksheet", "ugc", "anti-ragging", "principal", "admission",
    ],
    concepts: [
      "UGC Anti-Ragging Regulations 2009",
      "UGC Prohibition on Retention of Original Certificates",
      "National Anti-Ragging Helpline 1800-180-5522",
    ],
    sensitive: true,
  },
  women_safety: {
    category: "family",
    keywords: [
      "harassment", "stalking", "domestic violence", "marpeet", "dowry", "dahez",
      "chhedchhad", "threat", "posh", "workplace harassment", "protection order",
    ],
    concepts: [
      "Protection of Women from Domestic Violence Act 2005",
      "POSH Act 2013",
      "IPC Section 354D Stalking",
      "Women Helpline 1091",
    ],
    sensitive: true,
  },
  privacy_data: {
    category: "privacy",
    keywords: [
      "privacy", "personal data", "surveillance", "camera", "photo leak", "doxxing",
      "tracking", "consent", "aadhaar", "biometric",
    ],
    concepts: [
      "Article 21 Right to Privacy",
      "Justice K.S. Puttaswamy Judgment 2017",
      "Digital Personal Data Protection Act 2023",
    ],
  },
};

export class QueryNormalizer {
  /**
   * Normalizes raw user input into structured search concepts and intent classification.
   */
  normalize(rawQuery: string): NormalizedQuery {
    const clean = rawQuery.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
    const words = clean.split(/\s+/).filter(Boolean);

    const matchedTopics: string[] = [];
    const matchedCategories = new Set<string>();
    const matchedConcepts: string[] = [];
    let isSensitive = false;

    for (const [topicKey, topicMeta] of Object.entries(TOPIC_MAPPINGS)) {
      let hits = 0;
      for (const kw of topicMeta.keywords) {
        if (clean.includes(kw)) {
          hits += 1;
        }
      }

      if (hits > 0) {
        matchedTopics.push(topicKey);
        matchedCategories.add(topicMeta.category);
        matchedConcepts.push(...topicMeta.concepts);
        if (topicMeta.sensitive) {
          isSensitive = true;
        }
      }
    }

    // Build canonical search string from key concepts
    const conceptsSummary = Array.from(new Set(matchedConcepts)).slice(0, 4);
    const canonicalSearchQuery = conceptsSummary.length > 0
      ? `${rawQuery} ${conceptsSummary.join(" ")}`
      : rawQuery;

    const classification: SituationClassification = {
      categoryIds: Array.from(matchedCategories),
      conceptIds: conceptsSummary,
      situationType: matchedTopics[0] ?? "general_legal_query",
      confidence: matchedTopics.length > 0 ? 0.85 : 0.4,
      missingContext: this.detectMissingContext(words, matchedCategories),
      isSensitive,
    };

    return {
      rawQuery,
      normalizedConcepts: conceptsSummary,
      canonicalSearchQuery,
      classification,
      isSensitive,
    };
  }

  /** Identifies helpful clarifying details that would assist the learner */
  private detectMissingContext(words: string[], categories: Set<string>): string[] {
    const missing: string[] = [];

    if (categories.has("housing")) {
      if (!words.some((w) => ["written", "agreement", "contract", "verbal"].includes(w))) {
        missing.push("Whether there is a written rental agreement or verbal arrangement");
      }
    }

    if (categories.has("consumer")) {
      if (!words.some((w) => ["invoice", "bill", "receipt", "order"].includes(w))) {
        missing.push("Whether you hold a tax invoice, bill, or written proof of purchase");
      }
    }

    if (categories.has("traffic") || categories.has("criminal")) {
      if (!words.some((w) => ["state", "delhi", "mumbai", "karnataka", "up", "bihar"].includes(w))) {
        missing.push("Specific State or City where the event occurred (state rules vary)");
      }
    }

    return missing;
  }
}

export const queryNormalizer = new QueryNormalizer();
