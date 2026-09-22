/**
 * Advanced Multi-Type Legal Quiz Questions Dataset.
 *
 * Models diverse pedagogical question types:
 * - mcq (Multiple Choice)
 * - true_false (Fact vs Misconception)
 * - scenario (Realistic situational dilemma)
 * - next_action (Procedural step ranking)
 * - case_based (Supreme Court precedent application)
 *
 * Difficulty: beginner | intermediate | advanced.
 * All answers verified against Indian statutes and Supreme Court judgments.
 */
import type { QuizQuestion } from "@/types";

export const advancedQuizzes: Record<string, QuizQuestion[]> = {
  constitutional: [
    {
      id: "q-const-1",
      type: "mcq",
      difficulty: "beginner",
      question: "Which Constitutional Article guarantees every person the fundamental right to life and personal liberty?",
      options: [
        "Article 14",
        "Article 19",
        "Article 21",
        "Article 32",
      ],
      correctIndex: 2,
      explanation:
        "Article 21 declares that no person shall be deprived of his life or personal liberty except according to procedure established by law. The Supreme Court has interpreted this to include right to privacy, clean environment, and dignity.",
      xp: 25,
      relatedConcept: "Right to Life and Personal Liberty",
      articleRef: "article-21-protection-of-life-and-personal-liberty",
      source: {
        title: "Constitution of India — Ministry of Law and Justice",
        url: "https://legislative.gov.in/constitution-of-india",
        publisher: "Government of India",
      },
    },
    {
      id: "q-const-2",
      type: "case_based",
      difficulty: "advanced",
      question:
        "In Justice K.S. Puttaswamy (2017), what constitutional threshold was established before the State can lawfully restrict a citizen's right to privacy?",
      options: [
        "Only oral approval from a police commissioner is required.",
        "A three-fold test: Legality (valid law), Legitimate State Aim, and Proportionality.",
        "Privacy can never be restricted under any circumstances.",
        "Only an executive notification from the Home Department is sufficient.",
      ],
      correctIndex: 1,
      explanation:
        "The Supreme Court 9-judge bench mandated the Proportionality Test: any infringement of privacy must be sanctioned by a valid statutory law, pursue a legitimate state aim, and be proportional to the object sought to be achieved.",
      xp: 40,
      caseRef: "puttaswamy-privacy-2017",
      relatedConcept: "Proportionality Standard in Fundamental Rights",
      source: {
        title: "Supreme Court of India (2017) 10 SCC 1",
        url: "https://main.sci.gov.in/",
        publisher: "Supreme Court of India",
      },
    },
    {
      id: "q-const-3",
      type: "true_false",
      difficulty: "beginner",
      question:
        "True or False: Fundamental Rights under Articles 14, 20, and 21 protect ALL persons in India, including foreign nationals, not just Indian citizens.",
      options: ["True", "False"],
      correctIndex: 0,
      explanation:
        "True. Unlike Article 19 (freedoms reserved specifically for citizens), Articles 14 (Equality before Law) and 21 (Life & Liberty) use the term 'any person', protecting all human beings within the territory of India.",
      xp: 20,
      relatedConcept: "Universal Scope of Articles 14 and 21",
    },
  ],
  criminal_procedure: [
    {
      id: "q-crim-1",
      type: "scenario",
      difficulty: "intermediate",
      question:
        "A citizen is arrested by police at 6:00 PM on a Friday. What is the maximum time within which police MUST produce the arrested person before a Judicial Magistrate?",
      options: [
        "Within 48 hours, excluding weekends.",
        "Within 24 hours of arrest, excluding travel time from the place of arrest.",
        "Within 72 hours if the offence is cognizable.",
        "At the convenience of the investigating officer.",
      ],
      correctIndex: 1,
      explanation:
        "Under Article 22(2) of the Constitution and Section 57 of the CrPC (Section 58 BNSS), police must produce an arrested person before the nearest magistrate within 24 hours, excluding travel time. Weekend holidays do not extend this limit.",
      xp: 30,
      caseRef: "dk-basu-arrest-guidelines-1997",
      relatedConcept: "24-Hour Production Mandate",
    },
    {
      id: "q-crim-2",
      type: "next_action",
      difficulty: "intermediate",
      question:
        "If a police officer refuses to register an FIR for a cognizable offence (e.g. theft or assault), what is your statutorily prescribed next step under CrPC/BNSS?",
      options: [
        "Approach the High Court for contempt.",
        "Send the substance of the information in writing by registered post to the Superintendent of Police (SP/DCP).",
        "Wait for the local MLA to issue an order.",
        "Take matters into your own hands.",
      ],
      correctIndex: 1,
      explanation:
        "Under Section 154(3) CrPC / Section 173(4) BNSS, if the Station House Officer refuses to register an FIR, the aggrieved citizen can send the complaint in writing by registered post to the Superintendent of Police, who can investigate or direct an investigation.",
      xp: 30,
      relatedConcept: "Section 154(3) Redressal Mechanism",
    },
  ],
  consumer_rights: [
    {
      id: "q-cons-1",
      type: "mcq",
      difficulty: "beginner",
      question:
        "What is the official online portal run by the Government of India for filing e-complaints directly in Consumer Commissions across India?",
      options: [
        "e-Courts Services",
        "e-Daakhil Portal",
        "DigiLocker",
        "mParivahan",
      ],
      correctIndex: 1,
      explanation:
        "e-Daakhil (edaakhil.nic.in) is the official Consumer Commission portal launched by the Department of Consumer Affairs for electronic filing of consumer grievances without needing to visit physically.",
      xp: 25,
      relatedConcept: "e-Daakhil Consumer Redressal",
      source: {
        title: "National Consumer Disputes Redressal Commission",
        url: "https://edaakhil.nic.in/",
        publisher: "Ministry of Consumer Affairs",
      },
    },
    {
      id: "q-cons-2",
      type: "true_false",
      difficulty: "beginner",
      question:
        "True or False: A consumer must mandatorily hire an advocate to file and argue a case before the District Consumer Commission.",
      options: ["True", "False"],
      correctIndex: 1,
      explanation:
        "False! The Consumer Protection Act 2019 was designed as a simplified, citizen-friendly forum. Consumers can appear in person or through an authorized representative without hiring an advocate.",
      xp: 20,
      relatedConcept: "In-Person Appearance in Consumer Commissions",
    },
  ],
  cyber_law: [
    {
      id: "q-cyber-1",
      type: "scenario",
      difficulty: "beginner",
      question:
        "You receive an SMS claiming your electricity connection will be disconnected tonight unless you call an unknown 10-digit number. What is this type of fraud called?",
      options: [
        "Statutory Utility Notice",
        "Phishing / Social Engineering Scam",
        "Deficiency of Service",
        "Cognizable Utility Violation",
      ],
      correctIndex: 1,
      explanation:
        "This is a classic utility phishing scam. Discoms never send disconnection warnings demanding immediate calls to personal mobile numbers or app downloads.",
      xp: 20,
      relatedConcept: "Social Engineering Fraud",
    },
    {
      id: "q-cyber-2",
      type: "mcq",
      difficulty: "intermediate",
      question:
        "Under Section 43A of the IT Act and the DPDP Act 2023, what is an entity handling citizen personal data called, and what duty do they owe?",
      options: [
        "Data Fiduciary — duty to implement reasonable security safeguards to protect personal data.",
        "Data Beneficiary — no duty of care.",
        "Information Intermediary — immune from all data breach claims.",
        "Public Officer — immune under sovereign doctrine.",
      ],
      correctIndex: 0,
      explanation:
        "Entities that determine the purpose and means of processing personal data are called Data Fiduciaries under the DPDP Act 2023. They have a statutory obligation to maintain technical safeguards and report breaches.",
      xp: 30,
      relatedConcept: "Data Fiduciary Obligations",
    },
  ],
};

/** Flattened helper to query questions by category or difficulty */
export function getQuizQuestionsByCategory(
  category: string,
  difficulty?: "beginner" | "intermediate" | "advanced",
): QuizQuestion[] {
  const list = advancedQuizzes[category] || [];
  if (!difficulty) return list;
  return list.filter((q) => !q.difficulty || q.difficulty === difficulty);
}
