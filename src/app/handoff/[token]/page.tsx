import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Lock, QrCode, ShieldAlert } from "lucide-react";
import { HandoffPrintControls } from "@/components/action/handoff-print-controls";
import { getHandoffSnapshotByOpaqueToken } from "@/services/action/case-prep-handoff.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Temporary Read-Only Citizen Handoff · Nyaya Revolution",
  description:
    "Time-limited, read-only citizen preparation snapshot for legal-aid clinic and DLSA front-office assistance.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

interface HandoffViewerPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function HandoffViewerPage({
  params,
}: HandoffViewerPageProps) {
  const { token } = await params;
  const validation = getHandoffSnapshotByOpaqueToken({
    rawToken: decodeURIComponent(token),
  });

  if (!validation.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
        <div className="max-w-lg rounded-3xl border border-rose-500/40 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold text-white">
            Temporary Handoff Link Unavailable
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            {validation.safeErrorMessage}
          </p>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-400">
            Zero-Trust Security Policy: For citizen privacy, Nyaya Revolution
            does not disclose whether a handoff link previously existed,
            expired, or was revoked.
          </div>
          <div className="mt-6">
            <Link
              href="/action-center"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
            >
              Return to Nyaya Action Center
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { session, snapshot, remainingMinutes } = validation;

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 text-slate-100 print:bg-white print:p-0 print:text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Zero-Trust Read-Only Helper Banner */}
        <div className="rounded-2xl border border-amber-500/40 bg-slate-900 p-5 shadow-xl print:border-slate-300 print:bg-slate-50 print:text-slate-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 print:border print:border-slate-400 print:text-slate-900">
                  <Lock className="h-3.5 w-3.5" />
                  Temporary Read-Only Citizen Handoff
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 print:border print:border-slate-400 print:text-slate-900">
                  <Clock className="h-3.5 w-3.5" />
                  Expires in {remainingMinutes} min (UTC Server Enforced)
                </span>
              </div>
              <h1 className="mt-2 text-lg font-extrabold text-white print:text-slate-950">
                Purpose: {session.purpose} ({session.shareLabel})
              </h1>
              <p className="mt-1 text-xs text-slate-300 print:text-slate-700">
                This is a citizen-provided preparation document (Frozen Snapshot
                v{snapshot.snapshotVersion}). It is not an official legal record
                or legal opinion.
              </p>
            </div>
            <HandoffPrintControls />
          </div>
        </div>

        {/* Frozen Read-Only Dossier Sheet */}
        <div className="rounded-2xl border border-slate-300 bg-white p-8 text-slate-900 shadow-2xl print:rounded-none print:border-none print:p-0 print:shadow-none">
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
              NYAYA REVOLUTION • READ-ONLY CITIZEN HANDOFF SNAPSHOT (v
              {snapshot.snapshotVersion})
            </div>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
              {snapshot.title}
            </h2>
            <div className="mt-1 text-xs text-slate-600">
              Snapshot Captured:{" "}
              {new Date(snapshot.createdAt).toLocaleString("en-IN")} | Access #
              {session.accessCount} of {session.maxAccesses} | Expires:{" "}
              {new Date(session.expiresAt).toLocaleString("en-IN")}
            </div>
          </div>

          {/* 1. Situation Summary (If included in scope) */}
          {snapshot.situationSummaryEn && (
            <section className="mt-6 space-y-2 border-b border-slate-200 pb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                1. Situation Summary (Citizen-Provided Facts)
              </h3>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed">
                <div className="font-bold text-slate-700">ENGLISH:</div>
                <p className="mt-1 text-slate-900">
                  {snapshot.situationSummaryEn}
                </p>
                {snapshot.secondaryLanguage !== "none" &&
                  snapshot.situationSummaryHi && (
                    <div className="mt-3 border-t border-slate-200 pt-2.5">
                      <div className="font-bold text-slate-700">
                        HINDI / हिन्दी:
                      </div>
                      <p className="mt-1 text-slate-900">
                        {snapshot.situationSummaryHi}
                      </p>
                    </div>
                  )}
              </div>
            </section>
          )}

          {/* 2. Chronology Timeline (If included in scope) */}
          {snapshot.timeline && snapshot.timeline.length > 0 && (
            <section className="mt-6 space-y-2 border-b border-slate-200 pb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                2. Chronology / Timeline ({snapshot.timeline.length} Events)
              </h3>
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100">
                    <th className="p-2 font-bold">Date</th>
                    <th className="p-2 font-bold">Event</th>
                    <th className="p-2 font-bold">Action & Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {snapshot.timeline.map((ev) => (
                    <tr key={ev.id}>
                      <td className="p-2 font-mono font-semibold whitespace-nowrap">
                        {ev.eventDate}
                      </td>
                      <td className="p-2 font-semibold">{ev.eventTitle}</td>
                      <td className="p-2 text-[11px] text-slate-700">
                        Action: {ev.actionTaken} | Response:{" "}
                        {ev.responseReceived}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* 3. Checklist (If included in scope) */}
          {snapshot.checklist && snapshot.checklist.length > 0 && (
            <section className="mt-6 space-y-2 border-b border-slate-200 pb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                3. Documents & Information Checklist
              </h3>
              <ul className="space-y-1.5 text-xs">
                {snapshot.checklist.map((c) => (
                  <li key={c.id}>
                    <span className="font-mono font-bold">
                      [{c.isChecked ? "✓" : "☐"}]
                    </span>{" "}
                    {c.itemLabel} —{" "}
                    <span className="text-slate-600">{c.userNote}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 4. Verified Authority Snapshot (If included in scope) */}
          {snapshot.linkedAuthoritySnapshot && (
            <section className="mt-6 space-y-2 border-b border-slate-200 pb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                4. Verified Legal-Services Authority Snapshot (Version v
                {snapshot.linkedAuthoritySnapshot.publishedVersionNumber})
              </h3>
              <div className="flex items-center justify-between rounded-lg border border-slate-300 bg-slate-50 p-3.5 text-xs">
                <div>
                  <div className="font-bold text-slate-950">
                    {snapshot.linkedAuthoritySnapshot.authorityName}
                  </div>
                  <div>
                    Phone:{" "}
                    {snapshot.linkedAuthoritySnapshot.phone ?? "Not listed"} |
                    Helpline:{" "}
                    {snapshot.linkedAuthoritySnapshot.helpline ?? "15100"}
                  </div>
                  <div>
                    Address:{" "}
                    {snapshot.linkedAuthoritySnapshot.address ?? "Not listed"}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Source: {snapshot.linkedAuthoritySnapshot.sourceUrl} (Verified{" "}
                    {snapshot.linkedAuthoritySnapshot.verifiedAtSnapshot})
                  </div>
                </div>
                <QrCode className="h-10 w-10 shrink-0 text-slate-800" />
              </div>
            </section>
          )}

          {/* 5. Questions to Discuss (If included in scope) */}
          {snapshot.questionsToDiscuss &&
            snapshot.questionsToDiscuss.length > 0 && (
              <section className="mt-6 space-y-2 border-b border-slate-200 pb-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  5. Citizen Questions for Discussion
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  {snapshot.questionsToDiscuss.map((q) => (
                    <li key={q.id}>{q.questionEn}</li>
                  ))}
                </ul>
              </section>
            )}

          {/* 6. Opt-In Attachments Metadata (Only if citizen explicitly opted in) */}
          <section className="mt-6 space-y-1 border-b border-slate-200 pb-4 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-800">
              6. Opt-In Attachments Shared ({snapshot.includedAttachments.length}
              )
            </h3>
            {snapshot.includedAttachments.length === 0 ? (
              <p className="text-slate-600">
                0 private attachments were included in this temporary handoff
                (default privacy protection).
              </p>
            ) : (
              <ul className="list-disc pl-5">
                {snapshot.includedAttachments.map((att) => (
                  <li key={att.id}>
                    {att.filename} ({Math.round(att.fileSizeBytes / 1024)} KB) —{" "}
                    {att.description}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <footer className="mt-5 text-[11px] text-slate-600">
            <strong>Temporary Read-Only Citizen Handoff Notice:</strong> This is
            a citizen-prepared organizational snapshot shared temporarily for
            consultation. It does not grant account ownership or edit rights,
            and access automatically disappears upon expiry or revocation.
          </footer>
        </div>
      </div>
    </div>
  );
}
