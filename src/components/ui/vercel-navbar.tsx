"use client";

import * as React from "react";
import { useCallback, useEffect, useState, type ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Activity,
  Award,
  Bookmark,
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  Building2,
  CirclePlus,
  Compass,
  FileText,
  FolderKanban,
  Gavel,
  Languages,
  LogOut,
  Menu,
  Mic,
  Monitor,
  Moon,
  Phone,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  User,
  Users,
} from "lucide-react";

import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getContextualRouteBadge } from "@/constants/navigation";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

interface MegaNavItem {
  title: string;
  icon: ReactElement;
  href: string;
  description: string;
  badge?: string;
}

// ============================================================================
// MENU 1: WHAT HAPPENED? (SITUATIONS, URGENT TRIAGE & CITIZEN ACTION ENGINE)
// ============================================================================
const urgentTriageItems: MegaNavItem[] = [
  {
    title: "Cyber Scam & UPI Fraud (1930)",
    href: "/situations/upi-fraud",
    icon: <ShieldAlert className="size-4" strokeWidth={2} />,
    description: "Golden-hour bank lien freeze & RBI zero-liability steps",
    badge: "1930",
  },
  {
    title: "Police Refusing to File FIR",
    href: "/situations/police-complaint-fir",
    icon: <ShieldCheck className="size-4" strokeWidth={2} />,
    description: "Zero FIR & e-FIR rights under Section 173 of BNSS 2023",
    badge: "BNSS 173",
  },
  {
    title: "Defective Product & Refund Denied",
    href: "/situations/defective-product",
    icon: <Scale className="size-4" strokeWidth={2} />,
    description: "National Consumer Helpline 1915 & CPA 2019 remedies",
  },
];

const everydaySituationItems: MegaNavItem[] = [
  {
    title: "Landlord Keeping Security Deposit",
    href: "/situations/landlord-withholding-deposit",
    icon: <Building2 className="size-4" strokeWidth={2} />,
    description: "Move-out inspection proof, wear-and-tear & demand notice",
  },
  {
    title: "Unpaid Salary or Relieving Letter",
    href: "/situations/employer-not-paying-salary",
    icon: <Briefcase className="size-4" strokeWidth={2} />,
    description: "Full & final settlement rights & SAMADHAN conciliation",
  },
  {
    title: "Browse All 60+ Situation Playbooks",
    href: routes.situations,
    icon: <Compass className="size-4" strokeWidth={2} />,
    description: "Step-by-step Do's, Don'ts, and evidence checklists",
  },
];

const citizenActionItems: MegaNavItem[] = [
  {
    title: "Multilingual Voice Input (Hindi/Hinglish)",
    href: routes.actionCenter,
    icon: <Mic className="size-4" strokeWidth={2} />,
    description: "Speak in your own words with editable transcript review",
    badge: "New E11",
  },
  {
    title: "Verified Legal Aid Directory (15100)",
    href: "/action-center?category=Fundamental+Rights",
    icon: <Phone className="size-4" strokeWidth={2} />,
    description: "NALSA, State SLSAs, NCH 1915, Cyber 1930 & Central/State RTI",
  },
  {
    title: "Printable A4 Citizen Draft Studio",
    href: "/action-center?template=consumer-grievance-v1",
    icon: <FileText className="size-4" strokeWidth={2} />,
    description: "Versioned consumer, RTI, cyber & wage templates (v1)",
  },
];

// ============================================================================
// MENU 2: LEARN & STATUTORY VAULT (ACADEMY, RIGHTS, CASE STUDIES & MASTERY)
// ============================================================================
const academyItems: MegaNavItem[] = [
  {
    title: "Structured Legal Learning Journeys",
    href: routes.learn,
    icon: <BookOpen className="size-4" strokeWidth={2} />,
    description: "10 guided tracks across Consumer, Cyber, Student & Labour law",
  },
  {
    title: "Interactive Roleplay Scenarios",
    href: routes.scenarios,
    icon: <Brain className="size-4" strokeWidth={2} />,
    description: "Practice real-world legal decisions and earn +25 XP",
    badge: "+25 XP",
  },
  {
    title: "Personal Legal Knowledge Radar",
    href: routes.knowledge,
    icon: <Target className="size-4" strokeWidth={2} />,
    description: "Track domain mastery, streaks, and AI recommendations",
  },
];

