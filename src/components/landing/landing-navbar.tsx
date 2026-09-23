"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
import { navLinks } from "@/constants/landing";
import { LogOut, Menu, Scale, User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

function Logo() {
  return (
    <a
      href="#top"
      className="focus-visible:ring-ring flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="bg-gradient-brand glow-brand text-primary-foreground flex size-8 items-center justify-center rounded-lg">
        <Scale className="size-4.5" />
      </span>
      <span className="text-foreground text-base font-semibold tracking-tight">
        {siteConfig.name}
      </span>
    </a>
  );
}

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, status, signOut } = useAuth();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-border/60 bg-background/60 border-b backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Authenticated State vs Log In (Desktop) */}
          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:inline-flex">
              <Link href={routes.learnProfile}>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass flex items-center gap-2 rounded-full px-3 text-xs font-medium"
                >
                  <span className="bg-brand/20 text-brand flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
                    {user?.name?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase() ||
                      "C"}
                  </span>
                  <span className="max-w-[120px] truncate">
                    {user?.name || user?.email?.split("@")[0] || "Profile"}
                  </span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-foreground size-8 p-0"
                title="Sign out"
              >
                <LogOut className="size-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          ) : (
            <Link href={routes.signIn} className="hidden md:inline-flex">
              <Button className="glow-hover rounded-full px-5" size="sm">
                Log in
              </Button>
            </Link>
          )}

          {/* Mobile Navigation Drawer */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-foreground hover:bg-muted rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                ))}

                {/* Mobile Drawer Auth Button */}
                {isAuthenticated ? (
                  <div className="mt-4 flex flex-col gap-2 border-t border-border/60 pt-3">
                    <Link
                      href={routes.learnProfile}
                      onClick={() => setOpen(false)}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2.5 rounded-xl"
                      >
                        <User className="size-4 text-brand" />
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
                      className="w-full justify-start gap-2 rounded-xl text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <Link href={routes.signIn} onClick={() => setOpen(false)}>
                    <Button className="mt-3 w-full">Log in</Button>
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

export default LandingNavbar;
