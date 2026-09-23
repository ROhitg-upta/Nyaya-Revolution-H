"use client";

import { useState } from "react";
import { toast } from "sonner";
import { verifyContentItemAction } from "@/actions/moderation.actions";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Scale,
  ShieldCheck,
  X,
  XCircle,
} from "@/lib/icons";
import type { ModerationQueueItem } from "@/types";

interface VerificationReviewModalProps {
  item: ModerationQueueItem | null;
  onClose: () => void;
  onUpdated: (entityId: string, newStatus: string) => void;
}

export function VerificationReviewModal({
  item,
  onClose,
  onUpdated,
}: VerificationReviewModalProps) {
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [editedTitle, setEditedTitle] = useState<string>(item?.title ?? "");
  const [editedSummary, setEditedSummary] = useState<string>(item?.summary ?? "");
  const [editedCitation, setEditedCitation] = useState<string>(
    item?.statutoryReference ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!item) return null;

  const handleAction = async (decision: "approve" | "reject" | "revise") => {
    setIsSubmitting(true);
    try {
      const res = await verifyContentItemAction({
        entityType: item.entityType,
        entityId: item.id,
        decision,
        reviewNotes: reviewNotes.trim() || undefined,
        revisedData: {
          title: editedTitle,
          summary: editedSummary,
          statutoryReference: editedCitation,
        },
      });

      if (res.success && res.data) {
        toast.success(
          decision === "approve"
            ? "Content Verified & Published! ⚖️"
            : decision === "reject"
              ? "Content Rejected with Feedback"
              : "Revision Requested"
        );
        onUpdated(item.id, res.data.newStatus);
        onClose();
      } else {
        toast.error(res.error ?? "Failed to update status");
      }
    } catch {
      toast.error("Network or moderation error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="glass-strong border-border/80 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 p-6">
          <div className="flex items-center gap-2.5">
            <span className="bg-brand/15 text-brand flex size-8 items-center justify-center rounded-xl">
              <ShieldCheck className="size-4.5" />
            </span>
            <div>
              <span className="text-brand text-[11px] font-bold uppercase tracking-wider">
                Statutory Verification Workbench
              </span>
              <h2 className="text-foreground text-lg font-bold">
                Review & Verification Panel
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground glass rounded-lg p-1.5 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6 text-sm">
          {/* Submitter & Entity Metadata */}
          <div className="border-border/50 bg-muted/20 flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-3.5 text-xs">
            <div>
              <span className="text-muted-foreground">Submitted by: </span>
              <strong className="text-foreground">{item.authorName}</strong> (
              {item.authorRole})
            </div>
            <div>
              <span className="text-muted-foreground">Category: </span>
              <strong className="text-foreground">{item.category}</strong>
            </div>
          </div>

          {/* Submission Narrative / What Happened */}
          {item.details?.whatHappened && (
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-xs font-bold uppercase tracking-wider">
                Original Narrative / Context:
              </label>
              <div className="border-border/50 bg-muted/10 text-foreground/90 max-h-40 overflow-y-auto rounded-xl border p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {item.details.whatHappened}
              </div>
            </div>
          )}

          {/* AI Quiz Options if Quiz */}
          {item.entityType === "quiz" && item.details?.options && (
            <div className="flex flex-col gap-2">
              <label className="text-foreground text-xs font-bold uppercase tracking-wider">
                AI Draft Quiz Options:
              </label>
              <div className="flex flex-col gap-2">
                {item.details.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`rounded-xl border p-3 text-xs leading-relaxed ${
                      opt.isRecommended
                        ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                        : "border-border/40 bg-muted/10 text-muted-foreground"
                    }`}
                  >
                    <div className="font-semibold">{opt.text}</div>
                    <div className="text-[11px] opacity-80 mt-1">
                      Rationale: {opt.rationale}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Editing / Refinement */}
          <div className="flex flex-col gap-3">
            <span className="text-brand text-xs font-bold uppercase tracking-wider">
              Advocate Refinement (Pre-Publication Edit):
            </span>

            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-xs font-medium">Title:</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="border-border/60 bg-muted/20 text-foreground rounded-xl border px-3 py-2 text-xs sm:text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-xs font-medium">
                Summary / Citizen Explanation:
              </label>
              <textarea
                rows={2}
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                className="border-border/60 bg-muted/20 text-foreground rounded-xl border px-3 py-2 text-xs sm:text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-xs font-medium">
                Verified Statutory Reference (Act, Section, Rule):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={editedCitation}
                  onChange={(e) => setEditedCitation(e.target.value)}
                  placeholder="e.g. Section 41A CrPC / Section 35 BNSS, Rule 139 CMVR"
                  className="border-border/60 bg-muted/20 text-foreground w-full rounded-xl border px-3 py-2 pl-8 font-mono text-xs sm:text-sm focus:border-brand focus:outline-none"
                />
                <Scale className="text-brand absolute top-2.5 left-2.5 size-4" />
              </div>
            </div>
          </div>

          {/* Review Notes Input */}
          <div className="flex flex-col gap-1">
            <label className="text-foreground text-xs font-bold uppercase tracking-wider">
              Verification Notes & Legal Audit Log:
            </label>
            <textarea
              rows={2}
              placeholder="State why this was approved, statutory accuracy confirmed, or reasons for rejection..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground rounded-xl border px-3 py-2 text-xs focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-border/50 bg-muted/15 flex flex-wrap items-center justify-between gap-3 border-t p-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => handleAction("reject")}
              className="text-destructive hover:bg-destructive/10 border-destructive/30 rounded-xl gap-1.5 text-xs font-semibold"
            >
              <XCircle className="size-3.5" />
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => handleAction("revise")}
              className="text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border-amber-500/30 rounded-xl gap-1.5 text-xs font-semibold"
            >
              <AlertTriangle className="size-3.5" />
              Request Revision
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={() => handleAction("approve")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl gap-1.5 text-xs font-semibold shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-3.5" />
              )}
              Approve & Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
