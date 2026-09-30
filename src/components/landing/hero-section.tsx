"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Landmark,
  Mic,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { unifiedSearch } from "@/lib/search";

const HERO_PROMPT_SUGGESTIONS = [
  "My landlord won't return my deposit",
  "UPI fraud happened 1930 freeze",
  "Police refusing to file FIR (BNSS 173)",
  "College demanding illegal fees & refund",
  "Understand Article 21 and Privacy Rights",
] as const;

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownDismissed, setDropdownDismissed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotate smart placeholder prompts every 3.5 seconds when not focused
  useEffect(() => {
    if (isFocused || query) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % HERO_PROMPT_SUGGESTIONS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isFocused, query]);

  // Execute real-time search for hero autocomplete dropdown via useMemo
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return unifiedSearch(query, "all", { limit: 5 }).items;
  }, [query]);

  const dropdownOpen = !dropdownDismissed && query.trim().length > 0 && searchResults.length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownDismissed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      router.push(routes.situations);
      return;
    }
    if (searchResults.length > 0 && selectedIndex >= 0 && selectedIndex < searchResults.length) {
      router.push(searchResults[selectedIndex].href);
    } else {
      router.push(`${routes.search}?q=${encodeURIComponent(query.trim())}`);
    }
    setDropdownDismissed(true);
  };

  const handleSelectChip = (chip: string) => {
    setQuery(chip);
    router.push(`${routes.search}?q=${encodeURIComponent(chip)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!dropdownOpen || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Escape") {
      setDropdownDismissed(true);
    }
  };

  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      {/* Background Ambience & Subtle Glow Orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="bg-brand/10 absolute -top-[30%] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] -left-[10%] h-[350px] w-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[400px] w-[550px] rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="bg-grid mask-radial absolute inset-0 opacity-15" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass text-muted-foreground inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-xs"
        >
          <span className="bg-brand size-1.5 animate-pulse rounded-full" />
          <Sparkles className="text-brand size-3.5" />
          <span>India&apos;s Situation-First Citizen Legal Platform</span>
        </motion.div>

        {/* Main Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-foreground mt-6 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
        >
          You don&apos;t need to know the law before asking{" "}
          <span className="text-gradient-brand">what happened.</span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-muted-foreground mx-auto mt-4 max-w-2xl text-balance text-sm leading-relaxed sm:text-lg sm:leading-relaxed"
        >
          Nyaya Revolution turns confusing statutes into immediate Do&apos;s, Don&apos;ts, checklists, and verified local help. Describe your situation in plain English or Hinglish.
        </motion.p>

        {/* Interactive Hero Search Engine */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="relative mt-8 w-full max-w-2xl text-left"
        >
          <form
            onSubmit={handleFormSubmit}
            role="search"
            aria-label="Describe what happened to you"
            className="glass-strong focus-within:ring-ring/50 focus-within:border-brand/40 relative flex items-center gap-2 rounded-2xl p-2 pl-4 shadow-xl transition-all focus-within:ring-2"
          >
            <Search className="text-brand size-5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownDismissed(false);
              }}
              onFocus={() => {
                setIsFocused(true);
                setDropdownDismissed(false);
              }}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={HERO_PROMPT_SUGGESTIONS[placeholderIndex]}
              className="text-foreground placeholder:text-muted-foreground w-full bg-transparent py-2 text-sm outline-none sm:text-base"
              aria-autocomplete="list"
              aria-controls="hero-search-results"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setDropdownDismissed(true);
                }}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors"
                aria-label="Clear search input"
              >
                <X className="size-4" />
              </button>
            )}

            <Button
              type="submit"
              size="default"
              className="glow-hover shrink-0 rounded-xl px-5 font-semibold"
            >
              Search
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Autocomplete Dropdown */}
          {dropdownOpen && searchResults.length > 0 && (
            <div
              id="hero-search-results"
              role="listbox"
              className="bg-background/95 border-border/80 absolute top-full right-0 left-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border p-2 shadow-2xl backdrop-blur-xl"
            >
              <div className="text-muted-foreground flex items-center justify-between px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase">
                <span>Direct Legal Matches</span>
                <span>Press Enter to Open</span>
              </div>
              {searchResults.map((item, idx) => {
                const active = idx === selectedIndex;
                const Icon =
                  item.type === "situation"
                    ? Compass
                    : item.type === "story"
                      ? Users
                      : item.type === "lesson" || item.type === "journey"
                        ? BookOpen
                        : item.type === "resource"
                          ? Landmark
                          : Scale;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => {
                      router.push(item.href);
                      setDropdownDismissed(true);
                    }}
                    className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      active
                        ? "bg-brand/10 border-brand/30 border"
                        : "border border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="bg-brand/12 text-brand mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg">
                        <Icon className="size-3.5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground text-xs font-bold sm:text-sm">
                            {item.title}
                          </span>
                          <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.2 text-[9px] font-semibold uppercase">
                            {item.type.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-muted-foreground line-clamp-1 text-xs">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="text-muted-foreground mt-1 size-3.5 shrink-0" />
                  </button>
                );
              })}
              <div className="border-border/60 bg-muted/20 text-muted-foreground mt-1 flex items-center justify-between rounded-lg border-t px-3 py-1.5 text-xs">
                <span>View all results for &ldquo;{query}&rdquo;</span>
                <Link
                  href={`${routes.search}?q=${encodeURIComponent(query)}`}
                  className="text-brand font-semibold hover:underline"
                >
                  Full Search →
                </Link>
              </div>
            </div>
          )}

          {/* Quick Prompt Chips */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs sm:justify-start">
            <span className="text-muted-foreground font-medium">Quick situations:</span>
            {HERO_PROMPT_SUGGESTIONS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSelectChip(chip)}
                className="border-border/60 hover:border-brand/40 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full border px-2.5 py-0.5 text-[11px] transition sm:text-xs"
              >
                {chip}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Primary CTA Buttons Cluster */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <Link href={routes.situations}>
            <Button
              size="lg"
              className="glow-hover w-full rounded-full px-6 font-semibold sm:w-auto"
            >
              <Compass className="size-4" />
              What Happened? (Triage)
            </Button>
          </Link>
          <Link href={routes.actionCenter}>
            <Button
              size="lg"
              variant="outline"
              className="glass hover:border-brand/40 w-full rounded-full px-6 font-medium sm:w-auto"
            >
              <Mic className="text-amber-500 size-4" />
              Voice &amp; Action Center
            </Button>
          </Link>
          <Link href={routes.learn}>
            <Button
              size="lg"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground w-full rounded-full px-5 text-xs sm:w-auto"
            >
              <BookOpen className="size-4" />
              Start Learning
            </Button>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-muted-foreground mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="text-brand size-4" />
            <span>Grounded in Indian Statutes (BNS, BNSS, CPA 2019)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Landmark className="text-brand size-4" />
            <span>NALSA &amp; DLSA Legal Services Directory</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="text-brand size-4" />
            <span>100% Free &amp; Zero Private Data Leakage</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
