'use client';

import * as React from 'react';
import {
  CheckCircle2,
  Clock,
  EyeOff,
  HelpCircle,
  History,
  Lock,
  MessageSquareHeart,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  deleteCitizenOutcomeFeedbackAction,
  submitCitizenOutcomeFeedbackAction,
} from '@/actions/outcome-analytics.actions';
import type {
  CitizenOutcomeFeedbackRecord,
  ClaritySignalType,
  ContactMethodType,
  OutcomeStatusType,
  PreparationValueType,
  ResourceExperienceType,
} from '@/types/outcome-analytics';

interface CitizenOutcomeCheckinCardProps {
  caseId?: string | null;
  issueCategory?: string;
  stateCode?: string;
  districtName?: string | null;
  languageCode?: string;
  verifiedResourceId?: string | null;
  verifiedResourceType?: string | null;
  initialRecord?: CitizenOutcomeFeedbackRecord | null;
}

const OUTCOME_OPTIONS: Array<{ value: OutcomeStatusType; label: string }> = [
  { value: 'not_started', label: 'Not started yet' },
  { value: 'contacted', label: 'Contacted helpline / portal / office' },
  { value: 'awaiting_response', label: 'Submitted & awaiting response' },
  { value: 'received_response', label: 'Received initial response' },
  { value: 'partially_addressed', label: 'Issue partially addressed' },
  { value: 'resolved', label: 'Issue resolved' },
  { value: 'still_ongoing', label: 'Still ongoing' },
  { value: 'could_not_proceed', label: 'Could not proceed' },
  { value: 'not_sure', label: 'Not sure yet' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const CONTACT_METHOD_OPTIONS: Array<{ value: ContactMethodType; label: string }> = [
  { value: 'online_portal', label: 'Official Online Portal' },
  { value: 'phone', label: 'Official Helpline / Phone Call' },
  { value: 'legal_aid_office', label: 'DLSA / Legal-Aid Clinic' },
  { value: 'in_person', label: 'In-Person Office Visit' },
  { value: 'written_complaint', label: 'Written Application / Notice' },
  { value: 'email', label: 'Official Email' },
  { value: 'other', label: 'Other Channel' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const RESOURCE_EXPERIENCE_OPTIONS: Array<{
  value: ResourceExperienceType;
  label: string;
}> = [
  { value: 'found_resource', label: 'Reached the right office / portal' },
  { value: 'received_response', label: 'Received acknowledgment or guidance' },
  { value: 'still_waiting', label: 'Submitted details, currently waiting' },
  { value: 'could_not_reach', label: 'Could not reach the listed contact' },
  { value: 'do_not_know_yet', label: 'Have not tried / Do not know yet' },
];

const CLARITY_OPTIONS: Array<{ value: ClaritySignalType; label: string }> = [
  { value: 'much_clearer', label: 'Much clearer about my next step' },
  { value: 'a_little_clearer', label: 'A little clearer' },
  { value: 'about_the_same', label: 'About the same as before' },
  { value: 'less_clear', label: 'Still confused / less clear' },
  { value: 'not_sure', label: 'Not sure' },
];

const PREP_VALUE_OPTIONS: Array<{ value: PreparationValueType; label: string }> = [
  { value: 'very_helpful', label: 'Very helpful in organizing facts & documents' },
  { value: 'somewhat_helpful', label: 'Somewhat helpful' },
  { value: 'not_helpful', label: 'Not helpful for my situation' },
  { value: 'not_used', label: 'Did not use the preparation dossier yet' },
  { value: 'not_sure', label: 'Not sure' },
];

export function CitizenOutcomeCheckinCard({
  caseId = null,
  issueCategory = 'Cyber Financial Fraud & UPI Disputes',
  stateCode = 'DL',
  districtName = 'New Delhi',
  languageCode = 'en',
  verifiedResourceId = 'res_ncrp_1930',
  verifiedResourceType = 'Statutory Helpline & Portal',
  initialRecord = null,
}: CitizenOutcomeCheckinCardProps) {
  const [dismissedForSession, setDismissedForSession] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(Boolean(initialRecord));
  const [savedRecord, setSavedRecord] =
    React.useState<CitizenOutcomeFeedbackRecord | null>(initialRecord);

  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [outcomeStatus, setOutcomeStatus] =
    React.useState<OutcomeStatusType>('contacted');
  const [contactMethod, setContactMethod] =
    React.useState<ContactMethodType>('online_portal');
  const [resourceExperience, setResourceExperience] =
    React.useState<ResourceExperienceType>('found_resource');
  const [claritySignal, setClaritySignal] =
    React.useState<ClaritySignalType>('much_clearer');
  const [preparationValue, setPreparationValue] =
    React.useState<PreparationValueType>('very_helpful');
  const [optionalNote, setOptionalNote] = React.useState('');
  const [consentChecked, setConsentChecked] = React.useState(true);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [statusBanner, setStatusBanner] = React.useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  if (dismissedForSession) {
    return (
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <MessageSquareHeart className="h-4 w-4 text-teal-400 shrink-0" />
          <span>
            Voluntary Outcome Check-In is hidden for now. You can share or update your
            progress whenever you feel ready.
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDismissedForSession(false)}
          className="h-7 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
        >
          Re-open Check-In
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusBanner(null);

    const result = await submitCitizenOutcomeFeedbackAction({
      existingFeedbackId: savedRecord?.id ?? null,
      caseId,
      isAnonymous,
      issueCategory,
      stateCode,
      districtName,
      languageCode,
      outcomeStatus,
      contactMethod,
      resourceExperience,
      claritySignal,
      preparationValue,
      verifiedResourceId,
      verifiedResourceType,
      optionalFeedbackText: optionalNote,
      consentAcknowledged: consentChecked,
    });

    setIsSubmitting(false);

    if (!result.success || !result.record) {
      setStatusBanner({
        type: 'error',
        message: result.error || 'Could not save your feedback right now.',
      });
      return;
    }

    setSavedRecord(result.record);
    setStatusBanner({
      type: 'success',
      message: isAnonymous
        ? 'Thank you. Your anonymous self-reported check-in has been recorded without account linkage.'
        : 'Saved! You can update your outcome timeline anytime as your situation progresses.',
    });
  }

  async function handleDelete() {
    if (!savedRecord) return;
    setIsDeleting(true);
    setStatusBanner(null);

    const res = await deleteCitizenOutcomeFeedbackAction(savedRecord.id);
    setIsDeleting(false);

    if (res.success) {
      setSavedRecord(null);
      setOptionalNote('');
      setStatusBanner({
        type: 'info',
        message: 'Your outcome feedback record and timeline have been deleted.',
      });
    } else {
      setStatusBanner({
        type: 'error',
        message: res.error || 'Unable to delete feedback record.',
      });
    }
  }

  return (
    <section
      aria-label="Voluntary Citizen Outcome & Experience Check-In"
      className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-teal-950/20 p-5 shadow-lg"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-teal-500/15 text-teal-300 border-teal-500/30 text-[11px]">
              <MessageSquareHeart className="h-3 w-3 mr-1" />
              Voluntary Outcome Check-In (E16)
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-700 text-slate-300 text-[11px]"
            >
              Self-Reported Citizen Signal
            </Badge>
            {savedRecord && (
              <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[11px]">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {savedRecord.timeline.length} Timeline Update
                {savedRecord.timeline.length === 1 ? '' : 's'} Recorded
              </Badge>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-100">
            Did this preparation help you take a clearer next step?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            Sharing an update is completely optional. Your feedback helps verify whether
            listed helplines, portals, and DLSA offices are reachable and whether our
            plain-language guides improve procedural clarity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="border-teal-500/40 bg-teal-500/10 text-teal-200 hover:bg-teal-500/20 text-xs"
          >
            {isExpanded
              ? 'Collapse Form'
              : savedRecord
                ? 'Update Outcome Progress'
                : 'Share Optional Check-In'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setDismissedForSession(true)}
            className="text-slate-400 hover:text-slate-200 text-xs"
            title="Dismiss check-in for now"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Not now
          </Button>
        </div>
      </div>

      {/* Longitudinal Progress Bar (Prepared -> Contacted -> Received Response -> Resolved) */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl border border-slate-800/90 bg-slate-950/60 p-3">
        {[
          {
            step: '1. Prepared Facts',
            active: true,
            desc: 'Case Prep Workspace ready',
          },
          {
            step: '2. Contacted Office',
            active:
              outcomeStatus === 'contacted' ||
              outcomeStatus === 'awaiting_response' ||
              outcomeStatus === 'received_response' ||
              outcomeStatus === 'partially_addressed' ||
              outcomeStatus === 'resolved',
            desc: 'Helpline / Portal / DLSA',
          },
          {
            step: '3. Received Response',
            active:
              outcomeStatus === 'received_response' ||
              outcomeStatus === 'partially_addressed' ||
              outcomeStatus === 'resolved',
            desc: 'Acknowledgment or guidance',
          },
          {
            step: '4. Addressed / Resolved',
            active:
              outcomeStatus === 'partially_addressed' || outcomeStatus === 'resolved',
            desc: 'Longitudinal follow-up',
          },
        ].map((milestone) => (
          <div
            key={milestone.step}
            className={`rounded-lg border px-3 py-2 transition-colors ${
              milestone.active
                ? 'border-teal-500/40 bg-teal-950/30 text-teal-200'
                : 'border-slate-800 bg-slate-900/40 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <CheckCircle2
                className={`h-3.5 w-3.5 ${
                  milestone.active ? 'text-teal-400' : 'text-slate-600'
                }`}
              />
              <span>{milestone.step}</span>
            </div>
            <p className="mt-0.5 text-[11px] opacity-80">{milestone.desc}</p>
          </div>
        ))}
      </div>

      {/* Status Banner */}
      {statusBanner && (
        <div
          className={`mt-4 rounded-xl border px-4 py-3 text-xs flex items-center justify-between gap-3 ${
            statusBanner.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
              : statusBanner.type === 'error'
                ? 'border-rose-500/40 bg-rose-950/30 text-rose-200'
                : 'border-sky-500/40 bg-sky-950/30 text-sky-200'
          }`}
        >
          <span>{statusBanner.message}</span>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-current opacity-75 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Existing Timeline Summary (if citizen already logged an outcome) */}
      {savedRecord && savedRecord.timeline.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <History className="h-3.5 w-3.5 text-teal-400" />
              <span>Your Longitudinal Outcome Timeline (Self-Reported)</span>
            </div>
            {!savedRecord.isAnonymous && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={handleDelete}
                className="h-7 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/40"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                {isDeleting ? 'Deleting...' : 'Delete My Feedback'}
              </Button>
            )}
          </div>
          <div className="space-y-1.5">
            {savedRecord.timeline.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800/80 bg-slate-900/70 px-3 py-1.5 text-xs"
              >
                <div className="flex items-center gap-2 text-slate-200">
                  <Clock className="h-3 w-3 text-teal-400 shrink-0" />
                  <span className="font-medium">{evt.noteSummary}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(evt.recordedAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 border-t border-slate-800 pt-4">
          {/* Privacy Mode Toggle: Private Linked vs Anonymous Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsAnonymous(false)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                !isAnonymous
                  ? 'border-teal-500/50 bg-teal-950/30 text-slate-100'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <Lock className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold">
                  Private Workspace Timeline (Update Later)
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Links this outcome to your private Case Prep Workspace so you can update
                  it later (e.g. from &ldquo;Awaiting Response&rdquo; to &ldquo;Resolved&rdquo;) or delete it anytime.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsAnonymous(true)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                isAnonymous
                  ? 'border-amber-500/50 bg-amber-950/25 text-slate-100'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <EyeOff className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold">
                  Strict Anonymous Mode (No Account Link)
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Detaches your user ID and case ID before storage. Used strictly in
                  privacy-thresholded aggregate statistics ($n \ge 10$).
                </p>
              </div>
            </button>
          </div>

          {/* Structured 5-Signal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Current Outcome Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-200">
                1. Current Status of Your Next Step
              </label>
              <select
                value={outcomeStatus}
                onChange={(e) => setOutcomeStatus(e.target.value as OutcomeStatusType)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-teal-500 focus:outline-none"
              >
                {OUTCOME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Contact Method */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-200">
                2. Channel Used (or Planned)
              </label>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value as ContactMethodType)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-teal-500 focus:outline-none"
              >
                {CONTACT_METHOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Verified Resource Reachability */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-200">
                3. Experience Reaching Verified Authority / Portal
              </label>
              <select
                value={resourceExperience}
                onChange={(e) =>
                  setResourceExperience(e.target.value as ResourceExperienceType)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-teal-500 focus:outline-none"
              >
                {RESOURCE_EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Procedural Clarity Signal */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-200">
                4. Did Nyaya Help Clarify Your Procedural Options?
              </label>
              <select
                value={claritySignal}
                onChange={(e) => setClaritySignal(e.target.value as ClaritySignalType)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-teal-500 focus:outline-none"
              >
                {CLARITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Case Preparation Workspace Helpfulness */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-medium text-slate-200">
                5. How Helpful Was the Case Preparation Workspace & Bilingual Dossier?
              </label>
              <select
                value={preparationValue}
                onChange={(e) =>
                  setPreparationValue(e.target.value as PreparationValueType)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-teal-500 focus:outline-none"
              >
                {PREP_VALUE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Short Note with PII Prevention Guard */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-teal-400" />
                <span>
                  Optional Note on Resource Accessibility (Max 280 chars — No personal IDs)
                </span>
              </label>
              <span className="text-[11px] text-slate-400">
                {optionalNote.length}/280
              </span>
            </div>
            <textarea
              rows={2}
              maxLength={280}
              value={optionalNote}
              onChange={(e) => setOptionalNote(e.target.value)}
              placeholder="e.g., Helpline 1930 answered quickly once I had my transaction UTR ready from the checklist."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
            />
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-1.5 text-[11px] text-amber-200">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>
                Privacy Guard: Please do not enter Aadhaar numbers, phone numbers, bank
                account numbers, or names. Any accidental numbers are automatically scrubbed.
              </span>
            </div>
          </div>

          {/* Explicit Consent & Evidence Notice */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/80 p-3">
            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer max-w-2xl">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 rounded border-slate-600 text-teal-500 focus:ring-teal-500"
              />
              <span>
                I understand this check-in is voluntary, recorded as a{' '}
                <strong className="text-slate-100">citizen self-reported signal</strong>{' '}
                (not a verified judicial outcome), and protected by small-cohort privacy
                suppression ($n \ge 10$).
              </span>
            </label>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || !consentChecked}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : savedRecord ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Save Outcome Update
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                    Submit Voluntary Check-In
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
