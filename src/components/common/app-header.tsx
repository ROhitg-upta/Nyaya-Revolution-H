"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { routes, siteConfig } from "@/constants";
import {
  Activity,
  BookOpen,
  Brain,
  Compass,
  FileText,
  Gavel,
  LogOut,
  Menu,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Users,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const navItems = [
  { label: "Situations", href: routes.situations, icon: Compass },
  { label: "Community", href: routes.community, icon: Users },
  { label: "Laws", href: routes.laws, icon: Scale },
  { label: "Learn", href: routes.learn, icon: BookOpen },
  { label: "Scenarios", href: routes.scenarios, icon: Brain },
  { label: "Analytics", href: routes.analytics, icon: Activity },
  { label: "Precedents", href: routes.caseStudies, icon: Gavel },
  { label: "Knowledge", href: routes.knowledge, icon: Target },
  { label: "Glossary", href: routes.glossary, icon: FileText },
  { label: "AI Tutor", href: routes.ai, icon: Sparkles, highlight: true },
];

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, status, signOut } = useAuth();
  const isAuthenticated = status === "authenticated";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="border-border/60 bg-background/70 sticky top-0 z-50 w-full border-b backdrop-blur-xl backdrop-saturate-150 transition-colors">
      <nav
        aria-label="Main Navigation"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Brand & Desktop Nav */}
        <div className="flex items-center gap-4 xl:gap-6">
          <Link
            href={routes.home}
            className="focus-visible:ring-ring flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="bg-gradient-brand glow-brand text-primary-foreground flex size-8.5 items-center justify-center rounded-xl shadow-md">
              <Scale className="size-4.5" />
            </span>
            <span className="text-foreground text-base font-bold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Nav Links (Visible on lg+ screens to prevent wrapping) */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-visible:ring-ring relative rounded-lg px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-all focus-visible:ring-2 focus-visible:outline-none",
                      active
                        ? "text-brand bg-brand/10 font-semibold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      item.highlight &&
                        !active &&
                        "text-brand/90 hover:text-brand",
                    )}
                  >
                    {item.label}
                    {item.highlight ? (
                      <span className="bg-brand/20 text-brand ml-1 hidden rounded-full px-1.5 py-0.5 text-[10px] font-bold xl:inline">
                        AI
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <Link
            href={routes.search}
            className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring flex size-9 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
            title="Search Constitution, Laws, Situations & Precedents"
            aria-label="Search Legal Knowledge"
          >
            <Search className="size-4.5" />
          </Link>

          <ThemeToggle />

          {/* Authenticated State vs Log In (Desktop) */}
          {isAuthenticated ? (
            <div className="hidden items-center gap-1.5 sm:inline-flex">
              <Link href={routes.learnProfile}>
                <Button
                  size="sm"
                  variant="outline"
                  className="glass flex items-center gap-2 rounded-full px-3 text-xs font-medium"
                >
                  <span className="bg-brand/20 text-brand flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
                    {user?.name?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase() ||
                      "C"}
                  </span>
                  <span className="max-w-[110px] truncate">
                    {user?.name || user?.email?.split("@")[0] || "Profile"}
                  </span>
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-foreground size-8 p-0"
                title="Sign out"
              >
                <LogOut className="size-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          ) : (
            <Link href={routes.signIn} className="hidden sm:inline-flex">
              <Button
                size="sm"
                variant="default"
                className="glow-hover rounded-full px-4 text-xs font-semibold"
              >
                Log in
              </Button>
            </Link>
          )}

          {/* Mobile Drawer Trigger (lg:hidden) */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-muted lg:hidden"
                  aria-label="Open mobile navigation menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-72 flex-col justify-between p-6"
            >
              <div className="flex flex-col gap-6">
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

                {/* Mobile Navigation List */}
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-brand/12 text-brand font-semibold"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="size-4.5 shrink-0" />
                          {item.label}
                        </span>
                        {item.highlight ? (
                          <span className="bg-brand/15 text-brand rounded-full px-2 py-0.5 text-[10px] font-bold">
                            AI
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions inside drawer */}
              <div className="border-border/50 flex flex-col gap-3 border-t pt-4">
                <Link
                  href={routes.search}
                  onClick={() => setOpen(false)}
                  className="glass text-foreground hover:bg-muted/40 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition-colors"
                >
                  <Search className="size-4" />
                  Search Everything
                </Link>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href={routes.moderation}
                    onClick={() => setOpen(false)}
                    className="glass text-foreground/80 hover:text-foreground hover:border-brand/40 flex items-center justify-center gap-1.5 rounded-xl py-2 text-center text-[11px] font-medium"
                  >
                    <ShieldCheck className="size-3.5 text-brand" />
                    Review Queue
                  </Link>
                  <Link
                    href={routes.submitSituation}
                    onClick={() => setOpen(false)}
                    className="glass text-foreground/80 hover:text-foreground hover:border-brand/40 flex items-center justify-center gap-1.5 rounded-xl py-2 text-center text-[11px] font-medium"
                  >
                    <Compass className="size-3.5 text-brand" />
                    Submit Situation
                  </Link>
                </div>

                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={routes.learnProfile}
                      onClick={() => setOpen(false)}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2.5 rounded-xl"
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
                        setOpen(false);
                      }}
                      className="text-destructive hover:bg-destructive/10 w-full justify-start gap-2 rounded-xl"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <Link
                    href={routes.signIn}
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    <Button className="w-full rounded-xl">Log in</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default AppHeader;
