/**
 * "My Legal Knowledge" Progress & Telemetry Data.
 *
 * Models learner mastery across major legal domains, tracking streak,
 * quiz accuracy, weak topics, strong topics, and tailored revision recommendations.
 *
 * IMPORTANT:
 * - This progress represents educational legal awareness only.
 * - Does NOT represent legal competence or professional qualifications.
 */
import type { LegalKnowledgeProgress } from "@/types";

export const initialKnowledgeProgress: LegalKnowledgeProgress = {
  overallMastery: 46,
  streakDays: 5,
  lessonsCompleted: 14,
  quizzesTaken: 8,
  overallAccuracy: 78,
  categories: [
    {
      category: "constitution",
      categoryTitle: "Constitution & Fundamental Rights",
      progressPct: 42,
      quizzesTaken: 3,
      accuracyPct: 84,
      status: "developing",
    },
    {
      category: "cyber",
      categoryTitle: "Cyber Law & Digital Safety",
      progressPct: 68,
      quizzesTaken: 4,
      accuracyPct: 90,
      status: "strong",
    },
    {
      category: "consumer",
      categoryTitle: "Consumer Rights & Fair Trade",
      progressPct: 25,
      quizzesTaken: 1,
      accuracyPct: 60,
      status: "weak",
    },
    {
      category: "housing",
      categoryTitle: "Tenant Rights & Housing",
      progressPct: 15,
      quizzesTaken: 1,
      accuracyPct: 50,
      status: "weak",
    },
    {
      category: "traffic",
      categoryTitle: "Traffic Rules & Motor Vehicles",
      progressPct: 55,
      quizzesTaken: 2,
      accuracyPct: 75,
      status: "developing",
    },
    {
      category: "labour",
      categoryTitle: "Workplace & Labour Rights",
      progressPct: 30,
      quizzesTaken: 1,
      accuracyPct: 65,
      status: "developing",
    },
  ],
  weakTopics: [
    "Tenant Notice Periods & Deposit Deductions (Model Tenancy Act)",
    "Jurisdiction Limits in District Consumer Commissions",
    "Zero FIR Jurisdiction & Forwarding Rules",
  ],
  strongTopics: [
    "Right to Privacy (Article 21 & Puttaswamy Ruling)",
    "RBI Zero Liability Protection for Electronic Fraud",
    "Mandatory Arrest Guidelines (D.K. Basu v. State of West Bengal)",
  ],
  revisionRecommendations: [
    {
      slug: "pg-deposit-refusal",
      title: "PG Landlord Security Deposit Dispute",
      category: "housing",
      reason: "Scored 50% on Tenancy Rules — Practice with the interactive scenario simulator.",
      type: "scenario",
      href: "/learn/scenarios/pg-deposit-refusal",
    },
    {
      slug: "consumer-rights",
      title: "Consumer Rights & e-Daakhil Filing",
      category: "consumer",
      reason: "Weak retention detected on statutory complaint timelines. 3-minute quick revision.",
      type: "lesson",
      href: "/learn/student-rights/fees-and-refunds",
    },
    {
      slug: "police-stop-warrantless-search",
      title: "Police Stop & Warrantless Phone Check",
      category: "constitution",
      reason: "Solidify your understanding of Article 21 and Section 100 CrPC safeguards.",
      type: "scenario",
      href: "/learn/scenarios/police-stop-warrantless-search",
    },
  ],
  recentlyLearned: [
    {
      slug: "know-your-campus-rights",
      title: "Know Your Campus Rights",
      journeySlug: "student-rights",
      completedAt: "2 days ago",
    },
    {
      slug: "reporting-ragging",
      title: "Reporting Ragging Legally",
      journeySlug: "student-rights",
      completedAt: "4 days ago",
    },
    {
      slug: "traffic-fines",
      title: "Traffic Challans & Virtual Courts",
      journeySlug: "traffic-rules",
      completedAt: "5 days ago",
    },
  ],
  recommendedNextLesson: {
    slug: "fees-and-refunds",
    title: "Fees, Refunds & Unfair Contracts",
    journeySlug: "student-rights",
    journeyTitle: "Student & Campus Rights",
    reason: "Directly bridges your weak area in consumer remedies with university refund guidelines.",
  },
};