const statutoryVaultItems: MegaNavItem[] = [
  {
    title: "Constitutional Rights & Articles",
    href: routes.laws,
    icon: <Gavel className="size-4" strokeWidth={2} />,
    description: "Articles 14, 19, 21, 22 & 39A decoded in plain language",
  },
  {
    title: "Landmark Supreme Court Precedents",
    href: routes.caseStudies,
    icon: <Shield className="size-4" strokeWidth={2} />,
    description: "Puttaswamy, D.K. Basu, Vishaka & Shreya Singhal ratios",
  },
  {
    title: "Plain-Language Legal Glossary",
    href: routes.glossary,
    icon: <Languages className="size-4" strokeWidth={2} />,
    description: "Zero FIR, Cognizable Offence, Lien Freeze & BNS/BNSS terms",
  },
];

const citizenToolsItems: MegaNavItem[] = [
  {
    title: "Learner Profile & Certificates",
    href: routes.learnProfile,
    icon: <Award className="size-4" strokeWidth={2} />,
    description: "View your verified XP level, badges & course certificates",
  },
  {
    title: "Saved AI Explanations & Notes",
    href: routes.aiBookmarks,
    icon: <Bookmark className="size-4" strokeWidth={2} />,
    description: "Revisit bookmarked statutory breakdowns anytime",
  },
  {
    title: "Submit a Citizen Situation",
    href: routes.submitSituation,
    icon: <CirclePlus className="size-4" strokeWidth={2} />,
    description: "Propose a new everyday scenario for moderator review",
  },
];

// ============================================================================
// MENU 3: COMMUNITY VOICE & GROUNDED NYAYA AI
// ============================================================================
const communityVoiceItems: MegaNavItem[] = [
  {
    title: "Citizen Situation Stories Feed",
    href: routes.community,
    icon: <Users className="size-4" strokeWidth={2} />,
    description: "Real citizen experiences connected to verified legal learning",
  },
  {
    title: "Share Your Story (7-Step Studio)",
    href: routes.communityShare,
    icon: <CirclePlus className="size-4" strokeWidth={2} />,
    description: "PII-redacted story wizard with voice, photo & video upload",
  },
  {
    title: "My Stories & Private Drafts",
    href: routes.communityMyStories,
    icon: <FolderKanban className="size-4" strokeWidth={2} />,
    description: "Manage your published stories, anonymity & drafts",
  },
];

const groundedAiItems: MegaNavItem[] = [
  {
    title: "Nyaya AI Learning Companion",
    href: routes.ai,
    icon: <Sparkles className="size-4" strokeWidth={2} />,
    description: "Grounded RAG companion anchored strictly to verified statutes",
  },
  {
    title: "Decode a Section or Act (ELI15)",
    href: "/ai?q=Explain+Section+173+BNSS+Zero+FIR+in+simple+steps",
    icon: <Bot className="size-4" strokeWidth={2} />,
    description: "Ask in English, Hindi, or Hinglish with source citations",
  },
  {
    title: "Trust, Moderation & Live Velocity",
    href: routes.analytics,
    icon: <Activity className="size-4" strokeWidth={2} />,
    description: "Realtime learning velocity across Indian legal domains",
  },
];

const HeaderSingletonContext = React.createContext(false);

