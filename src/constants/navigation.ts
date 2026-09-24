import {
  Activity,
  BookOpen,
  Bookmark,
  Brain,
  Compass,
  FileText,
  FolderKanban,
  Gavel,
  Mic,
  PlusCircle,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "@/lib/icons";
import { routes } from "./routes";

export type PrimaryNavId = "situations" | "learn" | "community" | "ai";

export interface NavSubItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: "brand" | "emerald" | "amber";
}

export interface PrimaryNavSection {
  id: PrimaryNavId;
  label: string;
  shortLabel: string;
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  headline: string;
  subheadline: string;
  featuredItems: NavSubItem[];
  secondaryItems: NavSubItem[];
  primaryCta: {
    label: string;
    description: string;
    href: string;
    icon: LucideIcon;
  };
}

export const PRIMARY_NAV_SECTIONS: PrimaryNavSection[] = [
  {
    id: "situations",
    label: "What Happened?",
    shortLabel: "Situations",
    href: routes.situations,
    icon: Compass,
    eyebrow: "Situation-First Triage",
    headline: "Tell Nyaya what happened to you",
    subheadline:
      "Start from a real-world problem and get immediate Do's, Don'ts, verified rights, and official portals.",
    featuredItems: [
      {
        id: "sit-cyber",
        title: "Cyber Scam & UPI Fraud (1930)",
        description: "Golden-hour bank lien freeze, phishing links & RBI zero-liability steps.",
        href: "/situations/upi-fraud",
        icon: ShieldAlert,
        badge: "Urgent",
        badgeTone: "amber",
      },
      {
        id: "sit-consumer",
        title: "Defective Product & Refund Refused",
        description: "E-commerce return denials, NCH 1915 dockets & CPA 2019 remedies.",
        href: "/situations/defective-product",
        icon: Scale,
        badge: "CPA 2019",
        badgeTone: "brand",
      },
      {
        id: "sit-tenancy",
        title: "Landlord Keeping Security Deposit",
        description: "Move-out inspection proof, wear-and-tear rules & recovery notice.",
        href: "/situations/landlord-withholding-deposit",
        icon: FileText,
      },
      {
        id: "sit-police",
        title: "Police Refusing to File FIR",
        description: "Zero FIR & e-FIR rights under Section 173 of BNSS 2023.",
        href: "/situations/police-complaint-fir",
        icon: ShieldCheck,
        badge: "BNSS 2023",
        badgeTone: "emerald",
      },
      {
        id: "sit-workplace",
        title: "Unpaid Salary or Delayed Relieving Letter",
        description: "Full & final settlement rights, demand notices & SAMADHAN portal.",
        href: "/situations/employer-not-paying-salary",
        icon: FolderKanban,
      },
      {
        id: "sit-student",
        title: "College Withholding Original Certificates",
        description: "UGC non-retention directives, fee refund rules & e-Samadhan.",
        href: "/situations/college-withheld-documents",
        icon: BookOpen,
      },
    ],
    secondaryItems: [
      {
        id: "sit-all",
        title: "Browse All 60+ Verified Situations",
        description: "Filter by urgency, legal category, or statutory protection.",
        href: routes.situations,
        icon: Compass,
      },
      {
        id: "sit-action-center",
        title: "Multilingual Voice & Citizen Action Engine",
        description: "Speak in Hindi/Hinglish, find NALSA 15100 aid & prepare A4 drafts.",
        href: routes.actionCenter,
        icon: Mic,
        badge: "New E11",
        badgeTone: "amber",
      },
      {
        id: "sit-submit",
        title: "Submit a Citizen Situation",
        description: "Propose a new everyday legal situation for moderator verification.",
        href: routes.submitSituation,
        icon: PlusCircle,
      },
    ],
    primaryCta: {
      label: "Open Multilingual Voice & Action Engine",
      description: "Speak what happened, find verified helplines & prepare a citizen draft",
      href: routes.actionCenter,
      icon: Mic,
    },
  },
  {
    id: "learn",
    label: "Learn",
    shortLabel: "Learn",
    href: routes.learn,
    icon: BookOpen,
    eyebrow: "Verified Legal Curriculum",
    headline: "Structured Learning Journeys & Indian Law Library",
    subheadline:
      "Master your rights through bite-sized lessons, constitutional articles, landmark precedents, and scenario simulations.",
    featuredItems: [
      {
        id: "journey-fundamental",
        title: "Fundamental & Constitutional Rights",
        description: "Articles 14, 19, 21, Zero FIR safeguards & citizen liberty.",
        href: "/learn/fundamental-rights",
        icon: Scale,
        badge: "Core",
        badgeTone: "brand",
      },
      {
        id: "journey-cyber",
        title: "Cyber Safety & Digital Financial Rights",
        description: "UPI safety, 1930 CFCFRMS lien workflow & IT Act protections.",
        href: "/learn/cyber-safety",
        icon: ShieldCheck,
        badge: "Popular",
        badgeTone: "emerald",
      },
      {
        id: "journey-consumer",
        title: "Consumer Rights & E-Commerce Remedies",
        description: "Product liability, dark patterns, NCH 1915 & e-Daakhil filing.",
        href: "/learn/consumer-rights",
        icon: BookOpen,
      },
      {
        id: "journey-student",
        title: "Student & Campus Rights",
        description: "UGC fee refund regulations, anti-ragging & certificate rights.",
        href: "/learn/student-rights",
        icon: Target,
      },
      {
        id: "journey-workplace",
        title: "Workplace Rights & Wage Redressal",
        description: "Employment contracts, unpaid dues, POSH & labour remedies.",
        href: "/learn/workplace-rights",
        icon: FolderKanban,
      },
      {
        id: "journey-traffic",
        title: "Traffic Rules & Commuter Rights",
        description: "DigiLocker/mParivahan validity, virtual courts & e-challans.",
        href: "/learn/traffic-rules",
        icon: Compass,
      },
    ],
    secondaryItems: [
      {
        id: "lib-laws",
        title: "Constitutional Articles & Acts Library",
        description: "Plain-English breakdowns of Indian statutes & provisions.",
        href: routes.laws,
        icon: Scale,
      },
      {
        id: "lib-precedents",
        title: "Supreme Court Landmark Precedents",
        description: "Puttaswamy, D.K. Basu, Vishaka & Shreya Singhal case studies.",
        href: routes.caseStudies,
        icon: Gavel,
      },
      {
        id: "lib-scenarios",
        title: "Interactive Practice Scenarios",
        description: "Roleplay real decisions and earn +25 XP per scenario.",
        href: routes.scenarios,
        icon: Brain,
      },
      {
        id: "lib-glossary",
        title: "Legal Glossary & Knowledge Graph",
        description: "Decode legal terms and track your domain mastery.",
        href: routes.glossary,
        icon: FileText,
      },
    ],
    primaryCta: {
      label: "Open Full Learning Academy",
      description: "10 structured journeys, quizzes, certificates & knowledge radar",
      href: routes.learn,
      icon: BookOpen,
    },
  },
  {
    id: "community",
    label: "Community",
    shortLabel: "Community",
    href: routes.community,
    icon: Users,
    eyebrow: "Citizen Voice & Story-to-Learning Network",
    headline: "Real Experiences Bridged to Verified Law",
    subheadline:
      "Read how fellow citizens resolved real disputes—complete with redacted evidence, voice notes, and statutory learning bridges.",
    featuredItems: [
      {
        id: "comm-feed",
        title: "Citizen Stories Hub",
        description: "Discover verified-linked stories across Consumer, Cyber, Tenancy & FIR rights.",
        href: routes.community,
        icon: Users,
        badge: "Live",
        badgeTone: "emerald",
      },
      {
        id: "comm-share",
        title: "Share Your Situation Story",
        description: "7-step PII-redacted studio with image, voice note & video upload.",
        href: routes.communityShare,
        icon: PlusCircle,
        badge: "Contribute",
        badgeTone: "brand",
      },
      {
        id: "comm-media",
        title: "Voice Notes & Video Walkthroughs",
        description: "Listen to 1930 call walkthroughs and uncut unboxing evidence guides.",
        href: "/community/stories/recovered-38000-fake-parcel-upi-scam-using-1930-within-22-minutes",
        icon: Mic,
      },
      {
        id: "comm-mine",
        title: "My Stories & Private Drafts",
        description: "Manage your published contributions, drafts, and visibility controls.",
        href: routes.communityMyStories,
        icon: FolderKanban,
      },
    ],
    secondaryItems: [
      {
        id: "comm-moderation",
        title: "Trust & Safety Verification Queue",
        description: "Moderator review for citizen situations, stories & AI quizzes.",
        href: routes.moderation,
        icon: ShieldCheck,
      },
      {
        id: "comm-analytics",
        title: "Realtime Legal Learning Velocity",
        description: "Live national awareness metrics across Indian legal domains.",
        href: routes.analytics,
        icon: Activity,
      },
    ],
    primaryCta: {
      label: "Share Your Experience With the Community",
      description: "Help another citizen recognize red flags and learn their rights",
      href: routes.communityShare,
      icon: PlusCircle,
    },
  },
  {
    id: "ai",
    label: "Nyaya AI",
    shortLabel: "Nyaya AI",
    href: routes.ai,
    icon: Sparkles,
    eyebrow: "Grounded Legal-Education Companion",
    headline: "Ask Nyaya AI — Grounded in Verified Indian Law",
    subheadline:
      "Every explanation is anchored to verified constitutional articles, central acts, and situation playbooks—never hallucinated.",
    featuredItems: [
      {
        id: "ai-companion",
        title: "Ask Nyaya AI Companion",
        description: "Get ELI15, step-by-step, or statutory breakdowns with source citations.",
        href: routes.ai,
        icon: Sparkles,
        badge: "Grounded RAG",
        badgeTone: "brand",
      },
      {
        id: "ai-explain",
        title: "Explain a Law or Section Simply",
        description: "Decode BNSS 2023, CPA 2019, RTI Act, or Article 21 in plain language.",
        href: "/ai?q=Explain+Section+173+BNSS+Zero+FIR+in+simple+steps",
        icon: Scale,
      },
      {
        id: "ai-understand",
        title: "Understand a Situation Step-by-Step",
        description: "Walk through what to document and which helpline to contact first.",
        href: "/ai?q=My+ecommerce+refund+was+rejected+after+open+box+delivery+what+can+I+do",
        icon: Compass,
      },
      {
        id: "ai-practice",
        title: "Practice an Interactive Legal Scenario",
        description: "Test your decision-making in realistic roleplay simulations.",
        href: routes.scenarios,
        icon: Brain,
        badge: "+25 XP",
        badgeTone: "emerald",
      },
    ],
    secondaryItems: [
      {
        id: "ai-bookmarks",
        title: "Saved AI Explanations & Bookmarks",
        description: "Revisit your saved statutory summaries and research notes.",
        href: routes.aiBookmarks,
        icon: Bookmark,
      },
      {
        id: "ai-knowledge",
        title: "Personal Legal Knowledge Radar",
        description: "View your weak areas and AI-recommended lessons.",
        href: routes.knowledge,
        icon: Target,
      },
    ],
    primaryCta: {
      label: "Launch Nyaya AI Learning Companion",
      description: "Ask any question in English, Hindi, or Hinglish with verified sources",
      href: routes.ai,
      icon: Sparkles,
    },
  },
];

