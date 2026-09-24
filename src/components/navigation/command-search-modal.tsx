"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Compass,
  FileText,
  PlusCircle,
  Scale,
  Search,
  Sparkles,
  Users,
  X,
} from "@/lib/icons";
import { unifiedSearch } from "@/lib/search";
import { routes } from "@/constants/routes";
import type { SearchEntityType } from "@/types";

interface CommandSearchModalProps {
  open: boolean;
  onClose: () => void;
  initialPlaceholder?: string;
}

const QUICK_COMMANDS = [
  {
    id: "cmd-what-happened",
    title: "What Happened? — Find Your Situation",
    subtitle: "Immediate Do's, Don'ts, and statutory checklists for 60+ issues",
    href: routes.situations,
    icon: Compass,
    badge: "Triage",
  },
  {
    id: "cmd-ask-ai",
    title: "Ask Nyaya AI Learning Companion",
    subtitle: "Get ELI15 or step-by-step explanations grounded in Indian law",
    href: routes.ai,
    icon: Sparkles,
    badge: "Grounded AI",
  },
  {
    id: "cmd-share-story",
    title: "Share a Citizen Situation Story",
    subtitle: "7-step PII-redacted studio with photo, voice note & video upload",
    href: routes.communityShare,
    icon: PlusCircle,
    badge: "Community Voice",
  },
  {
    id: "cmd-learn",
    title: "Continue Structured Legal Learning",
    subtitle: "Cyber Safety, Consumer Rights, BNSS Zero FIR & Student Rights",
    href: routes.learn,
    icon: BookOpen,
    badge: "Academy",
  },
  {
    id: "cmd-laws",
    title: "Browse Constitutional Articles & Central Acts",
    subtitle: "Article 14, 19, 21, CPA 2019, RTI Act 2005 & Supreme Court cases",
    href: routes.laws,
    icon: Scale,
    badge: "Law Library",
  },
] as const;

const FILTER_PILLS: { id: SearchEntityType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "situation", label: "Situations" },
  { id: "story", label: "Citizen Stories" },
  { id: "lesson", label: "Lessons" },
  { id: "article", label: "Articles" },
  { id: "law", label: "Acts" },
  { id: "glossary", label: "Glossary" },
];

export function CommandSearchModal({
  open,
  onClose,
  initialPlaceholder = "Search situations, laws, lessons, citizen stories...",
}: CommandSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState<SearchEntityType | "all">(
    "all"
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return unifiedSearch(query, entityFilter).items.slice(0, 10);
  }, [query, entityFilter]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!open) return;

    const totalCount = query.trim()
      ? searchResults.length
      : QUICK_COMMANDS.length;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (totalCount > 0 ? (prev + 1) % totalCount : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          totalCount > 0 ? (prev - 1 + totalCount) % totalCount : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (query.trim()) {
          const target = searchResults[selectedIndex];
          if (target) {
            onClose();
            router.push(target.href);
          } else {
            onClose();
            router.push(`${routes.search}?q=${encodeURIComponent(query)}`);
          }
        } else {
          const cmd = QUICK_COMMANDS[selectedIndex];
          if (cmd) {
            onClose();
            router.push(cmd.href);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, query, searchResults, selectedIndex, onClose, router]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Legal Knowledge & Command Palette"
      className="fixed inset-0 z-[90] flex items-start justify-center bg-black/65 px-4 pt-16 backdrop-blur-xs sm:pt-24"
      onClick={onClose}
    >
      <div
        className="bg-background border-border/80 w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Row */}
        <div className="border-border/70 flex items-center gap-3 border-b px-4 py-3.5">
          <Search className="text-brand size-5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={initialPlaceholder}
            className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none sm:text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
              }}
              className="text-muted-foreground hover:text-foreground rounded-md p-1"
              aria-label="Clear search query"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="border-border/70 text-muted-foreground hover:text-foreground rounded-md border px-2 py-0.5 text-[11px] font-medium"
          >
            ESC
          </button>
        </div>

        {/* Entity Filter Bar */}
        <div className="border-border/50 bg-muted/25 flex items-center gap-1.5 overflow-x-auto border-b px-4 py-2">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => {
                setEntityFilter(pill.id);
                setSelectedIndex(0);
              }}
              className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                entityFilter === pill.id
                  ? "bg-brand text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Results / Command List */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!query.trim() ? (
            <div className="space-y-1.5">
              <div className="text-muted-foreground px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase">
                Quick Platform Actions
              </div>
              {QUICK_COMMANDS.map((cmd, index) => {
                const Icon = cmd.icon;
                const active = index === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => {
                      onClose();
                      router.push(cmd.href);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition ${
                      active
                        ? "bg-brand/10 border-brand/30 border"
                        : "border border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-brand/12 text-brand flex size-9 shrink-0 items-center justify-center rounded-xl">
                        <Icon className="size-4.5" />
                      </span>
                      <div>
                        <p className="text-foreground text-xs font-bold sm:text-sm">
                          {cmd.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {cmd.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-muted text-muted-foreground hidden rounded-md px-2 py-0.5 text-[10px] font-semibold sm:inline-block">
                        {cmd.badge}
                      </span>
                      <ArrowRight className="text-muted-foreground size-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-foreground text-sm font-semibold">
                No direct matches for &ldquo;{query}&rdquo;
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Ask Nyaya AI Companion to analyze this situation or open the
                full search screen.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`${routes.ai}?q=${encodeURIComponent(query)}`);
                  }}
                  className="bg-gradient-brand text-primary-foreground inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold"
                >
                  <Sparkles className="size-3.5" />
                  Ask Nyaya AI about &ldquo;{query.slice(0, 24)}&rdquo;
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-muted-foreground flex items-center justify-between px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase">
                <span>Verified Matches & Public Stories</span>
                <span>{searchResults.length} shown</span>
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
                        : item.type === "article" || item.type === "law"
                          ? Scale
                          : FileText;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => {
                      onClose();
                      router.push(item.href);
                    }}
                    className={`flex w-full items-start justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition ${
                      active
                        ? "bg-brand/10 border-brand/30 border"
                        : "border border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="bg-brand/12 text-brand mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-foreground text-xs font-bold sm:text-sm">
                            {item.title}
                          </span>
                          <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                            {item.type.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="text-muted-foreground mt-1 size-4 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Keyboard Legend */}
        <div className="border-border/60 bg-muted/20 text-muted-foreground flex items-center justify-between border-t px-4 py-2.5 text-[11px]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>ESC Close</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push(
                query.trim()
                  ? `${routes.search}?q=${encodeURIComponent(query)}`
                  : routes.search
              );
            }}
            className="text-brand font-semibold hover:underline"
          >
            Open Full Unified Search →
          </button>
        </div>
      </div>
    </div>
  );
}
