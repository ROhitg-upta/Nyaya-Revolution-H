import Link from "next/link";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { routes, siteConfig } from "@/constants";
import {
  Compass,
  Scale,
  ShieldCheck,
  Sparkles,
} from "@/lib/icons";

const FOOTER_GROUPS = [
  {
    title: "Situations & Triage",
    links: [
      { label: "What Happened? (60+ Issues)", href: routes.situations },
      { label: "Cyber & UPI Scams (1930)", href: "/situations/upi-fraud" },
      { label: "Tenant Deposit Disputes", href: "/situations/pg-deposit-refusal" },
      { label: "Police Refusing FIR (BNSS)", href: "/situations/police-complaint-fir" },
      { label: "Submit New Situation", href: routes.situationsSubmit },
    ],
  },
  {
    title: "Learning Academy",
    links: [
      { label: "All Guided Journeys", href: routes.learn },
      { label: "Cyber Safety & Digital Rights", href: "/learn/cyber-safety" },
      { label: "Student & Campus Rights", href: "/learn/student-rights" },
      { label: "Interactive Scenarios", href: routes.scenarios },
      { label: "Learner Profile & Certificates", href: routes.learnProfile },
    ],
  },
  {
    title: "Legal Knowledge Graph",
    links: [
      { label: "Constitutional Articles & Acts", href: routes.laws },
      { label: "Article 21 (Life & Privacy)", href: "/laws/article-21-protection-of-life-and-personal-liberty" },
      { label: "Supreme Court Precedents", href: routes.caseStudies },
      { label: "Citizen Legal Glossary", href: routes.glossary },
      { label: "Universal Search Engine", href: routes.search },
    ],
  },
  {
    title: "Action & Case Prep",
    links: [
      { label: "Action Center & Voice Studio", href: routes.actionCenter },
      { label: "Verified DLSA Directory", href: routes.actionCenter },
      { label: "Private Case Prep Workspace", href: routes.casePrep },
      { label: "Multi-Docket Case Binder", href: "/action-center/binder" },
      { label: "Grounded Nyaya AI Companion", href: routes.ai },
    ],
  },
  {
    title: "Community & Trust",
    links: [
      { label: "Community Citizen Stories", href: routes.community },
      { label: "Share Your Story Studio", href: routes.communityShare },
      { label: "Authority Governance Console", href: routes.moderation },
      { label: "Verified Outcomes & Impact", href: "/impact" },
      { label: "Platform Analytics", href: routes.analytics },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-border/60 border-t">
      {/* High-Impact Closing CTA */}
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <Reveal className="bg-gradient-brand glow-brand relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-center shadow-2xl sm:px-16 sm:py-20">
          {/* Overlays */}
          <div
            aria-hidden="true"
            className="bg-grid mask-radial absolute inset-0 opacity-20"
          />
          <div
            aria-hidden="true"
            className="absolute -right-20 -bottom-20 size-80 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -top-20 -left-20 size-80 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
              <Sparkles className="size-3.5" /> Free &amp; Open Access for Every Indian Citizen
            </span>

            <h2 className="text-primary-foreground text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
              Know your rights. Prepare your case. Stand confident.
            </h2>

            <p className="text-primary-foreground/90 max-w-xl text-sm leading-relaxed sm:text-base">
              Whether you are dealing with an unauthorized UPI debit, a withheld security deposit, or understanding constitutional freedoms, Nyaya Revolution gives you clear direction.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={routes.situations}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="glow-hover rounded-full px-7 font-bold shadow-lg"
                >
                  <Compass className="size-4" />
                  What Happened? (Triage)
                </Button>
              </Link>
              <Link href={routes.ai}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20 rounded-full px-6 font-semibold backdrop-blur-sm"
                >
                  <Sparkles className="size-4" />
                  Ask Nyaya AI
                </Button>
              </Link>
              <Link href={routes.learn}>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/15 rounded-full px-5 text-xs font-semibold"
                >
                  Start Learning →
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Main Footer Links */}
      <div className="border-border/60 border-t bg-muted/10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-5 py-14 sm:px-8 md:grid-cols-6 lg:grid-cols-6">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-brand glow-brand text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                <Scale className="size-4.5" />
              </span>
              <span className="text-foreground text-base font-extrabold tracking-tight">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Situation-first legal awareness, learning, AI, and citizen-action platform for India.
            </p>
            <div className="text-muted-foreground text-xs flex items-center gap-1.5 font-medium">
              <ShieldCheck className="text-brand size-3.5" />
              Verified &amp; Privacy-First
            </div>
          </div>

          {/* Nav Categories */}
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-2.5">
              <h3 className="text-foreground text-xs font-bold uppercase tracking-wider">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Legal Disclaimer */}
      <div className="border-border/60 border-t bg-background/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-muted-foreground text-xs leading-relaxed">
            © {new Date().getFullYear()} {siteConfig.name}. Educational and case preparation content only — not formal courtroom representation or legal advice. Consult a certified advocate or your local DLSA for specific dispute representation.
          </p>
          <p className="text-muted-foreground/80 shrink-0 text-xs">
            Made for every citizen · India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
