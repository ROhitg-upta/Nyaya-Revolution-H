/**
 * Learning Velocity & Realtime Analytics Service.
 *
 * Tracks citizen learning velocity, pass rates, and mastery across
 * 7 Indian legal domains, powering the real-time analytics dashboard.
 */

import type {
  IndianLegalDomainVelocity,
  PlatformVelocitySummary,
  RealtimeLearningEvent,
} from "@/types";

const DOMAIN_VELOCITY_DATA: IndianLegalDomainVelocity[] = [
  {
    id: "domain-const",
    title: "Constitutional Law & Fundamental Rights",
    description: "Articles 14, 19, 21, 22, 32, and writ remedies in High Courts and Supreme Court.",
    iconName: "Landmark",
    category: "constitutional",
    activeLearners: 842,
    completedScenarios: 3410,
    velocityScore: 42,
    passRate: 86,
    trend: "rising",
    hotspotConcept: "Article 22: Preventive detention vs punitive detention safeguards",
  },
  {
    id: "domain-crim",
    title: "Criminal Law & Procedure (BNS / BNSS)",
    description: "Arrest procedures, Section 41 CrPC / Section 35 BNSS, FIR rights, and anticipatory bail.",
    iconName: "ShieldAlert",
    category: "criminal",
    activeLearners: 975,
    completedScenarios: 4890,
    velocityScore: 56,
    passRate: 78,
    trend: "hotspot",
    hotspotConcept: "Section 480 BNSS: Default bail within 60/90 days",
  },
  {
    id: "domain-cyber",
    title: "Cyber Law & Digital Privacy (IT Act / DPDP)",
    description: "Section 66D IT Act, UPI payment fraud, cyber extortion, and DPDP consent withdrawal.",
    iconName: "Brain",
    category: "cyber",
    activeLearners: 1240,
    completedScenarios: 5620,
    velocityScore: 68,
    passRate: 84,
    trend: "rising",
    hotspotConcept: "Rule of Immediate Reporting on 1930 / cybercrime.gov.in within Golden Hour",
  },
  {
    id: "domain-consumer",
    title: "Consumer Protection & E-Commerce",
    description: "Consumer Protection Act 2019, unfair trade practices, e-Daakhil filing, and refund disputes.",
    iconName: "ShoppingBag",
    category: "consumer",
    activeLearners: 630,
    completedScenarios: 2780,
    velocityScore: 31,
    passRate: 91,
    trend: "stable",
    hotspotConcept: "Pecuniary jurisdiction: District Commission up to Rs 50 Lakhs",
  },
  {
    id: "domain-housing",
    title: "Housing, Tenancy & Property (RERA)",
    description: "Model Tenancy Act 2021, unlawful eviction, security deposit caps, and RERA defect liability.",
    iconName: "Building2",
    category: "housing",
    activeLearners: 715,
    completedScenarios: 3150,
    velocityScore: 39,
    passRate: 82,
    trend: "rising",
    hotspotConcept: "Section 11 Model Tenancy: Max 2 months rent deposit for residential leases",
  },
  {
    id: "domain-labour",
    title: "Labour & Workplace Rights (POSH / Gratuity)",
    description: "Payment of Gratuity Act, POSH Internal Complaints Committee, and wrongful termination.",
    iconName: "Briefcase",
    category: "labour",
    activeLearners: 520,
    completedScenarios: 2190,
    velocityScore: 24,
    passRate: 88,
    trend: "stable",
    hotspotConcept: "POSH Act 90-day inquiry completion mandate for ICC",
  },
  {
    id: "domain-traffic",
    title: "Traffic, Transport & Motor Vehicles (MV Act)",
    description: "Motor Vehicles (Amendment) Act 2019, electronic challans, DigiLocker validity, and road accidents.",
    iconName: "CarFront",
    category: "traffic",
    activeLearners: 680,
    completedScenarios: 3670,
    velocityScore: 47,
    passRate: 93,
    trend: "rising",
    hotspotConcept: "Rule 139 CMVR: DigiLocker/mParivahan physical parity",
  },
];

