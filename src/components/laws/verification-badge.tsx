"use client";

import { ExternalLink } from "@/lib/icons";
import type { ContentSource, VerificationStatus } from "@/types";

interface VerificationBadgeProps {
  source?: ContentSource;
  status?: VerificationStatus;
  lastVerifiedAt?: string;
  className?: string;
  showLink?: boolean;
}

export function VerificationBadge({
  source,
  status = "verified",
  lastVerifiedAt = "2025-01-15",
  className = "",
  showLink = true,
}: VerificationBadgeProps) {
  const isVerified = status === "verified";

  return (
    <div
      className={`glass border-border/60 inline-flex flex-wrap items-center gap-2.5 rounded-full px-3.5 py-1 text-xs ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`flex size-2 rounded-full ${
            isVerified ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
          }`}
        />
        <span className="font-semibold text-foreground">
          {isVerified ? "Statutorily Verified" : "Under Review"}
        </span>
      </div>

      {lastVerifiedAt ? (
        <span className="text-muted-foreground hidden sm:inline">
          · Verified: {lastVerifiedAt}
        </span>
      ) : null}

      {source?.publisher ? (
        <span className="text-muted-foreground hidden md:inline">
          · Source: {source.publisher}
        </span>
      ) : null}

      {source?.url ? (
        showLink ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand inline-flex items-center gap-0.5 font-medium hover:underline"
            title={`Official record: ${source.title}`}
          >
            <span>India Code / Official</span>
            <ExternalLink className="size-3" />
          </a>
        ) : (
          <span
            className="text-muted-foreground/80 hidden lg:inline-flex items-center gap-0.5 font-medium"
            title={`Official record: ${source.title}`}
          >
            <span>Official Record</span>
          </span>
        )
      ) : null}
    </div>
  );
}
