/**
 * Icon strategy.
 *
 * The design system standardises on **lucide-react** — a single, tree-shakeable,
 * consistently-drawn icon set (24×24 grid, 2px stroke). Rules:
 *
 * 1. Import icons from this module, not directly from `lucide-react`, so the
 *    icon library can be swapped or wrapped in exactly one place.
 * 2. Size icons with Tailwind (`size-4`, `size-5`) — never hardcode width/height.
 * 3. Colour inherits from `currentColor`; drive it with text colour tokens.
 * 4. Decorative icons get `aria-hidden`; meaningful icons need an accessible
 *    label on the icon or its control.
 *
 * The `LucideIcon` type lets components accept an icon as a prop
 * (e.g. `icon: LucideIcon`) rather than a rendered node.
 */
export type { LucideIcon, LucideProps } from "lucide-react";

// Re-export the icons the app uses. Extend this curated set as shared
// components need more so the icon library stays swappable in one place.
export {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  AtSign,
  Award,
  BadgeCheck,
  Bot,
  BookOpen,
  Brain,
  Building2,
  CarFront,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  CreditCard,
  Gavel,
  Globe,
  GraduationCap,
  HardHat,
  HeartHandshake,
  Inbox,
  KeyRound,
  Landmark,
  Loader2,
  Lock,
  Mail,
  Menu,
  MessageCircle,
  MessagesSquare,
  Minus,
  Moon,
  MousePointerClick,
  Quote,
  Receipt,
  RefreshCw,
  Rocket,
  Route,
  Scale,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  TrafficCone,
  TrendingUp,
  UserX,
  Users,
  X,
} from "lucide-react";
