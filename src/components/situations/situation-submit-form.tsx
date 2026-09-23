"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { submitSituationAction } from "@/actions/moderation.actions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout";
import {
  ArrowLeft,
  CheckCircle2,
  Compass,
  Loader2,
  Plus,
  Scale,
  ShieldAlert,
  Trash2,
} from "@/lib/icons";

const CATEGORIES = [
  { id: "police-rights", label: "Police & Criminal Law (BNS/CrPC)" },
  { id: "housing-tenancy", label: "Housing & Tenancy Disputes" },
  { id: "cyber-fraud", label: "Cyber Crime & Financial Fraud" },
  { id: "consumer-rights", label: "Consumer Rights & Defective Goods" },
  { id: "traffic-challans", label: "Traffic, MV Act & Challans" },
  { id: "workplace-rights", label: "Workplace & Labour Law" },
  { id: "constitutional-rights", label: "Fundamental Rights & Writs" },
];

export function SituationSubmitForm() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [summary, setSummary] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const [immediateActions, setImmediateActions] = useState<string[]>([
    "Demand written notice citing relevant statutory section.",
  ]);
  const [dontDo, setDontDo] = useState<string[]>([
    "Do not sign blank documents or make unreceipted cash payments.",
  ]);
  const [statutoryReference, setStatutoryReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addAction = () => {
    setImmediateActions((prev) => [...prev, ""]);
  };

  const updateAction = (index: number, val: string) => {
    setImmediateActions((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const removeAction = (index: number) => {
    if (immediateActions.length <= 1) return;
    setImmediateActions((prev) => prev.filter((_, i) => i !== index));
  };

  const addDontDo = () => {
    setDontDo((prev) => [...prev, ""]);
  };

  const updateDontDo = (index: number, val: string) => {
    setDontDo((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const removeDontDo = (index: number) => {
    if (dontDo.length <= 1) return;
    setDontDo((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !whatHappened.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const filteredActions = immediateActions.map((a) => a.trim()).filter(Boolean);
    const filteredDont = dontDo.map((d) => d.trim()).filter(Boolean);

    if (filteredActions.length === 0 || filteredDont.length === 0) {
      toast.error("Provide at least one recommended action and one caution.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitSituationAction({
        title: title.trim(),
        categoryId,
        summary: summary.trim(),
        whatHappened: whatHappened.trim(),
        immediateActions: filteredActions,
        dontDo: filteredDont,
        statutoryReference: statutoryReference.trim() || undefined,
      });

      if (res.success) {
        setIsSubmitted(true);
        toast.success("Situation Submitted for Advocate Verification! ⚖️", {
          description: "Our legal advocates and educators will review and publish it.",
        });
      } else {
        toast.error(res.error ?? "Failed to submit situation");
      }
    } catch {
      toast.error("Submission failed. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Container size="narrow" gutter="page" className="py-12">
        <div className="glass-strong border-brand/50 flex flex-col items-center gap-5 rounded-3xl p-8 sm:p-12 text-center">
          <span className="bg-emerald-500/15 text-emerald-500 flex size-16 items-center justify-center rounded-2xl shadow-sm">
            <CheckCircle2 className="size-8" />
          </span>
          <div className="flex flex-col gap-2">
            <span className="text-brand text-xs font-bold uppercase tracking-wider">
              Verification Pipeline Active
            </span>
            <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
              Situation Successfully Submitted!
            </h2>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Your situation has been queued in the <strong>Moderator Verification Queue</strong>.
              Advocates will review the facts, link relevant statutes, and publish it to empower fellow citizens.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Button
              onClick={() => {
                setTitle("");
                setSummary("");
                setWhatHappened("");
                setIsSubmitted(false);
              }}
              variant="outline"
              className="glass rounded-xl"
            >
              Submit Another Situation
            </Button>
            <Link href="/moderation">
              <Button className="rounded-xl">View in Verification Queue</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container size="narrow" gutter="page" className="flex flex-col gap-8">
      {/* Back Link */}
      <Link
        href="/situations"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Situations
      </Link>

      {/* Form Card */}
      <div className="glass-strong border-brand/40 flex flex-col gap-6 rounded-3xl p-6 sm:p-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand/15 text-brand flex size-8 items-center justify-center rounded-xl">
              <Compass className="size-4.5" />
            </span>
            <span className="text-brand text-xs font-bold uppercase tracking-wider">
              Citizen Contribution Portal
            </span>
          </div>
          <h1 className="text-foreground mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Submit a Real-Life Legal Situation
          </h1>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Encountered an arbitrary checkpoint, unfair eviction notice, or cyber scam?
            Submit your experience so advocates can codify verified statutory remedies for all citizens.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
          {/* Situation Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-xs font-bold uppercase tracking-wider">
              Situation Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Police Demanded Phone Unlock at Metro Station Without Warrant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground rounded-xl border px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-xs font-bold uppercase tracking-wider">
              Legal Domain / Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border-border/60 bg-card text-foreground rounded-xl border px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Summary */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-xs font-bold uppercase tracking-wider">
              Citizen Dilemma Summary * (2-3 sentences)
            </label>
            <textarea
              required
              rows={2}
              placeholder="Briefly state what the authority/party demanded and why the citizen was uncertain about their rights..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground rounded-xl border px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          {/* Full Narrative */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-xs font-bold uppercase tracking-wider">
              What Happened in Detail *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the exact sequence of events, what was stated, what documents were exchanged..."
              value={whatHappened}
              onChange={(e) => setWhatHappened(e.target.value)}
              className="border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground rounded-xl border px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          {/* Immediate Actions */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-foreground text-xs font-bold uppercase tracking-wider">
                Recommended Immediate Actions (What to do) *
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addAction}
                className="text-brand hover:text-brand gap-1 text-xs"
              >
                <Plus className="size-3.5" />
                Add Action
              </Button>
            </div>
            {immediateActions.map((action, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Action ${idx + 1}`}
                  value={action}
                  onChange={(e) => updateAction(idx, e.target.value)}
                  className="border-border/60 bg-muted/20 text-foreground rounded-xl border px-3 py-2 text-xs sm:text-sm flex-1 focus:border-brand focus:outline-none"
                />
                {immediateActions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAction(idx)}
                    className="text-muted-foreground hover:text-destructive p-1.5 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Don'ts */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-foreground text-xs font-bold uppercase tracking-wider">
                Critical Mistakes to Avoid (What NOT to do) *
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addDontDo}
                className="text-destructive hover:text-destructive gap-1 text-xs"
              >
                <Plus className="size-3.5" />
                Add Caution
              </Button>
            </div>
            {dontDo.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Caution ${idx + 1}`}
                  value={item}
                  onChange={(e) => updateDontDo(idx, e.target.value)}
                  className="border-border/60 bg-muted/20 text-foreground rounded-xl border px-3 py-2 text-xs sm:text-sm flex-1 focus:border-brand focus:outline-none"
                />
                {dontDo.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDontDo(idx)}
                    className="text-muted-foreground hover:text-destructive p-1.5 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Statutory Reference */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-xs font-bold uppercase tracking-wider">
              Relevant Statutory Section / Rule (Optional):
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Article 21, Section 100 CrPC, Section 66D IT Act"
                value={statutoryReference}
                onChange={(e) => setStatutoryReference(e.target.value)}
                className="border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-3 py-2.5 pl-9 text-xs sm:text-sm focus:border-brand focus:outline-none"
              />
              <Scale className="text-muted-foreground absolute top-3 left-3 size-4" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl px-6 py-2.5 font-semibold gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldAlert className="size-4" />
              )}
              <span>Submit for Verification</span>
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
