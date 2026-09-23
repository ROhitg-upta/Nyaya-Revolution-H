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
  ArrowLeft,
  ArrowRight,
  AtSign,
  Award,
  BadgeCheck,
  Bot,
  BookOpen,
  BookMarked,
  Brain,
  Briefcase,
  Building2,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Compass,
  CreditCard,
  Eye,
  EyeOff,
  Filter,
  Flame,
  Gavel,
  Globe,
  GraduationCap,
  HardHat,
  HeartHandshake,
  HelpCircle,
  Inbox,
  KeyRound,
  Landmark,
  Library,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MailCheck,
  MailOpen,
  Menu,
  MessageCircle,
  MessagesSquare,
  Minus,
  Moon,
  MousePointerClick,
  PartyPopper,
  Quote,
  Receipt,
  RefreshCw,
  Rocket,
  Route,
  Scale,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Target,
  TrafficCone,
  TrendingUp,
  Trophy,
  User,
  UserPlus,
  UserX,
  Users,
  X,
  Zap,
} from "lucide-react";

// Learning platform icons.
export {
  BarChart3,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Clock,
  Crown,
  Layers,
  Lightbulb,
  Medal,
  NotebookPen,
  PencilLine,
  Play,
  RotateCcw,
  Timer,
  XCircle,
} from "lucide-react";

// AI Learning Companion icons.
export { ExternalLink, Hash, Pin, Plus, Square, Trash2 } from "lucide-react";

// Situation Engine icons.
export {
  Accessibility,
  Ban,
  CircleAlert,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  Download,
  FileText,
  Flag,
  HandCoins,
  Home,
  Hospital,
  Info,
  ListChecks,
  MapPin,
  Phone,
  PhoneCall,
  ScrollText,
  Siren,
  TriangleAlert,
  UserRound,
} from "lucide-react";

// Aliases for Base UI / Shadcn conventions
export {
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  X as XIcon,
  CircleCheck as CircleCheckIcon,
  Info as InfoIcon,
  TriangleAlert as TriangleAlertIcon,
  OctagonX as OctagonXIcon,
  Loader2 as Loader2Icon,
} from "lucide-react";