export function Header() {
  const alreadyRenderedInTree = React.useContext(HeaderSingletonContext);
  const pathname = usePathname() || "/";
  const { user, status, signOut } = useAuth();
  const isAuthenticated = status === "authenticated";

  const [scrolled, setScrolled] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const routeBadge = getContextualRouteBadge(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (alreadyRenderedInTree) {
    return null;
  }

  const userDisplayName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "Citizen Learner";

  const userEmail = user?.email || "verified.citizen@nyaya.in";
  const userInitials = userDisplayName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <style>{`header[data-nyaya-navbar="true"] ~ header[data-nyaya-navbar="true"], header[data-nyaya-navbar="true"] ~ * header[data-nyaya-navbar="true"] { display: none !important; }`}</style>
      <header
        data-nyaya-navbar="true"
        className={cn(
          "bg-background/90 sticky top-0 z-50 flex h-16 w-full items-center justify-between px-4 backdrop-blur-xl transition-all duration-300 sm:px-6",
          scrolled
            ? "border-border/80 border-b shadow-xs"
            : "border-border/30 border-b"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
          {/* Left Cluster: Nyaya Brand Wordmark + Vercel-Style Mega Navigation */}
          <div className="flex h-14 items-center gap-2 lg:gap-5">
            <Link
              href={routes.home}
              className="group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="bg-foreground text-background flex size-9 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105">
                <Scale className="size-4.5" strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground text-base font-extrabold tracking-tight">
                    Nyaya
                  </span>
                  <span className="border-border bg-muted/70 text-muted-foreground hidden rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold sm:inline-block">
                    INDIA
                  </span>
                  {routeBadge && (
                    <span
                      className={cn(
                        "bg-muted/80 hidden rounded-full px-2 py-0.5 text-[10px] font-bold xl:inline-block",
                        routeBadge.accent
                      )}
                    >
                      {routeBadge.label}
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground hidden text-[10px] leading-none font-medium sm:block">
                  Situation-First Legal Platform
                </span>
              </div>
            </Link>

            {/* Desktop Vercel-Style Mega Menu */}
            <NavigationMenu className="ml-2 hidden lg:flex" viewport={true}>
              <NavigationMenuList>
                {/* Mega Menu 1: What Happened? */}
                <NavigationMenuItem value="what-happened">
                  <NavigationMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-muted-foreground hover:text-foreground h-8 rounded-full px-3.5 text-xs font-medium",
                      (pathname.startsWith("/situations") ||
                        pathname.startsWith("/action-center")) &&
                        "bg-accent text-foreground font-semibold"
                    )}
                  >
                    What Happened?
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background/98 border-border/80 backdrop-blur-xl">
                    <ul className="grid w-[420px] grid-cols-1 gap-2 p-3 md:w-[820px] md:grid-cols-3">
                      <div>
                        <span className="text-muted-foreground block px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                          Urgent Financial & Safety
                        </span>
                        {urgentTriageItems.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            icon={component.icon}
                            href={component.href}
                            badge={component.badge}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </div>
                      <div>
                        <span className="text-muted-foreground block px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                          Everyday Citizen Disputes
                        </span>
                        {everydaySituationItems.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            icon={component.icon}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </div>
                      <div>
                        <span className="text-muted-foreground block px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                          Citizen Action Engine
                        </span>
                        {citizenActionItems.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            icon={component.icon}
                            href={component.href}
                            badge={component.badge}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </div>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Mega Menu 2: Learn & Law Vault */}
                <NavigationMenuItem value="learn-vault">
                  <NavigationMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-muted-foreground hover:text-foreground h-8 rounded-full px-3.5 text-xs font-medium",
                      (pathname.startsWith("/learn") ||
                        pathname.startsWith("/laws") ||
                        pathname.startsWith("/case-studies")) &&
                        "bg-accent text-foreground font-semibold"
                    )}
                  >
                    Learn & Laws
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background/98 border-border/80 backdrop-blur-xl">
                    <ul className="grid w-[420px] grid-cols-1 gap-2 p-3 md:w-[820px] md:grid-cols-3">
                      <div>
                        <span className="text-muted-foreground block px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                          Interactive Academy
                        </span>
                        {academyItems.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            icon={component.icon}
                            href={component.href}
                            badge={component.badge}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </div>
                      <div>
                        <span className="text-muted-foreground block px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                          Statutory & Rights Vault
                        </span>
                        {statutoryVaultItems.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            icon={component.icon}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </div>
                      <div>
                        <span className="text-muted-foreground block px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                          Citizen Progress & Tools
                        </span>
                        {citizenToolsItems.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            icon={component.icon}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </div>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Mega Menu 3: Community & Nyaya AI */}
                <NavigationMenuItem value="community-ai">
                  <NavigationMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-muted-foreground hover:text-foreground h-8 rounded-full px-3.5 text-xs font-medium",
                      (pathname.startsWith("/community") ||
                        pathname.startsWith("/ai")) &&
                        "bg-accent text-foreground font-semibold"
                    )}
                  >
                    Community & AI
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background/98 border-border/80 backdrop-blur-xl">
                    <ul className="grid w-[400px] grid-cols-1 gap-2 p-3 md:w-[620px] md:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground block px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                          Community Voice Network
                        </span>
                        {communityVoiceItems.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            icon={component.icon}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </div>
                      <div>
                        <span className="text-muted-foreground block px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                          Grounded Nyaya AI (RAG)
                        </span>
                        {groundedAiItems.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            icon={component.icon}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </div>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Direct Pill Links */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-muted-foreground hover:text-foreground h-8 rounded-full px-3.5 text-xs font-medium",
                      pathname.startsWith("/action-center") &&
                        "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold"
                    )}
                  >
                    <Link href={routes.actionCenter} className="inline-flex items-center gap-1.5">
                      <Mic className="size-3.5 text-amber-500" />
                      Voice & Legal Aid
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-muted-foreground hover:text-foreground h-8 rounded-full px-3.5 text-xs font-medium",
                      pathname.startsWith("/community") &&
                        "bg-accent text-foreground font-semibold"
                    )}
                  >
                    <Link href={routes.community}>Stories</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-muted-foreground hover:text-foreground h-8 rounded-full px-3.5 text-xs font-medium",
                      pathname.startsWith("/ai") &&
                        "bg-accent text-foreground font-semibold"
                    )}
                  >
                    <Link href={routes.ai}>Nyaya AI</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Cluster: Action Studio + Auth Avatar Dropdown with ThemeSwitcher */}
          <div className="flex items-center gap-2">
            {/* Quick Voice & Draft Action Button */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden rounded-full text-xs font-medium sm:inline-flex"
            >
              <Link href={routes.actionCenter}>
                <Mic className="mr-1 size-3.5 text-amber-500" />
                Speak / Draft
              </Link>
            </Button>

            {/* Conditional Auth Buttons: Only show Sign In if NOT authenticated */}
            {!isAuthenticated ? (
              <Button
                variant="default"
                size="sm"
                asChild
                className="hidden rounded-full px-3.5 text-xs font-semibold sm:inline-flex"
              >
                <Link href={routes.signIn}>Sign In</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden rounded-full text-xs font-medium md:inline-flex"
              >
                <Link href={routes.learn}>Dashboard</Link>
              </Button>
            )}

            {/* Vercel-Style Avatar Dropdown with Integrated ThemeSwitcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="User profile and theme settings"
                  className="focus-visible:ring-ring rounded-full transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Avatar className="border-border size-8 border">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                      alt={userDisplayName}
                    />
                    <AvatarFallback className="text-xs font-bold">
                      {isAuthenticated ? userInitials : "NR"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-72 rounded-2xl p-3 shadow-2xl"
                align="end"
              >
                <div className="p-2">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground text-sm font-semibold">
                      {isAuthenticated ? userDisplayName : "Nyaya Citizen Guest"}
                    </p>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {isAuthenticated ? "Verified" : "Guest Mode"}
                    </span>
                  </div>
                  <p className="text-muted-foreground truncate text-xs">
                    {isAuthenticated
                      ? userEmail
                      : "Sign in to sync XP, voice transcripts & drafts"}
                  </p>
                </div>

                <DropdownMenuSeparator className="-mx-1" />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="py-2.5">
                    <Link href={routes.learn} className="flex items-center justify-between">
                      <span>Learning Dashboard</span>
                      <BookOpen className="size-4 opacity-70" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2.5">
                    <Link href={routes.actionCenter} className="flex items-center justify-between">
                      <span>Multilingual Voice & Drafts</span>
                      <Mic className="size-4 text-amber-500" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2.5">
                    <Link href={routes.communityMyStories} className="flex items-center justify-between">
                      <span>My Citizen Stories</span>
                      <FolderKanban className="size-4 opacity-70" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2.5">
                    <Link href={routes.learnProfile} className="flex items-center justify-between">
                      <span>Profile & Certificates</span>
                      <User className="size-4 opacity-70" />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="-mx-1" />

                {/* Vercel-Style 3-Way Theme Switcher */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    keepOpenOnSelect
                    className="justify-between py-2.5"
                  >
                    <span className="text-xs font-medium">Theme</span>
                    <ThemeSwitcher />
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="-mx-1" />

                {isAuthenticated ? (
                  <DropdownMenuItem
                    onClick={() => void signOut()}
                    className="text-destructive justify-between py-2.5"
                  >
                    <span>Sign Out</span>
                    <LogOut className="size-4" strokeWidth={2} />
                  </DropdownMenuItem>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={routes.signIn}>Sign In</Link>
                    </Button>
                    <Button variant="default" size="sm" asChild className="w-full">
                      <Link href={routes.signUp}>Join Free</Link>
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Hamburger Drawer */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger
                className="hover:bg-muted inline-flex size-8 items-center justify-center rounded-lg lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto p-5">
                <SheetHeader className="border-border border-b pb-4 text-left">
                  <SheetTitle className="flex items-center gap-2 text-base font-bold">
                    <Scale className="size-4 text-amber-500" />
                    Nyaya Revolution
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-5">
                  <div className="space-y-1">
                    <p className="text-muted-foreground px-2 text-[11px] font-bold uppercase">
                      Core Citizen Paths
                    </p>
                    {[
                      {
                        label: "Speak or Draft (Action Center E11)",
                        href: routes.actionCenter,
                        icon: Mic,
                      },
                      {
                        label: "What Happened? (60+ Situations)",
                        href: routes.situations,
                        icon: Compass,
                      },
                      {
                        label: "Legal Learning Journeys",
                        href: routes.learn,
                        icon: BookOpen,
                      },
                      {
                        label: "Community Citizen Stories",
                        href: routes.community,
                        icon: Users,
                      },
                      {
                        label: "Grounded Nyaya AI Companion",
                        href: routes.ai,
                        icon: Sparkles,
                      },
                      {
                        label: "Constitutional Laws & Rights",
                        href: routes.laws,
                        icon: Gavel,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileSheetOpen(false)}
                          className="hover:bg-accent flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold"
                        >
                          <Icon className="size-4 text-amber-500" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-border flex items-center justify-between border-t pt-4">
                    <span className="text-xs font-medium">Appearance</span>
                    <ThemeSwitcher />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Dock */}
      <MobileBottomNav />
    </>
  );
}

export const VercelNavbar = Header;

function ListItem({
  title,
  icon,
  children,
  href,
  badge,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon: ReactElement;
  badge?: string;
}) {
  return (
    <li className="group/item" {...props}>
      <NavigationMenuLink asChild className="hover:bg-transparent">
        <Link href={href}>
          <div className="hover:bg-muted/60 flex items-start gap-3 rounded-xl p-2.5 transition-colors">
            <div className="border-border bg-background text-muted-foreground group-hover/item:bg-foreground group-hover/item:text-background group-hover/item:border-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 group-hover/item:scale-105">
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground/90 group-hover/item:text-foreground text-xs font-semibold leading-none transition-colors">
                  {title}
                </span>
                {badge && (
                  <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground group-hover/item:text-foreground/80 line-clamp-2 pt-1 text-[11px] leading-snug transition-colors">
                {children}
              </p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

const themes = [
  {
    key: "system",
    icon: Monitor,
    label: "System theme",
  },
  {
    key: "light",
    icon: Sun,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme",
  },
] as const;

export type ThemeSwitcherProps = {
  value?: "light" | "dark" | "system";
  onChange?: (theme: "light" | "dark" | "system") => void;
  defaultValue?: "light" | "dark" | "system";
  className?: string;
};

export const ThemeSwitcher = ({ className, onChange }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  const handleThemeClick = useCallback(
    (themeKey: "light" | "dark" | "system") => {
      setTheme(themeKey);
      onChange?.(themeKey);
    },
    [setTheme, onChange]
  );

  return (
    <div
      className={cn(
        "bg-background ring-border relative isolate flex h-7 rounded-full p-1 ring-1",
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            aria-label={label}
            className="relative h-5 w-6 cursor-pointer rounded-full"
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              handleThemeClick(key);
            }}
            type="button"
          >
            {isActive && (
              <div className="bg-secondary absolute inset-0 rounded-full" />
            )}
            <Icon
              className={cn(
                "relative z-10 m-auto h-3.5 w-3.5 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