/**
 * Route-aware navigation matcher that understands nested hierarchies
 * without brittle hardcoded string lists.
 */
export function matchActiveNavSection(pathname: string): PrimaryNavId | null {
  if (!pathname || pathname === "/") return null;

  if (pathname.startsWith("/situations") || pathname.startsWith("/action-center")) {
    return "situations";
  }

  if (
    pathname.startsWith("/learn") ||
    pathname.startsWith("/laws") ||
    pathname.startsWith("/case-studies") ||
    pathname.startsWith("/glossary")
  ) {
    return "learn";
  }

  if (
    pathname.startsWith("/community") ||
    pathname.startsWith("/moderation") ||
    pathname.startsWith("/analytics")
  ) {
    return "community";
  }

  if (pathname.startsWith("/ai")) {
    return "ai";
  }

  return null;
}

/**
 * Returns a route-contextual search placeholder so the search bar
 * feels aware of the user's current environment.
 */
export function getContextualSearchPlaceholder(pathname: string): string {
  if (pathname.startsWith("/action-center")) {
    return "Search NALSA 15100, Cyber 1930, Consumer 1915, RTI...";
  }
  if (pathname.startsWith("/community")) {
    return "Search citizen stories, 1930, Zero FIR...";
  }
  if (pathname.startsWith("/learn")) {
    return "Search journeys, lessons, legal concepts...";
  }
  if (pathname.startsWith("/situations")) {
    return "Describe what happened (e.g. deposit, scam)...";
  }
  if (pathname.startsWith("/laws") || pathname.startsWith("/case-studies")) {
    return "Search Article 21, CPA 2019, precedents...";
  }
  return "Search situations, laws, lessons, stories...";
}

/**
 * Returns a contextual pill descriptor for the current route context.
 */
export function getContextualRouteBadge(pathname: string): {
  label: string;
  accent: string;
} | null {
  if (pathname.startsWith("/action-center")) {
    return { label: "Citizen Action Engine", accent: "text-amber-500" };
  }
  if (pathname.startsWith("/community/share")) {
    return { label: "Story Studio", accent: "text-brand" };
  }
  if (pathname.startsWith("/community")) {
    return { label: "Community Voice", accent: "text-emerald-500" };
  }
  if (pathname.startsWith("/learn/scenarios")) {
    return { label: "Practice Lab", accent: "text-amber-500" };
  }
  if (pathname.startsWith("/learn")) {
    return { label: "Learning Academy", accent: "text-brand" };
  }
  if (pathname.startsWith("/situations")) {
    return { label: "Situation Triage", accent: "text-amber-500" };
  }
  if (pathname.startsWith("/ai")) {
    return { label: "Grounded AI", accent: "text-brand" };
  }
  return null;
}
