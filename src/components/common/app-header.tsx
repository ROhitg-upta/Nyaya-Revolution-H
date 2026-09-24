"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Activity,
  ArrowRight,
  Bell,
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  FolderKanban,
  LogOut,
  Menu,
  PlusCircle,
  Scale,
  Search,
  ShieldCheck,
  Target,
  User,
} from "@/lib/icons";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { CommandSearchModal } from "@/components/navigation/command-search-modal";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getContextualRouteBadge,
  getContextualSearchPlaceholder,
  matchActiveNavSection,
  PRIMARY_NAV_SECTIONS,
  type PrimaryNavId,
} from "@/constants/navigation";
import { routes, siteConfig } from "@/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

interface NavNotificationItem {
  id: string;
  title: string;
  detail: string;
  href: string;
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: NavNotificationItem[] = [
  {
    id: "notif-e10-bridge",
    title: "Story-to-Learning Network Live",
    detail: "Explore citizen stories linked to BNSS Sec 173 & 1930 Cyber Helpline.",
    href: routes.community,
    unread: true,
  },
  {
    id: "notif-ai-practice",
    title: "Practice Scenarios Award +25 XP",
    detail: "Complete interactive legal simulations to build your streak.",
    href: routes.scenarios,
    unread: true,
  },
];

export function AppHeader() {
  const pathname = usePathname() || "/";
  const prefersReducedMotion = useReducedMotion();
  const { user, status, signOut } = useAuth();
  const isAuthenticated = status === "authenticated";

  // State A (Top) vs State B (Scrolled Compact)
  const [scrolled, setScrolled] = useState(false);

  // Interactive Menu States
  const [openMegaId, setOpenMegaId] = useState<PrimaryNavId | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [brandHover, setBrandHover] = useState(false);

  // Real client learning progress & notification state
  const [notifications, setNotifications] = useState<NavNotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [lastVisitedJourney] = useState<{
    title: string;
    href: string;
    completedCount: number;
  } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem("nyaya-learning-progress");
      if (raw) {
        const parsed = JSON.parse(raw);
        const completedLessons = Array.isArray(parsed?.completedLessons)
          ? parsed.completedLessons.length
          : 0;
        if (completedLessons > 0) {
          return {
            title: "Cyber Safety & Digital Financial Rights",
            href: "/learn/cyber-safety",
            completedCount: completedLessons,
          };
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return null;
  });

  const headerRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSection = matchActiveNavSection(pathname);
  const contextualPlaceholder = getContextualSearchPlaceholder(pathname);
  const routeBadge = getContextualRouteBadge(pathname);
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Scroll listener for State A -> State B compact transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K for Command Search, Escape for menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenMegaId(null);
        setNotificationsOpen(false);
        setProfileMenuOpen(false);
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpenMegaId(null);
        setNotificationsOpen(false);
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setOpenMegaId(null);
        setNotificationsOpen(false);
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavEnter = (id: PrimaryNavId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
    setOpenMegaId(id);
  };

  const handleNavLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenMegaId(null);
    }, 140);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const activeMegaSection = PRIMARY_NAV_SECTIONS.find(
    (s) => s.id === openMegaId
  );

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={handleNavLeave}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          scrolled
            ? "border-border/80 bg-background/92 border-b shadow-sm backdrop-blur-xl"
            : "border-border/50 bg-background/80 border-b backdrop-blur-md"
        )}
      >
        {/* Main Container Aligned to E7.6 Design System (`max-w-6xl px-4 sm:px-6 lg:px-8`) */}
        <nav
          aria-label="Main Product Navigation"
          className={cn(
            "mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 transition-[height] duration-200 sm:px-6 lg:px-8",
            scrolled ? "h-14" : "h-16"
          )}
        >
          {/* LEFT: Brand Emblem + Memorable Brand Story Moment + Desktop Primary Pillars */}
          <div className="flex items-center gap-3 xl:gap-5">
            <div
              className="relative"
              onMouseEnter={() => setBrandHover(true)}
              onMouseLeave={() => setBrandHover(false)}
            >
              <Link
                href={routes.home}
                onClick={() => setOpenMegaId(null)}
                className="focus-visible:ring-ring group flex items-center gap-2.5 rounded-xl py-1 pr-1 focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="bg-gradient-brand text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-[1.03]">
                  <Scale className="size-4.5" />
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground text-sm font-bold tracking-tight sm:text-base">
                      {siteConfig.name}
                    </span>
                    {routeBadge && (
                      <span
                        className={cn(
                          "bg-muted/80 hidden rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-tight xl:inline-block",
                          routeBadge.accent
                        )}
                      >
                        {routeBadge.label}
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground hidden text-[10px] leading-none font-medium sm:inline-block">
                    Discover • Learn • Practice • Voice
                  </span>
                </div>
              </Link>

              {/* Subtle Brand Story Moment Popover on Logo Hover */}
              <AnimatePresence>
                {brandHover && !openMegaId && (
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 6 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    className="border-border/80 bg-background/95 pointer-events-none absolute top-full left-0 z-50 mt-2 hidden w-72 rounded-2xl border p-3.5 shadow-xl backdrop-blur-xl lg:block"
                  >
                    <p className="text-brand text-[10px] font-bold tracking-wider uppercase">
                      The Nyaya Citizen Loop
                    </p>
                    <p className="text-foreground mt-1 text-xs font-semibold">
                      What happened? → Understand → Learn → Practice → Community
                    </p>
                    <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                      Situation-first Indian legal awareness grounded in
                      verified statutes and real citizen experiences.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DESKTOP PRIMARY NAVIGATION PILLARS (lg+) */}
            <ul className="hidden items-center gap-1 lg:flex">
              {PRIMARY_NAV_SECTIONS.map((section) => {
                const isRouteActive = activeSection === section.id;
                const isMenuOpen = openMegaId === section.id;
                const Icon = section.icon;

                return (
                  <li
                    key={section.id}
                    onMouseEnter={() => handleNavEnter(section.id)}
                  >
                    <button
                      type="button"
                      aria-expanded={isMenuOpen}
                      aria-haspopup="true"
                      onClick={() =>
                        setOpenMegaId((prev) =>
                          prev === section.id ? null : section.id
                        )
                      }
                      className={cn(
                        "focus-visible:ring-ring relative inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none xl:text-sm",
                        isRouteActive || isMenuOpen
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                        section.id === "situations" &&
                          !isRouteActive &&
                          "text-foreground/90"
                      )}
                    >
                      {/* Animated Active Route / Open Menu Underlay */}
                      {(isRouteActive || isMenuOpen) && (
                        <motion.span
                          layoutId="nyaya-nav-active-pill"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                          className={cn(
                            "absolute inset-0 -z-10 rounded-xl",
                            isRouteActive
                              ? "bg-brand/12 border-brand/25 border"
                              : "bg-muted/70"
                          )}
                        />
                      )}

                      <Icon
                        className={cn(
                          "size-3.5 shrink-0 transition-colors",
                          isRouteActive || section.id === "ai"
                            ? "text-brand"
                            : "text-muted-foreground"
                        )}
                      />
                      <span>{section.label}</span>

                      {section.id === "ai" && (
                        <span className="bg-brand/15 text-brand rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                          RAG
                        </span>
                      )}

                      <ChevronDown
                        className={cn(
                          "size-3.5 transition-transform duration-150",
                          isMenuOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* RIGHT: Contextual Command Search + Saved + Notifications + Theme + Auth/Profile */}
          <div className="flex items-center gap-2">
            {/* Desktop Command Search Bar (`Ctrl+K`) */}
            <button
              type="button"
              onClick={() => {
                setOpenMegaId(null);
                setSearchOpen(true);
              }}
              aria-label="Open global command search"
              className="border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-brand/30 text-muted-foreground focus-visible:ring-ring hidden h-9 items-center justify-between gap-3 rounded-xl border px-3 text-xs transition-all focus-visible:ring-2 focus-visible:outline-none md:inline-flex lg:w-56 xl:w-68"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="text-brand size-3.5 shrink-0" />
                <span className="truncate">{contextualPlaceholder}</span>
              </span>
              <kbd className="border-border/70 bg-background/80 text-muted-foreground shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                ⌘K
              </kbd>
            </button>

            {/* Mobile/Compact Search Icon Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-xl transition md:hidden"
            >
              <Search className="size-4.5" />
            </button>

            {/* Saved Bookmarks Quick Link (Desktop) */}
            <Link
              href={routes.aiBookmarks}
              title="Saved Explanations, Situations & Stories"
              aria-label="Saved Bookmarks"
              className={cn(
                "text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring hidden size-9 items-center justify-center rounded-xl transition sm:inline-flex",
                pathname.startsWith("/ai/bookmarks") &&
                  "bg-brand/12 text-brand"
              )}
            >
              <Bookmark className="size-4" />
            </Link>

            {/* Notifications Menu Trigger */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={notificationsOpen}
                aria-label={`Notifications (${unreadCount} unread)`}
                onClick={() => {
                  setOpenMegaId(null);
                  setProfileMenuOpen(false);
                  setNotificationsOpen((prev) => !prev);
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring relative flex size-9 items-center justify-center rounded-xl transition focus-visible:ring-2 focus-visible:outline-none"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="bg-brand text-primary-foreground absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full text-[9px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 6 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="border-border/80 bg-background/95 absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
                  >
                    <div className="border-border/60 flex items-center justify-between border-b px-4 py-3">
                      <span className="text-foreground text-xs font-bold">
                        Platform Updates ({unreadCount})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          className="text-brand inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
                        >
                          <Check className="size-3" />
                          Mark read
                        </button>
                      )}
                    </div>
                    <div className="divide-border/50 max-h-72 divide-y overflow-y-auto">
                      {notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.href}
                          onClick={() => setNotificationsOpen(false)}
                          className="hover:bg-muted/50 block px-4 py-3 transition"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-foreground text-xs font-bold">
                              {n.title}
                            </p>
                            {n.unread && (
                              <span className="bg-brand size-2 shrink-0 rounded-full" />
                            )}
                          </div>
                          <p className="text-muted-foreground mt-0.5 text-[11px] leading-relaxed">
                            {n.detail}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ThemeToggle />

            {/* AUTHENTICATED PROFILE CONTROL vs GUEST CTA */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  aria-expanded={profileMenuOpen}
                  onClick={() => {
                    setOpenMegaId(null);
                    setNotificationsOpen(false);
                    setProfileMenuOpen((prev) => !prev);
                  }}
                  className="border-border/70 bg-muted/40 hover:bg-muted/80 focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border py-1 pr-2.5 pl-1.5 text-xs font-semibold transition focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="bg-gradient-brand text-primary-foreground flex size-6 items-center justify-center rounded-full text-[11px] font-bold">
                    {user?.name?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase() ||
                      "C"}
                  </span>
                  <span className="text-foreground max-w-[100px] truncate">
                    {user?.name || user?.email?.split("@")[0] || "Citizen"}
                  </span>
                  <ChevronDown className="text-muted-foreground size-3.5" />
                </button>

                {/* Rich Profile Dropdown */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 6 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="border-border/80 bg-background/95 absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border p-2 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="border-border/60 mb-1.5 border-b px-3 py-2">
                        <p className="text-foreground truncate text-xs font-bold">
                          {user?.name || "Verified Citizen"}
                        </p>
                        <p className="text-muted-foreground truncate text-[11px]">
                          {user?.email}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          href={routes.learnProfile}
                          onClick={() => setProfileMenuOpen(false)}
                          className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                        >
                          <User className="text-brand size-4" />
                          My Learning Profile
                        </Link>
                        <Link
                          href={routes.knowledge}
                          onClick={() => setProfileMenuOpen(false)}
                          className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                        >
                          <Target className="text-brand size-4" />
                          Legal Knowledge Radar
                        </Link>
                        <Link
                          href={routes.communityMyStories}
                          onClick={() => setProfileMenuOpen(false)}
                          className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                        >
                          <FolderKanban className="text-brand size-4" />
                          My Citizen Stories & Drafts
                        </Link>
                        <Link
                          href={routes.aiBookmarks}
                          onClick={() => setProfileMenuOpen(false)}
                          className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                        >
                          <Bookmark className="text-brand size-4" />
                          Saved AI Bookmarks
                        </Link>
                        <Link
                          href={routes.moderation}
                          onClick={() => setProfileMenuOpen(false)}
                          className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                        >
                          <ShieldCheck className="text-brand size-4" />
                          Moderator Queue
                        </Link>
                        <Link
                          href={routes.analytics}
                          onClick={() => setProfileMenuOpen(false)}
                          className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                        >
                          <Activity className="text-brand size-4" />
                          Learning Velocity Analytics
                        </Link>
                      </div>

                      <div className="border-border/60 mt-1.5 border-t pt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            signOut();
                          }}
                          className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold"
                        >
                          <LogOut className="size-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:inline-flex">
                <Link
                  href={routes.situations}
                  className="bg-brand/12 text-brand hover:bg-brand/20 hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition xl:inline-flex"
                >
                  <Compass className="size-3.5" />
                  What Happened?
                </Link>
                <Link href={routes.signIn}>
                  <Button
                    size="sm"
                    variant="default"
                    className="rounded-full px-4 text-xs font-semibold"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Drawer Trigger (`lg:hidden`) */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground hover:bg-muted lg:hidden"
                    aria-label="Open navigation drawer"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-80 flex-col justify-between overflow-y-auto p-6"
              >
                <div className="space-y-6">
                  <SheetHeader className="p-0 text-left">
                    <SheetTitle className="flex items-center gap-2.5">
                      <span className="bg-gradient-brand text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-sm">
                        <Scale className="size-4" />
                      </span>
                      <span className="font-bold tracking-tight">
                        {siteConfig.name}
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Primary Signature Action on Mobile */}
                  <Link
                    href={routes.situations}
                    onClick={() => setMobileSheetOpen(false)}
                    className="bg-gradient-brand text-primary-foreground flex items-center justify-between rounded-2xl p-3.5 shadow-sm"
                  >
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">
                        Start Here
                      </span>
                      <p className="text-sm font-bold">
                        What Happened? Find Your Situation
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0" />
                  </Link>

                  {/* Structured Mobile Sections */}
                  <div className="space-y-4">
                    {PRIMARY_NAV_SECTIONS.map((sec) => {
                      const SecIcon = sec.icon;
                      return (
                        <div key={sec.id} className="space-y-1.5">
                          <Link
                            href={sec.href}
                            onClick={() => setMobileSheetOpen(false)}
                            className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
                          >
                            <SecIcon className="text-brand size-3.5" />
                            {sec.label}
                          </Link>
                          <div className="border-border/60 ml-2 space-y-1 border-l pl-3">
                            {sec.featuredItems.slice(0, 3).map((sub) => (
                              <Link
                                key={sub.id}
                                href={sub.href}
                                onClick={() => setMobileSheetOpen(false)}
                                className="text-muted-foreground hover:text-foreground block py-1 text-xs font-medium"
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Drawer Footer */}
                <div className="border-border/60 mt-6 space-y-2.5 border-t pt-4">
                  <Link
                    href={routes.communityShare}
                    onClick={() => setMobileSheetOpen(false)}
                    className="border-brand/30 bg-brand/10 text-brand flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold"
                  >
                    <PlusCircle className="size-4" />
                    Share Your Situation Story
                  </Link>

                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href={routes.learnProfile}
                        onClick={() => setMobileSheetOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 rounded-xl text-xs"
                        >
                          <User className="text-brand size-4" />
                          <span className="truncate">
                            {user?.name ||
                              user?.email?.split("@")[0] ||
                              "My Profile"}
                          </span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          signOut();
                          setMobileSheetOpen(false);
                        }}
                        className="text-destructive hover:bg-destructive/10 w-full justify-start gap-2 rounded-xl text-xs"
                      >
                        <LogOut className="size-4" />
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <Link
                      href={routes.signIn}
                      onClick={() => setMobileSheetOpen(false)}
                      className="block"
                    >
                      <Button className="w-full rounded-xl text-xs font-bold">
                        Sign In to Save Progress
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>

        {/* DESKTOP INTELLIGENT MEGA MENU PANEL */}
        <AnimatePresence>
          {activeMegaSection && (
            <motion.div
              key={activeMegaSection.id}
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              onMouseEnter={() => {
                if (hoverTimeoutRef.current)
                  clearTimeout(hoverTimeoutRef.current);
              }}
              onMouseLeave={handleNavLeave}
              className="border-border/80 bg-background/97 absolute top-full right-0 left-0 z-50 hidden border-b shadow-2xl backdrop-blur-2xl lg:block"
            >
              <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 gap-6">
                  {/* Left 8 Columns: Featured Items Grid */}
                  <div className="col-span-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-brand text-[10px] font-bold tracking-wider uppercase">
                          {activeMegaSection.eyebrow}
                        </span>
                        <h3 className="text-foreground text-base font-bold">
                          {activeMegaSection.headline}
                        </h3>
                      </div>
                      <Link
                        href={activeMegaSection.href}
                        onClick={() => setOpenMegaId(null)}
                        className="text-brand inline-flex items-center gap-1 text-xs font-bold hover:underline"
                      >
                        View All {activeMegaSection.shortLabel}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {activeMegaSection.featuredItems.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setOpenMegaId(null)}
                            className="border-border/60 hover:border-brand/40 hover:bg-muted/40 group flex items-start gap-3 rounded-2xl border p-3.5 transition-all"
                          >
                            <span className="bg-brand/12 text-brand group-hover:bg-brand group-hover:text-primary-foreground mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors">
                              <ItemIcon className="size-4.5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-foreground group-hover:text-brand truncate text-xs font-bold transition-colors">
                                  {item.title}
                                </p>
                                {item.badge && (
                                  <span
                                    className={cn(
                                      "shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase",
                                      item.badgeTone === "emerald"
                                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                        : item.badgeTone === "amber"
                                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                          : "bg-brand/15 text-brand"
                                    )}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right 4 Columns: Secondary Links + Contextual Continue Learning / Primary CTA */}
                  <div className="border-border/60 col-span-4 flex flex-col justify-between border-l pl-6">
                    <div className="space-y-3">
                      <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                        More in {activeMegaSection.shortLabel}
                      </span>
                      <div className="space-y-2">
                        {activeMegaSection.secondaryItems.map((sec) => {
                          const SecIcon = sec.icon;
                          return (
                            <Link
                              key={sec.id}
                              href={sec.href}
                              onClick={() => setOpenMegaId(null)}
                              className="hover:bg-muted/60 flex items-start gap-2.5 rounded-xl p-2.5 transition"
                            >
                              <SecIcon className="text-brand mt-0.5 size-4 shrink-0" />
                              <div>
                                <p className="text-foreground text-xs font-bold">
                                  {sec.title}
                                </p>
                                <p className="text-muted-foreground text-[11px]">
                                  {sec.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Contextual Continue Learning Strip inside Learn Mega Menu */}
                      {activeMegaSection.id === "learn" && (
                        <div className="border-brand/25 bg-brand/5 mt-3 rounded-2xl border p-3.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-brand flex items-center gap-1.5 font-bold">
                              <BookOpen className="size-3.5" />
                              {lastVisitedJourney
                                ? "Continue Learning"
                                : "Recommended First Journey"}
                            </span>
                            {lastVisitedJourney && (
                              <span className="text-foreground text-[11px] font-bold">
                                {lastVisitedJourney.completedCount} lessons done
                              </span>
                            )}
                          </div>
                          <p className="text-foreground mt-1 text-xs font-semibold">
                            {lastVisitedJourney
                              ? lastVisitedJourney.title
                              : "Cyber Safety & 1930 Golden-Hour Rights"}
                          </p>
                          <Link
                            href={
                              lastVisitedJourney
                                ? lastVisitedJourney.href
                                : "/learn/cyber-safety"
                            }
                            onClick={() => setOpenMegaId(null)}
                            className="text-brand mt-2 inline-flex items-center gap-1 text-[11px] font-bold hover:underline"
                          >
                            {lastVisitedJourney
                              ? "Resume Journey"
                              : "Start Lesson 1"}{" "}
                            →
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Bottom Highlighted CTA */}
                    <Link
                      href={activeMegaSection.primaryCta.href}
                      onClick={() => setOpenMegaId(null)}
                      className="bg-gradient-brand text-primary-foreground mt-4 flex items-center justify-between gap-3 rounded-2xl p-4 shadow-sm transition hover:opacity-95"
                    >
                      <div>
                        <p className="text-xs font-bold">
                          {activeMegaSection.primaryCta.label}
                        </p>
                        <p className="mt-0.5 text-[11px] opacity-90">
                          {activeMegaSection.primaryCta.description}
                        </p>
                      </div>
                      <ArrowRight className="size-4 shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Command Search Modal (`Ctrl+K` / `⌘K`) */}
      <CommandSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        initialPlaceholder={contextualPlaceholder}
      />

      {/* Mobile Bottom Navigation Bar (`lg:hidden`) */}
      <MobileBottomNav />
    </>
  );
}

export default AppHeader;
