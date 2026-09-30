import type { Metadata } from "next";
import { AppHeader } from "@/components/common";
import { ActionCenterHub } from "@/components/action/action-center-hub";
import {
  Building2,
  FileText,
  FolderKanban,
  Languages,
  Mic,
  ShieldCheck,
} from "@/lib/icons";
import type { CitizenDocumentTemplateType } from "@/types/action-engine";

export const metadata: Metadata = {
  title:
    "Multilingual Voice, Verified Legal Aid & Citizen Action Engine | Nyaya Revolution",
  description:
    "Speak or describe what happened in Hindi, Hinglish, regional Indian languages, or English. Discover verified NALSA/DLSA legal aid (15100), Cybercrime 1930, Consumer 1915, and prepare printable A4 Citizen Action Drafts.",
};

interface ActionCenterPageProps {
  searchParams: Promise<{
    category?: string;
    template?: string;
    q?: string;
  }>;
}

export default async function ActionCenterPage({
  searchParams,
}: ActionCenterPageProps) {
  const resolvedParams = await searchParams;

  const validTemplates: CitizenDocumentTemplateType[] = [
    "consumer-grievance-v1",
    "rti-application-v1",
    "cyber-fraud-incident-v1",
    "workplace-wage-representation-v1",
    "legal-aid-checklist-v1",
    "lok-adalat-prep-brief-v1",
  ];

  const initialTemplate = validTemplates.includes(
    resolvedParams.template as CitizenDocumentTemplateType
  )
    ? (resolvedParams.template as CitizenDocumentTemplateType)
    : "consumer-grievance-v1";

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div className="print:hidden">
        <AppHeader />
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 print:max-w-none print:p-0">
        {/* Hero Banner (Hidden when printing A4 document) */}
        <section className="mb-8 rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-lg sm:p-8 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
              <Mic className="size-3.5" aria-hidden />
              Sprint E12 • Live Multilingual Voice, DLSA Geo-Locator & Lok Adalat Engine
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="size-3.5" aria-hidden />
              Source-Driven SLSA/DLSA Directory • Zero Fabricated Contacts
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            From Understanding What Happened → To Knowing Your Next Step
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Speak naturally in Hindi, Hinglish, regional Indian languages, or English. Nyaya translates everyday words into verified legal understanding, connects you with official statutory assistance (NALSA 15100, Cyber 1930, Consumer 1915, Central & State RTI), and helps you prepare clean A4 educational drafts.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <Languages className="mt-0.5 size-5 shrink-0 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  Multilingual & Hinglish Voice
                </div>
                <p className="text-[11px] text-slate-300">
                  Preserves your original words with an editable “We heard:” review step and PII redaction.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <Building2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  Verified Legal Aid Directory
                </div>
                <p className="text-[11px] text-slate-300">
                  NALSA, State SLSAs/DLSAs, NCH 1915, Cyber 1930, SAMADHAN, and Central vs State RTI clarity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <FileText className="mt-0.5 size-5 shrink-0 text-sky-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  Bilingual Case Prep Workspace & A4 Dossier
                </div>
                <p className="text-[11px] text-slate-300">
                  Organize timeline, checklist, DLSA version snapshot, and export a bilingual preparation dossier.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-500/40 bg-indigo-950/40 p-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Sprint E14 • Speak / Describe → Understand → Find Help → Prepare → Review → Export
              </div>
              <div className="mt-0.5 text-sm font-bold text-white">
                Ready to organize your chronology, evidence checklist, and DLSA snapshot into an A4 Bilingual Preparation Pack?
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="/action-center/case-prep"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg hover:bg-emerald-400"
              >
                <FileText className="size-4" />
                Case Prep Workspace
              </a>
              <a
                href="/action-center/binder"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-indigo-400 bg-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg hover:bg-indigo-500"
              >
                <FolderKanban className="size-4" />
                Case Binder (E18)
              </a>
            </div>
          </div>
        </section>

        <ActionCenterHub
          initialCategory={resolvedParams.category || "All"}
          initialTemplate={initialTemplate}
          initialQuery={resolvedParams.q || ""}
        />
      </main>
    </div>
  );
}
