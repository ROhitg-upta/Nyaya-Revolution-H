"use client";

import Link from "next/link";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { INITIAL_COMMUNITY_STORIES } from "@/constants/community";
import { ArrowRight, CheckCircle2, PlusCircle, Users } from "@/lib/icons";

export function CommunityShowcaseSection() {
  const publishedStories = INITIAL_COMMUNITY_STORIES.filter(
    (s) => s.moderationStatus === "published" && s.visibility === "public"
  ).slice(0, 3);

  return (
    <Section id="community-showcase">
      <SectionHeading
        eyebrow="Community voice & shared experience"
        title="Real Citizens, Real Outcomes"
        description="Learn from how fellow citizens handled landlords, cyber scammers, defective products, and police interactions. Experiences shared to help you recognize situations earlier."
      />

      {publishedStories.length === 0 ? (
        <div className="glass mx-auto mt-12 max-w-xl rounded-3xl p-10 text-center">
          <Users className="text-brand mx-auto size-10 opacity-70" />
          <h3 className="text-foreground mt-4 text-lg font-bold">
            Be the First to Share Your Experience
          </h3>
          <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
            Your experience could help someone else recognize the situation earlier and act within the statutory window.
          </p>
          <div className="mt-6">
            <Link
              href="/community/share"
              className="bg-gradient-brand text-primary-foreground inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold"
            >
              <PlusCircle className="size-4" /> Share Your Story
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {publishedStories.map((story, index) => (
            <Reveal key={story.id} delay={index * 0.07} className="h-full">
              <Link
                href={`/community/stories/${story.slug}`}
                className="focus-visible:ring-ring group/card block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="glass glow-hover relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        {story.categoryLabel}
                      </Badge>
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                        <CheckCircle2 className="size-3.5" />
                        Outcome Verified
                      </span>
                    </div>

                    <h3 className="text-foreground group-hover:text-brand mt-3 text-base font-bold leading-snug transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 line-clamp-3 text-xs leading-relaxed">
                      &ldquo;{story.whatHappened}&rdquo;
                    </p>
                  </div>

                  <div className="border-border/40 border-t pt-3">
                    <p className="text-brand line-clamp-1 text-[11px] font-semibold">
                      Takeaway: {story.citizenTakeaway}
                    </p>
                    <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                      <span>Shared by {story.authorName}</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover/card:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      {/* Share CTA banner */}
      <div className="border-border/60 bg-muted/20 mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:px-8">
        <div>
          <h4 className="text-foreground text-sm font-bold">
            Have you resolved a dispute or exercised your rights?
          </h4>
          <p className="text-muted-foreground text-xs">
            Help other citizens by sharing your journey through our privacy-redacted 7-step studio.
          </p>
        </div>
        <Link
          href="/community/share"
          className="bg-gradient-brand text-primary-foreground shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm"
        >
          Share Your Story →
        </Link>
      </div>
    </Section>
  );
}
