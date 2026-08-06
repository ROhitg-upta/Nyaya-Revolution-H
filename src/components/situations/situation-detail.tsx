"use client";

import { ActionChecklist } from "@/components/situations/action-checklist";
import { EmergencyCard } from "@/components/situations/emergency-card";
import { LawCard } from "@/components/situations/law-card";
import { LearningPathCard } from "@/components/situations/learning-path-card";
import { PlaceholderAction } from "@/components/situations/placeholder-action";
import { PointList } from "@/components/situations/point-list";
import { SectionBlock } from "@/components/situations/section-block";
import { Timeline } from "@/components/situations/timeline";
import {
  getCategory,
  getSituation,
  learningFlow,
  routes,
  situationDisclaimer,
} from "@/constants";
import {
  ArrowLeft,
  Ban,
  ClipboardCheck,
  Download,
  FileText,
  Info,
  Landmark,
  ListChecks,
  MapPin,
  Scale,
  ShieldCheck,
  Siren,
} from "@/lib/icons";

export function SituationDetail({ slug }: { slug: string }) {
  const situation = getSituation(slug);
  if (!situation) return null;
  const category = getCategory(situation.category);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      <a
        href={routes.situations}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" />
        All situations
      </a>

      {/* Header */}
      <header className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="bg-brand/20 pointer-events-none absolute -top-20 -right-10 size-72 rounded-full blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-brand text-primary-foreground glow-brand flex size-12 items-center justify-center rounded-2xl">
              <situation.icon className="size-6" />
            </span>
            {category ? (
              <span className="text-brand bg-brand/10 rounded-full px-3 py-1 text-xs font-semibold">
                {category.title}
              </span>
            ) : null}
          </div>
          <h1 className="text-foreground max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {situation.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg">
            {situation.summary}
          </p>
        </div>
      </header>

      {/* Learning flow */}
      <section className="mt-14">
        <div className="mb-8 text-center">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Your learning journey
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            From understanding your situation to taking confident action.
          </p>
        </div>
        <Timeline steps={learningFlow} />
      </section>

      {/* Content grid */}
      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <SectionBlock icon={Info} title="Situation summary">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {situation.summary}
            </p>
          </SectionBlock>

          <SectionBlock icon={ShieldCheck} title="Your rights">
            <PointList items={situation.rights} tone="positive" />
          </SectionBlock>

          <SectionBlock icon={Scale} title="Applicable laws">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {situation.laws.map((law) => (
                <LawCard key={law.name} law={law} />
              ))}
            </div>
          </SectionBlock>

          <SectionBlock icon={ListChecks} title="Immediate actions">
            <ActionChecklist items={situation.immediateActions} />
          </SectionBlock>

          <SectionBlock icon={Ban} title="What NOT to do" tone="danger">
            <PointList items={situation.dontDo} tone="danger" />
          </SectionBlock>

          <SectionBlock icon={FileText} title="Documents required">
            <ActionChecklist items={situation.documents} />
          </SectionBlock>

          <SectionBlock icon={Landmark} title="Authorities to contact">
            <ul className="flex flex-col gap-3">
              {situation.authorities.map((authority) => (
                <li
                  key={authority.name}
                  className="glass flex flex-col gap-1 rounded-xl p-4"
                >
                  <span className="text-foreground text-sm font-semibold">
                    {authority.name}
                  </span>
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {authority.description}
                  </span>
                </li>
              ))}
            </ul>
          </SectionBlock>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <SectionBlock icon={Siren} title="Emergency numbers" tone="danger">
            <div className="flex flex-col gap-2.5">
              {situation.emergency.map((contact) => (
                <EmergencyCard key={contact.label} contact={contact} />
              ))}
            </div>
          </SectionBlock>

          <div className="flex flex-col gap-2.5">
            <PlaceholderAction
              icon={MapPin}
              title="Nearby police station"
              description="Find the closest station on a map."
            />
            <PlaceholderAction
              icon={Download}
              title="Download checklist"
              description="Get this as a printable PDF."
            />
            <PlaceholderAction
              icon={Scale}
              title="Need a lawyer?"
              description="Connect with a verified professional."
            />
          </div>

          <LearningPathCard
            icon={ClipboardCheck}
            eyebrow="Learn"
            title={situation.learningPath.title}
            meta={`${situation.learningPath.lessons} lessons · ${situation.learningPath.duration}`}
            actionLabel="Start learning path"
          />
          <LearningPathCard
            icon={ClipboardCheck}
            eyebrow="Test yourself"
            title={situation.quiz.title}
            meta={`${situation.quiz.questions} questions · ${situation.quiz.minutes} min`}
            actionLabel="Take the quiz"
          />
        </aside>
      </div>

      <p className="text-muted-foreground/60 mt-12 text-center text-xs">
        {situationDisclaimer}
      </p>
    </div>
  );
}
