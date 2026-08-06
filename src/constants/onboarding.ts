/**
 * Onboarding option data — the selectable choices for each wizard step.
 * Presentational content only; no legal material or backend logic.
 */
import {
  type LucideIcon,
  Bot,
  Brain,
  Briefcase,
  Building2,
  CreditCard,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Lock,
  MousePointerClick,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrafficCone,
  Users,
  UserX,
} from "@/lib/icons";
import type {
  AgeGroup,
  InterestId,
  LanguagePreference,
  LearningGoal,
  Occupation,
} from "@/types";

export interface Option<T> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export const ageGroups: Option<AgeGroup>[] = [
  { value: "under-18", label: "Under 18" },
  { value: "18-24", label: "18–24" },
  { value: "25-34", label: "25–34" },
  { value: "35-49", label: "35–49" },
  { value: "50-plus", label: "50+" },
];

export const languages: Option<LanguagePreference>[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "bilingual", label: "Both" },
];

export const occupations: Option<Occupation>[] = [
  { value: "student", label: "Student", icon: GraduationCap },
  {
    value: "working-professional",
    label: "Working Professional",
    icon: Briefcase,
  },
  { value: "business-owner", label: "Business Owner", icon: Building2 },
  { value: "freelancer", label: "Freelancer", icon: Rocket },
  { value: "homemaker", label: "Homemaker", icon: HeartHandshake },
  { value: "senior-citizen", label: "Senior Citizen", icon: Users },
  { value: "other", label: "Other", icon: Sparkles },
];

export const interests: Option<InterestId>[] = [
  { value: "traffic", label: "Traffic Laws", icon: TrafficCone },
  { value: "cyber-safety", label: "Cyber Safety", icon: ShieldAlert },
  { value: "consumer", label: "Consumer Rights", icon: ShoppingBag },
  { value: "women", label: "Women Rights", icon: HeartHandshake },
  { value: "employment", label: "Employment Laws", icon: Briefcase },
  { value: "tenant", label: "Tenant Rights", icon: Building2 },
  { value: "constitution", label: "Constitution", icon: Landmark },
  { value: "govt-services", label: "Government Services", icon: ShieldCheck },
  { value: "digital-privacy", label: "Digital Privacy", icon: Lock },
  { value: "financial-fraud", label: "Financial Fraud", icon: CreditCard },
];

export const learningGoals: Option<LearningGoal>[] = [
  {
    value: "know-rights",
    label: "I want to know my rights",
    description: "Understand what protections you already have.",
    icon: ShieldCheck,
  },
  {
    value: "competitive-exams",
    label: "Prepare for competitive exams",
    description: "Build strong legal fundamentals with practice.",
    icon: Brain,
  },
  {
    value: "practical-laws",
    label: "Learn practical laws",
    description: "Everyday rules that actually affect your life.",
    icon: MousePointerClick,
  },
  {
    value: "protect-family",
    label: "Protect my family",
    description: "Be ready to act when it matters most.",
    icon: HeartHandshake,
  },
  {
    value: "legally-aware",
    label: "Become legally aware",
    description: "A well-rounded, confident understanding of the law.",
    icon: Sparkles,
  },
];

/** Icons reused by the journey-preview step (kept here to avoid re-imports). */
export const previewIcons = {
  ai: Bot,
  harassment: UserX,
  users: Users,
} as const;
