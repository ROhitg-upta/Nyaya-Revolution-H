/**
 * AI Learning Companion content — response modes, suggested questions,
 * follow-up templates, and welcome content.
 */
import {
  type LucideIcon,
  BookOpen,
  Brain,
  Briefcase,
  Compass,
  FileText,
  Gavel,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Scale,
  ShieldCheck,
  Sparkles,
  Zap,
} from "@/lib/icons";
import type { FollowUpSuggestion, ResponseMode, ResponseModeId } from "@/types";

export const responseModes: ResponseMode[] = [
  {
    id: "eli15",
    label: "Explain Like I'm 15",
    description: "Simple language, relatable examples, no jargon.",
    icon: Lightbulb,
  },
  {
    id: "detailed",
    label: "Detailed Explanation",
    description: "Comprehensive analysis with context and nuance.",
    icon: BookOpen,
  },
  {
    id: "legal",
    label: "Legal Language",
    description: "Formal legal terminology with act/section references.",
    icon: Gavel,
  },
  {
    id: "summary",
    label: "Quick Summary",
    description: "Key points in under 60 seconds of reading.",
    icon: Zap,
  },
  {
    id: "step-by-step",
    label: "Step-by-Step Guide",
    description: "Numbered action plan you can follow immediately.",
    icon: ListChecks,
  },
];

export function getResponseMode(id: ResponseModeId): ResponseMode {
  return responseModes.find((m) => m.id === id) ?? responseModes[0];
}

export interface SuggestedQuestion {
  question: string;
  icon: LucideIcon;
  category: string;
}

export const suggestedQuestions: SuggestedQuestion[] = [
  {
    question: "My landlord is refusing to return my security deposit",
    icon: Briefcase,
    category: "Tenants",
  },
  {
    question: "I received a fake online payment link — what should I do?",
    icon: ShieldCheck,
    category: "Cyber Crime",
  },
  {
    question: "My employer hasn't paid my salary for 2 months",
    icon: Scale,
    category: "Workers",
  },
  {
    question: "I bought a phone online and received a different product",
    icon: FileText,
    category: "Consumer",
  },
  {
    question: "Someone is harassing me on social media with fake photos",
    icon: ShieldCheck,
    category: "Cyber Crime",
  },
  {
    question: "My college is charging hidden fees not mentioned in the prospectus",
    icon: GraduationCap,
    category: "Students",
  },
];

export const quickTopics = [
  { label: "Know your FIR rights", icon: Scale },
  { label: "Consumer complaint process", icon: FileText },
  { label: "Workplace harassment laws", icon: ShieldCheck },
  { label: "Tenant protection basics", icon: Briefcase },
];

export const welcomeMessage = {
  greeting: "Welcome to your AI Legal Tutor",
  subtitle:
    "I help you understand your legal rights through structured, situation-based guidance. Ask me anything about Indian law — I'll break it down step by step.",
  disclaimer:
    "I provide educational guidance, not legal advice. Always consult a qualified professional for your specific case.",
};

export const defaultFollowUps: FollowUpSuggestion[] = [
  {
    type: "situation",
    label: "Explore related situations",
    description: "Browse similar real-life scenarios and their legal solutions.",
    href: "/situations",
  },
  {
    type: "course",
    label: "Start a learning journey",
    description: "Build deeper understanding through structured lessons.",
    href: "/learn",
  },
  {
    type: "quiz",
    label: "Test your knowledge",
    description: "Quick quiz to reinforce what you just learned.",
  },
  {
    type: "story",
    label: "Read community stories",
    description: "Learn from experiences shared by fellow citizens.",
  },
];

export interface ResponseSectionMeta {
  key: string;
  title: string;
  icon: LucideIcon;
  color: string;
}

export const responseSections: ResponseSectionMeta[] = [
  { key: "situationSummary", title: "Situation Summary", icon: Compass, color: "text-brand" },
  { key: "rights", title: "Your Rights", icon: ShieldCheck, color: "text-success" },
  { key: "laws", title: "Relevant Laws", icon: Gavel, color: "text-brand" },
  { key: "immediateActions", title: "Immediate Action Steps", icon: Zap, color: "text-warning" },
  { key: "documentsRequired", title: "Documents Required", icon: FileText, color: "text-muted-foreground" },
  { key: "authorities", title: "Authorities to Contact", icon: Briefcase, color: "text-brand" },
  { key: "commonMistakes", title: "Common Mistakes to Avoid", icon: ShieldCheck, color: "text-destructive" },
  { key: "learningJourney", title: "Related Learning Journey", icon: Brain, color: "text-brand" },
  { key: "quiz", title: "Practice Quiz", icon: GraduationCap, color: "text-success" },
  { key: "professionalHelp", title: "Need Professional Help?", icon: Sparkles, color: "text-warning" },
];
