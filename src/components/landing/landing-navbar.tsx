"use client";

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
import { siteConfig } from "@/constants";
import { navLinks } from "@/constants/landing";
import { Menu, Scale } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
          <Button
            className="glow-hover hidden rounded-full px-5 md:inline-flex"
            size="sm"
          >
            Log in
          </Button>

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
                <Button className="mt-3">Log in</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
