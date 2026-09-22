"use client";

import Link from "next/link";
import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Gavel,
  Scale,
  Sparkles,
} from "@/lib/icons";

interface ContentDiscoveryProps {
  title?: string;
  subtitle?: string;
  understandHref?: string;
  understandLabel?: string;
  deeperHref?: string;
  deeperLabel?: string;
  practiceHref?: string;
  practiceLabel?: string;
  precedentHref?: string;
  precedentLabel?: string;
  className?: string;
}

export function ContentDiscovery({
  title = "Continue Your Legal Discovery",
  subtitle = "Navigate connected legal concepts across learning, statutes, practice, and real precedents.",
  understandHref,
  understandLabel = "Understand the Basics",
  deeperHref,
  deeperLabel = "Go Deeper in Law Library",
  practiceHref,
  practiceLabel = "Practice in Scenario Simulator",
  precedentHref,
  precedentLabel = "Read Landmark Supreme Court Precedents",
  className = "",
}: ContentDiscoveryProps) {
  const pathways = [
    understandHref && {
      icon: BookOpen,
      tag: "I want to understand this",
      title: understandLabel,
      description: "Structured lesson explaining this right in plain citizen language.",
      href: understandHref,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-500 border-blue-500/20",
    },
    deeperHref && {
      icon: BookMarked,
      tag: "I want to go deeper",
      title: deeperLabel,
      description: "Statutory provisions, Constitutional articles & India Code citations.",
      href: deeperHref,
      color: "from-amber-500/10 to-orange-500/10 text-amber-500 border-amber-500/20",
    },
    practiceHref && {
      icon: Scale,
      tag: "I want to practice",
      title: practiceLabel,
      description: "Step-by-step interactive decision dilemmas with legal consequence feedback.",
      href: practiceHref,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20",
    },
    precedentHref && {
      icon: Gavel,
      tag: "I want to see real outcomes",
      title: precedentLabel,
      description: "Verified Supreme Court judgments and binding judicial guidelines.",
      href: precedentHref,
      color: "from-purple-500/10 to-pink-500/10 text-purple-500 border-purple-500/20",
    },
  ].filter(Boolean) as {
    icon: typeof BookOpen;
    tag: string;
    title: string;
    description: string;
    href: string;
    color: string;
  }[];

  if (pathways.length === 0) return null;

  return (
    <div className={`glass-strong border-border/70 rounded-3xl p-6 sm:p-8 ${className}`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Sparkles className="text-brand size-4" />
          <span className="text-brand text-xs font-bold uppercase tracking-wider">
            Connected Legal Pathways
          </span>
        </div>
        <h3 className="text-foreground text-lg font-bold sm:text-xl">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm">
          {subtitle}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pathways.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`glass hover:border-brand/40 group flex flex-col justify-between rounded-2xl border p-4 transition-all hover:-translate-y-0.5`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`flex size-8 items-center justify-center rounded-lg bg-gradient-to-br ${item.color}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="text-muted-foreground group-hover:text-foreground text-xs transition-colors">
                    <ChevronRight className="size-4" />
                  </span>
                </div>
                <span className="text-muted-foreground/80 text-[10px] font-bold uppercase tracking-wider">
                  {item.tag}
                </span>
                <h4 className="text-foreground group-hover:text-brand text-sm font-semibold transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="border-border/30 text-brand mt-4 flex items-center gap-1 border-t pt-2.5 text-xs font-medium">
                <CheckCircle2 className="size-3" />
                <span>Explore pathway</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
