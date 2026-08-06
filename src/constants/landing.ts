/**
 * Landing page content — a single, typed source of truth for every section.
 *
 * Keeping copy and structure here (rather than inline in JSX) means sections
 * stay presentational and content is easy to review, translate, or later move
 * to a CMS. All values below are marketing placeholders / illustrative demo
 * content for a pre-launch product.
 */
import {
  type LucideIcon,
  Award,
  BadgeCheck,
  Bot,
  BookOpen,
  Brain,
  Building2,
  CarFront,
  CreditCard,
  Gavel,
  GraduationCap,
  HardHat,
  HeartHandshake,
  KeyRound,
  Landmark,
  Lock,
  MessagesSquare,
  MousePointerClick,
  Receipt,
  Rocket,
  Route,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrafficCone,
  TrendingUp,
  UserX,
  Users,
} from "@/lib/icons";

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Categories", href: "#categories" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

export interface TrustBadge {
  icon: LucideIcon;
  label: string;
}

export const trustBadges: TrustBadge[] = [
  { icon: BadgeCheck, label: "Reviewed legal content" },
  { icon: Lock, label: "Privacy-first" },
  { icon: Sparkles, label: "Free to learn" },
];

export interface Stat {
  /** Numeric target for the animated counter. */
  value: number;
  /** Rendered before the number (e.g. currency). */
  prefix?: string;
  /** Rendered after the number (e.g. "M+", "%"). */
  suffix?: string;
  label: string;
}

/** NOTE: Illustrative demo figures for a pre-launch product — not measured. */
export const stats: Stat[] = [
  { value: 80, suffix: "%", label: "Citizens unaware of their legal rights" },
  { value: 8, suffix: "+", label: "Legal categories covered" },
  { value: 40, suffix: "+", label: "Guided learning paths" },
  { value: 1, suffix: "M+", label: "Community size we're building toward" },
];

export interface Category {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export const categories: Category[] = [
  {
    icon: TrafficCone,
    title: "Traffic",
    description: "Fines, licences, and what to do after a stop or challan.",
    href: "#",
  },
  {
    icon: ShieldAlert,
    title: "Cyber",
    description: "Online fraud, data misuse, and reporting cybercrime.",
    href: "#",
  },
  {
    icon: ShoppingBag,
    title: "Consumer",
    description: "Refunds, warranties, and filing consumer complaints.",
    href: "#",
  },
  {
    icon: HeartHandshake,
    title: "Women",
    description: "Safety, workplace rights, and protection under the law.",
    href: "#",
  },
  {
    icon: GraduationCap,
    title: "Students",
    description: "Ragging, admissions, scholarships, and campus rights.",
    href: "#",
  },
  {
    icon: HardHat,
    title: "Workers",
    description: "Wages, contracts, safety, and wrongful termination.",
    href: "#",
  },
  {
    icon: Building2,
    title: "Tenants",
    description: "Deposits, evictions, and rent agreement essentials.",
    href: "#",
  },
  {
    icon: Landmark,
    title: "Constitution",
    description: "Fundamental rights and the duties every citizen holds.",
    href: "#",
  },
];

export interface Situation {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
  href: string;
}

export const situations: Situation[] = [
  {
    icon: KeyRound,
    title: "My landlord won't return my deposit",
    description: "Know the notice period, evidence, and where to escalate.",
    tag: "Tenants",
    href: "#",
  },
  {
    icon: CreditCard,
    title: "I was scammed by a fake online store",
    description: "Freeze the damage, gather proof, and file a cyber complaint.",
    tag: "Cyber",
    href: "#",
  },
  {
    icon: CarFront,
    title: "I had a road accident",
    description: "Your rights at the scene, FIR basics, and insurance steps.",
    tag: "Traffic",
    href: "#",
  },
  {
    icon: UserX,
    title: "I'm facing harassment at work",
    description: "Understand ICC, documentation, and safe reporting routes.",
    tag: "Women",
    href: "#",
  },
  {
    icon: Receipt,
    title: "A product I bought is defective",
    description: "Refund rights, warranty claims, and the complaint ladder.",
    tag: "Consumer",
    href: "#",
  },
];

export interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const steps: Step[] = [
  {
    icon: MousePointerClick,
    title: "Choose your situation",
    description: "Start from a real-life scenario, not a legal textbook.",
  },
  {
    icon: BookOpen,
    title: "Learn your rights",
    description: "Plain-language explanations of exactly what applies to you.",
  },
  {
    icon: Brain,
    title: "Practice with a quiz",
    description: "Short checks that make the knowledge actually stick.",
  },
  {
    icon: Rocket,
    title: "Take action confidently",
    description: "Know your next step, the right forum, and what to say.",
  },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export const features: Feature[] = [
  {
    icon: Bot,
    title: "AI Tutor",
    description: "Ask follow-up questions and get patient, sourced guidance.",
    badge: "Coming soon",
  },
  {
    icon: Route,
    title: "Learning Paths",
    description:
      "Structured journeys that build rights knowledge step by step.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "See streaks, mastery, and what to revisit next.",
  },
  {
    icon: MessagesSquare,
    title: "Community Stories",
    description: "Learn from real experiences shared by fellow citizens.",
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Earn shareable proof as you complete each learning path.",
  },
  {
    icon: Gavel,
    title: "Lawyer Directory",
    description: "Find verified professionals when you need real help.",
    badge: "Coming soon",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

/** NOTE: Illustrative demo testimonials — not real users. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "I finally understood my tenant rights in an afternoon. The situation-first approach just clicks.",
    name: "Aarav Sharma",
    role: "Student, Delhi",
    initials: "AS",
  },
  {
    quote:
      "After an online scam I felt helpless. This showed me exactly what to do, step by step.",
    name: "Priya Nair",
    role: "Designer, Bengaluru",
    initials: "PN",
  },
  {
    quote:
      "Clear, calm, and practical. It's like a knowledgeable friend explaining the law without the jargon.",
    name: "Rohan Mehta",
    role: "Small business owner, Pune",
    initials: "RM",
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "Is Nyaya Revolution a substitute for a lawyer?",
    answer:
      "No. It's an educational platform that helps you understand your rights and options. For advice on a specific case, always consult a qualified legal professional.",
  },
  {
    question: "Is the platform free to use?",
    answer:
      "Core learning content is designed to be free so that access to legal awareness is never blocked by cost. Some advanced features may come later.",
  },
  {
    question: "How is the legal content kept accurate?",
    answer:
      "Content is written in plain language and reviewed against current statutes and guidelines, with clear disclaimers where the law varies by state or situation.",
  },
  {
    question: "Which regions does the content cover?",
    answer:
      "The initial focus is Indian law and everyday situations Indian citizens face. Coverage will expand over time based on community needs.",
  },
  {
    question: "Do I need to create an account to start?",
    answer:
      "You can explore situations and categories freely. Accounts (coming later) will unlock progress tracking, quizzes, and certificates.",
  },
];

export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Learn",
    links: [
      { label: "Categories", href: "#categories" },
      { label: "Real situations", href: "#situations" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "FAQ", href: "#faq" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Mission", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  },
];

export const heroHighlights: TrustBadge[] = [
  { icon: ShieldCheck, label: "Situation-first learning" },
  { icon: Users, label: "Built for every citizen" },
];