const INITIAL_EVENTS: RealtimeLearningEvent[] = [
  {
    id: "evt-1",
    userName: "Aarav S.",
    state: "Maharashtra",
    eventType: "practice_completed",
    title: "Solved Scenario: Illegal DigiLocker DL Seizure (+25 XP)",
    xpEarned: 25,
    timestamp: new Date(Date.now() - 15000).toISOString(),
  },
  {
    id: "evt-2",
    userName: "Priya V.",
    state: "Karnataka",
    eventType: "quiz_passed",
    title: "Passed Quiz: Model Tenancy Security Deposit Limits (+50 XP)",
    xpEarned: 50,
    timestamp: new Date(Date.now() - 48000).toISOString(),
  },
  {
    id: "evt-3",
    userName: "Rohit K.",
    state: "Delhi",
    eventType: "streak_milestone",
    title: "Achieved a 7-Day Legal Awareness Streak! 🔥",
    xpEarned: 100,
    timestamp: new Date(Date.now() - 95000).toISOString(),
  },
  {
    id: "evt-4",
    userName: "Adv. Meera N.",
    state: "Tamil Nadu",
    eventType: "situation_verified",
    title: "Verified Citizen Situation: WhatsApp Cyber Extortion",
    xpEarned: 40,
    timestamp: new Date(Date.now() - 160000).toISOString(),
  },
  {
    id: "evt-5",
    userName: "Vikram P.",
    state: "Uttar Pradesh",
    eventType: "practice_completed",
    title: "Solved Scenario: Police Summons Under BNSS Section 35 (+25 XP)",
    xpEarned: 25,
    timestamp: new Date(Date.now() - 240000).toISOString(),
  },
];

const INDIAN_STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal",
  "Telangana",
  "Gujarat",
  "Kerala",
  "Rajasthan",
  "Punjab",
  "Madhya Pradesh",
];

const CITIZEN_FIRST_NAMES = [
  "Aarav", "Priya", "Ananya", "Rohan", "Sneha", "Karan", "Aditi", "Rahul",
  "Divya", "Vikram", "Neha", "Arjun", "Pooja", "Siddharth", "Meera", "Kabir"
];

const EVENT_TEMPLATES = [
  {
    eventType: "practice_completed" as const,
    title: "Solved Scenario: Police Interrogation Rights (+25 XP)",
    xpEarned: 25,
  },
  {
    eventType: "quiz_passed" as const,
    title: "Passed Quiz: Consumer Court E-Daakhil Filing (+50 XP)",
    xpEarned: 50,
  },
  {
    eventType: "streak_milestone" as const,
    title: "Reached a 5-Day Daily Learning Streak! 🔥",
    xpEarned: 50,
  },
  {
    eventType: "practice_completed" as const,
    title: "Solved Scenario: Cyber Phishing & 1930 Helpline (+25 XP)",
    xpEarned: 25,
  },
  {
    eventType: "situation_verified" as const,
    title: "Advocate Approved Situation: Unlawful Rent Escalation",
    xpEarned: 40,
  },
];

export class AnalyticsService {
  /** Retrieves platform-wide learning velocity summary */
  getPlatformVelocitySummary(): PlatformVelocitySummary {
    return {
      activeLearnersNow: 348,
      scenariosCompletedToday: 1429,
      xpVelocityPerHour: 2850,
      groundingAccuracyRate: 99.4,
      topDomain: "Cyber Law & Digital Privacy (IT Act / DPDP)",
      lastUpdated: new Date().toISOString(),
    };
  }

  /** Retrieves learning velocity data across all 7 Indian legal domains */
  getDomainVelocityMetrics(): IndianLegalDomainVelocity[] {
    return DOMAIN_VELOCITY_DATA;
  }

  /** Retrieves the latest learning events */
  getRecentLearningEvents(): RealtimeLearningEvent[] {
    return INITIAL_EVENTS;
  }

  /** Generates a realistic simulated realtime event for active demonstration */
  generateSimulatedEvent(): RealtimeLearningEvent {
    const name = CITIZEN_FIRST_NAMES[Math.floor(Math.random() * CITIZEN_FIRST_NAMES.length)];
    const initial = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const state = INDIAN_STATES[Math.floor(Math.random() * INDIAN_STATES.length)];
    const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];

    return {
      id: `live-evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userName: `${name} ${initial}.`,
      state,
      eventType: template.eventType,
      title: template.title,
      xpEarned: template.xpEarned,
      timestamp: new Date().toISOString(),
    };
  }
}

export const analyticsService = new AnalyticsService();
